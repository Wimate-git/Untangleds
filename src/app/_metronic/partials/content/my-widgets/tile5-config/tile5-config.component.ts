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
  selector: 'app-tile5-config',

  templateUrl: './tile5-config.component.html',
  styleUrl: './tile5-config.component.scss'
})
export class Tile5ConfigComponent implements OnInit {
  getLoggedUser: any;
  SK_clientID: any;
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
  createKPIWidget4:FormGroup
  formList: any;
  listofDeviceIds: any;
  private widgetIdCounter = 0;
  @ViewChild('calendarModal4') calendarModal4: any;
  selectedTabset: string = 'dataTab';
  showIdField = false;
  isEditMode: boolean;
  @Input() dashboard: any;
  grid_details: any;
  editTileIndex4: number | null;
  @Output() dashboardChange = new EventEmitter<any[]>();
  @Output() update_PowerBoard_config =  new EventEmitter<any>();
  @Input()  all_Packet_store: any;
  @Output() send_all_Packet_store1 = new EventEmitter<any[]>();
  reloadEvent: any;
  selectedTile: any;
  @Input() modal :any
  listofDynamicParam: any;
  tooltip: string | null = null;
  dashboardIdsList: any;
  p1ValuesSummary: any;
  selectedParameterValue: any;

  shouldShowProcessedValue: boolean = false;
  parameterNameRead: any;
  ngOnInit(): void {
    this.getLoggedUser = this.summaryConfiguration.getLoggedUserDetails()
    console.log('this.getLoggedUser check', this.getLoggedUser)
    // this.getWorkFlowDetails = this.summaryConfiguration.getLoggedUserDetails()
    // console.log('this.getLoggedUser check',this.getWorkFlowDetails)
  
  
    this.SK_clientID = this.getLoggedUser.clientID;
    console.log('this.SK_clientID check', this.SK_clientID)
    this.initializeTileFields4()
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
  SelectTypeSummary =[
    { value: 'NewTab', text: 'New Tab' },
    { value: 'Modal', text: 'Modal' },
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
  groupByOptions = [
    { value: 'none', text: 'None' },
    { value: 'created', text: 'Created Time' },
    { value: 'updated', text: 'Updated Time' },
    { value: 'name', text: 'Name' },
    { value: 'phoneNumber', text: 'Phone Number' },
    { value: 'emailId', text: 'Email Id' },
  
  
    // Add more hardcoded options as needed
  ];


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
  onColorChange4(event: Event) {
    const colorInput = event.target as HTMLInputElement;
    this.createKPIWidget4.get('themeColor')?.setValue(colorInput.value)

    console.log('Color changed:', this.createKPIWidget4.get('themeColor')?.value);
  }
  initializeTileFields4() {
    this.createKPIWidget4 = this.fb.group({
      'formlist': ['', Validators.required],
      'parameterName': ['', Validators.required],
      'groupBy': ['', Validators.required],
      'primaryValue': ['', Validators.required],
      'groupByFormat': ['', Validators.required],
      'constantValue': [''],
      'CompareTile': ['', Validators.required],
      'WithCompareTile': ['', Validators.required],
      'secondaryValue': ['', Validators.required],
      widgetid: [this.generateUniqueId()],
      'processed_value': [''],
      'processed_value1': [''],
      'processed_value2': [''],
      'processed_value3':[''],
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
  handleModalClose(selectedValue: string) {
    // Logic to handle what happens after the modal closes
    console.log('Handling post modal close logic with value:', selectedValue);
    // You can update your UI or state here based on the selectedValue
  }

  themes = [
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
    { color: "linear-gradient(to right, #FF8008, #FFC837)", selected: false }, // Bright Orange to Yellow
    { color: "linear-gradient(to right, #3A1C71, #D76D77, #FFAF7B)", selected: false }, // Purple to Peach
    { color: "linear-gradient(to right, #4568DC, #B06AB3)", selected: false }  // Soft Blue to Purple
  ];
  
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
  
  
  selectedColor: string = '#66C7B7';
  addTile(key: any) {









    if (key === 'tile5') {
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
         fontSize: `${this.createKPIWidget4.value.fontSize}px`,// Added fontSize
         fontColor: this.createKPIWidget4.value.fontColor, 
         dashboardIds: this.createKPIWidget4.value.dashboardIds,
         selectType:this.createKPIWidget4.value.selectType,
         filterParameter:this.createKPIWidget4.value.filterParameter,
         filterDescription:this.createKPIWidget4.value.filterDescription,
         selectedRangeType:this.createKPIWidget4.value.selectedRangeType,
         parameterNameRead:this.parameterNameRead,





         // Default value, change this to whatever you prefer
 
 
 
 
 
 
 
 
         multi_value: [
           {
             value: this.createKPIWidget4.value.primaryValue,
             constantValue: this.createKPIWidget4.value.constantValue !== undefined && this.createKPIWidget4.value.constantValue !== null
               ? this.createKPIWidget4.value.constantValue
               : 0,
               processed_value: this.createKPIWidget4.value.processed_value || '',
           },
           {
             value: this.createKPIWidget4.value.CompareTile, // Change secondaryValue to value
             processed_value: this.createKPIWidget4.value.processed_value1 || '',
 
           },
           {
             value: this.createKPIWidget4.value.WithCompareTile,
             processed_value: this.createKPIWidget4.value.processed_value2 || '',
 
 
           }, 
           {
             value: this.createKPIWidget4.value.secondaryValue,
             processed_value: this.createKPIWidget4.value.processed_value3 || '',
           }
         ],
 
       };
 
       // Initialize this.dashboard if it hasn't been set yet
       if (!this.dashboard) {
         this.dashboard = [];
       }
 
       // Push the new tile to dashboard
       this.dashboard.push(newTile5);
       this.grid_details = this.dashboard;
       this.dashboardChange.emit(this.grid_details);
       if(this.grid_details)
         {
           this.updateSummary('add_tile');
         }
 
       console.log('this.dashboard after adding new tile', this.dashboard);
 
    
       this.createKPIWidget4.patchValue({
         widgetid: uniqueId // Set the ID in the form control
       });
 
     }
    }
    updateSummary(arg2:any){
      this.update_PowerBoard_config.emit(arg2)
    }
    updateTile4() {
      if (this.editTileIndex4 !== null) {
        console.log('this.editTileIndex check', this.editTileIndex4);
        console.log('Tile checking for update:', this.dashboard[this.editTileIndex4]); // Log the tile being checked
  
        // Log the current details of the tile before update
        console.log('Current Tile Details Before Update:', this.dashboard[this.editTileIndex4]);
        let multiValueArray = this.dashboard[this.editTileIndex4].multi_value || [];
        // Get updated processed_value from the form
        const constantValue = this.createKPIWidget4.value.constantValue || 0; // Get updated constantValue from the form
        const CompareTile = this.createKPIWidget4.value.CompareTile || '';
        const WithCompareTile = this.createKPIWidget4.value.WithCompareTile || '';
        const primaryValue = this.createKPIWidget4.value.primaryValue || '';
        const secondaryValue = this.createKPIWidget4.value.secondaryValue || '';
        if (multiValueArray.length > 1) {
        // Update processed_value at index 1
          multiValueArray[0].constantValue = constantValue; // Update constantValue at index 0
          multiValueArray[1].value = CompareTile;
          multiValueArray[2].value = WithCompareTile;
          multiValueArray[3].value = secondaryValue
  
          // Update secondaryValue at index 1
        } else {
          // If multi_value array doesn't have enough elements, ensure it's structured correctly
          // Ensure at least two objects are created with the correct structure
  
        
          multiValueArray.push({ constantValue: constantValue });
          multiValueArray.push({ CompareTile: CompareTile });
          multiValueArray.push({ WithCompareTile: WithCompareTile });
          multiValueArray.push({ secondaryValue: secondaryValue })
  
  
  
        }
        const fontSizeValue = `${this.createKPIWidget4.value.fontSize}px`;
  
        // Update the properties of the tile with the new values from the form
        this.dashboard[this.editTileIndex4] = {
          ...this.dashboard[this.editTileIndex4], // Keep existing properties
          formlist: this.createKPIWidget4.value.formlist,
          parameterName: this.createKPIWidget4.value.parameterName,
          groupBy: this.createKPIWidget4.value.groupBy,
          primaryValue: this.createKPIWidget4.value.primaryValue,
          groupByFormat: this.createKPIWidget4.value.groupByFormat,
          constantValue: this.createKPIWidget4.value.constantValue,
          CompareTile: this.createKPIWidget4.value.CompareTile,
          WithCompareTile: this.createKPIWidget4.value.WithCompareTile,
          themeColor: this.createKPIWidget4.value.themeColor,
          secondaryValue: this.createKPIWidget4.value.secondaryValue,
          processedValue: this.createKPIWidget4.value.processedValue,
          fontSize: fontSizeValue,
          fontColor: this.createKPIWidget4.value.fontColor,
          dashboardIds:this.createKPIWidget4.value.dashboardIds,
          selectType:this.createKPIWidget4.value.selectType,
          filterParameter:this.createKPIWidget4.value.filterParameter,
          filterDescription:this.createKPIWidget4.value.filterDescription,
          selectedRangeType:this.createKPIWidget4.value.selectedRangeType,
          parameterNameRead:this.parameterNameRead,


  
  
          // Include any additional properties if needed
        };
  
        // Log the updated details of the tile
        console.log('Updated Tile Details:', this.dashboard[this.editTileIndex4]);
  
        // Also update the grid_details array to reflect changes
        this.all_Packet_store.grid_details[this.editTileIndex4] = {
          ...this.all_Packet_store.grid_details[this.editTileIndex4], // Keep existing properties
          ...this.dashboard[this.editTileIndex4], // Update with new values
        };
    
        console.log('his.dashboard check from updateTile', this.dashboard)
        this.grid_details = this.dashboard;
        console.log('this.grid_details check',this.grid_details)
        this.dashboardChange.emit(this.grid_details);
    
        if(this.grid_details)
          {
            this.updateSummary('update_tile')
          }
  
        console.log("Updated all_Packet_store.grid_details:", this.all_Packet_store.grid_details);
  
  
        // Reset the editTileIndex after the update
        this.editTileIndex4 = null;
      } else {
        console.error("Edit index is null. Unable to update the tile.");
      }
    }
    onAdd(): void {
      // Set the `selectedParameterValue` to the `name` of the selected parameter
      this.selectedParameterValue = this.selectedParameterValue;
      console.log('this.selectedParameterValue check',this.selectedParameterValue)
    
      // Update the form control value for filterDescription
      this.createKPIWidget4.patchValue({
        filterDescription: `${this.selectedParameterValue}`,
      });
    
      // Manually trigger change detection to ensure the UI reflects the changes
      this.cdr.detectChanges();
    }
    onFontColorChange(event: Event): void {
      const color = (event.target as HTMLInputElement).value;
      this.createKPIWidget4.patchValue({ fontColor: color });
    }
  openKPIModal4( tile?: any, index?: number) {
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
 // Processed value from multi_value
      const secondaryValue4 = parsedMultiValue[3]?.value || ''; // Secondary value from multi_value
      const fontSizeValue = tile.fontSize ? parseInt(tile.fontSize.replace('px', ''), 10) : 14; 
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
    
        themeColor: tile.themeColor,
        fontSize: fontSizeValue, // Preprocessed fontSize value
        fontColor: tile.fontColor, // Using extracted processed value
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

    // this.modalService.open(content, { size: 'lg', ariaLabelledBy: 'modal-basic-title' });

    this.reloadEvent.next(true);
  }

dynamicparameterValue(event: any): void {
  console.log('event check for dynamic param',event)
  console.log('event[0].text check',event[0].text)
  const filterParameter=this.createKPIWidget4.get('filterParameter')
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
  closeModal(modal: any) {
    if (modal) {
      modal.close(); // Close the modal
    } else {
      console.error('Modal reference is undefined');
    }
  }

  selectValue4(value: string, modal: any) {
    console.log('Selected value:', value);

    // Set the value to the form control
    this.groupByFormatControl4.setValue(value);

    // Close the modal after selection
    this.closeModal(modal);
  }
  get groupByFormatControl4(): FormControl {
    return this.createKPIWidget4.get('groupByFormat') as FormControl; // Cast to FormControl
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
  get primaryValue4() {
    return this.createKPIWidget4?.get('primaryValue');
  }
  onValueChange5(selectedValue: any): void {
    // Handle any logic here if needed when the value changes
    console.log(selectedValue); // Optional: log the selected value
  }
  showTooltip(item: string) {
    this.tooltip = item;
  }
  
  hideTooltip() {
    this.tooltip = null;
  }
  selectedSettingsTab(tab: string) {
    this.selectedTabset = tab;
  }
  duplicateTile4(tile: any, index: number): void {
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
      grid_type: tile.grid_type || 'tile5',
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
            value: tile.CompareTile || '',
          },
          {
            value: tile.WithCompareTile || '',
          },
          {
            processed_value: tile.processed_value || '',
          },
          {
            value: tile.secondaryValue || '',
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

}
