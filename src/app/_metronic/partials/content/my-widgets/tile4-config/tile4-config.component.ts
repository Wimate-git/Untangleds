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
  selector: 'app-tile4-config',

  templateUrl: './tile4-config.component.html',
  styleUrl: './tile4-config.component.scss'
})
export class Tile4ConfigComponent  implements OnInit{
getLoggedUser: any;

  createKPIWidget3:FormGroup
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
  private widgetIdCounter = 0;
  @ViewChild('calendarModal3') calendarModal3: any;
  selectedTabset: string = 'dataTab';
  listofDynamicParam: any;
  tooltip: string | null = null;
  @Input() dashboard: any;
  grid_details: any;
  @Output() dashboardChange = new EventEmitter<any[]>();
  @Output() update_PowerBoard_config =  new EventEmitter<any>();
  reloadEvent: any;
  isEditMode: boolean;
  selectedTile: any;
  editTileIndex3: number | null;
  @Input()  all_Packet_store: any;
  @Output() send_all_Packet_store1 = new EventEmitter<any[]>();
  showIdField = false;
  @Input() modal :any

ngOnInit(){
  this.getLoggedUser = this.summaryConfiguration.getLoggedUserDetails()
  console.log('this.getLoggedUser check', this.getLoggedUser)
  // this.getWorkFlowDetails = this.summaryConfiguration.getLoggedUserDetails()
  // console.log('this.getLoggedUser check',this.getWorkFlowDetails)


  this.SK_clientID = this.getLoggedUser.clientID;
  console.log('this.SK_clientID check', this.SK_clientID)
  this.initializeTileFields3()
  this.dynamicData()
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

initializeTileFields3() {
  this.createKPIWidget3 = this.fb.group({
    'formlist': ['', Validators.required],
    'parameterName': ['', Validators.required],
    'groupBy': ['', Validators.required],
    'primaryValue': ['', Validators.required],
    'groupByFormat': ['', Validators.required],
    'constantValue': [''],
    'CompareTile': ['', Validators.required],
    'WithCompareTile': ['', Validators.required],
    widgetid: [this.generateUniqueId()],
    'processed_value': ['', Validators.required],
    // selectedColor: [this.selectedColor]
    'themeColor': ['', Validators.required],
    fontSize: [14, [Validators.required, Validators.min(8), Validators.max(72)]], // Default to 14px
    fontColor: ['#000000', Validators.required], 
  })
}
generateUniqueId(): number {
  this.widgetIdCounter++;
  return Date.now() + this.widgetIdCounter; // Use timestamp and counter for uniqueness
}
// openModalCalender1() {
//   const modalRef = this.modalService.open(this.calendarModal3);
//   modalRef.result.then(
//     (result) => {
//       console.log('Closed with:', result);
//       this.handleModalClose(result); // Handle logic when modal closes
//     },
//     (reason) => {
//       console.log('Dismissed with:', reason);
//     }
//   );
// }
handleModalClose(selectedValue: string) {
  // Logic to handle what happens after the modal closes
  console.log('Handling post modal close logic with value:', selectedValue);
  // You can update your UI or state here based on the selectedValue
}
selectedSettingsTab(tab: string) {
  this.selectedTabset = tab;
}
showValues = [
  { value: 'sum', text: 'Sum' },
  { value: 'min', text: 'Minimum' },
  { value: 'max', text: 'Maximum' },
  { value: 'average', text: 'Average' },
  { value: 'latest', text: 'Latest' },
  { value: 'previous', text: 'Previous' },
  { value: 'DifferenceFrom-Previous', text: 'DifferenceFrom-Previous' },
  { value: 'DifferenceFrom-Latest', text: 'DifferenceFrom-Latest' },
  { value: '%ofDifferenceFrom-Previous', text: '%ofDifferenceFrom-Previous' },
  { value: '%ofDifferenceFrom-Latest', text: '%ofDifferenceFrom-Latest' },
  { value: 'Constant', text: 'Constant' },
  { value: 'Live', text: 'Live' },

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

        // Initialize the list with formFields labels
        this.listofDynamicParam = formFields.map((field: any) => {
          return {
            value: field.label,
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
onValueChange3(selectedValue: any): void {
  // Handle any logic here if needed when the value changes
  console.log(selectedValue); // Optional: log the selected value
}

selectValue3(value: string, modal: any) {
  console.log('Selected value:', value);

  // Set the value to the form control
  this.groupByFormatControl3.setValue(value);

  // Close the modal after selection
  this.closeModal(modal);
}
get groupByFormatControl3(): FormControl {
  return this.createKPIWidget3?.get('groupByFormat') as FormControl; // Cast to FormControl
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

addTile(key: any) {








  if (key === 'tile4') {
   const uniqueId = this.generateUniqueId();
   const newTile4 = {
     id: uniqueId,
     x: 0,
     y: 0,
     cols: 20,
     rows: 20,
     rowHeight: 200, // The height of each row in pixels
     colWidth: 200,  // The width of each column in pixels
     fixedColWidth: true,  // Enable fixed column widths
     fixedRowHeight: true,
     grid_type: "tile4",
     formlist: this.createKPIWidget3.value.formlist,
     parameterName: this.createKPIWidget3.value.parameterName,
     groupBy: this.createKPIWidget3.value.groupBy,

     groupByFormat: this.createKPIWidget3.value.groupByFormat,
     // selectedColor: this.createKPIWidget3.value.selectedColor ,
     themeColor: this.createKPIWidget3.value.themeColor,
     fontSize: `${this.createKPIWidget3.value.fontSize}px`,// Added fontSize
     fontColor: this.createKPIWidget3.value.fontColor,  
     // Default value, change this to whatever you prefer
     // You can also handle default value for this if needed

     // secondaryValue: this.createKPIWidget4.value.secondaryValue, 




     multi_value: [
       {
         value: this.createKPIWidget3.value.primaryValue,// Change primaryValue to value
         constantValue: this.createKPIWidget3.value.constantValue !== undefined && this.createKPIWidget3.value.constantValue !== null
           ? this.createKPIWidget3.value.constantValue
           : 0,
       },
       {
         value: this.createKPIWidget3.value.CompareTile, // Change secondaryValue to value

       },
       {
         value: this.createKPIWidget3.value.WithCompareTile,


       }, {

         processed_value: this.createKPIWidget3.value.processed_value || '',
       }
     ],
   };

   // Initialize this.dashboard if it hasn't been set yet
   if (!this.dashboard) {
     this.dashboard = [];
   }

   // Push the new tile to dashboard
   this.dashboard.push(newTile4);
   this.grid_details = this.dashboard;
   this.dashboardChange.emit(this.grid_details);
   if(this.grid_details)
     {
       this.updateSummary('add_tile');
     }

   console.log('this.dashboard after adding new tile', this.dashboard);

   
   this.createKPIWidget3.patchValue({
     widgetid: uniqueId // Set the ID in the form control
   });

  }
 }

 updateSummary(arg2:any){
  this.update_PowerBoard_config.emit(arg2)
}

openKPIModal3( tile?: any, index?: number) {
  console.log('tile checking',tile)
  if (tile) {
    this.selectedTile = tile;
    this.editTileIndex3 = index !== undefined ? index : null; // Store the index, default to null if undefined
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

    // Extract values for primaryValue, secondaryValue, and secondaryValueNested from parsed multi_value
    const primaryValue = parsedMultiValue[0]?.value || ''; // Assuming value corresponds to primaryValue
    const constantValue = parsedMultiValue[0]?.constantValue || 0; // Assuming constantValue is in the first item
    const CompareTile = parsedMultiValue[1]?.value || ''; // Assuming value corresponds to secondaryValue
    const WithCompareTile = parsedMultiValue[2]?.value || ''; // Assuming value corresponds to secondaryValueNested
    const parsedValue = parsedMultiValue[3]?.processed_value !== undefined ? parsedMultiValue[3].processed_value : 0;
    const fontSizeValue = tile.fontSize ? parseInt(tile.fontSize.replace('px', ''), 10) : 14; 
    // Initialize form fields and pre-select values
    this.initializeTileFields3();
    this.createKPIWidget3.patchValue({
      formlist: tile.formlist,
      parameterName: tile.parameterName,
      groupBy: tile.groupBy,
      primaryValue: primaryValue,  // Use extracted primaryValue
      groupByFormat: tile.groupByFormat,
      constantValue: constantValue,  // Use extracted constantValue
      CompareTile: CompareTile,  // Use extracted CompareTile value
      WithCompareTile: WithCompareTile,  // Use extracted WithCompareTile value
      processed_value: parsedValue,  // Use extracted parsedValue
      themeColor: tile.themeColor,
      fontSize: fontSizeValue, // Preprocessed fontSize value
      fontColor: tile.fontColor,
    });

    this.isEditMode = true; // Set to edit mode
  } else {
    this.selectedTile = null; // No tile selected for adding
    this.isEditMode = false; // Set to add mode
    this.createKPIWidget3.reset(); // Reset the form for new entry
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

  // Open modal and trigger necessary actions
  // this.modalService.open(content, { size: 'lg', ariaLabelledBy: 'modal-basic-title' });

  this.reloadEvent.next(true);
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


onFontColorChange(event: Event): void {
  const color = (event.target as HTMLInputElement).value;
  this.createKPIWidget3.patchValue({ fontColor: color });
}

selectedColor: string = '#66C7B7';

updateTile3() {
  if (this.editTileIndex3 !== null) {
    console.log('this.editTileIndex check', this.editTileIndex3);
    console.log('Tile checking for update:', this.dashboard[this.editTileIndex3]); // Log the tile being checked

    // Log the current details of the tile before update
    console.log('Current Tile Details Before Update:', this.dashboard[this.editTileIndex3]);
    let multiValueArray = this.dashboard[this.editTileIndex3].multi_value || [];
    const processedValue = this.createKPIWidget3.value.processed_value || ''; // Get updated processed_value from the form
    const constantValue = this.createKPIWidget3.value.constantValue || 0; // Get updated constantValue from the form
    const CompareTile = this.createKPIWidget3.value.CompareTile || '';
    const WithCompareTile = this.createKPIWidget3.value.WithCompareTile || '';
    const primaryValue = this.createKPIWidget3.value.primaryValue || '';


    if (multiValueArray.length > 1) {
      multiValueArray[3].processed_value = processedValue; // Update processed_value at index 1
      multiValueArray[0].constantValue = constantValue; // Update constantValue at index 0
      multiValueArray[1].value = CompareTile;
      multiValueArray[2].value = WithCompareTile

      // Update secondaryValue at index 1
    } else {
      // If multi_value array doesn't have enough elements, ensure it's structured correctly
      // Ensure at least two objects are created with the correct structure

      multiValueArray.push({ processed_value: processedValue });
      multiValueArray.push({ constantValue: constantValue });
      multiValueArray.push({ CompareTile: CompareTile });
      multiValueArray.push({ WithCompareTile: WithCompareTile })


    }
    const fontSizeValue = `${this.createKPIWidget3.value.fontSize}px`;
    // Update the properties of the tile with the new values from the form
    this.dashboard[this.editTileIndex3] = {
      ...this.dashboard[this.editTileIndex3], // Keep existing properties
      formlist: this.createKPIWidget3.value.formlist,
      parameterName: this.createKPIWidget3.value.parameterName,
      groupBy: this.createKPIWidget3.value.groupBy,
      primaryValue: this.createKPIWidget3.value.primaryValue,
      groupByFormat: this.createKPIWidget3.value.groupByFormat,
      constantValue: this.createKPIWidget3.value.constantValue,
      CompareTile: this.createKPIWidget3.value.CompareTile,
      WithCompareTile: this.createKPIWidget3.value.WithCompareTile,
      themeColor: this.createKPIWidget3.value.themeColor,
      fontSize: fontSizeValue,
      fontColor: this.createKPIWidget3.value.fontColor,
      // Include any additional properties if needed
    };

    // Log the updated details of the tile
    console.log('Updated Tile Details:', this.dashboard[this.editTileIndex3]);

    // Also update the grid_details array to reflect changes
    this.all_Packet_store.grid_details[this.editTileIndex3] = {
      ...this.all_Packet_store.grid_details[this.editTileIndex3], // Keep existing properties
      ...this.dashboard[this.editTileIndex3], // Update with new values
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
    this.editTileIndex3 = null;
  } else {
    console.error("Edit index is null. Unable to update the tile.");
  }
}
onColorChange3(event: Event) {
  const colorInput = event.target as HTMLInputElement;
  this.createKPIWidget3.get('themeColor')?.setValue(colorInput.value)

  console.log('Color changed:', this.createKPIWidget3.get('themeColor')?.value);
}
openModalCalender3() {
  const modalRef = this.modalService.open(this.calendarModal3);
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

toggleCheckbox3(theme: any): void {
  // Clear the 'selected' state for all themes
  this.themes.forEach(t => t.selected = false);  // Reset selection for all themes

  // Set the clicked theme as selected
  theme.selected = true;

  // Update the selected color based on the theme selection
  this.selectedColor = theme.color;

  // Optionally, update the form control with the selected color
  this.createKPIWidget3.get('themeColor')?.setValue(this.selectedColor);
}
get primaryValue3() {
  return this.createKPIWidget3?.get('primaryValue');

}
duplicateTile3(tile: any, index: number): void {
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
    grid_type: tile.grid_type || 'tile4',
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
