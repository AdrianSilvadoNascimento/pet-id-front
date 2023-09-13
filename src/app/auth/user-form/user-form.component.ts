import { AfterViewInit, Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms'

import { faCamera } from '@fortawesome/free-solid-svg-icons'
import { UserModel } from '../../models/user-model'
import { MapService } from '../../services/map-service.service'
import { UserService } from '../../services/user-service.service'
import { ImageConversionService } from '../../services/convert-image.service'

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
})
export class UserFormComponent implements OnInit, AfterViewInit {
  formUser: FormGroup = new FormGroup({})
  formUserAddress: FormGroup = new FormGroup({})
  selectedImage: string | ArrayBuffer | null = null
  perfilImage!: File
  maxImageSize: number = 5
  errorMessage: string | null = null
  canRegisterAddress: boolean = false
  faCamera = faCamera
  address: any
  differentPasswords: boolean = false

  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder,
    private mapService: MapService,
    private imageConversor: ImageConversionService
  ) { }

  ngOnInit(): void {
    this.createForm(new UserModel())
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.mapService.initializeMap('addressMap')
      this.mapService.searchControlForAddressAndCoords()

      this.mapService.getAddress().subscribe(address => {
        this.address = address
        this.populateForm()
      })
    })
  }

  /**
   * Send the user infos and reset the form.
   */
  async onSubmit() {
    if (this.formUser?.valid) {
      const USER = this.formUser?.value
      USER.coords = `${this.address[1].lat}:${this.address[1].lng}`

      // USER.perfil_img = await this.imageConversor.convertToBase64(this.perfilImage)

      this.userService.registerUser(USER).subscribe(() => {
        console.log('Registrado com sucesso')
      })
    }
  }

  /**
   * Possible to select and see the image selected.
   * 
   * @param {any} event - Event
   */
  onFileSelected(event: any): void {
    const file: File = event.target.files[0]

    if (file) {
      if (file.size > this.maxImageSize * 1024 * 1024) {
        this.errorMessage = 'A imagem selecionada excede o tamanho máximo permitido.'
        this.selectedImage = null
      } else {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => {
          this.selectedImage = reader.result
          this.perfilImage = file
          this.errorMessage = null
        }
      }
    }
  }

  /**
   * To change the image selected.
   */
  onChangeImageClick(): void {
    const inputElement = document.getElementById('perfil_img')
    if (inputElement) {
      inputElement.click()
    }
  }

  /**
   * Exclude the selected image.
   */
  excludeImage(): void {
    this.selectedImage = null
  }

  /**
   * To create the user form.
   * 
   * @param userModel User Model.
   */
  createForm(userModel: UserModel): void {
    this.formUser = this.formBuilder.group({
      name: [userModel.name, Validators.required],
      last_name: [userModel.last_name, Validators.required],
      cpf: [userModel.cpf, [Validators.required]],
      age: [userModel.age, Validators.required],
      phone_number: [userModel.phone_number, [Validators.required, Validators.pattern(/^\d{10,}$/)]],
      email: [userModel.email, [
        Validators.required,
        Validators.email,
        Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/),
      ]],
      // perfil_img: [userModel.perfil_img],
      password: [userModel.password, Validators.required],
      confirm_password: [userModel.confirm_password, Validators.required],
      coords: [null],
      city: [userModel.city, Validators.required],
      cep_number: [userModel.cep_number, Validators.required],
      house_number: [userModel.house_number, Validators.required],
      street_name: [userModel.street_name, Validators.required],
      complement: [userModel.complement],
      neighborhood: [userModel.neighborhood, Validators.required],
      uf: [userModel.uf, Validators.required],
    })
  }

  /**
   * To validate the cpf.
   * 
   * @param {string} cpfInput The cpf value.
   */
  validateCpf(cpfInput: HTMLInputElement): void {
    const cpf = cpfInput.value
  
    if (!cpf || cpf == '00000000000' || !this.isValidCpf(cpf)) {
      this.formUser.get('cpf')?.setErrors({ invalidCpf: true })
    } else {
      this.formUser.get('cpf')?.setErrors(null) // Limpa o erro se o CPF for válido
    }
  }
  
  /**
   * Check if a CPF is valid.
   * 
   * @param {string} cpf CPF to validate.
   * @returns {boolean} True if valid, false otherwise.
   */
  isValidCpf(cpf: string): boolean {
    const cpfNumbers = cpf.replace(/[^\d]+/g, '')
  
    if (cpfNumbers.length !== 11 || /^(.)\1+$/.test(cpfNumbers)) {
      return false
    }
  
    let sum = 0
    let remainder
  
    for (let i = 1; i <= 9; i++) {
      sum += parseInt(cpfNumbers.substring(i - 1, i)) * (11 - i)
    }
  
    remainder = (sum * 10) % 11
  
    if (remainder === 10 || remainder === 11) {
      remainder = 0
    }
  
    if (remainder !== parseInt(cpfNumbers.substring(9, 10))) {
      return false
    }
  
    sum = 0
    for (let i = 1; i <= 10; i++) {
      sum += parseInt(cpfNumbers.substring(i - 1, i)) * (12 - i)
    }
  
    remainder = (sum * 10) % 11
  
    if (remainder === 10 || remainder === 11) {
      remainder = 0
    }
  
    if (remainder !== parseInt(cpfNumbers.substring(10, 11))) {
      return false
    }
  
    return true
  }

  /**
   * To initiate the form.
   * 
   * @param {AddressModel} addressModel Addres Model.
   */
  // createAddressForm(addressModel: AddressModel): void {
  //   this.formUserAddress = this.formBuilder.group({
  //     street_name: [addressModel.street_name],
  //     house_number: [addressModel.house_number],
  //     city: [addressModel.city],
  //     complement: [addressModel.complement],
  //     cep_number: [addressModel.cep_number],
  //   })
  // }

  /**
   * Populate the form when the user search for an address.
   */
  populateForm(): void {
    if (!this.address) {
      return
    }
    this.formUser.patchValue({
      street_name: this.address[0].road,
      house_number: this.address[0].house_number,
      city: this.address[0].city,
      cep_number: this.address[0].postcode,
      bairro: this.address[0].suburb,
      uf: this.address[0].state,
    })
  }

  /**
   * Check if passwords match.
   * 
   * @param formGroup Form.
   * @returns ValidationErrors | null.
   */
  passwordMatchValidator(passwordInput: HTMLInputElement, confirmPasswordInput: HTMLInputElement): void {
    const password = passwordInput.value;
    const confirm_password = confirmPasswordInput.value;
  
    if (password !== confirm_password) {
      this.formUser.get('confirm_password')?.setErrors({ passwordMismatch: true });
    } else {
      this.formUser.get('confirm_password')?.setErrors(null);
    }
  
    if (!/(?=.*[!@#$%^&*])/.test(password)) {
      this.formUser.get('password')?.setErrors({ missingSpecialChar: true });
    } else {
      this.formUser.get('password')?.setErrors(null);
    }
  
    if (password.length < 6) {
      this.formUser.get('password')?.setErrors({ minLength: true });
    } else {
      this.formUser.get('password')?.setErrors(null);
    }
  }  
}
