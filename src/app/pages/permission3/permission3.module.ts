import { RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { SharedModule } from "../../_metronic/shared/shared.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";
import { NgbCollapseModule, NgbDropdownModule, NgbModule, NgbNavModule, NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";
import { NgxSpinner, NgxSpinnerModule } from "ngx-spinner";
import { CrudModule } from "src/app/modules/crud/crud.module";
import { Permission3Component } from "./permission3.component";
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import {MatTabsModule} from '@angular/material/tabs';
import {MatCardModule} from '@angular/material/card';


@NgModule({
  declarations: [Permission3Component],
  imports: [
    RouterModule.forChild([
        {
            path: '',
            component: Permission3Component,
        },
    ]),
    SharedModule,
    CrudModule,
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    NgMultiSelectDropDownModule,
    NgbNavModule,
    NgbDropdownModule,
    NgbCollapseModule,
    NgbTooltipModule,
    NgbModule,
    NgxSpinnerModule,
    MatTabsModule,
    MatCardModule,
    SweetAlert2Module
    
]
})
export class Permission3Module { }