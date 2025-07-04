import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, HostListener, inject, Injector, NgZone, OnDestroy, OnInit, Output, Renderer2, TemplateRef, ViewChild } from '@angular/core';
import { SharedService } from '../shared.service';
import { APIService } from 'src/app/API.service';
import { AbstractControl, FormControl, FormGroup, UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

import { Config } from 'datatables.net';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CompactType, DisplayGrid, GridsterConfig, GridsterItem, GridsterItemComponentInterface, GridType } from 'angular-gridster2';
import { ActivatedRoute, NavigationEnd, NavigationExtras, NavigationStart, Router } from '@angular/router';

import { LocationPermissionService } from 'src/app/location-permission.service';
import * as $ from 'jquery';
import 'jstree';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import Swal from 'sweetalert2';
import { MatMenuTrigger } from '@angular/material/menu';

import HighchartsBullet from 'highcharts/modules/bullet';
import HighchartsMore from 'highcharts/highcharts-more';

import HighchartsSolidGauge from 'highcharts/modules/solid-gauge';
import bullet from 'highcharts/modules/bullet';

import * as moment from 'moment';
import dayjs, { Dayjs } from 'dayjs';
import { NgxDaterangepickerLocaleService } from 'ngx-daterangepicker-bootstrap';
import bulletChart from 'highcharts/modules/bullet.src';
import * as Highcharts from 'highcharts';
import { NgxSpinnerService } from 'ngx-spinner';


import { Tile1ConfigComponent } from 'src/app/_metronic/partials/content/my-widgets/tile1-config/tile1-config.component';


import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Modal, Tooltip } from 'bootstrap';
import { Tile2ConfigComponent } from 'src/app/_metronic/partials/content/my-widgets/tile2-config/tile2-config.component';
import { Tile3ConfigComponent } from 'src/app/_metronic/partials/content/my-widgets/tile3-config/tile3-config.component';
import { Tile4ConfigComponent } from 'src/app/_metronic/partials/content/my-widgets/tile4-config/tile4-config.component';
import { Tile5ConfigComponent } from 'src/app/_metronic/partials/content/my-widgets/tile5-config/tile5-config.component';
import { TitleConfigComponent } from 'src/app/_metronic/partials/content/my-widgets/title-config/title-config.component';
import { Tile6ConfigComponent } from 'src/app/_metronic/partials/content/my-widgets/tile6-config/tile6-config.component';
import { Chart1ConfigComponent } from 'src/app/_metronic/partials/content/my-widgets/chart1-config/chart1-config.component';
import { Chart2ConfigComponent } from 'src/app/_metronic/partials/content/my-widgets/chart2-config/chart2-config.component';
import { Chart3ConfigComponent } from 'src/app/_metronic/partials/content/my-widgets/chart3-config/chart3-config.component';
import { Chart4ConfigComponent } from 'src/app/_metronic/partials/content/my-widgets/chart4-config/chart4-config.component';
import Funnel from 'highcharts/modules/funnel';
import { Chart5ConfigComponent } from 'src/app/_metronic/partials/content/my-widgets/chart5-config/chart5-config.component';
import { CloneDashboardComponent } from 'src/app/_metronic/partials/content/my-widgets/clone-dashboard/clone-dashboard.component';
import { DynamicTileConfigComponent } from 'src/app/_metronic/partials/content/my-widgets/dynamic-tile-config/dynamic-tile-config.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FilterTileConfigComponent } from 'src/app/_metronic/partials/content/my-widgets/filter-tile-config/filter-tile-config.component';
import { TableWidgetConfigComponent } from 'src/app/_metronic/partials/content/my-widgets/table-widget-config/table-widget-config.component';

import { AgGridAngular } from 'ag-grid-angular';
import { GridApi ,Column, ColDef} from 'ag-grid-community';
import { MapConfigComponent } from 'src/app/_metronic/partials/content/my-widgets/map-config/map-config.component';
import { DomSanitizer, SafeResourceUrl, Title } from '@angular/platform-browser';
import { MultiTableConfigComponent } from 'src/app/_metronic/partials/content/my-widgets/multi-table-config/multi-table-config.component';
import { AuditTrailService } from '../services/auditTrail.service';
import { HtmlTileConfigComponent } from 'src/app/_metronic/partials/content/my-widgets/html-tile-config/html-tile-config.component';
import { SummaryEngineService } from './summary-engine.service';
import { ImageConfigComponent } from 'src/app/_metronic/partials/content/my-widgets/image-config/image-config.component';
import { catchError, take, throwError } from 'rxjs';
import { BlobService } from './blob.service';
import funnel from 'highcharts/modules/funnel';
import { FunnelChartConfigComponent } from 'src/app/_metronic/partials/content/my-widgets/funnel-chart-config/funnel-chart-config.component';
import { ProgressTileComponent } from 'src/app/_metronic/partials/content/my-widgets/progress-tile/progress-tile.component';
import { TileWithIconComponent } from 'src/app/_metronic/partials/content/my-widgets/tile-with-icon/tile-with-icon.component';
import { PieChartConfigComponent } from 'src/app/_metronic/partials/content/my-widgets/pie-chart-config/pie-chart-config.component';
import { StackedBarConfigComponent } from 'src/app/_metronic/partials/content/my-widgets/stacked-bar-config/stacked-bar-config.component';
import { AuthService } from 'src/app/modules/auth';
import { MixedChartConfigComponent } from 'src/app/_metronic/partials/content/my-widgets/mixed-chart-config/mixed-chart-config.component';
import * as CryptoJS from 'crypto-js';
import { FullscreenService } from '../report-studio/services/fullscreen.service';
import { SemiDonutConfigComponent } from 'src/app/_metronic/partials/content/my-widgets/semi-donut-config/semi-donut-config.component';
import { GaugeChartUiComponent } from 'src/app/_metronic/partials/content/my-widgets/gauge-chart-ui/gauge-chart-ui.component';
import { GaugeChartConfigComponent } from 'src/app/_metronic/partials/content/my-widgets/gauge-chart-config/gauge-chart-config.component';
import { Location } from '@angular/common';
import { CrudSummaryComponent } from './crud-summary/crud-summary.component';
type Tabs = 'Board' | 'Widgets' | 'Datatype' | 'Settings' | 'Advanced' | 'Action';
import { PageInfoService  } from 'src/app/_metronic/layout/core/page-info.service';




interface ListItem {
  [key: string]: {
    P1: any;
    P2: any;
    P3: any;
    P4: any;
    P5: any;
    P6: any;
    P7: any;
    P8: any;
    P9: any;
    P10:any;
    P11:any;
    // P12:any;
  };
}
interface RowData {
  P1: string;
  P2: string;
  P3: string;
  P4: number;
  P5: number;
  P6?: string; // Optional fields
  P7?: string;
  P8?: string;
}
interface UpdateMasterInput {
  PK: string;
  SK: number;
  metadata: string; // Or whatever structure it should have
}
declare global {
  interface Window {
    pk: string;
    sk: number;
  }
}


interface TreeNode {
  id: string;         // Assuming 'id' is a string
  text: string;       // Assuming 'text' is a string
  parent?: string;    // 'parent' can be a string or undefined
  node_type?: string;
  magicboard_view: any,
  powerboard_view: any,
  description: any,
  summaryView: any,
  dreamboard_view: any,
  powerboard_view_device: any,
  icon: any;
  chartIdsFromChild1: string[];
  




  // Optional property for node type
}
interface DashboardItem extends GridsterItem {
  title: string;
  description: string;
}
interface NgxSelectEvent {
  data: {
    text: string;
    value: string;
  };
}


HighchartsMore(Highcharts);
HighchartsSolidGauge(Highcharts);
funnel(Highcharts);
@Component({
  selector: 'app-summary-engine',
  templateUrl: './summary-engine.component.html',
  styleUrl: './summary-engine.component.scss'
})
export class SummaryEngineComponent implements OnInit, AfterViewInit, OnDestroy {
  iconOptions: { value: string; label: string; class1: string, class2: string }[] = [];
  @ViewChild('calendarModal') calendarModal: any;
  @ViewChild('calendarModal1') calendarModal1: any;
  @ViewChild('calendarModal2') calendarModal2: any;
  @ViewChild('calendarModal3') calendarModal3: any;
  @ViewChild('calendarModal4') calendarModal4: any;
  @ViewChild('calendarModal5') calendarModal5: any;
  @ViewChild('calendarModal6') calendarModal6: any;
  @ViewChild('dialChartContainer') dialChartContainer!: ElementRef;
  @ViewChild(Tile1ConfigComponent, { static: false }) tileConfig1Component: Tile1ConfigComponent;
  @ViewChild(TileWithIconComponent, { static: false }) TileWithIconComponent: TileWithIconComponent;
  @ViewChild(Tile2ConfigComponent, { static: false }) tileConfig2Component: Tile2ConfigComponent;
  @ViewChild(Tile3ConfigComponent, { static: false }) tileConfig3Component!: Tile3ConfigComponent;

  @ViewChild(Tile4ConfigComponent, { static: false }) tileConfig4Component: Tile4ConfigComponent;
  @ViewChild(Tile5ConfigComponent, { static: false }) tileConfig5Component: Tile5ConfigComponent;
  @ViewChild(TitleConfigComponent, { static: false }) titleConfigComponent: TitleConfigComponent;
  @ViewChild(Tile6ConfigComponent, { static: false }) tileConfig6Component: Tile6ConfigComponent;
  @ViewChild(Chart1ConfigComponent, { static: false }) ChartConfig1Component: Chart1ConfigComponent;
  @ViewChild(SemiDonutConfigComponent, { static: false }) SemiDonutConfigComponent: SemiDonutConfigComponent;
  

  @ViewChild(StackedBarConfigComponent, { static: false }) StackedBarConfigComponent: StackedBarConfigComponent;
  @ViewChild(GaugeChartConfigComponent, { static: false }) GaugeChartConfigComponent: GaugeChartConfigComponent;
  @ViewChild(PieChartConfigComponent, { static: false }) PieChartConfigComponent: PieChartConfigComponent;
  
  @ViewChild(Chart2ConfigComponent, { static: false }) ChartConfig2Component: Chart2ConfigComponent;
  @ViewChild(Chart3ConfigComponent, { static: false }) ChartConfig3Component: Chart3ConfigComponent;
  @ViewChild(MixedChartConfigComponent, { static: false }) MixedChartConfigComponent: MixedChartConfigComponent;
  @ViewChild(Chart4ConfigComponent, { static: false }) ChartConfig4Component: Chart4ConfigComponent;
  @ViewChild(Chart5ConfigComponent, { static: false }) ChartConfig5Component: Chart5ConfigComponent;
  @ViewChild('summaryModal') summaryModal!: TemplateRef<any>;
  @ViewChild(DynamicTileConfigComponent, { static: false }) DynamicTileConfigComponent: DynamicTileConfigComponent;
  @ViewChild(ProgressTileComponent, { static: false }) ProgressTileComponent: ProgressTileComponent;



  
  @ViewChild(CloneDashboardComponent, { static: false }) CloneDashboardComponent: CloneDashboardComponent;
  @ViewChild(FilterTileConfigComponent, { static: false }) FilterTileConfigComponent: FilterTileConfigComponent;
  @ViewChild(TableWidgetConfigComponent, { static: false }) TableWidgetConfigComponent: TableWidgetConfigComponent;
  @ViewChild(MapConfigComponent, { static: false }) MapConfigComponent: MapConfigComponent;
  @ViewChild(MultiTableConfigComponent, { static: false }) MultiTableConfigComponent: MultiTableConfigComponent;
  @ViewChild(HtmlTileConfigComponent, { static: false }) HtmlTileConfigComponent: HtmlTileConfigComponent;
  @ViewChild(ImageConfigComponent, { static: false }) ImageConfigComponent: ImageConfigComponent;

  @ViewChild(FunnelChartConfigComponent, { static: false }) FunnelChartConfigComponent: FunnelChartConfigComponent;
  
  
  @ViewChild('container', { read: ElementRef }) container: ElementRef;
  @ViewChild(CrudSummaryComponent) crudSummaryComp!: CrudSummaryComponent;


  


  @ViewChild('tileModal', { static: true }) tileModal!: ElementRef<HTMLDivElement>;

  modalOpened: boolean = false;
  modalData: any[] = [
    { id: 1, name: 'John Doe', age: 25, profession: 'Engineer' },
    { id: 2, name: 'Jane Smith', age: 30, profession: 'Designer' },
  ];

  nestedColumnDefs: ColDef[] = [
    { field: 'id', headerName: 'ID', sortable: true, filter: true },
    { field: 'name', headerName: 'Name', sortable: true, filter: true },
    { field: 'age', headerName: 'Age', sortable: true, filter: true },
    { field: 'profession', headerName: 'Profession', sortable: true, filter: true },
  ];

  chartIdsFromChild1: any;
  chartHeight: any[]=[];
  chartWidth: any[]=[];
  disableMenuQP: boolean = false;
  viewModeQP: boolean = false;
  tilesListDefault: string;
  defaultValue: string;
  gridService: any;
  resizeObserver: ResizeObserver;
  formattedDashboard: any[];
  parsedSummaryData: any;
  summaryValues: any;
  body: { clientId: any; routeId: string | null; };
  p1ValuesSummaryPemission: any;
  permissionIdsList: any;
  fetchedData: any;
  dataMap: any;
  parsedPermission: any;
  permissionIdsListList: any;
  permissionIdLocal: any;
  idInputSubject: any;
  previousValue: string;

  private gridApi!: GridApi;
  private gridColumnApi!: Column;
  columnApi: any;
  extractUserName: any;
  mapHeight: any[] = [];
  mapWidth: any[] = [];
  datatableInstance: any;

  liveDataFilterCheck:boolean=false
  datatableReady = false;

  center: google.maps.LatLngLiteral = { lat: 20.5937, lng: 78.9629 };
  zoom = 5; // Adjust the zoom level
  iframeSafeUrl: SafeResourceUrl = ''; 
  // Marker positions
  markers = [
    { lat: 28.6139, lng: 77.209, label: 'Delhi' }, // Delhi
    { lat: 19.076, lng: 72.8777, label: 'Mumbai' }, // Mumbai
    { lat: 13.0827, lng: 80.2707, label: 'Chennai' }, // Chennai
    { lat: 22.5726, lng: 88.3639, label: 'Kolkata' }, // Kolkata
    { lat: 12.9716, lng: 77.5946, label: 'Bangalore' }, // Bangalore
  ];
  summaryPermission: any;
  dashboardData: any;
  currentModalIndex: number;
  currentiframeUrl: any;
  parsedConfigs: any;
  queryParams: any;
  isFilterdetail: boolean;
  storeFilterDetail: any[];
  updatedQueryPramas: any;
  sendRowDynamic: any;
  storeDrillDown: any;
  responseBody: any;
  responseRowData: any;
  miniTableData: any;
  emitEvent: any;
  FormNameMini: any;
  paramsReadExport: any;
  toRouteId: any;
  fromRouterID: any='';
  chartDataConfigExport: any;
  lastUpdatedTime: any;
  tileHeight: any []=[];
  tileWidth: any []=[];
  tableHeight:any []=[];
  tableWidth:any [] = [];
  titleHeight:any [] =[];
  titleWidth:any [] = [];
  DynamicTileHeight:any [] = [];
  DynamicTileWidth:any [] = [];
  HTMLtileHeight:any [] = [];
  HTMLtileWidth:any [] = [];

  filterTileHeight:any []=[];
  filterTileWidth:any []=[];
  tile2Height:any []=[];
  tile2Width:any []=[];
 
  userPermissions: boolean ;
  permissionIdCheck: any;
  permissionsMetaData: any;
  userPermissionsRead: any;
  userPermission: any;
  readFilterEquation: any;
  permissionIdRequest: any;
  redirectionURL: string = '';
  dynamicIDArray: never[];
  isNone: boolean= false;
  savedQueryParam: any;
  liveDataTile: any;
  liveDataChart: any;
  hideNavMenu: boolean =true;
  isFading: boolean = false;
  inactivityTimer: any;
  liveDataLineChart: any;
  liveDataColumnChart: any;
  liveDataDynamicTile: any;
  liveDataTableTile: any;
  helpherObjCalender: any;
  showHTMLtileGrid: boolean;
  showimageGrid:boolean
  checkLiveDashboard: any;
  liveDataMapTile: any;
  summaryDashboardView: any;
  preventModalOpening: any;
  eventFilterConditions: any;
  assignGridMode: boolean;
  queryParamsSend: any;
  modalCheck: any;
  toRouterID: any;
  filterConditions: any;
  blobUrl: string = '';
  isFullscreen: boolean;
  PinValue: number;
  PinCheck: any;
  showProgressGrid: boolean;
  @ViewChild('myDiv') myDiv: ElementRef;
  viewFullScreenCheck: any;
  userId: any;
  userPass: any;
  storeSummaryMainData: any;
  storeFullScreen: any;
  readLookupData: any;
  storeCheck: any;
  loadingMain = true;
  isMainLoading =true
  modalWidth: any;
  readFormName: any;
  sendFullScreenCheck: boolean;
  summaryDashboardData: any;
  summaryDashboardDataFetch: any;
  page: number = 1; // current page
  totalRecords: number = 0; // total number of records
  displayedRecords: number = 0; // number of records on the current page
  startRecord: number = 1; // start record on current page
  endRecord: number = 10; 
  totalPages: number = 3;  
  pageNumbers: number[] = [];
  minitableDataTile1: any;
  responseRowData1: any;
  mainFilterCon: any;
  mainFilterCondition: any;
  filterMainConditions: any;
  minitableDataChart1: any;
  minitableDataChart3: any;
  paginationDataStore: any[];
  minitableDataFunnelChart: any;
  minitableDataStacked: any;

  createPieChart() {
    const chartOptions: any = {
      chart: {
        inverted: false,
        type: 'pie',
        // Set the chart height
      },
      title: {
        text: 'Donut Chart',
      },
      legend: {
        enabled: false,  // Hide the legend
      },
      yAxis: {
        gridLineWidth: 0,
      },
      plotOptions: {
        pie: {
          innerSize: '50%',  // This creates the donut shape by setting the inner size
          cursor: null,  // Hide pointer cursor
          dataLabels: {
            enabled: false,  // Disable data labels
          },
          showInLegend: false,  // Hide slices in legend
        },
      },
      credits: {
        enabled: false,
      },
      exporting: {
        enabled: false,
      },
      series: [
        {
          data: [
            {
              name: 'Sales',
              y: 30,
            },
            {
              name: 'Marketing',
              y: 20,
            },
            {
              name: 'Development',
              y: 25,
            },
            {
              name: 'Customer Support',
              y: 15,
            },
            {
              name: 'Research',
              y: 10,
            },
            {
              name: 'HR',
              y: 10,
            },
          ],
        },
      ],
    };
  
    Highcharts.chart('pieChart', chartOptions);
  }

  createSemiDonut(){
    const chartOptions: any = {
      chart: {
        inverted: false,
        type: 'pie',
        // Set the chart height
      },
      title: {
        text: 'Semi Donut Chart',
      },
      legend: {
        enabled: false,  // Hide the legend
      },
      yAxis: {
        gridLineWidth: 0,
      },
      plotOptions: {
        pie: {
          innerSize: '50%', // Makes it a donut chart
          startAngle: -90, // Starts the chart at the top
          endAngle: 90, // Ends at the halfway point
          slicedOffset: 20,  // This creates the donut shape by setting the inner size
          cursor: null,  // Hide pointer cursor
          dataLabels: {
            enabled: false,  // Disable data labels
          },
          showInLegend: false,  // Hide slices in legend
        },
      },
      credits: {
        enabled: false,
      },
      exporting: {
        enabled: false,
      },
      series: [
        {
          data: [
            ['Chrome', 60],
            ['Edge', 15],
            ['Firefox', 10],
            ['Safari', 8],
            ['Others', 7]
          ]
        },
      ],
    };
  
    Highcharts.chart('semiDonut', chartOptions);

  }
  ngOnChanges() {
    this.setCheck();
  }

  createFunnelChart() {
    const chartOptions: any = {
      chart: {
        type: 'funnel',
      },
      title: {
        text: 'Sales Funnel',
      },
      plotOptions: {
        series: {
          dataLabels: {
            enabled: true,
            format: '<b>{point.name}</b> ({point.y:,.0f})',
            softConnector: true,
          },
          center: ['40%', '50%'],
          neckWidth: '30%',
          neckHeight: '25%',
          width: '80%',
        },
      },
      legend: {
        enabled: false,
      },
      series: [
        {
          name: 'Unique Users',
          data: [
            ['Website visits', 15654],
            ['Downloads', 4064],
            ['Requested price list', 1987],
            ['Invoice sent', 976],
            ['Finalized', 846],
          ],
        },
      ],
    };


      Highcharts.chart('funnelChart', chartOptions);
  // Delay to ensure the DOM is ready
  }
  
  
  createLineChart(){

    const linechartOptions: any = {
      chart: {
        type: 'line' // Line chart type
    },
    title: {
        text: 'Line Chart'
    },
    subtitle: {
        text: ''
    },
    xAxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    },
    yAxis: {
        title: {
            text: 'Sales (in USD)'
        }
    },
    tooltip: {
        pointFormat: '{series.name}: <b>{point.y}</b>'
    },
    series: [{
        name: 'Product A',
        data: [100, 120, 150, 180, 200, 220, 250, 270, 300, 320, 350, 400]
    }, {
        name: 'Product B',
        data: [80, 90, 110, 140, 160, 180, 210, 230, 250, 270, 290, 350]
    }],
    credits: {
      enabled: false,
    },
    };
  Highcharts.chart('lineChart', linechartOptions);
  }
  onGridReady(params: any): void {
    this.gridApi = params.api; // Initialize Grid API
    this.gridColumnApi = params.columnApi; // Initialize Column API
    params.api.sizeColumnsToFit(); 
    //console.log('Grid API initialized:', this.gridApi); // Debugging
  }
  

  createBarChart() {
    const barchartOptions: any = {
      chart: {
        type: 'column'  // Change 'bar' to 'column' for vertical bars
      },
      title: {
        text: 'Column Chart'
      },
      xAxis: {
        categories: ['Category 1', 'Category 2', 'Category 3', 'Category 4']
      },
      yAxis: {
        title: {
          text: 'Values'
        }
      },
      series: [{
        name: 'Data Series 1',
        data: [1, 3, 2, 4]
      }, {
        name: 'Data Series 2',
        data: [2, 4, 3, 5]
      }, {
        name: 'Data Series 3',
        data: [3, 2, 4, 6]
      }],
      credits: {
        enabled: false
      }
    };
    Highcharts.chart('barChart', barchartOptions);
  }



  createMixedChart(){
    const barchartOptions: any = {
      chart: {
        type: 'line'  // Default chart type for line series
    },
    title: {
        text: 'Mixed Chart with Dual X-Axis'
    },
    xAxis: [{
      categories: ['CHILLER', 'HEAT PU', 'PAC', 'AHU'],
  // Region Labels
      title: {
          text: 'Region'
      },
      gridLineWidth: 0,  // Remove gridlines between categories
      labels: {
          style: {
              fontSize: '12px'
          }
      }
  }, {
    categories: ['East', 'North', 'South', 'West'], // Unit Type Labels
      title: {
          text: 'Unit Type'
      },
      gridLineWidth: 0,  // Remove gridlines between this axis
      labels: {
          style: {
              fontSize: '12px'
          },
          y: 15  // Adjust label positioning to avoid overlap with the first x-axis
      },
      linkedTo: 0 // Link to the first axis to align the ticks properly
  }],
  
    yAxis: [{
        title: {
            text: 'Total Tonnage (TR)'
        }
    }, {
        title: {
            text: 'No of Units'
        },
        opposite: false
    }],
    series: [{
      name: 'Units',
      data: [20, 30, 40, 50],
      type: 'column',
  }, {
      name: 'Tonnage',
      data: [50, 60, 70, 80],
      type: 'line',
      yAxis: 1
  }],
    tooltip: {
        shared: true,
        crosshairs: true
    }
}
Highcharts.chart('MixedChart', barchartOptions);
  }

  createAreaChart() {
    const areachartOptions: any = {
      chart: {
        type: 'area'
      },
      title: {
        text: 'Area Chart'
      },
      subtitle: {
        text: ''
      },
      xAxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul']
      },
      yAxis: {
        title: {
          text: 'Values'
        }
      },
      tooltip: {
        pointFormat: '{series.name}: <b>{point.y}</b>'
      },
      series: [{
        name: 'Data Series',
        data: [1, 3, 2, 4, 6, 5, 7]
      }],

      credits: {
        enabled: false
      }
    };
    Highcharts.chart('areaChart', areachartOptions);
  }
  
  createCalumnChart() {
    const barchartOptions: any = {
      chart: {
        type: 'bar'  // Change 'bar' to 'column' for vertical bars
      },
      title: {
        text: 'Side Bar Chart'
      },
      xAxis: {
        categories: ['Category 1', 'Category 2', 'Category 3', 'Category 4']
      },
      yAxis: {
        title: {
          text: 'Values'
        }
      },
      series: [{
        name: 'Data Series 1',
        data: [1, 3, 2, 4]
      }, {
        name: 'Data Series 2',
        data: [2, 4, 3, 5]
      }, {
        name: 'Data Series 3',
        data: [3, 2, 4, 6]
      }],
      credits: {
        enabled: false
      }
    };
    Highcharts.chart('columnChart', barchartOptions);
  }


  title = 'Column Chart with Table';

  // Column chart setup
  createCalumnWithTableChart() {
    // Prepare x-axis categories from the row data
    const categories = ['LEADS CREATED', 'CONVERTED TO POTENTIAL', 'DEALS WON'];
  
    // Prepare series data from the row data
    const seriesData = this.rowData.map((row) => ({
      name: row.activityType,  // Activity Type (e.g., Task, Event, Call)
      data: [row.leadsCreated, row.convertedToPotential, row.dealsWon], // Data for each category
    }));
  
    const barchartOptions: any = {
      chart: {
        type: 'column', // Column chart for vertical bars
      },
      title: {
        text: 'Lead Conversion Funnel',
      },
      xAxis: {
        categories: categories, // Set categories to stages of conversion
      },
      yAxis: {
        title: {
          text: 'Values',
        },
      },
      series: seriesData, // Pass the series data dynamically
      credits: {
        enabled: false, // Disable the Highcharts credits
      },
      legend: {
        enabled: false, // Hide the legend
      },
      plotOptions: {
        column: {
          dataLabels: {
            enabled: false, // Disable data labels on columns
            style: {
              fontSize: '12px', // Adjust font size of data labels
            },
          },
        },
      },
    };
  
    // Render the chart in the 'barwithTable' div
    Highcharts.chart('barwithTable', barchartOptions);
  }
  
  


  // AG-Grid column definitions
  columnDefs: ColDef[] = [
    { headerName: 'Activity Type', field: 'activityType' },
    { headerName: 'Leads Created', field: 'leadsCreated' },
    { headerName: 'Converted to Potential', field: 'convertedToPotential' },
    { headerName: 'Deals Won', field: 'dealsWon' },
    { headerName: 'Conversion Rate', field: 'conversionRate' },
  ];

  // AG-Grid row data
  rowData = [
    { activityType: 'Task', leadsCreated: 10, convertedToPotential: 1, dealsWon: 1, conversionRate: '10.0%' },
    { activityType: 'Event', leadsCreated: 105, convertedToPotential: 29, dealsWon: 20, conversionRate: '19.0%' },
    { activityType: 'Call', leadsCreated: 413, convertedToPotential: 47, dealsWon: 41, conversionRate: '9.9%' },
    { activityType: 'None', leadsCreated: 984, convertedToPotential: 126, dealsWon: 118, conversionRate: '12.0%' },
  ];


  createPieChart1() {
    const chartOptions: any = {
      chart: {
        inverted: false,
        type: 'pie',
        // Set the chart height
      },
      title: {
        text: 'Pie Chart',
      },
      legend: {
        enabled: false,  // Hide the legend
      },
      yAxis: {
        gridLineWidth: 0,
      },
      plotOptions: {
        pie: {
          innerSize: '0%',  // This creates the donut shape by setting the inner size
          cursor: null,  // Hide pointer cursor
          dataLabels: {
            enabled: false,  // Disable data labels
          },
          showInLegend: false,  // Hide slices in legend
        },
      },
      credits: {
        enabled: false,
      },
      exporting: {
        enabled: false,
      },
      series: [
        {
          data: [
            {
              name: 'Sales',
              y: 30,
            },
            {
              name: 'Marketing',
              y: 20,
            },
            {
              name: 'Development',
              y: 25,
            },
            {
              name: 'Customer Support',
              y: 15,
            },
            {
              name: 'Research',
              y: 10,
            },
            {
              name: 'HR',
              y: 10,
            },
          ],
        },
      ],
    };
  
    Highcharts.chart('pieChartOfficial', chartOptions);
  }



  createStackedChart1() {
    const chartOptions: any = {
      chart: {
        type: 'bar', // Use 'bar' for horizontal stacked bar, 'column' for vertical
        backgroundColor: 'var(--bs-body-bg)',
      },
      title: {
        text: 'Stacked Bar Chart',
        style: {
          color: 'var(--bs-body-color)',
        },
      },
      tooltip: {
        pointFormat: '{series.name}: <b>{point.y}</b>',
      },
      exporting: {
        enabled: false,
      },
      credits: {
        enabled: false,
      },
      xAxis: {
        categories: [], // Add your categories dynamically
        title: {
          text: null,
        },
        labels: {
          style: {
            color: 'var(--bs-body-color)',
          },
        },
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Total Value',
          align: 'high',
        },
        labels: {
          overflow: 'justify',
          style: {
            color: 'var(--bs-body-color)',
          },
        },
        gridLineDashStyle: 'dash',
      },
      legend: {
        enabled: true,
        layout: 'horizontal',
        align: 'center',
        verticalAlign: 'bottom',
      },
      plotOptions: {
        series: {
          stacking: 'normal', // 'normal' for stacked bars, 'percent' for percentage stacked
          dataLabels: {
            enabled: true,
            format: '{point.y}', // Show values on bars
            style: {
              fontSize: '1em',
              textOutline: 'none',
            },
          },
        },
      },
      series: [
        {
          name: 'Product A',
          data: [50, 70, 80, 90], // Sales data for Product A
          color: '#FF5733',
        },
        {
          name: 'Product B',
          data: [30, 50, 60, 70], // Sales data for Product B
          color: '#33FF57',
        },
        {
          name: 'Product C',
          data: [20, 30, 50, 60], // Sales data for Product C
          color: '#3357FF',
        },
      ],
    };
  
    Highcharts.chart('stackedChart', chartOptions);
  }








  createDailChart() {
    const chartOptions: any = {
      chart: {
        type: 'gauge'
      },
      title: {
        text: 'Speedometer'
      },
      pane: {
        startAngle: -150,
        endAngle: 150,
        background: [{
     
          innerRadius: '60%',
          outerRadius: '100%',
          shape: 'arc'
        }]
      },
      tooltip: {
        enabled: false
      },
      yAxis: {
        min: 0,
        max: 200,
        lineWidth: 0,
        tickInterval: 20,
        minorTickInterval: 'auto',
        tickColor: '#aaa',
        labels: {
          distance: -30,
          rotation: 'auto'
        },
        title: {
          text: 'Speed'
        },
        plotBands: [{
          from: 0,
          to: 120,
          color: '#55BF3B' // green
        }, {
          from: 120,
          to: 160,
          color: '#DDDF0D' // yellow
        }, {
          from: 160,
          to: 200,
          color: '#DF5353' // red
        }]
      },
      series: [{
        name: 'Speed',
        data: [80], // This is the value to be displayed on the dial
        tooltip: {
          valueSuffix: ' km/h'
        }
      }]
    };
  
    Highcharts.chart('DailChart', chartOptions);
  }
  // @HostListener('window:scroll', ['$event'])
  // onWindowScroll(event: Event) {
  //   this.showMenuForTimeout();
  // }

  // // Listen to touchstart events on document
  // @HostListener('document:touchstart', ['$event'])
  // onTouchStart(event: Event) {
  //   this.showMenuForTimeout();
  // }

  // // Listen to mousemove events on document
  // @HostListener('document:mousemove', ['$event'])
  // onMouseMove(event: MouseEvent) {
  //   this.showMenuForTimeout();
  // }

  // Method to show the menu for 3 seconds whenever there's an event
  showMenuForTimeout() {
    this.disableMenuQP = false; // Show the menu
    this.cdr.detectChanges();  // Ensure that changes are reflected immediately

    setTimeout(() => {
      this.disableMenuQP = true; // Hide the menu after 3 seconds
      this.cdr.detectChanges();  // Ensure that changes are reflected
    }, 3000);
  }

  
  


  defaultColDef = {
    resizable: true, // Allow columns to be resized
    sortable: true, // Enable sorting
    filter: true, // Enable filtering
  };
  openTileModal() {
    const modalElement = this.tileModal.nativeElement;
    const modalInstance = new Modal(modalElement, { backdrop: 'static', keyboard: false });
    modalInstance.show();
  }
  handleChartIds(ids: string[]) {
    this.chartIdsFromChild1 = ids;
    let dialIDobj = []
    dialIDobj.push(this.chartIdsFromChild1);
    ////console.log('life obh',dialIDobj);


  }

  


  tooltip: string | null = null;
  chartType: string = 'solidgauge';

  options: any;
  dashboard: any[] = []; // Initialize an empty array for the dashboard items
  all_Packet_store: any;
  iconUploadError: string | null = null;
  iconsList: any = [
    { value: 'toggle-on', label: 'Toggle On', class1: "fs-2x text-danger", class2: "symbol-label bg-light-danger" },
    { value: 'toggle-on-circle', label: 'Toggle On Circle', class1: "fs-2x text-success", class2: "symbol-label bg-light-success" },
    { value: 'toggle-off', label: 'Toggle Off', class1: "fs-2x text-warning", class2: "symbol-label bg-light-warning" },
    { value: 'category', label: 'Category', class1: "fs-2x text-primary", class2: "symbol-label bg-light-primary" },
    { value: 'setting', label: 'Setting', class1: "fs-2x text-info", class2: "symbol-label bg-light-info" },
    { value: 'toggle-off-circle', label: 'Toggle Off Circle', class1: "fs-2x text-danger", class2: "symbol-label bg-light-danger" },
    { value: 'more-2', label: 'More 2', class1: "fs-2x text-dark", class2: "symbol-label bg-light-dark" },
    { value: 'setting-4', label: 'Setting 4', class1: "fs-2x text-success", class2: "symbol-label bg-light-success" },
    { value: 'setting-2', label: 'Setting 2', class1: "fs-2x text-warning", class2: "symbol-label bg-light-warning" },
    { value: 'setting-3', label: 'Setting 3', class1: "fs-2x text-primary", class2: "symbol-label bg-light-primary" },
    { value: 'eraser', label: 'Eraser', class1: "fs-2x text-info", class2: "symbol-label bg-light-info" },
    { value: 'paintbucket', label: 'Paintbucket', class1: "fs-2x text-danger", class2: "symbol-label bg-light-danger" },
    { value: 'add-item', label: 'Add Item', class1: "fs-2x text-success", class2: "symbol-label bg-light-success" },
    { value: 'design-2', label: 'Design 2', class1: "fs-2x text-dark", class2: "symbol-label bg-light-dark" },
    { value: 'brush', label: 'Brush', class1: "fs-2x text-info", class2: "symbol-label bg-light-info" },
    { value: 'size', label: 'Size', class1: "fs-2x text-warning", class2: "symbol-label bg-light-warning" },
    { value: 'design', label: 'Design', class1: "fs-2x text-primary", class2: "symbol-label bg-light-primary" },
    { value: 'copy', label: 'Copy', class1: "fs-2x text-danger", class2: "symbol-label bg-light-danger" },
    { value: 'text', label: 'Text', class1: "fs-2x text-success", class2: "symbol-label bg-light-success" },
    { value: 'design-frame', label: 'Design Frame', class1: "fs-2x text-dark", class2: "symbol-label bg-light-dark" },
    { value: 'bucket', label: 'Bucket', class1: "fs-2x text-info", class2: "symbol-label bg-light-info" },
    { value: 'glass', label: 'Glass', class1: "fs-2x text-warning", class2: "symbol-label bg-light-warning" },
    { value: 'feather', label: 'Feather', class1: "fs-2x text-danger", class2: "symbol-label bg-light-danger" },
    { value: 'pencil', label: 'Pencil', class1: "fs-2x text-success", class2: "symbol-label bg-light-success" },
    { value: 'colors-square', label: 'Colors Square', class1: "fs-2x text-primary", class2: "symbol-label bg-light-primary" },
    { value: 'design-mask', label: 'Design Mask', class1: "fs-2x text-info", class2: "symbol-label bg-light-info" },
    { value: 'bucket-square', label: 'Bucket Square', class1: "fs-2x text-dark", class2: "symbol-label bg-light-dark" },
    { value: 'copy-success', label: 'Copy Success', class1: "fs-2x text-success", class2: "symbol-label bg-light-success" },
    { value: 'color-swatch', label: 'Color Swatch', class1: "fs-2x text-danger", class2: "symbol-label bg-light-danger" },
    { value: 'instagram', label: 'Instagram', class1: "fs-2x text-info", class2: "symbol-label bg-light-info" },
    { value: 'snapchat', label: 'Snapchat', class1: "fs-2x text-warning", class2: "symbol-label bg-light-warning" },
    { value: 'classmates', label: 'Classmates', class1: "fs-2x text-primary", class2: "symbol-label bg-light-primary" },
    { value: 'facebook', label: 'Facebook', class1: "fs-2x text-success", class2: "symbol-label bg-light-success" },
    { value: 'whatsapp', label: 'WhatsApp', class1: "fs-2x text-danger", class2: "symbol-label bg-light-danger" },
    { value: 'social-media', label: 'Social Media', class1: "fs-2x text-info", class2: "symbol-label bg-light-info" },
    { value: 'youtube', label: 'YouTube', class1: "fs-2x text-dark", class2: "symbol-label bg-light-dark" },
    { value: 'dribbble', label: 'Dribbble', class1: "fs-2x text-primary", class2: "symbol-label bg-light-primary" },
    { value: 'twitter', label: 'Twitter', class1: "fs-2x text-success", class2: "symbol-label bg-light-success" },
    { value: 'tiktok', label: 'TikTok', class1: "fs-2x text-danger", class2: "symbol-label bg-light-danger" }
    // { value: 'abstract-33', label: 'Abstract 33', class1: "fs-2x text-danger", class2:"symbol-label bg-light-danger"},
    // { value: 'abstract-27', label: 'Abstract 27', class1: "fs-2x text-success" ,class2:"symbol-label bg-light-success" },
    // { value: 'abstract-25', label: 'Abstract 25', class1: "fs-2x text-warning", class2: "symbol-label bg-light-warning" },
    //   { value: 'abstract-19', label: 'Abstract 19', class1: "fs-2x text-success", class2: "symbol-label bg-light-success" },
    //   { value: 'abstract-21', label: 'Abstract 21', class1: "fs-2x text-primary", class2: "symbol-label bg-light-primary" },
    //   { value: 'abstract-35', label: 'Abstract 35', class1: "fs-2x text-secondary", class2: "symbol-label bg-light-secondary" },
    //   { value: 'abstract-34', label: 'Abstract 34', class1: "fs-2x text-dark", class2: "symbol-label bg-light-dark" },
    //   { value: 'abstract-20', label: 'Abstract 20', class1: "fs-2x text-muted", class2: "symbol-label bg-light-muted" },
    //   { value: 'abstract-36', label: 'Abstract 36', class1: "fs-2x text-success", class2: "symbol-label bg-light-success" },
    //   { value: 'abstract-22', label: 'Abstract 22', class1: "fs-2x text-danger", class2: "symbol-label bg-light-danger" },
    //   { value: 'abstract-23', label: 'Abstract 23', class1: "fs-2x text-info", class2: "symbol-label bg-light-info" },
    //   { value: 'abstract-37', label: 'Abstract 37', class1: "fs-2x text-warning", class2: "symbol-label bg-light-warning" },
    //   { value: 'abstract-44', label: 'Abstract 44', class1: "fs-2x text-primary", class2: "symbol-label bg-light-primary" },
    //   { value: 'abstract', label: 'Abstract', class1: "fs-2x text-secondary", class2: "symbol-label bg-light-secondary" },
    //   { value: 'abstract-45', label: 'Abstract 45', class1: "fs-2x text-dark", class2: "symbol-label bg-light-dark" },
    //   { value: 'abstract-47', label: 'Abstract 47', class1: "fs-2x text-muted", class2: "symbol-label bg-light-muted" },
    //   { value: 'abstract-46', label: 'Abstract 46', class1: "fs-2x text-danger", class2: "symbol-label bg-light-danger" },
    //   { value: 'abstract-42', label: 'Abstract 42', class1: "fs-2x text-info", class2: "symbol-label bg-light-info" },
    //   { value: 'abstract-43', label: 'Abstract 43', class1: "fs-2x text-warning", class2: "symbol-label bg-light-warning" },
    //   { value: 'abstract-41', label: 'Abstract 41', class1: "fs-2x text-success", class2: "symbol-label bg-light-success" },
    //   { value: 'abstract-40', label: 'Abstract 40', class1: "fs-2x text-primary", class2: "symbol-label bg-light-primary" },
    //   { value: 'abstract-27', label: 'Abstract 27', class1: "fs-2x text-secondary", class2: "symbol-label bg-light-secondary" },
    // { value: 'abstract-26', label: 'Abstract 26', class: `ki-duotone ki-abstract-26 ${this.getRandomColor()}` },
    // { value: 'abstract-32', label: 'Abstract 32', class: `ki-duotone ki-abstract-32 ${this.getRandomColor()}` },
    // { value: 'abstract-18', label: 'Abstract 18', class: `ki-duotone ki-abstract-18 ${this.getRandomColor()}` },
    // { value: 'abstract-24', label: 'Abstract 24', class: `ki-duotone ki-abstract-24 ${this.getRandomColor()}` },
    // { value: 'abstract-30', label: 'Abstract 30', class: `ki-duotone ki-abstract-30 ${this.getRandomColor()}` },
    // { value: 'abstract-8', label: 'Abstract 8', class: `ki-duotone ki-abstract-8 ${this.getRandomColor()}` },
    // Add more icons as needed...
  ];


  // options: GridsterConfig;
  // dashboard: Array<GridsterItem>;
  @Output() redirection = new EventEmitter<any>()
  reloadEvent: EventEmitter<boolean> = new EventEmitter();
  private modalRef: NgbModalRef | null = null;  // Reference to NgbModal

  // @ViewChild('closeSummary') closeSummary: any;
  getLoggedUser: any;
  SK_clientID: any;
  showModal: boolean;
  createSummaryField: FormGroup;
  createKPIWidget2: FormGroup;
  createKPIWidget: FormGroup;
  createKPIWidget5: FormGroup;
  createKPIWidget6: FormGroup;
  createTitle: FormGroup
  errorForUniqueID: string | null = null;
  errorForUniqueName: string | null = null;
  errorForMobile: any;
  errorForInvalidEmail: string;
  showHeading: any = false;
  summarySK: any;
  allCompanyDetails: any;
  defaultLocation: any = {};
  previewObjDisplay: any = null;
  datatableConfig: Config = {};
  lookup_data_summary: any = [];

  listofSK: any;

  hideUpdateButton: any = false;
  maxlength: number = 500;
  listofClientIDs: any = [];
  lookup_data_client: any = [];
  columnDatatable: any = [];
  clientID: any;
  dataform: any = [];
  editButtonCheck: any = false
  columnTableData: any = [];
  routeId: string | null;
  createdTime: any;
  createdUserName: any;
  updatedUserName: any;
  lookup_data_summary1: any[] = [];

  lookup_data_summaryCopy: any[] = []
  selectedIcon: string;
  formList: any;
  listofDeviceIds: any;
  userdetails: any;
  userClient: string;
  All_button_permissions: boolean | undefined;
  metadataObject: any;
  temp: any;
  originalData: any;
  parentID_selected_node: any;
  final_list: any;

  enableDeviceButton: boolean;
  activeTab: Tabs = 'Board';
  enableLocationButton: any = false;
  selectedTab: string = 'add-dashboard';
  // dropdownSettings: IDropdownSettings = {};
  multiselectDevice: any = [];
  multiselectDevice_text: any = [];
  isModalOpen = false;
  selectedGroupByValue: any;
  displayLabel: string = '';


  showAddWidgetsTab = false;
  selectedTile: any;
  showGrid = false;
  selectedValue: string;
  selectedModalValue: string;
  selectedDropdown: any;
  createKPIWidget1: FormGroup;
  grid_details: any[];
  summaryDashboard: any[] = [];
  getWorkFlowDetails: any;
  listofDynamicParam: any;
  isHovered: boolean = false;
  isEditMode: boolean = true; // Initially set to false for add mode
  currentItem: any;
  private editTileIndex: number | null = null;
  private widgetIdCounter = 0;

  isMenuOpen: boolean ; // Tracks dropdown menu state
  @ViewChild(MatMenuTrigger) triggerBtn: MatMenuTrigger;
  allUpdateTile: { summaryID: any; summaryName: any; summaryDesc: any; summaryIcon: any; updated: Date; createdUser: any; };
  groupByFormat: any;
  editTileIndex1: number | null;
  editTileIndex2: number | null;
  createKPIWidget3: FormGroup;
  editTileIndex3: number | null;
  editTileIndex4: number | null;
  createKPIWidget4: FormGroup
  editTileIndex5: number | null;
  editTileIndex6: number | null;
  showIdField = false;
  gridChanged: boolean = false;
  selectedTabset: string = 'dataTab';
  @ViewChild('bulletChart') bulletChart: ElementRef;
  isGirdMoved: boolean = false
  isGridDuplicated: boolean = true; 
  summaryDashboardUpdate = false;
 hidingLink = false

 isValidID: boolean = true;
 isDashboardConfigured: boolean = true;

 isFullScreen:boolean =false;
//  isFullScreenFinal:boolean =false;
//  // Track the fullscreen state

  isFullView = false;   // Track if the icon is in full view mode

  isLoading = false; // Add loading state


  isPinned = false;


  showToolbar = false; // Initially hidden



  

  toggleToolbar() {
    this.showToolbar = !this.showToolbar; // Toggle visibility
  }
  @ViewChild('modalContent') modalContent!: TemplateRef<any>;
  iframeUrl!: SafeResourceUrl;

  async reloadPage(key:any,permissionfromOnInit?:any) {
  //   if (key === "from_ts") {
  //     this.isLoading = true; 

  //     try {
  //       this.spinner.show('dataProcess')
  //         // ✅ Ensure we await the resolved value of permissionfromOnInit
  //         const resolvedPermission = await permissionfromOnInit;
          
  //         //console.log("✅ Resolved permissionfromOnInit check:", resolvedPermission);

  //         // ✅ Extract values safely after resolving the Promise
  //         const permissionId = resolvedPermission?.permissionId || "";
  //         const permissionList = resolvedPermission?.readFilterEquationawait || [];
  //         //console.log('permissionList check',permissionList)
  //         const apiUrl = 'https://1vbfzdjly6.execute-api.ap-south-1.amazonaws.com/stage1';

  //         // ✅ Construct the request body
  //         const requestBody = {
  //             body: JSON.stringify({
  //                 clientId: this.SK_clientID,
  //                 routeId: this.routeId,
  //                 permissionId: permissionId,  // Extracted from resolved data
  //                 permissionList: permissionList, // Extracted from advance_report
  //                 userName: this.userdetails
  //             }),
  //         };

  //         //console.log("🚀 Final requestBody: liveTrigger", requestBody);
  //         this.http.post(apiUrl, requestBody).subscribe(
  //           (response: any) => {
  //             //console.log('Lambda function triggered successfully:', response);
          
  //             // Ensure response status is 200 before processing
  //             if (response?.statusCode === 200) {
  //               try {
  //                 const constLiveData = JSON.parse(response.body); // Parse the JSON body
  //                 //console.log('constLiveData check', constLiveData);
          
  //                 // Ensure Processed_Data exists in response
  //                 if (constLiveData?.Processed_Data?.metadata?.grid_details) {
  //                   const processedData = constLiveData.Processed_Data.metadata.grid_details;
  //                   //console.log('processedData check liveData', processedData);
  //                   this.summaryService.updatelookUpData(processedData)

  //                 } else {
  //                   console.error('Processed_Data.metadata.grid_details not found in response');
  //                   Swal.fire({
  //                     title: 'Error!',
  //                     text: 'No data found in response. Please check the input.',
  //                     icon: 'error',
  //                     confirmButtonText: 'OK'
  //                   });
  //                 }
  //               } catch (error) {
  //                 console.error('Error parsing response body:', error);
  //                 Swal.fire({
  //                   title: 'Error!',
  //                   text: 'Invalid response format received.',
  //                   icon: 'error',
  //                   confirmButtonText: 'OK'
  //                 });
  //               }
  //             } else {
  //               console.error('Unexpected statusCode:', response?.statusCode);
  //               Swal.fire({
  //                 title: 'Error!',
  //                 text: `Unexpected response received (Status Code: ${response?.statusCode}).`,
  //                 icon: 'error',
  //                 confirmButtonText: 'OK'
  //               });
  //             }
          
  //             setTimeout(() => {
  //               this.spinner.hide('dataProcess');
  //               this.isLoading = false; 
                
  //             }, 500); // Reset loading state
  //         if(key="from_ts"){
  //           this.route.paramMap.subscribe(params => {
  //             this.routeId = params.get('id');
  //             if (this.routeId) {
  //               // this.openModalHelpher(this.routeId);
  //               this.editButtonCheck = true;
  //             }
  //           });
  //         }
  //             // Proceed with route parameter handling
         
  //           },
  //           (error) => {
  //             console.error('Error triggering Lambda function:', error);
          
  //             // Handle different error codes
  //             if (error.status === 404) {
  //               //console.log('Received 404 error - stopping loading and showing error message.');
  //               Swal.fire({
  //                 title: 'Error!',
  //                 text: 'Data not found. Please check your inputs and try again.',
  //                 icon: 'error',
  //                 confirmButtonText: 'OK'
  //               });
  //             } else {
  //               Swal.fire({
  //                 title: 'Error!',
  //                 text: 'Failed to trigger the Lambda function. Please try again.',
  //                 icon: 'error',
  //                 confirmButtonText: 'OK'
  //               });
  //             }
          
  //             this.spinner.hide('dataProcess');
  //             this.isLoading = false; // Ensure loading is stopped in all error cases
  //           }
  //         );
        

  //     } catch (error) {
  //         console.error("❌ Error resolving permissionfromOnInit:", error);
  //         return null; // Return null in case of failure
  //     }
  // }



  if (key === "from_ts") {
    this.isLoading = true;
  
    try {
      this.spinner.show('dataProcess');
  
      // ✅ Timeout logic – triggers after 2 minutes if no response
      const lambdaTimeout = setTimeout(() => {
        console.error('⚠️ Lambda function timed out after 2 minutes.');
        Swal.fire({
          title: 'Error!',
          text: 'Failed to trigger the Lambda function. Please try again.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
        this.spinner.hide('dataProcess');
        this.isLoading = false;
      }, 120000); // 2 minutes
  
      // ✅ Await permission
      const resolvedPermission = await permissionfromOnInit;
      //console.log("✅ Resolved permissionfromOnInit check:", resolvedPermission);
  
      const permissionId = resolvedPermission?.permissionId || "";
      const permissionList = resolvedPermission?.readFilterEquationawait || [];
      ////console.log('permissionList check', permissionList);
  
      const apiUrl = 'https://1vbfzdjly6.execute-api.ap-south-1.amazonaws.com/stage1';
  
      const requestBody = {
        body: JSON.stringify({
          clientId: this.SK_clientID,
          routeId: this.routeId,
          permissionId: permissionId,
          permissionList: permissionList,
          userName: this.userdetails
        }),
      };
  
      ////console.log("🚀 Final requestBody: liveTrigger", requestBody);
  
      this.http.post(apiUrl, requestBody).subscribe(
        (response: any) => {
          clearTimeout(lambdaTimeout); // ✅ Clear timeout on success
          ////console.log('Lambda function triggered successfully:', response);
  
          if (response?.statusCode === 200) {
            try {
              const constLiveData = JSON.parse(response.body);
              ////console.log('constLiveData check', constLiveData);
  
              if (constLiveData?.Processed_Data?.metadata?.grid_details) {
                const processedData = constLiveData.Processed_Data.metadata.grid_details;
                ////console.log('processedData check liveData', processedData);
                setTimeout(() => {
                  this.summaryService.updatelookUpData(processedData);
                  
                }, 1000);
       
              } else {
                console.error('Processed_Data.metadata.grid_details not found in response');
                Swal.fire({
                  title: 'Error!',
                  text: 'No data found in response. Please check the input.',
                  icon: 'error',
                  confirmButtonText: 'OK'
                });
              }
            } catch (error) {
              console.error('Error parsing response body:', error);
              Swal.fire({
                title: 'Error!',
                text: 'Invalid response format received.',
                icon: 'error',
                confirmButtonText: 'OK'
              });
            }
          } else {
            console.error('Unexpected statusCode:', response?.statusCode);
            Swal.fire({
              title: 'Error!',
              text: `Unexpected response received (Status Code: ${response?.statusCode}).`,
              icon: 'error',
              confirmButtonText: 'OK'
            });
          }
  
          setTimeout(() => {
            this.spinner.hide('dataProcess');
            this.isLoading = false;
          }, 2000);
  
          // Optional route param logic
          if (key === "from_ts") {
            this.route.paramMap.subscribe(params => {
              this.routeId = params.get('id');
              if (this.routeId) {
                this.editButtonCheck = true;
              }
            });
          }
        },
        (error) => {
          clearTimeout(lambdaTimeout); // ✅ Clear timeout on error
          console.error('Error triggering Lambda function:', error);
  
          if (error.status === 404) {
            Swal.fire({
              title: 'Error!',
              text: 'Data not found. Please check your inputs and try again.',
              icon: 'error',
              confirmButtonText: 'OK'
            });
          } else {
            Swal.fire({
              title: 'Error!',
              text: 'Failed to trigger the Lambda function. Please try again.',
              icon: 'error',
              confirmButtonText: 'OK'
            });
          }
  
          this.spinner.hide('dataProcess');
          this.isLoading = false;
        }
      );
  
    } catch (error) {
      console.error("❌ Error resolving permissionfromOnInit:", error);
      this.spinner.hide('dataProcess');
      this.isLoading = false;
      return null;
    }
  }
  
  else if(key=='html'){
      this.isLoading = true; // Set loading state to true
      ////console.log('this.routeId check', this.routeId);
      ////console.log('client id check', this.SK_clientID);
      this.spinner.show('dataProcess')
  
  ////console.log('this.readFilterEquation checking',this.readFilterEquation)
    ////console.log('this.parsedPermission',this.parsedPermission)
    ////console.log('this.userdetails from request',this.userdetails)
      // Define the API Gateway URL
      const apiUrl = 'https://1vbfzdjly6.execute-api.ap-south-1.amazonaws.com/stage1';
    
      // Prepare the request body
      const requestBody = {
        body: JSON.stringify({
          clientId: this.SK_clientID,
          routeId: this.routeId,
          permissionId:this.permissionIdRequest,
          permissionList:this.readFilterEquation || [],
          userName:this.userdetails
  
  
  
        }),
      };
    
      ////console.log('requestBody checking', requestBody);
    
      // Send a POST request to the Lambda function with the body
      this.http.post(apiUrl, requestBody).subscribe(
        (response: any) => {
          ////console.log('Lambda function triggered successfully:', response);
      
          // Ensure response status is 200 before processing
          if (response?.statusCode === 200) {
            try {
              const constLiveData = JSON.parse(response.body); // Parse the JSON body
              ////console.log('constLiveData check', constLiveData);
      
              // Ensure Processed_Data exists in response
              if (constLiveData?.Processed_Data?.metadata?.grid_details) {
                const processedData = constLiveData.Processed_Data.metadata.grid_details;
                ////console.log('processedData check', processedData);
                if (this.all_Packet_store?.LiveDashboard === true ) {
      
                  ////console.log('this.all_Packet_store?.LiveDashboard from lambda',this.all_Packet_store?.LiveDashboard)
      this.liveDashboardDataFormat(processedData);
  }else{
  
  }
  
                // this.liveDashboardDataFormat(processedData);
              } else {
                console.error('Processed_Data.metadata.grid_details not found in response');
                Swal.fire({
                  title: 'Error!',
                  text: 'No data found in response. Please check the input.',
                  icon: 'error',
                  confirmButtonText: 'OK'
                });
              }
            } catch (error) {
              console.error('Error parsing response body:', error);
              Swal.fire({
                title: 'Error!',
                text: 'Invalid response format received.',
                icon: 'error',
                confirmButtonText: 'OK'
              });
            }
          } else {
            console.error('Unexpected statusCode:', response?.statusCode);
            Swal.fire({
              title: 'Error!',
              text: `Unexpected response received (Status Code: ${response?.statusCode}).`,
              icon: 'error',
              confirmButtonText: 'OK'
            });
          }
      
          this.spinner.hide('dataProcess');
          this.isLoading = false; // Reset loading state
      if(key="html"){
        this.route.paramMap.subscribe(params => {
          this.routeId = params.get('id');
          if (this.routeId) {
            this.openModalHelpher(this.routeId);
            this.editButtonCheck = true;
          }
        });
      }
          // Proceed with route parameter handling
     
        },
        (error) => {
          console.error('Error triggering Lambda function:', error);
      
          // Handle different error codes
          if (error.status === 404) {
            ////console.log('Received 404 error - stopping loading and showing error message.');
            Swal.fire({
              title: 'Error!',
              text: 'Data not found. Please check your inputs and try again.',
              icon: 'error',
              confirmButtonText: 'OK'
            });
          } else {
            Swal.fire({
              title: 'Error!',
              text: 'Failed to trigger the Lambda function. Please try again.',
              icon: 'error',
              confirmButtonText: 'OK'
            });
          }
      setTimeout(() => {
        this.spinner.hide('dataProcess');
        this.isLoading = false; 
        
      }, 500);
     // Ensure loading is stopped in all error cases
        }
      );

    }


    
  }
  @ViewChild('KPIModal', { static: false }) KPIModal: TemplateRef<any>;
  @ViewChild('KPIModal1', { static: false }) KPIModal1: TemplateRef<any>;
  @ViewChild('DynamicTileModal', { static: false }) DynamicTileModal: TemplateRef<any>;
  @ViewChild('dataTableModalTile1', { static: false }) dataTableModalTile1: TemplateRef<any>;
  @ViewChild('dataTableModalTile2', { static: false }) dataTableModalTile2: TemplateRef<any>;
  @ViewChild('dataTableModalDynamicTile', { static: false }) dataTableModalDynamicTile: TemplateRef<any>;
  @ViewChild('TitleModal', { static: false }) TitleModal: TemplateRef<any>;
  @ViewChild('htmlModal', { static: false }) htmlModal: TemplateRef<any>;
  

  receiveIframeUrl(receivedUrl:SafeResourceUrl){
    this.iframeSafeUrl = receivedUrl;
  }

  onItemClick(item: any, index: number, event: any): void {
    // this.isEditModeView = false
    this.FilterTileConfigComponent.isEditMode =true;
    this.FilterTileConfigComponent.openFilterModal(item, index);
    ////console.log('this.isEditModeView checling filter',this.isEditModeView)
    if (this.isEditModeView) {
      this.handleClick(item, index, event);
    }
  }

  onFilterClick(item: any, index: number, event: any){
    this.FilterTileConfigComponent.isEditMode =true;
    this.FilterTileConfigComponent.openFilterModal(item, index);

  }
  
  handleClick(item: any, i: number, event: MouseEvent) {
    this.FilterTileConfigComponent.isEditMode =true;

    // ////console.log('item is checking from handleclick',item)
    // ////console.log('index is checking from i',i)
    if (item.grid_type === 'filterTile') {
      if (this.summaryDashboardView && this.summaryDashboardUpdate || this.summaryDashboardUpdate){
        this.justReadStyles(item, i);
      }

   
    } else if (item.grid_type === 'tile') {
      if (this.isEditModeView && !this.hideButton && (this.summaryDashboardUpdate || this.summaryDashboardView)) {
        ////console.log('Triggering the function'); // Log to confirm condition
        this.invokeHelperDashboard(item, i, this.modalContent, this.dataTableModalTile1,this.htmlModal);
      } else {
        ////console.log('Condition not met'); // Log if the condition isn't met
      }
      
      // else if (!this.isEditModeView) {
      //   ////console.log('i am triggering helperTile')
      //   // this.helperTile($event, this.KPIModal);
      //   this.helperEditModalOpen(item,i,this.KPIModal)
      // }
    } 
    else if (item.grid_type === 'tile2') {
      if (this.isEditModeView && !this.hideButton) {
        this.invokeHelperDashboard(item, i, this.modalContent, this.dataTableModalTile2,this.htmlModal);
      } 

    } 


    else if (item.grid_type === 'tile3') {
      if (this.isEditModeView && !this.hideButton) {
        this.invokeHelperDashboard(item, i, this.modalContent, this.dataTableModalTile2,this.htmlModal);
      } 

    } 
    else if (item.grid_type === 'dynamicTile') {
      if (this.isEditModeView && !this.hideButton) {
        this.invokeHelperDashboard(item, i, this.modalContent, this.dataTableModalDynamicTile,this.htmlModal);
      }
      // else if (!this.isEditModeView) {
      //   ////console.log('i am triggering helperTile')
      //   // this.helperTile($event, this.KPIModal);
      //   this.helperEditModalOpen(item,i,this.DynamicTileModal)
      // }
    } else if (item.grid_type === 'title') {
      if (this.isEditModeView && !this.hideButton && (this.summaryDashboardUpdate || this.summaryDashboardView)) {
        this.invokeHelperDashboard(item, i, this.modalContent, this.TitleModal,this.htmlModal);
      }
    } else if (item.grid_type === 'progressTile') {
      if (this.isEditModeView && !this.hideButton) {
        this.invokeHelperDashboard(item, i, this.modalContent, '',this.htmlModal);
      }
    } 
    
    else if (item.grid_type === 'tileWithIcon') {
      if (this.isEditModeView && !this.hideButton) {
        this.invokeHelperDashboard(item, i, this.modalContent, '',this.htmlModal);
      }
      

    }

    else if(item.grid_type === 'chart'){

    }


  }
  
  setFullscreen(): void {
    localStorage.setItem('fullscreen', 'true');
    ////console.log('Fullscreen enabled');
}
liveFilterDataProcess(liveFilterData:any){
  ////console.log('liveFilterData from live check', liveFilterData);

  if (liveFilterData && liveFilterData.length > 0) {
    this.liveDataFilterCheck =  true
      this.summaryService.updatelookUpData(liveFilterData);
  } else {
      ////console.log('liveFilterData is empty, skipping update');
  }
  

  // this.summaryService.updatelookUpData(liveFilterData)
  this.liveDashboardDataFormat(liveFilterData)

}

liveDashboardDataFormat(processedData: any) {
  ////console.log('Processed Data:', processedData);

  let chartData: any = [];
  let tileData: any = [];
  let lineChart:any = [];
  let columnChart:any =[];
  let dynamicTile:any = [];
  let TableWidget:any =[];
  let MapWidget: any = [];

  processedData.forEach((packet: any) => {
    switch (packet.grid_type) {
      case "chart":
     
        ////console.log("Matched Chart Packet:", packet);
        chartData.push(packet);
        ////console.log('chartData after push',chartData)
  

        this.liveDataChart = chartData

        break;
      case "tile":
        ////console.log("Matched Tile Packet:", packet);
 
        tileData.push(packet);
        ////console.log('tileData after push',tileData)
    

 
        this.liveDataTile = tileData
        ////console.log('this.liveDataTile chec',this.liveDataTile)
        break;
        case "Linechart":
          ////console.log("Matched Tile Packet:", packet);
   
          lineChart.push(packet);
          ////console.log('lineChart after push',lineChart)
      
  
   
          this.liveDataLineChart = lineChart
          ////console.log('this.liveDataLineChart chec',this.liveDataLineChart)
          break;
          case "Columnchart":
            ////console.log("Matched Tile Packet:", packet);
     
            columnChart.push(packet);
            ////console.log('columnChart after push',columnChart)
        
    
     
            this.liveDataColumnChart = columnChart
            ////console.log('this.liveDataLineChart chec',this.liveDataLineChart)
            break;
            case "dynamicTile":
              ////console.log("Matched Tile Packet:", packet);
       
              dynamicTile.push(packet);
              ////console.log('dynamicTile after push',dynamicTile)
          
      
       
              this.liveDataDynamicTile = dynamicTile
              ////console.log('this.liveDataLineChart chec',this.liveDataDynamicTile)
              break;


              case "TableWidget":
                ////console.log("Matched Tile Packet:", packet);
         
                TableWidget.push(packet);
                ////console.log('TableWidget after push',TableWidget)
            
        
         
                this.liveDataTableTile = TableWidget
                ////console.log('this.liveDataLineChart chec',this.liveDataTableTile)
                break;
                case "Map":
                  ////console.log("Matched Tile Packet:", packet);
           
                  MapWidget.push(packet);
                  ////console.log('MapWidget after push',MapWidget)
              
          
           
                  this.liveDataMapTile = MapWidget
                  ////console.log('this.liveDataMapTile chec',this.liveDataTableTile)
                  break;


              


            

          

      default:
        console.warn("Unknown grid type:", packet.grid_type, "Packet:", packet);
        break;
    }
  });

  ////console.log("Final Chart Data:", chartData);
  ////console.log("Final Tile Data:", tileData);

  return { chartData, tileData };
}


checkAndSetFullscreen(receiveFullScreenCheck:any): void {
    const isFullscreen = receiveFullScreenCheck
    ////console.log('isFullscreen check:', isFullscreen);

    // Update the fullscreen state and related flags
    this.isFullscreen = isFullscreen;
    // this.isFullScreenFinal = receiveFullScreenCheck
    this.hidingLink = isFullscreen;
    this.toggleFullScreenFullView(isFullscreen);
    // if (isFullscreen) {
    //     this.toggleFullScreenFullView(true); // Enter fullscreen directly
    // } else {
    //     this.toggleFullScreenFullView(false); // Exit fullscreen
    // }
}
invokeHelperDashboard(item: any, index: number, template: any, modaref: any,htmlModalRef?:any): void {
  ////console.log('item check for switch case', item);

  const selectedType = item.selectType;
  const redirectionId = item.ModuleNames;

  ////console.log('selectedType checking', selectedType);
  ////console.log('modaref check', modaref);
  ////console.log('this.userId checking from redirectModal', this.userId);
  ////console.log('this.userPass checking from redirectModal', this.userPass);

  this.currentModalIndex = index;
  this.currentItem = item;

  // 🧠 If redirectionId is not 'Summary Dashboard', skip switch and default to redirect
  if (redirectionId !== 'Summary Dashboard') {
    this.redirectModule(item,htmlModalRef);
  } else {
    switch (selectedType) {
      case 'drill down':
        this.showDrillDownData(item, modaref);
        break;

      case 'NewTab':
      case 'Same page Redirect':
      case 'Modal':
        this.setModuleID(item, index, modaref,htmlModalRef);
        break;

      // case '':
      // case undefined:
      // case null:
      //   this.redirectModule(item);
      //   break;

      // default:
      //   this.redirectModule(item);
      //   break;
    }
  }

  // Set query params in localStorage
  const viewModeQP = true;
  const disableMenuQP = true;
  localStorage.setItem('viewMode', viewModeQP.toString());
  localStorage.setItem('disableMenu', disableMenuQP.toString());

  this.cdr.detectChanges();
}



// redirectModule(recieveItem: any) {
//   ////console.log('recieveItem check', recieveItem);
//   const moduleName = recieveItem.dashboardIds;
//   ////console.log('moduleName checking',moduleName)
//   let dashUrl = '/dashboard';
//   let projecturl = '/project-dashboard';
//   const selectedModule = recieveItem.ModuleNames;

//   ////console.log("I am triggered here", selectedModule);


//   switch (selectedModule) {
//     // case 'Dashboard - Group':
//     //   this.redirectionURL = dashUrl;
//     //   this.router.navigate([this.redirectionURL]).catch(err => console.error("Navigation error:", err));
//     //   this.dynamicIDArray = [];
//     //   break;
//     // case 'Project - Group':
//     //   this.redirectionURL = projecturl;
//     //   this.router.navigate([this.redirectionURL]).catch(err => console.error("Navigation error:", err));
//     //   this.dynamicIDArray = [];
//     //   break;
//     case 'Forms':
//       this.redirectionURL = `/view-dreamboard/Forms/${moduleName}`;
//       this.router.navigate([this.redirectionURL]).catch(err => console.error("Navigation error:", err));
//       break;
//     case 'Summary Dashboard':
//       this.redirectionURL = `/summary-engine/${moduleName}`;
//       this.router.navigate([this.redirectionURL]).catch(err => console.error("Navigation error:", err));
//       break;
//       case 'Dashboard':
//         const newTabURL = this.router.serializeUrl(
//           this.router.createUrlTree([`/dashboard/dashboardFrom/Forms/${moduleName}`])
//         );
//         window.open(newTabURL, '_blank');
//         break;
      
//     case 'Projects':
//       this.redirectionURL = `/project-dashboard/project-template-dashboard/${moduleName}`;
//       this.router.navigate([this.redirectionURL]).catch(err => console.error("Navigation error:", err));
//       break;
//     // case 'Project - Detail':
//     //   this.redirectionURL = `/view-dreamboard/Project%20Detail/${moduleName}`;
//     //     this.router.navigate([this.redirectionURL]).catch(err => console.error("Navigation error:", err));

//     //   break;
//     case 'Report Studio':
//       const reportStudioURL = this.router.serializeUrl(
//         this.router.createUrlTree(['/reportStudio'], {
//           queryParams: { savedQuery: moduleName }
//         })
//       );
//       window.open(reportStudioURL, '_blank');
//       break;
    
//         case 'Calender':
//           this.redirectionURL = `/view-dreamboard/Calendar/${moduleName}`;
//           ////console.log('this.redirectionURL checking',this.redirectionURL)
   
//           this.router.navigate([this.redirectionURL]).catch(err => console.error("Navigation error:", err));
//           // this.router.navigate(['/reportStudio'], { queryParams: { savedQuery: moduleName } });
     
  
//           // this.redirectionURL = `/reportStudio?savedQuery=${moduleName}`;
//           break;
//     default:
//       console.error("Unknown module: ", selectedModule);
//       return;
//   }

//   // // Ensure the redirection is triggered
//   // ////console.log("Redirecting to:", this.redirectionURL);
//   // this.router.navigate([this.redirectionURL]).catch(err => console.error("Navigation error:", err));
// }

SECRET_KEY = 'mobile-encrypt-params-123';
redirectModule(receiveItem: any, htmlModalRef: any) {
  const moduleName = receiveItem.dashboardIds;
  const selectedModule = receiveItem.ModuleNames;
  const redirectType = receiveItem.selectType; // 'NewTab' or 'Same page Redirect'
  const filterDescriptionAccess = receiveItem.filterDescription;
  const formattedCondition = this.formatConditions(filterDescriptionAccess);

  this.route.queryParams.subscribe((params) => {
    if (params['uID']) this.userId = params['uID'];
    if (params['pass']) this.userPass = params['pass'];
  });

  const isNewTab = redirectType === 'NewTab';
  const encodedCondition = encodeURIComponent(formattedCondition);
  const encryptedUserId = this.userId ? this.encryptValue(this.userId) : '';
  const encryptedPass = this.userPass ? this.encryptValue(this.userPass) : '';

  const queryString = `isFullScreen=true` +
    (encryptedUserId ? `&uID=${encodeURIComponent(encryptedUserId)}` : '') +
    (encryptedPass ? `&pass=${encodeURIComponent(encryptedPass)}` : '');

  let baseUrl = '';

  switch (selectedModule) {
    case 'Forms':
      baseUrl = `/view-dreamboard/Forms/${moduleName}&filter=${encodedCondition}`;
      break;

    case 'Summary Dashboard':
      baseUrl = `/summary-engine/${moduleName}`;
      break;

    case 'Dashboard':
      baseUrl = `/dashboard/dashboardFrom/Forms/${moduleName}`;
      break;

    case 'Projects':
      baseUrl = `/project-dashboard/project-template-dashboard/${moduleName}`;
      break;

    case 'Calender':
      baseUrl = `/view-dreamboard/Calendar/${moduleName}`;
      break;

    case 'Report Studio': {
      const tree = this.router.createUrlTree(['/reportStudio'], {
        queryParams: { savedQuery: moduleName }
      });
      baseUrl = this.router.serializeUrl(tree);
      break;
    }

    default:
      console.error('Unknown module:', selectedModule);
      return;
  }

  // ✅ Append queryString to baseUrl properly
//   let targetUrl = baseUrl.includes('?')
//     ? `${baseUrl}&${queryString}`
//     : `${baseUrl}?${queryString}`;
// console.log('targetUrl checking from module redirect',targetUrl)
const targetUrl = `${baseUrl}?${queryString}`;
console.log('targetUrl checking from module redirect', targetUrl);
  // ✅ Redirection behavior
  if (isNewTab) {
    if (this.userId && this.userPass) {
      this.iframeSafeUrl = targetUrl;
      this.modalService.open(htmlModalRef, {
        fullscreen: true,
        modalDialogClass: 'p-9',
        centered: true,
        backdrop: 'static',
        keyboard: false
      });
    } else {
      console.log('moduleName checking from module redirect',moduleName)
      // setTimeout(() => {
      //   this.pageInfoService.setTitle(( moduleName as any))
      // }, 500);
      window.open(targetUrl, '_blank');
    }
  } else {
    this.router.navigateByUrl(targetUrl).catch(err =>
      console.error('Navigation error:', err)
    );
  }
}


formatConditions(expression: string | undefined | null): string {
  if (!expression || typeof expression !== 'string') {
    return '';
  }

  const regex = /([a-zA-Z0-9_ ]+)-\$\{([a-zA-Z0-9_-]+)\}/g;

  return expression
    .replace(regex, (_match, label, value) => {
      return `\${${label.trim()}.${value}}`;
    })
    .replace(/(\s*)(\&\&|\|\|)(\s*)/g, ' $2 ');
}







handleDelete(event: any) {
  this.delete(event); 
  this.hideModal();
}

hideModal() {
  if (this.modalService) {
    this.modalService.dismissAll();
  }
}


 @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    // Adjust the menu position when the window is resized
    this.adjustMenuPosition();
  }

  private adjustMenuPosition() {
    const screenHeight = window.innerHeight;

    for (let i = 3; i <= 12; i++) {
      const menuItem = this.el.nativeElement.querySelector(`.myMenu-open:checked ~ .myMenu-item:nth-child(${i})`);

      if (menuItem) {
        const translateY = (i - 2) * (screenHeight * 0.1); // Adjust the multiplier for spacing

        this.renderer.setStyle(menuItem, 'transform', `translate3d(0, ${translateY}px, 0)`);
      }
    }
  }


fetchCalender(){
   this.api.GetMaster(this.SK_clientID + "#systemCalendarQuery#lookup", 1).then((result: any) => {
    if (result) {
        this.helpherObjCalender = JSON.parse(result.options)
        ////console.log('this.helpherObjCalender check',this.helpherObjCalender)

        this.formList = this.helpherObjCalender.map((item: any) => item)

        //console.log("DYNAMIC FORMLIST:", this.formList)
    }
}).catch((error) => {
    //console.log("Error:", error)
})
}
showDrillDownData(dynamicDrill:any,modalref:any){
  //console.log('dynamicDrill checking',dynamicDrill)
  this.storeDrillDown = dynamicDrill
  //console.log('this.storeDrillDown checking',this.storeDrillDown)
  const drilldownColumnVisibility =JSON.parse(this.storeDrillDown.columnVisibility)
  //console.log('drilldownColumnVisibility checking',drilldownColumnVisibility)

  if (!Array.isArray(drilldownColumnVisibility) || drilldownColumnVisibility.length === 0) {
      //console.log("❌ columnVisibility is empty or not an array, modal will NOT open.");
      return;
  }else {
    setTimeout(() => {
      this.modalService.open(modalref, {  
        modalDialogClass: 'p-9',  
        centered: true,  
        fullscreen: true,   
        backdrop: 'static', // Disable closing on backdrop click
        keyboard: false,
        windowClass: 'custom-modal-height' // Custom class for height adjustment
      });
    }, 500);
    

  }


  //console.log('this.storeDrillDown',this.storeDrillDown.id)
  const pointData ={
    name:this.storeDrillDown.multi_value[0].value,
    value:this.storeDrillDown.multi_value[0].processed_value
  }

  //console.log('pointData for Tile',pointData)
  //console.log('this.permissionIdRequest check drilldown',this.permissionIdRequest)

//console.log('this.eventFilterConditions checking',this.eventFilterConditions)
        // Define the API Gateway URL
        const apiUrl = 'https://1vbfzdjly6.execute-api.ap-south-1.amazonaws.com/stage1';
    
        // Prepare the request body
        const requestBody = {
          body: JSON.stringify({
            clientId: this.SK_clientID,
            routeId: this.routeId,
            widgetId:this.storeDrillDown.id,
            TileData:pointData,
            MsgType:'DrillDown',
            permissionId:this.permissionIdRequest,
            permissionList:this.readFilterEquation || [],
            userName:this.userdetails,
            conditions:this.eventFilterConditions,
            MainFilter:this.mainFilterCon ||''

          }),
        };
      
        //console.log('requestBody Tile', requestBody);
      
        // Send a POST request to the Lambda function with the body
        this.http.post(apiUrl, requestBody).subscribe(
          (response: any) => {
            //console.log('Lambda function triggered successfully:', response);
            this.responseBody = JSON.parse(response.body)
            //console.log('this.responseBody checking',this.responseBody )
            this.responseRowData = JSON.parse(this.responseBody.rowdata)
            //console.log('this.responseRowData checking',this.responseRowData)
        
            
            
        
            // Display SweetAlert success message
            // Swal.fire({
            //   title: 'Success!',
            //   text: 'Lambda function triggered successfully.',
            //   icon: 'success',
            //   confirmButtonText: 'OK'
            // });
      
            // Proceed with route parameter handling
  
      
     // Reset loading state
          },
          (error: any) => {
            console.error('Error triggering Lambda function:', error);
      
            // Display SweetAlert error message
            Swal.fire({
              title: 'Error!',
              text: 'Failed to trigger the Lambda function. Please try again.',
              icon: 'error',
              confirmButtonText: 'OK'
            });
     // Reset loading state
          }
        );
      
}

helperTileClick(event:any,modalChart:any){
  //console.log('event checking',event)
  this.modalService.open(modalChart, {  modalDialogClass:'p-9',  centered: true ,  fullscreen: true,   backdrop: 'static',  // Disable closing on backdrop click
    keyboard: false  });

}


  async setModuleID(packet: any, selectedMarkerIndex: any, modaref: TemplateRef<any>,receiveHtmlModal:any): Promise<void> {
  //console.log('modaref checking:', modaref);
  //console.log('packet checking:', packet);
  //console.log('dashboard filterCheck', this.dashboard);

  let filterTileQueryParam = '';



  const validatedFilterConfig = this.eventFilterConditions
  const validateMainFilter = this.mainFilterCon

  
  filterTileQueryParam = `&filterTileConfig=${JSON.stringify(validatedFilterConfig)}`;
  //console.log('filterTileQueryParam checking after stringify',filterTileQueryParam)
const mainFilterQueryParam  = `&mainFilterCon=${JSON.stringify(validateMainFilter)}`

  const viewMode = true;
  const disableMenu = true;
  const modulePath = packet.dashboardIds;


  // this.userPass = params['pass']
  this.toRouteId = modulePath
  //console.log('modulePath checking:', modulePath);

  localStorage.setItem('isFullScreen', JSON.stringify(true));

  // Append parsedFilterTileConfig to queryParams
  //console.log('filterTileQueryParam',filterTileQueryParam)
  const queryParams = `?viewMode=${viewMode}&disableMenu=${disableMenu}${filterTileQueryParam}${mainFilterQueryParam}&from_routerID=${this.routeId}`;
  //console.log('queryParams checking for modal',queryParams)

  this.currentItem = packet;
  this.currentModalIndex = selectedMarkerIndex;

  if (packet.selectType === 'NewTab') {
    setTimeout(() => {
      this.route.queryParams.pipe(take(1)).subscribe(async (params) => {
        const safeUrl = `${window.location.origin}/summary-engine/${packet.dashboardIds}`;
  
        try {
          // const readMainData = await this.openModalHelpher(packet.dashboardIds);
          // this.storeCheck = readMainData.fullScreenModeCheck;
          const fullSafeUrl = `${safeUrl}?isFullScreen=${true}`;
  
          if (params['uID'] && params['pass']) {
            this.userId = params['uID'];
            this.userPass = params['pass'];
  
            console.log('✅ Opening in modal. UserId:', this.userId);
  
            this.iframeSafeUrl = fullSafeUrl;
            this.modalService.open(receiveHtmlModal, {
              fullscreen: true,
              modalDialogClass: 'p-9',
              centered: true,
              backdrop: 'static',
              keyboard: false
            });
          } else {
            console.log('🌐 Opening in new tab:', fullSafeUrl);
            const newTab = window.open('', '_blank');
            if (newTab) {
              newTab.location.href = fullSafeUrl;
            } else {
              console.warn('⚠️ Popup blocked. Could not open new tab.');
            }
          }
        } catch (err) {
          console.error('❌ Error in openModalHelpher:', err);
        }
      });
    }, 0); // Prevent Angular zone-triggered side effects
  }
  
  
  
    if (packet.selectType === 'Modal') {

    this.route.queryParams.subscribe(async (params) => {
      if(params['uID']){
        //console.log('uid checking',params['uID'])
        this.userId = params['uID']

        
      }
      if(params['pass']){
        //console.log('pass checking',params['pass'])
        this.userPass = params['pass']
        const user = await this.authservice.signIn((this.userId).toLowerCase(), this.userPass);
        //console.log('user check query',user)
        
      }
      // if(params['clientID']){
      //   //console.log('clientID checking',params['clientID'])

      // }
    });

    //console.log('packet checking from queryparams', packet);
    this.modalCheck = packet.selectType;

    // Hide the navigation menu
    this.hideNavMenu = true;  
    const disableMenuQP = true;
    // window.location.reload();
    if (this.modalContent) {
      //console.log('modalContent checking', this.modalContent);
      this.modalService.open(this.modalContent, {
        fullscreen: true,

        modalDialogClass:'p-9',
        centered: true,// Custom class for modal width
        backdrop: 'static',  // Disable closing on backdrop click
        keyboard: false  
      });

      const queryParams = new URLSearchParams();

//console.log('this.eventFilterConditions checking', this.eventFilterConditions);

if (this.eventFilterConditions && this.eventFilterConditions.length > 0) {
queryParams.append('filters', encodeURIComponent(JSON.stringify(this.eventFilterConditions)));
}

if (this.mainFilterCon ) {
  queryParams.append('MainFilter', encodeURIComponent(JSON.stringify(this.mainFilterCon)));
  }

if (packet.dashboardIds) {
queryParams.append('dashboardId', packet.dashboardIds);
}

if (this.routeId) {
queryParams.append('routeId', this.routeId);
}
this.route.queryParams.subscribe(async (params) => {
if(params['uID']){
  //console.log('uid checking',params['uID'])
  this.userId = params['uID']

  
}
if(params['pass']){
  //console.log('pass checking',params['pass'])
  this.userPass = params['pass']
  const user = await this.authservice.signIn((this.userId).toLowerCase(), this.userPass);
  //console.log('user check query',user)
  
}
// if(params['clientID']){
//   //console.log('clientID checking',params['clientID'])

// }
});
// Add viewMode and disableMenu to query params
const viewMode = true;
const disableMenu = true;
queryParams.append('viewMode', String(viewMode));
queryParams.append('disableMenu', String(disableMenu));

// Add userId and userPass to query params
//console.log('this.userId checking from redirectModal', this.userId);
//console.log('this.userPass checking from redirectModal', this.userPass);

if (this.userId) {
queryParams.append('uID', this.userId);
}
if (this.userPass) {
queryParams.append('pass', this.userPass);
}


const modalWidth = 900; // Example width, replace with your actual dynamic width value
queryParams.append('modalWidth', String(modalWidth));
queryParams.append('isFullScreen', 'true');
const finalUrl = `${window.location.origin}/summary-engine/${modulePath}?${queryParams.toString()}`;

this.currentiframeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(finalUrl);

// Wait for permissions and then build final URL



// Append isFullScreen based on storeCheck AFTER getting it


// Build final URL


      
      // //console.log('this.currentiframeUrl checking', this.currentiframeUrl);
      
      
      localStorage.setItem('viewMode', 'true');
      localStorage.setItem('disableMenu', 'true');

      this.cdr.detectChanges();

      //console.log('Opening modal with iframe URL:', this.currentiframeUrl);
  } else {
      console.error('Modal content is undefined');
  }

}
if (packet.selectType === 'Same page Redirect') {

  setTimeout(() => {
    this.pageInfoService.setTitle(( modulePath as any))
  }, 500);
  // alert('same page redirect')
  // Extract query parameters once (avoid repeated subscription)
  const queryParams = this.route.snapshot.queryParams;

  if (queryParams['uID']) {
    this.userId = decodeURIComponent(queryParams['uID']);
    //console.log('User ID:', this.userId);
  }

  if (queryParams['pass']) {
    this.userPass = decodeURIComponent(queryParams['pass']);
    //console.log('Password:', this.userPass);

    // Authenticate user
    this.authservice.signIn(this.userId.toLowerCase(), this.userPass)
      .then(user => {
        //console.log('User check query:', user);
      })
      .catch(err => console.error('Authentication error:', err));
  }

  //console.log('User ID from redirectModal:', this.userId);
  //console.log('User Password from redirectModal:', this.userPass);
  //console.log('modulePath checking from same page',modulePath)

  // Ensure modulePath is properly decoded to avoid double encoding
  const modulePathCheck = decodeURIComponent(modulePath);
//console.log('Decoded modulePath:', modulePathCheck);


// Ensure query parameters exist before navigating
const queryParamsToSend: any = {};
if (this.userId) {
  queryParamsToSend.uID = this.userId;
}
if (this.userPass) {
  queryParamsToSend.pass = this.userPass;
}

//console.log('Final query params:', queryParamsToSend);
// this.router.navigate(['/summary-engine', modulePathCheck], { queryParams: queryParamsToSend })
//   .then(() => {
//     //console.log('Navigation successful:', `/summary-engine/${modulePathCheck}`, queryParamsToSend);
//     window.location.reload(); // Reload after navigation
//   })
//   .catch(err => console.error('Navigation error:', err));

// Close the modal before navigating
this.fetchCompanyLookupdataOnit(1)
  .then((data: any) => {
    const readLookupSummary = data; // Assign fetched data to the component property
    //console.log('readLookupSummary:', readLookupSummary);

    const dashboardIds = packet.dashboardIds; // Assuming this is defined

    // Find matching packet
    const matchingPacket = readLookupSummary.find((packet: any) => dashboardIds.includes(packet.P1));

    if (matchingPacket) {
      //console.log('Matching Packet:', matchingPacket);
      this.storeCheck = matchingPacket.P11;
      //console.log('storeCheck:', this.storeCheck);

      const queryParams = new URLSearchParams();
      queryParams.append('isFullScreen', 'true');
      const finalUrl = `${window.location.origin}/summary-engine/${modulePath}?${queryParams.toString()}`;
      //console.log('finalUrl:', finalUrl);

      this.currentiframeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(finalUrl);
      //console.log('this.currentiframeUrl:', this.currentiframeUrl);

      // Proceed with further actions using matchingPacket or storeCheck
    } else {
      //console.log('No matching packet found');
    }
  })
  .catch((error: any) => {
    console.error('Error fetching data:', error);
  });
this.modalService.dismissAll();
this.storeCheck = true;
//console.log('this.storeCheck checking', this.storeCheck);

// Append isFullScreen based on storeCheck AFTER getting it
queryParamsToSend.isFullScreen = String(this.storeCheck);
this.router.navigate(['/summary-engine', modulePathCheck], { queryParams: queryParamsToSend }).then(() => {
  //console.log('Navigation successful:', `/summary-engine/${modulePathCheck}`, queryParamsToSend);

  this.openModalHelpher(modulePath)
  .then((data) => {
    //console.log('✅ this.all_Packet_store permissions:', data);
    const readMainData = data;
    //console.log('readMainData checking', readMainData);

    this.storeCheck = readMainData.fullScreenModeCheck;
    //console.log('this.storeCheck checking', this.storeCheck);

    // Append isFullScreen based on storeCheck AFTER getting it
    queryParamsToSend.isFullScreen = String(this.storeCheck);

    // Optional: continue with any navigation or reload logic here
  })
  .catch(err => {
    console.error('Error in openModalHelpher:', err);
  });
  // window.location.reload(); // Reload after navigation
})
.catch(err => console.error('Navigation error:', err));

// Get the storeCheck value before navigating


}







  
  
  else if (packet.selectType === 'drill down') {
    if (modaref && modaref instanceof TemplateRef) {
      //console.log('Opening modal with modaref:', modaref);
      this.modalService.open(modaref, {
        fullscreen: true,

        modalDialogClass:'p-9',
        centered: true,// Custom class for modal width
        backdrop: 'static',  // Disable closing on backdrop click
        keyboard: false  
      });
    } else {
      console.error('Invalid TemplateRef passed for modal:', modaref);
    }
  }
  
}
private encryptionKey = 'your-secret-key'; // Replace with your actual key

encryptData(data: string): string {
  return encodeURIComponent(CryptoJS.AES.encrypt(data, this.encryptionKey).toString());
}

decryptData(encryptedData: string): string {
  try {
    const bytes = CryptoJS.AES.decrypt(decodeURIComponent(encryptedData), this.encryptionKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error('Decryption error:', error);
    return '';
  }
}

storeFilterTileConfig(config: any, index: number): void {
  //console.log(`Storing filterTileConfig for packet ${index}:`, config);

  // Example: Store the parsed config in a class-level variable or process further
  this.parsedConfigs = this.parsedConfigs || []; // Ensure the variable exists
  this.parsedConfigs.push({ index, config }); // Store by index for reference
}




closeModal1() {
  this.modalService.dismissAll(); // Close the modal programmatically
  // window.location.reload()
}
// handleKeyDown = (event: KeyboardEvent): void => {
//   if (event.key === 'Escape' && this.isFullScreen) {
 // Exit fullscreen
//   }
// };

toggleFullScreenFullView(enterFullscreen: boolean): void {
  // if (enterFullscreen !== undefined) {
    this.isFullScreen =  enterFullscreen
    // this.isFullScreenFinal =enterFullscreen

  // } else {
  //   this.isFullScreen = !this.isFullScreen; // Toggle fullscreen
  // }

  //console.log('Fullscreen state updated:', this.isFullScreen);
  this.updateOptions();

  // if (this.isFullScreen) {
  //   //console.log('Entered fullscreen mode');
  //   this.enterFullScreen();
  // } else {
  //   this.exitFullScreen(); // Call existing exit function
  // }
}

enterFullScreen(): void {
  const elem = document.documentElement as HTMLElement;
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if ((elem as any).webkitRequestFullscreen) { /* Safari */
    (elem as any).webkitRequestFullscreen();
  } else if ((elem as any).msRequestFullscreen) { /* IE11 */
    (elem as any).msRequestFullscreen();
  }
  localStorage.setItem('fullscreen', 'true');
}

exitFullScreen(): void {
  // localStorage.removeItem('fullscreen');
  this.isFullScreen = false;
  this.hidingLink = false;
  //console.log('Exited fullscreen mode');
  this.updateOptions();

  // if (document.exitFullscreen) {
  //   document.exitFullscreen();
  // } else if ((document as any).webkitExitFullscreen) { /* Safari */
  //   (document as any).webkitExitFullscreen();
  // } else if ((document as any).msExitFullscreen) { /* IE11 */
  //   (document as any).msExitFullscreen();
  // }
}

// Listen for 'Escape' or 'F11' key presses to exit fullscreen
@HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent): void {
    //console.log('Event checking from fullscreen:', event);

    // Check for Ctrl + Shift + F
    if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === 'f') {
      event.preventDefault();  // Prevent any default browser action
      this.toggleFullScreenFullView(true);
    } else if (event.key === 'Escape') {
      this.toggleFullScreenFullView(false);
    }
  }







  // Default to 'Data' tab
  dropsDown = 'down';
  dropsUp = 'up';
  opensRight = 'right';
  opensCenter = 'center';
  opensLeft = 'left';
  selectedRangeCalendarTimeRight: any;
  selectedRangeCalendarCenter: any;
  selectedRangeCalendarAutoLeft: any;
  selectedSingleCalendarTimeRight: any;
  selectedSingleCalendarCenter: any;
  selectedSingleCalendarAutoLeft: any;
  selectedSimpleCalendarTimeUpRight: any;
  selectedSimpleCalendarUpCenter: any;
  selectedSimpleCalendarAutoUpLeft: any;
  selectedRangeCalendarTimeInline: any;
  maxDate?: Dayjs;
  minDate?: Dayjs;
  invalidDates: Dayjs[] = [];
  selectedRangeLabel: string;
  selectedRangeLabelWithDates: string = '';
  isEditModeView: boolean = true;  // Default to Edit Mode
  lookupId: any;
  contractLookupId: any;
  loading: boolean = false;
  showTitleGrid: boolean;
  showDynamicTileGrid:boolean
  showFilterGrid:boolean
  showTableGrid:boolean
  showMapGrid:boolean
  showMultiTableGrid:boolean
  showChartGrid:boolean;
  editTitleIndex: number | null;
  isDuplicateID: boolean = false;
  isDuplicateName: boolean = false;
  isUpdateMode: boolean = false;
  responseData: any;
  hoverWidget: any = false;
  hideButton:boolean=false;
  lastSavedTime: Date | null = null;
  hideSummaryGridster:boolean =false

  toggleDropdown(event: Event): void {
    this.zone.run(() => {
      // Trigger Angular change detection
      (event.target as HTMLElement).click();
    });
  }


  over() {
    this.hoverWidget = true
  }
  out() {
    this.hoverWidget = false
  }

  private updateOptions(): void {
    this.options = {
      draggable: {
        enabled: !this.isEditModeView, // Draggable only in edit mode
        stop: () => {
          //console.log('Grid moved');
          // this.isGirdMoved = true; // Set flag to indicate grid was moved
        },
      },
      resizable: {
        enabled: !this.isEditModeView, // Resizable only in edit mode
        stop: () => {
          //console.log('Grid resized');
          this.isGirdMoved = true; // Set flag to indicate grid was resized
        },
      },
      itemInitCallback: this.onItemInit.bind(this),
      itemResizeCallback: this.itemResize.bind(this),
      // itemChangeCallback: this.onPositionChange.bind(this),
      // itemResizeCallbackMap: this.itemResizeMap.bind(this),
      itemChangeCallback: () => {
        //console.log('Grid item changed');
        this.isGirdMoved = true; // Set flag to indicate grid item changed
      },
      gridType: GridType.ScrollVertical,
      compactType: CompactType.None,
      margin: 10,
      outerMargin: true,
      outerMarginTop: null,
      outerMarginRight: null,
      outerMarginBottom: null,
      outerMarginLeft: null,
      useTransformPositioning: true,
      mobileBreakpoint: 640,
      useBodyForBreakpoint: false,
      minCols: 100,
      maxCols: 2000,
      minRows: 100,
      maxRows: 2000,
      maxItemCols: 10000,
      minItemCols: 1,
      maxItemRows: 10000,
      minItemRows: 1,
      maxItemArea: 250000,
      minItemArea: 1,
      defaultItemCols: 1,
      defaultItemRows: 1,
      fixedColWidth: 210, // Reduced from 420 to 210
      fixedRowHeight: 400, // Reduced from 800 to 400
      keepFixedHeightInMobile: false,
      keepFixedWidthInMobile: false,
      scrollSensitivity: 10,
      scrollSpeed: 20,
      enableEmptyCellClick: false,
      enableEmptyCellContextMenu: false,
      enableEmptyCellDrop: false,
      enableEmptyCellDrag: false,
      enableOccupiedCellDrop: false,
      emptyCellDragMaxCols: 50,
      emptyCellDragMaxRows: 50,
      ignoreMarginInRow: false,
      swap: false,
      pushItems: false,
      disablePushOnDrag: false,
      disablePushOnResize: false,
      pushDirections: { north: true, east: true, south: true, west: true },
      pushResizeItems: false,
      displayGrid: DisplayGrid.None,
      disableWindowResize: false,
      disableWarnings: false,
      scrollToNewItems: false, // Enables resizing of elements
    };
  
    //console.log('Options updated:', this.options); // Debugging log
  }
  
  
  @HostListener('window:beforeunload', ['$event'])
// saveStateBeforeUnload(event: Event): void {
//   localStorage.setItem('isGirdMoved', JSON.stringify(this.isGirdMoved));
// }



  // Update the button color based on grid changes
  // updateButtonColor() {
  //   // Here, we check the gridChanged flag to update the button color
  //   this.gridChanged = true; // Set to true if the layout has changed (dragged/resized)
  // }

  onPositionChange(item: GridsterItem) {
    if (item) {
      this.isGirdMoved = true
    }
  }


  onGridChange(): void {
    //console.log('Grid change detected');
    this.isGirdMoved = true; // Set the grid state to moved
  }
  // gridChanged(): void {
  //   //console.log('Grid change detected');
  //   this.isGirdMoved = true; // Set the grid state to moved
  // }
  
  // Save method to persist the layout (your existing function)
  saveGridLayout(): void {
    this.grid_details = this.dashboard;
    //console.log('this.grid_details from global save', this.grid_details);

    if (this.grid_details) {
      this.updateSummary('', 'saveDashboard');
    }

    // Trigger change detection to ensure the UI updates
    this.cdr.detectChanges();
  }

  loadGridLayout(): void {
    const savedLayout = localStorage.getItem('gridLayout');
    if (savedLayout) {
      this.dashboard = JSON.parse(savedLayout);
    }
  }







  onItemInit(item: GridsterItem) {
    ////console.log('New item initialized:', item);
    // Calculate item width and height based on grid cell size
    const cellWidth = this.options?.fixedColWidth; // Grid cell width with optional chaining
    const cellHeight = this.options?.fixedRowHeight; // Grid cell height with optional chaining

    if (cellWidth !== undefined && cellHeight !== undefined) {
      const itemWidth = item.cols * cellWidth; // Calculate width
      const itemHeight = item.rows * cellHeight; // Calculate height

      ////console.log('Item width:', itemWidth);
      ////console.log('Item height:', itemHeight);



    }
  }

  public itemResize(item: GridsterItem, itemComponent: GridsterItemComponentInterface): void {
    // alert('grid is moved')
    //console.log('item resized')
    if(item){
      //console.log('item is there or not',item)
      // this.isGirdMoved = true;
    }

    if (!this.chartHeight || !this.chartWidth) {
      // Initialize height and width arrays for all dashboard items
      this.chartHeight = new Array(this.dashboard.length).fill('');
      this.chartWidth = new Array(this.dashboard.length).fill('');
    }
    if (!this.mapHeight || !this.mapWidth) {
      // Initialize height and width arrays for all dashboard items
      this.mapHeight = new Array(this.dashboard.length).fill('');
      this.mapWidth = new Array(this.dashboard.length).fill('');
    }
  
    // Get the index of the item in the dashboard array
    const index = this.dashboard.indexOf(item as GridsterItem);
  
    if (index !== -1) {
            // this.isGirdMoved = true;
      const itemComponentWidth = itemComponent.width;
      const itemComponentHeight = itemComponent.height;
  
      // Handle both charts and maps
      if (item.grid_type === 'Linechart') {
        const baseHeight = 400; // Base height for the chart
        // const extraHeight = 40; // Additional height for labels, etc.
  
        this.chartHeight[index] = Math.max(0, itemComponentHeight ); // Adjust height
        this.chartWidth[index] = Math.max(0, itemComponentWidth);
  
        // //console.log(
        //   `Updated chart dimensions at index ${index}:`,
        //   `Height: ${this.chartHeight[index]}px, Width: ${this.chartWidth[index]}px`
        // );
      }
      if (item.grid_type === 'Barchart') {
        const baseHeight = 400; // Base height for the chart
        const extraHeight = 40; // Additional height for labels, etc.
  
        this.chartHeight[index] = Math.max(0, itemComponentHeight + extraHeight); // Adjust height
        this.chartWidth[index] = Math.max(0, itemComponentWidth);
  
        // //console.log(
        //   `Updated chart dimensions at index ${index}:`,
        //   `Height: ${this.chartHeight[index]}px, Width: ${this.chartWidth[index]}px`
        // );
      }
      else if (item.grid_type === 'Piechart') {
        const baseHeight = 400; // Base height for the chart
        // const extraHeight = 40; // Additional height for labels, etc.
  
        this.chartHeight[index] = Math.max(0, itemComponentHeight); // Adjust height
        this.chartWidth[index] = Math.max(0, itemComponentWidth);
  
        // //console.log(
        //   `Updated chart dimensions at index ${index}:`,
        //   `Height: ${this.chartHeight[index]}px, Width: ${this.chartWidth[index]}px`
        // );
      }
      else if (item.grid_type === 'Stackedchart') {
        const baseHeight = 400; // Base height for the chart
        // const extraHeight = 40; // Additional height for labels, etc.
  
        this.chartHeight[index] = Math.max(0, itemComponentHeight); // Adjust height
        this.chartWidth[index] = Math.max(0, itemComponentWidth);
  
        // //console.log(
        //   `Updated chart dimensions at index ${index}:`,
        //   `Height: ${this.chartHeight[index]}px, Width: ${this.chartWidth[index]}px`
        // );
      }


      else if (item.grid_type === 'dailChart') {
        const baseHeight = 400; // Base height for the chart
        // const extraHeight = 40; // Additional height for labels, etc.
  
        this.chartHeight[index] = Math.max(0, itemComponentHeight); // Adjust height
        this.chartWidth[index] = Math.max(0, itemComponentWidth);
  
        // //console.log(
        //   `Updated chart dimensions at index ${index}:`,
        //   `Height: ${this.chartHeight[index]}px, Width: ${this.chartWidth[index]}px`
        // );
      }

      else if (item.grid_type === 'chart') {
        const baseHeight = 400; // Base height for the chart
        // const extraHeight = 40; // Additional height for labels, etc.
  
        this.chartHeight[index] = Math.max(0, itemComponentHeight); // Adjust height
        this.chartWidth[index] = Math.max(0, itemComponentWidth);
  
        // //console.log(
        //   `Updated chart dimensions at index ${index}:`,
        //   `Height: ${this.chartHeight[index]}px, Width: ${this.chartWidth[index]}px`
        // );
      }
      else if (item.grid_type === 'semiDonut') {
        const baseHeight = 400; // Base height for the chart
        // const extraHeight = 40; // Additional height for labels, etc.
  
        this.chartHeight[index] = Math.max(0, itemComponentHeight); // Adjust height
        this.chartWidth[index] = Math.max(0, itemComponentWidth);
  
        // //console.log(
        //   `Updated chart dimensions at index ${index}:`,
        //   `Height: ${this.chartHeight[index]}px, Width: ${this.chartWidth[index]}px`
        // );
      }

      else if (item.grid_type === 'Funnelchart') {
        const baseHeight = 400; // Base height for the chart
        // const extraHeight = 40; // Additional height for labels, etc.
  
        this.chartHeight[index] = Math.max(0, itemComponentHeight); // Adjust height
        this.chartWidth[index] = Math.max(0, itemComponentWidth);
  
        // //console.log(
        //   `Updated chart dimensions at index ${index}:`,
        //   `Height: ${this.chartHeight[index]}px, Width: ${this.chartWidth[index]}px`
        // );
      }
      else if (item.grid_type === 'Columnchart') {
        const baseHeight = 400; // Base height for the chart
        // const extraHeight = 40; // Additional height for labels, etc.
  
        this.chartHeight[index] = Math.max(0, itemComponentHeight ); // Adjust height
        this.chartWidth[index] = Math.max(0, itemComponentWidth);
  
        // //console.log(
        //   `Updated chart dimensions at index ${index}:`,
        //   `Height: ${this.chartHeight[index]}px, Width: ${this.chartWidth[index]}px`
        // );
      }

      else if (item.grid_type === 'Areachart') {
        const baseHeight = 400; // Base height for the chart
        const extraHeight = 40; // Additional height for labels, etc.
  
        this.chartHeight[index] = Math.max(0, itemComponentHeight + extraHeight); // Adjust height
        this.chartWidth[index] = Math.max(0, itemComponentWidth);
  
        // //console.log(
        //   `Updated chart dimensions at index ${index}:`,
        //   `Height: ${this.chartHeight[index]}px, Width: ${this.chartWidth[index]}px`
        // );
      }
      else if (item.grid_type === 'Barchart') {
        const baseHeight = 400; // Base height for the chart
        const extraHeight = 40; // Additional height for labels, etc.
  
        this.chartHeight[index] = Math.max(0, itemComponentHeight + extraHeight); // Adjust height
        this.chartWidth[index] = Math.max(0, itemComponentWidth);
  
        // //console.log(
        //   `Updated chart dimensions at index ${index}:`,
        //   `Height: ${this.chartHeight[index]}px, Width: ${this.chartWidth[index]}px`
        // );
      }
      
      else if (item.grid_type === 'Map') {
        // const topMargin = 20; // Define the top margin value
      
        // Adjust height and width with the top margin
        this.mapHeight[index] = itemComponentHeight - 10 ; // Subtract additional top margin
        this.mapWidth[index] = itemComponentWidth - 10; // Subtract margin/padding for width
      
        // //console.log(
        //   `Resized ${item.grid_type} at index ${index}:`,
        //   `Height: ${this.mapHeight[index]}, Width: ${this.mapWidth[index]}, Top Margin: }`
        // );
      }
      else if (item.grid_type === 'tile') {
        // const topMargin = 20; // Define the top margin value
      
        // Adjust height and width with the top margin
        this.tileHeight[index] = itemComponentHeight ; // Subtract additional top margin
        this.tileWidth[index] = itemComponentWidth ; // Subtract margin/padding for width
      
        // //console.log(
        //   `Resized ${item.grid_type} at index ${index}:`,
        //   `Height: ${this.tileHeight[index]}, Width: ${this.tileWidth[index]}, Top Margin: }`
        // );
      }

      else if (item.grid_type === 'tileWithIcon') {
        // const topMargin = 20; // Define the top margin value
      
        // Adjust height and width with the top margin
        this.tileHeight[index] = itemComponentHeight ; // Subtract additional top margin
        this.tileWidth[index] = itemComponentWidth ; // Subtract margin/padding for width
      
        // //console.log(
        //   `Resized ${item.grid_type} at index ${index}:`,
        //   `Height: ${this.tileHeight[index]}, Width: ${this.tileWidth[index]}, Top Margin: }`
        // );
      }
      else if (item.grid_type === 'TableWidget') {
        // const topMargin = 20; // Define the top margin value
      
        // Adjust height and width with the top margin
        this.tableHeight[index] = itemComponentHeight ; // Subtract additional top margin
        this.tableWidth[index] = itemComponentWidth ; // Subtract margin/padding for width
      
        // //console.log(
        //   `Resized ${item.grid_type} at index ${index}:`,
        //   `Height: ${this.tableHeight[index]}, Width: ${this.tableWidth[index]}, Top Margin: }`
        // );
      }
      else if (item.grid_type === 'title') {
        // const topMargin = 20; // Define the top margin value

         const extraHeight = 40;
      
        // Adjust height and width with the top margin
        this.titleHeight[index] = itemComponentHeight+extraHeight ; // Subtract additional top margin
        this.titleWidth[index] = itemComponentWidth ; // Subtract margin/padding for width
      
        // //console.log(
        //   `Resized ${item.grid_type} at index ${index}:`,
        //   `Height: ${this.titleHeight[index]}, Width: ${this.titleWidth[index]}, Top Margin: }`
        // );
      }
      else if (item.grid_type === 'dynamicTile') {
        // const topMargin = 20; // Define the top margin value
      
        // Adjust height and width with the top margin
        this.DynamicTileHeight[index] = itemComponentHeight ; // Subtract additional top margin
        this.DynamicTileWidth[index] = itemComponentWidth ; // Subtract margin/padding for width
      
        // //console.log(
        //   `Resized ${item.grid_type} at index ${index}:`,
        //   `Height: ${this.DynamicTileHeight[index]}, Width: ${this.DynamicTileWidth[index]}, Top Margin: }`
        // );
      }

      else if (item.grid_type === 'progressTile') {
        // const topMargin = 20; // Define the top margin value
      
        // Adjust height and width with the top margin
        this.DynamicTileHeight[index] = itemComponentHeight ; // Subtract additional top margin
        this.DynamicTileWidth[index] = itemComponentWidth ; // Subtract margin/padding for width
      
        // //console.log(
        //   `Resized ${item.grid_type} at index ${index}:`,
        //   `Height: ${this.DynamicTileHeight[index]}, Width: ${this.DynamicTileWidth[index]}, Top Margin: }`
        // );
      }
      else if (item.grid_type === 'HTMLtile') {
        this.HTMLtileHeight[index] = item.itemComponentHeight;
        this.HTMLtileWidth[index] = item.itemComponentWidth;
    
        // //console.log(
        //   `Resized ${item.grid_type} at index ${index}:`,
        //   `Height: ${this.HTMLtileHeight[index]}, Width: ${this.HTMLtileWidth[index]}`
        // );
      }
  
      else if (item.grid_type === 'filterTile') {
        // const topMargin = 20; // Define the top margin value
      
        // Adjust height and width with the top margin
        this.filterTileHeight[index] = itemComponentHeight ; // Subtract additional top margin
        this.filterTileWidth[index] = itemComponentWidth ; // Subtract margin/padding for width
      
        // //console.log(
        //   `Resized ${item.grid_type} at index ${index}:`,
        //   `Height: ${this.filterTileHeight[index]}, Width: ${this.filterTileWidth[index]}, Top Margin: }`
        // );
    }
    else if (item.grid_type === 'tile2') {
      // const topMargin = 20; // Define the top margin value
    
      // Adjust height and width with the top margin
      this.tile2Height[index] = itemComponentHeight ; // Subtract additional top margin
      this.tile2Width[index] = itemComponentWidth ; // Subtract margin/padding for width
    
      // //console.log(
      //   `Resized ${item.grid_type} at index ${index}:`,
      //   `Height: ${this.tile2Height[index]}, Width: ${this.tile2Width[index]}, Top Margin: }`
      // );



      
  }


      
      

      
    } else {
      console.warn('Item not found in dashboard array');
    }


    // const config = item.grid_type;
    // if (config) {
    //   (this as any)[config.height][index] = itemComponent.height - config.heightOffset;
    //   (this as any)[config.width][index] = itemComponent.width - config.widthOffset;
    //   this.isGirdMoved = true;
    // }
  }
  private redrawChart(index: number): void {
    const chartId = `lineChart${index + 1}`; // Assuming your chart container ID follows this pattern
    const chartElement = document.getElementById(chartId);
  
    if (chartElement) {
      // Trigger chart resize/update logic depending on the library you're using
      //console.log(`Redrawing chart for index ${index}`);
      // Example for Highcharts:
      Highcharts.charts[index]?.reflow(); // Adjust this for your specific charting library
    } else {
      console.warn(`Chart container not found for index ${index}`);
    }
  }
  


  // public itemResizeMap(item: GridsterItem, itemComponentMap: GridsterItemComponentInterface): void {
  
  //   if (!this.mapHeight || !this.mapWidth) {
  //     this.mapHeight = new Array(this.dashboard.length).fill('');
  //     this.mapWidth = new Array(this.dashboard.length).fill('');
  //   }
  
  //   // Get the index of the item in the dashboard array
  //   const index = this.dashboard.indexOf(item as GridsterItem);

  //   // Make sure the index is valid
  //   if (index !== -1) {
  //     const itemComponentMapWidth = itemComponentMap.width;
  //     const itemComponentMapHeight = itemComponentMap.height;


  //    if (item.grid_type === 'Map') {
  //       this.mapHeight[index] = (itemComponentMapWidth - 10) ;
  //       this.mapWidth[index] = (itemComponentMapHeight - 30) ;
    
  //     }
     

  //     ////console.log('AFTER this.isGirdMoved', this.isGirdMoved)
  //   }

  // }
  deleteTile(item: any, index: number, all_Packet_store: any): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to delete this tile? This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        //console.log('Before deletion:', this.dashboard);
        //console.log('all_Packet_store test before deleteTile',all_Packet_store)
  
        // Step 1: Validate the index and remove the tile
        if (index >= 0 && index < this.dashboard.length) {
          this.dashboard = this.dashboard.filter((_, i) => i !== index);
          //console.log('After deletion:', this.dashboard);
  
          // Step 2: Update grid_details in all_Packet_store
          all_Packet_store.grid_details = [...this.dashboard];
          //console.log('Updated all_Packet_store.grid_details:', all_Packet_store.grid_details);
          //console.log('all_Packet_store test from deleteTile',all_Packet_store)
  
    
          this.updateSummary(all_Packet_store, 'delete_tile');
  
          // Step 4: Trigger change detection to update the UI
          this.cdr.detectChanges();
  
          // Step 5: Show success message
          // Swal.fire({
          //   title: 'Deleted!',
          //   text: 'The tile has been successfully deleted.',
          //   icon: 'success',
          //   confirmButtonColor: '#3085d6',
          // });
        } else {
          console.error('Invalid index:', index);
        }
      }
    });
  }
  
  


  onMouseEnter(): void {
    this.isHovered = true;
  }

  onMouseLeave(): void {
    this.isHovered = false;
  }












  // Function to set the selected tab
  selectedSettingsTab(tab: string) {
    this.selectedTabset = tab;
  }

  selectedColor: string = '#66C7B7'; // Default to the first color


  // Toggle checkbox visibility and state inside color box

  // Method to toggle the menu open/close
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }



  deleteItem(item: any) {
    // Logic for deleting the item
    //console.log('Delete:', item);
  }


  nineBlocks = Array.from({ length: 9 }, (_, i) => ({ label: `KPI ${i + 1}` }));

  constructor(private summaryConfiguration: SharedService, private api: APIService, private fb: UntypedFormBuilder, private cd: ChangeDetectorRef,
    private toast: MatSnackBar, private router: Router, private modalService: NgbModal, private route: ActivatedRoute, private cdr: ChangeDetectorRef, private locationPermissionService: LocationPermissionService, private devicesList: SharedService, private injector: Injector, private auditTrail: AuditTrailService,
    private spinner: NgxSpinnerService, private zone: NgZone,private http: HttpClient,  private sanitizer: DomSanitizer, // Inject DomSanitizer
    private titleService: Title, private summaryService: SummaryEngineService,private blobService: BlobService,private renderer: Renderer2,private authservice: AuthService, private fullscreenService: FullscreenService,private el: ElementRef,private location: Location
    ,private pageInfoService: PageInfoService
  ) {
    this.resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        if (entry.contentRect) {
          this.onWidthChange(entry.contentRect.width);
        }
      }
    });

    this.resetInactivityTimer()

    this.loadPinnedItems();
    this.setCheck(!this.isEditModeView);
    this.updateOptions();

  }

  someMethod() {
    const localeService = this.injector.get(NgxDaterangepickerLocaleService);
  }
  onWidthChange(newWidth: number) {
    // //console.log('Container width changed:', newWidth);
    this.changedOptions()
  
  }

    changedOptions(): void {
    if (this.options.api && this.options.api.optionsChanged) {
      this.options.api.optionsChanged();
    }
  }

  localeTime = {
    firstDay: 1,
    startDate: dayjs().startOf('day'),
    endDate: dayjs().endOf('day'),
    format: 'DD.MM.YYYY HH:mm:ss',
    applyLabel: 'Apply',
    cancelLabel: 'Cancel',
    fromLabel: 'From',
    toLabel: 'To',
  };
  locale = {
    firstDay: 1,
    startDate: dayjs().startOf('day'),
    endDate: dayjs().endOf('day'),
    format: 'DD.MM.YYYY',
    applyLabel: 'Apply',
    cancelLabel: 'Cancel',
    fromLabel: 'From',
    toLabel: 'To',
  };
  tooltips = [
    { date: dayjs(), text: 'Today is just unselectable' },
    { date: dayjs().add(2, 'days'), text: 'Yeeeees!!!' },
  ];



  isInvalidDate = (m: Dayjs) => {
    return this.invalidDates.some((d) => d.isSame(m, 'day'));
  };

  isCustomDate = (date: Dayjs) => {
    return date.month() === 0 || date.month() === 6 ? 'mycustomdate' : false;
  };

  isTooltipDate = (m: Dayjs) => {
    const tooltip = this.tooltips.find((tt) => tt.date.isSame(m, 'day'));
    return tooltip ? tooltip.text : false;
  };

  @HostListener('unloaded')
  ngOnDestroy(): void {
    //console.log('SummaryEngineComponent destroyed.');
    // document.removeEventListener('keydown', this.handleKeyDown);
  }
  ngAfterViewInit(): void {
    // this.spinner.show('mainLoading');
    //console.log('this.allCompanyDetails',this.createSummaryField.value)
    // const getFormFelds = this.createKPIWidget.get('filterParameter')?.value;
    const getfullScreenValue = this.createSummaryField.get('fullScreenModeCheck')?.value
    //console.log('ngAfterViewInit check data', getfullScreenValue);
    if (this.routeId) {
      console.log('this.routeId checking from ngAfter',this.routeId)
      
      setTimeout(() => {
        this.pageInfoService.setTitle(( this.routeId as any))
      }, 500);
  
     
   

      // //console.log('temp check from afterViewInit',temp)
      this.checkAndSetFullscreen(this.storeFullScreen);
      this.editButtonCheck = true

      // this.openModalHelpher(this.routeId)
    } else {
      this.editButtonCheck = false
    }
    this.loadData()
  
    // this.spinner.hide('mainLoading');
    this.addFromService()
    // this.adjustMenuPosition();
  

    //console.log("this.lookup_data_summary1", this.lookup_data_summary1)
    //console.log('create summary fields',this.createSummaryField.value)
    // this.createChartGauge();

    this.createKPIWidget.statusChanges.subscribe(status => {
      // Log form validity status to track changes
      //console.log('Form status changed:', status);
      //console.log('Form validity:', this.createKPIWidget.valid);
    });


    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.forEach((tooltipTriggerEl) => {
      new Tooltip(tooltipTriggerEl);
    });


    // $(document).on('click', '[data-action="view"]', (event) => {
    //   const id = $(event.target).closest('[data-id]').attr('data-id');
    //   //console.log('id checking summary',id)
    //   if (id) {
    //     this.viewItem(id);
    //   }
    // });
    // this.createBulletChart();

    // this.createPieChart()
    


  // Move DataTable controls outside the table
  const dataTable = $('#dataTable').DataTable();

  // Append the page length dropdown to a custom div outside the table
  const dtLength = $(dataTable.table().container()).find('.dataTables_length');
  $('#datatable-length').append(dtLength);

  // Append the search box to a custom div outside the table
  const dtSearch = $(dataTable.table().container()).find('.dataTables_filter');
  $('#datatable-search').append(dtSearch);


  setTimeout(() => {
    const pagination = document.querySelector('.dataTables_paginate');
    const modalFooter = document.querySelector('.modal-footer');
    const closeButton = modalFooter?.querySelector('button');

    if (pagination && modalFooter && closeButton) {
      modalFooter.insertBefore(pagination, closeButton);
    }
  }, 500); // 
  
  }


  createBulletChart() {
    const chartoptions: any = {
      chart: {
        inverted: true,
        marginLeft: 135,
        type: 'bullet'
      },
      title: {
        text: null
      },
      legend: {
        enabled: false
      },
      yAxis: {
        gridLineWidth: 0
      },
      plotOptions: {
        series: {
          pointPadding: 0.25,
          borderWidth: 0,
          color: '#000',
          targetOptions: {
            width: '200%'
          }
        }
      },
      credits: {
        enabled: false
      },
      exporting: {
        enabled: false
      }
    }
    Highcharts.chart('bulletChart', chartoptions);
  }

  private getRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min)
  }

  // private createChartGauge(): void {
  //   const chart = Highcharts.chart('chart-gauge', {
  //     chart: {
  //       type: 'solidgauge',
  //       themeColor: 'transparent',
  //     },
  //     title: {
  //       text: '',
  //     },
  //     credits: {
  //       enabled: false,
  //     },
  //     pane: {
  //       startAngle: -90,
  //       endAngle: 90,
  //       center: ['50%', '85%'],
  //       size: '160%',
  //       background: {
  //         innerRadius: '60%',
  //         outerRadius: '100%',
  //         shape: 'arc',
  //       },
  //     },
  //     yAxis: {
  //       min: 0,
  //       max: 100,
  //       stops: [
  //         [0.1, '#55BF3B'], // green
  //         [0.5, '#DDDF0D'], // yellow
  //         [0.9, '#DF5353'], // red
  //       ],
  //       minorTickInterval: null,
  //       tickAmount: 2,
  //       labels: {
  //         y: 16,
  //       },
  //     },
  //     plotOptions: {
  //       solidgauge: {
  //         dataLabels: {
  //           y: -25,
  //           borderWidth: 0,
  //           useHTML: true,
  //         },
  //       },
  //     },
  //     tooltip: {
  //       enabled: false,
  //     },
  //     series: [{
  //       name: null,
  //       data: [this.getRandomNumber(0, 100)],
  //       dataLabels: {
  //         format: '<div style="text-align: center"><span style="font-size: 1.25rem">{y}</span></div>',
  //       },
  //     }],
  //   } as any);

  //   setInterval(() => {
  //     chart.series[0].points[0].update(this.getRandomNumber(0, 100));
  //   }, 1000);
  // }

  hasSummaryEngineWithParams(): boolean {
    return this.router.url.startsWith('/summary-engine') && Object.keys(this.route.snapshot.queryParams).length > 0;
  }
  


  async ngOnInit() {
    // this.isMainLoading=true
   

    this.route.data.subscribe(data => {
      this.titleService.setTitle(data['title']); // Set tab title dynamically
    });
    // this.createSummaryField.get('fullScreenModeCheck')?.valueChanges.subscribe((newValue) => {
    //   //console.log('Always Full Screen changed:', newValue);
    // });
    this.getLoggedUser = this.summaryConfiguration.getLoggedUserDetails()
    //console.log('this.getLoggedUser read for redirect',this.getLoggedUser)


    this.SK_clientID = this.getLoggedUser.clientID;
    //console.log('this.SK_clientID check', this.SK_clientID)
    this.userdetails = this.getLoggedUser.username;
    //console.log('user name permissions check',this.userdetails)
    // const isFullscreen = this.summaryService.getFullscreen();
    // if (isFullscreen) {
    //   this.enterFullscreenMode(); // Your logic to make it fullscreen (e.g., adding class, resizing layout etc.)
    // }
    this.route.paramMap.subscribe(async params => {
      this.routeId = params.get('id');
      if (this.routeId) {
        const permissionId =this.fetchUserPermissions(1)
        this.route.queryParams.subscribe((params) => {
          //console.log('params check', params);
          this.queryParams = params;
        
          //console.log('this.queryParams checking', this.queryParams);
          // this.openQueryParams(this.queryParams)
          // this.isEditModeView = false;
        
          if (params['viewMode']) {
            this.viewModeQP = params['viewMode'] === 'true';
            this.hideButton = true;
            sessionStorage.setItem('viewMode', this.viewModeQP.toString());
          }
        
          if (params['disableMenu']) {
            this.disableMenuQP = params['disableMenu'] === 'true';
            //console.log('this.disableMenuQP check',this.disableMenuQP)
            sessionStorage.setItem('disableMenu', this.disableMenuQP.toString());
          }
        if(params['routeId']){
          //console.log(params['routeId'])
          this.fromRouterID = params['routeId']
        }
        if(params['dashboardId']){
          //console.log(params['dashboardId'])
          this.toRouterID = params['dashboardId']
          //console.log('this.toRouterID checking',this.toRouterID)
        }
        if(params['MainFilter']){
          //console.log(params['MainFilter'])
          const decodedMainFilters = JSON.parse(decodeURIComponent(params['MainFilter']));
          this.filterMainConditions = decodedMainFilters;
          // this.mainFilterCondition = params['MainFilter']
          //console.log('this.toRouterID checking',this.toRouterID)
        }

        if (params['filters']) {
          try {
            // Decode and parse the filters parameter
            const decodedFilters = JSON.parse(decodeURIComponent(params['filters']));
            //console.log('Decoded Filters:', decodedFilters);
        
            this.filterConditions = decodedFilters;
            this.QueryParamsRead(this.fromRouterID, this.toRouterID, this.filterConditions,permissionId,this.filterMainConditions);
          } catch (error) {
            console.error('Error decoding filters:', error);
          }
        }
        if(params['isFullScreen']){
      
          if(params['isFullScreen']==="true"){
            this.storeFullScreen = true
          }else{
            this.storeFullScreen = false
          }
       
       
          
          //console.log('fullScreen checking from onInit',typeof this.storeFullScreen)

        }
        if(params['modalWidth']){
          //console.log('check width Modal',params['modalWidth'])
          this.modalWidth = params['modalWidth'];

        }

          //console.log('params', params['filterTileConfig']);
          if (params['filterTileConfig']) {
            //console.log('Raw filterTileConfig:', params['filterTileConfig']);
        
            try {
              // Ensure the value is a valid JSON string
              const parsedFilterTileConfig = JSON.parse(params['filterTileConfig'].trim());
              //console.log('Parsed filterTileConfig:', parsedFilterTileConfig);
        
              // Flatten the nested array structure if necessary
              const flattenedConfig = parsedFilterTileConfig.flat();
              //console.log('Flattened filterTileConfig:', flattenedConfig);
        
              // Check if flattenedConfig is an array and has elements
              if (Array.isArray(flattenedConfig) && flattenedConfig.length > 0) {
                //console.log('Triggering updateSummary with add_tile');
                // alert('I am triggered');
                //console.log('all_Packet_store checking',this.all_Packet_store)
              this.isFilterdetail=true
              this.storeFilterDetail = flattenedConfig
              // this.updateSummary(flattenedConfig, 'add_tile');
              } else {
                console.warn('Flattened filterTileConfig is empty or not valid:', flattenedConfig);
              }
            } catch (error) {
              console.error('Error parsing filterTileConfig:', error);
            }
          } else {
            console.warn('filterTileConfig is not present in params.');
            this.isFilterdetail= false
          }
        });
        //console.log('permissionId onInit',permissionId)
        //console.log('this.routeId checking from ngOnIOnit',this.routeId)
        this.openModalHelpher(this.routeId)

    .then((data) => {
    //console.log('✅ this.all_Packet_store permissions:', data); // ✅ Now you will get the correct data
    const livedatacheck = data
    //console.log('livedatacheck',livedatacheck)
    this.checkLiveDashboard = livedatacheck.LiveDashboard
    this.viewFullScreenCheck = livedatacheck.fullScreenModeCheck
    //console.log('this.viewFullScreenCheck checking',this.viewFullScreenCheck)
    if(this.viewFullScreenCheck==true){
      // this.checkAndSetFullscreen();

    }


    //console.log('this.checkLiveDashboard check',this.checkLiveDashboard)
    if(this.checkLiveDashboard==true){
    this.reloadPage("from_ts",permissionId) 
        
    
    }else{
      this.spinner.hide('dataProcess')
    }
    
    })
    .catch((error) => {
    console.error('❌ Error fetching data:', error);
    });


  //   this.openModalHelpher(this.routeId)
  // .then((data) => {
  //   //console.log('✅ this.all_Packet_store permissions:', data);
  //   const livedatacheck = data;
  //   //console.log('livedatacheck', livedatacheck);

  //   if (livedatacheck) {
  //     this.checkLiveDashboard = livedatacheck.LiveDashboard;
  //     this.viewFullScreenCheck = livedatacheck.fullScreenModeCheck;
  //     //console.log('this.viewFullScreenCheck checking', this.viewFullScreenCheck);

  //     if (this.viewFullScreenCheck === true) {
  //       // Uncomment to invoke fullscreen logic
  //       // this.checkAndSetFullscreen();
  //     }
  //   }
  // })
  // .catch(err => {
  //   console.error('Error in openModalHelpher:', err);
  // });
        this.editButtonCheck = true
    
      }
      else{
        this.route.queryParams.subscribe(async (params) => {
          //console.log('userparams checking from onInit',params)
        if(params['uID']){
          //console.log('uid checking',params['uID'])
          this.userId = params['uID']
 
          
        }
        if(params['pass']){
          //console.log('pass checking',params['pass'])
          this.userPass = params['pass']
          const user = await this.authservice.signIn((this.userId).toLowerCase(), this.userPass);
          //console.log('user check query',user)
          this.hideSummaryGridster = true
          
        }


        // if(params['clientID']){
        //   //console.log('clientID checking',params['clientID'])

        // }
      });
      }
    
      ////console.log(this.routeId)
      // Use this.itemId to fetch and display item details
    });

//console.log('this.route checing on top',this.route)
if (this.userId && this.userPass) {
  //console.log('this.userId checking ngOnINIT',this.userId)
  
  // Show the spinner if both userId and userPass have values
  this.spinner.show('mainLoading');
} else {
  // Hide the spinner if either userId or userPass is missing
  this.spinner.hide('mainLoading');
}


// this.spinner.show('mainLoading')

this.fetchCompanyLookupdata(1)
    .then((data: any) => {
      //console.log("Final lookup data received in ngOnInit:", data);
      // Use `data` as needed here
    })
    .catch((error: any) => {
      console.error("Error fetching lookup data:", error);
    });

const fullUrl = this.router.routerState.snapshot.url; // Get full URL string
  const segments = fullUrl.split('/'); // Split by '/'

  const summaryIndex = segments.indexOf('summary-engine');
  if (summaryIndex !== -1 && segments.length > summaryIndex + 1) {
    const id = segments[summaryIndex + 1]; // Get the next segment after 'summary-engine'
    //console.log('Extracted ID:', id);

this.fetchSummaryMain(id)

  }



this.filterDuplucateIds(this.routeId)
    
     this.fetchUserPermissions(1)
    // //console.log('readPermission_Id checking initialize',readPermission_Id)
    
    this.initializeCompanyFields();
  

    //console.log('this.getLoggedUser check', this.getLoggedUser)

  

    this.initializeTileFields6()
  
    this.addFromService()



 


    const savedMode = localStorage.getItem('editModeState');
    //console.log('savedMode from ngOnInit',savedMode)
    this.isEditModeView = savedMode ? JSON.parse(savedMode) : false;
    //console.log('this.isEditModeView from ngOnInit',this.isEditModeView )
    this.assignGridMode = this.isEditModeView 
    //console.log('this.assignGridMode',this.assignGridMode)
    // Update options based on the retrieved mode
 

    // Trigger change detection to reflect changes in the UI
    this.cdr.detectChanges();
    this.fetchLiveContractlookup(1)
    this.fetchContractOrderMasterlookup(1)
    this.permissionIds(1)

    this.applyTheme(); // Initial check
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', this.applyTheme.bind(this));
    // this.fetchCalender()
   




    const savedGridMoved = localStorage.getItem('isGirdMoved');
    this.isGirdMoved = savedGridMoved ? JSON.parse(savedGridMoved) : false;
  // Retrieve `lastSavedTime` if needed
  const savedLastTime = localStorage.getItem('lastSavedTime');
  if (savedLastTime) {
    this.lastSavedTime = new Date(savedLastTime);
  } else {
    this.lastSavedTime = null;
  }
  this.router.events.subscribe(event => { if (event instanceof NavigationEnd) { 
    //console.log('Navigation ended, reloading window...');
     window.location.reload(); // Reload the window on navigation end } }); } 
  }
});
  
this.auditTrail.getFormInputData('SYSTEM_AUDIT_TRAIL', this.SK_clientID)

this.sendFullScreenCheck = this.isFullScreen
//console.log('this.sendFullScreenCheck  checking',this.sendFullScreenCheck )

// this.handlePin()
// document.removeEventListener('keydown', this.handleKeyDown);

// if(params['routeId']){
//   //console.log(params['routeId'])
//   this.fromRouterID = params['routeId']
// }
// if(params['dashboardId']){
//   //console.log(params['dashboardId'])
//   this.toRouterID = params['dashboardId']
// }
// if(params['filters']){
//   //console.log(params['filters'])
//   this.filterConditions = params['filters']


// //console.log('this.permissionsMetaData from initialize',this.permissionIdRequest)
// //console.log('permissionList',this.readFilterEquation)
// //console.log('this.permissionsMetaData',this.permissionIdRequest)

// //console.log('check live',this.checkLiveDashboard )

// this.spinner.hide('mainLoading')

  }


  // enterFullscreenMode() {
  //   // Your fullscreen logic here, e.g.
  //   document.body.classList.add('fullscreen-layout');
  // }
  fetchSummaryMain(receiveId:any){
    //console.log('receiveId checking',receiveId)



    this.api
    .GetMaster(`${this.SK_clientID}#${receiveId}#summary#main`, 1)
    .then((result: any) => {
      if (result && result.metadata) {
        const parsedMetadata = JSON.parse(result.metadata);
       this.storeSummaryMainData = parsedMetadata
        //console.log('parsedMetadata check', this.storeSummaryMainData);
        const readFullScreenCheck = this.storeSummaryMainData.fullScreenModeCheck

        // const readFormControl =this.createSummaryField.get('fullScreenModeCheck')?.value
        // //console.log('readFormControl checking',readFormControl)
        if(readFullScreenCheck==true){
            //  this.toggleFullScreenFullView(true);


        }
        //console.log('readFullScreenCheck checking',readFullScreenCheck)

      }else{
  
      }
    })
    .catch((err) => {
      //console.log("Can't fetch", err);
    });


  }



  getBodyColor(): string {
    const style = getComputedStyle(this.myDiv.nativeElement);
    return style.getPropertyValue('--bs-heading-color').trim();
  }
  async QueryParamsRead(routeId:any,toRouterId:any,eventFilterConditions:any,permissionId:any,receiveMainFilterCondition:any){


  const resolvedPermission = await permissionId;
          
  //console.log("✅ Resolved permissionfromOnInit check:", resolvedPermission);

  // ✅ Extract values safely after resolving the Promise
  const permissionIdRead = resolvedPermission?.permissionId || "";
  const permissionList = resolvedPermission?.readFilterEquationawait || [];
  //console.log('permissionList check',permissionList)
  const apiUrl = 'https://1vbfzdjly6.execute-api.ap-south-1.amazonaws.com/stage1';
//console.log('this.fromRouterID checking',routeId)
//console.log('this.routeId checking',toRouterId)
//console.log('this.eventFilterConditions checking',eventFilterConditions)
const queryParamsCheck = eventFilterConditions
this.queryParamsSend = eventFilterConditions
//console.log(' this.queryParamsSend', this.queryParamsSend)
// const queryparams = JSON.parse(eventFilterConditions)
// const toRouterId = packet.dashboardIds
// Prepare the request body
const requestBody = {
  body: JSON.stringify({
    clientId: this.SK_clientID,
    from_route_id: routeId,

    to_route_id:toRouterId,
    // widgetId:this.storeDrillDown.id,

    MsgType:'Query_Params',
    queryParams:eventFilterConditions,
    permissionId:permissionIdRead,
    permissionList:permissionList,
    userName:this.userdetails,
     MainFilter:receiveMainFilterCondition ||''
  }),
};

//console.log('requestBody for dashboardFilter', requestBody);

// Send a POST request to the Lambda function with the body
//console.log('this.all_Packet_store clearing',this.all_Packet_store)
this.http.post(apiUrl, requestBody).subscribe(
  
  (response: any) => {
    //console.log('Lambda function triggered successfully:', response);
    this.responseBody = JSON.parse(response.body)
    //console.log('this.responseBody checking',this.responseBody )
    const processedDataFilter = this.responseBody.Processed_Data.metadata.grid_details

    //console.log('processedData checking from queryParams',processedDataFilter)
    this.eventFilterConditions= eventFilterConditions
    const CombinedConditions = {...eventFilterConditions, ...receiveMainFilterCondition};
    //console.log('CombinedConditions checking',CombinedConditions)
    this.summaryService.updatelookUpData(processedDataFilter)
    this.summaryService.queryPramsFunction(CombinedConditions)
    // const viewModeQP = true;
    // const disableMenuQP = true;
    //console.log('disableMenuQP check from modal',this.disableMenuQP)
    //console.log('viewModeQP checking from modal',this.viewModeQP)
  

// if(this.disableMenuQP==false && this.viewModeQP==false ){

// // //console.log('queryParamsCheck checking',packet.selectType)
// this.summaryService.queryPramsFunction(processedDataFilter)

// }


    // this.summaryService.updatelookUpData(processedDataFilter)
    this.responseRowData1 = JSON.parse(this.responseBody.Processed_Data
    )
    //console.log('this.responseRowData checking',this.responseRowData)

    
    

    // Display SweetAlert success message
    // Swal.fire({
    //   title: 'Success!',
    //   text: 'Lambda function triggered successfully.',
    //   icon: 'success',
    //   confirmButtonText: 'OK'
    // });

    // Proceed with route parameter handling


// Reset loading state
  },
  (error: any) => {
    console.error('Error triggering Lambda function:', error);

    // Display SweetAlert error message
    Swal.fire({
      title: 'Error!',
      text: 'Failed to trigger the Lambda function. Please try again.',
      icon: 'error',
      confirmButtonText: 'OK'
    });
// Reset loading state
  }
);

}

  openQueryParams(paramsRead:any){
    //console.log('paramsRead',paramsRead)
    this.paramsReadExport = paramsRead

  }
  selectFormParams(event: any) {
    if (event && event[0] && event[0].data) {
      const selectedText = event[0].data.text;  // Adjust based on the actual structure
      //console.log('Selected Form Text:', selectedText);

      if (selectedText) {
        this.fetchDynamicFormData(selectedText);
      }
    } else {
      console.error('Event data is not in the expected format:', event);
    }
  }
  loadReportData(savedQuery: string) {
    //console.log('Loading report data for:', savedQuery);
    // Add logic to load the report data based on savedQuery
  }

  async permissionIds(sk: any) {
    //console.log("I am called Bro");
    try {
        const response = await this.api.GetMaster(this.SK_clientID + "#permission#lookup", sk);

        if (response && response.options) {
            if (typeof response.options === 'string') {
                let data = JSON.parse(response.options);
                //console.log("d1 =", data);

                if (Array.isArray(data)) {
                    for (let index = 0; index < data.length; index++) {
                        const element = data[index];

                        if (element !== null && element !== undefined) {
                            const key = Object.keys(element)[0];
                            const { P1, P2, P3 } = element[key];

                            // Ensure dashboardIdsList is initialized
                            if (!this.permissionIdsList) {
                                this.permissionIdsList = [];
                            }

                            // Check if P1 exists before pushing
                            if (P1 !== undefined && P1 !== null) {
                                this.permissionIdsList.push({ P1, P2, P3 });
                                //console.log("Pushed to dashboardIdsList: ", { P1, P2, P3 });
                                //console.log('this.dashboardIdsList check', this.permissionIdsList);
                            } else {
                                console.warn("Skipping element because P1 is not defined or null");
                            }
                        } else {
                            break;
                        }
                    }

                    // Fetch permission data for each P1 value
                    this.p1ValuesSummaryPemission = this.permissionIdsList.map((item: { P1: any; }) => item.P1);
                    //console.log('P1 values: dashboard permission', this.p1ValuesSummaryPemission);

                    // Call fetchPermissionIdMain for each P1 value
                    for (const p1Value of this.p1ValuesSummaryPemission) {
                 
                    }

                    // Continue fetching recursively
                    await this.permissionIds(sk + 1);
                } else {
                    console.error('Invalid data format - not an array.');
                }
            } else {
                console.error('response.options is not a string.');
            }
        } else {
            //console.log("Lookup to be displayed", this.permissionIdsList);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}



  async fetchPermissionIdMain(clientID: number, p1Value: string): Promise<void> {

    try {
      //console.log("p1Value checking", p1Value);
      //console.log("clientID checking", clientID);
      //console.log("this.SK_clientID checking from permission", this.SK_clientID);

      const pk = `${this.SK_clientID}#permission#${p1Value}#main`;
      //console.log(`Fetching main table data for PK: ${pk}`);

      const result: any = await this.api.GetMaster(pk, clientID);

      if (!result || !result.metadata) {
        console.warn("Result metadata is null or undefined.");
// Resolve even if no data is found
        return;
      }

      // Parse metadata
      this.parsedPermission = JSON.parse(result.metadata);
      //console.log("Parsed permission metadata:", this.parsedPermission);

      this.readFilterEquation = this.parsedPermission;
      //console.log("this.readFilterEquation check", this.readFilterEquation);

      // Handling Dashboard Permissions
      this.summaryPermission = this.parsedPermission.summaryList || [];
      //console.log("this.summaryPermission check", this.summaryPermission);

      if (this.summaryPermission.includes("All")) {
        //console.log("Permission is 'All'. Fetching all dashboards...");
        this.dashboardData = await this.fetchCompanyLookupdata(1);
        this.updateOptions();
      } else {
        //console.log("Fetching specific dashboards...");
        const allData = await this.fetchCompanyLookupdata(1);
        this.dashboardData = allData.filter((dashboard: any) =>
          this.summaryPermission.includes(dashboard.P1)
        );
        //console.log("Filtered Dashboards Data:", this.dashboardData);
      }

      // Extract Permission List
      this.permissionIdsListList = this.parsedPermission.permissionsList || [];
      //console.log("Parsed permission list:", this.permissionIdsListList);

      // Check 'Summary Dashboard' Permission
      const summaryDashboardItem = this.permissionIdsListList.find(
        (item: { name: string; update: boolean; view: boolean }) =>
          item.name === "Summary Dashboard"
      );
      //console.log("Summary Dashboard Item:", summaryDashboardItem);
      // localStorage.setItem('editModeState', this.isEditModeView.toString());

      if (summaryDashboardItem) {
        this.summaryDashboardUpdate = summaryDashboardItem.update;
        this.summaryDashboardView = summaryDashboardItem.view;
        //console.log("this.summaryDashboardUpdate check", this.summaryDashboardUpdate);

        this.isEditModeView = this.summaryDashboardView && !this.summaryDashboardUpdate || this.summaryDashboardUpdate;
        //console.log('this.isEditModeView checking from permission', this.isEditModeView);
        
                              //console.log('this.isEditModeView checking from permission',this.isEditModeView)
        this.updateOptions();
      }

      this.processFetchedData(result);
      return this.readFilterEquation
      
 // Resolve the Promise after all operations are complete
    } catch (error) {
      console.error(`Error fetching data for PK (${p1Value}):`, error);
 // Reject in case of API failure
    }

}


fetchCompanyLookupdata(sk: any): Promise<any[]> {
  //console.log("I am called Bro");

  return new Promise((resolve, reject) => {
    this.api.GetMaster(this.SK_clientID + "#summary" + "#lookup", sk)
      .then(response => {
        if (response && response.options) {
          if (typeof response.options === 'string') {
            let data = JSON.parse(response.options);
            //console.log("d1 =", data);

            if (Array.isArray(data) && data.length > 0) {
              for (let index = 0; index < data.length; index++) {
                const element = data[index];
                if (element) {
                  const key = Object.keys(element)[0];
                  const { P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11 } = element[key];
                  this.lookup_data_summary.push({ P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11 });
                }
              }

              //console.log("d2 =", this.lookup_data_summary);

              this.lookup_data_summary.sort((a: { P5: number; }, b: { P5: number; }) => b.P5 - a.P5);

              // Recursive call and return the combined result
              this.fetchCompanyLookupdata(sk + 1)
                .then(() => resolve(this.lookup_data_summary))
                .catch(reject);
            } else {
              //console.log("No more data to fetch.");
              this.listofSK = this.lookup_data_summary.map((item: { P1: any; }) => item.P1);
              resolve(this.lookup_data_summary);
            }
          } else {
            reject(new Error('response.options is not a string.'));
          }
        } else {
          // Base condition when no options are present
          //console.log("All the users are here", this.lookup_data_summary);
          this.listofSK = this.lookup_data_summary.map((item: { P1: any; }) => item.P1);
          resolve(this.lookup_data_summary);
        }
      })
      .catch(error => {
        console.error('Error:', error);
        reject(error);
      });
  });
}



processFetchedData(result: any): void {
  // Check if the result is valid
  if (!result || Object.keys(result).length === 0) {
      console.warn('No data found for the given PK.');
      return;
  }

  // Example: Log the result
  //console.log('Processing fetched data:', result);

  // Example: Add the fetched data to a local array
  if (!this.fetchedData) {
      this.fetchedData = [];
  }
  this.fetchedData.push(result);

  // Example: Update a local map for quick lookup
  if (!this.dataMap) {
      this.dataMap = new Map();
  }
  this.dataMap.set(result.PK, result);

  // Perform additional processing if required
  // For instance, update UI components or trigger change detection
}


  groupByOptions = [
    { value: 'none', text: 'None' },
    { value: 'created', text: 'Created Time' },
    { value: 'updated', text: 'Updated Time' },
    { value: 'name', text: 'Name' },
    { value: 'phoneNumber', text: 'Phone Number' },
    { value: 'emailId', text: 'Email Id' },


    // Add more hardcoded options as needed
  ];

  showValues = [
    { value: 'sum', text: 'Sum' },
    { value: 'min', text: 'Minimum' },
    { value: 'max', text: 'Maximum' },
    { value: 'average', text: 'Average' },
    { value: 'latest', text: 'Latest' },
    { value: 'previous', text: 'Previous' },
    { value: 'DifferenceFrom-Previous', text: 'DifferenceFrom-Previous' },
    { value: 'DifferenceFrom-Latest', text: 'DifferenceFrom-Latest' },
    { value: '%ofDifferenceFrom-Previous', text: '%ofDifferenceFrom-Previous' },
    { value: '%ofDifferenceFrom-Latest', text: '%ofDifferenceFrom-Latest' },
    { value: 'Constant', text: 'Constant' },
    { value: 'Live', text: 'Live' },

  ]

  // ngAfterViewInit() {
  //   this.addFromService()
  // }

  convertToIST(epochTime: number): string {
    const date = new Date(epochTime * 1000); // No offset needed if system is in IST

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
    const year = date.getFullYear();
  
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
  
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  
  }
  
  padZero(value: number): string {
    return value < 10 ? `0${value}` : `${value}`;
  }
  

  // Helper function to pad single digit numbers with a leading zero
  // private padZero(value: number): string {
  //   return value < 10 ? '0' + value : value.toString();
  // }


  openSummaryTable(content: any) {
    this.modalService.open(content, {
      fullscreen: true,

      modalDialogClass:'p-9',
      centered: true,
      backdrop: 'static',  // Disable closing on backdrop click
      keyboard: false  
    });
    
    
    
    
    this.showTable()
    // 
    this.reloadEvent.next(true);
  }


  dropdownOptions = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
  ];
  listofTiles = [
    { value: 'Chart', label: 'Chart' },
    { value: 'DynamicTile', label: 'DynamicTile' },
    { value: 'FilterTile', label: 'FilterTile' },
    { value: 'Html Tile', label: 'Html Tile' },
    { value: 'ImageTile', label: 'ImageTile' },
    { value: 'MapWidget', label: 'MapWidget' },
    { value: 'MultiTableWidget', label: 'MultiTableWidget' },
    { value: 'ProgressTile', label: 'ProgressTile' },
    { value: 'TableTile', label: 'TableTile' },
    { value: 'Tiles', label: 'Tiles' },
    { value: 'Title', label: 'Title' }
  ];
  
  tileChange(event: any): void {
    //console.log('Tile changed:', event);

    if (event && event.length > 0) {
      this.selectedTile = event[0].value;

      //console.log('Selected tile:', this.selectedTile);


      // Update visibility based on the selected tile
      this.showGrid = this.selectedTile === 'Tiles' || this.selectedTile === 'Title' || this.selectedTile === 'Chart'|| this.selectedTile === 'DynamicTile' || this.selectedTile === 'FilterTile' || this.selectedTile === 'TableTile' || this.selectedTile === 'MapWidget' || this.selectedTile === 'MultiTableWidget' ||this.selectedTile ==='Html Tile' ||this.selectedTile ==='ImageTile'||this.selectedTile ==='ProgressTile' ;

      
      this.showTitleGrid = this.selectedTile === 'Title'; // Show specific grid for Title
      this.showChartGrid = this.selectedTile === 'Chart';
      this.showDynamicTileGrid =  this.selectedTile === 'DynamicTile'
            this.showFilterGrid =  this.selectedTile === 'FilterTile'
               this.showTableGrid =  this.selectedTile === 'TableTile'
                    this.showMapGrid =  this.selectedTile === 'MapWidget'
                              this.showMapGrid =  this.selectedTile === 'MapWidget'
                              this.showMultiTableGrid = this.selectedTile === 'MultiTableWidget'
                              this.showHTMLtileGrid = this.selectedTile === 'Html Tile',
                              this.showimageGrid = this.selectedTile === 'ImageTile',
                              this.showProgressGrid = this.selectedTile ==='ProgressTile'


            

      setTimeout(() => {
        this.createPieChart()
      }, 500);

      setTimeout(() => {
        this.createSemiDonut()
      }, 500);
      setTimeout(() => {
        this.createLineChart()
        
      }, 500);
setTimeout(() => {
  this.createBarChart()
}, 500);
setTimeout(() => {

    this.createBarChart()
 
}, 500);

setTimeout(() => {
  this.createMixedChart()
  
}, 500);

setTimeout(() => {
  this.createAreaChart()
}, 500);
setTimeout(() => {
  this.createFunnelChart()
  
}, 500);



setTimeout(() => {
  this.createCalumnChart()
}, 500);
setTimeout(() => {
  this.createPieChart1()
}, 500);

setTimeout(() => {
  this.createStackedChart1()
}, 500);

setTimeout(() => {
  this.createCalumnWithTableChart()
}, 500);
setTimeout(() => {
  this.createDailChart()
}, 500);



 
     
    } else {
      // Reset all grid visibility if no option is selected
      this.showGrid = false;
      this.showTitleGrid = false;
      this.showChartGrid = false;
    }
  }
  getLastSavedMessage(): string {
    if (this.lastSavedTime) {
      const timeDifference = moment(this.lastSavedTime).fromNow();
      return `Unsaved changes. Click here to save (Last saved ${timeDifference})`;
    } else {
      return 'Unsaved changes. Click here to save.';
    }
  }
  
  
  positionSave(): void {
    // Save the grid position
    //console.log('Grid position saved');
    this.isGirdMoved = false; // Reset the moved flag
    this.lastSavedTime = new Date(); // Update the last saved time
  
    // Persist `isGirdMoved` and `lastSavedTime` in localStorage
    localStorage.setItem('isGirdMoved', JSON.stringify(this.isGirdMoved));
    localStorage.setItem('lastSavedTime', this.lastSavedTime.toISOString());
  
    this.updateSummary('', 'Save');
  }
  redirectToSummaryEngine(): void {
    this.route.queryParams.subscribe(async (params) => {
      let queryParams: any = {}; // Object to hold query params
  
      if (params['uID']) {
        //console.log('uid checking', params['uID']);
        this.userId = params['uID'];
        queryParams.uID = this.userId;
      }
  
      if (params['pass']) {
        //console.log('pass checking', params['pass']);
        this.userPass = params['pass'];
        queryParams.pass = this.userPass;
  
        // Perform authentication
        // const user = await this.authservice.signIn((this.userId).toLowerCase(), this.userPass);
        // //console.log('user check query', user);
        this.hideSummaryGridster = true;
      }
  
      //console.log('this.userId query params check from home redirection', this.userId);
      //console.log('this.userPass query params check from home redirection', this.userPass);
  
      // Navigate to summary-engine with or without query params
      if (this.router.url !== '/summary-engine') {
        this.router.navigate(['/summary-engine'], { queryParams: Object.keys(queryParams).length ? queryParams : undefined });
      }
    });
  }
  


  
  isSummaryEngine(): boolean {
    const urlWithoutQueryParams = this.router.url.split('?')[0]; // Get base URL without query params
    const queryParams = this.route.snapshot.queryParams; // Get current query parameters
  
    // Ensure the route ends exactly with '/summary-engine'
    const isBasePathCorrect = urlWithoutQueryParams.endsWith('/summary-engine');
  
    // Extract query parameter keys
    const queryKeys = Object.keys(queryParams);
  
    // If no query parameters exist, allow hiding (i.e., `/summary-engine` alone should be hidden)
    if (queryKeys.length === 0) {
      return isBasePathCorrect;
    }
  
    // Ensure only 'uID' and 'pass' exist in query params (no extra params)
    const hasOnlyAllowedParams = queryKeys.every(param => ['uID', 'pass'].includes(param));
  
    // Ensure no extra query parameters exist (other than 'uID' & 'pass')
    const hasExtraParams = queryKeys.some(param => !['uID', 'pass'].includes(param));
  
    // Hide only if:
    // 1. The base path is '/summary-engine'
    // 2. No query params OR only 'uID' and 'pass' exist
    return isBasePathCorrect && (!hasExtraParams);
  }
  
  
  
  shouldHideYouTube(): boolean {
    const urlWithoutQueryParams = this.router.url.split('?')[0];
    const queryParams = this.route.snapshot.queryParams;
    const queryKeys = Object.keys(queryParams);
  
    return urlWithoutQueryParams.endsWith('/summary-engine') && queryKeys.length > 0;
  }
  

  hideTooltips() {

  }
  openCreateContent(createcontent: any) {
    this.modalService.open(createcontent, {fullscreen: true, modalDialogClass:'p-9', centered: true,   backdrop: 'static',  // Disable closing on backdrop click
      keyboard: false  });
  }

  viewItem(id: string, receivePacket?: any): void {
    //console.log('this.userId checking from redirect', this.userId);
    //console.log('this.userPass checking from redirect', this.userPass);
    //console.log('this.all_Packet_store check viewItem', this.lookup_data_summaryCopy);
    //console.log('receivePacket checvking', receivePacket);
    // //console.log('this.lookup_data_summaryCopy checking from viewItem',this.lookup_data_summaryCopy)
    // const checkP12 = receivePacket?.P12;
    // //console.log('check p12 key from lookup', checkP12);
    
    // if (checkP12) {
    //     Swal.fire({
    //         icon: 'warning',
    //         title: 'Access Restricted',
    //         text: 'Only administrators have permission to view all the data. You do not have the necessary permissions to access all the data.',
    //         confirmButtonText: 'OK',
    //         confirmButtonColor: '#3085d6',
    //         iconColor: '#f39c12',
    //         background: '#ffffff',
    //          backdrop: 'rgba(0, 0, 0, 0.8)'
    //     });
    // }
    

  
    const checkP11 = receivePacket?.P11 ?? false;
    //console.log('checkP11 checking', checkP11);
          this.isGirdMoved = false;
  
    // Always include isFullScreen in queryParams
    let queryParams: any = {
      isFullScreen: checkP11
    };
  
    // Conditionally add userId and userPass
    if (this.userId) {
      queryParams.uID = this.userId;
    }
    if (this.userPass) {
      queryParams.pass = this.userPass;
    }
  
    // Navigate
    if (this.userId || this.userPass) {
      this.router.navigate([`/summary-engine/${id}`], { 
        queryParams: queryParams, 
        queryParamsHandling: 'merge' 
      });
      this.openModalHelpher(id);
    } else {
      this.router.navigate([`/summary-engine/${id}`], {
        queryParams: queryParams,
        queryParamsHandling: 'merge'
      });
    }
  
    this.cdr.detectChanges();
    this.showModal = true; // Open modal in edit mode
  }
  

  dashboardRedirect(id: string): void {
    // Toggle the full-screen state
    this.setFullscreen();
  
    // Navigate to the desired route
    this.router.navigate([`/summary-engine/${id}`]).then(() => {
      // Reload the window after navigation
      window.location.reload();
    });
  
    // Set the state to Edit Mode
    this.showModal = true; // Open modal in edit mode
  }
  

  
  dashboardOpen(id: string): void {
    this.route.queryParams.subscribe(async (params) => {
      let queryParams: any = {};  // Initialize queryParams object
  
      if (this.userId) {
        queryParams.uID = this.userId;
      }
      if (this.userPass) {
        queryParams.pass = this.userPass;
      }
  
      console.log('id checking from dashboard redirection', id);
  
      try {
        const data = await this.openModalHelpher(id);
        this.storeCheck = data?.fullScreenModeCheck ?? false;
        queryParams.isFullScreen = String(this.storeCheck);
      } catch (err) {
        console.error('Error in openModalHelpher:', err);
        queryParams.isFullScreen = 'false';  // Fallback value
      }
  
      // Always navigate regardless of whether data was returned
      this.router.navigate([`/summary-engine/${id}`], {
        queryParams: queryParams,
        queryParamsHandling: 'merge'
      }).then(() => {
        window.location.reload();
      }).catch(err => {
        console.error('Error in navigation:', err);
      });
    });
  }
  
  
  
  


  
  redirectDashboard(id: string): void {
    //console.log('I am redirecting to the dashboard');
    this.isLoading = true;
  
    // Dismiss all modals
    this.modalService.dismissAll(); // Remove the modal-open class
  
    // Wait for the storeCheck value from openModalHelpher
    this.route.queryParams.subscribe(async (params) => {
      let queryParams: any = {};  // Initialize queryParams object
      
      // Conditionally add userId and userPass if they exist
      if (this.userId) {
        queryParams.uID = this.userId; // Add uID to queryParams
      }
      if (this.userPass) {
        queryParams.pass = this.userPass; // Add pass to queryParams
      }
  
      // Fetch the storeCheck value asynchronously and update the queryParams
      this.openModalHelpher(id).then((data) => {
        //console.log('✅ this.all_Packet_store permissions:', data);
        const readMainData = data;
        this.storeCheck = readMainData.fullScreenModeCheck;
        //console.log('this.storeCheck checking', this.storeCheck);
  
        // Append 'isFullScreen' to the query parameters after resolving the promise
        queryParams.isFullScreen = String(this.storeCheck);  // Ensure it's a string
  
        // Merge the queryParams and navigate
        this.router.navigate([`/summary-engine/${id}`], { 
          queryParams: queryParams, 
          queryParamsHandling: 'merge'  // Merges the query parameters without encoding
        }).then(() => {
          window.location.reload(); // Reload the window after navigation
        }).catch(err => {
          console.error('Error in navigation:', err);
        });
      }).catch(err => {
        console.error('Error in openModalHelpher:', err);
      });
    });
  }
  
  
  
  
  
  
  

  // Method to remove the last grid item
  removeItem(index: number): void {
    if (index > -1 && index < this.dashboard.length) {
      this.dashboard.splice(index, 1);
    }
  }

  // Corrected trackByItem method to match TrackByFunction<GridsterItem>
  trackByItem(index: number, item: GridsterItem): any {
    return item; // Or return item.id if you have an ID property




    // Define some sample gridster items

  }

  iconUrl: string | ArrayBuffer | null = null; // Declare iconUrl property

  onFileSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      const file = target.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        this.iconUrl = reader.result; // Assign the result to iconUrl
      };

      reader.readAsDataURL(file); // Read the file as a data URL
    }
  }




  // Initialize it to null

  onIconSelect(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedIcon = selectElement.value; // Set selectedIcon to the selected value
    //console.log('Selected icon:', this.selectedIcon); // Debugging line
  }


  updateDisplayLabel(selectedDropdown: string): void {
    // Format the display label with the selected dropdown text
    this.displayLabel = `${selectedDropdown} (selected value)`;
    //console.log('Updated Display Label:', this.displayLabel);
  }



  someOtherFunction(combinedValue: string): void {
    // Use the combined value as needed
    //console.log('Using Combined Value:', combinedValue);
  }


  metadata(): FormGroup {
    return this.createSummaryField.get('metadata') as FormGroup
  }

  edit(event: any): void {
    //console.log('event checking',event)
    this.redirectDashboard(event)
    
  

  }
  
  

  themes = [
    // { color: "linear-gradient(to right, #ff7e5f, #feb47b)", selected: false }, // Warm Sunset
    // { color: "linear-gradient(to right, #6a11cb, #2575fc)", selected: false }, // Cool Blue-Purple
    // { color: "linear-gradient(to right, #ff6a00, #ee0979)", selected: false }, // Fiery Red-Orange
    { color: "linear-gradient(to right, #36d1dc, #5b86e5)", selected: false }, // Aqua Blue
    { color: "linear-gradient(to right, #56ab2f, #a8e063)", selected: false }, // Fresh Green
    { color: "linear-gradient(to right, #ff9966, #ff5e62)", selected: false }, // Orange-Red Glow
    { color: "linear-gradient(to right, #373b44, #4286f4)", selected: false }, // Subtle Blue-Grey
    { color: "linear-gradient(to right, #8e44ad, #3498db)", selected: false }, // Vibrant Purple-Blue
    { color: "linear-gradient(to right, #fdc830, #f37335)", selected: false }, // Golden Sunburst
    { color: "linear-gradient(to right, #16a085, #f4d03f)", selected: false }, // Teal to Yellow
    { color: "linear-gradient(to right, #9cecfb, #65c7f7, #0052d4)", selected: false }, // Light to Deep Blue
    { color: "linear-gradient(to right, #00c6ff, #0072ff)", selected: false }, // Bright Blue
    { color: "linear-gradient(to right, #11998e, #38ef7d)", selected: false }, // Mint Green
    { color: "linear-gradient(to right, #ff9a9e, #fad0c4)", selected: false }, // Pink Pastel
    { color: "linear-gradient(to right, #fc5c7d, #6a82fb)", selected: false }  // Pink to Blue
  ];
  // async openModalHelpher(getValue: any): Promise<any> {
  //   //console.log("Data from lookup:", getValue);
  
  //   return new Promise(async (resolve, reject) => {
  //     try {
  //       // Fetching data
  //       const result: any = await this.api.GetMaster(`${this.SK_clientID}#${getValue}#summary#main`, 1);
  
  //       if (result && result.metadata) {
  //         const parsedMetadata = JSON.parse(result.metadata);
  //         this.parsedSummaryData = parsedMetadata;
  //         //console.log('Parsed Metadata:', this.parsedSummaryData);
  
  //         this.all_Packet_store = parsedMetadata;
  //         this.createdTime = this.all_Packet_store.created;
  //         this.createdUserName = this.all_Packet_store.createdUser;
  
  //         // Handling date formatting
  //         const formattedDate = new Date(this.all_Packet_store.LastUpdate);
  //         this.lastUpdatedTime = formattedDate.toLocaleString(); 
  //         //console.log('Formatted Date:', this.lastUpdatedTime);
  
  //         // Check grid details
  //         if (this.all_Packet_store.grid_details?.length === 0 && !this.modalOpened) {
  //           this.modalOpened = true; // Prevent multiple openings
  //           this.openModal('edit_ts', this.all_Packet_store, this.summaryModal);
  //         }
  
  //         // Handling multi_value parsing
  //         if (this.all_Packet_store.grid_details && this.all_Packet_store.grid_details.length > 0) {
  //           this.all_Packet_store.grid_details.forEach((gridItem: { multi_value: any }, index: any) => {
  //             if (gridItem?.multi_value) {
  //               try {
  //                 const multiValueString = gridItem.multi_value;
  //                 gridItem.multi_value = Array.isArray(multiValueString)
  //                   ? multiValueString
  //                   : JSON.parse(multiValueString);
  //                 //console.log(`After Parsing for item ${index}:`, gridItem);
  //               } catch (error) {
  //                 console.error(`Error parsing multi_value for item ${index}:`, error);
  //               }
  //             }
  //           });
  
  //           // Reassign the updated grid_details to dashboard
  //           this.dashboard = this.all_Packet_store.grid_details;
  //           //console.log('Dashboard after parsing:', this.dashboard);
  //         }
  
  //         // Theme matching logic
  //         this.dashboard.forEach((gridItem_1: any) => {
  //           const matchingTheme = this.themes.find(theme => theme.color === gridItem_1.themeColor);
  //           if (matchingTheme) {
  //             this.themes.forEach(theme_1 => {
  //               if (theme_1.color !== matchingTheme.color) {
  //                 theme_1.selected = false; // Unselect themes that don't match
  //               }
  //             });
  //             matchingTheme.selected = true;
  //             //console.log('Matching theme found and selected:', matchingTheme);
  //           }
  //         });
  
  //         // Continue with other actions
  //         this.cdr.detectChanges();
  //         this.bindDataToGridster(this.all_Packet_store); // Pass the object to bindDataToGridster
  //         this.openModal('Edit_ts', this.all_Packet_store); // Open modal with the data
  //         //console.log('this.all_Packet_store check resolve', this.all_Packet_store);
  
  //         // Resolve only after all operations are done
  //         resolve(this.all_Packet_store);
  //       } else {
  //         reject("No metadata found");
  //       }
  //     } catch (err) {
  //       console.error("Error fetching data:", err);
  //       reject(err);  // Reject with the error
  //     }
  //   });
  // }
  
  
  
  // fullscreen: true,

  // modalDialogClass:'p-9',
  // centered: true// Custom class for modal width



  
justReadStyles(data:any,index:any){
  this.FilterTileConfigComponent.isEditMode =true;
  this.FilterTileConfigComponent.openFilterModal(data, index);
}
async openModalHelpher(getValue: any,modalFlag?:any): Promise<any> {
  //console.log("Data from lookup:", getValue);

  return new Promise(async (resolve, reject) => {
    try {
      // Fetching data from API
      const result: any = await this.api.GetMaster(`${this.SK_clientID}#${getValue}#summary#main`, 1);
      //console.log('API Result:', result);

      if (result && result.metadata) {
        const parsedMetadata = JSON.parse(result.metadata);
        this.parsedSummaryData = parsedMetadata;
        //console.log('Parsed Metadata:', this.parsedSummaryData);

        this.all_Packet_store = parsedMetadata;
        this.createdTime = this.all_Packet_store.created;
        this.createdUserName = this.all_Packet_store.createdUser;

        // Handling date formatting
        const formattedDate = new Date(this.all_Packet_store.LastUpdate);
        this.lastUpdatedTime = formattedDate.toLocaleString();
        //console.log('Formatted Date:', this.lastUpdatedTime);

        // Check if modal needs to be opened due to empty grid details
        if (this.all_Packet_store.grid_details?.length === 0 && !this.modalOpened) {
          this.modalOpened = true; // Prevent multiple openings
          if(modalFlag=='handlingPin'){
    

          }else {

            this.openModal('edit_ts', this.all_Packet_store, this.summaryModal);
          }
    
        }
        resolve(this.all_Packet_store);
        // Parsing multi_value entries in grid details if present
        if (this.all_Packet_store.grid_details && this.all_Packet_store.grid_details.length > 0) {
          this.all_Packet_store.grid_details.forEach((gridItem: { multi_value: any }, index: number) => {
            // if (gridItem?.multi_value) {
            //   // try {
            //   //   const multiValueString = gridItem.multi_value;
            //   //   gridItem.multi_value = Array.isArray(multiValueString)
            //   //     ? multiValueString
            //   //     : JSON.parse(multiValueString);
            //   //   //console.log(`After Parsing for item ${index}:`, gridItem);
            //   // } catch (error) {
            //   //   console.error(`Error parsing multi_value for item ${index}:`, error);
            //   // }
            // }
          });

          // Update dashboard property with parsed grid details
          this.dashboard = this.all_Packet_store.grid_details;
          //console.log('Dashboard after parsing:', this.dashboard);
        }

        // Theme matching logic to select/deselect themes based on grid details
        if (this.dashboard && this.themes) {
          this.dashboard.forEach((gridItem_1: any) => {
            const matchingTheme = this.themes.find(theme => theme.color === gridItem_1.themeColor);
            if (matchingTheme) {
              this.themes.forEach(theme_1 => {
                if (theme_1.color !== matchingTheme.color) {
                  theme_1.selected = false; // Unselect themes that don't match
                }
              });
              matchingTheme.selected = true;
              //console.log('Matching theme found and selected:', matchingTheme);
            }
          });
        }

        // Continue with change detection and data binding
        if (this.cdr) {
          this.cdr.detectChanges();
        }
        //console.log('this.all_Packet_store check resolve', this.all_Packet_store);
        this.bindDataToGridster(this.all_Packet_store);
        this.openModal('Edit_ts', this.all_Packet_store);
  

        // Resolve the Promise with full data
        // resolve(this.all_Packet_store);
      } else {
        console.error("No metadata found in result");
        reject("No metadata found");
      }
    } catch (err) {
      console.error("Error fetching or processing data:", err);
      reject(err);
    }
  });
}

// Usage example:



// Function call with proper Promise handling:



  helperFilter(data:any,index:any, KPIModal: TemplateRef<any>){
    if(data.grid_type=='filterTile'){
    this.modalService.open(KPIModal, {  modalDialogClass:'p-9',  centered: true ,  fullscreen: true,   backdrop: 'static',  // Disable closing on backdrop click
      keyboard: false  });

    // Access the component instance and trigger `openKPIModal`
    setTimeout(() => {
     
      this.FilterTileConfigComponent.openFilterModal(data, index);
    }, 500);
  }
  else if(data.grid_type=='tile'){
    this.modalService.open(KPIModal, {fullscreen: true, modalDialogClass:'p-9', centered: true,   backdrop: 'static',  // Disable closing on backdrop click
      keyboard: false  } );

    // Access the component instance and trigger `openKPIModal`
    setTimeout(() => {
     
      this.tileConfig1Component.openKPIModal(data, index);
    }, 500);

  }
  }

  helperTile(event: any, KPIModal: TemplateRef<any>) {
    //console.log('event checking from helperTile',event)
    //console.log('KPIModal check',KPIModal)


    if(event.arg1.grid_type=='tile'){
      this.modalService.open(KPIModal, {  modalDialogClass:'p-9',  centered: true ,  fullscreen: true,   backdrop: 'static',  // Disable closing on backdrop click
        keyboard: false  });

    
      // Access the component instance and trigger `openKPIModal`
      setTimeout(() => {
       
        this.tileConfig1Component.openKPIModal(event.arg1, event.arg2);
      }, 500);
    }
    else if(event.arg1.grid_type=='tileWithIcon'){

      this.modalService.open(KPIModal, {  modalDialogClass:'p-9',  centered: true ,  fullscreen: true,   backdrop: 'static',  // Disable closing on backdrop click
        keyboard: false  });

    
      // Access the component instance and trigger `openKPIModal`
      setTimeout(() => {
       
        this.TileWithIconComponent.openTileWithIcon(event.arg1, event.arg2);
      }, 500);
    }


    
    else if(event.arg1.grid_type=='MultiTableWidget'){
      this.modalService.open(KPIModal, {  modalDialogClass:'p-9',  centered: true ,  fullscreen: true,   backdrop: 'static',  // Disable closing on backdrop click
        keyboard: false  });

    
      // Access the component instance and trigger `openKPIModal`
      setTimeout(() => {
       
        this.MultiTableConfigComponent.openMultiTableModal(event.arg1, event.arg2);
      }, 500);
    }
    else if(event.arg1.grid_type=='logo'){
      this.modalService.open(KPIModal, {  modalDialogClass:'p-9',  centered: true ,  fullscreen: true,   backdrop: 'static',  // Disable closing on backdrop click
        keyboard: false  });

    
      // Access the component instance and trigger `openKPIModal`
      setTimeout(() => {
       
        this.ImageConfigComponent.openImageModal(event.arg1, event.arg2);
      }, 500);
    }
    else if(event.arg1.grid_type=='HTMLtile'){
      this.modalService.open(KPIModal, {  modalDialogClass:'p-9',  centered: true ,  fullscreen: true,   backdrop: 'static',  // Disable closing on backdrop click
        keyboard: false  });

    
      // Access the component instance and trigger `openKPIModal`
      setTimeout(() => {
       
        this.HtmlTileConfigComponent.openHTMLtile(event.arg1, event.arg2);
      }, 500);
    }
    else if(event.arg1.grid_type=='TableWidget'){
      this.modalService.open(KPIModal, {  modalDialogClass:'p-9',  centered: true ,  fullscreen: true,   backdrop: 'static',  // Disable closing on backdrop click
        keyboard: false  });

    
      // Access the component instance and trigger `openKPIModal`
      setTimeout(() => {
       
        this.TableWidgetConfigComponent.openTableModal(event.arg1, event.arg2);
      }, 500);
    }
    else if(event.arg1.grid_type=='Map'){
      this.modalService.open(KPIModal, {  modalDialogClass:'p-9',  centered: true ,  fullscreen: true,   backdrop: 'static',  // Disable closing on backdrop click
        keyboard: false  });

    
      // Access the component instance and trigger `openKPIModal`
      setTimeout(() => {
       
        this.MapConfigComponent.openMapModal(event.arg1, event.arg2);
      }, 500);
    }


    
    else if(event.arg1.grid_type=='tile2'){
      //console.log('modal check',KPIModal)
      this.modalService.open(KPIModal, {  modalDialogClass:'p-9',  centered: true ,  fullscreen: true,   backdrop: 'static',  // Disable closing on backdrop click
        keyboard: false  });
      //console.log('event check', event)
      setTimeout(() => {
        this.tileConfig2Component.openKPIModal1(event.arg1, event.arg2)
      }, 500);
    }
    else if(event.arg1.grid_type=='tile3'){
      this.modalService.open(KPIModal, {  modalDialogClass:'p-9',  centered: true ,  fullscreen: true,   backdrop: 'static',  // Disable closing on backdrop click
        keyboard: false  });
      //console.log('event check', event)
  
      setTimeout(() => {
        this.tileConfig3Component.edit_Tile3(event.arg1, event.arg2)
      }, 500);

    }
    else if (event.arg1.grid_type=='tile4'){
      this.modalService.open(KPIModal, {  modalDialogClass:'p-9',  centered: true ,  fullscreen: true,   backdrop: 'static',  // Disable closing on backdrop click
        keyboard: false  });
      //console.log('event check', event)
      setTimeout(() => {
        this.tileConfig4Component?.openKPIModal3(event.arg1, event.arg2)
      }, 500);
    }
    else if(event.arg1.grid_type=='tile5'){
      this.modalService.open(KPIModal, {  modalDialogClass:'p-9',  centered: true ,  fullscreen: true,   backdrop: 'static',  // Disable closing on backdrop click
        keyboard: false  });
      //console.log('event check', event)
      setTimeout(() => {
        this.tileConfig5Component?.openKPIModal4(event.arg1, event.arg2)
      }, 500);

    }
    else if(event.arg1.grid_type=='tile6'){
      this.modalService.open(KPIModal, {  modalDialogClass:'p-9',  centered: true ,  fullscreen: true,   backdrop: 'static',  // Disable closing on backdrop click
        keyboard: false  });
      //console.log('event check', event)
      setTimeout(() => {
        this.tileConfig6Component?.openKPIModal5(event.arg1, event.arg2)
      }, 500);
    }
    else if(event.arg1.grid_type=='title'){
      this.modalService.open(KPIModal, {  modalDialogClass:'p-9',  centered: true ,  fullscreen: true,   backdrop: 'static',  // Disable closing on backdrop click
        keyboard: false  });
      //console.log('event check', event)
      setTimeout(() => {
        this.titleConfigComponent.openTitleModal(event.arg1, event.arg2)
      }, 500);

    }

    else if(event.arg1.grid_type=='chart'){
      this.modalService.open(KPIModal, {  modalDialogClass:'p-9',  centered: true ,  fullscreen: true,   backdrop: 'static',  // Disable closing on backdrop click
        keyboard: false  });
      //console.log('event check', event)
      setTimeout(() => {
        this.ChartConfig1Component.openChartModal1(event.arg1, event.arg2)
      }, 500);


    }
    else if(event.arg1.grid_type=='semiDonut'){
      this.modalService.open(KPIModal, {  modalDialogClass:'p-9',  centered: true ,  fullscreen: true,   backdrop: 'static',  // Disable closing on backdrop click
        keyboard: false  });
      //console.log('event check', event)
      setTimeout(() => {
        this.SemiDonutConfigComponent.opensemiDonutModal(event.arg1, event.arg2)
      }, 500);

    }
    else if(event.arg1.grid_type=='Stackedchart'){
      this.modalService.open(KPIModal, {  modalDialogClass:'p-9',  centered: true ,  fullscreen: true,   backdrop: 'static',  // Disable closing on backdrop click
        keyboard: false  });
      //console.log('event check', event)
      setTimeout(() => {
        this.StackedBarConfigComponent.openStackedChartModal(event.arg1, event.arg2)
      }, 500);

    }

    else if(event.arg1.grid_type=='dailChart'){
      this.modalService.open(KPIModal, {  modalDialogClass:'p-9',  centered: true ,  fullscreen: true,   backdrop: 'static',  // Disable closing on backdrop click
        keyboard: false  });
      //console.log('event check from dail chart', event)
      setTimeout(() => {
        this.GaugeChartConfigComponent.opengaugeChartModal(event.arg1, event.arg2)
      }, 500);

    }
    

    else if(event.arg1.grid_type=='Piechart'){
      this.modalService.open(KPIModal, {  modalDialogClass:'p-9',  centered: true ,  fullscreen: true,   backdrop: 'static',  // Disable closing on backdrop click
        keyboard: false  });
      //console.log('event check', event)
      setTimeout(() => {
        this.PieChartConfigComponent.openPieChartModal(event.arg1, event.arg2)
      }, 500);

    }

    else if(event.arg1.grid_type=='Linechart'){
      this.modalService.open(KPIModal, {  modalDialogClass:'p-9',  centered: true ,  fullscreen: true,   backdrop: 'static',  // Disable closing on backdrop click
        keyboard: false  });
      //console.log('event check', event)
      setTimeout(() => {
        this.ChartConfig2Component.openChartModal2(event.arg1, event.arg2)
      }, 500);

    }

    else if(event.arg1.grid_type=='Funnelchart'){
      this.modalService.open(KPIModal, {  modalDialogClass:'p-9',  centered: true ,  fullscreen: true,   backdrop: 'static',  // Disable closing on backdrop click
        keyboard: false  });
      //console.log('event check', event)
      setTimeout(() => {
        this.FunnelChartConfigComponent.openFunnelChartModal(event.arg1, event.arg2)
      }, 500);

    }

    else if(event.arg1.grid_type=='Columnchart'){
      this.modalService.open(KPIModal, {  modalDialogClass:'p-9',  centered: true ,  fullscreen: true,   backdrop: 'static',  // Disable closing on backdrop click
        keyboard: false  });
      //console.log('event check', event)
      setTimeout(() => {
        this.ChartConfig3Component.openChartModal3(event.arg1, event.arg2)
      }, 500);

    }
    else if(event.arg1.grid_type=='mixedChart'){
      this.modalService.open(KPIModal, {  modalDialogClass:'p-9',  centered: true ,  fullscreen: true,   backdrop: 'static',  // Disable closing on backdrop click
        keyboard: false  });
      //console.log('event check', event)
      setTimeout(() => {
        this.MixedChartConfigComponent.openMixedChartModal(event.arg1, event.arg2)
      }, 500);

    }

    
    else if(event.arg1.grid_type=='Areachart'){
      this.modalService.open(KPIModal, {  modalDialogClass:'p-9',  centered: true ,  fullscreen: true,   backdrop: 'static',  // Disable closing on backdrop click
        keyboard: false  });
      //console.log('event check', event)
      setTimeout(() => {
        this.ChartConfig4Component.openChartModal4(event.arg1, event.arg2)
      }, 500);

    }
    else if(event.arg1.grid_type=='Barchart'){
      this.modalService.open(KPIModal, {  modalDialogClass:'p-9',  centered: true ,  fullscreen: true,   backdrop: 'static',  // Disable closing on backdrop click
        keyboard: false  });
      //console.log('event check', event)
      setTimeout(() => {
        this.ChartConfig5Component.openChartModal5(event.arg1, event.arg2)
      }, 500);

    }
    else if(event.arg1.grid_type=='dynamicTile'){

      this.modalService.open(KPIModal, {  modalDialogClass:'p-9',  centered: true ,  fullscreen: true,   backdrop: 'static',  // Disable closing on backdrop click
        keyboard: false  });
      //console.log('event check dynamic tile', event)
    
      // Access the component instance and trigger `openKPIModal`
      setTimeout(() => {
       
        this.DynamicTileConfigComponent.openDynamicTileModal(event.arg1, event.arg2);
      }, 500);
    }


    else if(event.arg1.grid_type=='title'){
      this.modalService.open(KPIModal, {  modalDialogClass:'p-9',  centered: true ,  fullscreen: true,   backdrop: 'static',  // Disable closing on backdrop click
        keyboard: false  });
      //console.log('event check dynamic tile', event)
    
      // Access the component instance and trigger `openKPIModal`
      setTimeout(() => {
       
        this.titleConfigComponent.openTitleModal(event.arg1, event.arg2);
      }, 500);
    }

    else if(event.arg1.grid_type=='filterTile'){
      this.modalService.open(KPIModal, {  modalDialogClass:'p-9',  centered: true ,  fullscreen: true,   backdrop: 'static',  // Disable closing on backdrop click
        keyboard: false  });
      //console.log('event check dynamic tile', event)
      //console.log('event.arg1 checking',event.arg1)
      //console.log('event.arg2 checking',event.arg2)
    
      // Access the component instance and trigger `openKPIModal`
      setTimeout(() => {
       
        this.FilterTileConfigComponent.openFilterModal(event.arg1, event.arg2);
      }, 500);
    }



    else if(event.arg1.grid_type=='progressTile'){
      //console.log('i am openining')
      this.modalService.open(KPIModal, {  modalDialogClass:'p-9',  centered: true ,  fullscreen: true,   backdrop: 'static',  // Disable closing on backdrop click
        keyboard: false  });
      //console.log('event check progress', event)
    
      // Access the component instance and trigger `openKPIModal`
      setTimeout(() => {
       
        this.ProgressTileComponent.openProgressTileModal(event.arg1, event.arg2);
      }, 500);
    }

    

    

    
    }

    helperEditModalOpen(argument1:any,argument2:any,modalReference: TemplateRef<any>,gridCheck?:any){
      // this.isGirdMoved = gridCheck;
      //console.log('i am entered to tile 1 edit modal')
      if(argument1.grid_type=='tile'){
        this.modalService.open(modalReference, {  modalDialogClass:'p-9',  centered: true ,  fullscreen: true,   backdrop: 'static',  // Disable closing on backdrop click
          keyboard: false  });
  
      
        // Access the component instance and trigger `openKPIModal`
        setTimeout(() => {
         
          this.tileConfig1Component.openKPIModal(argument1, argument2);
        }, 500);
      }
      else if(argument1.grid_type=='tile2'){
        //console.log('modal check',modalReference)
      this.modalService.open(modalReference, {  modalDialogClass:'p-9',  centered: true ,  fullscreen: true,   backdrop: 'static',  // Disable closing on backdrop click
        keyboard: false  });
      //console.log('event check', event)
      setTimeout(() => {
        this.tileConfig2Component.openKPIModal1(argument1, argument2)
      }, 500);

      }

      else if (argument1.grid_type=='dynamicTile'){
        this.modalService.open(modalReference, {  modalDialogClass:'p-9',  centered: true ,  fullscreen: true,   backdrop: 'static',  // Disable closing on backdrop click
          keyboard: false  });
      //console.log('event check dynamic tile', event)
    
      // Access the component instance and trigger `openKPIModal`
      setTimeout(() => {
       
        this.DynamicTileConfigComponent.openDynamicTileModal(argument1, argument2);
      }, 500);
        
      }

      else if(argument1.grid_type=='title'){
        this.modalService.open(modalReference, {  modalDialogClass:'p-9',  centered: true ,  fullscreen: true,   backdrop: 'static',  // Disable closing on backdrop click
          keyboard: false  });
        //console.log('event check dynamic tile', event)
      
        // Access the component instance and trigger `openKPIModal`
        setTimeout(() => {
         
          this.titleConfigComponent.openTitleModal(argument1, argument2);
        }, 500);
      }



      else if(argument1.grid_type=='tileWithIcon'){

        this.modalService.open(modalReference, {  modalDialogClass:'p-9',  centered: true ,  fullscreen: true,   backdrop: 'static',  // Disable closing on backdrop click
          keyboard: false  });
  
      
        // Access the component instance and trigger `openKPIModal`
        setTimeout(() => {
         
          this.TileWithIconComponent.openTileWithIcon(argument1, argument2);
        }, 500);
      }
      else if(argument1.grid_type=='progressTile'){
        //console.log('i am openining')
        this.modalService.open(modalReference, {  modalDialogClass:'p-9',  centered: true ,  fullscreen: true,   backdrop: 'static',  // Disable closing on backdrop click
          keyboard: false  });
        //console.log('event check progress', event)
      
        // Access the component instance and trigger `openKPIModal`
        setTimeout(() => {
         
          this.ProgressTileComponent.openProgressTileModal(argument1, argument2);
        }, 500);
      }



      else if(argument1.grid_type=='chart'){
        this.modalService.open(modalReference, {  modalDialogClass:'p-9',  centered: true ,  fullscreen: true,   backdrop: 'static',  // Disable closing on backdrop click
          keyboard: false  });
        //console.log('event check', event)
        setTimeout(() => {
          this.ChartConfig1Component.openChartModal1(argument1, argument2)
        }, 500);
  
  
      }


      else if(argument1.grid_type=='Linechart'){
        this.modalService.open(modalReference, {  modalDialogClass:'p-9',  centered: true ,  fullscreen: true,   backdrop: 'static',  // Disable closing on backdrop click
          keyboard: false  });
        //console.log('event check', event)
        setTimeout(() => {
          this.ChartConfig2Component.openChartModal2(argument1, argument2)
        }, 500);
  
      }


      else if(argument1.grid_type=='Columnchart'){
        this.modalService.open(modalReference, {  modalDialogClass:'p-9',  centered: true ,  fullscreen: true,   backdrop: 'static',  // Disable closing on backdrop click
          keyboard: false  });
        //console.log('event check', event)
        setTimeout(() => {
          this.ChartConfig3Component.openChartModal3(argument1, argument2)
        }, 500);
  
      }
      else if(argument1.grid_type=='Funnelchart'){
        this.modalService.open(modalReference, {  modalDialogClass:'p-9',  centered: true ,  fullscreen: true,   backdrop: 'static',  // Disable closing on backdrop click
          keyboard: false  });
        //console.log('event check', event)
        setTimeout(() => {
          this.FunnelChartConfigComponent.openFunnelChartModal(argument1, argument2)
        }, 500);
  
      }

      else if(argument1.grid_type=='Piechart'){
        this.modalService.open(modalReference, {  modalDialogClass:'p-9',  centered: true ,  fullscreen: true,   backdrop: 'static',  // Disable closing on backdrop click
          keyboard: false  });
        //console.log('event check', event)
        setTimeout(() => {
          this.PieChartConfigComponent.openPieChartModal(argument1, argument2)
        }, 500);
  
      }

      else if(argument1.grid_type=='Stackedchart'){
        this.modalService.open(modalReference, {  modalDialogClass:'p-9',  centered: true ,  fullscreen: true,   backdrop: 'static',  // Disable closing on backdrop click
          keyboard: false  });
        //console.log('event check', event)
        setTimeout(() => {
          this.StackedBarConfigComponent.openStackedChartModal(argument1, argument2)
        }, 500);
  
      }



      else if(argument1.grid_type=='dailChart'){
        this.modalService.open(modalReference, {  modalDialogClass:'p-9',  centered: true ,  fullscreen: true,   backdrop: 'static',  // Disable closing on backdrop click
          keyboard: false  });
        //console.log('event check', event)
        setTimeout(() => {
          this.GaugeChartConfigComponent.opengaugeChartModal(argument1, argument2)
        }, 500);
  
      }




      
      else if(argument1.grid_type=='TableWidget'){
        this.modalService.open(modalReference, {  modalDialogClass:'p-9',  centered: true ,  fullscreen: true,   backdrop: 'static',  // Disable closing on backdrop click
          keyboard: false  });
  
      
        // Access the component instance and trigger `openKPIModal`
        setTimeout(() => {
         
          this.TableWidgetConfigComponent.openTableModal(argument1, argument2);
        }, 500);
      }
      

    }

    // isHovered = false;  // Flag to manage hover state

    // // Method to handle mouse enter event
    // onMouseEnter() {
    //   this.isHovered = true;  // Set hover state to true
    // }
  
    // // Method to handle mouse leave event
    // onMouseLeave() {
    //   this.isHovered = false;  // Set hover state to false
    // }







  emitDuplicate(event: { data: { arg1: any; arg2: number }; all_Packet_store: any }) {
    const { arg1, arg2 } = event.data;
    const { all_Packet_store } = event;
    if(event.data.arg1.grid_type=='tile'){
      // //console.log('event check', event)
      this.isGirdMoved = false; 
  // this.dashboard.push(arg1)

  // //console.log('event check chart1', event);
    
  // Store all company details
  //console.log('event.all_Packet_store checking',event.all_Packet_store)
  this.allCompanyDetails = event.all_Packet_store;
  this.updateSummary('','duplicateWidget')

  // Directly update the id and push the object into the dashboard in one line
  this.dashboard.push({
    ...event.data.arg1,
    id: Date.now() + Math.floor(Math.random() * 1000) // Update the id inline
  });

  //console.log('event.data.arg1', event.data.arg1);
  // window.location.reload();

 

    }


    if(event.data.arg1.grid_type=='tileWithIcon'){
      // //console.log('event check', event)
      this.isGirdMoved = false; 
  // this.dashboard.push(arg1)

  // //console.log('event check chart1', event);
    
  // Store all company details
  this.allCompanyDetails = event.all_Packet_store;

  // Directly update the id and push the object into the dashboard in one line
  this.dashboard.push({
    ...event.data.arg1,
    id: Date.now() + Math.floor(Math.random() * 1000) // Update the id inline
  });

  //console.log('event.data.arg1', event.data.arg1);
 

    }
    else if(event.data.arg1.grid_type=='TableWidget'){
      //console.log('event check', event)
      this.allCompanyDetails = event.all_Packet_store;
      this.dashboard.push({
        ...event.data.arg1,
        id: Date.now() + Math.floor(Math.random() * 1000) // Update the id inline
      });
    
      //console.log('event.data.arg1', event.data.arg1);
 
    }
    else if(event.data.arg1.grid_type=='HTMLtile'){
      //console.log('event check', event)
      this.allCompanyDetails = event.all_Packet_store;
      this.dashboard.push({
        ...event.data.arg1,
        id: Date.now() + Math.floor(Math.random() * 1000) // Update the id inline
      });
    
      //console.log('event.data.arg1', event.data.arg1);
 
    }

    else if(event.data.arg1.grid_type=='logo'){
      //console.log('event check', event)
      this.allCompanyDetails = event.all_Packet_store;
      this.dashboard.push({
        ...event.data.arg1,
        id: Date.now() + Math.floor(Math.random() * 1000) // Update the id inline
      });
    
      //console.log('event.data.arg1', event.data.arg1);
 
    }
    else if(event.data.arg1.grid_type=='MultiTableWidget'){
      //console.log('event check', event)
      this.allCompanyDetails = event.all_Packet_store;
      this.dashboard.push({
        ...event.data.arg1,
        id: Date.now() + Math.floor(Math.random() * 1000) // Update the id inline
      });
    
      //console.log('event.data.arg1', event.data.arg1);
 
    }
    else if(event.data.arg1.grid_type=='Map'){
      //console.log('event check', event)
      this.allCompanyDetails = event.all_Packet_store;
      this.dashboard.push({
        ...event.data.arg1,
        id: Date.now() + Math.floor(Math.random() * 1000) // Update the id inline
      });
    
      //console.log('event.data.arg1', event.data.arg1);
     
    }
    else if(event.data.arg1.grid_type=='tile2'){
      //console.log('event check', event)
      this.allCompanyDetails = event.all_Packet_store;
      this.dashboard.push({
        ...event.data.arg1,
        id: Date.now() + Math.floor(Math.random() * 1000) // Update the id inline
      });
    
      //console.log('event.data.arg1', event.data.arg1);

    }
    else if(event.data.arg1.grid_type=='filterTile'){
      //console.log('event check', event)
      this.allCompanyDetails = event.all_Packet_store;
      this.dashboard.push({
        ...event.data.arg1,
        id: Date.now() + Math.floor(Math.random() * 1000) // Update the id inline
      });
    
      //console.log('event.data.arg1', event.data.arg1);
   
    }
    else if(event.data.arg1.grid_type=='tile3'){
      //console.log('event check', event)
      this.allCompanyDetails = event.all_Packet_store;
      this.dashboard.push({
        ...event.data.arg1,
        id: Date.now() + Math.floor(Math.random() * 1000) // Update the id inline
      });
    
      //console.log('event.data.arg1', event.data.arg1);

    }
    else if(event.data.arg1.grid_type=='tile4'){
      //console.log('event check', event)
      this.allCompanyDetails = event.all_Packet_store;
      this.dashboard.push(event.data.arg1)


    }
    else if(event.data.arg1.grid_type=='tile5'){
      //console.log('event check', event)
      this.allCompanyDetails = event.all_Packet_store;
      this.dashboard.push(event.data.arg1)
    

    }
    else if(event.data.arg1.grid_type=='tile6'){
      //console.log('event check', event)
      this.allCompanyDetails = event.all_Packet_store;
      this.dashboard.push(event.data.arg1)


    }
    else if (event.data.arg1.grid_type === 'chart') {
      //console.log('event check chart1', event);
    
      // Store all company details
      this.allCompanyDetails = event.all_Packet_store;
    
      // Directly update the id and push the object into the dashboard in one line
      this.dashboard.push({
        ...event.data.arg1,
        id: Date.now() + Math.floor(Math.random() * 1000) // Update the id inline
      });
    
      //console.log('event.data.arg1', event.data.arg1);
    }

    else if (event.data.arg1.grid_type === 'semiDonut') {
      //console.log('event check chart1', event);
    
      // Store all company details
      this.allCompanyDetails = event.all_Packet_store;
    
      // Directly update the id and push the object into the dashboard in one line
      this.dashboard.push({
        ...event.data.arg1,
        id: Date.now() + Math.floor(Math.random() * 1000) // Update the id inline
      });
    
      //console.log('event.data.arg1', event.data.arg1);
    }



    

    else if (event.data.arg1.grid_type === 'Piechart') {
      //console.log('event check chart1', event);
    
      // Store all company details
      this.allCompanyDetails = event.all_Packet_store;
    
      // Directly update the id and push the object into the dashboard in one line
      this.dashboard.push({
        ...event.data.arg1,
        id: Date.now() + Math.floor(Math.random() * 1000) // Update the id inline
      });
    
      //console.log('event.data.arg1', event.data.arg1);
    }

    

    else if (event.data.arg1.grid_type === 'Funnelchart') {
      //console.log('event check chart1', event);
    
      // Store all company details
      this.allCompanyDetails = event.all_Packet_store;
    
      // Directly update the id and push the object into the dashboard in one line
      this.dashboard.push({
        ...event.data.arg1,
        id: Date.now() + Math.floor(Math.random() * 1000) // Update the id inline
      });
    
      //console.log('event.data.arg1', event.data.arg1);
    }
    
    
    
    
    else if(event.data.arg1.grid_type=='Linechart'){
      //console.log('event check', event)
      this.allCompanyDetails = event.all_Packet_store;
      this.dashboard.push({
        ...event.data.arg1,
        id: Date.now() + Math.floor(Math.random() * 1000) // Update the id inline
      });
    
      //console.log('event.data.arg1', event.data.arg1);
    

    }
        else if(event.data.arg1.grid_type=='Columnchart'){
      //console.log('event check', event)
      this.allCompanyDetails = event.all_Packet_store;
      this.dashboard.push({
        ...event.data.arg1,
        id: Date.now() + Math.floor(Math.random() * 1000) // Update the id inline
      });
    
      //console.log('event.data.arg1', event.data.arg1);


    }
    else if(event.data.arg1.grid_type=='mixedChart'){
      //console.log('event check', event)
      this.allCompanyDetails = event.all_Packet_store;
      this.dashboard.push({
        ...event.data.arg1,
        id: Date.now() + Math.floor(Math.random() * 1000) // Update the id inline
      });
    
      //console.log('event.data.arg1', event.data.arg1);


    }



    
        else if(event.data.arg1.grid_type=='Areachart'){
      //console.log('event check', event)
      this.allCompanyDetails = event.all_Packet_store;
      this.dashboard.push(event.data.arg1)


    }
    else if(event.data.arg1.grid_type=='Barchart'){
      //console.log('event check', event)
      this.allCompanyDetails = event.all_Packet_store;
      this.dashboard.push(event.data.arg1)


    }


    else if(event.data.arg1.grid_type=='dynamicTile'){
      //console.log('event check from dynamic', event.data.arg1)
      this.allCompanyDetails = event.all_Packet_store;
      this.dashboard.push({
        ...event.data.arg1,
        id: Date.now() + Math.floor(Math.random() * 1000) // Update the id inline
      });
    
      //console.log('event.data.arg1', event.data.arg1);
      //console.log('this.dashboard from dynamic',event.all_Packet_store)


    }



    else if(event.data.arg1.grid_type=='progressTile'){
      //console.log('event check from dynamic', event.data.arg1)
      this.allCompanyDetails = event.all_Packet_store;
      this.dashboard.push({
        ...event.data.arg1,
        id: Date.now() + Math.floor(Math.random() * 1000) // Update the id inline
      });
    
      //console.log('event.data.arg1', event.data.arg1);
      //console.log('this.dashboard from dynamic',event.all_Packet_store)


    }
    else if(event.data.arg1.grid_type=='title'){
      //console.log('event check from dynamic', event.data.arg1)
      this.allCompanyDetails = event.all_Packet_store;
      this.dashboard.push({
        ...event.data.arg1,
        id: Date.now() + Math.floor(Math.random() * 1000) // Update the id inline
      });
    
      //console.log('event.data.arg1', event.data.arg1);
      //console.log('this.dashboard from dynamic',event.all_Packet_store)



    }
    else if(event.data.arg1.grid_type=='Stackedchart'){
      //console.log('event check from dynamic', event.data.arg1)
      this.allCompanyDetails = event.all_Packet_store;
      this.dashboard.push({
        ...event.data.arg1,
        id: Date.now() + Math.floor(Math.random() * 1000) // Update the id inline
      });
    
      //console.log('event.data.arg1', event.data.arg1);
      //console.log('this.dashboard from dynamic',event.all_Packet_store)



    }


  }





  emitDuplicateTitle(event: any) {
    //console.log('event check ', event)
    this.dashboard.push(event.arg1)
    this.updateSummary('','update_tile')

  }


  // emitDelete1(event: any) {
  //   //console.log('event check', event)
  //   this.deleteTile(event.arg1, event.arg2)

  // }

  // emitDelete2(event: any) {
  //   //console.log('event check', event)
  //   this.deleteTile(event.arg1, event.arg2)

  // }

  // emitDelete3(event: any) {
  //   //console.log('event check', event)
  //   this.deleteTile(event.arg1, event.arg2)

  // }
  // emitDelete4(event: any) {
  //   //console.log('event check', event)
  //   this.deleteTile(event.arg1, event.arg2)

  // }
  // emitDelete5(event: any) {
  //   //console.log('event check', event)
  //   this.deleteTile(event.arg1, event.arg2)

  // }
  emitDelete6(event: { data: { arg1: any; arg2: number }; all_Packet_store: any }) {
    //console.log('event check from delete', event.all_Packet_store)
    //console.log('event.data.arg1 check',event.data.arg1)
    this.deleteTile(event.data.arg1, event.data.arg2,event.all_Packet_store)

  }
  // emitDeleteTitle(event: any) {
  //   //console.log('event check', event)
  //   this.deleteTile(event.arg1, event.arg2)

  // }

  bindDataToGridster(data: any) {
    //console.log('bindDataToGridster data checking', data);
  
    // Check if data is an object and has the 'jsonData' property as an array
    if (data && typeof data === 'object' && Array.isArray(data.jsonData)) {
      this.dashboard = data.jsonData.map((item: any, index: number) => {
        return {
          cols: 2,
          rows: 2,
          y: Math.floor(index / 6),
          x: (index % 6) * 2,
          title: `Item ${index + 1}`, // Adjust as necessary
          ...item // Spread the item properties into the dashboard item
        };
      });
      //console.log('this.dashboard for gridster check', this.dashboard);
    } else {
      // Additional check for data structure
      if (!data) {
        console.error('Data is null or undefined');
      } else if (typeof data !== 'object') {
        console.error('Expected data to be an object, but got:', typeof data);
      } else if (!Array.isArray(data.jsonData)) {
        console.error('Expected data.jsonData to be an array, but got:', data.jsonData);
      }
    }
  }
  

  getProperties(item: any): Array<{ key: string, value: any }> {
    return Object.entries(item).map(([key, value]) => ({
      key,
      value
    }));
  }




  jsonValidator(control: AbstractControl) {
    try {
      const value = control.value;
      if (value) {
        JSON.parse(value);  // Check if the value is valid JSON
      }
      return null;  // Return null if valid JSON
    } catch (e) {
      return { invalidJson: true };  // Return an error if not valid JSON
    }
  }


  // Example function that uses the selectedValue


  selectIcon(event: any, source: string): void {
    // Retrieve the selected icon from the event
    const selectedIcon = event; // This will be the selected icon object
    //console.log('Selected Icon:', selectedIcon);
    //console.log('Source:', source);

    // Implement your logic here, for example:
    if (selectedIcon) {
      // Update any necessary state or perform actions based on the selected icon
      // Example: You could set the icon's value to another control or trigger a service
      // this.someOtherControl.setValue(selectedIcon.value);
    } else {
      // Handle the case when no icon is selected (if needed)
      //console.log('No icon selected.');
    }
  }

  openModal(flag: string, getValues?: any, content?: any): void {
    //console.log('getValues inside openModal', getValues);
  
    // Reset the common modal state
    this.errorForUniqueID = '';
  
    // Switch case to handle different flags
    switch (flag) {
      case 'new':
        this.handleNewModal(content);
        break;
  
      case 'Edit_ts':
        this.handleEditModal(getValues, content);
        break;
      case 'Edit':
        this.handleEditModalHtml(getValues, content);
        break;
      default:
        this.handleEditModalHtml(getValues, content);
        break;
    }
  
    // Check if the "Add Dashboard" tab is configured before switching to "Add Widgets"
//console.log('selectedTab checking',this.selectedTab)
  
    // Proceed with opening the modal as usual
    this.showAddWidgetsTab = true;
    this.selectedTab = this.showModal ? 'add-widget' : 'add-dashboard';
  
    // Detect changes to ensure the view is updated
    this.cd.detectChanges();
  }
  

  private handleNewModal(content: any): void {
    this.showHeading = true;
    this.showModal = false;
    this.previewObjDisplay = null;
    this.selectedTab = 'add-dashboard'; // Set Add Summary as the default tab
    
    // Enable fields and reset form for new entry
    this.createSummaryField.get('summaryID')?.enable();
    this.createSummaryField.reset({
      summaryID: '',
      summaryName: '',
      summarydesc: '',
      iconSelect: '',
      LiveDashboard:'',
      fullScreenModeCheck:'',
      // DashboardRestriction:''
      
      
    });
  
    // Open modal for new entry
    this.modalService.open(content, {  modalDialogClass:'p-9',  centered: true ,  fullscreen: true,   backdrop: 'static',  // Disable closing on backdrop click
      keyboard: false  });
  }
  

  private handleEditModal(getValues: any, content: any): void {
    //console.log('getValueschecking',getValues)
    if (getValues) {
      this.showHeading = false;
      this.showModal = true;
      this.cd.detectChanges();
         this.tilesListDefault = 'Tiles'

      //console.log('this.createSummaryField from editModal', this.createSummaryField);

      // Parse iconObject if it's a string
      this.previewObjDisplay = typeof getValues.iconObject === 'string'
        ? JSON.parse(getValues.iconObject)
        : getValues.iconObject;

      // Disable summaryID and set form values for editing
      this.createSummaryField.get('summaryID')?.enable();

      this.createSummaryField.patchValue({
        summaryID: getValues.summaryID,
        summaryName: getValues.summaryName,
        summarydesc: getValues.summaryDesc || '', // Default to empty string if summaryDesc is undefined
        iconSelect: getValues.summaryIcon || '',
        tilesList:getValues.tilesList,  // Default to empty string if summaryIcon is undefined
        LiveDashboard: getValues.LiveDashboard,
        fullScreenModeCheck:getValues.fullScreenModeCheck,
        // DashboardRestriction:getValues.DashboardRestriction
      });
      this.cd.detectChanges(); 
    }
  }

  previewIcon(event: any) {
    //console.log('event checking from preview', event);
  
    // Access the selected option from the event
    const selectedValue = event[0]?.value; // The selected value (e.g., 'youtube')
  
    // Find the icon based on the selected value
    const selectedIcon = this.iconsList.find((packet: any) => packet.value === selectedValue);
  
    // Perform a deep copy if selectedIcon is found
    if (selectedIcon) {
      this.previewObjDisplay = JSON.parse(JSON.stringify(selectedIcon)); // Deep copy
      //console.log("this.previewObjDisplay", this.previewObjDisplay);
    } else {
      console.warn("No matching icon found.");
    }
  
    this.cdr.detectChanges();
  }
  
  private handleEditModalHtml(getValues: any, content: any): void {
    //console.log('getValues checking for ', getValues);
    if (getValues) {
      this.showHeading = false;
      this.showModal = true;
      this.tilesListDefault = 'Tiles'

      // Disable summaryID and set form values for editing
      this.createSummaryField.get('summaryID')?.disable();
      this.createSummaryField = this.fb.group({
        summaryID: getValues.summaryID,
        summaryName: getValues.summaryName,
        summarydesc: getValues.summaryDesc,
        iconSelect: getValues.summaryIcon,
        tilesList:this.tilesListDefault,
        LiveDashboard:getValues.LiveDashboard,
        fullScreenModeCheck:getValues.fullScreenModeCheck,
        // DashboardRestriction:getValues.DashboardRestriction

          // Assign the entire icon object here
      });
      //console.log('this.createSummaryField from editModal', this.createSummaryField);
      if (typeof getValues.iconObject == "string") {
        this.previewObjDisplay = JSON.parse(getValues.iconObject)
      } else {
        this.previewObjDisplay = getValues.iconObject
      }
    }

    // Open modal for editing
    this.modalService.open(content,{  modalDialogClass:'p-9',  centered: true ,  fullscreen: true,   backdrop: 'static',  // Disable closing on backdrop click
      keyboard: false  });
  }





  deleteCompany(value: any) {

    this.summarySK = value;

    //console.log("Delete this :", value);

    this.allCompanyDetails = {
      PK: this.SK_clientID + "#" + value + "#summary#main",
      SK: 1
    }

    //console.log("All summary Details :", this.allCompanyDetails);

    const date = Math.ceil(((new Date()).getTime()) / 1000)
    const items = {
      P1: value,
    }


    this.api.DeleteMaster(this.allCompanyDetails).then(async value => {

      if (value) {

        await this.fetchTimeMachineById(1, items.P1, 'delete', items);

        this.reloadEvent.next(true)

        Swal.fire(
          'Removed!',
          'Company configuration successfully.',
          'success'
        );
      }


      const UserDetails = {
        "User Name": this.userdetails,
        "Action": "Deleted",
        "Module Name": "Summary Dashboard",
        "Form Name": "Summary Dashboard",
        "Description": "Dashboard is Deleted",
        "User Id": this.userdetails,
        "Client Id": this.SK_clientID,
        "created_time": Date.now(),
        "updated_time": Date.now()
      }
  
      this.auditTrail.mappingAuditTrailData(UserDetails,this.SK_clientID)

    }).catch(err => {
      //console.log('error for deleting', err);
    })
  }


  delete(id: number) {
    //console.log("Deleted username will be", id);
    this.deleteCompany(id);
  }
  create() {
    // this.userModel = { P1: '', P2: '', P3: '',P4:0,P5:'' };
  }




  initializeCompanyFields() {
    this.createSummaryField = this.fb.group({


      'summaryID': ['', Validators.required],
      'summaryName': ['', Validators.required],
      'summarydesc': ['', Validators.required],
      'iconSelect': [[], Validators.required],
      'tilesList':['Tiles'],
      LiveDashboard: [false], // Default toggle state
      PinCheck:[],
      fullScreenModeCheck:[''],
      // DashboardRestriction:['']

    })
  }


  showValidationErrors:boolean=false
  onSaveClick(): void {
    this.showValidationErrors = true;  // Show error messages on Save
  
    // Perform validation check for required fields, uniqueness, and validity
    if (this.createSummaryField.valid && !this.isDuplicateID && !this.isDuplicateName && this.isValidID) {
      this.createNewSummary();  // Proceed with saving
      // this.modal.dismiss();
      this.modalService.dismissAll();
    } else {
      //console.log("Form is invalid or there are duplicate values.");
    }
  }
  





  saveKPIWidget() {
    if (this.createKPIWidget.valid) {
      // Logic to save the KPI Widget data
      //console.log('Form Data:', this.createKPIWidget.value);
      // Close the modal or handle success feedback
    } else {
      //console.log('Form is invalid');
    }
  }
  generateUniqueId(): number {
    this.widgetIdCounter++;
    return Date.now() + this.widgetIdCounter; // Use timestamp and counter for uniqueness
  }
  duplicateTile1(tile: any, index: number): void {
    if (!tile || index < 0 || index >= this.dashboard.length) {
      console.error('Invalid tile or index for duplication.');
      return;
    }

    const uniqueId = this.generateUniqueId();

    const clonedTile = {
      ...tile, // Copy all existing properties
      id: uniqueId, // Assign a new unique ID
      x: tile.x || 0, // Retain or reset x position
      y: tile.y || 0, // Retain or reset y position
      cols: tile.cols || 20,
      rows: tile.rows || 20,
      rowHeight: tile.rowHeight || 100,
      colWidth: tile.colWidth || 100,
      fixedColWidth: tile.fixedColWidth ?? true,
      fixedRowHeight: tile.fixedRowHeight ?? true,
      grid_type: tile.grid_type || 'tile2',
      formlist: tile.formlist,
      parameterName: tile.parameterName,
      groupBy: tile.groupBy,
      themeColor: tile.themeColor , // Set a default if not present
      multi_value: tile.multi_value
        ? tile.multi_value.map((value: any) => ({ ...value })) // Deep copy
        : [
          {
            value: tile.primaryValue || '',
            constantValue:
              tile.constantValue !== undefined && tile.constantValue !== null
                ? tile.constantValue
                : 0,
          },
          {
            value: tile.secondaryValue || '',
          },
          {
            processed_value: tile.processed_value || '',
          },
        ],
      groupByFormat: tile.groupByFormat,
    };

    // Add the cloned tile to the dashboard at the correct position
    this.dashboard.splice(index + 1, 0, clonedTile);

    //console.log('this.dashboard after duplicating a tile:', this.dashboard);

    // Trigger change detection to ensure the UI updates
    this.cdr.detectChanges();

    // Update summary to handle the addition of the duplicated tile
    this.updateSummary('', 'add_tile');
  }

  getGridDetails(data: any) {
    //console.log('data checking before',data)
    this.dashboard = data;
    //console.log('this.dashboard check', this.dashboard)
    ////console.log('myh grid',this.grid_details)

  }
  getGridDetails1(data: any) {
    this.dashboard = data;
    //console.log('this.dashboard check', this.dashboard)
    ////console.log('myh grid',this.grid_details)

  }
  getGridDetails2(data: any) {
    //console.log('data checking from emit',data)
    this.dashboard = data;
    //console.log('this.dashboard check', this.dashboard)
    ////console.log('myh grid',this.grid_details)

  }










  shouldShowItem(item: any, index: number): boolean {
    // Replace this logic with your condition to hide or show the item
    return false; // This will hide all items
  }


  updateSummaryHelper(event: any) {
    //console.log('event check for save', event)
    this.updateSummary('', event)

  }
  updateSummaryHelper1(event: any) {
    //console.log('event check for save', event)
    this.updateSummary('', event)
  }

  updateSummaryHelper2(event: { data: any; arg2: any }) {
    //console.log('Data received:', event.data);
    //console.log('Arg2 received:', event.arg2);
  
    // Reinitialize this.allCompanyDetails using the received data
    this.allCompanyDetails = event.data;
  
    //console.log('Updated allCompanyDetails before updateSummary:', this.allCompanyDetails);
  
    // Pass the unpacked arguments to updateSummary
    this.isGirdMoved = true;
    this.updateSummary(event.data, event.arg2);
    // setTimeout(() => {
    //   window.location.reload()
    // }, 1000);
   
  }
  
  

  allPacketStoreReceiver(event: any) {
    //console.log(event)
    this.all_Packet_store = event

  }

  allPacketStoreReceiver1(event: any) {
    //console.log(event)
    this.all_Packet_store = event

  }
  allPacketStoreReceiver2(event: any) {
    //console.log(event)
    this.all_Packet_store = event

  }
  duplicateSummaryDashboardData(event: any) {
    //console.log('Duplicate dashboard event:', event);
  
    // Call the summary creation function with the duplicated data
    this.createNewSummaryDuplicate(event);
  }
  createNewSummaryDuplicate(duplicateData: any) {
    //console.log('duplicateData check',duplicateData)
    this.defaultValue = 'Tiles';
  
    // Validate the input
    if (this.isDuplicateID || this.isDuplicateName || this.createSummaryField.invalid) {
      return; // Prevent saving if there are errors
    }
  
    const tempClient = `${this.SK_clientID}#summary#lookup`;
    //console.log('tempClient checking', tempClient);
  
    const createdDate = Math.ceil(new Date().getTime() / 1000); // Created date
    const updatedDate = Math.ceil(Date.now() / 1000); // Updated date
    // LiveDashboard:this.createSummaryField.value.LiveDashboard,
  
    // Prepare summary details using duplicateData
    this.allCompanyDetails = {
      summaryID: duplicateData.summaryID,
      summaryName: duplicateData.summaryName,
      summaryDesc: duplicateData.summaryDesc,
      summaryIcon: duplicateData.summaryIcon,
      iconObject: duplicateData.iconObject,
      LiveDashboard:duplicateData.LiveDashboard,
      fullScreenModeCheck:duplicateData.fullScreenModeCheck,
      // DashboardRestriction:duplicateData.DashboardRestriction,
      crDate: createdDate,
      upDate: updatedDate,
      createdUser: this.getLoggedUser.username, // Set the creator's username
};
  
    //console.log('Summary data:', this.allCompanyDetails);
  
    const createdDateISO = new Date(createdDate * 1000).toISOString();
    const updatedDateISO = new Date(updatedDate * 1000).toISOString();
  
    // Prepare tempObj for API call
    const tempObj = {
      PK: `${this.SK_clientID}#${this.allCompanyDetails.summaryID}#summary#main`,
      SK: 1,
      metadata: JSON.stringify({
        summaryID: this.allCompanyDetails.summaryID,
        summaryName: this.allCompanyDetails.summaryName,
        summaryDesc: this.allCompanyDetails.summaryDesc,
        summaryIcon: this.allCompanyDetails.summaryIcon,
        LiveDashboard:this.allCompanyDetails.LiveDashboard,
        fullScreenModeCheck:this.allCompanyDetails.fullScreenModeCheck,
        // DashboardRestriction:this.allCompanyDetails.DashboardRestriction,
        grid_details:duplicateData.grid_details,
        created: createdDateISO,
        updated: updatedDateISO,
        createdUser: this.allCompanyDetails.createdUser,
        iconObject: this.allCompanyDetails.iconObject,
        tilesList: this.defaultValue,
      }),
    };
  
    //console.log('TempObj is here:', tempObj);
  
    const items = {
      P1: this.allCompanyDetails.summaryID,
      P2: this.allCompanyDetails.summaryName,
      P3: this.allCompanyDetails.summaryDesc,
      P4: updatedDate,
      P5: createdDate,
      P6: this.allCompanyDetails.createdUser,
      P7: this.getLoggedUser.username,
      P8: JSON.stringify(this.allCompanyDetails.iconObject),
      P9: this.allCompanyDetails.summaryIcon,
      P10:'',
      P11:this.allCompanyDetails.fullScreenModeCheck,
      // P12:this.allCompanyDetails.DashboardRestriction
    };
  
    // API call to create the summary
    this.api
      .CreateMaster(tempObj)
      .then(async (value: any) => {
        await this.createLookUpSummary(items, 1, tempClient);
  
        //console.log('Value from create master:', value);
  
        if (items || value) {
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'New summary successfully created',
            showConfirmButton: true,
            confirmButtonText: 'OK',
            allowOutsideClick: false,
          }).then((result) => {
            if (result.isConfirmed) {
              if (items.P1) {
                this.dashboardOpen(items.P1);
              }
              if (this.modalRef) {
                this.modalRef.close();
              }
            }
          });
        } else {
          Swal.fire({
            position: 'top-end',
            icon: 'error',
            title: 'Failed to create summary',
            showConfirmButton: false,
            timer: 1500,
          });
        }
      })
      .catch((err) => {
        //console.log('Error in creation:', err);
        this.toast.open('Error in adding new Summary Configuration', 'Check again', {
          duration: 5000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
      });
  }
  






  addTile(key: any) {










    if (key === 'tile7') {
      const uniqueId = this.generateUniqueId();
      const newTile6 = {
        id: uniqueId,
        x: 0,
        y: 0,
        cols: 20,
        rows: 10,
        grid_type: "tile7",
        formlist: this.createKPIWidget6.value.formlist,
        parameterName: this.createKPIWidget6.value.parameterName,
        value: this.createKPIWidget6.value.value,

        groupByFormat: this.createKPIWidget6.value.groupByFormat,

        // Default value for constant fields
        constantValuevalue: this.createKPIWidget6.value.constantValuevalue !== undefined && this.createKPIWidget6.value.constantValuevalue !== null
          ? this.createKPIWidget6.value.constantValuevalue
          : 10, // Default value for constant1 (change as needed)

        constantValueTarget: this.createKPIWidget6.value.constantValueTarget !== undefined && this.createKPIWidget6.value.constantValueTarget !== null
          ? this.createKPIWidget6.value.constantValueTarget
          : 20, // Default value for constant2 (change as needed)

        constantValueMaxRange1: this.createKPIWidget6.value.constantValueMaxRange !== undefined && this.createKPIWidget6.value.constantValueMaxRange !== null
          ? this.createKPIWidget6.value.constantValueMaxRange
          : 30, // Default value for constant3 (change as needed)

        // Default values for percentage fields
        percentageValue: this.createKPIWidget6.value.percentageValue !== undefined && this.createKPIWidget6.value.percentageValue !== null
          ? this.createKPIWidget6.value.percentageValue
          : 50, // Default value for percentage1 (change as needed)

        percentageValueTarget: this.createKPIWidget6.value.percentageValueTarget !== undefined && this.createKPIWidget6.value.percentageValueTarget !== null
          ? this.createKPIWidget6.value.percentageValueTarget
          : 75, // Default value for percentage2 (change as needed)

        percentageValueMaxRange: this.createKPIWidget6.value.percentageValueMaxRange !== undefined && this.createKPIWidget6.value.percentageValueMaxRange !== null
          ? this.createKPIWidget6.value.percentageValueMaxRange
          : 90, // Default value for percentage3 (change as needed)

        Target: this.createKPIWidget6.value.Target, // Handle default value for this if needed
        MaxRange: this.createKPIWidget6.value.MaxRange
      };


      // Initialize this.dashboard if it hasn't been set yet
      if (!this.dashboard) {
        this.dashboard = [];
      }

      // Push the new tile to dashboard
      this.dashboard.push(newTile6);

      //console.log('this.dashboard after adding new tile', this.dashboard);

      this.updateSummary('', 'add_tile');
      this.createKPIWidget6.patchValue({
        widgetid: uniqueId // Set the ID in the form control
      });

    }




  }


















  onModeChange(event: Event): void {
    //console.log('Event:', event);

    // If you want to see specific properties:
    //console.log('Event Type:', event.type); // Should log "click"
    //console.log('Target Element:', event.target); // Logs the clicked element
    //console.log('Current Target:', event.currentTarget); // Logs the element the event listener is attached to

    // Cast the target to HTMLElement if you need to access its properties
    const targetElement = event.target as HTMLElement;
    //console.log('Target Element Classes:', targetElement.className);
  }



  initializeTileFields6() {
    this.createKPIWidget6 = this.fb.group({
      'formlist': ['', Validators.required],
      'parameterName': ['', Validators.required],
      'value': ['', Validators.required],
      'Target': ['', Validators.required],
      'MaxRange': ['', Validators.required],
      'groupByFormat': ['', Validators.required],
      'constantValuevalue': ['', Validators.required],
      'percentageValue': ['', Validators.required],
      'constantValueTarget': ['', Validators.required],
      'constantValueMaxRange': ['', Validators.required],
      'percentageValueTarget': ['', Validators.required],
      'percentageValueMaxRange': ['', Validators.required]


    })
  }





  addJsonValidation() {
    this.createSummaryField.addControl('jsonInputControl',
      new FormControl('', [Validators.required, this.jsonValidator])  // Add the JSON field with validation
    );
  }






  onSelectChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement; // Cast the event target to HTMLSelectElement
    this.selectedIcon = selectElement.value; // Update selectedIcon with the selected value
  }










  async createLookUpSummary(item: any, pageNumber: number, tempclient: any) {
    //console.log('temp client checking from lookupsummary', tempclient)
    //console.log('item checking from lookup', item)


    try {
      //console.log("iam a calleddd dude", item, pageNumber);
      const response = await this.api.GetMaster(tempclient, pageNumber);
      //console.log('response check', response)

      let checklength: any[] = [];
      if (response != null && response.options && typeof response.options === 'string') {
        checklength = JSON.parse(response.options);
      }

      if (response != null && checklength.length < this.maxlength) {
        let newdata: any[] = [];
        if (response.options && typeof response.options === 'string') {
          const parsedData = JSON.parse(response.options);

          parsedData.forEach((item: any) => {
            for (const key in item) {
              if (Object.prototype.hasOwnProperty.call(item, key)) {
                newdata.push(item[key]);
              }
            }
          });
        }

        newdata.unshift(item);
        newdata = newdata.map((data, index) => {
          return { [`L${index + 1}`]: data };
        });

        //console.log('newdata 11111111 :>> ', newdata);

        let Look_data: any = {
          PK: tempclient,
          SK: response.SK,
          options: JSON.stringify(newdata),
        };

        const createResponse = await this.api.UpdateMaster(Look_data);
        //console.log('createResponse :>> ', createResponse);
      } else if (response == null) {
        let newdata: any[] = [];
        newdata.push(item);
        newdata = newdata.map((data, index) => {
          return { [`L${index + 1}`]: data };
        });

        let Look_data = {
          SK: pageNumber,
          PK: tempclient,
          options: JSON.stringify(newdata),
        };

        //console.log(Look_data);

        const createResponse = await this.api.CreateMaster(Look_data);
        //console.log(createResponse);
      } else {
        await this.createLookUpSummary(item, pageNumber + 1, tempclient);
      }
    } catch (err) {
      //console.log('err :>> ', err);
      // Handle errors appropriately, e.g., show an error message to the user
    }
  }

  getHeightBasedOnContent(item: any): string {
    if (item.multi_value && item.multi_value.length) {
      return `${100 + item.multi_value.length * 30}px`;  // Adjust height based on the number of values
    }
    return '200px';  // Default height
  }

  filterDuplicates(data: any[]) {
    // Remove duplicates based on the P1 field
    const uniqueData = Array.from(new Set(data.map((item: any) => item.P1))) // Create unique P1 values
      .map((P1Value) => data.find((item: any) => item.P1 === P1Value)); // Retrieve the first occurrence of each P1 value
  
    // Slice the result to only keep the first 20 items
    return uniqueData.slice(0, 20);
  }
  
  
  loadData() {
    this.lookup_data_summary1 = [];
    this.lookup_data_summaryCopy = [];
  
    // Fetch company lookup data
    this.fetchCompanyLookupdataOnit(1)
      .then((data: any) => {
        this.lookup_data_summaryCopy = data; // Assign fetched data to the component property
        //console.log('this.lookup_data_summaryCopy check', this.lookup_data_summaryCopy);
  
        // Multi-level sorting: First by P10 (latest first), then by P4
        this.lookup_data_summaryCopy.sort((a, b) => {
          const p10A = a.P10 ? Number(a.P10) : 0;
          const p10B = b.P10 ? Number(b.P10) : 0;
  
          // Primary sorting: Sort by P10 in descending order
          if (p10B - p10A !== 0) {
            return p10B - p10A;
          }
  
          // Secondary sorting: Sort by P4 in descending order
          return b.P4 - a.P4;
        });
  
        //console.log('Sorted Data (P10 first, then P4):', this.lookup_data_summaryCopy);
  
        // Check the permission ID before applying the filter
        if (this.userPermission === "All") {
          //console.log("Permission is 'All'. Displaying all dashboards...");
          // No filtering needed, show all data
        } else {
          //console.log('Restricted permissions. Filtering dashboards...', this.summaryPermission);
          
          if (this.summaryPermission.includes('None')) {
            this.lookup_data_summaryCopy = []; 
            this.isNone = true;
            //console.log("Permission includes 'None'. No dashboards will be displayed.");
          } else if (this.summaryPermission.includes('All')) {
            //console.log("Permission is 'All'. Displaying all dashboards...");
            // No filtering needed, show all data
          } else {
            //console.log("Restricted permissions. Filtering dashboards...");
            this.lookup_data_summaryCopy = this.lookup_data_summaryCopy
              .filter((item: any) => this.summaryPermission.includes(item.P1))
              .reduce((uniqueItems: any[], currentItem: any) => {
                // Check if the current item's P1 is already in the uniqueItems array
                if (!uniqueItems.some(item => item.P1 === currentItem.P1)) {
                  uniqueItems.push(currentItem);
                }
                return uniqueItems;
              }, []); // Initialize with an empty array
          }
        }
  
        // Process each item in the data for parsed icons
        this.lookup_data_summaryCopy.forEach(item => {
          if (item.P8) {
            try {
              // Parse the P8 property
              const parsedIcon = JSON.parse(item.P8);
              //console.log('Parsed Icon Object:', parsedIcon);
  
              // Store the parsed icon back into the object
              item.parsedIcon = parsedIcon;
  
              // Access the properties if needed
              //console.log('Icon Value:', parsedIcon.value);
              //console.log('Icon Label:', parsedIcon.label);
            } catch (error) {
              console.error('Error parsing P8:', error);
            }
          } else {
            console.warn('P8 not found for item:', item);
          }
        });
  
        //console.log('Final parsed and filtered data:', this.lookup_data_summaryCopy);
  
        this.cdr.detectChanges(); // Ensure UI updates
      })
      .catch((error: any) => {
        console.error('Failed to load company lookup data:', error);
        this.cdr.detectChanges(); // Ensure UI updates
      });
  }
  
  
  


  // checkUniqueIdentifier(enteredID: string): void {
  //   //console.log('Entered Value check',enteredID)
  //   if (!enteredID) {
  //     this.errorForUniqueID = null; // Reset error if input is empty
  //     this.isDuplicateID = false;
  //     return;
  //   }

  //   const isDuplicateID = this.lookup_data_summaryCopy.some(item => item.P1 === enteredID);
  //   //console.log('Validation for ID:', enteredID, this.lookup_data_summaryCopy);

  //   if (isDuplicateID) {
  //     this.errorForUniqueID = `ID "${enteredID}" is already Exist. Please enter a unique ID.`;
  //     this.isDuplicateID = true; // Update the flag for the save button
  //   } else{


  //     this.errorForUniqueID = null;
  //     this.isDuplicateID = false; 
  //   }
  // // Reset the flag

  //   // else if(){

  //   // }
  // }
  // onIDChange(event: Event): void {
  //   let currentID = (event.target as HTMLInputElement).value;
  //   //console.log('currentID checking', currentID);
  
  //   // Trim the value first to remove any leading or trailing spaces
  //   const trimmedID = currentID.trim();
  
  //   // Check if there are any spaces within the trimmed ID
  //   const hasSpaces = trimmedID.includes(' ');
  
  //   if (hasSpaces) {
  //     alert('i am triggerd spaces is there')
  //     this.errorForUniqueID = 'Spaces are not allowed in the ID.';
  //     this.isValidID = false;  // Mark ID as invalid due to spaces
  //   } else {
  //     // Regular expression to allow only alphanumeric characters and underscores
  //     const validIDPattern = /^[a-zA-Z0-9_]+$/;
  
  //     if (!validIDPattern.test(trimmedID)) {
  //       this.errorForUniqueID = 'Special characters (including spaces or slash) are not allowed. Use only letters, numbers, and underscores.';
  //       this.isValidID = false;  // Mark ID as invalid
  //     } else {
  //       this.errorForUniqueID = null;  // Clear the error if input is valid
  //       this.isValidID = true;  // Mark ID as valid
  //     }
  //   }
  
  //   // Validate only if the input value has changed
  //   if (currentID !== this.previousValue) {
  //     this.previousValue = currentID; // Update previous value
  //     this.checkUniqueIdentifier(currentID); // Check for uniqueness if necessary
  //   }
  // }
  
  


  onIDChange(event: Event): void {
    let currentID = (event.target as HTMLInputElement).value;
    //console.log('currentID checking', currentID);
  
    // Trim the value first to remove any leading or trailing spaces
    const trimmedID = currentID.trim();
  
    // Check if there are any spaces within the trimmed ID
    const hasSpaces = trimmedID.includes(' ');
  
    if (hasSpaces) {
      this.errorForUniqueID = 'Spaces are not allowed in the ID.';
      this.isValidID = false;  // Mark ID as invalid due to spaces
    } else {
      // Regular expression to allow only alphanumeric characters and underscores
      const validIDPattern = /^[a-zA-Z0-9_]+$/;
  
      if (!validIDPattern.test(trimmedID)) {
        this.errorForUniqueID = 'Special characters (including spaces or slash) are not allowed. Use only letters, numbers, and underscores.';
        this.isValidID = false;  // Mark ID as invalid
      } else {
        // Clear errors if the ID is valid
        this.errorForUniqueID = null;
        this.isValidID = true;
      }
    }
  
    // Proceed to check for uniqueness only if no previous error occurred
    if (!this.errorForUniqueID) {
      this.checkUniqueIdentifier(currentID);
    }
  
    // Validate only if the input value has changed
    if (currentID !== this.previousValue) {
      this.previousValue = currentID; // Update previous value
    }
  }
  
  checkUniqueIdentifier(enteredID: string): void {
    //console.log('Entered Value check', enteredID);
  
    if (!enteredID) {
      this.errorForUniqueID = null; // Reset error if input is empty
      this.isDuplicateID = false;
      return;
    }
  
    const isDuplicateID = this.lookup_data_summaryCopy.some(item => item.P1 === enteredID);
    //console.log('Validation for ID:', enteredID, this.lookup_data_summaryCopy);
  
    if (isDuplicateID) {
      this.errorForUniqueID = `ID "${enteredID}" already exists. Please enter a unique ID.`;
      this.isDuplicateID = true; // Update the flag for the save button
    } else {
      this.errorForUniqueID = null;  // Clear error if the ID is unique
      this.isDuplicateID = false;
    }
  }
  
  
  
  

  


  checkUniqueName(): void {
    const enteredName = this.createSummaryField.get('summaryName')?.value?.trim();

    if (!enteredName) {
      this.errorForUniqueName = null; // Reset error if input is empty
      return;
    }

    const isDuplicateName = this.lookup_data_summaryCopy.some(item => item.P2 === enteredName);

    if (isDuplicateName) {
      this.errorForUniqueName = `Name "${enteredName}" is already Exist. Please enter a unique name.`;
      this.isDuplicateName = true;
      this.cdr.detectChanges();  // Update the flag for the save button
    } else {
      this.errorForUniqueName = null;
      this.isDuplicateName = false; // Reset the flag
    }
  }

  // resetModal(): void {
  //   this.createSummaryField.reset(); // Reset form fields
  //   this.errorForUniqueName = null; // Clear error state
  //   this.isDuplicateName = false;  // Reset duplicate flag
  // }
  fetchCompanyLookupdataOnit(sk: any): Promise<any> {
    //console.log("Fetching company lookup data with SK:", sk);
    //console.log('this.SK_clientID check lookup', this.SK_clientID);
  
    return new Promise((resolve, reject) => {
      this.api.GetMaster(`${this.SK_clientID}#summary#lookup`, sk)
        .then(response => {
          if (response && response.options) {
            if (typeof response.options === 'string') {
              let data;
  
              try {
                data = JSON.parse(response.options);
              } catch (err) {
                console.error('Error parsing response options:', err);
                return reject(new Error('Failed to parse response.options'));
              }
  
              //console.log("Parsed data:", data);
  
              if (Array.isArray(data)) {
                // Process and add data to lookup_data_summary1
                data.forEach(element => {
                  if (element) {
                    const key = Object.keys(element)[0];
                    const { P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11 } = element[key];
                    this.lookup_data_summary1.push({ P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11 });
                    //console.log("Updated lookup_data_summary1:", this.lookup_data_summary1);
                  }
                });
  
                // Recursively fetch more data if available (using sk + 1 for the next call)
                if (data.length > 0) {
                  this.fetchCompanyLookupdataOnit(sk + 1)
                    .then(resolve)
                    .catch(reject);  // Continue recursion and propagate errors if any
                } else {
                  // If no more data to fetch, resolve with the collected data
                  resolve(this.lookup_data_summary1);
                }
  
              } else {
                console.error('Invalid data format - not an array.');
                reject(new Error('Invalid data format - not an array.'));
              }
            } else {
              console.error('response.options is not a string.');
              reject(new Error('response.options is not a string.'));
            }
          } else {
            //console.log("No response data, returning collected data:", this.lookup_data_summary1);
            resolve(this.lookup_data_summary1); // Resolve with existing data if no valid response
          }
        })
        .catch(error => {
          console.error('Error fetching data:', error);
          reject(error);
        });
    });
  }
  goToPage(page: number) {
    if (page < 1 || page > this.totalPages) return; // Prevent invalid page changes
    this.page = page;
    //console.log('Current Page:', this.page);
    this.showTable(); // Reload data when page changes
}


  async showTable() {
    //console.log("Show DataTable is called BTW");
  
    this.datatableConfig = {};
  this.lookup_data_summary = [];
  this.datatableConfig = {
    serverSide: true,
    ajax: (dataTablesParameters: any, callback) => {
      this.datatableConfig = {};
      const start = dataTablesParameters.start;
      const length = dataTablesParameters.length;

      this.fetchCompanyLookupdata(1)
        .then((resp: any) => {
          //console.log("resp check", resp);
          let responseData = resp || []; // Default to an empty array if resp is null
          //console.log("responseData", responseData);

          // Apply Permission-Based Filtering
          if (this.userPermission === "All") {
            //console.log('permissionIdCheck', this.permissionIdCheck)
            //console.log("Permission is 'All'. Displaying all data.");
            // No filtering needed, show all data
          } else {
            //console.log("Restricted permissions. Filtering data...");
            if (this.summaryPermission.includes('None')) {
              //console.log("Permission includes 'None'. No data will be displayed.");
              responseData = []; // Set responseData to an empty array
            } else if (this.summaryPermission.includes('All')) {
              //console.log("Permission is 'All'. Displaying all data.");
              // No filtering needed
            } else {
              //console.log("Restricted permissions. Filtering data...");
              responseData = responseData.filter((item: any) =>
                this.summaryPermission.includes(item.P1)
              );
            }
          }

          // Example filtering for search
          const searchValue = dataTablesParameters.search.value.toLowerCase();
          const filteredData = Array.from(
            new Set(
              responseData
                .filter((item: { P1: string }) => item.P1.toLowerCase().includes(searchValue))
                .map((item: any) => JSON.stringify(item)) // Stringify the object to make it unique
            )
          ).map((item: any) => JSON.parse(item)); // Parse back to object

          //console.log('filteredData checkinbg', filteredData)

          //console.log("Filtered Data after permissions and search:", filteredData);

          // Implement pagination by slicing the filtered data

          const paginatedData = filteredData.slice(start, start + length);
          this.paginationDataStore = paginatedData
          //console.log('this.paginationDataStore checking',this.paginationDataStore)

          this.totalRecords = filteredData.length;
          this.displayedRecords = paginatedData.length;
          this.totalPages = Math.ceil(this.totalRecords / length);

          // Update page numbers dynamically based on total pages
          this.pageNumbers = Array.from({ length: this.totalPages }, (_, i) => i + 1);

          // Update start and end records for current page
          this.startRecord = start + 1; // Start record (1-indexed)
          this.endRecord = start + this.displayedRecords;


          callback({
            draw: dataTablesParameters.draw,
            recordsTotal: this.totalRecords,
            recordsFiltered: this.totalRecords,
            data: paginatedData, // Data for the current page
          });

          //console.log("Paginated Data for current page", paginatedData);
        })
        .catch((error: any) => {
          console.error("Error fetching user lookup data:", error);
          // Provide an empty dataset in case of an error
          callback({
            draw: dataTablesParameters.draw,
            recordsTotal: 0,
            recordsFiltered: 0,
            data: [],
          });
        });
    },
      columns: [
        {
          title: '<span style="color: black;">ID</span>',
          data: 'P1',
          render: (data, type, full) => {
            const colorClasses = ['success', 'info', 'warning', 'danger'];
            const randomColorClass = colorClasses[Math.floor(Math.random() * colorClasses.length)];
            const initials = data[0].toUpperCase();
        
            const symbolLabel = `
              <div class="symbol-label fs-3 bg-light-${randomColorClass} text-${randomColorClass}">
                ${initials}
              </div>
            `;
        
            return `
              <div class="d-flex align-items-center">
                <div class="symbol symbol-circle symbol-50px overflow-hidden me-3">
                  <a href="javascript:;" class="view-item" data-id="${full.P1}">
                    ${symbolLabel}
                  </a>
                </div>
                <div class="d-flex flex-column">
                  <a href="javascript:;" class="text-gray-800 text-hover-primary mb-1 view-item" style="width:150px;word-break:break-word;overflow-wrap:break-word" data-id="${full.P1}">
                    ${data}
                  </a>
                </div>
              </div>
            `;
          }
        },
        
        {
          title: '<span style="color: black;">Name</span>',
          data: 'P2',
          width: '300px', // force fixed width
          className: 'wrap-text',
          render: function (data) {
            return `<div class="wrap-text" style="width:150px;word-break:break-word;overflow-wrap:break-word">${data}</div>`; // Wrap text here
          }
        },
        {
          title: '<span style="color: black;">Description</span>',
          data: 'P3',
          render: function (data) {
            return `<div class="wrap-text1" style="width:150px;word-break:break-word;overflow-wrap:break-word">${data}</div>`; // Wrap text here
          }
        },
        {
          title: '<span style="color: black;">Updated</span>',
          data: 'P4',
          render: function (data) {
            const date = new Date(data * 1000);
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            const formattedDateTime = `${day}/${month}/${year} ${hours}:${minutes}`;
            
            return `<div class="wrap-text" style="width:150px;word-break:break-word;overflow-wrap:break-word">${formattedDateTime}</div>`;
          },
        },
        
        {
          title: '<span style="color: black;">Created</span>',
          data: 'P5',
          render: function (data) {
            const date = new Date(data * 1000);
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            const formattedDateTime = `${day}/${month}/${year} ${hours}:${minutes}`;
        
            return `<div class="wrap-text" style="width:150px;word-break:break-word;overflow-wrap:break-word">${formattedDateTime}</div>`;
          },
        }
,        
        {
          title: '<span style="color: black;">Created UserName</span>',
          data: 'P6',
          render: function (data) {
            return `<div class="wrap-text" style="width:150px;word-break:break-word;overflow-wrap:break-word">${data}</div>`; // Wrap text here
          },
        },
        {
          title: '<span style="color: black;">Updated UserName</span>',
          data: 'P7',
          render: function (data) {
            return `<div class="wrap-text" style="width:150px;word-break:break-word;overflow-wrap:break-word">${data}</div>`; // Wrap text here
          },
        },
        // Other columns...
      ],
      
      
    createdRow: (row: Node, data: any) => {
      $(row).find('.view-item').on('click', () => {
        this.SummaryIdRedirect(data.P1); // Call the function with P1 value
      });
    },
    pageLength: 10, // Set default page size to 10
  };
  }
  
  
  SummaryIdRedirect(id: string): void {
    //console.log('this.all_Packet_store check viewItem',this.lookup_data_summaryCopy)
   
    this.setFullscreen()
    this.router.navigate([`/summary-engine/${id}`]);
    this.cdr.detectChanges();

    // Set the state to Edit Mode
    this.modalService.dismissAll();


 
  }
  
  



  jsondata(jsondata: any): string {
    throw new Error('Method not implemented.');
  }

  // updateSummary(value: any, key: any) {
  //   this.createSummaryField.get('summaryID')?.enable();
  //   this.allCompanyDetails = this.constructAllCompanyDetails();
  //   //console.log('Updated allCompanyDetails:', this.allCompanyDetails);
  
  //   this.formattedDashboard = this.formatDashboardTiles(this.dashboard);
  //   //console.log('Formatted Dashboard:', this.formattedDashboard);
  
  //   let tempObj = {
  //     PK: `${this.SK_clientID}#${this.allCompanyDetails.summaryID}#summary#main`,
  //     SK: 1,
  //     metadata: JSON.stringify({
  //       ...this.allCompanyDetails,
  //       grid_details: this.formattedDashboard
  //     })
  //   };
  

  // }
//   updateSummary(value: any,key: any,pinValue?:any) {
//     if(key=='addPin'){
//       this.PinCheck =pinValue
//       //console.log('PinCheck from updateSummary',this.PinCheck)
//     }
// //console.log('value checking summary',value)

  
//     //console.log('this.getLoggedUser check update', this.getLoggedUser);
  
//     // Extract username for later use
//     this.extractUserName = this.getLoggedUser.username;
//     //console.log('this.extractUserName checking', this.extractUserName);
  
//     //console.log('all_Packet_store checking', this.all_Packet_store);
  
//     // Construct allCompanyDetails if missing
//     if (!this.allCompanyDetails) {
//       this.allCompanyDetails = this.constructAllCompanyDetails();
//       //console.log('Constructed allCompanyDetails:', this.allCompanyDetails);
//     }
  
//     // Only populate missing fields to avoid overwriting existing values
//     if (this.all_Packet_store) {
//       this.allCompanyDetails = {
//         ...this.allCompanyDetails, // Preserve existing data
//         summaryID: this.allCompanyDetails.summaryID || this.all_Packet_store.summaryID || value.P1,
//         summaryName: this.allCompanyDetails.summaryName || this.all_Packet_store.summaryName,
//         summaryDesc: this.allCompanyDetails.summaryDesc || this.all_Packet_store.summaryDesc,
//         iconObject: this.allCompanyDetails.iconObject || this.all_Packet_store.iconObject,
//         LiveDashboard:this.allCompanyDetails.LiveDashboard ||'',
//         fullScreenModeCheck:this.allCompanyDetails.fullScreenModeCheck ||''
//       };
//       //console.log('Updated allCompanyDetails with Packet Store:', this.allCompanyDetails);
//     }

  
//     // Ensure critical fields have default fallbacks without altering existing logic
//     this.allCompanyDetails.summaryID = this.allCompanyDetails.summaryID ||value.P1
//     this.allCompanyDetails.summaryName = this.allCompanyDetails.summaryName 
//     this.allCompanyDetails.summaryDesc = this.allCompanyDetails.summaryDesc 

  
//     //console.log('Final allCompanyDetails:', this.allCompanyDetails);
  
//     // Enable summaryID field
//     this.createSummaryField.get('summaryID')?.enable();
  
//     // Format dashboard tiles
//     this.formattedDashboard = this.formatDashboardTiles(this.dashboard) || [];
//     //console.log('Formatted Dashboard:', this.formattedDashboard);
  
//     // Set timestamps and users
//     const originalCreatedDate =
//       this.allCompanyDetails.crDate || Math.ceil(new Date().getTime() / 1000);
//     const originalCreatedUser =
//       this.allCompanyDetails.createdUser || this.getLoggedUser.username;
  
//     const updatedDate = Math.ceil(new Date().getTime() / 1000);
  
//     // Construct tempObj for validation and submission
//     let serializedQueryParams = JSON.stringify(this.updatedQueryPramas);
// //console.log('Serialized Query Params:', serializedQueryParams);
//     let tempObj = {
//       PK: `${this.SK_clientID}#${this.allCompanyDetails.summaryID}#summary#main`,
//       SK: 1,
//       metadata: JSON.stringify({
//         ...this.allCompanyDetails,
//         grid_details: this.formattedDashboard,
//       // Include params here
//       }),
//     };
  
//     //console.log('TempObj being validated and submitted:', tempObj);
  
//     // Validate and submit the object

  
//     // Prepare items for fetchTimeMachineById
//     const items = {
//       P1: this.allCompanyDetails.summaryID || value.P1,
//       P2: this.allCompanyDetails.summaryName || value.P2,
//       P3: this.allCompanyDetails.summaryDesc || value.P3,
//       P4: updatedDate || value.P4,
//       P5: originalCreatedDate || value.P5,
//       P6: originalCreatedUser || value.P6,
//       P7: this.extractUserName || value.P7,
//       P8: this.previewObjDisplay ? JSON.stringify(this.previewObjDisplay) : value.P8,
//       P9: this.allCompanyDetails.iconSelect || value.P9,
//       P10: this.allCompanyDetails.PinCheck || this.PinCheck,
//       P11:this.allCompanyDetails.fullScreenModeCheck ||value.P11
//     };
    
  
//     //console.log('Items prepared for fetchTimeMachineById:', items);
//     const UserDetails = {
//       "User Name": this.userdetails,
//       "Action": "Updated",
//       "Module Name": "Summary Dashboard",
//       "Form Name": "Summary Dashboard",
//       "Description": "Dashboard is Updated",
//       "User Id": this.userdetails,
//       "Client Id": this.SK_clientID,
//       "created_time": Date.now(),
//       "updated_time": Date.now()
//     }

//     this.auditTrail.mappingAuditTrailData(UserDetails,this.SK_clientID)
  
//     // Trigger fetchTimeMachineById
//     if (items.P1) {
//       //console.log('check items inupdate',items)
//       this.fetchTimeMachineById(1, items.P1, 'update', items);
//     } else {
//       console.warn('fetchTimeMachineById skipped: Missing summaryID (P1).');
//     }
  
//     // Trigger change detection
//     this.cd.detectChanges();
//   }
  


updateSummary(value: any,key: any,pinValue?:any) {
  if(key=='addPin'){
    this.PinCheck =pinValue
    //console.log('PinCheck from updateSummary',this.PinCheck)
  }
//console.log('value checking summary',value)


  //console.log('this.getLoggedUser check update', this.getLoggedUser);

  // Extract username for later use
  this.extractUserName = this.getLoggedUser.username;
  //console.log('this.extractUserName checking', this.extractUserName);

  //console.log('all_Packet_store checking', this.all_Packet_store);

  // Construct allCompanyDetails if missing
  if (!this.allCompanyDetails) {
    this.allCompanyDetails = this.constructAllCompanyDetails();
    //console.log('Constructed allCompanyDetails:', this.allCompanyDetails);
  }

  // Only populate missing fields to avoid overwriting existing values
  if (this.all_Packet_store) {
    this.allCompanyDetails = {
      ...this.allCompanyDetails, // Preserve existing data
      summaryID: this.allCompanyDetails.summaryID || this.all_Packet_store.summaryID || value.P1,
      summaryName: this.allCompanyDetails.summaryName || this.all_Packet_store.summaryName || value.P2,
      summaryDesc: this.allCompanyDetails.summaryDesc || this.all_Packet_store.summaryDesc || value.P3,
      iconObject: this.allCompanyDetails.iconObject || this.all_Packet_store.iconObject || value.parsedIcon ||'',
      LiveDashboard:this.allCompanyDetails.LiveDashboard ||'',
      fullScreenModeCheck:this.allCompanyDetails.fullScreenModeCheck ||'',
      // DashboardRestriction:this.allCompanyDetails.DashboardRestriction ||''
    };
    //console.log('Updated allCompanyDetails with Packet Store:', this.allCompanyDetails);
  }

  // Ensure critical fields have default fallbacks without altering existing logic
  this.allCompanyDetails.summaryID = this.allCompanyDetails.summaryID || value.P1 ;
  this.allCompanyDetails.summaryName = this.allCompanyDetails.summaryName || value.P2 ;
  this.allCompanyDetails.summaryDesc = this.allCompanyDetails.summaryDesc || value.P3 ;


  //console.log('Final allCompanyDetails:', this.allCompanyDetails);

  // Enable summaryID field
  this.createSummaryField.get('summaryID')?.enable();

  // Format dashboard tiles
  this.formattedDashboard = this.formatDashboardTiles(this.dashboard) || [];
  //console.log('Formatted Dashboard:', this.formattedDashboard);
if (key !=='addPin'){

  if (this.formattedDashboard.length === 0) {
    Swal.fire({
      position: 'top-end',
      icon: 'error',
      title: 'At least 2 widgets are required for Summary Dashboard update.',
      showConfirmButton: false,
      timer: 1500
    });
    return; // Exit the function without performing validation
  }
}



  // Set timestamps and users
  //console.log('this.lookup_data_summaryCopy check from updateSummary',this.lookup_data_summaryCopy)
  //console.log('this.routeId check from updateSummary',this.routeId)
  const matchedPacket = this.lookup_data_summaryCopy.find((packet: any) => packet.P1);

//console.log('Matched Packet: lookup', matchedPacket);

  const originalCreatedDate =matchedPacket.P5 ||this.allCompanyDetails.crDate ||value.P5|| Math.ceil(Date.now()/1000)

    
    //console.log('originalCreatedDate checking before update',originalCreatedDate)
  const originalCreatedUser =
    this.allCompanyDetails.createdUser || this.getLoggedUser.username;

    const updatedDate = Math.ceil(Date.now() / 1000);
    //console.log("Stored:", updatedDate);  // ✅ Just store current epoch
    //console.log("Display: check before update", this.formatEpochToIST(updatedDate));

  // Construct tempObj for validation and submission
  let serializedQueryParams = JSON.stringify(this.updatedQueryPramas);
//console.log('Serialized Query Params:', serializedQueryParams);
  let tempObj = {
    PK: `${this.SK_clientID}#${this.allCompanyDetails.summaryID}#summary#main`,
    SK: 1,
    metadata: JSON.stringify({
      ...this.allCompanyDetails,
      grid_details: this.formattedDashboard,
    // Include params here
    }),
  };

  //console.log('TempObj being validated and submitted:', tempObj);
const storeFullScreenValue = this.allCompanyDetails.fullScreenModeCheck
  // Validate and submit the object
  this.validateAndSubmit(tempObj, key,storeFullScreenValue);

//console.log('value.P11 checking',this.allCompanyDetails.fullScreenModeCheck)
  // Prepare items for fetchTimeMachineById
  const items = {
    P1: this.allCompanyDetails.summaryID || value.P1,
    P2: this.allCompanyDetails.summaryName || value.P2,
    P3: this.allCompanyDetails.summaryDesc || value.P3,
    P4: updatedDate || value.P4,
    P5: originalCreatedDate || value.P5,
    P6: originalCreatedUser || value.P6,
    P7: this.extractUserName || value.P7,
    P8: this.previewObjDisplay ? JSON.stringify(this.previewObjDisplay) : value.P8,
    P9: this.allCompanyDetails.iconSelect || value.P9,
    P10: this.allCompanyDetails.PinCheck || this.PinCheck,
    P11:this.allCompanyDetails.fullScreenModeCheck ||value.P11,
    // P12:this.allCompanyDetails.DashboardRestriction ||value.P12
  };
  

  //console.log('Items prepared for fetchTimeMachineById:', items);
  const UserDetails = {
    "User Name": this.userdetails,
    "Action": "Updated",
    "Module Name": "Summary Dashboard",
    "Form Name": "Summary Dashboard",
    "Description": "Dashboard is Updated",
    "User Id": this.userdetails,
    "Client Id": this.SK_clientID,
    "created_time": Date.now(),
    "updated_time": Date.now()
  }

  this.auditTrail.mappingAuditTrailData(UserDetails,this.SK_clientID)

  // Trigger fetchTimeMachineById
  if (items.P1) {
    //console.log('check items inupdate',items)
    this.fetchTimeMachineById(1, items.P1, 'update', items);
  } else {
    console.warn('fetchTimeMachineById skipped: Missing summaryID (P1).');
  }

  // Trigger change detection
  this.cd.detectChanges();
}

  
 formatEpochToIST(data: number): string {
  const date = new Date(data * 1000); // No offset needed if system is in IST

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
  const year = date.getFullYear();

  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${day}/${month}/${year} ${hours}:${minutes}`;
}


  handlePin(receiveItem: any) {
    //console.log('receiveItem check:', receiveItem);
    //console.log("Pin clicked!"); // Debugging output
  
    // Get latest epoch timestamp
    this.PinValue = Date.now(); // This will store the current epoch time
  
    //console.log("Latest Epoch Timestamp:", this.PinValue);
    //console.log('checking griddetails',this.dashboard)
  
    // Read summary ID from formGroup
    const readSummaryId = this.createSummaryField.get('summaryID')?.value;
    //console.log('readSummaryId checking from the form:', readSummaryId);
    //console.log('this.createSummaryField.value checking:', this.createSummaryField.value);
    this.openModalHelpher(receiveItem.P1,'handlingPin').then((data) => {
      //console.log('✅ this.all_Packet_store permissions:', data);
      const readMainData = data;
      //console.log('readMainData checking', readMainData);
      if (data.grid_details.length === 0) {
        Swal.fire({
          icon: 'error',
          title: 'Cannot update Pin',
          text: 'To add or remove a pin, the Dashboard must contain at least one widget.',
          showConfirmButton: true,
          confirmButtonText: 'OK',
          position: 'center'
        });
        return;
      } else if (data.grid_details.length > 0) {
        this.updateSummary(receiveItem, 'addPin', this.PinValue);
      }
      
      
      

    }).catch(err => {
      console.error('Error in openModalHelpher:', err);
    });
  
    // Call update function with latest epoch timestamp
 
  
    // Your logic for pin action
  }
  
  

  handleUnpin(receive: any) {
    //console.log('receive checking', receive);
    //console.log("Unpin clicked!"); // Debugging output
  
    // Manually clear P10
    receive.P10 = ''; // Or use undefined if required
  
    //console.log('Updated receive object after unpin:', receive);
    this.openModalHelpher(receive.P1,'handlingPin').then((data) => {
      //console.log('✅ this.all_Packet_store permissions:', data);
      const readMainData = data;
      //console.log('readMainData checking', readMainData);
      if (data.grid_details.length === 0) {
        Swal.fire({
          icon: 'error',
          title: 'Cannot update Pin',
          text: 'To add or remove a pin, the Dashboard must contain at least one widget.',
          showConfirmButton: true,
          confirmButtonText: 'OK',
          position: 'center'
        });
        return;
      } else if (data.grid_details.length > 0) {
        this.updateSummary(receive, 'addPin');
      }
  

    }).catch(err => {
      console.error('Error in openModalHelpher:', err);
    });
  
    // Call update function with the modified object
    // this.updateSummary(receive, 'addPin');
  }
  
  
  
  private validateAndSubmit(tempObj: any, actionKey: string, receiveFullScreenValue?: any) {
    this.isGirdMoved = false;
    //console.log('actionKey checking', actionKey);
  
    if (!tempObj.PK || !tempObj.SK) {
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: `Failed to ${actionKey} summary. PK and SK are required.`,
        showConfirmButton: false,
        timer: 1500
      });
      return;
    }
  
    this.api.UpdateMaster(tempObj).then(response => {
      //console.log('API Response:', response);
      if (response && response.metadata) {
        const successTitle = {
          create: 'Summary created',
          saveDashboard: 'Dashboard saved',
          add_tile: 'Widget Added',
          update_tile: 'Widget Updated',
          delete_tile: 'Widget deleted',
          add_map: 'Map Added',
          update_map: 'Map Updated',
          deleteTile: 'Widget deleted',
          update: 'Summary updated',
          update_Dashboard: 'Dashboard Filteration is updated',
          filter_add: 'Dashboard Filteration is added',
          add_table: 'Table Widget Added',
          update_table: 'Table Widget Updated',
          add_multiTable: 'Table Widget Added',
          update_multiTable: 'Table Widget Updated',
          query_applied: 'Query Applied',
          addPin: 'Pin Updated',
          Save: 'Dashboard changes saved',
          importUpdate: 'Summary Dashboard Imported',
          editSummary: 'Dashboard Configuration Updated',
          stacked_save: 'Stacked Bar Chart Created',
          duplicateWidget: '', // No title needed for duplicateWidget,
          Add_Tile2:'Widget Added'

        }[actionKey] || 'Summary Updated';
  
        //console.log('Action key condition check:', actionKey);

  
        // Check if actionKey is 'duplicateWidget', if so, skip SweetAlert
        if (actionKey !== 'duplicateWidget') {
          // Show alert
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: `${successTitle} successfully`,
            showConfirmButton: true
          }).then((result) => {
            if (result.isConfirmed) {
              if(actionKey === 'filter_add'){
                // window.location.reload();
      
              }
              // Reload the page for specific action keys
              else if (actionKey === 'add_map' || actionKey === 'update_map') {
                window.location.reload(); // Reloads the current window
              } else if (actionKey === 'update_Dashboard' || actionKey === 'filter_add') {
                // No action needed here for these cases
              } else if (actionKey === 'add_table' || actionKey === 'update_table') {
                window.location.reload();
              } else if (actionKey === 'add_multiTable' || actionKey === 'update_multiTable') {
                // No action needed here for these cases
              } else if (actionKey === 'addPin') {
                window.location.reload();
              } else if (actionKey === 'importUpdate') {
                window.location.reload();
              } else if (actionKey === 'editSummary') {
                //console.log('receiveFullScreenValue checking from summary', receiveFullScreenValue);
  
                let queryParams: any = {
                  isFullScreen: receiveFullScreenValue
                };
  
                // Conditionally add userId and userPass
                if (this.userId) {
                  queryParams.uID = this.userId;
                }
                if (this.userPass) {
                  queryParams.pass = this.userPass;
                }
                //console.log('checking router id from validation', this.routeId);
  
                // Navigate
                if (this.userId || this.userPass) {
                  this.location.replaceState(`/summary-engine/${this.routeId}`, this.createQueryString(queryParams));
                  this.openModalHelpher(this.routeId);
                  window.location.reload();
                } else {
                  this.location.replaceState(`/summary-engine/${this.routeId}`, this.createQueryString(queryParams));
                  window.location.reload();
                }
              } else if (actionKey === 'Save') {
                window.location.reload();
              } else if (actionKey === 'stacked_save') {
                window.location.reload();
              }
            }
          });
        }
  
        this.cdr.detectChanges();
  
        // Additional logic for 'update'
        if (actionKey === 'update') {
          this.route.paramMap.subscribe(params => {
            this.routeId = params.get('id');
            if (this.routeId) {
              this.openModalHelpher(this.routeId);
              this.editButtonCheck = false;
              //console.log('Route ID found, opening modal:', this.routeId);
            }
          });
        }
  
        this.loadData();
        if (this.modalRef) this.modalRef.close();
      } else {
        throw new Error('Invalid response structure');
      }
    }).catch(err => {
      // Skip error message for 'addPin' action
      if (actionKey !== 'addPin') {
        console.error('Error:', err);
        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: `Failed to ${actionKey} summary`,
          text: err.message,
          showConfirmButton: false,
          timer: 1500
        });
      }
    });
  }
  
  
  
  createQueryString(params: any): string {
    const queryParams = new URLSearchParams(params).toString();
    return queryParams ? '?' + queryParams : '';
  }
  
  


  private formatField(value: any): string {
    try {
      let parsedValue;
  
      // Step 1: Parse if the value is a string
      if (typeof value === 'string') {
        parsedValue = JSON.parse(value);
      } else {
        // Assume it's already parsed, directly assign it
        parsedValue = value;
      }
  
      // Step 2: Check if the parsed value is an array with `filterDescription`
      if (Array.isArray(parsedValue)) {
        const formattedArray = parsedValue.map((item) => {
          if (item.filterDescription && item.filterParameter && item.filterParameter1 && item.filterDescription1) {
            // Replace placeholders in filterDescription with corresponding text
            let formattedDescription = item.filterDescription;
            item.filterParameter.forEach((param: any) => {
              const placeholder = `\${${param.value}}`;
              formattedDescription = formattedDescription.replace(placeholder, param.text);
            });
  
            return {
              ...item,
              formattedFilterDescription: formattedDescription,
            };
          }
          return item;
        });
  
        return JSON.stringify(formattedArray); // Convert back to a string
      }
  
      // Step 3: For non-array objects, just stringify the value
      return JSON.stringify(parsedValue || []);
    } catch (error) {
      // Handle errors gracefully
      console.error('Error formatting field:', value, error);
      return '[]';
    }
  }
  
  
  
  private formatDashboardTiles(dashboard: any[]): any[] {
    return dashboard.map(tile => ({
      ...tile,
      multi_value: this.formatField(tile.multi_value),
      chartConfig: this.formatField(tile.chartConfig),
      filterParameter: this.formatField(tile.filterParameter),
      tileConfig: this.formatField(tile.tileConfig),
      filterTileConfig:this.formatField(tile.filterTileConfig),
      tableWidget_Config:this.formatField(tile.tableWidget_Config),
      conditions:this.formatField(tile.conditions),
      MapConfig:this.formatField(tile.MapConfig),
      filterParameter1:this.formatField(tile.filterParameter1),
      EquationParam:this.formatField(tile.EquationParam),
      multiTableWidget_Config:this.formatField(tile.multiTableWidget_Config),
      columnVisibility:this.formatField(tile.columnVisibility),
      formFieldTexts:this.formatField(tile.formFieldTexts),
      equation:this.formatField(tile.equation),
      MiniTableFields:this.formatField(tile.MiniTableFields),
      filterParameterLine:this.formatField(tile.filterParameterLine),
      parameterNameHTML:this.formatField(tile.parameterNameHTML),
      table_rowConfig:this.formatField(tile.table_rowConfig),
      DrillConfig:this.formatField(tile.DrillConfig),
      filter_duplicate_data:this.formatField(tile.filter_duplicate_data),
      customColumnConfig:this.formatField(tile.customColumnConfig),
      tableDrillDownFields:this.formatField(tile.tableDrillDownFields)
  
      // parameterName:this.formatField(tile.parameterName)







      

    }));
  }
  private constructAllCompanyDetails(): any {
    return {
      summaryID: this.createSummaryField.value.summaryID,
      summaryName: this.createSummaryField.value.summaryName,
      summaryDesc: this.createSummaryField.value.summarydesc,
      summaryIcon: this.createSummaryField.value.iconSelect,
      iconObject: this.previewObjDisplay,
      LiveDashboard:this.createSummaryField.value.LiveDashboard,
      fullScreenModeCheck:this.createSummaryField.value.fullScreenModeCheck,
      // DashboardRestriction:this.createSummaryField.value.DashboardRestriction,
      updated: new Date().toISOString(),
      createdUser: this.getLoggedUser?.username || this.createdUserName
    };
  }
  

  createNewSummary() {
    this.defaultValue = 'Tiles'
    if (this.isDuplicateID || this.isDuplicateName || this.createSummaryField.invalid) {
      return; // Prevent saving if there are errors
    }



    let tempClient = this.SK_clientID + "#summary" + "#lookup";
    //console.log('tempClient checking', tempClient);


    const createdDate = Math.ceil((new Date()).getTime() / 1000); // Created date
    const updatedDate = Math.ceil(Date.now() / 1000); // Updated date

    // Prepare summary details
    this.allCompanyDetails = {
      summaryID: this.createSummaryField.value.summaryID,
      summaryName: this.createSummaryField.value.summaryName,
      summaryDesc: this.createSummaryField.value.summarydesc,

      // jsonData: parsedJsonData,
      summaryIcon: this.createSummaryField.value.iconSelect ||'',
      iconObject: this.previewObjDisplay ||'',
      LiveDashboard:this.createSummaryField.value.LiveDashboard,
      fullScreenModeCheck:this.createSummaryField.value.fullScreenModeCheck,
      // DashboardRestriction:this.createSummaryField.value.DashboardRestriction,

      // Add the selected icon
      crDate: createdDate, // Created date
      upDate: updatedDate,  // Updated date
      createdUser: this.getLoggedUser.username, // Set the creator's username
      grid_details: []
    };

    //console.log("summary data ", this.allCompanyDetails);

    // Prepare ISO date strings
    const createdDateISO = new Date(this.allCompanyDetails.crDate * 1000).toISOString();
    const updatedDateISO = new Date(this.allCompanyDetails.upDate * 1000).toISOString();

    // Prepare tempObj for API call
    const tempObj = {
      PK: this.SK_clientID + "#" + this.allCompanyDetails.summaryID + "#summary" + "#main",
      SK: 1,
      metadata: JSON.stringify({
        summaryID: this.allCompanyDetails.summaryID,
        summaryName: this.allCompanyDetails.summaryName,
        summaryDesc: this.allCompanyDetails.summaryDesc,
        // jsonData: this.allCompanyDetails.jsonData,
        summaryIcon: this.createSummaryField.value.iconSelect ||'',
        LiveDashboard:this.createSummaryField.value.LiveDashboard,
        fullScreenModeCheck:this.createSummaryField.value.fullScreenModeCheck,
        // DashboardRestriction:this.createSummaryField.value.DashboardRestriction,
        // Include selected icon in the metadata
        created: createdDateISO, // Created date in ISO format
        updated: updatedDateISO,   // Updated date in ISO format
        createdUser: this.allCompanyDetails.createdUser, // Use the persisted createdUser
        iconObject: this.allCompanyDetails.iconObject ||'',
        tilesList:this.defaultValue ,
        grid_details:[],
        queryParams:[],


      })
    };
    // Now, patch the 'tilesList' form control after creating the summary
this.createSummaryField.patchValue({
  tilesList: this.defaultValue // Set the value to 'Widget'
});

    //console.log("TempObj is here ", tempObj);
    const temobj1: any = JSON.stringify(this.createSummaryField.value.iconSelect)
    // Prepare items for further processing
    //console.log("this.createSummaryField.value.iconSelec", this.createSummaryField.value.iconSelect)
    //console.log("temobj1", temobj1)
    const items = {
      P1: this.createSummaryField.value.summaryID,
      P2: this.createSummaryField.value.summaryName,
      P3: this.createSummaryField.value.summarydesc,
      P4: updatedDate,  // Updated date
      P5: createdDate,   // Created date
      P6: this.allCompanyDetails.createdUser,  // Created by user
      P7: this.getLoggedUser.username,          // Updated by user
      P8: JSON.stringify(this.previewObjDisplay) ||'',
      P9: this.createSummaryField.value.iconSelect, // Add selected icon
      P10:this.createSummaryField.value.PinCheck ||'',
      P11:this.createSummaryField.value.fullScreenModeCheck,
      // P12:this.createSummaryField.value.DashboardRestriction,
    };
    //console.log('items checking from create Summary',items)
console.log('lookupitems check from createnewsummary',items)
    // API call to create the summary
    this.api.CreateMaster(tempObj).then(async (value: any) => {
      await this.createLookUpSummary(items, 1, tempClient);

      this.datatableConfig = {};
      this.lookup_data_summary = [];

      //console.log('value check from create master', value);
      if (items || value) {
        //console.log('items check from create master', items);

        // Call the loadData function
        this.loadData();

        // Show a success alert and handle the "OK" button click
        Swal.fire({
          position: 'center', // Center the alert
          icon: 'success', // Alert type
          title: 'New summary successfully created', // Title text
          showConfirmButton: true, // Display the OK button
          confirmButtonText: 'OK', // Customize the OK button text
          allowOutsideClick: false, // Prevent closing the alert by clicking outside
        }).then((result) => {
          if (result.isConfirmed) {
            // This block is executed when the "OK" button is clicked
            console.log('checkitems.P1 from createnewsummary',items.P1)
            if (items && items.P1) {
              this.dashboardOpen(items.P1);
       
          // Pass item.P1 to viewItem
            }
            if (this.modalRef) {
              this.modalRef.close(); // Close the modal
            }
          }
        });
      }

      else {
        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: 'Failed to create summary',
          showConfirmButton: false,
          timer: 1500
        });
      }

      const UserDetails = {
        "User Name": this.userdetails,
        "Action": "Created",
        "Module Name": "Summary Dashboard",
        "Form Name": "Summary Dashboard",
        "Description": "Dashboard is Created",
        "User Id": this.userdetails,
        "Client Id": this.SK_clientID,
        "created_time": Date.now(),
        "updated_time": Date.now()
      }

      this.auditTrail.mappingAuditTrailData(UserDetails,this.SK_clientID)

    }).catch(err => {
      //console.log('err for creation', err);
      this.toast.open("Error in adding new Summary Configuration ", "Check again", {
        duration: 5000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
      });
    });
  }
  









  onAddWidgetTabClick() {
    //console.log('showAddWidgetsTab:', this.showAddWidgetsTab);
    //console.log('showModal:', this.showModal);
    //console.log('selectedTab:', this.selectedTab);
    
    if (this.showAddWidgetsTab && !this.showModal) {
      Swal.fire({
        icon: 'warning',
        title: 'Create a Summary First',
        text: 'Please create a summary before adding widgets.',
      });
    } else {
      this.selectedTab = 'add-widget'; // Proceed to the Add Widgets tab in edit mode
    }
  }
  
  onAutoflowConfigTabClick() {
    // Check if in add mode and access is restricted
    if (!this.showAddWidgetsTab && !this.showModal) {
      Swal.fire({
        icon: 'warning',
        title: 'Create a Summary First',
        text: 'Please create a summary before accessing Autoflow Config.',
      });
    } else {
      this.selectedTab = 'autoflow-config'; // Proceed to the Autoflow Config tab in edit mode
    }
  }




  formatJsonDataForUpdate(jsonData: any) {
    // Assuming jsonData is an object and needs to be converted to an array of update operations
    const updateOperations = [];

    for (const key in jsonData) {
      if (jsonData.hasOwnProperty(key)) {
        updateOperations.push({
          Put: {
            Key: key,
            Value: jsonData[key],
          }
        });
      }
    }

    return updateOperations;
  }






  async fetchTimeMachineById(sk: any, id: any, type: any, item: any) {
    //console.log('item check from update',item)
    const tempClient = this.SK_clientID + '#summary' + '#lookup';
    //console.log("Temp client is ", tempClient);
    //console.log("Type of client", typeof tempClient);
    //console.log("item check from fetchTimeMachine", item);
  
    try {
      const response = await this.api.GetMaster(tempClient, sk);
      //console.log('response check from timeMachine', response);
  
      if (response && response.options) {
        let data: ListItem[] = await JSON.parse(response.options);
  
        // Find the index of the item with the matching id
        let findIndex = data.findIndex((obj) => obj[Object.keys(obj)[0]].P1 === id);
        //console.log('findIndex checking',findIndex)
  
        if (findIndex !== -1) { // If item found
          if (type === 'update') {
            data[findIndex][`L${findIndex + 1}`] = item;
  
            // Create a new array to store the re-arranged data without duplicates
            const newData = [];
          
            // Loop through each object in the data array
            for (let i = 0; i < data.length; i++) {
              const originalKey = Object.keys(data[i])[0]; // Get the original key (e.g., L1, L2, ...)
              const newKey = `L${i + 1}`; // Generate the new key based on the current index
          
              // Check if the original key exists before renaming
              if (originalKey) {
                // Create a new object with the new key and the data from the original object
                const newObj = { [newKey]: data[i][originalKey] };
          
                // Check if the new key already exists in the newData array
                const existingIndex = newData.findIndex(obj => Object.keys(obj)[0] === newKey);
          
                if (existingIndex !== -1) {
                  // Merge the properties of the existing object with the new object
                  Object.assign(newData[existingIndex][newKey], data[i][originalKey]);
                } else {
                  // Add the new object to the newData array
                  newData.push(newObj);
                }
              } else {
                console.error(`Original key not found for renaming in data[${i}].`);
                // Handle the error or log a message accordingly
              }
            }
          
            // Replace the original data array with the newData array
            data = newData;
            this.lookup_data_summary = data;
            const assignData =data
            let updateData = {
              PK: tempClient,
              SK: response.SK,
              options: JSON.stringify(assignData),
            };
    
            await this.api.UpdateMaster(updateData);
            this.refreshFunction();
            // setTimeout(() => {
            //   location.reload()
            // }, 1000);
      
            this.cd.detectChanges();
                  
          } else if (type === 'delete') {
            // Remove the item at the found index
            
            data.splice(findIndex, 1);
            this.lookup_data_summary = data;
            const assignUpdatedData = data
            let updateData = {
              PK: tempClient,
              SK: response.SK,
              options: JSON.stringify(assignUpdatedData),
            };
    
            await this.api.UpdateMaster(updateData);
            this.refreshFunction();
        
            location.reload()
            this.cd.detectChanges();
          }
  //console.log('lookup data check from summary',data)

          
        } else { // If item not found
          await new Promise(resolve => setTimeout(resolve, 500));
          await this.fetchTimeMachineById(sk + 1, id, type, item);
        }
      } else {
        Swal.fire({
          position: "top-right",
          icon: "error",
          title: `ID ${id} not found`,
          showConfirmButton: false,
          timer: 1500,
        });
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }
  

refreshFunction(){
  if (this.routeId) {
    //console.log('this.routeId check',this.routeId)
    // this.checkAndSetFullscreen();
    this.editButtonCheck = true

    // this.openModalHelpher(this.routeId)
  } else {
    this.editButtonCheck = false
  }
}

  // addFromService() {

  // }


  async getClientID() {
    try {

      await this.fetchTMClientLookup(1)

      for (let i = 0; i < this.lookup_data_client.length; i++) {
        this.listofClientIDs.push(this.lookup_data_client[i].P1);
      }

      this.listofClientIDs = Array.from(new Set(this.listofClientIDs))

      //console.log("All the clients data is here ", this.listofClientIDs)

    }
    catch (err) {
      //console.log("Error fetching all the clients ");
    }
  }


  async fetchTMClientLookup(sk: any) {
    //console.log("Iam called Bro");
    try {
      const response = await this.api.GetMaster("client" + "#lookup", sk);

      if (response && response.options) {
        if (typeof response.options === 'string') {
          let data = JSON.parse(response.options);
          //console.log("d1 =", data);

          if (Array.isArray(data)) {
            for (let index = 0; index < data.length; index++) {
              const element = data[index];

              if (element !== null && element !== undefined) {
                const key = Object.keys(element)[0];
                const { P1, P2, P3, P4, P5, P6, P7, P8, P9,P10,P11 } = element[key];
                this.lookup_data_client.push({ P1, P2, P3, P4, P5, P6, P7, P8, P9,P10,P11});
                //console.log("d2 =", this.lookup_data_client);
              } else {
                break;
              }
            }

            // this.lookup_data_client.sort((a: any, b: any) => b.P5 - a.P5);
            // //console.log("Lookup sorting", this.lookup_data_client);

            // Continue fetching recursively with fetchTMClientLookup itself
            await this.fetchTMClientLookup(sk + 1);
          } else {
            console.error('Invalid data format - not an array.');
          }
        } else {
          console.error('response.options is not a string.');
        }
      } else {
        //console.log("Lookup to be displayed", this.lookup_data_client);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }


  remove(index: any) {
    //console.log('remove', index);
    const addFields = this.createSummaryField.get('metadata') as UntypedFormArray
    addFields.removeAt(index);
  }

  getRandomColor(): string {
    const colors = ['text-light', 'text-primary', 'text-secondary', 'text-success', 'text-danger', 'text-warning', 'text-info', 'text-dark'];
    const randomIndex = Math.floor(Math.random() * colors.length); // Generate a random index
    return colors[randomIndex]; // Return a random color
  }
  getIconClass(iconName: string): string {
    const iconOption = this.iconOptions.find(option => option.value === iconName);
    return iconOption ? iconOption.class1 : ''; // Return the class or an empty string if not found
  }

  // Method to generate the icon options with random colors
  // getIconOptions(): { value: string; label: string; class1: string ,class2: string }[] {
  //   return 
  // }


  modifyList(location_permission: any, form_permissions: any): string {
    // Check if locationPermission and devicePermissions are defined and are arrays
    if (!Array.isArray(location_permission) || !Array.isArray(form_permissions)) {
      console.error("Invalid input: locationPermission and devicePermissions must be arrays.");
      return ''; // Return early if inputs are not valid
    }

    // Determine the permission type for location and device
    const keyLocation = location_permission.length === 1 && location_permission[0] === "All" ? "All" : "Not all";
    const keyDevices = form_permissions.length === 1 && form_permissions[0] === "All" ? "All" : "Not all";

    //console.log("modify", `${keyLocation}--${keyDevices}`);

    // Concatenate data based on the keys
    switch (`${keyLocation}-${keyDevices}`) {
      case "All-All":
        // return [...deviceTypePermissions, ...devicePermissions]; // Assuming deviceTypePermissions is defined
        return "All-All";

      default:
        //console.log("Unrecognized case");
        return '';
    }
  }
  async addFromService() {
    this.getClientID()

    try {
      const result: any = await this.api.GetMaster(this.SK_clientID + "#dynamic_form#lookup", 1);
      if (result) {
        const helpherObj = JSON.parse(result.options);
        //console.log('helpherObj checking',helpherObj)
        this.formList = helpherObj.map((item: [string]) => item[0]); // Explicitly define the type
        this.listofDeviceIds = this.formList.map((form: string) => ({ text: form, value: form })); // Explicitly define the type here too
        //console.log('this.formList check from location', this.formList);
      }
    } catch (err) {
      //console.log("Error fetching the dynamic form data", err);
    }

    this.userdetails = this.getLoggedUser.username;
    this.userClient = this.userdetails + "#user" + "#main"
    //console.log('this.tempClient from form service check', this.userClient)
    this.All_button_permissions = await this.api.GetMaster(this.userClient, 1).then(data => {

      if (data) {
        //console.log('data checking from add form', data)
        const metadataString: string | null | undefined = data.metadata;

        // Check if metadataString is a valid string before parsing
        if (typeof metadataString === 'string') {
          try {
            // Parse the JSON string into a JavaScript object
            this.metadataObject = JSON.parse(metadataString);
            //console.log('Parsed Metadata Object from location', this.metadataObject);
          } catch (error) {
            console.error('Error parsing JSON:', error);
          }
        } else {
          //console.log('Metadata is not a valid string:', this.metadataObject);
        }
        // //console.log("userPermissions iside",this.modifyList(data.location_permission,data.device_type_permission,data.device_permission))
        return this.modifyList(this.metadataObject.location_permission, this.metadataObject.form_permission) === "All-All" ? false : true

      }

    })

    //console.log("this.All_button_permissions", this.All_button_permissions)
    this.locationPermissionService.fetchGlobalLocationTree()
      .then((jsonModified: any) => {
        if (!jsonModified) {
          throw new Error("No data returned");
        }

        //console.log("Data from location: check", jsonModified);
        this.temp = jsonModified
        const jstreeData = jsonModified.map((treeNode: TreeNode) => ({
          id: treeNode.id, // Use 'id' for jstree node ID
          text: treeNode.text, // Use 'text' for jstree node display
          parent: treeNode.parent || "#", // Set parent, or use "#" for root
          node_type: treeNode.node_type,
          magicboard_view: treeNode.magicboard_view,
          powerboard_view: treeNode.powerboard_view,
          description: treeNode.description,
          summaryView: treeNode.summaryView,
          dreamboard_view: treeNode.dreamboard_view,
          powerboard_view_device: treeNode.powerboard_view_device,
          icon: treeNode.icon



          // You can add additional properties as needed
        }));
        setTimeout(() => {
          this.createJSTree(jstreeData);
        }, 1000);

        // Proceed with creating the JSTree

        // this.createJSTree(jsonModified);
        // this.getAllDevices();
      }
      )
  }
  createJSTree(jsondata: any) {

    (<any>$('#SimpleJSTree')).jstree({
      "core": {
        "check_callback": true,
        'data': jsondata,
        'multiple': false,
        //themes: { dots: false }
        //   'themes': {
        //     'name': 'proton',
        //     'responsive': true
        // }
      },
      'search': {
        'show_only_matches': true,
        // 'show_only_matches_children': true
      },
      "plugins": ["contextmenu", "dnd", "search"],
      "contextmenu": {
        "items": function ($node: any) {
          ////console.log('selected node', $node.selected);

          let tree = (<any>$("#SimpleJSTree")).jstree(true);
          return {
            "Create": {
              "separator_before": false,
              "separator_after": true,
              "label": "Add Location",
              "action": false,
              "submenu": {
                "Child": {
                  "seperator_before": false,
                  "seperator_after": false,
                  "label": "Child",
                  action: function (obj: any) {

                    $node = tree.create_node($node, { text: 'New Child', type: 'file', icon: 'glyphicon glyphicon-file' });
                    tree.deselect_all();
                    tree.select_node($node);

                  }
                },
                "Parent": {
                  "seperator_before": false,
                  "seperator_after": false,
                  "label": "Parent",
                  action: function (obj: any) {
                    $node = tree.create_node($node, { text: 'New Parent', type: 'default' });
                    tree.deselect_all();
                    tree.select_node($node);
                  }
                }
              }
            },
            "Rename": {
              "separator_before": false,
              "separator_after": false,
              "label": "Edit Location",
              "action": function (obj: any) {
                tree.edit($node);
              }
            },
            "Remove": {
              "separator_before": false,
              "separator_after": false,
              "label": "Remove Location",
              "action": function (obj: any) {
                tree.delete_node($node);
              }
            }
          };
        }
      }


    })

      .on("changed.jstree", (e: any, data: any) => {
        // let node, selected_node = [];
        if (data && data.node && data.node.text) {
          //console.log('data checking from tree', data)
          ////console.log('data in tree', data);

          this.parentID_selected_node = data.node.parent
          // for (node = 0, selected_node = data.selected.length; node < selected_node; node++) {

          // }
          this.final_list = data.instance.get_node(data.selected);
          //console.log('this.final_list check', this.final_list)

          ////console.log('CHK THE NODE', this.final_list);

          // if (this.final_list.original && this.final_list.original.powerboard_view && this.final_list.original.powerboard_view !== undefined && this.final_list.original.powerboard_view.id
          //   && this.final_list.original.powerboard_view.id !== null && this.final_list.original.powerboard_view.id !== "" && this.final_list.original.powerboard_view.id !== undefined) {
          //   this.enableLocationButton = true


          // }

          //if node is selelcted,need to enable ok button
          if (this.final_list.original) {
            this.enableLocationButton = true
            this.cdr.detectChanges();


          }

          // else {
          //   this.enableLocationButton = false
          // }
        }

      });


    let to: any = false;
    $('#search').keyup(() => {
      if (to) {
        clearTimeout(to);
      }
      // to = setTimeout(() => {
      var v: any = $('#search').val();
      (<any>$('#SimpleJSTree')).jstree(true).search(v);
      // }, 250);
    });

  }


  LocationSummary() {
    let navId: any
    ////console.log('CHECK THIS LOCATION THING ', this.final_list)
    if (this.final_list.original.node_type == "location") {
      navId = this.final_list.original.summaryView;
    } else {
      navId = this.final_list.original.powerboard_view_device.id;
    }

    //console.log('navId check from summary', navId)
    let navIdList = { id: navId }
    if (navId !== '') {

      // localStorage.setItem('fullscreen', 'true');
      // this.viewItem(navId)

    }

  }



  setActiveTab(tab: Tabs) {

    this.activeTab = tab;

  }

  fetchDynamicFormData(value: any) {
    //console.log("Data from lookup:", value);

    this.api
      .GetMaster(`${this.SK_clientID}#dynamic_form#${value}#main`, 1)
      .then((result: any) => {
        if (result && result.metadata) {
          const parsedMetadata = JSON.parse(result.metadata);
          const formFields = parsedMetadata.formFields;

          // Initialize the list with formFields labels
          this.listofDynamicParam = formFields.map((field: any) => {
            return {
              value: field.label,
              text: field.label
            };
          });

          // Include created_time and updated_time
          if (parsedMetadata.created_time) {
            this.listofDynamicParam.push({
              value: parsedMetadata.created_time.toString(),
              text: 'Created Time' // You can customize the label here if needed
            });
          }

          if (parsedMetadata.updated_time) {
            this.listofDynamicParam.push({
              value: parsedMetadata.updated_time.toString(),
              text: 'Updated Time' // You can customize the label here if needed
            });
          }

          //console.log('Transformed dynamic parameters:', this.listofDynamicParam);

          // Trigger change detection to update the view
          this.cdr.detectChanges();
        }
      })
      .catch((err) => {
        //console.log("Can't fetch", err);
      });
  }


  parameterValue(event:any){
    //console.log('event for parameter check',event)

  }

  editItem(item: any) {
    //console.log('Editing item:', item);

    // Open edit modal or perform the edit action here
    // Example: this.openEditModal(item);
  }

  openModalCalender() {
    const modalRef = this.modalService.open(this.calendarModal);
    modalRef.result.then(
      (result) => {
        //console.log('Closed with:', result);
        this.handleModalClose(result); // Handle logic when modal closes
      },
      (reason) => {
        //console.log('Dismissed with:', reason);
      }
    );
  }
  openModalCalender1() {
    const modalRef = this.modalService.open(this.calendarModal1);
    modalRef.result.then(
      (result) => {
        //console.log('Closed with:', result);
        this.handleModalClose(result); // Handle logic when modal closes
      },
      (reason) => {
        //console.log('Dismissed with:', reason);
      }
    );
  }

  selectValue(value: string, modal: any) {
    //console.log('Selected value:', value);

    // Set the value to the form control
    this.groupByFormatControl.setValue(value);

    // Close the modal after selection
    this.closeModal(modal);
  }

  get groupByFormatControl(): FormControl {
    return this.createKPIWidget.get('groupByFormat') as FormControl; // Cast to FormControl
  }
  get groupByFormatControl1(): FormControl {
    return this.createKPIWidget1.get('groupByFormat') as FormControl; // Cast to FormControl
  }
  handleModalClose(selectedValue: string) {
    // Logic to handle what happens after the modal closes
    //console.log('Handling post modal close logic with value:', selectedValue);
    // You can update your UI or state here based on the selectedValue
  }


  showTooltip(item: string) {
    this.tooltip = item;
  }

  hideTooltip() {
    this.tooltip = null;
  }


  onCancel(modal: any) {
    modal.dismiss(); // Dismiss the modal
  }
  calenderClose(event: any) {


  }
  closeModal(modal: any) {
    if (modal) {
      modal.close(); // Close the modal
    } else {
      console.error('Modal reference is undefined');
    }
  }

  onValueChange(selectedValue: any): void {
    // Handle any logic here if needed when the value changes
    //console.log(selectedValue); // Optional: log the selected value
  }
  onRangeSelect(selectedValue: any): void {
    // Handle any logic here if needed when the value changes
    //console.log('selectedValue checking', selectedValue); // Optional: log the selected value
  }



  get Target1() {
    return this.createKPIWidget6.get('Target');
  }
  get MaxRange1() {
    return this.createKPIWidget6.get('MaxRange');
  }
  get value1() {
    return this.createKPIWidget6.get('value');
  }
  onValueChangeMaxRange1(selectedValue: any): void {
    // Handle any logic here if needed when the value changes
    //console.log(selectedValue); // Optional: log the selected value
  }

  onValueChange6(selectedValue: any): void {
    // Handle any logic here if needed when the value changes
    //console.log(selectedValue); // Optional: log the selected value
  }



  onValue(value: any) {
    // Logic to handle value change, if needed
    //console.log("Selected Value:", value);
  }
  onTarget(value: any) {
    // Logic to handle value change, if needed
    //console.log("Selected Value:", value);
  }

  onMaxRange1(value: any) {
    // Logic to handle value change, if needed
    //console.log("Selected Value:", value);
  }









 

  selectValue6(value: string, modal: any) {
    //console.log('Selected value:', value);

    // Set the value to the form control
    this.groupByFormatControl6.setValue(value);

    // Close the modal after selection
    this.closeModal(modal);
  }

  get groupByFormatControl6(): FormControl {
    return this.createKPIWidget6.get('groupByFormat') as FormControl; // Cast to FormControl
  }

  openModalCalender2() {
    const modalRef = this.modalService.open(this.calendarModal2);
    modalRef.result.then(
      (result) => {
        //console.log('Closed with:', result);
        this.handleModalClose(result); // Handle logic when modal closes
      },
      (reason) => {
        //console.log('Dismissed with:', reason);
      }
    );
  }

  openModalCalender3() {
    const modalRef = this.modalService.open(this.calendarModal3);
    modalRef.result.then(
      (result) => {
        //console.log('Closed with:', result);
        this.handleModalClose(result); // Handle logic when modal closes
      },
      (reason) => {
        //console.log('Dismissed with:', reason);
      }
    );
  }

  openModalCalender4() {
    const modalRef = this.modalService.open(this.calendarModal4);
    modalRef.result.then(
      (result) => {
        //console.log('Closed with:', result);
        this.handleModalClose(result); // Handle logic when modal closes
      },
      (reason) => {
        //console.log('Dismissed with:', reason);
      }
    );
  }

  openModalCalender5() {
    const modalRef = this.modalService.open(this.calendarModal5);
    modalRef.result.then(
      (result) => {
        //console.log('Closed with:', result);
        this.handleModalClose(result); // Handle logic when modal closes
      },
      (reason) => {
        //console.log('Dismissed with:', reason);
      }
    );
  }
  openModalCalender6() {
    const modalRef = this.modalService.open(this.calendarModal6);
    modalRef.result.then(
      (result) => {
        //console.log('Closed with:', result);
        this.handleModalClose(result); // Handle logic when modal closes
      },
      (reason) => {
        //console.log('Dismissed with:', reason);
      }
    );
  }




  updateTile6() {
    if (this.editTileIndex6 !== null) {
      //console.log('this.editTileIndex check', this.editTileIndex6);
      //console.log('Tile checking for update:', this.dashboard[this.editTileIndex6]); // Log the tile being checked

      // Log the current details of the tile before update
      //console.log('Current Tile Details Before Update:', this.dashboard[this.editTileIndex6]);

      // Update the properties of the tile with the new values from the form
      this.dashboard[this.editTileIndex6] = {
        ...this.dashboard[this.editTileIndex6], // Keep existing properties
        formlist: this.createKPIWidget6.value.formlist,
        parameterName: this.createKPIWidget6.value.parameterName,
        value: this.createKPIWidget6.value.value,
        Target: this.createKPIWidget6.value.Target,
        MaxRange: this.createKPIWidget6.value.MaxRange,
        groupByFormat: this.createKPIWidget6.value.groupByFormat,
        constantValuevalue: this.createKPIWidget6.value.constantValuevalue,
        percentageValue: this.createKPIWidget6.value.percentageValue,
        constantValueTarget: this.createKPIWidget6.value.constantValueTarget,
        constantValueMaxRange: this.createKPIWidget6.value.constantValueMaxRange,
        percentageValueTarget: this.createKPIWidget6.value.percentageValueTarget,
        percentageValueMaxRange: this.createKPIWidget6.value.percentageValueMaxRange,
        // Include any additional properties if needed
      };

      // Log the updated details of the tile
      //console.log('Updated Tile Details:', this.dashboard[this.editTileIndex6]);

      // Also update the grid_details array to reflect changes
      this.all_Packet_store.grid_details[this.editTileIndex6] = {
        ...this.all_Packet_store.grid_details[this.editTileIndex6], // Keep existing properties
        ...this.dashboard[this.editTileIndex6], // Update with new values
      };
      // this.openModal('Edit_ts', this.all_Packet_store)

      this.updateSummary('', 'update_tile');
      //console.log('his.dashboard check from updateTile', this.dashboard)

      //console.log("Updated all_Packet_store.grid_details:", this.all_Packet_store.grid_details);


      // Reset the editTileIndex after the update
      this.editTileIndex6 = null;
    } else {
      console.error("Edit index is null. Unable to update the tile.");
    }
  }




  selectValue3(value: string, modal: any) {
    //console.log('Selected value:', value);

    // Set the value to the form control
    this.groupByFormatControl3.setValue(value);

    // Close the modal after selection
    this.closeModal(modal);
  }

  get groupByFormatControl3(): FormControl {
    return this.createKPIWidget3.get('groupByFormat') as FormControl; // Cast to FormControl
  }








  async fetchLiveContractlookup(sk: any): Promise<void> {
    try {
      const response = await this.api.GetMaster(this.SK_clientID + "#Live Contract#lookup", sk);

      // Check if the response contains the expected options
      if (response && response.options) {
        let data;
        // Parse the options if it's a string
        if (typeof response.options === 'string') {
          try {
            data = JSON.parse(response.options);
            //console.log("Parsed data =", data);

            // Validate if parsed data is an array
            if (Array.isArray(data)) {
              for (let index = 0; index < data.length; index++) {
                const element = data[index];
                //console.log("Processing element:", element);

                this.lookupId = element[0];
                //console.log('Original lookupId:', this.lookupId);

                // Split the lookupId to get the numeric part
                const splitLookupId = this.lookupId.split('#')[1];
                //console.log('Split lookupId (numeric part):', splitLookupId);
                this.fetchLiveContractMain(1, splitLookupId)

                // You can now use splitLookupId as needed
              }

              // Continue fetching recursively for the next `sk`
              await this.fetchLiveContractlookup(sk + 1);
            } else {
              console.error('Parsed data is not an array.');
            }
          } catch (parseError) {
            console.error('Error parsing response.options:', parseError);
          }
        } else {
          console.error('response.options is not a string.');
        }
      } else {
        //console.log('No more options to fetch or invalid response. Stopping recursion.');
        // Stop recursion if response.options is not available
      }
    } catch (error) {
      console.error('Error during API call:', error);
      // Handle the error appropriately
    }
  }



  async fetchContractOrderMasterlookup(sk: any): Promise<void> {
    try {
      const response = await this.api.GetMaster(this.SK_clientID + "#Contract Order Master#lookup", sk);

      // Check if the response contains the expected options
      if (response && response.options) {
        let data;
        // Parse the options if it's a string
        if (typeof response.options === 'string') {
          try {
            data = JSON.parse(response.options);
            //console.log("Parsed data contract order master", data);

            // Validate if parsed data is an array
            if (Array.isArray(data)) {
              for (let index = 0; index < data.length; index++) {
                const element = data[index];
                //console.log("Processing element:", element);
                this.contractLookupId = element[0]
                const splitContractLookupId = this.contractLookupId.split('#')[1];
                //console.log('Split lookupId (numeric part):', splitContractLookupId);
                this.fetchContractOrderMasterMain(1, splitContractLookupId)

                // Process the element as needed
              }

              // Continue fetching recursively for the next `sk`
              await this.fetchContractOrderMasterlookup(sk + 1);
            } else {
              console.error('Parsed data is not an array.');
            }
          } catch (parseError) {
            console.error('Error parsing response.options:', parseError);
          }
        } else {
          console.error('response.options is not a string.');
        }
      } else {
        //console.log('No more options to fetch or invalid response. Stopping recursion.');
        // Stop recursion if response.options is not available
      }
    } catch (error) {
      console.error('Error during API call:', error);
      // Handle the error appropriately
    }
  }


  async fetchLiveContractMain(sk: any, splitLookupId: any): Promise<void> {
    try {
      const result: any = await this.api.GetMaster(this.SK_clientID + "#Live Contract#" + splitLookupId + "#main", 1);
      if (result) {
        const helpherObj = JSON.parse(result.metadata);
        //console.log('helpherObj checking ', helpherObj)

      }
    } catch (err) {
      //console.log("Error fetching the dynamic form data", err);
    }
  }

  async fetchContractOrderMasterMain(sk: any, splitContractLookupId: any): Promise<void> {
    try {
      const result: any = await this.api.GetMaster(this.SK_clientID + "#Contract Order Master#" + splitContractLookupId + "#main", 1);
      if (result) {
        const helpherObj = JSON.parse(result.metadata);
        //console.log('helpherObj checking contract order ', helpherObj)

      }
    } catch (err) {
      //console.log("Error fetching the dynamic form data", err);
    }
  }

  modeMessage: string = 'View Mode'; 
  toggleMode(): void {
    //console.log('Current Mode (Before Toggle):', this.isEditModeView ? 'Edit Mode' : 'View Mode');
  
    // Show spinner while toggling mode
    this.spinner.show();
    setTimeout(() => {
      this.spinner.hide();
    }, 1000);
  
    // Check permission to toggle mode
    if (!this.summaryDashboardUpdate) {
      console.warn('Update permission is false. Staying in View Mode.');
      this.isEditModeView = false;  // Ensure grid stays in View Mode if update permission is false
      this.updateOptions();  // Reflect the correct mode in options
      return;
    }
  
    // If the user has the necessary permission, toggle the mode
    this.isEditModeView = !this.isEditModeView;
    this.setModeMessage();
    this.updateOptions(); 
    this.setCheck(!this.isEditModeView);  // Update grid options based on mode
  
    //console.log('Current Mode (After Toggle):', this.isEditModeView );
  
    // Store the mode in localStorage
    localStorage.setItem('editModeState', this.isEditModeView.toString());
  }
  
  setModeMessage() {
    this.modeMessage = !this.isEditModeView ? 'Widgets Edit Mode' : 'View Mode';
  }

  get gridsterStyles() {
    // //console.log('this.check i am checking',this.check)
    // Check the value of `check` and update the background color accordingly
    const backgroundColor = this.check ? '#333333' : '#FFFFFF';  // Gray if check is true, White if false
    
    return `
      background: ${backgroundColor} !important;
      border-radius: 5px !important;
      padding: 0px !important;
    `;
  }
  
  check: boolean = false;
  setCheck(receiveCheck?: any) {
    if (receiveCheck !== undefined && receiveCheck !== null) {
      this.check = receiveCheck;  // Use the provided `receiveCheck` value
    } else {
      this.check = this.isEditModeView ? true : false;  // Fallback to the state of `isEditModeView`
    }
    //console.log('Checking icon view:', this.check);
  }
  
  
  // gridTitle: { cols: number; rows: number; y: number; x: number; themeColor: string }[] = [
  //   { cols: 2, rows: 1, y: 0, x: 0, themeColor: '#3498db' },
  //   { cols: 2, rows: 1, y: 0, x: 2, themeColor: '#e74c3c' },
  // ];

  applyTheme() {
    const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    //console.log('isDarkMode',isDarkMode)
    const root = document.documentElement;

    if (isDarkMode) {
      this.renderer.setProperty(root, 'style', '--bs-app-bg-color: #f5e6cc'); // Cream for Dark Mode
    } else {
      this.renderer.setProperty(root, 'style', '--bs-app-bg-color: #3a3a3a'); // Dark Gray for Light Mode
    }
  }
  updateCustomLabel(event: Event): void {
    const inputValue = (event.target as HTMLElement).innerText;

    // Update the form control value without triggering Angular's change detection unnecessarily
    this.createTitle.patchValue({ customLabel: inputValue }, { emitEvent: false });
  }
  openKPIModal(KPIModal: TemplateRef<any>,modal: any) {
    this.modalService.open(KPIModal, {       modalDialogClass: 'p-9',
      centered: true,
      fullscreen: true,
      backdrop: 'static',  // Disable closing on backdrop click
      keyboard: false   });
    modal.dismiss();
  }

  openKPIModal1(KPIModal1: TemplateRef<any>, modal: any) {
    this.modalService.open(KPIModal1, {
      modalDialogClass: 'p-9',
      centered: true,
      fullscreen: true,
      backdrop: 'static',  // Disable closing on backdrop click
      keyboard: false      // Disable closing on escape key
    });
  
    // Dismiss the modal from outside (not triggering backdrop click)
    modal.dismiss();
  }
  
  openKPIModal2(KPIModal2: TemplateRef<any>,modal:any) {
  
    this.modalService.open(KPIModal2, {  modalDialogClass:'p-9',  centered: true ,  fullscreen: true,   backdrop: 'static',  // Disable closing on backdrop click
      keyboard: false  });
    modal.dismiss();
 

  }
  openKPIModal3(KPIModal3: TemplateRef<any>,modal:any) {
    this.modalService.open(KPIModal3, {  modalDialogClass:'p-9',  centered: true ,  fullscreen: true,   backdrop: 'static',  // Disable closing on backdrop click
      keyboard: false  });
    modal.dismiss();
  }
  openKPIModal4(KPIModal4: TemplateRef<any>,modal:any) {
    this.modalService.open(KPIModal4, {  modalDialogClass:'p-9',  centered: true ,  fullscreen: true,   backdrop: 'static',  // Disable closing on backdrop click
      keyboard: false  });
    modal.dismiss();
  }
  opentileWithIcon(tileWithIconModal: TemplateRef<any>,modal:any) {
    this.modalService.open(tileWithIconModal, {  modalDialogClass:'p-9',  centered: true ,  fullscreen: true,   backdrop: 'static',  // Disable closing on backdrop click
      keyboard: false  });
    modal.dismiss();
  }

  
  openKPIModal5(KPIModal5: TemplateRef<any>,modal:any) {
    this.modalService.open(KPIModal5, {  modalDialogClass:'p-9',  centered: true ,  fullscreen: true,   backdrop: 'static',  // Disable closing on backdrop click
      keyboard: false  });
    modal.dismiss();
  }
  openTitleModal(TitleModal: TemplateRef<any>,modal:any) {
    this.modalService.open(TitleModal, {  modalDialogClass:'p-9',  centered: true ,  fullscreen: true,   backdrop: 'static',  // Disable closing on backdrop click
      keyboard: false  });
    modal.dismiss();
  }


  openProgressModal(ProgressTileModal: TemplateRef<any>,modal:any) {
    this.modalService.open(ProgressTileModal, {  modalDialogClass:'p-9',  centered: true ,  fullscreen: true,   backdrop: 'static',  // Disable closing on backdrop click
      keyboard: false  });
    modal.dismiss();
  }
  openChartModal1(ChartModal1: TemplateRef<any>,modal:any) {
    this.modalService.open(ChartModal1, {  modalDialogClass:'p-9',  centered: true ,  fullscreen: true,   backdrop: 'static',  // Disable closing on backdrop click
      keyboard: false  });
    modal.dismiss();
  }


  openFunnelChartModal1(FunnelChartModal: TemplateRef<any>,modal:any) {
    this.modalService.open(FunnelChartModal, {  modalDialogClass:'p-9',  centered: true ,  fullscreen: true,   backdrop: 'static',  // Disable closing on backdrop click
      keyboard: false  });
    modal.dismiss();
  }


  openChartModal2(ChartModal2: TemplateRef<any>,modal:any) {
    this.modalService.open(ChartModal2, {  modalDialogClass:'p-9',  centered: true ,  fullscreen: true,   backdrop: 'static',  // Disable closing on backdrop click
      keyboard: false  });
    modal.dismiss();
  }

  openChartModal3(ChartModal3: TemplateRef<any>,modal:any) {
    this.modalService.open(ChartModal3, {  modalDialogClass:'p-9',  centered: true ,  fullscreen: true,   backdrop: 'static',  // Disable closing on backdrop click
      keyboard: false  });
    modal.dismiss();
  }


  openMixedChartModal(MixedChartModal: TemplateRef<any>,modal:any) {
    this.modalService.open(MixedChartModal, {  modalDialogClass:'p-9',  centered: true ,  fullscreen: true,   backdrop: 'static',  // Disable closing on backdrop click
      keyboard: false  });
    modal.dismiss();
  }


  opensemiDonutChartModal(semiDonutModal: TemplateRef<any>,modal:any){
    this.modalService.open(semiDonutModal, {  modalDialogClass:'p-9',  centered: true ,  fullscreen: true,   backdrop: 'static',  // Disable closing on backdrop click
      keyboard: false  });
    modal.dismiss();

  }
  openChartModal4(ChartModal4: TemplateRef<any>,modal:any) {
    this.modalService.open(ChartModal4, {  modalDialogClass:'p-9',  centered: true ,  fullscreen: true,   backdrop: 'static',  // Disable closing on backdrop click
      keyboard: false  });
    modal.dismiss();
  }

  openChartModal5(ChartModal5: TemplateRef<any>,modal:any) {
    this.modalService.open(ChartModal5, {  modalDialogClass:'p-9',  centered: true ,  fullscreen: true,   backdrop: 'static',  // Disable closing on backdrop click
      keyboard: false  });
    modal.dismiss();
  }


  openpieChartModal(pieChartModal: TemplateRef<any>,modal:any) {
    this.modalService.open(pieChartModal, {  modalDialogClass:'p-9',  centered: true ,  fullscreen: true,   backdrop: 'static',  // Disable closing on backdrop click
      keyboard: false  });
    modal.dismiss();
  }

  openStackedChartModal(stackedBarChartModal: TemplateRef<any>,modal:any) {
    this.modalService.open(stackedBarChartModal,{  modalDialogClass:'p-9',  centered: true ,  fullscreen: true,   backdrop: 'static',  // Disable closing on backdrop click
      keyboard: false  });
    modal.dismiss();
  }

  opengaugeChartModal(gaugeChartModal: TemplateRef<any>,modal:any) {
    this.modalService.open(gaugeChartModal,{  modalDialogClass:'p-9',  centered: true ,  fullscreen: true,   backdrop: 'static',  // Disable closing on backdrop click
      keyboard: false  });
    modal.dismiss();
  }



  



  
  openCloneDashboard(stepperModal: TemplateRef<any>,modal:any) {
    this.modalService.open(stepperModal, {   backdrop: 'static',  // Disable closing on backdrop click
      keyboard: false    });
    modal.dismiss();
  }
  openDynamicTileModal(DynamicTileModal:TemplateRef<any>,modal:any){
    this.modalService.open(DynamicTileModal, {  modalDialogClass:'p-9',  centered: true ,  fullscreen: true,   backdrop: 'static',  // Disable closing on backdrop click
      keyboard: false  });
    modal.dismiss();

  }
  openHTMLModalTile(htmlTileModal:TemplateRef<any>,modal:any){
    this.modalService.open(htmlTileModal, {  modalDialogClass:'p-9',  centered: true ,  fullscreen: true,   backdrop: 'static',  // Disable closing on backdrop click
      keyboard: false  });
    modal.dismiss();

  }
  openimageModal(imageModal:TemplateRef<any>,modal:any){
    this.modalService.open(imageModal, {  modalDialogClass:'p-9',  centered: true ,  fullscreen: true,   backdrop: 'static',  // Disable closing on backdrop click
      keyboard: false  });
    modal.dismiss();

  }


  

  openFilterModal(FilterModal:TemplateRef<any>,modal:any){
    this.modalService.open(FilterModal, {  modalDialogClass:'p-9',  centered: true ,  fullscreen: true,   backdrop: 'static',  // Disable closing on backdrop click
      keyboard: false  });
    modal.dismiss();

  }
  openTableModal(tableModal:TemplateRef<any>,modal:any){
    this.modalService.open(tableModal,{  modalDialogClass:'p-9',  centered: true ,  fullscreen: true,   backdrop: 'static',  // Disable closing on backdrop click
      keyboard: false  });
    modal.dismiss();

  }
  openMapModal(MapModal:TemplateRef<any>,modal:any){
    this.modalService.open(MapModal, {  modalDialogClass:'p-9',  centered: true ,  fullscreen: true,   backdrop: 'static',  // Disable closing on backdrop click
      keyboard: false  });
    modal.dismiss();

  }
  openMultiTableModal(MultiTableModal:TemplateRef<any>,modal:any){
    this.modalService.open(MultiTableModal, {  modalDialogClass:'p-9',  centered: true ,  fullscreen: true,   backdrop: 'static',  // Disable closing on backdrop click
      keyboard: false  });
    modal.dismiss();

  }

  refreshHelper(data:any){
    if(data){
      // setTimeout(() => {
        
   
      // }, 1000);

    }

  }
  helperInfo(event: any, templateref: any) {
    //console.log('event checking', event);
    this.modalService.open(templateref, {  modalDialogClass:'p-9',  centered: true ,  fullscreen: true,   backdrop: 'static',  // Disable closing on backdrop click
      keyboard: false  });
  
    setTimeout(() => {
      this.emitEvent = event;
      this.cdr.detectChanges();  // Detect changes after the modal is open
    }, 500);
  }
  
  helperminiTableData(helperminiTableData:any){
    //console.log('event checking mini table',helperminiTableData)

    this.miniTableData = helperminiTableData
    



    


  }


  miniTableDataReceive(receiveData:any){

      //console.log('this.miniTableData checking mini table',this.minitableDataTile1)
      


  }

  miniTableDataReceiveChart1(receiveData:any){

    //console.log('this.miniTableData checking mini table',this.minitableDataChart1)
    


}
  helperForName(receiveFormName:any){
    this.FormNameMini = receiveFormName

  }

  helperChartClick(event:any,modalChart:any){
  
 
    //console.log('event checking:', event);
    //console.log('modalChart reference:', modalChart);
    //console.log('this.chartDataConfigExport check from chart3', this.chartDataConfigExport);
  
  
    // ✅ Step 1: Check if modal opening is manually stopped
    if (this.preventModalOpening) {
        //console.log("🚫 Modal opening is manually disabled. Not opening modal.");
        return;
    }
  
    // ✅ Step 2: Ensure this.chartDataConfigExport exists and is an object
    if (!this.chartDataConfigExport || typeof this.chartDataConfigExport !== 'object') {
        //console.log("❌ chartDataConfigExport is undefined or not an object, not opening the modal.");
        return;
    }
  
    // ✅ Step 3: Extract columnVisibility safely
    const columnVisibility = this.chartDataConfigExport.columnVisibility;
    //console.log('columnVisibility checking',columnVisibility)
    const columnVisibilityRead = columnVisibility
    //console.log('columnVisibilityRead checki',columnVisibilityRead)
  
    // ✅ Step 4: Ensure columnVisibility exists and has values
    if (!Array.isArray(columnVisibilityRead) || columnVisibilityRead.length === 0) {
        //console.log("❌ columnVisibility is empty or not an array, modal will NOT open.");
        return;
    }else if(this.isEditModeView == true){
      //console.log('this.isEditModeView checking chart3', this.isEditModeView);
      setTimeout(() => {
        this.modalService.open(modalChart, {  modalDialogClass:'p-9',  centered: true ,  fullscreen: true,   backdrop: 'static',  // Disable closing on backdrop click
          keyboard: false  });
      }, 500);
   
    }
  
    //console.log("✅ columnVisibility has data, opening modal...");
  
    // ✅ Step 5: Try to open the modal
    try {
  
    } catch (error) {
        console.error("❌ Error opening modal:", error);
    }
  }



  helperStackedChartClick(event:any,modalChart:any){
  
 
    //console.log('event checking:', event);
    //console.log('modalChart reference:', modalChart);
    //console.log('this.chartDataConfigExport check:', this.chartDataConfigExport);
  
  
    // ✅ Step 1: Check if modal opening is manually stopped
    if (this.preventModalOpening) {
        //console.log("🚫 Modal opening is manually disabled. Not opening modal.");
        return;
    }
  
    // ✅ Step 2: Ensure this.chartDataConfigExport exists and is an object
    if (!this.chartDataConfigExport || typeof this.chartDataConfigExport !== 'object') {
        //console.log("❌ chartDataConfigExport is undefined or not an object, not opening the modal.");
        return;
    }
  
    // ✅ Step 3: Extract columnVisibility safely
    const columnVisibility = this.chartDataConfigExport.columnVisibility;
    //console.log('columnVisibility checking',columnVisibility)
    const columnVisibilityRead = columnVisibility
    //console.log('columnVisibilityRead checki',columnVisibilityRead)
  
    // ✅ Step 4: Ensure columnVisibility exists and has values
    if (!Array.isArray(columnVisibilityRead) || columnVisibilityRead.length === 0) {
        //console.log("❌ columnVisibility is empty or not an array, modal will NOT open.");
        return;
    }else if(this.isEditModeView == true){
      //console.log('this.isEditModeView checking chart3', this.isEditModeView);
      setTimeout(() => {
        this.modalService.open(modalChart, {  modalDialogClass:'p-9',  centered: true ,  fullscreen: true,   backdrop: 'static',  // Disable closing on backdrop click
          keyboard: false  });
      }, 500);
   
    }
  
    //console.log("✅ columnVisibility has data, opening modal...");
  
    // ✅ Step 5: Try to open the modal
    try {
  
    } catch (error) {
        console.error("❌ Error opening modal:", error);
    }
  }
// Class-level variable to store chart data


// Function to capture the emitted chart data
emitchartDatatable(configChartTable: any) {
    //console.log('configChartTable', configChartTable);
    this.chartDataConfigExport = configChartTable;
}

// Function to open the modal if columnVisibility is not empty
helperChartClickChart1(event: any, modalChart: any) {
  //console.log('this.assignGridMode from chartDrill', this.assignGridMode);
  //console.log('this.isEditModeView checking chart1', this.isEditModeView);
  //console.log('event checking:', event);
  //console.log('modalChart reference:', modalChart);
  //console.log('this.chartDataConfigExport check:', this.chartDataConfigExport);

  // ✅ Step 1: Check if modal opening is manually stopped
  if (this.preventModalOpening) {
    //console.log("🚫 Modal opening is manually disabled. Not opening modal.");
    return;
  }

  // ✅ Step 2: Ensure chartDataConfigExport exists and is an object
  if (!this.chartDataConfigExport || typeof this.chartDataConfigExport !== 'object') {
    //console.log("❌ chartDataConfigExport is undefined or not an object, not opening the modal.");
    return;
  }

  // ✅ Step 3: Extract columnVisibility safely
  const columnVisibility = this.chartDataConfigExport.columnVisibility;
  //console.log('columnVisibility checking', columnVisibility);
  
  if (!Array.isArray(columnVisibility) || columnVisibility.length === 0) {
    //console.log("❌ columnVisibility is empty or not an array, modal will NOT open.");
    return;
  }

  const columnVisibilityRead = columnVisibility[0]?.columnVisibility;
  //console.log('columnVisibilityRead check:', columnVisibilityRead);

  if (!Array.isArray(columnVisibilityRead) || columnVisibilityRead.length === 0) {
    //console.log("❌ columnVisibilityRead is empty or not an array, modal will NOT open.");
    return;
  }

  // ✅ Step 4: Ensure modalChart is not undefined before opening modal
  if (!modalChart) {
    //console.log("❌ Modal reference is undefined, cannot open modal.");
    return;
  }

  if (this.isEditModeView === true) {

    //console.log('this.assignGridMode checking',this.assignGridMode)
    //console.log('this.isEditModeView checking',this.isEditModeView)
    //console.log("✅ columnVisibility has data, opening modal...");
    setTimeout(() => {
      this.modalService.open(modalChart, {  modalDialogClass:'p-9',  centered: true ,  fullscreen: true,   backdrop: 'static',  // Disable closing on backdrop click
        keyboard: false  });
    }, 500);
    


  }
}





helperChartClickFunnel(event: any, modalChart: any) {
  //console.log('this.assignGridMode from chartDrill', this.assignGridMode);
  //console.log('this.isEditModeView checking chart1', this.isEditModeView);
  //console.log('event checking:', event);
  //console.log('modalChart reference:', modalChart);
  //console.log('this.chartDataConfigExport check:', this.chartDataConfigExport);

  // ✅ Step 1: Check if modal opening is manually stopped
  if (this.preventModalOpening) {
    //console.log("🚫 Modal opening is manually disabled. Not opening modal.");
    return;
  }

  // ✅ Step 2: Ensure chartDataConfigExport exists and is an object
  if (!this.chartDataConfigExport || typeof this.chartDataConfigExport !== 'object') {
    //console.log("❌ chartDataConfigExport is undefined or not an object, not opening the modal.");
    return;
  }

  // ✅ Step 3: Extract columnVisibility safely
  const columnVisibility = this.chartDataConfigExport.columnVisibility;
  //console.log('columnVisibility checking', columnVisibility);
  
  if (!Array.isArray(columnVisibility) || columnVisibility.length === 0) {
    //console.log("❌ columnVisibility is empty or not an array, modal will NOT open.");
    return;
  }

  const columnVisibilityRead = columnVisibility[0]?.columnVisibility;
  //console.log('columnVisibilityRead check:', columnVisibilityRead);

  if (!Array.isArray(columnVisibilityRead) || columnVisibilityRead.length === 0) {
    //console.log("❌ columnVisibilityRead is empty or not an array, modal will NOT open.");
    return;
  }

  // ✅ Step 4: Ensure modalChart is not undefined before opening modal
  if (!modalChart) {
    //console.log("❌ Modal reference is undefined, cannot open modal.");
    return;
  }

  if (this.isEditModeView === true) {

    //console.log('this.assignGridMode checking',this.assignGridMode)
    //console.log('this.isEditModeView checking',this.isEditModeView)
    //console.log("✅ columnVisibility has data, opening modal...");
    setTimeout(() => {
      this.modalService.open(modalChart, {  modalDialogClass:'p-9',  centered: true ,  fullscreen: true,   backdrop: 'static',  // Disable closing on backdrop click
        keyboard: false  });
    }, 500);
    


  }
}






  helperChartClickChart2(event:any,modalChart:any){
    //console.log('event checking:', event);
    //console.log('modalChart reference:', modalChart);
    //console.log('this.chartDataConfigExport check:', this.chartDataConfigExport);
  
    // ✅ Step 1: Check if modal opening is manually stopped
    if (this.preventModalOpening) {
        //console.log("🚫 Modal opening is manually disabled. Not opening modal.");
        return;
    }
  
    // ✅ Step 2: Ensure this.chartDataConfigExport exists and is an object
    if (!this.chartDataConfigExport || typeof this.chartDataConfigExport !== 'object') {
        //console.log("❌ chartDataConfigExport is undefined or not an object, not opening the modal.");
        return;
    }
  
    // ✅ Step 3: Extract columnVisibility safely
    const columnVisibility = this.chartDataConfigExport.columnVisibility;
    //console.log('columnVisibility checking',columnVisibility)
    const columnVisibilityRead = columnVisibility[0].columnVisibility
    //console.log('columnVisibilityRead checki',columnVisibilityRead)
  
    // ✅ Step 4: Ensure columnVisibility exists and has values
    if (!Array.isArray(columnVisibilityRead) || columnVisibilityRead.length === 0) {
        //console.log("❌ columnVisibility is empty or not an array, modal will NOT open.");
        return;
    }else if(this.isEditModeView == true){
      setTimeout(() => {
        this.modalService.open(modalChart, {  modalDialogClass:'p-9',  centered: true ,  fullscreen: true,   backdrop: 'static',  // Disable closing on backdrop click
          keyboard: false  });
      }, 500);

    }
  
    //console.log("✅ columnVisibility has data, opening modal...");
  
    // ✅ Step 5: Try to open the modal
    try {
  
    } catch (error) {
        console.error("❌ Error opening modal:", error);
    }
  }
  helperRow(rowDynamic:any){
    //console.log('rowDynamic checking',rowDynamic)
    this.sendRowDynamic = rowDynamic
    //console.log('this.sendRowDynamic',this.sendRowDynamic)

  }

  async fetchUserPermissions(sk: any): Promise<{ permissionId: any; readFilterEquationawait: any } | null> {
    try {
        this.userdetails = this.getLoggedUser.username;
        this.userClient = `${this.userdetails}#user#main`;
        //console.log("this.tempClient from form service check", this.userClient);

        // Fetch user permissions
        const permission = await this.api.GetMaster(this.userClient, sk);
        
        if (!permission) {
            console.warn("No permission data received.");
            return null; // Fix: Returning null instead of undefined
        }

        //console.log("Data checking from add form", permission);

        // Parse metadata
        const metadataString: string | null | undefined = permission.metadata;
        if (typeof metadataString !== "string") {
            console.error("Invalid metadata format:", metadataString);
            return null; // Fix: Ensuring the function returns a value
        }
        //console.log('metadataString checking for',metadataString)

        try {
            this.permissionsMetaData = JSON.parse(metadataString);
            //console.log("Parsed Metadata Object from location", this.permissionsMetaData);

            const permissionId = this.permissionsMetaData.permission_ID;
            //console.log("this.permissionIdRequest check from function", permissionId);
            this.permissionIdRequest = permissionId;

            // **Fix: Ensure fetchPermissionIdMain is awaited**
            const readFilterEquationawait = await this.fetchPermissionIdMain(1, permissionId);

            if (permissionId !== "All") {
                //console.log("Stored permission ID:", permissionId);
                this.loadData();
            

                this.spinner.hide('mainLoading')
            } else {
                this.userPermission = permissionId;

                this.isEditModeView = true
                this.updateOptions()
                //console.log("this.userPermission checking", this.userPermission);
                this.summaryDashboardUpdate = true;
                this.loadData();
                this.spinner.hide('mainLoading')
                //console.log("Permission ID is 'All', skipping action.");
            }

            // ✅ Fix: Always returning a valid object
            return { permissionId, readFilterEquationawait };

        } catch (error) {
            console.error("Error parsing JSON:", error);
            return null; // Fix: Ensuring return on JSON parsing failure
        }
    } catch (error) {
        console.error("Error fetching user permissions:", error);
        return null; // Fix: Ensuring return on outer try-catch failure
    }
}

  
  


  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;

    const menuCheckbox = document.querySelector('.myMenu-open') as HTMLInputElement;

    // Update the isMenuOpen flag
    if (menuCheckbox) {
      this.isMenuOpen = menuCheckbox.checked;
    }

    if (menuCheckbox && !target.closest('.myMenu')) {
      menuCheckbox.checked = false;
      this.isMenuOpen = false; // Menu is now collapsed

    }

    this.showMenuTemporarily();
    this.cdr.detectChanges();
  }

  // Detect scroll, touchstart, or mousemove events
  @HostListener('window:scroll', [])
  @HostListener('document:touchstart', ['$event'])
  @HostListener('document:mousemove', [])
  // @HostListener('document:keydown', ['$event']) // Listen for keyboard key presses
  @HostListener('document:wheel', ['$event']) // Listen for mouse wheel scroll
  onUserActivity(): void {
    this.showMenuTemporarily();
    this.cdr.detectChanges();
  }

  // Method to show menu temporarily and reset timer
  private showMenuTemporarily(): void {
    this.hideNavMenu = false; // Show the menu
    this.isFading = false; // Reset fading state
    this.resetInactivityTimer(); // Reset the timer
    this.cdr.detectChanges();
  }

  // Reset inactivity timer
  private resetInactivityTimer(): void {
    if (this.inactivityTimer) {
      clearTimeout(this.inactivityTimer);
    }

    // Start fading after 2 seconds
    setTimeout(() => {
      if (!this.isMenuOpen) {
        this.isFading = true; // Begin fade effect
        this.cdr.detectChanges();
      }
    }, 3000);

    // Hide menu after 5 seconds of inactivity only if the menu is collapsed
    this.inactivityTimer = setTimeout(() => {
      if (!this.isMenuOpen) {
        this.hideNavMenu = true;
        this.isFading = false; // Reset fading state
        this.cdr.detectChanges();
      }
    }, 5000);
  }
  getDimensions(item: any, index: any): string {
    if (this.isEditModeView) {
      return '';
    }
  
    const widthHeightMap: { [key: string]: { width?: number[], height?: number[] ,heightOffset:number,widthOffset:number} } = {
      tile: { width: this.tileWidth, height: this.tileHeight, heightOffset: 80, widthOffset: 30},
      tile2: { width: this.tile2Width, height: this.tile2Height, heightOffset: 80, widthOffset: 30},
   
      chart: { width: this.chartWidth, height: this.chartHeight, heightOffset: 10, widthOffset: 30  },
      Map: { width: this.mapWidth, height: this.mapHeight, heightOffset: 80, widthOffset: 30  },
      Linechart:{ width: this.chartWidth, height: this.chartHeight, heightOffset: 80, widthOffset: 30  },
      Columnchart:{ width: this.chartWidth, height: this.chartHeight, heightOffset: 80, widthOffset: 30  },
      dynamicTile:{ width: this.DynamicTileWidth, height: this.DynamicTileHeight, heightOffset: 80, widthOffset: 30  },
      TableWidget:{ width: this.tableWidth, height: this.tableHeight, heightOffset: 80, widthOffset: 30  },
      title:{ width: this.titleWidth, height: this.titleHeight, heightOffset: 80, widthOffset: 30  },
      HTMLtile:{width:this.HTMLtileWidth,  height:this.HTMLtileHeight, heightOffset: 80, widthOffset: 30  },
      filterTile:{width:this.filterTileWidth,height:this.filterTileHeight ,heightOffset: 80, widthOffset: 30 },
      Funnelchart:{width:this.chartWidth, height:this.chartHeight, heightOffset: 10, widthOffset: 30 },
      Barchart:{width:this.chartWidth, height:this.chartHeight, heightOffset: 10, widthOffset: 30 },
      Areachart:{width:this.chartWidth, height:this.chartHeight, heightOffset: 10, widthOffset: 30 },
      progressTile:{width:this.DynamicTileWidth, height:this.DynamicTileWidth, heightOffset: 10, widthOffset: 30 },
      tileWithIcon:{ width: this.tileWidth, height: this.tileHeight, heightOffset: 80, widthOffset: 30},
      semiDonut:{width:this.chartWidth, height:this.chartHeight, heightOffset: 10, widthOffset: 30 },
      Piechart:{ width: this.chartWidth, height: this.chartHeight, heightOffset: 10, widthOffset: 30  },
      Stackedchart:{ width: this.chartWidth, height: this.chartHeight, heightOffset: 10, widthOffset: 30  },
      dailChart:{width: this.chartWidth, height: this.chartHeight, heightOffset: 10, widthOffset: 30 }
 
      // filterTileHeight:any []=[];
      // filterTileWidth:any []=[];
     



 

    };

    const dimensions:any = widthHeightMap[item.grid_type] || { width: this.tileWidth, height: this.tileHeight };
    const width:any = dimensions.width?.[index] + dimensions.widthOffset;
    const height:any = dimensions.height?.[index] + dimensions.heightOffset;;

    return `width: ${width?.toFixed(2) ?? 'N/A'}px, height: ${height?.toFixed(2) ?? 'N/A'}px`;
  }

  addModal() {
   this.FilterTileConfigComponent.initializeTileFields()
   this.FilterTileConfigComponent.isEditMode =false;
  //  this.FilterTileConfigComponent.isEditMode =false;
  //  this.FilterTileConfigComponent.theme.selected
   this.cdr.detectChanges()

    // Get the modal element
    const modalElement = document.getElementById('filterDashModal');
    if (!modalElement) {
      console.error('Modal element not found!');
      return;
    }

    // Hide existing modal if open
    const existingModal = Modal.getInstance(modalElement);
    if (existingModal) {
      existingModal.hide();
    }

    modalElement.classList.add('p-9');  // For custom padding
  modalElement.classList.add('modal-dialog-centered');  // Center the modal
  modalElement.classList.add('modal-fullscreen'); 

    // Open the modal programmatically
    setTimeout(() => {
      const modalInstance = new Modal(modalElement); // Corrected import usage
      modalInstance.show();
    }, 100);
  }
  liveFilterConditions(eventFilterCon:any){
    //console.log('eventFilterCon check',eventFilterCon)
    this.eventFilterConditions = eventFilterCon




    
  }

  mainFilterConditions(receiveMainFilter:any){
    //console.log('receiveMainFilter checking',receiveMainFilter)
    this.mainFilterCon = receiveMainFilter

  }
  private apiUrl = 'https://iy5kihshy9.execute-api.ap-south-1.amazonaws.com/s1/crud';
  private headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'x-api-key': 'p2FIIEi4cA2unoJhRIA137vRdGEuJCCi5hV6Vc11'
  });


  // async readdataTableCellInfo(readData: any, modalref: any) {
  //   this.isLoading = true;
  //   this.spinner.show('FormView');
    
  //   //console.log('readData from parent:', readData);
  
  //   if (!readData?.data) {
  //     console.error('Invalid readData object:', readData);
  //     this.isLoading = false;
  //     this.spinner.hide('FormView');
  //     return;
  //   }
  
  //   let formId = readData.data.PK ? readData.data.PK.split("#")[1] || "" : "";
  //   //console.log('formId checking from dataTableCell', formId);
  
  //   // Wait for the blobUrl to be generated and accessible
  //   try {
  //     this.blobUrl = await this.blobService.createBlobUrl(formId);
  //   } catch (error) {
  //     console.error("Error generating blob URL:", error);
  //     this.isLoading = false;
  //     this.spinner.hide('FormView');
  //     return;
  //   }
  //   //console.log('this.blobUrl checking from summary', this.blobUrl);
  
  //   let SK = readData.data.SK;
  
  //   window.pk = `${this.SK_clientID}#${formId}#main`;
  //   window.sk = typeof SK === 'number' ? SK : Number(SK);
  
  //   //console.log('✅ Stored PK in window:', window.pk);
  //   //console.log('✅ Stored SK in window:', window.sk);
  
  //   // Update iframe src to blobUrl after generating it
  //   const iframe: any = document.querySelector("iframe");
  //   //console.log('iframe checking from summaryEngine',iframe)
  
  //   if (iframe) {
  //     iframe.src = this.blobUrl;  // Ensure iframe source is updated with blobUrl
  //     //console.log("✅ Iframe src updated:", iframe.src);
  //   } else {
  //     console.warn("⚠️ Iframe not found for updating src.");
  //   }
  
  //   // Check if iframe is available and post the message to iframe
  //   const iframeCheckInterval = setInterval(() => {
  //     let iframe: any = document.querySelector("iframe");
  
  //     // Check if iframe is ready and blobUrl is available
  //     if (iframe && iframe.contentWindow && this.blobUrl) {
  //       clearInterval(iframeCheckInterval); // Stop checking once iframe is found and contentWindow is accessible
  //       //console.log('✅ iframe.contentWindow is available');
  
  //       // Post the message to iframe if contentWindow is available
  //       iframe.contentWindow?.postMessage({
  //         pk: `${this.SK_clientID}#${formId}#main`,
  //         sk: typeof SK === 'number' ? SK : Number(SK),
  //         clientId: this.SK_clientID,
  //         loginDetail: this.getLoggedUser,
  //         blobUrl: this.blobUrl  // Include the blobUrl in the message
  //       }, "*");  // '*' means the message can be received from any origin. You can replace '*' with the specific iframe origin if needed.
        
  //       //console.log("✅ Sent PK, SK & blobUrl to iframe via postMessage");
  
  //     } else {
  //       console.warn("⚠️ iframe.contentWindow or blobUrl not available, retrying...");
  //     }
  //   }, 500);  // Check every 500ms (adjust as needed)
  
  //   // Increase timeout for retrying iframe availability (increase from 10 to 20 seconds)
  //   setTimeout(() => {
  //     clearInterval(iframeCheckInterval); // Stop checking after timeout
  //     console.error("⚠️ Timeout: iframe or blobUrl not available after retries.");
  //     this.isLoading = false;
  //     this.spinner.hide('FormView');
  //   }, 20000);  // Timeout after 20 seconds (increased)
  
  //   // Open modal after a short delay
  //   setTimeout(() => {
  //     this.modalService.open(modalref, {
  //       modalDialogClass: 'p-9',
  //       centered: true,
  //       fullscreen: true,
  //       backdrop: 'static',  // Disable closing on backdrop click
  //       keyboard: false
  //     });
  //   }, 1000);
  
  //   this.isLoading = false;
  //   this.spinner.hide('FormView');
  // }
  
  

  async readdataTableCellInfo(readData: any, modalref?: any) {
    await new Promise<void>((resolve) => {
      this.route.queryParams.subscribe((params) => {
        if (params['uID']) this.userId = params['uID'];
        if (params['pass']) this.userPass = params['pass'];
        resolve();
      });
    });
  
    const storePk = readData.data.PK;
    const formName = storePk.split('#')[1];
  
    const recordIdObj = {
      type: "view",
      fields: {},
      mainTableKey: JSON.stringify(readData.data.SK)
    };
  
    const jsonString = JSON.stringify(recordIdObj);
    const escapedString = `"${jsonString.replace(/"/g, '\\"')}"`;
    const encodedRecordId = encodeURIComponent(escapedString);
  
    // 🔐 Encrypt userId and pass
    const encryptedUserId = this.userId ? this.encryptValue(this.userId) : '';
    const encryptedPass = this.userPass ? this.encryptValue(this.userPass) : '';
  
    const queryString = `recordId=${encodedRecordId}&isFullScreen=true` +
      (encryptedUserId ? `&uID=${encryptedUserId}` : '') +
      (encryptedPass ? `&pass=${encryptedPass}` : '');
  
    const targetUrl = `/view-dreamboard/Forms/${formName}&${queryString}`;
    //console.log('Final Target URL:', targetUrl);
  
    if (this.userId && this.userPass) {
      this.iframeSafeUrl = targetUrl;
      this.modalService.open(modalref, {
        fullscreen: true,
        modalDialogClass: 'p-9',
        centered: true,
        backdrop: 'static',
        keyboard: false
      });
    } else {
      window.open(targetUrl, '_blank');
    }
  }
  
  // ✅ AES + URI Safe Encryption
  encryptValue(value: string): string {
    return encodeURIComponent(CryptoJS.AES.encrypt(value, this.SECRET_KEY).toString());
  }
  
  // ✅ Decryption (if needed on receiving side)
  decryptValue(encryptedValue: string): string {
    const bytes = CryptoJS.AES.decrypt(decodeURIComponent(encryptedValue), this.SECRET_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  }
  
  




receiveminiTableIcon(checkevent:any,modalref: any){
  //console.log('checkevent checking',checkevent)
  this.isLoading = true;

  this.spinner.show('FormView')
   
  this.minitableDataTile1 = checkevent


  setTimeout(() => {
    this.modalService.open(modalref,{  modalDialogClass:'px-9',  centered: true ,  fullscreen: true,   backdrop: 'static',  // Disable closing on backdrop click
      keyboard: false  });
  }, 500);

  this.isLoading = false;
  this.spinner.hide('FormView')

}

receiveminiTableChart1(checkevent:any,modalref: any){
  //console.log('checkevent checking',checkevent)
  this.isLoading = true;

  this.spinner.show('FormView')
   
  this.minitableDataChart1 = checkevent


  setTimeout(() => {
    this.modalService.open(modalref,{  modalDialogClass:'p-9',  centered: true ,  fullscreen: true,   backdrop: 'static',  // Disable closing on backdrop click
      keyboard: false  });
  }, 500);

  this.isLoading = false;
  this.spinner.hide('FormView')

}




receiveminiTableChart3(checkevent:any,modalref: any){
  //console.log('checkevent checking',checkevent)
  this.isLoading = true;

  this.spinner.show('FormView')
   
  this.minitableDataChart3 = checkevent


  setTimeout(() => {
    this.modalService.open(modalref,{  modalDialogClass:'p-9',  centered: true ,  fullscreen: true,   backdrop: 'static',  // Disable closing on backdrop click
      keyboard: false  });
  }, 500);

  this.isLoading = false;
  this.spinner.hide('FormView')

}


receiveminiTableStackedChart(checkevent:any,modalref: any){
  //console.log('checkevent checking',checkevent)
  this.isLoading = true;

  this.spinner.show('FormView')
   
  this.minitableDataStacked = checkevent


  setTimeout(() => {
    this.modalService.open(modalref,{  modalDialogClass:'p-9',  centered: true ,  fullscreen: true,   backdrop: 'static',  // Disable closing on backdrop click
      keyboard: false  });
  }, 500);

  this.isLoading = false;
  this.spinner.hide('FormView')

}

receiveminiTableFunnelChart(checkevent:any,modalref: any){
  //console.log('checkevent checking',checkevent)
  this.isLoading = true;

  this.spinner.show('FormView')
   
  this.minitableDataFunnelChart = checkevent


  setTimeout(() => {
    this.modalService.open(modalref,{  modalDialogClass:'p-9',  centered: true ,  fullscreen: true,   backdrop: 'static',  // Disable closing on backdrop click
      keyboard: false  });
  }, 500);

  this.isLoading = false;
  this.spinner.hide('FormView')

}


  
  fetchFormBuilderData(receiveValue:any){
    //console.log('receiveValue checking',receiveValue)

    this.api
    .GetMaster(`${this.SK_clientID}#dynamic_form#${receiveValue}#main`, 1)
    .then((result: any) => {
      if (result && result.metadata) {
        const parsedMetadata = JSON.parse(result.metadata);
       



        //console.log('Transformed dynamic parameters:', parsedMetadata);

        // Trigger change detection to update the view
        this.cdr.detectChanges();
      }
    })
    .catch((err) => {
      //console.log("Can't fetch", err);
    });

  }
  pinnedItems: Map<string, boolean> = new Map(); // Use Map instead of Set

  togglePin(item: any): void {
    //console.log('item checking togglePin', item);
  
    const itemId = item.P1; // Using P1 as the unique identifier
    if (!itemId) {
      console.error('No valid ID found for item:', item);
      return;
    }
  
    if (this.pinnedItems.has(itemId) && this.pinnedItems.get(itemId)) {
      this.pinnedItems.set(itemId, false);
      this.handleUnpin(item);
    } else {
      this.pinnedItems.set(itemId, true);
      this.handlePin(item);
    }
  
    this.savePinnedItems(); // Save to localStorage
  }
  
  // Load pinned items from localStorage
  loadPinnedItems(): void {
    const storedPinnedItems = localStorage.getItem('pinnedItems');
    if (storedPinnedItems) {
      this.pinnedItems = new Map(JSON.parse(storedPinnedItems));
    }
  }
  
  // Save pinned items to localStorage
  savePinnedItems(): void {
    localStorage.setItem('pinnedItems', JSON.stringify(Array.from(this.pinnedItems.entries())));
  }
  



  fetchSummaryDashboardConfig(dashboardId: any) {
    //console.log('dashboardId received', dashboardId);
  
    this.api
      .GetMaster(`${this.SK_clientID}#${dashboardId}#summary#main`, 1)
      .then((result: any) => {
        if (result && result.metadata) {
          const parsedMetadata = JSON.parse(result.metadata);
          this.summaryDashboardData = parsedMetadata;
          //console.log('summary dashboard Data', this.summaryDashboardData);
  
  
  
          // Export the data as a .json file
          this.exportToJson(this.summaryDashboardData,dashboardId);
        } else {
          //console.log('No data found');
        }
      })
      .catch((err) => {
        //console.log("Can't fetch", err);
      });
  }
  
  exportToJson(data: any,receiveId:any) {
    //console.log('exporting data checking',data)
    const jsonData = JSON.stringify(data, null, 4);  // Convert data to JSON with pretty formatting
  
    const blob = new Blob([jsonData], { type: 'application/json;charset=utf-8;' });  // Ensure UTF-8 encoding for the file
    const link = document.createElement('a');  // Create a download link
  
    // Ensure that the link is not opened by any browser, but triggered as a download
    if (link.download !== undefined) {
      // Create a URL for the Blob
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `${receiveId}.json`);  // Set the file name
      link.style.visibility = 'hidden';  // Make sure the link is not visible
      document.body.appendChild(link);  // Append the link to the body
  
      link.click();  // Trigger the download by simulating a click event
  
      document.body.removeChild(link);  // Clean up by removing the link from the DOM
      window.URL.revokeObjectURL(url);  // Release the object URL after the download
    } else {
      // Fallback for older browsers (though modern browsers should support Blob and download attributes)
      console.error('Download feature not supported in this browser.');
    }
  }
  
  
  onFileSelectedfromSystem(event: any,receiveKey:any): void {
    //console.log('receiveKey checking',receiveKey)
    const file = event.target.files[0]; // Get the first selected file

    if (file) {
      //console.log('File selected:', file);
      // You can process the file here
      // For example, reading the content of the file:
      this.readFileContent(file,receiveKey);
    } else {
      console.error('No file selected');
    }
  }
  readFileContent(file: File,receivedKey:any) {
    const reader = new FileReader();
  
    reader.onload = () => {
      const fileContent = reader.result as string; // Ensure the fileContent is treated as a string
  
      try {
        // Parse the file content to get a JavaScript object
        const parsedContent = JSON.parse(fileContent);
        //console.log('Parsed content:', parsedContent);
  
        // Exclude the specified properties: summaryID, summaryName, summaryDesc
        const { summaryID, summaryName, summaryDesc, ...filteredContent } = parsedContent;
  
        //console.log('Filtered content (without summaryID, summaryName, summaryDesc):', filteredContent);
        if(receivedKey=='onUpdateImport'){
          this.updateimporteddashboardData(filteredContent,'importUpdate')
        }else if(receivedKey=='onSaveImport'){
    this.createSummaryWithImportedData(filteredContent,'importUpdate')
        }
      
    
        


  
        // Now extract the grid_details
        // const extractGridDetails = filteredContent.grid_details;
  
        // // Log the grid_details
        // //console.log('Grid Details:', extractGridDetails);
  
        // // You can process the grid details here
        // // For example, you could do something like:
        // if (extractGridDetails && extractGridDetails.length > 0) {
        //   // Handle the grid details if available
        //   extractGridDetails.forEach((gridDetail: any, index: number) => {
        //     //console.log(`Grid Detail ${index + 1}:`, gridDetail);
        //   });
        // } else {
        //   //console.log('No grid details found in the file.');
        // }
  
      } catch (error) {
        console.error('Error parsing JSON:', error);
      }
    };
  
    reader.readAsText(file); // Read the file as text (ideal for JSON files)
  }
  

  updateimporteddashboardData(importData:any,key:any) {
    // if(key=='addPin'){
    //   this.PinCheck =pinValue
    //   //console.log('PinCheck from updateSummary',this.PinCheck)
    // }
  // //console.log('value checking summary',value)
  
  
    //console.log('this.getLoggedUser check update', this.getLoggedUser);
  
    // Extract username for later use
    this.extractUserName = this.getLoggedUser.username;
    //console.log('this.extractUserName checking', this.extractUserName);
  
    //console.log('all_Packet_store checking', this.all_Packet_store);
  
    // Construct allCompanyDetails if missing
    if (!this.allCompanyDetails) {
      this.allCompanyDetails = this.constructAllCompanyDetails();
      //console.log('Constructed allCompanyDetails:', this.allCompanyDetails);
    }
  
    // Only populate missing fields to avoid overwriting existing values
    if (this.all_Packet_store) {
      this.allCompanyDetails = {
        ...this.allCompanyDetails, // Preserve existing data
        summaryID: this.allCompanyDetails.summaryID || this.all_Packet_store.summaryID,
        summaryName: this.allCompanyDetails.summaryName || this.all_Packet_store.summaryName,
        summaryDesc: this.allCompanyDetails.summaryDesc || this.all_Packet_store.summaryDesc,
        iconObject: importData.iconObject ||'',
        LiveDashboard:importData.LiveDashboard ||'',
        fullScreenModeCheck:importData.fullScreenModeCheck ||'',
        // DashboardRestriction:importData.DashboardRestriction ||'',
      };
      //console.log('Updated allCompanyDetails with Packet Store:', this.allCompanyDetails);
    }
  
    // Ensure critical fields have default fallbacks without altering existing logic
    this.allCompanyDetails.summaryID = this.allCompanyDetails.summaryID ;
    this.allCompanyDetails.summaryName = this.allCompanyDetails.summaryName ;
    this.allCompanyDetails.summaryDesc = this.allCompanyDetails.summaryDesc ;
  
  
    //console.log('Final allCompanyDetails:', this.allCompanyDetails);
  
    // Enable summaryID field
    this.createSummaryField.get('summaryID')?.enable();
  
    // Format dashboard tiles
    this.formattedDashboard = this.formatDashboardTiles(importData.grid_details) || [];
    //console.log('Formatted Dashboard:', this.formattedDashboard);

  
    if (this.formattedDashboard.length === 0) {
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: 'At least 2 widgets are required for Summary Dashboard update.',
        showConfirmButton: false,
        timer: 1500
      });
      return; // Exit the function without performing validation
    }

  
  
  
    // Set timestamps and users
    const originalCreatedDate =
      this.allCompanyDetails.crDate || Math.ceil(new Date().getTime() / 1000);
    const originalCreatedUser =
      this.allCompanyDetails.createdUser || this.getLoggedUser.username;
  
      const updatedDate = Math.ceil(Date.now() / 1000);
  
    // Construct tempObj for validation and submission
    let serializedQueryParams = JSON.stringify(this.updatedQueryPramas);
  //console.log('Serialized Query Params:', serializedQueryParams);
    let tempObj = {
      PK: `${this.SK_clientID}#${this.allCompanyDetails.summaryID}#summary#main`,
      SK: 1,
      metadata: JSON.stringify({
        ...this.allCompanyDetails,
        grid_details: this.formattedDashboard,
      // Include params here
      }),
    };
  
    //console.log('TempObj being validated and submitted:', tempObj);
  
    // Validate and submit the object
    this.validateAndSubmit(tempObj, key);
  
    // Prepare items for fetchTimeMachineById
    const items = {
      P1: this.allCompanyDetails.summaryID ,
      P2: this.allCompanyDetails.summaryName,
      P3: this.allCompanyDetails.summaryDesc ,
      P4: updatedDate ,
      P5: originalCreatedDate ,
      P6: originalCreatedUser ,
      P7: this.extractUserName ,
      P8: this.previewObjDisplay ? JSON.stringify(this.previewObjDisplay) : '',
      P9: importData.iconSelect ,
      P10: importData.PinCheck ,
      P11:importData.fullScreenModeCheck ,
      // P12:importData.DashboardRestriction 
    };
    
  
    //console.log('Items prepared for fetchTimeMachineById:', items);
    const UserDetails = {
      "User Name": this.userdetails,
      "Action": "Updated",
      "Module Name": "Summary Dashboard",
      "Form Name": "Summary Dashboard",
      "Description": "Dashboard is Updated",
      "User Id": this.userdetails,
      "Client Id": this.SK_clientID,
      "created_time": Date.now(),
      "updated_time": Date.now()
    }
  
    this.auditTrail.mappingAuditTrailData(UserDetails,this.SK_clientID)
  
    // Trigger fetchTimeMachineById
    if (items.P1) {
      //console.log('check items inupdate',items)
      this.fetchTimeMachineById(1, items.P1, 'update', items);
    } else {
      console.warn('fetchTimeMachineById skipped: Missing summaryID (P1).');
    }
  
    // Trigger change detection
    this.cd.detectChanges();
  }


  createSummaryWithImportedData(importData:any,key:any){

    this.defaultValue = 'Tiles'
    if (this.isDuplicateID || this.isDuplicateName || this.createSummaryField.invalid) {
      return; // Prevent saving if there are errors
    }



    let tempClient = this.SK_clientID + "#summary" + "#lookup";
    //console.log('tempClient checking', tempClient);


    const createdDate = Math.ceil((new Date()).getTime() / 1000); // Created date
    const updatedDate = Math.ceil(Date.now() / 1000); // Updated date

    // Prepare summary details
    this.allCompanyDetails = {
      summaryID: this.createSummaryField.value.summaryID,
      summaryName: this.createSummaryField.value.summaryName,
      summaryDesc: this.createSummaryField.value.summarydesc,

      // jsonData: parsedJsonData,
      summaryIcon: this.createSummaryField.value.iconSelect,
      iconObject: this.previewObjDisplay,
      LiveDashboard:this.createSummaryField.value.LiveDashboard,
      fullScreenModeCheck:this.createSummaryField.value.fullScreenModeCheck,
      // DashboardRestriction:this.createSummaryField.value.DashboardRestriction,

      // Add the selected icon
      crDate: createdDate, // Created date
      upDate: updatedDate,  // Updated date
      createdUser: this.getLoggedUser.username, // Set the creator's username
      grid_details: importData.grid_details
    };

    //console.log("summary data ", this.allCompanyDetails);

    // Prepare ISO date strings
    const createdDateISO = new Date(this.allCompanyDetails.crDate * 1000).toISOString();
    const updatedDateISO = new Date(this.allCompanyDetails.upDate * 1000).toISOString();

    // Prepare tempObj for API call
    const tempObj = {
      PK: this.SK_clientID + "#" + this.allCompanyDetails.summaryID + "#summary" + "#main",
      SK: 1,
      metadata: JSON.stringify({
        summaryID: this.allCompanyDetails.summaryID,
        summaryName: this.allCompanyDetails.summaryName,
        summaryDesc: this.allCompanyDetails.summaryDesc,
        // jsonData: this.allCompanyDetails.jsonData,
        summaryIcon: this.createSummaryField.value.iconSelect,
        LiveDashboard:this.createSummaryField.value.LiveDashboard,
        fullScreenModeCheck:this.createSummaryField.value.fullScreenModeCheck,
        // DashboardRestriction:this.createSummaryField.value.DashboardRestriction,
        // Include selected icon in the metadata
        created: createdDateISO, // Created date in ISO format
        updated: updatedDateISO,   // Updated date in ISO format
        createdUser: this.allCompanyDetails.createdUser, // Use the persisted createdUser
        iconObject: this.allCompanyDetails.iconObject,
        tilesList:this.defaultValue ,
        grid_details:importData.grid_details,
        queryParams:[],


      })
    };
    // Now, patch the 'tilesList' form control after creating the summary
this.createSummaryField.patchValue({
  tilesList: this.defaultValue // Set the value to 'Widget'
});

    //console.log("TempObj is here ", tempObj);
    const temobj1: any = JSON.stringify(this.createSummaryField.value.iconSelect)
    // Prepare items for further processing
    //console.log("this.createSummaryField.value.iconSelec", this.createSummaryField.value.iconSelect)
    //console.log("temobj1", temobj1)
    const items = {
      P1: this.createSummaryField.value.summaryID,
      P2: this.createSummaryField.value.summaryName,
      P3: this.createSummaryField.value.summarydesc,
      P4: updatedDate,  // Updated date
      P5: createdDate,   // Created date
      P6: this.allCompanyDetails.createdUser,  // Created by user
      P7: this.getLoggedUser.username,          // Updated by user
      P8: JSON.stringify(this.previewObjDisplay) ||'',
      P9: this.createSummaryField.value.iconSelect, // Add selected icon
      P10:this.createSummaryField.value.PinCheck ||'',
      P11:this.createSummaryField.value.fullScreenModeCheck,
      // P12:this.createSummaryField.value.DashboardRestriction
    };
    //console.log('items checking from create Summary',items)

    // API call to create the summary
    this.api.CreateMaster(tempObj).then(async (value: any) => {
      await this.createLookUpSummary(items, 1, tempClient);

      this.datatableConfig = {};
      this.lookup_data_summary = [];

      //console.log('value check from create master', value);
      if (items || value) {
        //console.log('items check from create master', items);

        // Call the loadData function
        this.loadData();

        // Show a success alert and handle the "OK" button click
        Swal.fire({
          position: 'center', // Center the alert
          icon: 'success', // Alert type
          title: 'New summary successfully created', // Title text
          showConfirmButton: true, // Display the OK button
          confirmButtonText: 'OK', // Customize the OK button text
          allowOutsideClick: false, // Prevent closing the alert by clicking outside
        }).then((result) => {
          if (result.isConfirmed) {
            // This block is executed when the "OK" button is clicked
            if (items && items.P1) {
              this.dashboardOpen(items.P1);
       
          // Pass item.P1 to viewItem
            }
            if (this.modalRef) {
              this.modalRef.close(); // Close the modal
            }
          }
        });
      }

      else {
        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: 'Failed to create summary',
          showConfirmButton: false,
          timer: 1500
        });
      }

      const UserDetails = {
        "User Name": this.userdetails,
        "Action": "Created",
        "Module Name": "Summary Dashboard",
        "Form Name": "Summary Dashboard",
        "Description": "Dashboard is Created",
        "User Id": this.userdetails,
        "Client Id": this.SK_clientID,
        "created_time": Date.now(),
        "updated_time": Date.now()
      }

      this.auditTrail.mappingAuditTrailData(UserDetails,this.SK_clientID)

    }).catch(err => {
      //console.log('err for creation', err);
      this.toast.open("Error in adding new Summary Configuration ", "Check again", {
        duration: 5000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
      });
    });

  }


  filterDuplucateIds(routerId: any) {
    //console.log('dashboardId received', routerId);
  
    this.api
      .GetMaster(`${this.SK_clientID}#${routerId}#summary#main`, 1)
      .then((result: any) => {
        if (result && result.metadata) {
          const parsedMetadata = JSON.parse(result.metadata);
          this.summaryDashboardDataFetch = parsedMetadata;
          const extractGridDetails = this.summaryDashboardDataFetch.grid_details;
          //console.log('summary extractGridDetails', extractGridDetails);
  
          // Extract the IDs from grid details
          const ids = extractGridDetails.map((item: any) => item.id);
  
          // Check for duplicate IDs
          const duplicateIds = this.findDuplicates(ids);
          //console.log('duplicateIds checking', duplicateIds);
  
          // If duplicateIds contains undefined or is empty, don't show the alert
          const filteredDuplicates = duplicateIds.filter(id => id !== undefined && id !== null);
  
          // Only show the SweetAlert if duplicates are found (non-undefined)
          if (filteredDuplicates.length > 0) {
            Swal.fire({
              icon: 'error',
              title: 'Duplicate IDs Found',
              text: `The following IDs are duplicates: ${filteredDuplicates.join(', ')}`,
              position: 'top-end', // This positions the alert in the top right corner
              showConfirmButton: false,
              timer: 3000, // The alert will disappear after 3 seconds
            });
          } else {
            //console.log('No duplicates found or duplicates are undefined');
          }
  
        } else {
          //console.log('No data found');
        }
      })
      .catch((err) => {
        //console.log("Can't fetch", err);
      });
  }
  
  findDuplicates(arr: any[]) {
    const seen = new Set();
    const duplicates: any[] = [];
    arr.forEach((item) => {
      if (seen.has(item)) {
        duplicates.push(item);
      } else {
        seen.add(item);
      }
    });
    return duplicates;
  }
  
  
  
  
  // Helper function to find duplicates in an array

  


// fetchSummaryDashboardConfig(dashboardId: any) {
  
// }
checkLegendEnabled(item: any): string {
  try {
    // Check if the item is a chart type
    if (['chart', 'Linechart', 'Columnchart', 'Funnelchart'].includes(item.grid_type)) {
      // Parse the highchartsOptionsJson to get the options object
      const options = JSON.parse(item.highchartsOptionsJson);

      // Check if the legend is enabled
      if (options.legend && options.legend.enabled === true) {
        // If legends are enabled, apply the increase-height class
        return 'increase-height';
      } else {
        // If legends are not enabled, apply the chart1-style class
        return 'chart1-style';
      }
    } else {
      // If the item is not a chart, return an empty string to avoid applying any chart classes
      return '';
    }
  } catch (e) {
    console.error('Error parsing highchartsOptionsJson:', e);
    return '';
  }
}

currentPage = 1;
pageLength = 10;

changePage(page: number) {
  // //console.log('changePage checking', page);
  // this.currentPage = page;

  // const dtInstance = this.crudSummaryComp?.getDataTableInstance();
  // //console.log('dtInstance checking',dtInstance)

  // if (dtInstance) {
  //   dtInstance.page(page - 1).draw('page');
  // } else {
  //   console.warn('❌ DataTable instance is not initialized yet!');
  // }
}


onDatatableReady() {
  this.datatableReady = true;
  //console.log('✅ DataTable is initialized in child');
}

  
}



