import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Injector, Input, NgZone, OnDestroy, OnInit, Output, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
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
import Swal from 'sweetalert2';

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
    P9:any;
    P10:any;
    P11:any;
  };
}

@Component({
  selector: 'app-tile1-config',

  templateUrl: './tile1-config.component.html',
  styleUrl: './tile1-config.component.scss'
})
export class Tile1ConfigComponent implements OnInit {
  createKPIWidget: FormGroup;
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
  @ViewChild('calendarModal') calendarModal: any;
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
  dashboardIdList: any;
  idsDashboard: any;
  dashboardIdsList: any;
  p1ValuesSummary: any;
  selectedParameterValue: any;
  parameterNameRead: any;
  multipleCheck: any;
  selectedTexts: any;
  @Input()isGirdMoved: any;
  permissionIdsList: any;
  p1ValuesSummaryPemission: any;
  selectedEquationParameterValue: any=[];
  listofFormValues: any;
  listofEquationParam: any[]=[];
  operationValue: any[]=[];
  columnVisisbilityFields: any;
  selectedText: any;
  shoRowData:boolean = false
 
  noOfParams: any;
  indexwiseOperationValue: any;
  paramCount: any;

  filteredHeaders: any;
  readMinitableName: any;
  readMinitableLabel: any;
  filteredResults: any;

  readOperation: any;
  FormRead: any;
  selectedMiniTableFields: any;
  userIsChanging: boolean;
  summaryIds: string[];
  IdsFetch: string[];
  projectDetailListRead: any[];
  projectDetailList: any[];
  extractedTables: unknown[];
  dynamicIDArray: any;
  lookup_All_temp: any;

  dashboardList: any;
  dashboardListRead: any;
  FormNames: any;
  projectListRead: any;
  projectList: any;

  redirectionURL: string;
  reportStudioListRead: any;
  reportStudioDetailList: any;
  helpherObjCalender: any;
  formListTitles: any;
  showColumnVisibility = false;
  isSummaryDashboardSelected = false;
  formValidationFailed:boolean =true;
  userdetails: any;
  userClient: string;
  permissionsMetaData: any;
  permissionIdRequest: any;
  parsedPermission: any;
  readFilterEquation: any;
  summaryPermission: any;
  dashboardData: any;
  storeFormIdPerm: any;
  allDeviceIds: any;


  SelectTypeSummary = [
    { value: 'NewTab', text: 'New Tab' },
    { value: 'Modal', text: 'Modal(Pop Up)' },
    { value: 'Same page Redirect', text: 'Same Page Redirect' },
    { value: 'drill down', text: 'Drill Down' },
  ];

  filteredSelectTypeSummary = [...this.SelectTypeSummary]; 
 
  ngOnInit() {

    this.getLoggedUser = this.summaryConfiguration.getLoggedUserDetails()
    console.log('this.getLoggedUser check', this.getLoggedUser)
    // this.getWorkFlowDetails = this.summaryConfiguration.getLoggedUserDetails()
    // console.log('this.getLoggedUser check',this.getWorkFlowDetails)


    this.SK_clientID = this.getLoggedUser.clientID;
    console.log('this.SK_clientID check', this.SK_clientID)
    this.initializeTileFields()
    this.setupRanges();
  
   this.dynamicDataEquation()
    this.dashboardIds(1)
    this.fetchUserPermissions(1)

    this.createKPIWidget.get('selectType')?.valueChanges.subscribe(value => {
      this.showColumnVisibility = value === 'drill down';
    });

    this.createKPIWidget.valueChanges.subscribe(() => {
      if (this.createKPIWidget.valid) {
        this.formValidationFailed = true;
      }
    });
  
  
    // this.permissionIds(1)
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('dashboardChange',this.all_Packet_store)
    console.log('isGirdMoved check',this.isGirdMoved)


  }

  onSelectTypeChange() {
    const selectedType = this.createKPIWidget.get('selectType')?.value;
    this.showColumnVisibility = selectedType === 'drill down';
  }
  tooltipContent: string = 'Group data by time periods such as Today, Last 7 Days, This Month, or This Year to view filtered insights based on the selected range. For example, "This Year" refers to data from January to December of the current year.';

  formTooltip: string = 'Select a form to view and analyze data specific to that form.';
  parameterTooltip: string = 'Specify which form fields to analyze. The results will be based solely on your selection.';
  
  formatTypeTooltip: string = 'Select a format to represent the output value appropriately—for example, Rupee for currency, Distance for measurements, or Percentage for ratios.';
  customLabelTooltip: string = 'Provide a custom label to be displayed as the widget title.';
  moduleNamesTooltip: string = 'Select the module that the user will be redirected to when the widget is clicked.';
  selectTypeTooltip: string = 'Choose how the dashboard should open when the widget is clicked—whether in a new tab, a modal, or on the same page.';
  
  redirectToTooltip: string = 'Select the specific dashboard or module the user should be redirected to when the widget is clicked.';
  columnVisibilityTooltip: string = 'Select the fields to display in the drill-down table. Only the selected columns will be visible in the detailed view.';
  redirectionType: string = 'Choose how the widget should open the target dashboard or module: "New Tab" opens it in a separate browser tab, "Modal (Pop Up)" displays it in a modal window, "Same Page Redirect" replaces the current view, and "Drill Down" shows detailed insights in Table.';

  filterParameterTooltip: string = 'Select form fields to apply filter conditions. The chosen fields will be used to filter data based on matching or non-matching values.';
filterEquationTooltip: string = 'Displays the generated filter equation based on selected fields. Field values are inserted dynamically in the format: Field Name - ${fieldId}. Example: Customer Name-${text-1732773051881} && Status-${single-select-1732769559973}';
highchartsOptionsTooltip: string = 'This area shows the chart settings in JSON format. You can edit it to change how the chart looks, like its type, colors, title, and more.';
MiniformTooltip:string ='Select a minitable name to view and analyze data specific to that minitable only.'
miniTableFieldsTooltip:string = 'Specify which minitable fields to analyze. Results will be based solely on your selection.'
minitableEquationTooltip: string = 'Displays a formatted equation using the selected mini-table fields. Example: Count MultiplePram(${Personal Info.dynamic_table_values.table-1736939655825.text-1730976463331}). The equation is auto-generated based on your selections.';

fontSizeTooltip: string = 'This sets the font size for the label on the tile. Enter a value between 8 and 72.';
fontColorTooltip: string = 'This sets the font color for the label on the tile. Select a color to apply.';
valueFontSizeTooltip: string = 'This sets the font size for the value displayed on the tile. Enter a size between 8 and 72.';
valueFontColorTooltip: string = 'This sets the font color for the value shown on the tile. Choose a color to apply.';
tileBackgroundTooltip: string = 'Select a background theme. The chosen color or gradient will be applied as the tile\'s background.';
equationCountTooltip: string = 'Enter the number of equations you want to configure. Based on this count, dynamic form sections will be generated below.';
equationFormTooltip: string = 'Choose the form you want to use for building this equation. The fields and operations shown next will be based on the selected form.';
formFieldsTooltip: string = 'Select one or more fields from the chosen form. These fields will be used to build the equation below.';


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

  dateRangeLabel =[
    { value: 'Today', text: 'Today' },
    { value: 'Yesterday', text: 'Yesterday' },
    { value: 'Last 7 Days', text: 'Last 7 Days' },
    { value: 'Last 30 Days', text: 'Last 30 Days' },
    { value: 'This Month', text: 'This Month' },
    { value: 'Last Month', text: 'Last Month' },
    { value: 'This Year', text: 'This Year' },
    { value: 'Last Year', text: 'Last Year' },
    { value: 'Last 60 Days', text: 'Last 60 Days' },
    { value: 'Last 90 Days', text: 'Last 90 Days' },
    { value: 'Last 180 Days', text: 'Last 180 Days' },
    { value: 'Last 2 Years', text: 'Last 2 Year' },
    { value: 'any', text: 'any' },
 
 
 
  ]
  initializeTileFields(): void {
    const defaultTheme = { color: "linear-gradient(to right, #A1045A, #A1045A)", selected: true };
    this.selectedColor = defaultTheme.color;

    // Initialize the form group
    this.createKPIWidget = this.fb.group({
      add_fields:[''],
      all_fields:new FormArray([]),
      formlist: ['', Validators.required],
      parameterName: ['', Validators.required],
      primaryValue: ['', Validators.required],
      groupByFormat: ['', Validators.required],
      constantValue: [''],
      widgetid: [this.generateUniqueId()],
      processed_value: [''],
      selectedColor: [this.selectedColor || '#FFFFFF'], // Default to white if no color is set
    

      themeColor: [this.selectedColor, Validators.required],
      fontSize: [20, [Validators.required, Validators.min(8), Validators.max(72)]], // Default to 14px
      fontColor: ['#ebeaea', Validators.required], // Default to black
      selectFromTime: [''],
      selectToTime: [''],
      dashboardIds: [''],
  
      filterParameter: [[]], // Initialize as an array to handle multiple or single values
      filterDescription: [''],
    
      custom_Label:['',Validators.required],
   
      EquationDesc:[''],
      formatType:['',Validators.required],
      columnVisibility:[[]],
      ModuleNames:[''],
      selectType: [''],
      rowData:[],
      miniForm:[''],
      MiniTableNames:[''],
      MiniTableFields:[''],
      minitableEquation:[''],
      EquationOperationMini:[''],
      fontSizeValue:[20, [Validators.required, Validators.min(8), Validators.max(72)]],
      fontColorValue:['#ebeaea', ],
      FontTypeValue:['bold'],
      FontTypeLabel:['bold']


    


    });
  }
  
