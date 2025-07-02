import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Injector, Input, NgZone, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { APIService } from 'src/app/API.service';
import { LocationPermissionService } from 'src/app/location-permission.service';
import { SharedService } from 'src/app/pages/shared.service';
import { ColDef } from 'ag-grid-community';
interface FormField {
  columnWidth?: number;
  label?: string;
  name?: string;
  options?: string[];
  placeholder?: string;
  type?: string;
  validation?: any;
}
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
  @ViewChild('calendarModalDrillDownTable') calendarModalDrillDownTable: any;
  selectedTabset: string = 'dataTab';
  dynamicParamMap = new Map<number, any[]>();
  selectedParameterValue: any;

  dynamicConditions: FormGroup[] = [];
  showRemoveButton:boolean = false;
  dynamicFields: any;
  selectedParameterValueDupli: { value: any; text: any; };
  selectedParameterValueDupl: string;
  formValidationFailed:boolean =true;
  userdetails: any;
  userClient: string;
  permissionsMetaData: any;
  permissionIdRequest: any;
  storeFormIdPerm: any;
  allDeviceIds: any;
  parsedPermission: any;
  readFilterEquation: any;
  summaryPermission: any;
  listofDynamicDrillParam: any;
  dynamicDateParamMap: any;
  drillDownHeading: any;


  ngOnInit(): void {
    this.getLoggedUser = this.summaryConfiguration.getLoggedUserDetails()
    console.log('this.getLoggedUser check', this.getLoggedUser)
    // this.getWorkFlowDetails = this.summaryConfiguration.getLoggedUserDetails()
    // console.log('this.getLoggedUser check',this.getWorkFlowDetails)


    this.SK_clientID = this.getLoggedUser.clientID;
    console.log('this.SK_clientID check', this.SK_clientID)
this.initializeTileFields()
this.fetchUserPermissions(1)
  

    this.createKPIWidget.valueChanges.subscribe(() => {
      if (this.createKPIWidget.valid) {
        this.formValidationFailed = true;
      }
    });

    this.createKPIWidget.get('DataType')?.valueChanges.subscribe(value => {
      console.log('DataType changed:', value);
      if (value === 'Processed Data') {
        this.CustomColumnCal();
      }
    });



    this.createKPIWidget.get('DrillDownType')?.valueChanges.subscribe((selectedValue) => {
      if (selectedValue === 'Multi Level') {
        this.addDrillFields(); // Generate the form array
      } else {
        this.clearDrillFields(); // Clear the form array when 'Table' is selected
      }
    });
    // this.dashboardIds(1)
  }



    addDrillFields() {
      const drillFieldsArray = this.createKPIWidget.get('drill_fields') as FormArray;
      if (drillFieldsArray.length === 0) {  // Prevent duplicate generation
        this.addNewDrillField();  // Add an initial field
      }
    }
  constructor(private summaryConfiguration: SharedService, private api: APIService, private fb: UntypedFormBuilder, private cd: ChangeDetectorRef,
    private toast: MatSnackBar, private router: Router, private modalService: NgbModal, private route: ActivatedRoute, private cdr: ChangeDetectorRef, private locationPermissionService: LocationPermissionService, private devicesList: SharedService, private injector: Injector,
    private spinner: NgxSpinnerService,private zone: NgZone
  ){

    


  }






  CustomColumnCal() {

    const formArray = this.createKPIWidget.get('customColumnFields') as FormArray;
    const readFormFieldsControl = this.createKPIWidget.get('form_data_selected')?.value
    console.log('readFormFieldsControl checking',readFormFieldsControl)
  

      formArray.controls.forEach((control) => {
        control.enable(); // Enable the controls if checkbox is checked
      });
      this.addCustomColumnControls(readFormFieldsControl, 'ts'); // Call addControls when enabled

  }
  
  ngAfterViewInit(): void {
    this.addCondition();
  }

  initializeTileFields(): void {
    // Initialize the form group
    this.createKPIWidget = this.fb.group({

      // all_fields:new FormArray([]),
      all_fields: new FormArray([]),
      customColumnFields:new FormArray([]),
      conditions: this.fb.array([]), 
      drill_fields: new FormArray([]),
      formlist: ['', Validators.required],
      form_data_selected: ['', Validators.required],
      filter_duplicate_data:[''],
  
    
      custom_Label:['',Validators.required],
      groupByFormat: ['', Validators.required],
      rowData:[''],
      filterParameter: [[]], // Initialize as an array to handle multiple or single values
      filterDescription: [''],
      filterParameter1:[''],
      // custom_Label1:[''],
      filterDescription1:[''],
      enableRowCal:[''],
      DataType:[''],
      tableDrillDownForm:[''],
      tableDrillDownFields:[''],
      tableDrillDownPrimaryValue:[''],
      tableDrillDownUndefinedLabel:[''],
      tableDrillDownGroupByFormat:[''],
      tableDrillDownSelectedRangeType:[''],
      DrillDownType: [''],




  
    });

    this.createKPIWidget.get('DrillDownType')?.valueChanges.subscribe(() => {
      this.updateDrillFields();
    });
  }



  DataTypeValues = [
    { value: 'Processed Data', text: 'Processed Data' },
    { value: 'Normal Data', text: 'Normal Data' },
    {value:'Drill Down Data',text: 'Drill Down Data'}


]
get isProcessedDataSelected(): boolean {
  return this.createKPIWidget?.get('DataType')?.value === 'Processed Data';
}

get drillFields(): FormArray {
  return this.createKPIWidget?.get('drill_fields') as FormArray || this.fb.array([]);
}

updateDrillFields(): void {
  const selectedType = this.createKPIWidget.get('DrillDownType')?.value;
  const count = 1;
  console.log('Updating drill fields based on count:', count);

  if (selectedType !== 'Multi Level' || isNaN(count) || count <= 0) {
    this.drillFields.clear();
    return;
  }

  const currentLength = this.drillFields.length;

  // Add fields
  if (count > currentLength) {
    for (let i = currentLength; i < count; i++) {
      this.drillFields.push(this.createDrillField());
    }
  }

  // Remove extra fields
  else if (count < currentLength) {
    for (let i = currentLength - 1; i >= count; i--) {
      this.drillFields.removeAt(i);
    }
  }
}


