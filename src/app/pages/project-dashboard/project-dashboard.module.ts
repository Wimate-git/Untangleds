import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProjectDashboardComponent } from './project-dashboard.component';
import { ModalsModule, WidgetsModule } from '../../_metronic/partials';
import { CardsModule } from '../../_metronic/partials';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
  declarations: [ProjectDashboardComponent],
  imports: [
    CommonModule,
    CardsModule,
    RouterModule.forChild([
      {
        path: '',
        component: ProjectDashboardComponent,
      },
    ]),
    WidgetsModule,
    ModalsModule,
    NgxSpinnerModule,
  ],
})
export class ProjectDashboardModule {}
