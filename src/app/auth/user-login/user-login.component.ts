import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'

import { UserLoginModel } from '../../models/user-login-model'
import { UserService } from '../../services/user-service.service'
import { Router } from '@angular/router'

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.scss'],
})
export class UserLoginComponent implements OnInit {
  loginForm: FormGroup = new FormGroup({})
  
  constructor(
    private formBuilder: FormBuilder, 
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.createForm(new UserLoginModel)
  }

  /**
   * To send the login request.
   */
  onSubmit(): void {
    const userLogin = {
      email: this.loginForm.get('email')?.value,
      password: this.loginForm.get('password')?.value,
    }
    
    this.userService.loginUser(userLogin).subscribe(() => {
      alert('Bem vindo')
    }, err => {
      alert('Tente novamente')
    })
  }
  
  /**
   * Initiate the login form.
   * 
   * @param user User Login Model.
   */
  createForm(user: UserLoginModel) {
    this.loginForm = this.formBuilder.group({
      email: [user.email, Validators.required],
      password: [user.password, Validators.required],
    })
  }
}
