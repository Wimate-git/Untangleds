import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Injector, Input, NgZone, OnInit, Output, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { APIService } from 'src/app/API.service';
import { LocationPermissionService } from 'src/app/location-permission.service';
import { SharedService } from 'src/app/pages/shared.service';
import { ColDef } from 'ag-grid-community';

@Component({
  selector: 'app-table-widget-config',

  templateUrl: './table-widget-config.component.html',
  styleUrl: './table-widget-config.component.scss'
})
export class TableWidgetConfigComponent implements OnInit,AfterViewInit{
  table: { columnDefs: ColDef[]; rows: any[] } = {
    columnDefs: [], // Initialize with an empty column definition array
    rows: [] // Initialize with an empty rows array
  };

  @Input() modal :any
  @Input() dashboard: any;
  @Output() dashboardChange = new EventEmitter<any[]>();
  @Output() update_PowerBoard_config =  new EventEmitter<any>();

  @Input()  all_Packet_store: any;
  @Output() send_all_Packet_store = new EventEmitter<any[]>();
  @Input()isGirdMoved: any;
  formList: any;
  listofDeviceIds: any;
  getLoggedUser: any;
  SK_clientID: any;
  listofDynamicParam: any;
  parameterNameRead: any;
  createKPIWidget: FormGroup;
  isEditMode: boolean;
  widgetIdCounter: any;
  grid_details: any;
  hideRowDataField: boolean = true;
  editTileIndex: number | null;
  selectedTile: any;
  themes: any;
  userIsChanging: boolean = false;
  tooltip: string | null = null;
  @ViewChild('calendarModal') calendarModal: any;
  selectedTabset: string = 'dataTab';
  dynamicParamMap = new Map<number, any[]>();
  selectedParameterValue: string;
  all_fields: any;
  dynamicConditions: FormGroup[] = [];
  showRemoveButton:boolean = false;
  dynamicFields: any;
  selectedParameterValueDupli: { value: any; text: any; };
  selectedParameterValueDupl: string;


  ngOnInit(): void {
    this.getLoggedUser = this.summaryConfiguration.getLoggedUserDetails()
    console.log('this.getLoggedUser check', this.getLoggedUser)
    // this.getWorkFlowDetails = this.summaryConfiguration.getLoggedUserDetails()
    // console.log('this.getLoggedUser check',this.getWorkFlowDetails)


    this.SK_clientID = this.getLoggedUser.clientID;
    console.log('this.SK_clientID check', this.SK_clientID)
this.initializeTileFields()
    this.dynamicData()

    // this.dashboardIds(1)
  }
  constructor(private summaryConfiguration: SharedService, private api: APIService, private fb: UntypedFormBuilder, private cd: ChangeDetectorRef,
    private toast: MatSnackBar, private router: Router, private modalService: NgbModal, private route: ActivatedRoute, private cdr: ChangeDetectorRef, private locationPermissionService: LocationPermissionService, private devicesList: SharedService, private injector: Injector,
    private spinner: NgxSpinnerService,private zone: NgZone
  ){


  }
  ngAfterViewInit(): void {
    this.addCondition();
  }

  initializeTileFields(): void {
    // Initialize the form group
    this.createKPIWidget = this.fb.group({

      // all_fields:new FormArray([]),
      conditions: this.fb.array([]), 
      formlist: ['', Validators.required],
      form_data_selected: ['', Validators.required],
    
      custom_Label:['',Validators.required],
      groupByFormat: ['', Validators.required],
      rowData:[''],
      filterParameter: [[]], // Initialize as an array to handle multiple or single values
      filterDescription: [''],
      filterParameter1:[''],
      // custom_Label1:[''],
      filterDescription1:[''],
  
    });
  }


