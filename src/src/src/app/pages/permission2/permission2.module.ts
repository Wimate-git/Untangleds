import { RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { SharedModule } from "../../_metronic/shared/shared.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";
import { NgbCollapseModule, NgbDropdownModule, NgbModule, NgbNavModule, NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";
import { NgxSpinner, NgxSpinnerModule } from "ngx-spinner";
import { Crud2Module } from "src/app/modules/crud2/crud.module";
import { Permission2Component } from "./permission2.component";
import {MatTabsModule} from '@angular/material/tabs';
import {MatCardModule} from '@angular/material/card';






@NgModule({
  declarations: [Permission2Component],
  imports: [
    RouterModule.forChild([
        {
            path: '',
            component: Permission2Component,
        },
    ]),
    SharedModule,
    Crud2Module,
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
    MatCardModule
    
]
})
export class Permission2Module { }
