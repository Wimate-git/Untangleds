import { RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { SharedModule } from "../../_metronic/shared/shared.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";
import { NgbCollapseModule, NgbDropdownModule, NgbModule, NgbNavModule, NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";
import { UserManagementComponent } from "./user-management.component";
import { NgxSpinner, NgxSpinnerModule } from "ngx-spinner";
import { Crud2Module } from "src/app/modules/crud2/crud.module";
import { MultiSelectModule } from "primeng/multiselect";
import { SweetAlert2Module } from "@sweetalert2/ngx-sweetalert2";
import { SelectButtonModule } from 'primeng/selectbutton';
import { UserExportComponent } from "./user-export/user-export.component";
import { UserVerifiedTableComponent } from "./user-verified-table/user-verified-table.component";
import { PasswordModule } from 'primeng/password';




@NgModule({
  declarations: [UserManagementComponent,UserVerifiedTableComponent],
  imports: [
    RouterModule.forChild([
        {
            path: '',
            component: UserManagementComponent,
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
    SweetAlert2Module.forChild(),
    UserExportComponent,
    MultiSelectModule,
    SelectButtonModule,
    PasswordModule
    
]
})
export class UserManagementModule { }
