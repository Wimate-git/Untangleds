import { ChangeDetectorRef, Component, EventEmitter, Injector, Input, NgZone, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
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

  initializeTileFields2() {
    this.createKPIWidget2 = this.fb.group({
      'formlist': ['', Validators.required],
      'parameterName': ['', Validators.required],
      'groupBy': ['', Validators.required],
      'primaryValue': ['', Validators.required],
      'groupByFormat': ['', Validators.required],
      'constantValue': [''],
      'secondaryValue': ['', Validators.required],
      'secondaryValueNested': [''],
      widgetid: [this.generateUniqueId()],
      'processed_value': [''],
      'processed_value1': [''],
      'processed_value2': [''],
      // selectedColor: [this.selectedColor]'
      'themeColor': ['', Validators.required],
      fontSize: [14, [Validators.required, Validators.min(8), Validators.max(72)]], // Default to 14px
      fontColor: ['#000000', Validators.required], 
      dashboardIds:[''],
      selectType:['']
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
       cols: 20,
       rows: 20,
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
         this.updateSummary('add_tile');
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
  updateSummary(arg2:any){
    this.update_PowerBoard_config.emit(arg2)
  
  
  
  }
  updateTile2(key:any) {
    if (this.editTileIndex2 !== null) {
      console.log('this.editTileIndex check', this.editTileIndex2);
      console.log('Tile checking for update:', this.dashboard[this.editTileIndex2]); // Log the tile being checked

      // Log the current details of the tile before update
      console.log('Current Tile Details Before Update:', this.dashboard[this.editTileIndex2]);
      let multiValueArray = this.dashboard[this.editTileIndex2].multi_value || [];
      const processedValue = this.createKPIWidget2.value.processed_value || ''; // Get updated processed_value from the form
      const constantValue = this.createKPIWidget2.value.constantValue || 0; // Get updated constantValue from the form
      const secondaryValue = this.createKPIWidget2.value.secondaryValue || '';
      const secondaryValueNested = this.createKPIWidget2.value.secondaryValueNested || '';
      const primaryValue = this.createKPIWidget2.value.primaryValue || '';
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
      const fontSizeValue = `${this.createKPIWidget2.value.fontSize}px`;
      // Update the properties of the tile with the new values from the form
      this.dashboard[this.editTileIndex2] = {
        ...this.dashboard[this.editTileIndex2], // Keep existing properties
        formlist: this.createKPIWidget2.value.formlist,
        parameterName: this.createKPIWidget2.value.parameterName,
        groupBy: this.createKPIWidget2.value.groupBy,
        primaryValue: this.createKPIWidget2.value.primaryValue,
        groupByFormat: this.createKPIWidget2.value.groupByFormat,
        constantValue: this.createKPIWidget2.value.constantValue,
        secondaryValue: this.createKPIWidget2.value.secondaryValue,
        secondaryValueNested: this.createKPIWidget2.value.secondaryValueNested,
        themeColor: this.createKPIWidget2.value.themeColor,
        fontSize: fontSizeValue,
        fontColor: this.createKPIWidget2.value.fontColor,
        dashboardIds:this.createKPIWidget2.value.dashboardIds,

        selectType:this.createKPIWidget2.value.selectType,
       

        // Include any additional properties if needed
      };

      // Log the updated details of the tile
      console.log('Updated Tile Details:', this.dashboard[this.editTileIndex2]);

      // Also update the grid_details array to reflect changes
      this.all_Packet_store.grid_details[this.editTileIndex2] = {
        ...this.all_Packet_store.grid_details[this.editTileIndex2], // Keep existing properties
        ...this.dashboard[this.editTileIndex2], // Update with new values
      };

      this.grid_details = this.dashboard;
     
      this.dashboardChange.emit(this.grid_details);
  
      if(this.grid_details)
        {
          this.updateSummary('update_tile')
        }
   
      console.log('his.dashboard check from updateTile', this.dashboard)

      console.log("Updated all_Packet_store.grid_details:", this.all_Packet_store.grid_details);


      // Reset the editTileIndex after the update
      this.editTileIndex2 = null;
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

  onColorChange2(event: Event) {
    const colorInput = event.target as HTMLInputElement;
    this.createKPIWidget2.get('themeColor')?.setValue(colorInput.value)

    console.log('Color changed:', this.createKPIWidget2.get('themeColor')?.value);
  }
  onValueChange2(selectedValue: any): void {
    // Handle any logic here if needed when the value changes
    console.log(selectedValue); // Optional: log the selected value
  }
  toggleCheckbox2(theme: any): void {
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
    { color: "linear-gradient(to right, #EECDA3, #EF629F)", selected: false }  // Warm Orange to Yellow
  ];
  

edit_Tile3(tile?: any, index?: number) {
    console.log('tile checking',tile)
    if (tile) {
      this.selectedTile = tile;
      this.editTileIndex2 = index !== undefined ? index : null; // Store the index, default to null if undefined
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

      // Extract values for primaryValue, secondaryValue, and secondaryValueNested from parsed multi_value
      const primaryValue = parsedMultiValue[0]?.value || ''; // Assuming value corresponds to primaryValue
      const constantValue = parsedMultiValue[0]?.constantValue || 0; // Assuming constantValue is in the first item
      const secondaryValue = parsedMultiValue[1]?.value || ''; // Assuming value corresponds to secondaryValue
      const secondaryValueNested = parsedMultiValue[2]?.value || ''; // Assuming value corresponds to secondaryValueNested
      const parsedValue = parsedMultiValue[3]?.processed_value !== undefined ? parsedMultiValue[3].processed_value : 0;
      const fontSizeValue = tile.fontSize ? parseInt(tile.fontSize.replace('px', ''), 10) : 14; 
  
      // Initialize form fields and pre-select values
      this.initializeTileFields2();
      this.createKPIWidget2.patchValue({
        formlist: tile.formlist,
        parameterName: tile.parameterName,
        groupBy: tile.groupBy,
        primaryValue: primaryValue, // Set the primaryValue
        groupByFormat: tile.groupByFormat,
        constantValue: constantValue, // Set the constantValue
        secondaryValue: secondaryValue, // Set the secondaryValue
        secondaryValueNested: secondaryValueNested,// Set the secondaryValueNested
        processed_value: parsedValue,
        themeColor: tile.themeColor,
        fontSize: fontSizeValue, // Preprocessed fontSize value
        fontColor: tile.fontColor,
        dashboardIds:tile.dashboardIds,
        selectType:tile.selectType

      });

      this.isEditMode = true; // Set to edit mode
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
  handleModalClose(selectedValue: string) {
    // Logic to handle what happens after the modal closes
    console.log('Handling post modal close logic with value:', selectedValue);
    // You can update your UI or state here based on the selectedValue
  }
  selectedSettingsTab(tab: string) {
    this.selectedTabset = tab;
  }
  openModalCalender2() {
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

  selectValue2(value: string, modal: any) {
    console.log('Selected value:', value);

    // Set the value to the form control
    this.groupByFormatControl2.setValue(value);

    // Close the modal after selection
    this.closeModal(modal);
  }

  get groupByFormatControl2(): FormControl {
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
    this.updateSummary('add_tile');
  }
  onFontColorChange(event: Event): void {
    const color = (event.target as HTMLInputElement).value;
    this.createKPIWidget2.patchValue({ fontColor: color });
  }

}
