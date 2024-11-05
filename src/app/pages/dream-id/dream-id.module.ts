import { NgModule } from '@angular/core';
import { DreamIdComponent } from './dream-id.component';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: DreamIdComponent,
      },
    ]),
  ],
})
export class DreamIdModule { }
