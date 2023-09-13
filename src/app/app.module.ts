import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { ServiceWorkerModule } from '@angular/service-worker'
import { AppRoutingModule } from './app-routing.module'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpClientJsonpModule, HttpClientModule } from '@angular/common/http'

import { AuthModule } from './auth/auth.module'
import { AngularMaterialModule } from './angular-material.module'

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { NgxMaskModule, IConfig } from 'ngx-mask'

import { AppComponent } from './app.component'
import { environment } from '../environments/environment'
import { HomePageComponent } from './components/home-page/home-page.component'
import { HeaderComponent } from './core/header/header.component'
import { PetsListComponent } from './components/pets-list/pets-list.component'
import { PetFormComponent } from './components/pet-form/pet-form.component'
import { InfoPetComponent } from './components/info-pet/info-pet.component'
import { AuthService } from './auth/auth.service'
import { AuthGuard } from './auth/auth.guard'
import { ActionButtonsComponent } from './components/action-buttons/action-buttons.component'
import { LostPetTemplateComponent } from './components/lost-pet-template/lost-pet-template.component'
import { AddPetGuard } from './components/pet-form/add-pet-guard.guard'
import { PlansComponent } from './components/plans/plans.component'
import { FoundPetTemplateComponent } from './components/found-pet-template/found-pet-template.component'

export const options: Partial<null|IConfig> | (() => Partial<IConfig>) = null

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    HeaderComponent,
    PetsListComponent,
    PetFormComponent,
    InfoPetComponent,
    ActionButtonsComponent,
    LostPetTemplateComponent,
    PlansComponent,
    FoundPetTemplateComponent,
  ],
  imports: [
    BrowserModule,
    FontAwesomeModule,
    AuthModule,
    AngularMaterialModule,
    FormsModule,
    HttpClientModule,
    HttpClientJsonpModule,
    ReactiveFormsModule,
    NgxMaskModule.forRoot(),
    BrowserAnimationsModule,
    AppRoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000',
    }),
  ],
  providers: [AuthService, AuthGuard, AddPetGuard],
  bootstrap: [AppComponent],
})
export class AppModule { }
