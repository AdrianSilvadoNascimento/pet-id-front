import { Injectable } from '@angular/core'

@Injectable()
export class AuthService {
  /**
   * To check if the user is loggedIn.
   * 
   * @returns Boolean
   */
  isLoggedIn(): boolean {
    const token = localStorage.getItem('userId')
    return token !== null;
  }
}
