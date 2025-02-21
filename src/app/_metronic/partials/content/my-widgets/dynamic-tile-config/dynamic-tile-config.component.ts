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
  selector: 'app-dynamic-tile-config',

  templateUrl: './dynamic-tile-config.component.html',
  styleUrl: './dynamic-tile-config.component.scss'
})
export class DynamicTileConfigComponent implements OnInit{
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
  filteredHeaders: {
    value: any; // Set the 'name' field as value
    label: any; // Set the 'label' field as label
  }[];
  readMinitableName: any;
  readMinitableLabel: any;
  filteredResults: any;
  extractedTables: any[];
  readOperation: any;
  FormRead: any;
  userIsChanging: boolean;
  selectedMiniTableFields: any[];
  noOfParamsEquation: any;
  operationValue: any[]=[];
  selectedEquationParameterValue: any=[];
  formName: any[] = [];
  listofEquationParam: any[]=[];
  listofFormValues: any;
  paramCountEquation: any;
  FormNames: any;

  IdsFetch: string[];
  summaryIds: any;
  projectList: any;
  projectListRead: any[];
  dashboardListRead: any[];
  dashboardList: any[];
  projectDetailListRead: any[];
  projectDetailList: any[];
  dashboardIdList: any[];
  reportStudioListRead: any[];
  reportStudioDetailList: any[];
  dynamicIDArray :any
  columnVisisbilityFields: any;
  selectedText: any;
  listofFormParam: any;



 
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
    this.dynamicDataEquation()
    this.dynamicDataDrill()
    this.createChart.get('toggleCheck')?.valueChanges.subscribe((isChecked) => {
      if (isChecked) {
        this.createChart.get('dashboardIds')?.enable();
        this.createChart.get('selectType')?.enable();
      } else {
        this.createChart.get('dashboardIds')?.disable();
        this.createChart.get('selectType')?.disable();
      }
    });

