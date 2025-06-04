import { ChangeDetectorRef, Component, EventEmitter, Injector, Input, NgZone, OnInit, Output, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
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
  FormNames: any;
  dynamicIDArray: any;
  IdsFetch: string[];
  summaryIds: any;
  dashboardListRead: any[];
  dashboardList: any[];
  dashboardIdList: string[] | PromiseLike<string[]>;
  projectDetailListRead: any;
  projectDetailList: any;
  reportStudioListRead: any[];
  reportStudioDetailList: any[];
  projectListRead: any[];
  projectList: any[];
  helpherObjCalender: any;
  formListTitles: any;
  shoRowData:boolean = false
  selectedText: any;
  columnVisisbilityFields: any;
  showColumnVisibility = false;
  isSummaryDashboardSelected = false;
  selectedMiniTableFields: any;
  FormRead: any;
  readMinitableLabel: any;
  readOperation: any;
  noOfParams: any;
  listofFormValues: any;
  listofEquationParam: any[]=[];
  operationValue: any[]=[];

  formName: any[] = []; 
  filteredHeaders: any[];
  readMinitableName: any;
  userIsChanging: boolean;
  extractedTables: any[];
  filteredResults: any[];
  selectedEquationParameterValue: any=[];
  paramCount: any;
  SelectTypeSummary = [
    { value: 'NewTab', text: 'New Tab' },
    { value: 'Modal', text: 'Modal(Pop Up)' },
    { value: 'Same page Redirect', text: 'Same Page Redirect' },
    { value: 'drill down', text: 'Drill Down' },
  ];

  filteredSelectTypeSummary = [...this.SelectTypeSummary]; 
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
    this.dynamicDataEquation()

  this.createKPIWidget2.get('selectType')?.valueChanges.subscribe(value => {
    this.showColumnVisibility = value === 'drill down';
  });
  }

  selectedOperationMini(readOperation:any){
    console.log('readOperation',readOperation)
    this.readOperation = readOperation[0].value
  
  }
  selectFormParams1(event: any[], index: number): void {
    console.log('Event checking from equa', event);
  
    // Validate the event structure more rigorously
    if (Array.isArray(event) && event.length > 0) {
      event.forEach((entry, idx) => {
        // Check each entry for the expected structure and data
        if (entry && entry.data && typeof entry.data.text === 'string') {
          const selectedTexteqa = entry.data.text; // Extract the form name, such as "Work Order"
          console.log(`Selected Form Text from Equation at index ${idx}:`, selectedTexteqa);
          this.updateFormName(selectedTexteqa, index);
       
  
          // Call the fetch function with the selected text and corresponding index
          this.fetchDynamicFormDataEquation(selectedTexteqa, index);
        } else {
          // Log a warning if any entry is not in the expected format, include the entry index for reference
          console.warn(`Entry at index ${idx} is not in the expected format or missing data:`, entry);
        }
      });
    } else {
      // Log an error if the event array is empty or not an array
      console.error('Event data is not in the expected format or empty:', event);
    }
  }

  async fetchMiniTable(item: any) {
    try {
        this.extractedTables = []; // Initialize to prevent undefined errors
        this.filteredResults = []; // Initialize formatted dropdown options
  
        const resultMain: any = await this.api.GetMaster(this.SK_clientID + "#dynamic_form#" + item + "#main", 1);
        if (resultMain) {
            console.log('Forms Checking:', resultMain);
            const helpherObjmain = JSON.parse(resultMain.metadata);
            console.log('Helper Object Main:', helpherObjmain);
  
            const extractFormFields = helpherObjmain.formFields;
  
            // Ensure extractedTables is set properly
            this.extractedTables = Object.values(extractFormFields).filter((item: any) =>
                typeof item === 'object' &&
                item !== null &&
                'name' in item &&
                typeof item.name === 'string' &&
                item.name.startsWith("table-") &&
                item.validation && 
                item.validation.formName_table // Ensure `formName_table` exists inside `validation`
            );
  
            // Format extracted tables for dropdown options
            this.filteredResults = this.extractedTables.map((record: any) => ({
                value: record.validation.formName_table, // Use `formName_table` as value
                label: record.name // Use `name` as label
            }));
  
            // Add "Track Location" as an additional option
            this.filteredResults.unshift({
                value: 'trackLocation', 
                label: 'trackLocation'
            });
  
            console.log('Dropdown Options:', this.filteredResults);
        }
    } catch (err) {
        console.log("Error fetching the dynamic form data", err);
    }
  }


  checkSelectedFormPram(readForm:any){
    console.log('readForm checking',readForm)
    this.FormRead = readForm[0].value
    this.fetchMiniTable(this.FormRead)
  
  }
  async fetchMiniTableHeaders(item: any) {
    try {
        this.filteredHeaders = []; // Initialize to store formatted dropdown options
    
        // If item is "trackLocation", directly set predefined fields
        if (item === "trackLocation") {
            this.filteredHeaders = [
                { value: "Date_and_time", label: "Date_and_time" },
                { value: "label_id", label: "label_id" },
                { value: "label_name", label: "label_name" },
                { value: "type", label: "type" },
    
            ];
            console.log('Predefined Headers for Track Location:', this.filteredHeaders);
            return; // Exit function early, no need to fetch from API
        }
    
        // Otherwise, proceed with fetching data from API
        const resultHeaders: any = await this.api.GetMaster(this.SK_clientID + "#dynamic_form#" + item + "#main", 1);
    
        if (resultHeaders) {
            console.log('Forms Checking:', resultHeaders);
            const helpherObjmainHeaders = JSON.parse(resultHeaders.metadata);
            console.log('Helper Object Main Headers:', helpherObjmainHeaders);
    
            const extractFormFields = helpherObjmainHeaders.formFields;
    
            // Ensure extracted headers are properly formatted
            if (Array.isArray(extractFormFields)) {
                this.filteredHeaders = extractFormFields.map((record: any) => ({
                    value: record.name,  // Set the 'name' field as value
                    label: record.label  // Set the 'label' field as label
                }));
            }
    
            console.log('Formatted Headers:', this.filteredHeaders);
        }
    } catch (err) {
        console.log("Error fetching the dynamic form data", err);
    }
    }

    addEquation(): void {


      const allFieldsArray = this.createKPIWidget2.get('all_fields') as FormArray;
    console.log("allFieldsArray",allFieldsArray.value)
      // Ensure `this.operationValue` is an array before using push
      // if (!Array.isArray(this.operationValue)) {
      //   this.operationValue = [];
      // } else {
      //   this.operationValue.length = 0; // Reset array to avoid accumulation of old values
      // }
     const equationTextArea = allFieldsArray.value.map((packet: any, index: number) => {
        if(!Array.isArray(packet.EquationParam)){
          packet.EquationParam = [packet.EquationParam]
        }
          // Initialize a string to collect all parameter texts
          let tempText = packet.EquationParam.map((param:any) => `${packet.EquationFormList}.${param.text}.${param.value}`).join(',');
    
          // Return the formatted string for this group of parameters
          return `${packet.EquationOperation}(\${${tempText}})`;
      })
      .join(', ');
      // Loop through each group in the form array
      // allFieldsArray.controls.forEach((control, index) => {
      //   // Safely cast the AbstractControl to FormGroup
      //   const group = control as FormGroup;
    
      //   // Push operation value for the current group
      //   this.operationValue.push(group.get('EquationOperation')?.value || '');
      //   console.log(`Operation Value for index ${index}:`, this.operationValue);
      // });
    
    // console.log('this.operationValue', this.operationValue)
    //   let selectedParameters = this.selectedEquationParameterValue || [];
    //   selectedParameters = selectedParameters.length > 0 ? selectedParameters.filter((param: any) => param != null) : [];
    //   console.log('Selected Parameters:', selectedParameters);
    
    //   if (selectedParameters.length > 0) {
    //     const formattedParameters = selectedParameters
    //         .map((params: any[], index: number) => {
    //           if(!Array.isArray(params)){
    //             params = [params]
    //           }
    //             // Initialize a string to collect all parameter texts
    //             let tempText = params.map(param => `${this.formName[index]}.${param.text}.${param.value}`).join(',');
    
    //             // Return the formatted string for this group of parameters
    //             return `${this.operationValue[index]}(\${${tempText}})`;
    //         })
    //         .join(', ');
    
    //         console.log('formattedParameters',formattedParameters)
    
    //     // const formattedEquation = `${this.operationValue}(${formattedParameters})`;
    //     // console.log('Formatted Equation:', formattedEquation);
    
    //     this.createKPIWidget.patchValue({
    //         EquationDesc: formattedParameters,
    //     });
    // }
    //  else {
    //       console.warn('No parameters selected or invalid format:', selectedParameters);
    //       // this.createKPIWidget.patchValue({
    //       //     EquationDesc: '',
    //       // });
    //   }
    //   // Check if formName is set
    //   if (!this.formName) {
    //       console.error('Form name is not set. Cannot create equation.');
    //       return;
    //   }
      this.createKPIWidget2.patchValue({
        EquationDesc: "("+equationTextArea+")",
    });
    
      console.log('this.formName checking', this.formName);
    
    
    
      // Manually trigger change detection
      this.cdr.detectChanges();
    }
    

    EquationparameterValue(event: any, fieldIndex: any): void {
      console.log('Event check for dynamic param:', event);
      console.log('Check field index:', fieldIndex);
  
      if (event && event.value && Array.isArray(event.value)) {
          const valuesArray = event.value;
          const formattedValues = valuesArray.map((item: any) => {
              const { value, text } = item;
              return { value, text };
          });
  
          console.log(`Formatted Selected Items for index ${fieldIndex}:`, formattedValues);
          const equationParamControlName = `EquationParam${fieldIndex}`;
          const EquationParameter = this.createKPIWidget2.get(equationParamControlName);
  
          if (EquationParameter) {
              EquationParameter.setValue(formattedValues);
              this.cdr.detectChanges();
          } else {
              console.warn(`Form control not found: ${equationParamControlName}`);
          }
  
          // Ensure the array is initialized at the specific index
          if (!this.selectedEquationParameterValue) {
              this.selectedEquationParameterValue = [];
          }
  
          // Use the fieldIndex safely
          this.selectedEquationParameterValue[fieldIndex] = formattedValues.length === 1 ? formattedValues[0] : formattedValues;
      } else {
          console.warn('Invalid event structure:', event);
          this.resetEquationParameter(fieldIndex);
      }
  }


  fetchDynamicFormDataEquation(value: any, index: any) {
    console.log("Data from lookup:", value);
    console.log('Index checking', index);

    // Ensure listofEquationParam is initialized as an array
    if (!Array.isArray(this.listofEquationParam)) {
        this.listofEquationParam = [];
    }

    this.api.GetMaster(`${this.SK_clientID}#dynamic_form#${value}#main`, 1)
        .then((result: any) => {
            if (result && result.metadata) {
                try {
                    const parsedMetadata = JSON.parse(result.metadata);
                    const EquaformFields = parsedMetadata.formFields;
                    console.log('FormFields check', EquaformFields);

                    // Initialize the sub-array if it does not exist
                    this.listofEquationParam[index] = this.listofEquationParam[index] || [];

                    // Reset the list at the specified index to ensure it's clean on every fetch
                    this.listofEquationParam[index] = EquaformFields.map((field: any) => {
                        console.log('Field check', field);
                        return { value: field.name, text: field.label };
                    });

                    // Optionally include timestamps
                    ['created_time', 'updated_time'].forEach((timeKey) => {
                        if (parsedMetadata[timeKey]) {
                            this.listofEquationParam[index].push({
                                value: parsedMetadata[timeKey].toString(),
                                text: `${timeKey.replace('_', ' ').charAt(0).toUpperCase() + timeKey.slice(1).replace('_', ' ')}`
                            });
                        }
                    });

                    console.log('Transformed dynamic parameters:', this.listofEquationParam[index]);
                } catch (error) {
                    console.error("Error parsing metadata: ", error);
                    this.toast.open("Failed to parse form data", "Error", {
                        duration: 5000,
                        horizontalPosition: 'right',
                        verticalPosition: 'top',
                    });
                }
            }
        })
        .catch((err) => {
            console.error("Can't fetch form data: ", err);
            this.toast.open("Failed to fetch form data", "Error", {
                duration: 5000,
                horizontalPosition: 'right',
                verticalPosition: 'top',
            });
        })
        .finally(() => {
            // Ensure change detection happens in all cases
            this.cdr.detectChanges();
        });
}

