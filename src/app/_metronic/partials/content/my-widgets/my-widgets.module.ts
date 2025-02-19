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

import { ChartUi2Component } from './chart-ui2/chart-ui2.component';
import { Chart2ConfigComponent } from './chart2-config/chart2-config.component';
import { Chart3ConfigComponent } from './chart3-config/chart3-config.component';
import { ChartUi3Component } from './chart-ui3/chart-ui3.component';
import { ChartUi4Component } from './chart-ui4/chart-ui4.component';
import { Chart4ConfigComponent } from './chart4-config/chart4-config.component';
import { ChartUi5Component } from './chart-ui5/chart-ui5.component';
import { Chart5ConfigComponent } from './chart5-config/chart5-config.component';
import { CustomInfoUiComponent } from './custom-info-ui/custom-info-ui.component';
import { CloneDashboardComponent } from './clone-dashboard/clone-dashboard.component';
import { DynamicTileUiComponent } from './dynamic-tile-ui/dynamic-tile-ui.component';
import { DynamicTileConfigComponent } from './dynamic-tile-config/dynamic-tile-config.component';
import { FilterTileUiComponent } from './filter-tile-ui/filter-tile-ui.component';
import { FilterTileConfigComponent } from './filter-tile-config/filter-tile-config.component';
import { TableWidgetUiComponent } from './table-widget-ui/table-widget-ui.component';
import { TableWidgetConfigComponent } from './table-widget-config/table-widget-config.component';
import { MultiSelectModule } from 'primeng/multiselect';
import { AgGridAngular } from 'ag-grid-angular';
import { MapConfigComponent } from './map-config/map-config.component';
import { MapUiComponent } from './map-ui/map-ui.component';
import { GoogleMapsModule } from '@angular/google-maps';
import { MultiTableConfigComponent } from './multi-table-config/multi-table-config.component';
import { MultiTableUiComponent } from './multi-table-ui/multi-table-ui.component';
import { NestedTableComponent } from './nested-table/nested-table.component';
import { DataTableShowComponent } from './data-table-show/data-table-show.component';
import { DataTableChart1Component } from './data-table-chart1/data-table-chart1.component';
import { DataTableChart2Component } from './data-table-chart2/data-table-chart2.component';
import { DataTableTile1Component } from './data-table-tile1/data-table-tile1.component';
import { HttpClientModule } from '@angular/common/http';
import { DataTableDynamicTileComponent } from './data-table-dynamic-tile/data-table-dynamic-tile.component';
import { HtmlTileConfigComponent } from './html-tile-config/html-tile-config.component';
import { HtmlTileUiComponent } from './html-tile-ui/html-tile-ui.component';






@NgModule({
  declarations: [TileUi1Component,Tile1ConfigComponent,Tile2ConfigComponent,TileUi2Component,Tile3ConfigComponent,TileUi3Component,TileUi4Component,Tile4ConfigComponent,
    TileUi5Component,
    Tile5ConfigComponent,
    TitleUiComponent,
    TitleConfigComponent,
    Tile6ConfigComponent,
    TileUi6Component,
    ChartUi1Component,
    Chart1ConfigComponent,
    Chart2ConfigComponent,
    ChartUi2Component,
    Chart3ConfigComponent,
    ChartUi3Component,
    ChartUi4Component,
    Chart4ConfigComponent,
    ChartUi5Component,
    Chart5ConfigComponent,
    CustomInfoUiComponent,
    CloneDashboardComponent,
    DynamicTileUiComponent,
    DynamicTileConfigComponent,
    FilterTileUiComponent,
    FilterTileConfigComponent,
    TableWidgetUiComponent,
    TableWidgetConfigComponent,
    MapConfigComponent,
    MapUiComponent,
    MultiTableConfigComponent,
    MultiTableUiComponent,
    NestedTableComponent,
    DataTableShowComponent,
    DataTableChart1Component,
    DataTableChart2Component,
    DataTableTile1Component,
    DataTableDynamicTileComponent,
    HtmlTileConfigComponent,
    HtmlTileUiComponent



  ],
  imports: [
    AgGridAngular,
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
    MultiSelectModule,
    GoogleMapsModule ,
    HttpClientModule,
  
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
    Chart1ConfigComponent,
    Chart2ConfigComponent,
    ChartUi2Component,
    Chart3ConfigComponent,
    ChartUi3Component,
    ChartUi4Component,
    Chart4ConfigComponent,
    Chart4ConfigComponent,
    ChartUi5Component,
    Chart5ConfigComponent,
    CustomInfoUiComponent,
    CloneDashboardComponent,
    DynamicTileUiComponent,
    DynamicTileConfigComponent,
    FilterTileUiComponent,
    FilterTileConfigComponent,
    TableWidgetUiComponent,
    TableWidgetConfigComponent,
    MapConfigComponent,
    MapUiComponent,
    MultiTableConfigComponent,
    MultiTableUiComponent,
    NestedTableComponent,
    DataTableShowComponent,
    DataTableChart1Component,
    DataTableChart2Component,
    DataTableTile1Component,
    DataTableDynamicTileComponent,
    HtmlTileConfigComponent,
    HtmlTileUiComponent
  

    

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
