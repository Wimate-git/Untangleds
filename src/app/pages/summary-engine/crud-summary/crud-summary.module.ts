import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CrudSummaryComponent } from './crud-summary.component';
import { DataTablesModule } from 'angular-datatables';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';



@NgModule({
  declarations: [CrudSummaryComponent],
  imports: [
    CommonModule, 
    DataTablesModule,
    SweetAlert2Module.forChild(),
    NgbModalModule,
  ],
  exports: [CrudSummaryComponent]
})
export class CrudSummaryModule { }
