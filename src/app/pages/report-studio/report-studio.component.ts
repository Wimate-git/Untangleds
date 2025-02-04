import { AfterViewInit, ChangeDetectorRef, Component, DestroyRef, ElementRef, EventEmitter, OnDestroy, QueryList, TemplateRef, ViewChild, ViewChildren } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ColDef, GridApi, GridReadyEvent, Column, GridOptions, ColumnState, ColumnMovedEvent } from 'ag-grid-community';
import { APIService } from 'src/app/API.service';
import { SharedService } from '../shared.service';
import { HttpClient } from '@angular/common/http';
import { scheduleApiService } from '../schedule-api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxSpinnerService } from 'ngx-spinner';
import { catchError, defer, firstValueFrom, from, map, Observable, of, shareReplay, Subject, Subscription, take, takeUntil, timeout } from 'rxjs';
import { PrimeNGConfig } from 'primeng/api';
import Swal from 'sweetalert2';
import { ImageModalComponent } from './image-modal/image-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModuleDisplayService } from './services/module-display.service';
import { Config } from 'datatables.net';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { AgGridAngular } from 'ag-grid-angular'; 
import * as pdfMake from "pdfmake/build/pdfmake";
import { vfs } from 'pdfmake/build/vfs_fonts';
import { MapModalComponent } from './map-modal/map-modal.component';
(pdfMake as any).vfs = vfs;
import XLSX from 'xlsx-js-style';  
import { MiniTableComponent } from './mini-table/mini-table.component';
import { DynamicModalComponent } from './dynamic-modal/dynamic-modal.component';
import { FullscreenService } from './services/fullscreen.service';
import { AdvancedFilterComponent } from './components/advanced-filter/advanced-filter.component';

interface ListItem {
  [key: string]: {
    P1: any;
    P2: any;
    P3: any;
  };
}

@Component({
  selector: 'app-report-studio',
  templateUrl: './report-studio.component.html',
  styleUrl: './report-studio.component.scss'
})



export class ReportStudioComponent implements AfterViewInit,OnDestroy{
  @ViewChild('openModal1') openModal1: TemplateRef<any>;
  @ViewChild('SavedQuery') SavedQuery: TemplateRef<any>;  
  reloadEvent: EventEmitter<boolean> = new EventEmitter();
  modalRef: any;

  pageSizeOptions = [10, 25, 50, 100];

  tableTempState:any = []

  reportsFeilds: FormGroup;

   // Grid API reference
   private gridApi: GridApi;
   formList:any = []
   SK_clientID:string = ''
   getLoggedUser: any;
   tableData: any = [];
   selectedPermissions: string[] = [];
   showHeading :boolean = false;
   userList:any;

  //WorkAround is being added this should be resolved
  modalName = 'Reports'

  onSubmitFlag:boolean = false;

  saveButton:boolean = false;

   rowData: any[] = [];
   colDefs: ColDef[] = [];

   datatableConfig: Config = {};


   selectedValues: any ;
   formGroup: FormGroup;

   gridOptions: GridOptions;
   
  dateTypeConfig :any= {
    'is': { showDate: true },
    '>=': { showDate: true },
    '<=': { showDate: true },
    'between': { showStartDate: true, showEndDate: true , isBetweenTime: false },
    'between time': { showStartDate: true, showEndDate: true , isBetweenTime: true },
    'less than days ago': { showDaysAgo: true },
    'more than days ago': { showDaysAgo: true },
    'days ago': { showDaysAgo: true },
    'in the past': { showDaysAgo: true },
  };
  tableDataWithFormFilters: any = [];

  conditionflag: boolean = false;
  advancedFlag:boolean = false
  populateFormBuilder: any = [];
  isCollapsed1 = false;
  savedModulePacket: any[];
  lookup_data_savedQuery: any = [];
  listofSavedIds: any;
  username: any;
  permissionID: any;
  adminAccess: boolean = false;

  savedQuery: any;
  private routeSub: Subscription;
  original_lookup_data: any = [];
  editSavedDataArray: any = [];
  validForms: any;
  visibiltyflag: boolean = false;
  dropdownKeys: any = [];
  populateFormData: any = [];
columns: any;
  showTable: boolean = false;
  selectedItem: any = [];
  tempResHolder: any;

  isFilterScreen:boolean = false

    // Ensure the listener is not added multiple times
    private isImageClickListenerAdded = false;
    private isLocationClickListenerAdded = false;
    private isminiTableClickListenerAdded = false;
    private isapprovalClickListenerAdded = false;
    private isMarkerClickListenerAdded = false;
  dyanmicFormDataArray: any = [];
  tableFormName: any = [];
  gridColumnApi: any;
  tableState: any = [];
  editOperation: boolean = false;
  customColumnsflag: boolean = false;
  urlQuery: any;
  viewMode: any = 'default';
  isFullScreen: boolean = false;
  isFormVisible: boolean = true;
  trackLocationMapFlag: boolean = false;
  trackLocationArray: any = [];
  addExcellOptions: boolean = false;
  allAdvancedExcelConfigurations: any;
  conditionReportFormString: any = '';
  isFormMiniOptionFilterVisible: boolean = false;
  isCustomMiniTable: boolean = false;
  editedQueryName: any = '';

   constructor(private fb:FormBuilder,private api:APIService,private configService:SharedService,private scheduleAPI:scheduleApiService,
    private toast:MatSnackBar,private spinner:NgxSpinnerService,private cd:ChangeDetectorRef,private modalService: NgbModal,private moduleDisplayService: ModuleDisplayService,
    private route: ActivatedRoute,private router:Router,  public fullscreenService: FullscreenService
   ){

    this.gridOptions = <GridOptions>{
      context: {
        componentParent: this
      },
      // onGridReady: this.onGridReady.bind(this),
      onColumnMoved: this.onColumnMoved,
    };
   }



    ngAfterViewInit() {

   
  }


  addLocationClickListener() {
    if (!this.isLocationClickListenerAdded) {
      window.addEventListener('location-click', (event: Event) => this.handleLocationClick(event as CustomEvent));
      this.isLocationClickListenerAdded = true;
    }
  }

  addMiniTableClickListener() {
    if (!this.isminiTableClickListenerAdded) {
      window.addEventListener('miniTable-click', (event: Event) => this.handleminiTableClick(event as CustomEvent));
      this.isminiTableClickListenerAdded = true;
    }
  }


  addMarkerClickListener() {
    if (!this.isMarkerClickListenerAdded) {
      window.addEventListener('marker-click', (event: Event) => this.handleTrackLocationClick(event as CustomEvent));
      this.isMarkerClickListenerAdded = true;
    }
  }




  addApprovalClickListener() {
    if (!this.isapprovalClickListenerAdded) {
      window.addEventListener('approve-click', (event: Event) => this.handleApprovalClick(event as CustomEvent));
      this.isapprovalClickListenerAdded = true;
    }
  }


   ngOnInit() {

    this.editedQueryName = '';

    this.editOperation = false

    this.getLoggedUser = this.configService.getLoggedUserDetails()
    this.SK_clientID = this.getLoggedUser.clientID;
    this.username = this.getLoggedUser.username;
    this.permissionID = this.getLoggedUser.permission_ID

    this.addFromService()



     this.formFieldsGroup = this.fb.group({
      forms: this.fb.array([]) 
    });


    this.customColumnsGroup = this.fb.group({
      customForms: this.fb.array([]) 
    });

    this.reportsFeilds = this.fb.group({
      dateType: ['', Validators.required],
      singleDate: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      daysAgo: ['', Validators.required],
      form_permission: [[], Validators.required], 
      form_data_selected: this.fb.array([]), // Create FormArray
      filterOption: ['all'],
      advanceOption:['all'],
      addExcellOption:['all'],
      columnOption: ['all'],
      addColumn:['false'],
      excelSheets:[[]]
    });


     this.reportsFeilds.get('dateType')?.valueChanges.subscribe(value => {
      this.onDateTypeChange(value);
    });


    this.checkPermissions()


    
    this.routeSub = this.route.queryParams.subscribe((params) => {
      this.savedQuery = params['savedQuery'];
      this.urlQuery = params['metadata'];
      this.viewMode = params['mode']
      // console.log("Received saved query:", this.savedQuery);

      if(this.savedQuery){
        this.spinner.show()
        this.selectedValues = []
        this.editSavedQuery( this.savedQuery,'saved')
      }


      if(this.urlQuery){
        console.log("Url query is here ",this.viewMode);
          this.spinner.show()
          this.selectedValues = []
          this.editUrlSavedQuery(JSON.parse(this.urlQuery),'url')
      }
    });


    // this.getTestingParams()



    this.addLocationClickListener();
    this.addMarkerClickListener();
    this.addMiniTableClickListener()
    this.addApprovalClickListener()

  window.addEventListener('image-click', (event: any) => {
    const imageBase64 = event.detail;
    this.openImageModal(imageBase64);
  });   

    
  }   



  async checkPermissions(){
    try {
      await this.api.GetMaster(`${this.SK_clientID}#permission#${this.permissionID}#main`, 1).then((result: any) => {
        if (result) {

          console.log("Result is here ",result);

          const helpherObj = JSON.parse(result.metadata).advance_report;
          this.adminAccess = helpherObj.includes('All Report ID Access') == true

          const tempholder = JSON.parse(JSON.parse(result.metadata).dynamicEntries)

         const permissionChecker = tempholder.filter((item:any)=>item.dynamicForm.includes('All'))

         console.log("Permission checker is here ",permissionChecker);

         if(permissionChecker && Array.isArray(permissionChecker) && permissionChecker.length > 0){

         }
         else{
          this.validForms = tempholder.filter((item:any)=>item.permission.includes('Read') == true)

          this.formList = this.validForms.map((item:any)=>item.dynamicForm[0])
         }

        

         this.cd.detectChanges()

        }
      });
    } catch (err) {
      console.log("Error fetching the dynamic form data ", err);
    }
  }


  openModal(content: any) {
    this.modalRef = this.modalService.open(this.SavedQuery, { size: 'xl' });

    this.showQueryTable();
  }

