import { RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { SharedModule } from "../../_metronic/shared/shared.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";
import { NgbCollapseModule, NgbDropdownModule, NgbModule, NgbNavModule, NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";
import { NgxSpinner, NgxSpinnerModule } from "ngx-spinner";
import { CrudModule } from "src/app/modules/crud/crud.module";
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import {MatTabsModule} from '@angular/material/tabs';
import {MatCardModule} from '@angular/material/card';
import { MultiSelectModule } from "primeng/multiselect";
import { MqttComponent } from "./mqtt.component";
import { Crud2Module } from "src/app/modules/crud2/crud.module";


@NgModule({
  declarations: [MqttComponent],
  imports: [
    RouterModule.forChild([
        {
            path: '',
            component: MqttComponent,
            data:{ title:'MQTT' }
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
    MatCardModule,
    // Crud2Module ,
    SweetAlert2Module,
    MultiSelectModule
    
]
})
export class MQTTModule { }