  // Handle dynamic parameter value changes
  get conditions(): FormArray<FormGroup> {
    return this.createKPIWidget.get('conditions') as FormArray<FormGroup>;
  }
  onAdd1(): void {
    // Capture the selected parameters (which will be an array of objects with text and value)
    const selectedParameters = this.selectedParameterValueDupli;
  
    console.log('selectedParameters checking', selectedParameters);
  
    if (Array.isArray(selectedParameters)) {
      // Format the selected parameters to include the updated structure
      this.selectedParameterValueDupl = selectedParameters
        .map(param => `\${${param.text}.${param.value}}`) // Format as "${Label.Value}"
        .join(' '); // Join all parameters with a space
    } else if (selectedParameters) {
      // If only one parameter is selected, format it directly
      this.selectedParameterValueDupl = `\${${selectedParameters.text}.${selectedParameters.value}}`; // Single parameter format
    } else {
      console.warn('No parameters selected or invalid format:', selectedParameters);
      this.selectedParameterValueDupl = ''; // Fallback in case of no selection
    }
  
    console.log('this.selectedParameterValueDupl check', this.selectedParameterValueDupl);
  
    // Update the form control value for filterDescription1 with the formatted string
    this.createKPIWidget.patchValue({
      filterDescription1: `${this.selectedParameterValueDupl}`,
    });
  
    // Manually trigger change detection to ensure the UI reflects the changes
    this.cdr.detectChanges();
  }
  







  selectValue(value: string, modal: any) {
    console.log('Selected value:', value);

    // Set the value to the form control
    this.groupByFormatControl.setValue(value);

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
  get groupByFormatControl(): FormControl {
    return this.createKPIWidget.get('groupByFormat') as FormControl; // Cast to FormControl
  }
  addTile(key: any) {
    console.log('Selected Form Data:', this.createKPIWidget.value.form_data_selected);
  
    // Accessing FormArray values directly
    const conditionsArray = this.conditions.controls.map(control => {
      if (control instanceof FormGroup) {
        return control.value; // Access the value of the FormGroup
      }
      return null; // Handle cases where the control is not a FormGroup (optional)
    }).filter(value => value !== null); // Remove null values if necessary
    console.log('conditionsArray check',conditionsArray)
  
    const newTile = {
      x: 0,
      y: 0,
      rows: 13,
      cols: 25,
      rowHeight: 100,
      colWidth: 100,
      fixedColWidth: true,
      fixedRowHeight: true,
      grid_type: 'TableWidget',
      formlist: this.createKPIWidget.value.formlist,
      tableWidget_Config: this.createKPIWidget.value.form_data_selected,
      custom_Label: this.createKPIWidget.value.custom_Label,
      rowData: this.createKPIWidget.value.rowData,
      groupByFormat: this.createKPIWidget.value.groupByFormat,
      conditions: conditionsArray, // Use the updated conditions array
      filterParameter1:this.createKPIWidget.value.filterParameter1,
      // custom_Label1:this.createKPIWidget.value.custom_Label1,
      filterDescription1:this.createKPIWidget.value.filterDescription1,
      // PredefinedScripts:this.createKPIWidget.value.PredefinedScripts

    };
  
    if (!this.dashboard) {
      this.dashboard = [];
    }
  
    this.dashboard.push(newTile);
    console.log('Updated Dashboard:', this.dashboard);
  
    this.grid_details = this.dashboard; // Update grid details
    console.log('Grid Details:', this.grid_details);
  
    this.dashboardChange.emit(this.grid_details); // Emit updated dashboard
    if (this.grid_details) {
      this.updateSummary('', 'add_table');
      this.cdr.detectChanges(); // Ensure UI updates
    }
  }
  
  
  updateSummary(data: any, arg2: any) {
    this.update_PowerBoard_config.emit({ data, arg2 });
  }
  generateUniqueId(): number {
    this.widgetIdCounter++;
    return Date.now() + this.widgetIdCounter; // Use timestamp and counter for uniqueness
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
  selectFormParams(event: any) {
    if (event && event[0] && event[0].data) {
      const selectedText = event[0].data.text; 
      if(this.userIsChanging){
        // alert("check")
        this.createKPIWidget.get("form_data_selected")?.setValue('')
      }

       // Adjust based on the actual structure
      console.log('Selected Form Text:', selectedText);

      if (selectedText) {
        this.fetchDynamicFormData(selectedText);
      }
      this.userIsChanging = false
    } else {
      console.error('Event data is not in the expected format:', event);
      this.userIsChanging =  false
    }
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
              value: `created_time`,
              text: 'Created Time' // You can customize the label here if needed
            });
          }
          
