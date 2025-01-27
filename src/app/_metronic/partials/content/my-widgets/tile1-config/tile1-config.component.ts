import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Injector, Input, NgZone, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormControl, FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
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
  selectedEquationParameterValue: any;
  listofFormValues: any;
  listofEquationParam: any;
  operationValue: any;
  columnVisisbilityFields: any;
  selectedText: any;
  shoRowData:boolean = false


 
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
    this.dynamicDataEquation()
    this.dashboardIds(1)
    // this.permissionIds(1)
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('dashboardChange',this.all_Packet_store)
    console.log('isGirdMoved check',this.isGirdMoved)
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
    // Initialize the form group
    this.createKPIWidget = this.fb.group({
      formlist: ['', Validators.required],
      parameterName: ['', Validators.required],
      primaryValue: ['', Validators.required],
      groupByFormat: ['', Validators.required],
      constantValue: [''],
      widgetid: [this.generateUniqueId()],
      processed_value: [''],
      selectedColor: [this.selectedColor || '#FFFFFF'], // Default to white if no color is set
      selectedRangeLabelWithDates: [''],
      selectedRangeType: ['', Validators.required],
      themeColor: ['', Validators.required],
      fontSize: [20, [Validators.required, Validators.min(8), Validators.max(72)]], // Default to 14px
      fontColor: ['#000000', Validators.required], // Default to black
      selectFromTime: [''],
      selectToTime: [''],
      dashboardIds: [''],
      selectType: [''],
      filterParameter: [[]], // Initialize as an array to handle multiple or single values
      filterDescription: [''],
      formatType:[''],
      custom_Label:['',Validators.required],
      EquationFormList:[''],
      EquationParam:[[]],
      EquationOperation:[''],
      EquationDesc:[''],
      columnVisibility:[[]],
      rowData:[]


    });
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

  async dynamicDataEquation(){
    try {
      const result: any = await this.api.GetMaster(this.SK_clientID + "#dynamic_form#lookup", 1);
      if (result) {
        console.log('forms chaecking',result)
        const helpherObj = JSON.parse(result.options);
        console.log('helpherObj checking',helpherObj)
        this.formList = helpherObj.map((item: [string]) => item[0]); // Explicitly define the type
        this.listofFormValues = this.formList.map((form: string) => ({ text: form, value: form })); // Explicitly define the type here too
        console.log('listofFormValues',this.listofFormValues)
        console.log('this.formList check from location', this.formList);
      }
    } catch (err) {
      console.log("Error fetching the dynamic form data", err);
    }
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
        selectFromTime: this.createKPIWidget.value.selectFromTime,
        selectToTime: this.createKPIWidget.value.selectToTime,
        formlist: this.createKPIWidget.value.formlist,
        parameterName: this.createKPIWidget.value.parameterName,
        groupByFormat: this.createKPIWidget.value.groupByFormat,
        dashboardIds: this.createKPIWidget.value.dashboardIds,
        selectType: this.createKPIWidget.value.selectType,
        filterParameter: this.createKPIWidget.value.filterParameter,
        filterDescription: this.createKPIWidget.value.filterDescription,
        parameterNameRead: this.parameterNameRead,
        selectedRangeType: this.createKPIWidget.value.selectedRangeType,
        themeColor: this.createKPIWidget.value.themeColor,
        fontSize: `${this.createKPIWidget.value.fontSize}px`,
        fontColor: this.createKPIWidget.value.fontColor,
        formatType: this.createKPIWidget.value.formatType,
        custom_Label:this.createKPIWidget.value.custom_Label,
        EquationFormList:this.createKPIWidget.value.EquationFormList,
        EquationParam:this.createKPIWidget.value.EquationParam,
        EquationOperation:this.createKPIWidget.value.EquationOperation,
        EquationDesc:this.createKPIWidget.value.EquationDesc,
        columnVisibility:this.createKPIWidget.value.columnVisibility,
        rowData:this.createKPIWidget.value.rowData || '',





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
  
  updateTile(key: any) {
    console.log('Key checking from update:', key);
    this.isGirdMoved = true;
  
    if (this.editTileIndex !== null && this.editTileIndex >= 0) {
      console.log('this.editTileIndex check:', this.editTileIndex);
      console.log('Tile checking for update:', this.dashboard[this.editTileIndex]);
  
      const multiValue = this.dashboard[this.editTileIndex]?.multi_value || [];
      const primaryValue = this.createKPIWidget.value.primaryValue || multiValue[0]?.value || '';
      const constantValue = multiValue[0]?.constantValue || 0;
      const processedValue = this.createKPIWidget.value.processed_value || '';
      const updatedConstantValue = this.createKPIWidget.value.constantValue || constantValue;
  
      console.log('Extracted primaryValue:', primaryValue);
      console.log('Form Value for processed_value:', processedValue);
      console.log('Form Value for constantValue:', updatedConstantValue);
  
      if (multiValue.length > 1) {
        multiValue[1].processed_value = processedValue;
        multiValue[0].constantValue = updatedConstantValue;
        multiValue[0].value = primaryValue;
      } else {
        multiValue.push({ processed_value: processedValue, constantValue: updatedConstantValue, value: primaryValue });
      }
  
      // Recalculate EquationDesc
      const updatedEquationDesc = this.generateEquationDesc(
        this.createKPIWidget.value.EquationOperation,
        this.createKPIWidget.value.EquationFormList,
        this.createKPIWidget.value.EquationParam
      );
  
      console.log('Updated EquationDesc:', updatedEquationDesc);
  
      const updatedTile = {
        ...this.dashboard[this.editTileIndex],
        formlist: this.createKPIWidget.value.formlist,
        parameterName: this.createKPIWidget.value.parameterName,
        primaryValue: primaryValue,
        groupByFormat: this.createKPIWidget.value.groupByFormat,
        constantValue: updatedConstantValue,
        processed_value: processedValue,
        multi_value: multiValue,
        selectedRangeType: this.createKPIWidget.value.selectedRangeType,
        startDate: this.createKPIWidget.value.startDate,
        endDate: this.createKPIWidget.value.endDate,
        themeColor: this.createKPIWidget.value.themeColor,
        fontSize: `${this.createKPIWidget.value.fontSize}px`,
        fontColor: this.createKPIWidget.value.fontColor,
        selectFromTime: this.createKPIWidget.value.selectFromTime,
        selectToTime: this.createKPIWidget.value.selectToTime,
        dashboardIds: this.createKPIWidget.value.dashboardIds,
        selectType: this.createKPIWidget.value.selectType,
        filterParameter: this.createKPIWidget.value.filterParameter,
        filterDescription: this.createKPIWidget.value.filterDescription,
        parameterNameRead: this.parameterNameRead,
        formatType: this.createKPIWidget.value.formatType,
        custom_Label: this.createKPIWidget.value.custom_Label,
        EquationFormList: this.createKPIWidget.value.EquationFormList,
        EquationParam: this.createKPIWidget.value.EquationParam,
        EquationOperation: this.createKPIWidget.value.EquationOperation,
        EquationDesc: updatedEquationDesc, // Update with recalculated value
        columnVisibility:this.createKPIWidget.value.columnVisibility


      };
  
      console.log('Updated tile:', updatedTile);
  
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

  EquationparameterValue(event: any): void {
    console.log('Event check for dynamic param:', event);
  
    if (event && event.value && Array.isArray(event.value)) {
      const valuesArray = event.value;
  
      // Format selected values
      const formattedValues = valuesArray.map((item: any) => {
        const { value, text } = item; // Destructure value and text
        return { value, text }; // Create an object with value and text
      });
  
      console.log('Formatted Selected Items:', formattedValues);
  
      // Update the form control with the selected values
      const EquationParameter = this.createKPIWidget.get('EquationParam');
      if (EquationParameter) {
        EquationParameter.setValue(formattedValues); // Update as an array of objects
        this.cdr.detectChanges(); // Trigger change detection
      }
  
      // Store the selected parameters
      this.selectedEquationParameterValue = formattedValues.length === 1 
        ? formattedValues[0] // Single selection
        : formattedValues;   // Multiple selections
    } else {
      console.warn('Invalid event structure:', event);
  
      // Reset the form control and selected value in case of invalid input
      const EquationParameter = this.createKPIWidget.get('EquationParam');
      if (EquationParameter) {
        EquationParameter.setValue([]); // Reset to an empty array
      }
      this.selectedEquationParameterValue = [];
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
    this.createKPIWidget.patchValue({
      filterDescription: `${this.selectedParameterValue}`,
    });
  
    // Manually trigger change detection to ensure the UI reflects the changes
    this.cdr.detectChanges();
  }
  

  addEquation(): void {
    // Get the operation value from the form control
    const operationValue = this.createKPIWidget.get('EquationOperation')?.value;
    console.log('Operation Value:', operationValue);
  
    // Capture the selected parameters
    let selectedParameters: any = this.selectedEquationParameterValue;
    console.log('Selected Parameters:', selectedParameters);
  
    // Ensure selectedParameters is always an array
    selectedParameters = Array.isArray(selectedParameters)
      ? selectedParameters
      : [selectedParameters]; // Wrap in an array if not already
  
    // Check if selectedParameters has valid data
    if (selectedParameters && selectedParameters.length > 0) {
      // Format the parameters with form name, text, and value
      const formattedParameters = selectedParameters
        .map(
          (param: { text: any; value: any }) =>
            `\${${this.formName}.${param.text}.${param.value}}`
        )
        .join(', ');
  
      // Construct the full equation
      const formattedEquation = `${operationValue}(${formattedParameters})`;
      console.log('Formatted Equation:', formattedEquation);
  
      // Patch the form control with the formatted equation
      this.createKPIWidget.patchValue({
        EquationDesc: formattedEquation,
      });
  
      console.log('Formatted Equation Updated:', formattedEquation);
    } else {
      console.warn('No parameters selected or invalid format:', selectedParameters);
  
      // Reset the equation description if no parameters are selected
      this.createKPIWidget.patchValue({
        EquationDesc: '',
      });
    }
  
    // Manually trigger change detection to ensure the UI reflects the changes
    this.cdr.detectChanges();
  }
  
  
  
  
  
  
  selectedSettingsTab(tab: string) {
    this.selectedTabset = tab;
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
    // clonedTile.predefinedSelectRange = tile.predefinedSelectRange;
    clonedTile.selectedRangeType = tile.selectedRangeType;
    clonedTile.themeColor = tile.themeColor;

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


openKPIModal(tile: any, index: number) {
  console.log('Index checking:', index); // Log the index
  if (tile) {
    this.selectedTile = tile;
    this.editTileIndex = index !== undefined ? index : null;
    console.log('Tile object from readback:', tile);

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

    console.log('Parsed columnVisibility:', parsedColumnVisibility);

    // Populate the form control and selected parameters
    this.createKPIWidget.patchValue({
      formlist: tile.formlist,
      parameterName: tile.parameterName,
      primaryValue: parsedMultiValue.length > 0 ? parsedMultiValue[0]?.value || '' : '',
      groupByFormat: tile.groupByFormat,
      constantValue: parsedMultiValue[0]?.constantValue !== undefined ? parsedMultiValue[0].constantValue : 0,
      processed_value: parsedMultiValue[0]?.processed_value !== undefined ? parsedMultiValue[0].processed_value : 0,
      selectedRangeCalendarTimeRight: tile.selectedRangeCalendarTimeRight,
      selectedRangeType: tile.selectedRangeType,
      themeColor: tile.themeColor,
      fontSize: tile.fontSize ? parseInt(tile.fontSize.replace('px', ''), 10) : 14,
      fontColor: tile.fontColor,
      selectFromTime: tile.selectFromTime,
      selectToTime: tile.selectToTime,
      dashboardIds: tile.dashboardIds,
      selectType: tile.selectType,
      filterParameter: parsedFilterParam,
      filterDescription: tile.filterDescription,
      custom_Label: tile.custom_Label,
      formatType: tile.formatType,
      EquationFormList: tile.EquationFormList,
      EquationParam: parsedEquationParam, // Set parsed EquationParam
      EquationOperation: tile.EquationOperation,
      EquationDesc: tile.EquationDesc,
      columnVisibility: parsedColumnVisibility, // Set parsed columnVisibility
    });

    // Set selected parameters
    this.selectedEquationParameterValue = parsedEquationParam;

    this.isEditMode = true; // Set to edit mode
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

  fetchDynamicFormDataEquation(value: any) {
    console.log("Data from lookup:", value);

    this.api
      .GetMaster(`${this.SK_clientID}#dynamic_form#${value}#main`, 1)
      .then((result: any) => {
        if (result && result.metadata) {
          const parsedMetadata = JSON.parse(result.metadata);
          const EquaformFields = parsedMetadata.formFields;
          console.log('formFields check',EquaformFields)

          // Initialize the list with formFields labels
          this.listofEquationParam = EquaformFields.map((field: any) => {
            console.log('field check',field)
            return {
              value: field.name,
              text: field.label
            };
          });

          // Include created_time and updated_time
          if (parsedMetadata.created_time) {
            this.listofEquationParam.push({
              value: parsedMetadata.created_time.toString(),
              text: 'Created Time' // You can customize the label here if needed
            });
          }

          if (parsedMetadata.updated_time) {
            this.listofEquationParam.push({
              value: parsedMetadata.updated_time.toString(),
              text: 'Updated Time' // You can customize the label here if needed
            });
          }

          console.log('Transformed dynamic parameters:', this.listofEquationParam);

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

  formName: string = ''; // Add a property to store the form name

  selectFormParams1(event: any): void {
    console.log('Event checking from equa', event);
  
    if (event && event[0] && event[0].data) {
      const selectedTexteqa = event[0].data.text; // Extract the form name (e.g., "Work Order")
      console.log('Selected Form Text from Equation', selectedTexteqa);
  
      if (selectedTexteqa) {
        this.formName = selectedTexteqa; // Store the form name for use in addEquation
        this.fetchDynamicFormDataEquation(selectedTexteqa);
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
   
    { value: 'Count', text: 'Count' },
    { value: 'Count Dynamic', text: 'Count Dynamic' },
    { value: 'Equation', text: 'Equation' },

  ]


  FormatTypeValues = [
    { value: 'Default', text: 'Default' },
    { value: 'Rupee', text: 'Rupee' },
    // { value: 'max', text: 'Maximum' },
]

  SelectTypeSummary =[
    { value: 'NewTab', text: 'New Tab' },
    { value: 'Modal', text: 'Modal' },
    { value: 'Same page Redirect', text: 'Same page Redirect' },

    { value: 'drill down', text: 'drill down' },
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


}
