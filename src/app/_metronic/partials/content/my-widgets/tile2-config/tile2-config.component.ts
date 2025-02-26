import { ChangeDetectorRef, Component, EventEmitter, Injector, Input, NgZone, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
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
  parsedParam: any;
  FormNames: any;
  IdsFetch: any;
  summaryIds: any;
  dynamicIDArray: any;
  dashboardListRead: any[];
  dashboardList: any[];
  dashboardIdList: string[] | PromiseLike<string[]>;
  projectDetailListRead: any[];
  projectDetailList: any[];
  reportStudioDetailList: any;
  reportStudioListRead: any[];
  helpherObjCalender: any;
  formListTitles: any;
  projectListRead: any[];
  projectList: any[];
  columnVisisbilityFields: any;
  shoRowData:boolean = false
  selectedText: any;

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
    const defaultTheme = { color: "linear-gradient(to right, #A1045A, #A1045A)", selected: true };
    this.selectedColor = defaultTheme.color;
    this.createKPIWidget1 = this.fb.group({
      formlist: ['', Validators.required],
      parameterName: ['', Validators.required],
  
      primaryValue: ['', Validators.required],
      groupByFormat: ['', Validators.required],
      constantValue: [''],
      secondaryValue: ['', Validators.required],
      widgetid: [this.generateUniqueId()],
      processed_value: [''],
      // selectedColor: [this.selectedColor],
      themeColor: [this.selectedColor, Validators.required],
      processed_value1:[''],
      fontSize: [20, [Validators.required, Validators.min(8), Validators.max(72)]], // Default to 14px
      fontColor: ['#000000', Validators.required], 
      dashboardIds:[''],
      selectType:[''],
      filterParameter: [[]], 
      filterDescription:[''],

      custom_Label:['',Validators.required],
      columnVisibility:[[]],
      ModuleNames:[''],
      formatType:['',Validators.required],
 

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
  
         themeColor: this.createKPIWidget1.value.themeColor,
         fontSize: `${this.createKPIWidget1.value.fontSize}px`,// Added fontSize
         fontColor: this.createKPIWidget1.value.fontColor,  // Ensure this is correctly assigned
         dashboardIds:this.createKPIWidget1.value.dashboardIds,
         selectType:this.createKPIWidget1.value.selectType,
         filterParameter:this.createKPIWidget1.value.filterParameter,
         filterDescription:this.createKPIWidget1.value.filterDescription,
         selectedRangeType:this.createKPIWidget1.value.selectedRangeType ||'',
         parameterNameRead: this.parameterNameRead ||'', 
         custom_Label:this.createKPIWidget1.value.custom_Label,
         ModuleNames:this.createKPIWidget1.value.ModuleNames,
         selectFromTime: this.createKPIWidget1.value.selectFromTime ||'',
         selectToTime: this.createKPIWidget1.value.selectToTime ||'',
         formatType: this.createKPIWidget1.value.formatType,
         columnVisibility:this.createKPIWidget1.value.columnVisibility,
     


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
      { color: "linear-gradient(to right, #4568DC, #B06AB3)", selected: false } , // Soft Blue to Purple




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
      { color: "linear-gradient(to right, #1D2671, #C33764)", selected: false }, 
    ];
    
  
  
  
    selectedColor: string = '#66C7B7';
    openKPIModal1(tile?: any, index?: number) {
      console.log('Tile checking from tile2:', tile);
    
      // Ensure the form is initialized before patching values
      this.initializeTileFields1();
    
      if (tile) {
        this.selectedTile = tile;
        this.editTileIndex1 = index !== undefined ? index : null;
        console.log('Tile Object:', tile);
    
        // Parse multi_value if it's a string
        let parsedMultiValue = [];
        if (typeof tile.multi_value === 'string') {
          try {
            parsedMultiValue = JSON.parse(tile.multi_value);
            console.log('Parsed multi_value:', parsedMultiValue);
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
    
        // Extract values safely
        const primaryValue = parsedMultiValue[0]?.value || '';
        const secondaryValue = parsedMultiValue[1]?.value || '';
        const parsedValue = parsedMultiValue[2]?.processed_value !== undefined ? parsedMultiValue[2].processed_value : 0;
        const fontSizeValue = tile.fontSize ? parseInt(tile.fontSize.replace('px', ''), 10) : 14;
    
        try {
          this.parsedParam = typeof tile.filterParameter === 'string' ? JSON.parse(tile.filterParameter) : tile.filterParameter;
          console.log('Parsed filterParameter:', this.parsedParam);
          tile.filterParameter = this.parsedParam;
        } catch (error) {
          console.error('Error parsing filterParameter:', error);
        }
    
        this.isEditMode = true;
    
        // ✅ Use `setTimeout` to ensure patching happens after form initialization
        setTimeout(() => {
          this.createKPIWidget1.patchValue({
            formlist: tile.formlist || '',
            parameterName: tile.parameterName || '',
            primaryValue: primaryValue,
            groupByFormat: tile.groupByFormat || '',
            constantValue: parsedMultiValue[0]?.constantValue || 0,
            secondaryValue: secondaryValue,
            processed_value: parsedValue,
            themeColor: tile.themeColor || '',
            fontSize: fontSizeValue,
            fontColor: tile.fontColor || '#000000',
            dashboardIds: tile.dashboardIds || '',
            selectType: tile.selectType || '',
            filterParameter: tile.filterParameter || [],
            filterDescription: tile.filterDescription || '',
            selectedRangeType: tile.selectedRangeType || '',
            custom_Label: tile.custom_Label || '',
            selectFromTime: tile.selectFromTime || '',
            selectToTime: tile.selectToTime || '',
            ModuleNames: tile.ModuleNames || '',
            columnVisibility: parsedColumnVisibility,
            formatType: tile.formatType || '',
          });
        }, 0);
    
      } else {
        // Handle case when no tile is provided (New Entry)
        this.selectedTile = null;
        this.isEditMode = false;
        this.createKPIWidget1.reset();
      }
    
      // Clear the 'selected' state for all themes
      this.themes.forEach(theme => {
        theme.selected = false;
      });
    
      // Find and set the matching theme
      const matchingTheme = this.themes.find(theme => theme.color === tile?.themeColor);
      if (matchingTheme) {
        matchingTheme.selected = true;
        console.log('Matching theme found and selected:', matchingTheme);
      }
    
      this.reloadEvent.next(true);
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
        const filterParameter = this.createKPIWidget1.get('filterParameter');
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
        const filterParameter = this.createKPIWidget1.get('filterParameter');
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
    this.createKPIWidget1.patchValue({
      filterDescription: `${this.selectedParameterValue}`,
    });
  
    // Manually trigger change detection to ensure the UI reflects the changes
    this.cdr.detectChanges();
  }
  selectValue(value: string, modal: any) {
    console.log('Selected value:', value);

    // Set the value to the form control
    this.groupByFormatControl1.setValue(value);

    // Close the modal after selection
    this.closeModal(modal);
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
  toggleCheckbox(themeOrEvent: any): void {
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
  
        primaryValue: primaryValue,
        groupByFormat: this.createKPIWidget1.value.groupByFormat,
        themeColor: this.createKPIWidget1.value.themeColor,
        parameterNameRead: this.parameterNameRead,
        multi_value: multiValue, // Update multi_value with the modified array
        constantValue: constantValue, // Use the updated constantValue
        // processed_value: processedValue,
        secondaryValue: secondaryValue,
        fontSize: fontSizeValue,
        fontColor: this.createKPIWidget1.value.fontColor ||'',
        dashboardIds:this.createKPIWidget1.value.dashboardIds ||'',
        selectType:this.createKPIWidget1.value.selectType ||'',
        filterParameter:this.createKPIWidget1.value.filterParameter ||'',
        filterDescription:this.createKPIWidget1.value.filterDescription ||'',
        selectedRangeType:this.createKPIWidget1.value.selectedRangeType ||'',
        custom_Label:this.createKPIWidget1.value.custom_Label ||'',
        selectFromTime: this.createKPIWidget1.value.selectFromTime ||'',
        selectToTime: this.createKPIWidget1.value.selectToTime ||'',

        ModuleNames:this.createKPIWidget1.value.ModuleNames ||'',
        columnVisibility:this.createKPIWidget1.value.columnVisibility ||'',
        formatType: this.createKPIWidget1.value.formatType ||'',
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

    { value: 'Constant', text: 'Constant' },
   
    { value: 'Count', text: 'Count' },
    { value: 'Count Dynamic', text: 'Count Dynamic' },
    { value: 'Equation', text: 'Equation' },
    { value: 'Count MultiplePram', text: 'Count Multiple Parameter' },
    { value: 'Sum MultiplePram', text: 'Sum Multiple Parameter' },
    { value: 'Average Multiple Parameter', text: 'Average Multiple Parameter' },
    { value: 'sumArray', text: 'SumArray' },
    { value: 'Advance Equation', text: 'Advance Equation' },
    { value: 'sum_difference', text: 'Sum Difference' },
    { value: 'sum_difference', text: 'Sum Difference' },
    { value: 'distance_sum', text: 'Distance Sum' },
    
    

    

  ]
  parameterValue(event:any){
    console.log('event for parameter check',event)
    this.parameterNameRead = event[0].text

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
    { value: 'Last 60 Days', text: 'Last 60 Days' },
    { value: 'Last 90 Days', text: 'Last 90 Days' },
    { value: 'Last 180 Days', text: 'Last 180 Days' },
    { value: 'Last 2 Years', text: 'Last 2 Year' },
    { value: 'any', text: 'any' },
 
 
 
  ]
  SelectTypeSummary =[
    { value: 'NewTab', text: 'New Tab' },
    { value: 'Modal', text: 'Modal(Pop Up)' },
    { value: 'Same page Redirect', text: 'Same page Redirect' },

    { value: 'drill down', text: 'drill down' },
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
  
    const selectedModule = this.createKPIWidget1.get('ModuleNames')?.value
  
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
    if (this.createKPIWidget1.invalid) {
      this.markFormGroupTouched(this.createKPIWidget1);
      return; // 🚨 Stop execution if the form is invalid
    }
  
    // ✅ Proceed with saving only if form is valid
    this.addTile('tile');
    this.modal.dismiss();
  }
  
  /**
   * Recursively marks all form controls, groups, and arrays as touched
   */
  private markFormGroupTouched(formGroup: FormGroup | FormArray) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      
      if (control instanceof FormControl) {
        control.markAsTouched();
        control.updateValueAndValidity();
      } else if (control instanceof FormGroup || control instanceof FormArray) {
        this.markFormGroupTouched(control); // ✅ Recursively mark nested groups/arrays
      }
    });
  }
  
  
}
