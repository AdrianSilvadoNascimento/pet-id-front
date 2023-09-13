import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, tap } from 'rxjs'
import { Router } from '@angular/router'

import { environment } from 'src/environments/environment'
import { PetModel } from '../models/pet-model'

@Injectable({
  providedIn: 'root',
})
export class PetService {
  private readonly URL = environment.URL
  
  constructor(private http: HttpClient, private router: Router) {}

  /**
   * To register a new pet.
   * 
   * @param petModel PetModel.
   * @param petImage The selected pet image.
   * @returns PetModel list.
   */
  registerPet(petModel: PetModel, petImage: string, petImageDistant: string) {
    const url = `${this.URL}/pet/register-pet/${localStorage.getItem('userId')}`
    const body = {
      name: petModel.name,
      age: petModel.age,
      breed: petModel.breed,
      gender: petModel.gender,
      isInHome: 'sim',
      isDocile: petModel.isDocile,
      petImage: petImage,
      petImageDistant: petImageDistant,
    }
    
    return this.http.post(url, body).pipe(tap(() => {
      this.router.navigate(['/'])
    }))
  }

  updatePet(petModel: PetModel, petImage: string, petImageDistant: string, petId: string): Observable<PetModel> {
    const url = `${this.URL}/pet/update-pet/${petId}`
    const body = {
      name: petModel.name,
      age: petModel.age,
      breed: petModel.breed,
      gender: petModel.gender,
      coords: localStorage.getItem('userGeo'),
      isInHome: petModel.isInHome,
      isDocile: petModel.isDocile,
      petImage: petImage,
      petImageDistant: petImageDistant,
    }

    return this.http.put<PetModel>(url, JSON.stringify(body)).pipe(tap(() => {
      this.router.navigate([`/info-pet/${petId}`])
    }))
  }

  /**
   * To register an lost pet.
   * 
   * @param lostPet - Lost Pet.
   */
  registerLostPet(lostPetId: string): Observable<PetModel> {
    const url = `${this.URL}/pet/update-pet/${lostPetId}`

    return this.http.put<PetModel>(url, { isInHome: 'Não' }).pipe(tap(() => {
      this.router.navigate(['/'])
    }))
  }

  /**
   * To register a found pet.
   * 
   * @param foundPet - Found Pet.
   */
  registerFoundPet(foundPet: any, foundPetImage: File) {
    const url = `${this.URL}/pet/found-pet`

    const formData = new FormData()
    formData.append('image', foundPetImage, foundPetImage?.name)
    
    const body = {
      raca: foundPet.raca,
      geo: foundPet.geo,
    }

    formData.append('data', JSON.stringify(body))

    return this.http.post(url, JSON.stringify(formData))
  }

  /**
   * To delete the pet.
   * 
   * @param petId Pet Id.
   * @returns the response.
   */
  deletePet(petId: string) {
    const url = `${this.URL}/pet/delete-pet/${petId}`

    return this.http.delete(url).pipe(tap(() => {
      this.router.navigate(['/'])
    }))
  }

  /**
   * To get the pet list.
   * 
   * @returns A list of Pets
   */
  getPetList(): Observable<PetModel[]> {
    const url = `${this.URL}/pet/get-pets/${localStorage.getItem('userId')}`
    
    return this.http.get<PetModel[]>(url).pipe(
      tap(res => {
        localStorage.setItem('petQuantity:', res.length.toString())
      })
    )
  }

  /**
   * To get an unique pet info.
   * 
   * @param petId PetId
   * @returns Unique PetModel
   */
  getPet(petId: string): Observable<PetModel> {
    const url = `${this.URL}/pet/get-pet/${petId}`

    return this.http.get<PetModel>(url)
  }
}
