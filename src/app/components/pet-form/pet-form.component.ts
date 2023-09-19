import { Component, OnInit, ViewChild, ElementRef } from '@angular/core'
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms'
import { DomSanitizer, SafeUrl } from '@angular/platform-browser'
import { ActivatedRoute, Router } from '@angular/router'

import { faCamera, faPlus, faXmark, faInfo } from '@fortawesome/free-solid-svg-icons'
import { PetModel } from '../../models/pet-model'
import { ImageConversionService } from '../../services/convert-image.service'
import { PetService } from '../../services/pet-service.service'
import { racaOptions } from '../../models/raca-mode'

declare global {
  interface Window {
    ImageCapture: any,
  }
}

@Component({
  selector: 'app-pet-form',
  templateUrl: './pet-form.component.html',
  styleUrls: ['./pet-form.component.scss'],
})
export class PetFormComponent implements OnInit {
  @ViewChild('videoElement') videoElement!: ElementRef
  private stream!: MediaStream
  private imageCapture!: any
  private photoData: Uint8Array | null = null
  formPet: FormGroup = new FormGroup({});
  selectedImage!: File
  selectedDistantImage!: File
  showSelectedImage: string | ArrayBuffer | SafeUrl | null = null
  showSelectedDistantImage: string | ArrayBuffer | SafeUrl | null = null
  maxImageSize: number = 5
  errorMessage: string | null = null
  genderOptions: { html: string, value: string }[] = [
    { html: 'Fêmea', value: 'Fêmea' },
    { html: 'Macho', value: 'Macho' },
  ]
  options: { html: string, value: string }[] = [
    { html: 'Sim', value: 'Sim' },
    { html: 'Não', value: 'Não' },
  ]
  racaOptions = racaOptions
  faCamera = faCamera
  faPlus = faPlus
  faXMark = faXmark
  faInfo = faInfo
  petId: string = ''
  petInfo!: PetModel
  saveButton: string = 'Cadastrar'
  showVideo: boolean = true
  showButtonTakePhoto: boolean = false
  filteredRacaOptions: string[] = []

  constructor(
    private petService: PetService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private sanitizer: DomSanitizer,
    private imageConversor: ImageConversionService
  ) { }

  ngOnInit(): void {
    this.createForm(new PetModel)
    this.activatedRoute.params.subscribe(param => {
      this.petId = param['id']
    })

    this.filteredRacaOptions = [...this.racaOptions]

    if (this.petId) {
      this.saveButton = 'Salvar'

      this.petService.getPet(this.petId).subscribe(res => {
        this.petInfo = res

        this.formPet.patchValue({
          id: [null],
          name: this.petInfo.name,
          breed: this.petInfo.breed,
          age: this.petInfo.age,
          gender: this.petInfo.gender,
          isDocile: this.petInfo.isDocile,
          isInHome: this.petInfo.isInHome,
          userId: [null],
        })
        this.showSelectedImage = this.petInfo.petImage
        const imageFile = new File([this.petInfo.petImage], 'pet-image.jpg', { type: 'image/jpeg' })
        const distantImageFile = new File([this.petInfo.petImageDistant], 'pet-image.jpg', { type: 'image/jpeg' })
        this.selectedImage = imageFile
        this.selectedDistantImage = distantImageFile
      })
    }
  }

  /**
   * The value to search.
   * 
   * @param event The value.
   */
  onSearchInputChange(event: any): void {
    if (event.target.value) {
      this.filteredRacaOptions = this.filterRacaOptions(event.target.value)
    }
  }

  /**
   * To filter the raça options.
   * 
   * @param value The value to search.
   * @returns the arrays of values filtered.
   */
  filterRacaOptions(value: string): string[] {
    return this.racaOptions.filter(opt =>
      opt.toLocaleLowerCase().trim().includes(value.toLocaleLowerCase())
    )
  }

