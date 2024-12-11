import { ChangeDetectorRef, Component, EventEmitter, Injector, Input, NgZone, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import dayjs, { Dayjs } from 'dayjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { APIService } from 'src/app/API.service';
import { LocationPermissionService } from 'src/app/location-permission.service';
import { SharedService } from 'src/app/pages/shared.service';

@Component({
  selector: 'app-tile6-config',

  templateUrl: './tile6-config.component.html',
  styleUrl: './tile6-config.component.scss'
})
export class Tile6ConfigComponent implements OnInit{
  selectedTile: any;
  editTileIndex5: number | null;
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
  createKPIWidget5:FormGroup
  private widgetIdCounter = 0;
  reloadEvent: any;
  isEditMode: boolean;
  getLoggedUser: any;
  formList: any;
  listofDeviceIds: any;
  listofDynamicParam: any;
  @Input() dashboard: any;
  @Input() modal :any
  @ViewChild('calendarModal5') calendarModal5: any;
  @Output() update_PowerBoard_config =  new EventEmitter<any>();
  @Input()  all_Packet_store: any;
  @Output() send_all_Packet_store1 = new EventEmitter<any[]>();
  grid_details: any;
  @Output() dashboardChange = new EventEmitter<any[]>();
  tooltip: string | null = null;
  showIdField = false;
  dashboardIdsList: any;
  p1ValuesSummary: any;
  shouldShowProcessedValue: boolean = false;
  selectedParameterValue: string;
  parameterNameRead: any;

ngOnInit(){
  this.getLoggedUser = this.summaryConfiguration.getLoggedUserDetails()
  console.log('this.getLoggedUser check', this.getLoggedUser)
  // this.getWorkFlowDetails = this.summaryConfiguration.getLoggedUserDetails()
  // console.log('this.getLoggedUser check',this.getWorkFlowDetails)


  this.SK_clientID = this.getLoggedUser.clientID;
  console.log('this.SK_clientID check', this.SK_clientID)
  this.initializeTileFields5()
  this.dynamicData()
  this.dashboardIds(1)
  
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
showTooltip(item: string) {
  this.tooltip = item;
}

hideTooltip() {
  this.tooltip = null;
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
  SK_clientID(arg0: string, SK_clientID: any) {
    throw new Error('Method not implemented.');
  }
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
  openKPIModal5( tile?: any, index?: number) {
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
      const fontSizeValue = tile.fontSize ? parseInt(tile.fontSize.replace('px', ''), 10) : 14; 
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
        processed_value: processed_value5,// Corrected to use processed_value from the fourth item
        themeColor: tile.themeColor,
        fontSize: fontSizeValue, // Preprocessed fontSize value
        fontColor: tile.fontColor,
        dashboardIds:tile.dashboardIds,
        selectType:tile.selectType,
        filterParameter:tile.filterParameter,
        filterDescription:tile.filterDescription,
        selectedRangeType:tile.selectedRangeType





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



    this.reloadEvent.next(true);
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
    { color: "linear-gradient(to right, #EECDA3, #EF629F)", selected: false }  // Warm Orange to Yellow
  ];

  onFontColorChange(event: Event): void {
    const color = (event.target as HTMLInputElement).value;
    this.createKPIWidget5.patchValue({ fontColor: color });
  }
  initializeTileFields5() {
    this.createKPIWidget5 = this.fb.group({
      'formlist': ['', Validators.required],
      'parameterName': ['', Validators.required],
      'groupBy': ['', Validators.required],
      'primaryValue': ['', Validators.required],
      'groupByFormat': ['', Validators.required],
      'constantValue': [''],
      'secondaryValue': ['', Validators.required],
      'secondaryValueNested': ['', Validators.required],
      widgetid: [this.generateUniqueId()],
      'processed_value': [''],
      'processed_value1': [''],
      'processed_value2': [''],
      // selectedColor: [this.selectedColor]
      'themeColor': ['', Validators.required],
      fontSize: [14, [Validators.required, Validators.min(8), Validators.max(72)]], // Default to 14px
      fontColor: ['#000000', Validators.required], 
      dashboardIds:[''],
      selectType:[''],
      filterParameter:[''],
      filterDescription:[''],
      selectedRangeType:['']
    })
  }
  generateUniqueId(): number {
    this.widgetIdCounter++;
    return Date.now() + this.widgetIdCounter; // Use timestamp and counter for uniqueness
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
    { value: 'Live', text: 'Live' },
    { value: 'Count', text: 'Count' },
  
  ]
  parameterValue(event:any){
    console.log('event for parameter check',event)
    this.parameterNameRead = event[0].text
  
  }

  SelectTypeSummary =[
    { value: 'NewTab', text: 'New Tab' },
    { value: 'Modal', text: 'Modal' },
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
  handleModalClose(selectedValue: string) {
    // Logic to handle what happens after the modal closes
    console.log('Handling post modal close logic with value:', selectedValue);
    // You can update your UI or state here based on the selectedValue
  }

  updateTile5() {
    if (this.editTileIndex5 !== null) {
      console.log('this.editTileIndex check', this.editTileIndex5);
      console.log('Tile checking for update:', this.dashboard[this.editTileIndex5]); // Log the tile being checked

      // Log the current details of the tile before update
      console.log('Current Tile Details Before Update:', this.dashboard[this.editTileIndex5]);
      let multiValueArray = this.dashboard[this.editTileIndex5].multi_value || [];
      const processedValue = this.createKPIWidget5.value.processed_value || ''; // Get updated processed_value from the form
      const constantValue = this.createKPIWidget5.value.constantValue || 0; // Get updated constantValue from the form
      const secondaryValue = this.createKPIWidget5.value.secondaryValue || '';
      const secondaryValueNested = this.createKPIWidget5.value.secondaryValueNested || '';
      const primaryValue = this.createKPIWidget5.value.primaryValue || '';
      if (multiValueArray.length > 1) {
      // Update processed_value at index 1
        multiValueArray[0].constantValue = constantValue; // Update constantValue at index 0
        multiValueArray[1].value = secondaryValue;
        multiValueArray[2].value = secondaryValueNested

        // Update secondaryValue at index 1
      } else {
        // If multi_value array doesn't have enough elements, ensure it's structured correctly
        // Ensure at least two objects are created with the correct structure

      
        multiValueArray.push({ constantValue: constantValue });
        multiValueArray.push({ secondaryValue: secondaryValue });
        multiValueArray.push({ secondaryValueNested: secondaryValueNested })


      }
      const fontSizeValue = `${this.createKPIWidget5.value.fontSize}px`;
      // Update the properties of the tile with the new values from the form
      this.dashboard[this.editTileIndex5] = {
        ...this.dashboard[this.editTileIndex5], // Keep existing properties
        formlist: this.createKPIWidget5.value.formlist,
        parameterName: this.createKPIWidget5.value.parameterName,
        groupBy: this.createKPIWidget5.value.groupBy,
        primaryValue: this.createKPIWidget5.value.primaryValue,
        groupByFormat: this.createKPIWidget5.value.groupByFormat,
        constantValue: this.createKPIWidget5.value.constantValue,
        secondaryValue: this.createKPIWidget5.value.secondaryValue,
        secondaryValueNested: this.createKPIWidget5.value.secondaryValueNested,
        themeColor: this.createKPIWidget5.value.themeColor,
        fontSize: fontSizeValue,
        fontColor: this.createKPIWidget5.value.fontColor,
        dashboardIds:this.createKPIWidget5.value.dashboardIds,
        selectType:this.createKPIWidget5.value.selectType,
        filterParameter:this.createKPIWidget5.value.filterParameter,
        filterDescription:this.createKPIWidget5.value.filterDescription,
        selectedRangeType:this.createKPIWidget5.value.selectedRangeType,



        // Include any additional properties if needed
      };

      // Log the updated details of the tile
      console.log('Updated Tile Details:', this.dashboard[this.editTileIndex5]);

      // Also update the grid_details array to reflect changes
      this.all_Packet_store.grid_details[this.editTileIndex5] = {
        ...this.all_Packet_store.grid_details[this.editTileIndex5], // Keep existing properties
        ...this.dashboard[this.editTileIndex5], // Update with new values
      };
  

      this.grid_details = this.dashboard;
      this.dashboardChange.emit(this.grid_details);
      if(this.grid_details)
        {
          this.updateSummary('add_tile');
        }
      console.log('his.dashboard check from updateTile', this.dashboard)

      console.log("Updated all_Packet_store.grid_details:", this.all_Packet_store.grid_details);


      // Reset the editTileIndex after the update
      this.editTileIndex5 = null;
    } else {
      console.error("Edit index is null. Unable to update the tile.");
    }
  }
  updateSummary(arg2:any){
    this.update_PowerBoard_config.emit(arg2)
  }
  duplicateTile5(tile: any, index: number): void {
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
      rowHeight: tile.rowHeight || 200, // The height of each row in pixels
      colWidth: tile.colWidth || 200, // The width of each column in pixels
      fixedColWidth: tile.fixedColWidth ?? true,
      fixedRowHeight: tile.fixedRowHeight ?? true,
      grid_type: tile.grid_type || 'tile6',
      formlist: tile.formlist,
      parameterName: tile.parameterName,
      groupBy: tile.groupBy,
      groupByFormat: tile.groupByFormat,
      selectedColor: tile.selectedColor || '#000', // Use the existing selectedColor or a default
      themeColor: tile.themeColor || '#000', // Use the existing themeColor or a default
      multi_value: tile.multi_value
        ? tile.multi_value.map((value: any) => ({ ...value })) // Deep copy multi_value
        : [
          {
            primaryValue: tile.primaryValue || '',
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
    this.updateSummary('add_tile');
  }

  dynamicparameterValue(event: any): void {
    console.log('event check for dynamic param',event)
    console.log('event[0].text check',event[0].text)
    const filterParameter=this.createKPIWidget5.get('filterParameter')
    console.log('filterParameter check',filterParameter)
    if (event && event[0] && event[0].text) {
    if(filterParameter){
  
      filterParameter.setValue(event[0].text)
      this.cdr.detectChanges();   
    }
  }else{
    console.log('failed to set value')
  }
   
  
    if (event && event[0].value) {
      // Format the value as ${field-key}
      const formattedValue = "${"+event[0].value+"}"; 
      console.log('formattedValue check',formattedValue) // You can customize the formatting as needed
      this.selectedParameterValue = formattedValue;
  
  
      console.log('Formatted Selected Item:', this.selectedParameterValue);
    } else {
      console.log('Event structure is different:', event);
    }
  
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
    
  ]
  addTile(key: any) {










    if (key === 'tile6') {
     const uniqueId = this.generateUniqueId();
     const newTile6 = {
       id: uniqueId,
       x: 0,
       y: 0,
       rows: 25,  // The number of rows in the grid
       cols: 25, 
       rowHeight: 200, // The height of each row in pixels
       colWidth: 200,  // The width of each column in pixels
       fixedColWidth: true,  // Enable fixed column widths
       fixedRowHeight: true,
       grid_type: "tile6",
       formlist: this.createKPIWidget5.value.formlist,
       parameterName: this.createKPIWidget5.value.parameterName,
       groupBy: this.createKPIWidget5.value.groupBy,

       groupByFormat: this.createKPIWidget5.value.groupByFormat,
       selectedColor: this.createKPIWidget5.value.selectedColor,
       themeColor: this.createKPIWidget5.value.themeColor,
       fontSize: `${this.createKPIWidget5.value.fontSize}px`,// Added fontSize
       fontColor: this.createKPIWidget5.value.fontColor,
       dashboardIds:this.createKPIWidget5.value.dashboardIds,
       selectType: this.createKPIWidget5.value.selectType,
       filterParameter:this.createKPIWidget5.value.filterParameter,
       filterDescription:this.createKPIWidget5.value.filterDescription,
       selectedRangeType:this.createKPIWidget5.value.selectedRangeType,
       parameterNameRead:this.parameterNameRead,

       // Default value, change this to whatever you prefer
       // You can also handle default value for this if needed


       multi_value: [
         {
           primaryValue: this.createKPIWidget5.value.primaryValue,
           constantValue: this.createKPIWidget5.value.constantValue !== undefined && this.createKPIWidget5.value.constantValue !== null
             ? this.createKPIWidget5.value.constantValue
             : 0,
             processed_value: this.createKPIWidget5.value.processed_value || '',
         },
         {
           value: this.createKPIWidget5.value.secondaryValue, // Change secondaryValue to value
           processed_value: this.createKPIWidget5.value.processed_value1 || '',

         },
         {
           value: this.createKPIWidget5.value.secondaryValueNested,
           processed_value: this.createKPIWidget5.value.processed_value2 || '',


         }, 

       ],
     };

     // Initialize this.dashboard if it hasn't been set yet
     if (!this.dashboard) {
       this.dashboard = [];
     }

     // Push the new tile to dashboard
     this.dashboard.push(newTile6);
     this.grid_details = this.dashboard;
     this.dashboardChange.emit(this.grid_details);
     if(this.grid_details)
       {
         this.updateSummary('add_tile');
       }

     console.log('this.dashboard after adding new tile', this.dashboard);

  
     this.createKPIWidget5.patchValue({
       widgetid: uniqueId // Set the ID in the form control
     });

   }
  }
  onAdd(): void {
    // Set the `selectedParameterValue` to the `name` of the selected parameter
    this.selectedParameterValue = this.selectedParameterValue;
    console.log('this.selectedParameterValue check',this.selectedParameterValue)
  
    // Update the form control value for filterDescription
    this.createKPIWidget5.patchValue({
      filterDescription: `${this.selectedParameterValue}`,
    });
  
    // Manually trigger change detection to ensure the UI reflects the changes
    this.cdr.detectChanges();
  }
  get groupByFormatControl5(): FormControl {
    return this.createKPIWidget5.get('groupByFormat') as FormControl; // Cast to FormControl
  }
  selectValue5(value: string, modal: any) {
    console.log('Selected value:', value);

    // Set the value to the form control
    this.groupByFormatControl5.setValue(value);

    // Close the modal after selection
    this.closeModal(modal);
  }
  closeModal(modal: any) {
    if (modal) {
      modal.close(); // Close the modal
    } else {
      console.error('Modal reference is undefined');
    }
  }
  onColorChange5(event: Event) {
    const colorInput = event.target as HTMLInputElement;
    this.createKPIWidget5.get('themeColor')?.setValue(colorInput.value)

    console.log('Color changed:', this.createKPIWidget5.get('themeColor')?.value);
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
  selectedColor: string = '#66C7B7';
  selectedTabset: string = 'dataTab';
  selectedSettingsTab(tab: string) {
    this.selectedTabset = tab;
  }
  onValueChange5(selectedValue: any): void {
    // Handle any logic here if needed when the value changes
    console.log(selectedValue); // Optional: log the selected value
  }
  get primaryValue5() {
    return this.createKPIWidget5.get('primaryValue');
  }

}
