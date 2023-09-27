import { Component, OnInit } from '@angular/core'

import { MapService } from '../../services/map-service.service'
import { PetModel } from '../../models/pet-model'
import { PetListService } from 'src/app/services/pet-list.service'

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent implements OnInit {
  listPetInHome: PetModel[] = []
  listPetNotInHome: PetModel[] = []
  listUserPet: PetModel[] = []
  
  constructor(
    private mapService: MapService,
    private petListService: PetListService,
  ) {}
  
  ngOnInit(): void {
    this.petListService.petList$.subscribe(petList => {
      this.listUserPet = [...petList]
      this.listPetNotInHome = petList.map(pet => pet).filter(pet => pet.isInHome == 'Não')
    })
    
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
    this.petListService.updatePetList(this.listUserPet)
  }
}
