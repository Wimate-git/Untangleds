import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
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
  node_type?: string; // Optional property for node type
  summaryView?: string;
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
@Component({
  selector: 'app-summary-engine',
  templateUrl: './summary-engine.component.html',
  styleUrl: './summary-engine.component.scss'
})
export class SummaryEngineComponent implements OnInit,AfterViewInit,OnDestroy {
  iconOptions: { value: string; label: string; class1: string ,class2: string}[] = [];
  @ViewChild('calendarModal', { static: true }) calendarModal: any;

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
  createKPIWidget:FormGroup;
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

  tooltip: string | null = null;
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

  isMenuOpen: boolean = false; // Tracks dropdown menu state
  @ViewChild(MatMenuTrigger) triggerBtn: MatMenuTrigger;
  allUpdateTile: { summaryID: any; summaryName: any; summaryDesc: any; summaryIcon: any; updated: Date; createdUser: any; };
 

  // Method to toggle the menu open/close
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }


  showTooltip(item: string): void {
    this.tooltip = item;
  }

  hideTooltip(): void {
    this.tooltip = null;
  }
  deleteItem(item: any) {
    // Logic for deleting the item
    console.log('Delete:', item);
  }

 
  nineBlocks = Array.from({ length: 9 }, (_, i) => ({ label: `KPI ${i + 1}` }));

  constructor(private summaryConfiguration: SharedService,private api: APIService,private fb: UntypedFormBuilder,private cd:ChangeDetectorRef,
    private toast: MatSnackBar,private router:Router,private modalService: NgbModal,  private route: ActivatedRoute,private cdr:ChangeDetectorRef,private locationPermissionService:LocationPermissionService,private devicesList: SharedService
    ) {
      this.createKPIWidget = this.fb.group({
        groupBy: [''] // Default value can be empty or a specific option
      });
      // this.iconOptions = this.getIconOptions();
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
    // this.addJsonValidation();
    this.showTable()
    this.addFromService()
   

  
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

        // Initialize form fields and pre-select values
        this.initializeTileFields();
        this.createKPIWidget.patchValue({
            formlist: tile.formlist,
            parameterName: tile.parameterName,
            groupBy: tile.groupBy,
            primaryValue: tile.primaryValue
        });

        this.isEditMode = true; // Set to edit mode
    } else {
        this.selectedTile = null; // No tile selected for adding
        this.isEditMode = false; // Set to add mode
        this.createKPIWidget.reset(); // Reset the form for new entry
    }

    // Open the modal
    this.modalService.open(content, { size: 'lg', ariaLabelledBy: 'modal-basic-title' });

    // Any additional setup if needed
    this.showTable();
    this.reloadEvent.next(true);
}


  

  
  
  


  
  openKPIModal1(content: any) {
    this.modalService.open(content, { size: 'lg', ariaLabelledBy: 'modal-basic-title' });
    this.showTable() 
    // 
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

  onGroupByChange(event: any): void {
    if (event && event.length > 0) {
      // Capture both the value and text
      this.selectedGroupByValue = event[0].value;
      this.selectedDropdown = event[0].text;
    
      // Update the display label with the format "Created Time (selected value)"
      this.updateDisplayLabel(this.selectedDropdown);
      console.log('Selected GroupBy label:', this.displayLabel);
      console.log('Selected Value Text:', this.selectedDropdown);
    
      // Open modal if the selected value is "created"
      if (this.selectedGroupByValue === 'created') {
        this.modalService.open(this.calendarModal, { 
          windowClass: 'right-side-modal',
          backdrop: false
        });
      }
    } else {
      console.log('No event value received');
    }
  }
  updateDisplayLabel(selectedDropdown: string): void {
    // Format the display label with the selected dropdown text
    this.displayLabel = `${selectedDropdown} (selected value)`;
    console.log('Updated Display Label:', this.displayLabel);
  }

  selectValue(value: string): void {
    this.selectedModalValue = value;
    console.log('Selected Value:', this.selectedModalValue);
  
    // Combine the dropdown label and modal value for display only
    const combinedValue = `${this.selectedDropdown} (${this.selectedModalValue})`;
    console.log('Combined Value:', combinedValue);
  
    // Update only the display label (or selectedDropdown) without changing groupByOptions
    this.selectedDropdown = combinedValue;
  
    // Update form control value to reflect combined value for display purposes
    this.createKPIWidget.get('groupBy')?.setValue(this.selectedGroupByValue);
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
          console.log('parsedMetadata check',parsedMetadata)
          this.all_Packet_store = parsedMetadata;
          this.createdTime = this.all_Packet_store.created
            this.createdUserName = this.all_Packet_store.createdUser
    this.dashboard = this.all_Packet_store.grid_details
    console.log('this.all_Packet_store.grid_details check',this.all_Packet_store.grid_details)

  console.log(" this.dashboard :>>",  this.dashboard )
this.cdr.detectChanges()

          console.log('this.all_Packet_store check from open modal', this.all_Packet_store);
          
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
        console.log('Tile checking for update:', this.dashboard[this.editTileIndex]); // Log the tile being checked

        // Log the current details of the tile before update
        console.log('Current Tile Details Before Update:', this.dashboard[this.editTileIndex]);

        // Update the properties of the tile with the new values from the form
        this.dashboard[this.editTileIndex] = {
            ...this.dashboard[this.editTileIndex], // Keep existing properties
            formlist: this.createKPIWidget.value.formlist,
            parameterName: this.createKPIWidget.value.parameterName,
            groupBy: this.createKPIWidget.value.groupBy,
            primaryValue: this.createKPIWidget.value.primaryValue,
            // Include any additional properties if needed
        };

        // Log the updated details of the tile
        console.log('Updated Tile Details:', this.dashboard[this.editTileIndex]);

        // Also update the grid_details array to reflect changes
        this.all_Packet_store.grid_details[this.editTileIndex] = {
            ...this.all_Packet_store.grid_details[this.editTileIndex], // Keep existing properties
            ...this.dashboard[this.editTileIndex], // Update with new values
        };
        this.openModal('Edit_ts',this.all_Packet_store)
       
        this.updateSummary('', 'update_tile');
        console.log('his.dashboard check from updateTile',this.dashboard)

        console.log("Updated all_Packet_store.grid_details:", this.all_Packet_store.grid_details);
     

        // Reset the editTileIndex after the update
        this.editTileIndex = null;
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
  initializeTileFields(){
    this.createKPIWidget = this.fb.group({
      'formlist':['',Validators.required],
      'parameterName':['',Validators.required],
      'groupBy':['',Validators.required],
      'primaryValue':['',Validators.required]
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

  addTile(key: any) {
    if (key === 'tile') {
      const newTile = {
        x: 0,
        y: 0,
        cols: 20,
        rows: 10,
        grid_type: "tile",
        formlist: this.createKPIWidget.value.formlist,
        parameterName: this.createKPIWidget.value.parameterName,
        groupBy: this.createKPIWidget.value.groupBy,
        primaryValue: this.createKPIWidget.value.primaryValue,
      };
  
      // Initialize this.dashboard if it hasn't been set yet
      if (!this.dashboard) {
        this.dashboard = [];
      }
  
      // Push the new tile to dashboard
      this.dashboard.push(newTile);
      
      console.log('this.dashboard after adding new tile', this.dashboard);
  
      this.updateSummary('', 'add_tile');
    }
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

    // Construct the tempObj based on the action type
    let tempObj:any = {
        PK: `${this.SK_clientID}#${this.allCompanyDetails.summaryID}#summary#main`,
        SK: 1,
        metadata: JSON.stringify({
            summaryID: this.createSummaryField.value.summaryID,
            summaryName: this.createSummaryField.value.summaryName,
            summaryDesc: this.createSummaryField.value.summarydesc,
            updated: new Date(),
            createdUser: this.createdUserName,
            summaryIcon: this.createSummaryField.value.iconSelect,
            iconObject: this.previewObjDisplay,
            // Directly include the grid_details as they are
            grid_details: this.dashboard // Keep your existing gridster structure
        })
    };

    // Logging the constructed tempObj
    console.log('tempObj constructed for update:', tempObj);

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
    this.api.UpdateMaster(tempObj).then(async response => {
        if (response && response.metadata) {
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

            const parsedMetadata = JSON.parse(response.metadata);
            this.all_Packet_store = parsedMetadata;
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
        } else {
            console.error('Response structure is invalid:', response);
            Swal.fire({
                position: 'top-end',
                icon: 'error',
                title: 'Error in updating Company Configuration',
                showConfirmButton: true,
            });
        }
    }).catch((err: any) => {
        console.error('Error for updating:', err);
        Swal.fire({
            position: 'top-end',
            icon: 'error',
            title: 'Failed to update summary. Please try again.',
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
        node_type: treeNode.node_type, // You can add additional properties as needed
        summaryView: treeNode.summaryView

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

        this.listofDynamicParam = formFields.map((field: any) => {
          return {
            value: field.label,
            text: field.label
          };
        });

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


}
