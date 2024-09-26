import { RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { SharedModule } from "../../_metronic/shared/shared.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";
import { ClientComponent } from "./client.component";
import { InlineSVGModule } from "ng-inline-svg-2";





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
    FormsModule,
    NgMultiSelectDropDownModule,
    InlineSVGModule.forRoot(),
    
]
})
export class ClientModule { }
