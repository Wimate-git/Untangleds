import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { DreamboardComponent } from './dreamboard.component';
import { FormgroupComponent } from './formgroup.component';
import { DataTablesModule } from 'angular-datatables';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { NgbCollapseModule, NgbDropdownModule, NgbModalModule, NgbNavModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CrudModule } from 'src/app/modules/crud/crud.module';
import { SharedModule } from 'src/app/_metronic/shared/shared.module';
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";


@NgModule({
  declarations: [FormgroupComponent],
  imports: [
    CommonModule,CommonModule, DataTablesModule,
    FormsModule,
    ReactiveFormsModule,
    SweetAlert2Module.forChild(),
    NgbModalModule,
    CrudModule,
    SharedModule,
    NgbNavModule,
    NgbDropdownModule,
    NgbCollapseModule,
    NgbTooltipModule,
    NgMultiSelectDropDownModule,
    RouterModule.forChild([
      {
        path: '',
        component: FormgroupComponent,
      },
    ]),
  ],
})
export class FormgroupModule { }
