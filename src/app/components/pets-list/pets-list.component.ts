import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core'

import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { PetModel } from 'src/app/models/pet-model'
import { PetService } from 'src/app/services/pet-service.service'
import { PetListService } from 'src/app/services/pet-list.service'

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
  
  constructor(
    private petService: PetService,
    private petListService: PetListService) {}

  ngOnInit(): void {
    this.petService.getPetList().subscribe(petList => {
      this.petListService.updatePetList(petList)
    })
  }

  addLostPet(petId: string) {
    this.selectedPetId = this.selectedPetId === petId ? '' : petId
    this.lostPet.emit(this.selectedPetId)
  }

  removePet(petId: string) {
    const isDeleting = confirm('Seu pet foi encontrado ou cadastrou errado?')

    if (isDeleting) {
      this.petService.removeLostPet(petId).subscribe(() => {
        alert('Que bom que seu pet está em casa!')
        // Fetch the updated pet list after removal
        this.petService.getPetList().subscribe(petList => {
          this.petListService.updatePetList(petList)
        })
      }, () => {
        alert('Ocorreu algum problema!');
      })
    }
  }
}
