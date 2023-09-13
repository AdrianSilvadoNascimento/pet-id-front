import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core'

import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { AllPets } from '../../models/all-pets-model'
import { PetModel } from 'src/app/models/pet-model'

@Component({
  selector: 'app-pets-list',
  templateUrl: './pets-list.component.html',
  styleUrls: ['./pets-list.component.scss'],
})
export class PetsListComponent implements OnInit {
  @Input() listType: string = ''
  @Input() petList: PetModel[] = []
  @Input() isUserPets: boolean = false
  @Input() showAddButton: boolean = false
  @Output() lostPet = new EventEmitter
  faPlus = faPlus
  selectedPetId: string = ''
  
  constructor() {}

  ngOnInit(): void {
  }

  addLostPet(petId: string) {
    this.selectedPetId = this.selectedPetId === petId ? '' : petId
    this.lostPet.emit(this.selectedPetId)
  }
}
