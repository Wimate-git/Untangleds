import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { APIService } from 'src/app/API.service';
import { SharedService } from 'src/app/pages/shared.service';

@Component({
  selector: 'app-advanced-filter',
  standalone: false,
  templateUrl: './advanced-filter.component.html',
  styleUrl: './advanced-filter.component.scss'
})
export class AdvancedFilterComponent {

  @Input() selectedForms:any;
  @Input() userList:any;
  @Input() AdvancedExcelData:any

  isModalOpen = false;
  config = {
    selectedColumns: [],
    filterCriteria: '',
  };
  columns = ['Column 1', 'Column 2', 'Column 3', 'Column 4']; 


  mainFormGroup: FormGroup;
  customLocationGroup:FormGroup;
  reportsFeildsAdvanced:FormGroup;
  customMiniColumns:FormGroup;

  isFormAdvancedVisible = false;
  addMiniTableFilters:boolean = false
  addMiniTableCustomColumns:boolean = false
  addExcellOptions: boolean;
  getLoggedUser: any;
  SK_clientID: any;
  miniTableFormBuilderData: any = {};

  constructor(public modal: NgbActiveModal,private fb: FormBuilder,private cd:ChangeDetectorRef,private api:APIService,private configService:SharedService){}

  @Output() configSaved = new EventEmitter<any>();

  ngOnInit(){
    console.log("From the parent ",this.AdvancedExcelData);


    this.mainFormGroup = this.fb.group({
      dynamicConditions: this.fb.array([this.createConditionGroup()])  
    });

    this.customLocationGroup = this.fb.group({
      customForms: this.fb.array([this.createCustomForm1()])
    });

    this.getLoggedUser = this.configService.getLoggedUserDetails()
    this.SK_clientID = this.getLoggedUser.clientID;

    if(this.AdvancedExcelData == undefined){

      this.reportsFeildsAdvanced = this.fb.group({
        addExcellOption:['all'],
        advanceOption: ['all'],
        miniTableColumn:['all'],
        miniTableOptions: ['all'],
        equationConditionText:['']
      });
        
      
      this.initializeForm();

      this.initializeMiniTable();

    }
    else{
      console.log("Parent data to be populated ")
      this.repopulateAllForm()
    }
  }



  repopulateAllForm(){

    this.initializeForm();

    this.initializeMiniTable();


    const advancedreportsFeildsAdvanced = this.AdvancedExcelData.advancedreportsFeildsAdvanced
    const advancedLocationFilter = this.AdvancedExcelData.advancedLocationFilter
    const advancedEquationFilter = this.AdvancedExcelData.advancedEquationFilter
    const advancedMiniTableFilter = this.AdvancedExcelData.advancedMiniTableFilter
    const advancedcustomMiniColumns = this.AdvancedExcelData.advancedcustomMiniColumns

    this.reportsFeildsAdvanced = this.fb.group({
      addExcellOption:[advancedreportsFeildsAdvanced.addExcellOption],
      advanceOption: [advancedreportsFeildsAdvanced.advanceOption],
      miniTableColumn:[advancedreportsFeildsAdvanced.miniTableColumn],
      miniTableOptions: [advancedreportsFeildsAdvanced.miniTableOptions],
      equationConditionText:[advancedreportsFeildsAdvanced.equationConditionText]
    });

    if(advancedreportsFeildsAdvanced.advanceOption !== 'all'){
      this.populateAdvanceFilterForm(advancedLocationFilter)
      this.isFormAdvancedVisible = true
    }

    if(advancedreportsFeildsAdvanced.addExcellOption != 'all'){
      this.repopulateForm(advancedEquationFilter)
      this.addExcellOptions = true
    }


    if(advancedreportsFeildsAdvanced.miniTableOptions != 'all'){
      this.onMiniTableColumns('onCondition','edit','')
      this.repopulateCustomMiniFilter(advancedMiniTableFilter.formGroups)
      this.addMiniTableFilters = true
    }


    if(advancedreportsFeildsAdvanced.miniTableColumn != 'all'){
      this.onMiniCustomColumns('onCondition','edit','')
      this.repopulateCustomMiniFilter1(advancedcustomMiniColumns.miniCustomColumns)
      this.addMiniTableCustomColumns = true
    }

  }
  


getConditions() {
  return this.mainFormGroup.get('dynamicConditions') as FormArray;
}


isDropdownName(formIndex: number): boolean {
  try {
    const selectedField = this.getConditions().at(formIndex).value.field;
    return selectedField === 'name'; 
  } catch (error) {
    console.error('Error in dynamic dropdown:', error);
    return false;
  }
}



populateAdvanceFilterForm(formData: any): void {
 
  const dynamicConditionsArray = this.mainFormGroup.get('dynamicConditions') as FormArray;

 
  dynamicConditionsArray.clear();


  formData.dynamicConditions.forEach((conditionData: any) => {
    dynamicConditionsArray.push(this.populateAdvanceFilterCondition(conditionData));
  });


  this.cd.detectChanges();
}


getSelectedFieldName(conditionIndex: number): string {
  const selectedField = this.getConditions().at(conditionIndex).value.field;
  return selectedField
}



