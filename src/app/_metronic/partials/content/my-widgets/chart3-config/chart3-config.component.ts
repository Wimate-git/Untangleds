import { ChangeDetectorRef, Component, EventEmitter, Injector, Input, NgZone, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import dayjs, { Dayjs } from 'dayjs';
import Highcharts from 'highcharts';
import moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { APIService } from 'src/app/API.service';
import { LocationPermissionService } from 'src/app/location-permission.service';
import { SharedService } from 'src/app/pages/shared.service';

@Component({
  selector: 'app-chart3-config',

  templateUrl: './chart3-config.component.html',
  styleUrl: './chart3-config.component.scss'
})
export class Chart3ConfigComponent implements OnInit{

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
  selectedText: any;
  columnVisisbilityFields: any;
  shoRowData:boolean=false
  userIsChanging: boolean;
  readOperation: any;
  FormRead: any;
  extractedTables: unknown[];
  filteredResults: {
    value: any; // Use `formName_table` as value
    label: any; // Use `name` as label
  }[];
  readMinitableName: any;
  readMinitableLabel: any;
  filteredHeaders: { value: string; label: string; }[];
  selectedMiniTableFields: any;
  listofFormValues: any;
  


 
  ngOnInit() {
    (window as any).handleSeriesClick = this.handleSeriesClick.bind(this);
    console.log('(window as any).handleSeriesClick',(window as any).handleSeriesClick)

    this.getLoggedUser = this.summaryConfiguration.getLoggedUserDetails()
    console.log('this.getLoggedUser check', this.getLoggedUser)
    // this.getWorkFlowDetails = this.summaryConfiguration.getLoggedUserDetails()
    // console.log('this.getLoggedUser check',this.getWorkFlowDetails)


    this.SK_clientID = this.getLoggedUser.clientID;
    console.log('this.SK_clientID check', this.SK_clientID)
    this.initializeTileFields()
    this.setupRanges();
    this.dynamicData()
   



  }

  handleSeriesClick(seriesName: string): void {
    console.log('Series clicked:', seriesName);
    // Perform the desired action
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
    
      // themeColor: ['#000000', Validators.required],
  
      // fontSize: [20, [Validators.required, Validators.min(8), Validators.max(72)]], // Default to 14px
      // fontColor: ['#000000', Validators.required], // Default to black
   
      chart_title:[''],
      highchartsOptionsJson:[JSON.stringify(this.defaultHighchartsOptionsJson,null,4)],
      filterForm:[''],
   
      filterDescription:[''],
      miniForm:[''],
      MiniTableNames:[''],
      MiniTableFields:[''],
      minitableEquation:[''],
      EquationOperationMini:[''],
      filterParameterLine:[[]],
      filterFormList:['']
  

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
    console.log('event check', event);
  
    let noOfParams: any = '';
  
    if (_type === 'html' && event && event.target) {
      if (event.target.value >= 0) {
        noOfParams = JSON.parse(event.target.value);
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
    console.log('noOfParams check', noOfParams);
  
    // Update all_fields based on noOfParams
    if (this.createChart.value.all_fields.length < noOfParams) {
      for (let i = this.all_fields.length; i < noOfParams; i++) {
        this.all_fields.push(
          this.fb.group({
            formlist: ['', Validators.required],
            parameterName: [[], Validators.required],
 
            primaryValue: ['', Validators.required],
            groupByFormat: ['', Validators.required],
            constantValue: [''],
            processed_value: ['234567'],
            selectedColor: [this.selectedColor || '#FFFFFF'], // Default to white if no color is set
     
            selectedRangeType: [''],
            selectFromTime: [''],
            selectToTime: [''],
            parameterValue:[''],
            columnVisibility:[[]],
            rowData:[''],
            formatType:[''],
            undefinedCheckLabel:[''],
            custom_Label:['']
          })
        );
        console.log('this.all_fields check', this.all_fields);
      }
    } else {
      if (noOfParams !== "" && noOfParams !== undefined && noOfParams !== null) {
        for (let i = this.all_fields.length; i >= noOfParams; i--) {
          this.all_fields.removeAt(i);
        }
      }
    }
  
    // Update noOfParams for use in addTile
    this.noOfParams = noOfParams;
  }
  get all_fields() {
    return this.createChart.get('all_fields') as FormArray;
  }

  generateUniqueId(): number {
    this.widgetIdCounter++;
    return Date.now() + this.widgetIdCounter; // Use timestamp and counter for uniqueness
  }
  

  addTile(key: any) {
    console.log('this.noOfParams check', this.noOfParams);
  
    // Only proceed if the key is 'chart'
    if (key === 'chart') {
      const uniqueId = this.generateUniqueId();
      console.log('this.createChart.value:', this.createChart.value);  // Log form values for debugging
  
      // Check for highchartsOptionsJson
      let highchartsOptionsJson = this.createChart.value.highchartsOptionsJson || {};
      
      // Update highchartsOptionsJson


// If it's stringified, parse it to an object first
if (typeof highchartsOptionsJson === 'string') {
  highchartsOptionsJson = JSON.parse(highchartsOptionsJson);
}

// Update the chart options dynamically
const updatedHighchartsOptionsJson = {
  ...highchartsOptionsJson,
  title: {
    ...highchartsOptionsJson.title,
    text: this.createChart.value.chart_title || ''  // Update the title dynamically
  }
};
console.log('updatedHighchartsOptionsJson check',updatedHighchartsOptionsJson)
this.chartFinalOptions =JSON.stringify(updatedHighchartsOptionsJson,null,4)
console.log('this.chartFinalOptions check',this.chartFinalOptions)
    
  
      // Create the new tile object with all the required properties
      const newTile = {
        id: uniqueId,
        x: 0,
        y: 0,
        rows: 20,
        cols: 20,
        rowHeight: 100,
        colWidth: 100,
        fixedColWidth: true,
        fixedRowHeight: true,
        grid_type: 'Columnchart',
  
        chart_title: this.createChart.value.chart_title || '',  // Ensure this value exists
        fontSize: `${this.createChart.value.fontSize || 16}px`,  // Provide a fallback font size
        themeColor: 'var(--bs-body-bg)',  // Default theme color
        chartConfig: this.createChart.value.all_fields || [],  // Default to empty array if missing
        filterForm: this.createChart.value.filterForm || {},
   
        filterDescription: this.createChart.value.filterDescription || '',
        custom_Label: this.createChart.value.custom_Label || '',
  
        highchartsOptionsJson: this.chartFinalOptions,
        noOfParams: this.noOfParams || 0,  // Ensure noOfParams has a valid value
        miniForm:this.createChart.value.miniForm || '',
        MiniTableNames:this.createChart.value.MiniTableNames ||'',
        MiniTableFields:this.createChart.value.MiniTableFields ,
        minitableEquation:this.createChart.value.minitableEquation,
        EquationOperationMini:this.createChart.value.EquationOperationMini,
        filterParameterLine: this.createChart.value.filterParameterLine || {},
        filterFormList: this.createChart.value.filterFormList ||'',
      };
  
      // Log the new tile object to verify it's being created correctly
      console.log('New Tile Object:', newTile);
  
      // Initialize dashboard array if it doesn't exist
      if (!this.dashboard) {
        console.log('Initializing dashboard array');
        this.dashboard = [];
      }
  
      // Push the new tile to the dashboard array
      this.dashboard.push(newTile);
      console.log('Updated Dashboard:', this.dashboard);  // Log updated dashboard
  
      // Emit the updated dashboard array
      this.grid_details = this.dashboard;
      this.dashboardChange.emit(this.grid_details);
  
      // Optionally update the summary if required
      if (this.grid_details) {
        this.updateSummary('','add_tile');

      }
  
      // Optionally reset the form fields after adding the tile
      this.createChart.patchValue({
        widgetid: uniqueId,
        chart_title: '',  // Reset chart title field (or leave it if needed)
        highchartsOptionsJson: {},  // Reset chart options (or leave it if needed)
      });
    }
  }
  
  
  onFontColorChange(event: Event): void {
    const color = (event.target as HTMLInputElement).value;
    this.createChart.patchValue({ fontColor: color });
  }
  
  updateTile(key: any) {
    console.log('key checking from update', key);
    // console.log('highchartsOptionsJson checking',highchartsOptionsJson)
   let tempParsed = this.createChart.value.highchartsOptionsJson
    if (this.editTileIndex !== null) {
      console.log('this.editTileIndex check', this.editTileIndex);
      console.log('Tile checking for update:', this.dashboard[this.editTileIndex]);
  
  if (typeof tempParsed === 'string') {
    tempParsed = JSON.parse(tempParsed);
}

// Update the chart options dynamically
const updatedHighchartsOptionsJson = {
  ...tempParsed,
  title: {
    ...tempParsed.title,
    text: this.createChart.value.chart_title || ''  // Update the title dynamically
  }
};
console.log('updatedHighchartsOptionsJson check',updatedHighchartsOptionsJson)
this.chartFinalOptions =JSON.stringify(updatedHighchartsOptionsJson,null,4)
console.log('this.chartFinalOptions check',this.chartFinalOptions)
      // Update the multi_value array with the new processed_value and constantValue

  
      // Add defensive checks for predefinedSelectRange

  
      
      console.log('this.dashboard',this.dashboard)
      // Now update the tile with the updated multi_value
      const updatedTile = {
        ...this.dashboard[this.editTileIndex], // Keep existing properties


   
    chart_title: this.createChart.value.chart_title,

    filterDescription:this.createChart.value.filterDescription ||'',
    // fontSize: this.createChart.value.fontSize,
    // themeColor: this.createChart.value.themeColor,
    // fontColor: this.createChart.value.fontColor,
    chartConfig: this.createChart.value.all_fields,
    highchartsOptionsJson: this.chartFinalOptions ||'',
    miniForm:this.createChart.value.miniForm || '',
    MiniTableNames:this.createChart.value.MiniTableNames ||'',
    MiniTableFields:this.createChart.value.MiniTableFields ||'' ,
    minitableEquation:this.createChart.value.minitableEquation ||'',
    EquationOperationMini:this.createChart.value.EquationOperationMini ||'',
    filterParameterLine:this.createChart.value.filterParameterLine ||'',
    filterFormList:this.createChart.value.filterFormList ||'',
    // filterForm:this.createChart.value.filterForm,
    // filterParameter:this.createChart.value.filterParameter,
    // filterDescription:this.createChart.value.filterDescription,
    // Include noOfParams
    noOfParams:this.dashboard[this.editTileIndex].noOfParams,


      };
      console.log('updatedTile checking', updatedTile);
  
      // Update the dashboard array using a non-mutative approach
      this.dashboard = [
        ...this.dashboard.slice(0, this.editTileIndex),
        updatedTile,
        ...this.dashboard.slice(this.editTileIndex + 1),
      ];
  
      console.log('Updated Tile Details:', this.dashboard[this.editTileIndex]);
  
      // Update the grid_details as well
      this.all_Packet_store.grid_details[this.editTileIndex] = {
        ...this.all_Packet_store.grid_details[this.editTileIndex],
        ...updatedTile,
      };
      console.log(
        '  this.all_Packet_store.grid_details[this.editTileIndex]',
        this.all_Packet_store.grid_details[this.editTileIndex]
      );
      console.log('this.dashboard checking from gitproject', this.dashboard);
      this.grid_details = this.dashboard;
      this.dashboardChange.emit(this.grid_details);
  
      if (this.grid_details) {
        this.updateSummary('','add_tile');

      }
  
      console.log('this.dashboard check from updateTile', this.dashboard);
      console.log('Updated all_Packet_store.grid_details:', this.all_Packet_store.grid_details);
  
      // Reset the editTileIndex after the update
      this.editTileIndex = null;
    } else {
      console.error('Edit index is null. Unable to update the tile.');
    }
  }
  

  selectedSettingsTab(tab: string) {
    this.selectedTabset = tab;
    // console.log()
  }


  duplicateChartTile(tile: any, index: number): void {
    // Clone the tile with its properties
    const clonedTile = {
      ...tile, // Copy all existing properties from the original tile
      id: new Date().getTime(), // Generate a unique ID
      parameterName: `${tile.parameterName}`, // Copy the parameterName as is (no "Copy" appended)
      multi_value: tile.multi_value.map((value: any) => ({ ...value })) // Deep copy of multi_value
    };
// alert('cloned tile')
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
      
        this.updateSummary(this.all_Packet_store,'update_tile');
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


openChartModal3(tile: any, index: number) {
  console.log('Index checking:', index); // Log the index

  if (tile) {

    this.selectedTile = tile;
    this.editTileIndex = index !== undefined ? index : null;
    console.log('this.editTileIndex checking from openChartModal1', this.editTileIndex); // Store the index, default to null if undefined
    console.log('Tile Object:', tile);
    console.log('tile.noOfParams checking ',tile.noOfParams)
    this.paramCount =tile.noOfParams
    this.highchartsOptionsJson=JSON.parse(tile.highchartsOptionsJson)

    const fontSizeValue = tile.fontSize ? parseInt(tile.fontSize.replace('px', ''), 10) : 14;
   
    // Log the tile object


    // Parse highchartsOptionsJson

 // Default to 14px if undefined
 let parsedFilterParameter = [];
 if (tile.filterParameterLine) {
   try {
     parsedFilterParameter = JSON.parse(tile.filterParameterLine);
   } catch (error) {
     console.error('Error parsing filterParameter:', error);
   }
 }

 let parsedMiniTableFields = [];
 if (typeof tile.MiniTableFields === 'string') {
   try {
     parsedMiniTableFields = JSON.parse(tile.MiniTableFields);
     console.log('Parsed filterParameter1:', parsedMiniTableFields);
   } catch (error) {
     console.error('Error parsing filterParameter1:', error);
   }
 } else {
   parsedMiniTableFields = tile.MiniTableFields;
 }

 console.log('Parsed FilterParameter:', parsedMiniTableFields);
 this.cdr.detectChanges()

 console.log('Parsed FilterParameter:', parsedFilterParameter);
    console.log('this.paramCount check',this.paramCount)
    this.initializeTileFields();
    // Initialize form fields and pre-select values
    this.createChart = this.fb.group({

      add_fields:this.paramCount,
      chart_title:tile.chart_title,
      all_fields: this.repopulate_fields(tile),
      highchartsOptionsJson:JSON.stringify(this.highchartsOptionsJson,null,4),
      custom_Label:tile.custom_Label,
      fontSize:fontSizeValue,
      filterDescription:tile.filterDescription,
      filterForm:tile.filterForm,
      filterFormList:tile.filterFormList,

      // filterForm:tile.filterForm,
      filterParameterLine: [parsedFilterParameter], 

      miniForm:tile.miniForm || '',
      MiniTableNames:tile.MiniTableNames ||'',
      MiniTableFields: [parsedMiniTableFields],
      minitableEquation:tile.minitableEquation,
      EquationOperationMini:tile.EquationOperationMini, 
      
      // filterDescription:tile.filterDescription



   

    })



    console.log('Updated all_fields:', this.all_fields);

    this.isEditMode = true; // Set to edit mode
  } else {
    this.selectedTile = null; // No tile selected for adding
    this.isEditMode = false; // Set to add mode
    this.createChart.reset(); // Reset the form for new entry
  }

  // Clear the 'selected' state for all themes
  // this.themes.forEach((theme) => {
  //   theme.selected = false; // Deselect all themes
  // });

  // // Find the theme that matches the tile's themeColor
  // const matchingTheme = this.themes.find((theme) => theme.color === tile?.themeColor);

  // If a matching theme is found, set it as selected
  // if (matchingTheme) {
  //   matchingTheme.selected = true;
  //   console.log('Matching theme found and selected:', matchingTheme);
  // }
}

preDefinedRange(preDefined:any){
  console.log('preDefined check',preDefined)

}

repopulate_fields(getValues: any): FormArray {
  if (!getValues || getValues === null) {
    console.warn('No data to repopulate');
    return this.all_fields;
  }

  const noOfParams = getValues.noOfParams || '';
  this.all_fields.clear(); // Clear existing fields in the FormArray

  // Parse `chartConfig` safely
  let parsedChartConfig: any[] = [];
  try {
    if (typeof getValues.chartConfig === 'string') {
      parsedChartConfig = JSON.parse(getValues.chartConfig || '[]');
    } else if (Array.isArray(getValues.chartConfig)) {
      parsedChartConfig = getValues.chartConfig;
    }
  } catch (error) {
    console.error('Error parsing chartConfig:', error);
    parsedChartConfig = [];
  }

  console.log('Parsed chartConfig:', parsedChartConfig);

  if (parsedChartConfig.length > 0) {
    parsedChartConfig.forEach((configItem, index) => {
      console.log(`Processing index ${index} - Full Object:`, configItem);

      // Handle `columnVisibility` dynamically
      const columnVisibility = Array.isArray(configItem.columnVisibility)
        ? configItem.columnVisibility.map((item: { text: any; value: any; }) => ({
            text: item.text || '',
            value: item.value || '',
          }))
        : [];
        const arrayParameter = Array.isArray(configItem.parameterName)
        ? configItem.parameterName
        : [];

      // Push FormGroup into FormArray
      this.all_fields.push(
        this.fb.group({
          formlist: configItem.formlist || '',
          parameterName: this.fb.control(arrayParameter)||'',
  
          primaryValue: configItem.primaryValue || '',
          groupByFormat: configItem.groupByFormat || '',
          constantValue: configItem.constantValue || '',
          selectedRangeType: configItem.selectedRangeType || '',
          selectFromTime: configItem.selectFromTime || '',
          selectToTime: configItem.selectToTime || '',
          parameterValue: configItem.parameterValue || '',
          columnVisibility: this.fb.control(columnVisibility), // Use control to handle as an array
          formatType:configItem.formatType||'',
          undefinedCheckLabel:configItem.undefinedCheckLabel||'',
          custom_Label: configItem.custom_Label||''
        })
      );

      console.log(`FormGroup at index ${index}:`, this.all_fields.at(index).value);
    });
  } else {
    console.warn('No parsed data to populate fields');
    if (noOfParams !== '' && noOfParams !== undefined && noOfParams !== null) {
      // Adjust FormArray length based on noOfParams
      for (let i = this.all_fields.length; i >= noOfParams; i--) {
        this.all_fields.removeAt(i);
      }
    }
  }

  console.log('Final FormArray Values:', this.all_fields.value);

  return this.all_fields;
}






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
  
  onMouseLeave(): void {
    this.isHovered = false;
  }
  fetchDynamicFormData(value: any) {
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
          this.listofDynamicParam = formFields.map((field: any) => {
            console.log('field check',field)
            return {
              value: field.name,
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


  
  

  onAdd(): void {
    // Capture the selected parameters (which will be an array of objects with text and value)
    const filterParameterLineValue = this.createChart.get('filterParameterLine')?.value;
    console.log('filterParameterLine',filterParameterLineValue)
    const selectedOptions = this.listofDynamicParamFilter.filter((option: { value: any; }) => 
      filterParameterLineValue.includes(option.value)
    );
  
    console.log('Selected Values:', filterParameterLineValue); // Array of selected values
    console.log('Selected Texts:', selectedOptions.map((option: { text: any; }) => option.text));

    console.log('selectedParameters checking', selectedOptions);
  
    if (Array.isArray(selectedOptions)) {
      // Format the selected parameters to include both text and value
      this.selectedParameterValue = selectedOptions
        .map((param: { text: any; value: any; }) => `${param.text}-\${${param.value}}`) // Include both text and value
        .join(' '); // Join them with a comma and space
    } else if (selectedOptions) {
      // If only one parameter is selected, format it directly
      this.selectedParameterValue = `${selectedOptions.text}-\${${selectedOptions.value}}`;
    } else {
      console.warn('No parameters selected or invalid format:', selectedOptions);
      this.selectedParameterValue = ''; // Fallback in case of no selection
    }
  
    console.log('this.selectedParameterValue check', this.selectedParameterValue);
  
    // Update the form control value for filterDescription with the formatted string
    this.createChart.patchValue({
      filterDescription: `${this.selectedParameterValue}`,
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
  selectFormParams(event: any) {
    if (event && event[0] && event[0].data) {
      this.selectedText = event[0].data.text;  // Adjust based on the actual structure
      console.log('Selected Form Text:', this.selectedText);
      this.getFormControlValue(this.selectedText); 

      if (this.selectedText) {
        this.fetchDynamicFormData(this.selectedText);
      }
    } else {
      console.error('Event data is not in the expected format:', event);
    }
  }
  getFormControlValue(selectedTextConfi:any): void {
    // const formlistControl = this.createChart.get('formlist');
    console.log('Formlist Control Value:', selectedTextConfi);
    this.fetchDynamicFormDataConfig(selectedTextConfi);
  }

  fetchDynamicFormDataConfig(value: any) {
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
          this.columnVisisbilityFields = formFields.map((field: any) => {
            console.log('field check',field)
            return {
              value: field.name,
              text: field.label
            };
          });

          // Include created_time and updated_time
          if (parsedMetadata.created_time) {
            this.columnVisisbilityFields.push({
              value: parsedMetadata.created_time.toString(),
              text: 'Created Time' // You can customize the label here if needed
            });
          }

          if (parsedMetadata.updated_time) {
            this.columnVisisbilityFields.push({
              value: parsedMetadata.updated_time.toString(),
              text: 'Updated Time' // You can customize the label here if needed
            });
          }

          console.log('Transformed dynamic parameters config', this.columnVisisbilityFields);

          // Trigger change detection to update the view
          this.cdr.detectChanges();
        }
      })
      .catch((err) => {
        console.log("Can't fetch", err);
      });
  }

  selectFormParamsFilter(event: any) {
    console.log('event.value check',event.value)
    if (event && event.value) {
      const selectedFilterText = event[0].data.text;  // Adjust based on the actual structure
      console.log('Selected Form Text:', selectedFilterText);

      if (selectedFilterText) {
        this.fetchDynamicFormDataFilter(selectedFilterText);
      }
    } else {
      console.error('Event data is not in the expected format:', event);
    }
  }

  dynamicparameterValue(event: any): void {
    console.log('Event check for dynamic param:', event);
  
    if (event && event.value && Array.isArray(event.value)) {
      const valuesArray = event.value;
  
      if (valuesArray.length === 1) {
        // Handle single selection
        const singleItem = valuesArray[0];
        const { value, text } = singleItem; // Destructure value and text
        console.log('Single Selected Item:', { value, text });
  
        // Update the form control with the single value (object)
        const filterParameter = this.createChart.get('filterParameter');
        if (filterParameter) {
          filterParameter.setValue([{ value, text }]); // Store as an array of objects
          this.cdr.detectChanges(); // Trigger change detection
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
  
        // Update the form control with the concatenated values (array of objects)
        const filterParameter = this.createChart.get('filterParameter');
        if (filterParameter) {
          filterParameter.setValue(formattedValues);
          this.cdr.detectChanges(); // Trigger change detection
        }
  
        // Store the multiple selected parameters
        this.selectedParameterValue = formattedValues;
      }
    } else {
      console.warn('Invalid event structure:', event);
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
    // { value: 'Live', text: 'Live' },
    { value: 'Count', text: 'Count' },
    { value: 'Count_Multiple', text: 'Count Multiple' },
    { value: 'Count Dynamic', text: 'Count Dynamic' },
    { value: 'Count MultiplePram', text: 'Count Multiple Parameter' },
    { value: 'Sum MultiplePram', text: 'Sum Multiple Parameter' },
    { value: 'Average Multiple Parameter', text: 'Average Multiple Parameter' },
    { value: 'sumArray', text: 'SumArray' },
    { value: 'sum_difference', text: 'Sum Difference' },
    { value: 'distance_sum', text: 'Distance Sum' },
    { value: 'Count Multiple Minitable', text: 'Count Multiple Minitable' },


  ]
  showStatusValues = [
    { value: 'Open', text: 'Open' },
    { value: 'In-Progress', text: 'In-Progress' },
    { value: 'Solved', text: 'Solved' },
    { value: 'Closed', text: 'Closed' },



  ]


  showCustomValues = [

    { value: 'Hourly', text: 'Hourly' },
    { value: 'Daily', text: 'Daily' },
    { value: 'Hour of the Day', text: 'Hour of the Day' },
    { value: 'Weekly', text: 'Weekly' },
    { value: 'Day of Week', text: 'Day of Week' },
    { value: 'Monthly', text: 'Monthly' },
    { value: 'Day of Month', text: 'Day of Month' },
    { value: 'Yearly', text: 'Yearly' },
    { value: 'Any', text: 'Any' }
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

  

toggleCheckbox(theme: any): void {
  // Clear the 'selected' state for all themes
  this.themes.forEach(t => t.selected = false);

  // Set the clicked theme as selected
  theme.selected = true;

  // Update the selected color based on the theme selection
  this.selectedColor = theme.color;
  console.log('this.selectedColor checking', this.selectedColor);

  // Update the form control with the selected color
  // this.createChart.get('themeColor')?.setValue(this.selectedColor);
  // console.log('Updated themeColor:', this.createChart.get('themeColor')?.value);

  // Manually trigger change detection if required
  this.cdr.detectChanges();
}

  onColorChange1(event: Event) {
    // const colorInput = event.target as HTMLInputElement;
    // this.createChart.get('themeColor')?.setValue(colorInput.value)

    // console.log('Color changed:', this.createChart.get('themeColor')?.value);
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






  defaultHighchartsOptionsJson = {
    chart: {
      backgroundColor: 'var(--bs-body-bg)',
      renderTo: 'scatter',
      type: 'column',
    },
    exporting: {
      enabled: false,
    },
    title: {
      text: '',
      style: {
        color: 'var(--bs-body-color)',
      },
    },
    subTitle: {
      text: '',
    },
    xAxis: {
      type: 'datetime',
      labels: {
        style: {
          color: 'var(--bs-body-color)',
        },
      },
      title: {
        text: null,
        style: {
          color: 'var(--bs-body-color)',
        },
      },
    },
    yAxis: {
      labels: {
        style: {
          color: 'var(--bs-body-color)',
        },
      },
      title: {
        text: null,
        style: {
          color: 'var(--bs-body-color)',
        },
      },
    },
    tooltip: {
      shared: true,
      useHTML: true,
      backgroundColor: 'rgba(255, 255, 255, 0.85)',
      borderColor: '#2c3e50',
      borderRadius: 10,
      borderWidth: 2,
      shadow: true,
      style: {
        color: '#333',
        fontSize: '14px',
        fontFamily: 'Arial, sans-serif',
      },
      headerFormat: `
        <div style="padding: 5px 10px; text-align: center;">
          <span style="font-size: 16px; font-weight: bold; color: #2c3e50;">{point.key}</span>
        </div>
        <hr style="margin: 5px 0; border-color: #2c3e50;">
      `,
      pointFormat: `
        <div style="padding: 5px 10px;">
          <span style="color:{series.color}; font-weight: bold;">● {series.name}:</span>
          <span style="font-weight: bold;">{point.y}</span>
        </div>
      `,
      formatter: function (this: Highcharts.TooltipFormatterContextObject) {
        if (this.points) {
          let total = 0;
          const pointsHtml = this.points.reduce((s, point) => {
            const yValue = point.y !== null && point.y !== undefined ? point.y : 0;
            total += yValue;
            return (
              s +
              `<div style="color:${point.series.color}">● 
                 <span onclick="handleSeriesClick('${point.series.name}')"
                       style="cursor: pointer; text-decoration: underline;">
                   ${point.series.name}
                 </span>: <strong>${yValue}</strong>
               </div>`
            );
          }, `<div style="text-align: center; font-weight: bold; color: #2c3e50;">${this.x}</div>`);
          return (
            pointsHtml +
            `<hr style="margin: 5px 0; border-color: #2c3e50;">
             <div style="text-align: right; color: #888;">Total: <strong>${total}</strong></div>`
          );
        } else {
          const yValue = this.y !== null && this.y !== undefined ? this.y : 'N/A';
          return `
            <div style="text-align: center; font-weight: bold; color: #2c3e50;">${this.x}</div>
            <div style="color:${this.series.color}">● 
              <span onclick="handleSeriesClick('${this.series.name}')"
                    style="cursor: pointer; text-decoration: underline;">
                ${this.series.name}
              </span>: <strong>${yValue}</strong>
            </div>`;
        }
      }
      
    },
    plotOptions: {
      series: {
        turboThreshold: 0,
        marker: {
          enabled: true,
          radius: 7,
        },
      },
    },
    series: [
      // Example series can be added here
      // {
      //   name: 'Example',
      //   data: [100, 200, 300],
      // },
    ],
    lineWidth: 2,
    credits: {
      enabled: false,
    },
    responsive: {
      rules: [
        {
          condition: {
            maxWidth: 10000,
          },
          chartOptions: {
            legend: {
              layout: 'horizontal',
              align: 'center',
              verticalAlign: 'bottom',
              itemStyle: {
                color: 'var(--bs-body-color)',
              },
            },
          },
        },
      ],
    },
  };
  
  // Add the global function for handling clicks
  window: any['handleSeriesClick'] = function (seriesName: any) {
    console.log('Clicked on series:', seriesName);
    // Add your custom logic here, e.g., navigation or additional details
  };
  
  

  // Method to initialize the chart using the form's JSON value
initializeChart(): void {
  const highchartsOptionsJson = this.highchartsForm.value.highchartsOptionsJson;
  console.log('highchartsOptionsJson check',highchartsOptionsJson)

  if (highchartsOptionsJson) {  // Check if the JSON string is neither null nor undefined
    try {
      // Parse the JSON entered in the textarea
      const highchartsOptions = JSON.parse(highchartsOptionsJson);

      // Check if the options are valid and initialize the chart
      if (highchartsOptions && typeof highchartsOptions === 'object') {
        Highcharts.chart('chartContainer', highchartsOptions); // Create the Highcharts chart
      } else {
        console.error('Invalid Highcharts options');
      }
    } catch (e) {
      console.error('Invalid JSON:', e); // Catch invalid JSON errors
    }
  } else {
    console.error('Highcharts options are empty or undefined');
  }
}
FormatTypeValues = [
  { value: 'Default', text: 'Default' },
  { value: 'Rupee', text: 'Rupee' },
  { value: 'Distance', text: 'Distance' },
  { value: 'Days & Hours', text: 'Days & Hours' },
  { value: 'Hours', text: 'Hours' },
  { value: 'Minutes', text: 'Minutes' },
  { value: 'Days', text: 'Days' },
  {value:'Label With Value',text:'Label With Value'}
]

setUserSatus(){
  this.userIsChanging = true
  this.cdr.detectChanges()
}
selectedOperationMini(readOperation:any){
  console.log('readOperation',readOperation)
  this.readOperation = readOperation[0].value

}
checkSelectedFormPram(readForm:any){
  console.log('readForm checking',readForm)
  this.FormRead = readForm[0].value
  this.fetchMiniTable(this.FormRead)

}
async fetchMiniTable(item: any) {
  try {
      this.extractedTables = []; // Initialize to prevent undefined errors
      this.filteredResults = []; // Initialize formatted dropdown options

      const resultMain: any = await this.api.GetMaster(this.SK_clientID + "#dynamic_form#" + item + "#main", 1);
      if (resultMain) {
          console.log('Forms Checking:', resultMain);
          const helpherObjmain = JSON.parse(resultMain.metadata);
          console.log('Helper Object Main:', helpherObjmain);

          const extractFormFields = helpherObjmain.formFields;

          // Ensure extractedTables is set properly
          this.extractedTables = Object.values(extractFormFields).filter((item: any) =>
              typeof item === 'object' &&
              item !== null &&
              'name' in item &&
              typeof item.name === 'string' &&
              item.name.startsWith("table-") &&
              item.validation && 
              item.validation.formName_table // Ensure `formName_table` exists inside `validation`
          );

          // Format extracted tables for dropdown options
          this.filteredResults = this.extractedTables.map((record: any) => ({
              value: record.validation.formName_table, // Use `formName_table` as value
              label: record.name // Use `name` as label
          }));

          // Add "Track Location" as an additional option
          this.filteredResults.unshift({
              value: 'trackLocation', 
              label: 'trackLocation'
          });

          console.log('Dropdown Options:', this.filteredResults);
      }
  } catch (err) {
      console.log("Error fetching the dynamic form data", err);
  }
}


miniTableNames(readMinitableName:any){
console.log('readMinitableName',readMinitableName)
this.readMinitableName = readMinitableName[0].value
this.readMinitableLabel = readMinitableName[0].data.label
console.log('this.readMinitableLabel',this.readMinitableLabel)

this.fetchMiniTableHeaders(this.readMinitableName)

}

async fetchMiniTableHeaders(item: any) {
  console.log('minitable name check',item)
  // console.log('')
try {
    this.filteredHeaders = []; // Initialize to store formatted dropdown options

    // If item is "trackLocation", directly set predefined fields
    if (item === "trackLocation") {
        this.filteredHeaders = [
            { value: "Date_and_time", label: "Date_and_time" },
            { value: "label_id", label: "label_id" },
            { value: "label_name", label: "label_name" },
            { value: "type", label: "type" },

        ];
        console.log('Predefined Headers for Track Location:', this.filteredHeaders);
        return; // Exit function early, no need to fetch from API
    }

    // Otherwise, proceed with fetching data from API
    const resultHeaders: any = await this.api.GetMaster(this.SK_clientID + "#dynamic_form#" + item + "#main", 1);

    if (resultHeaders) {
        console.log('Forms Checking:', resultHeaders);
        const helpherObjmainHeaders = JSON.parse(resultHeaders.metadata);
        console.log('Helper Object Main Headers:', helpherObjmainHeaders);

        const extractFormFields = helpherObjmainHeaders.formFields;

        // Ensure extracted headers are properly formatted
        if (Array.isArray(extractFormFields)) {
            this.filteredHeaders = extractFormFields.map((record: any) => ({
                value: record.name,  // Set the 'name' field as value
                label: record.label  // Set the 'label' field as label
            }));
        }

        this.cd.detectChanges()
        
        console.log('Formatted Headers:', this.filteredHeaders);
    }
} catch (err) {
    console.log("Error fetching the dynamic form data", err);
}
}
showValuesForMini = [
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
  { value: 'Count Dynamic', text: 'Count Dynamic' },


]

miniTableFields(readFields:any){
  console.log('readFields',readFields)
  if (readFields && readFields.value && Array.isArray(readFields.value)) {
    // Extract all 'value' properties from the selected items
    const selectedValues = readFields.value.map((item: any) => item.value);

    console.log('Extracted Values:', selectedValues);
    
    // Store the extracted values in a variable
    this.selectedMiniTableFields = selectedValues;
}
}
AddMiniTableEquation() {
  console.log('this.FormRead check:', this.FormRead);
  console.log('this.readMinitableLabel check:', this.readMinitableLabel);
  // console.log('this.selectedMiniTableFields check:', this.selectedMiniTableFields);
  console.log('this.readOperation checking:', this.readOperation);
  const miniTableFieldsValue = this.createChart.get('MiniTableFields')?.value;
console.log('Retrieved MiniTableFields from Form:', miniTableFieldsValue);
if (Array.isArray(miniTableFieldsValue)) {
  // Extract the 'value' from each object
  const extractedValues = miniTableFieldsValue.map((field: any) => field.value);
  console.log('Extracted Values:', extractedValues);

  // Store in a variable
  this.selectedMiniTableFields = extractedValues;
} else {
  console.log('MiniTableFields is not an array or is empty.');
}


  // Ensure all values are defined before constructing the equation
  if (this.FormRead && this.readMinitableLabel && Array.isArray(this.selectedMiniTableFields)) {
      let equation = '';

      if (this.readMinitableLabel === "trackLocation") {
          // Remove "dynamic_table_values" for trackLocation
          equation = this.selectedMiniTableFields
              .map((field: string) => `\${${this.FormRead}.${this.readMinitableLabel}.${field}}`)
              .join(',');
      } else {
          // Keep "dynamic_table_values" for other cases
          equation = this.selectedMiniTableFields
              .map((field: string) => `\${${this.FormRead}.dynamic_table_values.${this.readMinitableLabel}.${field}}`)
              .join(',');
      }

      // If an operation is provided, prepend it
      if (this.readOperation && this.readOperation.trim() !== '') {
          equation = `${this.readOperation}(${equation})`;
      }

      console.log('Generated Equation:', equation);

      // Store the equation in the Angular form control
      this.createChart.controls['minitableEquation'].setValue("("+equation+")");
  } else {
      console.log('Error: One or more required values are missing.');
  }
}
async dynamicDataEquation() {
  // Fetching data based on index if needed
  try {
    const result: any = await this.api.GetMaster(this.SK_clientID + "#dynamic_form#lookup", 1);
    if (result) {
      const helperObj = JSON.parse(result.options);
      // Assuming you need to handle the data specific to an index or handle it globally
      this.formList = helperObj.map((item: any) => item[0]); 
      this.listofFormValues = this.formList.map((form: string) => ({ text: form, value: form }));
    }
  } catch (err) {
    console.error("Error fetching the dynamic form data", err);
  }
}

miniTableFieldsRead(readFields:any){
  console.log('readFields',readFields)
  if (readFields && readFields.value && Array.isArray(readFields.value)) {
    // Extract all 'value' properties from the selected items
    const selectedValues = readFields.value.map((item: any) => item.value);

    console.log('Extracted Values:', selectedValues);
    
    // Store the extracted values in a variable
    this.selectedMiniTableFields = selectedValues;
}



}

selectfilterFields(filterFormField:any){
  console.log('filterFormField check',filterFormField)

}
selectfilterFormList(filterFormValue:any){
  console.log('filterFormValue check',filterFormValue)
  const filterValue = filterFormValue[0].value
  this.fetchDynamicFormDataFilter(filterValue)

}

}
