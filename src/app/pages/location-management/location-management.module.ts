import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocationManagementComponent } from './location-management.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgxSelectModule } from 'ngx-select-ex';



@NgModule({
  declarations: [LocationManagementComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    NgMultiSelectDropDownModule,
    NgxSelectModule,
    RouterModule.forChild([
      {
        path: '',
        component: LocationManagementComponent,
      },
    ])
  ]
})
export class LocationManagementModule { }