  validateAndSubmit() {
    if (this.createKPIWidget.invalid) {
      // ✅ Mark all fields as touched to trigger validation messages
      Object.values(this.createKPIWidget.controls).forEach(control => {
        if (control instanceof FormControl) {
          control.markAsTouched();
          control.updateValueAndValidity();
        } else if (control instanceof FormArray) {
          control.controls.forEach((group) => {
            (group as FormGroup).markAllAsTouched();
          });
        }
      });
  
      return; // 🚨 Stop execution if the form is invalid
    }
  
    // ✅ Proceed with saving only if form is valid
    this.addTile('tile');
    this.modal.dismiss();
  }


  validateAndUpdate() {
    if (this.createKPIWidget.invalid) {
      this.formValidationFailed = false; // 🔴 Show the error
  
      Object.values(this.createKPIWidget.controls).forEach(control => {
        if (control instanceof FormControl) {
          control.markAsTouched();
          control.updateValueAndValidity();
        } else if (control instanceof FormArray) {
          control.controls.forEach((group) => {
            (group as FormGroup).markAllAsTouched();
          });
        }
      });
  
      return; // 🚫 Stop if invalid
    }
  
    // ✅ If the form is valid
    this.formValidationFailed = true; // ✅ Hide the warning now
    this.updateTile('tile');
    this.modal.dismiss();
  }
  
  
  
  
  async dynamicData(receiveFormIds?: any) {
    console.log('receiveFormIds checlking from',receiveFormIds)
    try {
      const result: any = await this.api.GetMaster(this.SK_clientID + "#dynamic_form#lookup", 1);
      if (result) {
        console.log('forms checking', result);
        const helpherObj = JSON.parse(result.options);
        console.log('helpherObj checking', helpherObj);
  
        this.formList = helpherObj.map((item: [string]) => item[0]);
         this.allDeviceIds = this.formList.map((form: string) => ({ text: form, value: form }));
        console.log('allDeviceIds checking from',this.allDeviceIds)
  
        // ✅ Conditionally filter only if receiveFormIds has items
        if (Array.isArray(receiveFormIds) && receiveFormIds.length > 0) {
          const receivedSet = new Set(receiveFormIds);
          this.listofDeviceIds = this.allDeviceIds.filter((item: { value: any; }) => receivedSet.has(item.value));
        } else {
          console.log('i am checking forms from else cond',this.allDeviceIds)
          this.listofDeviceIds = this.allDeviceIds; // No filtering — use all

        }
  
        console.log('Final listofDeviceIds:', this.listofDeviceIds);
      }
    } catch (err) {
      console.log("Error fetching the dynamic form data", err);
    }
  }
  
  openWidgetAdvanceEquationHelp(stepperModal: TemplateRef<any>){
    this.modalService.open(stepperModal, {   backdrop: 'static',  // Disable closing on backdrop click
      keyboard: false    });

  }

  openEquationHelpTile(stepperModal: TemplateRef<any>){
    this.modalService.open(stepperModal, {   backdrop: 'static',  // Disable closing on backdrop click
      keyboard: false    });

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
  

  async dashboardIds(sk: any): Promise<string[]> {
    console.log("I am called Bro");
    
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
                this.dashboardIdsList = this.dashboardIdsList || [];
  
                // Check if P1 exists before pushing
                if (P1 !== undefined && P1 !== null) {
                  this.dashboardIdsList.push({ P1, P2, P3, P4, P5, P6, P7, P8, P9 });
                  console.log("Pushed to dashboardIdsList: ", { P1, P2, P3, P4, P5, P6, P7, P8, P9 });
                } else {
                  console.warn("Skipping element because P1 is not defined or null");
                }
              } else {
                break;
              }
            }
  
            // Store P1 values
            this.p1ValuesSummary = this.dashboardIdsList.map((item: { P1: any }) => item.P1);
            console.log('P1 values: dashboard', this.p1ValuesSummary);
  
            // Continue fetching recursively and wait for completion
            const nextBatch = await this.dashboardIds(sk + 1);
  
            // Merge new values with previous values
            this.p1ValuesSummary = [...this.p1ValuesSummary, ...nextBatch];
  
            // Remove duplicates if needed
            this.p1ValuesSummary = Array.from(new Set(this.p1ValuesSummary));
  
