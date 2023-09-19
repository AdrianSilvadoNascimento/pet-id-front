import { Injectable } from '@angular/core'
import { CanActivate, Router } from '@angular/router'

@Injectable({
  providedIn: 'root',
})
export class AddPetGuard implements CanActivate {
  constructor(private router: Router) {}
  
  canActivate(): boolean {
    const plan = localStorage.getItem('plan')
    const petQuantity = localStorage.getItem('petQuantity')
    if (plan?.length && petQuantity?.length) {
      if (plan === 'silver' && petQuantity === '5') {
        this.router.navigate(['/buy-a-plan'])
        return false
      } else if (plan === 'bronze' && petQuantity === '2') {
        this.router.navigate(['/buy-a-plan'])
        return false
      } else if (!plan) {
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
