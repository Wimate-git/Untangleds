import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, inject, Injector, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { SharedService } from '../shared.service';
import { APIService } from 'src/app/API.service';
import { AbstractControl, FormControl, FormGroup, UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

import { Config } from 'datatables.net';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GridsterConfig, GridsterItem } from 'angular-gridster2';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
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
    P8:any;
    P9:any;
  };
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
magicboard_view:any,
powerboard_view:any,
description:any,
summaryView:any,
dreamboard_view:any,
powerboard_view_device:any,
icon:any


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
export class SummaryEngineComponent implements OnInit,AfterViewInit,OnDestroy {
  iconOptions: { value: string; label: string; class1: string ,class2: string}[] = [];
  @ViewChild('calendarModal') calendarModal: any;
  @ViewChild('calendarModal1') calendarModal1: any;
  @ViewChild('calendarModal2') calendarModal2: any;
  @ViewChild('calendarModal3') calendarModal3: any;
  @ViewChild('calendarModal4') calendarModal4: any;
  @ViewChild('calendarModal5') calendarModal5: any;
  @ViewChild('calendarModal6') calendarModal6: any;
  @ViewChild('dialChartContainer') dialChartContainer!: ElementRef;

  tooltip: string | null = null;
  chartType: string = 'solidgauge'; 

  options: any;
  dashboard: any[] = []; // Initialize an empty array for the dashboard items
  all_Packet_store: any;
  iconUploadError: string | null = null; 
iconsList:any = [
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
  createKPIWidget2:FormGroup;
  createKPIWidget:FormGroup;
  createKPIWidget5:FormGroup;
  createKPIWidget6:FormGroup
  errorForUniqueID: any;
  errorForMobile: any;
  errorForInvalidEmail: string;
  showHeading: any = false;
  summarySK: any;
  allCompanyDetails: any;
  defaultLocation: any = {};
previewObjDisplay:any=null;
  datatableConfig: Config = {};
  lookup_data_summary: any = [];
 
  listofSK: any;

  hideUpdateButton: any = false;
  maxlength: number = 500;
  listofClientIDs: any = [];
  lookup_data_client: any = [];
  columnDatatable:any = [];
  clientID: any;
  dataform: any = [];
editButtonCheck :any = false
  columnTableData: any = [];
  routeId: string | null;
  createdTime: any;
  createdUserName: any;
  updatedUserName: any;
  lookup_data_summary1: any[]=[];

  lookup_data_summaryCopy:any[] =[]
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
  createKPIWidget1:FormGroup;
  grid_details: any[];
  summaryDashboard: any[] = [];
  getWorkFlowDetails: any;
  listofDynamicParam: any;
  isHovered: boolean = false;
  isEditMode: boolean = false; // Initially set to false for add mode
currentItem: any;
private editTileIndex: number | null = null;
private widgetIdCounter = 0;

  isMenuOpen: boolean = false; // Tracks dropdown menu state
  @ViewChild(MatMenuTrigger) triggerBtn: MatMenuTrigger;
  allUpdateTile: { summaryID: any; summaryName: any; summaryDesc: any; summaryIcon: any; updated: Date; createdUser: any; };
  groupByFormat: any;
  editTileIndex1: number | null;
  editTileIndex2: number | null;
  createKPIWidget3:FormGroup;
  editTileIndex3: number | null;
  editTileIndex4: number | null;
  createKPIWidget4:FormGroup
  editTileIndex5: number | null;
  editTileIndex6: number | null;
  showIdField = false; 
  selectedTabset: string = 'dataTab';
  @ViewChild('bulletChart') bulletChart: ElementRef;

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

  // This method can be used to toggle between Edit and View modes
  toggleMode(): void {
    // Toggle the mode and save it to localStorage
    this.isEditModeView = !this.isEditModeView;
    localStorage.setItem('editModeState', this.isEditModeView.toString());
    this.cdr.detectChanges();  // Manually triggers change detection
  }

 


  // Function to set the selected tab
  selectedSettingsTab(tab: string) {
    this.selectedTabset = tab;
  }

  themes = [
    { color: "#338F74", selected: false },
    { color: "#D66E75", selected: false },
    { color: "#3C8AB0", selected: false },
    { color: "#C6A539", selected: false },
    { color: "#7E6FBF", selected: false }
  ];
  
 
  

  selectedColor: string = '#66C7B7'; // Default to the first color
 

  // Toggle checkbox visibility and state inside color box
  toggleCheckbox(theme: any): void {
    // Clear the 'selected' state for all themes
    this.themes.forEach(t => t.selected = false);  // Reset selection for all themes
    
    // Set the clicked theme as selected
    theme.selected = true;
  
    // Update the selected color based on the theme selection
    this.selectedColor = theme.color;
    
    // Optionally, update the form control with the selected color
    this.createKPIWidget.get('themeColor')?.setValue(this.selectedColor);
  
    // Manually trigger change detection to ensure the UI reflects the changes
    this.cdr.detectChanges();
  }
  
  toggleCheckbox2(theme: any): void {
    // Clear the 'selected' state for all themes
    this.themes.forEach(t => t.selected = false);  // Reset selection for all themes
  
    // Set the clicked theme as selected
    theme.selected = true;
  
    // Update the selected color based on the theme selection
    this.selectedColor = theme.color;
    
    // Optionally, update the form control with the selected color
    this.createKPIWidget2.get('themeColor')?.setValue(this.selectedColor);
  }
  toggleCheckbox3(theme: any): void {
    // Clear the 'selected' state for all themes
    this.themes.forEach(t => t.selected = false);  // Reset selection for all themes
  
    // Set the clicked theme as selected
    theme.selected = true;
  
    // Update the selected color based on the theme selection
    this.selectedColor = theme.color;
    
    // Optionally, update the form control with the selected color
    this.createKPIWidget3.get('themeColor')?.setValue(this.selectedColor);
  }

  toggleCheckbox4(theme: any): void {
    // Clear the 'selected' state for all themes
    this.themes.forEach(t => t.selected = false);  // Reset selection for all themes
  
    // Set the clicked theme as selected
    theme.selected = true;
  
    // Update the selected color based on the theme selection
    this.selectedColor = theme.color;
    
    // Optionally, update the form control with the selected color
    this.createKPIWidget4.get('themeColor')?.setValue(this.selectedColor);
  }
  

  toggleCheckbox5(theme: any): void {
    // Clear the 'selected' state for all themes
    this.themes.forEach(t => t.selected = false);  // Reset selection for all themes
  
    // Set the clicked theme as selected
    theme.selected = true;
  
    // Update the selected color based on the theme selection
    this.selectedColor = theme.color;
    
    // Optionally, update the form control with the selected color
    this.createKPIWidget5.get('themeColor')?.setValue(this.selectedColor);
  }
  







  
  
  // Method to toggle the menu open/close
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }


 
  deleteItem(item: any) {
    // Logic for deleting the item
    console.log('Delete:', item);
  }

 
  nineBlocks = Array.from({ length: 9 }, (_, i) => ({ label: `KPI ${i + 1}` }));

  constructor(private summaryConfiguration: SharedService,private api: APIService,private fb: UntypedFormBuilder,private cd:ChangeDetectorRef,
    private toast: MatSnackBar,private router:Router,private modalService: NgbModal,  private route: ActivatedRoute,private cdr:ChangeDetectorRef,private locationPermissionService:LocationPermissionService,private devicesList: SharedService,private injector: Injector
    ) {
    
      this.selectedRangeCalendarTimeRight = {
        startDate: dayjs().startOf('day'),
        endDate: dayjs().endOf('day'),
      };
      this.selectedRangeCalendarCenter = {
        startDate: dayjs().startOf('day'),
        endDate: dayjs().endOf('day'),
      };
      this.selectedRangeCalendarAutoLeft = {
        startDate: dayjs().startOf('day'),
        endDate: dayjs().endOf('day'),
      };
      this.selectedSingleCalendarTimeRight = dayjs().startOf('day');
      this.selectedSingleCalendarCenter = dayjs().startOf('day');
      this.selectedSingleCalendarAutoLeft = dayjs().startOf('day');
      this.selectedSimpleCalendarTimeUpRight = {
        startDate: dayjs().startOf('day'),
        endDate: dayjs().endOf('day'),
      };
      this.selectedSimpleCalendarUpCenter = {
        startDate: dayjs().startOf('day'),
        endDate: dayjs().endOf('day'),
      };
      this.selectedSimpleCalendarAutoUpLeft = {
        startDate: dayjs().startOf('day'),
        endDate: dayjs().endOf('day'),
      };
      this.selectedRangeCalendarTimeInline = {
        startDate: dayjs().startOf('day'),
        endDate: dayjs().endOf('day'),
      };
      // this.createKPIWidget = this.fb.group({
      //   groupBy: [''] // Default value can be empty or a specific option
      // });
      // this.iconOptions = this.getIconOptions();
     }

     someMethod() {
      const localeService = this.injector.get(NgxDaterangepickerLocaleService);
    }
    ranges: { [key: string]: [dayjs.Dayjs, dayjs.Dayjs] } = {
      Today: [dayjs().startOf('day'), dayjs().endOf('day')],
      Yesterday: [
        dayjs().subtract(1, 'day').startOf('day'),
        dayjs().subtract(1, 'day').endOf('day'),
      ],
      'Last 7 days': [
        dayjs().subtract(6, 'days').startOf('day'),
        dayjs().endOf('day'),
      ],
      'Last 30 days': [
        dayjs().subtract(29, 'days').startOf('day'),
        dayjs().endOf('day'),
      ],
      'This month': [dayjs().startOf('month'), dayjs().endOf('month')],
      'Last month': [
        dayjs().subtract(1, 'month').startOf('month'),
        dayjs().subtract(1, 'month').endOf('month'),
      ],
      'Last 24 Hours': [
        dayjs().subtract(24, 'hours').startOf('hour'),
        dayjs().endOf('hour'),
      ],
      'Last 48 Hours': [
        dayjs().subtract(48, 'hours').startOf('hour'),
        dayjs().endOf('hour'),
      ],
      'This Quarter': [
        dayjs().month(Math.floor(dayjs().month() / 3) * 3).startOf('month'),
        dayjs().month(Math.floor(dayjs().month() / 3) * 3 + 2).endOf('month'),
      ],
      'Last Quarter': [
        // Calculate start and end of last quarter
        dayjs().month(Math.floor((dayjs().month() - 3) / 3) * 3).startOf('month'),
        dayjs().month(Math.floor((dayjs().month() - 3) / 3) * 3 + 2).endOf('month'),
      ],
      'This Year': [dayjs().startOf('year'), dayjs().endOf('year')],
      'Last Year': [
        dayjs().subtract(1, 'year').startOf('year'),
        dayjs().subtract(1, 'year').endOf('year'),
      ],
      'This Week': [
        dayjs().startOf('week'),
        dayjs().endOf('week'),
      ],
      'Last Week': [
        dayjs().subtract(1, 'week').startOf('week'),
        dayjs().subtract(1, 'week').endOf('week'),
      ],
    };
    
    
    
    
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
  
  
    datesUpdatedRange($event: any) {
      const selectedRange = Object.entries(this.ranges).find(([label, dates]) => {
        const [startDate, endDate] = dates as [dayjs.Dayjs, dayjs.Dayjs];
        return startDate.isSame($event.startDate, 'day') && endDate.isSame($event.endDate, 'day');
      });
      console.log('selectedRange check',selectedRange)
    
      if (selectedRange) {
        const control = this.createKPIWidget.get('selectedRangeType');
        if (control) {
          control.setValue(selectedRange[0]);  // Update form control value with selected range label
        }
      }
    }
    
     
    datesUpdatedSingle($event: any) {
      console.log('single', $event);
    }
  
    datesUpdatedInline($event: Object) {
      console.log('inline', $event);
    }
  
  ngOnDestroy(): void {
    console.log('SummaryEngineComponent destroyed.');
  }
  ngAfterViewInit(): void {
    if(this.routeId){
      this.editButtonCheck = true

      this.openModalHelpher(this.routeId)
    }else{
      this.editButtonCheck = false
    }
    this.loadData()
    this.addFromService()
 
    console.log("this.lookup_data_summary1",this.lookup_data_summary1)
    this.createChartGauge();
  
    this.createKPIWidget.statusChanges.subscribe(status => {
      // Log form validity status to track changes
      console.log('Form status changed:', status);
      console.log('Form validity:', this.createKPIWidget.valid);
    });
    // this.createBulletChart();

  }


