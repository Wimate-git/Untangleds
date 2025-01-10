import { ChangeDetectorRef, Component, EventEmitter, Injector, Input, NgZone, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import dayjs, { Dayjs } from 'dayjs';
import moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { APIService } from 'src/app/API.service';
import { LocationPermissionService } from 'src/app/location-permission.service';
import { SharedService } from 'src/app/pages/shared.service';

@Component({
  selector: 'app-map-config',

  templateUrl: './map-config.component.html',
  styleUrl: './map-config.component.scss'
})
export class MapConfigComponent {
  createChart:FormGroup

 
  private widgetIdCounter = 0;
  selectedColor: string = '#66C7B7'; // Default to the first color
  @Input() dashboard: any;
  selectedTabset: string = 'dataTab';
  selectedTile: any;
  editTileIndex: number | null;
  isEditMode: boolean;
  ranges: any;
  reloadEvent: any;
  isHovered: boolean = false;
  @Output() dashboardChange = new EventEmitter<any[]>();
  @Output() update_PowerBoard_config =  new EventEmitter<any>();
  @Input() modal :any
  @Input()  all_Packet_store: any;
  @Output() send_all_Packet_store = new EventEmitter<any[]>();
  getLoggedUser: any;
  SK_clientID: string;
  formList: any;
  listofDeviceIds: any;
  listofDynamicParam: any;
  @ViewChild('calendarModalChart') calendarModalChart: any;
  showIdField = false;
  dropsDown = 'down';
  opensCenter = 'center';
  tooltips: { date: Dayjs; text: string }[] = [];
  invalidDates: Dayjs[] = [];
  tooltip: string | null = null;
  grid_details: any;
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
  shouldShowProcessedValue: boolean = false;
  chartDatatype: FormGroup;
  calenderIndex: any;
  highchartsForm: FormGroup<{ highchartsOptionsJson: FormControl<string | null>; }>;
  noOfParams: any;
  paramCount: any;
  selectedParameterValue: any;
  selectedParamName: any;
  selectedItem: any;
  highchartsOptionsJson: string;
  chartFinalOptions: any;
  listofDynamicParamFilter: any;
  dashboardIdsList: any;
  p1ValuesSummary: any;
  filterParamevent: any;
  dynamicParamMap = new Map<number, any[]>();
  dynamicparameterLab: any;
  dynamicparameterLabMap: any;
  fields: any;
  showDaysAgoField: any;
  gridDetailExtract: any;
  formlistValues: any[];
  isFieldVisible = false;
  private readonly daysAgoOptions = [
    'less than days ago',
    'more than days ago',
    'in the past',
    'days ago'
  ];
  parsedData: any;
  updateddateType: any;


 
  ngOnInit() {

    this.getLoggedUser = this.summaryConfiguration.getLoggedUserDetails()
    console.log('this.getLoggedUser check', this.getLoggedUser)
    // this.getWorkFlowDetails = this.summaryConfiguration.getLoggedUserDetails()
    // console.log('this.getLoggedUser check',this.getWorkFlowDetails)


    this.SK_clientID = this.getLoggedUser.clientID;
    console.log('this.SK_clientID check', this.SK_clientID)
    this.initializeTileFields()
    this.setupRanges();
    this.dynamicData()
    this.dashboardIds(1)
    this.createChart.get('toggleCheck')?.valueChanges.subscribe((isChecked) => {
      if (isChecked) {
        this.createChart.get('dashboardIds')?.enable();
        this.createChart.get('selectType')?.enable();
      } else {
        this.createChart.get('dashboardIds')?.disable();
        this.createChart.get('selectType')?.disable();
      }
    });
  



    this.checkData()
  

    this.initializeShowDaysAgoField();
    this.createChart.get('dateType')?.valueChanges.subscribe(value => {
      this.showDaysAgoField = this.daysAgoOptions.includes(value);
    });
    this.createChart.get('dateType')?.valueChanges.subscribe(value => {
      this.onDateTypeChange(value);
    });




  }

  onDateTypeChange(value: string) {

    this.createChart.get('singleDate')?.clearValidators();
    this.createChart.get('startDate')?.clearValidators();
    this.createChart.get('endDate')?.clearValidators();
  

    const config = this.dateTypeConfig[value];

    if (config) {
      if (config.showDate) {
        this.createChart.get('singleDate')?.setValidators([Validators.required]);
      }

      if (config.showStartDate) {
        this.createChart.get('startDate')?.setValidators([Validators.required]);
      }

      if (config.showEndDate) {
        this.createChart.get('endDate')?.setValidators([Validators.required]);
      }

      if (config.showDaysAgo) {
        this.createChart.get('daysAgo')?.setValidators([Validators.required, Validators.min(1)]);
      }
    }

    this.createChart.get('singleDate')?.updateValueAndValidity();
    this.createChart.get('startDate')?.updateValueAndValidity();
    this.createChart.get('endDate')?.updateValueAndValidity();
    this.createChart.get('daysAgo')?.updateValueAndValidity();
  }
  dateTypeConfig :any= {
    'is': { showDate: true },
    '>=': { showDate: true },
    '<=': { showDate: true },
    'between': { showStartDate: true, showEndDate: true , isBetweenTime: false },
    'between time': { showStartDate: true, showEndDate: true , isBetweenTime: true },
  
  };


  private initializeShowDaysAgoField(): void {
    const initialDateType = this.createChart.get('dateType')?.value;
    this.showDaysAgoField = this.daysAgoOptions.includes(initialDateType);
  }
  checkData(){
    this.gridDetailExtract = this.all_Packet_store.grid_details
    console.log('this.gridDetailExtract check',this.gridDetailExtract)
// Initialize the formlist values array


// Extract formlist from gridDetailExtract
if (this.gridDetailExtract && Array.isArray(this.gridDetailExtract)) {
    this.formlistValues = this.gridDetailExtract.map((packet: { formlist: any }) => packet.formlist);
    console.log('this.formlistValues check',this.formlistValues)
}

// Initialize formlistValues as an empty array if not already initialized
this.formlistValues = this.formlistValues || [];

// Iterate through each packet in gridDetailExtract
if (Array.isArray(this.gridDetailExtract)) {
    this.gridDetailExtract.forEach((packet: any) => {
        // Check if chartConfig exists in the current packet and is not empty
        if (packet.chartConfig && packet.chartConfig !== "[]") {
            try {
                // Parse the chartConfig JSON
                const parsedChartConfig = JSON.parse(packet.chartConfig);

                // Validate parsedChartConfig is an array
                if (Array.isArray(parsedChartConfig)) {
                    // Extract formlist values from parsedChartConfig
                    const chartConfigFormlist = parsedChartConfig.map((config: { formlist: any }) => config.formlist);

                    // Add the extracted values to formlistValues
                    this.formlistValues = [...this.formlistValues, ...chartConfigFormlist];
                    console.log('this.formlistValues check extract',this.formlistValues)
                } else {
                    console.warn('Parsed chartConfig is not an array:', parsedChartConfig);
                }
            } catch (error) {
                console.error('Error parsing chartConfig:', error);
            }
        }
    });

    // Remove duplicates from formlistValues if needed
// Remove undefined values and duplicates from formlistValues
this.formlistValues = [...new Set(this.formlistValues.filter(value => value !== undefined))];
this.fetchDynamicFormDataForAll(this.formlistValues);


// Log the cleaned-up formlistValues
console.log('Cleaned-up formlist values:', this.formlistValues);



} else {
    console.warn('gridDetailExtract is not an array or is undefined.');
}

// Check and extract formlist from chartConfig
// Initialize formlistValues as an empty array if not already done



  }
  fetchDynamicFormDataForAll(values: string[]) {
    values.forEach((value, index) => {
      this.fetchDynamicFormData(value, index);
    });
  }
  fetchDynamicFormData(value: string, index: number) {
    console.log("Fetching data for:", value);
  
    const apiUrl = `${this.SK_clientID}#dynamic_form#${value}#main`;
    this.api.GetMaster(apiUrl, 1)
      .then((result: any) => {
        if (result && result.metadata) {
          const parsedMetadata = JSON.parse(result.metadata);
          const formFields = parsedMetadata.formFields;
  
          const dynamicParamList = formFields.map((field: any) => ({
            value: field.name,
            text: field.label === "Location" ? "Graphic Location" : field.label,
          }));
          console.log('dynamicParamList check', dynamicParamList);
  
          // Add created_time and updated_time if present
          if (parsedMetadata.created_time) {
            dynamicParamList.push({
              value: parsedMetadata.created_time.toString(),
              text: 'Created Time',
            });
          }
          if (parsedMetadata.updated_time) {
            dynamicParamList.push({
              value: parsedMetadata.updated_time.toString(),
              text: 'Updated Time',
            });
          }
          dynamicParamList.push(
            {
              value: 'TrackLocation',
              text: 'Track Location',
            },
            // {
            //   value: 'GraphicLocation',
            //   text: 'Graphic Location',
            // }
          );
  
  
          // Add TrackLocation and GraphicLocation fields
  
          // Store the dynamicParamList in a map by index
          this.dynamicParamMap.set(index, dynamicParamList);
          this.cdr.detectChanges();
        } else {
          console.warn(`No metadata found for ${value}`);
        }
      })
      .catch((err) => {
        console.error(`Error fetching data for ${value}:`, err);
      });
  }
  
   
  
  ngOnChanges(changes: SimpleChanges): void {
    console.log('dashboardChange',this.all_Packet_store)
  }

  convertTo12HourFormat(time: string): string {
    if (!time) return '';
    const [hours, minutes] = time.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const adjustedHours = hours % 12 || 12; // Convert 0 to 12 for AM times
    return `${adjustedHours}:${minutes.toString().padStart(2, '0')} ${period}`;
  }

  constructor(private summaryConfiguration: SharedService, private api: APIService, private fb: UntypedFormBuilder, private cd: ChangeDetectorRef,
    private toast: MatSnackBar, private router: Router, private modalService: NgbModal, private route: ActivatedRoute, private cdr: ChangeDetectorRef, private locationPermissionService: LocationPermissionService, private devicesList: SharedService, private injector: Injector,
    private spinner: NgxSpinnerService,private zone: NgZone
  ){
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
  }
  setupRanges(): void {
    this.ranges = {
      Today: [moment().startOf('day'), moment().endOf('day')],
      Yesterday: [moment().subtract(1, 'day').startOf('day'), moment().subtract(1, 'day').endOf('day')],
      'Last 7 Days': [moment().subtract(6, 'days').startOf('day'), moment().endOf('day')],
      'Last 30 Days': [moment().subtract(29, 'days').startOf('day'), moment().endOf('day')],
      'This Month': [moment().startOf('month'), moment().endOf('month')],
      'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
      'This Year': [moment().startOf('year'), moment().endOf('year')],
      'Last Year': [moment().subtract(1, 'year').startOf('year'), moment().subtract(1, 'year').endOf('year')],
      // ... add other ranges as needed
    };
  }
  initializeTileFields(): void {
    console.log('i am initialize')
    // Initialize the form group
    this.createChart = this.fb.group({
      add_fields:[''],
      all_fields:new FormArray([]),
  
      widgetid: [this.generateUniqueId()],
      chart_title:[''],

    });

  
  }

  
  get constants() {
    return (this.createChart.get('constants') as FormArray);
  }

  // Add a new constant form control
  addConstant() {
    this.constants.push(this.fb.control('', Validators.required));
  }

  // Remove a constant form control
  removeConstant(index: number) {
    this.constants.removeAt(index);
  }
  
  async dynamicData(){
    try {
      const result: any = await this.api.GetMaster(this.SK_clientID + "#dynamic_form#lookup", 1);
      if (result) {
        console.log('forms chaecking',result)
        const helpherObj = JSON.parse(result.options);
        console.log('helpherObj checking',helpherObj)
        this.formList = helpherObj.map((item: [string]) => item[0]); // Explicitly define the type
        this.listofDeviceIds = this.formList.map((form: string) => ({ text: form, value: form })); // Explicitly define the type here too
        console.log('listofDeviceIds',this.listofDeviceIds)
        console.log('this.formList check from location', this.formList);
      }
    } catch (err) {
      console.log("Error fetching the dynamic form data", err);
    }
  }

  addControls(event: any, _type: string) {
    console.log('Event received in addControls:', event);
  
    let noOfParams: number = 0;
  
    // Determine the value of noOfParams based on the event type
    if (_type === 'html' && event && event.target) {
      const value = parseInt(event.target.value, 10);
      if (value >= 0) {
        noOfParams = value;
      } else {
        return this.toast.open("Negative values not allowed", "Check again", {
          duration: 5000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
      }
    } else if (_type === 'ts') {
      if (event >= 0) {
        noOfParams = event;
      }
    }
  
    console.log('noOfParams check:', noOfParams);
  
    // Ensure noOfParams is valid
    if (noOfParams === null || noOfParams === undefined || isNaN(noOfParams)) {
      console.error("Invalid noOfParams value:", noOfParams);
      return;
    }
  
    // Adjust the number of controls in the FormArray
    const currentLength = this.all_fields.length;
  
    if (currentLength < noOfParams) {
      for (let i = currentLength; i < noOfParams; i++) {
        this.all_fields.push(
          this.fb.group({
            formlist: ['', Validators.required],
            parameterName: ['', Validators.required],
            dateType: ['', Validators.required],
            map_type:['',Validators.required],
            daysAgo: [''],
            startDate: [''],
            endDate: [''],
            singleDate: [''],
            filterForm: [''],
            filterParameter: [''],
            filterDescription: [''],
            custom_Label: ['', Validators.required],
            add_Markers:[[]]
            
          
          })
        );
      }
    } else if (currentLength > noOfParams) {
      for (let i = currentLength - 1; i >= noOfParams; i--) {
        this.all_fields.removeAt(i);
      }
    }
  
    // Update the noOfParams variable for use elsewhere
    this.noOfParams = noOfParams;
  }
  
  
  
  
  
  
  get all_fields() {
    return this.createChart.get('all_fields') as FormArray;
  }

  generateUniqueId(): number {
    this.widgetIdCounter++;
    return Date.now() + this.widgetIdCounter; // Use timestamp and counter for uniqueness
  }
  ngAfterViewInit(){
    this.checkData()
  }

  addTile(key: any) {
    console.log('this.noOfParams check', this.noOfParams);
    console.log('this.createChart.value.all_fields', this.createChart.value.all_fields.filterParameter);
  
    if (key === 'Map') {
      const uniqueId = this.generateUniqueId();
      console.log('this.createChart.value:', this.createChart.value); // Log form values for debugging
      this.fields = this.createChart.value.all_fields;
      console.log('this.fields check before label update', this.fields);
  
      // Map through fields to include corresponding labels from dynamicparameterLabMap
      this.fields = this.fields.map((field:any, index:any) => {
        const label = this.dynamicparameterLabMap[index] || ''; // Get the label for the current index
        return { ...field, label }; // Add the label to the current field object
      });
  
      console.log('this.fields check after label update', this.fields);
  
      const newTile = {
        id: uniqueId,
        x: 0,
        y: 0,
        rows: 13, // The number of rows in the grid
        cols: 25,
        rowHeight: 100,
        colWidth: 100,
        fixedColWidth: true,
        fixedRowHeight: true,
        grid_type: 'Map',
        chart_title: this.createChart.value.chart_title || '', // Ensure this value exists
        // toggleCheck: this.createChart.value.toggleCheck,
        MapConfig: this.fields || [], // Updated fields with labels
     
        noOfParams: this.noOfParams || 0, // Ensure noOfParams has a valid value
      };
  
      console.log('New Tile Object:', newTile);
  
      if (!this.dashboard) {
        console.log('Initializing dashboard array');
        this.dashboard = [];
      }
  
      this.dashboard.push(newTile);
      console.log('Updated Dashboard:', this.dashboard);
  
      this.grid_details = this.dashboard;
      this.dashboardChange.emit(this.grid_details);
  
      if (this.grid_details) {
        this.updateSummary('', 'add_tile');
      }
  
      this.createChart.patchValue({
        widgetid: uniqueId,
        chart_title: '', // Reset chart title field (or leave it if needed)
        highchartsOptionsJson: {}, // Reset chart options (or leave it if needed)
      });
    }
  }
  
  
  onFontColorChange(event: Event): void {
    const color = (event.target as HTMLInputElement).value;
    this.createChart.patchValue({ fontColor: color });
  }
  
  updateTile(key: any) {
    console.log('Key from update:', key);
  
    // Ensure editTileIndex is valid
    if (this.editTileIndex !== null && this.editTileIndex >= 0) {
      console.log('this.editTileIndex:', this.editTileIndex);
  
      // Log the tile being updated
      console.log('Tile before update:', this.dashboard[this.editTileIndex]);
  
      // Extract values from the form
      const formValue = this.createChart.value;
      console.log('Form Value:', formValue);
  
      // Create updated tile
      const updatedTile = {
        ...this.dashboard[this.editTileIndex], // Keep existing properties
        chart_title: formValue.chart_title || this.dashboard[this.editTileIndex].chart_title, // Update chart_title
        MapConfig: formValue.all_fields, // Update tileConfig from FormArray
        noOfParams: this.dashboard[this.editTileIndex].noOfParams, // Retain noOfParams
      };
  
      console.log('Updated Tile:', updatedTile);
  
      // Update dashboard array (non-mutatively)
      this.dashboard = [
        ...this.dashboard.slice(0, this.editTileIndex),
        updatedTile,
        ...this.dashboard.slice(this.editTileIndex + 1),
      ];
  
      console.log('Updated Dashboard:', this.dashboard);
  
      // Update grid_details in all_Packet_store
      this.all_Packet_store.grid_details[this.editTileIndex] = {
        ...this.all_Packet_store.grid_details[this.editTileIndex],
        ...updatedTile,
      };
  
      console.log(
        'Updated all_Packet_store.grid_details:',
        this.all_Packet_store.grid_details[this.editTileIndex]
      );
  
      // Update grid_details for the grid component
      this.grid_details = this.dashboard;
      console.log('Updated grid_details:', this.grid_details);
  
      // Emit the updated dashboard
      this.dashboardChange.emit(this.grid_details);
  
      // Call updateSummary if grid_details exist
      if (this.grid_details) {
        this.updateSummary(this.all_Packet_store, 'update_tile');
      }
  
      // Reset editTileIndex after the update
      this.editTileIndex = null;
    } else {
      console.error('Edit index is null or invalid. Unable to update the tile.');
    }
  }
  
  

  selectedSettingsTab(tab: string) {
    this.selectedTabset = tab;
    // console.log()
  }



  duplicateTile(tile: any, index: number): void {
    // Clone the tile with its properties
    const clonedTile = {
      ...tile, // Copy all existing properties from the original tile
      id: new Date().getTime(), // Generate a unique ID
      parameterName: `${tile.parameterName}`, // Copy the parameterName as is (no "Copy" appended)
      multi_value: tile.multi_value.map((value: any) => ({ ...value })) // Deep copy of multi_value
    };
alert('cloned tile')
    // Ensure all fields are properly copied
    clonedTile.x = tile.x;
    clonedTile.y = tile.y;
    clonedTile.rows = tile.rows;
    clonedTile.cols = tile.cols;
    clonedTile.rowHeight = tile.rowHeight;
    clonedTile.colWidth = tile.colWidth;
    clonedTile.fixedColWidth = tile.fixedColWidth;
    clonedTile.fixedRowHeight = tile.fixedRowHeight;
    clonedTile.grid_type = tile.grid_type;
    clonedTile.formlist = tile.formlist;
    // clonedTile.groupBy = tile.groupBy;
    clonedTile.groupByFormat = tile.groupByFormat;
    clonedTile.predefinedSelectRange = tile.predefinedSelectRange;
    clonedTile.selectedRangeType = tile.selectedRangeType;
    // clonedTile.themeColor = tile.themeColor;

    // Add the cloned tile to the dashboard at the correct position
    this.dashboard.splice(index + 1, 0, clonedTile);

    // Log the updated dashboard for debugging
    console.log('this.dashboard after duplicating a tile:', this.dashboard);
    this.grid_details = this.dashboard;

    
    this.dashboardChange.emit(this.grid_details);

    if(this.grid_details)
      {
        alert('grid details is there')
        this.updateSummary('','add_tile')
      }

    // Trigger change detection to ensure the UI updates
    this.cdr.detectChanges();

    // Update summary to handle the addition of the duplicated tile

  }
  updateSummary(data: any, arg2: any) {
    this.update_PowerBoard_config.emit({ data, arg2 });
  }
  


themes = [
  { color: "linear-gradient(to right, #ff7e5f, #feb47b)", selected: false }, // Warm Sunset
  { color: "linear-gradient(to right, #6a11cb, #2575fc)", selected: false }, // Cool Blue-Purple
  { color: "linear-gradient(to right, #ff6a00, #ee0979)", selected: false }, // Fiery Red-Orange
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


openMapModal(tile: any, index: number) {
  console.log('Index checking:', index);

  if (tile) {
    this.selectedTile = tile;
    this.editTileIndex = index !== undefined ? index : null;
    console.log('this.editTileIndex checking from openChartModal1', this.editTileIndex);
    console.log('Tile Object:', tile);

    this.paramCount = tile.noOfParams || 1;


// this.parsedData = JSON.parse(tile.MapConfig);
// console.log('this.parsedData check',this.parsedData)


    console.log('Themes after selection:', this.themes);

    this.createChart = this.fb.group({
      add_fields: this.paramCount,
      chart_title: tile.chart_title || '',
    
      all_fields: this.repopulate_fields(tile),
    });

    console.log('this.isEditMode check', this.isEditMode);
    this.isEditMode = true;
  } else {
    this.selectedTile = null;
    this.isEditMode = false;
    if (this.createChart) {
      this.createChart.reset();
    }

    // Reset theme selection if no tile is passed
    this.themes.forEach((theme) => {
      theme.selected = false;
    });
  }
}




preDefinedRange(preDefined:any){
  console.log('preDefined check',preDefined)

}

repopulate_fields(getValues: any): FormArray {
  if (!getValues || getValues === null) {
    console.warn('No data to repopulate');
    return this.all_fields;
  }

  // Clear existing fields in the FormArray
  this.all_fields.clear();

  // Parse MapConfig data
  let parsedtileConfig: any[] = [];
  try {
    if (typeof getValues.MapConfig === 'string') {
      parsedtileConfig = JSON.parse(getValues.MapConfig || '[]');
    } else if (Array.isArray(getValues.MapConfig)) {
      parsedtileConfig = getValues.MapConfig;
    }
  } catch (error) {
    console.error('Error parsing MapConfig:', error);
  }

  console.log('Parsed tileConfig:', parsedtileConfig);

  // Repopulate fields index-wise
  if (parsedtileConfig && parsedtileConfig.length > 0) {
    parsedtileConfig.forEach((configItem, index) => {
      console.log(`Processing index ${index} - Full Object:`, configItem);
      console.log(`Index ${index} - dateType:`, configItem?.dateType || 'Not Found');

      // Handle parameterName
      const parameterNameValue = Array.isArray(configItem.parameterName)
        ? configItem.parameterName // Extract 'text' from each object
        : [];

      // Handle filterParameter
      const filterParameterValue = Array.isArray(configItem.filterParameter)
        ? configItem.filterParameter
        : [];

        console.log('configItem?.dateType check',configItem.dateType )
        this.updateddateType = configItem.dateType
 
      // Create and push FormGroup
      this.all_fields.push(
        this.fb.group({
          formlist: configItem.formlist || '',
          parameterName: configItem.parameterName,
          dateType: configItem.dateType ,// Provide fallback
          singleDate: configItem.singleDate || '',
          daysAgo: configItem.daysAgo || '',
          startDate: configItem.startDate || '',
          endDate: configItem.endDate || '',
          map_type:configItem.map_type,
       
          filterDescription: configItem.filterDescription || '',
          filterForm: configItem.filterForm || '',
          filterParameter: this.fb.control(filterParameterValue),
        })
      );

      // Log the added FormGroup for verification
      console.log(`FormGroup at index ${index}:`, this.all_fields.at(index).value);
    });
  } else {
    console.warn('No parsed data to populate fields');
  }

  console.log('Final FormArray Values:', this.all_fields.value);

  return this.all_fields;
}


mapValueCheck(event: Event, fieldIndex: number): void {
  const selectElement = event.target as HTMLSelectElement; // Cast the target to HTMLSelectElement
  const selectedValue = selectElement.value; // Get the selected value
  const selectedMarker = this.markers.find(marker => marker.value === selectedValue);
  
  if (selectedMarker) {
    console.log('Selected label:', selectedMarker.label);
  }
  console.log('Field index:', fieldIndex);
}


markers = [
  { value: './assets/media/CustomMarker.png', label: 'Blue marker' },
  { value: './assets/media/CustomMarker1.png', label: 'Green marker' },
  { value: './assets/media/CustomMarker2.png', label: 'Yellow marker' },
  { value: './assets/media/CustomMarker3.png', label: 'Orange marker' },
  { value: './assets/media/CustomMarker4.png', label: 'Grey marker' },
  { value: './assets/media/CustomMarker5.png', label: 'Bus1 marker' },
  { value: './assets/media/BusMarker1.png', label: 'Bus2 marker' },
  { value: './assets/media/CustomMarker6.png', label: 'Gateway marker' },
  { value: './assets/media/CustomMarker7.png', label: 'Person1 marker' },
  { value: './assets/media/CustomMarker8.png', label: 'Person2 marker' },
  { value: './assets/media/CustomMarker9.png', label: 'Person3 marker' },
  { value: './assets/media/DeviceMarker1.png', label: 'Device1 Marker' },
  { value: './assets/media/DeviceMarker2.png', label: 'Device2 Marker' },
  { value: './assets/media/DiningMarker.png', label: 'Dining1 Marker' },
  { value: './assets/media/DiningMarker1.png', label: 'Dining2 Marker' },
  { value: './assets/media/GateWayMarker.png', label: 'GateWay1 Marker' },
  { value: './assets/media/GateWayMarker1.png', label: 'GateWay2 Marker' },
  { value: './assets/media/GateWayMarker2.png', label: 'GateWay3 Marker' },
  { value: './assets/media/PinMarker1.png', label: 'Pin1 marker' },
  { value: './assets/media/PinMarker2.png', label: 'Pin2 marker' },
  { value: './assets/media/PinMarker3.png', label: 'Pin3 marker' },
  { value: './assets/media/GpsMarker1.png', label: 'GPS marker' },
  { value: './assets/media/MobileMarker.png', label: 'Mobile marker' },
  { value: './assets/media/HomeMarker.png', label: 'Home marker' },
  { value: './assets/media/HomeMarker1.png', label: 'Home1 marker' },
  { value: './assets/media/HotelMarker.png', label: 'Hotel1 marker' },
  { value: './assets/media/HotelMarker1.png', label: 'Hotel2 marker' },
  { value: './assets/media/HoldMarker.png', label: 'Hold marker' },
  { value: './assets/media/HelipadMarker.png', label: 'Helipad marker' },
  { value: './assets/media/HospitalMarker.png', label: 'Hospital marker' },
  { value: './assets/media/InformationMarker.png', label: 'Information marker' },
  { value: './assets/media/CarMarker.png', label: 'Car marker' },
  { value: './assets/media/PersonMarker1.png', label: 'Person1 marker' },
  { value: './assets/media/PersonMarker2.png', label: 'Person2 marker' },
  { value: './assets/media/ServiceMarker.png', label: 'Service Marker' },
  { value: './assets/media/TreeMarker.png', label: 'Tree Marker' },
  { value: './assets/media/ToiletMarker.png', label: 'Toilet Marker' },
  { value: './assets/media/WarningMarker.png', label: 'Warning Marker' },
];









  // checkPrimary(event: any): void {
  //   console.log('Event checking primary:', event);
  
  //   // Extract the value property from the selected data
  //   const selectedValuePrimary = event[0]?.value || null;
  //   console.log('selectedValuePrimary check',selectedValuePrimary)
  
  //   if (selectedValuePrimary === 'Constant') {
  //     this.shouldShowProcessedValue = false; // Hide Processed Value field
  //   } else {
  //     this.shouldShowProcessedValue = true; // Show Processed Value field
  //   }
  // }
  
  onMouseEnter(): void {
    this.isHovered = true;
  }
  async dashboardIds(sk: any) {
    console.log("Iam called Bro");
    try {
      const response = await this.api.GetMaster(this.SK_clientID + "#summary#lookup", sk);

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

                // Ensure dashboardIdsList is initialized
                if (!this.dashboardIdsList) {
                  this.dashboardIdsList = [];
                }

                // Check if P1 exists before pushing
                if (P1 !== undefined && P1 !== null) {
                  this.dashboardIdsList.push({ P1, P2, P3, P4, P5, P6, P7, P8, P9 });
                  console.log("Pushed to dashboardIdsList: ", { P1, P2, P3, P4, P5, P6, P7, P8, P9 });
                  console.log('this.dashboardIdsList check',this.dashboardIdsList)
                  this.p1ValuesSummary = this.dashboardIdsList.map((item: { P1: any; }) => item.P1);
console.log('P1 values: dashboard', this.p1ValuesSummary);
                } else {
                  console.warn("Skipping element because P1 is not defined or null");
                }
              } else {
                break;
              }
            }

            // Continue fetching recursively
            await this.dashboardIds(sk + 1);
          } else {
            console.error('Invalid data format - not an array.');
          }
        } else {
          console.error('response.options is not a string.');
        }
      } else {
        console.log("Lookup to be displayed", this.dashboardIdsList);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }
  
  onMouseLeave(): void {
    this.isHovered = false;
  }

  getDateType(index: number) {
    return (this.createChart.get('all_fields') as FormArray).at(index).get('dateType');
  }
  
  

  fetchDynamicFormDataFilter(value: any) {
    console.log("Data from lookup:", value);

    this.api
      .GetMaster(`${this.SK_clientID}#dynamic_form#${value}#main`, 1)
      .then((result: any) => {
        if (result && result.metadata) {
          const parsedMetadata = JSON.parse(result.metadata);
          console.log('parsedMetadata check dynamic',parsedMetadata)
          const formFields = parsedMetadata.formFields;
          console.log('formFields check',formFields)

          // Initialize the list with formFields labels
          this.listofDynamicParamFilter = formFields.map((field: any) => {
            console.log('field check',field)
            return {
              value: field.name,
              text: field.label
            };
          });

          // Include created_time and updated_time
          if (parsedMetadata.created_time) {
            this.listofDynamicParamFilter.push({
              value: parsedMetadata.created_time.toString(),
              text: 'Created Time' // You can customize the label here if needed
            });
          }

          if (parsedMetadata.updated_time) {
            this.listofDynamicParamFilter.push({
              value: parsedMetadata.updated_time.toString(),
              text: 'Updated Time' // You can customize the label here if needed
            });
          }

          console.log('Transformed dynamic parameters:', this.listofDynamicParamFilter);

          // Trigger change detection to update the view
          this.cdr.detectChanges();
        }
      })
      .catch((err) => {
        console.log("Can't fetch", err);
      });
  }

  SelectTypeSummary =[
    { value: 'NewTab', text: 'New Tab' },
    { value: 'Modal', text: 'Modal' },
  ]
  dynamicparameterValue(event: any, index: any): void {
    console.log('Event check for dynamic param:', event);
    console.log('Index check:', index);
  
    // Access the specific FormGroup from the FormArray
    const formDynamicParam = this.all_fields.at(index) as FormGroup;
  
    if (!formDynamicParam) {
      console.warn(`FormGroup not found for index ${index}`);
      return;
    }
  
    // Access the filterParameter FormControl
    const filterParameter = formDynamicParam.get('filterParameter');
    console.log('filterParameter check:', filterParameter);
  
    if (event && event.value && Array.isArray(event.value)) {
      const valuesArray = event.value;
  
      if (valuesArray.length === 1) {
        // Handle single selection
        const singleItem = valuesArray[0];
        const { value, text } = singleItem; // Destructure value and text
        console.log('Single Selected Item:', { value, text });
  
        if (filterParameter) {
          // Update the form control with the single value (object)
          filterParameter.setValue([{ value, text }]); // Store as an array of objects
          this.cdr.detectChanges(); // Trigger change detection
        } else {
          console.warn(`filterParameter control not found in FormGroup for index ${index}`);
        }
  
        // Store the single selected parameter
        this.selectedParameterValue = { value, text };
      } else {
        // Handle multiple selections
        const formattedValues = valuesArray.map((item: any) => {
          const { value, text } = item; // Destructure value and text
          return { value, text }; // Create an object with value and text
        });
  
        console.log('Formatted Multiple Items:', formattedValues);
  
        if (filterParameter) {
          // Update the form control with the concatenated values (array of objects)
          filterParameter.setValue(formattedValues);
          this.cdr.detectChanges(); // Trigger change detection
        } else {
          console.warn(`filterParameter control not found in FormGroup for index ${index}`);
        }
  
        // Store the multiple selected parameters
        this.selectedParameterValue = formattedValues;
      }
    } else {
      console.warn('Invalid event structure or missing value array:', event);
    }
  }
  
  
  

  dynamicparameterLabel(event: any, index: any) {
    console.log('event checking dynamicparameterLabel', event);
    console.log('index checking dynamicparameterLabel', index);
  
    // Ensure the variable is initialized as an array or object
    if (!this.dynamicparameterLabMap) {
      this.dynamicparameterLabMap = {}; // Initialize as an object if not already
    }
  
    // Store the value for the specific index
    this.dynamicparameterLabMap[index] = event[0]?.text || '';
    console.log('dynamicparameterLabMap after update:', this.dynamicparameterLabMap[index]);
  
    console.log('dynamicparameterLabMap after update:', this.dynamicparameterLabMap);
  }
  

  onAdd(index: any): void {
    console.log('Index checking from onAdd:', index);
  
    // Access the specific form group from the form array
    const formDescParam = this.all_fields.at(index) as FormGroup;
  
    // Retrieve the `filterDescription` control from the group
    const groupByFormatControl = formDescParam.get('filterDescription');
  
    // Capture the selected parameters (which will be an array of objects with text and value)
    const selectedParameters = this.selectedParameterValue;
    console.log('Selected parameters checking:', selectedParameters);
  
    let formattedDescription = '';
  
    if (Array.isArray(selectedParameters)) {
      // Format the selected parameters to include both text and value
      formattedDescription = selectedParameters
        .map(param => `${param.text}-\${${param.value}}`) // Include both text and value
        .join(' '); // Join them with a comma and space
    } else if (selectedParameters) {
      // If only one parameter is selected, format it directly
      formattedDescription = `${selectedParameters.text}-\${${selectedParameters.value}}`;
    } else {
      console.warn('No parameters selected or invalid format:', selectedParameters);
      formattedDescription = ''; // Fallback in case of no selection
    }
  
    console.log('Formatted Description:', formattedDescription);
  
    // Update the specific form control value for `filterDescription`
    if (groupByFormatControl) {
      groupByFormatControl.patchValue(formattedDescription);
      console.log(`Patched value for index ${index}:`, formattedDescription);
    } else {
      console.warn(`filterDescription control not found for index ${index}.`);
    }
  
    // Optionally patch at the top-level form if needed
    this.createChart.patchValue({
      filterDescription: formattedDescription,
    });
  
    // Manually trigger change detection to ensure the UI reflects the changes
    this.cdr.detectChanges();
  }
  
  
  


  parameterValueCheck(event:any,index:any){

    const formGroupparam = this.all_fields.at(index);
    const groupByFormatControl = formGroupparam.get('parameterName');

   
    console.log('event for parameter check',event)
    if (event && event[0] && event[0].value) {
      if (groupByFormatControl) {
        groupByFormatControl.setValue(event[0].text);
        console.log('Value set successfully:', groupByFormatControl.value);
      } else {
        console.error('groupByFormat control does not exist in the form group!');
      }

    }


  }
  selectFormParams(event: any, index: number) {
    if (event && event[0] && event[0].data) {
      const selectedText = event[0].data.text; // Adjust based on the actual structure
      console.log('Selected Form Text:', selectedText);
  
      if (selectedText) {
        // Fetch parameters dynamically for the specific field index
        this.fetchDynamicFormData(selectedText, index);
      }
    } else {
      console.error('Event data is not in the expected format:', event);
    }
  }
  
  getDynamicParams(index: number): any[] {
    return this.dynamicParamMap.get(index) || [];
  }
  getDynamicParamsFormFields(index: number): any[] {
    return this.dynamicParamMap.get(index) || [];
  }


  selectFormParamsFilter(event: any) {
    if (event && event[0] && event[0].data) {
      const selectedFilterText = event[0].data.text;  // Adjust based on the actual structure
      console.log('Selected Form Text:', selectedFilterText);

      if (selectedFilterText) {
        this.fetchDynamicFormDataFilter(selectedFilterText);
      }
    } else {
      console.error('Event data is not in the expected format:', event);
    }
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
    // { value: 'DifferenceFrom-Previous', text: 'DifferenceFrom-Previous' },
    // { value: 'DifferenceFrom-Latest', text: 'DifferenceFrom-Latest' },
    // { value: '%ofDifferenceFrom-Previous', text: '%ofDifferenceFrom-Previous' },
    // { value: '%ofDifferenceFrom-Latest', text: '%ofDifferenceFrom-Latest' },
    { value: 'Constant', text: 'Constant' },
    { value: 'Live', text: 'Live' },
    { value: 'Count', text: 'Count' },
    { value: 'Count_Multiple', text: 'Count Multiple' },


  ]
  showStatusValues = [
    { value: 'Open', text: 'Open' },
    { value: 'In-Progress', text: 'In-Progress' },
    { value: 'Solved', text: 'Solved' },
    { value: 'Closed', text: 'Closed' },



  ]


  showCustomValues = [
    { value: 'Live', text: 'Live' },
    { value: 'Hourly', text: 'Hourly' },
    { value: 'Daily', text: 'Daily' },
    { value: 'Hour of the Day', text: 'Hour of the Day' },
    { value: 'Weekly', text: 'Weekly' },
    { value: 'Day of Week', text: 'Day of Week' },
    { value: 'Monthly', text: 'Monthly' },
    { value: 'Day of Month', text: 'Day of Month' },
    { value: 'Yearly', text: 'Yearly' }
  ];
  onValueChange(selectedValue: any): void {
    console.log('selectedValue check', selectedValue[0].value);  // Log the selected value
  
    // Set the primaryValue form control to the selected value
    this.createChart.get('primaryValue')?.setValue(selectedValue[0].value);
  
    // Trigger change detection to ensure the UI updates immediately (optional)
    this.cd.detectChanges();
  }

  onValueSelect(onSelectValue:any){
    console.log('selectedValue check', onSelectValue[0].value);  // Log the selected value
  
    // Set the primaryValue form control to the selected value
    this.createChart.get('selectedRangeType')?.setValue(onSelectValue[0].value);
  
    // Trigger change detection to ensure the UI updates immediately (optional)
    this.cd.detectChanges();

  }
  
  
  get primaryValue() {
    return this.createChart.get('primaryValue');
  }
  closeModal(modal: any) {
    if (modal) {
      modal.close(); // Close the modal
    } else {
      console.error('Modal reference is undefined');
    }
  }
  selectValue(value: string, modal: any): void {
    console.log('Selected value:', value);
    console.log('Current calenderIndex:', this.calenderIndex);
  
    if (
      this.calenderIndex !== undefined &&
      this.calenderIndex >= 0 &&
      this.calenderIndex < this.all_fields.length
    ) {
      const formGroup = this.all_fields.at(this.calenderIndex);
      const groupByFormatControl = formGroup.get('groupByFormat');
  
      if (groupByFormatControl) {
        groupByFormatControl.setValue(value);
        console.log('Value set successfully:', groupByFormatControl.value);
      } else {
        console.error('groupByFormat control does not exist in the form group!');
      }
    } else {
      console.error('Invalid calenderIndex or FormArray length mismatch!');
    }
  
    // Close the modal
    this.closeModal(modal);
  }
  
  
  
  

  get groupByFormatControl(): FormControl {
    return this.createChart.get('groupByFormat') as FormControl; // Cast to FormControl
  }

  openModalCalender(fieldIndex: number) {
    console.log('Field Index:', fieldIndex);
    this.calenderIndex = fieldIndex;
  
    const modalRef = this.modalService.open(this.calendarModalChart);
    modalRef.result.then(
      (result) => {
        console.log('Modal closed with:', result);
        // Handle modal close
      },
      (reason) => {
        console.log('Modal dismissed with:', reason);
      }
    );
  }
  
  

  handleModalClose(selectedValue: string) {
    // Logic to handle what happens after the modal closes
    console.log('Handling post modal close logic with value:', selectedValue);
    // You can update your UI or state here based on the selectedValue
  }
  isTooltipDate = (m: Dayjs) => {
    // Ensure tooltips is an array and has valid data
    if (!Array.isArray(this.tooltips) || this.tooltips.length === 0) {
      return false;
    }
  
    const tooltip = this.tooltips.find((tt) => tt.date.isSame(m, 'day'));
    return tooltip ? tooltip.text : false;
  };
  
  
  isCustomDate = (date: Dayjs) => {
    return date.month() === 0 || date.month() === 6 ? 'mycustomdate' : false;
  };
  isInvalidDate = (m: Dayjs) => {
    return this.invalidDates.some((d) => d.isSame(m, 'day'));
  };
  showTooltip(item: string) {
    this.tooltip = item;
  }

  hideTooltip() {
    this.tooltip = null;
  }
get datePickerControl(){
  return this.createChart?.get('predefinedSelectRange') as FormControl
}
datesUpdatedRange($event: any,index:any): void {
  const selectedRange = Object.entries(this.ranges).find(([label, dates]) => {
    const [startDate, endDate] = dates as [moment.Moment, moment.Moment];
    return (
      startDate.isSame($event.startDate, 'day') &&
      endDate.isSame($event.endDate, 'day')
    );
  });

  console.log('Selected Range Check:', selectedRange);

  if (selectedRange) {
    const control = this.createChart.get('predefinedSelectRange');
    if (control) {
      control.setValue(selectedRange[1]); // Update the form control value with the range label
    }

    // Debugging: Log before setting the value
    console.log('Setting selectedRangeType:', selectedRange[0]);
    
    const controlSelectedRangeType = this.all_fields.at(index).get('selectedRangeType');
    if (controlSelectedRangeType) {
      controlSelectedRangeType.setValue(selectedRange[0]); // Update the form control value with the range label
    }

    // Debugging: Log after setting the value
    console.log('selectedRangeType after setting:', this.createChart.get('selectedRangeType')?.value);
  }
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
  this.createChart.get('themeColor')?.setValue(this.selectedColor);
}

  onColorChange1(event: Event) {
    const colorInput = event.target as HTMLInputElement;
    this.createChart.get('themeColor')?.setValue(colorInput.value)

    console.log('Color changed:', this.createChart.get('themeColor')?.value);
  }


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







  // Method to initialize the chart using the form's JSON value
// initializeChart(): void {
//   const highchartsOptionsJson = this.highchartsForm.value.highchartsOptionsJson;
//   console.log('highchartsOptionsJson check',highchartsOptionsJson)

//   if (highchartsOptionsJson) {  // Check if the JSON string is neither null nor undefined
//     try {
//       // Parse the JSON entered in the textarea
//       const highchartsOptions = JSON.parse(highchartsOptionsJson);

//       // Check if the options are valid and initialize the chart
//       if (highchartsOptions && typeof highchartsOptions === 'object') {
//         Highcharts.chart('chartContainer', highchartsOptions); // Create the Highcharts chart
//       } else {
//         console.error('Invalid Highcharts options');
//       }
//     } catch (e) {
//       console.error('Invalid JSON:', e); // Catch invalid JSON errors
//     }
//   } else {
//     console.error('Highcharts options are empty or undefined');
//   }
// }


}
