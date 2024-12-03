import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TileUi1Component } from './tile-ui1/tile-ui1.component';
import { Tile1ConfigComponent } from './tile1-config/tile1-config.component';
import { MatMenuModule } from '@angular/material/menu';
import { Tile2ConfigComponent } from './tile2-config/tile2-config.component';
import { TileUi2Component } from './tile-ui2/tile-ui2.component';
import { NgxDaterangepickerBootstrapComponent, NgxDaterangepickerBootstrapDirective, NgxDaterangepickerBootstrapModule, provideDaterangepickerLocale } from 'ngx-daterangepicker-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CrudSummaryComponent } from 'src/app/pages/summary-engine/crud-summary/crud-summary.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgxSelectModule } from 'ngx-select-ex';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS, MatSnackBarModule } from '@angular/material/snack-bar';
import { NgbModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { SharedModule } from 'primeng/api';
import { MatButtonModule } from '@angular/material/button';
import { NgxSpinnerModule } from 'ngx-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Tile3ConfigComponent } from './tile3-config/tile3-config.component';
import { TileUi3Component } from './tile-ui3/tile-ui3.component';
import { RouteReuseStrategy } from '@angular/router';
import { CustomReuseStrategy } from 'src/app/pages/summary-engine/custom-reuse-strategy';
import { TileUi4Component } from './tile-ui4/tile-ui4.component';
import { Tile4ConfigComponent } from './tile4-config/tile4-config.component';
import { GridsterModule } from 'angular-gridster2';
import { TileUi5Component } from './tile-ui5/tile-ui5.component';
import { Tile5ConfigComponent } from './tile5-config/tile5-config.component';
import { TitleUiComponent } from './title-ui/title-ui.component';
import { TitleConfigComponent } from './title-config/title-config.component';
import { Tile6ConfigComponent } from './tile6-config/tile6-config.component';
import { TileUi6Component } from './tile-ui6/tile-ui6.component';
import { Chart1ConfigComponent } from './chart1-config/chart1-config.component';
import { ChartUi1Component } from './chart-ui1/chart-ui1.component';





@NgModule({
  declarations: [TileUi1Component,Tile1ConfigComponent,Tile2ConfigComponent,TileUi2Component,Tile3ConfigComponent,TileUi3Component,TileUi4Component,Tile4ConfigComponent,
    TileUi5Component,
    Tile5ConfigComponent,
    TitleUiComponent,
    TitleConfigComponent,
    Tile6ConfigComponent,
    TileUi6Component,
    ChartUi1Component,
    Chart1ConfigComponent

  ],
  imports: [
    CommonModule,
    MatMenuModule,
    NgxDaterangepickerBootstrapModule.forRoot(),
   
    FormsModule,
    ReactiveFormsModule,
   
    CrudSummaryComponent,
 
    NgMultiSelectDropDownModule,
    NgxSelectModule,

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
    NgxSpinnerModule,
    MatTooltipModule,
    NgbTooltipModule,
  ],
  exports:[

    TileUi1Component,
    Tile1ConfigComponent,
    Tile2ConfigComponent,
    TileUi2Component,
    Tile3ConfigComponent,
    TileUi3Component,
    TileUi4Component,
    Tile4ConfigComponent,
    TileUi5Component,
    Tile5ConfigComponent,
    TitleUiComponent,
    TitleConfigComponent,
    Tile6ConfigComponent,
    TileUi6Component,
    ChartUi1Component,
    Chart1ConfigComponent

    

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
export class MyWidgetsModule { }
