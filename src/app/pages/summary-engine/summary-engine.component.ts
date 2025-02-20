import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, HostListener, inject, Injector, NgZone, OnDestroy, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { SharedService } from '../shared.service';
import { APIService } from 'src/app/API.service';
import { AbstractControl, FormControl, FormGroup, UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

import { Config } from 'datatables.net';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CompactType, DisplayGrid, GridsterConfig, GridsterItem, GridsterItemComponentInterface, GridType } from 'angular-gridster2';
import { ActivatedRoute, NavigationEnd, NavigationStart, Router } from '@angular/router';

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

import { Tooltip } from 'bootstrap';
import { Tile1ConfigComponent } from 'src/app/_metronic/partials/content/my-widgets/tile1-config/tile1-config.component';


import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Modal } from 'bootstrap';
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
import { HttpClient } from '@angular/common/http';
import { FilterTileConfigComponent } from 'src/app/_metronic/partials/content/my-widgets/filter-tile-config/filter-tile-config.component';
import { TableWidgetConfigComponent } from 'src/app/_metronic/partials/content/my-widgets/table-widget-config/table-widget-config.component';

import { AgGridAngular } from 'ag-grid-angular';
import { GridApi ,Column, ColDef} from 'ag-grid-community';
import { MapConfigComponent } from 'src/app/_metronic/partials/content/my-widgets/map-config/map-config.component';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MultiTableConfigComponent } from 'src/app/_metronic/partials/content/my-widgets/multi-table-config/multi-table-config.component';
import { AuditTrailService } from '../services/auditTrail.service';
import { HtmlTileConfigComponent } from 'src/app/_metronic/partials/content/my-widgets/html-tile-config/html-tile-config.component';