            return this.p1ValuesSummary; // Return the final collected values
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
        return this.p1ValuesSummary; // Return collected values when no more data is available
      }
    } catch (error) {
      console.error('Error:', error);
      return [];
    }
  }
  
  
  p1Values(arg0: string, p1Values: any) {
    throw new Error('Method not implemented.');
  }
  
  

  


  generateUniqueId(): number {
    this.widgetIdCounter++;
    return Date.now() + this.widgetIdCounter; // Use timestamp and counter for uniqueness
  }
  descriptionValue(description:any){
    console.log('description checking',description)

  }

  // addTile(key: any) {
  //   this.multipleCheck = this.createKPIWidget.value.filterParameter;
  //   console.log('this.multipleCheck checking', this.multipleCheck);
  
  //   if (key === 'tile') {
  //     const uniqueId = this.generateUniqueId();
  
  //     // Convert filterParameter array to a DynamoDB-compatible string
  //     // const formattedFilterParameter = this.multipleCheck
  //     //   .map((param: string) => `\${${param}}`) // Format each value as ${value}
  //     //   .join(''); // Join them into a single string without commas
  
  //     const newTile = {
  //       id: uniqueId,
  //       x: 0,
  //       y: 0,
  //       rows: 13, // The number of rows in the grid
  //       cols: 25, // The number of columns in the grid
  //       rowHeight: 100, // The height of each row in pixels
  //       colWidth: 100, // The width of each column in pixels
  //       fixedColWidth: true, // Enable fixed column widths
  //       fixedRowHeight: true,
  //       grid_type: 'tile',
  //       selectFromTime: this.createKPIWidget.value.selectFromTime,
  //       selectToTime: this.createKPIWidget.value.selectToTime,
  //       formlist: this.createKPIWidget.value.formlist,
  //       parameterName: this.createKPIWidget.value.parameterName,
  //       groupByFormat: this.createKPIWidget.value.groupByFormat,
  //       dashboardIds: this.createKPIWidget.value.dashboardIds,
  //       selectType: this.createKPIWidget.value.selectType,
  //       filterParameter: this.createKPIWidget.value.filterParameter, // Use the formatted string
  //       filterDescription: this.createKPIWidget.value.filterDescription,
  //       parameterNameRead: this.parameterNameRead,
  //       selectedRangeType: this.createKPIWidget.value.selectedRangeType,
  //       themeColor: this.createKPIWidget.value.themeColor,
  //       fontSize: `${this.createKPIWidget.value.fontSize}px`, // Added fontSize
  //       fontColor: this.createKPIWidget.value.fontColor, // Added fontColor
  //       formatType:this.createKPIWidget.value.formatType,
  //       multi_value: [
  //         {
  //           value: this.createKPIWidget.value.primaryValue, // Renamed key to 'value'
  //           constantValue: this.createKPIWidget.value.constantValue !== undefined &&
  //             this.createKPIWidget.value.constantValue !== null
  //             ? this.createKPIWidget.value.constantValue
  //             : 0,
  //           processed_value: this.createKPIWidget.value.processed_value || '',
  //         },
  //       ],
  //     };
  
  //     // Initialize this.dashboard if it hasn't been set yet
  //     if (!this.dashboard) {
  //       this.dashboard = [];
  //     }
  
  //     // Push the new tile to dashboard
  //     this.dashboard.push(newTile);
  
  //     console.log('this.dashboard after adding new tile', this.dashboard);
  
  //     this.grid_details = this.dashboard;
  //     console.log('this.grid_details checking',this.grid_details)
  //     this.dashboardChange.emit(this.grid_details);
  //     if (this.grid_details) {
  //       this.updateSummary('','add_tile');
  //       if(this.grid_details[0]){
  //         window.location.reload()
  //         this.cdr.detectChanges()
  //       }else {
      
  //       }
  //     }

  //     // Optionally reset the form if needed after adding the tile
  //     this.createKPIWidget.patchValue({
  //       widgetid: uniqueId,
  //     });
  //   }
  // }

  addTile(key: any) {
    this.multipleCheck = this.createKPIWidget.value.filterParameter;
    console.log('this.multipleCheck checking', this.multipleCheck);
  
    if (key === 'tile') {
      const uniqueId = this.generateUniqueId();
  
      const newTile = {
        id: uniqueId,
        x: 0,
        y: 0,
        rows: 13,
        cols: 25,
        rowHeight: 100,
        colWidth: 100,
        fixedColWidth: true,
        fixedRowHeight: true,
        grid_type: 'tile',

        formlist: this.createKPIWidget.value.formlist,
        parameterName: this.createKPIWidget.value.parameterName,
        groupByFormat: this.createKPIWidget.value.groupByFormat,
        dashboardIds: this.createKPIWidget.value.dashboardIds,
        selectType: this.createKPIWidget.value.selectType,
        filterParameter: this.createKPIWidget.value.filterParameter,
        filterDescription: this.createKPIWidget.value.filterDescription,
        parameterNameRead: this.parameterNameRead,
  
        themeColor: this.createKPIWidget.value.themeColor,
        fontSize: `${this.createKPIWidget.value.fontSize}px`,
        fontColor: this.createKPIWidget.value.fontColor || '#040101',
 
        custom_Label:this.createKPIWidget.value.custom_Label,
        // EquationFormList:this.createKPIWidget.value.EquationFormList,
        // EquationParam:this.createKPIWidget.value.EquationParam,
        // EquationOperation:this.createKPIWidget.value.EquationOperation,
        equation: this.createKPIWidget.value.all_fields || [], 
        EquationDesc:this.createKPIWidget.value.EquationDesc,
        columnVisibility:this.createKPIWidget.value.columnVisibility,

        rowData:this.createKPIWidget.value.rowData || '',
        ModuleNames:this.createKPIWidget.value.ModuleNames,
        selectFromTime: this.createKPIWidget.value.selectFromTime ||'',
        selectToTime: this.createKPIWidget.value.selectToTime ||'',
        formatType: this.createKPIWidget.value.formatType,
 
        noOfParams: this.noOfParams || 0,
        miniForm:this.createKPIWidget.value.miniForm || '',
        MiniTableNames:this.createKPIWidget.value.MiniTableNames ||'',
        MiniTableFields:this.createKPIWidget.value.MiniTableFields ,
        minitableEquation:this.createKPIWidget.value.minitableEquation,
        EquationOperationMini:this.createKPIWidget.value.EquationOperationMini,
        fontSizeValue:`${this.createKPIWidget.value.fontSizeValue}px`,
        fontColorValue:this.createKPIWidget.value.fontColorValue ||'#ebeaea',
        FontTypeValue:this.createKPIWidget.value.FontTypeValue ||'',
        FontTypeLabel:this.createKPIWidget.value.FontTypeLabel ||'',
   





        multi_value: [
          {
            value: this.createKPIWidget.value.primaryValue,
            constantValue: this.createKPIWidget.value.constantValue || 0,
            processed_value: this.createKPIWidget.value.processed_value || '',
          },
        ],
      };
  
      if (!this.dashboard) {
        this.dashboard = [];
      }
  
      this.dashboard.push(newTile);
  
      console.log('this.dashboard after adding new tile', this.dashboard);
  
      this.grid_details = this.dashboard; // Update grid_details dynamically
      console.log('this.grid_details checking', this.grid_details);
  
      this.dashboardChange.emit(this.grid_details); // Emit the updated dashboard to parent component or listeners
  
      if (this.grid_details) {
        this.updateSummary('', 'add_tile');
  
        // Use ChangeDetectorRef to update the view dynamically
        this.cdr.detectChanges(); // Ensure changes are reflected in the UI
      }
  
      // Optionally reset the form if needed after adding the tile
      this.createKPIWidget.patchValue({
        widgetid: uniqueId,
      });
    }
  }
  
  
  
  onFontColorChange(event: Event): void {
    const color = (event.target as HTMLInputElement).value;
    this.createKPIWidget.patchValue({ fontColor: color });
  }


  onFontColorChangeValue(event: Event){
    const color = (event.target as HTMLInputElement).value;
    this.createKPIWidget.patchValue({ fontColorValue: color });

  }
updateTile(key: any) {
  console.log('Key checking from update:', key);
  this.isGirdMoved = true;

  if (this.editTileIndex !== null && this.editTileIndex >= 0) {
    console.log('this.editTileIndex check:', this.editTileIndex);
    console.log('Tile checking for update:', this.dashboard[this.editTileIndex]);

    // Deep copy of the multi_value array for the current tile to ensure independence
    const multiValue = Array.isArray(this.dashboard[this.editTileIndex]?.multi_value)
                        ? JSON.parse(JSON.stringify(this.dashboard[this.editTileIndex]?.multi_value)) // Deep copy
                        : [];

    const primaryValue = this.createKPIWidget.value.primaryValue || multiValue[0]?.value || '';
    const constantValue = multiValue[0]?.constantValue || 0;
    const processedValue = this.createKPIWidget.value.processed_value || '';
    const updatedConstantValue = this.createKPIWidget.value.constantValue || constantValue;

    console.log('Extracted primaryValue:', primaryValue);
    console.log('Form Value for processed_value:', processedValue);
    console.log('Form Value for constantValue:', updatedConstantValue);

    // Check if the array has only one item or needs a new one
    if (multiValue.length === 1) {
      multiValue[0].processed_value = processedValue;
      multiValue[0].constantValue = updatedConstantValue;
      multiValue[0].value = primaryValue;
    } else {
      // If the array is empty, add the new values
      multiValue.push({
        processed_value: processedValue,
        constantValue: updatedConstantValue,
        value: primaryValue
      });
    }

    // Reassign the multi_value array to trigger Angular change detection
    this.dashboard[this.editTileIndex].multi_value = multiValue; // Assign directly as it's a new object now

    // Recalculate EquationDesc
    const updatedEquationDesc = this.generateEquationDesc(
      this.createKPIWidget.value.EquationOperation,
      this.createKPIWidget.value.EquationFormList,
      this.createKPIWidget.value.EquationParam
    );

    console.log('Updated EquationDesc:', updatedEquationDesc);

    const updatedTile = {
      ...this.dashboard[this.editTileIndex], // Only the tile being updated is modified
      formlist: this.createKPIWidget.value.formlist,
      parameterName: this.createKPIWidget.value.parameterName,
      primaryValue: primaryValue,
      groupByFormat: this.createKPIWidget.value.groupByFormat,
      constantValue: updatedConstantValue,
      processed_value: processedValue,
      multi_value: multiValue, // Ensure multi_value is updated correctly
      startDate: this.createKPIWidget.value.startDate || '',
      endDate: this.createKPIWidget.value.endDate || '',
      themeColor: this.createKPIWidget.value.themeColor,
      fontSize: `${this.createKPIWidget.value.fontSize}px`,
      fontColor: this.createKPIWidget.value.fontColor || '#040101',
      selectFromTime: this.createKPIWidget.value.selectFromTime || '',
      selectToTime: this.createKPIWidget.value.selectToTime || '',
      dashboardIds: this.createKPIWidget.value.dashboardIds || '',
      selectType: this.createKPIWidget.value.selectType || '',
      filterParameter: this.createKPIWidget.value.filterParameter,
      filterDescription: this.createKPIWidget.value.filterDescription,
      parameterNameRead: this.parameterNameRead,
      formatType: this.createKPIWidget.value.formatType,
      custom_Label: this.createKPIWidget.value.custom_Label,
      equation: this.createKPIWidget.value.all_fields || [],
      noOfParams: this.dashboard[this.editTileIndex].noOfParams,
      EquationDesc: this.createKPIWidget.value.EquationDesc, // Recalculated value
      miniForm: this.createKPIWidget.value.miniForm || '',
      MiniTableNames: this.createKPIWidget.value.MiniTableNames || '',
      MiniTableFields: this.createKPIWidget.value.MiniTableFields || '',
      minitableEquation: this.createKPIWidget.value.minitableEquation || '',
      EquationOperationMini: this.createKPIWidget.value.EquationOperationMini || '',
      ModuleNames: this.createKPIWidget.value.ModuleNames || '',
      columnVisibility: this.createKPIWidget.value.columnVisibility,
      fontSizeValue: `${this.createKPIWidget.value.fontSizeValue}px`,
      fontColorValue: this.createKPIWidget.value.fontColorValue || '#ebeaea',
      FontTypeValue: this.createKPIWidget.value.FontTypeValue || '',
      FontTypeLabel: this.createKPIWidget.value.FontTypeLabel || ''
    };

    console.log('Updated tile:', updatedTile);

    // Update only the modified tile, without affecting others
    this.dashboard = [
      ...this.dashboard.slice(0, this.editTileIndex),
      updatedTile,
      ...this.dashboard.slice(this.editTileIndex + 1),
    ];

    console.log('Updated dashboard:', this.dashboard);

    if (this.all_Packet_store?.grid_details) {
      this.all_Packet_store.grid_details[this.editTileIndex] = {
        ...this.all_Packet_store.grid_details[this.editTileIndex],
        ...updatedTile,
      };
    } else {
      console.error('grid_details is undefined or null in all_Packet_store.');
    }

    this.grid_details = this.dashboard;
    this.dashboardChange.emit(this.grid_details);

    if (this.grid_details) {
      this.updateSummary(this.all_Packet_store, 'update_tile');
    }

    this.editTileIndex = null;

    // Manually trigger change detection
    this.cdr.detectChanges();  // Ensure the view updates after the data change
  } else {
    console.error('Edit index is null or invalid. Unable to update the tile.');
  }
}

  
  

  generateEquationDesc(operation: string, formList: string, params: any[]): string {
    if (!operation || !formList || !params || params.length === 0) {
      return '';
    }
  
    const paramStrings = params.map(
      (param: any) => `\${${formList}.${param.text}.${param.value}}`
    );
    return `${operation}(${paramStrings.join(', ')})`;
  }
  
  
  


  // dynamicparameterValue(event: any): void {
  //   console.log('event check for dynamic param',event)
  //   console.log('event[0].text check',event[0].text)
  //   const filterParameter=this.createKPIWidget.get('filterParameter')
  //   console.log('filterParameter check',filterParameter)
  //   if (event && event[0] && event[0].text) {
  //   if(filterParameter){

  //     filterParameter.setValue(event[0].text)
  //     this.cdr.detectChanges();   
  //   }
  // }else{
  //   console.log('failed to set value')
  // }
   

  //   if (event && event[0].value) {
  //     // Format the value as ${field-key}
  //     const formattedValue = "${"+event[0].value+"}"; 
  //     console.log('formattedValue check',formattedValue) // You can customize the formatting as needed
  //     this.selectedParameterValue = formattedValue;

  
  //     console.log('Formatted Selected Item:', this.selectedParameterValue);
  //   } else {
  //     console.log('Event structure is different:', event);
  //   }

  // }
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
        const filterParameter = this.createKPIWidget.get('filterParameter');
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
        const filterParameter = this.createKPIWidget.get('filterParameter');
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
        const EquationParameter = this.createKPIWidget.get(equationParamControlName);

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
    const EquationParameter = this.createKPIWidget.get(equationParamControlName);
    
    if (EquationParameter) {
        EquationParameter.setValue([]); // Reset to an empty array
    }
    this.selectedEquationParameterValue[fieldIndex] = [];
}

  
  
  
  
