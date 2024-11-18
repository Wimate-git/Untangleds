import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

import { RouteReuseStrategy, RouterModule } from '@angular/router';
import { SummaryEngineComponent } from './summary-engine.component';
import { CrudcompanyModule } from '../company/crud-company/crud.module';

import { CustomReuseStrategy } from './custom-reuse-strategy';


import { NgxSelectModule } from 'ngx-select-ex';
import { GridsterModule } from 'angular-gridster2';
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
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { NgxDaterangepickerBootstrapComponent, NgxDaterangepickerBootstrapDirective, NgxDaterangepickerBootstrapModule, provideDaterangepickerLocale } from 'ngx-daterangepicker-bootstrap';

 // Import Keen UI Module








@NgModule({
  declarations: [SummaryEngineComponent],
  imports: [
    CommonModule,
    NgxDaterangepickerBootstrapDirective,
    NgxDaterangepickerBootstrapComponent,
    FormsModule,
    ReactiveFormsModule,
    NgxDaterangepickerBootstrapModule,
    CrudcompanyModule,
 
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
    },
    provideDaterangepickerLocale({
      separator: ' - ',
      applyLabel: 'Okay',
    }),

    
  ],

  
})
export class SummaryEngineModule { }