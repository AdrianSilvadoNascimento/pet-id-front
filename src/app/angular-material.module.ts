import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'

import { MatMenuModule } from '@angular/material/menu'
import { MatIconModule } from '@angular/material/icon'
import { MatToolbarModule } from '@angular/material/toolbar'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatButtonModule } from '@angular/material/button'
import { MatSelectModule } from '@angular/material/select'
import { MatAutocompleteModule } from '@angular/material/autocomplete'
import { MatTooltipModule } from '@angular/material/tooltip'
import { MatStepperModule } from '@angular/material/stepper'

@NgModule({
  imports: [
    CommonModule,
    MatMenuModule,
    MatIconModule,
    MatToolbarModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatTooltipModule,
    MatStepperModule,
  ],
  exports: [
    CommonModule,
    MatMenuModule,
    MatIconModule,
    MatToolbarModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatTooltipModule,
    MatStepperModule,
  ]
 })

export class AngularMaterialModule {}