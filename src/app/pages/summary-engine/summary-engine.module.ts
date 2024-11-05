import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgxSelectModule } from 'ngx-select-ex';
import { RouterModule } from '@angular/router';
import { SummaryEngineComponent } from './summary-engine.component';
import { CrudcompanyModule } from '../company/crud-company/crud.module';



@NgModule({
  declarations: [SummaryEngineComponent],
  imports: [
    CommonModule,
    FormsModule,
    CrudcompanyModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    NgMultiSelectDropDownModule,
    NgxSelectModule,
    RouterModule.forChild([
      {
        path: '',
        component: SummaryEngineComponent,
      },
    ])
  ]
})
export class SummaryEngineModule { }