onAdd(): void {
  // Get existing text from filterDescription
  let existingText = this.createKPIWidget.get('filterDescription')?.value?.trim() || '';
  const getFormFelds = this.createKPIWidget.get('filterParameter')?.value;
  console.log('getFormFelds checking', getFormFelds);

  // Capture the selected parameters
  const selectedParameters = this.selectedParameterValue;
  console.log('selectedParameters checking', selectedParameters);

  let newEquationParts: string[] = [];

  if (Array.isArray(selectedParameters)) {
    // Format the selected parameters and filter out already existing ones
    newEquationParts = selectedParameters
      .map(param => `${param.text}-\${${param.value}}`)
      .filter(paramString => !existingText.includes(paramString));
  } else if (selectedParameters) {
    let paramString = `${selectedParameters.text}-\${${selectedParameters.value}}`;
    if (!existingText.includes(paramString)) {
      newEquationParts.push(paramString);
    }
  } else {
    console.warn('No parameters selected or invalid format:', selectedParameters);
    return; // No update needed
  }

  if (newEquationParts.length === 0) {
    console.log('No new unique parameters to add.');
    return; // Nothing new to add
  }

  // Trim and remove extra spaces from the existing text
  existingText = existingText.replace(/\s+/g, ' ').trim();
  console.log('existingText before', existingText);
  console.log('Filtered newEquationParts:', newEquationParts);

  // Construct the new equation string
  const newEquation = newEquationParts.join(' && ');

  // Append new equation to existing text properly
  existingText = existingText ? `${existingText} && ${newEquation}` : newEquation;

  // Ensure we don't have redundant `&&`
  existingText = existingText.replace(/&&\s*&&/g, '&&').trim();

  console.log('Updated Equation:', existingText);

  // Update the form control with the corrected equation
  this.createKPIWidget.patchValue({
    filterDescription: existingText,
  });

  // Ensure UI updates properly
  this.cdr.detectChanges();
}




  
  updateFormName(selectedTexteqa: string, idx: number): void {
    console.log(`Updating formName for index ${idx} with:`, selectedTexteqa);
    this.formName[idx] = selectedTexteqa;  // Update the component level formName variable
    console.log('this.formName',this.formName)
    // this.indexwiseOperationValue[idx] = this.operationValue
   
    
    // Additional logic if you need to do something with this new form name
}
addEquation(): void {


  const allFieldsArray = this.createKPIWidget.get('all_fields') as FormArray;
console.log("allFieldsArray from tile1",allFieldsArray.value)
  // Ensure `this.operationValue` is an array before using push
  // if (!Array.isArray(this.operationValue)) {
  //   this.operationValue = [];
  // } else {
  //   this.operationValue.length = 0; // Reset array to avoid accumulation of old values
  // }
 const equationTextArea = allFieldsArray.value.map((packet: any, index: number) => {
    if(!Array.isArray(packet.EquationParam)){
      packet.EquationParam = [packet.EquationParam]
    }
      // Initialize a string to collect all parameter texts
      let tempText = packet.EquationParam.map((param:any) => `${packet.EquationFormList}.${param.text}.${param.value}`).join(',');

      // Return the formatted string for this group of parameters
      return `${packet.EquationOperation}(\${${tempText}})`;
  })
  .join(', ');

  console.log('equationTextArea checking from Tile1',equationTextArea)
  // Loop through each group in the form array
  // allFieldsArray.controls.forEach((control, index) => {
  //   // Safely cast the AbstractControl to FormGroup
  //   const group = control as FormGroup;

  //   // Push operation value for the current group
  //   this.operationValue.push(group.get('EquationOperation')?.value || '');
  //   console.log(`Operation Value for index ${index}:`, this.operationValue);
  // });

// console.log('this.operationValue', this.operationValue)
//   let selectedParameters = this.selectedEquationParameterValue || [];
//   selectedParameters = selectedParameters.length > 0 ? selectedParameters.filter((param: any) => param != null) : [];
//   console.log('Selected Parameters:', selectedParameters);

//   if (selectedParameters.length > 0) {
//     const formattedParameters = selectedParameters
//         .map((params: any[], index: number) => {
//           if(!Array.isArray(params)){
//             params = [params]
//           }
//             // Initialize a string to collect all parameter texts
//             let tempText = params.map(param => `${this.formName[index]}.${param.text}.${param.value}`).join(',');

//             // Return the formatted string for this group of parameters
//             return `${this.operationValue[index]}(\${${tempText}})`;
//         })
//         .join(', ');

//         console.log('formattedParameters',formattedParameters)

//     // const formattedEquation = `${this.operationValue}(${formattedParameters})`;
//     // console.log('Formatted Equation:', formattedEquation);

//     this.createKPIWidget.patchValue({
//         EquationDesc: formattedParameters,
//     });
// }
//  else {
//       console.warn('No parameters selected or invalid format:', selectedParameters);
//       // this.createKPIWidget.patchValue({
//       //     EquationDesc: '',
//       // });
//   }
//   // Check if formName is set
//   if (!this.formName) {
//       console.error('Form name is not set. Cannot create equation.');
//       return;
//   }
  this.createKPIWidget.patchValue({
    EquationDesc: "("+equationTextArea+")",
});

  console.log('this.formName checking', this.formName);



  // Manually trigger change detection
  this.cdr.detectChanges();
}

  
  
  
  
  
  
  
  selectedSettingsTab(tab: string) {
    this.selectedTabset = tab;
  }


