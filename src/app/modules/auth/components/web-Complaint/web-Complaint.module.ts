import { NgModule } from '@angular/core';
// import { DreamIdComponent } from './dream-id.component';
import { WebComplaintsComponent } from './web-Complaint.component';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: WebComplaintsComponent,
      },
    ]),
  ],
})
export class  WebComplaintsModule { }
