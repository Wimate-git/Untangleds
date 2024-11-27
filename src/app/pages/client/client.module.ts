import { RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { SharedModule } from "../../_metronic/shared/shared.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";
import { ClientComponent } from "./client.component";
import { InlineSVGModule } from "ng-inline-svg-2";
import { Crud2Module } from "src/app/modules/crud2/crud.module";
import { SweetAlert2Module } from "@sweetalert2/ngx-sweetalert2";
import { NgbCollapseModule, NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { HttpClientModule } from "@angular/common/http";
import { DropdownModule } from 'primeng/dropdown';



@NgModule({
  declarations: [ClientComponent],
  imports: [
    RouterModule.forChild([
        {
            path: '',
            component: ClientComponent,
        },
    ]),
    SharedModule,
    ReactiveFormsModule,
    CommonModule,
    NgbModule,
    Crud2Module,
    FormsModule,
    NgbCollapseModule,
    HttpClientModule,
    NgMultiSelectDropDownModule,
    DropdownModule,
    InlineSVGModule.forRoot(),
    SweetAlert2Module.forChild(),
    
]
})
export class ClientModule { }