  createBulletChart() {
    const chartoptions:any = {
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
    Highcharts.chart('bulletChart',chartoptions);
  }

  private getRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min)
  }

  private createChartGauge(): void {
    const chart = Highcharts.chart('chart-gauge', {
      chart: {
        type: 'solidgauge',
        backgroundColor: 'transparent',
      },
      title: {
        text: '',
      },
      credits: {
        enabled: false,
      },
      pane: {
        startAngle: -90,
        endAngle: 90,
        center: ['50%', '85%'],
        size: '160%',
        background: {
            innerRadius: '60%',
            outerRadius: '100%',
            shape: 'arc',
        },
      },
      yAxis: {
        min: 0,
        max: 100,
        stops: [
          [0.1, '#55BF3B'], // green
          [0.5, '#DDDF0D'], // yellow
          [0.9, '#DF5353'], // red
        ],
        minorTickInterval: null,
        tickAmount: 2,
        labels: {
          y: 16,
        },
      },
      plotOptions: {
        solidgauge: {
          dataLabels: {
            y: -25,
            borderWidth: 0,
            useHTML: true,
          },
        },
      },
      tooltip: {
        enabled: false,
      },
      series: [{
        name: null,
        data: [this.getRandomNumber(0, 100)],
        dataLabels: {
          format: '<div style="text-align: center"><span style="font-size: 1.25rem">{y}</span></div>',
        },
      }],
    } as any);

    setInterval(() => {
      chart.series[0].points[0].update(this.getRandomNumber(0, 100));
    }, 1000);
  }




  ngOnInit() {

    // this.dropdownSettings = this.devicesList.getMultiSelectSettings();
    this.getLoggedUser = this.summaryConfiguration.getLoggedUserDetails()
    console.log('this.getLoggedUser check',this.getLoggedUser)
    // this.getWorkFlowDetails = this.summaryConfiguration.getLoggedUserDetails()
    // console.log('this.getLoggedUser check',this.getWorkFlowDetails)

    this.SK_clientID = this.getLoggedUser.clientID;
    console.log('this.SK_clientID check',this.SK_clientID)
    this.route.paramMap.subscribe(params => {
      this.routeId = params.get('id');
      if( this.routeId ){
        this.openModalHelpher(this.routeId);
        this.editButtonCheck = true

      }
    
      //console.log(this.routeId)
      // Use this.itemId to fetch and display item details
    });
  
    this.initializeCompanyFields();
    this.initializeTileFields();
    this.initializeTileFields1()
    this.initializeTileFields2()
    this.initializeTileFields3()
    this.initializeTileFields4()
    this.initializeTileFields5()
    this.initializeTileFields6()
    // this.addJsonValidation();
    this.showTable()
    this.addFromService()
    const savedState = localStorage.getItem('editModeState');
    this.isEditModeView = savedState === 'true';
   
   

  
    this.options = {
      draggable: {
        enabled: true,
      },
      resizable: {
        enabled: true,
      },
      gridType: 'fit', // Ensures that the items are resized to fit the grid container
      margin: 10,
      outerMargin: true,
      // minCols: 20, // Set to meet or exceed the item's 'cols' value (20)
      // maxCols: 20, // Optional limit, ensure it's at least 20 if you want it fixed
      // minRows: 10, // Set to meet or exceed the item's 'rows' value (10)
      // maxRows: 10, // Optional limit, ensure it's at least 10 if you want it fixed
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
      setGridSize: true,
      pushItems: true,
      displayGrid: 'always', // Optional, for debugging the grid layout
    };



    // this.createKPIWidget.get('formlist')?.valueChanges.subscribe((selectedValue) => {
    //   console.log('Selected Value:', selectedValue);
    //   this.fetchDynamicFormData(selectedValue);
    // });
    
  
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
  

  // subscribeToGroupByChanges(): void {
  //   this.createKPIWidget.get('groupBy')?.valueChanges.subscribe((value) => {
  //     if (value === 'created') {
  //       this.isModalOpen = true;
  //       this.cdr.detectChanges();  // Open the modal if "Created Time" is selected
  //     } else {
  //       this.isModalOpen = false; // Close the modal otherwise
  //     }
  //   });
  // }

  groupByOptions = [
    { value: 'none', text: 'None' },
    { value: 'created', text: 'Created Time' },
    { value: 'updated', text: 'Updated Time' },
    { value: 'name', text: 'Name' },
    { value: 'phoneNumber', text: 'Phone Number'},
    { value: 'emailId', text: 'Email Id' },


    // Add more hardcoded options as needed
  ];

  showValues =[
    {value:'sum',text:'Sum'},
    {value:'min',text:'Minimum'},
    {value:'max',text:'Maximum'},
    {value:'average',text:'Average'},
    {value:'latest',text:'Latest'},
    {value:'previous',text:'Previous'},
    {value:'DifferenceFrom-Previous',text:'DifferenceFrom-Previous'},
    {value:'DifferenceFrom-Latest',text:'DifferenceFrom-Latest'},
    {value:'%ofDifferenceFrom-Previous',text:'%ofDifferenceFrom-Previous'},
    {value:'%ofDifferenceFrom-Latest',text:'%ofDifferenceFrom-Latest'},
    {value:'Constant',text:'Constant'},
    {value:'Live',text:'Live'},

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

  openKPIModal(content: any, tile?: any, index?: number) {
    console.log('Index checking:', index); // Log the index
  
    if (tile) {
      this.selectedTile = tile;
      this.editTileIndex = index !== undefined ? index : null; // Store the index, default to null if undefined
      console.log('Tile Object:', tile); // Log the tile object
  
      // Parse multi_value if it is a string
      let parsedMultiValue = [];
      if (typeof tile.multi_value === 'string') {
        try {
          parsedMultiValue = JSON.parse(tile.multi_value);
          console.log('Parsed multi_value:', parsedMultiValue); // Log parsed multi_value to verify structure
        } catch (error) {
          console.error('Error parsing multi_value:', error);
        }
      } else {
        parsedMultiValue = tile.multi_value;
      }
  
      // Extract value and constantValue from parsed multi_value, assuming the new structure
      const value = parsedMultiValue[0]?.value || '';
      const constantValue = parsedMultiValue[0]?.constantValue !== undefined ? parsedMultiValue[0].constantValue : 0;
      const parsedValue = parsedMultiValue[1]?.processed_value !== undefined ? parsedMultiValue[1].processed_value : 0;
  
      // Initialize form fields and pre-select values
      this.initializeTileFields();
      this.createKPIWidget.patchValue({
        formlist: tile.formlist,
        parameterName: tile.parameterName,
        groupBy: tile.groupBy,
        primaryValue: value, // Set the 'value' extracted from multi_value as primaryValue
        groupByFormat: tile.groupByFormat,
        constantValue: constantValue, // Use the extracted constantValue
        processed_value: parsedValue,
        selectedRangeCalendarTimeRight: tile.selectedRangeCalendarTimeRight, // Patch the selected range object
        selectedRangeType: tile.selectedRangeType, // Patch the selectedRangeType
        startDate: tile.predefinedSelectRange?.startDate || '',  // Patch the startDate if it exists
        endDate: tile.predefinedSelectRange?.endDate || '', 
        themeColor: tile.themeColor     // Patch the endDate if it exists
      });
  
      this.isEditMode = true; // Set to edit mode
    } else {
      this.selectedTile = null; // No tile selected for adding
      this.isEditMode = false; // Set to add mode
      this.createKPIWidget.reset(); // Reset the form for new entry
    }
  
    // Clear the 'selected' state for all themes
    this.themes.forEach(theme => {
      theme.selected = false; // Deselect all themes
    });
  
    // Iterate through the dashboard to find the theme matching the tile's themeColor
    const matchingTheme = this.themes.find(theme => theme.color === tile?.themeColor);
  
    // If a matching theme is found, set it as selected
    if (matchingTheme) {
      matchingTheme.selected = true;
      console.log('Matching theme found and selected:', matchingTheme);
    }
  
    // Open the modal
    this.modalService.open(content, { size: 'lg', ariaLabelledBy: 'modal-basic-title' });
  
    // Any additional setup if needed
    this.showTable();
    this.reloadEvent.next(true);
  }
  
  
  



  

  
  
  


  
  openKPIModal1(content: any, tile?: any, index?: number) {
    if (tile) {
        this.selectedTile = tile;
        this.editTileIndex1 = index !== undefined ? index : null; // Store the index, default to null if undefined
        console.log('Tile Object:', tile); // Log the tile object
  
        // Parse multi_value if it's a string
        let parsedMultiValue = [];
        if (typeof tile.multi_value === 'string') {
            try {
                parsedMultiValue = JSON.parse(tile.multi_value);
                console.log('Parsed multi_value:', parsedMultiValue); // Log parsed multi_value to verify structure
            } catch (error) {
                console.error('Error parsing multi_value:', error);
            }
        } else {
            parsedMultiValue = tile.multi_value || [];
        }
  
        // Extract primaryValue and secondaryValue from parsed multi_value
        const primaryValue = parsedMultiValue[0]?.value || ''; // Assuming value corresponds to primaryValue
        const secondaryValue = parsedMultiValue[1]?.value || ''; // Assuming value corresponds to secondaryValue
        const parsedValue = parsedMultiValue[2]?.processed_value !== undefined ? parsedMultiValue[2].processed_value : 0;
  
        // Initialize form fields and pre-select values
        this.initializeTileFields1();
        this.createKPIWidget1.patchValue({
            formlist: tile.formlist,
            parameterName: tile.parameterName,
            groupBy: tile.groupBy,
            primaryValue: primaryValue, // Set the primaryValue
            groupByFormat: tile.groupByFormat,
            constantValue: parsedMultiValue[0]?.constantValue || 0, // Assuming constantValue is in the first item
            secondaryValue: secondaryValue, // Set the secondaryValue
            processed_value: parsedValue,
            themeColor: tile.themeColor
        });
  
        this.isEditMode = true; // Set to edit mode
    } else {
        this.selectedTile = null; // No tile selected for adding
        this.isEditMode = false; // Set to add mode
        this.createKPIWidget1.reset(); // Reset the form for new entry
    }
  
    // Clear the 'selected' state for all themes
    this.themes.forEach(theme => {
      theme.selected = false; // Deselect all themes
    });
  
    // Find the theme that matches the tile's themeColor
    const matchingTheme = this.themes.find(theme => theme.color === tile?.themeColor);
  
    // If a matching theme is found, set it as selected
    if (matchingTheme) {
      matchingTheme.selected = true;
      console.log('Matching theme found and selected:', matchingTheme);
    }
  
    // Open the modal
    this.modalService.open(content, { size: 'lg', ariaLabelledBy: 'modal-basic-title' });
  
    // Any additional setup if needed
    this.showTable();
    this.reloadEvent.next(true);
  }
  

  dropdownOptions = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
  ];
  listofTiles =[
    {value:'widget',label:'Widget'},
    {value:'title',label:'Title'},
    {value:'paragraph',label:'Pharagraph'},
    {value:'image',label:'Image'},
    {value:'embed',label:'Embed'},
  ]
  tileChange(event: any): void {
    // Log the event to see the data it contains
    console.log('Tile changed:', event);

    // Perform additional actions based on the event data
    if (event && event.length>0) {
      this.selectedTile = event[0].value;
      // Handle specific property chang
     
      console.log('Specific property value:', this.selectedTile);
      this.showGrid = this.selectedTile === 'widget';
    }
    setTimeout(() => {
      this.createChartGauge();
    }, 100);
  
    // Example: Update a variable or trigger further logic based on the event
    // this.someVariable = event.someProperty;
  }


  isSummaryEngine(): boolean {
    return this.router.url === '/summary-engine'; // Check if the current route is /summary-engine
  }

  hideTooltips(){

  }
  openCreateContent(createcontent: any) {
    this.modalService.open(createcontent, { size: 'xl', ariaLabelledBy: 'modal-basic-title' });
  }
  // Method to add a new grid item
  // addItem(): void {
  //   const newItem: DashboardItem = {
  //     cols: 2,
  //     rows: 2,
  //     y: 0,
  //     x: 0,
  //     title: `Widget ${this.dashboard.length + 1}`,
  //     description: `This is widget ${this.dashboard.length + 1}`
  //   };
  //   this.dashboard.push(newItem);
  // }

  viewItem(id: string) {
    // Navigate to the desired route, e.g., /summary-engine/:id
    this.router.navigate([`/summary-engine/${id}`]);
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

  // onGroupByChange(event: any): void {
  //   if (event && event.length > 0) {
  //     // Capture both the value and text
  //     this.selectedGroupByValue = event[0].value;
  //     this.selectedDropdown = event[0].text;
    
  //     // Update the display label with the format "Created Time (selected value)"
  //     this.updateDisplayLabel(this.selectedDropdown);
  //     console.log('Selected GroupBy label:', this.displayLabel);
  //     console.log('Selected Value Text:', this.selectedDropdown);
    
  //     // Open modal if the selected value is "created"
  //     if (this.selectedGroupByValue === 'created') {
  //       this.modalService.open(this.calendarModal, { 
  //         windowClass: 'right-side-modal',
  //         backdrop: false
  //       });
  //     }
  //   } else {
  //     console.log('No event value received');
  //   }
  // }
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

  edit(P1: any) {
   
    console.log("Edited username is here", P1);
    
  
  
    // Navigate to the new route, which will load the new content dynamically
    this.router.navigateByUrl(`/summary-engine/${P1}`).then(() => {
      console.log('Navigation to summary engine complete');
    }).catch(err => {
      console.error('Navigation error', err);
    });
  }
  


  openModalHelpher(getValue: any) {
    console.log("Data from lookup:", getValue);
  
    this.api
      .GetMaster(`${this.SK_clientID}#${getValue}#summary#main`, 1)
      .then((result: any) => {
        if (result && result.metadata) {
          const parsedMetadata = JSON.parse(result.metadata);
          console.log('parsedMetadata check', parsedMetadata);
          this.all_Packet_store = parsedMetadata;
          this.createdTime = this.all_Packet_store.created;
          this.createdUserName = this.all_Packet_store.createdUser;
   
          console.log('Before Parsing:', this.all_Packet_store.grid_details);

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


          // Iterate through the dashboard and themes to find a matching themeColor
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

updateTile() {
  if (this.editTileIndex !== null) {
      console.log('this.editTileIndex check', this.editTileIndex);
      console.log('Tile checking for update:', this.dashboard[this.editTileIndex]);

      const multiValue = this.dashboard[this.editTileIndex].multi_value || [];
      const primaryValue = multiValue[0]?.value || '';
      const constantValue = multiValue[0]?.constantValue || 0;
      const processedValue = this.createKPIWidget.value.processed_value || ''; // Get updated processed_value from the form
      const updatedConstantValue = this.createKPIWidget.value.constantValue || constantValue; // Get updated constantValue from the form

      console.log('Extracted primaryValue:', primaryValue);
      console.log('Extracted constantValue:', constantValue);
      console.log('Form Value for processed_value:', processedValue);
      console.log('Form Value for constantValue:', updatedConstantValue);

      // Update the multi_value array with the new processed_value and constantValue
      if (multiValue.length > 1) {
          // Update processed_value and constantValue at index 1
          multiValue[1].processed_value = processedValue;
          multiValue[0].constantValue = updatedConstantValue; // Update constantValue at index 0
      } else {
          // If the multi_value array doesn't have enough elements, ensure it's structured correctly
          multiValue.push({ processed_value: processedValue });
          multiValue.push({ constantValue: updatedConstantValue });
      }

      // Now update the tile with the updated multi_value
      const updatedTile = {
          ...this.dashboard[this.editTileIndex], // Keep existing properties
          formlist: this.createKPIWidget.value.formlist,
          parameterName: this.createKPIWidget.value.parameterName,
          groupBy: this.createKPIWidget.value.groupBy,
          primaryValue: primaryValue,
          groupByFormat: this.createKPIWidget.value.groupByFormat,
          constantValue: updatedConstantValue, // Use the updated constantValue
          processed_value: processedValue, // Use the updated processed_value
          multi_value: multiValue, // Update the multi_value array with the modified data
          selectedRangeType: this.createKPIWidget.value.selectedRangeType,
          startDate: this.createKPIWidget.value.startDate,
          endDate: this.createKPIWidget.value.endDate,
          themeColor: this.createKPIWidget.value.themeColor
      };

      // Update the dashboard array using a non-mutative approach
      this.dashboard = [
          ...this.dashboard.slice(0, this.editTileIndex),
          updatedTile,
          ...this.dashboard.slice(this.editTileIndex + 1)
      ];

      console.log('Updated Tile Details:', this.dashboard[this.editTileIndex]);

      // Update the grid_details as well
      this.all_Packet_store.grid_details[this.editTileIndex] = {
          ...this.all_Packet_store.grid_details[this.editTileIndex],
          ...updatedTile
      };

      this.openModal('Edit_ts', this.all_Packet_store);
      this.updateSummary('', 'update_tile');
      console.log('this.dashboard check from updateTile', this.dashboard);
      console.log("Updated all_Packet_store.grid_details:", this.all_Packet_store.grid_details);

      // Reset the editTileIndex after the update
      this.editTileIndex = null;
  } else {
      console.error("Edit index is null. Unable to update the tile.");
  }
}






updateTile1() {
  if (this.editTileIndex1 !== null) {
      console.log('this.editTileIndex check', this.editTileIndex1);
      console.log('Tile checking for update:', this.dashboard[this.editTileIndex1]);

      // Log the current details of the tile before update
      console.log('Current Tile Details Before Update:', this.dashboard[this.editTileIndex1]);
      console.log('this.dashboard check from tile1', this.dashboard);

      // Extract the multi_value array
      let multiValue = this.dashboard[this.editTileIndex1].multi_value || [];

      // Update values in multi_value array
      const processedValue = this.createKPIWidget1.value.processed_value || ''; // Get updated processed_value from the form
      const constantValue = this.createKPIWidget1.value.constantValue || 0; // Get updated constantValue from the form
      const secondaryValue = this.createKPIWidget1.value.secondaryValue || ''; // Get updated secondaryValue from the form

      console.log('Form Value for processed_value:', processedValue);
      console.log('Form Value for constantValue:', constantValue);
      console.log('Form Value for secondaryValue:', secondaryValue);

      // Ensure the multiValue array is long enough, and update the values
      if (multiValue.length > 1) {
          multiValue[2].processed_value = processedValue; // Update processed_value at index 1
          multiValue[0].constantValue = constantValue; // Update constantValue at index 0
          multiValue[1].value = secondaryValue; // Update secondaryValue at index 1
      } else {
          // If multi_value array doesn't have enough elements, ensure it's structured correctly
          // Ensure at least two objects are created with the correct structure
          if (multiValue.length === 0) {
              multiValue.push({ processed_value: processedValue });
              multiValue.push({ constantValue: constantValue});
              multiValue.push({ secondaryValue: secondaryValue });
          } else if (multiValue.length === 1) {
              multiValue.push({ processed_value: processedValue, secondaryValue: secondaryValue });
          }
      }

      // Now update the tile with the updated multi_value
      this.dashboard[this.editTileIndex1] = {
          ...this.dashboard[this.editTileIndex1], // Keep existing properties
          formlist: this.createKPIWidget1.value.formlist,
          parameterName: this.createKPIWidget1.value.parameterName,
          groupBy: this.createKPIWidget1.value.groupBy,
          primaryValue: this.createKPIWidget1.value.primaryValue,
          groupByFormat: this.createKPIWidget1.value.groupByFormat,
          themeColor: this.createKPIWidget1.value.themeColor,
          multi_value: multiValue, // Update multi_value with the modified array
          constantValue: constantValue, // Use the updated constantValue
          processed_value: processedValue,
          secondaryValue: secondaryValue
      };

      // Log the updated details of the tile
      console.log('Updated Tile Details:', this.dashboard[this.editTileIndex1]);

      // Also update the grid_details array to reflect changes
      this.all_Packet_store.grid_details[this.editTileIndex1] = {
          ...this.all_Packet_store.grid_details[this.editTileIndex1], // Keep existing properties
          ...this.dashboard[this.editTileIndex1], // Update with new values
      };

      // Open the modal and perform additional actions
      this.openModal('Edit_ts', this.all_Packet_store);
      this.updateSummary('', 'update_tile');
      console.log('this.dashboard check from updateTile', this.dashboard);
      console.log("Updated all_Packet_store.grid_details:", this.all_Packet_store.grid_details);

      // Reset the editTileIndex after the update
      this.editTileIndex1 = null;
  } else {
      console.error("Edit index is null. Unable to update the tile.");
  }
}




  


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

// openModal(getValues: any) {
//   console.log('getvalues inside openModal', getValues);
//   // if (getKey == 'edit' || getKey == '') {
//   let temp = "";
//   //console.log('temp',temp);
//   if (getValues == "") {
//     this.showHeading = true;
//     this.showModal = false;
//     // this.errorForUniqueID = '';
//     // this.errorForInvalidEmail = '';


//     this.createSummaryField.get('summaryID')?.enable();
//     this.createSummaryField = this.fb.group({
   
//       'summaryID': getValues.summaryID,
//       'summaryName': getValues.summaryName,
//       'summarydesc': getValues.summarydesc,
//       jsonInputControl: ['', this.jsonValidator],
     
//     })
//     console.log(' this.createSummaryField check', this.createSummaryField)

//   }


//   //updated device congifuration(update)
//   else if (getValues) {
//     console.log('get values on edit');
//     //disabling RDT id field on edit,becas its shoukd be unique and making showmodal as true
//     this.createSummaryField.get('summaryID')?.disable();

// //       for (let checkPermission = 0; checkPermission < this.allPermissions_user.length; checkPermission++) {
// //         if (this.allPermissions_user[checkPermission] === 'Company - Update') {
// //           this.hideUpdateButton = false;
// // break;        }

// //         else if (this.allPermissions_user[checkPermission] === 'Company - View') {
// //           this.hideUpdateButton = true;
// //         }
// //       }

//     this.showHeading = false;
//     this.showModal = true;

//     this.errorForUniqueID = '';
   
//     let parsed = '';
//     if (getValues.metadata) {
//       parsed = JSON.parse(getValues.metadata);
//     }
//     this.createSummaryField = this.fb.group({
  
//       'summaryID':{ value:  getValues.summaryID, disabled: true },
//   'summaryName': getValues.summaryName,
//       'summarydesc': getValues.summaryDesc,

//       jsonInputControl: [ JSON.stringify(getValues.jsonData,null,2), this.jsonValidator],
//     })

//   }
//   this.cd.detectChanges()    
// }

openModal(flag: string, getValues?: any, content?: any): void {
  console.log('getValues inside openModal', getValues);
  this.selectedTab = this.showModal ? 'add-widget' : 'add-dashboard';

  // Reset common modal state
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

  // Detect changes to ensure the view is updated
  this.cd.detectChanges();
}

private handleNewModal(content: any): void {
  this.showHeading = true;
  this.showModal = false;
this.previewObjDisplay =null
  // Enable fields and reset form for new entry
  this.createSummaryField.get('summaryID')?.enable();
  this.createSummaryField.reset({
    summaryID: '',
    summaryName: '',
    summarydesc: '',
  
    iconSelect:''

  });

  // Open modal for new entry
  this.modalService.open(content, { size: 'xl' });
}

private handleEditModal(getValues: any, content: any): void {
  if (getValues) {
    this.showHeading = false;
    this.showModal = true;
    this.cd.detectChanges();
    console.log('this.createSummaryField from editModal', this.createSummaryField);
    if(typeof getValues.iconObject =="string"){
      this.previewObjDisplay = JSON.parse(getValues.iconObject)
    }else{
      this.previewObjDisplay = getValues.iconObject
    }
    
    // Disable summaryID and set form values for editing
    this.createSummaryField.get('summaryID')?.disable();

    this.createSummaryField.setValue({
      summaryID: getValues.summaryID,
      summaryName: getValues.summaryName,
      summarydesc: getValues.summaryDesc,
      // jsonInputControl: JSON.stringify(getValues.jsonData, null, 2),
      iconSelect:getValues.summaryIcon
    });


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

    // Disable summaryID and set form values for editing
    this.createSummaryField.get('summaryID')?.disable();
    this.createSummaryField = this.fb.group({
      summaryID: getValues.summaryID,
      summaryName: getValues.summaryName,
      summarydesc: getValues.summaryDesc,
      iconSelect: getValues.summaryIcon  // Assign the entire icon object here
    });
    console.log('this.createSummaryField from editModal', this.createSummaryField);
    if(typeof getValues.iconObject =="string"){
      this.previewObjDisplay = JSON.parse(getValues.iconObject)
    }else{
      this.previewObjDisplay = getValues.iconObject
    }
  }

  // Open modal for editing
  this.modalService.open(content, { size: 'lg' });
}



checkUniqueIdentifier(getID: any) {
  console.log('getID', getID);
  this.errorForUniqueID = '';

 if(this.listofSK&&this.listofSK.length>0) {
  for (let uniqueID = 0; uniqueID < this.listofSK.length; uniqueID++) {
    if (getID.target.value == this.listofSK[uniqueID]) {
      this.errorForUniqueID = "Company ID already exists";
    }
  }
 }

}

deleteCompany(value: any) {

  this.summarySK = value;

  console.log("Delete this :",value);

    this.allCompanyDetails = {
      PK: this.SK_clientID+"#"+value+"#summary#main",
      SK: 1
    }

    console.log("All summary Details :",this.allCompanyDetails);

        const date = Math.ceil(((new Date()).getTime()) / 1000)
        const items ={
        P1: value,
        }


        this.api.DeleteMaster(this.allCompanyDetails).then(async value => {

          if (value) {

            await this.fetchTimeMachineById(1,items.P1, 'delete', items);

            this.reloadEvent.next(true)

            Swal.fire(
              'Removed!',
              'Company configuration successfully.',
              'success'
            );
          }

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
      'iconSelect':[[]]
     
    })
  }
  initializeTileFields(): void {
    // Initialize the form group
    this.createKPIWidget = this.fb.group({
      'formlist': ['', Validators.required],
      'parameterName': ['', Validators.required],
      'groupBy': ['', Validators.required],
      'primaryValue': ['', Validators.required],
      'groupByFormat': ['', Validators.required],
      'constantValue': ['',],
      widgetid: [this.generateUniqueId()],
      'processed_value': ['', Validators.required],
      selectedColor: [this.selectedColor || '#FFFFFF'], // Default to white if no color is set
      selectedRangeLabelWithDates: [''],
      'predefinedSelectRange': [''],
      'selectedRangeType': [''],
      'themeColor':['',Validators.required]
      
    });
  }

  toggleCheckbox1(themeOrEvent: any): void {
    // If it's a color picker input (e.g., from a custom input field)
    if (themeOrEvent.target) {
      this.selectedColor = themeOrEvent.target.value;  // Get the color from the input field
    } else {
      // Predefined theme selection (from color boxes)
      const theme = themeOrEvent;
  
      // Clear the selected state for all themes (ensure only one is selected)
      this.themes.forEach(t => t.selected = false);  // Reset selection for all themes
  
      // Toggle the selection state of the clicked theme
      theme.selected = true;  // Select the clicked theme
  
      this.selectedColor = theme.color;  // Set selected color based on the clicked theme
    }
  
    // Update the form control with the selected color
    this.createKPIWidget1.get('themeColor')?.setValue(this.selectedColor);
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

  addTile(key: any) {
    if (key === 'tile') {
      const uniqueId = this.generateUniqueId();
  
      const newTile = {
          id: uniqueId,
          x: 0,
          y: 0,
          rows: 20,  // The number of rows in the grid
          cols: 20,  // The number of columns in the grid
          rowHeight: 100, // The height of each row in pixels
          colWidth: 100,  // The width of each column in pixels
          fixedColWidth: true,  // Enable fixed column widths
          fixedRowHeight: true, 
          grid_type: "tile",
          formlist: this.createKPIWidget.value.formlist,
          parameterName: this.createKPIWidget.value.parameterName,
          groupBy: this.createKPIWidget.value.groupBy,
          groupByFormat: this.createKPIWidget.value.groupByFormat,
          // selectedColor: this.createKPIWidget.value.selectedColor ,
          predefinedSelectRange:this.createKPIWidget.value.predefinedSelectRange,
          selectedRangeType:this.createKPIWidget.value.selectedRangeType,
          themeColor: this.createKPIWidget.value.themeColor,

        
          multi_value: [
              {
                  value: this.createKPIWidget.value.primaryValue, // Renamed key to 'value'
                  constantValue: this.createKPIWidget.value.constantValue !== undefined && this.createKPIWidget.value.constantValue !== null 
                      ? this.createKPIWidget.value.constantValue 
                      : 0
              },
              {
                  processed_value: this.createKPIWidget.value.processed_value || '', // Default to empty string if not provided
              }
          ]
      };
  
      // Initialize this.dashboard if it hasn't been set yet
      if (!this.dashboard) {
          this.dashboard = [];
      }
  
      // Push the new tile to dashboard
      this.dashboard.push(newTile);
  
      console.log('this.dashboard after adding new tile', this.dashboard);
      this.updateSummary('', 'add_tile');
  
      // Optionally reset the form if needed after adding the tile
      this.createKPIWidget.patchValue({
          widgetid: uniqueId
      });
  }
  
  
  
  
  else if (key === 'tile2') {
    const uniqueId = this.generateUniqueId();
    const newTile2 = {
      id: uniqueId,
      x: 0,
      y: 0,
      cols: 20,
      rows: 20,
      rowHeight: 100,
      colWidth: 100,
      fixedColWidth: true,
      fixedRowHeight: true,
      grid_type: "tile2",
      formlist: this.createKPIWidget1.value.formlist,
      parameterName: this.createKPIWidget1.value.parameterName,
      groupBy: this.createKPIWidget1.value.groupBy,
      themeColor: this.createKPIWidget1.value.themeColor,  // Ensure this is correctly assigned
      multi_value: [
        {
          value: this.createKPIWidget1.value.primaryValue,
          constantValue: this.createKPIWidget1.value.constantValue !== undefined && this.createKPIWidget1.value.constantValue !== null
            ? this.createKPIWidget1.value.constantValue
            : 0,
        },
        {
          value: this.createKPIWidget1.value.secondaryValue
        },
        {
          processed_value: this.createKPIWidget1.value.processed_value || '',
        }
      ],
      groupByFormat: this.createKPIWidget1.value.groupByFormat,
    };
    

    // Initialize this.dashboard if it hasn't been set yet
    if (!this.dashboard) {
        this.dashboard = [];
    }

    // Push the new tile to dashboard
    this.dashboard.push(newTile2);

    console.log('this.dashboard after adding new tile', this.dashboard);

    this.updateSummary('', 'add_tile');
    this.createKPIWidget1.patchValue({
        widgetid: uniqueId // Set the ID in the form control
    });
}

else if(key === 'tile3'){
  const uniqueId = this.generateUniqueId();

  const newTile3 = {
    id: uniqueId,
    x: 0,
    y: 0,
    cols: 20,
        rows: 20,
        rowHeight: 100, // The height of each row in pixels
        colWidth: 100,  // The width of each column in pixels
        fixedColWidth: true,  // Enable fixed column widths
        fixedRowHeight: true,
    grid_type: "tile3",
    formlist: this.createKPIWidget2.value.formlist,
    parameterName: this.createKPIWidget2.value.parameterName,
    groupBy: this.createKPIWidget2.value.groupBy,

    groupByFormat: this.createKPIWidget2.value.groupByFormat,
    // selectedColor: this.createKPIWidget2.value.selectedColor ,
    themeColor: this.createKPIWidget2.value.themeColor,
 // Default value, change this to whatever you prefer
 // You can also handle default value for this if needed





    multi_value: [
      {
        value: this.createKPIWidget2.value.primaryValue, // Change primaryValue to value
        constantValue: this.createKPIWidget2.value.constantValue !== undefined && this.createKPIWidget2.value.constantValue !== null
        ? this.createKPIWidget2.value.constantValue
        : 0,
      },
      {
        value: this.createKPIWidget2.value.secondaryValue, // Change secondaryValue to value
      },
      {
        value :this.createKPIWidget2.value.secondaryValueNested


      },{

        processed_value: this.createKPIWidget2.value.processed_value || '',
      }
  ],
};

// Initialize this.dashboard if it hasn't been set yet
if (!this.dashboard) {
    this.dashboard = [];
}

// Push the new tile to dashboard
this.dashboard.push(newTile3);

console.log('this.dashboard after adding new tile', this.dashboard);

this.updateSummary('', 'add_tile');
this.createKPIWidget2.patchValue({
  widgetid: uniqueId // Set the ID in the form control
});

}
else if(key === 'tile4'){
  const uniqueId = this.generateUniqueId();
  const newTile4 = {
    id: uniqueId,
    x: 0,
    y: 0,
    cols: 20,
    rows: 20,
    rowHeight: 200, // The height of each row in pixels
    colWidth: 200,  // The width of each column in pixels
    fixedColWidth: true,  // Enable fixed column widths
    fixedRowHeight: true,
    grid_type: "tile4",
    formlist: this.createKPIWidget3.value.formlist,
    parameterName: this.createKPIWidget3.value.parameterName,
    groupBy: this.createKPIWidget3.value.groupBy,

    groupByFormat: this.createKPIWidget3.value.groupByFormat,
    // selectedColor: this.createKPIWidget3.value.selectedColor ,
    themeColor: this.createKPIWidget3.value.themeColor,
 // Default value, change this to whatever you prefer
     // You can also handle default value for this if needed
  
        // secondaryValue: this.createKPIWidget4.value.secondaryValue, 




        multi_value: [
          {
            value: this.createKPIWidget3.value.primaryValue,// Change primaryValue to value
            constantValue: this.createKPIWidget3.value.constantValue !== undefined && this.createKPIWidget3.value.constantValue !== null
            ? this.createKPIWidget3.value.constantValue
            : 0,
          },
          {
            value: this.createKPIWidget3.value.CompareTile, // Change secondaryValue to value
          
          },
          {
            value :this.createKPIWidget3.value.WithCompareTile,
    
    
          },{
    
            processed_value: this.createKPIWidget3.value.processed_value || '',
          }
      ],
};

// Initialize this.dashboard if it hasn't been set yet
if (!this.dashboard) {
    this.dashboard = [];
}

// Push the new tile to dashboard
this.dashboard.push(newTile4);

console.log('this.dashboard after adding new tile', this.dashboard);

this.updateSummary('', 'add_tile');
this.createKPIWidget3.patchValue({
  widgetid: uniqueId // Set the ID in the form control
});

}

else if(key === 'tile5'){
  const uniqueId = this.generateUniqueId();
  const newTile5 = {
    id: uniqueId,
    x: 0,
    y: 0,
    cols: 20,
    rows: 20,
    rowHeight: 200, // The height of each row in pixels
    colWidth: 200,  // The width of each column in pixels
    fixedColWidth: true,  // Enable fixed column widths
    fixedRowHeight: true,
    grid_type: "tile5",
    formlist: this.createKPIWidget4.value.formlist,
    parameterName: this.createKPIWidget4.value.parameterName,
    groupBy: this.createKPIWidget4.value.groupBy,
 
    groupByFormat: this.createKPIWidget4.value.groupByFormat,
    // selectedColor: this.createKPIWidget4.value.selectedColor ,
    themeColor: this.createKPIWidget4.value.themeColor,
// Default value, change this to whatever you prefer
   

   





        multi_value: [
          {
            value: this.createKPIWidget4.value.primaryValue,
            constantValue: this.createKPIWidget4.value.constantValue !== undefined && this.createKPIWidget4.value.constantValue !== null
            ? this.createKPIWidget4.value.constantValue
            : 0, 
          },
          {
            value: this.createKPIWidget4.value.CompareTile, // Change secondaryValue to value
          
          },
          {
            value :this.createKPIWidget4.value.WithCompareTile,
    
    
          },{
    
            processed_value: this.createKPIWidget4.value.processed_value || '',
          },
          {
            value:this.createKPIWidget4.value.secondaryValue
          }
      ],

};

// Initialize this.dashboard if it hasn't been set yet
if (!this.dashboard) {
    this.dashboard = [];
}

// Push the new tile to dashboard
this.dashboard.push(newTile5);

console.log('this.dashboard after adding new tile', this.dashboard);

this.updateSummary('', 'add_tile');
this.createKPIWidget4.patchValue({
  widgetid: uniqueId // Set the ID in the form control
});

}
else if(key === 'tile6'){
  const uniqueId = this.generateUniqueId();
  const newTile6 = {
    id: uniqueId,
    x: 0,
    y: 0,
    cols: 20,
    rows: 20,
    rowHeight: 200, // The height of each row in pixels
    colWidth: 200,  // The width of each column in pixels
    fixedColWidth: true,  // Enable fixed column widths
    fixedRowHeight: true,
    grid_type: "tile6",
    formlist: this.createKPIWidget5.value.formlist,
    parameterName: this.createKPIWidget5.value.parameterName,
    groupBy: this.createKPIWidget5.value.groupBy,

    groupByFormat: this.createKPIWidget5.value.groupByFormat,
    selectedColor: this.createKPIWidget5.value.selectedColor ,
    themeColor: this.createKPIWidget5.value.themeColor,
 // Default value, change this to whatever you prefer
   // You can also handle default value for this if needed


    multi_value: [
      {
        primaryValue: this.createKPIWidget5.value.primaryValue,
        constantValue: this.createKPIWidget5.value.constantValue !== undefined && this.createKPIWidget5.value.constantValue !== null
        ? this.createKPIWidget5.value.constantValue
        : 0,
      },
      {
        value: this.createKPIWidget5.value.secondaryValue, // Change secondaryValue to value
      
      },
      {
        value :this.createKPIWidget5.value.secondaryValueNested


      },{

        processed_value: this.createKPIWidget5.value.processed_value || '',
      }
    
  ],
};

// Initialize this.dashboard if it hasn't been set yet
if (!this.dashboard) {
    this.dashboard = [];
}

// Push the new tile to dashboard
this.dashboard.push(newTile6);

console.log('this.dashboard after adding new tile', this.dashboard);

this.updateSummary('', 'add_tile');
this.createKPIWidget5.patchValue({
  widgetid: uniqueId // Set the ID in the form control
});

}
else if(key === 'tile7'){
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


  initializeTileFields1(){
    this.createKPIWidget1 = this.fb.group({
      'formlist':['',Validators.required],
      'parameterName':['',Validators.required],
      'groupBy':['',Validators.required],
      'primaryValue':['',Validators.required],
      'groupByFormat':['',Validators.required],
      'constantValue':[''],
'secondaryValue':['',Validators.required],
widgetid: [this.generateUniqueId()],
'processed_value':['',Validators.required],
// selectedColor: [this.selectedColor],
'themeColor': ['', Validators.required]
    })
  }

  onColorChange(event: Event) {
    const colorInput = event.target as HTMLInputElement;
    this.createKPIWidget1.get('themeColor')?.setValue(colorInput.value)
  
    console.log('Color changed:',   this.createKPIWidget1.get('themeColor')?.value);
  }
  onColorChange1(event: Event) {
    const colorInput = event.target as HTMLInputElement;
    this.createKPIWidget.get('themeColor')?.setValue(colorInput.value)
  
    console.log('Color changed:',   this.createKPIWidget.get('themeColor')?.value);
  }
  onColorChange2(event: Event) {
    const colorInput = event.target as HTMLInputElement;
    this.createKPIWidget2.get('themeColor')?.setValue(colorInput.value)
  
    console.log('Color changed:',   this.createKPIWidget2.get('themeColor')?.value);
  }
  onColorChange3(event: Event) {
    const colorInput = event.target as HTMLInputElement;
    this.createKPIWidget3.get('themeColor')?.setValue(colorInput.value)
  
    console.log('Color changed:',   this.createKPIWidget3.get('themeColor')?.value);
  }
  onColorChange4(event: Event) {
    const colorInput = event.target as HTMLInputElement;
    this.createKPIWidget4.get('themeColor')?.setValue(colorInput.value)
  
    console.log('Color changed:',   this.createKPIWidget4.get('themeColor')?.value);
  }
  onColorChange5(event: Event) {
    const colorInput = event.target as HTMLInputElement;
    this.createKPIWidget5.get('themeColor')?.setValue(colorInput.value)
  
    console.log('Color changed:',   this.createKPIWidget5.get('themeColor')?.value);
  }
  initializeTileFields2(){
    this.createKPIWidget2 = this.fb.group({
      'formlist':['',Validators.required],
      'parameterName':['',Validators.required],
      'groupBy':['',Validators.required],
      'primaryValue':['',Validators.required],
      'groupByFormat':['',Validators.required],
      'constantValue':[''],
'secondaryValue':['',Validators.required],
'secondaryValueNested':[''],
widgetid: [this.generateUniqueId()],
'processed_value':['',Validators.required],
// selectedColor: [this.selectedColor]'
'themeColor':['',Validators.required]
    })
  }

  initializeTileFields5(){
    this.createKPIWidget5 = this.fb.group({
      'formlist':['',Validators.required],
      'parameterName':['',Validators.required],
      'groupBy':['',Validators.required],
      'primaryValue':['',Validators.required],
      'groupByFormat':['',Validators.required],
      'constantValue':[''],
'secondaryValue':['',Validators.required],
'secondaryValueNested':['',Validators.required],
widgetid: [this.generateUniqueId()],
'processed_value':['',Validators.required],
// selectedColor: [this.selectedColor]
'themeColor':['',Validators.required]
    })
  }

  initializeTileFields6(){
    this.createKPIWidget6 = this.fb.group({
      'formlist':['',Validators.required],
      'parameterName':['',Validators.required],
      'value':['',Validators.required],
      'Target':['',Validators.required],
      'MaxRange':['',Validators.required],
      'groupByFormat':['',Validators.required],
      'constantValuevalue':['',Validators.required],
      'percentageValue':['',Validators.required],
      'constantValueTarget':['',Validators.required],
      'constantValueMaxRange':['',Validators.required],
      'percentageValueTarget':['',Validators.required],
      'percentageValueMaxRange':['',Validators.required]


    })
  }

  initializeTileFields3(){
    this.createKPIWidget3 = this.fb.group({
      'formlist':['',Validators.required],
      'parameterName':['',Validators.required],
      'groupBy':['',Validators.required],
      'primaryValue':['',Validators.required],
      'groupByFormat':['',Validators.required],
      'constantValue':[''],
'CompareTile':['',Validators.required],
'WithCompareTile':['',Validators.required],
widgetid: [this.generateUniqueId()],
'processed_value':['',Validators.required],
// selectedColor: [this.selectedColor]
'themeColor':['',Validators.required]
    })
  }
  initializeTileFields4(){
    this.createKPIWidget4 = this.fb.group({
      'formlist':['',Validators.required],
      'parameterName':['',Validators.required],
      'groupBy':['',Validators.required],
      'primaryValue':['',Validators.required],
      'groupByFormat':['',Validators.required],
      'constantValue':[''],
'CompareTile':['',Validators.required],
'WithCompareTile':['',Validators.required],
'secondaryValue':['',Validators.required],
widgetid: [this.generateUniqueId()],
'processed_value':['',Validators.required],
// selectedColor: [this.selectedColor]
'themeColor':['',Validators.required]
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


  createNewSummary() {
    // const selectedIcon = this.createSummaryField.value.iconSelect;
    // console.log('checking icon from create summary',selectedIcon)
    // Check if the form is valid, including the JSON field
    // if (this.createSummaryField.invalid || this.createSummaryField.get('jsonInputControl')?.invalid) {
    //     this.createSummaryField.markAllAsTouched(); // Show error messages for all fields
    //     console.log("Invalid form or invalid JSON data.");
        
    //     this.toast.open("Please enter valid JSON data before saving", " ", {
    //         duration: 3000,
    //         horizontalPosition: 'right',
    //         verticalPosition: 'top',
    //     });
        
    //     return; // Exit if the form is invalid
    // }
  
    let tempClient = this.SK_clientID + "#summary" + "#lookup";
    console.log('tempClient checking', tempClient);
  
    // Parse the JSON input control value
    // let parsedJsonData;
    // try {
    //     parsedJsonData = JSON.parse(this.createSummaryField.value.jsonInputControl);  // Parse the JSON string
    // } catch (error) {
    //     console.error("Invalid JSON format", error);
    //     this.toast.open("Invalid JSON format. Please correct it.", " ", {
    //         duration: 3000,
    //         horizontalPosition: 'right',
    //         verticalPosition: 'top',
    //     });
    //     return; // Exit on error
    // }

    // Get the current date in seconds since epoch
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

       // Add the selected icon
        crDate: createdDate, // Created date
        upDate: updatedDate,  // Updated date
        createdUser: this.getLoggedUser.username // Set the creator's username
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
           // Include selected icon in the metadata
            created: createdDateISO, // Created date in ISO format
            updated: updatedDateISO,   // Updated date in ISO format
            createdUser: this.allCompanyDetails.createdUser, // Use the persisted createdUser
            iconObject: this.allCompanyDetails.iconObject,
        })
    };
  
    console.log("TempObj is here ", tempObj);
    const temobj1:any = JSON.stringify(this.createSummaryField.value.iconSelect)
    // Prepare items for further processing
    console.log("this.createSummaryField.value.iconSelec",this.createSummaryField.value.iconSelect)
    console.log("temobj1",temobj1)
    const items = {
        P1: this.createSummaryField.value.summaryID,
        P2: this.createSummaryField.value.summaryName,
        P3: this.createSummaryField.value.summarydesc,
        P4: updatedDate,  // Updated date
        P5: createdDate,   // Created date
        P6: this.allCompanyDetails.createdUser,  // Created by user
        P7: this.getLoggedUser.username,          // Updated by user
        P8: JSON.stringify(this.previewObjDisplay), 
        P9:  this.createSummaryField.value.iconSelect // Add selected icon
    };
  
    // API call to create the summary
    this.api.CreateMaster(tempObj).then(async (value: any) => {
        await this.createLookUpSummary(items, 1, tempClient);
  
        this.datatableConfig = {};
        this.lookup_data_summary = [];

        console.log('value check from create master', value);
        if (value) {
          this.loadData() 
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'New summary successfully created',
                showConfirmButton: false,
                timer: 1500
            });
            if (this.modalRef) {
                this.modalRef.close();  // Close the modal
            }
        } else {
            Swal.fire({
                position: 'top-end',
                icon: 'error',
                title: 'Failed to create summary',
                showConfirmButton: false,
                timer: 1500
            });
        }

    }).catch(err => {
        console.log('err for creation', err);
        this.toast.open("Error in adding new Summary Configuration ", "Check again", {
            duration: 5000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
        });
    });
}



  
  


  async createLookUpSummary(item: any, pageNumber: number,tempclient:any){
    console.log('temp client checking from lookupsummary',tempclient)
    console.log('item checking from lookup',item)
    
    
    try {
      console.log("iam a calleddd dude", item, pageNumber);
      const response = await this.api.GetMaster(tempclient, pageNumber);
      console.log('response check',response)
  
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
        await this.createLookUpSummary(item, pageNumber + 1,tempclient);
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

  fetchCompanyLookupdata(sk:any):any {
    console.log("I am called Bro");
    console.log('this.SK_clientID check lookup',this.SK_clientID)
    
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
                  console.log('element check',element)
  
                  if (element !== null && element !== undefined) {
                    // Extract values from each element and push them to lookup_data_user
                    const key = Object.keys(element)[0]; // Extract the key (e.g., "L1", "L2")
                    const { P1, P2, P3, P4,P5,P6,P7,P8 } = element[key]; // Extract values from the nested object
                    this.lookup_data_summary.push({ P1, P2, P3, P4,P5,P6,P7,P8}); // Push an array containing P1, P2, P3, P4, P5, P6
                    console.log("d2 =", this.lookup_data_summary);
                  } else {
                    break;
                  }
                }
  
                // Sort the lookup_data_user array based on P5 values in descending order
                // this.lookup_data_summary.sort((a: { P5: number; }, b: { P5: number; }) => b.P5 - a.P5);
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
  loadData() {
    this.lookup_data_summary1=[]
    this.lookup_data_summaryCopy=[]
    this.fetchCompanyLookupdataOnit(1).then((data: any) => {
      this.lookup_data_summaryCopy = data; // Assign data to the component property
      console.log('Data loaded:', this.lookup_data_summaryCopy); // Log to verify

      this.lookup_data_summaryCopy.forEach(item => {
        if (item.P8) {
          try {
            // Parse the P8 property
            const parsedIcon = JSON.parse(item.P8);
            console.log('Parsed Icon Object:', parsedIcon);
            
            // Optionally, store the parsed icon back into the object
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
      console.log('this.lookup_data_summaryCopy parsed data',this.lookup_data_summaryCopy)
  
      this.cdr.detectChanges(); // Ensure UI updates
    }).catch((error: any) => {
      console.error('Failed to load company lookup data:', error);

  
      // Assuming P8 is present in lookup_data_summaryCopy
 
      this.cdr.detectChanges(); // Ensure UI updates
    }).catch((error: any) => {
      console.error('Failed to load company lookup data:', error);
    });
  }
  


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
                    const { P1, P2, P3, P4, P5, P6, P7,P8,P9 } = element[key];
                    this.lookup_data_summary1.push({ P1, P2, P3, P4, P5, P6, P7,P8,P9});
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
  
  async showTable() {
    console.log("Show DataTable is called BTW");
  
    this.datatableConfig = {};
    this.lookup_data_summary = [];
    
    this.datatableConfig = {
      serverSide: true,
      ajax: (dataTablesParameters: any, callback) => {
        this.fetchCompanyLookupdata(1)
          .then((resp: any) => {
            const responseData = resp || []; // Default to an empty array if resp is null
            this.lookup_data_summary = responseData; // Ensure summary data is set here
  
            // Prepare the response structure expected by DataTables
            callback({
              draw: dataTablesParameters.draw, // Echo the draw parameter
              recordsTotal: responseData.length, // Total number of records
              recordsFiltered: responseData.length, // Filtered records
              data: responseData // The actual data array
            });
  
            console.log("Response is in this form ", responseData);
          })
          .catch((error: any) => {
            console.error('Error fetching user lookup data:', error);
            // Provide an empty dataset in case of an error
            callback({
              draw: dataTablesParameters.draw,
              recordsTotal: 0,
              recordsFiltered: 0,
              data: []
            });
          });
      },
      columns: [
        { title: 'ID', data: 'P1' },
        { title: 'Name', data: 'P2' },
        { title: 'Description', data: 'P3' },
        {
          title: 'Updated', data: 'P4', render: function (data) {
            const updatedDate = new Date(data * 1000);
            return `${updatedDate.toDateString()} ${updatedDate.toLocaleTimeString()}`; // Format the date and time
          }
        },
        {
          title: 'Created', data: 'P5', render: function (data) {
            const createdDate = new Date(data * 1000);
            return `${createdDate.toDateString()} ${createdDate.toLocaleTimeString()}`; // Format the date and time
          }
        },
        { title: 'Created UserName', data: 'P6' },
        { title: 'Updated UserName', data: 'P7' },
      ],
      createdRow: (row, data, dataIndex) => {
        $('td:eq(0)', row).addClass('d-flex align-items-center');
      },
    };
  }
  


  jsondata(jsondata: any): string {
    throw new Error('Method not implemented.');
  }
  // updateSummary(value: any, key: any) {
  //   this.createSummaryField.get('summaryID')?.enable();
  
  //   // const selectedIcon = this.createSummaryField.value.iconSelect;

  
  //   let tempObj: any = [];
  
  //   if (key === "editSummary") {
  //     this.showAddWidgetsTab = true;
    
  //     console.log('this.allCompanyDetails check from editsummary',this.allCompanyDetails)
  
  //     this.allCompanyDetails = {
  //       summaryID: this.createSummaryField.value.summaryID,
  //       summaryName: this.createSummaryField.value.summaryName,
  //       summaryDesc: this.createSummaryField.value.summarydesc,
   
  //       summaryIcon: this.createSummaryField.value.iconSelect,
  //       iconObject: this.previewObjDisplay,
  //       updated: new Date(),
  //       createdUser: this.createdUserName,
  //     };
  
  //     tempObj = {
  //       PK: `${this.SK_clientID}#${this.allCompanyDetails.summaryID}#summary#main`,
  //       SK: 1,
  //       metadata: {
  //         summaryID: this.createSummaryField.value.summaryID,
  //         summaryName: this.createSummaryField.value.summaryName,
  //         summaryDesc: this.createSummaryField.value.summarydesc,
  //         updated: new Date(),
  //         createdUser: this.createdUserName,
  //         summaryIcon: this.createSummaryField.value.iconSelect,
  //         iconObject:JSON.stringify(this.previewObjDisplay)
  //       }
  //     };
  //   } else if (key === "add_tile") {
  //     console.log('this.grid_details check', this.grid_details);
  
  //     this.allCompanyDetails = {
  //       summaryID: this.createSummaryField.value.summaryID,
  //       summaryName: this.createSummaryField.value.summaryName,
  //       summaryDesc: this.createSummaryField.value.summarydesc,
    
  //       summaryIcon: this.createSummaryField.value.iconSelect,
  //       iconObject: this.previewObjDisplay,
  //       updated: new Date(),
  //       createdUser: this.createdUserName,
  //     };
  // console.log('this.allCompanyDetails check',this.allCompanyDetails)
  //     tempObj = {
  //       PK: `${this.SK_clientID}#${this.allCompanyDetails.summaryID}#summary#main`,
  //       SK: 1,
  //       metadata: {
  //         summaryID: this.createSummaryField.value.summaryID,
  //         summaryName: this.createSummaryField.value.summaryName,
  //         summaryDesc: this.createSummaryField.value.summarydesc,
  //         grid_details: this.dashboard, // Use the grid_details directly
  //         updated: new Date(),
  //         createdUser: this.createdUserName,
  //         summaryIcon: this.createSummaryField.value.iconSelect,
  //         iconObject: this.previewObjDisplay,
  //       }
  //     };
  //     console.log('tempObj check from update Tile',tempObj)
  //   }
  //   else if(key=="update_tile"){
   
  //     console.log('Before this.all_Packet_store checking from update tile',this.all_Packet_store)

    
  //     this.allCompanyDetails = {
  //       summaryID: this.createSummaryField.value.summaryID,
  //       summaryName: this.createSummaryField.value.summaryName,
  //       summaryDesc: this.createSummaryField.value.summarydesc,
  //       summaryIcon: this.createSummaryField.value.iconSelect,
  //       iconObject: this.previewObjDisplay,
  //       // summaryIcon: selectedIcon,
  //       updated: new Date(),
  //       createdUser: this.createdUserName,
  //     };
  // console.log('this.allUpdateTile check',this.allUpdateTile)
  //     tempObj = {
  //       PK: `${this.SK_clientID}#${this.allCompanyDetails.summaryID}#summary#main`,
  //       SK: 1,
  //       metadata: {
  //         summaryID: this.createSummaryField.value.summaryID,
  //         summaryName: this.createSummaryField.value.summaryName,
  //         summaryDesc: this.createSummaryField.value.summarydesc,
  //         grid_details: this.dashboard, // Use the grid_details directly
  //         updated: new Date(),
  //         createdUser: this.createdUserName,
  //          summaryIcon: this.createSummaryField.value.iconSelect,
  //          iconObject: this.previewObjDisplay,
  //       }
  //     };
  //     console.log('tempObj check from update Tile',tempObj)

  //   }
  // if(typeof tempObj.metadata =="string"){
  //   tempObj.metadata = JSON.stringify(JSON.parse(tempObj.metadata));
  // }else{
  //   tempObj.metadata = JSON.stringify(tempObj.metadata);
  // }

  
  //   const updatedDate = Math.ceil(new Date().getTime() / 1000);
  //   const items = {
  //     P1: this.createSummaryField.value.summaryID,
  //     P2: this.createSummaryField.value.summaryName,
  //     P3: this.createSummaryField.value.summarydesc,
  //     P4: updatedDate,
  //     P5: Math.floor(new Date(this.createdTime).getTime() / 1000),
  //     P6: this.createdUserName,
  //     P7: this.getLoggedUser.username,
  //     P8: JSON.stringify(this.previewObjDisplay),
  //     P9:  this.createSummaryField.value.iconSelect
  //   };
  //   console.log('After this.all_Packet_store checking from update tile',this.all_Packet_store)
  //   this.api.UpdateMaster(tempObj).then(async response => {
  //     if (response && response.metadata) {
  //       await this.fetchTimeMachineById(1, items.P1, 'update', items);
  //       const parsedMetadata = JSON.parse(response.metadata);
  //       console.log('parsedMetadata check', parsedMetadata);
  //       this.all_Packet_store = parsedMetadata;
  //       this.datatableConfig = {};
  //       this.lookup_data_summary = [];
  //       this.cd.detectChanges();
  //       console.log('After Parsed inserted this.all_Packet_store checking from update tile',this.all_Packet_store)
  //       Swal.fire({
  //         position: 'top-end',
  //         icon: 'success',
  //         title: 'Summary updated successfully',
  //         showConfirmButton: false,
  //         timer: 1500
  //       });
  
  //       this.addFromService();
  //       if (this.modalRef) {
  //         this.modalRef.close();
  //       }
  //     } else {
  //       alert('Error in updating Company Configuration');
  //     }
  //   }).catch((err: any) => {
  //     console.log('error for updating', err);
  //     Swal.fire({
  //       position: 'top-end',
  //       icon: 'error',
  //       title: 'Failed to update summary. Please try again.',
  //       showConfirmButton: false,
  //       timer: 1500
  //     });
  //   });
  
  //   this.loadData();
  // }
  updateSummary(value: any, key: any) {
    this.createSummaryField.get('summaryID')?.enable();

    // Constructing the allCompanyDetails object
    this.allCompanyDetails = {
        summaryID: this.createSummaryField.value.summaryID,
        summaryName: this.createSummaryField.value.summaryName,
        summaryDesc: this.createSummaryField.value.summarydesc,
        summaryIcon: this.createSummaryField.value.iconSelect,
        iconObject: this.previewObjDisplay,
        updated: new Date().toISOString(), // Use ISO format for consistency
        createdUser: this.createdUserName,
    };

    // Construct grid_details in normal JSON format, with conditional parsing/stringifying for multi_value
    const formattedDashboard = this.dashboard.map(tile => {
      let multiValueFormatted;
  
      // Check if multi_value is a string
      if (typeof tile.multi_value === 'string') {
          try {
              // Parse it first if it's a string
              multiValueFormatted = JSON.parse(tile.multi_value);
  
              // Stringify again to ensure it's in the correct format
              multiValueFormatted = JSON.stringify(multiValueFormatted);
          } catch (error) {
              console.error('Error parsing multi_value:', error);
              multiValueFormatted = '[]'; // Default to an empty array if parsing fails
          }
      } else {
          // If it's not a string (i.e., an array or object), stringify it
          multiValueFormatted = JSON.stringify(tile.multi_value || []);
      }
  
      return {
          ...tile,
          multi_value: multiValueFormatted // Updated multi_value
      };
  });
  

    let tempObj: any = {
        PK: `${this.SK_clientID}#${this.allCompanyDetails.summaryID}#summary#main`,
        SK: 1, // Use a simple number as requested
        metadata: {
            summaryID: this.createSummaryField.value.summaryID,
            summaryName: this.createSummaryField.value.summaryName,
            summaryDesc: this.createSummaryField.value.summarydesc,
            updated: new Date().toISOString(), // Ensure the updated field is formatted
            createdUser: this.createdUserName,
            summaryIcon: this.createSummaryField.value.iconSelect,
            iconObject: this.previewObjDisplay, // Directly use the icon object
            grid_details: formattedDashboard // Use the array with conditionally formatted multi_value
        }
    };

    // Logging the constructed metadata object
    console.log('Constructed metadata with conditionally formatted multi_value:', JSON.stringify(tempObj.metadata, null, 2));
    tempObj.metadata = JSON.stringify(tempObj.metadata);

    // Validate PK and SK before proceeding
    if (!tempObj.PK || typeof tempObj.PK !== 'string') {
        console.error("Invalid PK:", tempObj.PK);
        return Swal.fire({
            position: 'top-end',
            icon: 'error',
            title: 'Failed to update summary. PK must be a valid non-null string.',
            showConfirmButton: false,
            timer: 1500
        });
    }

    // Validate SK
    if (tempObj.SK == null || typeof tempObj.SK !== 'number') {
        console.error("Invalid SK:", tempObj.SK);
        return Swal.fire({
            position: 'top-end',
            icon: 'error',
            title: 'Failed to update summary. SK must be a valid non-null integer.',
            showConfirmButton: false,
            timer: 1500
        });
    }

    // API call to update the master
    console.log('tempObj before API call:', JSON.stringify(tempObj, null, 2)); // Log the tempObj

    this.api.UpdateMaster(tempObj).then(async response => {
        console.log('API Response:', response); // Log the API response

        if (response && response.metadata) {
            try {
                const parsedMetadata = JSON.parse(response.metadata); // Parse the metadata
                console.log('Parsed Metadata:', parsedMetadata); // Log parsed metadata

                // Fetch updated data
                await this.fetchTimeMachineById(1, this.createSummaryField.value.summaryID, 'update', {
                    P1: this.createSummaryField.value.summaryID,
                    P2: this.createSummaryField.value.summaryName,
                    P3: this.createSummaryField.value.summarydesc,
                    P4: Math.ceil(new Date().getTime() / 1000), // Updated date
                    P5: Math.floor(new Date(this.createdTime).getTime() / 1000),
                    P6: this.createdUserName,
                    P7: this.getLoggedUser.username,
                    P8: JSON.stringify(this.previewObjDisplay),
                    P9: this.createSummaryField.value.iconSelect
                });

                console.log('Data fetched successfully.'); // Log after successful fetch

                this.all_Packet_store = parsedMetadata; // Update the local state
                this.datatableConfig = {};
                this.lookup_data_summary = [];
                this.cd.detectChanges();

                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: 'Summary updated successfully',
                    showConfirmButton: false,
                    timer: 1500
                });

                this.addFromService();

                if (this.modalRef) {
                    this.modalRef.close();
                }
            } catch (error: any) {
                console.error('Error in processing:', error); // Log processing errors
                Swal.fire({
                    position: 'top-end',
                    icon: 'error',
                    title: 'Error in processing data: ' + error.message,
                    showConfirmButton: true,
                });
            }
        } else {
            console.error('Response structure is invalid:', response); // Log invalid response structure
            Swal.fire({
                position: 'top-end',
                icon: 'error',
                title: 'Error in updating Company Configuration',
                showConfirmButton: true,
            });
        }
    }).catch(err => {
        console.error('Error calling UpdateMaster:', err); // Log the error details
        Swal.fire({
            position: 'top-end',
            icon: 'error',
            title: 'Failed to update summary. Please try again.',
            text: err.message, // Provide additional context for the error
            showConfirmButton: false,
            timer: 1500
        });
    });

    this.loadData(); // Call this at the end to refresh data if needed
}









onAddWidgetTabClick() {
  // Check if we're in add mode and widgets are not allowed
  if (!this.showAddWidgetsTab && !this.showModal) {
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




formatJsonDataForUpdate(jsonData:any) {
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
    console.log("item check from fetchtimemachine", item);
  
    try {
      const response = await this.api.GetMaster(tempClient, sk);
      console.log('response check from timemechin',response)
  
      if (response && response.options) {
        let data: ListItem[] = await JSON.parse(response.options);
  
        // Find the index of the item with the matching id
        let findIndex = data.findIndex((obj) => obj[Object.keys(obj)[0]].P1 === id);
  
        if (findIndex !== -1) { // If item found
          if (type === 'update') {
            data[findIndex][`L${findIndex + 1}`] = item;
  
            // Create a new array to store the re-arranged data without duplicates
            const newData = [];
  
            // Loop through each object in the data array
            for (let i = 0; i < data.length; i++) {
              const originalKey = Object.keys(data[i])[0]; // Get the original key (e.g., L1, L2, ...)
              const newKey = `L${i + 1}`; // Generate the new key based on the current index
  
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
  
            // Replace the original data array with the newData array
            data = newData;
            // Update the local state or service with the new data
            this.lookup_data_summary = data; // Assuming this is the variable bound to your UI
            this.cd.detectChanges(); // Trigger change detection if needed
            
          } else if (type === 'delete') {
            data.splice(findIndex, 1);
            this.lookup_data_summary = data; // Update the UI data
            this.cd.detectChanges(); // Trigger change detection if needed
          }
  
          // Prepare the updated data for API update
          let updateData = {
            PK: tempClient,
            SK: response.SK,
            options: JSON.stringify(data)
          };
  
          // Update the data in the API
          await this.api.UpdateMaster(updateData);
  
        } else { // If item not found
          await new Promise(resolve => setTimeout(resolve, 500)); // Wait before retrying
          await this.fetchTimeMachineById(sk + 1, id, type, item); // Retry with next SK
  
        }
      } else { // If response or listOfItems is null
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



  // addFromService() {

  // }


  async getClientID() {
    try{

      await this.fetchTMClientLookup(1)

      for(let i = 0;i<this.lookup_data_client.length;i++){
        this.listofClientIDs.push(this.lookup_data_client[i].P1);
      } 

      this.listofClientIDs = Array.from(new Set(this.listofClientIDs)) 

      console.log("All the clients data is here ",this.listofClientIDs)

    }
    catch(err){
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
                const { P1, P2, P3, P4,P5,P6,P7,P8,P9} = element[key];
                this.lookup_data_client.push({ P1, P2, P3, P4,P5,P6,P7,P8,P9 });
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
        this.formList = helpherObj.map((item: [string]) => item[0]); // Explicitly define the type
        this.listofDeviceIds = this.formList.map((form: string) => ({ text: form, value: form })); // Explicitly define the type here too
        console.log('this.formList check from location', this.formList);
      }
    } catch (err) {
      console.log("Error fetching the dynamic form data", err);
    }

this.userdetails = this.getLoggedUser.username;
  this.userClient = this.userdetails +"#user"+"#main"
    console.log('this.tempClient from form service check',this.userClient)
    this.All_button_permissions =  await this.api.GetMaster(this.userClient,1).then(data =>{
      // const metadataString: string | null | undefined = data.metadata;

      // // Check if metadataString is a valid string before parsing
      // if (typeof metadataString === 'string') {
      //     try {
      //         // Parse the JSON string into a JavaScript object
      //         this.metadataObject = JSON.parse(metadataString);
      //         console.log('Parsed Metadata Object:', this.metadataObject);
      //     } catch (error) {
      //         console.error('Error parsing JSON:', error);
      //     }
      // } else {
      //     console.log('Metadata is not a valid string:', metadataString);
      // }
      if(data){
        console.log('data checking from add form',data)
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
       return  this.modifyList(this.metadataObject.location_permission,this.metadataObject.form_permission)==="All-All"?false:true
      
      }
      
      })

      console.log("this.All_button_permissions",this.All_button_permissions )
    this.locationPermissionService.fetchGlobalLocationTree()
    .then((jsonModified:any) => {
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
        magicboard_view:treeNode.magicboard_view,
        powerboard_view:treeNode.powerboard_view,
        description:treeNode.description,
        summaryView:treeNode.summaryView,
        dreamboard_view:treeNode.dreamboard_view,
        powerboard_view_device:treeNode.powerboard_view_device,
        icon:treeNode.icon

     

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
          console.log('data checking from tree',data)
          //console.log('data in tree', data);

          this.parentID_selected_node = data.node.parent
          // for (node = 0, selected_node = data.selected.length; node < selected_node; node++) {

          // }
          this.final_list = data.instance.get_node(data.selected);
          console.log('this.final_list check',this.final_list)
          
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

//   createJSTree(jsondata: any) {
//     this.originalData = jsondata;

//     const initializeTree = (data: any) => {
//         // Assert the type of $('#SimpleJSTree') as JQueryStatic & { jstree: any }
//         const $tree = $('#SimpleJSTree') as any;

//         $tree.jstree({
//             "core": {
//                 "check_callback": true,
//                 'data': data,
//                 'multiple': false,
//             },
//             'search': {
//                 'show_only_matches': true,
//             },
//             "plugins": ["contextmenu", "dnd", "search"],
//             "contextmenu": {
//                 "items": (node: any) => {
//                     let tree = $tree.jstree(true);
//                     return {
//                         "Create": {
//                             "separator_before": false,
//                             "separator_after": true,
//                             "label": "Add Location",
//                             "action": false,
//                             "submenu": {
//                                 "Child": {
//                                     "separator_before": false,
//                                     "separator_after": false,
//                                     "label": "Child",
//                                     action: () => {
//                                         let newNode = tree.create_node(node, { text: 'New Child', type: 'file', icon: 'glyphicon glyphicon-file' });
//                                         tree.deselect_all();
//                                         tree.select_node(newNode);
//                                     }
//                                 },
//                                 "Parent": {
//                                     "separator_before": false,
//                                     "separator_after": false,
//                                     "label": "Parent",
//                                     action: () => {
//                                         let newNode = tree.create_node(node, { text: 'New Parent', type: 'default' });
//                                         tree.deselect_all();
//                                         tree.select_node(newNode);
//                                     }
//                                 }
//                             }
//                         },
//                         "Rename": {
//                             "separator_before": false,
//                             "separator_after": false,
//                             "label": "Edit Location",
//                             "action": () => {
//                                 tree.edit(node);
//                             }
//                         },
//                         "Remove": {
//                             "separator_before": false,
//                             "separator_after": false,
//                             "label": "Remove Location",
//                             "action": () => {
//                                 tree.delete_node(node);
//                             }
//                         }
//                     };
//                 }
//             }
//         })
//         .on("changed.jstree", (e: any, data: any) => {
//             if (data && data.node && data.node.text) {
//                 this.parentID_selected_node = data.node.parent;
//                 this.final_list = data.instance.get_node(data.selected[0]);

//                 if (this.final_list.original.node_type === 'location') {
//                     this.enableLocationButton = true;
//                     this.enableDeviceButton = false;
//                 } else if (this.final_list.original.node_type === 'device') {
//                     this.enableLocationButton = false;
//                     this.enableDeviceButton = true;
//                 }
//             }
//         });
//     };

//     initializeTree(this.originalData);

//     let to: any = false;
//     $('#search').keyup(() => {
//         if (to) {
//             clearTimeout(to);
//         }
//         to = setTimeout(() => {
//             let searchTerm = $('#search').val();

//             if (searchTerm && (searchTerm.length > 0)) { // Updated condition to avoid error
//                 $tree.jstree(true).search(searchTerm);
//             } else {
//                 $tree.jstree(true).clear_search();
//                 $tree.jstree(true).destroy();
//                 initializeTree(this.originalData);
//             }
//         }, 250);
//     });
// }
LocationSummary() {
  let navId :any
  //console.log('CHECK THIS LOCATION THING ', this.final_list)
  if(this.final_list.original.node_type == "location"){
    navId = this.final_list.original.summaryView;
  }else{
  navId = this.final_list.original.powerboard_view_device.id;
  }

console.log('navId check from summary',navId)
  let navIdList = { id: navId }
  if (navId !== '') {
    
    // localStorage.setItem('fullscreen', 'true');
   this.viewItem(navId) 
    // this.loadAllWidgets(navId) } else {
    // alert('check out ur current location doesnt have dashboardId')
  }

}

setActiveTab(tab: Tabs) {
  //checking all the mandatory fields are filled are not
  // if(this.createNewWidgets.status === "VALID"){
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




editItem(item: any) {
  console.log('Editing item:', item);
  
  // Open edit modal or perform the edit action here
  // Example: this.openEditModal(item);
}

// onSelect(value: any) {
//   if (value) {
//     // Open the modal when a value is selected
//     this.modalService.open(this.calendarModal);
//   }
// }
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
// closeAllModals() {
//   this.modalService.dismissAll(); // Dismiss all open modals
// }
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
calenderClose(event:any){

  
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
  console.log('selectedValue checking',selectedValue); // Optional: log the selected value
}


get primaryValue() {
  return this.createKPIWidget.get('primaryValue');
}
get primaryValue1() {
  return this.createKPIWidget1.get('primaryValue');
}

get primaryValue2() {
  return this.createKPIWidget2.get('primaryValue');
}

get primaryValue3() {
  return this.createKPIWidget3.get('primaryValue');
  
}

get primaryValue4() {
  return this.createKPIWidget4.get('primaryValue');
}
get primaryValue5() {
  return this.createKPIWidget5.get('primaryValue');
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
onValueChangevalue1(selectedValue: any): void {
  // Handle any logic here if needed when the value changes
  console.log(selectedValue); // Optional: log the selected value
}
onValueChange1(selectedValue: any): void {
  // Handle any logic here if needed when the value changes
  console.log(selectedValue); // Optional: log the selected value
}
onValueChange3(selectedValue: any): void {
  // Handle any logic here if needed when the value changes
  console.log(selectedValue); // Optional: log the selected value
}
onValueChange6(selectedValue: any): void {
  // Handle any logic here if needed when the value changes
  console.log(selectedValue); // Optional: log the selected value
}
onValueChange4(selectedValue: any): void {
  // Handle any logic here if needed when the value changes
  console.log(selectedValue); // Optional: log the selected value
}
onValueChange5(selectedValue: any): void {
  // Handle any logic here if needed when the value changes
  console.log(selectedValue); // Optional: log the selected value
}

// }
selectValue1(value: string, modal: any) {
  console.log('Selected value:', value);
  
  // Set the value to the form control
  this.groupByFormatControl1.setValue(value);
  
  // Close the modal after selection
  this.closeModal(modal);
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




openKPIModal2(content: any, tile?: any, index?: number) {
  if (tile) {
    this.selectedTile = tile;
    this.editTileIndex2 = index !== undefined ? index : null; // Store the index, default to null if undefined
    console.log('Tile Object:', tile); // Log the tile object

    // Parse multi_value if it's a string
    let parsedMultiValue = [];
    if (typeof tile.multi_value === 'string') {
      try {
        parsedMultiValue = JSON.parse(tile.multi_value);
        console.log('Parsed multi_value:', parsedMultiValue); // Log parsed multi_value to verify structure
      } catch (error) {
        console.error('Error parsing multi_value:', error);
      }
    } else {
      parsedMultiValue = tile.multi_value || [];
    }

    // Extract values for primaryValue, secondaryValue, and secondaryValueNested from parsed multi_value
    const primaryValue = parsedMultiValue[0]?.value || ''; // Assuming value corresponds to primaryValue
    const constantValue = parsedMultiValue[0]?.constantValue || 0; // Assuming constantValue is in the first item
    const secondaryValue = parsedMultiValue[1]?.value || ''; // Assuming value corresponds to secondaryValue
    const secondaryValueNested = parsedMultiValue[2]?.value || ''; // Assuming value corresponds to secondaryValueNested
    const parsedValue = parsedMultiValue[3]?.processed_value !== undefined ? parsedMultiValue[3].processed_value : 0;

    // Initialize form fields and pre-select values
    this.initializeTileFields2();
    this.createKPIWidget2.patchValue({
      formlist: tile.formlist,
      parameterName: tile.parameterName,
      groupBy: tile.groupBy,
      primaryValue: primaryValue, // Set the primaryValue
      groupByFormat: tile.groupByFormat,
      constantValue: constantValue, // Set the constantValue
      secondaryValue: secondaryValue, // Set the secondaryValue
      secondaryValueNested: secondaryValueNested ,// Set the secondaryValueNested
      processed_value: parsedValue,
      themeColor:tile.themeColor
    });

    this.isEditMode = true; // Set to edit mode
  } else {
    this.selectedTile = null; // No tile selected for adding
    this.isEditMode = false; // Set to add mode
    this.createKPIWidget2.reset(); // Reset the form for new entry
  }
  this.themes.forEach(theme => {
    theme.selected = false; // Deselect all themes
  });

  // Find the theme that matches the tile's themeColor
  const matchingTheme = this.themes.find(theme => theme.color === tile?.themeColor);

  // If a matching theme is found, set it as selected
  if (matchingTheme) {
    matchingTheme.selected = true;
    console.log('Matching theme found and selected:', matchingTheme);
  }

  // Open the modal
  this.modalService.open(content, { size: 'lg', ariaLabelledBy: 'modal-basic-title' });

  // Any additional setup if needed
  this.showTable();
  this.reloadEvent.next(true);
}

openKPIModal5(content: any, tile?: any, index?: number) {
  if (tile) {
    this.selectedTile = tile;
    this.editTileIndex5 = index !== undefined ? index : null; // Store the index, default to null if undefined
    console.log('Tile Object5:', tile); // Log the tile object

    let parsedMultiValue = [];
    if (typeof tile.multi_value === 'string') {
      try {
        parsedMultiValue = JSON.parse(tile.multi_value);
        console.log('Parsed multi_value:', parsedMultiValue); // Log parsed multi_value to verify structure
      } catch (error) {
        console.error('Error parsing multi_value:', error);
      }
    } else {
      parsedMultiValue = tile.multi_value || [];
    }

    // Extract values for primaryValue, secondaryValue, and secondaryValueNested from parsed multi_value
    const primaryValue5 = parsedMultiValue[0]?.primaryValue || ''; // Use primaryValue for the first item
    const constantValue5 = parsedMultiValue[0]?.constantValue || ''; // Assuming constantValue is in the first item
    const secondaryValue5 = parsedMultiValue[1]?.value || ''; // Assuming value corresponds to secondaryValue
    const secondaryValueNested5 = parsedMultiValue[2]?.value || ''; // Assuming value corresponds to secondaryValueNested
    const processed_value5 = parsedMultiValue[3]?.processed_value || ''; // Assuming processed_value is in the fourth item

    // Initialize form fields and pre-select values
    this.initializeTileFields5();
    this.createKPIWidget5.patchValue({
        formlist: tile.formlist,
        parameterName: tile.parameterName,
        groupBy: tile.groupBy,
        primaryValue: primaryValue5, // Corrected to use primaryValue from the first item
        groupByFormat: tile.groupByFormat,
        constantValue: constantValue5, // Corrected to use the constantValue from the first item
        secondaryValue: secondaryValue5, // Corrected to use value from the second item
        secondaryValueNested: secondaryValueNested5, // Corrected to use value from the third item
        processed_value: processed_value5 ,// Corrected to use processed_value from the fourth item
        themeColor: tile.themeColor
    });

    this.isEditMode = true; // Set to edit mode
  } else {
    this.selectedTile = null; // No tile selected for adding
    this.isEditMode = false; // Set to add mode
    this.createKPIWidget5.reset(); // Reset the form for new entry
  }

  this.themes.forEach(theme => {
    theme.selected = false; // Deselect all themes
  });

  // Find the theme that matches the tile's themeColor
  const matchingTheme = this.themes.find(theme => theme.color === tile?.themeColor);

  // If a matching theme is found, set it as selected
  if (matchingTheme) {
    matchingTheme.selected = true;
    console.log('Matching theme found and selected:', matchingTheme);
  }

  this.modalService.open(content, { size: 'lg', ariaLabelledBy: 'modal-basic-title' });
  this.showTable();
  this.reloadEvent.next(true);
}




openKPIModal6(content: any, tile?: any, index?: number) {
  if (tile) {
    this.selectedTile = tile;
    this.editTileIndex6 = index !== undefined ? index : null; // Store the index, default to null if undefined
    console.log('Tile Object:', tile); // Log the tile object

    // Initialize form fields and pre-select values
    this.initializeTileFields6();
    this.createKPIWidget6.patchValue({
      formlist: tile.formlist,
      parameterName: tile.parameterName,
      value: tile.value,
      Target: tile.Target,
      MaxRange:tile.MaxRange,
      groupByFormat:tile.groupByFormat,
      constantValuevalue:tile.constantValuevalue,
      percentageValue:tile.percentageValue,
      constantValueTarget:tile.constantValueTarget,
      constantValueMaxRange:tile.constantValueMaxRange,
      percentageValueTarget:tile.percentageValueTarget,
      percentageValueMaxRange:tile.percentageValueMaxRange




    });
    
    this.isEditMode = true; // Set to edit mode
} else {
    this.selectedTile = null; // No tile selected for adding
    this.isEditMode = false; // Set to add mode
    this.createKPIWidget6.reset(); // Reset the form for new entry
}
this.themes.forEach(theme => {
  theme.selected = false; // Deselect all themes
});

// Find the theme that matches the tile's themeColor
const matchingTheme = this.themes.find(theme => theme.color === tile?.themeColor);

// If a matching theme is found, set it as selected
if (matchingTheme) {
  matchingTheme.selected = true;
  console.log('Matching theme found and selected:', matchingTheme);
}


  this.modalService.open(content, { size: 'lg', ariaLabelledBy: 'modal-basic-title' });
  this.showTable() 
  // 
  this.reloadEvent.next(true);
}
onValueChange2(selectedValue: any): void {
  // Handle any logic here if needed when the value changes
  console.log(selectedValue); // Optional: log the selected value
}

selectValue2(value: string, modal: any) {
  console.log('Selected value:', value);
  
  // Set the value to the form control
  this.groupByFormatControl2.setValue(value);
  
  // Close the modal after selection
  this.closeModal(modal);
}

selectValue4(value: string, modal: any) {
  console.log('Selected value:', value);
  
  // Set the value to the form control
  this.groupByFormatControl4.setValue(value);
  
  // Close the modal after selection
  this.closeModal(modal);
}
selectValue5(value: string, modal: any) {
  console.log('Selected value:', value);
  
  // Set the value to the form control
  this.groupByFormatControl5.setValue(value);
  
  // Close the modal after selection
  this.closeModal(modal);
}
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
get groupByFormatControl5(): FormControl {
  return this.createKPIWidget5.get('groupByFormat') as FormControl; // Cast to FormControl
}
get groupByFormatControl4(): FormControl {
  return this.createKPIWidget4.get('groupByFormat') as FormControl; // Cast to FormControl
}

get groupByFormatControl2(): FormControl {
  return this.createKPIWidget2.get('groupByFormat') as FormControl; // Cast to FormControl
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


updateTile2() {
  if (this.editTileIndex2 !== null) {
      console.log('this.editTileIndex check', this.editTileIndex2);
      console.log('Tile checking for update:', this.dashboard[this.editTileIndex2]); // Log the tile being checked

      // Log the current details of the tile before update
      console.log('Current Tile Details Before Update:', this.dashboard[this.editTileIndex2]);
      let multiValueArray = this.dashboard[this.editTileIndex2].multi_value ||[];
      const processedValue = this.createKPIWidget2.value.processed_value || ''; // Get updated processed_value from the form
      const constantValue = this.createKPIWidget2.value.constantValue || 0; // Get updated constantValue from the form
      const secondaryValue = this.createKPIWidget2.value.secondaryValue || '';
      const secondaryValueNested =this.createKPIWidget2.value.secondaryValueNested ||'';
      const   primaryValue= this.createKPIWidget2.value.primaryValue ||'';
      if (multiValueArray.length > 1) {
        multiValueArray[3].processed_value = processedValue; // Update processed_value at index 1
        multiValueArray[0].constantValue = constantValue; // Update constantValue at index 0
        multiValueArray[1].value = secondaryValue;
        multiValueArray[2].value = secondaryValueNested

         // Update secondaryValue at index 1
    } else {
        // If multi_value array doesn't have enough elements, ensure it's structured correctly
        // Ensure at least two objects are created with the correct structure
     
          multiValueArray.push({ processed_value: processedValue });
          multiValueArray.push({ constantValue: constantValue});
          multiValueArray.push({ secondaryValue: secondaryValue });
          multiValueArray.push({secondaryValueNested:secondaryValueNested})

     
    }

      // Update the properties of the tile with the new values from the form
      this.dashboard[this.editTileIndex2] = {
          ...this.dashboard[this.editTileIndex2], // Keep existing properties
          formlist: this.createKPIWidget2.value.formlist,
          parameterName: this.createKPIWidget2.value.parameterName,
          groupBy: this.createKPIWidget2.value.groupBy,
          primaryValue: this.createKPIWidget2.value.primaryValue,
          groupByFormat:this.createKPIWidget2.value.groupByFormat,
          constantValue:this.createKPIWidget2.value.constantValue,
          secondaryValue:this.createKPIWidget2.value.secondaryValue,
          secondaryValueNested:this.createKPIWidget2.value.secondaryValueNested,
          themeColor:this.createKPIWidget2.value.themeColor,
          processedValue:this.createKPIWidget2.value.processedValue

          // Include any additional properties if needed
      };

      // Log the updated details of the tile
      console.log('Updated Tile Details:', this.dashboard[this.editTileIndex2]);

      // Also update the grid_details array to reflect changes
      this.all_Packet_store.grid_details[this.editTileIndex2] = {
          ...this.all_Packet_store.grid_details[this.editTileIndex2], // Keep existing properties
          ...this.dashboard[this.editTileIndex2], // Update with new values
      };
      this.openModal('Edit_ts',this.all_Packet_store)
     
      this.updateSummary('', 'update_tile');
      console.log('his.dashboard check from updateTile',this.dashboard)

      console.log("Updated all_Packet_store.grid_details:", this.all_Packet_store.grid_details);
   

      // Reset the editTileIndex after the update
      this.editTileIndex2 = null;
  } else {
      console.error("Edit index is null. Unable to update the tile.");
  }
}
updateTile3() {
  if (this.editTileIndex3 !== null) {
      console.log('this.editTileIndex check', this.editTileIndex3);
      console.log('Tile checking for update:', this.dashboard[this.editTileIndex3]); // Log the tile being checked

      // Log the current details of the tile before update
      console.log('Current Tile Details Before Update:', this.dashboard[this.editTileIndex3]);
      let multiValueArray = this.dashboard[this.editTileIndex3].multi_value ||[];
      const processedValue = this.createKPIWidget3.value.processed_value || ''; // Get updated processed_value from the form
      const constantValue = this.createKPIWidget3.value.constantValue || 0; // Get updated constantValue from the form
      const CompareTile = this.createKPIWidget3.value.CompareTile || '';
      const WithCompareTile =this.createKPIWidget3.value.WithCompareTile ||'';
      const   primaryValue= this.createKPIWidget3.value.primaryValue ||'';


      if (multiValueArray.length > 1) {
        multiValueArray[3].processed_value = processedValue; // Update processed_value at index 1
        multiValueArray[0].constantValue = constantValue; // Update constantValue at index 0
        multiValueArray[1].value = CompareTile;
        multiValueArray[2].value = WithCompareTile

         // Update secondaryValue at index 1
    } else {
        // If multi_value array doesn't have enough elements, ensure it's structured correctly
        // Ensure at least two objects are created with the correct structure
     
          multiValueArray.push({ processed_value: processedValue });
          multiValueArray.push({ constantValue: constantValue});
          multiValueArray.push({ CompareTile: CompareTile });
          multiValueArray.push({WithCompareTile:WithCompareTile})

     
    }
      // Update the properties of the tile with the new values from the form
      this.dashboard[this.editTileIndex3] = {
          ...this.dashboard[this.editTileIndex3], // Keep existing properties
          formlist: this.createKPIWidget3.value.formlist,
          parameterName: this.createKPIWidget3.value.parameterName,
          groupBy: this.createKPIWidget3.value.groupBy,
          primaryValue: this.createKPIWidget3.value.primaryValue,
          groupByFormat:this.createKPIWidget3.value.groupByFormat,
          constantValue:this.createKPIWidget3.value.constantValue,
          CompareTile:this.createKPIWidget3.value.CompareTile,
          WithCompareTile:this.createKPIWidget3.value.WithCompareTile,
          themeColor:this.createKPIWidget3.value.themeColor
          // Include any additional properties if needed
      };

      // Log the updated details of the tile
      console.log('Updated Tile Details:', this.dashboard[this.editTileIndex3]);

      // Also update the grid_details array to reflect changes
      this.all_Packet_store.grid_details[this.editTileIndex3] = {
          ...this.all_Packet_store.grid_details[this.editTileIndex3], // Keep existing properties
          ...this.dashboard[this.editTileIndex3], // Update with new values
      };
      this.openModal('Edit_ts',this.all_Packet_store)
     
      this.updateSummary('', 'update_tile');
      console.log('his.dashboard check from updateTile',this.dashboard)

      console.log("Updated all_Packet_store.grid_details:", this.all_Packet_store.grid_details);
   

      // Reset the editTileIndex after the update
      this.editTileIndex3 = null;
  } else {
      console.error("Edit index is null. Unable to update the tile.");
  }
}
updateTile4() {
  if (this.editTileIndex4 !== null) {
      console.log('this.editTileIndex check', this.editTileIndex4);
      console.log('Tile checking for update:', this.dashboard[this.editTileIndex4]); // Log the tile being checked

      // Log the current details of the tile before update
      console.log('Current Tile Details Before Update:', this.dashboard[this.editTileIndex4]);
      let multiValueArray = this.dashboard[this.editTileIndex4].multi_value ||[];
      const processedValue = this.createKPIWidget4.value.processed_value || ''; // Get updated processed_value from the form
      const constantValue = this.createKPIWidget4.value.constantValue || 0; // Get updated constantValue from the form
      const CompareTile = this.createKPIWidget4.value.CompareTile || '';
      const WithCompareTile =this.createKPIWidget4.value.WithCompareTile ||'';
      const   primaryValue= this.createKPIWidget4.value.primaryValue ||'';
      const secondaryValue = this.createKPIWidget4.value.secondaryValue || '';
      if (multiValueArray.length > 1) {
        multiValueArray[3].processed_value = processedValue; // Update processed_value at index 1
        multiValueArray[0].constantValue = constantValue; // Update constantValue at index 0
        multiValueArray[1].value = CompareTile;
        multiValueArray[2].value = WithCompareTile;
        multiValueArray[4].value =secondaryValue

         // Update secondaryValue at index 1
    } else {
        // If multi_value array doesn't have enough elements, ensure it's structured correctly
        // Ensure at least two objects are created with the correct structure
     
          multiValueArray.push({ processed_value: processedValue });
          multiValueArray.push({ constantValue: constantValue});
          multiValueArray.push({ CompareTile: CompareTile });
          multiValueArray.push({WithCompareTile:WithCompareTile});
          multiValueArray.push({secondaryValue:secondaryValue})


     
    }

      // Update the properties of the tile with the new values from the form
      this.dashboard[this.editTileIndex4] = {
          ...this.dashboard[this.editTileIndex4], // Keep existing properties
          formlist: this.createKPIWidget4.value.formlist,
          parameterName: this.createKPIWidget4.value.parameterName,
          groupBy: this.createKPIWidget4.value.groupBy,
          primaryValue: this.createKPIWidget4.value.primaryValue,
          groupByFormat:this.createKPIWidget4.value.groupByFormat,
          constantValue:this.createKPIWidget4.value.constantValue,
          CompareTile:this.createKPIWidget4.value.CompareTile,
          WithCompareTile:this.createKPIWidget4.value.WithCompareTile,
          themeColor:this.createKPIWidget4.value.themeColor,
          secondaryValue:this.createKPIWidget4.value.secondaryValue,
          processedValue:this.createKPIWidget4.value.processedValue


          // Include any additional properties if needed
      };

      // Log the updated details of the tile
      console.log('Updated Tile Details:', this.dashboard[this.editTileIndex4]);

      // Also update the grid_details array to reflect changes
      this.all_Packet_store.grid_details[this.editTileIndex4] = {
          ...this.all_Packet_store.grid_details[this.editTileIndex4], // Keep existing properties
          ...this.dashboard[this.editTileIndex4], // Update with new values
      };
      this.openModal('Edit_ts',this.all_Packet_store)
     
      this.updateSummary('', 'update_tile');
      console.log('his.dashboard check from updateTile',this.dashboard)

      console.log("Updated all_Packet_store.grid_details:", this.all_Packet_store.grid_details);
   

      // Reset the editTileIndex after the update
      this.editTileIndex4 = null;
  } else {
      console.error("Edit index is null. Unable to update the tile.");
  }
}


updateTile5() {
  if (this.editTileIndex5 !== null) {
      console.log('this.editTileIndex check', this.editTileIndex5);
      console.log('Tile checking for update:', this.dashboard[this.editTileIndex5]); // Log the tile being checked

      // Log the current details of the tile before update
      console.log('Current Tile Details Before Update:', this.dashboard[this.editTileIndex5]);
      let multiValueArray = this.dashboard[this.editTileIndex5].multi_value ||[];
      const processedValue = this.createKPIWidget5.value.processed_value || ''; // Get updated processed_value from the form
      const constantValue = this.createKPIWidget5.value.constantValue || 0; // Get updated constantValue from the form
      const secondaryValue = this.createKPIWidget5.value.secondaryValue || '';
      const secondaryValueNested =this.createKPIWidget5.value.secondaryValueNested ||'';
      const   primaryValue= this.createKPIWidget5.value.primaryValue ||'';
      if (multiValueArray.length > 1) {
        multiValueArray[3].processed_value = processedValue; // Update processed_value at index 1
        multiValueArray[0].constantValue = constantValue; // Update constantValue at index 0
        multiValueArray[1].value = secondaryValue;
        multiValueArray[2].value = secondaryValueNested

         // Update secondaryValue at index 1
    } else {
        // If multi_value array doesn't have enough elements, ensure it's structured correctly
        // Ensure at least two objects are created with the correct structure
     
          multiValueArray.push({ processed_value: processedValue });
          multiValueArray.push({ constantValue: constantValue});
          multiValueArray.push({ secondaryValue: secondaryValue });
          multiValueArray.push({secondaryValueNested:secondaryValueNested})

     
    }

      // Update the properties of the tile with the new values from the form
      this.dashboard[this.editTileIndex5] = {
          ...this.dashboard[this.editTileIndex5], // Keep existing properties
          formlist: this.createKPIWidget5.value.formlist,
          parameterName: this.createKPIWidget5.value.parameterName,
          groupBy: this.createKPIWidget5.value.groupBy,
          primaryValue: this.createKPIWidget5.value.primaryValue,
          groupByFormat:this.createKPIWidget5.value.groupByFormat,
          constantValue:this.createKPIWidget5.value.constantValue,
          secondaryValue:this.createKPIWidget5.value.secondaryValue,
          secondaryValueNested:this.createKPIWidget5.value.secondaryValueNested,
          themeColor:this.createKPIWidget5.value.themeColor
          // Include any additional properties if needed
      };

      // Log the updated details of the tile
      console.log('Updated Tile Details:', this.dashboard[this.editTileIndex5]);

      // Also update the grid_details array to reflect changes
      this.all_Packet_store.grid_details[this.editTileIndex5] = {
          ...this.all_Packet_store.grid_details[this.editTileIndex5], // Keep existing properties
          ...this.dashboard[this.editTileIndex5], // Update with new values
      };
      this.openModal('Edit_ts',this.all_Packet_store)
     
      this.updateSummary('', 'update_tile');
      console.log('his.dashboard check from updateTile',this.dashboard)

      console.log("Updated all_Packet_store.grid_details:", this.all_Packet_store.grid_details);
   

      // Reset the editTileIndex after the update
      this.editTileIndex2 = null;
  } else {
      console.error("Edit index is null. Unable to update the tile.");
  }
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
          MaxRange:this.createKPIWidget6.value.MaxRange,
          groupByFormat:this.createKPIWidget6.value.groupByFormat,
          constantValuevalue:this.createKPIWidget6.value.constantValuevalue,
          percentageValue:this.createKPIWidget6.value.percentageValue,
          constantValueTarget:this.createKPIWidget6.value.constantValueTarget,
          constantValueMaxRange:this.createKPIWidget6.value.constantValueMaxRange,
          percentageValueTarget:this.createKPIWidget6.value.percentageValueTarget,
          percentageValueMaxRange:this.createKPIWidget6.value.percentageValueMaxRange,
          // Include any additional properties if needed
      };
    
      // Log the updated details of the tile
      console.log('Updated Tile Details:', this.dashboard[this.editTileIndex6]);

      // Also update the grid_details array to reflect changes
      this.all_Packet_store.grid_details[this.editTileIndex6] = {
          ...this.all_Packet_store.grid_details[this.editTileIndex6], // Keep existing properties
          ...this.dashboard[this.editTileIndex6], // Update with new values
      };
      this.openModal('Edit_ts',this.all_Packet_store)
     
      this.updateSummary('', 'update_tile');
      console.log('his.dashboard check from updateTile',this.dashboard)

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


openKPIModal3(content: any, tile?: any, index?: number) {
  if (tile) {
    this.selectedTile = tile;
    this.editTileIndex3 = index !== undefined ? index : null; // Store the index, default to null if undefined
    console.log('Tile Object:', tile); // Log the tile object

    let parsedMultiValue = [];
    if (typeof tile.multi_value === 'string') {
      try {
        parsedMultiValue = JSON.parse(tile.multi_value);
        console.log('Parsed multi_value:', parsedMultiValue); // Log parsed multi_value to verify structure
      } catch (error) {
        console.error('Error parsing multi_value:', error);
      }
    } else {
      parsedMultiValue = tile.multi_value || [];
    }

    // Extract values for primaryValue, secondaryValue, and secondaryValueNested from parsed multi_value
    const primaryValue = parsedMultiValue[0]?.value || ''; // Assuming value corresponds to primaryValue
    const constantValue = parsedMultiValue[0]?.constantValue || 0; // Assuming constantValue is in the first item
    const CompareTile = parsedMultiValue[1]?.value || ''; // Assuming value corresponds to secondaryValue
    const WithCompareTile = parsedMultiValue[2]?.value || ''; // Assuming value corresponds to secondaryValueNested
    const parsedValue = parsedMultiValue[3]?.processed_value !== undefined ? parsedMultiValue[3].processed_value : 0;

    // Initialize form fields and pre-select values
    this.initializeTileFields3();
    this.createKPIWidget3.patchValue({
        formlist: tile.formlist,
        parameterName: tile.parameterName,
        groupBy: tile.groupBy,
        primaryValue: primaryValue,  // Use extracted primaryValue
        groupByFormat: tile.groupByFormat,
        constantValue: constantValue,  // Use extracted constantValue
        CompareTile: CompareTile,  // Use extracted CompareTile value
        WithCompareTile: WithCompareTile,  // Use extracted WithCompareTile value
        processed_value: parsedValue,  // Use extracted parsedValue
        themeColor: tile.themeColor,
    });

    this.isEditMode = true; // Set to edit mode
  } else {
    this.selectedTile = null; // No tile selected for adding
    this.isEditMode = false; // Set to add mode
    this.createKPIWidget3.reset(); // Reset the form for new entry
  }

  this.themes.forEach(theme => {
    theme.selected = false; // Deselect all themes
  });

  // Find the theme that matches the tile's themeColor
  const matchingTheme = this.themes.find(theme => theme.color === tile?.themeColor);

  // If a matching theme is found, set it as selected
  if (matchingTheme) {
    matchingTheme.selected = true;
    console.log('Matching theme found and selected:', matchingTheme);
  }

  // Open modal and trigger necessary actions
  this.modalService.open(content, { size: 'lg', ariaLabelledBy: 'modal-basic-title' });
  this.showTable();
  this.reloadEvent.next(true);
}



openKPIModal4(content: any, tile?: any, index?: number) {
  if (tile) {
    this.selectedTile = tile;
    this.editTileIndex4 = index !== undefined ? index : null; // Store the index, default to null if undefined
    console.log('Tile Object:', tile); // Log the tile object

    let parsedMultiValue = [];
    if (typeof tile.multi_value === 'string') {
      try {
        parsedMultiValue = JSON.parse(tile.multi_value);
        console.log('Parsed multi_value:', parsedMultiValue); // Log parsed multi_value to verify structure
      } catch (error) {
        console.error('Error parsing multi_value:', error);
      }
    } else {
      parsedMultiValue = tile.multi_value || [];
    }

    // Extract values for primaryValue, constantValue, CompareTile, WithCompareTile, secondaryValue, and processed_value
    const primaryValue4 = parsedMultiValue[0]?.value || ''; // Primary value from multi_value
    const constantValue4 = parsedMultiValue[0]?.constantValue || 0; // Constant value from multi_value
    const CompareTile4 = parsedMultiValue[1]?.value || ''; // Secondary value from multi_value
    const WithCompareTile4 = parsedMultiValue[2]?.value || ''; // Nested secondary value from multi_value
    const parsedValue4 = parsedMultiValue[3]?.processed_value !== undefined ? parsedMultiValue[3].processed_value : 0; // Processed value from multi_value
    const secondaryValue4 = parsedMultiValue[4]?.value || ''; // Secondary value from multi_value

    // Initialize form fields and pre-select values
    this.initializeTileFields4();
    this.createKPIWidget4.patchValue({
        formlist: tile.formlist,
        parameterName: tile.parameterName,
        groupBy: tile.groupBy,
        primaryValue: primaryValue4, // Using extracted primary value
        groupByFormat: tile.groupByFormat,
        constantValue: constantValue4, // Using extracted constant value
        CompareTile: CompareTile4, // Using extracted CompareTile value
        WithCompareTile: WithCompareTile4, // Using extracted WithCompareTile value
        secondaryValue: secondaryValue4, // Using extracted secondary value
        processed_value: parsedValue4,
        themeColor:tile.themeColor // Using extracted processed value
    });

    this.isEditMode = true; // Set to edit mode
  } else {
    this.selectedTile = null; // No tile selected for adding
    this.isEditMode = false; // Set to add mode
    this.createKPIWidget4.reset(); // Reset the form for new entry
  }

  this.themes.forEach(theme => {
    theme.selected = false; // Deselect all themes
  });

  // Find the theme that matches the tile's themeColor
  const matchingTheme = this.themes.find(theme => theme.color === tile?.themeColor);

  // If a matching theme is found, set it as selected
  if (matchingTheme) {
    matchingTheme.selected = true;
    console.log('Matching theme found and selected:', matchingTheme);
  }

  this.modalService.open(content, { size: 'lg', ariaLabelledBy: 'modal-basic-title' });
  this.showTable();
  this.reloadEvent.next(true);
}



}