private resetEquationParameter(fieldIndex: any): void {
  const equationParamControlName = `EquationParam${fieldIndex}`;
  const EquationParameter = this.createKPIWidget2.get(equationParamControlName);
  
  if (EquationParameter) {
      EquationParameter.setValue([]); // Reset to an empty array
  }
  this.selectedEquationParameterValue[fieldIndex] = [];
}

selectedOperation(selectedOperation: any): void {
  if (selectedOperation && selectedOperation[0]) {
    this.operationValue = selectedOperation[0].value;
    console.log('this.operationValue:', this.operationValue);

    // Synchronize with the form control
    this.createKPIWidget2.patchValue({
      EquationOperation: this.operationValue,
    });
  } else {
    console.warn('Invalid operation selected:', selectedOperation);
  }
}

  updateFormName(selectedTexteqa: string, idx: number): void {
    console.log(`Updating formName for index ${idx} with:`, selectedTexteqa);
    this.formName[idx] = selectedTexteqa;  // Update the component level formName variable
    console.log('this.formName',this.formName)
    // this.indexwiseOperationValue[idx] = this.operationValue
   
    
    // Additional logic if you need to do something with this new form name
}


miniTableNames(readMinitableName:any){
  console.log('readMinitableName',readMinitableName)
  this.readMinitableName = readMinitableName[0].value
  this.readMinitableLabel = readMinitableName[0].data.label
  console.log('this.readMinitableLabel',this.readMinitableLabel)
  
  this.fetchMiniTableHeaders(this.readMinitableName)
  
  }


  setUserSatus(){
    this.userIsChanging = true
    this.cdr.detectChanges()
  }