  showQueryTable(){  
      this.datatableConfig = {}
      this.lookup_data_savedQuery = []
      this.datatableConfig = {
        serverSide: true,
        ajax: (dataTablesParameters:any, callback) => {
          this.datatableConfig = {}
          this.lookup_data_savedQuery = []
          this.fetchUserLookupdata(1,this.SK_clientID + "#savedquery" + "#lookup",'table')
            .then((resp:any) => {
              var responseData = resp || []; // Default to an empty array if resp is null
              responseData = Array.from(new Set(responseData))
                // Example filtering for search
                const searchValue = dataTablesParameters.search.value.toLowerCase();
                const filteredData = Array.from(new Set(
                  responseData
                    .filter((item: { P1: string }) => item.P1.toLowerCase().includes(searchValue.toLowerCase()))
                    .map((item: any) => JSON.stringify(item)) // Stringify the object to make it unique
                )).map((item: any) => JSON.parse(item)); // Parse back to object
    
                callback({
                  draw: dataTablesParameters.draw,
                  recordsTotal: responseData.length,
                  recordsFiltered: filteredData.length,
                  data: filteredData // Return filtered data
              });
     
              // console.log("Response is in this form ", filteredData);
            })
            .catch((error: any) => {
              console.error('Error fetching user lookup data:', error);
              // Provide an empty dataset in case of an error
              callback({
                draw: dataTablesParameters.draw,
                recordsTotal: 0,
                recordsFiltered: 0,
                data: []
              });
            });
        },
        columns: [
          {
            title: 'Name', 
            data: 'P1', 
            render: function (data, type, full) {
              const colorClasses = ['success', 'info', 'warning', 'danger'];
              const randomColorClass = colorClasses[Math.floor(Math.random() * colorClasses.length)];
              
              const initials = data[0].toUpperCase();
    
              const nameAndEmail = `
                <div class="d-flex flex-column" data-action="editQueryTable" data-id="${full.id} ">
                  <a href="javascript:;" class="text-gray-800 text-hover-primary mb-1">${data}</a>
                </div>
              `;
    
              return `
                ${nameAndEmail}
              `;
            }
          },
          {
            title: 'Created User', data: 'P2',
            render: function (data, type, full) {

              let username
              if(data.username == "Me"){
                username = `<span class="badge badge-success">Me</span>`
              }
              else{
                username = `<span class="badge badge-warning">${data.username}</span>`
              }
        

              return username
             } 
          },
          {
            title: 'Updated', data: 'P3', render: function (data) {
              const date = new Date(data * 1000).toLocaleDateString() + " " + new Date(data * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  
              // const date = new Date(data * 1000);
              // return `${date.toDateString()} ${date.toLocaleTimeString()}`; // Format the date and time
              return date
            }
          }
        ],
        createdRow: (row, data, dataIndex) => {
          $('td:eq(0)', row).addClass('d-flex align-items-center');
        }
    };
    
    }


 
  onDateTypeChange(value: string) {

    this.reportsFeilds.get('singleDate')?.clearValidators();
    this.reportsFeilds.get('startDate')?.clearValidators();
    this.reportsFeilds.get('endDate')?.clearValidators();
    this.reportsFeilds.get('daysAgo')?.clearValidators();

    const config = this.dateTypeConfig[value];

    if (config) {
      if (config.showDate) {
        this.reportsFeilds.get('singleDate')?.setValidators([Validators.required]);
      }

      if (config.showStartDate) {
        this.reportsFeilds.get('startDate')?.setValidators([Validators.required]);
      }

      if (config.showEndDate) {
        this.reportsFeilds.get('endDate')?.setValidators([Validators.required]);
      }

      if (config.showDaysAgo) {
        this.reportsFeilds.get('daysAgo')?.setValidators([Validators.required, Validators.min(1)]);
      }
    }

    this.reportsFeilds.get('singleDate')?.updateValueAndValidity();
    this.reportsFeilds.get('startDate')?.updateValueAndValidity();
    this.reportsFeilds.get('endDate')?.updateValueAndValidity();
    this.reportsFeilds.get('daysAgo')?.updateValueAndValidity();
  }



forms(): FormArray {
  return this.formFieldsGroup.get('forms') as FormArray;
}

conditions(formIndex: number): FormArray {
  return (this.forms().at(formIndex).get('conditions') as FormArray);
}


addForm(): void {
  this.forms().push(this.fb.group({
    conditions: this.fb.array([this.createCondition()])
  }));
}


removeForm(index: number): void {
  this.forms().removeAt(index);
}

addCondition(formIndex: number): void {
  const conditionsArray = this.conditions(formIndex);
  conditionsArray.push(this.createCondition()); 


  if (conditionsArray.length > 1) {
    this.addOperatorToPreviousCondition(formIndex);
  }
}

removeCondition(formIndex: number, conditionIndex: number): void {
  const conditionsArray = this.conditions(formIndex);
  conditionsArray.removeAt(conditionIndex);
}

createCondition(): FormGroup {
  return this.fb.group({
    condition: ['', Validators.required],
    operator: ['', Validators.required], 
    value: ['', Validators.required],
    operatorBetween:['',Validators.required]
  });
}

addOperatorToPreviousCondition(formIndex: number): void {
  const conditionsArray = this.conditions(formIndex);
  const lastCondition = conditionsArray.at(conditionsArray.length - 2); 
  lastCondition.get('operatorBetween')?.setValue('&&');
}

getFormNameByIndex(index: number): string {
  const selectedFormValue = this.selectedForms[index];
  return selectedFormValue
}

multiSelectChange(): void {
  const formsArray = this.forms();
  formsArray.clear();  
  const customArray = this.customForms()
  customArray.clear()
  this.visibiltyflag = false
  this.reportsFeilds.get('filterOption')?.setValue('all');
  this.reportsFeilds.get('addColumn')?.setValue('false');
  this.reportsFeilds.get('columnOption')?.setValue('all');
  this.populateFormBuilder = []
  this.populateFormData = []
  this.conditionflag = false
  this.customColumnsflag = false
  this.populateCustomFormBuilder = []

  this.selectedForms.forEach(() => {
    this.addForm(); 
    this.addCustomForm(); 
  });



}





get formDataSelected(): FormArray {
  return this.reportsFeilds.get('form_data_selected') as FormArray;
}

async onColumnChange(event: any, getValue: string): Promise<void> {

  let selectedValue: any;

   // Determine how to get the selected value based on 'getValue'
   if (getValue === 'html') {
    selectedValue = (event.target as HTMLInputElement).value;
  } else {
    selectedValue = event;
  }



  if(selectedValue == "all"){
    this.reportsFeilds.get('columnOption')?.patchValue('all')
    this.visibiltyflag = false
    return
  }


  this.reportsFeilds.get('columnOption')?.patchValue('onCondition')
  // console.log('Get value is here ', this.selectedValues);



 

  // Handle case when selected value is 'onCondition' and populate dropdown data
  if ((selectedValue === 'onCondition' && this.populateFormData.length === 0) || this.selectedValues) {
    this.populateFormData = []

    this.spinner.show();
    try {
      let tempMetadata: any = [];
      for (let item of this.selectedForms) {
        const formName = item;
        const result = await this.api.GetMaster(
          `${this.SK_clientID}#dynamic_form#${item}#main`, 1
        );

        if (result) {
          let tempResult = JSON.parse(result.metadata || '').formFields;
          tempMetadata = {};
          let geoFlag = false
          let trackFlag = false
          let table = false

          tempMetadata[item] = tempResult.map((field: any) => {

            if((field.name.startsWith("map-") || field.type == 'map') && geoFlag == false){
              geoFlag = true
              return { name: field.name, label: "Geographic Location", formName: formName, type: field.type};
            }
            else if((field.name.startsWith("dynamic_table_values") || field.type == 'table') && table == false){
              table = true
              return { name: field.name, label: "dynamic_table_values", formName: formName,type: field.type };
            }
            else if(field && field.name && field.validation && field.validation.isTrackHistory && trackFlag == false){
              trackFlag = true
            }
            return { name: field.name, label: field.label, formName: formName,type: field.type };
          });

          //Filter all the headings and empty place holders
          // tempMetadata[item] = tempMetadata[item].filter((field:any)=>field && field.name && field.type != 'heading' && field && field.name && (!field.name.startsWith("Empty-Placeholder-")))

          tempMetadata[item] = tempMetadata[item]
          .filter((field: any) => 
            field && 
            field.name && 
            field.type !== 'heading' && 
            !field.name.startsWith("Empty-Placeholder-")
          )
          .map((field: any) => {
            // After filtering, delete the 'type' property from each object
            delete field.type;
            return field; // Return the modified field object
          });

          

          tempMetadata[item].push({ name: "approval_history", label: "approval_history", formName: formName })

          if(trackFlag){
            tempMetadata[item].push({ name: "track-3274927276", label: "trackLocation", formName: formName })
          }
       
          // console.log("tempMetadata[item] ",tempMetadata[item]);
        }
        this.populateFormData.push(tempMetadata);
      }

    

      this.populateFormData = Array.from(new Set(this.populateFormData))
      // console.log("Data to be added in dropdowns ", this.populateFormData);

    } catch (error) {
      this.spinner.hide();
      // console.log("Error in fetching form Builder data ", error);
    }
    this.spinner.hide();
  } else {
    this.visibiltyflag = false;
  }

  // Update visibility and set up dropdown keys
  if (selectedValue === 'onCondition') {
    // console.log("Succeessfullt came here ");
    this.visibiltyflag = true;
    this.dropdownKeys = this.populateFormData.map((item: any) => Object.keys(item)[0]);

    // Ensure form control array has the same number of form controls as dropdowns
    if (getValue === 'html') {
      this.selectedItem = new Array(this.dropdownKeys.length).fill(null); // Ensure empty array for selection
      this.initializeFormControls(); // Ensure FormArray is correctly populated
    }
    else{
      // console.log("Populated is called ");
      this.initializeFormControls1()
    }
    // console.log("Dropdown keys are here ", this.dropdownKeys);
  }

  this.cd.detectChanges();
}

// Helper function to initialize form controls dynamically based on dropdown count
initializeFormControls(): void {
  const formArray = this.reportsFeilds.get('form_data_selected') as FormArray;
  this.dropdownKeys.forEach((_: any, i: number) => {
    if (formArray.at(i) === undefined) {
      formArray.push(this.fb.control([])); // Each FormControl is initialized as an empty array
    }
  });
}



  // Helper function to initialize form controls dynamically based on dropdown count
  initializeFormControls1(): void {
    const formArray = this.reportsFeilds.get('form_data_selected') as FormArray;

    // Clear out the FormArray if any existing controls exist
    while (formArray.length) {
      formArray.removeAt(0);
    }


    // Loop over the new data and add FormControls
    this.selectedValues.forEach((dropdownData: any[], i: any) => {
      // Each entry in populateFormData is an array, representing the options for the respective dropdown
      const selectedValues = dropdownData && dropdownData.map(item => item); // You can choose the property to store

      // Create a new FormControl with the selected values (or empty array if no selection)
      formArray.push(this.fb.control(selectedValues));
    });

    // console.log('Form Controls Initialized:', this.reportsFeilds.value);
  }

// Ensure to type-cast the AbstractControl to FormControl for correct methods
getFormControl(index: number): FormControl {
    return this.formDataSelected.at(index) as FormControl;
}



async onFilterChange(event: any,getValue:any,key:any) {


  let selectedValue
  if(getValue == 'html'){
    selectedValue = (event.target as HTMLInputElement).value;
  }
  else{
    selectedValue = event;
  }

  if(selectedValue == "all"){
    this.reportsFeilds.get('filterOption')?.patchValue('all')
    this.conditionflag = false
    return
  }


  if (Array.isArray(this.selectedForms) == false || (this.selectedForms.length == 0 && selectedValue == "onCondition")) {
    Swal.fire({
        title: "Oops!",
        text: "You need to select at least one form before to add conditions. Please select the forms to continue.",
        icon: "warning",
        confirmButtonText: "Got it"
    });

    this.reportsFeilds.get('filterOption')?.patchValue('all')
   

    return;
  }

  
  this.reportsFeilds.get('filterOption')?.patchValue('onCondition')

  if(selectedValue == 'onCondition'){
    this.spinner.show()

    // console.log("Selected form data is here ",this.selectedForms);

    try{
      this.populateFormBuilder = []

      let tempMetadata:any = []
      for(let item of this.selectedForms){
        const formName = item
        const result = await this.api.GetMaster(`${this.SK_clientID}#dynamic_form#${item}#main`,1)

        if(result){
          let tempResult = JSON.parse(result.metadata || '').formFields
          // console.log("tempResult is ",tempResult);

          tempMetadata = {}
          tempMetadata[item] = tempResult.map((item: any) => {
            return { name: item.name, label: item.label,  formName:formName ,options:item.options , type:item.type , validation:item.validation};  
          });

          tempMetadata[item] = tempMetadata[item].filter((field:any)=>field && field.name && field.type != 'heading' && field && field.name && (!field.name.startsWith("Empty-Placeholder-")))
        }
        this.populateFormBuilder.push(tempMetadata)
      }
      
      // console.log("Data to be added in dropdowns ",this.populateFormBuilder);
    }
    catch(error){
      this.spinner.hide()
      console.log("Error in fetching form Builder data ",error);
    }

    this.spinner.hide()
    console.log("Condition flag is true");
    this.conditionflag = true
  }
  else{
    this.conditionflag = false
  }

 this.cd.detectChanges()
}



    getAvailableFields(formIndex: number) {
      const formName = this.getFormNameByIndex(formIndex);
      const formFields = this.populateFormBuilder.find((form: { [x: string]: any; }) => form[formName]);
      return formFields ? formFields[formName] : [];
    }


    isDropdown(formIndex: number,index:any): boolean {
      try{
        const selectedField = this.forms().at(formIndex).get('conditions')?.value[index]?.condition; 
        const formName = this.getFormNameByIndex(formIndex);
        const formFields = this.populateFormBuilder.find((form: { [key: string]: any }) => form[formName]);
        const field = formFields[formName].find((f: { name: string }) => f.name === selectedField);
        return field?.type === 'select';
      }

      catch(error){
        console.log("Error in dynamic dropdown ");
        return false
      }
    }
  


    private optionsCache = new Map<string, Observable<any[]>>();
    private destroy$ = new Subject<void>();
    
    getAvailableFieldOptions(formIndex: number, condIndex: any): Observable<any[]> {
      const selectedField = this.forms().at(formIndex).get('conditions')?.value[condIndex]?.condition;
      const formName = this.getFormNameByIndex(formIndex);
      
      // Create a unique cache key
      const cacheKey = `${formName}-${selectedField}`;
    
      // Return cached value if exists
      if (this.optionsCache.has(cacheKey)) {
        return this.optionsCache.get(cacheKey)!;
      }
    
      // Get field configuration
      const formFields = this.populateFormBuilder.find(
        (form: { [key: string]: any }) => form[formName]
      );
      console.log('formFields checking',formFields)
      const field = formFields[formName].find(
        (f: { name: string }) => f.name === selectedField
      );
      console.log('field checking',field)
    
      // Create the observable
      const options$ = new Observable<any[]>(observer => {
        if (!field) {
          observer.next([]);
          observer.complete();
          return;
        }
    
        if (field.validation && field.validation?.user === true) {
          const lookupKey = `${this.SK_clientID}#user#lookup`;
    
          // console.log("User list dropdown is here ");
    
          // Make API call and transform result
          from(this.fetchUserLookupdata(1, lookupKey,'')).pipe(
            map((result: any) => {
              if (result) {
                // console.log("Users List is ", result);
                return Array.from(new Set(result.map((item: any) => item.P1))).sort();
              }
              return [];
            }),
            catchError(error => {
              console.error('Error fetching users:', error);
              return of([]);
            }),
            take(1) // Ensure the observable completes after first emission
          ).subscribe({
            next: (value) => {
              observer.next(value);
              observer.complete();
            },
            error: (error) => {
              observer.error(error);
            }
          });
        }

        else if (field.validation?.isDerivedUser === true && field.validation?.form) {

          console.log("Derived user is satisfied ");

          const lookupKey = `${this.SK_clientID}#${field.validation.form}#lookup`;
    
          // Make API call and transform result
          from(this.api.GetMaster(lookupKey, 1)).pipe(
            map(result => {
              if (result?.options) {
                const options = JSON.parse(result.options);
                return this.extractDerivedUsersList(options, field.validation.field).sort()
                // return this.extractSpecificSingleSelectValue(options, field.validation.field).sort();
              }
              return [];
            }),
            catchError(error => {
              console.error('Error fetching options:', error);
              return of([]);
            }),
            take(1) // Ensure the observable completes after first emission
          ).subscribe({
            next: (value) => {
              observer.next(value);
              observer.complete();
            },
            error: (error) => {
              observer.error(error);
            }
          });
        } 
    
        else if (field.validation?.lookup === true && field.validation?.form) {

          console.log("Lookup data is satisfied");

          const lookupKey = `${this.SK_clientID}#${field.validation.form}#lookup`;
    
          // Make API call and transform result
          from(this.api.GetMaster(lookupKey, 1)).pipe(
            map(result => {
              if (result?.options) {
                const options = JSON.parse(result.options);
                return this.extractSpecificSingleSelectValue(options, field.validation.field).sort();
              }
              return [];
            }),
            catchError(error => {
              console.error('Error fetching options:', error);
              return of([]);
            }),
            take(1) // Ensure the observable completes after first emission
          ).subscribe({
            next: (value) => {
              observer.next(value);
              observer.complete();
            },
            error: (error) => {
              observer.error(error);
            }
          });
        }
       
         else {
          // Return static options if not a lookup field
          observer.next(field.options || []);
          observer.complete();
        }
      }).pipe(
        shareReplay(1), // Cache the last emitted value and share it among all subscribers
        takeUntil(this.destroy$) // Make sure to unsubscribe on destroy
      );
    
      // Store in cache
      this.optionsCache.set(cacheKey, options$);
      
      return options$;
    }
    
    // Clear cache when form field changes
    onFieldChange(formIndex: number, condIndex: number) {
      const selectedField = this.forms().at(formIndex).get('conditions')?.value[condIndex]?.condition;
      const formName = this.getFormNameByIndex(formIndex);
      const cacheKey = `${formName}-${selectedField}`;
      this.optionsCache.delete(cacheKey);
    }
    
    // Template helper to track by option value
    trackByOption(index: number, option: any): any {
      return option;
    }
    
  

    extractDerivedUsersList= (options: string[][],valueFilter:any): string[] => {
      const specificSingleSelectArray: string[] = [];
      
      options.forEach(optionGroup => {
        optionGroup.forEach(option => {
          if (option.includes(valueFilter) && option.includes('#')) {  
            const tempUser = option.split('#')[1]
            if(tempUser.includes(',')){
              specificSingleSelectArray.push(...tempUser.split(','));
            }
            else{
              specificSingleSelectArray.push(tempUser);
            }         
          }
        });
      });
    
      return Array.from(new Set(specificSingleSelectArray));
    };


    extractSpecificSingleSelectValue = (options: string[][],valueFilter:any): string[] => {
      const specificSingleSelectArray: string[] = [];
      
      options.forEach(optionGroup => {
        optionGroup.forEach(option => {
          if (option.includes(valueFilter) && option.includes('#')) {  // Checking for exact match
            specificSingleSelectArray.push(option.split('#')[1]);
          }
        });
      });
    
      return specificSingleSelectArray;
    };


  formFieldsGroup: FormGroup;
  formAdvancedGroup:FormGroup;
  customColumnsGroup:FormGroup;

  

  selectedForms: any = [];
  operators = ['=', '!=', '<', '>', '<=', '>='];

   defaultColDef: ColDef = {
     sortable: true,
     filter: true,
     resizable: true,
     flex: 1
   };
   
 
 
   // Grid Ready Event
  //  onGridReady(params: GridReadyEvent) {
  //    this.gridApi = params.api;     
  //  }

     // This method will be called once the grid is ready
  onGridReady(params: any,formFilter: string) {
    // this.gridApi = params.api;
    // this.gridColumnApi = params.columnApi;

    const gridApi = params.api;
    this.gridInstances[formFilter] = gridApi; 
    // console.log(`Grid API saved for ${formFilter}`, gridApi);
  }

   getSelectedRows() {
     const selectedNodes = this.gridApi.getSelectedNodes();
     const selectedData = selectedNodes.map(node => node.data);
    //  console.log('Selected Rows:', selectedData);  
   }






  async buildConditionString(conditions:any) {
    let conditionString = '';
  
    conditions.forEach((condition: { operator: any; condition: any; value: any; operatorBetween: any; }, index: number) => {
      const operator = condition.operator;


      let formattedCondition = ''
      if(condition.operator == 'includes'){
        formattedCondition = `\${${condition.condition}}.${operator}('${condition.value}')`;
      }
      else if(condition.operator == 'startsWith'){
        formattedCondition = `\${${condition.condition}}.${operator}('${condition.value}')`;
      }
      else if(condition.operator == 'endsWith'){
        formattedCondition = `\${${condition.condition}}.${operator}('${condition.value}')`;
      }
      else{
        formattedCondition = `\${${condition.condition}} ${operator} '${condition.value}'`;
      }


     
  
   
      conditionString += formattedCondition;

      if (index !== conditions.length - 1) {
        const logicalOperator = condition.operatorBetween ? condition.operatorBetween : '';
        conditionString += ` ${logicalOperator} `;
      }
    });
  
    return conditionString;
  }




  

   async onSubmit() {

    console.log("reportMetadata.excelSheets ",this.reportsFeilds.value.excelSheets);

    this.trackLocationMapFlag = false

    let body: any;
    this.showTable = true
    this.tableData = []; 

    let formMap
    let formValues

    if(this.visibiltyflag){
     
      formValues = this.reportsFeilds.value.form_data_selected;
      this.selectedValues = formValues

      console.log('Selected columns are here ',this.selectedValues);



      formMap = this.selectedValues.reduce((acc: { [x: string]: any[]; }, group: { formName: string | number; label: any; }[]) => {
        
        group && group.forEach((item: { formName: string | number; label: any; }) => {
            if (!acc[item.formName]) {
                acc[item.formName] = [];
            }
            acc[item.formName].push(item.label);
        });
        return acc;
      }, {});
      // console.log("Form mapped data is here on Submit",formMap);
    }
  
    this.spinner.show();

    // this.selectedItem = this.selectedValues;
    
  
    if (['between', 'between time'].includes(this.reportsFeilds.get('dateType')?.value)) {
      const startEpoch = new Date(this.reportsFeilds.get('startDate')?.value).getTime();
      const endEpoch = new Date(this.reportsFeilds.get('endDate')?.value).getTime();


      if (startEpoch >=  endEpoch) {
      
          Swal.fire({
            title: "Error",
            text: "Please ensure that the start date is earlier than the end date and all fields are filled correctly.",
            icon: "error",
            confirmButtonText: "Got it"
          });
          this.spinner.hide()
          return;
      }
  
      body = { 
        dateType: this.reportsFeilds.get('dateType')?.value,
        clientID: this.SK_clientID,
        conditionValue: [startEpoch, endEpoch]
      };
    }

    else if (['is', '>=', '<='].includes(this.reportsFeilds.get('dateType')?.value)) {
      const singleEpoch = new Date(this.reportsFeilds.get('singleDate')?.value).getTime();
      body = { 
        dateType: this.reportsFeilds.get('dateType')?.value,
        clientID: this.SK_clientID,
        conditionValue: singleEpoch
      };
    }

    else {
      body = { 
        dateType: this.reportsFeilds.get('dateType')?.value,
        clientID: this.SK_clientID,
        conditionValue: this.reportsFeilds.get('daysAgo')?.value
      };
    }
  

    const tempArray = this.reportsFeilds.get('form_permission')?.value;

    if(this.savedQuery == undefined || this.savedQuery == ''){
      this.onSubmitFlag = true
    }
    else{
      this.onSubmitFlag = false
    }
  

    const groupedData: { [key: string]: any[] } = {};
  
    for (let item of tempArray) {
      const formFilter = item;
  
      if (body) {
        body.formFilter = item;
      }
  
      // console.log("Request body is here ", body);
  
      try {

        const response = await this.scheduleAPI.sendData(body);
        // console.log('Response from Lambda:', response);

        if (!groupedData[formFilter]) {
          groupedData[formFilter] = [];
        }
        groupedData[formFilter].push( response );
      } catch (error) {
        console.error('Error calling dynamic lambda:', error);
        this.spinner.hide();
      }
    }
  

    // console.log("Data to be populated on Table is ", groupedData);

    await this.prepareData(groupedData,formMap);


    try{
        setTimeout(() => {
          this.loadColumnState()
        }, 2000);
      
    }
    catch(error){
      console.log('Error while Loading Column State ',error);
    }

    this.cd.detectChanges()
  

  }
  

  async prepareData(groupedData: { [key: string]: any[] },formMap:any) {
    const tableDataWithFormFilters:any = [];

    const formConditions = this.formFieldsGroup.value.forms
    const addCustomColumns = this.customColumnsGroup.value.customForms
  
    let index = 0;

    this.trackLocationArray = []

    for (let formFilter in groupedData) {


      const res = await this.api.GetMaster(`${this.SK_clientID}#dynamic_form#${formFilter}#main`,1)
      let dynamicMetadata:any;
      if(res && res.metadata){
        dynamicMetadata = JSON.parse(res.metadata).formFields  
      }
      // console.log("Dynamic form builder data is here ",dynamicMetadata);


      let responses = groupedData[formFilter];


      // let tempMetaArray = responses[0].map((item:any)=>item.metadata)


      let tempMetaArray = responses[0].map((item: any) => {
        let metadata = { ...item.metadata };
    
        // Add approval_history from options to metadata
        if (item.options && item.options.approval_history) {
            metadata.approval_history = item.options.approval_history;
        }
        else{
          metadata.approval_history = []
        }
    
        return metadata;
      });


      console.log("After getting options ",tempMetaArray);



      if(this.conditionflag){
        let tempArray:any = []
        const conditionalString =  await this.buildConditionString(formConditions[index].conditions)
        for(let data of tempMetaArray){
          if(await this.evaluateTemplate(conditionalString,data,'None') == true){
            tempArray.push(data)
          }
        }
        tempMetaArray = tempArray
      }

      // console.log("After filter data is here ",tempMetaArray);

      this.dyanmicFormDataArray.push({ [formFilter]: dynamicMetadata });


      console.log("addCustomColumns[index]",addCustomColumns[index]);


      if(this.customColumnsflag && addCustomColumns[index] && addCustomColumns[index].conditions && Array.isArray(addCustomColumns[index].conditions) && addCustomColumns[index].conditions.length > 0 && addCustomColumns[index].conditions[0].columnName != ''){
        let modifyRows = await this.addModifiedColumns(tempMetaArray,addCustomColumns[index].conditions)
        console.log("Modified rows are here ",modifyRows);

        if(this.visibiltyflag){
          for(let col of addCustomColumns[index].conditions){
            formMap[`${formFilter}`] && formMap[`${formFilter}`].push(col.columnName) 
          }
        }
      }



      let rows = await this.mapLabels(tempMetaArray,dynamicMetadata) 

      console.log("Rows are here ",rows);


      rows = rows.map((row: any) => {
        Object.keys(row).forEach((key) => {
          if (key.startsWith("Empty-Placeholder-") || key.startsWith("Empty Placeholder")) {
            delete row[key]; 
          }      
        });
        return row;
      });

      // console.log("After mapping labels are here ",rows);

      console.log("formMap",formMap);

      if (rows && Array.isArray(rows) && rows.length > 0 && this.visibiltyflag && formMap) {
        rows = rows.map(item => {
          let filteredItem: any = {}; // Initialize the filtered item
          
          // Loop through the fields in formMap[`${formFilter}`]
          formMap[`${formFilter}`] && formMap[`${formFilter}`].forEach((key: string) => {
            // If the key is "trackLocation" and the item has an "id", preserve it
            if (key === "trackLocation") {
              if (item.hasOwnProperty("id")) {
                filteredItem["id"] = item["id"]; // Preserve "id"
              }
            }
            if (key === "dynamic_table_values") {
              if (item.hasOwnProperty("id")) {
                filteredItem["id"] = item["id"]; // Preserve "id"
              }
            }
            
            // Check if the row item has the field key and add it to filteredItem
            if (item.hasOwnProperty(key)) {
              filteredItem[key] = item[key];
            }
          });
          
          return filteredItem;
        });
      }
      


    
  
      responses[0].metadata = rows


     
      for(let i=0;i<rows.length;i++){

        const tempHolder = Array.isArray(rows[i].trackLocation) 
        ? rows[i].trackLocation.flat()  // Flatten the array
        : [];
        this.trackLocationArray.push(...tempHolder)
        rows[i].formFilter = formFilter
      }

      // console.log("Rows are here ",rows);
      // console.log("Filtered rows are here ",rows);


      // console.log("Dyanmic Data array list this.dyanmicFormDataArray ",this.dyanmicFormDataArray);

  

      tableDataWithFormFilters.push({ formFilter, rows });
      index++;
    }
  

    this.tableDataWithFormFilters = tableDataWithFormFilters;
    console.log("Table rows are here ",this.tableDataWithFormFilters);


    console.log("All the trackLocation array are here ",this.trackLocationArray);
    if(this.trackLocationArray && Array.isArray(this.trackLocationArray) && this.trackLocationArray.length > 0){
      this.trackLocationMapFlag = true
    }

 
    this.spinner.hide()

  }




  async addModifiedColumns(rows:any,customColumns:any){

    if(this.customColumnsflag && customColumns && Array.isArray(customColumns) && customColumns.length > 0 && customColumns[0].columnName != ''){
      for(let row of rows){
        for(let col of customColumns){
          const templateResult = await this.evaluateTemplate(col.equationText,row,'split')
          row[`${col.columnName}`] = templateResult
        }
      }
    }

    return rows
  }


  
isBase64(value: string): boolean {
  const regex = /^data:image\/(png|jpeg|jpg|gif|bmp);base64,/;
  return regex.test(value);
}
 


  createColumnDefs(rowData: any[],formName:any): ColDef[] {
    const columns: any = [];
  
    if (rowData.length > 0) {
      // Check columns based on actual data across all rows
      const sampleRow = rowData[0];
  
      // Add 'formFilter' column manually
      columns.push({
        headerName: 'Form Filter',
        field: 'formFilter',
        flex: 1,
        filter: true,
        minWidth: 150,
        hide: true,
        FormName:formName
      });
  
      // Iterate through all rows to identify potential dynamic columns (e.g., Base64 images or locations)
      const dynamicColumns = this.getDynamicColumns(rowData);
  
      // Merge static columns with dynamic columns
      for (let key in dynamicColumns) {
        if (key !== 'formFilter' && key !== 'PK' && key !== 'SK' && key != 'Updated Date' && key != 'id') {
          const { isBase64Image, isLocation, isTrackLocation,isMiniTable,isApprovalHistory  } = dynamicColumns[key];
  
          // Choose renderer based on conditions
          let cellRenderer = null;
          if (isBase64Image) {
            cellRenderer = this.imageCellRenderer;
          } else if (isLocation) {
            cellRenderer = this.locationCellRenderer;
          } else if (isTrackLocation) {
         
            cellRenderer = this.trackLocationCellRenderer;
          }else if (isMiniTable) {
            cellRenderer = (params: any) => this.miniTableCellRenderer(params, formName);
          }
          else if(isApprovalHistory){
            cellRenderer = this.dynamicModalRenderer;
          }
  
          columns.push({
            headerName: this.formatHeaderName(key),
            field: key,
            flex: 1,
            minWidth: 150,
            filter: true,
            FormName:formName,
            // sortable: true,
            cellRenderer: cellRenderer,
            cellRendererParams: {
              context: this  // Ensure context is passed correctly to the renderer
            }
          });
        }
      }
  
      // Check if 'Updated Date' field exists and sort it
      if (sampleRow.hasOwnProperty('Updated Date')) {
        columns.push({
          headerName: 'Updated Date',
          field: 'Updated Date',
          flex: 1,
          filter: 'agDateColumnFilter',
          sortable: true,
          minWidth: 200,
          sort: 'desc',
          FormName:formName
        });
      }
    }
  
    return columns;
  }
  
  getDynamicColumns(rowData: any[]): any {
    const dynamicColumns: any = {};
  
    // Iterate through all rows and identify dynamic columns based on data presence
    rowData.forEach(row => {
      for (let key in row) {
        // Check if the column is Base64 image, location, or TrackLocation
        const isBase64Image = this.isBase64(row[key]);
        const isLocation = this.isLocation(key, row[key]);
        const isTrackLocation = this.isTrackLocation(key,row[key]);
        const isMiniTable = this.isMiniTable(key,row[key]);
        const isApprovalHistory = this.isApprovalHistory(key,row[key]);
  
        if (!dynamicColumns[key]) {
          dynamicColumns[key] = { isBase64Image, isLocation, isTrackLocation, isMiniTable, isApprovalHistory };
        } else {
          // If the column already exists, just update the state (no need to overwrite)
          dynamicColumns[key].isBase64Image = dynamicColumns[key].isBase64Image || isBase64Image;
          dynamicColumns[key].isLocation = dynamicColumns[key].isLocation || isLocation;
          dynamicColumns[key].isTrackLocation = dynamicColumns[key].isTrackLocation || isTrackLocation;
          dynamicColumns[key].isMiniTable = dynamicColumns[key].isMiniTable || isMiniTable;
          dynamicColumns[key].isApprovalHistory = dynamicColumns[key].isApprovalHistory || isApprovalHistory;
        }
      }
    });
  
    return dynamicColumns;
  }
  

  isTrackLocation(key:any,value: any): boolean {
    return key == 'trackLocation' && Array.isArray(value);
  }


  isMiniTable(key:any,value: any): boolean {
    return key == 'dynamic_table_values' &&  Object.keys(value).length > 0;
  }


  isApprovalHistory(key:any,value: any): boolean {
    return key == 'approval_history' &&  value.length > 0;
  }



  miniTableCellRenderer(params: any,formName:any) {

    if (params && params.value && formName) {
        const tableBody = params.value;

        // Create a container for the icon
        const container = document.createElement('div');
        container.style.display = 'flex';
        container.style.alignItems = 'center';
        container.style.justifyContent = 'center';

        // Create the Bootstrap location icon (location pin)
        const locationIcon = document.createElement('i');
        locationIcon.className = 'fa-solid fa-table';  // Bootstrap icon class for location pin
        locationIcon.style.fontSize = '24px';  // Adjust font size for better visibility
        locationIcon.style.cursor = 'pointer'; // Change cursor to pointer to indicate clickability
        locationIcon.style.color = '#1F509A';

        // Add click event listener to dispatch a custom event with location data
        locationIcon.addEventListener('click', () => {
            // Dispatch a custom event with location data
            const event = new CustomEvent('miniTable-click', {
                detail: { tableBody: tableBody ,formName:formName},
                
            });
            window.dispatchEvent(event);
        });

        // Append the icon to the container
        container.appendChild(locationIcon);

        return container;
    }

    // Return null if params or params.value is missing
    return null;
}












      trackLocationCellRenderer(params: any) {

        if (params && params.value) {
            const coordinates = params.value;

            if(coordinates && Array.isArray(coordinates) && coordinates.filter((item:any)=>item.longitude != null && item.latitude != null).length <= 0){
              return null
            }
    
            // Create a container for the icon
            const container = document.createElement('div');
            container.style.display = 'flex';
            container.style.alignItems = 'center';
            container.style.justifyContent = 'center';
    
            // Create the Bootstrap location icon (location pin)
            const locationIcon = document.createElement('i');
            locationIcon.className = 'fa-solid fa-map-location-dot';  // Bootstrap icon class for location pin
            locationIcon.style.fontSize = '24px';  // Adjust font size for better visibility
            locationIcon.style.cursor = 'pointer'; // Change cursor to pointer to indicate clickability
            locationIcon.style.color = '#1F509A';
    
            // Add click event listener to dispatch a custom event with location data
            locationIcon.addEventListener('click', () => {
                // Dispatch a custom event with location data
                const event = new CustomEvent('marker-click', {
                    detail: { coordinates: coordinates }
                });
                window.dispatchEvent(event);
            });
    
            // Append the icon to the container
            container.appendChild(locationIcon);
    
            return container;
        }
    
        // Return null if params or params.value is missing
        return null;
    }




    dynamicModalRenderer(params: any){
      if (params && params.value) {
        const coordinates = params.value;

        if(coordinates && Array.isArray(coordinates) && coordinates.length <= 0){
          return null
        }

        // Create a container for the icon
        const container = document.createElement('div');
        container.style.display = 'flex';
        container.style.alignItems = 'center';
        container.style.justifyContent = 'center';

        // Create the Bootstrap location icon (location pin)
        const locationIcon = document.createElement('i');
        locationIcon.className = 'fa-solid fa-layer-group';  // Bootstrap icon class for location pin
        locationIcon.style.fontSize = '24px';  // Adjust font size for better visibility
        locationIcon.style.cursor = 'pointer'; // Change cursor to pointer to indicate clickability
        locationIcon.style.color = '#1F509A';

        // Add click event listener to dispatch a custom event with location data
        locationIcon.addEventListener('click', () => {
            // Dispatch a custom event with location data
            const event = new CustomEvent('approve-click', {
                detail: { approval_history: coordinates }
            });
            window.dispatchEvent(event);
        });

        // Append the icon to the container
        container.appendChild(locationIcon);

        return container;
    }

    // Return null if params or params.value is missing
    return null;
    }
    
    


      isLocation(key: any,getValue:any){
        if(key == 'Geographic Location' && getValue.includes(',')){
          return true
        }
        return false
      }


 

  


      formatHeaderName(key: string): string {
        return key
          .replace(/[-_]/g, ' ')  
          .replace(/\b\w/g, char => char.toUpperCase()); 
      }

  imageCellRenderer(params: any) {
    const imageBase64 = params.value;  
    const context = params.context;    
  
    return `<img src="${imageBase64}" style="max-width: 100%; max-height: 100px;cursor: pointer;" class="image-click" onclick="window.dispatchEvent(new CustomEvent('image-click', { detail: '${imageBase64}' }))" />`;
  }

//   locationCellRenderer(params: any) {

//     // Ensure the value is a comma-separated string of latitude and longitude
//     const coordinates = typeof params.value == 'string' ? params.value.split(','):"";
//     const lat = coordinates[0];  // First part is latitude
//     const lon = coordinates[1];  // Second part is longitude

//     // If latitude and longitude are missing, default to 'No Location'
//     const locationText = lat && lon ? `${lat}, ${lon}` : 'No Location';

//     // Create a clickable link for the location
//     const link = document.createElement('a');
//     link.href = 'javascript:void(0)';
//     link.innerHTML = locationText;

//     // Add click event listener to dispatch a custom event
//     link.addEventListener('click', () => {
//         // Dispatch a custom event with location data
//         const event = new CustomEvent('location-click', {
//             detail: { latitude: lat, longitude: lon }
//         });
//         window.dispatchEvent(event);
//     });

//     return link;
// }

locationCellRenderer(params: any) {

  const coordinates = typeof params.value == 'string' ? params.value.split(',') : "";
  const lat = coordinates[0];  
  const lon = coordinates[1];  


  const locationText = lat && lon ? `${lat}, ${lon}` : null;


  const container = document.createElement('div');
  container.style.display = 'flex';
  container.style.alignItems = 'center';
  container.style.justifyContent = 'center';



  const locationIcon = document.createElement('i');
  locationIcon.className = 'bi bi-geo-alt-fill';  
  locationIcon.style.fontSize = '24px';  
  locationIcon.style.cursor = 'pointer';  
  locationIcon.style.marginRight = '8px'; 
  locationIcon.style.color = 'red';


  locationIcon.addEventListener('click', () => {
    const event = new CustomEvent('location-click', {
        detail: { latitude: lat, longitude: lon }
    });
    window.dispatchEvent(event);
  });

  container.appendChild(locationIcon);

  return container;
}




 
  openImageModal(imageBase64: string) {
    const modalRef = this.modalService.open(ImageModalComponent);
    modalRef.componentInstance.imageSrc = imageBase64; 
  }

   handleLocationClick(event: CustomEvent) {
    const { latitude, longitude } = event.detail;
    this.openLocationModal(latitude, longitude);
  }



  handleminiTableClick(event: CustomEvent) {
    const { tableBody,formName } = event.detail;    
    this.openminiTableModal(tableBody,formName);
  }



  handleApprovalClick(event: CustomEvent) {
    console.log("Event is triggered ");
    const { approval_history } = event.detail;
    this.openApprovalModal(approval_history);
  }




  handleTrackLocationClick(event: CustomEvent) {
    const { coordinates } = event.detail;
    this.openTrackLocationModal(coordinates);
  }


  openTrackLocationModal(lat: string) {
    const modalRef = this.modalService.open(MapModalComponent, { size: 'lg' });
    modalRef.componentInstance.coordinates = lat;
  }

  openApprovalModal(lat: string) {
    const modalRef = this.modalService.open(DynamicModalComponent);
    modalRef.componentInstance.approvalHistory = lat;
  }




  openLocationModal(lat: string, lon: string) {
    const modalRef = this.modalService.open(MapModalComponent, { size: 'lg' });
    modalRef.componentInstance.latitude = lat;
    modalRef.componentInstance.longitude = lon;
  }


  openminiTableModal(tableBody: string,formName:any) {
    const modalRef = this.modalService.open(MiniTableComponent, { size: 'xl' });
    modalRef.componentInstance.tableBody = tableBody;
    modalRef.componentInstance.dynamicFormData = this.dyanmicFormDataArray
    modalRef.componentInstance.formName = formName
  }

  async openAdvancedFilterModal() {


    try{
      this.spinner.show()

      console.log("his.selectedForms ",this.selectedForms);

      if(!this.selectedForms && this.selectedForms){
        this.spinner.hide()
        return
      }
  
      let SelectedFormInput = []
      for(let form of this.selectedForms){
        const result = await this.api.GetMaster(this.SK_clientID + "#dynamic_form#"+ form +"#main", 1)
        if(result && result.metadata){
          const metadata = JSON.parse(result.metadata).formFields
          SelectedFormInput.push({formName:form,dynamicForm:metadata})
        }
      }
     
  
  
      const modalRef = this.modalService.open(AdvancedFilterComponent, { size: 'xl' });
      modalRef.componentInstance.selectedForms = SelectedFormInput;
      modalRef.componentInstance.userList = this.userList
      modalRef.componentInstance.AdvancedExcelData = this.allAdvancedExcelConfigurations


     
       modalRef.componentInstance.configSaved.subscribe((data: any) => {
        console.log('All advanced excel configurations are:', data);
        this.allAdvancedExcelConfigurations = JSON.parse(JSON.stringify(data))
      });

      this.spinner.hide()
     
    }
    catch(error){
      this.spinner.hide()
      console.log("Error in getting Dynamic form for Open Modal ",error);
    }

   
  }
 

 


  async addFromService(){    
    try {
      await this.api.GetMaster(this.SK_clientID + "#dynamic_form#lookup", 1).then((result: any) => {
        if (result) {
          const helpherObj = JSON.parse(result.options);
    
          // Corrected the map function
          this.formList = helpherObj.map((item: any) => (item[0]));

          console.log("Form list is here ",this.formList);
        }
      });
    } catch (err) {
      console.log("Error fetching the dynamic form data ", err);
    }





    try{
      const result = await this.fetchUserLookupdata(1,`${this.SK_clientID}#user#lookup`,'')

      console.log("Result USer ",result);

      this.userList = result.map((item:any)=>item.P1)
    }
    catch(error){
      console.log("Error fetching user list ",);
    }
  }



  // Getter for easier access in template
  get dateType() {
    return this.reportsFeilds.get('dateType');
  }


  clearFeilds() {


    this.editedQueryName = ''
    this.allAdvancedExcelConfigurations = undefined

    this.addExcellOptions = false
    this.trackLocationMapFlag = false
    this.editOperation = false;
    this.tableState = {};
    this.showTable = false

    this.forms().clear()
    this.customForms().clear()
    // this.customForms1().clear()
    

    this.customColumnsflag = false
    this.populateCustomFormBuilder = []
  
    this.tableDataWithFormFilters = [];
    this.showTable = false;
    this.saveButton = false;
    this.onSubmitFlag = false;
    this.selectedForms = [];
    this.conditionflag = false;
    this.reportsFeilds.reset();
    this.populateFormData = [];
    this.visibiltyflag = false;
    this.savedQuery = '';
  
    this.selectedValues = [];
  
    if (this.modalName == 'Reports') {
      this.router.navigate(['/reportStudio']);
    }

  
    this.cd.detectChanges();
  }
  



//    async evaluateTemplate(template:any,metadata:any,getkey:any) {
//     // Use regex to match variable-value pairs
//     const matches = template.match(/\${(.*?)}/g);

//     if (!matches) {
//       return template;
//   }

//     // Substitute variables with metadata values
//     matches.forEach((match: string) => {
//         const variableName = match.replace(/\${|}/g, '');
//         const metadataKey = Object.keys(metadata).find(key => getkey == 'split' ? key == variableName.split('.')[1]:key == variableName);
//         const substitutedValue = metadataKey ? metadata[metadataKey] : match;

//         // If the substituted value is a string, wrap it in quotes
//         const formattedValue = typeof substitutedValue === 'string' ? `'${substitutedValue}'` : substitutedValue;

//         // Replace in the template
//         template = template.replace(match, formattedValue);
//     });

//     // Evaluate the expression safely
//     try {
//         const result = eval(template);
//         return result;
//     } catch (error) {
//         console.error("Error evaluating template:", error);
//         Swal.fire({
//           title: "Incomplete Fields",
//           text: "Please fill in all the required conditional fields before proceeding.",
//           icon: "error",
//           confirmButtonText: "Okay"
//       });
//         return null;
//     }
// }



async evaluateTemplate(template: string, metadata: any, getkey: any) {


  if(template.includes('${}') || template == ''){
    return true
  }

  // Use regex to match variable-value pairs
  const matches = template.match(/\${(.*?)}/g);

  // If no variables are found, return the template directly
  if (!matches) {
    return template;
  }

  // Substitute variables with metadata values
  matches.forEach((match: string) => {
      const variableName = match.replace(/\${|}/g, '');
      
      // Handle cases where the key format might be split
      const metadataKey = Object.keys(metadata).find(key => getkey === 'split' ? key === variableName.split('.')[1] : key === variableName);

      // Substitute the value or keep the original match if no value is found
      const substitutedValue = metadataKey ? metadata[metadataKey] : match;

      // Wrap string values in quotes to ensure they are correctly evaluated
      const formattedValue = typeof substitutedValue === 'string' ? `'${substitutedValue}'` : substitutedValue;

      // Replace the matched variable in the template
      template = template.replace(match, formattedValue);
  });



  // Evaluate the expression safely
  try {
      // Make sure to evaluate only the final expression and handle potential errors in evaluation
      const result = eval(template);  // Using `Function` instead of `eval`
      console.log("Template is here ",template);
      console.log("Result is here ",result);
      return result;
  } catch (error) {
      console.error("Error evaluating template:", error);

      // Show an error message to the user
      Swal.fire({
          title: "Error while evaluating",
          text: "Please check you conditions or script.",
          icon: "error",
          confirmButtonText: "Okay"
      });
      return null;
  }
}



async evaluateRowsTemplate(template:any, row:any, headers:any) {

  const matches = template.match(/\${(.*?)}/g);


  if (!matches) {
    return template;
  }


  matches.forEach((match:any) => {
    const variableName = match.replace(/\${|}/g, '').trim(); // 

    console.log("variableName:", variableName);


    const metadataKey = headers.indexOf(variableName);

    console.log("metadataKey:", metadataKey);

   
    const substitutedValue = metadataKey !== -1 ? row[metadataKey] : match;

    console.log("substitutedValue:", substitutedValue);

 
    const formattedValue = typeof substitutedValue === 'string' ? `'${substitutedValue}'` : substitutedValue;


    template = template.replace(match, formattedValue);
  });

  try {
  
    const result = eval(template); 
    console.log("Template after substitution:", template);
    console.log("Result:", result);
    return result;
  } catch (error) {
    console.error("Error evaluating template:", error);

    // Show an error message to the user
    Swal.fire({
      title: "Error while evaluating",
      text: "Please check your conditions or script.",
      icon: "error",
      confirmButtonText: "Okay"
    });
    return null;
  }
}






  async mapLabels(responses:any, metadata:any) {

    const uniqueIDKey = metadata.find((field:any)=>field && field.validation && field.validation.unique)
    console.log("Unique ID key is here ",uniqueIDKey);

    const mappedResponses = responses.map((response: any) => {
      const mappedResponse = { ...response };


      console.log("Response are here ",mappedResponse);
  
      metadata.forEach((field: any) => {
        const fieldName = field.name;   
        const label = field.label;
        const type = field.type
        
        
        //Merge Both Latitude and longitude
        this.mergeAndAddLocation(mappedResponse)

  
        if (mappedResponse.hasOwnProperty(fieldName)) {
          // If the field name contains 'signature', process as an image
          if (fieldName.toLowerCase().includes('signature')) {
            mappedResponse[label] = mappedResponse[fieldName];
          }
          else {
            mappedResponse[label] = mappedResponse[fieldName];
          }
          delete mappedResponse[fieldName];
        } 
        else {
          if(type == 'heading'){
            delete mappedResponse[fieldName];
          }
          else{
            mappedResponse[label] = 'N/A';
          }
        }
      });
    

      if(mappedResponse.hasOwnProperty('id') && uniqueIDKey){
        mappedResponse['id'] = mappedResponse[uniqueIDKey.label]
      }
      
  
      if (mappedResponse.hasOwnProperty('created_time')) {
        const createdDate = new Date(mappedResponse.created_time);
        mappedResponse['Created Date'] = createdDate.toLocaleString();
        delete mappedResponse.created_time;
      }
  
      if (mappedResponse.hasOwnProperty('updated_time')) {
        const updatedDate = new Date(mappedResponse.updated_time);
        mappedResponse['Updated Date'] = updatedDate.toLocaleString();
        delete mappedResponse.updated_time;
      }
  
      // delete mappedResponse.id;
  
     
      return mappedResponse;
    });
  
    return mappedResponses;
  }


// Helper function to merge latitude and longitude into 'location'
mergeAndAddLocation(mappedResponse: any) {
  const latitudeKey = Object.keys(mappedResponse).find(key => key.toLowerCase().includes('latitude'));
  const longitudeKey = Object.keys(mappedResponse).find(key => key.toLowerCase().includes('longitude'));

  if (latitudeKey && longitudeKey && mappedResponse[latitudeKey] && mappedResponse[longitudeKey]) {
    mappedResponse['Geographic Location'] = `${mappedResponse[latitudeKey]},${mappedResponse[longitudeKey]}`;
  }

  delete mappedResponse[latitudeKey || ''];
  delete mappedResponse[longitudeKey || ''];
}


  saveQuery(content: TemplateRef<any>){

    this.editOperation = true

    this.savedModulePacket = [this.reportsFeilds.value,this.formFieldsGroup.value,this.selectedValues, this.tableTempState,this.customColumnsGroup.value,this.allAdvancedExcelConfigurations]
    this.modalService.open(content,{
      backdrop: 'static',
  });
    this.moduleDisplayService.showModule()
  }


  editQuery(content: TemplateRef<any>){

    this.editOperation = false

    //Creating packet for reports module to pass
    this.editSavedDataArray.columnVisibility = this.selectedValues
    this.editSavedDataArray.reportMetadata = this.reportsFeilds.value
    this.editSavedDataArray.conditionMetadata = this.formFieldsGroup.value
    this.editSavedDataArray.tableState = JSON.parse(JSON.stringify(this.tableState))
    this.editSavedDataArray.customColumnMetadata = this.customColumnsGroup.value
    // this.editSavedDataArray.advancedCustomColumnMetadata = this.customLocationGroup.value
    // this.editSavedDataArray.advancedFilterColumnMetadata = this.mainFormGroup.value
    this.editSavedDataArray.allAdvancedExcelConfigurations = this.allAdvancedExcelConfigurations

    this.savedModulePacket = this.editSavedDataArray
    this.modalService.open(content,{
      backdrop:'static'
    });
    this.moduleDisplayService.showModule()
  }





    // Function to dismiss the modal
    dismissModal(modal: any) {
      modal.dismiss(); // This will close the modal
    }



     // Dismiss the modal programmatically
  dismissModal1(modal: any) {
    try{
      modal.dismiss('Cross click');
    }
    catch(error){
      
    } 

  }


    delete(id: number) {
      // console.log("Deleted username will be", id);
      this.deleteNM(id);
    }
  
    create() {
      // this.userModel = { P1: '', P2: '', P3: '',P4:0,P5:'' };
      // this.openModal('')
    }




    async deleteNM(getValue: any) {


      const deleteData = this.original_lookup_data.filter((item:any)=>item.P1 == getValue)
    
        let temp = {
          PK: this.SK_clientID+"#savedquery#"+getValue+"#main",
          SK: 1
        }
  
        var item = deleteData[0]
        


            try{
            
            await this.api.DeleteMaster(temp).then(async value => {
     
              await this.fetchTimeMachineById(1, getValue, 'delete', item)

              this.modalService.dismissAll(this.SavedQuery)

              this.reloadEvent.next(true)

        
            })
          }
          catch(error){
            console.log("Error deleting ",error);
          }
    }
  


    async   fetchTimeMachineById(sk: any, id: any, type: any, item: any) {
      const tempClient = this.SK_clientID+'#savedquery'+"#lookup";
      try {
        const response = await this.api.GetMaster(tempClient, sk);
        
        if (response && response.options) {
          let data: ListItem[] = await JSON.parse(response.options);
    
          // Find the index of the item with the matching id
          let findIndex = data.findIndex((obj) => obj[Object.keys(obj)[0]].P1 === id);
    
          if (findIndex !== -1) { // If item found
            if (type === 'update') {
              data[findIndex][`L${findIndex + 1}`] = item;
    
              // Create a new array to store the re-arranged data without duplicates
              const newData:any = [];
            
              // Loop through each object in the data array
              for (let i = 0; i < data.length; i++) {
                const originalKey = Object.keys(data[i])[0]; // Get the original key (e.g., L1, L2, ...)
                const newKey = `L${i + 1}`; // Generate the new key based on the current index
            
                // Check if the original key exists before renaming
                if (originalKey) {
                  // Create a new object with the new key and the data from the original object
                  const newObj = { [newKey]: data[i][originalKey] };
            
                  // Check if the new key already exists in the newData array
                  const existingIndex = newData.findIndex((obj: {}) => Object.keys(obj)[0] === newKey);
            
                  if (existingIndex !== -1) {
                    // Merge the properties of the existing object with the new object
                    Object.assign(newData[existingIndex][newKey], data[i][originalKey]);
                  } else {
                    // Add the new object to the newData array
                    newData.push(newObj);
                  }
                } else {
                  console.error(`Original key not found for renaming in data[${i}].`);
                  // Handle the error or log a message accordingly
                }
              }
            
              // Replace the original data array with the newData array
              data = newData;
                    
            } else if (type === 'delete') {
              // Remove the item at the found index
              data.splice(findIndex, 1);
            }
    
            // Prepare the updated data for API update
            let updateData = {
              PK: tempClient,
              SK: response.SK,
              options: JSON.stringify(data)
            };
    
            // Update the data in the API
            await this.api.UpdateMaster(updateData);
    
          } else { // If item not found
            await new Promise(resolve => setTimeout(resolve, 500)); // Wait before retrying
            await this.fetchTimeMachineById(sk + 1, id, type, item); // Retry with next SK
    
          }
        } else { // If response or listOfItems is null
          Swal.fire({
            position: "top-right",
            icon: "error",
            title: `ID ${id} not found`,
            showConfirmButton: false,
            timer: 1500,
          });
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }


    async editRoute(P1: any){

      this.editedQueryName = P1


      if(this.modalName == 'Reports'){
        this.router.navigate(['/reportStudio'], { queryParams: { savedQuery: P1 } });
      }

      this.modalService.dismissAll(this.SavedQuery)
    }


  
    async editSavedQuery(P1: any,key:any) {

      this.editedQueryName = P1

      // console.log("Edit si being called");

      this.populateFormData= []     
      
      try{
        
       this.api.GetMaster(`${this.SK_clientID}#savedquery#${P1}#main`,1).then(async (result)=>{
        if(result && result.metadata){

          this.tempResHolder = JSON.parse(result.metadata)

          console.log("Result is here ",this.tempResHolder);
 
          this.tempResHolder.reportMetadata = JSON.parse(this.tempResHolder.reportMetadata)
          this.tempResHolder.conditionMetadata = JSON.parse(this.tempResHolder.conditionMetadata).forms
          this.tempResHolder.customColumnMetadata = JSON.parse(this.tempResHolder.customColumnMetadata).customForms
          this.tempResHolder.columnVisibility = this.tempResHolder && this.tempResHolder.columnVisibility && JSON.parse(this.tempResHolder.columnVisibility)
          this.tempResHolder.tableState = this.tempResHolder && this.tempResHolder.tableState && JSON.parse(this.tempResHolder.tableState)
          this.tempResHolder.advancedCustomColumnMetadata = this.tempResHolder.advancedCustomColumnMetadata && JSON.parse(this.tempResHolder.advancedCustomColumnMetadata)
          this.tempResHolder.advancedFilterColumnMetadata = this.tempResHolder.advancedFilterColumnMetadata && JSON.parse(this.tempResHolder.advancedFilterColumnMetadata)
          this.tempResHolder.allAdvancedExcelConfigurations = this.tempResHolder.allAdvancedExcelConfigurations && JSON.parse(this.tempResHolder.allAdvancedExcelConfigurations)

          this.allAdvancedExcelConfigurations = this.tempResHolder.allAdvancedExcelConfigurations && JSON.parse(JSON.stringify(this.tempResHolder.allAdvancedExcelConfigurations))
          
          this.editSavedDataArray = this.tempResHolder
 
          //  console.log("Result for the edit is here ",this.tempResHolder);
           const reportMetadata = this.tempResHolder.reportMetadata
           const conditionMetadata = this.tempResHolder.conditionMetadata
           const columnVisibility = this.tempResHolder.columnVisibility
           const customColumnMetadata = this.tempResHolder && this.tempResHolder.customColumnMetadata
           const advancedFilterColumnMetadata = this.tempResHolder && this.tempResHolder.advancedFilterColumnMetadata
           const advancedCustomColumnMetadata = this.tempResHolder && this.tempResHolder.advancedCustomColumnMetadata

           //Get the table State
           this.tableState = this.tempResHolder.tableState && JSON.parse(JSON.stringify(this.tempResHolder.tableState))
 
          //  console.log("conditionMetadata is here ",conditionMetadata);
 
           this.reportsFeilds.patchValue({
             dateType: reportMetadata.dateType,
             singleDate: reportMetadata.singleDate,
             startDate: reportMetadata.startDate,
             endDate:reportMetadata.endDate ,
             daysAgo:reportMetadata.daysAgo ,
             form_permission:reportMetadata.form_permission , 
             filterOption:reportMetadata.filterOption ,
             columnOption:reportMetadata.columnOption,
             addColumn:reportMetadata.addColumn,
             addExcellOption:reportMetadata.addExcellOption,
             advanceOption:reportMetadata.advanceOption,
             excelSheets:reportMetadata && reportMetadata.excelSheets?reportMetadata.excelSheets:[]
           })        
           
           this.selectedItem = []

            if(columnVisibility){
              this.selectedValues = JSON.parse(JSON.stringify(columnVisibility))
            } 

             
           if(reportMetadata.columnOption != 'all' && Array.isArray(this.selectedValues) && this.selectedValues.length > 0){
             this.visibiltyflag = true
           }
 
           this.saveButton = true


           if(reportMetadata.addColumn != 'false'){

            console.log("Add column is executed ");

            this.customForms().clear()

            await this.addColumns("true",'')


            customColumnMetadata.forEach((formData: any) => {
              this.populateCustomForm(formData);
            });

            
           }
           else{
            this.customForms().clear();

            this.selectedForms.forEach((formData: any) => {
              this.addCustomForm(); 
            });

              this.customColumnsflag = false
           }




           
           if(reportMetadata.filterOption != 'all'){

            this.forms().clear();
 
             await this.onFilterChange('onCondition','','edit')
 
             
 
            //  console.log("conditionMetadata - - - - -- - -- - ",conditionMetadata);
              
            conditionMetadata.forEach((formData: any) => {
                 this.populateForm(formData);
               });

               
           }
           else{

            this.forms().clear();

            this.selectedForms.forEach((formData: any) => {
              this.addForm(); 
            });

      

  
              this.conditionflag = false
           }
           if(this.selectedValues != undefined && Array.isArray(this.selectedValues) && this.selectedValues.length > 0 && reportMetadata.columnOption != 'all'){

            this.reportsFeilds.get('form_data_selected')?.patchValue([])

            // console.log("Column Option is false");

            await this.onColumnChange('onCondition','savedQuery')
           }
           else{
            this.visibiltyflag = false
           }

           this.onSubmit()
           this.onSubmitFlag = false
           this.dismissModal1(this.modalRef);
  
         
         }
       })
       this.spinner.hide()
       this.cd.detectChanges()
     
      }
      catch(error){
        this.spinner.hide()
        console.log("Error fetching reports table ",error);
      }
    }



     // Add a new form with conditions
  populateForm(formData: any): void {

    const formGroup = this.fb.group({
      conditions: this.fb.array([])  // Form array for conditions
    });

    // Add conditions to this form group
    formData.conditions.forEach((conditionData: any) => {
      (formGroup.get('conditions') as FormArray).push(this.populateCondition(conditionData));
    });

    // Add the form group to the 'forms' array
    this.forms().push(formGroup);

    this.conditionflag = true

    this.cd.detectChanges()
  }


   // Create a new condition form group
   populateCondition(conditionData: any): FormGroup {
    return this.fb.group({
      condition: [conditionData.condition, Validators.required],
      operator: [conditionData.operator, Validators.required],
      value: [conditionData.value, Validators.required],
      operatorBetween: [conditionData.operatorBetween]  // Optional field
    });
  }


    // Create a new condition form group
    populateConditionEmpty(conditionData: any): FormGroup {
      return this.fb.group({
        condition: ['', Validators.required],
        operator: ['', Validators.required],
        value: ['', Validators.required],
        operatorBetween: ['']  // Optional field
      });
    }


    ngOnDestroy() {
      console.log('Component destroyed!');
      // Perform any cleanup here
      // e.g., unsubscribe from observables or clear any data
      // window.removeEventListener('location-click', this.handleLocationClick);
      // window.removeEventListener('location-click', (event: Event) => this.handleLocationClick(event as CustomEvent));

      if (this.isLocationClickListenerAdded) {
        window.removeEventListener('location-click', (event: Event) => this.handleLocationClick(event as CustomEvent));
      }
      if (this.isminiTableClickListenerAdded) {
          window.removeEventListener('miniTable-click', (event: Event) => this.handleLocationClick(event as CustomEvent));
      }
      if (this.isMarkerClickListenerAdded) {
          window.removeEventListener('marker-click', (event: Event) => this.handleLocationClick(event as CustomEvent));
      }
      if (this.isapprovalClickListenerAdded) {
          window.removeEventListener('approve-click', (event: Event) => this.handleLocationClick(event as CustomEvent));
      }

      this.destroy$.next();
      this.destroy$.complete();
      this.optionsCache.clear();

      this.datatableConfig = {}
    }


  fetchUserLookupdata(sk:any,pkValue:any,key:any):any {
    
    return new Promise((resolve, reject) => {
      this.api.GetMaster(pkValue, sk)
        .then(response => {
          if (response && response.options) {
            // Check if response.options is a string
            if (typeof response.options === 'string') {
              let data = JSON.parse(response.options);
              
              if (Array.isArray(data)) {
                const promises:any = []; // Array to hold promises for recursive calls
  
                for (let index = 0; index < data.length; index++) {
                  const element = data[index];
  
                  if (element !== null && element !== undefined) {
                    // Extract values from each element and push them to lookup_data_user
                    const key = Object.keys(element)[0]; // Extract the key (e.g., "L1", "L2")
                    const { P1, P2, P3 } = element[key]; // Extract values from the nested object
                    this.lookup_data_savedQuery.push({ P1, P2, P3 }); // Push an array containing P1, P2, P3, P4, P5, P6
                  } else {
                    break;
                  }
                }
  
                // Sort the lookup_data_user array based on P5 values in descending order
                this.lookup_data_savedQuery.sort((a: { P3: number; }, b: { P3: number; }) => b.P3 - a.P3);
  
                // Continue fetching recursively
                promises.push(this.fetchUserLookupdata(sk + 1,pkValue,key)); // Store the promise for the recursive call
                
                // Wait for all promises to resolve
                Promise.all(promises)
                  .then(() => resolve(this.lookup_data_savedQuery)) // Resolve with the final lookup data
                  .catch(reject); // Handle any errors from the recursive calls
              } else {
                console.error('Invalid data format - not an array.');
                reject(new Error('Invalid data format - not an array.'));
              }
            } else {
              console.error('response.options is not a string.');
              reject(new Error('response.options is not a string.'));
            }
          } else {
            console.log("All the users are here", JSON.parse(JSON.stringify(this.lookup_data_savedQuery)));

            this.original_lookup_data = this.lookup_data_savedQuery

            this.listofSavedIds = this.lookup_data_savedQuery.map((item:any)=>item.P1)


            if(key == 'table'){
              try{
                this.lookup_data_savedQuery = this.lookup_data_savedQuery.map((item: any) => {
                  let tempHolder:any = {}
                  if(item.P2 && typeof item.P2 == 'string'){
                    tempHolder = JSON.parse(item.P2)
                  }
                  else{
                    tempHolder = item.P2
                  }
                  if (tempHolder && tempHolder.username === this.username) {
                    item.P2 = {}
                    item.P2.username = 'Me';
                    item.P2.userList = tempHolder && tempHolder.userList ? tempHolder.userList:[]
                  }
                  else{
                    item.P2 = {}
                    item.P2.username = tempHolder.username;
                    item.P2.userList = tempHolder && tempHolder.userList ? tempHolder.userList:[]
                  }
                  return item; 
                });
              }
              catch(error){
                console.log("Not a valid JSON");
              }
            
  
  
              if(!this.adminAccess){
                this.lookup_data_savedQuery = this.lookup_data_savedQuery.filter((item:any)=>(item.P2 && item.P2.username == "Me") || (item.P2.userList &&  item.P2.userList.includes(this.username)))
              }
            }
           
           

            // console.log("All the unique IDs are here ",this.listofSavedIds);
           
            resolve(this.lookup_data_savedQuery); // Resolve with the current lookup data
          }
        })
        .catch(error => {
          console.error('Error:', error);
          reject(error); // Reject the promise on error
        });
    });
  }
  






  //Export option is here 
  @ViewChildren(AgGridAngular) agGrids!: QueryList<AgGridAngular>;
  // Method to export all tables as CSV
  exportAllTablesAsCSV() {
    const allCsvData:any = [];

    // Iterate over all ag-Grid instances
    this.agGrids.toArray().forEach((gridInstance, index) => {
      // Fetch the grid API
      const gridApi = gridInstance.api;
      const csvData = gridApi.getDataAsCsv();

      // Add the formFilter title before each table's data
      const tableHeader = `\n\n--- Table: ${this.tableDataWithFormFilters[index].formFilter} ---\n`;
      allCsvData.push(tableHeader + csvData);
    });

    // Combine all the CSV data into one string
    const finalCsv = allCsvData.join('\n');

    // Create a Blob and trigger the download
    const blob = new Blob([finalCsv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'combined-tables.csv';
    link.click();
  }

  async exportAllTablesAsExcel() {

    const excelSheets = this.reportsFeilds.value.excelSheets

    this.spinner.show()


    try{ 
      if(this.allAdvancedExcelConfigurations && this.allAdvancedExcelConfigurations.advancedreportsFeildsAdvanced && this.allAdvancedExcelConfigurations.advancedreportsFeildsAdvanced.advanceOption == "onCondition"){
        this.isFormAdvancedVisible = true
        if(this.allAdvancedExcelConfigurations.advancedreportsFeildsAdvanced.equationConditionText != ''){
          this.conditionReportFormString = this.allAdvancedExcelConfigurations.advancedreportsFeildsAdvanced.equationConditionText
        }
      }


      if(this.allAdvancedExcelConfigurations && this.allAdvancedExcelConfigurations.advancedreportsFeildsAdvanced && this.allAdvancedExcelConfigurations.advancedreportsFeildsAdvanced.miniTableOptions == "onCondition"){
        this.isFormMiniOptionFilterVisible = true
      }

      if(this.allAdvancedExcelConfigurations && this.allAdvancedExcelConfigurations.advancedreportsFeildsAdvanced && this.allAdvancedExcelConfigurations.advancedreportsFeildsAdvanced.miniTableColumn == "onCondition"){
        this.isCustomMiniTable = true
      }

    }
    catch(error){
      console.log("Error while setting flags ",error);
    }









    try{
      const wb = XLSX.utils.book_new(); 

      // Use `map` instead of `forEach` to handle async operations properly
      const tableExports = await Promise.all(this.agGrids.toArray().map(async (gridInstance, index) => {
        const gridApi = gridInstance.api;
        const csvData = gridApi.getDataAsCsv();
        let data = this.csvToArray(csvData || '');

        if(data && data[0]){
          let headers = data && data[0] && data[0].map((header: string) => header.replace(/[\r\n]+/g, '').replace(/^"|"$/g, '').trim());
    
          const headersToRemove = ['Dynamic Table Values', 'TrackLocation', 'Approval History'];
          const removeIndices = headers
            .map((header: string, index: any) => headersToRemove.includes(header) || header.includes('Signature') ? index : -1)
            .filter((index: number) => index !== -1);
      
          const xlsxheaders = headers.filter((header: any, index: any) => !removeIndices.includes(index));
      
          let xlsxdata = data.map(row => row.filter((_: any, index: any) => !removeIndices.includes(index)));
      
          const ws = XLSX.utils.aoa_to_sheet(xlsxdata);
      
          // Add the worksheet to the workbook with the name of the formFilter
          let sheetName = this.tableDataWithFormFilters[index].formFilter;
          sheetName = sheetName.length > 30 ? sheetName.slice(0, 30) : sheetName;
  
          if(excelSheets && Array.isArray(excelSheets) && excelSheets.length > 0){
            if(excelSheets.includes('mainForm')){
              XLSX.utils.book_append_sheet(wb, ws, sheetName);
            }
          }
          else{
            XLSX.utils.book_append_sheet(wb, ws, sheetName);
          }
  
   
      
          try {
            const trackLocationColumnIndex = headers.indexOf('TrackLocation');
            if (trackLocationColumnIndex !== -1) {
              // Await the trackLocation data
             
              const trackLocationData: any = await this.extractTrackLocationData(data, trackLocationColumnIndex, index);
              console.log("Track location data is here 99999",trackLocationData);
    
              const trackLocationSheet = XLSX.utils.aoa_to_sheet(trackLocationData);
              let sheetName1 = `TrackLocation ${this.tableDataWithFormFilters[index].formFilter}`;
              sheetName1 = sheetName1.length > 30 ? sheetName1.slice(0, 30) : sheetName1;
  
  
              if(excelSheets && Array.isArray(excelSheets) && excelSheets.length > 0 ){
                if(excelSheets.includes('trackLocation')){
                  XLSX.utils.book_append_sheet(wb, trackLocationSheet, sheetName1);
                }
              }
              else{
                XLSX.utils.book_append_sheet(wb, trackLocationSheet, sheetName1);
              }
  
  
             
            }
      
            const approvalColumnIndex = headers.indexOf('Approval History');
            if (approvalColumnIndex !== -1) {
              const approvalData = this.extractApprovalData(data, approvalColumnIndex, index);
              const approvalSheet = XLSX.utils.aoa_to_sheet(approvalData);
              let sheetName1 = `Approval History ${this.tableDataWithFormFilters[index].formFilter}`;
              sheetName1 = sheetName1.length > 30 ? sheetName1.slice(0, 30) : sheetName1;
  
  
              if(excelSheets && Array.isArray(excelSheets) && excelSheets.length > 0 ){
                if(excelSheets.includes('approvalHistory')){
                  XLSX.utils.book_append_sheet(wb, approvalSheet, sheetName1);
                }
               
              }
              else{
                XLSX.utils.book_append_sheet(wb, approvalSheet, sheetName1);
              }
  
  
            
            }
    
            console.log("HEaders are here ",headers);
      
            const tableColumnIndex = headers.indexOf('Dynamic Table Values');
            console.log("Table column index is here ",tableColumnIndex);
            if (tableColumnIndex !== -1) {
              const tableData: any = await this.extractMiniTableData(data, tableColumnIndex, index);
              console.log("Mini Table data is ",tableData);
  
              console.log("Table form Name data is ",this.tableFormName);
      
              for (const tableKey in tableData) {
                const filteredFormName = this.tableFormName.find((item: any) => Object.keys(item)[0] === tableKey);
      
                if (tableData.hasOwnProperty(tableKey)) {
                  const miniTableData = tableData[tableKey];
                  const miniTableSheet = XLSX.utils.aoa_to_sheet(miniTableData);
                  let sheetName1:any
                  if(filteredFormName[tableKey]){
                    sheetName1 = `${filteredFormName[tableKey]} ${this.tableDataWithFormFilters[index].formFilter}`;
                  }
                  sheetName1 = sheetName1.length > 30 ? sheetName1.slice(0, 30) : sheetName1;
  
  
  
                  if(excelSheets && Array.isArray(excelSheets) && excelSheets.length > 0){
                    if(excelSheets.includes('miniTable')){
                      XLSX.utils.book_append_sheet(wb, miniTableSheet, sheetName1);
                    }
                
                  }
                  else{
                    XLSX.utils.book_append_sheet(wb, miniTableSheet, sheetName1);
                  }
                }
              }
            }
          } catch (error) {
            console.log("Error in processing mini table and track Location ", error);
          }
      
          // Now that all sheets are added, we can loop through the sheets and apply the header styles
          wb.SheetNames.forEach(sheetName => {
            const ws = wb.Sheets[sheetName];
      
            // Apply styles to the header row (Row 0) for the current sheet
            for (let i = 0; i < xlsxheaders.length; i++) {
              const cellAddress = { r: 0, c: i };  // Row 0 (header row)
              const cellRef = XLSX.utils.encode_cell(cellAddress);
      
              if (!ws[cellRef]) ws[cellRef] = {};  // Ensure the cell exists
      
              // Apply styles to header cells
              ws[cellRef].s = {
                fill: {
                  fgColor: { rgb: 'FFA500' }  // Orange background
                },
                font: {
                  color: { rgb: 'FFFFFF' },   // White font color
                  bold: true                  // Bold text
                },
                alignment: {
                  horizontal: 'center',      // Center header text
                  vertical: 'center'
                }
              };
            }
          });
        }
    
      
    
      }));
    
      // Generate the Excel file
      const excelFile = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    
      // Create a Blob and trigger the download
      const blob = new Blob([excelFile], { type: 'application/octet-stream' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${this.selectedForms[0]}${this.selectedForms.length > 1 ? `(${this.selectedForms.length})...` : ''}.xlsx`;
      link.click();
    }

    catch(err){
      console.log("Error creating excell file ",err);
      this.spinner.hide()
    }


    this.spinner.hide()
  }
  


  
  // Method to extract mini table data
  // async extractMiniTableData(data: any[], tableColumnIndex: number, index: number) {



  //   const tableData: any = {};

  //   console.log("table with filters are here ",this.tableDataWithFormFilters[index]["rows"]);
  

  //   let tempHolder = this.tableDataWithFormFilters[index]["rows"].map((item: any) => {

  //     if (item?.dynamic_table_values) {
    
  //       Object.keys(item.dynamic_table_values).forEach((dynamicRow: any) => {
  //         // Loop through each dynamic table row

  //         Array.isArray(item.dynamic_table_values[dynamicRow]) && item.dynamic_table_values[dynamicRow].forEach((ele: any,i: number) => {
  //           // Add 'id' to each dynamic row element 
            
  //           item.dynamic_table_values[dynamicRow][i] = Object.assign({ id: item.id }, ele);
  //         });
  //       });
  //     }
    
  //     return item?.dynamic_table_values;
  //   });

  //   console.log("TempHolder is here ",tempHolder);

  //   // console.log("Filter mini table values are here ",tempHolder);
  
  //   // console.log("tempHolder before filtering:", tempHolder);
  
  //   tempHolder = tempHolder.filter((item: any) => item != undefined);

  
  //   console.log("tempHolder after filtering:", tempHolder);



  //   let tempConditionHolder:any
  //   let currentForm:any
  //   let allFilterConditions:any = {}
  //   //Prepare the condition String here if OptionFIlter is true
  //   if(this.isFormMiniOptionFilterVisible){
  //     currentForm = this.tableDataWithFormFilters[index]["formFilter"]
  //     tempConditionHolder = this.allAdvancedExcelConfigurations && this.allAdvancedExcelConfigurations.advancedMiniTableFilter.formGroups.find((ele:any)=>ele.name == currentForm)
  //     if(tempConditionHolder && tempConditionHolder.tables && Array.isArray(tempConditionHolder.tables) && tempConditionHolder.tables.length > 0){
  //       for(let tab of tempConditionHolder.tables){
  //         const tempConditon = await this.buildConditionLocationString(tab.conditions)
  //         allFilterConditions[`${tab.tableName}`] = tempConditon
  //       }
  //     }
  //   }


  //   console.log("Mini Table condition Object is here ",allFilterConditions);


  
  //   // Iterate over each record and extract the dynamic tables
  //   tempHolder.forEach((record: any) => {
  //     const dynamicTables = record; // Record could have multiple tables
  
  //     if (dynamicTables) {
  //       // Iterate through each dynamic table in the current record
  //       Object.keys(dynamicTables).forEach(async (tableKey) => {
  //         let tableRows = dynamicTables[tableKey];

  //         console.log("Table rows are here before evaluation ",tableRows);

  //         if (this.isFormMiniOptionFilterVisible) {
        
  //           tableRows = await Promise.all(tableRows.map(async (tab: any) => {
  //             console.log("this.dyanmicFormDataArray ",this.dyanmicFormDataArray);
  //             // const filteredFormName = this.tableFormName.find((item: any) => Object.keys(item)[0] === tableKey);

  //             const filteredFormName = this.dyanmicFormDataArray[index][this.tableDataWithFormFilters[index].formFilter]?.find((element: any) => tableKey.startsWith(element.name)).validation.formName_table;


  //             console.log("filteredFormName ",filteredFormName);
  //             const tempTableKey = filteredFormName ? filteredFormName : null; // Add null check
  //             console.log("tempTableKey ",tempTableKey);
  //             if (tempTableKey) {
  //               const res = await this.evaluateTemplate(allFilterConditions[tempTableKey], tab, '');
  //               if (res) {
  //                 return tab; 
  //               }
  //             }
  //             return null; 
  //           }));
          
     
  //           tableRows = tableRows.filter((tab: any) => tab !== null);
  //         }

  //         console.log("Table rows are here after evaluation ",tableRows);
          


  
  //         if (tableRows && Array.isArray(tableRows) && tableRows.length > 0) {
  //           // If the table exists, gather the headers from the first row of the dynamic table
  //           const headers = Object.keys(tableRows[0]);

  //           // Prepare the rows for the table (flatten each row to match the headers)
  //           const rows = tableRows.map((row: any) => headers.map((header: string) => row[header] || ""));
  
  //           // Ensure the headers are the first row of the sheet
  //           rows.unshift(headers);
  
  //           // Accumulate the rows for each table across all records
  //           if (!tableData[tableKey]) {
  //             tableData[tableKey] = rows;
  //           } else {
  //             tableData[tableKey] = tableData[tableKey].concat(rows.slice(1)); // Avoid adding headers again
  //           }
  //         }
  //       });
  //     }
  //   });

  
  //   console.log('Iterated Table data is here ', tableData);
  
  //   // Fetch dynamic form data labels and apply them
  //   await Promise.all(Object.keys(tableData).map(async (item: any) => {
  //     const filterData = this.dyanmicFormDataArray[index][this.tableDataWithFormFilters[index].formFilter]?.find((element: any) => item.startsWith(element.name));
  
  //     if (filterData && filterData.validation?.formName_table) {
  //       const tableFormName = filterData.validation.formName_table;
  //       const result = await this.api.GetMaster(`${this.SK_clientID}#dynamic_form#${tableFormName}#main`, 1);
  
  //       if (result && result.metadata) {
  //         this.tableFormName.push({[item]:tableFormName});

  //         const dynamicFormFields = JSON.parse(result.metadata).formFields;
  //         let rowsHeader = tableData[item][0].map((i: any) => {
  //           const res = dynamicFormFields.find((field: any) => field.name === i);
  //           return res ? res.label : i;  // Apply label or keep the original header
  //         });
  
  //         tableData[item][0] = rowsHeader;  // Replace headers with labels
  //       }
  //     }
  
  //     // console.log("Filtered Dynamic data is here ", filterData);
  //   }));
  
  //   console.log('After adding Labels Table data is here ', tableData);
  
  //   return tableData;
  // }



  // Method to extract mini table data
async extractMiniTableData(data: any[], tableColumnIndex: number, index: number) {
  const tableData: any = {};

  console.log("table with filters are here ", this.tableDataWithFormFilters[index]["rows"]);

  let tempHolder = this.tableDataWithFormFilters[index]["rows"].map((item: any) => {
    if (item?.dynamic_table_values) {
      Object.keys(item.dynamic_table_values).forEach((dynamicRow: any) => {
        // Loop through each dynamic table row
        Array.isArray(item.dynamic_table_values[dynamicRow]) && item.dynamic_table_values[dynamicRow].forEach((ele: any, i: number) => {
          // Add 'id' to each dynamic row element
          item.dynamic_table_values[dynamicRow][i] = Object.assign({ id: item.id }, ele);
        });
      });
    }

    return item?.dynamic_table_values;
  });

  console.log("TempHolder is here ", tempHolder);

  // Filter out undefined values
  tempHolder = tempHolder.filter((item: any) => item != undefined);

  console.log("tempHolder after filtering:", tempHolder);

  let tempConditionHolder: any;
  let currentForm: any;
  let allFilterConditions: any = {};

  // Prepare the condition String here if OptionFilter is true
  if (this.isFormMiniOptionFilterVisible) {
    currentForm = this.tableDataWithFormFilters[index]["formFilter"];
    tempConditionHolder = this.allAdvancedExcelConfigurations && this.allAdvancedExcelConfigurations.advancedMiniTableFilter.formGroups.find((ele: any) => ele.name == currentForm);
    if (tempConditionHolder && tempConditionHolder.tables && Array.isArray(tempConditionHolder.tables) && tempConditionHolder.tables.length > 0) {
      for (let tab of tempConditionHolder.tables) {
        const tempConditon = await this.buildConditionLocationString(tab.conditions);
        allFilterConditions[`${tab.tableName}`] = tempConditon;
      }
    }
  }

  console.log("Mini Table condition Object is here ", allFilterConditions);

  // Iterate over each record and extract the dynamic tables
  for (const record of tempHolder) {
    const dynamicTables = record; // Record could have multiple tables

    if (dynamicTables) {
      // Iterate through each dynamic table in the current record
      for (const tableKey of Object.keys(dynamicTables)) {
        let tableRows = dynamicTables[tableKey];

        console.log("Table rows are here before evaluation ", tableRows);

        if (this.isFormMiniOptionFilterVisible && Array.isArray(tableRows)) {
          // Process table rows asynchronously
          const newTableRows = [];
          for (let tab of tableRows) {
            console.log("this.dyanmicFormDataArray ", this.dyanmicFormDataArray);
            const filteredFormName = this.dyanmicFormDataArray[index][this.tableDataWithFormFilters[index].formFilter]?.find((element: any) => tableKey.startsWith(element.name)).validation.formName_table;

            console.log("filteredFormName ", filteredFormName);
            const tempTableKey = filteredFormName ? filteredFormName : null; // Add null check
            console.log("tempTableKey ", tempTableKey);
            if (tempTableKey) {
              const res = await this.evaluateTemplate(allFilterConditions[tempTableKey], tab, '');
              if (res) {
                // if(this.isCustomMiniTable && this.allAdvancedExcelConfigurations && this.allAdvancedExcelConfigurations.miniCustomColumns){
                //   let tempCustomHolder  = this.allAdvancedExcelConfigurations.miniCustomColumns
                //   tempCustomHolder = tempCustomHolder.find((item:any)=>item.name == this.tableDataWithFormFilters[index].formFilter).tables
                //   tempCustomHolder = tempCustomHolder.find((ele:any)=>ele.tableName == tempTableKey).conditions

                //   console.log("tempCustomHolder ",tempCustomHolder);

                //   if(tempCustomHolder){
                //     for(let col of tempCustomHolder){
                //       tab[`${col.columnName}`] = await this.evaluateTemplate(col.equationText,tab,'')
                //     }
                //   } 
                // }
                newTableRows.push(tab);  // Add the row only if the condition is met

              }
            }
          }
          
          // Only keep rows that passed the filter
          tableRows = newTableRows;
        }

        console.log("Table rows are here after evaluation ", tableRows);

        if (tableRows && Array.isArray(tableRows) && tableRows.length > 0) {


          if(this.isCustomMiniTable && this.allAdvancedExcelConfigurations && this.allAdvancedExcelConfigurations.advancedcustomMiniColumns.miniCustomColumns){
            console.log("Custom columns condition is true ",);
            for(let tab of tableRows){
              let tempCustomHolder  = this.allAdvancedExcelConfigurations.advancedcustomMiniColumns.miniCustomColumns
              tempCustomHolder = tempCustomHolder.find((item:any)=>item.name == this.tableDataWithFormFilters[index].formFilter).tables
              const filteredFormName = this.dyanmicFormDataArray[index][this.tableDataWithFormFilters[index].formFilter]?.find((element: any) => tableKey.startsWith(element.name)).validation.formName_table;
              tempCustomHolder = tempCustomHolder.find((ele:any)=>ele.tableName == filteredFormName).conditions
  
              console.log("tempCustomHolder ",tempCustomHolder);
  
              if(tempCustomHolder){
                for(let col of tempCustomHolder){
                  tab[`${col.columnName}`] = await this.evaluateTemplate(col.equationText,tab,'')
                }
              } 
            }
          }
          else{
            console.log("COndition doesNt match ",this.allAdvancedExcelConfigurations.advancedcustomMiniColumns.miniCustomColumns);
          }




    




          // If the table exists, gather the headers from the first row of the dynamic table
          const headers = Object.keys(tableRows[0]);

          // Prepare the rows for the table (flatten each row to match the headers)
          const rows = tableRows.map((row: any) => headers.map((header: string) => row[header] || ""));

          // Ensure the headers are the first row of the sheet
          rows.unshift(headers);

          // Accumulate the rows for each table across all records
          if (!tableData[tableKey]) {
            tableData[tableKey] = rows;
          } else {
            tableData[tableKey] = tableData[tableKey].concat(rows.slice(1)); // Avoid adding headers again
          }
        }
      }
    }
  }

  console.log('Iterated Table data is here ', tableData);

  // Fetch dynamic form data labels and apply them
  for (const item of Object.keys(tableData)) {
    const filterData = this.dyanmicFormDataArray[index][this.tableDataWithFormFilters[index].formFilter]?.find((element: any) => item.startsWith(element.name));

    if (filterData && filterData.validation?.formName_table) {
      const tableFormName = filterData.validation.formName_table;
      const result = await this.api.GetMaster(`${this.SK_clientID}#dynamic_form#${tableFormName}#main`, 1);

      if (result && result.metadata) {
        this.tableFormName.push({ [item]: tableFormName });

        const dynamicFormFields = JSON.parse(result.metadata).formFields;
        let rowsHeader = tableData[item][0].map((i: any) => {
          const res = dynamicFormFields.find((field: any) => field.name === i);
          return res ? res.label : i;  // Apply label or keep the original header
        });

        tableData[item][0] = rowsHeader;  // Replace headers with labels
      }
    }
  }

  console.log('After adding Labels Table data is here ', tableData);

  return tableData;
}

  

  extractApprovalData = (data: any, trackLocationColumnIndex: any,index:any)=> {

    console.log("Approval rows are here ", this.tableDataWithFormFilters);

    let tempHolder =  this.tableDataWithFormFilters[index]["rows"].map((item: { approval_history: any[]; id: any; }) => {
        if (item?.approval_history && Array.isArray(item?.approval_history) && item?.approval_history.length > 0) {
            item?.approval_history.forEach((dynamicRow: any[]) => {
                dynamicRow.unshift(item.id)
          });
        }
        return item?.approval_history;
      });

    tempHolder = tempHolder.filter((item: string | any[])=>item && Array.isArray(item) && item.length > 0)

     console.log("Approval History is here ",tempHolder);

    const trackLocationRows = [];

    const headers = [
        "id", "Status", "Comments", "Date and Time"
    ];

    // Check if the first entry in tempHolder has the data we need (ensure it's an array and not empty)
    const trackLocationArray = Array.isArray(tempHolder) && tempHolder.length > 0 ? tempHolder : [];

    if (Array.isArray(trackLocationArray) && trackLocationArray.length > 0) {
        // Add headers as the first row
        trackLocationRows.push(headers);

        // Iterate over each row in tempHolder and extract "TrackLocation" data
        tempHolder.forEach(function(row: any) {
            // If the trackLocation is a valid array
            const trackLocationObjects = row;

            if (Array.isArray(trackLocationObjects) && trackLocationObjects.length > 0) {
                // For each object in the trackLocation array, extract the relevant fields
                
                trackLocationObjects.forEach((ele)=>{
                    const rowValues = [
                        ele[0] || '',              
                        ele[1].split('-')[0] || ele[1] ||'',   
                        ele[1].split('-')[1] || '',        
                        new Date(Number(ele[2]*1000)).toLocaleString() || ''
                    ]

                    // Push the extracted values to the rows
                    trackLocationRows.push(rowValues);
                })
                   
            }
        });
    }

    console.log("Track Location rows extracted: ", trackLocationRows);

    // Return the rows to be used in the new sheet
    return trackLocationRows;
}


async extractTrackLocationData(data: any, trackLocationColumnIndex: any, index: any) {
  let trackLocationRows: any[] = [];


  const customColumnForm = this.allAdvancedExcelConfigurations && this.allAdvancedExcelConfigurations.advancedEquationFilter ? this.allAdvancedExcelConfigurations.advancedEquationFilter.customForms[0].conditions:[];

  console.log("customColumnForm ",customColumnForm);

  // Prepare headers
  const headers = [
    "ID", "Date and Time", "Label ID", "Label Name", "Latitude", "Longitude", "Name", "Type"
  ];

  const tempHeaders = ['id','Date_and_time','label_id','label_name','latitude','longitude','name','type']

  let conditionalString = '';
  if (this.isFormAdvancedVisible && this.conditionReportFormString == '') {
    conditionalString = await this.buildConditionLocationString(this.allAdvancedExcelConfigurations.advancedLocationFilter.dynamicConditions);
  }
  else{
    conditionalString = this.conditionReportFormString
  }

  customColumnForm.forEach((custom: { columnName: string; }) => headers.push(custom.columnName));
  trackLocationRows.push(headers);


  // customColumnForm.forEach((custom:any) => {
  //   custom.values = []
  // });

  for (const row of this.tableDataWithFormFilters[index]["rows"]) {
    let trackLocationObjects = row.trackLocation || [];
 
    for (const obj of trackLocationObjects) {
      console.log("Obj is here ", obj);

      const rowValues = [
        row.id || '',
        obj.Date_and_time || '',
        obj.label_id || '',
        obj.label_name || '',
        obj.latitude || '',
        obj.longitude || '',
        obj.name || '',
        obj.type || ''
      ];

      // Process custom columns
      for (const custom of customColumnForm) {
        if (custom.predefined === "km Difference") {
          // rowValues.push(await this.calculateKmDifference(trackLocationObjects, obj.type,custom));
          rowValues.push(await this.calculateKmDifference(trackLocationObjects, obj.type,custom))

        } else if (custom.predefined === "time_taken_distance") {
          rowValues.push(await this.calculateTimeTaken(trackLocationObjects, obj.type,custom));
        } else {
          const res = await this.evaluateTemplate(custom.equationText, obj, 'None');
          // custom.values.push(res)
          rowValues.push(res || "");
        }
      }


      if (this.isFormAdvancedVisible && obj) {
          const isValid = await this.evaluateRowsTemplate(conditionalString, rowValues, tempHeaders);
          if(isValid){
          trackLocationRows.push(rowValues);
          }
      }
      else{
        trackLocationRows.push(rowValues);
      }

    }
  }

    console.log("Custom Rows before adding values are here ",customColumnForm);

    trackLocationRows.push(this.calculateAggregateRow(headers, customColumnForm,trackLocationRows));

  
  return trackLocationRows;
}


// Helper method for km difference calculation
async calculateKmDifference(trackLocationObjects: any[], currentType: string,custom:any): Promise<string> {

  let kmCalculations = [
    {
      start: ['Accept to Start Travel'],
      end: ['Start Travel to Arrived At Site'],
      matchType: 'Start Travel to Arrived At Site'
    },
    {
      start: ['In-Progress to Leaving Site','In-Progress to Resolved'],
      end: ['Leaving Site to End Travel'],
      matchType: 'Leaving Site to End Travel'
    }
  ];

  if(custom && custom.equationText && custom.equationText != ''){
    kmCalculations = JSON.parse(custom.equationText)
  }


  console.log("Text is here ",kmCalculations);



  for (const calc of kmCalculations) {

    console.log("Calc is ",calc);

    if (currentType === calc.matchType) {

      console.log("Match type is here ",currentType , calc.matchType);

      const startPosition = trackLocationObjects.find((item: any) => 
        item?.latitude != null && item?.longitude != null && calc.start.includes(item.type)
      );
      const endPosition = trackLocationObjects.find((item: any) => 
        item?.latitude != null && item?.longitude != null && calc.end.includes(item.type)
      );

      if (startPosition && endPosition) {
        const distance = await this.calculateDistanceUsingGoogleAPI(
          startPosition.latitude, 
          startPosition.longitude,
          endPosition.latitude, 
          endPosition.longitude
        );

       
        // custom.values.push(distance)
        return distance.toFixed(2);
      }
    }
  }
  return '';
}

// Helper method for time taken calculation
async calculateTimeTaken(trackLocationObjects: any[], currentType: string,custom:any): Promise<any> {
  let timeCalculations = [
    {
      start: ['Accept to Start Travel','Open to Accept'],
      end: ['Start Travel to Arrived At Site'],
      matchType: 'Start Travel to Arrived At Site'
    },
    {
      start:['In-Progress to Leaving Site','In-Progress to Resolved'] ,
      end: ['Leaving Site to End Travel'],
      matchType: 'Leaving Site to End Travel'
    }
  ];


  if(custom && custom.equationText  && custom.equationText != ''){
    timeCalculations = JSON.parse(custom.equationText)
  }

  for (const calc of timeCalculations) {
    if (currentType === calc.matchType) {
      const startPosition = trackLocationObjects.find((item: any) => 
        calc.start.includes(item.type)
      );
      const endPosition = trackLocationObjects.find((item: any) => 
        calc.end.includes(item.type)
      );
      console.log("Time should be taken in obj ", trackLocationObjects);
      console.log("Start Position ", startPosition, "End Position ", endPosition);
  
      if (startPosition && endPosition) {
        const startDate = this.parseDateTime(startPosition.Date_and_time);
        const endDate = this.parseDateTime(endPosition.Date_and_time);
  
        console.log("Start Date ", startDate, "End Date ", endDate);
  
        if (startDate && endDate) {
          console.log("Time will be calculated for ", trackLocationObjects);
  
          // Get the difference in milliseconds
          const diffInMs = endDate.getTime() - startDate.getTime();
  
          // Calculate different time units
          const diffInSeconds = Math.floor(diffInMs / 1000);
          const diffInMinutes = Math.floor(diffInMs / 1000 / 60);
          const diffInHours = Math.floor(diffInMs / 1000 / 60 / 60);
          const diffInDays = Math.floor(diffInMs / 1000 / 60 / 60 / 24);
          const diffInMonths = Math.floor(diffInDays / 30); // Approximate months
          const diffInYears = Math.floor(diffInDays / 365); // Approximate years
  
          // Format the result based on the time difference
          let result = '';
  
          if (diffInSeconds < 60) {
            result = `${diffInSeconds} seconds`;
          } else if (diffInMinutes < 60) {
            result = `${diffInMinutes} minutes`;
          } else if (diffInHours < 24) {
            result = `${diffInHours} hours`;
          } else if (diffInDays < 30) {
            result = `${diffInDays} days`;
          } else if (diffInMonths < 12) {
            result = `${diffInMonths} months`;
          } else {
            result = `${diffInYears} years`;
          }
  
          console.log("Time Difference:", result);

          // custom.values.push(result)
  
          // Return the formatted string
          return result;
        }
      }
    }
  }
  
  return '';
  
  
}

// Helper method for aggregate calculations
calculateAggregateRow(headers: string[], customColumnForm: any[], rowValues: any[]): any[] {
  const aggregateRow = new Array(headers.length).fill('');

  for (const custom of customColumnForm) {
    const index = headers.indexOf(custom.columnName);
    
    if (index !== -1) {
      if (custom.aggregate && rowValues) {
        // Map through the rowValues and get the relevant column values
        const getrowValues = rowValues
          .map((item: any) => parseFloat(item[index]))
          .slice(1) 
          .filter((val: any) => !isNaN(val));
        console.log("Row values to be calculated are here ", getrowValues);
        
        let aggregateValue: number | null = null;

        switch (custom.aggregate) {
          case 'SUM':
            aggregateValue = getrowValues.reduce((acc: number, val: number) => acc + val, 0);
            break;
          case 'AVG':
            aggregateValue = getrowValues.reduce((acc: number, val: number) => acc + val, 0) / getrowValues.length;
            break;
          case 'MIN':
            aggregateValue = Math.min(...getrowValues);
            break;
          case 'MAX':
            aggregateValue = Math.max(...getrowValues);
            break;
        }

        // Format the aggregate value based on the predefined value
        let formattedValue = aggregateValue?.toFixed(2); // Keep it as a decimal value

        if (custom.predefined === 'km Difference') {
          formattedValue += ' kms';
        } else if (custom.predefined === 'time_taken_distance') {
          formattedValue += ' hours';
        }

        // Update the correct position in aggregateRow
        aggregateRow[headers.length - customColumnForm.length + customColumnForm.indexOf(custom)] = formattedValue;
      }
    }
  }

  return aggregateRow;
}


csvToArray(csv: string): any[] {
  // Split the CSV string by newlines (\r?\n) and map each row using splitCsv
  const rows = csv
    .split(/\r?\n/)  // Split by both \n (Unix) and \r\n (Windows) line breaks
    .map(row => this.splitCsv(row))  // Convert each row into an array using splitCsv
    .filter(row => row.length > 0);  // Filter out any empty rows
  
  return rows;
}

// Split the CSV row into individual fields while handling quoted values properly
splitCsv(csv: string): string[] {
  const regex = /"(.*?)"|\s*([^",\s]+)\s*/g;  // Regex to match quoted and unquoted fields
  const result: string[] = [];
  let match;

  while ((match = regex.exec(csv)) !== null) {
    // The first capture group will be the quoted value, the second will be unquoted
    result.push(match[1] || match[2]); // Add the match to the result
  }

  return result;
}


    createColumnDefsPDF(rows: any[]): string[] {
    if (!rows || rows.length === 0) {
      return [];  // Return an empty array if there are no rows
    }
  
    // Get the first row in the data to determine the column names
    const firstRow = rows[0];
  
    // Extract the keys (column names) from the first row
    const columnDefs = Object.keys(firstRow);
  
    // Return the array of column names
    return columnDefs;
  }

  csvToArrayd(csv: string): string[][] {
    const rows = csv.split('\n');  // Split CSV into rows
    return rows.map(row => row.split(','));  // Split each row by commas
  }


 
  exportAllTablesAsPDF(): void {
    const docDefinition: any = {
      content: [],
      pageOrientation: 'landscape',
      pageSize: { width: 2000, height: 1000 },
      pageMargins: [10, 10, 10, 10],
      styles: {
        header: {
          fontSize: 8,
          bold: true,
          fillColor: '#4CAF50',
          color: 'white',
          alignment: 'center',
          margin: [2, 2, 2, 2]
        },
        cell: {
          fontSize: 7,
          alignment: 'center',
          margin: [2, 2, 2, 2]
        },
        title: {
          fontSize: 12,
          bold: true,
          alignment: 'center',
          margin: [0, 0, 0, 10]
        }
      }
    };
  
    this.tableDataWithFormFilters.forEach((tableData: any) => {
      const columns = this.createColumnDefsPDF(tableData.rows);
      
      // Add table title
      docDefinition.content.push({
        text: tableData.formFilter,
        style: 'title'
      });
  
      // Split columns into chunks that fit on a page
      const columnChunks:any = this.chunkColumns(columns, 10); // Adjust 10 to the max columns per page
  
      columnChunks.forEach((columnChunk: any[], chunkIndex: number) => {
        // Create table body starting with headers for each chunk
        const tableBody = [
          columnChunk.map((col: { toString: () => any; }) => ({
            text: col.toString(),
            style: 'header'
          }))
        ];
  
        // Add data rows
        tableData.rows.forEach((row: any) => {
          const rowData:any = columnChunk.map((col: string | number) => {
            let cellData = row[col];
            if (typeof cellData === 'object' && cellData !== null) {
              return { text: '', style: 'cell' };
            } else if (cellData && typeof cellData === 'string' && cellData.includes('data:image')) {
              return {
                image: cellData,
                width: 20,
                height: 20,
                alignment: 'center'
              };
            }
            return {
              text: cellData?.toString() ?? '',
              style: 'cell'
            };
          });
          tableBody.push(rowData);
        });
  
        // Add table to document
        docDefinition.content.push({
          table: {
            headerRows: 1,
            widths: Array(columnChunk.length).fill('*'),
            body: tableBody,
          },
          layout: {
            hLineWidth: () => 0.5,
            vLineWidth: () => 0.5,
            hLineColor: () => '#ddd',
            vLineColor: () => '#ddd',
            paddingLeft: () => 2,
            paddingRight: () => 2,
            paddingTop: () => 2,
            paddingBottom: () => 2
          }
        });
  
        // Add page break if there are more chunks
        if (chunkIndex < columnChunks.length - 1) {
          docDefinition.content.push({ text: '', pageBreak: 'after' });
        }
      });
    });
  
    // Create PDF and download
    pdfMake.createPdf(docDefinition).download('wide-tables.pdf');
  }
  
  // Utility function to chunk columns into smaller groups
  chunkColumns(columns: string | any[], chunkSize: number) {
    const chunks = [];
    for (let i = 0; i < columns.length; i += chunkSize) {
      chunks.push(columns.slice(i, i + chunkSize));
    }
    return chunks;
  }
  



  onColumnResized(event: any) {
    // this.saveColumnState();  // Save the state after column resizing
  }

  gridInstances: { [key: string]: any } = {}; // Store grid instances by formFilter



     loadColumnState() {
      // if (this.loadingColumnState) {
      //   return;
      // }

      // this.loadingColumnState = true;

    const savedState =  this.tableState;
    // console.log("Loaded state from localStorage", savedState);

    // Apply saved column state to each formFilter
    Object.keys(savedState).forEach(formFilter => {
      const savedColumnState = savedState[formFilter];
      if (savedColumnState && this.gridInstances[formFilter]) {
        this.gridInstances[formFilter].applyColumnState({ state: savedColumnState, applyOrder: true });
        // console.log(`Applied column state for ${formFilter}`);
      }
    });

  }
  

  onColumnMoved = (event: any) => {

    // if (this.editOperation || this.loadingColumnState) {
    //   return;
    // }

    // console.log('Column moved:', event);
    const formFilter = event && event.column && event.column.colDef.FormName;
    // console.log("Selected form Filter is here ",formFilter);

    const gridID = event.column && event.column.stubContext && event.column.stubContext.gridId

    // console.log("Grid id is here ",gridID);
    
    this.saveColumnState(formFilter,gridID); // Save column state after column is moved for this formFilter

    
  };

    // Save column state for a specific formFilter
    saveColumnState(formFilter: string, gridID: any) {
      // if (this.editOperation || this.loadingColumnState) {
      //   return;
      // }
  
      // console.log("Saving column state for", formFilter);
  
      // Retrieve the gridApi specific to this formFilter
      const gridApi = this.gridInstances[formFilter];
      if (gridApi) {
        const columnState = gridApi.getColumnState(); // Get column state for the current grid
        // console.log("Column State for", formFilter, columnState);
  
        // Ensure tableState is initialized
        if (!this.tableState) {
          this.tableState = {};
        }
  
        // Deep copy the column state to avoid reference issues
        this.tableState[formFilter] = [...columnState]; // Store the column state for the specific formFilter
  
        // Save to localStorage if tableState has any data
        if (Object.keys(this.tableState).length > 0) {
          this.tableTempState = { ...this.tableState }; 
          // console.log("Saving table state to localStorage:", this.tableState);
          // this.loadingColumnState = true;

          // localStorage.setItem("tableState", JSON.stringify(this.tableState));
        }
      }
    }












    populateCustomFormBuilder:any = []
    async addColumns(event:any,getValue:any){
      let selectedValue
      if(getValue == 'html'){
        selectedValue = (event.target as HTMLInputElement).value;
      }
      else{
        selectedValue = event;
      }
    
      if(selectedValue == "false"){
        this.reportsFeilds.get('addColumn')?.patchValue('false')
        this.customColumnsflag = false
        return
      }
      

      console.log("this.selectedForms ",this.selectedForms);

      console.log("Selected value is here ",selectedValue);

    
      if (Array.isArray(this.selectedForms) == false || (this.selectedForms.length == 0 && selectedValue == "true")) {
        Swal.fire({
            title: "Oops!",
            text: "You need to select at least one form before to adding columns. Please select the forms to continue.",
            icon: "warning",
            confirmButtonText: "Got it"
        });
    
        this.reportsFeilds.get('addColumn')?.patchValue('false')
        return;
      }
    
      
      this.reportsFeilds.get('addColumn')?.patchValue('true')
    
      if(selectedValue == 'true'){
        this.spinner.show()
    
        try{
          this.populateCustomFormBuilder = []
    
          let tempMetadata:any = []
          for(let item of this.selectedForms){
            const formName = item
            const result = await this.api.GetMaster(`${this.SK_clientID}#dynamic_form#${item}#main`,1)
    
            if(result){
              let tempResult = JSON.parse(result.metadata || '').formFields
              // console.log("tempResult is ",tempResult);
    
              tempMetadata = {}
              tempMetadata[item] = tempResult.map((item: any) => {
                return { name: item.name, label: item.label,  formName:formName ,options:item.options , type:item.type , validation:item.validation};  
              });
            }
            this.populateCustomFormBuilder.push(tempMetadata)
          }
          
          // console.log("Data to be added in dropdowns ",this.populateFormBuilder);
        }
        catch(error){
          this.spinner.hide()
          console.log("Error in fetching form Builder data ",error);
        }
    
        this.spinner.hide()
        console.log("Condition flag is true");
        this.customColumnsflag = true
      }
      else{
        this.customColumnsflag = false
      }
    
     this.cd.detectChanges()
    }


  customForms(): FormArray {
    return this.customColumnsGroup.get('customForms') as FormArray;
  }

    getCustomFormNameByIndex(index: number): string {
      const selectedFormValue = this.selectedForms[index];
      return selectedFormValue
    }


    customConditions(formIndex: number): FormArray {
      return (this.customForms().at(formIndex).get('conditions') as FormArray);
    }


    addCustomForm(): void {
      this.customForms().push(this.fb.group({
        conditions: this.fb.array([this.createCustomCondition()])
      }));
    }


    createCustomCondition(): FormGroup {
      return this.fb.group({
        columnName: ['', Validators.required],
        fieldSelector: ['', Validators.required],
        equationText: ['', Validators.required],
        predefined: ['', Validators.required]
      });
    }


    getAvailablecustomFields(formIndex: number) {
      const formName = this.getFormNameByIndexCustom(formIndex);
      const formFields = this.populateCustomFormBuilder.find((form: { [x: string]: any; }) => form[formName]);
      return formFields ? formFields[formName] : [];
    }

    getFormNameByIndexCustom(index: number): string {
      const selectedFormValue = this.selectedForms[index];
      return selectedFormValue
    }



     // Insert selected field into the equation
     insertFieldIntoEquation(formIndex: number, condIndex: number) {
      const condition = (this.customForms().at(formIndex).get('conditions') as FormArray).at(condIndex);
      const fieldSelector = condition.get('fieldSelector')?.value;
      const equationText = condition.get('equationText')?.value;
    
      if (fieldSelector) {
        const updatedEquation = `${equationText} \${${fieldSelector}}`; // Enclose the fieldSelector in ${}
        condition.get('equationText')?.setValue(updatedEquation);
      }
    }
    



      addCustomCondition(formIndex: number): void {
        const conditions = this.customForms().at(formIndex).get('conditions') as FormArray;
        conditions.push(this.createCustomCondition());
      }


      removeCustomCondition(formIndex: number, condIndex: number): void {
        const conditions = this.customForms().at(formIndex).get('conditions') as FormArray;
        conditions.removeAt(condIndex);
      }



      onPredefinedChange(formIndex: number, condIndex: number): void {
        const condition = (this.customForms().at(formIndex).get('conditions') as FormArray).at(condIndex);
        const predefinedValue = condition.get('predefined')?.value;
      

        let updatedEquation = condition.get('equationText')?.value || '';
      
        if (predefinedValue === 'days_difference') {
            // Get the selected date from the fieldSelector (assuming it is in 'fieldSelector' field)
            const selectedDateStr = condition.get('fieldSelector')?.value;
        
            if (selectedDateStr) {
         
                const script = this.generateDaysDifferenceScript(selectedDateStr);
        
                updatedEquation = `${updatedEquation} ${script}`;
            } else {
                updatedEquation = `${updatedEquation} No Date Provided`;
            }
        
            condition.get('equationText')?.setValue(updatedEquation);
        } 
        else if (predefinedValue === 'time_difference') {
          // Get the selected date from the fieldSelector
          const selectedDateStr = condition.get('fieldSelector')?.value;
      
          if (selectedDateStr) {
              const script = this.generateTimeDifferenceScript(selectedDateStr);
              updatedEquation = `${updatedEquation} ${script}`;
          } else {
              updatedEquation = `${updatedEquation} No Date Provided`;
          }
          condition.get('equationText')?.setValue(updatedEquation);
      }
        else {

            condition.get('equationText')?.setValue('');
        }
    }
    
  
    generateDaysDifferenceScript(dateStr: string): string {
        const dateFormat = this.getDateFormat(dateStr);
        let script = `Math.floor((new Date() - new Date(\${${dateStr}})) / (1000 * 3600 * 24))`;
        script = script + "+ ' days'"
        return script;
    }


    generateTimeDifferenceScript(dateStr: string): string {
      // The script will calculate time difference and format it in a human-readable way
      let script = `

        function generateTimeDifferenceScript(){
           const now = new Date();
          const selectedDate = new Date(\${${dateStr}}); 
          const diffInMs = now - selectedDate;
      
          const diffInSecs = Math.floor(diffInMs / 1000);
          const diffInMins = Math.floor(diffInSecs / 60);
          const diffInHours = Math.floor(diffInMins / 60);
          const diffInDays = Math.floor(diffInMs / (1000 * 3600 * 24));
          const diffInMonths = Math.floor(diffInDays / 30); // Approximate months
          const diffInYears = Math.floor(diffInDays / 365); // Approximate years
      
          // Determine which unit to use for the difference
          if (diffInSecs < 60) {
              return diffInSecs + " seconds";
          } else if (diffInMins < 60) {
              return diffInMins + " minutes";
          } else if (diffInHours < 24) {
              return diffInHours + " hours";
          } else if (diffInDays < 30) {
              return diffInDays + " days";
          } else if (diffInMonths < 12) {
              return diffInMonths + " months";
          } else {
              return diffInYears + " years";
          }
        }
         
        
        generateTimeDifferenceScript()
      
          
      `;
    
      return script;
  }
  
  

    getDateFormat(dateStr: string): string {

        return dateStr;
    }



    populateCustomForm(formData: any): void {

      const formGroup = this.fb.group({
        conditions: this.fb.array([])  // Form array for conditions
      });
  
      // Add conditions to this form group
      formData.conditions.forEach((conditionData: any) => {
        (formGroup.get('conditions') as FormArray).push(this.populateCustomCondition(conditionData));
      });
  
      // Add the form group to the 'forms' array
      this.customForms().push(formGroup);
  
      this.customColumnsflag = true
  
      this.cd.detectChanges()
    }


     // Create a new condition form group
   populateCustomCondition(conditionData: any): FormGroup {
    return this.fb.group({
      columnName: [conditionData.columnName, Validators.required],
      fieldSelector: [conditionData.fieldSelector, Validators.required],
      equationText: [conditionData.equationText, Validators.required],
      predefined: [conditionData.predefined, Validators.required]
    });
  }
    





  getTestingParams() {
    const params:any = {
      metadata: {
        columnVisibility: "[[{\"name\":\"approval_history\",\"label\":\"approval_history\",\"formName\":\"Work Order\"},{\"name\":\"track-3274927276\",\"label\":\"trackLocation\",\"formName\":\"Work Order\"},{\"name\":\"text-1732769530080\",\"label\":\"Work Order ID\",\"formName\":\"Work Order\"},{\"name\":\"single-select-1732769559973\",\"label\":\"Status\",\"formName\":\"Work Order\"},{\"name\":\"date-1732769545031\",\"label\":\"Date Issued\",\"formName\":\"Work Order\"},{\"name\":\"single-select-1732858580037\",\"label\":\"Part required\",\"formName\":\"Work Order\"},{\"name\":\"table-1732775270521\",\"label\":\"dynamic_table_values\",\"formName\":\"Work Order\"}]]",
        conditionMetadata: "{\"forms\":[{\"conditions\":[{\"condition\":\"single-select-1732858580037\",\"operator\":\"==\",\"value\":\"Yes\",\"operatorBetween\":\"\"}]}]}",
        customColumnMetadata: "{\"customForms\":[{\"conditions\":[{\"columnName\":\"Aging\",\"fieldSelector\":\"Date Issued.date-1732769545031\",\"equationText\":\" Math.floor((new Date() - new Date(\\\"${Date Issued.date-1732769545031}\\\")) / (1000 * 3600 * 24))+ ' days'\",\"predefined\":\"days_difference\"}]}]}",
        queryDesc: "test1",
        queryName: "test1",
        reportMetadata: "{\"dateType\":\"this year\",\"singleDate\":\"\",\"startDate\":\"\",\"endDate\":\"\",\"daysAgo\":\"\",\"form_permission\":[\"Work Order\"],\"form_data_selected\":[[{\"name\":\"approval_history\",\"label\":\"approval_history\",\"formName\":\"Work Order\"},{\"name\":\"track-3274927276\",\"label\":\"trackLocation\",\"formName\":\"Work Order\"},{\"name\":\"text-1732769530080\",\"label\":\"Work Order ID\",\"formName\":\"Work Order\"},{\"name\":\"single-select-1732769559973\",\"label\":\"Status\",\"formName\":\"Work Order\"},{\"name\":\"date-1732769545031\",\"label\":\"Date Issued\",\"formName\":\"Work Order\"},{\"name\":\"single-select-1732858580037\",\"label\":\"Part required\",\"formName\":\"Work Order\"},{\"name\":\"table-1732775270521\",\"label\":\"dynamic_table_values\",\"formName\":\"Work Order\"}]],\"filterOption\":\"onCondition\",\"columnOption\":\"onCondition\",\"addColumn\":\"true\"}",
        tableState: "{\"Work Order\":[{\"colId\":\"formFilter\",\"width\":200,\"hide\":true,\"pinned\":null,\"sort\":null,\"sortIndex\":null,\"aggFunc\":null,\"rowGroup\":false,\"rowGroupIndex\":null,\"pivot\":false,\"pivotIndex\":null,\"flex\":1},{\"colId\":\"Work Order ID\",\"width\":158,\"hide\":false,\"pinned\":null,\"sort\":null,\"sortIndex\":null,\"aggFunc\":null,\"rowGroup\":false,\"rowGroupIndex\":null,\"pivot\":false,\"pivotIndex\":null,\"flex\":1},{\"colId\":\"Status\",\"width\":158,\"hide\":false,\"pinned\":null,\"sort\":null,\"sortIndex\":null,\"aggFunc\":null,\"rowGroup\":false,\"rowGroupIndex\":null,\"pivot\":false,\"pivotIndex\":null,\"flex\":1},{\"colId\":\"approval_history\",\"width\":158,\"hide\":false,\"pinned\":null,\"sort\":null,\"sortIndex\":null,\"aggFunc\":null,\"rowGroup\":false,\"rowGroupIndex\":null,\"pivot\":false,\"pivotIndex\":null,\"flex\":1},{\"colId\":\"trackLocation\",\"width\":158,\"hide\":false,\"pinned\":null,\"sort\":null,\"sortIndex\":null,\"aggFunc\":null,\"rowGroup\":false,\"rowGroupIndex\":null,\"pivot\":false,\"pivotIndex\":null,\"flex\":1},{\"colId\":\"Date Issued\",\"width\":158,\"hide\":false,\"pinned\":null,\"sort\":null,\"sortIndex\":null,\"aggFunc\":null,\"rowGroup\":false,\"rowGroupIndex\":null,\"pivot\":false,\"pivotIndex\":null,\"flex\":1},{\"colId\":\"Part required\",\"width\":158,\"hide\":false,\"pinned\":null,\"sort\":null,\"sortIndex\":null,\"aggFunc\":null,\"rowGroup\":false,\"rowGroupIndex\":null,\"pivot\":false,\"pivotIndex\":null,\"flex\":1},{\"colId\":\"dynamic_table_values\",\"width\":158,\"hide\":false,\"pinned\":null,\"sort\":null,\"sortIndex\":null,\"aggFunc\":null,\"rowGroup\":false,\"rowGroupIndex\":null,\"pivot\":false,\"pivotIndex\":null,\"flex\":1},{\"colId\":\"Aging\",\"width\":162,\"hide\":false,\"pinned\":null,\"sort\":null,\"sortIndex\":null,\"aggFunc\":null,\"rowGroup\":false,\"rowGroupIndex\":null,\"pivot\":false,\"pivotIndex\":null,\"flex\":1}]}",
        userIDs: [
          {
            PK: "swapnil"
          }
        ]
      }
    };

    params.mode = "filterView"; 
  
    // Serialize and encode each parameter
    const encodeParams = (obj: any) => {
      return Object.keys(obj)
        .map(key => {
          const value = obj[key];
          // If the value is an object or array, we need to serialize it into a JSON string first
          return `${encodeURIComponent(key)}=${encodeURIComponent(JSON.stringify(value))}`;
        })
        .join('&');
    };
  
    // Construct the query string
    const queryString = encodeParams(params);
  
    // Construct the full URL (replace `baseUrl` with your actual endpoint)
    const baseUrl = "http://localhost:4200/reportStudio"; // Change this to your actual URL
    const fullUrl = `${baseUrl}?${queryString}`;


    console.log("URL is here ",fullUrl);
  
    return fullUrl;
  }
  

  





  async editUrlSavedQuery(result: any,key:any) {


    this.populateFormData= []     

    console.log("Edit url is called", result);
    
    try{
      
     if(result){
      if(result){


        this.tempResHolder = result

        console.log("Result is here ",this.tempResHolder);

        this.tempResHolder.reportMetadata = JSON.parse(this.tempResHolder.reportMetadata)
        this.tempResHolder.conditionMetadata = JSON.parse(this.tempResHolder.conditionMetadata).forms
        this.tempResHolder.customColumnMetadata = JSON.parse(this.tempResHolder.customColumnMetadata).customForms
        this.tempResHolder.columnVisibility = this.tempResHolder && this.tempResHolder.columnVisibility && JSON.parse(this.tempResHolder.columnVisibility)
        this.tempResHolder.tableState = this.tempResHolder && this.tempResHolder.tableState && JSON.parse(this.tempResHolder.tableState)
         this.editSavedDataArray = this.tempResHolder

         console.log("Result for the edit is here ",this.tempResHolder);
         const reportMetadata = this.tempResHolder.reportMetadata
         const conditionMetadata = this.tempResHolder.conditionMetadata
         const columnVisibility = this.tempResHolder.columnVisibility
         const customColumnMetadata = this.tempResHolder && this.tempResHolder.customColumnMetadata

         //Get the table State
         this.tableState = this.tempResHolder.tableState && JSON.parse(JSON.stringify(this.tempResHolder.tableState))

         console.log("conditionMetadata is here ",conditionMetadata);

         this.reportsFeilds.patchValue({
           dateType: reportMetadata.dateType,
           singleDate: reportMetadata.singleDate,
           startDate: reportMetadata.startDate,
           endDate:reportMetadata.endDate ,
           daysAgo:reportMetadata.daysAgo ,
           form_permission:reportMetadata.form_permission , 
           filterOption:reportMetadata.filterOption ,
           columnOption:reportMetadata.columnOption,
           addColumn:reportMetadata.addColumn,
           excelSheets:reportMetadata.excelSheets
         })       
         
         this.selectedForms = reportMetadata.form_permission
         
         this.selectedItem = []

          if(columnVisibility){
            this.selectedValues = JSON.parse(JSON.stringify(columnVisibility))
          }
        
         
          

          console.log("Star selected ",this.selectedValues);
           
         if(reportMetadata.columnOption != 'all' && Array.isArray(this.selectedValues) && this.selectedValues.length > 0){
           this.visibiltyflag = true
         }

         this.saveButton = true


         if(reportMetadata.addColumn != 'false'){

          console.log("Add column is executed ");

          this.customForms().clear()



          await this.addColumns("true",'')


          customColumnMetadata.forEach((formData: any) => {
            this.populateCustomForm(formData);
          });

          
         }
         else{
          this.customForms().clear();

          this.selectedForms.forEach((formData: any) => {
            this.addCustomForm(); 
          });

            this.customColumnsflag = false
         }




         
         if(reportMetadata.filterOption != 'all'){

          this.forms().clear();

           await this.onFilterChange('onCondition','','edit')

           

          //  console.log("conditionMetadata - - - - -- - -- - ",conditionMetadata);
            
          conditionMetadata.forEach((formData: any) => {
               this.populateForm(formData);
             });

             
         }
         else{

          this.forms().clear();

          this.selectedForms.forEach((formData: any) => {
            this.addForm(); 
          });

    


            this.conditionflag = false
         }
         if(this.selectedValues != undefined && Array.isArray(this.selectedValues) && this.selectedValues.length > 0 && reportMetadata.columnOption != 'all'){

          this.reportsFeilds.get('form_data_selected')?.patchValue([])

          // console.log("Column Option is false");

          await this.onColumnChange('onCondition','savedQuery')
         }
         else{
          this.visibiltyflag = false
         }

         this.onSubmitFlag = false
          this.onSubmit()

          if (JSON.parse(this.viewMode) === "fullView") {

            console.log("View mode is jere ",this.viewMode);

            this.isFullScreen = true;
            this.showHeading = true
          }
          else if(JSON.parse(this.viewMode) === "filterView"){
            this.isFullScreen = false;
            this.isFilterScreen = true
            this.showHeading = true
            this.isFormVisible = false
          }
          else{
            this.isFullScreen = false;
            this.isFilterScreen = false
            this.showHeading = false
          }

       
         this.onSubmitFlag = false

     
         this.dismissModal1(this.modalRef);

       
       }
     }

     this.cd.detectChanges()
     this.spinner.hide()

   
    }
    catch(error){
      this.spinner.hide()
      console.log("Error fetching reports table ",error);
    }
  }




  parseDateTime(dateString:any) {
    let date:any = dateString;

    // Updated regex pattern to allow single-digit day and month (e.g., 1/27/2025 instead of 01/27/2025)
    const customDatePattern = /^(\d{2})\/(\d{2})\/(\d{4})\s(\d{1,2}):(\d{2}):(\d{2})\s(AM|PM)$/i;
    
    const customDatePattern1 = /^(\d{1})\/(\d{1,2})\/(\d{4})\s(\d{1,2}):(\d{2}):(\d{2})\s(AM|PM)$/i;

    const match = customDatePattern.exec(dateString);
    const match1 = customDatePattern1.exec(dateString);
    
    console.log("match", match);
    
    console.log("match1 ",match1);

    if (match) {
        // Extract date parts
        const day = parseInt(match[1], 10);
        const month = parseInt(match[2], 10) - 1; // months are 0-based in JavaScript Date
        const year = parseInt(match[3], 10);
        let hours = parseInt(match[4], 10);
        const minutes = parseInt(match[5], 10);
        const seconds = parseInt(match[6], 10);
        const period = match[7];

        // Adjust hours for AM/PM
        if (period === 'PM' && hours < 12) {
            hours += 12;
        }
        if (period === 'AM' && hours === 12) {
            hours = 0;
        }

        // Create Date object in local time (no UTC conversion)
        date = new Date(year, month, day, hours, minutes, seconds);

    }
    else if(match1){
        console.log("Second amc");
         // Extract date parts
        const day = parseInt(match1[2], 10);
        const month = parseInt(match1[1], 10) - 1; // months are 0-based in JavaScript Date
        const year = parseInt(match1[3], 10);
        let hours = parseInt(match1[4], 10);
        const minutes = parseInt(match1[5], 10);
        const seconds = parseInt(match1[6], 10);
        const period = match1[7];

        // Adjust hours for AM/PM
        if (period === 'PM' && hours < 12) {
            hours += 12;
        }
        if (period === 'AM' && hours === 12) {
            hours = 0;
        }

        // Create Date object in local time (no UTC conversion)
        date = new Date(year, month, day, hours, minutes, seconds);
    }
        else {
        // Handle cases without AM/PM
        const dateParts = dateString.split(' ')[0].split('/');
        const time = dateString.split(' ')[1] || "00:00:00"; // Default time to 00:00:00 if not provided
        const [hour, minute, second] = time.split(':').map((x: string) => parseInt(x, 10));

        const year = parseInt(dateParts[2], 10);
        const month = parseInt(dateParts[1], 10) - 1; // months are 0-based in JavaScript Date
        const day = parseInt(dateParts[0], 10);

        // Use local time by creating a Date object
        date = new Date(year, month, day, hour, minute, second);
    }

    // Ensure that the date is valid before returning
    return isNaN(date.getTime()) ? null : date;
}




  toggleFullScreenFullView(){
    if(this.isFilterScreen){
      this.isFilterScreen = false
      this.isFullScreen = false;
      this.showHeading = !this.showHeading
   
    }else{
      this.isFullScreen = !this.isFullScreen;
      this.showHeading = !this.showHeading
    } 
 
    this.isFormVisible = true
  }


  toggleFormVisibility() {
    this.isFormVisible = !this.isFormVisible;
  }


  columnValidation(getValue: any, index: any, condIndex: any) {
    const condition = this.customForms().at(index).get('conditions')?.value;
    console.log("Condition is here ", condition);
  

    const numberOfEnteredColumns = condition.filter((item: any) => item.columnName == getValue.target.value);
    
    console.log("numberOfEnteredColumns",numberOfEnteredColumns);

    if (numberOfEnteredColumns.length > 1) {
      Swal.fire({
        title: "Duplicate custom columns found",
        text: `There are ${numberOfEnteredColumns.length} columns with the name "${getValue.target.value}". Please resolve the duplication.`,
        icon: 'warning', 
        confirmButtonText: 'OK'
      });
    }
  }


isFormAdvancedVisible = false;  // Toggle visibility of the form





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




calculateDistanceUsingGoogleAPI(startLat: number, startLon: number, endLat: number, endLon: number): Promise<number> {
  const service = new google.maps.DistanceMatrixService();

  const origin = new google.maps.LatLng(startLat, startLon);
  const destination = new google.maps.LatLng(endLat, endLon);

  return new Promise((resolve, reject) => {
    // Make a request to the Google Maps Distance Matrix API
    service.getDistanceMatrix(
      {
        origins: [origin],
        destinations: [destination],
        travelMode: google.maps.TravelMode.DRIVING, // You can change this to WALKING or BICYCLING if needed
      },
      (response, status) => {
        if (status === google.maps.DistanceMatrixStatus.OK) {
          const results = response?.rows[0].elements[0];
          if (results?.status === 'OK') {
            const distance = results.distance.value / 1000; // Convert from meters to kilometers
            resolve(distance); // Resolve with the distance in kilometers
          } else {
            reject('Distance calculation failed: ' + results?.status);
          }
        } else {
          reject('Distance Matrix request failed due to: ' + status);
        }
      }
    );
  });
}






  

}




















 







