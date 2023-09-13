import { Component, OnInit } from '@angular/core'

import { MapService } from '../../services/map-service.service'
import { faInfo } from '@fortawesome/free-solid-svg-icons'
import { PetModel } from '../../models/pet-model'
import { PetService } from '../../services/pet-service.service'

@Component({
  selector: 'app-lost-pet-template',
  templateUrl: './lost-pet-template.component.html',
  styleUrls: ['./lost-pet-template.component.scss'],
})
export class LostPetTemplateComponent implements OnInit {
  lostPets: PetModel[] = []
  lostPet: PetModel[] = []
  address: any
  lostPetId!: string
  faInfo = faInfo

  constructor(
    private mapService: MapService, 
    private petService: PetService,
  ) {}

  ngOnInit(): void {
    this.mapService.initializeMap('lostPetMap')
    this.mapService.searchControlForAddressAndCoords()

    this.petService.getPetList().subscribe(res => {
      this.lostPets = [...res]
    })

    this.mapService.getAddress().subscribe(address => {
      this.address = address
    })
  }

  addLostPet(petId: string) {
    this.lostPetId = petId
  }

  submitLostPet() {
    this.petService.registerLostPet(this.lostPetId).subscribe(() => {
      console.log('Registrado!')
    })
  }
}
