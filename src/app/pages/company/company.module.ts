import { RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { SharedModule } from "../../_metronic/shared/shared.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";
import { NgbCollapseModule, NgbDropdownModule, NgbModule, NgbNavModule, NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";
import { NgxSpinner, NgxSpinnerModule } from "ngx-spinner";
import { Crud2Module } from "src/app/modules/crud2/crud.module";
import { CompanyComponent } from "./company.component";
import { CrudcompanyModule } from "./crud-company/crud.module";
import { SweetAlert2Module } from "@sweetalert2/ngx-sweetalert2";





@NgModule({
  declarations: [CompanyComponent],
  imports: [
    RouterModule.forChild([
        {
            path: '',
            component: CompanyComponent,
        },
    ]),
    SharedModule,
    CrudcompanyModule,
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
    SweetAlert2Module.forChild(),
]
})
export class CompanyModule { }
