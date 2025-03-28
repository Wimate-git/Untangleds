import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { ModalsModule, WidgetsModule } from '../../_metronic/partials';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { CardsModule } from '../../_metronic/partials';
import { NgxSpinnerModule } from 'ngx-spinner';
import { CrudModule } from 'src/app/modules/crud/crud.module';
import { FormsModule } from '@angular/forms'; 
import { CdkDropList, CdkDrag} from '@angular/cdk/drag-drop';



@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    CardsModule,
    SweetAlert2Module.forChild(),
    RouterModule.forChild([
      {
        path: '',
        component: DashboardComponent,
      },
    ]),
    WidgetsModule,
    CrudModule,
    ModalsModule,
    NgxSpinnerModule,
    FormsModule,
    CdkDropList, CdkDrag,
  ],
})
export class DashboardModule {}
