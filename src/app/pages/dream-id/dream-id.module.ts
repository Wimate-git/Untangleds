import { NgModule } from '@angular/core';
import { DreamIdComponent } from './dream-id.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';


@NgModule({
  declarations: [
DreamIdComponent
  ],
  imports: [
CommonModule,

    RouterModule.forChild([
      {
        path: '',
        component: DreamIdComponent,
      },
    ]),
  ],
})
export class DreamIdModule { }
