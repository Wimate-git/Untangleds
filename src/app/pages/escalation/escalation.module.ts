import { RouterModule } from "@angular/router";
import { EscalationComponent } from "./escalation.component";
import { NgModule } from "@angular/core";
import { SharedModule } from "../../_metronic/shared/shared.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";
import { NgbCollapseModule, NgbDropdownModule, NgbModule, NgbNavModule, NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";
import { Crud2Module } from "src/app/modules/crud2/crud.module";
import { MultiSelectModule } from 'primeng/multiselect';
import { SweetAlert2Module } from "@sweetalert2/ngx-sweetalert2";
import { DropdownModule } from 'primeng/dropdown';





@NgModule({
  declarations: [EscalationComponent],
  imports: [
    RouterModule.forChild([
        {
            path: '',
            component: EscalationComponent,
        },
    ]),
    SharedModule,
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    NgMultiSelectDropDownModule,
    NgbNavModule,
    NgbDropdownModule,
    NgbCollapseModule,
    NgbTooltipModule,
    NgbModule,
    Crud2Module,
    MultiSelectModule,
    DropdownModule,
    SweetAlert2Module.forChild(),
]
})
export class EscalationModule { }
