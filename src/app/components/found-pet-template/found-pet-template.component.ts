import { AfterViewInit, Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { SafeUrl } from '@angular/platform-browser'
import { MatStepper } from '@angular/material/stepper'
import { ViewChild } from '@angular/core'


import { faCamera } from '@fortawesome/free-solid-svg-icons'
import { MapService } from '../../services/map-service.service'
import { PetFoundModel } from 'src/app/models/found-pet-model'
import { PetService } from 'src/app/services/pet-service.service'

@Component({
  selector: 'app-found-pet-template',
  templateUrl: './found-pet-template.component.html',
  styleUrls: ['./found-pet-template.component.scss'],
})
export class FoundPetTemplateComponent implements OnInit, AfterViewInit {
  @ViewChild('stepper') stepper!: MatStepper
  index: number = 0
  formFoundPet: FormGroup = new FormGroup({})
  formFoundPetImage: FormGroup = new FormGroup({})
  address: any
  selectedImage!: File
  showSelectedImage: string | ArrayBuffer | SafeUrl | null = null
  maxImageSize: number = 5
  errorMessage: string | null = null
  faCamera = faCamera

  constructor(
    private mapService: MapService,
    private formBuilder: FormBuilder,
    private petService: PetService
  ) {}

  ngOnInit(): void {
    this.createForm(new PetFoundModel)
  }

  ngAfterViewInit(): void {
    
    setTimeout(() => {
      this.mapService.initializeMap('addressMap')
      this.mapService.searchControlForAddressAndCoords()

      this.mapService.getAddress().subscribe(address => {
        this.address = address
      })
    })
  }

  /**
   * To register a new found pet.
   */
  onSubmit() {
    const PET = new PetFoundModel()
    PET.geo = `${this.address[1].lat}:${this.address[1].lng}`
    
    this.petService.registerFoundPet(PET, this.selectedImage)
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
   * To reset the found pet form.
   */
  resetForm(): void {
    this.createForm(new PetFoundModel)
    this.stepper.reset()
  }

  /**
   * To create the pet form.
   * 
   * @param {PetFoundModel} petModel - Pet Model.
   */
  createForm(petModel: PetFoundModel): void {
    this.formFoundPet = this.formBuilder.group({
      id: [null],
      gender: [petModel.gender, Validators.required],
      geo: [null],
      petImage: [null, Validators.required],
    })
  }

  /**
   * To exclude the pet image.
   */
  excludeImage() {
    this.showSelectedImage = null
  }
}