          if (parsedMetadata.updated_time) {
            this.listofDynamicParam.push({
              value: `updated_time`,
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
  parameterValue(event: any) {
    console.log('event for parameter check', event);
    
    // Extract selected texts
    const selectedTexts = event.value.map((item: any) => item.text);
    console.log('selectedTexts check',selectedTexts)
  
    // Dynamically create column definitions for ag-grid
    this.table.columnDefs = this.createColumnDefs(selectedTexts);
  }
  


  createColumnDefs(selectedFields: string[]): ColDef[] {
    const columns: ColDef[] = [];
    
    // Add a static 'Form Filter' column
    columns.push({
      headerName: 'Form Filter',
      field: 'formFilter',
      flex: 1,
      filter: true,
      minWidth: 150,
      hide: true, // Initially hidden
    });
  
    // Dynamically add columns based on selected fields
    selectedFields.forEach((field, index) => {
      columns.push({
        headerName: field, // Use the text value from the dropdown
        field: `field_${index}`, // Unique field name
        flex: 1,
        filter: true,
        sortable: true,
        resizable: true,
        minWidth: 150,
      });
    });
  
    return columns;
  }
  openTableModal(tile: any, index: number) {
    console.log('Index checking:', index); // Log the index
    
    if (tile) {
      this.selectedTile = tile;
      this.editTileIndex = index !== undefined ? index : null;
      console.log('this.editTileIndex checking from openkpi', this.editTileIndex); // Store the index, default to null if undefined
      console.log('Tile Object:', tile); // Log the tile object
  
      // Parse tableWidget_Config if it is a string
      let parsedTableWidgetConfig = [];
      if (typeof tile.tableWidget_Config === 'string') {
        try {
          parsedTableWidgetConfig = JSON.parse(tile.tableWidget_Config);
          console.log('Parsed tableWidget_Config:', parsedTableWidgetConfig);
          const textValues = parsedTableWidgetConfig.map((item: { text: any }) => item.text);
          console.log('Extracted Text Values:', textValues);
          this.table.columnDefs = this.createColumnDefs(textValues);
        } catch (error) {
          console.error('Error parsing tableWidget_Config:', error);
        }
      } else {
        parsedTableWidgetConfig = tile.tableWidget_Config;
      }
  
      // Parse conditions if it is a string
      let parsedConditions = [];
      if (typeof tile.conditions === 'string') {
        try {
          parsedConditions = JSON.parse(tile.conditions);
          console.log('Parsed conditions:', parsedConditions);
        } catch (error) {
          console.error('Error parsing conditions:', error);
        }
      } else {
        parsedConditions = tile.conditions;
      }
  
      // Parse filterParameter1 if it is a string
      let parsedFilterParameter1 = [];
      if (typeof tile.filterParameter1 === 'string') {
        try {
          parsedFilterParameter1 = JSON.parse(tile.filterParameter1);
          console.log('Parsed filterParameter1:', parsedFilterParameter1);
        } catch (error) {
          console.error('Error parsing filterParameter1:', error);
        }
      } else {
        parsedFilterParameter1 = tile.filterParameter1;
      }
  
      // Set parsedConditions into FormArray
      const formArray = this.conditions;
      formArray.clear(); // Clear existing FormArray controls
      parsedConditions.forEach((condition: any, i: number) => {
        formArray.push(this.fb.group({
          columnLabel: [condition.columnLabel || ''],
          filterParameter: [condition.filterParameter || []],
          filterDescription: [condition.filterDescription || ''],
          PredefinedScripts:[condition.PredefinedScripts || '']

        }));
      });
  
      console.log('FormArray after readback:', formArray.value);
  
      // Patch other form values
      this.createKPIWidget.patchValue({
        formlist: tile.formlist,
        form_data_selected: parsedTableWidgetConfig,
        groupByFormat: tile.groupByFormat,
        custom_Label: tile.custom_Label,
        filterParameter1: parsedFilterParameter1, // Parsed array
        filterDescription1: tile.filterDescription1,
        // custom_Label1: tile.custom_Label1,
      });
  
      this.isEditMode = true; // Set to edit mode
    } else {
      this.selectedTile = null; // No tile selected for adding
      this.isEditMode = false; // Set to add mode
      this.createKPIWidget.reset(); // Reset the form for new entry
      this.conditions.clear(); // Clear the FormArray
    }
  
    // Clear the 'selected' state for all themes
    this.themes.forEach((theme: { selected: boolean }) => {
      theme.selected = false; // Deselect all themes
    });
  
    // Find the theme that matches the tile's themeColor
    const matchingTheme = this.themes.find((theme: { color: any }) => theme.color === tile?.themeColor);
  
    // If a matching theme is found, set it as selected
    if (matchingTheme) {
      matchingTheme.selected = true;
      console.log('Matching theme found and selected:', matchingTheme);
    }
  }
  
  
  
  showTooltip(item: string) {
    this.tooltip = item;
  }

  hideTooltip() {
    this.tooltip = null;
  }

  updateTile(key: any) {
    console.log('Key checking from update:', key);
    this.isGirdMoved = true;
  
    if (this.editTileIndex !== null && this.editTileIndex >= 0) {
      console.log('this.editTileIndex check:', this.editTileIndex);
      console.log('Tile checking for update:', this.dashboard[this.editTileIndex]);
  
      // Prepare the updated conditions array from FormArray
      const updatedConditions = this.conditions.controls.map(control => {
        const condition = control.value; // Access the value of each FormGroup in the FormArray
        return {
          columnLabel: condition.columnLabel,
          filterParameter: condition.filterParameter,
          filterDescription: condition.filterDescription,
          PredefinedScripts:condition.PredefinedScripts
        };
      });
  
      console.log('Updated conditions:', updatedConditions);
  
      // Prepare the updated tile object
      const updatedTile = {
        ...this.dashboard[this.editTileIndex], // Keep existing properties
        formlist: this.createKPIWidget.value.formlist,
        tableWidget_Config: this.createKPIWidget.value.form_data_selected,
        groupByFormat: this.createKPIWidget.value.groupByFormat,
        custom_Label: this.createKPIWidget.value.custom_Label,
        conditions: updatedConditions, // Directly assign the array
        filterParameter1: this.createKPIWidget.value.filterParameter1, // Parsed array
        filterDescription1: this.createKPIWidget.value.filterDescription1,
        // custom_Label1: this.createKPIWidget.value.custom_Label1,
      };
  
      console.log('Updated tile:', updatedTile);
  
      // Update the dashboard array with the updated tile
      this.dashboard = [
        ...this.dashboard.slice(0, this.editTileIndex),
        updatedTile,
        ...this.dashboard.slice(this.editTileIndex + 1),
      ];
  
      console.log('Updated dashboard:', this.dashboard);
  
      // Update grid_details and emit the event
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
        this.updateSummary(this.all_Packet_store, 'update_table');
      }
  
      // Reset editTileIndex after the update
      this.editTileIndex = null;
    } else {
      console.error('Edit index is null or invalid. Unable to update the tile.');
    }
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
  
  setUserSatus(){
    this.userIsChanging = true
    this.cdr.detectChanges()
  }

  selectedSettingsTab(tab: string) {
    this.selectedTabset = tab;
    // console.log()
  }

  getDynamicParams(index: number): any[] {
    return this.dynamicParamMap.get(index) || [];
  }
  dynamicparameterValue(event: any): void {
    console.log('Event check for dynamic param:', event);
    // this.selectedTexts = event.map((item: any) => {
    //   if (item && item.data && item.data.text) {
    //     return item.data.text; // Extract the `text` property
    //   } else {
    //     console.warn('Unexpected item structure:', item);
    //     return ''; // Fallback for unexpected item structure
    //   }
    // }).filter((value: any) => value); // Remove empty or undefined values

    // // Log the extracted texts
    // console.log('Selected Text Values:', this.selectedTexts);
  
    if (event && Array.isArray(event)) {
      if (event.length === 1) {
        // Handle single selection
        const singleItem = event[0];
        if (singleItem && singleItem.data && singleItem.data.text) {
          const formattedValue = singleItem.data.text; // Use only the text value
          console.log('Single Selected Item:', formattedValue);
  
          // Update the form control with the single value
          const filterParameter = this.createKPIWidget.get('filterParameter');
          if (filterParameter) {
            filterParameter.setValue(formattedValue);
            this.cdr.detectChanges(); // Trigger change detection
          }
  
          this.selectedParameterValue = formattedValue;
        } else {
          console.warn('Unexpected item structure for single selection:', singleItem);
        }
      } else {
        // Handle multiple selections
        const formattedValues = event.map((item: any) => {
          if (item && item.data && item.data.text) {
            return item.data.text; // Use only the text value
          } else {
            console.warn('Unexpected item structure:', item);
            return ''; // Fallback for unexpected item structure
          }
        }).filter(value => value).join(', '); // Join values into a single string
  
        console.log('Formatted Multiple Items:', formattedValues);
  
        // Update the form control with the concatenated values
        const filterParameter = this.createKPIWidget.get('filterParameter');
        console.log('filterParameter check',filterParameter)
        if (filterParameter) {
          filterParameter.setValue(formattedValues);
          this.cdr.detectChanges(); // Trigger change detection
        }
  
        this.selectedParameterValue = formattedValues;
      }
    } else {
      console.warn('Invalid event structure:', event);
    }
  }


  filterParamevent(arg0: string, filterParamevent: any) {
    throw new Error('Method not implemented.');
  }
  onAdd(index: number): void {
    // Access the selected parameters for the specific condition
    const selectedParameters = this.conditions.at(index).get('filterParameter')?.value;
  
    console.log('Selected parameters for condition', index, ':', selectedParameters);
  
    if (Array.isArray(selectedParameters)) {
      // Initialize formatted parameter string
      this.selectedParameterValue = selectedParameters
        .map(param => `\${${param.text}.${param.value}}`) // Format all parameters as "${Label.Value}"
        .join(' '); // Join all parameters with spaces
    } else if (selectedParameters) {
      // Handle single selection case (if applicable)
      const param = selectedParameters;
      this.selectedParameterValue = `\${${param.text}.${param.value}}`; // Format single parameter
    } else {
      this.selectedParameterValue = '';
    }
  
    console.log('Formatted selectedParameterValue for condition', index, ':', this.selectedParameterValue);
  
    // Update the specific form group's `filterDescription` with the formatted string
    this.conditions.at(index).patchValue({
      filterDescription: `${this.selectedParameterValue}`,
    });
  
    // Manually trigger change detection to ensure the UI reflects the changes
    this.cdr.detectChanges();
  }
  
  
  
  addCondition(): void {
    if (!this.createKPIWidget) {
      console.error('createKPIWidget is not initialized!');
      return;
    }

    const conditionGroup = this.fb.group({
      columnLabel: [''],
      filterParameter: [[]],
      filterDescription: [''],
      PredefinedScripts:['']
    });

    this.conditions.push(conditionGroup); // Add the FormGroup to the FormArray
  }

  
  

  removeCondition(index: number): void {
    this.conditions.removeAt(index);
  }

  dynamicparameterValue1(event: any): void {
    console.log('Event check for dynamic param:', event);
  
    if (event && event.value && Array.isArray(event.value)) {
      const valuesArray = event.value;
  
      if (valuesArray.length === 1) {
        // Handle single selection
        const singleItem = valuesArray[0];
        const { value, text } = singleItem; // Destructure value and text
        console.log('Single Selected Item:', { value, text });
  
        // Update the form control with the single value (object)
        const filterParameter = this.createKPIWidget.get('filterParameter1');
        if (filterParameter) {
          filterParameter.setValue([{ value, text }]); // Store as an array of objects
          this.cdr.detectChanges(); // Trigger change detection
        }
  
        // Store the single selected parameter
        this.selectedParameterValueDupli = { value, text };
      } else {
        // Handle multiple selections
        const formattedValuesdupli = valuesArray.map((item: any) => {
          const { value, text } = item; // Destructure value and text
          return { value, text }; // Create an object with value and text
        });
  
        console.log('Formatted Multiple Items:', formattedValuesdupli);
  
        // Update the form control with the concatenated values (array of objects)
        const filterParameter = this.createKPIWidget.get('filterParameter1');
        if (filterParameter) {
          filterParameter.setValue(formattedValuesdupli);
          this.cdr.detectChanges(); // Trigger change detection
        }
  
        // Store the multiple selected parameters
        this.selectedParameterValueDupli = formattedValuesdupli;
      }
    } else if (event && event.itemValue) {
      // Handle the case where `itemValue` exists
      const { value, text } = event.itemValue;
      console.log('Single Selected Item from itemValue:', { value, text });
  
      // Update the form control with the single value (object)
      const filterParameter = this.createKPIWidget.get('filterParameter1');
      if (filterParameter) {
        filterParameter.setValue([{ value, text }]); // Store as an array of objects
        this.cdr.detectChanges(); // Trigger change detection
      }
  
      // Store the single selected parameter
      this.selectedParameterValueDupli = { value, text };
    } else {
      console.warn('Invalid event structure:', event);
    }
  }
  
  predefinedList = [
    {value:'Progress',text:'Progress'},
    {value:'Rating',text:'Rating'},
    {value:'HTML',text:'HTML'},
    {value:'None',text:'None'},

  ]
  
}
