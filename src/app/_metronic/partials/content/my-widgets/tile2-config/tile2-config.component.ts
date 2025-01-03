import { ChangeDetectorRef, Component, EventEmitter, Injector, Input, NgZone, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
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
  selector: 'app-tile2-config',

  templateUrl: './tile2-config.component.html',
  styleUrl: './tile2-config.component.scss'
})
export class Tile2ConfigComponent implements OnInit{
  createKPIWidget1: FormGroup;
  private widgetIdCounter = 0;
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
  getLoggedUser: any;
  formList: any;
  listofDeviceIds: any;
  @Input() dashboard: any;
  selectedTabset: string = 'dataTab';
  @Output() dashboardChange = new EventEmitter<any[]>();
  @Output() update_PowerBoard_config =  new EventEmitter<any>();
  @ViewChild('calendarModal1') calendarModal1: any;

  grid_details: any;
  selectedTile: any;
  editTileIndex1: number | null;
  isEditMode: boolean;
  reloadEvent: any;
  tooltip: string | null = null;
  @Input()  all_Packet_store: any;
  @Output() send_all_Packet_store1 = new EventEmitter<any[]>();
  listofDynamicParam: any;
  showIdField = false;
  @Input() modal :any
  shouldShowProcessedValue: boolean = false;
  dashboardIdsList: any;
  p1ValuesSummary: any;
  selectedParameterValue: any;
  parameterNameRead: any;

ngOnInit(): void {
  this.getLoggedUser = this.summaryConfiguration.getLoggedUserDetails()
  console.log('this.getLoggedUser check', this.getLoggedUser)
  // this.getWorkFlowDetails = this.summaryConfiguration.getLoggedUserDetails()
  // console.log('this.getLoggedUser check',this.getWorkFlowDetails)


  this.SK_clientID = this.getLoggedUser.clientID;
  console.log('this.SK_clientID check', this.SK_clientID)
  this.initializeTileFields1()
  this.dynamicData()
  this.dashboardIds(1)
  
}
ngOnChanges(changes: SimpleChanges): void {
  console.log('dashboardChange tile2',this.all_Packet_store)
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
  SK_clientID(arg0: string, SK_clientID: any) {
    throw new Error('Method not implemented.');
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

generateUniqueId(): number {
  this.widgetIdCounter++;
  return Date.now() + this.widgetIdCounter; // Use timestamp and counter for uniqueness
}

  initializeTileFields1() {
    this.createKPIWidget1 = this.fb.group({
      'formlist': ['', Validators.required],
      'parameterName': ['', Validators.required],
      'groupBy': ['', Validators.required],
      'primaryValue': ['', Validators.required],
      'groupByFormat': ['', Validators.required],
      'constantValue': [''],
      'secondaryValue': ['', Validators.required],
      widgetid: [this.generateUniqueId()],
      'processed_value': [''],
      // selectedColor: [this.selectedColor],
      'themeColor': ['', Validators.required],
      'processed_value1':[''],
      fontSize: [20, [Validators.required, Validators.min(8), Validators.max(72)]], // Default to 14px
      fontColor: ['#000000', Validators.required], 
      dashboardIds:[''],
      selectType:[''],
      filterParameter:[''],
      filterDescription:[''],
      selectedRangeType:['',Validators.required],
      custom_Label:['',Validators.required]

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





    if (key === 'tile') {
       const uniqueId = this.generateUniqueId();
       const newTile2 = {
         id: uniqueId,
         x: 0,
         y: 0,
         rows: 13,  // The number of rows in the grid
         cols: 25, 
         rowHeight: 100,
         colWidth: 100,
         fixedColWidth: true,
         fixedRowHeight: true,
         grid_type: "tile2",
         formlist: this.createKPIWidget1.value.formlist,
         parameterName: this.createKPIWidget1.value.parameterName,
         groupBy: this.createKPIWidget1.value.groupBy,
         themeColor: this.createKPIWidget1.value.themeColor,
         fontSize: `${this.createKPIWidget1.value.fontSize}px`,// Added fontSize
         fontColor: this.createKPIWidget1.value.fontColor,  // Ensure this is correctly assigned
         dashboardIds:this.createKPIWidget1.value.dashboardIds,
         selectType:this.createKPIWidget1.value.selectType,
         filterParameter:this.createKPIWidget1.value.filterParameter,
         filterDescription:this.createKPIWidget1.value.filterDescription,
         selectedRangeType:this.createKPIWidget1.value.selectedRangeType,
         parameterNameRead: this.parameterNameRead, 
         custom_Label:this.createKPIWidget1.value.custom_Label,



         multi_value: [
           {
             value: this.createKPIWidget1.value.primaryValue,
             constantValue: this.createKPIWidget1.value.constantValue !== undefined && this.createKPIWidget1.value.constantValue !== null
               ? this.createKPIWidget1.value.constantValue
               : 0,
               processed_value: this.createKPIWidget1.value.processed_value || '',
           },
           {
             value: this.createKPIWidget1.value.secondaryValue,

             processed_value: this.createKPIWidget1.value.processed_value1 || '',
           },
         
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
    
       this.grid_details = this.dashboard;
       this.dashboardChange.emit(this.grid_details);
       if(this.grid_details)
         {

          this.updateSummary('','update_tile');
         }
   
       this.createKPIWidget1.patchValue({
         widgetid: uniqueId // Set the ID in the form control
       });
     }
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
    handleModalClose(selectedValue: string) {
      // Logic to handle what happens after the modal closes
      console.log('Handling post modal close logic with value:', selectedValue);
      // You can update your UI or state here based on the selectedValue
    }
    selectedSettingsTab(tab: string) {
      this.selectedTabset = tab;
    }
    updateSummary(data: any, arg2: any) {
      console.log('data checking tile2',data)
      console.log('arg2 checkimng',arg2)
      this.update_PowerBoard_config.emit({ data, arg2 });
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
    
  
  
  
    selectedColor: string = '#66C7B7';
  openKPIModal1( tile?: any, index?: number) {
    console.log('tile checking from tile2',tile)
    
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
      const fontSizeValue = tile.fontSize ? parseInt(tile.fontSize.replace('px', ''), 10) : 14; 
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
        themeColor: tile.themeColor,
        fontSize: fontSizeValue, // Preprocessed fontSize value
        fontColor: tile.fontColor,
        dashboardIds: tile.dashboardIds,
        selectType:tile.selectType,
        filterParameter:tile.filterParameter,
        filterDescription:tile.filterDescription,
        selectedRangeType:tile.selectedRangeType,
        custom_Label:tile.custom_Label





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
  

    // Any additional setup if needed
    // this.showTable();
    this.reloadEvent.next(true);
  }

  onAdd(): void {
    // Set the `selectedParameterValue` to the `name` of the selected parameter
    this.selectedParameterValue = this.selectedParameterValue;
    console.log('this.selectedParameterValue check',this.selectedParameterValue)
  
    // Update the form control value for filterDescription
    this.createKPIWidget1.patchValue({
      filterDescription: `${this.selectedParameterValue}`,
    });
  
    // Manually trigger change detection to ensure the UI reflects the changes
    this.cdr.detectChanges();
  }

  selectValue1(value: string, modal: any) {
    console.log('Selected value:', value);

    // Set the value to the form control
    this.groupByFormatControl1.setValue(value);

    // Close the modal after selection
    this.closeModal(modal);
  }

  dynamicparameterValue(event: any): void {
    console.log('event check for dynamic param',event)
    console.log('event[0].text check',event[0].text)
    const filterParameter=this.createKPIWidget1.get('filterParameter')
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


  get groupByFormatControl1(): FormControl {
    return this.createKPIWidget1.get('groupByFormat') as FormControl; // Cast to FormControl
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
  onColorChange(event: Event) {
    const colorInput = event.target as HTMLInputElement;
    this.createKPIWidget1.get('themeColor')?.setValue(colorInput.value)

    console.log('Color changed:', this.createKPIWidget1.get('themeColor')?.value);
  }
  onValueChange1(selectedValue: any): void {
    // Handle any logic here if needed when the value changes
    console.log(selectedValue); // Optional: log the selected value
  }
  get primaryValue1() {
    return this.createKPIWidget1.get('primaryValue');
  }
  updateTile1(key:any) {
    console.log('key checking',key)
    if (this.editTileIndex1 !== null) {
      console.log('this.editTileIndex check', this.editTileIndex1);
      console.log('Tile checking for update:', this.dashboard[this.editTileIndex1]);

      // Log the current details of the tile before update
      console.log('Current Tile Details Before Update:', this.dashboard[this.editTileIndex1]);
      console.log('this.dashboard check from tile1', this.dashboard);

      // Extract the multi_value array
      let multiValue = this.dashboard[this.editTileIndex1].multi_value || [];

      // Update values in multi_value array
      // const processedValue = this.createKPIWidget1.value.processed_value || ''; // Get updated processed_value from the form
      const constantValue = this.createKPIWidget1.value.constantValue || 0; // Get updated constantValue from the form
      const secondaryValue = this.createKPIWidget1.value.secondaryValue || '';
      const primaryValue = this.createKPIWidget1.value.primaryValue || multiValue[0]?.value || '';  // Get updated secondaryValue from the form

      // console.log('Form Value for processed_value:', processedValue);
      console.log('Form Value for constantValue:', constantValue);
      console.log('Form Value for secondaryValue:', secondaryValue);

      // Ensure the multiValue array is long enough, and update the values
      if (multiValue.length > 1) {
        // multiValue[2].processed_value = processedValue; // Update processed_value at index 1
        multiValue[0].constantValue = constantValue;
        multiValue[0].value = primaryValue; // Update constantValue at index 0
        multiValue[1].value = secondaryValue; // Update secondaryValue at index 1
      } else {
        // If multi_value array doesn't have enough elements, ensure it's structured correctly
        // Ensure at least two objects are created with the correct structure
        if (multiValue.length === 0) {
          // multiValue.push({ processed_value: processedValue });
          multiValue.push({ constantValue: constantValue });
          multiValue.push({ secondaryValue: secondaryValue });
        } else if (multiValue.length === 1) {
          multiValue.push({  secondaryValue: secondaryValue });
        }
      }
      const fontSizeValue = `${this.createKPIWidget1.value.fontSize}px`;
      // Now update the tile with the updated multi_value
      const updateTile = {
        ...this.dashboard[this.editTileIndex1], // Keep existing properties
        formlist: this.createKPIWidget1.value.formlist,
        parameterName: this.createKPIWidget1.value.parameterName,
        groupBy: this.createKPIWidget1.value.groupBy,
        primaryValue: primaryValue,
        groupByFormat: this.createKPIWidget1.value.groupByFormat,
        themeColor: this.createKPIWidget1.value.themeColor,
        parameterNameRead: this.parameterNameRead,
        multi_value: multiValue, // Update multi_value with the modified array
        constantValue: constantValue, // Use the updated constantValue
        // processed_value: processedValue,
        secondaryValue: secondaryValue,
        fontSize: fontSizeValue,
        fontColor: this.createKPIWidget1.value.fontColor,
        dashboardIds:this.createKPIWidget1.value.dashboardIds,
        selectType:this.createKPIWidget1.value.selectType,
        filterParameter:this.createKPIWidget1.value.filterParameter,
        filterDescription:this.createKPIWidget1.value.filterDescription,
        selectedRangeType:this.createKPIWidget1.value.selectedRangeType,
        custom_Label:this.createKPIWidget1.value.custom_Label
      };

      // Log the updated details of the tile
      console.log('Updated Tile Details:', this.dashboard[this.editTileIndex1]);

      // Also update the grid_details array to reflect changes
      this.dashboard = [
        ...this.dashboard.slice(0, this.editTileIndex1),
        updateTile,
        ...this.dashboard.slice(this.editTileIndex1 + 1),
      ];
  
      console.log('Updated dashboard:', this.dashboard);
  
      // Update grid_details and emit the event
      this.all_Packet_store.grid_details[this.editTileIndex1] = { ...this.all_Packet_store.grid_details[this.editTileIndex1], ...updateTile };

      // Open the modal and perform additional actions
      this.grid_details = this.dashboard;
      console.log('this.grid_details check',this.grid_details)
      this.dashboardChange.emit(this.grid_details);
  
      if(this.grid_details)
        {
          this.updateSummary(this.all_Packet_store,'update_tile');
        }
      console.log('this.dashboard check from updateTile', this.dashboard);
      console.log("Updated all_Packet_store.grid_details:", this.all_Packet_store.grid_details);

      // Reset the editTileIndex after the update
      this.editTileIndex1 = null;
    } else {
      console.error("Edit index is null. Unable to update the tile.");
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
  SelectTypeSummary =[
    { value: 'NewTab', text: 'New Tab' },
    { value: 'Modal', text: 'Modal' },
  ]
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
  duplicateTile1(tile: any, index: number): void {
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
      grid_type: tile.grid_type || 'tile2',
      formlist: tile.formlist,
      parameterName: tile.parameterName,
      groupBy: tile.groupBy,
      themeColor: tile.themeColor || '#000', // Set a default if not present
      multi_value: tile.multi_value
        ? tile.multi_value.map((value: any) => ({ ...value })) // Deep copy
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
            processed_value: tile.processed_value || '',
          },
        ],
      groupByFormat: tile.groupByFormat,
    };

    // Add the cloned tile to the dashboard at the correct position
    this.dashboard.splice(index + 1, 0, clonedTile);

    console.log('this.dashboard after duplicating a tile:', this.dashboard);

    // Trigger change detection to ensure the UI updates
    this.cdr.detectChanges();

    // Update summary to handle the addition of the duplicated tile
    this.updateSummary('','add_tile');
  }

  onFontColorChange(event: Event): void {
    const color = (event.target as HTMLInputElement).value;
    this.createKPIWidget1.patchValue({ fontColor: color });
  }
}