 populateAdvanceFilterCondition(conditionData: any): FormGroup {
return this.fb.group({
  field: [conditionData.field, Validators.required],
  operator: [conditionData.operator, Validators.required],
  value: [conditionData.value, Validators.required],
  logicalOperator: [conditionData.logicalOperator, Validators.required],
  bracket:[conditionData && conditionData.bracket ? conditionData.bracket : '', Validators.required]
});
}




addCustomForm1(): void {
  this.fb.group({
     dynamicConditions: this.fb.array([this.createConditionGroup()]) 
    })
}


createConditionGroup(): FormGroup {
  return this.fb.group({
    field: ['', Validators.required],        
    operator: ['', Validators.required],   
    value: ['', Validators.required],        
    logicalOperator: [''],                  
    bracket:['']
  });
}


async addNewCondition() {
  this.getConditions().push(this.createConditionGroup());
}


removeConditionItem(index: number) {
  this.getConditions().removeAt(index);
}


getFormTitle() {
  return "Track Location";
}


// Insert selected field into the equation
async insertFieldIntoAdvancedCondition() {

  const resultCondition = await this.buildConditionLocationString(this.mainFormGroup.value.dynamicConditions)

  if (resultCondition) {
    this.reportsFeildsAdvanced.get('equationConditionText')?.setValue(resultCondition);
  }
}


async buildConditionLocationString(conditions:any) {
  let conditionString = '';

  conditions.forEach((condition: { operator: string; bracket: any; field: any; value: any; logicalOperator: any; }, index: number) => {
    const operator = condition.operator;
    const bracket = condition.bracket

    let formattedCondition = ''
    if(condition.operator == 'includes'){
      formattedCondition = `\${${condition.field}}.${operator}('${condition.value}')`;
    }
    else if(condition.operator == 'startsWith'){
      formattedCondition = `\${${condition.field}}.${operator}('${condition.value}')`;
    }
    else if(condition.operator == 'endsWith'){
      formattedCondition = `\${${condition.field}}.${operator}('${condition.value}')`;;
    }
    else if(bracket == "("){
      formattedCondition = `${bracket}\${${condition.field}} ${operator} '${condition.value}'`;
    }
     else if(bracket == ")"){
      formattedCondition = `\${${condition.field}} ${operator} '${condition.value}'`+ bracket;
    }
    else{
      formattedCondition = `\${${condition.field}} ${operator} '${condition.value}'`;
    }


   

 
    conditionString += formattedCondition;

    if (index !== conditions.length - 1) {
      const logicalOperator = condition.logicalOperator ? condition.logicalOperator : '';
      conditionString += ` ${logicalOperator} `;
    }
  });

  console.log("conditionString ",conditionString);

  return conditionString;
}










//Custom Track Location methods are here

customForms1(): FormArray {
  return this.customLocationGroup.get('customForms') as FormArray;
}



repopulateForm(data: any): void {

  const customFormsArray = this.customForms1();
  customFormsArray.clear();

  data.customForms.forEach((customFormData: any) => {
    const formGroup = this.createCustomForm1Empty();
    const conditionsArray = formGroup.get('conditions') as FormArray;

    customFormData.conditions.forEach((conditionData: any) => {
      const conditionGroup = this.createCustomCondition1();
      conditionGroup.patchValue(conditionData);

      conditionsArray.push(conditionGroup); 
    });

    customFormsArray.push(formGroup);
  });
}






createCustomForm1Empty(): FormGroup {
  return this.fb.group({
    conditions: this.fb.array([])
  });
}



createCustomForm1(): FormGroup {
  return this.fb.group({
    conditions: this.fb.array([this.createCustomCondition1()])
  });
}

createCustomCondition1(): FormGroup {
  return this.fb.group({
    columnName: ['', Validators.required],
    field: ['', Validators.required],
    equationText: ['', Validators.required],
    predefined:['none'],
    aggregate:['']
  });
}

getCustomFormName1(): string {
  return 'Track Location'; // Static name as per your example
}

customConditions1(): any {
  return (this.customForms1().at(0).get('conditions') as FormArray);
}

// Insert selected field into the equation
insertFieldIntoEquation1(index:any) {

  console.log(this.customConditions1());

  const condition = this.customConditions1().at(index);
  const fieldSelector = condition.get('field')?.value;

  console.log("Field selected is ",fieldSelector);
  const equationText = condition.get('equationText')?.value;

  if (fieldSelector) {
    const updatedEquation = `${equationText} \${${fieldSelector}}`; // Enclose the fieldSelector in ${}
    condition.get('equationText')?.setValue(updatedEquation);
  }
}

addCustomCondition1(): void {
  const conditions = this.customConditions1();
  conditions.push(this.createCustomCondition1());
}

removeCustomCondition1(formIndex: number, condIndex: number): void {
  const conditions = this.customForms1().at(formIndex).get('conditions') as FormArray;
  console.log("Conditions are here ",conditions);
  conditions.removeAt(condIndex);
}




onCustomColumns(event:any,getValue:any,temp:any){
  let selectedValue
  if(getValue == 'html'){
    selectedValue = (event.target as HTMLInputElement).value;
  }
  else{
    selectedValue = event;
  }

  console.log("Selected value is ",selectedValue);

  if(selectedValue == "all"){
    this.reportsFeildsAdvanced.get('addExcellOption')?.patchValue('all')
    this.addExcellOptions = false
    return
  }
  
  this.reportsFeildsAdvanced.get('addExcellOption')?.patchValue('onCondition')

  this.addExcellOptions = true

 this.cd.detectChanges()
}




async onMiniTableColumns(event:any,getValue:any,temp:any){
  let selectedValue
  if(getValue == 'html'){
    selectedValue = (event.target as HTMLInputElement).value;
  }
  else{
    selectedValue = event;
  }

  console.log("Selected value is ",selectedValue);

  if(selectedValue == "all"){
    this.reportsFeildsAdvanced.get('miniTableOptions')?.patchValue('all')
    this.addMiniTableFilters = false
    return
  }
  
  this.reportsFeildsAdvanced.get('miniTableOptions')?.patchValue('onCondition')

  this.addMiniTableFilters = true

  this.miniTableFormBuilderData = {}

  for (let form of this.selectedForms) {
  
    const tableNames = form.dynamicForm
      .filter((item: any) => item.name.startsWith('table-'))
      .map((item: any) => item.validation.formName_table);
  

    for (let table of tableNames) {
      const result = await this.api.GetMaster(
        `${this.SK_clientID}#dynamic_form#${table}#main`, 1
      );
  
      if (result && result.metadata) {
        const tempHolder = JSON.parse(result.metadata).formFields;
        
       
        this.miniTableFormBuilderData[`${table}`] = tempHolder ;
      }
    }
  }
  

  console.log("All mini table form data irrespective of forms",this.miniTableFormBuilderData);


  this.cd.detectChanges()
}



async onMiniCustomColumns(event:any,getValue:any,temp:any){
  let selectedValue
  if(getValue == 'html'){
    selectedValue = (event.target as HTMLInputElement).value;
  }
  else{
    selectedValue = event;
  }

  console.log("Selected value is ",selectedValue);

  if(selectedValue == "all"){
    this.reportsFeildsAdvanced.get('miniTableColumn')?.patchValue('all')
    this.addMiniTableCustomColumns = false
    return
  }
  
  this.reportsFeildsAdvanced.get('miniTableColumn')?.patchValue('onCondition')

  this.addMiniTableCustomColumns = true



  if(!this.addMiniTableFilters){
    for (let form of this.selectedForms) {
  
      const tableNames = form.dynamicForm
        .filter((item: any) => item.name.startsWith('table-'))
        .map((item: any) => item.validation.formName_table);
    
  
      for (let table of tableNames) {
        const result = await this.api.GetMaster(
          `${this.SK_clientID}#dynamic_form#${table}#main`, 1
        );
    
        if (result && result.metadata) {
          const tempHolder = JSON.parse(result.metadata).formFields;
          
         
          this.miniTableFormBuilderData[`${table}`] = tempHolder ;
        }
      }
    }
  }
 
  

  console.log("All mini table form data irrespective of forms",this.miniTableFormBuilderData);


 this.cd.detectChanges()
}






async onAdvancedOptions(event: any,getValue:any,key:any) {


  let selectedValue
  if(getValue == 'html'){
    selectedValue = (event.target as HTMLInputElement).value;
  }
  else{
    selectedValue = event;
  }

  if(selectedValue == "all"){
    this.reportsFeildsAdvanced.get('advanceOption')?.patchValue('all')
    this.isFormAdvancedVisible = false
    return
  }
  
  this.reportsFeildsAdvanced.get('advanceOption')?.patchValue('onCondition')

  this.isFormAdvancedVisible = true

 this.cd.detectChanges()
}














queryBuilderForm: FormGroup;


// getAvailableFields(formIndex: any):any {
//   const tempHolder = this.miniTableFormBuilderData.filter((item:any)=>Object.keys(item).includes(formIndex))
//   console.log("tempHolder ",tempHolder);
//   return tempHolder && tempHolder[0] ? tempHolder[0].formIndex : [];
// }



initializeForm() {
  this.queryBuilderForm = this.fb.group({
    formGroups: this.fb.array([])
  });

  this.selectedForms.forEach((form:any) => {
    this.addFormGroup(form);
  });

}


get formGroups(): FormArray {
  return this.queryBuilderForm.get('formGroups') as FormArray;
}


addFormGroup(form: any) {
  const formGroup = this.fb.group({
    name: [form.formName],
    tables: this.fb.array([])
  });

  this.formGroups.push(formGroup);

  let tableName = form.dynamicForm.filter((item:any)=>{
      if(item.name.startsWith('table-')){
        console.log("Item to be selected is ",item.validation.formName_table);
        return item.validation.formName_table
      }
  })

  tableName = tableName.map((ele:any)=>ele.validation.formName_table)

  console.log("tableName are ",tableName);

  for(let table of tableName){
    this.addTable(this.formGroups.length - 1, table);
  }

}

// Get tables FormArray for a specific form group
getTables(formGroupIndex: number): FormArray {
  return this.formGroups.at(formGroupIndex).get('tables') as FormArray;
}

// Add a new table to a form group
addTable(formGroupIndex: number, tableName: string) {
  const table = this.fb.group({
    tableName: [tableName],
    conditions: this.fb.array([])
  });

  this.getTables(formGroupIndex).push(table);
  this.addCondition(formGroupIndex, this.getTables(formGroupIndex).length - 1);
}

// Get conditions FormArray for a specific table
getConditions1(formGroupIndex: number, tableIndex: number): FormArray {
  return this.getTables(formGroupIndex).at(tableIndex).get('conditions') as FormArray;
}

// Add a new condition to a table
addCondition(formGroupIndex: number, tableIndex: number) {
  const condition = this.fb.group({
    field: ['', Validators.required],
    operator: ['==', Validators.required],
    value: ['', Validators.required],
    logicalOperator: ['&&']
  });

  this.getConditions1(formGroupIndex, tableIndex).push(condition);
}

// Remove a condition from a table
removeCondition(formGroupIndex: number, tableIndex: number, conditionIndex: number) {
  this.getConditions1(formGroupIndex, tableIndex).removeAt(conditionIndex);
}




repopulateCustomMiniFilter(data: any) {
  console.log("this.query form ", this.queryBuilderForm);

  data.forEach((form: any, formIndex: number) => {
    // Ensure you're adding tables to the correct form group, using formIndex
    form.tables.forEach((table: any) => {
      this.addTableForExistingData(formIndex, table);
    });
  });
}


addTableForExistingData(formGroupIndex: number, table: any) {

  let existingTableGroup: any = null;

  // Loop through all existing tables in the formGroup
  this.getTables(formGroupIndex).controls.forEach((existingTable: any) => {
    if (existingTable.get('tableName').value === table.tableName) {
      existingTableGroup = existingTable;  // Table already exists
    }
  });

  if (!existingTableGroup) {
    // If the table doesn't exist, add it
    const tableFormGroup = this.fb.group({
      tableName: [table.tableName],
      conditions: this.fb.array([])  // Initialize conditions array
    });

    this.getTables(formGroupIndex).push(tableFormGroup);

    // Add conditions for the table
    table.conditions.forEach((condition: any) => {
      this.addConditionForExistingData(formGroupIndex, this.getTables(formGroupIndex).length - 1, condition);
    });
  } else {
    // If the table already exists, clear the existing conditions and add the new ones
    console.log(`Table ${table.tableName} already exists, replacing conditions.`);

    // Get the existing conditions array
    const tableConditionsArray = existingTableGroup.get('conditions') as FormArray;

    // Clear existing conditions (this replaces all of them)
    tableConditionsArray.clear();  // This clears the previous conditions

    // Add new conditions to the table
    table.conditions.forEach((condition: any) => {
      this.addConditionForExistingData(formGroupIndex, this.getTables(formGroupIndex).controls.indexOf(existingTableGroup), condition);
    });
  }
}




addConditionForExistingData(formGroupIndex: number, tableIndex: number, condition: any) {
  const conditionFormGroup = this.fb.group({
    field: [condition.field, Validators.required],
    operator: [condition.operator, Validators.required],
    value: [condition.value, Validators.required],
    logicalOperator: [condition.logicalOperator || '&&']
  });

  this.getConditions1(formGroupIndex, tableIndex).push(conditionFormGroup);
}



















// Submit form data
onSubmit() {
  if (this.queryBuilderForm.valid) {
    console.log(this.queryBuilderForm.value);
  }
}





//Custom Columns Formulae
get miniCustomColumns(): FormArray {
  return this.customMiniColumns.get('miniCustomColumns') as FormArray;
}


initializeMiniTable(){

  this.customMiniColumns = this.fb.group({
    miniCustomColumns:this.fb.array([])
  })

  this.selectedForms.forEach((form:any) => {
    this.addFormGroupCustom(form);
  });
}



addFormGroupCustom(formData:any){
  const formGroup = this.fb.group({
    name:[formData.formName],
    tables:this.fb.array([])
  })

  this.miniCustomColumns.push(formGroup)

 
  let tableName = formData.dynamicForm.filter((item:any)=>{
      if(item.name.startsWith('table-')){
        console.log("Item to be selected is ",item.validation.formName_table);
        return item.validation.formName_table
      }
    })

    tableName = tableName.map((ele:any)=>ele.validation.formName_table)

    console.log("tableName are ",tableName);

    for(let table of tableName){
      console.log("this.formGroups.length ",this.miniCustomColumns.length - 1);
      this.addCustomTable(this.miniCustomColumns.length - 1, table);
    }
  }



