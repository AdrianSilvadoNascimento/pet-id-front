import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'

import { AngularMaterialModule } from '../angular-material.module'

import { UserLoginComponent } from './user-login/user-login.component'
import { UserFormComponent } from './user-form/user-form.component'

@NgModule({
  declarations: [
    UserLoginComponent,
    UserFormComponent,
  ],
  imports: [
    CommonModule,
    FontAwesomeModule,
    AngularMaterialModule,
    RouterModule.forChild([
      { path: 'user-login', component: UserLoginComponent, data: { isShowHeader: true } },
      { path: 'user-register', component: UserFormComponent, data: { isShowHeader: true } },
    ]),
    FormsModule,
    ReactiveFormsModule,
  ],
})

export class AuthModule {}