createDrillField(): FormGroup {
  return this.fb.group({
    conditions: this.fb.array([this.createCondition()])
  });
}

createCondition(): FormGroup {
  return this.fb.group({
    drillTypeFields: [''],
    drillTypeLabel: [''],
    drillTypePrimary:[''],
  });
}
drillDownTypeTooltip: string = 'Select the drill down type for the chart. Choosing "Multi Level Drill Down" will allow you to configure infinite-level drill down logic dynamically.';
drillSelectFieldTooltip: string = 'Choose the field to display in the next drill down level. For example, selecting "Customer Name" will show customer-specific data when a chart slice is clicked.';

drillCustomLabelTooltip: string = 'Enter a custom label that will be used as the chart title at this drill down level. This helps identify the data shown at each step.';
dataLabelFontColorTooltip: string = 'Choose a custom font color for the data labels displayed on the chart.';

    openWidgetFilterHelp(stepperModal: TemplateRef<any>){
      this.modalService.open(stepperModal, {   backdrop: 'static',  // Disable closing on backdrop click
        keyboard: false    });
    
    }


    openPrimaryValueInfoModal(stepperModal: TemplateRef<any>) {
        this.modalService.open(stepperModal, {   backdrop: 'static',  // Disable closing on backdrop click
          keyboard: false    });
    
      }




      repopulateDrill_fields(tile: any): FormArray {
        const drillFieldArray = this.fb.array([]);
      
        let parsedConfig = [];
        try {
          parsedConfig = typeof tile.DrillConfig === 'string'
            ? JSON.parse(tile.DrillConfig || '[]')
            : tile.DrillConfig || [];
        } catch (error) {
          console.error('Error parsing DrillConfig:', error);
          parsedConfig = [];
        }
      
        parsedConfig.forEach((configItem: { conditions: any; }) => {
          const conditionArray = this.fb.array([]);
          const conditions = Array.isArray(configItem.conditions) ? configItem.conditions : [];
      
          conditions.forEach((condition: any) => {
            conditionArray.push(this.fb.group({
              drillTypeFields: [condition.drillTypeFields || ''],
              drillTypeLabel: [condition.drillTypeLabel || ''],
              drillTypePrimary: [condition.drillTypePrimary || '']
            }));
          });
      
          drillFieldArray.push(this.fb.group({
            conditions: conditionArray
          }));
        });
       
        console.log('drillFieldArray:', drillFieldArray.value);
        return drillFieldArray;
      }
      

  DrillDownTypeFields = [
    // { value: 'Table', text: 'Table' },
    { value: 'Multi Level', text: 'Multi Level Drill Down' },
  ]

  get drill_fields() {
    return this.createKPIWidget.get('drill_fields') as FormArray;
  }





  addNewDrillField() {
    const drillFieldsArray = this.createKPIWidget.get('drill_fields') as FormArray;
  
    // Create a new drill field group
    const fieldGroup = this.fb.group({
      conditions: this.fb.array([]), // Initialize conditions array
      
    });
  
    // Push it to the form array
    drillFieldsArray.push(fieldGroup);
  
    // Ensure at least one condition is added
    this.addConditionDrillDown(drillFieldsArray.length - 1, '', '');
  }
  
  remove(fieldIndex: number): void {
    // Access the specific field group
    const parentGroup = this.drill_fields.at(fieldIndex) as FormGroup;
  
    // Access the conditions FormArray within the field group
    const conditions = parentGroup.get('conditions') as FormArray;
  
    // Check if there are any conditions to remove
    if (conditions && conditions.length > 0) {
      // Remove the last condition in the array
      conditions.removeAt(conditions.length - 1);
    } else {
      console.warn(`No conditions available to remove for field index ${fieldIndex}`);
    }
  }

  addConditionDrillDown(fieldIndex: number, initialValue: string = '', fieldValue: string = '') {
    const drillFieldsArray = this.createKPIWidget.get('drill_fields') as FormArray;
    const conditionsArray = drillFieldsArray.at(fieldIndex).get('conditions') as FormArray;
  
    const newConditionGroup = this.fb.group({
      drillTypeFields: [fieldValue], // Ensure ngx-select control is properly initialized
      drillTypeLabel:[''],
      drillTypePrimary:[''],
    });
  
    conditionsArray.push(newConditionGroup);
  }

  removeConditionDrill(fieldIndex: number, conditionIndex: number) {
    const drillFieldsArray = this.createKPIWidget.get('drill_fields') as FormArray;
    const parentGroup = drillFieldsArray.at(fieldIndex) as FormGroup;
    const conditions = parentGroup.get('conditions') as FormArray;
  
    if (conditions && conditions.length > conditionIndex) {
      conditions.removeAt(conditionIndex);
      console.log(`Condition removed from index ${fieldIndex}, condition ${conditionIndex}`);
    } else {
      console.warn('Condition index out of range or conditions not found');
    }
  }
  


  
  // Function to clear the form array when 'Table' is selected
  clearDrillFields() {
    this.createKPIWidget.setControl('drill_fields', this.fb.array([])); // Reset the array
  }

      showValues = [
        // { value: 'sum', text: 'Sum' },
        // { value: 'min', text: 'Minimum' },
        // { value: 'max', text: 'Maximum' },
        // { value: 'average', text: 'Average' },
        // { value: 'latest', text: 'Latest' },
        // { value: 'previous', text: 'Previous' },
        // { value: 'DifferenceFrom-Previous', text: 'DifferenceFrom-Previous' },
        // { value: 'DifferenceFrom-Latest', text: 'DifferenceFrom-Latest' },
        // { value: '%ofDifferenceFrom-Previous', text: '%ofDifferenceFrom-Previous' },
        // { value: '%ofDifferenceFrom-Latest', text: '%ofDifferenceFrom-Latest' },
        // { value: 'Constant', text: 'Constant' },
      
        // { value: 'Count', text: 'Count' },
        // { value: 'Count_Multiple', text: 'Count Multiple' },
        // { value: 'Count Dynamic', text: 'Count Dynamic' },
        { value: 'Count MultiplePram', text: 'Count Multiple Parameter' },
        { value: 'Sum MultiplePram', text: 'Sum Multiple Parameter' },
        { value: 'Average Multiple Parameter', text: 'Average Multiple Parameter' },
        {value:'count with sum MultipleParameter' , text:'Count With Sum Multiple Parameter'},
        {value:'sum with count MultipleParameter' , text:'Sum With Count Multiple Parameter'},
        { value: 'sumArray', text: 'SumArray' },
        { value: 'Advance Equation', text: 'Advance Equation' },
        { value: 'sum_difference', text: 'Sum Difference' },
        { value: 'distance_sum', text: 'Distance Sum' },
        { value: 'Count Multiple Minitable', text: 'Count Multiple Minitable' },
        {value:'Avg_Utilization_wise_multiple',text:'Avg_Utilization_wise_multiple'}
        
        
    
    
    
      ]
    

    openRowCalHelp(stepperModal: TemplateRef<any>){
      this.modalService.open(stepperModal, {   backdrop: 'static',  // Disable closing on backdrop click
        keyboard: false    });
    
    }



    openPreDefinedScriptsHelp(stepperModal: TemplateRef<any>){
      this.modalService.open(stepperModal, {   backdrop: 'static',  // Disable closing on backdrop click
        keyboard: false    });
    
    }


    onValueChange(selectedValue: any): void {
      console.log('selectedValue check', selectedValue[0].value);  // Log the selected value
    
      // Set the primaryValue form control to the selected value
      this.createKPIWidget.get('primaryValue')?.setValue(selectedValue[0].value);
    
      // Trigger change detection to ensure the UI updates immediately (optional)
      this.cd.detectChanges();
    }

    openUnitHelp(stepperModal: TemplateRef<any>){
      this.modalService.open(stepperModal, {   backdrop: 'static',  // Disable closing on backdrop click
        keyboard: false    });
    
    }

    onValueSelect(onSelectValue:any){
      console.log('selectedValue check', onSelectValue[0].value);  // Log the selected value
    
      // Set the primaryValue form control to the selected value
      this.createKPIWidget.get('selectedRangeType')?.setValue(onSelectValue[0].value);
    
      // Trigger change detection to ensure the UI updates immediately (optional)
      this.cd.detectChanges();
  
    }
    showCustomValues = [

      // { value: 'Hourly', text: 'Hourly' },
      // { value: 'Daily', text: 'Daily' },
      // { value: 'Hour of the Day', text: 'Hour of the Day' },
      // { value: 'Weekly', text: 'Weekly' },
      // { value: 'Day of Week', text: 'Day of Week' },
      // { value: 'Monthly', text: 'Monthly' },
      // { value: 'Day of Month', text: 'Day of Month' },
      // { value: 'Yearly', text: 'Yearly' },
      { value: 'Any', text: 'any' }
    ];

    UndefinedtooltipContent: string = 'Enter the text to display when the output label is undefined. This will replace the default "undefined" label in the final result.';
    DateRangetooltipContent: string = 'Select how the date range should be labeled. "Any" supports flexible time grouping.';


  filterParameterTooltip: string = 'Select form fields to apply filter conditions. The chosen fields will be used to filter data based on matching or non-matching values.';

  addControls(selectedFields: any[], _type: string) {
    console.log('Selected Fields:', selectedFields);
    
    const noOfParams = selectedFields.length;
    console.log('noOfParams check', noOfParams);
  
    // Get the form array
    const formArray = this.createKPIWidget.get('all_fields') as FormArray;
  
    // Add or remove controls dynamically
    if (formArray.length < noOfParams) {
      for (let i = formArray.length; i < noOfParams; i++) {
        formArray.push(
          this.fb.group({
            rowCalType:[''],
            rowUnit:[''],
            rowLabel:['']
          })
        );
      }
    } else {
      // Remove extra controls
      while (formArray.length > noOfParams) {
        formArray.removeAt(formArray.length - 1);
      }
    }
  
    console.log('Updated Form Array:', formArray.value);
  }

  getFormArrayControls(field: AbstractControl): FormGroup[] {
    return (field.get('conditions') as FormArray).controls as FormGroup[];
  }
  



  addCustomColumnControls(selectedFields: any[], _type: string) {
    console.log('Selected Fields:', selectedFields);
  
    const noOfParams = selectedFields.length;
    const formArray = this.createKPIWidget.get('customColumnFields') as FormArray;
  
    // Add or remove controls dynamically
    if (formArray.length < noOfParams) {
      for (let i = formArray.length; i < noOfParams; i++) {
        const field = selectedFields[i]; // 👈 pick only one field per control
  
        formArray.push(
          this.fb.group({
            columnType: [''],
            columnUnit: [''],
            columnHeading: [[field]] // 👈 wrap in array to match original format
          })
        );
      }
    } else {
      // Remove extra controls
      while (formArray.length > noOfParams) {
        formArray.removeAt(formArray.length - 1);
      }
    }
  
    console.log('Updated Form Array:', formArray.value);
  }
  

  selectType = [
    { value: 'sum', text: 'Sum' },
    { value: 'min', text: 'Minimum' },
    { value: 'max', text: 'Maximum' },
    { value: 'average', text: 'Average' },
    { value: 'latest', text: 'Latest' },
    { value: 'previous', text: 'Previous' },
    { value: 'Count', text: 'Count' },
    // { value: 'default', text: 'Default' }
  ];
  


  selectUnits = [
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
    { value: 'Rupee with Percentage', text: 'Rupee with Percentage' },
    { value: 'Rupee with Value', text: 'Rupee with Value' },
    { value: 'Dollar with Value', text: 'Dollar with Value' },
    { value: 'Coma with Unit', text: 'Coma with Unit' }
  ];
  

  get all_fields() {
    return this.createKPIWidget.get('all_fields') as FormArray;
  }

  get customColumnFields(){
       return this.createKPIWidget.get('customColumnFields') as FormArray;

  }

  // Handle dynamic parameter value changes
  get conditions(): FormArray<FormGroup> {
    return this.createKPIWidget.get('conditions') as FormArray<FormGroup>;
  }
  // onAdd1(): void {
  //   // Capture the selected parameters (which will be an array of objects with text and value)
  //   const selectedParameters = this.selectedParameterValueDupli;
  
  //   console.log('selectedParameters checking', selectedParameters);
  
  //   if (Array.isArray(selectedParameters)) {
  //     // Format the selected parameters to include the updated structure
  //     this.selectedParameterValueDupl = selectedParameters
  //       .map(param => `\${${param.text}.${param.value}}`) // Format as "${Label.Value}"
  //       .join(' '); // Join all parameters with a space
  //   } else if (selectedParameters) {
  //     // If only one parameter is selected, format it directly
  //     this.selectedParameterValueDupl = `\${${selectedParameters.text}.${selectedParameters.value}}`; // Single parameter format
  //   } else {
  //     console.warn('No parameters selected or invalid format:', selectedParameters);
  //     this.selectedParameterValueDupl = ''; // Fallback in case of no selection
  //   }
  
  //   console.log('this.selectedParameterValueDupl check', this.selectedParameterValueDupl);
  
  //   // Update the form control value for filterDescription1 with the formatted string
  //   this.createKPIWidget.patchValue({
  //     filterDescription1: `${this.selectedParameterValueDupl}`,
  //   });
  
  //   // Manually trigger change detection to ensure the UI reflects the changes
  //   this.cdr.detectChanges();
  // }
  




  onAdd1(): void {
    let existingText = this.createKPIWidget.get('filterDescription1')?.value?.trim() || '';
    const getFormFields = this.createKPIWidget.get('filterParameter')?.value;
    console.log('getFormFields checking', getFormFields);
    const selectedParameters = getFormFields;
    console.log('selectedParameters values from table widget', selectedParameters);
  
    let newEquationParts: string[] = [];
    let staticParts: string[] = [];  // To store the static parts like == '12344'
    
    // Preserve the static parts of the equation (e.g., "=='12344'")
    existingText = existingText.replace(/(\$\{[^\}]+\})(=='[^\']+')/g, (match: any, param: any, value: string) => {
      staticParts.push(value);  // Store the static part
      return `${param}==__STATIC_PART__`;  // Replace static parts with a placeholder
    });
  
    // Process the dynamic fields (the ones like Date Issued-${date-1732769545031})
    if (Array.isArray(selectedParameters)) {
      const selectedStrings = selectedParameters.map(param => `${param.text}-\${${param.value}}`);
      console.log('selectedStrings checking from table', selectedStrings);
  
      // Remove any equation parts that are no longer selected
      const existingStrings = existingText.split(' && ');  // Split into array
      const updatedStrings = existingStrings.filter((part: string) => selectedStrings.includes(part)); // Filter to only keep selected ones
  
      // Add new equation parts (selected ones that are not already in the equation)
      newEquationParts = selectedStrings.filter(paramString => !updatedStrings.includes(paramString));
  
      // Join them back into the equation string, only modifying the selected parts
      existingText = updatedStrings.join(' && ');
    } else if (selectedParameters) {
      // If it's a single parameter
      let paramString = `${selectedParameters.text}-\${${selectedParameters.value}}`;
  
      // Only add if not already present
      if (!existingText.includes(paramString)) {
        newEquationParts.push(paramString);
      }
  
      // Remove the existing parameter if it's no longer selected
      existingText = existingText.split(' && ').filter((part: string) => part !== paramString).join(' && ');
    } else {
      console.warn('No parameters selected or invalid format:', selectedParameters);
      return;
    }
  
    if (newEquationParts.length === 0 && existingText.trim() === '') {
      console.log('No new unique parameters to add.');
      return;
    }
  
    // Clean up spaces and format the equation string
    existingText = existingText.replace(/\s+/g, ' ').trim();
    console.log('existingText checking from table', existingText);
    const newEquation = newEquationParts.join(' && ');
  
    // Append new equation parts
    existingText = existingText ? `${existingText} && ${newEquation}` : newEquation;
  
    // Remove any consecutive "&&" and clean formatting
    existingText = existingText.replace(/&&\s*&&/g, '&&').trim();
  
    // Reinsert the static parts into the formatted equation string
    existingText = existingText.replace(/__STATIC_PART__/g, () => staticParts.shift() || '');
  
    // Patch the value of the form control directly
    this.createKPIWidget.patchValue({
      filterDescription1: existingText,
    });
  
    // Trigger change detection to update the UI
    this.cdr.detectChanges();
  }


  






  selectValue(value: string, modal: any) {
    console.log('Selected value:', value);

    // Set the value to the form control
    this.groupByFormatControl.setValue(value);

    // Close the modal after selection
    this.closeModal(modal);
  }

  selectValueDrill(value: string, modal: any): void {
    console.log('Selected value drill down:', value);
  
    const control = this.createKPIWidget.get('tableDrillDownGroupByFormat');
    console.log('control checking from table',control)
    
    if (control) {
      control.setValue(value);
      control.markAsDirty();
      control.markAsTouched();
      control.updateValueAndValidity();
    } else {
      console.warn('Form control "tableDrillDownGroupByFormat" not found!');
    }
  
    this.closeModal(modal); // Make sure this method handles null safely
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
  get tableDrillDownGroupByFormat(): FormControl {
    return this.createKPIWidget.get('groupByFormatDrillDown') as FormControl; // Cast to FormControl
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
      table_rowConfig: this.createKPIWidget.value.all_fields || [],
      customColumnConfig:this.createKPIWidget.value.customColumnFields ||[],
      // custom_Label1:this.createKPIWidget.value.custom_Label1,
      filterDescription1:this.createKPIWidget.value.filterDescription1,
      enableRowCal:this.createKPIWidget.value.enableRowCal,
      filter_duplicate_data:this.createKPIWidget.value.filter_duplicate_data,
      DataType:this.createKPIWidget.value.DataType ||'',
      tableDrillDownForm:this.createKPIWidget.value.tableDrillDownForm,
      tableDrillDownFields:this.createKPIWidget.value.tableDrillDownFields,
      tableDrillDownPrimaryValue:this.createKPIWidget.value.tableDrillDownPrimaryValue,
      tableDrillDownUndefinedLabel:this.createKPIWidget.value.tableDrillDownUndefinedLabel,
      tableDrillDownGroupByFormat:this.createKPIWidget.value.tableDrillDownGroupByFormat,
      tableDrillDownSelectedRangeType:this.createKPIWidget.value.tableDrillDownSelectedRangeType,
      DrillConfig:this.createKPIWidget.value.drill_fields || [],
      DrillDownType:this.createKPIWidget.value.DrillDownType ||''


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
          console.log('formFields check from table',formFields)

          // Initialize the list with formFields labels
          this.listofDynamicParam   = formFields
          .filter((field: any) => {
            // Filter out fields with type "heading" or with an empty placeholder
            return field.type !== "heading" && field.type !== 'Empty Placeholder' && field.type !=='button' && field.type !=='table' && field.type !=='radio' && field.type !== 'checkbox' && field.type !== 'html code' && field.type !=='file' && field.type !=='range' && field.type !=='color' && field.type !=='password' && field.type !=='sub heading';
          })
          .map((field: any) => {
            console.log('field check', field);
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




  fetchDynamicFormDataDrillDown(value: any) {
    console.log("Data from lookup:", value);
    this.drillDownHeading = value

    this.api
      .GetMaster(`${this.SK_clientID}#dynamic_form#${value}#main`, 1)
      .then((result: any) => {
        if (result && result.metadata) {
          const parsedMetadata = JSON.parse(result.metadata);
          const formFields = parsedMetadata.formFields;
          console.log('formFields check from table',formFields)

          // Initialize the list with formFields labels
          this.listofDynamicDrillParam   = formFields
          .filter((field: any) => {
            // Filter out fields with type "heading" or with an empty placeholder
            return field.type !== "heading" && field.type !== 'Empty Placeholder' && field.type !=='button' && field.type !=='table' && field.type !=='radio' && field.type !== 'checkbox' && field.type !== 'html code' && field.type !=='file' && field.type !=='range' && field.type !=='color' && field.type !=='password' && field.type !=='sub heading';
          })
          .map((field: any) => {
            console.log('field check', field);
            return {
              value: field.name,
              text: field.label
            };
          });

          // Include created_time and updated_time
          if (parsedMetadata.created_time) {
            this.listofDynamicDrillParam.push({
              value: `created_time`,
              text: 'Created Time' // You can customize the label here if needed
            });
          }
          
          if (parsedMetadata.updated_time) {
            this.listofDynamicDrillParam.push({
              value: `updated_time`,
              text: 'Updated Time' // You can customize the label here if needed
            });
          }
          

          // console.log('Transformed dynamic parameters:', this.listofDynamicDrillParam);
          // this.dynamicParamMap.set(index, dynamicParamList);

          // Trigger change detection to update the view
          this.cdr.detectChanges();
        }
      })
      .catch((err) => {
        console.log("Can't fetch", err);
      });
  }


  selectDrillFormParams(event: any) {
    if (event && event[0] && event[0].data) {
      const selectedText = event[0].data.text; 
      if(this.userIsChanging){
        // alert("check")
        this.createKPIWidget.get("tableDrillDownFields")?.setValue('')
      }

       // Adjust based on the actual structure
      console.log('Selected Form Text:', selectedText);

      if (selectedText) {
        this.fetchDynamicFormDataDrillDown(selectedText);
      }
      this.userIsChanging = false
    } else {
      console.error('Event data is not in the expected format:', event);
      this.userIsChanging =  false
    }
  }
  parameterValue(event: any) {
    console.log('event for parameter check', event);
    
    // Extract selected texts
    const selectedTexts = event.value.map((item: any) => item.text);
    console.log('selectedTexts check',selectedTexts)
  
    // Dynamically create column definitions for ag-grid
    this.table.columnDefs = this.createColumnDefs(selectedTexts);
  }
  
  handleChange(event: any) {
    console.log('checking event value',event.value)

    // Call both functions onChange

    this.parameterValue(event);
    this.CustomRowCal();
    
  }


  tooltipContent: string = 'Group data by time periods such as Today, Last 7 Days, This Month, or This Year to view filtered insights based on the selected range. For example, "This Year" refers to data from January to December of the current year.';

  formTooltip: string = 'Select a form to view and analyze data specific to that form.';
  parameterTooltip: string = 'Select the fields you want to see in the table. Only the fields you choose will be shown.';

  
  formatTypeTooltip: string = 'Select a format to represent the output value appropriately—for example, Rupee for currency, Distance for measurements, or Percentage for ratios.';
  customLabelTooltip: string = 'Provide a custom label to be displayed as the widget title.';
  moduleNamesTooltip: string = 'Select the module that the user will be redirected to when the widget is clicked.';
  selectTypeTooltip: string = 'Choose how the dashboard should open when the widget is clicked—whether in a new tab, a modal, or on the same page.';
  
  redirectToTooltip: string = 'Select the specific dashboard or module the user should be redirected to when the widget is clicked.';
  columnVisibilityTooltip: string = 'Select the fields to display in the drill-down table. Only the selected columns will be visible in the detailed view.';
  redirectionType: string = 'Choose how the widget should open the target dashboard or module: "New Tab" opens it in a separate browser tab, "Modal (Pop Up)" displays it in a modal window, "Same Page Redirect" replaces the current view, and "Drill Down" shows detailed insights in Table.';
  filterTooltip: string = 'Only unique rows will be shown in table based on the fields you select here.';

  CustomRowCal() {
    const readrowCalCheck = this.createKPIWidget.get('enableRowCal')?.value;
    const formArray = this.createKPIWidget.get('all_fields') as FormArray;
    const readFormFieldsControl = this.createKPIWidget.get('form_data_selected')?.value
    console.log('readFormFieldsControl checking',readFormFieldsControl)
  
    if (readrowCalCheck === true) {
      formArray.controls.forEach((control) => {
        control.enable(); // Enable the controls if checkbox is checked
      });
      this.addControls(readFormFieldsControl, 'ts'); // Call addControls when enabled
    } else {
      formArray.controls.forEach((control) => {
        control.disable(); // Disable the controls if checkbox is unchecked
      });
    }
  }
  
  





  validateAndUpdate() {
    if (this.createKPIWidget.invalid) {
      this.formValidationFailed = false; // 🔴 Show the error
  
      Object.values(this.createKPIWidget.controls).forEach(control => {
        if (control instanceof FormControl) {
          control.markAsTouched();
          control.updateValueAndValidity();
        } else if (control instanceof FormArray) {
          control.controls.forEach((group) => {
            (group as FormGroup).markAllAsTouched();
          });
        }
      });
  
      return; // 🚫 Stop if invalid
    }
  
    // ✅ If the form is valid
    this.formValidationFailed = true; // ✅ Hide the warning now
    this.updateTile('TableWidget');
    this.modal.dismiss();
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
  openTableModal(tile: any, index: number): void {
    if (!tile) {
      this.selectedTile = null;
      this.isEditMode = false;
      this.createKPIWidget.reset();
      this.conditions.clear();
      return;
    }
  
    this.isEditMode = true;
    this.selectedTile = tile;
    this.editTileIndex = index ?? null;
  
    // Parse tableWidget_Config
    let parsedTableWidgetConfig = [];
    try {
      parsedTableWidgetConfig = typeof tile.tableWidget_Config === 'string'
        ? JSON.parse(tile.tableWidget_Config)
        : tile.tableWidget_Config;
    } catch (error) {
      console.error('Error parsing tableWidget_Config:', error);
    }
  
    // Parse conditions
    let parsedConditions = [];
    try {
      parsedConditions = typeof tile.conditions === 'string'
        ? JSON.parse(tile.conditions)
        : tile.conditions;
    } catch (error) {
      console.error('Error parsing conditions:', error);
    }
  
    // Parse filterParameter1
    let parsedFilterParameter1 = [];
    try {
      parsedFilterParameter1 = typeof tile.filterParameter1 === 'string'
        ? JSON.parse(tile.filterParameter1)
        : tile.filterParameter1;
    } catch (error) {
      console.error('Error parsing filterParameter1:', error);
    }
  
    // Parse filter_duplicate_data
    let parsedFilterFields = [];
    try {
      parsedFilterFields = typeof tile.filter_duplicate_data === 'string'
        ? JSON.parse(tile.filter_duplicate_data)
        : tile.filter_duplicate_data;
    } catch (error) {
      console.error('Error parsing filter_duplicate_data:', error);
    }
  
    // Parse tableDrillDownFields
    let parseDrillDownFields = [];
    try {
      parseDrillDownFields = typeof tile.tableDrillDownFields === 'string'
        ? JSON.parse(tile.tableDrillDownFields)
        : tile.tableDrillDownFields;
    } catch (error) {
      console.error('Error parsing tableDrillDownFields:', error);
    }
  
    // Repopulate drill_fields using setControl (✅ fix applied here)
    const populatedDrillFields = this.repopulateDrill_fields(tile);
    this.createKPIWidget.setControl('drill_fields', populatedDrillFields);
  
    // Set conditions array
    this.conditions.clear();
    parsedConditions.forEach((condition: any) => {
      this.conditions.push(this.fb.group({
        columnLabel: [condition.columnLabel || ''],
        filterParameter: [condition.filterParameter || []],
        filterDescription: [condition.filterDescription || ''],
        PredefinedScripts: [condition.PredefinedScripts || '']
      }));
    });
  
    // Patch flat form fields
    this.createKPIWidget.patchValue({
      formlist: tile.formlist,
      form_data_selected: parsedTableWidgetConfig,
      groupByFormat: tile.groupByFormat,
      custom_Label: tile.custom_Label,
      filterParameter1: parsedFilterParameter1,
      filterDescription1: tile.filterDescription1,
      enableRowCal: tile.enableRowCal,
      filter_duplicate_data: parsedFilterFields,
      DataType: tile.DataType,
      tableDrillDownForm: tile.tableDrillDownForm,
      tableDrillDownFields: parseDrillDownFields,
      tableDrillDownPrimaryValue: tile.tableDrillDownPrimaryValue,
      tableDrillDownUndefinedLabel: tile.tableDrillDownUndefinedLabel,
      tableDrillDownGroupByFormat: tile.tableDrillDownGroupByFormat,
      tableDrillDownSelectedRangeType: tile.tableDrillDownSelectedRangeType,
      DrillDownType: tile.DrillDownType,
      all_fields: this.repopulate_fields(tile),
      customColumnFields: this.repopulate_CustomColumnFields(tile),
    });
  
    // Set theme
    this.themes.forEach((theme: { selected: boolean; }) => theme.selected = false);
    const matchingTheme = this.themes.find((theme: { color: any; }) => theme.color === tile?.themeColor);
    if (matchingTheme) {
      matchingTheme.selected = true;
    }
  }
  
  
  
  
  repopulate_fields(getValues: any): FormArray {
    if (!getValues || getValues === null) {
      console.warn('No data to repopulate');
      return this.all_fields;
    }
  
    // Clear existing fields in the FormArray
    this.all_fields.clear();
  
    // Parse `chartConfig` safely
    let parsedChartConfig: any[] = [];
    try {
      if (typeof getValues.table_rowConfig === 'string') {
        parsedChartConfig = JSON.parse(getValues.table_rowConfig || '[]');
      } else if (Array.isArray(getValues.table_rowConfig)) {
        parsedChartConfig = getValues.table_rowConfig;
      }
    } catch (error) {
      console.error('Error parsing chartConfig:', error);
      parsedChartConfig = [];
    }
  
    console.log('Parsed chartConfig:', parsedChartConfig);
  
    // Populate FormArray based on parsedChartConfig
    if (parsedChartConfig.length > 0) {
      parsedChartConfig.forEach((configItem, index) => {
        console.log(`Processing index ${index} - Full Object:`, configItem);
  
        // Handle columnVisibility as a simple array initialization

     
  
        // Create and push FormGroup into FormArray
        this.all_fields.push(
          this.fb.group({
            rowCalType: configItem.rowCalType || '',
      
            rowLabel: configItem.rowLabel || '',
            rowUnit: configItem.rowUnit || '',
        
     
  
          })
        );
  
        // Log the added FormGroup for debugging
        console.log(`FormGroup at index ${index}:`, this.all_fields.at(index).value);
      });
    } else {
      console.warn('No parsed data to populate fields');
    }
  
    console.log('Final FormArray Values:', this.all_fields.value);
  
    return this.all_fields;
  }


  repopulate_CustomColumnFields(getValues: any): FormArray {
    if (!getValues || getValues === null) {
      console.warn('No data to repopulate');
      return this.customColumnFields;
    }
  
    // Clear existing fields in the FormArray
    this.customColumnFields.clear();
  
    // Parse `chartConfig` safely
    let parsedChartConfig: any[] = [];
    try {
      if (typeof getValues.customColumnConfig === 'string') {
        parsedChartConfig = JSON.parse(getValues.customColumnConfig || '[]');
      } else if (Array.isArray(getValues.customColumnConfig)) {
        parsedChartConfig = getValues.customColumnConfig;
      }
    } catch (error) {
      console.error('Error parsing chartConfig:', error);
      parsedChartConfig = [];
    }
  
    console.log('Parsed chartConfig:', parsedChartConfig);
  
    // Populate FormArray based on parsedChartConfig
    if (parsedChartConfig.length > 0) {
      parsedChartConfig.forEach((configItem, index) => {
        console.log(`Processing index ${index} - Full Object:`, configItem);
  
        // Handle columnVisibility as a simple array initialization

     
  
        // Create and push FormGroup into FormArray
        this.customColumnFields.push(
          this.fb.group({
            columnType: configItem.columnType || '',
      
            columnUnit: configItem.columnUnit || '',
            columnHeading: configItem.columnHeading || '',
        
            
  
          })
        );
  
        // Log the added FormGroup for debugging
        console.log(`FormGroup at index ${index}:`, this.customColumnFields.at(index).value);
      });
    } else {
      console.warn('No parsed data to populate fields');
    }
  
    console.log('Final FormArray Values:', this.customColumnFields.value);
  
    return this.customColumnFields;
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
          columnLabel: condition.columnLabel ||'',
          filterParameter: condition.filterParameter ||'',
          filterDescription: condition.filterDescription ||'',
          PredefinedScripts:condition.PredefinedScripts ||''
        };
      });
  
      console.log('Updated conditions:', updatedConditions);
  
      // Prepare the updated tile object
      const updatedTile = {
        ...this.dashboard[this.editTileIndex] ||'', // Keep existing properties
        formlist: this.createKPIWidget.value.formlist ||'',
        tableWidget_Config: this.createKPIWidget.value.form_data_selected ||'',
        groupByFormat: this.createKPIWidget.value.groupByFormat ||'',
        custom_Label: this.createKPIWidget.value.custom_Label ||'',
        conditions: updatedConditions ||'', // Directly assign the array
        filterParameter1: this.createKPIWidget.value.filterParameter1 ||'', // Parsed array
        filterDescription1: this.createKPIWidget.value.filterDescription1 ||'',
        table_rowConfig: this.createKPIWidget.value.all_fields || '',
        enableRowCal:this.createKPIWidget.value.enableRowCal || '',
        filter_duplicate_data:this.createKPIWidget.value.filter_duplicate_data || '',
        DataType:this.createKPIWidget.value.DataType || '',
        customColumnConfig:this.createKPIWidget.value.customColumnFields ||'',
        tableDrillDownForm:this.createKPIWidget.value.tableDrillDownForm ||'',
        tableDrillDownFields:this.createKPIWidget.value.tableDrillDownFields ||'',
        tableDrillDownPrimaryValue:this.createKPIWidget.value.tableDrillDownPrimaryValue ||'',
        tableDrillDownUndefinedLabel:this.createKPIWidget.value.tableDrillDownUndefinedLabel ||'',
        groupByFormatDrillDown:this.createKPIWidget.value.groupByFormatDrillDown ||'',
        tableDrillDownSelectedRangeType:this.createKPIWidget.value.tableDrillDownSelectedRangeType ||'', 
        tableDrillDownGroupByFormat:this.createKPIWidget.value.tableDrillDownGroupByFormat ||'',
        DrillConfig:this.createKPIWidget.value.drill_fields || [],
        DrillDownType:this.createKPIWidget.value.DrillDownType ||'' 
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




  openModalCalenderDrillDown() {
    const modalRef = this.modalService.open(this.calendarModalDrillDownTable);
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



  formHeadings: Map<number, string> = new Map(); 
  fetchDynamicDataDrillDown(value: any, index: number) {
    this.formHeadings.set(index, value);  
    console.log("Fetching data for:", value);

    // Simulating API call
    this.api
      .GetMaster(`${this.SK_clientID}#dynamic_form#${value}#main`, 1)
      .then((result: any) => {
        if (result && result.metadata) {
          const parsedMetadata = JSON.parse(result.metadata);
          const formFields = parsedMetadata.formFields;
          console.log('formFields type check data',formFields)

          // Prepare parameter list
          // const dynamicParamList = formFields.map((field: any) => ({
          //   value: field.name,
          //   text: field.label,
          // }));


         const dynamicParamList = formFields
          .filter((field: any) => {
            // Filter out fields with type "heading" or with an empty placeholder
            return field.type !== "heading" && field.type !== 'Empty Placeholder' && field.type !=='button' && field.type !=='table' && field.type !=='radio' && field.type !== 'checkbox' && field.type !== 'html code' && field.type !=='file' && field.type !=='range' && field.type !=='color' && field.type !=='password' && field.type !=='sub heading';
          })
          .map((field: any) => {
            console.log('field check', field);
            return {
              value: field.name,
              text: field.label
            };
          });
          // Add created_time and updated_time
          if (parsedMetadata.created_time) {
            dynamicParamList.push({
              value: 'created_time',
              text: 'Created Time',
            });
          }
          if (parsedMetadata.updated_time) {
            dynamicParamList.push({
              value: 'updated_time',
              text: 'Updated Time',
            });
          }

          if (parsedMetadata.updated_time) {
            dynamicParamList.push({
              value: `dynamic_table_values`,
              text: 'Dynamic Table Values' // You can customize the label here if needed
            });
            
          }
console.log('dynamicParamList checking from chart1',dynamicParamList)
const formFieldsArray: FormField[] = Object.values(parsedMetadata.formFields) as FormField[];

const dateFields = formFieldsArray.filter((field: FormField) => field.type === "date");
console.log("Date Fields:", dateFields);


const dateFieldsList = dateFields.map((field: any) => ({
  value: field.name,
  text: field.label,
}));

dateFieldsList.push({
  value: 'Default',
  text: 'Default',
});

dateFieldsList.push({
  value: 'created_time',
  text: 'Created Time',
});
dateFieldsList.push({
  value: 'updated_time',
  text: 'Updated Time',
});

this.dynamicDateParamMap.set(index,dateFieldsList)
          // Store parameters in the map
          this.dynamicParamMap.set(index, dynamicParamList);


          // const formArray = this.createChart.get('all_fields') as FormArray;
          // const fieldGroup = formArray.at(index) as FormGroup;
        
          // // Clear previous parameterName field value
          // fieldGroup.get('parameterName')?.reset();
        
        


          // Trigger change detection
          this.cdr.detectChanges();
        }
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
      });
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

  // dynamicparameterValue1(event: any): void {
  //   console.log('Event check for dynamic param:', event);
  
  //   if (event && event.value && Array.isArray(event.value)) {
  //     const valuesArray = event.value;
  
  //     if (valuesArray.length === 1) {
  //       // Handle single selection
  //       const singleItem = valuesArray[0];
  //       const { value, text } = singleItem; // Destructure value and text
  //       console.log('Single Selected Item:', { value, text });
  
  //       // Update the form control with the single value (object)
  //       const filterParameter = this.createKPIWidget.get('filterParameter1');
  //       if (filterParameter) {
  //         filterParameter.setValue([{ value, text }]); // Store as an array of objects
  //         this.cdr.detectChanges(); // Trigger change detection
  //       }
  
  //       // Store the single selected parameter
  //       this.selectedParameterValueDupli = { value, text };
  //     } else {
  //       // Handle multiple selections
  //       const formattedValuesdupli = valuesArray.map((item: any) => {
  //         const { value, text } = item; // Destructure value and text
  //         return { value, text }; // Create an object with value and text
  //       });
  
  //       console.log('Formatted Multiple Items:', formattedValuesdupli);
  
  //       // Update the form control with the concatenated values (array of objects)
  //       const filterParameter = this.createKPIWidget.get('filterParameter1');
  //       if (filterParameter) {
  //         filterParameter.setValue(formattedValuesdupli);
  //         this.cdr.detectChanges(); // Trigger change detection
  //       }
  
  //       // Store the multiple selected parameters
  //       this.selectedParameterValueDupli = formattedValuesdupli;
  //     }
  //   } else if (event && event.itemValue) {
  //     // Handle the case where `itemValue` exists
  //     const { value, text } = event.itemValue;
  //     console.log('Single Selected Item from itemValue:', { value, text });
  
  //     // Update the form control with the single value (object)
  //     const filterParameter = this.createKPIWidget.get('filterParameter1');
  //     if (filterParameter) {
  //       filterParameter.setValue([{ value, text }]); // Store as an array of objects
  //       this.cdr.detectChanges(); // Trigger change detection
  //     }
  
  //     // Store the single selected parameter
  //     this.selectedParameterValueDupli = { value, text };
  //   } else {
  //     console.warn('Invalid event structure:', event);
  //   }
  // }



//   dynamicparameterValue1(event: any): void {
//     console.log('Event check for dynamic param:', event);

//     if (event && event.value && Array.isArray(event.value)) {
//         const valuesArray = event.value;

//         if (valuesArray.length === 1) {
//             // Handle single selection
//             const singleItem = valuesArray[0];
//             const { value, text } = singleItem; // Destructure value and text
//             console.log('Single Selected Item:', { value, text });

//             // Update the form control with the single value (object)
//             const filterParameter = this.createKPIWidget.get('filterParameter1');
//             if (filterParameter) {
//                 filterParameter.setValue([{ value, text }]); // Store as an array of objects
//                 this.cdr.detectChanges(); // Trigger change detection
//             }

//             // Store the single selected parameter
//             this.selectedParameterValueDupli = { value, text };
//         } else {
//             // Handle multiple selections
//             const formattedValuesdupli = valuesArray.map((item: any) => {
//                 const { value, text } = item; // Destructure value and text
//                 return { value, text }; // Create an object with value and text
//             });

//             console.log('Formatted Multiple Items:', formattedValuesdupli);

//             // Update the form control with the concatenated values (array of objects)
//             const filterParameter = this.createKPIWidget.get('filterParameter1');
//             if (filterParameter) {
//                 filterParameter.setValue(formattedValuesdupli);
//                 this.cdr.detectChanges(); // Trigger change detection
//             }

//             // Store the multiple selected parameters
//             this.selectedParameterValueDupli = formattedValuesdupli;
//         }
//     } else if (event && event.itemValue) {
//         // Handle the case where `itemValue` exists
//         const { value, text } = event.itemValue;
//         console.log('Single Selected Item from itemValue:', { value, text });

//         // Update the form control with the single value (object)
//         const filterParameter = this.createKPIWidget.get('filterParameter1');
//         if (filterParameter) {
//             filterParameter.setValue([{ value, text }]); // Store as an array of objects
//             this.cdr.detectChanges(); // Trigger change detection
//         }

//         // Store the single selected parameter
//         this.selectedParameterValueDupli = { value, text };
//     } else {
//         console.warn('Invalid event structure:', event);
//     }
// }

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
      const filterParameter = this.createKPIWidget.get('filterParameter');
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
      const filterParameter = this.createKPIWidget.get('filterParameter');
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
  predefinedList = [
    {value:'Progress',text:'Progress'},
    {value:'Rating',text:'Rating'},
    {value:'HTML',text:'HTML'},
    {value:'None',text:'None'},

  ]
  validateAndSubmit() {
    if (this.createKPIWidget.invalid) {
      // ✅ Mark all fields as touched to trigger validation messages
      Object.values(this.createKPIWidget.controls).forEach(control => {
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
    this.addTile('TableWidget');
    this.modal.dismiss();
  }
  
}
