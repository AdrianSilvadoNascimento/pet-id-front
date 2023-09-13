import { Injectable } from '@angular/core'
import { CanActivate, Router } from '@angular/router'

@Injectable({
  providedIn: 'root',
})
export class AddPetGuard implements CanActivate {
  constructor(private router: Router) {}
  
  canActivate(): boolean {
    const canAddPet = JSON.parse(localStorage.getItem('userPayInfo')!)

    if (canAddPet) {
      if (canAddPet.plan === 'silver' && canAddPet.petQuantity === 5) {
        this.router.navigate(['/buy-a-plan'])
        return false
      } else if (canAddPet.plan === 'bronze' && canAddPet.petQuantity === 2) {
        this.router.navigate(['/buy-a-plan'])
        return false
      } else if (!canAddPet.plan) {
        this.router.navigate(['/buy-a-plan'])
        return false
      }

      return true
    } else {
      this.router.navigate(['/buy-a-plan'])
      return false
    }
  }
}
