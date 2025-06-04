import { ChangeDetectorRef, Component, EventEmitter, Injector, Input, NgZone, OnInit, Output, SimpleChanges, TemplateRef } from '@angular/core';
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
  isSummaryDashboardSelected = false;
  columnVisisbilityFields: any;
  showColumnVisibility = false;


  SelectTypeSummary = [
    { value: 'NewTab', text: 'New Tab' },
    { value: 'Modal', text: 'Modal(Pop Up)' },
    { value: 'Same page Redirect', text: 'Same Page Redirect' },
  ];

  filteredSelectTypeSummary = [...this.SelectTypeSummary]; 
  allDeviceIds: any;
  userdetails: any;
  userClient: string;
  permissionsMetaData: any;
  permissionIdRequest: any;
  storeFormIdPerm: any;
  parsedPermission: any;
  readFilterEquation: any;
  summaryPermission: any;
  

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
  this.fetchUserPermissions(1)

  this.createTitle.get('selectType')?.valueChanges.subscribe(value => {
    this.showColumnVisibility = value === 'drill down';
  });
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
      selectType:this.createTitle.value.selectType ||''
   

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
  // { value: 'None', text: 'None' },
  { value: 'Forms', text: 'Forms' },
  { value: 'Dashboard', text: 'Dashboard' },
  // { value: 'Dashboard - Group', text: 'Dashboard - Group' },
  { value: 'Summary Dashboard', text: 'Summary Dashboard' },
  { value: 'Projects', text: 'Projects' },
  // { value: 'Project - Detail', text: 'Project - Detail' },
  // { value: 'Project - Group', text: 'Project - Group' },
  {value: 'Report Studio', text: 'Report Studio'},
  {value:'Calender', text:'Calender'}

]
async moduleSelection(event: any): Promise<void> {
  const selectedValue = event[0].value;

  // 🔁 Update flag for conditional UI logic (if still needed)
  this.isSummaryDashboardSelected = selectedValue === 'Summary Dashboard';

  // 🔁 Filter dropdown options based on selection
  if (selectedValue === 'Summary Dashboard') {
    // Show all options
    this.filteredSelectTypeSummary = [...this.SelectTypeSummary];
  } else {
    // Hide only the "Modal" option
    this.filteredSelectTypeSummary = this.SelectTypeSummary.filter(
      item => item.value !== 'Modal'
    );
  
    // Clear "Modal" if it was previously selected
    const currentType = this.createTitle.get('selectType')?.value;
    if (currentType === 'Modal') {
      // this.createTitle.get('selectType')?.setValue('');
    }
  }
  
  

  console.log('selectedValue checking', selectedValue);

  switch (selectedValue) {
    case 'None':
      console.log('No module selected');
      break;

    case 'Forms':
      console.log('Forms module selected');
      this.FormNames = this.listofDeviceIds;
      this.dynamicIDArray = [...this.FormNames];
      break;

    case 'Dashboard':
      console.log('Dashboard module selected');
      this.IdsFetch = await this.dashboardIdsFetching(1);
      this.dynamicIDArray = [...this.IdsFetch];
      break;

    case 'Summary Dashboard':
      console.log('Summary Dashboard module selected');
      this.summaryIds = await this.dashboardIds(1);
      console.log('Fetched P1 values:', this.summaryIds);
      this.dynamicIDArray = [...this.summaryIds];
      break;

    case 'Projects':
      console.log('Projects module selected');
      const projectList = await this.fetchDynamicLookupData(1);
      console.log('projectList checking', projectList);
      this.dynamicIDArray = [...projectList];
      break;

    case 'Report Studio':
      console.log('Report Studio module selected');
      const ReportStudioLookup = await this.reportStudioLookupData(1);
      this.dynamicIDArray = [...ReportStudioLookup];
      break;

    case 'Calender':
      console.log('Calender module selected');
      const CalenderLookup = await this.fetchCalender();
      console.log('CalenderLookup check', CalenderLookup);
      this.dynamicIDArray = [...CalenderLookup];
      break;

    default:
      console.log('Invalid selection');
      break;
  }
}