//   duplicateTile(tile: any, index: number): void {
//     // Clone the tile with its properties
//     const clonedTile = {
//       ...tile, // Copy all existing properties from the original tile
//       id: new Date().getTime(), // Generate a unique ID
//       parameterName: `${tile.parameterName}`, // Copy the parameterName as is (no "Copy" appended)
//       multi_value: tile.multi_value.map((value: any) => ({ ...value })) // Deep copy of multi_value
//     };
// // alert('cloned tile')
//     // Ensure all fields are properly copied
//     clonedTile.x = tile.x;
//     clonedTile.y = tile.y;
//     clonedTile.rows = tile.rows;
//     clonedTile.cols = tile.cols;
//     clonedTile.rowHeight = tile.rowHeight;
//     clonedTile.colWidth = tile.colWidth;
//     clonedTile.fixedColWidth = tile.fixedColWidth;
//     clonedTile.fixedRowHeight = tile.fixedRowHeight;
//     clonedTile.grid_type = tile.grid_type;
//     clonedTile.formlist = tile.formlist;
//     // clonedTile.groupBy = tile.groupBy;
//     clonedTile.groupByFormat = tile.groupByFormat;
//     // clonedTile.predefinedSelectRange = tile.predefinedSelectRange;

//     clonedTile.themeColor = tile.themeColor;

//     // Add the cloned tile to the dashboard at the correct position
//     this.dashboard.splice(index + 1, 0, clonedTile);

//     // Log the updated dashboard for debugging
//     console.log('this.dashboard after duplicating a tile:', this.dashboard);
//     this.grid_details = this.dashboard;

    
//     this.dashboardChange.emit(this.grid_details);

//     if(this.grid_details)
      
//       {
//         // alert('grid details is there')
//         this.updateSummary('','add_tile')
//       }

//     // Trigger change detection to ensure the UI updates
//     this.cdr.detectChanges();

//     // Update summary to handle the addition of the duplicated tile

//   }
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
  { color: "linear-gradient(to right, #A1045A, #A1045A)", selected: true },
  { color: "linear-gradient(to right, #563C5C, #563C5C)", selected: false },
  { color: "linear-gradient(to right, #655967, #655967)", selected: false },
  {color:"linear-gradient(45deg, #FC466B 0%, #3F5EFB 100%)",selected:false},
  {color:"linear-gradient(45deg, #833ab4 0%, #fd1d1d 100%)",selected:false},
  {color:"linear-gradient(45deg, #16BFFD 0%, #CB3066 100%)",selected:false},
  {color:"linear-gradient(45deg, #48c6ef 0%, #6f86d6 100%)",selected:false},
  {color:"linear-gradient(45deg, #ff758c 0%, #ff7eb3 100%)",selected:false},
  {color:"linear-gradient(45deg, #a80077 0%, #66ff00 100%)",selected:false},
  {color:"linear-gradient(45deg, #6441a5 0%, #2a0845 100%)",selected:false},
  {color:"linear-gradient(45deg, #fc5c7d 0%, #6a82fb 100%)",selected:false},
  {color:"linear-gradient(45deg, #ff9a9e 0%, #fecfef 99%, #fecfef 100%)",selected:false},
  {color:"linear-gradient(45deg, #2C3E50 0%, #FD746C 100%)",selected:false},
  {color:"linear-gradient(45deg, #abbaab 0%, #ffffff 100%)",selected:false},
  { color: "linear-gradient(45deg, #283c86 0%, #45a247 100%)", selected: false }, // Deep Sea
  { color: "linear-gradient(45deg, #16222a 0%, #3a6073 100%)", selected: false }, // Dark Ocean
  { color: "linear-gradient(45deg, #3D3393 0%, #2D2560 100%)", selected: false }, // Royal Blue
  { color: "linear-gradient(45deg, #000000 0%, #0d324d 100%)", selected: false }, // Midnight Black
  { color: "linear-gradient(45deg, #0575E6 0%, #021B79 100%)", selected: false }, // Deep Blue
  { color: "linear-gradient(45deg, #2C5364 0%, #203A43 100%)", selected: false }, // Emerald Green
  { color: "linear-gradient(45deg, #833ab4 0%, #fd1d1d 100%)", selected: false }, // Purple Red
  { color: "linear-gradient(45deg, #000000 0%, #434343 100%)", selected: false }, // Dark Grey
  { color: "linear-gradient(45deg, #004e92 0%, #000000 100%)", selected: false },
  { color: "linear-gradient(43deg, #4158D0 0%, #C850C0 46%, #FFCC70 100%)", selected: false }, // Blue Purple Yellow
  { color: "linear-gradient(132deg, #F4D03F 0%, #16A085 100%)", selected: false }, // Golden Green
  { color: "linear-gradient(0deg, #08AEEA 0%, #2AF598 100%)", selected: false }, // Ocean Green
  { color: "linear-gradient(147deg, #FFE53B 0%, #FF2525 74%)", selected: false }, // Sunset Red
  { color: "linear-gradient(180deg, #52ACFF 25%, #FFE32C 100%)", selected: false }, // Sky Blue Yellow
  { color: "linear-gradient(45deg, #EE7752 0%, #E73C7E 100%)", selected: false }, // Sunset Orange
  { color: "linear-gradient(45deg, #FFA7A7 0%, #FFD4A2 100%)", selected: false }, // Peachy Pink
  { color: "linear-gradient(45deg, #fc00ff 0%, #00dbde 100%)", selected: false }, // Electric Purple
  { color: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", selected: false }, // Twilight Purple
  { color: "linear-gradient(45deg, #d4145a 0%, #fbb03b 100%)", selected: false }, // Cherry Peach
  { color: "linear-gradient(45deg, #ff9a9e 0%, #fad0c4 99%, #fad0c4 100%)", selected: false }, // Cotton Candy
  { color: "linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%)", selected: false }, // Blue Sky
  { color: "linear-gradient(120deg, #fdfbfb 0%, #ebedee 100%)", selected: false }, // Ice White
  { color: "linear-gradient(120deg, #e0c3fc 0%, #8ec5fc 100%)", selected: false }, // Lavender Blue
  { color: "linear-gradient(120deg, #f6d365 0%, #fda085 100%)", selected: false }, // Peachy Yellow
  { color: "linear-gradient(120deg, #89f7fe 0%, #66a6ff 100%)", selected: false }, // Azure Blue
  { color: "linear-gradient(120deg, #abecd6 0%, #fbed96 100%)", selected: false }, // Pastel Green Yellow
  { color: "linear-gradient(120deg, #f6d365 0%, #fda085 100%)", selected: false }, // Sunrise Yellow
  { color: "linear-gradient(120deg, #fccb90 0%, #d57eeb 100%)", selected: false }, // Apricot Purple
  { color: "linear-gradient(120deg, #f093fb 0%, #f5576c 100%)", selected: false }, 
  { color: "transparent", selected: false }, // Transparent
  { color: "linear-gradient(315deg, #990000 0%, #ff0000 74%)", selected: false }, // Red
  { color: "linear-gradient(315deg, #378b29 0%, #74d680 74%)", selected: false }, // Green
  { color: "linear-gradient(316deg, #3e187a 0%, #994ecc 74%)", selected: false }, // Purple
  { color: "linear-gradient(315deg, #f9ff60 0%, #e0c300 74%)", selected: false }, // Yellow
  { color: "linear-gradient(315deg, #182b3a 0%, #20a4f3 74%)", selected: false },
  { color: "linear-gradient(315deg, #ff8000 0%, #ffcc00 74%)", selected: false }, // Orange
  { color: "linear-gradient(315deg, #550022 0%, #aa0044 74%)", selected: false }, // Magenta
  { color: "linear-gradient(315deg, #0073e6 0%, #00d8e6 74%)", selected: false }, // Cyan
  { color: "linear-gradient(315deg, #660066 0%, #cc00cc 74%)", selected: false }, // Violet
  { color: "linear-gradient(315deg, #cc0033 0%, #ff0066 74%)", selected: false }, // Pink
  { color: "linear-gradient(315deg, #663300 0%, #996633 74%)", selected: false }, // Brown
  { color: "linear-gradient(315deg, #006600 0%, #00cc00 74%)", selected: false }, // Lime
  { color: "linear-gradient(315deg, #003366 0%, #0066cc 74%)", selected: false }, // Indigo
  { color: "linear-gradient(315deg, #666600 0%, #cccc00 74%)", selected: false }, // Olive
  { color: "linear-gradient(315deg, #660000 0%, #cc0000 74%)", selected: false }, // Maroon
  { color: "linear-gradient(315deg, #ff0080 0%, #ff80bf 74%)", selected: false }, // Fuchsia
  { color: "linear-gradient(315deg, #004080 0%, #007acc 74%)", selected: false }, // Sapphire
  { color: "linear-gradient(315deg, #800040 0%, #cc0073 74%)", selected: false }, // Ruby
  { color: "linear-gradient(315deg, #ffcc99 0%, #ff9966 74%)", selected: false }, // Apricot
  { color: "linear-gradient(315deg, #00cc99 0%, #33ffcc 74%)", selected: false }, // Turquoise
  { color: "linear-gradient(315deg, #ff6600 0%, #ff9933 74%)", selected: false }, // Tangerine
  { color: "linear-gradient(315deg, #333300 0%, #666600 74%)", selected: false }, // Olive Green
  { color: "linear-gradient(315deg, #800000 0%, #cc3333 74%)", selected: false }, // Brick Red
  { color: "linear-gradient(315deg, #330033 0%, #660066 74%)", selected: false }, // Plum
  { color: "linear-gradient(315deg, #006666 0%, #00cccc 74%)", selected: false }, // Teal
                
                     
                    
                  
                
                    
                 
                   
         
                 


  // { color: "linear-gradient(to right, #707070, #707070)", selected: false },



  


  




  


  
  


  
  

  
];


