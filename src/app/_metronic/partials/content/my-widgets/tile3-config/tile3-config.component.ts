import { ChangeDetectorRef, Component, EventEmitter, Injector, Input, NgZone, OnInit, Output, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import dayjs, { Dayjs } from 'dayjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { APIService } from 'src/app/API.service';
import { LocationPermissionService } from 'src/app/location-permission.service';
import { SharedService } from 'src/app/pages/shared.service';

@Component({
  selector: 'app-tile3-config',

  templateUrl: './tile3-config.component.html',
  styleUrl: './tile3-config.component.scss'
})
export class Tile3ConfigComponent implements OnInit{
  createKPIWidget2:FormGroup
  @Output() update_PowerBoard_config =  new EventEmitter<any>();
  private widgetIdCounter = 0;
  @Input() dashboard: any;
  @Output() dashboardChange = new EventEmitter<any[]>();
  grid_details: any;

  getLoggedUser: any;

  SK_clientID: any;
  formList: any;
  listofDeviceIds: any;
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
  editTileIndex2: number | null;
  @Input()  all_Packet_store: any;
  @Output() send_all_Packet_store1 = new EventEmitter<any[]>();
  listofDynamicParam: any;
  selectedColor: string = '#66C7B7'; 
  reloadEvent: any;
  isEditMode: boolean = false;
  selectedTile: null;
  selectedTabset: string = 'dataTab';
  showIdField = false;
  @ViewChild('calendarModal2') calendarModal2: any;
  tooltip: string | null = null;

  @Input() modal :any
  shouldShowProcessedValue: boolean = false;
  dashboardIdsList: any;

  p1ValuesSummary: any;
  selectedParameterValue: any;
  parameterNameRead: any;
  parsedParam: any;
  FormNames: any;
  dynamicIDArray: any;
  IdsFetch: string[];
  summaryIds: any;
  dashboardListRead: any[];
  dashboardList: any[];
  dashboardIdList: string[] | PromiseLike<string[]>;
  projectDetailListRead: any;
  projectDetailList: any;
  reportStudioListRead: any[];
  reportStudioDetailList: any[];
  projectListRead: any[];
  projectList: any[];
  helpherObjCalender: any;
  formListTitles: any;
  shoRowData:boolean = false
  selectedText: any;
  columnVisisbilityFields: any;

  ngOnInit(){
    this.getLoggedUser = this.summaryConfiguration.getLoggedUserDetails()
    console.log('this.getLoggedUser check', this.getLoggedUser)
    // this.getWorkFlowDetails = this.summaryConfiguration.getLoggedUserDetails()
    // console.log('this.getLoggedUser check',this.getWorkFlowDetails)
  
  
    this.SK_clientID = this.getLoggedUser.clientID;
    console.log('this.SK_clientID check', this.SK_clientID)
    this.initializeTileFields2()
    this.dynamicData()
    this.dashboardIds(1)
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

  SelectTypeSummary =[
    { value: 'NewTab', text: 'New Tab' },
    { value: 'Modal', text: 'Modal(Pop Up)' },
    { value: 'Same page Redirect', text: 'Same page Redirect' },

    { value: 'drill down', text: 'drill down' },
  ]

  constructor(private summaryConfiguration: SharedService,private api: APIService, private fb: UntypedFormBuilder, private cd: ChangeDetectorRef,
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

  initializeTileFields2() {
    const defaultTheme = { color: "linear-gradient(to right, #A1045A, #A1045A)", selected: true };
    this.selectedColor = defaultTheme.color;
    this.createKPIWidget2 = this.fb.group({
      'formlist': ['', Validators.required],
      'parameterName': ['', Validators.required],
 
      'primaryValue': ['', Validators.required],
      'groupByFormat': ['', Validators.required],
      'constantValue': [''],
      'secondaryValue': ['', Validators.required],
      'secondaryValueNested': ['', Validators.required],
      widgetid: [this.generateUniqueId()],
      'processed_value': [''],
      'processed_value1': [''],
      'processed_value2': [''],
      // selectedColor: [this.selectedColor]'
      'themeColor': [this.selectedColor, Validators.required],
      fontSize: [20, [Validators.required, Validators.min(8), Validators.max(72)]], // Default to 14px
      fontColor: ['#000000', Validators.required], 
      dashboardIds:[''],
      selectType:[''],
      filterParameter:[''],
      filterDescription:[''],
      selectedRangeType:[''],
      custom_Label:['',Validators.required],
      formatType:['',Validators.required],
      columnVisibility:[[]],
      ModuleNames:[''],
      selectFromTime:[''],
      selectToTime:['']

  

    })
  }

  async dynamicData(){
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
  }
  addTile(key: any) {
if (key === 'tile3') {
     const uniqueId = this.generateUniqueId();

     const newTile3 = {
       id: uniqueId,
       x: 0,
       y: 0,
       rows: 13,  // The number of rows in the grid
       cols: 25, 
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
       fontSize: `${this.createKPIWidget2.value.fontSize}px`,// Added fontSize
       fontColor: this.createKPIWidget2.value.fontColor,  
       dashboardIds:this.createKPIWidget2.value.dashboardIds,

       selectType:this.createKPIWidget2.value.selectType,
       filterParameter:this.createKPIWidget2.value.filterParameter,
       filterDescription:this.createKPIWidget2.value.filterDescription,
       selectedRangeType:this.createKPIWidget2.value.selectedRangeType,
       parameterNameRead: this.parameterNameRead, 
       custom_Label:this.createKPIWidget2.value.custom_Label,
       columnVisibility:this.createKPIWidget2.value.columnVisibility,

       rowData:this.createKPIWidget2.value.rowData || '',
       ModuleNames:this.createKPIWidget2.value.ModuleNames,
       selectFromTime: this.createKPIWidget2.value.selectFromTime,
       selectToTime: this.createKPIWidget2.value.selectToTime,
       formatType: this.createKPIWidget2.value.formatType,
  
       // Default value, change this to whatever you prefer
       // You can also handle default value for this if needed





       multi_value: [
         {
           value: this.createKPIWidget2.value.primaryValue, // Change primaryValue to value
           constantValue: this.createKPIWidget2.value.constantValue !== undefined && this.createKPIWidget2.value.constantValue !== null
             ? this.createKPIWidget2.value.constantValue
             : 0,
             processed_value: this.createKPIWidget2.value.processed_value || '',
         },
         {
           value: this.createKPIWidget2.value.secondaryValue, // Change secondaryValue to value
           processed_value: this.createKPIWidget2.value.processed_value1 || '',
         },
         {
           value: this.createKPIWidget2.value.secondaryValueNested,
           processed_value: this.createKPIWidget2.value.processed_value2 || '',



         }, 
       ],
     };

     // Initialize this.dashboard if it hasn't been set yet
     if (!this.dashboard) {
       this.dashboard = [];
     }

     // Push the new tile to dashboard
     this.dashboard.push(newTile3);
     this.grid_details = this.dashboard;
     this.dashboardChange.emit(this.grid_details);
     if(this.grid_details)
       {
         this.updateSummary('','add_tile');
       }

     console.log('this.dashboard after adding new tile', this.dashboard);

    
     this.createKPIWidget2.patchValue({
       widgetid: uniqueId // Set the ID in the form control
     });

   }
  }

  generateUniqueId(): number {
    this.widgetIdCounter++;
    return Date.now() + this.widgetIdCounter; // Use timestamp and counter for uniqueness
  }
  updateSummary(data: any, arg2: any) {
    this.update_PowerBoard_config.emit({ data, arg2 });
  }
  updateTile2(key: any) {
    if (this.editTileIndex2 !== null) {
      console.log('this.editTileIndex check', this.editTileIndex2);
      console.log('Tile checking for update:', this.dashboard[this.editTileIndex2]);
  
      const multiValue = this.dashboard[this.editTileIndex2].multi_value || [];
      const processedValue = this.createKPIWidget2.value.processed_value || ''; // Form value
      const constantValue = this.createKPIWidget2.value.constantValue || 0;
      const secondaryValue = this.createKPIWidget2.value.secondaryValue || '';
      const secondaryValueNested = this.createKPIWidget2.value.secondaryValueNested || '';
      const primaryValue = this.createKPIWidget2.value.primaryValue || multiValue[0]?.value || ''; // Ensure it gets value from form or multi_value[0]
  
      console.log('Extracted primaryValue:', primaryValue);
      console.log('Form Value for processed_value:', processedValue);
      console.log('Form Value for constantValue:', constantValue);
  
      // Update multi_value array
      if (multiValue.length > 1) {
        multiValue[0].constantValue = constantValue;
        multiValue[0].value = primaryValue; // Sync primaryValue to multi_value[0]
        multiValue[1].value = secondaryValue;
        multiValue[2].value = secondaryValueNested;
      } else {
        // If multi_value is not enough, ensure it's structured correctly
        multiValue.push({ constantValue: constantValue, value: primaryValue });
        multiValue.push({ value: secondaryValue });
        multiValue.push({ value: secondaryValueNested });
      }
  
      const fontSizeValue = `${this.createKPIWidget2.value.fontSize}px`;
  
      // Prepare the updated tile object
      const updatedTile = {
        ...this.dashboard[this.editTileIndex2], // Keep existing properties
        formlist: this.createKPIWidget2.value.formlist,
        parameterName: this.createKPIWidget2.value.parameterName,
        primaryValue: primaryValue, // Use updated primaryValue
        groupBy: this.createKPIWidget2.value.groupBy,
        groupByFormat: this.createKPIWidget2.value.groupByFormat,
        constantValue: constantValue, // Use updated constantValue
        processed_value: processedValue, // Use updated processed_value
        multi_value: multiValue, // Update multi_value array
        selectedRangeType: this.createKPIWidget2.value.selectedRangeType,
        startDate: this.createKPIWidget2.value.startDate,
        endDate: this.createKPIWidget2.value.endDate,
        themeColor: this.createKPIWidget2.value.themeColor,
        fontSize: fontSizeValue,
        fontColor: this.createKPIWidget2.value.fontColor,
        selectFromTime: this.createKPIWidget2.value.selectFromTime ||'',
        selectToTime: this.createKPIWidget2.value.selectToTime ||'',
        dashboardIds: this.createKPIWidget2.value.dashboardIds ||'',
        selectType: this.createKPIWidget2.value.selectType ||'',
        filterParameter: this.createKPIWidget2.value.filterParameter ||'',
        filterDescription: this.createKPIWidget2.value.filterDescription ||'',
        parameterNameRead: this.parameterNameRead ||'',
        custom_Label:this.createKPIWidget2.value.custom_Label ||'',
        ModuleNames:this.createKPIWidget2.value.ModuleNames||'',
        columnVisibility:this.createKPIWidget2.value.columnVisibility ||'',
        formatType: this.createKPIWidget2.value.formatType,
  


      };
  
      console.log('Updated tile:', updatedTile);
  
      // Update the dashboard array with the updated tile
      this.dashboard = [
        ...this.dashboard.slice(0, this.editTileIndex2),
        updatedTile,
        ...this.dashboard.slice(this.editTileIndex2 + 1),
      ];
  
      console.log('Updated dashboard:', this.dashboard);
  
      // Update grid_details and emit the event
      this.all_Packet_store.grid_details[this.editTileIndex2] = { ...this.all_Packet_store.grid_details[this.editTileIndex2], ...updatedTile };
      this.grid_details = this.dashboard;
      this.dashboardChange.emit(this.grid_details);
  
      if (this.grid_details) {
        this.updateSummary(this.all_Packet_store,'update_tile');
      }
  
      // Reset editTileIndex after the update
      this.editTileIndex2 = null;
    } else {
      console.error('Edit index is null. Unable to update the tile.');
    }
  }
  
  
  


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
 
    { value: 'Count', text: 'Count' },
    { value: 'Count Dynamic', text: 'Count Dynamic' },
    { value: 'Count MultiplePram', text: 'Count Multiple Parameter' },
    { value: 'Sum MultiplePram', text: 'Sum Multiple Parameter' },
    { value: 'Average Multiple Parameter', text: 'Average Multiple Parameter' },
    { value: 'sumArray', text: 'SumArray' },
    { value: 'Advance Equation', text: 'Advance Equation' },
    {value:'Avg_Utilization_wise_multiple',text:'Avg_Utilization_wise_multiple'}

  ]

  groupByOptions = [
    { value: 'none', text: 'None' },
    { value: 'created', text: 'Created Time' },
    { value: 'updated', text: 'Updated Time' },
    { value: 'name', text: 'Name' },
    { value: 'phoneNumber', text: 'Phone Number' },
    { value: 'emailId', text: 'Email Id' },


    // Add more hardcoded options as needed
  ];
  dateRangeLabel =[
    { value: 'Today', text: 'Today' },
    { value: 'Yesterday', text: 'Yesterday' },
    { value: 'Last 7 Days', text: 'Last 7 Days' },
    { value: 'Last 30 Days', text: 'Last 30 Days' },
    { value: 'This Month', text: 'This Month' },
    { value: 'Last Month', text: 'Last Month' },
    { value: 'This Year', text: 'This Year' },
    { value: 'Last Year', text: 'Last Year' },
    
  ]
  parameterValue(event:any){
    console.log('event for parameter check',event)
    this.parameterNameRead = event[0].text

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




  onColorChange2(event: Event) {
    const colorInput = event.target as HTMLInputElement;
    this.createKPIWidget2.get('themeColor')?.setValue(colorInput.value)

    console.log('Color changed:', this.createKPIWidget2.get('themeColor')?.value);
  }
  onValueChange2(selectedValue: any): void {
    // Handle any logic here if needed when the value changes
    console.log(selectedValue); // Optional: log the selected value
  }
  toggleCheckbox(theme: any): void {
    // Clear the 'selected' state for all themes
    this.themes.forEach(t => t.selected = false);  // Reset selection for all themes

    // Set the clicked theme as selected
    theme.selected = true;

    // Update the selected color based on the theme selection
    this.selectedColor = theme.color;

    // Optionally, update the form control with the selected color
    this.createKPIWidget2.get('themeColor')?.setValue(this.selectedColor);
  }
   themes = [
    { color: "linear-gradient(to right, #FFDEE9, #B5FFFC)", selected: false }, // Light Pink to Light Aqua
    { color: "linear-gradient(to right, #D9AFD9, #97D9E1)", selected: false }, // Soft Purple to Aqua
    { color: "linear-gradient(to right, #FFB75E, #ED8F03)", selected: false }, // Orange Glow
    { color: "linear-gradient(to right, #667EEA, #764BA2)", selected: false }, // Blue Violet to Deep Purple
    { color: "linear-gradient(to right, #43CEA2, #185A9D)", selected: false }, // Green to Deep Blue
    { color: "linear-gradient(to right, #FF512F, #DD2476)", selected: false }, // Fiery Red to Pink
    { color: "linear-gradient(to right, #1FA2FF, #12D8FA, #A6FFCB)", selected: false }, // Vibrant Blue to Mint
    { color: "linear-gradient(to right, #FF758C, #FF7EB3)", selected: false }, // Bright Pink to Light Pink
    { color: "linear-gradient(to right, #2AF598, #009EFD)", selected: false }, // Teal to Sky Blue
    { color: "linear-gradient(to right, #F7971E, #FFD200)", selected: false } ,
    { color: "linear-gradient(to right, #0F2027, #203A43, #2C5364)", selected: false }, // Dark Blue Gradient
    { color: "linear-gradient(to right, #FC466B, #3F5EFB)", selected: false }, // Red-Pink to Blue
    { color: "linear-gradient(to right, #24C6DC, #514A9D)", selected: false }, // Aqua to Purple
    { color: "linear-gradient(to right, #FFEFBA, #FFFFFF)", selected: false }, // Subtle Yellow to White
    { color: "linear-gradient(to right, #EECDA3, #EF629F)", selected: false } , // Warm Orange to Yellow
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
  ];
  

edit_Tile3(tile?: any, index?: number) {
    console.log('tile checking',tile)
    if (tile) {
      this.selectedTile = tile;
      this.editTileIndex2 = index !== undefined ? index : null; // Store the index, default to null if undefined
      console.log('Tile Object:', tile); // Log the tile object

      // Parse multi_value if it's a string
      let parsedMultiValue = [];
      this.cd.detectChanges();
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
 

      // Extract values for primaryValue, secondaryValue, and secondaryValueNested from parsed multi_value
      const value = parsedMultiValue.length > 0 ? parsedMultiValue[0]?.value || '' : ''; // Assuming value corresponds to primaryValue
      const constantValue = parsedMultiValue[0]?.constantValue || 0; // Assuming constantValue is in the first item
      const secondaryValue = parsedMultiValue[1]?.value || ''; // Assuming value corresponds to secondaryValue
      const secondaryValueNested = parsedMultiValue[2]?.value || ''; // Assuming value corresponds to secondaryValueNested
      const parsedValue = parsedMultiValue[3]?.processed_value !== undefined ? parsedMultiValue[3].processed_value : 0;
      const fontSizeValue = tile.fontSize ? parseInt(tile.fontSize.replace('px', ''), 10) : 14; 
      this.parsedParam = JSON.parse(tile.filterParameter)
      console.log('this.parsedParam checking',this.parsedParam)
      tile.filterParameter = this.parsedParam;
      // Initialize form fields and pre-select values
      this.isEditMode = true;
      this.createKPIWidget2.patchValue({
        formlist: tile.formlist,
        parameterName: tile.parameterName,
        groupBy: tile.groupBy,
        primaryValue: value, // Set the primaryValue
        groupByFormat: tile.groupByFormat,
        constantValue: constantValue, // Set the constantValue
        secondaryValue: secondaryValue, // Set the secondaryValue
        secondaryValueNested: secondaryValueNested,// Set the secondaryValueNested
        processed_value: parsedValue,
        themeColor: tile.themeColor,
        fontSize: fontSizeValue, // Preprocessed fontSize value
        fontColor: tile.fontColor,
        dashboardIds:tile.dashboardIds,
        selectType:tile.selectType,
        filterParameter: tile.filterParameter,
        filterDescription:tile.filterDescription,
        selectedRangeType:tile.selectedRangeType,
        custom_Label:tile.custom_Label,
        ModuleNames:tile.ModuleNames,
        columnVisibility: parsedColumnVisibility,
        formatType: tile.formatType,      
        selectFromTime: tile.selectFromTime,
        selectToTime: tile.selectToTime,

      });

   // Set to edit mode
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
        const filterParameter = this.createKPIWidget2.get('filterParameter');
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
        const filterParameter = this.createKPIWidget2.get('filterParameter');
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
  
  
  

  onAdd(): void {
    // Capture the selected parameters (which will be an array of objects with text and value)
    const selectedParameters =  this.selectedParameterValue;
    console.log('selectedParameters checking', selectedParameters);
  
    if (Array.isArray(selectedParameters)) {
      // Format the selected parameters to include both text and value
      this.selectedParameterValue = selectedParameters
        .map(param => `${param.text}-\${${param.value}}`) // Include both text and value
        .join(' '); // Join them with a comma and space
    } else if (selectedParameters) {
      // If only one parameter is selected, format it directly
      this.selectedParameterValue = `${selectedParameters.text}-\${${selectedParameters.value}}`;
    } else {
      console.warn('No parameters selected or invalid format:', selectedParameters);
      this.selectedParameterValue = ''; // Fallback in case of no selection
    }
  
    console.log('this.selectedParameterValue check', this.selectedParameterValue);
  
    // Update the form control value for filterDescription with the formatted string
    this.createKPIWidget2.patchValue({
      filterDescription: `${this.selectedParameterValue}`,
    });
  
    // Manually trigger change detection to ensure the UI reflects the changes
    this.cdr.detectChanges();
  }
  handleModalClose(selectedValue: string) {
    // Logic to handle what happens after the modal closes
    console.log('Handling post modal close logic with value:', selectedValue);
    // You can update your UI or state here based on the selectedValue
  }
  selectedSettingsTab(tab: string) {
    this.selectedTabset = tab;
  }
  openModalCalender() {
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

  selectValue(value: string, modal: any) {
    console.log('Selected value:', value);

    // Set the value to the form control
    this.groupByFormatControl.setValue(value);

    // Close the modal after selection
    this.closeModal(modal);
  }

  get groupByFormatControl(): FormControl {
    return this.createKPIWidget2?.get('groupByFormat') as FormControl; // Cast to FormControl
  }
  closeModal(modal: any) {
    if (modal) {
      modal.close(); // Close the modal
    } else {
      console.error('Modal reference is undefined');
    }
  }
  showTooltip(item: string) {
    this.tooltip = item;
  }

  hideTooltip() {
    this.tooltip = null;
  }
  get primaryValue2() {
    return this.createKPIWidget2?.get('primaryValue');
  }
  duplicateTile2(tile: any, index: number): void {
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
      grid_type: tile.grid_type || 'tile3',
      formlist: tile.formlist,
      parameterName: tile.parameterName,
      groupBy: tile.groupBy,
      groupByFormat: tile.groupByFormat,
      themeColor: tile.themeColor || '#000', // Use the existing themeColor or a default
      multi_value: tile.multi_value
        ? tile.multi_value.map((value: any) => ({ ...value })) // Deep copy multi_value
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
            value: tile.secondaryValueNested || '',
          },
          {
            processed_value: tile.processed_value || '',
          },
        ],
    };

    // Insert the duplicated tile after the original
    this.dashboard.splice(index + 1, 0, clonedTile);

    console.log('this.dashboard after duplicating a tile:', this.dashboard);

    // Trigger change detection to ensure the UI updates
    this.cdr.detectChanges();

    // Update summary to handle the addition of the duplicated tile
    this.updateSummary('','add_tile');
  }
  onFontColorChange(event: Event): void {
    const color = (event.target as HTMLInputElement).value;
    this.createKPIWidget2.patchValue({ fontColor: color });
  }
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

    // { value: 'max', text: 'Maximum' },
]

showModuleNames = [
  { value: 'None', text: 'None' },
  { value: 'Forms', text: 'Forms' },
  { value: 'Dashboard', text: 'Dashboard' },
  { value: 'Dashboard - Group', text: 'Dashboard - Group' },
  { value: 'Summary Dashboard', text: 'Summary Dashboard' },
  { value: 'Projects', text: 'Projects' },
  { value: 'Project - Detail', text: 'Project - Detail' },
  { value: 'Project - Group', text: 'Project - Group' },
  {value: 'Report Studio', text: 'Report Studio'},
  {value:'Calender', text:'Calender'}

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

    
        this.dynamicIDArray = ReportStudioLookup
        // Add specific logic for Project - Group
        break;
        case 'Calender':
          console.log('Project - Group module selected');
     
          this.dynamicIDArray = []
          const CalenderLookup = await this.fetchCalender()
          console.log('CalenderLookup check',CalenderLookup)
  
      
          this.dynamicIDArray = CalenderLookup
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

  const selectedModule = this.createKPIWidget2.get('ModuleNames')?.value

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
validateAndSubmit() {
  if (this.createKPIWidget2.invalid) {
    // ✅ Mark all fields as touched to trigger validation messages
    Object.values(this.createKPIWidget2.controls).forEach(control => {
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
  this.addTile('tile3');
  this.modal.dismiss();
}

}
