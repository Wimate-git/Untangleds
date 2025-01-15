import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DashboardFormComponent } from './dashboardForm.component';
import { ModalsModule, WidgetsModule } from '../../_metronic/partials';
import { CardsModule } from '../../_metronic/partials';
import { NgxSpinnerModule } from 'ngx-spinner';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { FormsModule } from '@angular/forms'; 

@NgModule({
  declarations: [DashboardFormComponent],
  imports: [
    CommonModule,
    CardsModule,
    SweetAlert2Module.forChild(),
    RouterModule.forChild([
      {
        path: '',
        component: DashboardFormComponent,
      },
    ]),
    WidgetsModule,
    ModalsModule,
    NgxSpinnerModule,
    FormsModule
  ],
})
export class DashboardFormModule {}