openKPIModal(tile: any, index: number) {
  console.log('Index checking:', index); // Log the index
  if (tile) {
    this.selectedTile = tile;
    this.editTileIndex = index !== undefined ? index : null;
    console.log('Tile object from readback:', tile);
    this.themes.forEach((theme) => theme.selected = false);

    // Find the theme that matches the tile's themeColor
    const matchingTheme = this.themes.find((theme) => theme.color === tile.themeColor);

    if (matchingTheme) {
      matchingTheme.selected = true;
      console.log('Matching theme found and selected:', matchingTheme);
    }

    // Force change detection to update the UI
    this.cd.detectChanges();


    // Parse multi_value if it is a string
    let parsedMultiValue = [];
    if (typeof tile.multi_value === 'string') {
      try {
        parsedMultiValue = JSON.parse(tile.multi_value);
      } catch (error) {
        console.error('Error parsing multi_value:', error);
      }
    } else {
      parsedMultiValue = tile.multi_value;
    }

    // Parse EquationParam if it is a string
    let parsedEquationParam = [];
    if (typeof tile.EquationParam === 'string') {
      try {
        parsedEquationParam = JSON.parse(tile.EquationParam);
      } catch (error) {
        console.error('Error parsing EquationParam:', error);
      }
    } else if (Array.isArray(tile.EquationParam)) {
      parsedEquationParam = tile.EquationParam;
    }

    // Parse filterParameter if it is a string
    let parsedFilterParam = [];
    if (typeof tile.filterParameter === 'string') {
      try {
        parsedFilterParam = JSON.parse(tile.filterParameter);
      } catch (error) {
        console.error('Error parsing filterParameter:', error);
      }
    } else if (Array.isArray(tile.filterParameter)) {
      parsedFilterParam = tile.filterParameter;
    }

    // Parse columnVisibility if it is a string
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
    this.paramCount = tile.noOfParams;

    console.log('Parsed columnVisibility:', parsedColumnVisibility);
    this.isEditMode = true; // Set to edit mode
    // Populate the form control and selected parameters
    this.createKPIWidget.patchValue({
      add_fields: this.paramCount,
      formlist: tile.formlist,
      parameterName: tile.parameterName,
      primaryValue: parsedMultiValue.length > 0 ? parsedMultiValue[0]?.value || '' : '',
      groupByFormat: tile.groupByFormat,
      constantValue: parsedMultiValue[0]?.constantValue !== undefined ? parsedMultiValue[0].constantValue : 0,
      processed_value: parsedMultiValue[0]?.processed_value !== undefined ? parsedMultiValue[0].processed_value : 0,
      selectedRangeCalendarTimeRight: tile.selectedRangeCalendarTimeRight,

      themeColor: tile.themeColor,
      fontSize: tile.fontSize ? parseInt(tile.fontSize.replace('px', ''), 10) : 14,
      fontColor: tile.fontColor,
      selectFromTime: tile.selectFromTime,
      selectToTime: tile.selectToTime,
      dashboardIds: tile.dashboardIds,
      selectType: tile.selectType,
      ModuleNames:tile.ModuleNames,
      columnVisibility: parsedColumnVisibility,
      filterParameter: parsedFilterParam,
      filterDescription: tile.filterDescription,
      custom_Label: tile.custom_Label,
      formatType: tile.formatType,
      EquationFormList: tile.EquationFormList,
      EquationParam: parsedEquationParam, // Set parsed EquationParam
      EquationOperation: tile.EquationOperation,
      EquationDesc: tile.EquationDesc,
   
      miniForm:tile.miniForm || '',
      MiniTableNames:tile.MiniTableNames ||'',
      MiniTableFields:parsedMiniTableFields ,
      minitableEquation:tile.minitableEquation,
      EquationOperationMini:tile.EquationOperationMini, // Set parsed columnVisibility

      fontSizeValue:tile.fontSizeValue ? parseInt(tile.fontSizeValue.replace('px', ''), 10) : 14,
      fontColorValue:tile.fontColorValue,
      FontTypeValue:tile.FontTypeValue,
      FontTypeLabel:tile.FontTypeLabel,
   
      all_fields: this.repopulate_fields(tile),
    });

    // Set selected parameters
    this.selectedEquationParameterValue = parsedEquationParam;

  
  } else {
    this.selectedTile = null; // No tile selected for adding
    this.isEditMode = false; // Set to add mode
    this.createKPIWidget.reset(); // Reset the form for new entry
  }

  // Clear the 'selected' state for all themes
  this.themes.forEach((theme) => {
    theme.selected = false; // Deselect all themes
  });

  // Find the theme that matches the tile's themeColor
  const matchingTheme = this.themes.find((theme) => theme.color === tile?.themeColor);

  // If a matching theme is found, set it as selected
  if (matchingTheme) {
    matchingTheme.selected = true;
    console.log('Matching theme found and selected:', matchingTheme);
  }
}

repopulate_fields(getValues: any): FormArray {
  if (!getValues || getValues === null) {
    console.warn('No data to repopulate');
    return this.all_fields;
  }

  // Clear existing fields in the FormArray
  this.all_fields.clear();

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
      this.all_fields.push(
        this.fb.group({
          EquationFormList: this.fb.control(EquationFormListValue), // String handling
          EquationOperation: this.fb.control(EquationOperationValue), // String handling
          EquationParam: this.fb.control(filterParameter1Value), // Array handling
        })
      );

      // Log the added FormGroup for debugging
      console.log(`FormGroup at index ${index}:`, this.all_fields.at(index).value);
    });
  } else {
    console.warn('No parsed data to populate fields');
  }

  console.log('Final FormArray Values:', this.all_fields.value);

  return this.all_fields;
}

  openWidgetFilterHelp(stepperModal: TemplateRef<any>){
    this.modalService.open(stepperModal, {   backdrop: 'static',  // Disable closing on backdrop click
      keyboard: false    });

  }


  openFontStyleModal(stepperModal: TemplateRef<any>){
    this.modalService.open(stepperModal, {   backdrop: 'static',  // Disable closing on backdrop click
      keyboard: false    });

  }



