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
  selectedParameterValue: any;
  parameterNameRead: any;
  parsedParam: any;

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
      fontSize: [20, [Validators.required, Validators.min(8), Validators.max(72)]], // Default to 14px
      fontColor: ['#000000', Validators.required], 
      dashboardIds:[''],
      selectType:[''],
      filterParameter:[''],
      filterDescription:[''],
      selectedRangeType:[''],
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
        selectFromTime: this.createKPIWidget2.value.selectFromTime,
        selectToTime: this.createKPIWidget2.value.selectToTime,
        dashboardIds: this.createKPIWidget2.value.dashboardIds,
        selectType: this.createKPIWidget2.value.selectType,
        filterParameter: this.createKPIWidget2.value.filterParameter,
        filterDescription: this.createKPIWidget2.value.filterDescription,
        parameterNameRead: this.parameterNameRead,
        custom_Label:this.createKPIWidget2.value.custom_Label
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
      this.initializeTileFields2();
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
        custom_Label:tile.custom_Label

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
    this.updateSummary('','add_tile');
  }
  onFontColorChange(event: Event): void {
    const color = (event.target as HTMLInputElement).value;
    this.createKPIWidget2.patchValue({ fontColor: color });
  }

}
