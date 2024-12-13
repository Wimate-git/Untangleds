import { AfterViewInit, ChangeDetectorRef, Component, DestroyRef, EventEmitter, OnDestroy, TemplateRef, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ColDef, GridApi, GridReadyEvent, Column } from 'ag-grid-community';
import { APIService } from 'src/app/API.service';
import { SharedService } from '../shared.service';
import { HttpClient } from '@angular/common/http';
import { scheduleApiService } from '../schedule-api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxSpinnerService } from 'ngx-spinner';
import { firstValueFrom, Subscription } from 'rxjs';
import { PrimeNGConfig } from 'primeng/api';
import Swal from 'sweetalert2';
import { ImageModalComponent } from './image-modal/image-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModuleDisplayService } from './services/module-display.service';
import { Config } from 'datatables.net';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';

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
  @ViewChild('SavedQuery') SavedQuery: TemplateRef<any>;  // Reference to the modal template
  reloadEvent: EventEmitter<boolean> = new EventEmitter();
  modalRef: any;

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





   
  dateTypeConfig :any= {
    'is': { showDate: true },
    '>=': { showDate: true },
    '<=': { showDate: true },
    'between': { showStartDate: true, showEndDate: true , isBetweenTime: false },
    'between time': { showStartDate: true, showEndDate: true , isBetweenTime: true },
    'less than days ago': { showDaysAgo: true },
    'more than days ago': { showDaysAgo: true },
    'days ago': { showDaysAgo: true },
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


   constructor(private fb:FormBuilder,private api:APIService,private configService:SharedService,private scheduleAPI:scheduleApiService,
    private toast:MatSnackBar,private spinner:NgxSpinnerService,private cd:ChangeDetectorRef,private modalService: NgbModal,private moduleDisplayService: ModuleDisplayService,
    private route: ActivatedRoute,private router:Router
   ){}



    ngAfterViewInit() {
    // Listen for the custom 'image-click' event
    window.addEventListener('image-click', (event: any) => {
      const imageBase64 = event.detail;
      this.openImageModal(imageBase64);
    });
  }




   ngOnInit() {
    this.getLoggedUser = this.configService.getLoggedUserDetails()
    this.SK_clientID = this.getLoggedUser.clientID;
    this.username = this.getLoggedUser.username;
    this.permissionID = this.getLoggedUser.permission_ID

    this.addFromService()


     // Initialize form group for dynamic fields
     this.formFieldsGroup = this.fb.group({
      forms: this.fb.array([])  // This array will hold the dynamic form groups for each selected form
    });

    // Initialize the form group with form controls
    this.reportsFeilds = this.fb.group({
      dateType: ['', Validators.required],
      singleDate: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      daysAgo: ['', Validators.required],
      form_permission: [[], Validators.required], 
      filterOption: ['all'],
    });

     // Listen to changes in dateType to adjust validations
     this.reportsFeilds.get('dateType')?.valueChanges.subscribe(value => {
      this.onDateTypeChange(value);
    });


    this.checkPermissions()
    
    this.routeSub = this.route.queryParams.subscribe((params) => {
      this.savedQuery = params['savedQuery'];
      console.log("Received saved query:", this.savedQuery);

      if(this.savedQuery){
        this.editSavedQuery( this.savedQuery)
      }
    });



  }   


  async checkPermissions(){
    try {
      await this.api.GetMaster(`${this.SK_clientID}#permission#${this.permissionID}#main`, 1).then((result: any) => {
        if (result) {
          const helpherObj = JSON.parse(result.metadata).advance_report;
          const advance_report = helpherObj && helpherObj.advance_report

          console.log("Advance report is here ",advance_report);
    
          this.adminAccess = helpherObj.includes('All Report ID Access') == true
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
    conditions: this.fb.array([this.createCondition()]) // Start with one condition
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
  this.reportsFeilds.get('filterOption')?.setValue('all');
  this.conditionflag = false
  this.selectedForms.forEach(() => {
    this.addForm(); 
  });
}


async onFilterChange(event: any,getValue:any) {


  if (this.selectedForms.length == 0) {
    Swal.fire({
        title: "Oops!",
        text: "You need to select at least one form before to add conditions. Please select the forms to continue.",
        icon: "warning",
        confirmButtonText: "Got it"
    });
    return;
}
  
let selectedValue
  if(getValue == 'html'){
    selectedValue = (event.target as HTMLInputElement).value;
  }
  else{
    selectedValue = event;
  }
  
 

  if(selectedValue == 'onCondition'){
    this.spinner.show()
    console.log("Selected form data is here ",this.selectedForms);

    try{
      let tempMetadata:any = []
      for(let item of this.selectedForms){
        const result = await this.api.GetMaster(`${this.SK_clientID}#dynamic_form#${item}#main`,1)

        if(result){
          let tempResult = JSON.parse(result.metadata || '').formFields
          tempMetadata = {}
          tempMetadata[item] = tempResult.map((item: any) => {
            return { name: item.name, label: item.label };  // Correct syntax
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


  formFieldsGroup: FormGroup;

  

  selectedForms: string[] = [];
  operators = ['=', '!=', '<', '>', '<=', '>='];


 
   // Default Column Definitions
   defaultColDef: ColDef = {
     sortable: true,
     filter: true,
     resizable: true,
     flex: 1
   };
   
 
 
   // Grid Ready Event
   onGridReady(params: GridReadyEvent) {
     this.gridApi = params.api;
   }
 
   // Function to get selected rows
   getSelectedRows() {
     const selectedNodes = this.gridApi.getSelectedNodes();
     const selectedData = selectedNodes.map(node => node.data);
     console.log('Selected Rows:', selectedData);  // log selected rows or perform any other operation
   }






  async buildConditionString(conditions:any) {
    let conditionString = '';
  
    conditions.forEach((condition: { operator: any; condition: any; value: any; operatorBetween: any; }, index: number) => {
      const operator = condition.operator;
      const formattedCondition = `\${${condition.condition}} ${operator} '${condition.value}'`;
  
      // Append the current condition to the final string
      conditionString += formattedCondition;
  
      // Add the logical operator between conditions (if not the last one)
      if (index !== conditions.length - 1) {
        const logicalOperator = condition.operatorBetween ? condition.operatorBetween : '';
        conditionString += ` ${logicalOperator} `;
      }
    });
  
    return conditionString;
  }


   async onSubmit() {

    let body: any;
    this.tableData = [];  // Clear previous data
  
    this.spinner.show();
  
    // Check if the date type is 'between' or 'between time'
    if (['between', 'between time'].includes(this.reportsFeilds.get('dateType')?.value)) {
      const startEpoch = new Date(this.reportsFeilds.get('startDate')?.value).getTime();
      const endEpoch = new Date(this.reportsFeilds.get('endDate')?.value).getTime();


      if (startEpoch >=  endEpoch) {
         // Display error message if invalid
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
    // Check if the date type is 'is', '>=', or '<='
    else if (['is', '>=', '<='].includes(this.reportsFeilds.get('dateType')?.value)) {
      const singleEpoch = new Date(this.reportsFeilds.get('singleDate')?.value).getTime();
      body = { 
        dateType: this.reportsFeilds.get('dateType')?.value,
        clientID: this.SK_clientID,
        conditionValue: singleEpoch
      };
    }
    // Default case (daysAgo)
    else {
      body = { 
        dateType: this.reportsFeilds.get('dateType')?.value,
        clientID: this.SK_clientID,
        conditionValue: this.reportsFeilds.get('daysAgo')?.value
      };
    }
  
    // Get the selected form filters
    const tempArray = this.reportsFeilds.get('form_permission')?.value;

    this.onSubmitFlag = true
  
    // Grouping data by formFilter
    const groupedData: { [key: string]: any[] } = {};
  
    for (let item of tempArray) {
      const formFilter = item;
  
      if (body) {
        body.formFilter = item;
      }
  
      console.log("Request body is here ", body);
  
      try {
        // Use firstValueFrom to convert Observable to Promise
        const response = await this.scheduleAPI.sendData(body);
        console.log('Response from Lambda:', response);
  
        // Add response to the grouped data
        if (!groupedData[formFilter]) {
          groupedData[formFilter] = [];
        }
        groupedData[formFilter].push( response );
      } catch (error) {
        console.error('Error calling dynamic lambda:', error);
        this.spinner.hide();
      }
    }
  
    // Hide spinner after the loop
    this.spinner.hide();
    console.log("Data to be populated on Table is ", groupedData);
  
    // Prepare data for ag-Grid after grouping
    await this.prepareData(groupedData);
  }
  

  async prepareData(groupedData: { [key: string]: any[] }) {
    const tableDataWithFormFilters = [];

    const formConditions = this.formFieldsGroup.value.forms
  
    let index = 0;
    // Iterate through each formFilter and prepare data for each table
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


      //Conditional filter code is here 
      if(this.conditionflag){
        let tempArray = []
        const conditionalString =  await this.buildConditionString(formConditions[index].conditions)
        for(let data of tempMetaArray){

          console.log("Data before eval is here ",data);

          if(await this.evaluateTemplate(conditionalString,data) == true){
            tempArray.push(data)
          }
        }
        tempMetaArray = tempArray
      }

      console.log("After filter data is here ",tempMetaArray);


      let rows = await this.mapLabels(tempMetaArray,dynamicMetadata) 
     
 
      //Assign filtered rows to metadata of responses
      responses[0].metadata = rows

     
      for(let i=0;i<rows.length;i++){
        rows[i].formFilter = formFilter
      }


      console.log("Rows are here ",rows);
      console.log("Filtered rows are here ",rows);


  
      // Push the row data for each formFilter
      tableDataWithFormFilters.push({ formFilter, rows });

      //Useing for conditional indexed based selection
      index++;
    }
  
    // Store the final table data to use in the template
    this.tableDataWithFormFilters = tableDataWithFormFilters;

    // Optionally log the rowData for debugging
    console.log("Table rows are here ",this.tableDataWithFormFilters);
    this.cd.detectChanges()
  }


  // Helper function to check if a string is Base64
isBase64(value: string): boolean {
  const regex = /^data:image\/(png|jpeg|jpg|gif|bmp);base64,/;
  return regex.test(value);
}
  
  createColumnDefs(rowData: any[]): ColDef[] {
    const columns = [];
  
    if (rowData.length > 0) {
      // Get the keys from the first row (metadata keys)
      const sampleRow = rowData[0];
  
      // Add 'formFilter' column manually
      columns.push({
        headerName: 'Form Filter',
        field: 'formFilter',
        flex: 1,
        filter: true,
        minWidth: 150,  // Add a minimum width for the formFilter column
      });
  
      // Iterate through metadata keys to create dynamic columns
      for (let key in sampleRow) {
        if (key !== 'formFilter' && key !== 'PK' && key !== 'SK') {
          // Check if the value in the row is Base64 (image data)
          const isBase64Image = this.isBase64(sampleRow[key]);

          
          columns.push({
            headerName: this.formatHeaderName(key), // Format the header name
            field: key,
            flex: 1,            // Allow the column to flex (resize relative to others)
            minWidth: 150,   
            filter: true,       // Enable filtering for this column
            sortable: true,     // Enable sorting for this column
            cellRenderer: isBase64Image ? this.imageCellRenderer : null, // Apply custom cellRenderer for Base64 images
            cellRendererParams: {
              context: this  // Pass the component context to the cell rendere
            }
          });
        }
      }
    }
  
    return columns;
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



  // This method opens the modal and passes the imageBase64 string
  openImageModal(imageBase64: string) {
    const modalRef = this.modalService.open(ImageModalComponent);
    modalRef.componentInstance.imageSrc = imageBase64;  // Pass the Base64 string to the modal component
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
    this.reportsFeilds.reset()
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
        console.log("Template is here ",template);
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
  
      metadata.forEach((field: { name: any; label: any; }) => {
        const fieldName = field.name;   
        const label = field.label;      
  
        if (mappedResponse.hasOwnProperty(fieldName)) {
          // If the field name contains 'signature', process as an image
          if (fieldName.toLowerCase().includes('signature')) {
           
          } else {
            mappedResponse[label] = mappedResponse[fieldName];
          }
          delete mappedResponse[fieldName];
        } else {
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
  
      delete mappedResponse.id;
  
      if (mappedResponse.hasOwnProperty('dynamic_table_values')) {
        delete mappedResponse.dynamic_table_values;
        // const dynamicTables = mappedResponse.dynamic_table_values;
        // Object.keys(dynamicTables).forEach(tableKey => {
        //   const dynamicTable = dynamicTables[tableKey];
  
        //   if (Array.isArray(dynamicTable) && dynamicTable.length > 0) {
        //     // Extract the headers (keys of the first object) and rows (values of the objects)
        //     const dynamicHeaders = Object.keys(dynamicTable[0]);
        //     const dynamicRows = dynamicTable.map(row =>
        //       dynamicHeaders.map(header => row[header])
        //     );
  
        //     // Structure the dynamic table
        //     mappedResponse[tableKey] = {
        //       headers: dynamicHeaders,
        //       rows: dynamicRows
        //     };
        //   }
        // });
      }
  
      return mappedResponse;
    });
  
    return mappedResponses;
  }



  saveQuery(content: TemplateRef<any>){
    //Creating packet for reports module to pass
    this.savedModulePacket = [this.reportsFeilds.value,this.formFieldsGroup.value]
    this.modalService.open(content);
    this.moduleDisplayService.showModule()
  }


  editQuery(content: TemplateRef<any>){
    //Creating packet for reports module to pass
    this.savedModulePacket = this.editSavedDataArray
    this.modalService.open(content);
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




    async deleteNM(value: any) {

      console.log("Value to be deleted is here ",value);

      const deleteData = this.original_lookup_data.filter((item:any)=>item.P1)
    
        let temp = {
          PK: this.SK_clientID+"#savedquery#"+value+"#main",
          SK: 1
        }
  
        var item = deleteData[0]
        

        console.log("Deleted items is ",item);
        console.log("deleted temp is here ",temp);
        

            try{
            
            // await this.api.DeleteMaster(temp).then(async value => {
            //   await this.fetchTimeMachineById(1, value, 'delete', item)


            //   this.reloadEvent.next(true)

            //   // return Swal.fire({
            //   //   title: 'Saved Query Deleted Successfully!',
            //   //   text: 'The saved query has been successfully removed from the system.',
            //   //   icon: 'success',  // You can change this to 'error' or 'warning' depending on the context
            //   //   background: 'red',  // Green background to indicate success
            //   // });
            // })
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
              const newData = [];
            
              // Loop through each object in the data array
              for (let i = 0; i < data.length; i++) {
                const originalKey = Object.keys(data[i])[0]; // Get the original key (e.g., L1, L2, ...)
                const newKey = `L${i + 1}`; // Generate the new key based on the current index
            
                // Check if the original key exists before renaming
                if (originalKey) {
                  // Create a new object with the new key and the data from the original object
                  const newObj = { [newKey]: data[i][originalKey] };
            
                  // Check if the new key already exists in the newData array
                  const existingIndex = newData.findIndex(obj => Object.keys(obj)[0] === newKey);
            
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
  
    async editSavedQuery(P1: any) {

      console.log("Edit si being called");

      this.spinner.show()
      if(this.modalName == 'Reports'){
        this.router.navigate(['/reportStudio'], { queryParams: { savedQuery: P1 } });
      }
      
      try{
        const result = await this.api.GetMaster(`${this.SK_clientID}#savedquery#${P1}#main`,1)

        if(result && result.metadata){
          const tempResHolder = JSON.parse(result.metadata)

          this.editSavedDataArray = tempResHolder

          console.log("Result for the edit is here ",tempResHolder);
          const reportMetadata = JSON.parse(tempResHolder.reportMetadata)
          const conditionMetadata = JSON.parse(tempResHolder.conditionMetadata).forms

          console.log("conditionMetadata is here ",conditionMetadata);

          this.reportsFeilds.patchValue({
            dateType: reportMetadata.dateType,
            singleDate: reportMetadata.singleDate,
            startDate: reportMetadata.startDate,
            endDate:reportMetadata.endDate ,
            daysAgo:reportMetadata.daysAgo ,
            form_permission:reportMetadata.form_permission , 
            filterOption:reportMetadata.filterOption ,
          })        

          this.saveButton = true
          
          if(reportMetadata.filterOption != 'all'){

            await this.onFilterChange('onCondition','')


            this.forms().clear();

            console.log("conditionMetadata - - - - -- - -- - ",conditionMetadata);
             
              conditionMetadata.forEach((formData: any) => {
                this.populateForm(formData);
              });
          }
        }
        
        this.onSubmit()
        this.spinner.hide()
        this.onSubmitFlag = false
        this.dismissModal1(this.modalRef);
     
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


    ngOnDestroy() {
      console.log('Component destroyed!');
      // Perform any cleanup here
      // e.g., unsubscribe from observables or clear any data

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
                const promises = []; // Array to hold promises for recursive calls
  
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
  
} 