  /**
   * To init the camera.
   */
  async initCamera() {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ video: true })
      this.videoElement.nativeElement.srcObject = this.stream
      const track = this.stream.getVideoTracks()[0]
      this.imageCapture = new window.ImageCapture(track)
      const videoElement = this.videoElement.nativeElement;
      videoElement.style.transform = 'scaleX(-1)'
      this.showButtonTakePhoto = true
    } catch (error) {
      console.error('Error', error)
    }
  }

  /**
   * To close the camera.
   */
  closeCamera() {
    this.showVideo = this.showButtonTakePhoto = false

    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop())
    }
  }

  /**
   * To take the photo.
   */
  async takePhoto() {
    try {
      const photo = await this.imageCapture.takePhoto();
      const photoData = await photo.arrayBuffer();
      this.photoData = new Uint8Array(photoData);

      this.showSelectedImage = this.getPhotoUrl();
      this.showVideo = false;
      this.showButtonTakePhoto = false;
      setTimeout(() => {
        this.showVideo = true;
      }, 1000);
    } catch (error) {
      console.error('Erro ao tirar a foto:', error);
    }
  }

  /**
   * To format the photo url.
   * 
   * @returns The formatted photo.
   */
  getPhotoUrl(): SafeUrl | null {
    if (this.photoData) {
      const blob = new Blob([this.photoData], { type: 'image/jpeg' })
      return this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(blob))
    }
    return null
  }

  /**
   * To define which route to return.
   */
  return() {
    if (this.petId?.length) {
      this.router.navigate([`info-pet/${this.petId}`])
    } else {
      this.router.navigate(['/'])
    }
  }

  /**
   * To send the pet model to register.
   */
  async onSubmit() {
    const PET: PetModel = this.formPet.value

    const selectedImage = await this.imageConversor.convertToBase64(this.selectedImage)
    const selectedDistantImage = await this.imageConversor.convertToBase64(this.selectedDistantImage)
  
    if (this.petId) {
      this.petService.updatePet(PET, selectedImage, selectedDistantImage, this.petId).subscribe(() => {
        this.excludeImage()
        this.createForm(new PetModel())
        alert('Pet atualizado com sucesso!')
      }, err => {
        alert(err.error.message)
      })
    } else {
      this.petService.registerPet(PET, selectedImage, selectedDistantImage).subscribe(() => {
        this.excludeImage()
        this.createForm(new PetModel())
        alert('Pet registrado com sucesso!')
      }, err => {
        alert(err.error.message)
      })
    }
  }

  /**
   * To select an image.
   * 
   * @param event Event.
   */
  onFileSelected(event: any): void {
    const file: File = event.target.files[0]

    if (file) {
      if (file.size > this.maxImageSize * 1024 * 1024) {
        this.errorMessage = 'A imagem selecionada excede o tamanho máximo permitido.'
        this.showSelectedImage = null
      } else {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => {
          this.selectedImage = file
          this.showSelectedImage = reader.result
          this.errorMessage = null
        }
      }
    }
  }

  /**
   * To select the distant pet image.
   * 
   * @param event Event.
   */
  onDistantImageSelected(event: any): void {
    const file: File = event.target.files[0]
  
    if (file) {
      if (file.size > this.maxImageSize * 1024 * 1024) {
        this.errorMessage = 'A imagem selecionada excede o tamanho máximo permitido.'
        this.showSelectedDistantImage = null
      } else if (this.selectedImage && file.name === this.selectedImage.name) {
        this.errorMessage = 'A imagem não pode ser igual à anterior.'
        this.showSelectedDistantImage = null
      } else {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => {
          this.selectedDistantImage = file
          this.showSelectedDistantImage = reader.result
          this.errorMessage = null
        }
      }
    }
  }
  

  /**
   * To change the image selected.
   */
  onChangeImageClick(): void {
    const inputElement = document.getElementById('petImage')
    if (inputElement) {
      inputElement.click()
    }
  }

  /**
   * To exclude the selected image.
   */
  excludeImage(isSecond: boolean = false) {
    if (isSecond) {
      this.showSelectedDistantImage = null
    } else {
      this.showSelectedImage = null
    }
  }

  /**
   * To create the pet form.
   * 
   * @param {PetModel} petModel - Pet Model.
   */
  createForm(petModel: PetModel): void {
    this.formPet = this.formBuilder.group({
      id: [null],
      name: [petModel.name, Validators.required],
      breed: [petModel.breed, Validators.required],
      age: [petModel.age, [Validators.required, this.ageValidator]],
      gender: [petModel.gender, Validators.required],
      isDocile: [petModel.isDocile, Validators.required],
      isInHome: [petModel.isInHome, Validators.required],
      petImage: [null, Validators.required],
      petImageDistant: [null, [Validators.required]],
      userId: [null],
    })
  }

  /**
   * To validate the pet age.
   * 
   * @param control Control
   * @returns {[key: string]: any} | null
   */
  ageValidator(control: AbstractControl): { [key: string]: any } | null {
    const value = control.value;
    if (isNaN(value) || value < 0 || value > 30) {
      return { 'invalidAge': true }
    }
    return null
  }
}
