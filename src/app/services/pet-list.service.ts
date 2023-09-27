import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PetModel } from 'src/app/models/pet-model';

@Injectable({
  providedIn: 'root'
})
export class PetListService {
  private petListSubject = new BehaviorSubject<PetModel[]>([]);
  petList$ = this.petListSubject.asObservable();

  updatePetList(petList: PetModel[]) {
    this.petListSubject.next(petList);
  }
}