onSelectTypeChange() {
  const selectedType = this.createKPIWidget2.get('selectType')?.value;
  this.showColumnVisibility = selectedType === 'drill down';
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
    const defaultTheme = { color: "linear-gradient(to right, #A1045A, #A1045A)", selected: true };
    this.selectedColor = defaultTheme.color;
    this.createKPIWidget2 = this.fb.group({
            add_fields:[''],
            all_fields:new FormArray([]),
      'formlist': ['', Validators.required],
      'parameterName': ['', Validators.required],
 
      'primaryValue': ['', Validators.required],
      'groupByFormat': ['', Validators.required],
      'constantValue': [''],
      'secondaryValue': ['', Validators.required],
      'secondaryValueNested': ['', Validators.required],
      widgetid: [this.generateUniqueId()],
      'processed_value': [''],
      'processed_value1': [''],
      'processed_value2': [''],
      // selectedColor: [this.selectedColor]'
      'themeColor': [this.selectedColor, Validators.required],
      fontSize: [20, [Validators.required, Validators.min(8), Validators.max(72)]], // Default to 14px
      fontColor: ['#000000', Validators.required], 
      dashboardIds:[''],
      selectType:[''],
      filterParameter:[''],
      filterDescription:[''],
      selectedRangeType:[''],
      custom_Label:['',Validators.required],
      formatType:['',Validators.required],
      columnVisibility:[[]],
      ModuleNames:[''],
      selectFromTime:[''],
      selectToTime:[''],
      EquationDesc:[''],
      minitableEquation:[''],
      miniForm:[''],
      MiniTableNames:[''],
      MiniTableFields:[''],
  
      EquationOperationMini:[''],
 

  

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
       columnVisibility:this.createKPIWidget2.value.columnVisibility,

       rowData:this.createKPIWidget2.value.rowData || '',
       ModuleNames:this.createKPIWidget2.value.ModuleNames,
       selectFromTime: this.createKPIWidget2.value.selectFromTime ||'',
       selectToTime: this.createKPIWidget2.value.selectToTime ||'',
       formatType: this.createKPIWidget2.value.formatType,
       equation: this.createKPIWidget2.value.all_fields || [], 
       noOfParams: this.noOfParams || 0,
       miniForm:this.createKPIWidget2.value.miniForm || '',
       MiniTableNames:this.createKPIWidget2.value.MiniTableNames ||'',
       MiniTableFields:this.createKPIWidget2.value.MiniTableFields ,
       minitableEquation:this.createKPIWidget2.value.minitableEquation,
       EquationOperationMini:this.createKPIWidget2.value.EquationOperationMini,
       fontSizeValue:`${this.createKPIWidget2.value.fontSizeValue}px`,
       fontColorValue:this.createKPIWidget2.value.fontColorValue ||'#ebeaea',
       FontTypeValue:this.createKPIWidget2.value.FontTypeValue ||'',
       FontTypeLabel:this.createKPIWidget2.value.FontTypeLabel ||'',
       EquationDesc: this.createKPIWidget2.value.EquationDesc ||'',
  
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
      const currentTile = this.dashboard[this.editTileIndex2];
      console.log('Current Tile Details Before Update:', currentTile);
  
      let multiValueRaw = currentTile.multi_value || [];
      let multiValue = typeof multiValueRaw === 'string' ? JSON.parse(multiValueRaw) : multiValueRaw;
      console.log('Parsed multiValue from tile2:', multiValue);
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
        selectFromTime: this.createKPIWidget2.value.selectFromTime ||'',
        selectToTime: this.createKPIWidget2.value.selectToTime ||'',
        dashboardIds: this.createKPIWidget2.value.dashboardIds ||'',
        selectType: this.createKPIWidget2.value.selectType ||'',
        filterParameter: this.createKPIWidget2.value.filterParameter ||'',
        filterDescription: this.createKPIWidget2.value.filterDescription ||'',
        parameterNameRead: this.parameterNameRead ||'',
        custom_Label:this.createKPIWidget2.value.custom_Label ||'',
        ModuleNames:this.createKPIWidget2.value.ModuleNames||'',
        columnVisibility:this.createKPIWidget2.value.columnVisibility ||'',
        formatType: this.createKPIWidget2.value.formatType,
        miniForm: this.createKPIWidget2.value.miniForm || '',
        MiniTableNames: this.createKPIWidget2.value.MiniTableNames || '',
        MiniTableFields: this.createKPIWidget2.value.MiniTableFields || '',
        minitableEquation: this.createKPIWidget2.value.minitableEquation || '',
        EquationOperationMini: this.createKPIWidget2.value.EquationOperationMini || '',
        
  


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
    // { value: 'Count Dynamic', text: 'Count Dynamic' },
    // { value: 'Count MultiplePram', text: 'Count Multiple Parameter' },
    // { value: 'Sum MultiplePram', text: 'Sum Multiple Parameter' },
    // { value: 'Average Multiple Parameter', text: 'Average Multiple Parameter' },
    { value: 'sumArray', text: 'SumArray' },
    { value: 'Advance Equation', text: 'Advance Equation' },
    {value:'Avg_Utilization_wise_multiple',text:'Avg_Utilization_wise_multiple'}

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
          this.listofDynamicParam = formFields
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




  onColorChange2(event: Event) {
    const colorInput = event.target as HTMLInputElement;
    this.createKPIWidget2.get('themeColor')?.setValue(colorInput.value)

    console.log('Color changed:', this.createKPIWidget2.get('themeColor')?.value);
  }
  onValueChange2(selectedValue: any): void {
    // Handle any logic here if needed when the value changes
    console.log(selectedValue); // Optional: log the selected value
  }
  toggleCheckbox(theme: any): void {
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
    {color:"linear-gradient(45deg, #FC466B 0%, #3F5EFB 100%)",selected:false},
    {color:"linear-gradient(45deg, #833ab4 0%, #fd1d1d 100%)",selected:false},
    {color:"linear-gradient(45deg, #16BFFD 0%, #CB3066 100%)",selected:false},
    {color:"linear-gradient(45deg, #48c6ef 0%, #6f86d6 100%)",selected:false},
    {color:"linear-gradient(45deg, #ff758c 0%, #ff7eb3 100%)",selected:false},
    {color:"linear-gradient(45deg, #a80077 0%, #66ff00 100%)",selected:false},
    {color:"linear-gradient(45deg, #6441a5 0%, #2a0845 100%)",selected:false},
    {color:"linear-gradient(45deg, #fc5c7d 0%, #6a82fb 100%)",selected:false},
    {color:"linear-gradient(45deg, #ff9a9e 0%, #fecfef 99%, #fecfef 100%)",selected:false},
    {color:"linear-gradient(45deg, #2C3E50 0%, #FD746C 100%)",selected:false},
    {color:"linear-gradient(45deg, #abbaab 0%, #ffffff 100%)",selected:false},
    { color: "linear-gradient(45deg, #283c86 0%, #45a247 100%)", selected: false }, // Deep Sea
    { color: "linear-gradient(45deg, #16222a 0%, #3a6073 100%)", selected: false }, // Dark Ocean
    { color: "linear-gradient(45deg, #3D3393 0%, #2D2560 100%)", selected: false }, // Royal Blue
    { color: "linear-gradient(45deg, #000000 0%, #0d324d 100%)", selected: false }, // Midnight Black
    { color: "linear-gradient(45deg, #0575E6 0%, #021B79 100%)", selected: false }, // Deep Blue
    { color: "linear-gradient(45deg, #2C5364 0%, #203A43 100%)", selected: false }, // Emerald Green
    { color: "linear-gradient(45deg, #833ab4 0%, #fd1d1d 100%)", selected: false }, // Purple Red
    { color: "linear-gradient(45deg, #000000 0%, #434343 100%)", selected: false }, // Dark Grey
    { color: "linear-gradient(45deg, #004e92 0%, #000000 100%)", selected: false },
    { color: "linear-gradient(43deg, #4158D0 0%, #C850C0 46%, #FFCC70 100%)", selected: false }, // Blue Purple Yellow
    { color: "linear-gradient(132deg, #F4D03F 0%, #16A085 100%)", selected: false }, // Golden Green
    { color: "linear-gradient(0deg, #08AEEA 0%, #2AF598 100%)", selected: false }, // Ocean Green
    { color: "linear-gradient(147deg, #FFE53B 0%, #FF2525 74%)", selected: false }, // Sunset Red
    { color: "linear-gradient(180deg, #52ACFF 25%, #FFE32C 100%)", selected: false }, // Sky Blue Yellow
    { color: "linear-gradient(45deg, #EE7752 0%, #E73C7E 100%)", selected: false }, // Sunset Orange
    { color: "linear-gradient(45deg, #FFA7A7 0%, #FFD4A2 100%)", selected: false }, // Peachy Pink
    { color: "linear-gradient(45deg, #fc00ff 0%, #00dbde 100%)", selected: false }, // Electric Purple
    { color: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", selected: false }, // Twilight Purple
    { color: "linear-gradient(45deg, #d4145a 0%, #fbb03b 100%)", selected: false }, // Cherry Peach
    { color: "linear-gradient(45deg, #ff9a9e 0%, #fad0c4 99%, #fad0c4 100%)", selected: false }, // Cotton Candy
    { color: "linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%)", selected: false }, // Blue Sky
    { color: "linear-gradient(120deg, #fdfbfb 0%, #ebedee 100%)", selected: false }, // Ice White
    { color: "linear-gradient(120deg, #e0c3fc 0%, #8ec5fc 100%)", selected: false }, // Lavender Blue
    { color: "linear-gradient(120deg, #f6d365 0%, #fda085 100%)", selected: false }, // Peachy Yellow
    { color: "linear-gradient(120deg, #89f7fe 0%, #66a6ff 100%)", selected: false }, // Azure Blue
    { color: "linear-gradient(120deg, #abecd6 0%, #fbed96 100%)", selected: false }, // Pastel Green Yellow
    { color: "linear-gradient(120deg, #f6d365 0%, #fda085 100%)", selected: false }, // Sunrise Yellow
    { color: "linear-gradient(120deg, #fccb90 0%, #d57eeb 100%)", selected: false }, // Apricot Purple
    { color: "linear-gradient(120deg, #f093fb 0%, #f5576c 100%)", selected: false }, 
    { color: "transparent", selected: false }, // Transparent
    { color: "linear-gradient(315deg, #990000 0%, #ff0000 74%)", selected: false }, // Red
    { color: "linear-gradient(315deg, #378b29 0%, #74d680 74%)", selected: false }, // Green
    { color: "linear-gradient(316deg, #3e187a 0%, #994ecc 74%)", selected: false }, // Purple
    { color: "linear-gradient(315deg, #f9ff60 0%, #e0c300 74%)", selected: false }, // Yellow
    { color: "linear-gradient(315deg, #182b3a 0%, #20a4f3 74%)", selected: false },
    { color: "linear-gradient(315deg, #ff8000 0%, #ffcc00 74%)", selected: false }, // Orange
    { color: "linear-gradient(315deg, #550022 0%, #aa0044 74%)", selected: false }, // Magenta
    { color: "linear-gradient(315deg, #0073e6 0%, #00d8e6 74%)", selected: false }, // Cyan
    { color: "linear-gradient(315deg, #660066 0%, #cc00cc 74%)", selected: false }, // Violet
    { color: "linear-gradient(315deg, #cc0033 0%, #ff0066 74%)", selected: false }, // Pink
    { color: "linear-gradient(315deg, #663300 0%, #996633 74%)", selected: false }, // Brown
    { color: "linear-gradient(315deg, #006600 0%, #00cc00 74%)", selected: false }, // Lime
    { color: "linear-gradient(315deg, #003366 0%, #0066cc 74%)", selected: false }, // Indigo
    { color: "linear-gradient(315deg, #666600 0%, #cccc00 74%)", selected: false }, // Olive
    { color: "linear-gradient(315deg, #660000 0%, #cc0000 74%)", selected: false }, // Maroon
    { color: "linear-gradient(315deg, #ff0080 0%, #ff80bf 74%)", selected: false }, // Fuchsia
    { color: "linear-gradient(315deg, #004080 0%, #007acc 74%)", selected: false }, // Sapphire
    { color: "linear-gradient(315deg, #800040 0%, #cc0073 74%)", selected: false }, // Ruby
    { color: "linear-gradient(315deg, #ffcc99 0%, #ff9966 74%)", selected: false }, // Apricot
    { color: "linear-gradient(315deg, #00cc99 0%, #33ffcc 74%)", selected: false }, // Turquoise
    { color: "linear-gradient(315deg, #ff6600 0%, #ff9933 74%)", selected: false }, // Tangerine
    { color: "linear-gradient(315deg, #333300 0%, #666600 74%)", selected: false }, // Olive Green
    { color: "linear-gradient(315deg, #800000 0%, #cc3333 74%)", selected: false }, // Brick Red
    { color: "linear-gradient(315deg, #330033 0%, #660066 74%)", selected: false }, // Plum
    { color: "linear-gradient(315deg, #006666 0%, #00cccc 74%)", selected: false }, // Teal
                  
                       
                      
                    
                  
                      
                   
                     
           
                   
  
  
    // { color: "linear-gradient(to right, #707070, #707070)", selected: false },
  
  
  
    
  
  
    
  
  
  
  
    
  
  
    
    
  
  
    
    
  
    
  ];
  

edit_Tile3(tile?: any, index?: number) {
    console.log('tile checking',tile)
    if (tile) {
      this.selectedTile = tile;
      this.editTileIndex2 = index !== undefined ? index : null; // Store the index, default to null if undefined
      console.log('Tile Object:', tile); // Log the tile object

      // Parse multi_value if it's a string
      let parsedMultiValue = [];
      this.cd.detectChanges();
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
      let parsedEquationParam = [];
      if (typeof tile.EquationParam === 'string') {
        try {
          parsedEquationParam = JSON.parse(tile.EquationParam);
        } catch (error) {
          console.error('Error parsing EquationParam:', error);
        }
      } else if (Array.isArray(tile.EquationParam)) {
        parsedEquationParam = tile.EquationParam;
      }
      let parsedMiniTableFields = [];
      if (typeof tile.MiniTableFields === 'string') {
        try {
          parsedMiniTableFields = JSON.parse(tile.MiniTableFields);
          console.log('Parsed filterParameter1:', parsedMiniTableFields);
        } catch (error) {
          console.error('Error parsing filterParameter1:', error);
        }
      } else {
        parsedMiniTableFields = tile.MiniTableFields;
      }
      this.paramCount = tile.noOfParams;

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
      this.isEditMode = true;
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
        custom_Label:tile.custom_Label,
        ModuleNames:tile.ModuleNames,
        columnVisibility: parsedColumnVisibility,
        formatType: tile.formatType,      
        selectFromTime: tile.selectFromTime,
        selectToTime: tile.selectToTime,
        add_fields: this.paramCount,
        EquationFormList: tile.EquationFormList,
        EquationParam: parsedEquationParam, // Set parsed EquationParam
        EquationOperation: tile.EquationOperation,
        EquationDesc: tile.EquationDesc,
     
        miniForm:tile.miniForm || '',
        MiniTableNames:tile.MiniTableNames ||'',
        MiniTableFields:parsedMiniTableFields ,
        minitableEquation:tile.minitableEquation,
        EquationOperationMini:tile.EquationOperationMini,



   
        all_fields: this.repopulate_fields(tile),

      });

   // Set to edit mode
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
      if (typeof getValues.equation === 'string') {
        parsedChartConfig = JSON.parse(getValues.equation || '[]');
      } else if (Array.isArray(getValues.equation)) {
        parsedChartConfig = getValues.equation;
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
  
        // Handle EquationFormList as a string
        const EquationFormListValue = typeof configItem.EquationFormList === 'string' 
          ? configItem.EquationFormList 
          : '';
  
        // Handle EquationParam as an array
        const filterParameter1Value = Array.isArray(configItem.EquationParam)
          ? configItem.EquationParam
          : [];
  
        // Handle EquationOperation as a string
        const EquationOperationValue = typeof configItem.EquationOperation === 'string'
          ? configItem.EquationOperation
          : '';
  
        // Create and push FormGroup into FormArray
        this.all_fields.push(
          this.fb.group({
            EquationFormList: this.fb.control(EquationFormListValue), // String handling
            EquationOperation: this.fb.control(EquationOperationValue), // String handling
            EquationParam: this.fb.control(filterParameter1Value), // Array handling
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
  
  onAdd(): void {
    // Get existing text from filterDescription
    let existingText = this.createKPIWidget2.get('filterDescription')?.value?.trim() || '';
    const getFormFelds = this.createKPIWidget2.get('filterParameter')?.value;
    console.log('getFormFelds checking', getFormFelds);
  
    // Capture the selected parameters
    const selectedParameters = this.selectedParameterValue;
    console.log('selectedParameters checking', selectedParameters);
  
    let newEquationParts: string[] = [];
  
    if (Array.isArray(selectedParameters)) {
      // Format the selected parameters and filter out already existing ones
      newEquationParts = selectedParameters
        .map(param => `${param.text}-\${${param.value}}`)
        .filter(paramString => !existingText.includes(paramString));
    } else if (selectedParameters) {
      let paramString = `${selectedParameters.text}-\${${selectedParameters.value}}`;
      if (!existingText.includes(paramString)) {
        newEquationParts.push(paramString);
      }
    } else {
      console.warn('No parameters selected or invalid format:', selectedParameters);
      return; // No update needed
    }
  
    if (newEquationParts.length === 0) {
      console.log('No new unique parameters to add.');
      return; // Nothing new to add
    }
  
    // Trim and remove extra spaces from the existing text
    existingText = existingText.replace(/\s+/g, ' ').trim();
    console.log('existingText before', existingText);
    console.log('Filtered newEquationParts:', newEquationParts);
  
    // Construct the new equation string
    const newEquation = newEquationParts.join(' && ');
  
    // Append new equation to existing text properly
    existingText = existingText ? `${existingText} && ${newEquation}` : newEquation;
  
    // Ensure we don't have redundant `&&`
    existingText = existingText.replace(/&&\s*&&/g, '&&').trim();
  
    console.log('Updated Equation:', existingText);
  
    // Update the form control with the corrected equation
    this.createKPIWidget2.patchValue({
      filterDescription: existingText,
    });
  
    // Ensure UI updates properly
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
  openModalCalender() {
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

  selectValue(value: string, modal: any) {
    console.log('Selected value:', value);

    // Set the value to the form control
    this.groupByFormatControl.setValue(value);

    // Close the modal after selection
    this.closeModal(modal);
  }

  get groupByFormatControl(): FormControl {
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
      item => item.value !== 'Modal' && item.value !== 'drill down'
    );
  
    // Clear "Modal" if it was previously selected
    const currentType = this.createKPIWidget2.get('selectType')?.value;
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

  const selectedModule = this.createKPIWidget2.get('ModuleNames')?.value

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
        // this.columnVisisbilityFields = formFields.map((field: any) => {
        //   console.log('field check',field)
        //   return {
        //     value: field.name,
        //     text: field.label
        //   };
        // });

        this.columnVisisbilityFields = formFields
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
  if (this.createKPIWidget2.invalid) {
    // ✅ Mark all fields as touched to trigger validation messages
    Object.values(this.createKPIWidget2.controls).forEach(control => {
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
  this.addTile('tile3');
  this.modal.dismiss();
}



validateAndUpdate() {
  if (this.createKPIWidget2.invalid) {
    // ✅ Mark all fields as touched to trigger validation messages
    Object.values(this.createKPIWidget2.controls).forEach(control => {
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
  this.updateTile2('tile');
  this.modal.dismiss();
}

addControls(event: any, _type: string) {
  console.log('event check', event);

  let noOfParams: any = '';

  if (_type === 'html' && event && event.target) {
    const inputValue = event.target.value;
    if (inputValue.trim() === '') {
      return this.toast.open("Empty input is not allowed", "Check again", {
        duration: 5000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
      });
    }

    if (Number(inputValue) < 0) {
      return this.toast.open("Negative values are not allowed", "Check again", {
        duration: 5000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
      });
    }

    try {
      noOfParams = JSON.parse(inputValue);
      if (typeof noOfParams !== 'number') {
        throw new Error('Not a number'); // Ensure it's a number since you're comparing with length later
      }
    } catch (e) {
      return this.toast.open("Invalid input: Not a valid number", "Check again", {
        duration: 5000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
      });
    }
  } else if (_type === 'ts') {
    if (event < 0) {
      return this.toast.open("Negative values not allowed", "Check again", {
        duration: 5000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
      });
    }
    noOfParams = event;
  }

  console.log('noOfParams check', noOfParams);

  // Update all_fields based on noOfParams
  if (this.createKPIWidget2.value.all_fields.length < noOfParams) {
    for (let i = this.all_fields.length; i < noOfParams; i++) {
      this.all_fields.push(
        this.fb.group({
          EquationFormList: [''],
          EquationParam: [[]],
          EquationOperation: [''],
        })
      );
      console.log('this.all_fields check', this.all_fields);
    }
  } else {
    if (noOfParams !== "" && noOfParams !== undefined && noOfParams !== null) {
      for (let i = this.all_fields.length - 1; i >= noOfParams; i--) {
        this.all_fields.removeAt(i);
      }
    }
  }

  // Update noOfParams for use in addTile
  this.noOfParams = noOfParams;
}

  get all_fields(): FormArray {
    return this.createKPIWidget2.get('all_fields') as FormArray;
  }



  async dynamicDataEquation() {
    // Fetching data based on index if needed
    try {
      const result: any = await this.api.GetMaster(this.SK_clientID + "#dynamic_form#lookup", 1);
      if (result) {
        const helperObj = JSON.parse(result.options);
        // Assuming you need to handle the data specific to an index or handle it globally
        this.formList = helperObj.map((item: any) => item[0]); 
        this.listofFormValues = this.formList.map((form: string) => ({ text: form, value: form }));
      }
    } catch (err) {
      console.error("Error fetching the dynamic form data", err);
    }
  }
miniTableFields(readFields:any){
  console.log('readFields',readFields)
  if (readFields && readFields.value && Array.isArray(readFields.value)) {
    // Extract all 'value' properties from the selected items
    const selectedValues = readFields.value.map((item: any) => item.value);

    console.log('Extracted Values:', selectedValues);
    
    // Store the extracted values in a variable
    this.selectedMiniTableFields = selectedValues;
}
}
AddMiniTableEquation() {
  console.log('this.FormRead check:', this.FormRead);
  console.log('this.readMinitableLabel check:', this.readMinitableLabel);
  // console.log('this.selectedMiniTableFields check:', this.selectedMiniTableFields);
  console.log('this.readOperation checking:', this.readOperation);
  const miniTableFieldsValue = this.createKPIWidget2.get('MiniTableFields')?.value;
console.log('Retrieved MiniTableFields from Form:', miniTableFieldsValue);
if (Array.isArray(miniTableFieldsValue)) {
  // Extract the 'value' from each object
  const extractedValues = miniTableFieldsValue.map((field: any) => field.value);
  console.log('Extracted Values:', extractedValues);

  // Store in a variable
  this.selectedMiniTableFields = extractedValues;
} else {
  console.log('MiniTableFields is not an array or is empty.');
}


  // Ensure all values are defined before constructing the equation
  if (this.FormRead && this.readMinitableLabel && Array.isArray(this.selectedMiniTableFields)) {
      let equation = '';

      if (this.readMinitableLabel === "trackLocation") {
          // Remove "dynamic_table_values" for trackLocation
          equation = this.selectedMiniTableFields
              .map((field: string) => `\${${this.FormRead}.${this.readMinitableLabel}.${field}}`)
              .join(',');
      } else {
          // Keep "dynamic_table_values" for other cases
          equation = this.selectedMiniTableFields
              .map((field: string) => `\${${this.FormRead}.dynamic_table_values.${this.readMinitableLabel}.${field}}`)
              .join(',');
      }

      // If an operation is provided, prepend it
      if (this.readOperation && this.readOperation.trim() !== '') {
          equation = `${this.readOperation}(${equation})`;
      }

      console.log('Generated Equation:', equation);

      // Store the equation in the Angular form control
      this.createKPIWidget2.controls['minitableEquation'].setValue("("+equation+")");
  } else {
      console.log('Error: One or more required values are missing.');
  }
}
}
