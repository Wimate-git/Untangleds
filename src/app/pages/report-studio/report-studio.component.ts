import { AfterViewInit, ChangeDetectorRef, Component, DestroyRef, ElementRef, EventEmitter, OnDestroy, QueryList, TemplateRef, ViewChild, ViewChildren } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ColDef, GridApi, GridReadyEvent, Column, GridOptions, ColumnState, ColumnMovedEvent } from 'ag-grid-community';
import { APIService } from 'src/app/API.service';
import { SharedService } from '../shared.service';
import { HttpClient } from '@angular/common/http';
import { scheduleApiService } from '../schedule-api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxSpinnerService } from 'ngx-spinner';
import { catchError, firstValueFrom, from, map, Observable, of, shareReplay, Subject, Subscription, take, takeUntil, timeout } from 'rxjs';
import { PrimeNGConfig } from 'primeng/api';
import Swal from 'sweetalert2';
import { ImageModalComponent } from './image-modal/image-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModuleDisplayService } from './services/module-display.service';
import { Config } from 'datatables.net';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { AgGridAngular } from 'ag-grid-angular';
// import * as XLSX from 'xlsx';  
import * as pdfMake from "pdfmake/build/pdfmake";
import { vfs } from 'pdfmake/build/vfs_fonts';
import { MapModalComponent } from './map-modal/map-modal.component';
(pdfMake as any).vfs = vfs;
import XLSX from 'xlsx-js-style';  // Import xlsx-js-style

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

    // Ensure the listener is not added multiple times
    private isImageClickListenerAdded = false;
    private isLocationClickListenerAdded = false;
    private isMarkerClickListenerAdded = false;
  dyanmicFormDataArray: any = [];
  tableFormName: any = [];
  gridColumnApi: any;
  tableState: any = [];
  editOperation: boolean = false;

   constructor(private fb:FormBuilder,private api:APIService,private configService:SharedService,private scheduleAPI:scheduleApiService,
    private toast:MatSnackBar,private spinner:NgxSpinnerService,private cd:ChangeDetectorRef,private modalService: NgbModal,private moduleDisplayService: ModuleDisplayService,
    private route: ActivatedRoute,private router:Router
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

      // this.addImageClickListener();
      this.addLocationClickListener();
      this.addMarkerClickListener();

    // Listen for the custom 'image-click' event
    window.addEventListener('image-click', (event: any) => {
      const imageBase64 = event.detail;
      this.openImageModal(imageBase64);
    });

    // // window.addEventListener('location-click', this.handleLocationClick);
    // window.addEventListener('location-click', (event: Event) => this.handleLocationClick(event as CustomEvent));


    //   // window.addEventListener('location-click', this.handleLocationClick);
    //   window.addEventListener('marker-click', (event: Event) => this.handleTrackLocationClick(event as CustomEvent));

   
  }



  // Method to add location click listener
  addLocationClickListener() {
    if (!this.isLocationClickListenerAdded) {
      window.addEventListener('location-click', (event: Event) => this.handleLocationClick(event as CustomEvent));
      this.isLocationClickListenerAdded = true;
    }
  }

  // Method to add marker click listener
  addMarkerClickListener() {
    if (!this.isMarkerClickListenerAdded) {
      window.addEventListener('marker-click', (event: Event) => this.handleTrackLocationClick(event as CustomEvent));
      this.isMarkerClickListenerAdded = true;
    }
  }




   ngOnInit() {


    this.editOperation = false

    this.getLoggedUser = this.configService.getLoggedUserDetails()
    this.SK_clientID = this.getLoggedUser.clientID;
    this.username = this.getLoggedUser.username;
    this.permissionID = this.getLoggedUser.permission_ID

    // this.addFromService()



     this.formFieldsGroup = this.fb.group({
      forms: this.fb.array([]) 
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
      columnOption: ['all']
    });


     this.reportsFeilds.get('dateType')?.valueChanges.subscribe(value => {
      this.onDateTypeChange(value);
    });


    this.checkPermissions()
    
    this.routeSub = this.route.queryParams.subscribe((params) => {
      this.savedQuery = params['savedQuery'];
      console.log("Received saved query:", this.savedQuery);

      if(this.savedQuery){
        this.spinner.show()
        this.selectedValues = []
        this.editSavedQuery( this.savedQuery)
      }
    });
    
  }   



  async checkPermissions(){
    try {
      await this.api.GetMaster(`${this.SK_clientID}#permission#${this.permissionID}#main`, 1).then((result: any) => {
        if (result) {
          const helpherObj = JSON.parse(result.metadata).advance_report;
          this.adminAccess = helpherObj.includes('All Report ID Access') == true

          const tempholder = JSON.parse(JSON.parse(result.metadata).dynamicEntries)

          this.validForms = tempholder.filter((item:any)=>item.permission.includes('Read') == true)

          this.formList = this.validForms.map((item:any)=>item.dynamicForm[0])

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
          this.fetchUserLookupdata(1,this.SK_clientID + "#savedquery" + "#lookup")
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
     
              console.log("Response is in this form ", filteredData);
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
                <div class="d-flex flex-column" data-action="view" data-id="${full.id}">
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
  this.visibiltyflag = false
  this.reportsFeilds.get('filterOption')?.setValue('all');
  this.reportsFeilds.get('columnOption')?.setValue('all');
  this.populateFormBuilder = []
  this.populateFormData = []
  this.conditionflag = false
  this.selectedForms.forEach(() => {
    this.addForm(); 
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
  console.log('Get value is here ', this.selectedValues);



 

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

          tempMetadata[item] = tempResult.map((field: any) => {

            if((field.name.startsWith("map-") || field.type == 'map') && geoFlag == false){
              geoFlag = true
              return { name: field.name, label: "Geographic Location", formName: formName };
            }
            else if(field && field.name && field.validation && field.validation.isTrackHistory && trackFlag == false){
              trackFlag = true
            }
            return { name: field.name, label: field.label, formName: formName };
          });

          if(trackFlag){
            //Adding Dummy name
            tempMetadata[item].push({ name: "track-3274927276", label: "trackLocation", formName: formName })
          }
         
       
          console.log("tempMetadata[item] ",tempMetadata[item]);
        }
        this.populateFormData.push(tempMetadata);
      }

    

      this.populateFormData = Array.from(new Set(this.populateFormData))
      console.log("Data to be added in dropdowns ", this.populateFormData);

    } catch (error) {
      this.spinner.hide();
      console.log("Error in fetching form Builder data ", error);
    }
    this.spinner.hide();
  } else {
    this.visibiltyflag = false;
  }

  // Update visibility and set up dropdown keys
  if (selectedValue === 'onCondition') {
    console.log("Succeessfullt came here ");
    this.visibiltyflag = true;
    this.dropdownKeys = this.populateFormData.map((item: any) => Object.keys(item)[0]);

    // Ensure form control array has the same number of form controls as dropdowns
    if (getValue === 'html') {
      this.selectedItem = new Array(this.dropdownKeys.length).fill(null); // Ensure empty array for selection
      this.initializeFormControls(); // Ensure FormArray is correctly populated
    }
    else{
      console.log("Populated is called ");
      this.initializeFormControls1()
    }
    console.log("Dropdown keys are here ", this.dropdownKeys);
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

    console.log("Create the form here ",this.selectedValues);

    // Loop over the new data and add FormControls
    this.selectedValues.forEach((dropdownData: any[], i: any) => {
      // Each entry in populateFormData is an array, representing the options for the respective dropdown
      const selectedValues = dropdownData.map(item => item); // You can choose the property to store

      // Create a new FormControl with the selected values (or empty array if no selection)
      formArray.push(this.fb.control(selectedValues));
    });

    console.log('Form Controls Initialized:', this.reportsFeilds.value);
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

    console.log("Selected form data is here ",this.selectedForms);

    try{
      this.populateFormBuilder = []

      let tempMetadata:any = []
      for(let item of this.selectedForms){
        const formName = item
        const result = await this.api.GetMaster(`${this.SK_clientID}#dynamic_form#${item}#main`,1)

        if(result){
          let tempResult = JSON.parse(result.metadata || '').formFields
          console.log("tempResult is ",tempResult);

          tempMetadata = {}
          tempMetadata[item] = tempResult.map((item: any) => {
            return { name: item.name, label: item.label,  formName:formName ,options:item.options , type:item.type , validation:item.validation};  
          });
        }
        this.populateFormBuilder.push(tempMetadata)
      }
      
      console.log("Data to be added in dropdowns ",this.populateFormBuilder);
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
      const field = formFields[formName].find(
        (f: { name: string }) => f.name === selectedField
      );
    
      // Create the observable
      const options$ = new Observable<any[]>(observer => {
        if (!field) {
          observer.next([]);
          observer.complete();
          return;
        }
    
        if (field.validation && field.validation?.user === true) {
          const lookupKey = `${this.SK_clientID}#user#lookup`;
    
          console.log("User list dropdown is here ");
    
          // Make API call and transform result
          from(this.fetchUserLookupdata(1, lookupKey)).pipe(
            map((result: any) => {
              if (result) {
                console.log("Users List is ", result);
                return Array.from(new Set(result.map((item: any) => item.P1)));
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
    
        else if (field.validation?.lookup === true && field.validation?.form) {
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
        } else {
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

  //   selectedField(event:any,formIndex:any){
  //     console.log("Event is ",event);
  //     const selectedValue = event.target.value;  // Get the selected field value
  //     console.log('Selected Field:', selectedValue);

  //     this.updateFieldValueInput(formIndex, selectedValue);
  //   }



  // updateFieldValueInput(formIndex: number, selectedField: string): void {
  
  //   console.log("Condition Group is here ",this.formFieldsGroup);
    
  //   const formName = this.getFormNameByIndex(formIndex);
  //   console.log("FormName is ",formName);
  //   const formFields = this.populateFormBuilder.find((form: { [x: string]: any; }) => form[formName]);
  //   console.log("Form Fields ",formFields);
  //   const tempFormFields = formFields[formName]

  //   const field = tempFormFields.find((f: { name: string; }) => f.name === selectedField);
  //   if(field && field.type == 'select'){
  //       console.log("Dropdown found here ");

  //     } else {
       
  //     }
  // }



  formFieldsGroup: FormGroup;

  

  selectedForms: any = [];
  operators = ['=', '!=', '<', '>', '<=', '>='];


 
   // Default Column Definitions
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
    console.log(`Grid API saved for ${formFilter}`, gridApi);
  }

   getSelectedRows() {
     const selectedNodes = this.gridApi.getSelectedNodes();
     const selectedData = selectedNodes.map(node => node.data);
     console.log('Selected Rows:', selectedData);  
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

    let body: any;
    this.showTable = true
    this.tableData = []; 


    console.log("Saved Query is here ",this.savedQuery);
    
   

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
      console.log("Form mapped data is here on Submit",formMap);
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
  
      console.log("Request body is here ", body);
  
      try {

        const response = await this.scheduleAPI.sendData(body);
        console.log('Response from Lambda:', response);

        if (!groupedData[formFilter]) {
          groupedData[formFilter] = [];
        }
        groupedData[formFilter].push( response );
      } catch (error) {
        console.error('Error calling dynamic lambda:', error);
        this.spinner.hide();
      }
    }
  

    console.log("Data to be populated on Table is ", groupedData);

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
  
    let index = 0;

    for (let formFilter in groupedData) {


      const res = await this.api.GetMaster(`${this.SK_clientID}#dynamic_form#${formFilter}#main`,1)
      let dynamicMetadata:any;
      if(res && res.metadata){
        dynamicMetadata = JSON.parse(res.metadata).formFields  
      }
      console.log("Dynamic form builder data is here ",dynamicMetadata);


      let responses = groupedData[formFilter];

      console.log("Responses are here ",responses);

      let tempMetaArray = responses[0].map((item:any)=>item.metadata)



      if(this.conditionflag){
        let tempArray:any = []
        const conditionalString =  await this.buildConditionString(formConditions[index].conditions)
        for(let data of tempMetaArray){
          if(await this.evaluateTemplate(conditionalString,data) == true){
            tempArray.push(data)
          }
        }
        tempMetaArray = tempArray
      }

      console.log("After filter data is here ",tempMetaArray);

      this.dyanmicFormDataArray.push({ [formFilter]: dynamicMetadata });


      let rows = await this.mapLabels(tempMetaArray,dynamicMetadata) 

      console.log("After mapping labels are here ",rows);

      console.log("formMap",formMap);

      if (rows && Array.isArray(rows) && rows.length > 0 && this.visibiltyflag && formMap) {
        rows = rows.map(item => {
          let filteredItem: any = {}; // Initialize the filtered item
          // Loop through the fields in formMap[`${formFilter}`]
          formMap[`${formFilter}`] && formMap[`${formFilter}`].forEach((key: string) => {
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
        rows[i].formFilter = formFilter
      }

      console.log("Rows are here ",rows);
      console.log("Filtered rows are here ",rows);


      console.log("Dyanmic Data array list this.dyanmicFormDataArray ",this.dyanmicFormDataArray);

  

      tableDataWithFormFilters.push({ formFilter, rows });
      index++;
    }
  

    this.tableDataWithFormFilters = tableDataWithFormFilters;
    console.log("Table rows are here ",this.tableDataWithFormFilters);

 
    this.spinner.hide()

  }


  
isBase64(value: string): boolean {
  const regex = /^data:image\/(png|jpeg|jpg|gif|bmp);base64,/;
  return regex.test(value);
}
 


  // createColumnDefs(rowData: any[]): ColDef[] {
  //   const columns: any = [];
    
  //   if (rowData.length > 0) {
  //     const sampleRow = rowData[0];
    
  //     // Add 'formFilter' column manually
  //     columns.push({
  //       headerName: 'Form Filter',
  //       field: 'formFilter',
  //       flex: 1,
  //       filter: true,
  //       minWidth: 150,  // Add a minimum width for the formFilter column
  //       hide: true
  //     });

    
  //     // Iterate through metadata keys to create dynamic columns
  //     for (let key in sampleRow) {

  //       if (key !== 'formFilter' && key !== 'PK' && key !== 'SK' && key != 'Updated Date') {
  //         // Check if the value in the row is Base64 (image data)
  //         const isBase64Image = this.isBase64(sampleRow[key]);
  //         const isLocation = this.isLocation(key,sampleRow[key]);


  //         // Choose renderer based on condition
  //           let cellRenderer = null;
  //           if (isBase64Image) {
  //             cellRenderer = this.imageCellRenderer;
  //           } else if (isLocation) {
  //             cellRenderer = this.locationCellRenderer;
  //           }
  
  //         columns.push({
  //           headerName: this.formatHeaderName(key), // Format the header name
  //           field: key,
  //           flex: 1,            // Allow the column to flex (resize relative to others)
  //           minWidth: 150,   
  //           filter: true,       // Enable filtering for this column
  //           sortable: true,     // Enable sorting for this column
  //           cellRenderer: cellRenderer, // Apply custom cellRenderer for Base64 images
  //           cellRendererParams: {
  //             context: this  // Pass the component context to the cell renderer
  //           }
  //         });
  //       }
  //     }
  
  //     // Check if 'updatedDate' field exists and sort it
  //     if (sampleRow.hasOwnProperty('Updated Date')) {
  //       columns.push({
  //         headerName: 'Updated Date',
  //         field: 'Updated Date',
  //         flex: 1,
  //         filter: 'agDateColumnFilter',  // Use date filter
  //         sortable: true,
  //         minWidth: 200,  // Customize width
  //         sort: 'desc',   // Set default sort order to descending (latest first)
  //       });
  //     }

  //   }
  
  //   return columns;
  // }

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
        if (key !== 'formFilter' && key !== 'PK' && key !== 'SK' && key != 'Updated Date' && key != 'id' && key != 'dynamic_table_values') {
          const { isBase64Image, isLocation, isTrackLocation } = dynamicColumns[key];
  
          // Choose renderer based on conditions
          let cellRenderer = null;
          if (isBase64Image) {
            cellRenderer = this.imageCellRenderer;
          } else if (isLocation) {
            cellRenderer = this.locationCellRenderer;
          } else if (isTrackLocation) {
            cellRenderer = this.trackLocationCellRenderer;
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
  
        if (!dynamicColumns[key]) {
          dynamicColumns[key] = { isBase64Image, isLocation, isTrackLocation };
        } else {
          // If the column already exists, just update the state (no need to overwrite)
          dynamicColumns[key].isBase64Image = dynamicColumns[key].isBase64Image || isBase64Image;
          dynamicColumns[key].isLocation = dynamicColumns[key].isLocation || isLocation;
          dynamicColumns[key].isTrackLocation = dynamicColumns[key].isTrackLocation || isTrackLocation;
        }
      }
    });
  
    return dynamicColumns;
  }
  

  isTrackLocation(key:any,value: any): boolean {
    return key == 'trackLocation' && Array.isArray(value);
  }


      // trackLocationCellRenderer(params: any) {

      //   // console.log("Params are here ",params);

      //   if(params && params.value){
      //     const coordinates = params.value; 
        
      //       // Create a clickable link for the location
      //       const link = document.createElement('a');
      //       link.href = 'javascript:void(0)';
      //       link.innerHTML = coordinates;

      //       // Add click event listener to dispatch a custom event
      //       link.addEventListener('click', () => {
      //           // Dispatch a custom event with location data
      //           const event = new CustomEvent('marker-click', {
      //               detail: { coordinates: coordinates }
      //           });
      //           window.dispatchEvent(event);
      //       });

      //       return link;
      //   }

      //   return null
      // }



      trackLocationCellRenderer(params: any) {

        // Check if params and params.value exist
        if (params && params.value) {
            const coordinates = params.value;
    
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
    
    


      isLocation(key: any,getValue:any){
        if(key == 'Geographic Location' && getValue.includes(',')){
          return true
        }
        return false
      }


 

  


  // Helper function to format header names (capitalize words and replace dashes with spaces)
  formatHeaderName(key: string): string {
    return key.replace(/-/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
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

  // Ensure the value is a comma-separated string of latitude and longitude
  const coordinates = typeof params.value == 'string' ? params.value.split(',') : "";
  const lat = coordinates[0];  // First part is latitude
  const lon = coordinates[1];  // Second part is longitude


  const locationText = lat && lon ? `${lat}, ${lon}` : null;

  // Create a container for the icon
  const container = document.createElement('div');
  container.style.display = 'flex';
  container.style.alignItems = 'center';
  container.style.justifyContent = 'center';


  // Create the Bootstrap location icon
  const locationIcon = document.createElement('i');
  locationIcon.className = 'bi bi-geo-alt-fill';  
  locationIcon.style.fontSize = '24px';  
  locationIcon.style.cursor = 'pointer';  
  locationIcon.style.marginRight = '8px'; 
  locationIcon.style.color = 'red';

  // Add click event listener to dispatch a custom event with location data
  locationIcon.addEventListener('click', () => {
    // Dispatch a custom event with location data
    const event = new CustomEvent('location-click', {
        detail: { latitude: lat, longitude: lon }
    });
    window.dispatchEvent(event);
  });

  // Append the icon to the container (no need for a link now)
  container.appendChild(locationIcon);

  return container;
}




  // This method opens the modal and passes the imageBase64 string
  openImageModal(imageBase64: string) {
    const modalRef = this.modalService.open(ImageModalComponent);
    modalRef.componentInstance.imageSrc = imageBase64;  // Pass the Base64 string to the modal component
  }




   // This function will be called when the location-click event is fired
   handleLocationClick(event: CustomEvent) {
    console.log("Event ",event);

    const { latitude, longitude } = event.detail;
    console.log('Location clicked:', latitude, longitude);
    
    // Open the modal with the location data
    this.openLocationModal(latitude, longitude);
  }


  handleTrackLocationClick(event: CustomEvent) {
    console.log("Event Marker",event);

    const { coordinates } = event.detail;
    
    // Open the modal with the location data
    this.openTrackLocationModal(coordinates);
  }


  openTrackLocationModal(lat: string) {
    const modalRef = this.modalService.open(MapModalComponent, { size: 'lg' });
    modalRef.componentInstance.coordinates = lat;
  }



  openLocationModal(lat: string, lon: string) {
    const modalRef = this.modalService.open(MapModalComponent, { size: 'lg' });
    modalRef.componentInstance.latitude = lat;
    modalRef.componentInstance.longitude = lon;
  }

 

 


  async addFromService(){    
    try {
      await this.api.GetMaster(this.SK_clientID + "#dynamic_form#lookup", 1).then((result: any) => {
        if (result) {
          const helpherObj = JSON.parse(result.options);
    
          // Corrected the map function
          this.formList = helpherObj.map((item: any) => (item[0]));
        }
      });
    } catch (err) {
      console.log("Error fetching the dynamic form data ", err);
    }
  }



  // Getter for easier access in template
  get dateType() {
    return this.reportsFeilds.get('dateType');
  }


  clearFeilds() {

    this.editOperation = false;
    this.tableState = {};

    this.forms().clear()
  
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
  



   async evaluateTemplate(template:any,metadata:any) {
    // Use regex to match variable-value pairs
    const matches = template.match(/\${(.*?)}/g);
    // Substitute variables with metadata values
    matches.forEach((match: string) => {
        const variableName = match.replace(/\${|}/g, '');
        const metadataKey = Object.keys(metadata).find(key => key == variableName);
        const substitutedValue = metadataKey ? metadata[metadataKey] : match;

        // If the substituted value is a string, wrap it in quotes
        const formattedValue = typeof substitutedValue === 'string' ? `'${substitutedValue}'` : substitutedValue;

        // Replace in the template
        template = template.replace(match, formattedValue);
    });

    // Evaluate the expression safely
    try {
        const result = eval(template);
        return result;
    } catch (error) {
        console.error("Error evaluating template:", error);
        Swal.fire({
          title: "Incomplete Fields",
          text: "Please fill in all the required conditional fields before proceeding.",
          icon: "error",
          confirmButtonText: "Okay"
      });
        return null;
    }
}





  async mapLabels(responses:any, metadata:any) {
    const mappedResponses = responses.map((response: any) => {
      const mappedResponse = { ...response };
  
      metadata.forEach((field: any) => {
        const fieldName = field.name;   
        const label = field.label;
        
        
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
          mappedResponse[label] = 'N/A';
        }
      });

      
  
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

    console.log("Selected column visibility ",this.selectedItem);

    console.log("Table temp State is here ",this.tableTempState);

    //Creating packet for reports module to pass
    this.savedModulePacket = [this.reportsFeilds.value,this.formFieldsGroup.value,this.selectedValues, this.tableTempState]
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
    modal.dismiss('Cross click');
  }


    delete(id: number) {
      console.log("Deleted username will be", id);
      this.deleteNM(id);
    }
  
    create() {
      // this.userModel = { P1: '', P2: '', P3: '',P4:0,P5:'' };
      // this.openModal('')
    }




    async deleteNM(getValue: any) {

      console.log("Value to be deleted is here ",getValue);

      const deleteData = this.original_lookup_data.filter((item:any)=>item.P1 == getValue)
    
        let temp = {
          PK: this.SK_clientID+"#savedquery#"+getValue+"#main",
          SK: 1
        }
  
        var item = deleteData[0]
        

        console.log("Deleted items is ",item);
        console.log("deleted temp is here ",temp);

   
       

            try{
            
            await this.api.DeleteMaster(temp).then(async value => {
     
              await this.fetchTimeMachineById(1, getValue, 'delete', item)

              this.reloadEvent.next(true)

              // return Swal.fire({
              //   title: 'Saved Query Deleted Successfully!',
              //   text: 'The saved query has been successfully removed from the system.',
              //   icon: 'success',  // You can change this to 'error' or 'warning' depending on the context
              //   background: 'red',  // Green background to indicate success
              // });
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
      if(this.modalName == 'Reports'){
        this.router.navigate(['/reportStudio'], { queryParams: { savedQuery: P1 } });
      }
    }


  
    async editSavedQuery(P1: any) {

      console.log("Edit si being called");

      this.populateFormData= []     
      
      try{
       this.api.GetMaster(`${this.SK_clientID}#savedquery#${P1}#main`,1).then(async (result)=>{
        if(result && result.metadata){

          this.tempResHolder = JSON.parse(result.metadata)

          console.log("Result is here ",this.tempResHolder);
 
          this.tempResHolder.reportMetadata = JSON.parse(this.tempResHolder.reportMetadata)
          this.tempResHolder.conditionMetadata = JSON.parse(this.tempResHolder.conditionMetadata).forms
          this.tempResHolder.columnVisibility = this.tempResHolder && this.tempResHolder.columnVisibility && JSON.parse(this.tempResHolder.columnVisibility)
          this.tempResHolder.tableState = this.tempResHolder && this.tempResHolder.tableState && JSON.parse(this.tempResHolder.tableState)
           this.editSavedDataArray = this.tempResHolder
 
           console.log("Result for the edit is here ",this.tempResHolder);
           const reportMetadata = this.tempResHolder.reportMetadata
           const conditionMetadata = this.tempResHolder.conditionMetadata
           const columnVisibility = this.tempResHolder.columnVisibility

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
             columnOption:reportMetadata.columnOption
           })        
           
           this.selectedItem = []

            if(columnVisibility){
              this.selectedValues = JSON.parse(JSON.stringify(columnVisibility))
            }
          
           
            

            console.log("Star selected ",this.selectedValues);
             
           if(reportMetadata.columnOption != 'all' && Array.isArray(this.selectedValues) && this.selectedValues.length > 0){
             this.visibiltyflag = true
           }
 
           this.saveButton = true
           
           if(reportMetadata.filterOption != 'all'){

            this.forms().clear();
 
             await this.onFilterChange('onCondition','','edit')
 
             
 
             console.log("conditionMetadata - - - - -- - -- - ",conditionMetadata);
              
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

            console.log("Column Option is false");

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
      window.removeEventListener('location-click', (event: Event) => this.handleLocationClick(event as CustomEvent));

      this.destroy$.next();
      this.destroy$.complete();
      this.optionsCache.clear();

      this.datatableConfig = {}
    }


  fetchUserLookupdata(sk:any,pkValue:any):any {
    
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
                promises.push(this.fetchUserLookupdata(sk + 1,pkValue)); // Store the promise for the recursive call
                
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
            console.log("All the users are here", this.lookup_data_savedQuery);

            this.original_lookup_data = this.lookup_data_savedQuery

            this.listofSavedIds = this.lookup_data_savedQuery.map((item:any)=>item.P1)

            console.log("All the unique IDs are here ",this.listofSavedIds);

            this.lookup_data_savedQuery = this.lookup_data_savedQuery.map((item: any) => {
              if (item.P2 && item.P2.username === this.username) {
                item.P2.username = 'Me';
              }
              return item; 
            });

            if(!this.adminAccess){
              this.lookup_data_savedQuery = this.lookup_data_savedQuery.filter((item:any)=>item.P2.username == "Me")
            }
           
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
    const wb = XLSX.utils.book_new(); 
  
    // Use `map` instead of `forEach` to handle async operations properly
    const tableExports = await Promise.all(this.agGrids.toArray().map(async (gridInstance, index) => {
      const gridApi = gridInstance.api;
      const csvData = gridApi.getDataAsCsv();
      console.log("CSV data is here ",csvData);
      const data = this.csvToArray(csvData || '');

      console.log("Data is here ",data);
  
      const headers = data[0].map((header: string) => header.replace(/[\r\n]+/g, '').replace(/^"|"$/g, '').trim());

      console.log("Headers are here ",headers);
  
      const ws = XLSX.utils.aoa_to_sheet(data);

       // Add the worksheet to the workbook with the name of the formFilter
       XLSX.utils.book_append_sheet(wb, ws, this.tableDataWithFormFilters[index].formFilter);


      try{
        const trackLocationColumnIndex = headers.indexOf('TrackLocation');
        console.log('Index is here ',trackLocationColumnIndex);
        if (trackLocationColumnIndex !== -1) {
          const trackLocationData = this.extractTrackLocationData(data, trackLocationColumnIndex, index);
          const trackLocationSheet = XLSX.utils.aoa_to_sheet(trackLocationData);
          XLSX.utils.book_append_sheet(wb, trackLocationSheet, `TrackLocation ${this.tableDataWithFormFilters[index].formFilter}`);
        }
    
        const tableColumnIndex = this.tableDataWithFormFilters[index].rows[0].hasOwnProperty('dynamic_table_values');
        console.log("Table column Index is here ",tableColumnIndex);
        if (tableColumnIndex) {
          const tableData: any = await this.extractMiniTableData(data, tableColumnIndex, index);

          for (const tableKey in tableData) {
            const filteredFormName = this.tableFormName.find((item:any)=>Object.keys(item)[0] == tableKey)
            console.log("Filtered FormName ",filteredFormName);

            if (tableData.hasOwnProperty(tableKey)) {
              const miniTableData = tableData[tableKey];
              const miniTableSheet = XLSX.utils.aoa_to_sheet(miniTableData);
              XLSX.utils.book_append_sheet(wb, miniTableSheet, `${filteredFormName[tableKey]} ${this.tableDataWithFormFilters[index].formFilter}`);
            }
          }
        }
      }
      catch(error){
        console.log("Error in processing mini table and track Location ",error);
      }
  
   
  
      // Style the header row
      for (let i = 0; i < headers.length; i++) {
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
  
  // Method to extract mini table data
  async extractMiniTableData(data: any[], tableColumnIndex: number, index: number) {
    const tableData: any = {};
  
    // Extract dynamic_table_values from the current record
    let tempHolder = this.tableDataWithFormFilters[index]["rows"].map((item: any) => item?.dynamic_table_values || []);
  
    console.log("tempHolder before filtering:", tempHolder);
  
    // Remove any invalid data (e.g., empty arrays)
    tempHolder = tempHolder.filter((ele: any) => !Array.isArray(ele));  // Fix filtering logic
  
    console.log("tempHolder after filtering:", tempHolder);
  
    // Iterate over each record and extract the dynamic tables
    tempHolder.forEach((record: any) => {
      const dynamicTables = record; // Record could have multiple tables
  
      if (dynamicTables) {
        // Iterate through each dynamic table in the current record
        Object.keys(dynamicTables).forEach((tableKey) => {
          const tableRows = dynamicTables[tableKey];
  
          if (tableRows && Array.isArray(tableRows) && tableRows.length > 0) {
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
        });
      }
    });
  
    console.log('Iterated Table data is here ', tableData);
  
    // Fetch dynamic form data labels and apply them
    await Promise.all(Object.keys(tableData).map(async (item: any) => {
      const filterData = this.dyanmicFormDataArray[index][this.tableDataWithFormFilters[index].formFilter]?.find((element: any) => item.startsWith(element.name));
  
      if (filterData && filterData.validation?.formName_table) {
        const tableFormName = filterData.validation.formName_table;
        const result = await this.api.GetMaster(`${this.SK_clientID}#dynamic_form#${tableFormName}#main`, 1);
  
        if (result && result.metadata) {
          this.tableFormName.push({[item]:tableFormName});

          const dynamicFormFields = JSON.parse(result.metadata).formFields;
          let rowsHeader = tableData[item][0].map((i: any) => {
            const res = dynamicFormFields.find((field: any) => field.name === i);
            return res ? res.label : i;  // Apply label or keep the original header
          });
  
          tableData[item][0] = rowsHeader;  // Replace headers with labels
        }
      }
  
      console.log("Filtered Dynamic data is here ", filterData);
    }));
  
    console.log('After adding Labels Table data is here ', tableData);
  
    return tableData;
  }
  

extractTrackLocationData(data: any, trackLocationColumnIndex: any, index: any) {

  console.log("Multiple rows are here ",this.tableDataWithFormFilters[index]["rows"]);

  let tempHolder = this.tableDataWithFormFilters[index]["rows"].map((item: any) =>{
    return {trackLocation:item.trackLocation, id:item.id}
  });

  tempHolder = tempHolder.filter((item:any)=>Array.isArray(item.trackLocation) && item.trackLocation.length > 0)
  console.log("Temp holder is here ", tempHolder);

  const trackLocationRows: any[] = [];

  // Define headers for the "TrackLocation" sheet
  const headers = [
    "ID","Date and Time", "Label ID", "Label Name", "Latitude", "Longitude", "Name", "Type"
  ];


  // Check if the first entry in tempHolder has the data we need (ensure it's an array and not empty)
  const trackLocationArray = Array.isArray(tempHolder) && tempHolder.length > 0 ? tempHolder[0].trackLocation:[];

  if (Array.isArray(trackLocationArray) && trackLocationArray.length > 0) {
    // Add headers as the first row
    trackLocationRows.push(headers);

    // Iterate over each row in tempHolder and extract "TrackLocation" data
    tempHolder.forEach((row: any) => {
      // If the trackLocation is a valid array
      const trackLocationObjects = row.trackLocation;

      if (Array.isArray(trackLocationObjects) && trackLocationObjects.length > 0) {
        // For each object in the trackLocation array, extract the relevant fields
        trackLocationObjects.forEach((obj: any) => {
          const rowValues = [
            row.id || '',               //ID
            obj.Date_and_time || '',    // Date and Time
            obj.label_id || '',         // Label ID
            obj.label_name || '',       // Label Name
            obj.latitude || '',         // Latitude
            obj.longitude || '',        // Longitude
            obj.name || '',             // Name
            obj.type || ''              // Type
          ];

          // Push the extracted values to the rows
          trackLocationRows.push(rowValues);
        });
      }
    });
  }

  console.log("Track Location rows extracted: ", trackLocationRows);

  // Return the rows to be used in the new sheet
  return trackLocationRows;
}


  

// Helper function to convert CSV string to 2D array (needed by SheetJS)
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

  

 


  exportAllTablesAsPDF() {
    const tableDataWithFormFilters = this.tableDataWithFormFilters; // Assuming this is your table data
  
    const docDefinition: any = {
      content: [],
      defaultStyle: {
        fontSize: 10,
      },
      styles: {
        tableHeader: {
          bold: true,
          fontSize: 14,
          margin: [0, 5],
          alignment: 'center',
          fillColor: '#4CAF50',  // Green background for header
          color: '#fff',         // White text for header
          padding: [5, 10],      // Add padding to header cells
          border: [true, true, true, true],  // Border around header cells
        },
        tableBody: {
          fontSize: 10,
          margin: [0, 5],
          padding: [5, 10],        // Add padding to body cells
          alignment: 'center',     // Center align text for better readability
        },
        tableRow: {
          fontSize: 10,
          margin: [0, 5],
          border: [true, true, true, true],  // Border for body cells
          padding: [5, 10],  // Padding inside table cells
        },
        alternatingRow: {
          fontSize: 10,
          margin: [0, 5],
          fillColor: '#f9f9f9',  // Light gray background for alternating rows
          border: [true, true, true, true],
          padding: [5, 10],  // Padding inside alternating row cells
        },
        footer: {
          fontSize: 10,
          alignment: 'center',
          margin: [0, 10],
        },
        title: {
          fontSize: 18,
          bold: true,
          alignment: 'center',
          margin: [0, 10],
          color: '#333',  // Darker color for the title
        }
      },
      footer: function(currentPage: number, pageCount: number) {
        return [
          {
            text: `Untangled Pro Page ${currentPage} of ${pageCount}`, // Page number
            alignment: 'center', // Center the page number
            margin: [0, 10],
          }
        ];
      },
    };
  
    tableDataWithFormFilters.forEach((tableData: { rows: any[]; formFilter: any; }, index: number) => {
      const columns = this.createColumnDefsPDF(tableData.rows);
  
      // Adjust the page size based on the number of columns
      const columnCount = columns.length;
      if (columnCount <= 6) {
        docDefinition.pageSize = 'A4'; // Set page size to A4 if columns are less than or equal to 6
      } else if (columnCount <= 10) {
        docDefinition.pageSize = 'A3'; // Set page size to A3 if columns are between 7 and 10
      } else if (columnCount <= 15) {
        docDefinition.pageSize = 'A2'; // Set page size to A2 if columns are between 11 and 15
      } else {
        docDefinition.pageSize = 'A1'; // Set page size to A1 if columns are greater than 15
      }
  
      // Add title (formFilter as table title)
      const title = `${tableData.formFilter}`;
      docDefinition.content.push({
        text: title,
        style: 'tableHeader',
        margin: [0, 10],
      });
  
  
      // Prepare the table body
      const tableBody = [];
  
      // Add header row
      tableBody.push(columns.map((col: any) => ({
        text: col.toString(),
        style: 'tableHeader',
      })));
  
      // Add data rows
      tableData.rows.forEach((row: any) => {
        const rowData = columns.map((col: any) => {
          let cellData: any = row[col];
  
          if (typeof cellData === 'object' && cellData !== null) {
            return ''; // Treat object as empty string
          }
  
          // Check if cellData contains a base64 image string
          else if (cellData && typeof cellData === 'string' && cellData.includes('data:image')) {
            return {
              image: cellData,   // Use the Base64 image data
              width: 50,         // Set image width (adjust as needed)
              height: 50,        // Set image height (adjust as needed)
            };
          }
  
          // Return empty string for null or undefined
          return cellData ?? '';
        });
        tableBody.push(rowData);
      });
  
      // Add the table to the content
      docDefinition.content.push({
        table: {
          body: tableBody,
          headerRows: 1, // First row is header
          widths: Array(columns.length).fill('auto'), // Dynamically set column widths based on content
        },
        layout: 'lightHorizontalLines', // Layout style
        margin: [0, 10],
      });
  
      // Add page break between tables if not the last table
      if (index < tableDataWithFormFilters.length - 1) {
        docDefinition.content.push({
          text: '', pageBreak: 'before',
        });
      }
    });
  
    // Generate the PDF using pdfMake
    pdfMake.createPdf(docDefinition).download('combined-tables.pdf');
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
    console.log("Loaded state from localStorage", savedState);

    // Apply saved column state to each formFilter
    Object.keys(savedState).forEach(formFilter => {
      const savedColumnState = savedState[formFilter];
      if (savedColumnState && this.gridInstances[formFilter]) {
        this.gridInstances[formFilter].applyColumnState({ state: savedColumnState, applyOrder: true });
        console.log(`Applied column state for ${formFilter}`);
      }
    });

  }
  

  onColumnMoved = (event: any) => {

    // if (this.editOperation || this.loadingColumnState) {
    //   return;
    // }

    console.log('Column moved:', event);
    const formFilter = event && event.column && event.column.colDef.FormName;
    console.log("Selected form Filter is here ",formFilter);

    const gridID = event.column && event.column.stubContext && event.column.stubContext.gridId

    console.log("Grid id is here ",gridID);
    
    this.saveColumnState(formFilter,gridID); // Save column state after column is moved for this formFilter

    
  };

    // Save column state for a specific formFilter
    saveColumnState(formFilter: string, gridID: any) {
      // if (this.editOperation || this.loadingColumnState) {
      //   return;
      // }
  
      console.log("Saving column state for", formFilter);
  
      // Retrieve the gridApi specific to this formFilter
      const gridApi = this.gridInstances[formFilter];
      if (gridApi) {
        const columnState = gridApi.getColumnState(); // Get column state for the current grid
        console.log("Column State for", formFilter, columnState);
  
        // Ensure tableState is initialized
        if (!this.tableState) {
          this.tableState = {};
        }
  
        // Deep copy the column state to avoid reference issues
        this.tableState[formFilter] = [...columnState]; // Store the column state for the specific formFilter
  
        // Save to localStorage if tableState has any data
        if (Object.keys(this.tableState).length > 0) {
          this.tableTempState = { ...this.tableState }; 
          console.log("Saving table state to localStorage:", this.tableState);
          // this.loadingColumnState = true;

          // localStorage.setItem("tableState", JSON.stringify(this.tableState));
        }
      }
    }
  

} 