getFormControlValue(selectedTextConfi:any): void {
  // const formlistControl = this.createChart.get('formlist');
  console.log('Formlist Control Value:', selectedTextConfi);
  this.fetchDynamicFormDataConfig(selectedTextConfi);
}

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






  fetchDynamicFormDataConfig(value: any) {
    console.log("Data from lookup:", value);
  
    this.api
      .GetMaster(`${this.SK_clientID}#dynamic_form#${value}#main`, 1)
      .then((result: any) => {
        if (result && result.metadata) {
          const parsedMetadata = JSON.parse(result.metadata);
          console.log('parsedMetadata check dynamic', parsedMetadata);
          const formFields = parsedMetadata.formFields;
          console.log('formFields check from tile1', formFields);
  
          // Initialize the list with formFields labels, filtering out "heading" type and "Empty Placeholder"
          this.columnVisisbilityFields = formFields
            .filter((field: any) => {
              // Filter out fields with type "heading" or with an empty placeholder
              return field.type !== "heading" && field.type !== 'Empty Placeholder' && field.type !=='button' && field.type !=='table' && field.type !=='radio' && field.type !== 'checkbox' && field.type !== 'html code' && field.type !=='file' && field.type !=='range' && field.type !=='color' && field.type !=='password' && field.type !=='sub heading';
            })
            .map((field: any) => {
              console.log('field check', field);
              return {
                value: field.name,
                text: field.label
              };
            });

  
          // Include created_time and updated_time if available
          if (parsedMetadata.created_time) {
            this.columnVisisbilityFields.push({
              value: 'created_time',
              text: 'Created Time' // You can customize the label here if needed
            });
          }
  
          if (parsedMetadata.updated_time) {
            this.columnVisisbilityFields.push({
              value: 'updated_time',
              text: 'Updated Time' // You can customize the label here if needed
            });
          }
          if (parsedMetadata.updated_time) {
            this.columnVisisbilityFields.push({
              value: `dynamic_table_values`,
              text: 'Dynamic Table Values' // You can customize the label here if needed
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
          const formFields = parsedMetadata.formFields;
          console.log('formFields check',formFields)

          // Initialize the list with formFields labels
          // this.listofDynamicParam = formFields.map((field: any) => {
          //   console.log('field check',field)
          //   return {
          //     value: field.name,
          //     text: field.label
          //   };
          // });

          this.listofDynamicParam = formFields
          .filter((field: any) => {
            // Filter out fields with type "heading" or with an empty placeholder
            return field.type !== "heading" && field.type !== 'Empty Placeholder' && field.type !=='button' && field.type !=='table' && field.type !=='radio' && field.type !== 'checkbox'  && field.type !== 'html code' && field.type !=='file' && field.type !=='range' && field.type !=='color' && field.type !=='password' && field.type !=='sub heading';
          })
          .map((field: any) => {
            console.log('field check', field);
            return {
              value: field.name,
              text: field.label
            };
          });


          // Include created_time and updated_time
          if (parsedMetadata.created_time) {
            this.listofDynamicParam.push({
              value: 'created_time',
              text: 'Created Time' // You can customize the label here if needed
            });
          }

          if (parsedMetadata.updated_time) {
            this.listofDynamicParam.push({
              value: 'updated_time',
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

  
  


  parameterValue(event:any){
    console.log('event for parameter check',event)
    this.parameterNameRead = event[0].text

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

  formName: any[] = []; // Add a property to store the form name

// TypeScript method enhanced for better reliability and handling of various event structures
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

    { value: 'Constant', text: 'Constant' },
   
    { value: 'Count', text: 'Count' },

    { value: 'Equation', text: 'Equation' },

    { value: 'sumArray', text: 'SumArray' },
    { value: 'Advance Equation', text: 'Advance Equation' },
    { value: 'sum_difference', text: 'Sum Difference' },

    { value: 'distance_sum', text: 'Distance Sum' },
    // {value:'Avg_Utilization_wise_multiple',text:'Avg_Utilization_wise_multiple'}

  ]


  FormatTypeValues = [
    { value: 'Default', text: 'Default' },
    { value: 'Rupee', text: 'Rupee' },
    { value: 'Distance', text: 'Distance' },
    { value: 'Minutes', text: 'Minutes' },
    { value: 'Hours', text: 'Hours' },
    { value: 'Days', text: 'Days' },
    { value: 'Days & Hours', text: 'Days & Hours' },
 
  
    { value: 'Months', text: 'Months' },
    { value: 'Years', text: 'Years' },
    {value:'Label With Value',text:'Label With Value'},
    { value: 'Percentage', text: 'Percentage' },

]




FontTypeSummary =[
    { value: 'italic', text: 'Italic' },
    { value: 'underline', text: 'underline' },
    { value: 'bold', text: 'Bold' },

    // { value: 'drill down', text: 'drill down' },
  ]
  onValueChange(selectedValue: any): void {
    // Handle any logic here if needed when the value changes
    console.log('selectedValue check',selectedValue); // Optional: log the selected value
  }
  selectedOperation(selectedOperation: any): void {
    if (selectedOperation && selectedOperation[0]) {
      this.operationValue = selectedOperation[0].value;
      console.log('this.operationValue:', this.operationValue);
  
      // Synchronize with the form control
      this.createKPIWidget.patchValue({
        EquationOperation: this.operationValue,
      });
    } else {
      console.warn('Invalid operation selected:', selectedOperation);
    }
  }
  
  get primaryValue() {
    return this.createKPIWidget.get('primaryValue');
  }
  closeModal(modal: any) {
    if (modal) {
      modal.close(); // Close the modal
    } else {
      console.error('Modal reference is undefined');
    }
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
// get datePickerControl(){
//   return this.createKPIWidget?.get('predefinedSelectRange') as FormControl
// }
  // datesUpdatedRange($event: any): void {
  //   const selectedRange = Object.entries(this.ranges).find(([label, dates]) => {
  //     const [startDate, endDate] = dates as [moment.Moment, moment.Moment];
  //     return (
  //       startDate.isSame($event.startDate, 'day') &&
  //       endDate.isSame($event.endDate, 'day')
  //     );
  //   });
  
  //   console.log('Selected Range Check:', selectedRange);
  
  //   if (selectedRange) {
  //     const control = this.createKPIWidget.get('predefinedSelectRange');
  //     if (control) {
  //       control.setValue(selectedRange[1]); // Update the form control value with the range label
  //     }
  //   }
  //   if (selectedRange) {
  //     const control = this.createKPIWidget.get('selectedRangeType');
  //     if (control) {
  //       control.setValue(selectedRange[0]); // Update the form control value with the range label
  //     }
  //   }
  // }
  
  


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
  onColorChange1(event: Event) {
    const colorInput = event.target as HTMLInputElement;
    this.createKPIWidget.get('themeColor')?.setValue(colorInput.value)

    console.log('Color changed:', this.createKPIWidget.get('themeColor')?.value);
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
  get all_fields(): FormArray {
    return this.createKPIWidget.get('all_fields') as FormArray;
  }
  

  addControls(event: any, _type: string) {
    console.log('event check', event);
  
    let noOfParams: any = '';
  
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
        noOfParams = JSON.parse(inputValue);
        if (typeof noOfParams !== 'number') {
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
      noOfParams = event;
    }
  
    console.log('noOfParams check', noOfParams);
  
    // Update all_fields based on noOfParams
    if (this.createKPIWidget.value.all_fields.length < noOfParams) {
      for (let i = this.all_fields.length; i < noOfParams; i++) {
        this.all_fields.push(
          this.fb.group({
            EquationFormList: [''],
            EquationParam: [[]],
            EquationOperation: [''],
          })
        );
        console.log('this.all_fields check', this.all_fields);
      }
    } else {
      if (noOfParams !== "" && noOfParams !== undefined && noOfParams !== null) {
        for (let i = this.all_fields.length - 1; i >= noOfParams; i--) {
          this.all_fields.removeAt(i);
        }
      }
    }
  
    // Update noOfParams for use in addTile
    this.noOfParams = noOfParams;
  }
  
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
    const miniTableFieldsValue = this.createKPIWidget.get('MiniTableFields')?.value;
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
        this.createKPIWidget.controls['minitableEquation'].setValue("("+equation+")");
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


]
  

showModuleNames = [
  // { value: 'None', text: 'None' },
  { value: 'Forms', text: 'Forms' },
  { value: 'Dashboard', text: 'Dashboard' },
  // { value: 'Dashboard - Group', text: 'Dashboard - Group' },
  { value: 'Summary Dashboard', text: 'Summary Dashboard' },
  { value: 'Projects', text: 'Projects' },
  // { value: 'Project - Detail', text: 'Project - Detail' },
  // { value: 'Project - Group', text: 'Project - Group' },
  {value: 'Report Studio', text: 'Report Studio'},
  {value:'Calender', text:'Calender'}

]

async moduleSelection(event: any): Promise<void> {
  const selectedValue = event[0].value;

  // 🔁 Update flag for conditional UI logic (if still needed)
  this.isSummaryDashboardSelected = selectedValue === 'Summary Dashboard';

  // 🔁 Filter dropdown options based on selection
  if (selectedValue === 'Summary Dashboard') {
    // Show all options
    this.filteredSelectTypeSummary = [...this.SelectTypeSummary];
  } else {
    // Hide only the "Modal" option
    this.filteredSelectTypeSummary = this.SelectTypeSummary.filter(
      item => item.value !== 'Modal' && item.value !== 'drill down'
    );
  
    // Clear "Modal" if it was previously selected
    const currentType = this.createKPIWidget.get('selectType')?.value;
    if (currentType === 'Modal') {
      // this.createTitle.get('selectType')?.setValue('');
    }
  }
  
  

  console.log('selectedValue checking', selectedValue);

  switch (selectedValue) {
    case 'None':
      console.log('No module selected');
      break;

    case 'Forms':
      console.log('Forms module selected');
      this.FormNames = this.listofDeviceIds;
      this.dynamicIDArray = [...this.FormNames];
      break;

    case 'Dashboard':
      console.log('Dashboard module selected');
      this.IdsFetch = await this.dashboardIdsFetching(1);
      this.dynamicIDArray = [...this.IdsFetch];
      break;

    case 'Summary Dashboard':
      console.log('Summary Dashboard module selected');
      this.summaryIds = await this.dashboardIds(1);
      console.log('Fetched P1 values:', this.summaryIds);
      this.dynamicIDArray = [...this.summaryIds];
      break;

    case 'Projects':
      console.log('Projects module selected');
      const projectList = await this.fetchDynamicLookupData(1);
      console.log('projectList checking', projectList);
      this.dynamicIDArray = [...projectList];
      break;

    case 'Report Studio':
      console.log('Report Studio module selected');
      const ReportStudioLookup = await this.reportStudioLookupData(1);
      this.dynamicIDArray = [...ReportStudioLookup];
      break;

    case 'Calender':
      console.log('Calender module selected');
      const CalenderLookup = await this.fetchCalender();
      console.log('CalenderLookup check', CalenderLookup);
      this.dynamicIDArray = [...CalenderLookup];
      break;

    default:
      console.log('Invalid selection');
      break;
  }
}

async fetchCalender(): Promise<string[]> {
  try {
    const result: any = await this.api.GetMaster(this.SK_clientID + "#systemCalendarQuery#lookup", 1);

    if (result) {
      this.helpherObjCalender = JSON.parse(result.options);
      console.log('this.helpherObjCalender check', this.helpherObjCalender);

      this.formList = this.helpherObjCalender.map((item: any) => item);
      console.log("DYNAMIC FORMLIST:", this.formList);

      // Extract the first element (0th index) from each record in formList
      this.formListTitles = this.formList.map((item: any[]) => item[0]);
      console.log("Extracted Titles:", this.formListTitles);

      return this.formListTitles; // ✅ Return extracted titles
    }

    return []; // Return empty array if no result
  } catch (error) {
    console.error("Error:", error);
    return []; // Return empty array in case of error
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

  const selectedModule = this.createKPIWidget.get('ModuleNames')?.value

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


// openPrimaryValueInfoModal(modalChart:any){
//   console.log('event checking',event)
//   this.modalService.open(modalChart, {  modalDialogClass:'p-20',  centered: true ,  fullscreen: true,   backdrop: 'static',  // Disable closing on backdrop click
//     keyboard: false  });

// }

  
openPrimaryValueInfoModal(stepperModal: TemplateRef<any>) {
    this.modalService.open(stepperModal, {   backdrop: 'static',  // Disable closing on backdrop click
      keyboard: false    });

  }

  openRedirectionTypeInfoModal(stepperModal: TemplateRef<any>){
    this.modalService.open(stepperModal, {   backdrop: 'static',  // Disable closing on backdrop click
      keyboard: false    });

  }

  openFormatTypeModal(stepperModal: TemplateRef<any>){
    this.modalService.open(stepperModal, {   backdrop: 'static',  // Disable closing on backdrop click
      keyboard: false    });

  }



  async fetchUserPermissions(sk: any) {
    try {
        this.userdetails = this.getLoggedUser.username;
        this.userClient = `${this.userdetails}#user#main`;
        console.log("this.tempClient from form service check", this.userClient);

        // Fetch user permissions
        const permission = await this.api.GetMaster(this.userClient, sk);
        
        if (!permission) {
            console.warn("No permission data received.");
            return null; // Fix: Returning null instead of undefined
        }

        console.log("Data checking from add form", permission);

        // Parse metadata
        const metadataString: string | null | undefined = permission.metadata;
        if (typeof metadataString !== "string") {
            console.error("Invalid metadata format:", metadataString);
            return null; // Fix: Ensuring the function returns a value
        }
        console.log('metadataString checking for',metadataString)

        try {
            this.permissionsMetaData = JSON.parse(metadataString);
            console.log("Parsed Metadata Object from location", this.permissionsMetaData);

            const permissionId = this.permissionsMetaData.permission_ID;
            console.log("permission Id check from Tile1", permissionId);
            this.permissionIdRequest = permissionId;
            console.log('this.permissionIdRequest checking',this.permissionIdRequest)
            this.storeFormIdPerm = this.permissionsMetaData.form_permission
            console.log('this.storeFormIdPerm check',this.storeFormIdPerm)
    

            if(this.permissionIdRequest=='All' && this.storeFormIdPerm=='All'){
              this.dynamicData()

            }else if(this.permissionIdRequest=='All' && this.storeFormIdPerm !=='All'){
              const StorePermissionIds = this.storeFormIdPerm
              this.dynamicData(StorePermissionIds)
            }
            else if (this.permissionIdRequest != 'All' && this.storeFormIdPerm[0] != 'All') {
              const readFilterEquationawait: any = await this.fetchPermissionIdMain(1, permissionId);
              console.log('main permission check from Tile1', readFilterEquationawait);
            
              if (Array.isArray(readFilterEquationawait)) {
                const hasAllPermission = readFilterEquationawait.some(
                  (packet: any) => Array.isArray(packet.dynamicForm) && packet.dynamicForm.includes('All')
                );
            
                if (hasAllPermission) {
                  const StorePermissionIds = this.storeFormIdPerm;
                  this.dynamicData(StorePermissionIds);
                } else {
                  // Match dynamicForm values with storeFormIdPerm
                  const dynamicFormValues = readFilterEquationawait
                    .map((packet: any) => packet.dynamicForm?.[0]) // Get each dynamicForm value
                    .filter((v: string | undefined) => !!v);        // Remove undefined
            
                  const matchedStoreFormIds = this.storeFormIdPerm.filter((id: string) =>
                    dynamicFormValues.includes(id)
                  );
            
                  console.log('matchedStoreFormIds:', matchedStoreFormIds);
            
                  this.dynamicData(matchedStoreFormIds); // ⬅️ Use the filtered list
                }
              } else {
                console.warn('fetchPermissionIdMain did not return an array.');
              }
            }
            else if (this.permissionIdRequest !== 'All' && this.storeFormIdPerm[0] === 'All') {
              const readFilterEquationawait: any = await this.fetchPermissionIdMain(1, permissionId);
              console.log('main permission check from Tile1', readFilterEquationawait);
            
              if (Array.isArray(readFilterEquationawait)) {
                const hasAllPermission = readFilterEquationawait.some(
                  (packet: any) => Array.isArray(packet.dynamicForm) && packet.dynamicForm.includes('All')
                );
            
                if (hasAllPermission) {
                  // No filtering needed, show all
                  this.dynamicData();
                } else {
                  // Extract dynamicForm[0] from each packet
                  const filteredFormIds = readFilterEquationawait
                    .map((packet: any) => packet.dynamicForm?.[0])  // Get first value from each dynamicForm
                    .filter((formId: string | undefined) => !!formId); // Remove undefined/null
            
                  console.log('filteredFormIds (no "All" present):', filteredFormIds);
            
                  this.dynamicData(filteredFormIds);
                }
              } else {
                console.warn('fetchPermissionIdMain did not return an array.');
              }
            }
            
            
            
            // **Fix: Ensure fetchPermissionIdMain is awaited**


         

        } catch (error) {
            console.error("Error parsing JSON:", error);
            return null; // Fix: Ensuring return on JSON parsing failure
        }
    } catch (error) {
        console.error("Error fetching user permissions:", error);
        return null; // Fix: Ensuring return on outer try-catch failure
    }
}


async fetchPermissionIdMain(clientID: number, p1Value: string): Promise<void> {

  try {
    console.log("p1Value checking", p1Value);
    console.log("clientID checking", clientID);
    console.log("this.SK_clientID checking from permission", this.SK_clientID);

    const pk = `${this.SK_clientID}#permission#${p1Value}#main`;
    console.log(`Fetching main table data for PK: ${pk}`);

    const result: any = await this.api.GetMaster(pk, clientID);

    if (!result || !result.metadata) {
      console.warn("Result metadata is null or undefined.");
// Resolve even if no data is found
      return;
    }

    // Parse metadata
    this.parsedPermission = JSON.parse(result.metadata);
    console.log("Parsed permission metadata:", this.parsedPermission);

    this.readFilterEquation = JSON.parse(this.parsedPermission.dynamicEntries);
    console.log("this.readFilterEquation check", this.readFilterEquation);

    // Handling Dashboard Permissions
    this.summaryPermission = this.parsedPermission.summaryList || [];
    console.log("this.summaryPermission check", this.summaryPermission);

    // if (this.summaryPermission.includes("All")) {
    //   console.log("Permission is 'All'. Fetching all dashboards...");

return this.readFilterEquation
    // } else {
    //   console.log("Fetching specific dashboards...");
    //   const allData = await this.fetchCompanyLookupdata(1);
    //   this.dashboardData = allData.filter((dashboard: any) =>
    //     this.summaryPermission.includes(dashboard.P1)
    //   );
    //   console.log("Filtered Dashboards Data:", this.dashboardData);
    // }

    // Extract Permission List
 
    
// Resolve the Promise after all operations are complete
  } catch (error) {
    console.error(`Error fetching data for PK (${p1Value}):`, error);
// Reject in case of API failure
  }

}
}
