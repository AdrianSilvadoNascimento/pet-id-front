import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'

import { AuthGuard } from './auth/auth.guard'
import { HomePageComponent } from './components/home-page/home-page.component'
import { PetFormComponent } from './components/pet-form/pet-form.component'
import { InfoPetComponent } from './components/info-pet/info-pet.component'
import { LostPetTemplateComponent } from './components/lost-pet-template/lost-pet-template.component'
import { AddPetGuard } from './components/pet-form/add-pet-guard.guard'
import { PlansComponent } from './components/plans/plans.component'
import { FoundPetTemplateComponent } from './components/found-pet-template/found-pet-template.component'

const routes: Routes = [
  { path: '', redirectTo: 'index', pathMatch: 'full' },
  { path: 'index', component: HomePageComponent, canActivate: [AuthGuard] },
  { path: 'user-login', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule) },
  { path: 'pet-register', component: PetFormComponent, canActivate: [AddPetGuard] },
  { path: 'pet-edit/:id', component: PetFormComponent, canActivate: [AuthGuard] },
  { path: 'buy-a-plan', component: PlansComponent, canActivate: [AuthGuard] },
  { path: 'info-pet/:id', component: InfoPetComponent, data: { isShowHeader: true } },
  { path: 'lost-pet', component: LostPetTemplateComponent, canActivate: [AuthGuard] },
  { path: 'found-pet', component: FoundPetTemplateComponent, canActivate: [AuthGuard] },
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
