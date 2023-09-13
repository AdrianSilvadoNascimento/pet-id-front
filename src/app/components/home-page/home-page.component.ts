import { Component, OnInit } from '@angular/core'

import { MapService } from '../../services/map-service.service'
import { PetModel } from '../../models/pet-model'
import { PetService } from '../../services/pet-service.service'
import { UserService } from '../../services/user-service.service'
import { AllPets } from '../../models/all-pets-model'

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent implements OnInit {
  listPetInHome: PetModel[] = []
  listPetNotInHome: PetModel[] = []
  listUserPet: PetModel[] = []
  
  constructor(private petService: PetService, private mapService: MapService) {}
  
  ngOnInit(): void {
    if (localStorage.getItem('userId')) {
      this.fetchPets()
    }
    this.mapService.initializeMap('map')
    this.mapService.addSearchControl()
  }

  /**
   * Fly to the current user position.
   */
  findMyPosition(): void {
    this.mapService.findMyPosition()
  }

  /**
   * Fetch Pets.
   */
  fetchPets(): void {
    this.petService.getPetList().subscribe(response => {
      this.listUserPet = [...response]
      this.listPetNotInHome = response.map(pet => pet).filter(pet => pet.isInHome)
    }, () => {
      alert('Ocorreu algum problema!')
    })
  }
}
