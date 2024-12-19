import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { SharedModule } from "../../_metronic/shared/shared.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";
import { NgbCollapseModule, NgbDropdownModule, NgbModule, NgbNavModule, NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";
import { NgxSpinner, NgxSpinnerModule } from "ngx-spinner";
import { SweetAlert2Module } from "@sweetalert2/ngx-sweetalert2";
import { ReportStudioComponent } from "./report-studio.component";
import { AgGridAngular } from 'ag-grid-angular';
import { MultiSelectModule } from "primeng/multiselect";
import { SavedQueryComponent } from "./saved-query/saved-query.component";
import { CrudreportModule } from "./crud-report/crud.module";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { MatTooltipModule } from "@angular/material/tooltip";


const routes: Routes = [
    {
      path: '',
      component: ReportStudioComponent, // Default route for the module
    }
  ];


@NgModule({
  declarations: [ReportStudioComponent,SavedQueryComponent],
  imports: [
    AgGridAngular,
    RouterModule.forChild(routes),
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
    NgxSpinnerModule,
    MultiSelectModule,
    SweetAlert2Module.forChild(),
    CrudreportModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatTooltipModule,
]
})
export class ReportStudioModule { }
