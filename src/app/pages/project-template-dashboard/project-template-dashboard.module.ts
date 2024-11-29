import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProjectTemplateDashboardComponent } from './project-template-dashboard.component';
import { ModalsModule, WidgetsModule } from '../../_metronic/partials';
import { CardsModule } from '../../_metronic/partials';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
  declarations: [ProjectTemplateDashboardComponent],
  imports: [
    CommonModule,
    CardsModule,
    RouterModule.forChild([
      {
        path: '',
        component: ProjectTemplateDashboardComponent,
      },
    ]),
    WidgetsModule,
    ModalsModule,
    NgxSpinnerModule,
  ],
})
export class ProjectTemplateDashboardModule {}