  addCustomTable(formGroupIndex: number, tableName: string) {
    const table = this.fb.group({
      tableName: [tableName],
      conditions: this.fb.array([])
    });
  
    this.getCustomTables(formGroupIndex).push(table);
    this.addCustomCondition(formGroupIndex, this.getCustomTables(formGroupIndex).length - 1);
  }


  getCustomTables(formGroupIndex: number): FormArray {
    return this.miniCustomColumns.at(formGroupIndex).get('tables') as FormArray;
  }


  addCustomCondition(formGroupIndex: number, tableIndex: number) {
    const condition = this.fb.group({
      columnName: ['', Validators.required],
      field: ['', Validators.required],
      equationText: ['', Validators.required],
      predefined:['none'],
      aggregate:['']
    });
  
    this.getCustomConditions(formGroupIndex, tableIndex).push(condition);
  }


  removeCustomCondition(formGroupIndex: number, tableIndex: number, conditionIndex: number) {
    const conditions = this.getCustomConditions(formGroupIndex, tableIndex);
    conditions.removeAt(conditionIndex);
  }


  getCustomConditions(formGroupIndex: number, tableIndex: number): FormArray {
    return this.getCustomTables(formGroupIndex).at(tableIndex).get('conditions') as FormArray;
  }


  // Insert selected field into the equation
insertFieldIntoEquationMiniTable(index:any,tableIndex:any,condIndex:any) {

  console.log(this.getCustomConditions(index,tableIndex));

  const condition = this.getCustomConditions(index,tableIndex).at(condIndex);
  console.log("Condition is here ",condition);
  const fieldSelector = condition.get('field')?.value;

  console.log("Field selected is ",fieldSelector);
  const equationText = condition.get('equationText')?.value;

  if (fieldSelector) {
    const updatedEquation = `${equationText} \${${fieldSelector}}`; // Enclose the fieldSelector in ${}
    condition.get('equationText')?.setValue(updatedEquation);
  }
}





repopulateCustomMiniFilter1(data: any) {


  data.forEach((form: any, formIndex: number) => {
    // Ensure you're adding tables to the correct form group, using formIndex
    form.tables.forEach((table: any) => {
      this.addTableForExistingData1(formIndex, table);
    });
  });
}


addTableForExistingData1(formGroupIndex: number, table: any) {

  let existingTableGroup: any = null;

  // Loop through all existing tables in the formGroup
  this.getCustomTables(formGroupIndex).controls.forEach((existingTable: any) => {
    if (existingTable.get('tableName').value === table.tableName) {
      existingTableGroup = existingTable;  // Table already exists
    }
  });

  if (!existingTableGroup) {
    // If the table doesn't exist, add it
    const tableFormGroup = this.fb.group({
      tableName: [table.tableName],
      conditions: this.fb.array([])  // Initialize conditions array
    });

    this.getCustomTables(formGroupIndex).push(tableFormGroup);

    // Add conditions for the table
    table.conditions.forEach((condition: any) => {
      this.addConditionForExistingData1(formGroupIndex, this.getTables(formGroupIndex).length - 1, condition);
    });
  } else {
    // If the table already exists, clear the existing conditions and add the new ones
    console.log(`Table ${table.tableName} already exists, replacing conditions.`);

    // Get the existing conditions array
    const tableConditionsArray = existingTableGroup.get('conditions') as FormArray;

    // Clear existing conditions (this replaces all of them)
    tableConditionsArray.clear();  // This clears the previous conditions

    // Add new conditions to the table
    table.conditions.forEach((condition: any) => {
      this.addConditionForExistingData1(formGroupIndex, this.getCustomTables(formGroupIndex).controls.indexOf(existingTableGroup), condition);
    });
  }
}




addConditionForExistingData1(formGroupIndex: number, tableIndex: number, condition: any) {
  const conditionFormGroup = this.fb.group({
      columnName: [condition.columnName, Validators.required],
      field: [condition.field, Validators.required],
      equationText: [condition.equationText, Validators.required],
      predefined:[condition.predefined],
      aggregate:[condition.aggregate]
  });

  this.getCustomConditions(formGroupIndex, tableIndex).push(conditionFormGroup);
}












  saveConfiguration() {

    //Create an packet for all excel configurations
    const advacnedExcelConfiguration = {
      advancedreportsFeildsAdvanced: this.reportsFeildsAdvanced.value,
      advancedLocationFilter:this.mainFormGroup.value,
      advancedEquationFilter:this.customLocationGroup.value,
      advancedcustomMiniColumns:this.customMiniColumns.value,
      advancedMiniTableFilter:this.queryBuilderForm.value
    }


    this.configSaved.emit(advacnedExcelConfiguration); 
    this.modal.close()
  }
}