    this.createChart.get('primaryValue')?.valueChanges.subscribe(value => {
      if (value === 'Equation') {
        this.createChart.get('staticEquation')?.enable();
      } else {
        this.createChart.get('staticEquation')?.disable();
        this.createChart.get('staticEquation')?.setValue(''); // Reset value
      }
    });
    this.createChart.get('selectType')?.valueChanges.subscribe((selectedType) => {
      if (selectedType === 'drill down') {
        this.createChart.get('drillDownForm')?.enable();
        this.createChart.get('columnVisibility')?.enable();
      } else {
        this.createChart.get('drillDownForm')?.disable();
        this.createChart.get('columnVisibility')?.disable();
      }
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
      equation_param:[''],
      all_fields:new FormArray([]),
      equation_fields:new FormArray([]),

  
      widgetid: [this.generateUniqueId()],
      chart_title:[''],
      themeColor: ['', Validators.required],
      fontSize: [20, [Validators.required, Validators.min(8), Validators.max(72)]], // Default to 14px
      fontColor: ['', Validators.required], 
      toggleCheck: [false], // Default toggle state
// Default unchecked
      dashboardIds: [''],
 
      miniForm:[''],
      MiniTableNames:[''],
      MiniTableFields:[''],
      minitableEquation:[''],
      EquationOperationMini:[''],
      EquationDesc:[''],
      columnVisibility:[[]],
      ModuleNames:[''],
      selectType: [''],
      drillDownForm:['']
    
      // themeColor: ['#000000', Validators.required],
  

   
  


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
    // console.log('this.dynamicparameterLabMap before adding controls:', this.dynamicparameterLabMap);
    console.log('Event received in addControls:', event);
  
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
    console.log('noOfParams check:', noOfParams);
  
    // Ensure all_fields has the correct number of controls
    if (this.createChart.value.all_fields.length < noOfParams) {
      for (let i = this.all_fields.length; i < noOfParams; i++) {
        // Access the dynamic label for the current index
        // const dynamicLabel = this.dynamicparameterLabMap?.[i] || ''; // Default to empty if not found
        // console.log(`Index: ${i}, dynamicLabel: ${dynamicLabel}`);
  
        this.all_fields.push(
          this.fb.group({
            formlist: ['', Validators.required],
            parameterName: ['', Validators.required],
            primaryValue: ['', Validators.required],
            groupByFormat: ['', Validators.required],
            constantValue: [''],
            processed_value: [''],
            selectedColor: [this.selectedColor || '#FFFFFF'], // Default to white if no color is set
            selectedRangeType: [''],
            selectFromTime: [''],
            selectToTime: [''],
            // parameterValue: [''],
            fontSize: [20, [Validators.required, Validators.min(8), Validators.max(72)]], // Default to 14px
            filterForm: [''],
            filterParameter: [''],
            filterDescription: [''],
            custom_Label: ['', Validators.required],
            EquationDesc:['']
        // Dynamically set from the map
          })
        );
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
  
  
  get equation_fields() {
    return this.createChart.get('equation_fields') as FormArray;
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
    console.log('this.createChart.value.all_fields', this.createChart.value.all_fields.filterParameter);
  
    if (key === 'dynamicTile') {
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
        grid_type: 'dynamicTile',
        chart_title: this.createChart.value.chart_title || '', // Ensure this value exists
        toggleCheck: this.createChart.value.toggleCheck ||'',
        tileConfig: this.fields || [], // Updated fields with labels
        themeColor: this.createChart.value.themeColor,
        fontSize: `${this.createChart.value.fontSize}px`, // Added fontSize
        fontColor: this.createChart.value.fontColor,
        dashboardIds: this.createChart.value.dashboardIds,
        selectType: this.createChart.value.selectType,
        noOfParams: this.noOfParams || 0, // Ensure noOfParams has a valid value,
        miniForm:this.createChart.value.miniForm || '',
        MiniTableNames:this.createChart.value.MiniTableNames ||'',
        MiniTableFields:this.createChart.value.MiniTableFields ,
        minitableEquation:this.createChart.value.minitableEquation,
        EquationOperationMini:this.createChart.value.EquationOperationMini,
        equation: this.createChart.value.equation_fields || [], 
        EquationDesc:this.createChart.value.EquationDesc,
        equationParams:this.noOfParamsEquation ||'',
        equationProcess:'',
        columnVisibility:this.createChart.value.columnVisibility ||[],
        ModuleNames:this.createChart.value.ModuleNames ||'',
        drillDownForm:this.createChart.value.drillDownForm ||'',
        // selectType: this.createChart.value.ModuleNames,
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
    console.log('key checking from update', key);
    // console.log('highchartsOptionsJson checking',highchartsOptionsJson)
  //  let tempParsed = this.createChart.value.highchartsOptionsJson
    if (this.editTileIndex !== null) {
      console.log('this.editTileIndex check', this.editTileIndex);
      console.log('Tile checking for update:', this.dashboard[this.editTileIndex]);
  
//   if (typeof tempParsed === 'string') {
//     tempParsed = JSON.parse(tempParsed);
// }

// Update the chart options dynamically
// const updatedHighchartsOptionsJson = {
//   ...tempParsed,
//   title: {
//     ...tempParsed.title,
//     text: this.createChart.value.chart_title || ''  // Update the title dynamically
//   }
// };
// console.log('updatedHighchartsOptionsJson check',updatedHighchartsOptionsJson)
// // this.chartFinalOptions =JSON.stringify(updatedHighchartsOptionsJson,null,4)
// // console.log('this.chartFinalOptions check',this.chartFinalOptions)
      // Update the multi_value array with the new processed_value and constantValue

  
      // Add defensive checks for predefinedSelectRange

  
      
      console.log('this.dashboard',this.dashboard)
      // Now update the tile with the updated multi_value
      const updatedTile = {
        ...this.dashboard[this.editTileIndex], // Keep existing properties

        dashboardIds:this.createChart.value.dashboardIds ||'',
        selectType: this.createChart.value.selectType ||'',
        toggleCheck:this.createChart.value.toggleCheck ||'',
        themeColor: this.createChart.value.themeColor,
        fontSize: `${this.createChart.value.fontSize}px`,
        fontColor: this.createChart.value.fontColor,
        miniForm:this.createChart.value.miniForm || '',
        MiniTableNames:this.createChart.value.MiniTableNames ||'',
        MiniTableFields:this.createChart.value.MiniTableFields ,
        minitableEquation:this.createChart.value.minitableEquation ||'',
        EquationOperationMini:this.createChart.value.EquationOperationMini ||'',
        equation: this.createChart.value.equation_fields || [], 
        equation_param:this.createChart.value.equation_param ||'',
        // EquationFormList: this.createKPIWidget.value.EquationFormList,
        // EquationParam: this.createKPIWidget.value.EquationParam,
        // EquationOperation: this.createKPIWidget.value.EquationOperation,
        EquationDesc: this.createChart.value.EquationDesc ||'',
   
    chart_title: this.createChart.value.chart_title,
    // fontSize: this.createChart.value.fontSize,
    // themeColor: this.createChart.value.themeColor,
    // fontColor: this.createChart.value.fontColor,
    tileConfig: this.createChart.value.all_fields,
    // highchartsOptionsJson: this.chartFinalOptions,
    // filterForm:this.createChart.value.filterForm,
    // filterParameter:this.createChart.value.filterParameter,
    // filterDescription:this.createChart.value.filterDescription,
    // Include noOfParams
    noOfParams:this.dashboard[this.editTileIndex].noOfParams,
    ModuleNames:this.createChart.value.ModuleNames||'',
    columnVisibility:this.createChart.value.columnVisibility ||'',
    drillDownForm:this.createChart.value.drillDownForm ||''


      };
      console.log('updatedTile checking', updatedTile);
  
      // Update the dashboard array using a non-mutative approach
      this.dashboard = [
        ...this.dashboard.slice(0, this.editTileIndex),
        updatedTile,
        ...this.dashboard.slice(this.editTileIndex + 1),
      ];
  
      console.log('Updated Tile Details:', this.dashboard[this.editTileIndex]);
      console.log('this.all_Packet_store.grid_details check',this.all_Packet_store.grid_details)
  
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
      console.log('this.grid_details checkb for update',this.grid_details)
      
      this.dashboardChange.emit(this.grid_details);
  
      if (this.grid_details) {
        this.updateSummary(this.all_Packet_store,'update_tile');
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



  duplicateTile(tile: any, index: number): void {
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
        // alert('grid details is there')
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
  
    { color: "linear-gradient(to right, #8e44ad, #3498db)", selected: false }, // Vibrant Purple-Blue
    { color: "linear-gradient(to right, #fdc830, #f37335)", selected: false }, // Golden Sunburst
    { color: "linear-gradient(to right, #16a085, #f4d03f)", selected: false }, // Teal to Yellow
    { color: "linear-gradient(to right, #9cecfb, #65c7f7, #0052d4)", selected: false }, // Light to Deep Blue
    { color: "linear-gradient(to right, #00c6ff, #0072ff)", selected: false }, // Bright Blue
    { color: "linear-gradient(to right, #11998e, #38ef7d)", selected: false }, // Mint Green
    { color: "linear-gradient(to right, #ff9a9e, #fad0c4)", selected: false }, // Pink Pastel
    { color: "linear-gradient(to right, #fc5c7d, #6a82fb)", selected: false } , // Pink to Blue
    { color: "linear-gradient(to right, #1D2671, #C33764)", selected: false }, // Deep Purple to Reddish Pink
    { color: "linear-gradient(to right, #5433FF, #20BDFF, #A5FECB)", selected: false }, // Multicolor Cool Spectrum
    { color: "linear-gradient(to right, #FF5F6D, #FFC371)", selected: false }, // Soft Pink to Orange
    { color: "linear-gradient(to right, #C6FFDD, #FBD786, #f7797d)", selected: false }, // Pastel Multicolor
    { color: "linear-gradient(to right, #B24592, #F15F79)", selected: false }, // Purple-Pink Gradient
    { color: "linear-gradient(to right, #7F7FD5, #86A8E7, #91EAE4)", selected: false }, // Light Purple-Blue
    { color: "linear-gradient(to right, #FF512F, #F09819)", selected: false }, // Vivid Orange to Yellow
    { color: "linear-gradient(to right, #00B4DB, #0083B0)", selected: false }, // Aqua to Deep Blue
    { color: "linear-gradient(to right, #70E1F5, #FFD194)", selected: false }, // Sky Blue to Soft Yellow
    { color: "linear-gradient(to right, #373B44, #4286F4)", selected: false }, // Dark Blue to Grey
    { color: "linear-gradient(to right, #614385, #516395)", selected: false }, // Moody Purple to Blue
    { color: "linear-gradient(to right, #000428, #004e92)", selected: false }, // Midnight Blue
  
    { color: "linear-gradient(to right, #3A1C71, #D76D77, #FFAF7B)", selected: false }, // Purple to Peach
    { color: "linear-gradient(to right, #4568DC, #B06AB3)", selected: false },
    { color: "linear-gradient(to right, #32cd32, #adff2f)", selected: false }, // Soft Blue to Purple
    { color: "linear-gradient(to right, #6a0dad, #e6e6fa)", selected: false },
    { color: "linear-gradient(to right, #4b0082, #9370db)", selected: false },
    { color: "linear-gradient(to right, #008000, #00ff00)", selected: false },
    { color: "linear-gradient(to right, #9400d3, #fff0f5)", selected: false },
    { color: "linear-gradient(to right, #9b30ff, #8a2be2)", selected: false },
  
  
    { color: "linear-gradient(to right, #228b22, #98fb98)", selected: false },
    { color: "linear-gradient(to right, #8B4513, #A52A2A)", selected: false },
    { color: "linear-gradient(to right, #D2691E, #CD853F)", selected: false },
    { color: "linear-gradient(to right, #6B4226, #C2B280)", selected: false },
    { color: "linear-gradient(to right, #8B4513, #F4A300)", selected: false },
    { color: "linear-gradient(to right, #004d40, #00bcd4)", selected: false },
    { color: "linear-gradient(to right, #A52A2A, #F5DEB3)", selected: false },
    { color: "linear-gradient(to right, #800000, #b03060)", selected: false },
    { color: "linear-gradient(to right, #008080, #20b2aa)", selected: false },
   
  
    { color: "linear-gradient(to right, #006666, #48c9b0)", selected: false },
    { color: "linear-gradient(to right, #2b5876, #4e4376)", selected: false },
    { color: "linear-gradient(to right, #800080, #800080)", selected: false },
    { color: "linear-gradient(to right, #808000, #808000)", selected: false },
    { color: "linear-gradient(to right, #BC8F8F, #BC8F8F)", selected: false },
    { color: "linear-gradient(to right, #696969, #696969)", selected: false },
    { color: "linear-gradient(to right, #4E0707, #4E0707)", selected: false },
    { color: "linear-gradient(to right, #FF4500, #FF4500)", selected: false },
    { color: "linear-gradient(to right, #3A5311, #3A5311)", selected: false },
    { color: "linear-gradient(to right, #1338BE, #1338BE)", selected: false },
    { color: "linear-gradient(to right, #004F98, #004F98)", selected: false },
    { color: "linear-gradient(to right, #A1045A, #A1045A)", selected: false },
    { color: "linear-gradient(to right, #563C5C, #563C5C)", selected: false },
    { color: "linear-gradient(to right, #655967, #655967)", selected: false },
  
  
  
    
  
  
    
  
  
  
  
    
  
  
    
    
  
  
    
    
  
    
  ];


openDynamicTileModal(tile: any, index: number) {
  console.log('Index checking:', index);

  if (tile) {
    this.selectedTile = tile;
    this.editTileIndex = index !== undefined ? index : null;
    console.log('this.editTileIndex checking from openChartModal1', this.editTileIndex);
    console.log('Tile Object:', tile);

    this.paramCount = tile.noOfParams || 1;

    const fontSizeValue = tile.fontSize ? parseInt(tile.fontSize.replace('px', ''), 10) : 14;

    this.themes.forEach((theme) => {
      theme.selected = theme.color === tile.themeColor;
    });

    console.log('Themes after selection:', this.themes);

    let parsedMiniTableFields = [];
    if (tile.MiniTableFields) {
      if (typeof tile.MiniTableFields === 'string') {
        try {
          parsedMiniTableFields = JSON.parse(tile.MiniTableFields);
          console.log('Successfully Parsed MiniTableFields:', parsedMiniTableFields);
        } catch (error) {
          console.error('Error parsing MiniTableFields:', error);
        }
      } else {
        parsedMiniTableFields = tile.MiniTableFields; // Already an object
      }
    }
    let parsedEquationParam = [];
    if (typeof tile.EquationParam === 'string') {
      try {
        parsedEquationParam = JSON.parse(tile.EquationParam);
      } catch (error) {
        console.error('Error parsing EquationParam:', error);
      }
    } else if (Array.isArray(tile.EquationParam)) {
      parsedEquationParam = tile.equationParams;
    }
    let parsedColumnVisibility = [];
    if (typeof tile.columnVisibility === 'string') {
      try {
        parsedColumnVisibility = JSON.parse(tile.columnVisibility);
      } catch (error) {
        console.error('Error parsing columnVisibility:', error);
      }
    } else if (Array.isArray(tile.columnVisibility)) {
      parsedColumnVisibility = tile.columnVisibility;
    }
    console.log('parsedColumnVisibility checking',parsedColumnVisibility)
 
    this.createChart = this.fb.group({
      add_fields: this.paramCount,
      equation_param:tile.equation_param,
      chart_title: tile.chart_title || '',
      themeColor: tile.themeColor || 'linear-gradient(to right, #ffffff, #000000)',
      dashboardIds: tile.dashboardIds,
      fontSize: fontSizeValue,
      selectType: tile.selectType,
      fontColor: tile.fontColor || '#000000',
      toggleCheck: tile.toggleCheck,
      miniForm: tile.miniForm || '',
      MiniTableNames: tile.MiniTableNames || '',
      MiniTableFields: [parsedMiniTableFields],  // Ensure it's an array inside FormGroup
      minitableEquation: tile.minitableEquation,
      EquationOperationMini: tile.EquationOperationMini,
      EquationParam: parsedEquationParam, // Set parsed EquationParam
      all_fields: this.repopulate_fields(tile),
      equation_fields:this.populate_equationFields(tile),
      EquationDesc: tile.EquationDesc,
      ModuleNames:tile.ModuleNames,
      columnVisibility: [parsedColumnVisibility] ,
      drillDownForm:tile.drillDownForm,

    });
    this.selectedEquationParameterValue = parsedEquationParam;

    console.log('Final Form Values:', this.createChart.value);
    this.isEditMode = true;
  } else {
    this.selectedTile = null;
    this.isEditMode = false;
    if (this.createChart) {
      this.createChart.reset();
    }

    this.themes.forEach((theme) => {
      theme.selected = false;
    });
  }
}





preDefinedRange(preDefined:any){
  console.log('preDefined check',preDefined)

}

repopulate_fields(getValues: any) {
  let noOfParams: any = '';

  if (getValues && getValues !== null) {
    noOfParams = getValues.noOfParams;

    this.all_fields.clear();

    // Parse tileConfig
    let parsedtileConfig = [];
    try {
      if (typeof getValues.tileConfig === 'string') {
        parsedtileConfig = JSON.parse(getValues.tileConfig || '[]');
      } else {
        parsedtileConfig = Array.isArray(getValues.tileConfig) ? getValues.tileConfig : [];
      }
      console.log('Parsed tileConfig:', parsedtileConfig);
    } catch (error) {
      console.error('Error parsing tileConfig:', error);
    }

    if (parsedtileConfig.length > 0) {
      for (let i = 0; i < parsedtileConfig.length; i++) {
        console.log('parsedtileConfig checking', parsedtileConfig[i]);

        // Ensure filterParameter exists and is an array
        const filterParameterValue = Array.isArray(parsedtileConfig[i].filterParameter)
          ? parsedtileConfig[i].filterParameter
          : [];
        if (!filterParameterValue || filterParameterValue.length === 0) {
          console.warn(`filterParameter is empty or invalid at index ${i}`, parsedtileConfig[i]);
        }

        // Add the fields to the form group
        this.all_fields.push(this.fb.group({
          formlist: parsedtileConfig[i].formlist || '',
          parameterName: parsedtileConfig[i].parameterName || '',
          primaryValue: parsedtileConfig[i].primaryValue || '',
          groupByFormat: parsedtileConfig[i].groupByFormat || '',
          constantValue: parsedtileConfig[i].constantValue || '',
          selectedRangeType: parsedtileConfig[i].selectedRangeType || '',
          selectFromTime: parsedtileConfig[i].selectFromTime || '',
          selectToTime: parsedtileConfig[i].selectToTime || '',
          filterDescription: parsedtileConfig[i].filterDescription || '',
          custom_Label: parsedtileConfig[i].custom_Label || '',
          fontSize: parsedtileConfig[i].fontSize || 14,
          filterForm: parsedtileConfig[i].filterForm || '',
          filterParameter: this.fb.control(filterParameterValue), // Properly assign filterParameter as a form control
          EquationDesc:parsedtileConfig[i].EquationDesc
        }));

        // Log to confirm the field was added correctly
        console.log('Field added:', this.all_fields.at(this.all_fields.length - 1).value);
      }
    } else {
      // Adjust the form fields if no config exists
      if (noOfParams !== '' && noOfParams !== undefined && noOfParams !== null) {
        for (let i = this.all_fields.length; i >= noOfParams; i--) {
          this.all_fields.removeAt(i);
        }
      }
    }
  }

  console.log('Final fields:', this.all_fields);

  return this.all_fields;
}

populate_equationFields(getValues: any): FormArray {
  if (!getValues || getValues === null) {
    console.warn('No data to repopulate');
    return this.equation_fields;
  }

  // Clear existing fields in the FormArray
  this.equation_fields.clear();

  // Parse `chartConfig` safely
  let parsedChartConfig: any[] = [];
  try {
    if (typeof getValues.equation === 'string') {
      parsedChartConfig = JSON.parse(getValues.equation || '[]');
    } else if (Array.isArray(getValues.equation)) {
      parsedChartConfig = getValues.equation;
    }
  } catch (error) {
    console.error('Error parsing chartConfig:', error);
    parsedChartConfig = [];
  }

  console.log('Parsed chartConfig:', parsedChartConfig);

  // Populate FormArray based on parsedChartConfig
  if (parsedChartConfig.length > 0) {
    parsedChartConfig.forEach((configItem, index) => {
      console.log(`Processing index ${index} - Full Object:`, configItem);

      // Handle EquationFormList as a string
      const EquationFormListValue = typeof configItem.EquationFormList === 'string' 
        ? configItem.EquationFormList 
        : '';

      // Handle EquationParam as an array
      const filterParameter1Value = Array.isArray(configItem.EquationParam)
        ? configItem.EquationParam
        : [];

      // Handle EquationOperation as a string
      const EquationOperationValue = typeof configItem.EquationOperation === 'string'
        ? configItem.EquationOperation
        : '';

      // Create and push FormGroup into FormArray
      this.equation_fields.push(
        this.fb.group({
          EquationFormList: this.fb.control(EquationFormListValue), // String handling
          EquationOperation: this.fb.control(EquationOperationValue), // String handling
          EquationParam: this.fb.control(filterParameter1Value), // Array handling
        })
      );

      // Log the added FormGroup for debugging
      console.log(`FormGroup at index ${index}:`, this.equation_fields.at(index).value);
    });
  } else {
    console.warn('No parsed data to populate fields');
  }

  console.log('Final FormArray Values:', this.equation_fields.value);

  return this.equation_fields;
}



addEquationControls(event: any, _type: string) {
  console.log('event check', event);

  let noOfParamsEquation: any = '';

  if (_type === 'html' && event && event.target) {
    const inputValue = event.target.value;
    if (inputValue.trim() === '') {
      return this.toast.open("Empty input is not allowed", "Check again", {
        duration: 5000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
      });
    }

    if (Number(inputValue) < 0) {
      return this.toast.open("Negative values are not allowed", "Check again", {
        duration: 5000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
      });
    }

    try {
      noOfParamsEquation = JSON.parse(inputValue);
      if (typeof noOfParamsEquation !== 'number') {
        throw new Error('Not a number'); // Ensure it's a number since you're comparing with length later
      }
    } catch (e) {
      return this.toast.open("Invalid input: Not a valid number", "Check again", {
        duration: 5000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
      });
    }
  } else if (_type === 'ts') {
    if (event < 0) {
      return this.toast.open("Negative values not allowed", "Check again", {
        duration: 5000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
      });
    }
    noOfParamsEquation = event;
  }

  console.log('noOfParams check', noOfParamsEquation);

  // Update all_fields based on noOfParams
  if (this.createChart.value.equation_fields.length < noOfParamsEquation) {
    for (let i = this.equation_fields.length; i < noOfParamsEquation; i++) {
      this.equation_fields.push(
        this.fb.group({
          EquationFormList: [''],
          EquationParam: [[]],
          EquationOperation: [''],
        })
      );
      console.log('this.all_fields check', this.equation_fields);
    }
  } else {
    if (noOfParamsEquation !== "" && noOfParamsEquation !== undefined && noOfParamsEquation !== null) {
      for (let i = this.equation_fields.length - 1; i >= noOfParamsEquation; i--) {
        this.equation_fields.removeAt(i);
      }
    }
  }

  // Update noOfParams for use in addTile
  this.noOfParamsEquation = noOfParamsEquation;
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
  async dashboardIds(sk: any): Promise<string[]> {
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
                  console.log('this.dashboardIdsList check', this.dashboardIdsList);
                } else {
                  console.warn("Skipping element because P1 is not defined or null");
                }
              } else {
                break;
              }
            }
  
            // Store P1 values and return them
            this.p1ValuesSummary = this.dashboardIdsList.map((item: { P1: any }) => item.P1);
            console.log('P1 values: dashboard', this.p1ValuesSummary);
  
            // Continue fetching recursively
            await this.dashboardIds(sk + 1);
            return this.p1ValuesSummary; // Return collected values
          } else {
            console.error('Invalid data format - not an array.');
            return [];
          }
        } else {
          console.error('response.options is not a string.');
          return [];
        }
      } else {
        console.log("Lookup to be displayed", this.dashboardIdsList);
        return this.p1ValuesSummary; // Return collected values
      }
    } catch (error) {
      console.error('Error:', error);
      return [];
    }
  }
  addEquation(): void {
    const allFieldsArray = this.createChart.get('equation_fields') as FormArray;
    console.log('allFieldsArray', allFieldsArray.value);
  
    const equationTextArea = allFieldsArray.value.map((packet: any, index: number) => {
        if (!Array.isArray(packet.EquationParam)) {
          packet.EquationParam = [packet.EquationParam];
        }
        let tempText = packet.EquationParam
          .map((param: any) => `${packet.EquationFormList}.${param.text}.${param.value}`)
          .join(',');
  
        return `${packet.EquationOperation}(\${${tempText}})`;
      })
      .join(', ');
  
    console.log('Formatted Equation:', equationTextArea); // Debugging
  
    // Patch value with change detection
    this.createChart.patchValue({
      EquationDesc: "("+equationTextArea+")",
    });
  
    this.createChart.get('EquationDesc')?.markAsTouched();
    this.createChart.get('EquationDesc')?.updateValueAndValidity();
    this.cdr.detectChanges();
  
    console.log('Updated Form Value:', this.createChart.value);
  }
  
  
  onMouseLeave(): void {
    this.isHovered = false;
  }
  fetchDynamicFormData(value: any, index: number) {
    console.log("Fetching data for:", value);

    // Simulating API call
    this.api
      .GetMaster(`${this.SK_clientID}#dynamic_form#${value}#main`, 1)
      .then((result: any) => {
        if (result && result.metadata) {
          const parsedMetadata = JSON.parse(result.metadata);
          const formFields = parsedMetadata.formFields;

          // Prepare parameter list
          const dynamicParamList = formFields.map((field: any) => ({
            value: field.name,
            text: field.label,
          }));

          // Add created_time and updated_time
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

          // Store parameters in the map
          this.dynamicParamMap.set(index, dynamicParamList);

          // Trigger change detection
          this.cdr.detectChanges();
        }
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
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

  SelectTypeSummary =[
    { value: 'NewTab', text: 'New Tab' },
    { value: 'Modal', text: 'Modal(Pop Up)' },
    { value: 'Same page Redirect', text: 'Same page Redirect' },

    { value: 'drill down', text: 'drill down' },
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
    { value: 'Count Dynamic', text: 'Count Dynamic' },
    { value: 'Equation', text: 'Equation' },
    { value: 'Count MultiplePram', text: 'Count Multiple Parameter' },
    { value: 'Sum MultiplePram', text: 'Sum Multiple Parameter' },
    { value: 'Average Multiple Parameter', text: 'Average Multiple Parameter' },
    { value: 'sumArray', text: 'SumArray' },
    { value: 'Advance Equation', text: 'Advance Equation' },
    { value: 'sum_difference', text: 'Sum Difference' },
    { value: 'distance_sum', text: 'Distance Sum' },


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
    { value: 'Yearly', text: 'Yearly' },
    { value: 'any', text: 'any' }
  ];
  onValueChange(selectedValue: any, fieldIndex: number): void {
    console.log('selectedValue check', selectedValue[0].value);  // Log the selected value
  
    // Set the primaryValue form control to the selected value
    this.createChart.get('primaryValue')?.setValue(selectedValue[0].value);
  
    // Access the form group of the primary field (assuming you're using a FormArray)
    const fieldGroup = this.createChart.get('all_fields') as FormArray;
  
    // Iterate over each form group if you have a FormArray
    fieldGroup.controls.forEach((group, index) => {
      if (index === fieldIndex) {
        if (selectedValue[0].value === 'Equation') {
          group.get('staticEquation')?.enable();
        } else {
          group.get('staticEquation')?.disable();
          group.get('staticEquation')?.setValue('');
        }
      }
    });
  
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
          equation = `${this.readOperation}(${equation}`;
      }

      console.log('Generated Equation:', equation);

      // Store the equation in the Angular form control
      this.createChart.controls['minitableEquation'].setValue("("+equation+")");
  } else {
      console.log('Error: One or more required values are missing.');
  }
}
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
{ value: 'any', text: 'any' },


]
selectedOperation(selectedOperation: any): void {
  if (selectedOperation && selectedOperation[0]) {
    this.operationValue = selectedOperation[0].value;
    console.log('this.operationValue:', this.operationValue);

    // Synchronize with the form control
    this.createChart.patchValue({
      EquationOperation: this.operationValue,
    });
  } else {
    console.warn('Invalid operation selected:', selectedOperation);
  }
}
EquationparameterValue(event: any, fieldIndex: any): void {
  console.log('Event check for dynamic param:', event);
  console.log('Check field index:', fieldIndex);

  if (event && event.value && Array.isArray(event.value)) {
      const valuesArray = event.value;
      const formattedValues = valuesArray.map((item: any) => {
          const { value, text } = item;
          return { value, text };
      });

      console.log(`Formatted Selected Items for index ${fieldIndex}:`, formattedValues);
      const equationParamControlName = `EquationParam${fieldIndex}`;
      const EquationParameter = this.createChart.get(equationParamControlName);

      if (EquationParameter) {
          EquationParameter.setValue(formattedValues);
          this.cdr.detectChanges();
      } else {
          console.warn(`Form control not found: ${equationParamControlName}`);
      }

      // Ensure the array is initialized at the specific index
      if (!this.selectedEquationParameterValue) {
          this.selectedEquationParameterValue = [];
      }

      // Use the fieldIndex safely
      this.selectedEquationParameterValue[fieldIndex] = formattedValues.length === 1 ? formattedValues[0] : formattedValues;
  } else {
      console.warn('Invalid event structure:', event);
      this.resetEquationParameter(fieldIndex);
  }
}

private resetEquationParameter(fieldIndex: any): void {
  const equationParamControlName = `EquationParam${fieldIndex}`;
  const EquationParameter = this.createChart.get(equationParamControlName);
  
  if (EquationParameter) {
      EquationParameter.setValue([]); // Reset to an empty array
  }
  this.selectedEquationParameterValue[fieldIndex] = [];
}
selectFormParams1(event: any[], index: number): void {
  console.log('Event checking from equa', event);

  // Validate the event structure more rigorously
  if (Array.isArray(event) && event.length > 0) {
    event.forEach((entry, idx) => {
      // Check each entry for the expected structure and data
      if (entry && entry.data && typeof entry.data.text === 'string') {
        const selectedTexteqa = entry.data.text; // Extract the form name, such as "Work Order"
        console.log(`Selected Form Text from Equation at index ${idx}:`, selectedTexteqa);
        this.updateFormName(selectedTexteqa, index);
     

        // Call the fetch function with the selected text and corresponding index
        this.fetchDynamicFormDataEquation(selectedTexteqa, index);
      } else {
        // Log a warning if any entry is not in the expected format, include the entry index for reference
        console.warn(`Entry at index ${idx} is not in the expected format or missing data:`, entry);
      }
    });
  } else {
    // Log an error if the event array is empty or not an array
    console.error('Event data is not in the expected format or empty:', event);
  }
}


updateFormName(selectedTexteqa: string, idx: number): void {
  console.log(`Updating formName for index ${idx} with:`, selectedTexteqa);
  this.formName[idx] = selectedTexteqa;  // Update the component level formName variable
  console.log('this.formName',this.formName)
  // this.indexwiseOperationValue[idx] = this.operationValue
 
  
  // Additional logic if you need to do something with this new form name
}


fetchDynamicFormDataEquation(value: any, index: any) {
  console.log("Data from lookup:", value);
  console.log('Index checking', index);

  // Ensure listofEquationParam is initialized as an array
  if (!Array.isArray(this.listofEquationParam)) {
      this.listofEquationParam = [];
  }

  this.api.GetMaster(`${this.SK_clientID}#dynamic_form#${value}#main`, 1)
      .then((result: any) => {
          if (result && result.metadata) {
              try {
                  const parsedMetadata = JSON.parse(result.metadata);
                  const EquaformFields = parsedMetadata.formFields;
                  console.log('FormFields check', EquaformFields);

                  // Initialize the sub-array if it does not exist
                  this.listofEquationParam[index] = this.listofEquationParam[index] || [];

                  // Reset the list at the specified index to ensure it's clean on every fetch
                  this.listofEquationParam[index] = EquaformFields.map((field: any) => {
                      console.log('Field check', field);
                      return { value: field.name, text: field.label };
                  });

                  // Optionally include timestamps
                  ['created_time', 'updated_time'].forEach((timeKey) => {
                      if (parsedMetadata[timeKey]) {
                          this.listofEquationParam[index].push({
                              value: parsedMetadata[timeKey].toString(),
                              text: `${timeKey.replace('_', ' ').charAt(0).toUpperCase() + timeKey.slice(1).replace('_', ' ')}`
                          });
                      }
                  });

                  console.log('Transformed dynamic parameters:', this.listofEquationParam[index]);
              } catch (error) {
                  console.error("Error parsing metadata: ", error);
                  this.toast.open("Failed to parse form data", "Error", {
                      duration: 5000,
                      horizontalPosition: 'right',
                      verticalPosition: 'top',
                  });
              }
          }
      })
      .catch((err) => {
          console.error("Can't fetch form data: ", err);
          this.toast.open("Failed to fetch form data", "Error", {
              duration: 5000,
              horizontalPosition: 'right',
              verticalPosition: 'top',
          });
      })
      .finally(() => {
          // Ensure change detection happens in all cases
          this.cdr.detectChanges();
      });
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

showModuleNames = [
  { value: 'None', text: 'None' },
  { value: 'Forms', text: 'Forms' },
  { value: 'Dashboard', text: 'Dashboard' },
  { value: 'Dashboard - Group', text: 'Dashboard - Group' },
  { value: 'Summary Dashboard', text: 'Summary Dashboard' },
  { value: 'Projects', text: 'Projects' },
  { value: 'Project - Detail', text: 'Project - Detail' },
  { value: 'Project - Group', text: 'Project - Group' },
  {value: 'Report Studio', text: 'Report Studio'}

]
async moduleSelection(event: any): Promise<void> {
  const selectedValue = event[0].value; // Get selected value
  console.log('selectedValue checking',selectedValue)
  switch (selectedValue) {
    case 'None':
      console.log('No module selected');
      // Add specific logic here
      break;

    case 'Forms':
      console.log('Forms module selected');
      this.FormNames=this.listofDeviceIds
      console.log('this.FormNames checking',this.FormNames)
      this.dynamicIDArray = []
      this.dynamicIDArray = this.FormNames
      // Add specific logic for Forms
      break;

    case 'Dashboard':
      console.log('Dashboard module selected');
      this.IdsFetch = await this.dashboardIdsFetching(1)
  
      console.log('IdsFetch checking',this.IdsFetch)
      this.dynamicIDArray = []
      this.dynamicIDArray = this.IdsFetch
    
      break;
      // Add specific logic for Dashboard


    case 'Dashboard - Group':
      console.log('Dashboard - Group module selected');
      this.dynamicIDArray = []
      // Add specific logic for Dashboard - Group
      break;

    case 'Summary Dashboard':
      this.summaryIds = await this.dashboardIds(1); // Await and get P1 values
      console.log('Fetched P1 values:', this.summaryIds);
      this.dynamicIDArray = [];
      this.dynamicIDArray = this.summaryIds
      
      console.log('Summary Dashboard module selected');
      // Add specific logic for Summary Dashboard
      break;

    case 'Projects':
      console.log('Projects module selected');
      const projectList = await this.fetchDynamicLookupData(1)
      console.log('projectList checking',projectList)
      
      this.dynamicIDArray = []
      this.dynamicIDArray = projectList
      break;
      // Add specific logic for Projects
      break;

    case 'Project - Detail':
      console.log('Project - Detail module selected');
      const projectDetailList = await this.ProjectDetailLookupData(1)

      this.dynamicIDArray = []
      this.dynamicIDArray = projectDetailList

      // Add specific logic for Project - Detail
      break;

    case 'Project - Group':
      console.log('Project - Group module selected');
      this.dynamicIDArray = []
      // Add specific logic for Project - Group
      break;
      case 'Report Studio':
        console.log('Project - Group module selected');
        this.dynamicIDArray = []
        const ReportStudioLookup = await this.reportStudioLookupData(1)

        this.dynamicIDArray = []
        this.dynamicIDArray = ReportStudioLookup
        // Add specific logic for Project - Group
        break;

    default:
      console.log('Invalid selection');
      break;
  }
}


async dashboardIdsFetching(sk: any): Promise<string[]> {
  console.log("I am called Bro");
  try {
    const response = await this.api.GetMaster(this.SK_clientID + "#formgroup#lookup", sk);

    if (response && response.options) {
      if (typeof response.options === 'string') {
        let data = JSON.parse(response.options);
        console.log("dashboard data checking", data);

        if (Array.isArray(data)) {
          for (let index = 0; index < data.length; index++) {
            const element = data[index];

            if (element !== null && element !== undefined) {
              const key = Object.keys(element)[0]; // Extract L1, L2, etc.
              if (key && element[key]) {
                const { P1, P2, P3, P4, P5 } = element[key];

                // Ensure dashboardIdsList is initialized
                if (!this.dashboardListRead) {
                  this.dashboardListRead = [];
                }

                // Check if P1 exists before pushing
                if (P1 !== undefined && P1 !== null) {
                  this.dashboardListRead.push({ P1, P2, P3, P4, P5 });
                  console.log("Pushed to dashboardIdsList: ", { P1, P2, P3, P4, P5 });
                } else {
                  console.warn("Skipping element because P1 is not defined or null");
                }
              } else {
                console.warn("Skipping malformed element", element);
              }
            }
          }

          // Store only P1 values
          this.dashboardList = this.dashboardListRead.map((item: { P1: any }) => item.P1);
          console.log('dashboardIdList', this.dashboardList);

          // Continue fetching recursively if needed
          await this.dashboardIdsFetching(sk + 1);
          return this.dashboardList; // Return collected values
        } else {
          console.error('Invalid data format - not an array.');
          return [];
        }
      } else {
        console.error('response.options is not a string.');
        return [];
      }
    } else {
      console.log("Lookup to be displayed", this.dashboardIdsList);
      return this.dashboardIdList; // Return collected values
    }
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
}

async ProjectDetailLookupData(sk: any): Promise<string[]> {
  console.log("I am called Bro");
  try {
    const response = await this.api.GetMaster(this.SK_clientID + "#project#lookup", sk);

    if (response && response.options) {
      if (typeof response.options === 'string') {
        let data = JSON.parse(response.options);
        console.log("dashboard data checking", data);

        if (Array.isArray(data)) {
          for (let index = 0; index < data.length; index++) {
            const element = data[index];

            if (element !== null && element !== undefined) {
              const key = Object.keys(element)[0]; // Extract L1, L2, etc.
              if (key && element[key]) {
                const { P1, P2, P3, P4, P5 } = element[key];

                // Ensure dashboardIdsList is initialized
                if (!this.projectDetailListRead) {
                  this.projectDetailListRead = [];
                }

                // Check if P1 exists before pushing
                if (P1 !== undefined && P1 !== null) {
                  this.projectDetailListRead.push({ P1, P2, P3, P4, P5 });
                  console.log("Pushed to dashboardIdsList: ", { P1, P2, P3, P4, P5 });
                } else {
                  console.warn("Skipping element because P1 is not defined or null");
                }
              } else {
                console.warn("Skipping malformed element", element);
              }
            }
          }

          // Store only P1 values
          this.projectDetailList = this.projectDetailListRead.map((item: { P1: any }) => item.P1);
          console.log('dashboardIdList', this.projectDetailList);

          // Continue fetching recursively if needed
          await this.ProjectDetailLookupData(sk + 1);
          return this.projectDetailList; // Return collected values
        } else {
          console.error('Invalid data format - not an array.');
          return [];
        }
      } else {
        console.error('response.options is not a string.');
        return [];
      }
    } else {
      console.log("Lookup to be displayed", this.dashboardIdsList);
      return this.dashboardIdList; // Return collected values
    }
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
}

async reportStudioLookupData(sk: any): Promise<string[]> {
  console.log("I am called Bro");
  try {
    const response = await this.api.GetMaster(this.SK_clientID + "#savedquery#lookup", sk);
    console.log('saved query response',response)

    if (response && response.options) {
      if (typeof response.options === 'string') {
        let data = JSON.parse(response.options);
        console.log("dashboard data checking", data);

        if (Array.isArray(data)) {
          for (let index = 0; index < data.length; index++) {
            const element = data[index];

            if (element !== null && element !== undefined) {
              const key = Object.keys(element)[0]; // Extract L1, L2, etc.
              if (key && element[key]) {
                const { P1, P2, P3 } = element[key];

                // Ensure dashboardIdsList is initialized
                if (!this.reportStudioListRead) {
                  this.reportStudioListRead = [];
                }

                // Check if P1 exists before pushing
                if (P1 !== undefined && P1 !== null) {
                  this.reportStudioListRead.push({ P1, P2, P3});
                  console.log("Pushed to dashboardIdsList: ", { P1, P2, P3 });
                } else {
                  console.warn("Skipping element because P1 is not defined or null");
                }
              } else {
                console.warn("Skipping malformed element", element);
              }
            }
          }

          // Store only P1 values
          this.reportStudioDetailList = this.reportStudioListRead.map((item: { P1: any }) => item.P1);
          console.log('dashboardIdList', this.reportStudioDetailList);

          // Continue fetching recursively if needed
          await this.reportStudioLookupData(sk + 1);
          return this.reportStudioDetailList; // Return collected values
        } else {
          console.error('Invalid data format - not an array.');
          return [];
        }
      } else {
        console.error('response.options is not a string.');
        return [];
      }
    } else {
      console.log("Lookup to be displayed", this.dashboardIdsList);
      return this.dashboardIdList; // Return collected values
    }
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
}



async fetchDynamicLookupData(sk: any): Promise<string[]> {
  console.log("I am called Bro");
  try {
    const response = await this.api.GetMaster(this.SK_clientID + "#folder#lookup", sk);

    if (response && response.options) {
      if (typeof response.options === 'string') {
        let data = JSON.parse(response.options);
        console.log("dashboard data checking", data);

        if (Array.isArray(data)) {
          for (let index = 0; index < data.length; index++) {
            const element = data[index];

            if (element !== null && element !== undefined) {
              const key = Object.keys(element)[0]; // Extract L1, L2, etc.
              if (key && element[key]) {
                const { P1, P2, P3, P4, P5 } = element[key];

                // Ensure dashboardIdsList is initialized
                if (!this.projectListRead) {
                  this.projectListRead = [];
                }

                // Check if P1 exists before pushing
                if (P1 !== undefined && P1 !== null) {
                  this.projectListRead.push({ P1, P2, P3, P4, P5 });
                  console.log("Pushed to dashboardIdsList: ", { P1, P2, P3, P4, P5 });
                } else {
                  console.warn("Skipping element because P1 is not defined or null");
                }
              } else {
                console.warn("Skipping malformed element", element);
              }
            }
          }

          // Store only P1 values
          this.projectList = this.projectListRead.map((item: { P1: any }) => item.P1);
          console.log('dashboardIdList', this.projectList);

          // Continue fetching recursively if needed
          await this.fetchDynamicLookupData(sk + 1);
          return this.projectList; // Return collected values
        } else {
          console.error('Invalid data format - not an array.');
          return [];
        }
      } else {
        console.error('response.options is not a string.');
        return [];
      }
    } else {
      console.log("Lookup to be displayed", this.dashboardIdsList);
      return this.dashboardIdList; // Return collected values
    }
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
}

dynamicRedirectChanged(event:any){

  let eventData;
  if(event && event.target && event.target.value){
    eventData = event.target.value
  }
  else{
    eventData = event
  }

   let dashUrl = '/dashboard'
  let projecturl = '/project-dashboard'

  const selectedModule = this.createChart.get('ModuleNames')?.value

  console.log("selected module name read",selectedModule);


//   switch(selectedModule){
//     case 'Dashboard - Group':
//       this.redirectionURL =  dashUrl
//       this.dynamicIDArray = []
//       break;
//     case 'Project - Group':
//       this.redirectionURL = projecturl
//       this.dynamicIDArray = []
//       break
//     case 'Forms':
//       this.redirectionURL =  '/view-dreamboard/Forms/'+eventData
//       break;
//     case 'Summary Dashboard':
//       this.redirectionURL =  '/summary-engine/'+eventData
//       break;
//     case 'Dashboard':
//       this.redirectionURL =  '/dashboard/dashboardFrom/'+eventData
//       break;
//     case 'Projects':
//       this.redirectionURL =  '/project-dashboard/project-template-dashboard/'+eventData
//       break;
//     case 'Project - Detail':
//       this.redirectionURL =  '/view-dreamboard/Project%20Detail/'+eventData
//       break;
// }

}

// getFormControlValue(selectedTextConfi:any): void {
//   // const formlistControl = this.createChart.get('formlist');
//   console.log('Formlist Control Value:', selectedTextConfi);
//   this.fetchDynamicFormDataConfig(selectedTextConfi);
// }

// fetchDynamicFormDataConfig(value: any) {
//   console.log("Data from lookup:", value);

//   this.api
//     .GetMaster(`${this.SK_clientID}#dynamic_form#${value}#main`, 1)
//     .then((result: any) => {
//       if (result && result.metadata) {
//         const parsedMetadata = JSON.parse(result.metadata);
//         console.log('parsedMetadata check dynamic',parsedMetadata)
//         const formFields = parsedMetadata.formFields;
//         console.log('formFields check',formFields)

//         // Initialize the list with formFields labels
//         this.columnVisisbilityFields = formFields.map((field: any) => {
//           console.log('field check',field)
//           return {
//             value: field.name,
//             text: field.label
//           };
//         });

//         // Include created_time and updated_time
//         if (parsedMetadata.created_time) {
//           this.columnVisisbilityFields.push({
//             value: parsedMetadata.created_time.toString(),
//             text: 'Created Time' // You can customize the label here if needed
//           });
//         }

//         if (parsedMetadata.updated_time) {
//           this.columnVisisbilityFields.push({
//             value: parsedMetadata.updated_time.toString(),
//             text: 'Updated Time' // You can customize the label here if needed
//           });
//         }

//         console.log('Transformed dynamic parameters config', this.columnVisisbilityFields);

//         // Trigger change detection to update the view
//         this.cdr.detectChanges();
//       }
//     })
//     .catch((err) => {
//       console.log("Can't fetch", err);
//     });
// }

selectFormParamsDrill(event: any) {
  if (event && event[0] && event[0].data) {
    this.selectedText = event[0].data.text;  // Adjust based on the actual structure
    console.log('Selected Form Text:', this.selectedText);
 

    if (this.selectedText) {
      this.fetchDynamicFormDataDrill(this.selectedText);
    }
  } else {
    console.error('Event data is not in the expected format:', event);
  }
}

fetchDynamicFormDataDrill(value: any) {
  console.log("Data from lookup:", value);

  this.api
    .GetMaster(`${this.SK_clientID}#dynamic_form#${value}#main`, 1)
    .then((result: any) => {
      if (result && result.metadata) {
        const parsedMetadata = JSON.parse(result.metadata);
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

        console.log('Transformed dynamic parameters:', this.columnVisisbilityFields);

        // Trigger change detection to update the view
        this.cdr.detectChanges();
      }
    })
    .catch((err) => {
      console.log("Can't fetch", err);
    });
}

async dynamicDataDrill(){
  try {
    const result: any = await this.api.GetMaster(this.SK_clientID + "#dynamic_form#lookup", 1);
    if (result) {
      console.log('forms chaecking',result)
      const helpherObj = JSON.parse(result.options);
      console.log('helpherObj checking',helpherObj)
      this.formList = helpherObj.map((item: [string]) => item[0]); // Explicitly define the type
      this.listofFormParam = this.formList.map((form: string) => ({ text: form, value: form })); // Explicitly define the type here too
      console.log('listofFormParam',this.listofFormParam)
      console.log('this.formList check from location', this.formList);
    }
  } catch (err) {
    console.log("Error fetching the dynamic form data", err);
  }
}
}