fetchDynamicFormDataConfig(value: any) {
  console.log("Data from lookup:", value);

  this.api
    .GetMaster(`${this.SK_clientID}#dynamic_form#${value}#main`, 1)
    .then((result: any) => {
      if (result && result.metadata) {
        const parsedMetadata = JSON.parse(result.metadata);
        console.log('parsedMetadata check dynamic', parsedMetadata);
        const formFields = parsedMetadata.formFields;
        console.log('formFields check from tile1', formFields);

        // Initialize the list with formFields labels, filtering out "heading" type and "Empty Placeholder"
        this.columnVisisbilityFields = formFields
          .filter((field: any) => {
            // Filter out fields with type "heading" or with an empty placeholder
            return field.type !== "heading" && field.type !== 'Empty Placeholder' && field.type !=='button' && field.type !=='table' && field.type !=='radio' && field.type !== 'checkbox' && field.type !== 'html code' && field.type !=='file' && field.type !=='range' && field.type !=='color' && field.type !=='password';
          })
          .map((field: any) => {
            console.log('field check', field);
            return {
              value: field.name,
              text: field.label
            };
          });

        // Include created_time and updated_time if available
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
        if (parsedMetadata.updated_time) {
          this.columnVisisbilityFields.push({
            value: `dynamic_table_values`,
            text: 'Dynamic Table Values' // You can customize the label here if needed
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
onSelectTypeChange() {
  const selectedType = this.createTitle.get('selectType')?.value;
  // this.showColumnVisibility = selectedType === 'drill down';
}

// SelectTypeSummary =[
//   { value: 'NewTab', text: 'New Tab' },
//   { value: 'Modal', text: 'Modal(Pop Up)' },
//   { value: 'Same page Redirect', text: 'Same Page Redirect' },

//   // { value: 'drill down', text: 'Drill Down' },
// ]
async dynamicData(receiveFormIds?: any) {
  console.log('receiveFormIds checlking from',receiveFormIds)
  try {
    const result: any = await this.api.GetMaster(this.SK_clientID + "#dynamic_form#lookup", 1);
    if (result) {
      console.log('forms checking', result);
      const helpherObj = JSON.parse(result.options);
      console.log('helpherObj checking', helpherObj);

      this.formList = helpherObj.map((item: [string]) => item[0]);
       this.allDeviceIds = this.formList.map((form: string) => ({ text: form, value: form }));
      console.log('allDeviceIds checking from',this.allDeviceIds)

      // ✅ Conditionally filter only if receiveFormIds has items
      if (Array.isArray(receiveFormIds) && receiveFormIds.length > 0) {
        const receivedSet = new Set(receiveFormIds);
        this.listofDeviceIds = this.allDeviceIds.filter((item: { value: any; }) => receivedSet.has(item.value));
      } else {
        console.log('i am checking forms from else cond',this.allDeviceIds)
        this.listofDeviceIds = this.allDeviceIds; // No filtering — use all

      }

      console.log('Final listofDeviceIds:', this.listofDeviceIds);
    }
  } catch (err) {
    console.log("Error fetching the dynamic form data", err);
  }
}

async fetchUserPermissions(sk: any) {
  try {
      this.userdetails = this.getLoggedUser.username;
      this.userClient = `${this.userdetails}#user#main`;
      console.log("this.tempClient from form service check", this.userClient);

      // Fetch user permissions
      const permission = await this.api.GetMaster(this.userClient, sk);
      
      if (!permission) {
          console.warn("No permission data received.");
          return null; // Fix: Returning null instead of undefined
      }

      console.log("Data checking from add form", permission);

      // Parse metadata
      const metadataString: string | null | undefined = permission.metadata;
      if (typeof metadataString !== "string") {
          console.error("Invalid metadata format:", metadataString);
          return null; // Fix: Ensuring the function returns a value
      }
      console.log('metadataString checking for',metadataString)

      try {
          this.permissionsMetaData = JSON.parse(metadataString);
          console.log("Parsed Metadata Object from location", this.permissionsMetaData);

          const permissionId = this.permissionsMetaData.permission_ID;
          console.log("permission Id check from Tile1", permissionId);
          this.permissionIdRequest = permissionId;
          console.log('this.permissionIdRequest checking',this.permissionIdRequest)
          this.storeFormIdPerm = this.permissionsMetaData.form_permission
          console.log('this.storeFormIdPerm check',this.storeFormIdPerm)
  

          if(this.permissionIdRequest=='All' && this.storeFormIdPerm=='All'){
            this.dynamicData()

          }else if(this.permissionIdRequest=='All' && this.storeFormIdPerm !=='All'){
            const StorePermissionIds = this.storeFormIdPerm
            this.dynamicData(StorePermissionIds)
          }
          else if (this.permissionIdRequest != 'All' && this.storeFormIdPerm[0] != 'All') {
            const readFilterEquationawait: any = await this.fetchPermissionIdMain(1, permissionId);
            console.log('main permission check from Tile1', readFilterEquationawait);
          
            if (Array.isArray(readFilterEquationawait)) {
              const hasAllPermission = readFilterEquationawait.some(
                (packet: any) => Array.isArray(packet.dynamicForm) && packet.dynamicForm.includes('All')
              );
          
              if (hasAllPermission) {
                const StorePermissionIds = this.storeFormIdPerm;
                this.dynamicData(StorePermissionIds);
              } else {
                // Match dynamicForm values with storeFormIdPerm
                const dynamicFormValues = readFilterEquationawait
                  .map((packet: any) => packet.dynamicForm?.[0]) // Get each dynamicForm value
                  .filter((v: string | undefined) => !!v);        // Remove undefined
          
                const matchedStoreFormIds = this.storeFormIdPerm.filter((id: string) =>
                  dynamicFormValues.includes(id)
                );
          
                console.log('matchedStoreFormIds:', matchedStoreFormIds);
          
                this.dynamicData(matchedStoreFormIds); // ⬅️ Use the filtered list
              }
            } else {
              console.warn('fetchPermissionIdMain did not return an array.');
            }
          }
          else if (this.permissionIdRequest !== 'All' && this.storeFormIdPerm[0] === 'All') {
            const readFilterEquationawait: any = await this.fetchPermissionIdMain(1, permissionId);
            console.log('main permission check from Tile1', readFilterEquationawait);
          
            if (Array.isArray(readFilterEquationawait)) {
              const hasAllPermission = readFilterEquationawait.some(
                (packet: any) => Array.isArray(packet.dynamicForm) && packet.dynamicForm.includes('All')
              );
          
              if (hasAllPermission) {
                // No filtering needed, show all
                this.dynamicData();
              } else {
                // Extract dynamicForm[0] from each packet
                const filteredFormIds = readFilterEquationawait
                  .map((packet: any) => packet.dynamicForm?.[0])  // Get first value from each dynamicForm
                  .filter((formId: string | undefined) => !!formId); // Remove undefined/null
          
                console.log('filteredFormIds (no "All" present):', filteredFormIds);
          
                this.dynamicData(filteredFormIds);
              }
            } else {
              console.warn('fetchPermissionIdMain did not return an array.');
            }
          }
          
          
          
          // **Fix: Ensure fetchPermissionIdMain is awaited**


       

      } catch (error) {
          console.error("Error parsing JSON:", error);
          return null; // Fix: Ensuring return on JSON parsing failure
      }
  } catch (error) {
      console.error("Error fetching user permissions:", error);
      return null; // Fix: Ensuring return on outer try-catch failure
  }
}

tooltipContent: string = 'Group data by time periods such as Today, Last 7 Days, This Month, or This Year to view filtered insights based on the selected range. For example, "This Year" refers to data from January to December of the current year.';

formTooltip: string = 'Select a form to view and analyze data specific to that form.';
parameterTooltip: string = 'Specify which form fields to analyze. The results will be based solely on your selection.';

formatTypeTooltip: string = 'Select a format to represent the output value appropriately—for example, Rupee for currency, Distance for measurements, or Percentage for ratios.';
customLabelTooltip: string = 'Provide a custom label to be displayed as the widget title.';
moduleNamesTooltip: string = 'Select the module that the user will be redirected to when the widget is clicked.';
selectTypeTooltip: string = 'Choose how the dashboard should open when the widget is clicked—whether in a new tab, a modal, or on the same page.';

redirectToTooltip: string = 'Select the specific dashboard or module the user should be redirected to when the widget is clicked.';
columnVisibilityTooltip: string = 'Select the fields to display in the drill-down table. Only the selected columns will be visible in the detailed view.';
redirectionType: string = 'Choose how the widget should open the target dashboard or module: "New Tab" opens it in a separate browser tab, "Modal (Pop Up)" displays it in a modal window, "Same Page Redirect" replaces the current view, and "Drill Down" shows detailed insights in Table.';
iconTooltip: string = 'The icon you select will be shown on the tile.';

iconFontSizeTooltip: string = 'Set the font size for the icon. The icon will scale up or down based on the value entered.';
fontTypeTooltip: string = 'Choose a font style (italic, bold, or underline) to apply to the title. The selected style will be reflected in the displayed title.';
fontAlignTooltip: string = 'Set the alignment of the title text. You can align it to the left, center, or right within the tile.';
fontStyleTooltip: string = 'Select a font style for the title text. The chosen font will be applied to how the title appears on the tile.';
fontSizeTooltip: string = 'Set the text size for the title shown on the tile.';
bgColorTooltip: string = 'Choose a background color for the widget title.';
textColorTooltip: string = 'Choose the color for the title text.';

titleInputTooltip: string = 'Enter a title to display on the widget. This text will appear as the main heading.';


async fetchPermissionIdMain(clientID: number, p1Value: string): Promise<void> {

  try {
    console.log("p1Value checking", p1Value);
    console.log("clientID checking", clientID);
    console.log("this.SK_clientID checking from permission", this.SK_clientID);

    const pk = `${this.SK_clientID}#permission#${p1Value}#main`;
    console.log(`Fetching main table data for PK: ${pk}`);

    const result: any = await this.api.GetMaster(pk, clientID);

    if (!result || !result.metadata) {
      console.warn("Result metadata is null or undefined.");
// Resolve even if no data is found
      return;
    }

    // Parse metadata
    this.parsedPermission = JSON.parse(result.metadata);
    console.log("Parsed permission metadata:", this.parsedPermission);

    this.readFilterEquation = JSON.parse(this.parsedPermission.dynamicEntries);
    console.log("this.readFilterEquation check", this.readFilterEquation);

    // Handling Dashboard Permissions
    this.summaryPermission = this.parsedPermission.summaryList || [];
    console.log("this.summaryPermission check", this.summaryPermission);

    // if (this.summaryPermission.includes("All")) {
    //   console.log("Permission is 'All'. Fetching all dashboards...");

return this.readFilterEquation
    // } else {
    //   console.log("Fetching specific dashboards...");
    //   const allData = await this.fetchCompanyLookupdata(1);
    //   this.dashboardData = allData.filter((dashboard: any) =>
    //     this.summaryPermission.includes(dashboard.P1)
    //   );
    //   console.log("Filtered Dashboards Data:", this.dashboardData);
    // }

    // Extract Permission List
 
    
// Resolve the Promise after all operations are complete
  } catch (error) {
    console.error(`Error fetching data for PK (${p1Value}):`, error);
// Reject in case of API failure
  }

}

  openRedirectionTypeInfoModal(stepperModal: TemplateRef<any>){
    this.modalService.open(stepperModal, {   backdrop: 'static',  // Disable closing on backdrop click
      keyboard: false    });

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
