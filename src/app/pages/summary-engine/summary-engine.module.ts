import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

import { RouteReuseStrategy, RouterModule } from '@angular/router';
import { SummaryEngineComponent } from './summary-engine.component';
import { CrudcompanyModule } from '../company/crud-company/crud.module';




// import { OverlayContainer, ToastrModule } from 'ngx-toastr';
import { NgxSelectModule } from 'ngx-select-ex';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatSnackBarModule, MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input'; // If you're using input fields within mat-form-field
import { MatIconModule } from '@angular/material/icon';
import { SharedModule } from 'src/app/_metronic/shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { CustomReuseStrategy } from './custom-reuse-strategy';
import { GridsterModule } from 'angular-gridster2';

 // Import Keen UI Module








@NgModule({
  declarations: [SummaryEngineComponent],
  imports: [
    CommonModule,
    FormsModule,
    CrudcompanyModule,
    ReactiveFormsModule,
    NgMultiSelectDropDownModule,
    NgxSelectModule,
    GridsterModule,
    MatSnackBarModule,
    NgbModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule ,
    MatIconModule,
    SharedModule, // Add MatIconModule here
    // BrowserAnimationsModule, // Required for Angular Material animations
    MatButtonModule,
    MatMenuModule,


  


    // ToastrModule.forRoot({
    //   positionClass: 'toast-top-right',
    //   preventDuplicates: true,
    //   closeButton: true
    // }),
    RouterModule.forChild([
      {
        path: '',
        component: SummaryEngineComponent,
      },
      {
        path: 'summary-engine/:id',
        component: SummaryEngineComponent,
      },
    ])
  ],
  
  providers: [
    { provide: RouteReuseStrategy, useClass: CustomReuseStrategy },
    {
      provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
      useValue: {
        horizontalPosition: 'right', // Set default horizontal position
        verticalPosition: 'top',     // Set default vertical position
        duration: 3000               // Set default duration
      },
    }

    
  ],

  
})
export class SummaryEngineModule { }