type Tabs = 'Board' | 'Widgets' | 'Datatype' | 'Settings' | 'Advanced' | 'Action';




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
  @ViewChild(Tile2ConfigComponent, { static: false }) tileConfig2Component: Tile2ConfigComponent;
  @ViewChild(Tile3ConfigComponent, { static: false }) tileConfig3Component!: Tile3ConfigComponent;

  @ViewChild(Tile4ConfigComponent, { static: false }) tileConfig4Component: Tile4ConfigComponent;
  @ViewChild(Tile5ConfigComponent, { static: false }) tileConfig5Component: Tile5ConfigComponent;
  @ViewChild(TitleConfigComponent, { static: false }) titleConfigComponent: TitleConfigComponent;
  @ViewChild(Tile6ConfigComponent, { static: false }) tileConfig6Component: Tile6ConfigComponent;
  @ViewChild(Chart1ConfigComponent, { static: false }) ChartConfig1Component: Chart1ConfigComponent;
  @ViewChild(Chart2ConfigComponent, { static: false }) ChartConfig2Component: Chart2ConfigComponent;
  @ViewChild(Chart3ConfigComponent, { static: false }) ChartConfig3Component: Chart3ConfigComponent;
  @ViewChild(Chart4ConfigComponent, { static: false }) ChartConfig4Component: Chart4ConfigComponent;
  @ViewChild(Chart5ConfigComponent, { static: false }) ChartConfig5Component: Chart5ConfigComponent;
  @ViewChild('summaryModal') summaryModal!: TemplateRef<any>;
  @ViewChild(DynamicTileConfigComponent, { static: false }) DynamicTileConfigComponent: DynamicTileConfigComponent;
  @ViewChild(CloneDashboardComponent, { static: false }) CloneDashboardComponent: CloneDashboardComponent;
  @ViewChild(FilterTileConfigComponent, { static: false }) FilterTileConfigComponent: FilterTileConfigComponent;
  @ViewChild(TableWidgetConfigComponent, { static: false }) TableWidgetConfigComponent: TableWidgetConfigComponent;
  @ViewChild(MapConfigComponent, { static: false }) MapConfigComponent: MapConfigComponent;
  @ViewChild(MultiTableConfigComponent, { static: false }) MultiTableConfigComponent: MultiTableConfigComponent;
  @ViewChild(HtmlTileConfigComponent, { static: false }) HtmlTileConfigComponent: HtmlTileConfigComponent;
  
  
 
  


  @ViewChild('tileModal', { static: true }) tileModal!: ElementRef<HTMLDivElement>;
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
  columnDefs: any;
  private gridApi!: GridApi;
  private gridColumnApi!: Column;
  columnApi: any;
  rowData: { location: string; 'text-1732683302774': string; '1732683476': string; }[];
  extractUserName: any;
  mapHeight: any[] = [];
  mapWidth: any[] = [];

  center: google.maps.LatLngLiteral = { lat: 20.5937, lng: 78.9629 };
  zoom = 5; // Adjust the zoom level

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

  userPermissions: boolean | undefined;
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


  createPieChart() {
    const chartOptions: any = {
      chart: {
        inverted: false,
        type: 'pie',
        // Set the chart height
      },
      title: {
        text: '',
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
  
  
  createLineChart(){

    const linechartOptions: any = {
      chart: {
        type: 'line' // Line chart type
    },
    title: {
        text: ''
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
    console.log('Grid API initialized:', this.gridApi); // Debugging
  }
  

  createBarChart() {
    const barchartOptions: any = {
      chart: {
        type: 'column'  // Change 'bar' to 'column' for vertical bars
      },
      title: {
        text: ''
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


  createAreaChart() {
    const areachartOptions: any = {
      chart: {
        type: 'area'
      },
      title: {
        text: ''
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
        text: ''
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
    //console.log('life obh',dialIDobj);


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
  isEditMode: boolean = false; // Initially set to false for add mode
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
 isFullscreen: boolean = false;
 isValidID: boolean = true;
 isDashboardConfigured: boolean = true;


  isFullScreen = false; // Track the fullscreen state

  isFullView = false;   // Track if the icon is in full view mode

  isLoading = false; // Add loading state
  @ViewChild('modalContent') modalContent!: TemplateRef<any>;
  iframeUrl!: SafeResourceUrl;

  reloadPage() {
    this.isLoading = true; // Set loading state to true
    console.log('this.routeId check', this.routeId);
    console.log('client id check', this.SK_clientID);
  this.spinner.show('dataProcess')
  console.log('permissionList',this.readFilterEquation)
  console.log('this.permissionsMetaData',this.permissionIdRequest)
  console.log('this.parsedPermission',this.parsedPermission)
  console.log('this.userdetails from request',this.userdetails)
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
  
    console.log('requestBody checking', requestBody);
  
    // Send a POST request to the Lambda function with the body
    this.http.post(apiUrl, requestBody).subscribe(
      (response) => {
        console.log('Lambda function triggered successfully:', response);
        
        const constLiveData = JSON.parse((response as any)?.body);
        console.log('constLiveData check',constLiveData)
        const processedData = constLiveData.Processed_Data.metadata.grid_details

        console.log('processedData check',processedData)
        this.liveDashboardDataFormat(processedData)



        this.spinner.hide('dataProcess')
        // Display SweetAlert success message
        // Swal.fire({
        //   title: 'Success!',
        //   text: 'Lambda function triggered successfully.',
        //   icon: 'success',
        //   confirmButtonText: 'OK'
        // });
  
        // Proceed with route parameter handling
        this.route.paramMap.subscribe(params => {
          this.routeId = params.get('id');
          if (this.routeId) {
            this.openModalHelpher(this.routeId);
            this.editButtonCheck = true;
          }
        });
  
        this.isLoading = false; // Reset loading state
      },
      (error) => {
        console.error('Error triggering Lambda function:', error);
  
        // Display SweetAlert error message
        Swal.fire({
          title: 'Error!',
          text: 'Failed to trigger the Lambda function. Please try again.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
  
        this.isLoading = false; // Reset loading state
      }
    );
  }
  
  setFullscreen(): void {
    localStorage.setItem('fullscreen', 'true');
    console.log('Fullscreen enabled');
}

liveDashboardDataFormat(processedData: any) {
  console.log('Processed Data:', processedData);

  let chartData: any = [];
  let tileData: any = [];
  let lineChart:any = [];
  let columnChart:any =[];
  let dynamicTile:any = [];
  let TableWidget:any =[];

  processedData.forEach((packet: any) => {
    switch (packet.grid_type) {
      case "chart":
     
        console.log("Matched Chart Packet:", packet);
        chartData.push(packet);
        console.log('chartData after push',chartData)
  

        this.liveDataChart = chartData

        break;
      case "tile":
        console.log("Matched Tile Packet:", packet);
 
        tileData.push(packet);
        console.log('tileData after push',tileData)
    

 
        this.liveDataTile = tileData
        console.log('this.liveDataTile chec',this.liveDataTile)
        break;
        case "Linechart":
          console.log("Matched Tile Packet:", packet);
   
          lineChart.push(packet);
          console.log('lineChart after push',lineChart)
      
  
   
          this.liveDataLineChart = lineChart
          console.log('this.liveDataLineChart chec',this.liveDataLineChart)
          break;
          case "Columnchart":
            console.log("Matched Tile Packet:", packet);
     
            columnChart.push(packet);
            console.log('columnChart after push',columnChart)
        
    
     
            this.liveDataColumnChart = columnChart
            console.log('this.liveDataLineChart chec',this.liveDataLineChart)
            break;
            case "dynamicTile":
              console.log("Matched Tile Packet:", packet);
       
              dynamicTile.push(packet);
              console.log('dynamicTile after push',dynamicTile)
          
      
       
              this.liveDataDynamicTile = dynamicTile
              console.log('this.liveDataLineChart chec',this.liveDataDynamicTile)
              break;


              case "TableWidget":
                console.log("Matched Tile Packet:", packet);
         
                TableWidget.push(packet);
                console.log('TableWidget after push',TableWidget)
            
        
         
                this.liveDataTableTile = TableWidget
                console.log('this.liveDataLineChart chec',this.liveDataTableTile)
                break;


              


            

          

      default:
        console.warn("Unknown grid type:", packet.grid_type, "Packet:", packet);
        break;
    }
  });

  console.log("Final Chart Data:", chartData);
  console.log("Final Tile Data:", tileData);

  return { chartData, tileData };
}


checkAndSetFullscreen(): void {
    const isFullscreen = localStorage.getItem('fullscreen') === 'true';
    console.log('isFullscreen check:', isFullscreen);

    // Update the fullscreen state and related flags
    this.isFullscreen = isFullscreen;
    this.hidingLink = isFullscreen;

    if (isFullscreen) {
        this.toggleFullScreenFullView(true); // Enter fullscreen directly
    } else {
        this.toggleFullScreenFullView(false); // Exit fullscreen
    }
}
invokeHelperDashboard(item: any, index: number, template: any,modaref:any): void {
  console.log('item check for switch case',item)
  const selectedType = item.selectType
  console.log('selectedType checking',selectedType)
  console.log('modaref check',modaref)




  // this.showDrillDownData(item)
  // this.redirectModule(item)
  
    this.currentModalIndex = index;
  
      this.currentItem = item
  
      console.log('item checking',item)
      switch (selectedType) {
        case 'drill down': // Assuming 'Drill Down' is the expected value for drill-down cases
        this.showDrillDownData(item,modaref);
        break;
        case 'NewTab':
          this.setModuleID(item, index, modaref);
          break;
        case 'Same page Redirect':
          this.setModuleID(item, index, modaref);
          break;
        case 'Modal':
          this.setModuleID(item, index, modaref);
          break;
    
  
          case '': // Assuming 'Drill Down' is the expected value for drill-down cases
          this.redirectModule(item);
          break;
    
        default:
          this.redirectModule(item); // Handle empty or undefined types
          break;
      }
  
      // this.setModuleID(item, index,modaref)
  
      const viewModeQP = true;
      const disableMenuQP = true;
  
  
      localStorage.setItem('viewMode', viewModeQP.toString());
      localStorage.setItem('disableMenu', disableMenuQP.toString());
      this.cdr.detectChanges()
      // this.modalService.open(template, {
      //   size: 'xl',
      //   backdrop: 'static',
      //   keyboard: false
      // });
  
  }


redirectModule(recieveItem: any) {
  console.log('recieveItem check', recieveItem);
  const moduleName = recieveItem.dashboardIds;
  console.log('moduleName checking',moduleName)
  let dashUrl = '/dashboard';
  let projecturl = '/project-dashboard';
  const selectedModule = recieveItem.ModuleNames;

  console.log("I am triggered here", selectedModule);


  switch (selectedModule) {
    case 'Dashboard - Group':
      this.redirectionURL = dashUrl;
      this.router.navigate([this.redirectionURL]).catch(err => console.error("Navigation error:", err));
      this.dynamicIDArray = [];
      break;
    case 'Project - Group':
      this.redirectionURL = projecturl;
      this.router.navigate([this.redirectionURL]).catch(err => console.error("Navigation error:", err));
      this.dynamicIDArray = [];
      break;
    case 'Forms':
      this.redirectionURL = `/view-dreamboard/Forms/${moduleName}`;
      this.router.navigate([this.redirectionURL]).catch(err => console.error("Navigation error:", err));
      break;
    case 'Summary Dashboard':
      this.redirectionURL = `/summary-engine/${moduleName}`;
      this.router.navigate([this.redirectionURL]).catch(err => console.error("Navigation error:", err));
      break;
    case 'Dashboard':
      this.redirectionURL = `/dashboard/dashboardFrom/Forms/${moduleName}`;
      this.router.navigate([this.redirectionURL]).catch(err => console.error("Navigation error:", err));
      break;
    case 'Projects':
      this.redirectionURL = `/project-dashboard/project-template-dashboard/${moduleName}`;
      this.router.navigate([this.redirectionURL]).catch(err => console.error("Navigation error:", err));
      break;
    case 'Project - Detail':
      this.redirectionURL = `/view-dreamboard/Project%20Detail/${moduleName}`;
        this.router.navigate([this.redirectionURL]).catch(err => console.error("Navigation error:", err));

      break;
      case 'Report Studio':
        this.router.navigate(['/reportStudio'], { queryParams: { savedQuery: moduleName } });

        // this.redirectionURL = `/reportStudio?savedQuery=${moduleName}`;
        break;
        case 'Calender':
          this.redirectionURL = `/dashboard/dashboardFrom/Calendar/${moduleName}`;
   
          this.router.navigate([this.redirectionURL]).catch(err => console.error("Navigation error:", err));
          // this.router.navigate(['/reportStudio'], { queryParams: { savedQuery: moduleName } });
     
  
          // this.redirectionURL = `/reportStudio?savedQuery=${moduleName}`;
          break;
    default:
      console.error("Unknown module: ", selectedModule);
      return;
  }

  // // Ensure the redirection is triggered
  // console.log("Redirecting to:", this.redirectionURL);
  // this.router.navigate([this.redirectionURL]).catch(err => console.error("Navigation error:", err));
}



fetchCalender(){
   this.api.GetMaster(this.SK_clientID + "#systemCalendarQuery#lookup", 1).then((result: any) => {
    if (result) {
        this.helpherObjCalender = JSON.parse(result.options)
        console.log('this.helpherObjCalender check',this.helpherObjCalender)

        this.formList = this.helpherObjCalender.map((item: any) => item)

        console.log("DYNAMIC FORMLIST:", this.formList)
    }
}).catch((error) => {
    console.log("Error:", error)
})
}
showDrillDownData(dynamicDrill:any,modalref:any){
  console.log('dynamicDrill checking',dynamicDrill)
  this.storeDrillDown = dynamicDrill
  console.log('this.storeDrillDown',this.storeDrillDown.id)
  const pointData ={
    name:this.storeDrillDown.multi_value[0].value,
    value:this.storeDrillDown.multi_value[0].processed_value
  }
  this.modalService.open(modalref, { size: 'lg' });
  console.log('pointData for Tile',pointData)


        // Define the API Gateway URL
        const apiUrl = 'https://1vbfzdjly6.execute-api.ap-south-1.amazonaws.com/stage1';
    
        // Prepare the request body
        const requestBody = {
          body: JSON.stringify({
            clientId: this.SK_clientID,
            routeId: this.routeId,
            widgetId:this.storeDrillDown.id,
            TileData:pointData,
            MsgType:'DrillDown'
          }),
        };
      
        console.log('requestBody Tile', requestBody);
      
        // Send a POST request to the Lambda function with the body
        this.http.post(apiUrl, requestBody).subscribe(
          (response: any) => {
            console.log('Lambda function triggered successfully:', response);
            this.responseBody = JSON.parse(response.body)
            console.log('this.responseBody checking',this.responseBody )
            this.responseRowData = JSON.parse(this.responseBody.rowdata)
            console.log('this.responseRowData checking',this.responseRowData)
        
            
            
        
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
  console.log('event checking',event)
  this.modalService.open(modalChart, { size: 'lg' });

}
// setModuleID(packet: any, selectedMarkerIndex: any, modaref: TemplateRef<any>): void {
//   console.log('modaref checking:', modaref);
//   console.log('packet checking:', packet);
//   console.log('dashboard filterCheck',this.dashboard)
//   if (Array.isArray(this.dashboard) && this.dashboard.length > 0) {
//     this.dashboard.forEach((packet, index) => {
//       console.log(`Processing packet at index ${index}:`, packet);

//       // Check if grid_type is "filterTile"
//       if (packet.grid_type === "filterTile") {
//         try {
//           // Parse filterTileConfig if it's a string
//           const parsedFilterTileConfig = packet.filterTileConfig
//             ? JSON.parse(packet.filterTileConfig)
//             : [];
          
//           console.log(`Parsed filterTileConfig for packet ${index}:`, parsedFilterTileConfig);

//           // Store parsed filterTileConfig in a variable or process further
//           this.storeFilterTileConfig(parsedFilterTileConfig, index);
//         } catch (error) {
//           console.error(`Error parsing filterTileConfig for packet ${index}:`, error);
//         }
//       }
//     });
//   } else {
//     console.warn('Dashboard data is empty or not an array.');
//   }



//   const viewMode = true;
//   const disableMenu = true;
//   const modulePath = packet.dashboardIds;
//   console.log('modulePath checking:', modulePath);

//   localStorage.setItem('isFullScreen', JSON.stringify(true));
//   const queryParams = `?viewMode=${viewMode}&disableMenu=${disableMenu}`;

//   this.currentItem = packet;
//   this.currentModalIndex = selectedMarkerIndex;

//   if (packet.selectType === 'NewTab') {
//     const safeUrl = `${window.location.origin}/summary-engine/${modulePath}`;
//     console.log('Opening new tab with URL:', safeUrl);
//     window.open(safeUrl, '_blank');
//   }
//   else if (packet.selectType === 'Modal') {
//     if (this.modalContent) {
//       this.currentiframeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
//         `${window.location.origin}/summary-engine/${modulePath}${queryParams}${parsedFilterTileConfig}`
//       );
//       console.log('Opening modal with iframe URL:', this.currentiframeUrl);
//       this.modalService.open(this.modalContent, { size: 'xl' });
//     } else {
//       console.error('Modal content is undefined');
//     }
  
//   } else if (packet.selectType === 'Same page Redirect') {
//     const navigationPath = `/summary-engine/${modulePath}`;
//     console.log('Redirecting to:', navigationPath);
//     this.modalService.dismissAll();
//     this.router.navigate([navigationPath]).then(() => {
//       window.location.reload();
//     }).catch(err => console.error('Navigation error:', err));
//   } else   if (packet.selectType === 'drill down') {
//     console.log('packet.selectType matches drill down');
//     if (modaref && modaref instanceof TemplateRef) {
//       console.log('Opening modal with modaref:', modaref);
//       // this.modalService.dismissAll(); // Dismiss existing modals
//       this.modalService.open(modaref, { size: 'lg', backdrop: 'static', centered: true });
//     } else {
//       console.error('Invalid TemplateRef passed for modal:', modaref);
//     }
//   }
// }

setModuleID(packet: any, selectedMarkerIndex: any, modaref: TemplateRef<any>): void {
  console.log('modaref checking:', modaref);
  console.log('packet checking:', packet);
  console.log('dashboard filterCheck', this.dashboard);

  let filterTileQueryParam = '';

  if (Array.isArray(this.dashboard) && this.dashboard.length > 0) {
    this.dashboard.forEach((dashboardPacket, index) => {
      if (dashboardPacket.grid_type === 'filterTile') {
        try {
          // Parse the filterTileConfig
          const parsedFilterTileConfig = dashboardPacket.filterTileConfig
            ? JSON.parse(dashboardPacket.filterTileConfig)
            : [];
  
          console.log(`Parsed filterTileConfig for packet ${index}:`, parsedFilterTileConfig);
  
          // Ensure the 'operator' field is preserved
          const validatedFilterConfig = parsedFilterTileConfig.map((filterGroup: any[]) =>
            filterGroup.map((filter: any) => ({
              ...filter,
              operator: filter.operator, // Ensure operator is preserved
            }))
          );
  
          console.log(`Validated filterTileConfig for packet ${index}:`, validatedFilterConfig);
  
          // Convert to a JSON string without encoding
          filterTileQueryParam = `&filterTileConfig=${JSON.stringify(validatedFilterConfig)}`;
  
          console.log('filterTileQueryParam:', filterTileQueryParam);
        } catch (error) {
          console.error(`Error parsing filterTileConfig for packet ${index}:`, error);
        }
      }
    });
  } else {
    console.warn('Dashboard data is empty or not an array.');
  }
  
  

  const viewMode = true;
  const disableMenu = true;
  const modulePath = packet.dashboardIds;
  this.toRouteId = modulePath
  console.log('modulePath checking:', modulePath);

  localStorage.setItem('isFullScreen', JSON.stringify(true));

  // Append parsedFilterTileConfig to queryParams
  console.log('filterTileQueryParam',filterTileQueryParam)
  const queryParams = `?viewMode=${viewMode}&disableMenu=${disableMenu}${filterTileQueryParam}&from_routerID=${this.routeId}`;
  console.log('queryParams checking for modal',queryParams)

  this.currentItem = packet;
  this.currentModalIndex = selectedMarkerIndex;

  if (packet.selectType === 'NewTab') {
    const safeUrl = `${window.location.origin}/summary-engine/${modulePath}`;
    console.log('Opening new tab with URL:', safeUrl);
    window.open(safeUrl, '_blank');
  } else if (packet.selectType === 'Modal') {
    if (this.modalContent) {
      this.currentiframeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
        `${window.location.origin}/summary-engine/${modulePath}${queryParams}`
      );
      console.log('Opening modal with iframe URL:', this.currentiframeUrl);
      console.log('QueryParams check', this.queryParams);
      this.modalService.open(this.modalContent, { size: 'xl' });
      console.log('this.paramsReadExport',this.paramsReadExport)
    

    } else {
      console.error('Modal content is undefined');
    }
  } else if (packet.selectType === 'Same page Redirect') {
    const navigationPath = `/summary-engine/${modulePath}`;
    console.log('Redirecting to:', navigationPath);
    this.modalService.dismissAll();
    this.router.navigate([navigationPath]).then(() => {
      window.location.reload();
    }).catch(err => console.error('Navigation error:', err));
  }else if (packet.selectType === 'drill down') {
    if (modaref && modaref instanceof TemplateRef) {
      console.log('Opening modal with modaref:', modaref);
      this.modalService.open(modaref, {
        size: 'lg',
        backdrop: true, // Allows closing by clicking outside of the modal
        centered: true
      });
    } else {
      console.error('Invalid TemplateRef passed for modal:', modaref);
    }
  }
  
}


storeFilterTileConfig(config: any, index: number): void {
  console.log(`Storing filterTileConfig for packet ${index}:`, config);

  // Example: Store the parsed config in a class-level variable or process further
  this.parsedConfigs = this.parsedConfigs || []; // Ensure the variable exists
  this.parsedConfigs.push({ index, config }); // Store by index for reference
}


exitFullScreen(): void {
    localStorage.removeItem('fullscreen');
    this.isFullscreen = false;
    this.hidingLink = false;
    console.log('Exited fullscreen mode');
    this.updateOptions();
}

closeModal1() {
  this.modalService.dismissAll(); // Close the modal programmatically
}

toggleFullScreenFullView(enterFullscreen?: boolean): void {
    // Allow direct control of fullscreen state or toggle if no parameter is provided
    if (enterFullscreen !== undefined) {
        this.isFullScreen = enterFullscreen;
    } else {
        this.isFullScreen = !this.isFullScreen; // Toggle fullscreen
    }

    this.hidingLink = this.isFullScreen; // Update hidingLink state

    console.log('Fullscreen state updated:', this.isFullScreen);
    this.updateOptions(); // Update any dependent options

    if (this.isFullScreen) {
        console.log('Entered fullscreen mode');
        // Additional logic for entering fullscreen
    } else {
        console.log('Exited fullscreen mode');
        // Additional logic for exiting fullscreen
    }
}


  // toggleFullView() {
  //   this.isFullScreen = !this.isFullScreen;  // Toggle the full-screen state
  //   this.isFullView = !this.isFullView;      // Toggle the icon state (expand/compress)
  
  //   // Save the state to localStorage
  //   localStorage.setItem('isFullScreen', JSON.stringify(true));
  //   this.cdr.detectChanges(); 
  // }



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
  isEditModeView: boolean = false;  // Default to Edit Mode
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
          console.log('Grid moved');
          this.isGirdMoved = true; // Set flag to indicate grid was moved
        },
      },
      resizable: {
        enabled: !this.isEditModeView, // Resizable only in edit mode
        stop: () => {
          console.log('Grid resized');
          this.isGirdMoved = true; // Set flag to indicate grid was resized
        },
      },
      itemInitCallback: this.onItemInit.bind(this),
      itemResizeCallback: this.itemResize.bind(this),
      // itemResizeCallbackMap: this.itemResizeMap.bind(this),
      itemChangeCallback: () => {
        console.log('Grid item changed');
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
  
    console.log('Options updated:', this.options); // Debugging log
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

  onGridChange(): void {
    console.log('Grid change detected');
    this.isGirdMoved = true; // Set the grid state to moved
  }
  // gridChanged(): void {
  //   console.log('Grid change detected');
  //   this.isGirdMoved = true; // Set the grid state to moved
  // }
  
  // Save method to persist the layout (your existing function)
  saveGridLayout(): void {
    this.grid_details = this.dashboard;
    console.log('this.grid_details from global save', this.grid_details);

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
    //console.log('New item initialized:', item);
    // Calculate item width and height based on grid cell size
    const cellWidth = this.options?.fixedColWidth; // Grid cell width with optional chaining
    const cellHeight = this.options?.fixedRowHeight; // Grid cell height with optional chaining

    if (cellWidth !== undefined && cellHeight !== undefined) {
      const itemWidth = item.cols * cellWidth; // Calculate width
      const itemHeight = item.rows * cellHeight; // Calculate height

      //console.log('Item width:', itemWidth);
      //console.log('Item height:', itemHeight);



    }
  }

  public itemResize(item: GridsterItem, itemComponent: GridsterItemComponentInterface): void {
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
      const itemComponentWidth = itemComponent.width;
      const itemComponentHeight = itemComponent.height;
  
      // Handle both charts and maps
      if (item.grid_type === 'Linechart') {
        const baseHeight = 400; // Base height for the chart
        const extraHeight = 40; // Additional height for labels, etc.
  
        this.chartHeight[index] = Math.max(0, itemComponentHeight + extraHeight); // Adjust height
        this.chartWidth[index] = Math.max(0, itemComponentWidth);
  
        console.log(
          `Updated chart dimensions at index ${index}:`,
          `Height: ${this.chartHeight[index]}px, Width: ${this.chartWidth[index]}px`
        );
      }
      else if (item.grid_type === 'chart') {
        const baseHeight = 400; // Base height for the chart
        // const extraHeight = 40; // Additional height for labels, etc.
  
        this.chartHeight[index] = Math.max(0, itemComponentHeight); // Adjust height
        this.chartWidth[index] = Math.max(0, itemComponentWidth);
  
        console.log(
          `Updated chart dimensions at index ${index}:`,
          `Height: ${this.chartHeight[index]}px, Width: ${this.chartWidth[index]}px`
        );
      }
      else if (item.grid_type === 'Columnchart') {
        const baseHeight = 400; // Base height for the chart
        const extraHeight = 40; // Additional height for labels, etc.
  
        this.chartHeight[index] = Math.max(0, itemComponentHeight + extraHeight); // Adjust height
        this.chartWidth[index] = Math.max(0, itemComponentWidth);
  
        console.log(
          `Updated chart dimensions at index ${index}:`,
          `Height: ${this.chartHeight[index]}px, Width: ${this.chartWidth[index]}px`
        );
      }

      else if (item.grid_type === 'Areachart') {
        const baseHeight = 400; // Base height for the chart
        const extraHeight = 40; // Additional height for labels, etc.
  
        this.chartHeight[index] = Math.max(0, itemComponentHeight + extraHeight); // Adjust height
        this.chartWidth[index] = Math.max(0, itemComponentWidth);
  
        console.log(
          `Updated chart dimensions at index ${index}:`,
          `Height: ${this.chartHeight[index]}px, Width: ${this.chartWidth[index]}px`
        );
      }
      else if (item.grid_type === 'Barchart') {
        const baseHeight = 400; // Base height for the chart
        const extraHeight = 40; // Additional height for labels, etc.
  
        this.chartHeight[index] = Math.max(0, itemComponentHeight + extraHeight); // Adjust height
        this.chartWidth[index] = Math.max(0, itemComponentWidth);
  
        console.log(
          `Updated chart dimensions at index ${index}:`,
          `Height: ${this.chartHeight[index]}px, Width: ${this.chartWidth[index]}px`
        );
      }
      
      else if (item.grid_type === 'Map') {
        // const topMargin = 20; // Define the top margin value
      
        // Adjust height and width with the top margin
        this.mapHeight[index] = itemComponentHeight - 10 ; // Subtract additional top margin
        this.mapWidth[index] = itemComponentWidth - 10; // Subtract margin/padding for width
      
        console.log(
          `Resized ${item.grid_type} at index ${index}:`,
          `Height: ${this.mapHeight[index]}, Width: ${this.mapWidth[index]}, Top Margin: }`
        );
      }
      else if (item.grid_type === 'tile') {
        // const topMargin = 20; // Define the top margin value
      
        // Adjust height and width with the top margin
        this.tileHeight[index] = itemComponentHeight ; // Subtract additional top margin
        this.tileWidth[index] = itemComponentWidth ; // Subtract margin/padding for width
      
        console.log(
          `Resized ${item.grid_type} at index ${index}:`,
          `Height: ${this.tileHeight[index]}, Width: ${this.tileWidth[index]}, Top Margin: }`
        );
      }
      else if (item.grid_type === 'TableWidget') {
        // const topMargin = 20; // Define the top margin value
      
        // Adjust height and width with the top margin
        this.tableHeight[index] = itemComponentHeight ; // Subtract additional top margin
        this.tableWidth[index] = itemComponentWidth ; // Subtract margin/padding for width
      
        console.log(
          `Resized ${item.grid_type} at index ${index}:`,
          `Height: ${this.tableHeight[index]}, Width: ${this.tableWidth[index]}, Top Margin: }`
        );
      }
      else if (item.grid_type === 'title') {
        // const topMargin = 20; // Define the top margin value
      
        // Adjust height and width with the top margin
        this.titleHeight[index] = itemComponentHeight ; // Subtract additional top margin
        this.titleWidth[index] = itemComponentWidth ; // Subtract margin/padding for width
      
        console.log(
          `Resized ${item.grid_type} at index ${index}:`,
          `Height: ${this.titleHeight[index]}, Width: ${this.titleWidth[index]}, Top Margin: }`
        );
      }
      else if (item.grid_type === 'dynamicTile') {
        // const topMargin = 20; // Define the top margin value
      
        // Adjust height and width with the top margin
        this.DynamicTileHeight[index] = itemComponentHeight ; // Subtract additional top margin
        this.DynamicTileWidth[index] = itemComponentWidth ; // Subtract margin/padding for width
      
        console.log(
          `Resized ${item.grid_type} at index ${index}:`,
          `Height: ${this.DynamicTileHeight[index]}, Width: ${this.DynamicTileWidth[index]}, Top Margin: }`
        );
      }
        else if (item.grid_type === 'HTMLtile') {
          // const topMargin = 20; // Define the top margin value
        
          // Adjust height and width with the top margin
          this.HTMLtileHeight[index] = itemComponentHeight ; // Subtract additional top margin
          this.HTMLtileWidth[index] = itemComponentWidth ; // Subtract margin/padding for width
        
          console.log(
            `Resized ${item.grid_type} at index ${index}:`,
            `Height: ${this.HTMLtileHeight[index]}, Width: ${this.HTMLtileWidth[index]}, Top Margin: }`
          );
      }
  

      
      

      
    } else {
      console.warn('Item not found in dashboard array');
    }
  }
  private redrawChart(index: number): void {
    const chartId = `lineChart${index + 1}`; // Assuming your chart container ID follows this pattern
    const chartElement = document.getElementById(chartId);
  
    if (chartElement) {
      // Trigger chart resize/update logic depending on the library you're using
      console.log(`Redrawing chart for index ${index}`);
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
     

  //     //console.log('AFTER this.isGirdMoved', this.isGirdMoved)
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
        console.log('Before deletion:', this.dashboard);
        console.log('all_Packet_store test before deleteTile',all_Packet_store)
  
        // Step 1: Validate the index and remove the tile
        if (index >= 0 && index < this.dashboard.length) {
          this.dashboard = this.dashboard.filter((_, i) => i !== index);
          console.log('After deletion:', this.dashboard);
  
          // Step 2: Update grid_details in all_Packet_store
          all_Packet_store.grid_details = [...this.dashboard];
          console.log('Updated all_Packet_store.grid_details:', all_Packet_store.grid_details);
          console.log('all_Packet_store test from deleteTile',all_Packet_store)
  
    
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
    console.log('Delete:', item);
  }


  nineBlocks = Array.from({ length: 9 }, (_, i) => ({ label: `KPI ${i + 1}` }));

  constructor(private summaryConfiguration: SharedService, private api: APIService, private fb: UntypedFormBuilder, private cd: ChangeDetectorRef,
    private toast: MatSnackBar, private router: Router, private modalService: NgbModal, private route: ActivatedRoute, private cdr: ChangeDetectorRef, private locationPermissionService: LocationPermissionService, private devicesList: SharedService, private injector: Injector, private auditTrail: AuditTrailService,
    private spinner: NgxSpinnerService, private zone: NgZone,private http: HttpClient,  private sanitizer: DomSanitizer, // Inject DomSanitizer

  ) {
    this.resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        if (entry.contentRect) {
          this.onWidthChange(entry.contentRect.width);
        }
      }
    });

    this.resetInactivityTimer()



  }

  someMethod() {
    const localeService = this.injector.get(NgxDaterangepickerLocaleService);
  }
  onWidthChange(newWidth: number) {
    // console.log('Container width changed:', newWidth);
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
    console.log('SummaryEngineComponent destroyed.');
  }
  ngAfterViewInit(): void {
    console.log('this.allCompanyDetails',this.createSummaryField.value)
    if (this.routeId) {
      this.checkAndSetFullscreen();
      this.editButtonCheck = true

      this.openModalHelpher(this.routeId)
    } else {
      this.editButtonCheck = false
    }
    this.loadData()
    this.addFromService()

    console.log("this.lookup_data_summary1", this.lookup_data_summary1)
    console.log('create summary fields',this.createSummaryField.value)
    // this.createChartGauge();

    this.createKPIWidget.statusChanges.subscribe(status => {
      // Log form validity status to track changes
      console.log('Form status changed:', status);
      console.log('Form validity:', this.createKPIWidget.valid);
    });


    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.forEach((tooltipTriggerEl) => {
      new Tooltip(tooltipTriggerEl);
    });
    // this.createBulletChart();

    // this.createPieChart()
    
  
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




  ngOnInit() {

    this.getLoggedUser = this.summaryConfiguration.getLoggedUserDetails()

    this.SK_clientID = this.getLoggedUser.clientID;
    console.log('this.SK_clientID check', this.SK_clientID)
    this.userdetails = this.getLoggedUser.username;
    console.log('user name permissions check',this.userdetails)

    this.fetchUserPermissions(1)
    
    this.initializeCompanyFields();

    this.route.queryParams.subscribe((params) => {
      console.log('params check', params);
      this.queryParams = params;
    
      console.log('this.queryParams checking', this.queryParams);
      // this.openQueryParams(this.queryParams)
      this.isEditModeView = false;
    
      if (params['viewMode']) {
        this.viewModeQP = params['viewMode'] === 'true';
        this.hideButton = true;
        sessionStorage.setItem('viewMode', this.viewModeQP.toString());
      }
    
      if (params['disableMenu']) {
        this.disableMenuQP = params['disableMenu'] === 'true';
        console.log('this.disableMenuQP check',this.disableMenuQP)
        sessionStorage.setItem('disableMenu', this.disableMenuQP.toString());
      }
    if(params['from_routerID']){
      console.log(params['from_routerID'])
      this.fromRouterID = params['from_routerID']
    }
      console.log('params', params['filterTileConfig']);
      if (params['filterTileConfig']) {
        console.log('Raw filterTileConfig:', params['filterTileConfig']);
    
        try {
          // Ensure the value is a valid JSON string
          const parsedFilterTileConfig = JSON.parse(params['filterTileConfig'].trim());
          console.log('Parsed filterTileConfig:', parsedFilterTileConfig);
    
          // Flatten the nested array structure if necessary
          const flattenedConfig = parsedFilterTileConfig.flat();
          console.log('Flattened filterTileConfig:', flattenedConfig);
    
          // Check if flattenedConfig is an array and has elements
          if (Array.isArray(flattenedConfig) && flattenedConfig.length > 0) {
            console.log('Triggering updateSummary with add_tile');
            alert('I am triggered');
            console.log('all_Packet_store checking',this.all_Packet_store)
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
    
    // this.dropdownSettings = this.devicesList.getMultiSelectSettings();



    
    // Function to process the savedQuery parameter

    
    
    
    // this.dropdownSettings = this.devicesList.getMultiSelectSettings();

    console.log('this.getLoggedUser check', this.getLoggedUser)

    
  
    // this.getWorkFlowDetails = this.summaryConfiguration.getLoggedUserDetails()
    // console.log('this.getLoggedUser check',this.getWorkFlowDetails)

  

    this.route.paramMap.subscribe(params => {
      this.routeId = params.get('id');
      if (this.routeId) {
        // this.openModalHelpher(this.routeId);
        this.editButtonCheck = true

      }

      //console.log(this.routeId)
      // Use this.itemId to fetch and display item details
    });


    




    this.initializeTileFields6()
   

    // Load saved layout
    this.loadGridLayout();
    // this.addJsonValidation();
    this.showTable()
    this.addFromService()


    const savedMode = localStorage.getItem('editModeState');
    this.isEditModeView = savedMode ? JSON.parse(savedMode) : false;
    // Update options based on the retrieved mode
    this.updateOptions();

    // Trigger change detection to reflect changes in the UI
    this.cdr.detectChanges();
    this.fetchLiveContractlookup(1)
    this.fetchContractOrderMasterlookup(1)
    this.permissionIds(1)
    this.fetchCompanyLookupdata(1)
    // this.reloadPage();
    // this.fetchCalender()
   
         this.rowData = [
        {
          'location': 'India',
          'text-1732683302774': '+91',
          '1732683476': '2023-12-31'
        },
        {
          'location': 'USA',
          'text-1732683302774': '+1',
          '1732683476': '2023-12-30'
        }
      ];
    // const savedFullScreen = localStorage.getItem('isFullScreen');
    // // this.isFullScreen = savedState ? JSON.parse(savedState) : false;

    // this.cdr.detectChanges(); 
    // if (savedFullScreen) {
    //   this.isFullScreen = JSON.parse(savedFullScreen);
    // } else {
    //   this.isFullScreen = true;  // Default to full screen if not in localStorage
    // }

    // const savedState = localStorage.getItem('isGirdMoved');
    // if (savedState) {
    //   this.isGirdMoved = JSON.parse(savedState);
    //   localStorage.removeItem('isGirdMoved'); // Clean up storage
    // }

  
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
    console.log('Navigation ended, reloading window...');
     window.location.reload(); // Reload the window on navigation end } }); } 
  }
});
  
this.auditTrail.getFormInputData('SYSTEM_AUDIT_TRAIL', this.SK_clientID)
  }
  openQueryParams(paramsRead:any){
    console.log('paramsRead',paramsRead)
    this.paramsReadExport = paramsRead

  }
  selectFormParams(event: any) {
    if (event && event[0] && event[0].data) {
      const selectedText = event[0].data.text;  // Adjust based on the actual structure
      console.log('Selected Form Text:', selectedText);

      if (selectedText) {
        this.fetchDynamicFormData(selectedText);
      }
    } else {
      console.error('Event data is not in the expected format:', event);
    }
  }
  loadReportData(savedQuery: string) {
    console.log('Loading report data for:', savedQuery);
    // Add logic to load the report data based on savedQuery
  }

  async permissionIds(sk: any) {
    console.log("I am called Bro");
    try {
        const response = await this.api.GetMaster(this.SK_clientID + "#permission#lookup", sk);

        if (response && response.options) {
            if (typeof response.options === 'string') {
                let data = JSON.parse(response.options);
                console.log("d1 =", data);

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
                                console.log("Pushed to dashboardIdsList: ", { P1, P2, P3 });
                                console.log('this.dashboardIdsList check', this.permissionIdsList);
                            } else {
                                console.warn("Skipping element because P1 is not defined or null");
                            }
                        } else {
                            break;
                        }
                    }

                    // Fetch permission data for each P1 value
                    this.p1ValuesSummaryPemission = this.permissionIdsList.map((item: { P1: any; }) => item.P1);
                    console.log('P1 values: dashboard permission', this.p1ValuesSummaryPemission);

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
            console.log("Lookup to be displayed", this.permissionIdsList);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}


async fetchPermissionIdMain(clientID: number, p1Value: string) {
  console.log('p1Value checking', p1Value);
  console.log('clientID checking', clientID);
  console.log('this.SK_clientID checking from permission', this.SK_clientID);

  try {
    // Construct the primary key (PK) for the main table
    const pk = `${this.SK_clientID}#permission#${p1Value}#main`;
    console.log(`Fetching main table data for PK: ${pk}`);

    // Fetch data from the main table (API call or service call)
    const result: any = await this.api.GetMaster(pk, clientID);
    console.log('Result fetched for the permission:', result);

    // Parse and process the metadata
    if (result && result.metadata) {
      this.parsedPermission = JSON.parse(result.metadata);
      console.log('Parsed permission metadata:', this.parsedPermission);
    this.readFilterEquation =this.parsedPermission 
    console.log('this.readFilterEquation check',this.readFilterEquation)

      this.summaryPermission = this.parsedPermission.summaryList;
      console.log('this.summaryPermission check', this.summaryPermission);

      // Determine if "All" permission is included
      if (this.summaryPermission.includes("All")) {
        // If "All", fetch and display all dashboard data
        console.log("Permission is 'All'. Fetching all dashboards...");
        this.fetchCompanyLookupdata(0).then((allData: any) => {
          console.log('All Dashboards Data:', allData);
          this.dashboardData = allData; // Store all dashboard data
        });
      } else {
        // If not "All", fetch specific dashboard data
        console.log("Permission is restricted. Fetching specific dashboards...");
        this.fetchCompanyLookupdata(0).then((allData: any[]) => {
          console.log('All Dashboards Data:', allData);
          this.dashboardData = allData.filter((dashboard: any) =>
  
       
            this.summaryPermission.includes(dashboard.P1)
            

          ); // Filter dashboards based on summaryPermission
          console.log('Filtered Dashboards Data:', this.dashboardData);
          console.log('this.summaryPermission',this.summaryPermission)
        });
      }

      // Handle specific permissions
      this.permissionIdsListList = this.parsedPermission.permissionsList;
      console.log('Parsed permission list:', this.permissionIdsListList);

      // Find specific permission
      const summaryDashboardItem = this.permissionIdsListList.find(
        (item: { name: string; update: boolean; view: boolean }) =>
          item.name === 'Summary Dashboard'
      );
      console.log('Summary Dashboard Item:', summaryDashboardItem);

      if (summaryDashboardItem) {
        this.summaryDashboardUpdate = summaryDashboardItem.update;
        // Set default mode based on `update` permission
        this.isEditModeView = this.summaryDashboardUpdate; // Default to view mode if update is false
        // this.hideButton = 
        // const savedMode = localStorage.getItem('editModeState');
        // console.log('savedMode checking',savedMode)
        // this.isEditModeView = savedMode ? JSON.parse(savedMode) : false;
        this.updateOptions(); // Ensure options reflect the correct mode
      }

      this.processFetchedData(result);
    } else {
      console.warn('Result metadata is null or undefined.');
    }
  } catch (error) {
    // Handle any errors during the fetch
    console.error(`Error fetching data for PK (${p1Value}):`, error);
  }
}


fetchCompanyLookupdata(sk:any):any {
  console.log("I am called Bro");
  
  return new Promise((resolve, reject) => {
    this.api.GetMaster(this.SK_clientID + "#summary" + "#lookup", sk)
      .then(response => {
        if (response && response.options) {
          // Check if response.options is a string
          if (typeof response.options === 'string') {
            let data = JSON.parse(response.options);
            console.log("d1 =", data);
            
            if (Array.isArray(data)) {
              const promises = []; // Array to hold promises for recursive calls

              for (let index = 0; index < data.length; index++) {
                const element = data[index];

                if (element !== null && element !== undefined) {
                  // Extract values from each element and push them to lookup_data_user
                  const key = Object.keys(element)[0]; // Extract the key (e.g., "L1", "L2")
                  const { P1, P2, P3, P4, P5, P6,P7 ,P8} = element[key]; // Extract values from the nested object
                 this.lookup_data_summary.push({ P1, P2, P3, P4, P5, P6,P7,P8 }); // Push an array containing P1, P2, P3, P4, P5, P6
                  console.log("d2 =", this.lookup_data_summary);
                } else {
                  break;
                }
              }

              // Sort the lookup_data_user array based on P5 values in descending order
              console.log("Summary LookupData", this.lookup_data_summary);
              this.lookup_data_summary.sort((a: { P5: number; }, b: { P5: number; }) => b.P5 - a.P5);
              console.log("Lookup sorting", this.lookup_data_summary);

              // Continue fetching recursively
              promises.push(this.fetchCompanyLookupdata(sk + 1)); // Store the promise for the recursive call
              
              // Wait for all promises to resolve
              Promise.all(promises)
                .then(() => resolve(this.lookup_data_summary)) // Resolve with the final lookup data
                .catch(reject); // Handle any errors from the recursive calls
            } else {
              console.error('Invalid data format - not an array.');
              reject(new Error('Invalid data format - not an array.'));
            }
          } else {
            console.error('response.options is not a string.');
            reject(new Error('response.options is not a string.'));
          }
        } else {
          console.log("All the users are here", this.lookup_data_summary);

          this.listofSK = this.lookup_data_summary.map((item:any)=>item.P1)

          resolve(this.lookup_data_summary); // Resolve with the current lookup data
        }
      })
      .catch(error => {
        console.error('Error:', error);
        reject(error); // Reject the promise on error
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
  console.log('Processing fetched data:', result);

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
    const date = new Date(epochTime * 1000); // Convert to milliseconds

    // Manually format the date to dd/MM/yyyy
    const day = this.padZero(date.getUTCDate()); // Get day and pad with zero if needed
    const month = this.padZero(date.getUTCMonth() + 1); // Month is 0-indexed
    const year = date.getUTCFullYear(); // Get full year

    return `${day}/${month}/${year}`; // Return formatted date string
  }

  // Helper function to pad single digit numbers with a leading zero
  private padZero(value: number): string {
    return value < 10 ? '0' + value : value.toString();
  }


  openSummaryTable(content: any) {
    this.modalService.open(content, { size: 'xl', ariaLabelledBy: 'modal-basic-title' });
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
    { value: 'Tiles', label: 'Tiles' },
    { value: 'Title', label: 'Title' },
    { value: 'Chart', label: 'Chart' },
    { value: 'DynamicTile', label: 'DynamicTile' },
    {value:'FilterTile',label:'FilterTile'},
    {value:'TableTile',label:'TableTile'},
    {value:'MapWidget',label:'MapWidget'},
    {value:'MultiTableWidget',label:'MultiTableWidget'},
    {value:'Html Tile',label:'Html Tile'}
    
    

    

    // { value: 'Pharagraph', label: 'Pharagraph' },
    // { value: 'Image', label: 'Image' },
    // { value: 'Embed', label: 'Embed' },
  ]
  tileChange(event: any): void {
    console.log('Tile changed:', event);

    if (event && event.length > 0) {
      this.selectedTile = event[0].value;

      console.log('Selected tile:', this.selectedTile);


      // Update visibility based on the selected tile
      this.showGrid = this.selectedTile === 'Tiles' || this.selectedTile === 'Title' || this.selectedTile === 'Chart'|| this.selectedTile === 'DynamicTile' || this.selectedTile === 'FilterTile' || this.selectedTile === 'TableTile' || this.selectedTile === 'MapWidget' || this.selectedTile === 'MultiTableWidget' ||this.selectedTile ==='Html Tile';

      
      this.showTitleGrid = this.selectedTile === 'Title'; // Show specific grid for Title
      this.showChartGrid = this.selectedTile === 'Chart';
      this.showDynamicTileGrid =  this.selectedTile === 'DynamicTile'
            this.showFilterGrid =  this.selectedTile === 'FilterTile'
               this.showTableGrid =  this.selectedTile === 'TableTile'
                    this.showMapGrid =  this.selectedTile === 'MapWidget'
                              this.showMapGrid =  this.selectedTile === 'MapWidget'
                              this.showMultiTableGrid = this.selectedTile === 'MultiTableWidget'
                              this.showHTMLtileGrid = this.selectedTile === 'Html Tile'


            

      setTimeout(() => {
        this.createPieChart()
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
  this.createAreaChart()
}, 500);




setTimeout(() => {
  this.createCalumnChart()
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
    console.log('Grid position saved');
    this.isGirdMoved = false; // Reset the moved flag
    this.lastSavedTime = new Date(); // Update the last saved time
  
    // Persist `isGirdMoved` and `lastSavedTime` in localStorage
    localStorage.setItem('isGirdMoved', JSON.stringify(this.isGirdMoved));
    localStorage.setItem('lastSavedTime', this.lastSavedTime.toISOString());
  
    this.updateSummary('', 'Save');
  }
  

  


  isSummaryEngine(): boolean {
    return this.router.url === '/summary-engine'; // Check if the current route is /summary-engine
  }

  hideTooltips() {

  }
  openCreateContent(createcontent: any) {
    this.modalService.open(createcontent, { size: 'lg', ariaLabelledBy: 'modal-basic-title' });
  }

  viewItem(id: string): void {
    // Toggle the full-screen state
    // this.isFullScreen = !this.isFullScreen;
    // this.isFullView = !this.isFullView;

    // // Save the state to localStorage
    // localStorage.setItem('isFullScreen', JSON.stringify(this.isFullScreen));

    // Navigate to the desired route
    this.setFullscreen()
    this.router.navigate([`/summary-engine/${id}`]);
    this.cdr.detectChanges();

    // Set the state to Edit Mode
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
    // Save state in sessionStorage to trigger modal after reload
    // sessionStorage.setItem('openModalAfterReload', JSON.stringify({
    //   modalId: 'edit_ts',
    //   packetStore: this.all_Packet_store,
    //   modalReference: 'summaryModal',
    // }));
  
    // Navigate to the new URL and reload the page
    this.router.navigate([`/summary-engine/${id}`]).then(() => {
      location.reload(); // Reload the window after navigation
    });

    // setTimeout(() => {

    // }, 3000);

  }
  
  
  
  // toggleFullScreen() {
  //   this.isFullScreen = !this.isFullScreen;
  //   localStorage.setItem('isFullScreen', JSON.stringify(true));
  //   this.cdr.detectChanges(); 
  // }
  
  // setFullScreen(): void {
  //   document.body.style.overflow = 'hidden'; // Hide overflow to simulate fullscreen
  //   document.body.requestFullscreen?.(); // Optional: Fullscreen API to enter fullscreen mode (browser-specific)
  //   // Add any other fullscreen-related styles or classes
  // }
  
  // Method to exit fullscreen
  // exitFullScreen(): void {
  //   document.body.style.overflow = 'auto'; // Restore overflow
  //   document.exitFullscreen?.(); // Optional: Fullscreen API to exit fullscreen mode (browser-specific)
  //   // Remove fullscreen-related styles or classes
  // }

  
  redirectDashboard(id: string): void {
    this.isLoading = true;
  
    // Dismiss all modals
    this.modalService.dismissAll(); // Remove the modal-open class
  
    // Navigate to the desired route
    this.router.navigate([`/summary-engine/${id}`]).then(() => {
      window.location.reload(); // Reload the window after navigation
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
    console.log('Selected icon:', this.selectedIcon); // Debugging line
  }


  updateDisplayLabel(selectedDropdown: string): void {
    // Format the display label with the selected dropdown text
    this.displayLabel = `${selectedDropdown} (selected value)`;
    console.log('Updated Display Label:', this.displayLabel);
  }



  someOtherFunction(combinedValue: string): void {
    // Use the combined value as needed
    console.log('Using Combined Value:', combinedValue);
  }


  metadata(): FormGroup {
    return this.createSummaryField.get('metadata') as FormGroup
  }

  edit(event: any): void {
    console.log('event checking',event)
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

  openModalHelpher(getValue: any) {
    console.log("Data from lookup:", getValue);

    this.api
      .GetMaster(`${this.SK_clientID}#${getValue}#summary#main`, 1)
      .then((result: any) => {
        if (result && result.metadata) {
          const parsedMetadata = JSON.parse(result.metadata);
          this.parsedSummaryData = parsedMetadata
          console.log('parsedMetadata check', this.parsedSummaryData);
          this.all_Packet_store = parsedMetadata;
          this.createdTime = this.all_Packet_store.created;
          this.createdUserName = this.all_Packet_store.createdUser;

          console.log('Before Parsing:', this.all_Packet_store);
        // Assuming this.all_Packet_store.LastUpdate contains the epoch time
        
const formattedDate = new Date(this.all_Packet_store.LastUpdate);

// For debugging, log the converted date and time
console.log('this.lastUpdatedTime', formattedDate);

// To format the date into a specific format (e.g., locale-specific date and time)
this.lastUpdatedTime = formattedDate.toLocaleString();  // You can adjust the locale as needed
console.log('Formatted Date:', this.lastUpdatedTime);

          console.log('this.storeFilterDetail checking',this.storeFilterDetail)

          // this.isFilterdetail=true
    
          // alert("hiii")
          console.log('this.all_Packet_store.grid_details.length check',this.all_Packet_store.grid_details.length)
   if(this.all_Packet_store.grid_details.length==0){
    this.openModal('edit_ts', this.all_Packet_store, this.summaryModal);
   }
            // setTimeout(() => {
     
            // }, 2000);
          
          
          // Check if `grid_details` is not empty and `multi_value` is present
          if (this.all_Packet_store.grid_details && this.all_Packet_store.grid_details.length > 0) {
            this.all_Packet_store.grid_details.forEach((gridItem: { multi_value: any; }, index: any) => {
              if (gridItem?.multi_value) {
                try {
                  const multiValueString = gridItem.multi_value;
                  const parsedMultiValue = Array.isArray(multiValueString)
                    ? multiValueString
                    : JSON.parse(multiValueString);
                  gridItem.multi_value = parsedMultiValue;
                  console.log(`After Parsing and Reassigning for item ${index}:`, gridItem);
                } catch (error) {
                  console.error(`Error parsing multi_value for item ${index}:`, error);
                }
              } else {
                console.log(`multi_value is undefined or not available for item ${index}.`);
              }
            });

            // Reassign the updated grid_details to dashboard
            this.dashboard = this.all_Packet_store.grid_details;
       
            console.log('this.dashboard after parsing', this.dashboard);
          } else {
            console.log('grid_details is undefined or empty.');
          }

          // Match themeColor and set selected to true


          // Iterate through the dashboard and themes to find a matching 
          console.log('checkdta for filter',this.all_Packet_store)
          if(this.isFilterdetail){
            console.log('this.isFilterdetail',this.isFilterdetail)
            console.log('this.storeFilterDetail',this.storeFilterDetail)
            console.log('this.routeId',this.routeId)
            console.log('this.toRouteId',this.toRouteId)
            
            const apiUrl = 'https://1vbfzdjly6.execute-api.ap-south-1.amazonaws.com/stage1';
    
            // Prepare the request body
            const requestBody = {
              body: JSON.stringify({
                clientId: this.SK_clientID,
                from_route_id: this.fromRouterID,

                to_route_id:this.routeId,
                // widgetId:this.storeDrillDown.id,
            
                MsgType:'Query_Params',
                queryParams:this.storeFilterDetail,
                permissionId:this.permissionIdRequest,
                permissionList:this.readFilterEquation,
                userName:this.userdetails
              }),
            };
          
            console.log('requestBody for dashboardFilter', requestBody);
          
            // Send a POST request to the Lambda function with the body
            console.log('this.all_Packet_store clearing',this.all_Packet_store)
            this.http.post(apiUrl, requestBody).subscribe(
              
              (response: any) => {
                console.log('Lambda function triggered successfully:', response);
                this.responseBody = JSON.parse(response.body)
                console.log('this.responseBody checking',this.responseBody )
                this.responseRowData = JSON.parse(this.responseBody.Processed_Data
                )
                console.log('this.responseRowData checking',this.responseRowData)
            
                
                
            
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
            // this.updateSummary(this.storeFilterDetail, 'query_applied');
          }
          this.dashboard.forEach((gridItem: any) => {
            // Find the theme that matches the current grid item
            const matchingTheme = this.themes.find(theme => theme.color === gridItem.themeColor);

            // If a matching theme is found, clear the 'selected' state for the matching theme only
            if (matchingTheme) {
              // Clear the 'selected' state for all themes in the dashboard except the matched one
              this.themes.forEach(theme => {
                if (theme.color !== matchingTheme.color) {
                  theme.selected = false; // Only unselect the themes that don't match
                }
              });

              // Set the matching theme as selected
              matchingTheme.selected = true;
              console.log('Matching theme found and selected:', matchingTheme);
            }
          });



          // Continue with other actions
          this.cdr.detectChanges();
          this.bindDataToGridster(this.all_Packet_store); // Pass the object to bindDataToGridster
          this.openModal('Edit_ts', this.all_Packet_store); // Open modal with the data
        }
      })
      .catch((err) => {
        console.log("Can't fetch", err);
      });
  }

  helperFilter(data:any,index:any, KPIModal: TemplateRef<any>){
    if(data.grid_type=='filterTile'){
    this.modalService.open(KPIModal, { size: 'lg' });

    // Access the component instance and trigger `openKPIModal`
    setTimeout(() => {
     
      this.FilterTileConfigComponent.openFilterModal(data, index);
    }, 500);
  }
  else if(data.grid_type=='tile'){
    this.modalService.open(KPIModal, { size: 'lg' });

    // Access the component instance and trigger `openKPIModal`
    setTimeout(() => {
     
      this.tileConfig1Component.openKPIModal(data, index);
    }, 500);

  }
  }

  helperTile(event: any, KPIModal: TemplateRef<any>) {
    console.log('KPIModal check',KPIModal)
    if(event.arg1.grid_type=='tile'){
      this.modalService.open(KPIModal, { size: 'lg' });

    
      // Access the component instance and trigger `openKPIModal`
      setTimeout(() => {
       
        this.tileConfig1Component.openKPIModal(event.arg1, event.arg2);
      }, 500);
    }
    if(event.arg1.grid_type=='MultiTableWidget'){
      this.modalService.open(KPIModal, { size: 'lg' });

    
      // Access the component instance and trigger `openKPIModal`
      setTimeout(() => {
       
        this.MultiTableConfigComponent.openMultiTableModal(event.arg1, event.arg2);
      }, 500);
    }
    if(event.arg1.grid_type=='HTMLtile'){
      this.modalService.open(KPIModal, { size: 'lg' });

    
      // Access the component instance and trigger `openKPIModal`
      setTimeout(() => {
       
        this.HtmlTileConfigComponent.openHTMLtile(event.arg1, event.arg2);
      }, 500);
    }
    if(event.arg1.grid_type=='TableWidget'){
      this.modalService.open(KPIModal, { size: 'lg' });

    
      // Access the component instance and trigger `openKPIModal`
      setTimeout(() => {
       
        this.TableWidgetConfigComponent.openTableModal(event.arg1, event.arg2);
      }, 500);
    }
    if(event.arg1.grid_type=='Map'){
      this.modalService.open(KPIModal, { size: 'lg' });

    
      // Access the component instance and trigger `openKPIModal`
      setTimeout(() => {
       
        this.MapConfigComponent.openMapModal(event.arg1, event.arg2);
      }, 500);
    }


    
    else if(event.arg1.grid_type=='tile2'){
      console.log('modal check',KPIModal)
      this.modalService.open(KPIModal, { size: 'lg' });
      console.log('event check', event)
      setTimeout(() => {
        this.tileConfig2Component.openKPIModal1(event.arg1, event.arg2)
      }, 500);
    }
    else if(event.arg1.grid_type=='tile3'){
      this.modalService.open(KPIModal, { size: 'lg' });
      console.log('event check', event)
  
      setTimeout(() => {
        this.tileConfig3Component.edit_Tile3(event.arg1, event.arg2)
      }, 500);

    }
    else if (event.arg1.grid_type=='tile4'){
      this.modalService.open(KPIModal, { size: 'lg' });
      console.log('event check', event)
      setTimeout(() => {
        this.tileConfig4Component?.openKPIModal3(event.arg1, event.arg2)
      }, 500);
    }
    else if(event.arg1.grid_type=='tile5'){
      this.modalService.open(KPIModal, { size: 'lg' });
      console.log('event check', event)
      setTimeout(() => {
        this.tileConfig5Component?.openKPIModal4(event.arg1, event.arg2)
      }, 500);

    }
    else if(event.arg1.grid_type=='tile6'){
      this.modalService.open(KPIModal, { size: 'lg' });
      console.log('event check', event)
      setTimeout(() => {
        this.tileConfig6Component?.openKPIModal5(event.arg1, event.arg2)
      }, 500);
    }
    else if(event.arg1.grid_type=='title'){
      this.modalService.open(KPIModal, { size: 'lg' });
      console.log('event check', event)
      setTimeout(() => {
        this.titleConfigComponent.openTitleModal(event.arg1, event.arg2)
      }, 500);

    }

    else if(event.arg1.grid_type=='chart'){
      this.modalService.open(KPIModal, { size: 'lg' });
      console.log('event check', event)
      setTimeout(() => {
        this.ChartConfig1Component.openChartModal1(event.arg1, event.arg2)
      }, 500);

    }

    else if(event.arg1.grid_type=='Linechart'){
      this.modalService.open(KPIModal, { size: 'lg' });
      console.log('event check', event)
      setTimeout(() => {
        this.ChartConfig2Component.openChartModal2(event.arg1, event.arg2)
      }, 500);

    }

    else if(event.arg1.grid_type=='Columnchart'){
      this.modalService.open(KPIModal, { size: 'lg' });
      console.log('event check', event)
      setTimeout(() => {
        this.ChartConfig3Component.openChartModal3(event.arg1, event.arg2)
      }, 500);

    }

    else if(event.arg1.grid_type=='Areachart'){
      this.modalService.open(KPIModal, { size: 'lg' });
      console.log('event check', event)
      setTimeout(() => {
        this.ChartConfig4Component.openChartModal4(event.arg1, event.arg2)
      }, 500);

    }
    else if(event.arg1.grid_type=='Barchart'){
      this.modalService.open(KPIModal, { size: 'lg' });
      console.log('event check', event)
      setTimeout(() => {
        this.ChartConfig5Component.openChartModal5(event.arg1, event.arg2)
      }, 500);

    }
    else if(event.arg1.grid_type=='dynamicTile'){
      this.modalService.open(KPIModal, { size: 'lg' });
      console.log('event check dynamic tile', event)
    
      // Access the component instance and trigger `openKPIModal`
      setTimeout(() => {
       
        this.DynamicTileConfigComponent.openDynamicTileModal(event.arg1, event.arg2);
      }, 500);
    }

    else if(event.arg1.grid_type=='title'){
      this.modalService.open(KPIModal, { size: 'lg' });
      console.log('event check dynamic tile', event)
    
      // Access the component instance and trigger `openKPIModal`
      setTimeout(() => {
       
        this.titleConfigComponent.openTitleModal(event.arg1, event.arg2);
      }, 500);
    }

    else if(event.arg1.grid_type=='filterTile'){
      this.modalService.open(KPIModal, { size: 'lg' });
      console.log('event check dynamic tile', event)
      console.log('event.arg1 checking',event.arg1)
      console.log('event.arg2 checking',event.arg2)
    
      // Access the component instance and trigger `openKPIModal`
      setTimeout(() => {
       
        this.FilterTileConfigComponent.openFilterModal(event.arg1, event.arg2);
      }, 500);
    }

    

    
    }








  emitDuplicate(event: { data: { arg1: any; arg2: number }; all_Packet_store: any }) {
    const { arg1, arg2 } = event.data;
    const { all_Packet_store } = event;
    if(arg1.grid_type=='tile'){
      console.log('event check', event)
      this.isGirdMoved = false; 
  this.dashboard.push(arg1)
 

    }
    else if(event.data.arg1.grid_type=='TableWidget'){
      console.log('event check', event)
      this.allCompanyDetails = event.all_Packet_store;
      this.dashboard.push(event.data.arg1)
 
    }
    else if(event.data.arg1.grid_type=='HTMLtile'){
      console.log('event check', event)
      this.allCompanyDetails = event.all_Packet_store;
      this.dashboard.push(event.data.arg1)
 
    }

    else if(event.data.arg1.grid_type=='MultiTableWidget'){
      console.log('event check', event)
      this.allCompanyDetails = event.all_Packet_store;
      this.dashboard.push(event.data.arg1)
 
    }
    else if(event.data.arg1.grid_type=='Map'){
      console.log('event check', event)
      this.allCompanyDetails = event.all_Packet_store;
      this.dashboard.push(event.data.arg1)
     
    }
    else if(event.data.arg1.grid_type=='tile2'){
      console.log('event check', event)
      this.allCompanyDetails = event.all_Packet_store;
      this.dashboard.push(event.data.arg1)

    }
    else if(event.data.arg1.grid_type=='filterTile'){
      console.log('event check', event)
      this.allCompanyDetails = event.all_Packet_store;
      this.dashboard.push(event.data.arg1)
   
    }
    else if(event.data.arg1.grid_type=='tile3'){
      console.log('event check', event)
      this.allCompanyDetails = event.all_Packet_store;
      this.dashboard.push(event.data.arg1)

    }
    else if(event.data.arg1.grid_type=='tile4'){
      console.log('event check', event)
      this.allCompanyDetails = event.all_Packet_store;
      this.dashboard.push(event.data.arg1)


    }
    else if(event.data.arg1.grid_type=='tile5'){
      console.log('event check', event)
      this.allCompanyDetails = event.all_Packet_store;
      this.dashboard.push(event.data.arg1)
    

    }
    else if(event.data.arg1.grid_type=='tile6'){
      console.log('event check', event)
      this.allCompanyDetails = event.all_Packet_store;
      this.dashboard.push(event.data.arg1)


    }
    else if (event.data.arg1.grid_type === 'chart') {
      console.log('event check chart1', event);
    
      // Store all company details
      this.allCompanyDetails = event.all_Packet_store;
    
      // Directly update the id and push the object into the dashboard in one line
      this.dashboard.push({
        ...event.data.arg1,
        id: Date.now() + Math.floor(Math.random() * 1000) // Update the id inline
      });
    
      console.log('event.data.arg1', event.data.arg1);
    }
    
    
    
    
    else if(event.data.arg1.grid_type=='Linechart'){
      console.log('event check', event)
      this.allCompanyDetails = event.all_Packet_store;
      this.dashboard.push(event.data.arg1)
    

    }
        else if(event.data.arg1.grid_type=='Columnchart'){
      console.log('event check', event)
      this.allCompanyDetails = event.all_Packet_store;
      this.dashboard.push(event.data.arg1)


    }
        else if(event.data.arg1.grid_type=='Areachart'){
      console.log('event check', event)
      this.allCompanyDetails = event.all_Packet_store;
      this.dashboard.push(event.data.arg1)


    }
    else if(event.data.arg1.grid_type=='Barchart'){
      console.log('event check', event)
      this.allCompanyDetails = event.all_Packet_store;
      this.dashboard.push(event.data.arg1)


    }


    else if(event.data.arg1.grid_type=='dynamicTile'){
      console.log('event check from dynamic', event.data.arg1)
      this.allCompanyDetails = event.all_Packet_store;
      this.dashboard.push(event.data.arg1)
      console.log('this.dashboard from dynamic',event.all_Packet_store)


    }
    else if(event.data.arg1.grid_type=='title'){
      console.log('event check from dynamic', event.data.arg1)
      this.allCompanyDetails = event.all_Packet_store;
      this.dashboard.push(event.data.arg1)
      console.log('this.dashboard from dynamic',event.all_Packet_store)



    }


  }





  emitDuplicateTitle(event: any) {
    console.log('event check ', event)
    this.dashboard.push(event.arg1)
    this.updateSummary('','update_tile')

  }


  // emitDelete1(event: any) {
  //   console.log('event check', event)
  //   this.deleteTile(event.arg1, event.arg2)

  // }

  // emitDelete2(event: any) {
  //   console.log('event check', event)
  //   this.deleteTile(event.arg1, event.arg2)

  // }

  // emitDelete3(event: any) {
  //   console.log('event check', event)
  //   this.deleteTile(event.arg1, event.arg2)

  // }
  // emitDelete4(event: any) {
  //   console.log('event check', event)
  //   this.deleteTile(event.arg1, event.arg2)

  // }
  // emitDelete5(event: any) {
  //   console.log('event check', event)
  //   this.deleteTile(event.arg1, event.arg2)

  // }
  emitDelete6(event: { data: { arg1: any; arg2: number }; all_Packet_store: any }) {
    console.log('event check from delete', event.all_Packet_store)
    console.log('event.data.arg1 check',event.data.arg1)
    this.deleteTile(event.data.arg1, event.data.arg2,event.all_Packet_store)

  }
  // emitDeleteTitle(event: any) {
  //   console.log('event check', event)
  //   this.deleteTile(event.arg1, event.arg2)

  // }

  bindDataToGridster(data: any) {
    console.log('bindDataToGridster data checking', data);

    if (data && typeof data === 'object' && Array.isArray(data.jsonData)) {
      this.dashboard = data.jsonData.map((item: any, index: number) => {
        return {
          cols: 2,
          rows: 2,
          y: Math.floor(index / 6),
          x: (index % 6) * 2,
          title: `Item ${index + 1}`, // Adjust as necessary
          // Include all data properties without hardcoding
          ...item // Spread the item properties into the dashboard item
        };
      });
      console.log('this.dashboard for gridster check', this.dashboard);
    } else {
      console.error('Expected data to contain jsonData array, but got:', data);
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
    console.log('Selected Icon:', selectedIcon);
    console.log('Source:', source);

    // Implement your logic here, for example:
    if (selectedIcon) {
      // Update any necessary state or perform actions based on the selected icon
      // Example: You could set the icon's value to another control or trigger a service
      // this.someOtherControl.setValue(selectedIcon.value);
    } else {
      // Handle the case when no icon is selected (if needed)
      console.log('No icon selected.');
    }
  }

  openModal(flag: string, getValues?: any, content?: any): void {
    console.log('getValues inside openModal', getValues);
  
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
console.log('selectedTab checking',this.selectedTab)
  
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
      LiveDashboard:''
      
      
    });
  
    // Open modal for new entry
    this.modalService.open(content, { size: 'lg' });
  }
  

  private handleEditModal(getValues: any, content: any): void {
    console.log('getValueschecking',getValues)
    if (getValues) {
      this.showHeading = false;
      this.showModal = true;
      this.cd.detectChanges();
         this.tilesListDefault = 'Tiles'

      console.log('this.createSummaryField from editModal', this.createSummaryField);

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
        LiveDashboard: getValues.LiveDashboard
      });
      this.cd.detectChanges(); 
    }
  }

  previewIcon(event: any) {
    // Find the icon based on the selected value
    const selectedIcon = this.iconsList.find((packet: any) => {
      return packet.value === this.createSummaryField.get('iconSelect')?.value;
    });

    // Perform a deep copy if selectedIcon is found
    if (selectedIcon) {
      this.previewObjDisplay = JSON.parse(JSON.stringify(selectedIcon)); // Deep copy
      console.log(" this.previewObjDisplay ", this.previewObjDisplay);
    } else {
      console.warn("No matching icon found.");
    }
    this.cdr.detectChanges()
  }

  private handleEditModalHtml(getValues: any, content: any): void {
    console.log('getValues checking for ', getValues);
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
        LiveDashboard:getValues.LiveDashboard

          // Assign the entire icon object here
      });
      console.log('this.createSummaryField from editModal', this.createSummaryField);
      if (typeof getValues.iconObject == "string") {
        this.previewObjDisplay = JSON.parse(getValues.iconObject)
      } else {
        this.previewObjDisplay = getValues.iconObject
      }
    }

    // Open modal for editing
    this.modalService.open(content, { size: 'lg' });
  }





  deleteCompany(value: any) {

    this.summarySK = value;

    console.log("Delete this :", value);

    this.allCompanyDetails = {
      PK: this.SK_clientID + "#" + value + "#summary#main",
      SK: 1
    }

    console.log("All summary Details :", this.allCompanyDetails);

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
      console.log('error for deleting', err);
    })
  }


  delete(id: number) {
    console.log("Deleted username will be", id);
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

     

    })
  }








  saveKPIWidget() {
    if (this.createKPIWidget.valid) {
      // Logic to save the KPI Widget data
      console.log('Form Data:', this.createKPIWidget.value);
      // Close the modal or handle success feedback
    } else {
      console.log('Form is invalid');
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

    console.log('this.dashboard after duplicating a tile:', this.dashboard);

    // Trigger change detection to ensure the UI updates
    this.cdr.detectChanges();

    // Update summary to handle the addition of the duplicated tile
    this.updateSummary('', 'add_tile');
  }

  getGridDetails(data: any) {
    console.log('data checking before',data)
    this.dashboard = data;
    console.log('this.dashboard check', this.dashboard)
    //console.log('myh grid',this.grid_details)

  }
  getGridDetails1(data: any) {
    this.dashboard = data;
    console.log('this.dashboard check', this.dashboard)
    //console.log('myh grid',this.grid_details)

  }
  getGridDetails2(data: any) {
    console.log('data checking from emit',data)
    this.dashboard = data;
    console.log('this.dashboard check', this.dashboard)
    //console.log('myh grid',this.grid_details)

  }










  shouldShowItem(item: any, index: number): boolean {
    // Replace this logic with your condition to hide or show the item
    return false; // This will hide all items
  }


  updateSummaryHelper(event: any) {
    console.log('event check for save', event)
    this.updateSummary('', event)

  }
  updateSummaryHelper1(event: any) {
    console.log('event check for save', event)
    this.updateSummary('', event)
  }

  updateSummaryHelper2(event: { data: any; arg2: any }) {
    console.log('Data received:', event.data);
    console.log('Arg2 received:', event.arg2);
  
    // Reinitialize this.allCompanyDetails using the received data
    this.allCompanyDetails = event.data;
  
    console.log('Updated allCompanyDetails before updateSummary:', this.allCompanyDetails);
  
    // Pass the unpacked arguments to updateSummary
    this.isGirdMoved = true;
    this.updateSummary(event.data, event.arg2);
    // setTimeout(() => {
    //   window.location.reload()
    // }, 1000);
   
  }
  
  

  allPacketStoreReceiver(event: any) {
    console.log(event)
    this.all_Packet_store = event

  }

  allPacketStoreReceiver1(event: any) {
    console.log(event)
    this.all_Packet_store = event

  }
  allPacketStoreReceiver2(event: any) {
    console.log(event)
    this.all_Packet_store = event

  }
  duplicateSummaryDashboardData(event: any) {
    console.log('Duplicate dashboard event:', event);
  
    // Call the summary creation function with the duplicated data
    this.createNewSummaryDuplicate(event);
  }
  createNewSummaryDuplicate(duplicateData: any) {
    console.log('duplicateData check',duplicateData)
    this.defaultValue = 'Tiles';
  
    // Validate the input
    if (this.isDuplicateID || this.isDuplicateName || this.createSummaryField.invalid) {
      return; // Prevent saving if there are errors
    }
  
    const tempClient = `${this.SK_clientID}#summary#lookup`;
    console.log('tempClient checking', tempClient);
  
    const createdDate = Math.ceil(new Date().getTime() / 1000); // Created date
    const updatedDate = Math.ceil(new Date().getTime() / 1000); // Updated date
    // LiveDashboard:this.createSummaryField.value.LiveDashboard,
  
    // Prepare summary details using duplicateData
    this.allCompanyDetails = {
      summaryID: duplicateData.summaryID,
      summaryName: duplicateData.summaryName,
      summaryDesc: duplicateData.summaryDesc,
      summaryIcon: duplicateData.summaryIcon,
      iconObject: duplicateData.iconObject,
      LiveDashboard:duplicateData.LiveDashboard,
      crDate: createdDate,
      upDate: updatedDate,
      createdUser: this.getLoggedUser.username, // Set the creator's username

    };
  
    console.log('Summary data:', this.allCompanyDetails);
  
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
        grid_details:duplicateData.grid_details,
        created: createdDateISO,
        updated: updatedDateISO,
        createdUser: this.allCompanyDetails.createdUser,
        iconObject: this.allCompanyDetails.iconObject,
        tilesList: this.defaultValue,
      }),
    };
  
    console.log('TempObj is here:', tempObj);
  
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
    };
  
    // API call to create the summary
    this.api
      .CreateMaster(tempObj)
      .then(async (value: any) => {
        await this.createLookUpSummary(items, 1, tempClient);
  
        console.log('Value from create master:', value);
  
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
        console.log('Error in creation:', err);
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

      console.log('this.dashboard after adding new tile', this.dashboard);

      this.updateSummary('', 'add_tile');
      this.createKPIWidget6.patchValue({
        widgetid: uniqueId // Set the ID in the form control
      });

    }




  }


















  onModeChange(event: Event): void {
    console.log('Event:', event);

    // If you want to see specific properties:
    console.log('Event Type:', event.type); // Should log "click"
    console.log('Target Element:', event.target); // Logs the clicked element
    console.log('Current Target:', event.currentTarget); // Logs the element the event listener is attached to

    // Cast the target to HTMLElement if you need to access its properties
    const targetElement = event.target as HTMLElement;
    console.log('Target Element Classes:', targetElement.className);
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


//   createNewSummary() {
//     this.defaultValue = 'Tiles'
//     if (this.isDuplicateID || this.isDuplicateName || this.createSummaryField.invalid) {
//       return; // Prevent saving if there are errors
//     }



//     let tempClient = this.SK_clientID + "#summary" + "#lookup";
//     console.log('tempClient checking', tempClient);


//     const createdDate = Math.ceil((new Date()).getTime() / 1000); // Created date
//     const updatedDate = Math.ceil((new Date()).getTime() / 1000); // Updated date

//     // Prepare summary details
//     this.allCompanyDetails = {
//       summaryID: this.createSummaryField.value.summaryID,
//       summaryName: this.createSummaryField.value.summaryName,
//       summaryDesc: this.createSummaryField.value.summarydesc,

//       // jsonData: parsedJsonData,
//       summaryIcon: this.createSummaryField.value.iconSelect,
//       iconObject: this.previewObjDisplay,

//       // Add the selected icon
//       crDate: createdDate, // Created date
//       upDate: updatedDate,  // Updated date
//       createdUser: this.getLoggedUser.username // Set the creator's username
//     };

//     console.log("summary data ", this.allCompanyDetails);

//     // Prepare ISO date strings
//     const createdDateISO = new Date(this.allCompanyDetails.crDate * 1000).toISOString();
//     const updatedDateISO = new Date(this.allCompanyDetails.upDate * 1000).toISOString();

//     // Prepare tempObj for API call
//     const tempObj = {
//       PK: this.SK_clientID + "#" + this.allCompanyDetails.summaryID + "#summary" + "#main",
//       SK: 1,
//       metadata: JSON.stringify({
//         summaryID: this.allCompanyDetails.summaryID,
//         summaryName: this.allCompanyDetails.summaryName,
//         summaryDesc: this.allCompanyDetails.summaryDesc,
//         // jsonData: this.allCompanyDetails.jsonData,
//         summaryIcon: this.createSummaryField.value.iconSelect,
//         // Include selected icon in the metadata
//         created: createdDateISO, // Created date in ISO format
//         updated: updatedDateISO,   // Updated date in ISO format
//         createdUser: this.allCompanyDetails.createdUser, // Use the persisted createdUser
//         iconObject: this.allCompanyDetails.iconObject,
//         tilesList:this.defaultValue 

//       })
//     };
//     // Now, patch the 'tilesList' form control after creating the summary
// this.createSummaryField.patchValue({
//   tilesList: this.defaultValue // Set the value to 'Widget'
// });

//     console.log("TempObj is here ", tempObj);
//     const temobj1: any = JSON.stringify(this.createSummaryField.value.iconSelect)
//     // Prepare items for further processing
//     console.log("this.createSummaryField.value.iconSelec", this.createSummaryField.value.iconSelect)
//     console.log("temobj1", temobj1)
//     const items = {
//       P1: this.createSummaryField.value.summaryID,
//       P2: this.createSummaryField.value.summaryName,
//       P3: this.createSummaryField.value.summarydesc,
//       P4: updatedDate,  // Updated date
//       P5: createdDate,   // Created date
//       P6: this.allCompanyDetails.createdUser,  // Created by user
//       P7: this.getLoggedUser.username,          // Updated by user
//       P8: JSON.stringify(this.previewObjDisplay),
//       P9: this.createSummaryField.value.iconSelect // Add selected icon
//     };

//     // API call to create the summary
//     this.api.CreateMaster(tempObj).then(async (value: any) => {
//       await this.createLookUpSummary(items, 1, tempClient);

//       this.datatableConfig = {};
//       this.lookup_data_summary = [];

//       console.log('value check from create master', value);
//       if (items || value) {
//         console.log('items check from create master', items);

//         // Call the loadData function
//         this.loadData();

//         // Show a success alert and handle the "OK" button click
//         Swal.fire({
//           position: 'center', // Center the alert
//           icon: 'success', // Alert type
//           title: 'New summary successfully created', // Title text
//           showConfirmButton: true, // Display the OK button
//           confirmButtonText: 'OK', // Customize the OK button text
//           allowOutsideClick: false, // Prevent closing the alert by clicking outside
//         }).then((result) => {
//           if (result.isConfirmed) {
//             // This block is executed when the "OK" button is clicked
//             if (items && items.P1) {
//               this.dashboardOpen(items.P1);
//           // Pass item.P1 to viewItem
//             }
//             if (this.modalRef) {
//               this.modalRef.close(); // Close the modal
//             }
//           }
//         });
//       }

//       else {
//         Swal.fire({
//           position: 'top-end',
//           icon: 'error',
//           title: 'Failed to create summary',
//           showConfirmButton: false,
//           timer: 1500
//         });
//       }

//     }).catch(err => {
//       console.log('err for creation', err);
//       this.toast.open("Error in adding new Summary Configuration ", "Check again", {
//         duration: 5000,
//         horizontalPosition: 'right',
//         verticalPosition: 'top',
//       });
//     });
//   }







  async createLookUpSummary(item: any, pageNumber: number, tempclient: any) {
    console.log('temp client checking from lookupsummary', tempclient)
    console.log('item checking from lookup', item)


    try {
      console.log("iam a calleddd dude", item, pageNumber);
      const response = await this.api.GetMaster(tempclient, pageNumber);
      console.log('response check', response)

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

        console.log('newdata 11111111 :>> ', newdata);

        let Look_data: any = {
          PK: tempclient,
          SK: response.SK,
          options: JSON.stringify(newdata),
        };

        const createResponse = await this.api.UpdateMaster(Look_data);
        console.log('createResponse :>> ', createResponse);
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

        console.log(Look_data);

        const createResponse = await this.api.CreateMaster(Look_data);
        console.log(createResponse);
      } else {
        await this.createLookUpSummary(item, pageNumber + 1, tempclient);
      }
    } catch (err) {
      console.log('err :>> ', err);
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
        console.log('this.lookup_data_summaryCopy check', this.lookup_data_summaryCopy);
  
        // Sort the records based on P4 (or another timestamp field) in descending order
        this.lookup_data_summaryCopy.sort((a, b) => b.P4 - a.P4);
        console.log('Sorted Data:', this.lookup_data_summaryCopy);
  
        // Check the permission ID before applying the filter
        if (this.userPermission === "All") {
          console.log("Permission is 'All'. Displaying all dashboards...");
          // No filtering needed, show all data
        } else {
          // If permissionIdLocal is not 'All', then apply permissions-based filtering

          console.log('Restricted permissions. Filtering dashboards...',this.summaryPermission);
          if (this.summaryPermission.includes('None')) {
            this.lookup_data_summaryCopy = []; 
            this.isNone =true
            console.log("Permission includes 'None'. No dashboards will be displayed.");
        // Set the data to an empty array
          } else if (this.summaryPermission.includes('All')) {
            console.log("Permission is 'All'. Displaying all dashboards...");
            // No filtering needed, show all data
          }else {
            console.log("Restricted permissions. Filtering dashboards...");
            this.lookup_data_summaryCopy = this.lookup_data_summaryCopy
              .filter((item: any) => this.summaryPermission.includes(item.P1)) // Apply permission filter
              .reduce((uniqueItems: any[], currentItem: any) => {
                // Check if the current item's P1 is already in the uniqueItems array
                if (!uniqueItems.some(item => item.P1 === currentItem.P1)) {
                  uniqueItems.push(currentItem); // If not, add it to the array
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
              console.log('Parsed Icon Object:', parsedIcon);
  
              // Store the parsed icon back into the object
              item.parsedIcon = parsedIcon;
  
              // Access the properties if needed
              console.log('Icon Value:', parsedIcon.value);
              console.log('Icon Label:', parsedIcon.label);
            } catch (error) {
              console.error('Error parsing P8:', error);
            }
          } else {
            console.warn('P8 not found for item:', item);
          }
        });
  
        console.log('Final parsed and filtered data:', this.lookup_data_summaryCopy);
  
        this.cdr.detectChanges(); // Ensure UI updates
      })
      .catch((error: any) => {
        console.error('Failed to load company lookup data:', error);
        this.cdr.detectChanges(); // Ensure UI updates
      });
  }
  
  


  checkUniqueIdentifier(enteredID: string): void {
    if (!enteredID) {
      this.errorForUniqueID = null; // Reset error if input is empty
      this.isDuplicateID = false;
      return;
    }

    const isDuplicateID = this.lookup_data_summaryCopy.some(item => item.P1 === enteredID);
    console.log('Validation for ID:', enteredID, this.lookup_data_summaryCopy);

    if (isDuplicateID) {
      this.errorForUniqueID = `ID "${enteredID}" is already Exist. Please enter a unique ID.`;
      this.isDuplicateID = true; // Update the flag for the save button
    } else {
      this.errorForUniqueID = null;
      this.isDuplicateID = false; // Reset the flag
    }
  }
  onIDChange(event: Event): void {
    let currentID = (event.target as HTMLInputElement).value;
    console.log('currentID checking',currentID)
  
    // Check if spaces are present before or after trimming
    const hasLeadingOrTrailingSpaces = currentID !== currentID.trim();
    
    if (hasLeadingOrTrailingSpaces) {
      this.errorForUniqueID = 'Leading or trailing spaces are not allowed.';
      this.isValidID = false;  // Mark ID as invalid due to spaces
    } else {
      // Regular expression to allow only alphanumeric characters and underscores
      const validIDPattern = /^[a-zA-Z0-9_]+$/;
  
      if (!validIDPattern.test(currentID.trim())) {
        this.errorForUniqueID = 'Special characters (including spaces or slash) are not allowed. Use only letters, numbers, and underscores.';
        this.isValidID = false;  // Mark ID as invalid
      } else {
        this.errorForUniqueID = null;  // Clear the error if input is valid
        this.isValidID = true;  // Mark ID as valid
      }
    }
  
    // Validate only if the input value has changed
    if (currentID !== this.previousValue) {
      this.previousValue = currentID; // Update previous value
      this.checkUniqueIdentifier(currentID); // Check for uniqueness if necessary
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

  fetchCompanyLookupdataOnit(sk: any): any {
    console.log("I am called snn");
    console.log('this.SK_clientID check lookup', this.SK_clientID);

    return new Promise((resolve, reject) => {
      this.api.GetMaster(this.SK_clientID + "#summary" + "#lookup", sk)
        .then(response => {
          if (response && response.options) {
            if (typeof response.options === 'string') {
              let data = JSON.parse(response.options);
              console.log("d1 =", data);

              if (Array.isArray(data)) {
                const promises = [];

                for (let index = 0; index < data.length; index++) {
                  const element = data[index];
                  console.log('element check', element);

                  if (element !== null && element !== undefined) {
                    const key = Object.keys(element)[0];
                    const { P1, P2, P3, P4, P5, P6, P7, P8, P9 } = element[key];
                    this.lookup_data_summary1.push({ P1, P2, P3, P4, P5, P6, P7, P8, P9 });
                    console.log("d2 =", this.lookup_data_summary1);
                  } else {
                    break; // This may need refinement based on your data structure
                  }
                }

                // Recursive call to fetch more data
                if (data.length > 0) { // Ensure there is data to fetch recursively
                  promises.push(this.fetchCompanyLookupdataOnit(sk + 1));
                }

                // Wait for all promises to resolve
                Promise.all(promises)
                  .then(() => resolve(this.lookup_data_summary1))
                  .catch(reject);
              } else {
                console.error('Invalid data format - not an array.');
                reject(new Error('Invalid data format - not an array.'));
              }
            } else {
              console.error('response.options is not a string.');
              reject(new Error('response.options is not a string.'));
            }
          } else {
            console.log("this.lookup_data_summary1 checking", this.lookup_data_summary1);
            resolve(this.lookup_data_summary1); // Resolve if no valid response
          }
        })
        .catch(error => {
          console.error('Error:', error);
          reject(error);
        });
    });
  }
  // this.datatableConfig = {};
  // this.lookup_data_summary = [];
  // this.fetchCompanyLookupdata(page, pageSize)
  // const page = Math.floor(dataTablesParameters.start / dataTablesParameters.length) + 1;
  // const pageSize = dataTablesParameters.length;

  // async showTable() {
  //   console.log("Show DataTable is called BTW");
  
  //   this.datatableConfig = {};
  //   this.lookup_data_summary = [];
  
  //   this.datatableConfig = {
  //     serverSide: true,
  //     processing: true,
  //     order: [[3, 'desc']], // Set default sorting by 'Updated' column in descending order
  //     ajax: (dataTablesParameters: any, callback) => {
  //       const page = Math.floor(dataTablesParameters.start / dataTablesParameters.length) + 1;
  //       const pageSize = dataTablesParameters.length;
  
  //       // Fetch paginated data with server-side sorting
  //       this.fetchCompanyLookupdata(page, pageSize)
  //         .then((resp: any) => {
  //           console.log('resp check',resp)
  //           // Ensure data is sorted by Updated (P4) in descending order
  //           this.responseData = (resp.data || []).sort((a:any, b:any) => b.P4 - a.P4);
  //           console.log('this.responseData check',this.responseData)
  //           const totalRecords = resp.totalRecords || 0;
            
  //           console.log('totalRecords check',totalRecords)
  
  //           // Provide the response to DataTable
  //           callback({
  //             draw: dataTablesParameters.draw,
  //             recordsTotal: totalRecords,
  //             recordsFiltered: totalRecords,
  //             data: this.responseData,
  //           });
  
  //           console.log("Sorted Paginated Response Data:", this.responseData);
  //         })
  //         .catch((error: any) => {
  //           console.error('Error fetching user lookup data:', error);
  
  //           // Provide an empty dataset in case of an error
  //           callback({
  //             draw: dataTablesParameters.draw,
  //             recordsTotal: 0,
  //             recordsFiltered: 0,
  //             data: [],
  //           });
  //         });
  //     },
  //     columns: [
  //       { title: '<span style="color: black;">ID</span>', data: 'P1', render: function (data, type, full) {
  //         const colorClasses = ['success', 'info', 'warning', 'danger'];
  //         const randomColorClass = colorClasses[Math.floor(Math.random() * colorClasses.length)];
          
  //         const initials = data[0].toUpperCase();
  //         const symbolLabel = `
  //           <div class="symbol-label fs-3 bg-light-${randomColorClass} text-${randomColorClass}">
  //             ${initials}
  //           </div>
  //         `;
  //         return `<span style="color:Black; font-weight: bold;">${data}</span>`;
  //     }}
  //     ,
  //       { title: '<span style="color: black;">Name</span>', data: 'P2' },
  //       { title: '<span style="color: black;">Description</span>', data: 'P3' },
  //       {
  //         title: '<span style="color: black;">Updated</span>',
  //         data: 'P4',
  //         render: function (data) {
  //           const updatedDate = new Date(data * 1000);
  //           const formattedDate = new Intl.DateTimeFormat('en-US', {
  //             weekday: 'short',
  //             day: '2-digit',
  //             month: 'short',
  //           }).format(updatedDate);
  //           const formattedTime = updatedDate.toLocaleTimeString('en-US', {
  //             hour12: false,
  //             hour: '2-digit',
  //             minute: '2-digit',
  //           });
  //           return `${formattedDate} ${formattedTime}`;
  //         },
  //       },
  //       {
  //         title: '<span style="color: black;">Created</span>',
  //         data: 'P5',
  //         render: function (data) {
  //           const createdDate = new Date(data * 1000);
  //           const formattedDate = new Intl.DateTimeFormat('en-US', {
  //             weekday: 'short',
  //             day: '2-digit',
  //             month: 'short',
  //           }).format(createdDate);
  //           const formattedTime = createdDate.toLocaleTimeString('en-US', {
  //             hour12: false,
  //             hour: '2-digit',
  //             minute: '2-digit',
  //           });
  //           return `${formattedDate} ${formattedTime}`;
  //         },
  //       },
  //       { title: '<span style="color: black;">Created UserName</span>', data: 'P6' },
  //       { title: '<span style="color: black;">Updated UserName</span>', data: 'P7' },
  //     ],
  //     createdRow: (row, data, dataIndex) => {
  //       $('td:eq(0)', row).addClass('');
  //     },
  //   };
  // }
  async showTable() {
    console.log("Show DataTable is called BTW");
  
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
            console.log("resp check", resp);
            let responseData = resp || []; // Default to an empty array if resp is null
            console.log("responseData", responseData);
  
            // Apply Permission-Based Filtering
            if (this.userPermission === "All") {
              console.log('permissionIdCheck',this.permissionIdCheck)
              console.log("Permission is 'All'. Displaying all data.");
              // No filtering needed, show all data
            } else {
              console.log("Restricted permissions. Filtering data...");
              if (this.summaryPermission.includes('None')) {
                console.log("Permission includes 'None'. No data will be displayed.");
                responseData = []; // Set responseData to an empty array
              } else if (this.summaryPermission.includes('All')) {
                console.log("Permission is 'All'. Displaying all data.");
                // No filtering needed
              } else {
                console.log("Restricted permissions. Filtering data...");
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
  
            console.log("Filtered Data after permissions and search:", filteredData);
  
            // Implement pagination by slicing the filtered data
            const paginatedData = filteredData.slice(start, start + length);
  
            callback({
              draw: dataTablesParameters.draw,
              recordsTotal: filteredData.length, // Total records after search
              recordsFiltered: filteredData.length, // Total records after filtering
              data: paginatedData, // Data for the current page
            });
  
            console.log("Paginated Data for current page", paginatedData);
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
          title: '<span style="color: black;">Dashboard ID</span>',
          data: 'P1',
          render: function (data, type, full) {
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
                <div class="symbol symbol-circle symbol-50px overflow-hidden me-3" data-action="view" data-id="${full.id}">
                  <a href="javascript:;">
                    ${symbolLabel}
                  </a>
                </div>
                <div class="d-flex flex-column" data-action="view" data-id="${full.id}">
                  <a href="javascript:;" class="text-gray-800 text-hover-primary mb-1">${data}</a>
                </div>
              </div>
            `;
          },
        },
        {
          title: '<span style="color: black;">Name</span>',
          data: 'P2',
        },
        {
          title: '<span style="color: black;">Description</span>',
          data: 'P3',
        },
        {
          title: '<span style="color: black;">Updated</span>',
          data: 'P4',
          render: function (data) {
            const updatedDate = new Date(data * 1000);
            const formattedDate = new Intl.DateTimeFormat('en-US', {
              weekday: 'short',
              day: '2-digit',
              month: 'short',
            }).format(updatedDate);
            const formattedTime = updatedDate.toLocaleTimeString('en-US', {
              hour12: false,
              hour: '2-digit',
              minute: '2-digit',
            });
            return `${formattedDate} ${formattedTime}`;
          },
        },
        {
          title: '<span style="color: black;">Created</span>',
          data: 'P5',
          render: function (data) {
            const createdDate = new Date(data * 1000);
            const formattedDate = new Intl.DateTimeFormat('en-US', {
              weekday: 'short',
              day: '2-digit',
              month: 'short',
            }).format(createdDate);
            const formattedTime = createdDate.toLocaleTimeString('en-US', {
              hour12: false,
              hour: '2-digit',
              minute: '2-digit',
            });
            return `${formattedDate} ${formattedTime}`;
          },
        },
        {
          title: '<span style="color: black;">Created UserName</span>',
          data: 'P6',
        },
        {
          title: '<span style="color: black;">Updated UserName</span>',
          data: 'P7',
        },
      ],
      createdRow: (row: Node, data: any, dataIndex: number) => {
        console.log('Data from columns', data);
      },
      pageLength: 10, // Set default page size to 10
    };
  }
  
  
  
  



  jsondata(jsondata: any): string {
    throw new Error('Method not implemented.');
  }

  // updateSummary(value: any, key: any) {
  //   this.createSummaryField.get('summaryID')?.enable();
  //   this.allCompanyDetails = this.constructAllCompanyDetails();
  //   console.log('Updated allCompanyDetails:', this.allCompanyDetails);
  
  //   this.formattedDashboard = this.formatDashboardTiles(this.dashboard);
  //   console.log('Formatted Dashboard:', this.formattedDashboard);
  
  //   let tempObj = {
  //     PK: `${this.SK_clientID}#${this.allCompanyDetails.summaryID}#summary#main`,
  //     SK: 1,
  //     metadata: JSON.stringify({
  //       ...this.allCompanyDetails,
  //       grid_details: this.formattedDashboard
  //     })
  //   };
  
  //   this.validateAndSubmit(tempObj, key);
  // }
  updateSummary(value: any, key: any) {

    // try {
    //   if (typeof this.queryParams.filterTileConfig === 'string') {
    //     this.updatedQueryPramas = JSON.parse(this.queryParams.filterTileConfig);
    //   } else {
    //     console.error('Invalid or undefined filterTileConfig:', this.queryParams.filterTileConfig);
    //     this.updatedQueryPramas = {}; // default to an empty object or handle as needed
    //   }
    // } catch (e) {
    //   console.error('Error parsing filterTileConfig:', e);
    //   this.updatedQueryPramas = {}; // default to an empty object or handle as needed
    // }

    // console.log('this.updatedQueryPramas', this.updatedQueryPramas);

    console.log('this.getLoggedUser check update', this.getLoggedUser);
  
    // Extract username for later use
    this.extractUserName = this.getLoggedUser.username;
    console.log('this.extractUserName checking', this.extractUserName);
  
    console.log('all_Packet_store checking', this.all_Packet_store);
  
    // Construct allCompanyDetails if missing
    if (!this.allCompanyDetails) {
      this.allCompanyDetails = this.constructAllCompanyDetails();
      console.log('Constructed allCompanyDetails:', this.allCompanyDetails);
    }
  
    // Only populate missing fields to avoid overwriting existing values
    if (this.all_Packet_store) {
      this.allCompanyDetails = {
        ...this.allCompanyDetails, // Preserve existing data
        summaryID: this.allCompanyDetails.summaryID || this.all_Packet_store.summaryID,
        summaryName: this.allCompanyDetails.summaryName || this.all_Packet_store.summaryName,
        summaryDesc: this.allCompanyDetails.summaryDesc || this.all_Packet_store.summaryDesc,
        iconObject: this.allCompanyDetails.iconObject || this.all_Packet_store.iconObject,
        LiveDashboard:this.allCompanyDetails.LiveDashboard ||''
      };
      console.log('Updated allCompanyDetails with Packet Store:', this.allCompanyDetails);
    }
  
    // Ensure critical fields have default fallbacks without altering existing logic
    this.allCompanyDetails.summaryID = this.allCompanyDetails.summaryID ;
    this.allCompanyDetails.summaryName = this.allCompanyDetails.summaryName ;
    this.allCompanyDetails.summaryDesc = this.allCompanyDetails.summaryDesc ;

  
    console.log('Final allCompanyDetails:', this.allCompanyDetails);
  
    // Enable summaryID field
    this.createSummaryField.get('summaryID')?.enable();
  
    // Format dashboard tiles
    this.formattedDashboard = this.formatDashboardTiles(this.dashboard) || [];
    console.log('Formatted Dashboard:', this.formattedDashboard);
  
    // Set timestamps and users
    const originalCreatedDate =
      this.allCompanyDetails.crDate || Math.ceil(new Date().getTime() / 1000);
    const originalCreatedUser =
      this.allCompanyDetails.createdUser || this.getLoggedUser.username;
  
    const updatedDate = Math.ceil(new Date().getTime() / 1000);
  
    // Construct tempObj for validation and submission
    let serializedQueryParams = JSON.stringify(this.updatedQueryPramas);
console.log('Serialized Query Params:', serializedQueryParams);
    let tempObj = {
      PK: `${this.SK_clientID}#${this.allCompanyDetails.summaryID}#summary#main`,
      SK: 1,
      metadata: JSON.stringify({
        ...this.allCompanyDetails,
        grid_details: this.formattedDashboard,
      // Include params here
      }),
    };
  
    console.log('TempObj being validated and submitted:', tempObj);
  
    // Validate and submit the object
    this.validateAndSubmit(tempObj, key);
  
    // Prepare items for fetchTimeMachineById
    const items = {
      P1: this.allCompanyDetails.summaryID,
      P2: this.allCompanyDetails.summaryName,
      P3: this.allCompanyDetails.summaryDesc,
      P4: updatedDate,
      P5: originalCreatedDate,
      P6: originalCreatedUser,
      P7: this.extractUserName,
      P8: JSON.stringify(this.previewObjDisplay),
      P9: this.allCompanyDetails.iconSelect,
    };
  
    console.log('Items prepared for fetchTimeMachineById:', items);
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
      this.fetchTimeMachineById(1, items.P1, 'update', items);
    } else {
      console.warn('fetchTimeMachineById skipped: Missing summaryID (P1).');
    }
  
    // Trigger change detection
    this.cd.detectChanges();
  }
  
  
  
  
  
  private validateAndSubmit(tempObj: any, actionKey: string) {
    this.isGirdMoved = false;
    console.log('actionKey checking', actionKey);
  
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
      console.log('API Response:', response);
      if (response && response.metadata) {
        const successTitle = {
          create: 'Summary created',
          saveDashboard: 'Dashboard saved',
          add_tile: 'Widget Added',
          update_tile: 'Widget Updated',
          delete_tile: 'Tile deleted',
          add_map: 'Map Added',
          update_map: 'Map Updated',
          deleteTile: 'Tile deleted',
          update: 'Summary updated',
          update_Dashboard: 'Dashboard Filteration is updated',
          filter_add: 'Dashboard Filteration is added',

          add_table:'Table Widget Added',
          update_table:'Table Widget Updated',
          add_multiTable:'Table Widget Added',
          update_multiTable:'Table Widget Updated',
          query_applied:'Query Applied'
        }[actionKey] || 'Dashboard changes saved';
  
        console.log('Action key condition check:', actionKey);
  
        // Show alert
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: `${successTitle} successfully`,
          showConfirmButton: true
        }).then((result) => {
          if (result.isConfirmed) {
            // Reload the page for specific action keys
            if (actionKey === 'add_map' || actionKey === 'update_map') {
              window.location.reload(); // Reloads the current window
            } else if (actionKey === 'update_Dashboard' || actionKey === 'filter_add') {
              this.reloadPage();  // Call the reloadPage function
            }
            else if (actionKey === 'add_table' || actionKey === 'update_table'){
              this.reloadPage(); 
            }
            else if(actionKey === 'add_multiTable' || actionKey === 'update_multiTable'){
              this.reloadPage(); 

            }
          }
        });
  
        // Additional logic for 'update'
        if (actionKey === 'update') {
          this.route.paramMap.subscribe(params => {
            this.routeId = params.get('id');
            if (this.routeId) {
              // this.openModalHelpher(this.routeId);
              this.editButtonCheck = false;
              console.log('Route ID found, opening modal:', this.routeId);
            }
          });
        }
  
        this.loadData();
        if (this.modalRef) this.modalRef.close();
      } else {
        throw new Error('Invalid response structure');
      }
    }).catch(err => {
      console.error('Error:', err);
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: `Failed to ${actionKey} summary`,
        text: err.message,
        showConfirmButton: false,
        timer: 1500
      });
    });
  }
  
  
  
  
  
  private formatField(value: any, fieldName: string = ''): string {
    try {
      let parsedValue;
  
      // ✅ Ensure `htmlTextArea` is always properly stringified

      
      
  
      // Step 1: Parse if the value is a string and JSON valid
      if (typeof value === 'string') {
        parsedValue = JSON.parse(value);
      } else {
        parsedValue = value; // Assume it's already parsed
      }
  
      // Step 2: Process arrays normally
      if (Array.isArray(parsedValue)) {
        const formattedArray = parsedValue.map((item) => {
          if (item.filterDescription && item.filterParameter && item.filterParameter1 && item.filterDescription1) {
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
  
      return JSON.stringify(parsedValue || []); // Convert non-arrays to string
    } catch (error) {
      console.error(`Error formatting field "${fieldName}":`, value, error);
      return JSON.stringify([]); // Return empty array string if error
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
  
      parameterName:this.formatField(tile.parameterName)







      

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
    console.log('tempClient checking', tempClient);


    const createdDate = Math.ceil((new Date()).getTime() / 1000); // Created date
    const updatedDate = Math.ceil((new Date()).getTime() / 1000); // Updated date

    // Prepare summary details
    this.allCompanyDetails = {
      summaryID: this.createSummaryField.value.summaryID,
      summaryName: this.createSummaryField.value.summaryName,
      summaryDesc: this.createSummaryField.value.summarydesc,

      // jsonData: parsedJsonData,
      summaryIcon: this.createSummaryField.value.iconSelect,
      iconObject: this.previewObjDisplay,
      LiveDashboard:this.createSummaryField.value.LiveDashboard,

      // Add the selected icon
      crDate: createdDate, // Created date
      upDate: updatedDate,  // Updated date
      createdUser: this.getLoggedUser.username, // Set the creator's username
      grid_details: []
    };

    console.log("summary data ", this.allCompanyDetails);

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
        // Include selected icon in the metadata
        created: createdDateISO, // Created date in ISO format
        updated: updatedDateISO,   // Updated date in ISO format
        createdUser: this.allCompanyDetails.createdUser, // Use the persisted createdUser
        iconObject: this.allCompanyDetails.iconObject,
        tilesList:this.defaultValue ,
        grid_details:[],
        queryParams:[],


      })
    };
    // Now, patch the 'tilesList' form control after creating the summary
this.createSummaryField.patchValue({
  tilesList: this.defaultValue // Set the value to 'Widget'
});

    console.log("TempObj is here ", tempObj);
    const temobj1: any = JSON.stringify(this.createSummaryField.value.iconSelect)
    // Prepare items for further processing
    console.log("this.createSummaryField.value.iconSelec", this.createSummaryField.value.iconSelect)
    console.log("temobj1", temobj1)
    const items = {
      P1: this.createSummaryField.value.summaryID,
      P2: this.createSummaryField.value.summaryName,
      P3: this.createSummaryField.value.summarydesc,
      P4: updatedDate,  // Updated date
      P5: createdDate,   // Created date
      P6: this.allCompanyDetails.createdUser,  // Created by user
      P7: this.getLoggedUser.username,          // Updated by user
      P8: JSON.stringify(this.previewObjDisplay),
      P9: this.createSummaryField.value.iconSelect // Add selected icon
    };
    console.log('items checking from create Summary',items)

    // API call to create the summary
    this.api.CreateMaster(tempObj).then(async (value: any) => {
      await this.createLookUpSummary(items, 1, tempClient);

      this.datatableConfig = {};
      this.lookup_data_summary = [];

      console.log('value check from create master', value);
      if (items || value) {
        console.log('items check from create master', items);

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
      console.log('err for creation', err);
      this.toast.open("Error in adding new Summary Configuration ", "Check again", {
        duration: 5000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
      });
    });
  }
  









  onAddWidgetTabClick() {
    console.log('showAddWidgetsTab:', this.showAddWidgetsTab);
    console.log('showModal:', this.showModal);
    console.log('selectedTab:', this.selectedTab);
    
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
    const tempClient = this.SK_clientID + '#summary' + '#lookup';
    console.log("Temp client is ", tempClient);
    console.log("Type of client", typeof tempClient);
    console.log("item check from fetchTimeMachine", item);
  
    try {
      const response = await this.api.GetMaster(tempClient, sk);
      console.log('response check from timeMachine', response);
  
      if (response && response.options) {
        let data: ListItem[] = await JSON.parse(response.options);
  
        // Find the index of the item with the matching id
        let findIndex = data.findIndex((obj) => obj[Object.keys(obj)[0]].P1 === id);
  
        if (findIndex !== -1) { // If item found
          if (type === 'update') {
            // Preserve the original createdDate and createdUser in the data
            const existingItem = data[findIndex][`L${findIndex + 1}`];
            item.P5 = existingItem.P5 || item.P5; // Preserve createdDate
            item.P6 = existingItem.P6 || item.P6; // Preserve createdUser
  
            data[findIndex][`L${findIndex + 1}`] = item;
  
            // Create a new array to store the re-arranged data without duplicates
            const newData = [];
  
            for (let i = 0; i < data.length; i++) {
              const originalKey = Object.keys(data[i])[0];
              const newKey = `L${i + 1}`;
  
              if (originalKey) {
                const newObj = { [newKey]: data[i][originalKey] };
                const existingIndex = newData.findIndex(obj => Object.keys(obj)[0] === newKey);
  
                if (existingIndex !== -1) {
                  Object.assign(newData[existingIndex][newKey], data[i][originalKey]);
                } else {
                  newData.push(newObj);
                }
              } else {
                console.error(`Original key not found for renaming in data[${i}].`);
              }
            }
  
            data = newData;
            this.lookup_data_summary = data;
            this.refreshFunction();
            this.cd.detectChanges();
          } else if (type === 'delete') {
            data.splice(findIndex, 1);
            this.lookup_data_summary = data;
            this.cd.detectChanges();
          }
  
          let updateData = {
            PK: tempClient,
            SK: response.SK,
            options: JSON.stringify(data),
          };
  
          await this.api.UpdateMaster(updateData);
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
    console.log('this.routeId check',this.routeId)
    this.checkAndSetFullscreen();
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

      console.log("All the clients data is here ", this.listofClientIDs)

    }
    catch (err) {
      console.log("Error fetching all the clients ");
    }
  }


  async fetchTMClientLookup(sk: any) {
    console.log("Iam called Bro");
    try {
      const response = await this.api.GetMaster("client" + "#lookup", sk);

      if (response && response.options) {
        if (typeof response.options === 'string') {
          let data = JSON.parse(response.options);
          console.log("d1 =", data);

          if (Array.isArray(data)) {
            for (let index = 0; index < data.length; index++) {
              const element = data[index];

              if (element !== null && element !== undefined) {
                const key = Object.keys(element)[0];
                const { P1, P2, P3, P4, P5, P6, P7, P8, P9 } = element[key];
                this.lookup_data_client.push({ P1, P2, P3, P4, P5, P6, P7, P8, P9 });
                console.log("d2 =", this.lookup_data_client);
              } else {
                break;
              }
            }

            // this.lookup_data_client.sort((a: any, b: any) => b.P5 - a.P5);
            // console.log("Lookup sorting", this.lookup_data_client);

            // Continue fetching recursively with fetchTMClientLookup itself
            await this.fetchTMClientLookup(sk + 1);
          } else {
            console.error('Invalid data format - not an array.');
          }
        } else {
          console.error('response.options is not a string.');
        }
      } else {
        console.log("Lookup to be displayed", this.lookup_data_client);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }


  remove(index: any) {
    console.log('remove', index);
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

    console.log("modify", `${keyLocation}--${keyDevices}`);

    // Concatenate data based on the keys
    switch (`${keyLocation}-${keyDevices}`) {
      case "All-All":
        // return [...deviceTypePermissions, ...devicePermissions]; // Assuming deviceTypePermissions is defined
        return "All-All";

      default:
        console.log("Unrecognized case");
        return '';
    }
  }
  async addFromService() {
    this.getClientID()

    try {
      const result: any = await this.api.GetMaster(this.SK_clientID + "#dynamic_form#lookup", 1);
      if (result) {
        const helpherObj = JSON.parse(result.options);
        console.log('helpherObj checking',helpherObj)
        this.formList = helpherObj.map((item: [string]) => item[0]); // Explicitly define the type
        this.listofDeviceIds = this.formList.map((form: string) => ({ text: form, value: form })); // Explicitly define the type here too
        console.log('this.formList check from location', this.formList);
      }
    } catch (err) {
      console.log("Error fetching the dynamic form data", err);
    }

    this.userdetails = this.getLoggedUser.username;
    this.userClient = this.userdetails + "#user" + "#main"
    console.log('this.tempClient from form service check', this.userClient)
    this.All_button_permissions = await this.api.GetMaster(this.userClient, 1).then(data => {

      if (data) {
        console.log('data checking from add form', data)
        const metadataString: string | null | undefined = data.metadata;

        // Check if metadataString is a valid string before parsing
        if (typeof metadataString === 'string') {
          try {
            // Parse the JSON string into a JavaScript object
            this.metadataObject = JSON.parse(metadataString);
            console.log('Parsed Metadata Object from location', this.metadataObject);
          } catch (error) {
            console.error('Error parsing JSON:', error);
          }
        } else {
          console.log('Metadata is not a valid string:', this.metadataObject);
        }
        // console.log("userPermissions iside",this.modifyList(data.location_permission,data.device_type_permission,data.device_permission))
        return this.modifyList(this.metadataObject.location_permission, this.metadataObject.form_permission) === "All-All" ? false : true

      }

    })

    console.log("this.All_button_permissions", this.All_button_permissions)
    this.locationPermissionService.fetchGlobalLocationTree()
      .then((jsonModified: any) => {
        if (!jsonModified) {
          throw new Error("No data returned");
        }

        console.log("Data from location: check", jsonModified);
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
          //console.log('selected node', $node.selected);

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
          console.log('data checking from tree', data)
          //console.log('data in tree', data);

          this.parentID_selected_node = data.node.parent
          // for (node = 0, selected_node = data.selected.length; node < selected_node; node++) {

          // }
          this.final_list = data.instance.get_node(data.selected);
          console.log('this.final_list check', this.final_list)

          //console.log('CHK THE NODE', this.final_list);

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
    //console.log('CHECK THIS LOCATION THING ', this.final_list)
    if (this.final_list.original.node_type == "location") {
      navId = this.final_list.original.summaryView;
    } else {
      navId = this.final_list.original.powerboard_view_device.id;
    }

    console.log('navId check from summary', navId)
    let navIdList = { id: navId }
    if (navId !== '') {

      // localStorage.setItem('fullscreen', 'true');
      this.viewItem(navId)

    }

  }



  setActiveTab(tab: Tabs) {

    this.activeTab = tab;

  }

  fetchDynamicFormData(value: any) {
    console.log("Data from lookup:", value);

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

          console.log('Transformed dynamic parameters:', this.listofDynamicParam);

          // Trigger change detection to update the view
          this.cdr.detectChanges();
        }
      })
      .catch((err) => {
        console.log("Can't fetch", err);
      });
  }


  parameterValue(event:any){
    console.log('event for parameter check',event)

  }

  editItem(item: any) {
    console.log('Editing item:', item);

    // Open edit modal or perform the edit action here
    // Example: this.openEditModal(item);
  }

  openModalCalender() {
    const modalRef = this.modalService.open(this.calendarModal);
    modalRef.result.then(
      (result) => {
        console.log('Closed with:', result);
        this.handleModalClose(result); // Handle logic when modal closes
      },
      (reason) => {
        console.log('Dismissed with:', reason);
      }
    );
  }
  openModalCalender1() {
    const modalRef = this.modalService.open(this.calendarModal1);
    modalRef.result.then(
      (result) => {
        console.log('Closed with:', result);
        this.handleModalClose(result); // Handle logic when modal closes
      },
      (reason) => {
        console.log('Dismissed with:', reason);
      }
    );
  }

  selectValue(value: string, modal: any) {
    console.log('Selected value:', value);

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
    console.log('Handling post modal close logic with value:', selectedValue);
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
    console.log(selectedValue); // Optional: log the selected value
  }
  onRangeSelect(selectedValue: any): void {
    // Handle any logic here if needed when the value changes
    console.log('selectedValue checking', selectedValue); // Optional: log the selected value
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
    console.log(selectedValue); // Optional: log the selected value
  }

  onValueChange6(selectedValue: any): void {
    // Handle any logic here if needed when the value changes
    console.log(selectedValue); // Optional: log the selected value
  }



  onValue(value: any) {
    // Logic to handle value change, if needed
    console.log("Selected Value:", value);
  }
  onTarget(value: any) {
    // Logic to handle value change, if needed
    console.log("Selected Value:", value);
  }

  onMaxRange1(value: any) {
    // Logic to handle value change, if needed
    console.log("Selected Value:", value);
  }









  // openKPIModal6(content: any, tile?: any, index?: number) {
  //   if (tile) {
  //     this.selectedTile = tile;
  //     this.editTileIndex6 = index !== undefined ? index : null; // Store the index, default to null if undefined
  //     console.log('Tile Object:', tile); // Log the tile object

  //     // Initialize form fields and pre-select values
  //     this.initializeTileFields6();
  //     this.createKPIWidget6.patchValue({
  //       formlist: tile.formlist,
  //       parameterName: tile.parameterName,
  //       value: tile.value,
  //       Target: tile.Target,
  //       MaxRange: tile.MaxRange,
  //       groupByFormat: tile.groupByFormat,
  //       constantValuevalue: tile.constantValuevalue,
  //       percentageValue: tile.percentageValue,
  //       constantValueTarget: tile.constantValueTarget,
  //       constantValueMaxRange: tile.constantValueMaxRange,
  //       percentageValueTarget: tile.percentageValueTarget,
  //       percentageValueMaxRange: tile.percentageValueMaxRange




  //     });

  //     this.isEditMode = true; // Set to edit mode
  //   } else {
  //     this.selectedTile = null; // No tile selected for adding
  //     this.isEditMode = false; // Set to add mode
  //     this.createKPIWidget6.reset(); // Reset the form for new entry
  //   }
  //   this.themes.forEach(theme => {
  //     theme.selected = false; // Deselect all themes
  //   });

  //   // Find the theme that matches the tile's themeColor
  //   const matchingTheme = this.themes.find(theme => theme.color === tile?.themeColor);

  //   // If a matching theme is found, set it as selected
  //   if (matchingTheme) {
  //     matchingTheme.selected = true;
  //     console.log('Matching theme found and selected:', matchingTheme);
  //   }


  //   this.modalService.open(content, { size: 'lg', ariaLabelledBy: 'modal-basic-title' });
  //   this.showTable()
  //   // 
  //   this.reloadEvent.next(true);
  // }

  selectValue6(value: string, modal: any) {
    console.log('Selected value:', value);

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
        console.log('Closed with:', result);
        this.handleModalClose(result); // Handle logic when modal closes
      },
      (reason) => {
        console.log('Dismissed with:', reason);
      }
    );
  }

  openModalCalender3() {
    const modalRef = this.modalService.open(this.calendarModal3);
    modalRef.result.then(
      (result) => {
        console.log('Closed with:', result);
        this.handleModalClose(result); // Handle logic when modal closes
      },
      (reason) => {
        console.log('Dismissed with:', reason);
      }
    );
  }

  openModalCalender4() {
    const modalRef = this.modalService.open(this.calendarModal4);
    modalRef.result.then(
      (result) => {
        console.log('Closed with:', result);
        this.handleModalClose(result); // Handle logic when modal closes
      },
      (reason) => {
        console.log('Dismissed with:', reason);
      }
    );
  }

  openModalCalender5() {
    const modalRef = this.modalService.open(this.calendarModal5);
    modalRef.result.then(
      (result) => {
        console.log('Closed with:', result);
        this.handleModalClose(result); // Handle logic when modal closes
      },
      (reason) => {
        console.log('Dismissed with:', reason);
      }
    );
  }
  openModalCalender6() {
    const modalRef = this.modalService.open(this.calendarModal6);
    modalRef.result.then(
      (result) => {
        console.log('Closed with:', result);
        this.handleModalClose(result); // Handle logic when modal closes
      },
      (reason) => {
        console.log('Dismissed with:', reason);
      }
    );
  }




  updateTile6() {
    if (this.editTileIndex6 !== null) {
      console.log('this.editTileIndex check', this.editTileIndex6);
      console.log('Tile checking for update:', this.dashboard[this.editTileIndex6]); // Log the tile being checked

      // Log the current details of the tile before update
      console.log('Current Tile Details Before Update:', this.dashboard[this.editTileIndex6]);

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
      console.log('Updated Tile Details:', this.dashboard[this.editTileIndex6]);

      // Also update the grid_details array to reflect changes
      this.all_Packet_store.grid_details[this.editTileIndex6] = {
        ...this.all_Packet_store.grid_details[this.editTileIndex6], // Keep existing properties
        ...this.dashboard[this.editTileIndex6], // Update with new values
      };
      this.openModal('Edit_ts', this.all_Packet_store)

      this.updateSummary('', 'update_tile');
      console.log('his.dashboard check from updateTile', this.dashboard)

      console.log("Updated all_Packet_store.grid_details:", this.all_Packet_store.grid_details);


      // Reset the editTileIndex after the update
      this.editTileIndex6 = null;
    } else {
      console.error("Edit index is null. Unable to update the tile.");
    }
  }




  selectValue3(value: string, modal: any) {
    console.log('Selected value:', value);

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
            console.log("Parsed data =", data);

            // Validate if parsed data is an array
            if (Array.isArray(data)) {
              for (let index = 0; index < data.length; index++) {
                const element = data[index];
                console.log("Processing element:", element);

                this.lookupId = element[0];
                console.log('Original lookupId:', this.lookupId);

                // Split the lookupId to get the numeric part
                const splitLookupId = this.lookupId.split('#')[1];
                console.log('Split lookupId (numeric part):', splitLookupId);
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
        console.log('No more options to fetch or invalid response. Stopping recursion.');
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
            console.log("Parsed data contract order master", data);

            // Validate if parsed data is an array
            if (Array.isArray(data)) {
              for (let index = 0; index < data.length; index++) {
                const element = data[index];
                console.log("Processing element:", element);
                this.contractLookupId = element[0]
                const splitContractLookupId = this.contractLookupId.split('#')[1];
                console.log('Split lookupId (numeric part):', splitContractLookupId);
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
        console.log('No more options to fetch or invalid response. Stopping recursion.');
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
        console.log('helpherObj checking ', helpherObj)

      }
    } catch (err) {
      console.log("Error fetching the dynamic form data", err);
    }
  }

  async fetchContractOrderMasterMain(sk: any, splitContractLookupId: any): Promise<void> {
    try {
      const result: any = await this.api.GetMaster(this.SK_clientID + "#Contract Order Master#" + splitContractLookupId + "#main", 1);
      if (result) {
        const helpherObj = JSON.parse(result.metadata);
        console.log('helpherObj checking contract order ', helpherObj)

      }
    } catch (err) {
      console.log("Error fetching the dynamic form data", err);
    }
  }
  toggleMode(): void {
    console.log('Current Mode (Before Toggle):', this.isEditModeView ? 'Edit Mode' : 'View Mode');
  
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
    this.updateOptions();  // Update grid options based on mode
  
    console.log('Current Mode (After Toggle):', this.isEditModeView ? 'Edit Mode' : 'View Mode');
  
    // Store the mode in localStorage
    localStorage.setItem('editModeState', this.isEditModeView.toString());
  }
  


  // gridTitle: { cols: number; rows: number; y: number; x: number; themeColor: string }[] = [
  //   { cols: 2, rows: 1, y: 0, x: 0, themeColor: '#3498db' },
  //   { cols: 2, rows: 1, y: 0, x: 2, themeColor: '#e74c3c' },
  // ];


  updateCustomLabel(event: Event): void {
    const inputValue = (event.target as HTMLElement).innerText;

    // Update the form control value without triggering Angular's change detection unnecessarily
    this.createTitle.patchValue({ customLabel: inputValue }, { emitEvent: false });
  }
  openKPIModal(KPIModal: TemplateRef<any>,modal: any) {
    this.modalService.open(KPIModal, { size: 'lg', ariaLabelledBy: 'modal-basic-title' });
    modal.dismiss();
  }

  openKPIModal1(KPIModal1: TemplateRef<any>,modal:any) {

    this.modalService.open(KPIModal1, { size: 'lg', ariaLabelledBy: 'modal-basic-title' });
    modal.dismiss();

  }
  openKPIModal2(KPIModal2: TemplateRef<any>,modal:any) {
  
    this.modalService.open(KPIModal2, { size: 'lg' });
    modal.dismiss();
 

  }
  openKPIModal3(KPIModal3: TemplateRef<any>,modal:any) {
    this.modalService.open(KPIModal3, { size: 'lg' });
    modal.dismiss();
  }
  openKPIModal4(KPIModal4: TemplateRef<any>,modal:any) {
    this.modalService.open(KPIModal4, { size: 'lg' });
    modal.dismiss();
  }
  openKPIModal5(KPIModal5: TemplateRef<any>,modal:any) {
    this.modalService.open(KPIModal5, { size: 'lg' });
    modal.dismiss();
  }
  openTitleModal(TitleModal: TemplateRef<any>,modal:any) {
    this.modalService.open(TitleModal, { size: 'lg' });
    modal.dismiss();
  }
  openChartModal1(ChartModal1: TemplateRef<any>,modal:any) {
    this.modalService.open(ChartModal1, { size: 'lg' });
    modal.dismiss();
  }
  openChartModal2(ChartModal2: TemplateRef<any>,modal:any) {
    this.modalService.open(ChartModal2, { size: 'lg' });
    modal.dismiss();
  }

  openChartModal3(ChartModal3: TemplateRef<any>,modal:any) {
    this.modalService.open(ChartModal3, { size: 'lg' });
    modal.dismiss();
  }

  openChartModal4(ChartModal4: TemplateRef<any>,modal:any) {
    this.modalService.open(ChartModal4, { size: 'lg' });
    modal.dismiss();
  }

  openChartModal5(ChartModal5: TemplateRef<any>,modal:any) {
    this.modalService.open(ChartModal5, { size: 'lg' });
    modal.dismiss();
  }
  openCloneDashboard(stepperModal: TemplateRef<any>,modal:any) {
    this.modalService.open(stepperModal, {  });
    modal.dismiss();
  }
  openDynamicTileModal(DynamicTileModal:TemplateRef<any>,modal:any){
    this.modalService.open(DynamicTileModal, {size: 'lg' });
    modal.dismiss();

  }
  openHTMLModalTile(htmlTileModal:TemplateRef<any>,modal:any){
    this.modalService.open(htmlTileModal, {size: 'lg' });
    modal.dismiss();

  }


  

  openFilterModal(FilterModal:TemplateRef<any>,modal:any){
    this.modalService.open(FilterModal, {size: 'lg' });
    modal.dismiss();

  }
  openTableModal(tableModal:TemplateRef<any>,modal:any){
    this.modalService.open(tableModal, {size: 'lg' });
    modal.dismiss();

  }
  openMapModal(MapModal:TemplateRef<any>,modal:any){
    this.modalService.open(MapModal, {size: 'lg' });
    modal.dismiss();

  }
  openMultiTableModal(MultiTableModal:TemplateRef<any>,modal:any){
    this.modalService.open(MultiTableModal, {size: 'lg' });
    modal.dismiss();

  }

  refreshHelper(data:any){
    if(data){
      // setTimeout(() => {
        
      // this.reloadPage()
      // }, 1000);

    }

  }
  helperInfo(event: any, templateref: any) {
    console.log('event checking', event);
    this.modalService.open(templateref, { size: 'lg' });
  
    setTimeout(() => {
      this.emitEvent = event;
      this.cdr.detectChanges();  // Detect changes after the modal is open
    }, 500);
  }
  
  helperminiTableData(helperminiTableData:any){
    console.log('event checking mini table',helperminiTableData)

    this.miniTableData = helperminiTableData

    


  }
  helperForName(receiveFormName:any){
    this.FormNameMini = receiveFormName

  }

  helperChartClick(event:any,modalChart:any){
    console.log('event checking',event)
    this.modalService.open(modalChart, { size: 'xl' });
  }
  helperChartClickChart1(event:any,modalChart:any){
    console.log('event checking',event)
    this.modalService.open(modalChart, { size: 'xl' });
  }

  helperChartClickChart2(event:any,modalChart:any){
    console.log('event checking',event)
    this.modalService.open(modalChart, { size: 'lg' });
  }
  helperRow(rowDynamic:any){
    console.log('rowDynamic checking',rowDynamic)
    this.sendRowDynamic = rowDynamic
    console.log('this.sendRowDynamic',this.sendRowDynamic)

  }
  emitchartDatatable(configChartTable:any){
    console.log('configChartTable',configChartTable)
    this.chartDataConfigExport = configChartTable

  }
  async fetchUserPermissions(sk: any) {
    this.userdetails = this.getLoggedUser.username;
    this.userClient = this.userdetails + "#user" + "#main";
    console.log('this.tempClient from form service check', this.userClient);
  
    this.userPermissions = await this.api.GetMaster(this.userClient, sk).then(permission => {
      if (permission) {
        console.log('data checking from add form', permission);
        const metadataString: string | null | undefined = permission.metadata;
  
        // Check if metadataString is a valid string before parsing
        if (typeof metadataString === 'string') {
          try {
            // Parse the JSON string into a JavaScript object
            this.permissionsMetaData = JSON.parse(metadataString);
            console.log('Parsed Metadata Object from location', this.permissionsMetaData);
            this.permissionIdRequest = this.permissionsMetaData.permission_ID
            const readPermission_Id = this.permissionsMetaData.permission_ID
            console.log('readPermission_Id check',readPermission_Id)
           

  
            // Check if permission_ID is 'All'
            if (readPermission_Id !== "All") {
              // this.permissionIdCheck = this.metadataObject.permission_ID; // Store the permission ID
              console.log('Stored permission ID:', readPermission_Id);
              this.fetchPermissionIdMain(1, readPermission_Id);
              this.loadData();
            } else if(readPermission_Id=="All"){
             this.userPermission = readPermission_Id
    this.summaryDashboardUpdate= true

    // this.fetchPermissionIdMain(1, readPermission_Id);
             this.loadData();
          
              console.log('this.userPermissionsRead',this.userPermission)
              console.log('Permission ID is "All", skipping action.');
            }
  
          
  
          } catch (error) {
            console.error('Error parsing JSON:', error);
          }
        } else {
          console.log('Metadata is not a valid string:', this.metadataObject);
        }
  
        // Return based on location_permission and form_permission
        return this.modifyList(this.metadataObject.location_permission, this.metadataObject.form_permission) === "All-All" ? false : true;
      }
    });
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
   
      chart: { width: this.chartWidth, height: this.chartHeight, heightOffset: 10, widthOffset: 30  },
      map: { width: this.mapWidth, height: this.mapHeight, heightOffset: 80, widthOffset: 30  },
      Linechart:{ width: this.chartWidth, height: this.chartHeight, heightOffset: 80, widthOffset: 30  },
      Columnchart:{ width: this.chartWidth, height: this.chartHeight, heightOffset: 80, widthOffset: 30  },
      dynamicTile:{ width: this.DynamicTileWidth, height: this.DynamicTileHeight, heightOffset: 80, widthOffset: 30  },
      TableWidget:{ width: this.tableWidth, height: this.tableHeight, heightOffset: 80, widthOffset: 30  },
      title:{ width: this.titleWidth, height: this.titleHeight, heightOffset: 80, widthOffset: 30  },
      HTMLtile:{width:this.HTMLtileWidth,  height:this.HTMLtileHeight, heightOffset: 80, widthOffset: 30  },



 

    };

    const dimensions:any = widthHeightMap[item.grid_type] || { width: this.tileWidth, height: this.tileHeight };
    const width:any = dimensions.width?.[index] + dimensions.widthOffset;
    const height:any = dimensions.height?.[index] + dimensions.heightOffset;;

    return `width: ${width?.toFixed(2) ?? 'N/A'}px, height: ${height?.toFixed(2) ?? 'N/A'}px`;
  }



}
