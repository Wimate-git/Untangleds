import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DashboardFormComponent } from './dashboardForm.component';
import { ModalsModule, WidgetsModule } from '../../_metronic/partials';
import { CardsModule } from '../../_metronic/partials';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
  declarations: [DashboardFormComponent],
  imports: [
    CommonModule,
    CardsModule,
    RouterModule.forChild([
      {
        path: '',
        component: DashboardFormComponent,
      },
    ]),
    WidgetsModule,
    ModalsModule,
    NgxSpinnerModule,
  ],
})
export class DashboardFormModule {}
