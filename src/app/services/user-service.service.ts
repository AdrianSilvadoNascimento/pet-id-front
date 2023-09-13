import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable, map, tap } from 'rxjs'
import { Router } from '@angular/router'

import { environment } from 'src/environments/environment'
import { UserModel } from '../models/user-model'
import { UserInfo } from '../models/user-info-model'

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly URL = environment.URL
  token: string = ''
  userId: string = ''
  constructor(private http: HttpClient, private router: Router) {}

  /**
   * To register a new user.
   * 
   * @param {UserModel} userModel User Model.
   * @returns Response.
   */
  registerUser(userModel: UserModel): Observable<UserModel> {
    const url = `${this.URL}/user/register-user`

    const body = {...userModel }
    delete body.confirm_password

    return this.http.post<UserModel>(url, JSON.stringify(body)).pipe(
      tap(() => {
        this.router.navigate(['/user-login'])
      })
    )
  }

  /**
   * To login the user.
   * 
   * @param userLogin User credentials.
   * @returns userId.
   */
  loginUser(userLogin: { email: string, password: string }) {
    const url = `${this.URL}/user/login-user`

    return this.http.post(url, userLogin).pipe(
      tap((res: any) => {
        localStorage.setItem('userId', res.userId)
        localStorage.setItem('token', res.token)
        localStorage.setItem('user', res.userName)
        localStorage.setItem('plan', res.plan)
        this.router.navigate(['/'])
      })
    )
  }

  checkout(): void {
    localStorage.removeItem('userId')
    setTimeout(() => {
      this.router.navigate(['user-login'])
    }, 1500)
  }

  /**
   * To get the user info.
   * 
   * @returns User info.
   */
  getUserInfo(): Observable<UserModel> {
    const url = `${this.URL}/user/get-user/${localStorage.getItem('userId')}`

    return this.http.get<UserModel>(url).pipe(
      tap(res => {
        localStorage.setItem('userGeo', res.coords)
      })
    )
  }
}
