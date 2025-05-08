import { ChangeDetectorRef, Component, EventEmitter, Injector, Input, NgZone, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormArray, FormControl, FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { APIService } from 'src/app/API.service';
import { LocationPermissionService } from 'src/app/location-permission.service';
import { SharedService } from 'src/app/pages/shared.service';

@Component({
  selector: 'app-title-config',

  templateUrl: './title-config.component.html',
  styleUrl: './title-config.component.scss'
})
export class TitleConfigComponent  implements OnInit{
  editTitleIndex: number | null;
  reloadEvent: any;
  createTitle:FormGroup
  isEditMode: boolean;
  selectedTile: any;
  @Input() modal :any
  @Output() update_PowerBoard_config =  new EventEmitter<any>();
  @Input() dashboard: any;
  grid_details: any;
  @Output() dashboardChange = new EventEmitter<any[]>();
  @Input()  all_Packet_store: any;
  @Output() send_all_Packet_store1 = new EventEmitter<any[]>();
  getLoggedUser: any;
  SK_clientID: any;
  listofDeviceIds: any;
  FormNames: any;
  IdsFetch: string[];
  formList: any;
  dashboardIdsList: any;
  p1ValuesSummary: any;
  dashboardListRead: any[];
  dashboardList: any[];
  dashboardIdList: string[] | PromiseLike<string[]>;
  projectDetailListRead: any[];
  projectDetailList: any[];
  reportStudioListRead: any[];
  reportStudioDetailList: any[];
  summaryIds: string[];
  dynamicIDArray: any;
  helpherObjCalender: any;
  formListTitles: any;
  projectListRead: any[];
  projectList: any[];

ngOnInit(){
  this.getLoggedUser = this.summaryConfiguration.getLoggedUserDetails()
  console.log('this.getLoggedUser check', this.getLoggedUser)
  // this.getWorkFlowDetails = this.summaryConfiguration.getLoggedUserDetails()
  // console.log('this.getLoggedUser check',this.getWorkFlowDetails)


  this.SK_clientID = this.getLoggedUser.clientID;
  console.log('this.SK_clientID check', this.SK_clientID)
  this.initializeTitleFields()
  this.dynamicData()
  this.dashboardIds(1)
}

constructor(private summaryConfiguration: SharedService,private api: APIService, private fb: UntypedFormBuilder, private cd: ChangeDetectorRef,
  private toast: MatSnackBar, private router: Router, private modalService: NgbModal, private route: ActivatedRoute, private cdr: ChangeDetectorRef, private locationPermissionService: LocationPermissionService, private devicesList: SharedService, private injector: Injector,
  private spinner: NgxSpinnerService,private zone: NgZone
){
  
}

ngOnChanges(changes: SimpleChanges): void {
  console.log('dashboardChange',this.all_Packet_store)
}
  openTitleModal( tile?: any, index?: number) {
 
    if (tile) {
      this.selectedTile = tile;
      this.editTitleIndex = index !== undefined ? index : null; // Store the index, default to null if undefined
      console.log('Tile Object:', tile); // Log the tile object

      // Initialize form fields and pre-select values
        this.initializeTitleFields()
      this.createTitle.patchValue({
        customLabel: tile.customLabel,
        fontSize:tile.fontSize,
        fontWeight:tile.fontWeight,
        textColor:tile.textColor,
        themeColor:tile.themeColor,
        fontFamily:tile.fontFamily,
        textAlign:tile.textAlign,
        ModuleNames:tile.ModuleNames,
        dashboardIds:tile.dashboardIds,
        selectType:tile.selectType






        



      });

      this.isEditMode = true; // Set to edit mode
    } else {
      this.selectedTile = null; // No tile selected for adding
      this.isEditMode = false; // Set to add mode
      this.createTitle.reset(); // Reset the form for new entry
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

    // Open the modal
  
    this.reloadEvent.next(true);
  }

  themes = [
    { color: "#338F74", selected: false },
    { color: "#D66E75", selected: false },
    { color: "#3C8AB0", selected: false },
    { color: "#C6A539", selected: false },
    { color: "#7E6FBF", selected: false }
  ];
  initializeTitleFields(): void {
    // Initialize the form group
    this.createTitle = this.fb.group({
    
      customLabel: ['', Validators.required], // Title content
      fontFamily: [''], // Font family
      fontSize: [''], // Font size
      textAlign: ['left'], // Text alignment
      themeColor: ['#3498db'], // Background color
      fontWeight:[''],
      textColor:['#FFFFFF'],
      ModuleNames:[''],
      dashboardIds:[''],
      selectType:['']
  

    });
  }
  


  validateAndSubmit() {
    if (this.createTitle.invalid) {
      // Mark all fields as touched to trigger validation messages
      Object.values(this.createTitle.controls).forEach(control => {
        if (control instanceof FormControl) {
          control.markAsTouched();
          control.updateValueAndValidity();
        } else if (control instanceof FormArray) {
          control.controls.forEach((group) => {
            (group as FormGroup).markAllAsTouched();
          });
        }
      });
  
      // Stop the function if the form is invalid
      return; // 🚨 Stop execution if the form is invalid
    }
  
    // Proceed with saving if the form is valid
    this.addTile('title');
    this.modal.dismiss();
  }
  
  
  
  
  validateAndUpdate() {
    if (this.createTitle.invalid) {
      // ✅ Mark all fields as touched to trigger validation messages
      Object.values(this.createTitle.controls).forEach(control => {
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
    this.updateTitle();
    this.modal.dismiss();
  }
  duplicateTitle(tile: any, index: number): void {
    // Validate the tile and dashboard before proceeding
    if (!tile || !this.dashboard || index < 0 || index >= this.dashboard.length) {
      console.error('Invalid tile or index for duplication');
      return;
    }
  
    // Clone the title tile with all its attributes
    const clonedTitle = {
      ...tile, // Copy all attributes from the original tile
      id: new Date().getTime(), // Generate a unique ID
      customLabel: tile.customLabel, // Append "Copy" to differentiate the title
      x: 0, // Reset position for the duplicated tile
      y: 0 // Reset position for the duplicated tile
    };
  
    // Add the cloned title to the dashboard at the correct position
    this.dashboard.splice(index + 1, 0, clonedTitle);
  
    // Log the updated dashboard for debugging
    console.log('this.dashboard after duplicating a title:', this.dashboard);
  
    // Trigger UI updates if necessary
    this.cdr.detectChanges();
  
    // Call updateSummary to reflect the addition of the duplicated title
    this.updateSummary('','add_tile')
  }
  updateSummary(data: any, arg2: any) {
    this.update_PowerBoard_config.emit({ data, arg2 });
  }

  // Editor styles
  nameContainerStyle = {
    themeColor: '' // Allows any custom color for the Name container
  };

  // Editor styles
  editorStyle = {
    fontFamily: 'Lato',
    fontSize: '14px',
    textAlign: 'left',
    themeColor: '#3498db'
  };
// Apply font style
toggleBold(): void {
  const currentWeight = this.createTitle.value.fontWeight;
  this.createTitle.patchValue({ fontWeight: currentWeight === 'bold' ? 'normal' : 'bold' });
}

toggleItalic(): void {
  const currentStyle = this.createTitle.value.fontStyle;
  this.createTitle.patchValue({
    fontStyle: currentStyle === 'italic' ? 'normal' : 'italic',
  });
}

updateCustomLabel(event: any) {
  const updatedValue = event.target.innerHTML; // Get the HTML content
  const selection = window.getSelection(); // Get the current selection
  const range = selection?.getRangeAt(0); // Get the current range

  this.createTitle.get('customLabel')?.setValue(updatedValue); // Update the form control value

  // Check if range and selection are defined before trying to set cursor position
  if (selection && range) {
    setTimeout(() => {
      range.setStart(range.endContainer, range.endOffset); // Move the cursor to the end
      range.setEnd(range.endContainer, range.endOffset);
      selection.removeAllRanges();
      selection.addRange(range);
    }, 0); // Wait for the DOM to update before setting the cursor position
  }
}

handleKeyDown(event: KeyboardEvent) {
  // Check if the pressed key is Backspace or Delete
  if (event.key === 'Backspace' || event.key === 'Delete') {
    const content = this.createTitle.value.customLabel;

    // Ensure that content is not empty
    if (!content && this.createTitle.get('customLabel')?.touched) {
      this.createTitle.get('customLabel')?.setValue('');
    }
  }
}



toggleUnderline(): void {
  const currentDecoration = this.createTitle.value.textDecoration;
  this.createTitle.patchValue({
    textDecoration: currentDecoration === 'underline' ? 'none' : 'underline',
  });
}
updateTextColor(event: Event): void {
  const color = (event.target as HTMLInputElement).value;
  this.createTitle.patchValue({ textColor: color });
}


  // Set text alignment
  setTextAlignment(alignment: string): void {
    this.createTitle.patchValue({ textAlign: alignment });
  }

  // Change font family
  onFontChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement | null;
    console.log('selectElement',selectElement)
    if (selectElement && selectElement.value) {
      this.createTitle.patchValue({ fontFamily: selectElement.value });
    }
  }

  // Change font size
  onFontSizeChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement | null;
    if (selectElement && selectElement.value) {
      this.createTitle.patchValue({ fontSize: selectElement.value });
    }
  }

  // Update background color
  updateNameContainerColor(event: Event): void {
    const inputElement = event.target as HTMLInputElement | null;
    if (inputElement && inputElement.value) {
      this.createTitle.patchValue({ themeColor: inputElement.value });
    }
  }

  // updateCustomLabel(event: Event): void {
  //   const inputValue = (event.target as HTMLElement).innerText;
    
  //   // Update the form control value without triggering Angular's change detection unnecessarily
  //   this.createTitle.patchValue({ customLabel: inputValue }, { emitEvent: false });
  // }
  addTile(key: any) {
 if (key === 'title') {
    const titleStyles = this.createTitle.value;
  
    const newTitle = {
      x: 0,
      y: 0,
      cols: 80,
      rows: 20,
      rowHeight: 100,
      colWidth: 100,
      fixedColWidth: true,
      fixedRowHeight: true,
      grid_type: 'title',

      customLabel: this.createTitle.value.customLabel, // User input for the title
      themeColor:this.createTitle.value.themeColor || '#3498db', // Background color
      fontFamily: this.createTitle.value.fontFamily, // Font family
      fontSize: this.createTitle.value.fontSize, // Font size
      textAlign: this.createTitle.value.textAlign, // Text alignment
      fontWeight: this.createTitle.value.fontWeight, // Bold
      textColor:this.createTitle.value.textColor || '#FFFFFF',
      ModuleNames:this.createTitle.value.ModuleNames,
      dashboardIds:this.createTitle.value.dashboardIds,
      selectType:this.createTitle.value.selectType
   

    };
  
    // Initialize the dashboard array if it doesn't exist
    if (!this.dashboard) {
      this.dashboard = [];
    }
  
    // Push the new title widget to the dashboard
    this.dashboard.push(newTitle);
  
    console.log('this.dashboard after adding new title widget', this.dashboard);
  
    // Trigger updates
    this.grid_details = this.dashboard;
    this.dashboardChange.emit(this.grid_details);
    if(this.grid_details)
      {
        this.updateSummary('','add_tile');
      }
  }
}
updateTitle() {
  if (this.editTitleIndex !== null) {
    console.log('this.editTitleIndex check:', this.editTitleIndex);
    console.log('Tile before update:', this.dashboard[this.editTitleIndex]);

    // Extract the updated values from the form
    const updatedTitle = {
      ...this.dashboard[this.editTitleIndex], // Retain existing properties
      customLabel: this.createTitle.value.customLabel ||'',
      themeColor: this.createTitle.value.themeColor ||'',
      fontFamily: this.createTitle.value.fontFamily ||'',
      fontSize: this.createTitle.value.fontSize ||'',
      textAlign: this.createTitle.value.textAlign ||'',
      fontWeight: this.createTitle.value.fontWeight ||'',
      textColor: this.createTitle.value.textColor ||'',
      ModuleNames:this.createTitle.value.ModuleNames ||'',
      dashboardIds:this.createTitle.value.dashboardIds ||'',
      selectType:this.createTitle.value.selectType ||''
    };

    // Update the dashboard
    this.dashboard[this.editTitleIndex] = updatedTitle;

    // Also update the grid_details array
    this.all_Packet_store.grid_details[this.editTitleIndex] = {
      ...this.all_Packet_store.grid_details[this.editTitleIndex], // Retain existing properties
      ...updatedTitle, // Update with new values
    };

    console.log('Updated Title Details:', this.dashboard[this.editTitleIndex]);
    console.log('Updated all_Packet_store.grid_details:', this.all_Packet_store.grid_details);
    this.grid_details = this.dashboard;
    console.log('this.grid_details check',this.grid_details)
    this.dashboardChange.emit(this.grid_details);

    if(this.grid_details)
      {
        this.updateSummary(this.all_Packet_store,'update_tile');
      }
    // Trigger updates
  // Open the modal for additional actions
  // Notify the system of the update

    // Reset the editTitleIndex
    this.editTitleIndex = null;
  } else {
    console.error('Edit index is null. Unable to update the tile.');
  }
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

SelectTypeSummary =[
  { value: 'NewTab', text: 'New Tab' },
  { value: 'Modal', text: 'Modal(Pop Up)' },
  { value: 'Same page Redirect', text: 'Same Page Redirect' },

  { value: 'drill down', text: 'Drill Down' },
]
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

  const selectedModule = this.createTitle.get('ModuleNames')?.value

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

}
