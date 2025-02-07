import { ChangeDetectorRef, Component, EventEmitter, Injector, Input, NgZone, OnInit, Output, QueryList, SimpleChanges, ViewChildren } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AgGridAngular } from 'ag-grid-angular';
import { NgxSpinnerService } from 'ngx-spinner';
import { catchError, from, map, Observable, of, shareReplay, Subject, take, takeUntil } from 'rxjs';
import { APIService } from 'src/app/API.service';
import { LocationPermissionService } from 'src/app/location-permission.service';
import { SharedService } from 'src/app/pages/shared.service';
interface Field {
  name: string; // Add the 'name' property
  label: string;
  options?: string[];
  formName: string;
}


@Component({
  selector: 'app-filter-tile-config',

  templateUrl: './filter-tile-config.component.html',
  styleUrl: './filter-tile-config.component.scss'
})

export class FilterTileConfigComponent implements OnInit{
  
  createChart:FormGroup

  globalFieldData: any[] = []
  private widgetIdCounter = 0;
  selectedColor: string = '#66C7B7'; // Default to the first color
  @Input() dashboard: any;
  selectedTabset: string = 'dataTab';
  selectedTile: any;
  editTileIndex: number | null;
  isEditMode: boolean;
  ranges: any;
  reloadEvent: any;
  isHovered: boolean = false;
  @Output() dashboardChange = new EventEmitter<any[]>();
  @Output() update_PowerBoard_config =  new EventEmitter<any>();
  @Input() modal :any
  @Input()  all_Packet_store: any;
  @Output() send_all_Packet_store = new EventEmitter<any[]>();
  @Output() refreshData = new EventEmitter<any>();
  getLoggedUser: any;
  SK_clientID: string;
  formList: any;
  listofDeviceIds: any;
  listofDynamicParam: any;
makeTrueCheck:any = false
  showIdField = false;
  dropsDown = 'down';
  opensCenter = 'center';

  tooltip: string | null = null;
  grid_details: any;
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

  shouldShowProcessedValue: boolean = false;
  chartDatatype: FormGroup;
  calenderIndex: any;
  highchartsForm: FormGroup<{ highchartsOptionsJson: FormControl<string | null>; }>;
  noOfParams: any;
  paramCount: any;
  selectedParameterValue: any;
  selectedParamName: any;
  selectedItem: any;
  highchartsOptionsJson: string;
  chartFinalOptions: any;
  listofDynamicParamFilter: any;
  dashboardIdsList: any;
  p1ValuesSummary: any;
  filterParamevent: any;
  dynamicParamMap = new Map<number, any[]>();
  dynamicparameterLab: any;
  dynamicparameterLabMap: any;
  fields: any;
  gridDetailExtract: any;
  formlistValues: any[];
  hasAddedCondition: boolean[] = []; // Tracks the state for each field index
  conditionsFilter: any;
  parsedfilterTileConfig: any;
  showDaysAgoField: boolean;
  populateFormBuilder: any = [];
  enableParameterName :boolean = false

  private optionsCache = new Map<string, Observable<any[]>>();
  private destroy$ = new Subject<void>();

  private readonly daysAgoOptions = [
    'less than days ago',
    'more than days ago',
    'in the past',
    'days ago'
  ];
  formValueSave: any;
  lookup_data_savedQuery: any;
  original_lookup_data: any;
  listofSavedIds: any;
  username: any;
  adminAccess: boolean = false;
  resultCheck: any;
  fetchedValues: any;
  fieldlabelShow: any;
  fieldLabelsShow: any;
  userlistRead: any;
  userList: any;
  userlistCheck: any;


 
  ngOnInit() {

    this.getLoggedUser = this.summaryConfiguration.getLoggedUserDetails()
    this.SK_clientID = this.getLoggedUser.clientID;
    this.username = this.getLoggedUser.username;
    console.log('this.SK_clientID check', this.SK_clientID)
    console.log('this.getLoggedUser check', this.getLoggedUser)
    // console.log('dashboardChange ngOnInit',this.all_Packet_store)

    // this.getWorkFlowDetails = this.summaryConfiguration.getLoggedUserDetails()
    // console.log('this.getLoggedUser check',this.getWorkFlowDetails)


  
    this.initializeTileFields()

    this.dynamicData()
    this.dashboardIds(1)
    this.createChart.get('toggleCheck')?.valueChanges.subscribe((isChecked) => {
      if (isChecked) {
        this.createChart.get('dashboardIds')?.enable();
        this.createChart.get('selectType')?.enable();
      } else {
        this.createChart.get('dashboardIds')?.disable();
        this.createChart.get('selectType')?.disable();
      }
    });
    this.checkData()
   
  

    this.initializeShowDaysAgoField();
    this.createChart.get('dateType')?.valueChanges.subscribe(value => {
      this.showDaysAgoField = this.daysAgoOptions.includes(value);
    });
    this.createChart.get('dateType')?.valueChanges.subscribe(value => {
      this.onDateTypeChange(value);
    });


// this.fetchDynamic(this.formValueSave)
  }

  onDateTypeChange(value: string) {

    this.createChart.get('singleDate')?.clearValidators();
    this.createChart.get('startDate')?.clearValidators();
    this.createChart.get('endDate')?.clearValidators();
  

    const config = this.dateTypeConfig[value];

    if (config) {
      if (config.showDate) {
        this.createChart.get('singleDate')?.setValidators([Validators.required]);
      }

      if (config.showStartDate) {
        this.createChart.get('startDate')?.setValidators([Validators.required]);
      }

      if (config.showEndDate) {
        this.createChart.get('endDate')?.setValidators([Validators.required]);
      }

      if (config.showDaysAgo) {
        this.createChart.get('daysAgo')?.setValidators([Validators.required, Validators.min(1)]);
      }
    }

    this.createChart.get('singleDate')?.updateValueAndValidity();
    this.createChart.get('startDate')?.updateValueAndValidity();
    this.createChart.get('endDate')?.updateValueAndValidity();
    this.createChart.get('daysAgo')?.updateValueAndValidity();
  }
  dateTypeConfig :any= {
    'is': { showDate: true },
    '>=': { showDate: true },
    '<=': { showDate: true },
    'between': { showStartDate: true, showEndDate: true , isBetweenTime: false },
    'between time': { showStartDate: true, showEndDate: true , isBetweenTime: true },
  
  };

  ngOnChanges(changes: SimpleChanges): void {
    console.log('dashboardChange ngonchanges',this.all_Packet_store)
    this.checkData()
    // this.fetchDynamic(this.formValueSave)


  }
  ngAfterViewInit(): void {
    this.checkData()


    // this.fetchDynamic(this.formValueSave)
  }
  get dateType() {
    return this.createChart.get('dateType');
  }
  private initializeShowDaysAgoField(): void {
    const initialDateType = this.createChart.get('dateType')?.value;
    this.showDaysAgoField = this.daysAgoOptions.includes(initialDateType);
  }
  checkData() {
    this.gridDetailExtract = this.all_Packet_store.grid_details;
    console.log('this.gridDetailExtract check', this.gridDetailExtract);
  
    // Initialize the formlistValues array
    this.formlistValues = [];
  
    // Extract formlist directly from gridDetailExtract
    if (this.gridDetailExtract && Array.isArray(this.gridDetailExtract)) {
      this.formlistValues = this.gridDetailExtract.map((packet: { formlist: any }) => packet.formlist);
      console.log('this.formlistValues check', this.formlistValues);
    }
  
    // Ensure formlistValues is an empty array if not initialized
    this.formlistValues = this.formlistValues || [];
  
    // Iterate through each packet in gridDetailExtract
    if (Array.isArray(this.gridDetailExtract)) {
      this.gridDetailExtract.forEach((packet: any) => {
        // Parse and extract from chartConfig if it exists
        if (packet.chartConfig && packet.chartConfig !== "[]") {
          try {
            const parsedChartConfig = JSON.parse(packet.chartConfig);
            if (Array.isArray(parsedChartConfig)) {
              const chartConfigFormlist = parsedChartConfig.map(
                (config: { formlist: any }) => config.formlist
              );
              this.formlistValues = [...this.formlistValues, ...chartConfigFormlist];
              console.log('this.formlistValues after chartConfig extract', this.formlistValues);
            } else {
              console.warn('Parsed chartConfig is not an array:', parsedChartConfig);
            }
          } catch (error) {
            console.error('Error parsing chartConfig:', error);
          }
        }
  
        // Parse and extract from mapConfig if it exists
        if (packet.mapConfig && packet.mapConfig !== "[]") {
          try {
            const parsedMapConfig = JSON.parse(packet.mapConfig);
            if (Array.isArray(parsedMapConfig)) {
              const mapConfigFormlist = parsedMapConfig.map(
                (config: { formlist: any }) => config.formlist
              );
              this.formlistValues = [...this.formlistValues, ...mapConfigFormlist];
              console.log('this.formlistValues after mapConfig extract', this.formlistValues);
            } else {
              console.warn('Parsed mapConfig is not an array:', parsedMapConfig);
            }
          } catch (error) {
            console.error('Error parsing mapConfig:', error);
          }
        }
      });
  
      // Remove duplicates and undefined values from formlistValues
      this.formlistValues = [...new Set(this.formlistValues.filter(value => value !== undefined))];

  
      // Fetch dynamic form data for all extracted formlistValues
      this.fetchDynamicFormDataForAll(this.formlistValues);
  
      // Log the cleaned-up formlistValues
      console.log('Cleaned-up formlist values:', this.formlistValues);
    } else {
      console.warn('gridDetailExtract is not an array or is undefined.');
    }
  }
  
  

  fetchDynamicFormDataForAll(values: string[]) {
    values.forEach((value, index) => {
      this.fetchDynamicFormData(value, index);
    });
  }
  fetchDynamicFormData(value: string, index: number) {
    console.log("Fetching data for:", value);
 
    const apiUrl = `${this.SK_clientID}#dynamic_form#${value}#main`;
    this.api.GetMaster(apiUrl, 1)
      .then((result: any) => {

        if (result && result.metadata) {
          // this.resultCheck = JSON.parse(result)
          // console.log('this.resultCheck checking',this.resultCheck)
          const parsedMetadata = JSON.parse(result.metadata);
          const formFields = parsedMetadata.formFields;
          console.log('formFields checking',formFields)
  
          const dynamicParamList = formFields.map((field: any) => ({
            value: field.name,
            text: field.label,
          }));
  
          // Add created_time and updated_time if present
          if (parsedMetadata.created_time) {
            dynamicParamList.push({
              value: parsedMetadata.created_time.toString(),
              text: 'Created Time',
            });
          }
          if (parsedMetadata.updated_time) {
            dynamicParamList.push({
              value: parsedMetadata.updated_time.toString(),
              text: 'Updated Time',
            });
          }
  
          // Store the dynamicParamList in a map by index
          console.log('dynamicParamList chgecking',dynamicParamList)
          this.dynamicParamMap.set(index, dynamicParamList);
          this.cdr.detectChanges();
        } else {
          console.warn(`No metadata found for ${value}`);
        }
      })
      .catch((err) => {
        console.error(`Error fetching data for ${value}:`, err);
      });
  }
  
  

  convertTo12HourFormat(time: string): string {
    if (!time) return '';
    const [hours, minutes] = time.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const adjustedHours = hours % 12 || 12; // Convert 0 to 12 for AM times
    return `${adjustedHours}:${minutes.toString().padStart(2, '0')} ${period}`;
  }

  constructor(private summaryConfiguration: SharedService, private api: APIService, private fb: UntypedFormBuilder, private cd: ChangeDetectorRef,
    private toast: MatSnackBar, private router: Router, private modalService: NgbModal, private route: ActivatedRoute, private cdr: ChangeDetectorRef, private locationPermissionService: LocationPermissionService, private devicesList: SharedService, private injector: Injector,
    private spinner: NgxSpinnerService,private zone: NgZone
  ){

  }

  initializeTileFields(): void {
    console.log('i am initialize')
    // Initialize the form group
    this.createChart = this.fb.group({
      add_fields:['',Validators.required],
      all_fields:new FormArray([]),
  
      widgetid: [this.generateUniqueId()],
  
      themeColor: ['', Validators.required],
      fontSize: [, [Validators.required, Validators.min(8), Validators.max(72)]], // Default to 14px
      fontColor: ['', Validators.required], 
      custom_Label:['', Validators.required],
      daysAgo:[''],
      startDate:[''],
      endDate:[''],
      singleDate:[''],
      dateType:['', Validators.required],
    
      // themeColor: ['#000000', Validators.required],
  

   
  


    });

  
  }

  
  get constants() {
    return (this.createChart.get('constants') as FormArray);
  }

  // Add a new constant form control
  addConstant() {
    this.constants.push(this.fb.control('', Validators.required));
  }

  // Remove a constant form control
  removeConstant(index: number) {
    this.constants.removeAt(index);
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

  // addControls(event: any, _type: string,count:any) {
  //   // console.log('this.dynamicparameterLabMap before adding controls:', this.dynamicparameterLabMap);
  //   console.log('Event received in addControls:', event);
  
  //   let noOfParams: any = '';
  
  //   if (_type === 'html' && event && event.target) {
  //     if (event.target.value >= 0) {
  //       noOfParams = JSON.parse(event.target.value);
  //     } else {
  //       return this.toast.open("Negative values not allowed", "Check again", {
  //         duration: 5000,
  //         horizontalPosition: 'right',
  //         verticalPosition: 'top',
  //       });
  //     }
  //   } else if (_type === 'ts') {
  //     if (event >= 0) {
  //       noOfParams = event;
  //     }
  //   }
  //   console.log('noOfParams check:', noOfParams);
  
  //   // Ensure all_fields has the correct number of controls
  //   if (this.createChart.value.all_fields.length < noOfParams) {
  //     for (let i = this.all_fields.length; i < noOfParams; i++) {
  //       // Access the dynamic label for the current index
  //       // const dynamicLabel = this.dynamicparameterLabMap?.[i] || ''; // Default to empty if not found
  //       // console.log(`Index: ${i}, dynamicLabel: ${dynamicLabel}`);
  
  //       this.all_fields.push(
  //         this.fb.group({
  //           formField: ['', Validators.required],
  //           operator:['', Validators.required],
  //           filterValue:['', Validators.required],
  //           parameterName: ['', Validators.required],
  //           operatorBetween:['', Validators.required],
         
  //           custom_Label: ['', Validators.required],
  //       // Dynamically set from the map
  //         })
  //       );
  //     }
  //   } else {
  //     if (noOfParams !== "" && noOfParams !== undefined && noOfParams !== null) {
  //       for (let i = this.all_fields.length; i >= noOfParams; i--) {
  //         this.all_fields.removeAt(i);
  //       }
  //     }
  //   }
  
  //   // Update noOfParams for use in addTile
  //   this.noOfParams = noOfParams;
  // }
  async addControls(event: any, _type: string, count: number, formValue: any): Promise<void> {
    console.log('event checking for filter',event)
    console.log('checking form value',this.formlistValues)
    console.log('formValue checking', formValue);
  
    this.formValueSave = formValue;
    console.log('this.formValueSave add', this.formValueSave);
  
    // try {
    //   // Call fetchDynamic and handle the Promise
    //   this.fetchDynamic(this.formValueSave)
    //     .then((values) => {
    //       this.fetchedValues = values; // Assign the resolved values
    //       console.log('Fetched Values:', this.fetchedValues);
    //     })
    //     .catch((error) => {
    //       console.error('Error fetching values:', error);
    //     });
    // } catch (error) {
    //   console.error('Unexpected error:', error);
    // }
    
  
    // Determine checkbox state
    this.makeTrueCheck = event.target.checked;
    console.log('Checkbox State:', this.makeTrueCheck);
  
    let noOfParams = count;
  
    // Update `noOfParams` control value in the form
    const formControl = this.createChart.get('noOfParams');
    if (_type === 'html') {
      noOfParams = this.makeTrueCheck ? count : 0;
    } else if (_type === 'ts') {
      noOfParams = count;
    }
    formControl?.setValue(noOfParams);
  
    // Access the `all_fields` FormArray
    const allFieldsArray = this.createChart.get('all_fields') as FormArray;
  
    // Dynamically add or remove form groups based on `noOfParams`
    while (allFieldsArray.length < noOfParams) {
      const index = allFieldsArray.length; // Determine the current index
  
      // Add new form group to `all_fields`
      allFieldsArray.push(
        this.fb.group({
          parameterName: [formValue[index] || '', Validators.required], // Populate with `formValue`
          conditions: this.fb.array([
            this.fb.group({
              formField: ['', Validators.required],
              operator: ['', Validators.required],
              filterValue: ['', Validators.required],
              operatorBetween: ['', Validators.required],
              parameterName: [formValue[index] || '', Validators.required],
              type:['text'], // Add `parameterName` inside `conditions`
              fieldLabel:['']
            }),
          ]),
        })
      );
    }

    // Remove extra groups if the `noOfParams` is reduced
    while (allFieldsArray.length > noOfParams) {
      allFieldsArray.removeAt(allFieldsArray.length - 1);
    }
  
    console.log('Updated all_fields:', allFieldsArray.controls);
  }
  
  
  
  
  
  
  
  
  addCondition(fieldIndex: number, condition:any, formFieldControl:any): void {
    this.fetchDynamic([],this.formlistValues,fieldIndex, condition, formFieldControl);
    console.log('Final populateFormBuilder:', this.populateFormBuilder);
  
    const parentGroup = this.all_fields.controls[fieldIndex] as FormGroup;
    const conditions = parentGroup.get('conditions') as FormArray;
  
    const formName = this.formlistValues[fieldIndex];

    console.log('formName check from addCondition:', formName);
  
    if (!formName) {
      console.warn(`Form name is missing for fieldIndex ${fieldIndex}`);
      return;
    }
  
    const newConditionPush = this.fb.group({
      formField: ['', Validators.required],
      operator: ['', Validators.required],
      filterValue: ['', Validators.required],
      operatorBetween: ['', Validators.required],
      type: ['text'],
      parameterName: [formName, Validators.required],
      fieldLabel:['']

    });
  
    console.log('newCondition before push:', newConditionPush.value);
  
    // Push the new condition into the conditions array
    conditions.push(newConditionPush);
  
    console.log('Conditions after push:', conditions.value);
  

  
    const conditionIndex = conditions.length - 1;
    this.globalFieldData[fieldIndex][conditionIndex] = { type: 'text', options: null };
  
    console.log(`Condition added at fieldIndex ${fieldIndex}, conditionIndex ${conditionIndex}`);
  }
  
  
  
  
  removeCondition(fieldIndex: number, conditionIndex: number) {
    const parentGroup = this.all_fields.at(fieldIndex) as FormGroup;
    const conditions = parentGroup.get('conditions') as FormArray;
  
    // Remove the condition at the specified index
    conditions.removeAt(conditionIndex);
  
    console.log(`Condition removed from index ${fieldIndex}, condition ${conditionIndex}`);
  }
  
  

  
  
  
  

  
  
  getFormArrayControls(field: AbstractControl | null): AbstractControl[] {
    if (field) {
      const formArray = field.get('conditions') as FormArray;
      return formArray?.controls || [];
    }
    return [];
  }
  
  
  getConditions(field: AbstractControl) {
    return (field.get('conditions') as FormArray)?.controls || [];
  }

  
  
  
  
  
  
  
  
  get all_fields() {
    return this.createChart.get('all_fields') as FormArray;
  }

  generateUniqueId(): number {
    this.widgetIdCounter++;
    return Date.now() + this.widgetIdCounter; // Use timestamp and counter for uniqueness
  }
  

  addTile(key: any) {
    
    console.log('this.createChart.value.all_fields', this.createChart.value.all_fields);
    console.log('this.fieldlabelShow check', this.fieldLabelsShow);

    if (key === 'filterTile') {
        const uniqueId = this.generateUniqueId();
        console.log('this.createChart.value:', this.createChart.value); // Log form values for debugging
        this.fields = this.createChart.value.all_fields;

        // Map through fields and conditions
        this.conditionsFilter = this.fields.map((field: { conditions: any[] }, fieldIndex: number) => {
            return field.conditions.map((condition, conditionIndex) => {
                // Retrieve the correct label from fieldLabelsShow using fieldIndex and conditionIndex
                const label = this.fieldLabelsShow.get(fieldIndex)?.get(conditionIndex) || '';

                console.log(`Label for fieldIndex ${fieldIndex}, conditionIndex ${conditionIndex}:`, label);
                if (!this.globalFieldData[fieldIndex]) {
                  this.globalFieldData[fieldIndex] = {}; // Or however you need it structured
              }
              if (!this.globalFieldData[fieldIndex][conditionIndex]) {
                  this.globalFieldData[fieldIndex][conditionIndex] = {};
              }
                // Access the correct fieldData based on the fieldIndex
                const fieldData = this.globalFieldData[fieldIndex][conditionIndex];
                console.log('fieldData checking', fieldData);

                return {
                    ...condition,
                    fieldLabel: label, // Set the fieldLabel from the map
                    operatorBetween: condition.operatorBetween, // Preserve value or set default
                    type: fieldData?.type || null // Include the type for each condition or set to null if not found
                };
            });
        });

        console.log('this.conditionsFilter', this.conditionsFilter);
        console.log('this.fields check before label update', this.fields);

        const newTile = {
            id: uniqueId,
            x: 0,
            y: 0,
            rows: 13, // The number of rows in the grid
            cols: 25,
            rowHeight: 100,
            colWidth: 100,
            fixedColWidth: true,
            fixedRowHeight: true,
            grid_type: 'filterTile',
            dateType: this.createChart.value.dateType || '', // Ensure this value exists
            filterTileConfig: this.conditionsFilter, // Include conditions with type and labels
            addFieldsEnabled: this.createChart.value.add_fields,
            themeColor: this.createChart.value.themeColor,
            fontSize: `${this.createChart.value.fontSize}px`, // Added fontSize
            fontColor: this.createChart.value.fontColor,
            custom_Label: this.createChart.value.custom_Label,
            daysAgo: this.createChart.value.daysAgo,
            startDate: this.createChart.value.startDate,
            endDate: this.createChart.value.endDate,
            singleDate: this.createChart.value.singleDate,
            noOfParams: this.noOfParams || 0, // Ensure noOfParams has a valid value
        };

        console.log('New Tile Object:', newTile);

        if (!this.dashboard) {
            console.log('Initializing dashboard array');
            this.dashboard = [];
        }

        this.dashboard.push(newTile);
        console.log('Updated Dashboard:', this.dashboard);

        this.grid_details = this.dashboard;
        this.dashboardChange.emit(this.grid_details);
        this.refreshData.emit('refresh')
        if (this.grid_details) {
            this.updateSummary('', 'filter_add');
        }

        this.createChart.patchValue({
            widgetid: uniqueId,
        });
    }
}



  

  betweenoperator(event:any){
    console.log('event checking ',event)

  }
  trackByOption(index: number, option: any): any {
    return option;
  }
  
  
  onFontColorChange(event: Event): void {
    const color = (event.target as HTMLInputElement).value;
    this.createChart.patchValue({ fontColor: color });
  }
  
  updateTile(key: any) {
    console.log('key checking from update', key);
  
    if (this.editTileIndex !== null) {
      console.log('this.editTileIndex check', this.editTileIndex);
      console.log('Tile checking for update:', this.dashboard[this.editTileIndex]);
  
      // Map `all_fields` to `filterTileConfig`
      const fields = this.createChart.value.all_fields || [];
      const conditionsFilter = fields.map((field: { conditions: any[]; parameterName: string }) => {
        if (!field.conditions || !Array.isArray(field.conditions)) {
          console.error('Invalid conditions in field:', field);
          return [];
        }
  
        
        // Ensure `parameterName` and all condition fields (including filterValue) are preserved
        return field.conditions.map((condition: any) => ({
          formField: condition.formField || '',
          operator: condition.operator || '',
          filterValue: condition.filterValue || '', // Include filterValue
          operatorBetween: condition.operatorBetween || '',
          parameterName: condition.parameterName || '', // Ensure parameterName is included
          fieldLabel:condition.fieldLabel
        }));
      });
  
      console.log('Mapped conditionsFilter for update:', conditionsFilter);
  
      // Create the updated tile object
      const updatedTile = {
        ...this.dashboard[this.editTileIndex], // Retain existing properties
        fontSize: `${this.createChart.value.fontSize}px`,
        fontColor: this.createChart.value.fontColor,
        custom_Label: this.createChart.value.custom_Label,
        daysAgo: this.createChart.value.daysAgo,
        dateType: this.createChart.value.dateType || '',
        filterTileConfig: conditionsFilter, // Updated filter configuration with all condition fields
        addFieldsEnabled: this.createChart.value.add_fields || false, // Add fields toggle state
        noOfParams: this.dashboard[this.editTileIndex].noOfParams, // Retain existing parameter count
        themeColor: this.createChart.value.themeColor,
        startDate: this.createChart.value.startDate,
        endDate: this.createChart.value.endDate,
        singleDate: this.createChart.value.singleDate,
      };
  
      console.log('updatedTile checking', updatedTile);
  
      // Update the dashboard array with the modified tile
      this.dashboard = [
        ...this.dashboard.slice(0, this.editTileIndex),
        updatedTile,
        ...this.dashboard.slice(this.editTileIndex + 1),
      ];
  
      console.log('Updated Tile Details:', this.dashboard[this.editTileIndex]);
  
      // Update `grid_details` to reflect the updated tile
      this.all_Packet_store.grid_details[this.editTileIndex] = {
        ...this.all_Packet_store.grid_details[this.editTileIndex],
        ...updatedTile,
      };
  
      console.log(
        'this.all_Packet_store.grid_details[this.editTileIndex]',
        this.all_Packet_store.grid_details[this.editTileIndex]
      );
  
      // Emit the updated dashboard
      this.grid_details = this.dashboard;
      this.dashboardChange.emit(this.grid_details);
      this.refreshData.emit('refresh')
      // Trigger update summary if grid details exist
      if (this.grid_details) {
        this.updateSummary(this.all_Packet_store, 'update_Dashboard');
      }
  
      console.log('Updated all_Packet_store.grid_details:', this.all_Packet_store.grid_details);
  
      // Reset the editTileIndex after the update
      this.editTileIndex = null;
    } else {
      console.error('Edit index is null. Unable to update the tile.');
    }
  }
  
  
  
  
  toggleAddFields(event: any, tile: any) {
    tile.addFieldsEnabled = event.target.checked;
    console.log('Updated tile state:', tile);
  }
  
  

  selectedSettingsTab(tab: string) {
    this.selectedTabset = tab;
    // console.log()
  }



  duplicateTile(tile: any, index: number): void {
    // Clone the tile with its properties
    const clonedTile = {
      ...tile, // Copy all existing properties from the original tile
      id: new Date().getTime(), // Generate a unique ID
      parameterName: `${tile.parameterName}`, // Copy the parameterName as is (no "Copy" appended)
      multi_value: tile.multi_value.map((value: any) => ({ ...value })) // Deep copy of multi_value
    };
alert('cloned tile')
    // Ensure all fields are properly copied
    clonedTile.x = tile.x;
    clonedTile.y = tile.y;
    clonedTile.rows = tile.rows;
    clonedTile.cols = tile.cols;
    clonedTile.rowHeight = tile.rowHeight;
    clonedTile.colWidth = tile.colWidth;
    clonedTile.fixedColWidth = tile.fixedColWidth;
    clonedTile.fixedRowHeight = tile.fixedRowHeight;
    clonedTile.grid_type = tile.grid_type;
    clonedTile.formlist = tile.formlist;
    // clonedTile.groupBy = tile.groupBy;
    clonedTile.groupByFormat = tile.groupByFormat;
    clonedTile.predefinedSelectRange = tile.predefinedSelectRange;
    clonedTile.selectedRangeType = tile.selectedRangeType;
    // clonedTile.themeColor = tile.themeColor;

    // Add the cloned tile to the dashboard at the correct position
    this.dashboard.splice(index + 1, 0, clonedTile);

    // Log the updated dashboard for debugging
    console.log('this.dashboard after duplicating a tile:', this.dashboard);
    this.grid_details = this.dashboard;

    
    this.dashboardChange.emit(this.grid_details);

    if(this.grid_details)
      {
        alert('grid details is there')
        this.updateSummary('','add_tile')
      }

    // Trigger change detection to ensure the UI updates
    this.cdr.detectChanges();

    // Update summary to handle the addition of the duplicated tile

  }
  updateSummary(data: any, arg2: any) {
    this.update_PowerBoard_config.emit({ data, arg2 });
  }
  


themes = [
  { color: "linear-gradient(to right, #ff7e5f, #feb47b)", selected: false }, // Warm Sunset
  { color: "linear-gradient(to right, #6a11cb, #2575fc)", selected: false }, // Cool Blue-Purple
  { color: "linear-gradient(to right, #ff6a00, #ee0979)", selected: false }, // Fiery Red-Orange
  { color: "linear-gradient(to right, #36d1dc, #5b86e5)", selected: false }, // Aqua Blue
  { color: "linear-gradient(to right, #56ab2f, #a8e063)", selected: false }, // Fresh Green
  { color: "linear-gradient(to right, #ff9966, #ff5e62)", selected: false }, // Orange-Red Glow
  { color: "linear-gradient(to right, #373b44, #4286f4)", selected: false }, // Subtle Blue-Grey
  { color: "linear-gradient(to right, #8e44ad, #3498db)", selected: false }, // Vibrant Purple-Blue
  { color: "linear-gradient(to right, #fdc830, #f37335)", selected: false }, // Golden Sunburst
  { color: "linear-gradient(to right, #16a085, #f4d03f)", selected: false }, // Teal to Yellow
  { color: "linear-gradient(to right, #9cecfb, #65c7f7, #0052d4)", selected: false }, // Light to Deep Blue
  { color: "linear-gradient(to right, #00c6ff, #0072ff)", selected: false }, // Bright Blue
  { color: "linear-gradient(to right, #11998e, #38ef7d)", selected: false }, // Mint Green
  { color: "linear-gradient(to right, #ff9a9e, #fad0c4)", selected: false }, // Pink Pastel
  { color: "linear-gradient(to right, #fc5c7d, #6a82fb)", selected: false }  // Pink to Blue
];

openFilterModal(tile: any, index: number) {
  console.log('Tile checking data from openFilterModal', tile);

  console.log('this.formlistValues check', this.formlistValues);
// Ensure this fetches required data for dynamic fields


  const fontSizeValue = tile.fontSize ? parseInt(tile.fontSize.replace('px', ''), 10) : 14;

  if (tile) {
    console.log('tile object checking',tile)
    this.selectedTile = tile;
    this.editTileIndex = index !== undefined ? index : null;

    this.paramCount = tile.noOfParams || 1;

    this.parsedfilterTileConfig = JSON.parse(tile.filterTileConfig || '[]');
    console.log('this.parsedfilterTileConfig check', this.parsedfilterTileConfig);

    // Initialize the form
    this.createChart = this.fb.group({
      fontSize: fontSizeValue,
      selectType: tile.selectType,
      daysAgo: tile.daysAgo,
      fontColor: tile.fontColor || '#000000',
      add_fields: [tile.addFieldsEnabled],
      noOfParams: [{ value: tile.noOfParams, disabled: !tile.addFieldsEnabled }],
      dateType: [tile.dateType],
      toggleCheck: [tile.toggleCheck],
      all_fields: this.fb.array([]),
      custom_Label: tile.custom_Label,
      themeColor: [tile.themeColor || ''],
      startDate: tile.startDate,
      endDate: tile.endDate,
      singleDate: tile.singleDate,
    });

    const allFieldsArray = this.createChart.get('all_fields') as FormArray;

    // Populate fields and conditions from the parsed configuration
    this.parsedfilterTileConfig = JSON.parse(tile.filterTileConfig || '[]');
    console.log('this.parsedfilterTileConfig check', this.parsedfilterTileConfig);
    
    this.parsedfilterTileConfig.forEach((packet: any[], fieldIndex: number) => {
      if (!packet || !Array.isArray(packet)) {
        console.warn(`Invalid packet structure at fieldIndex ${fieldIndex}:`, packet);
        return;
      }
    
      // Map conditions within the field
      const conditionsArray = this.fb.array(
        packet.map((condition: any, conditionIndex: number) => {
          if (!condition) {
            console.warn(`Invalid condition at fieldIndex ${fieldIndex}, conditionIndex ${conditionIndex}:`, condition);
            return this.fb.group({
              formField: ['', Validators.required],
              operator: ['', Validators.required],
              filterValue: ['', Validators.required],
              operatorBetween: ['', Validators.required],
              type: [''], // Default to text type
              fieldLabel:['']
            });
          }
    
          // Safely access and dynamically assign type
          const conditionType = condition.type ; // Default to 'text' if type is not defined
          console.log('conditionType select',conditionType)
          const formName = this.formlistValues[fieldIndex];
          const formFieldControl = condition.formField || '';
    
          const newCondition = this.fb.group({
            formField: [formFieldControl, Validators.required],
            operator: [condition.operator || '', Validators.required],
            filterValue: [condition.filterValue || '', Validators.required],
            operatorBetween: [condition.operatorBetween || '', Validators.required],
            type: [conditionType], // Dynamically set type
            parameterName: [formName, Validators.required],
            fieldLabel:[condition.fieldLabel]
          });
          this.fetchDynamic([],this.formlistValues,fieldIndex, conditionIndex, formFieldControl); 
          // Dynamically fetch options and set globalFieldData
       
    
          return newCondition;
        })
      );
    
      // Create a field group with conditions
      const fieldGroup = this.fb.group({
        parameterName: [packet[0]?.parameterName || `Parameter ${fieldIndex + 1}`, Validators.required],
        conditions: conditionsArray,
      });
    
      // Add the field group to all_fields
      allFieldsArray.push(fieldGroup);
    });
    

    // Update themes based on tile configuration
    this.themes.forEach((theme) => {
      theme.selected = theme.color === tile.themeColor;
    });

    console.log('Updated themes:', this.themes);

    // Enable/disable parameter count based on add_fields toggle
    this.createChart.get('add_fields')?.valueChanges.subscribe((isEnabled) => {
      const noOfParamsControl = this.createChart.get('noOfParams');
      if (isEnabled) {
        noOfParamsControl?.enable();
      } else {
        noOfParamsControl?.disable();
      }
    });

    // Mark edit mode as true
    this.isEditMode = true;
  } else {
    // If no tile is selected, reset the form
    this.selectedTile = null;
    this.isEditMode = false;
    if (this.createChart) {
      this.createChart.reset();
    }
  }
}















preDefinedRange(preDefined:any){
  console.log('preDefined check',preDefined)

}

repopulate_fields(getValues: any) {
  let noOfParams: any = '';

  if (getValues && getValues !== null) {
    noOfParams = getValues.noOfParams;

    this.all_fields.clear();

    // Parse tileConfig
    let parsedtileConfig = [];
    try {
      if (typeof getValues.tileConfig === 'string') {
        parsedtileConfig = JSON.parse(getValues.tileConfig || '[]');
      } else {
        parsedtileConfig = Array.isArray(getValues.tileConfig) ? getValues.tileConfig : [];
      }
      console.log('Parsed tileConfig:', parsedtileConfig);
    } catch (error) {
      console.error('Error parsing tileConfig:', error);
    }

    if (parsedtileConfig.length > 0) {
      for (let i = 0; i < parsedtileConfig.length; i++) {
        console.log('parsedtileConfig checking', parsedtileConfig[i]);

        // Ensure filterParameter exists and is being read correctly
        const filterParameterValue = parsedtileConfig[i].filterParameter;
        if (filterParameterValue === undefined || filterParameterValue === null) {
          console.error(`filterParameter is missing or invalid at index ${i}`, parsedtileConfig[i]);
        }

        // Add the fields to the form group
        this.all_fields.push(this.fb.group({
          formlist: parsedtileConfig[i].formlist || '',
          parameterName: parsedtileConfig[i].parameterName || '',
          primaryValue: parsedtileConfig[i].primaryValue || '',
          groupByFormat: parsedtileConfig[i].groupByFormat || '',
          constantValue: parsedtileConfig[i].constantValue || '',
          selectedRangeType: parsedtileConfig[i].selectedRangeType || '',
          selectFromTime: parsedtileConfig[i].selectFromTime || '',
          selectToTime: parsedtileConfig[i].selectToTime || '',
          // parameterValue: parsedtileConfig[i].parameterValue || '',
          // dashboardIds: parsedtileConfig[i].dashboardIds || '',
          // selectType: parsedtileConfig[i].selectType || '',
          filterDescription: parsedtileConfig[i].filterDescription || '',
          custom_Label: parsedtileConfig[i].custom_Label || '',
          fontSize: parsedtileConfig[i].fontSize || 14,
          filterForm: parsedtileConfig[i].filterForm || '',
          filterParameter: filterParameterValue, // Directly assign the original value
        }));
console.log('this.all_fields checking',)
        // Log to confirm the field was added correctly
        console.log('Field added:', this.all_fields.at(this.all_fields.length - 1).value);
      }
    } else {
      // Adjust the form fields if no config exists
      if (noOfParams !== '' && noOfParams !== undefined && noOfParams !== null) {
        for (let i = this.all_fields.length; i >= noOfParams; i--) {
          this.all_fields.removeAt(i);
        }
      }
    }
  }

  console.log('Final fields:', this.all_fields);

  return this.all_fields;
}





  // checkPrimary(event: any): void {
  //   console.log('Event checking primary:', event);
  
  //   // Extract the value property from the selected data
  //   const selectedValuePrimary = event[0]?.value || null;
  //   console.log('selectedValuePrimary check',selectedValuePrimary)
  
  //   if (selectedValuePrimary === 'Constant') {
  //     this.shouldShowProcessedValue = false; // Hide Processed Value field
  //   } else {
  //     this.shouldShowProcessedValue = true; // Show Processed Value field
  //   }
  // }
  
  onMouseEnter(): void {
    this.isHovered = true;
  }
  async dashboardIds(sk: any) {
    console.log("Iam called Bro");
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
                if (!this.dashboardIdsList) {
                  this.dashboardIdsList = [];
                }

                // Check if P1 exists before pushing
                if (P1 !== undefined && P1 !== null) {
                  this.dashboardIdsList.push({ P1, P2, P3, P4, P5, P6, P7, P8, P9 });
                  console.log("Pushed to dashboardIdsList: ", { P1, P2, P3, P4, P5, P6, P7, P8, P9 });
                  console.log('this.dashboardIdsList check',this.dashboardIdsList)
                  this.p1ValuesSummary = this.dashboardIdsList.map((item: { P1: any; }) => item.P1);
console.log('P1 values: dashboard', this.p1ValuesSummary);
                } else {
                  console.warn("Skipping element because P1 is not defined or null");
                }
              } else {
                break;
              }
            }

            // Continue fetching recursively
            await this.dashboardIds(sk + 1);
          } else {
            console.error('Invalid data format - not an array.');
          }
        } else {
          console.error('response.options is not a string.');
        }
      } else {
        console.log("Lookup to be displayed", this.dashboardIdsList);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }
  
  onMouseLeave(): void {
    this.isHovered = false;
  }

  
  

  fetchDynamicFormDataFilter(value: any) {
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
          this.listofDynamicParamFilter = formFields.map((field: any) => {
            console.log('field check',field)
            return {
              value: field.name,
              text: field.label
            };
          });

          // Include created_time and updated_time
          if (parsedMetadata.created_time) {
            this.listofDynamicParamFilter.push({
              value: parsedMetadata.created_time.toString(),
              text: 'Created Time' // You can customize the label here if needed
            });
          }

          if (parsedMetadata.updated_time) {
            this.listofDynamicParamFilter.push({
              value: parsedMetadata.updated_time.toString(),
              text: 'Updated Time' // You can customize the label here if needed
            });
          }

          console.log('Transformed dynamic parameters:', this.listofDynamicParamFilter);

          // Trigger change detection to update the view
          this.cdr.detectChanges();
        }
      })
      .catch((err) => {
        console.log("Can't fetch", err);
      });
  }

  SelectTypeSummary =[
    { value: 'NewTab', text: 'New Tab' },
    { value: 'Modal', text: 'Modal' },
  ]
  dynamicparameterValue(event: any, index: any): void {
    console.log('Event check for dynamic param:', event);
    console.log('event[0].text check:', event[0]?.text);
  
    // Access the specific FormGroup from the FormArray
    const formDynamicParam = this.all_fields.at(index) as FormGroup;
  
    if (!formDynamicParam) {
      console.warn(`FormGroup not found for index ${index}`);
      return;
    }
  
    // Access the filterParameter FormControl
    const filterParameter = formDynamicParam.get('filterParameter');
    console.log('filterParameter check:', filterParameter);
  
    if (event && event[0] && event[0].text) {
      this.filterParamevent = event[0].text;
      console.log('this.filterParamevent check:', this.filterParamevent);
  
      if (filterParameter) {
        // Patch the value to the FormControl
        filterParameter.patchValue(this.filterParamevent);
        this.cdr.detectChanges();
      } else {
        console.warn(`filterParameter control not found in FormGroup for index ${index}`);
      }
    } else {
      console.log('Failed to set value: event structure is invalid or missing text property.');
    }
  
    // Format and set the selectedParameterValue
    if (event && event[0] && event[0].value) {
      const formattedValue = `\${${event[0].value}}`; // Custom formatting
      console.log('formattedValue check:', formattedValue);
      this.selectedParameterValue = formattedValue;
  
      console.log('Formatted Selected Item:', this.selectedParameterValue);
    } else {
      console.log('Event structure is different or missing value property:', event);
    }
  }
  

  dynamicparameterLabel(event: any, index: any) {
    console.log('event checking dynamicparameterLabel', event);
    console.log('index checking dynamicparameterLabel', index);
  
    // Ensure the variable is initialized as an array or object
    if (!this.dynamicparameterLabMap) {
      this.dynamicparameterLabMap = {}; // Initialize as an object if not already
    }
  
    // Store the value for the specific index
    this.dynamicparameterLabMap[index] = event[0]?.text || '';
    console.log('dynamicparameterLabMap after update:', this.dynamicparameterLabMap[index]);
  
    console.log('dynamicparameterLabMap after update:', this.dynamicparameterLabMap);
  }
  

  onAdd(index: any): void {
    console.log('index checking from onAdd', index);
  
    // Access the specific form group from the form array
    const formDescParam = this.all_fields.at(index) as FormGroup;
  
    // Retrieve the `filterDescription` control from the group
    const groupByFormatControl = formDescParam.get('filterDescription');
  
    // Set the `selectedParameterValue` to the `name` of the selected parameter
    console.log('this.selectedParameterValue check', this.selectedParameterValue);
  
    // Update the specific form control value for `filterDescription`
    if (groupByFormatControl) {
      groupByFormatControl.patchValue(`${this.selectedParameterValue}`);
      console.log(
        `Patched value for index ${index}:`,
        `${this.selectedParameterValue}`
      );
    } else {
      console.warn(
        `filterDescription control not found for index ${index}.`
      );
    }
  
    // Optionally patch at the top-level form if needed
    this.createChart.patchValue({
      filterDescription: `${this.selectedParameterValue}`,
    });
  
    // Manually trigger change detection to ensure the UI reflects the changes
    this.cdr.detectChanges();
  }
  
  


  parameterValueCheck(event:any,index:any){

    const formGroupparam = this.all_fields.at(index);
    const groupByFormatControl = formGroupparam.get('parameterName');

   
    console.log('event for parameter check',event)
    if (event && event[0] && event[0].value) {
      if (groupByFormatControl) {
        groupByFormatControl.setValue(event[0].text);
        console.log('Value set successfully:', groupByFormatControl.value);
      } else {
        console.error('groupByFormat control does not exist in the form group!');
      }

    }


  }
  selectFormParams(event: any, index: number) {
    if (event && event[0] && event[0].data) {
      const selectedText = event[0].data.text; // Adjust based on the actual structure
      console.log('Selected Form Text:', selectedText);
  
      if (selectedText) {
        // Fetch parameters dynamically for the specific field index
        this.fetchDynamicFormData(selectedText, index);
      }
    } else {
      console.error('Event data is not in the expected format:', event);
    }
  }
  
  getDynamicParams(index: number): any[] {
    return this.dynamicParamMap.get(index) || [];
  }

  selectFormParamsFilter(event: any) {
    if (event && event[0] && event[0].data) {
      const selectedFilterText = event[0].data.text;  // Adjust based on the actual structure
      console.log('Selected Form Text:', selectedFilterText);

      if (selectedFilterText) {
        this.fetchDynamicFormDataFilter(selectedFilterText);
      }
    } else {
      console.error('Event data is not in the expected format:', event);
    }
  }

  groupByOptions = [
    { value: 'none', text: 'None' },
    { value: 'created', text: 'Created Time' },
    { value: 'updated', text: 'Updated Time' },
    { value: 'name', text: 'Name' },
    { value: 'phoneNumber', text: 'Phone Number' },
    { value: 'emailId', text: 'Email Id' },


    // Add more hardcoded options as needed
  ];
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
    { value: 'Live', text: 'Live' },
    { value: 'Count', text: 'Count' },
    { value: 'Count_Multiple', text: 'Count Multiple' },
    { value: 'Count Dynamic', text: 'Count Dynamic' },


  ]
  showStatusValues = [
    { value: 'Open', text: 'Open' },
    { value: 'In-Progress', text: 'In-Progress' },
    { value: 'Solved', text: 'Solved' },
    { value: 'Closed', text: 'Closed' },



  ]


  showCustomValues = [
    { value: 'Live', text: 'Live' },
    { value: 'Hourly', text: 'Hourly' },
    { value: 'Daily', text: 'Daily' },
    { value: 'Hour of the Day', text: 'Hour of the Day' },
    { value: 'Weekly', text: 'Weekly' },
    { value: 'Day of Week', text: 'Day of Week' },
    { value: 'Monthly', text: 'Monthly' },
    { value: 'Day of Month', text: 'Day of Month' },
    { value: 'Yearly', text: 'Yearly' }
  ];
  onValueChange(selectedValue: any): void {
    console.log('selectedValue check', selectedValue[0].value);  // Log the selected value
  
    // Set the primaryValue form control to the selected value
    this.createChart.get('primaryValue')?.setValue(selectedValue[0].value);
  
    // Trigger change detection to ensure the UI updates immediately (optional)
    this.cd.detectChanges();
  }

  onValueSelect(onSelectValue:any){
    console.log('selectedValue check', onSelectValue[0].value);  // Log the selected value
  
    // Set the primaryValue form control to the selected value
    this.createChart.get('selectedRangeType')?.setValue(onSelectValue[0].value);
  
    // Trigger change detection to ensure the UI updates immediately (optional)
    this.cd.detectChanges();

  }
  
  
  get primaryValue() {
    return this.createChart.get('primaryValue');
  }
  closeModal(modal: any) {
    if (modal) {
      modal.close(); // Close the modal
    } else {
      console.error('Modal reference is undefined');
    }
  }
  selectValue(value: string, modal: any): void {
    console.log('Selected value:', value);
    console.log('Current calenderIndex:', this.calenderIndex);
  
    if (
      this.calenderIndex !== undefined &&
      this.calenderIndex >= 0 &&
      this.calenderIndex < this.all_fields.length
    ) {
      const formGroup = this.all_fields.at(this.calenderIndex);
      const groupByFormatControl = formGroup.get('groupByFormat');
  
      if (groupByFormatControl) {
        groupByFormatControl.setValue(value);
        console.log('Value set successfully:', groupByFormatControl.value);
      } else {
        console.error('groupByFormat control does not exist in the form group!');
      }
    } else {
      console.error('Invalid calenderIndex or FormArray length mismatch!');
    }
  
    // Close the modal
    this.closeModal(modal);
  }
  
  
  
  

  get groupByFormatControl(): FormControl {
    return this.createChart.get('groupByFormat') as FormControl; // Cast to FormControl
  }


  
  

  handleModalClose(selectedValue: string) {
    // Logic to handle what happens after the modal closes
    console.log('Handling post modal close logic with value:', selectedValue);
    // You can update your UI or state here based on the selectedValue
  }

  showTooltip(item: string) {
    this.tooltip = item;
  }

  hideTooltip() {
    this.tooltip = null;
  }
get datePickerControl(){
  return this.createChart?.get('predefinedSelectRange') as FormControl
}
datesUpdatedRange($event: any,index:any): void {
  const selectedRange = Object.entries(this.ranges).find(([label, dates]) => {
    const [startDate, endDate] = dates as [moment.Moment, moment.Moment];
    return (
      startDate.isSame($event.startDate, 'day') &&
      endDate.isSame($event.endDate, 'day')
    );
  });

  console.log('Selected Range Check:', selectedRange);

  if (selectedRange) {
    const control = this.createChart.get('predefinedSelectRange');
    if (control) {
      control.setValue(selectedRange[1]); // Update the form control value with the range label
    }

    // Debugging: Log before setting the value
    console.log('Setting selectedRangeType:', selectedRange[0]);
    
    const controlSelectedRangeType = this.all_fields.at(index).get('selectedRangeType');
    if (controlSelectedRangeType) {
      controlSelectedRangeType.setValue(selectedRange[0]); // Update the form control value with the range label
    }

    // Debugging: Log after setting the value
    console.log('selectedRangeType after setting:', this.createChart.get('selectedRangeType')?.value);
  }
}

  



toggleCheckbox1(theme: any) {
  // Deselect all themes
  this.themes.forEach(t => (t.selected = false));

  // Select the current theme
  theme.selected = true;

  // Update the form value for themeColor
  this.createChart.patchValue({ themeColor: theme.color });
}

  onColorChange1(event: Event) {
    const colorInput = event.target as HTMLInputElement;
    this.createChart.get('themeColor')?.setValue(colorInput.value)

    console.log('Color changed:', this.createChart.get('themeColor')?.value);
  }










  // Method to initialize the chart using the form's JSON value


  // getFormNameByIndexCustom(index: number): string {
  //   const selectedFormValue = this.selectedForms[index];
  //   return selectedFormValue
  // }

  // getFormNameByIndex(index: number): string {
  //   const selectedFormValue = this.selectedForms[index];
  //   return selectedFormValue
  // }
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
            console.log("All the users are here", JSON.parse(JSON.stringify(this.lookup_data_savedQuery)));

            this.original_lookup_data = this.lookup_data_savedQuery

            this.listofSavedIds = this.lookup_data_savedQuery.map((item:any)=>item.P1)

            // console.log("All the unique IDs are here ",this.listofSavedIds);

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


            if(!this.adminAccess){
              this.lookup_data_savedQuery = this.lookup_data_savedQuery.filter((item:any)=>(item.P2 && item.P2.username == "Me") || (item.P2.userList &&  item.P2.userList.includes(this.username)))
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

  async fetchDynamic(eventValue: any[], formValueSave: string[], fieldIndex: any, conditionIndex: any, formField: any): Promise<any[]> {
    this.cd.detectChanges();
    console.log('eventValue checking', eventValue);
    console.log('fieldIndex checking', fieldIndex);
    console.log('eventValue[0].value',formField)
    let formFieldControl = eventValue[0].value;
    console.log('formFieldControl extract', formFieldControl);

    // Initialize the map for storing labels if it doesn't exist
    if (!this.fieldLabelsShow) {
        this.fieldLabelsShow = new Map();
    }

    // Check if there is already a map for the current fieldIndex, if not, create one
    if (!this.fieldLabelsShow.has(fieldIndex)) {
        this.fieldLabelsShow.set(fieldIndex, new Map());
    }

    // Retrieve the map for the current fieldIndex and set the label for the current conditionIndex
    const indexLabels = this.fieldLabelsShow.get(fieldIndex);
    indexLabels.set(conditionIndex, eventValue[0].text);
    console.log(`Label for fieldIndex ${fieldIndex}, conditionIndex ${conditionIndex}:`, indexLabels.get(conditionIndex));

 

    console.log('formValueSave check', formValueSave);
    const fetchedData = []; // Initialize an array to store the fetched values

    try {
        this.populateFormBuilder = []; // Initialize to ensure a clean state

        for (const [index, formName] of formValueSave.entries()) {
            console.log(`Processing form at index ${index}:`, formName);

            const result = await this.api.GetMaster(
                `${this.SK_clientID}#dynamic_form#${formName}#main`,
                1
            );

            console.log('Result from API:', result);

            if (result) {
                const tempResult = JSON.parse(result.metadata || '{}').formFields;
                console.log('Parsed form fields:', tempResult);

                const tempMetadata = {
                    [formName]: tempResult.map((field: any) => ({
                        name: field.name,
                        label: field.label,
                        formName: formName,
                        options: field.options,
                        type: field.type,
                        validation: field.validation,
                    })),
                };
console.log('tempMetadata',tempMetadata)
                this.populateFormBuilder[index] = JSON.parse(JSON.stringify(tempMetadata));
                fetchedData.push(tempMetadata); // Push to the fetched data array
            }
        }
        // Dynamically fetch options and set globalFieldData
        console.log('formFieldControl checking from dynamic',formFieldControl)
        

        this.getOptionsForField(fieldIndex, conditionIndex, formFieldControl);

        console.log('Final populateFormBuilder:', this.populateFormBuilder);
        return fetchedData; // Return the fetched data
    } catch (error) {
        console.error('Error in fetching form Builder data:', error);
        return []; // Return an empty array in case of an error
    }
}


  get allFields(): FormArray {
    return this.createChart.get('all_fields') as FormArray;
  }

  
  
  
  // getOptionsForField(
  //   fieldIndex: number,
  //   conditionIndex: number,
  //   formFieldValue: string
  // ): void {
  //   console.log('fieldIndex check:', fieldIndex);
  //   console.log('conditionIndex check:', conditionIndex);
  //   console.log('formFieldValue check:', formFieldValue);
  //   console.log('Final populateFormBuilder dynamic:', this.populateFormBuilder);
  //   console.log('globalFieldData checking from option',this.globalFieldData)
    
  
  //   try {
  //     if (!this.globalFieldData[fieldIndex]) {
  //       this.globalFieldData[fieldIndex] = {}; // Or however you need it structured
  //   }
  //   if (!this.globalFieldData[fieldIndex][conditionIndex]) {
  //       this.globalFieldData[fieldIndex][conditionIndex] = {};
  //   }
  //     const fieldGroup = this.all_fields.at(fieldIndex) as FormGroup;
  //     if (!fieldGroup) {
  //       console.warn(`Field group is undefined for fieldIndex ${fieldIndex}`);
  //       return;
  //     }
  
  //     const conditions = fieldGroup.get('conditions') as FormArray;
  //     if (!conditions || !conditions.controls[conditionIndex]) {
  //       console.warn(`Conditions array or condition at index ${conditionIndex} is not defined for fieldIndex ${fieldIndex}`);
  //       return;
  //     }
  
  //     if (!formFieldValue) {
  //       console.warn('formFieldValue is empty or invalid');
  //       conditions.controls[conditionIndex].get('type')?.setValue('text');
  //       this.globalFieldData[fieldIndex][conditionIndex] = { type: 'text', options: null };
  //       return;
  //     }
  
  //     // Use formlistValues to retrieve the form name by index
  //     const formName = this.formlistValues[fieldIndex];
  //     console.log('formName from formlistValues:', formName);
  
  //     if (!formName) {
  //       console.warn(`Form name is missing for fieldIndex ${fieldIndex} in formlistValues`);
  //       conditions.controls[conditionIndex].get('type')?.setValue('text');
  //       this.globalFieldData[fieldIndex][conditionIndex] = { type: 'text', options: null };
  //       return;
  //     }
  
  //     const metadataAtFieldIndex = this.populateFormBuilder[fieldIndex];
  //     console.log('metadataAtFieldIndex check:', metadataAtFieldIndex);
  
  //     if (!metadataAtFieldIndex || !metadataAtFieldIndex[formName]) {
  //       console.error(`Form name '${formName}' not found in metadataAtFieldIndex. Available forms:`, Object.keys(metadataAtFieldIndex || {}));
  //       conditions.controls[conditionIndex].get('type')?.setValue('text');
  //       this.globalFieldData[fieldIndex][conditionIndex] = { type: 'text', options: null };
  //       return;
  //     }
  
  //     const matchingMetadata = metadataAtFieldIndex[formName];
  //     console.log('matchingMetadata check:', matchingMetadata);
  
  //     const foundField = matchingMetadata.find((field: Field) => field.name === formFieldValue);
  //     if (foundField) {
  //       console.log(`Found field for ${formFieldValue}:`, foundField);
  
  //       // Handle case where type is 'select' but options are empty or invalid
  //       if (
  //         foundField.type === 'select' &&
  //         (!foundField.options || foundField.options.length === 0 || foundField.options.every((option: string) => !option.trim()))
  //       ) {
  //         console.warn(`Field ${formFieldValue} has type 'select' but options are empty. Defaulting to type 'text'.`);
  //         conditions.controls[conditionIndex].get('type')?.setValue('text');
  //         this.globalFieldData[fieldIndex][conditionIndex] = { type: 'text', options: null };
  //         return;
  //       }
  
  //       // Set the type and options in the global variable
  //       conditions.controls[conditionIndex].get('type')?.setValue(foundField.type || 'text');
  //       this.globalFieldData[fieldIndex][conditionIndex] = { type: foundField.type, options: foundField.options || null };
  //     } else {
  //       console.warn(`Field with name ${formFieldValue} not found in metadata for index ${fieldIndex}`);
  //       console.log('Available field names:', matchingMetadata.map((field: Field) => field.name));
  //       conditions.controls[conditionIndex].get('type')?.setValue('text');
  //       this.globalFieldData[fieldIndex][conditionIndex] = { type: 'text', options: null };
  //     }
  //   } catch (error) {
  //     console.error('Error in getOptionsForField:', error);
  //   }
  // }
  


  async getOptionsForField(fieldIndex: number, conditionIndex: number, formFieldValue: string): Promise<void> {
    console.log('fieldIndex check:', fieldIndex);
    console.log('conditionIndex check:', conditionIndex);
    console.log('formFieldValue check:', formFieldValue);
    console.log('Final populateFormBuilder dynamic:', this.populateFormBuilder);
    console.log('globalFieldData checking from option', this.globalFieldData);
  
    try {
      if (!this.globalFieldData[fieldIndex]) {
        this.globalFieldData[fieldIndex] = {}; // Or however you need it structured
      }
      if (!this.globalFieldData[fieldIndex][conditionIndex]) {
        this.globalFieldData[fieldIndex][conditionIndex] = {};
      }
  
      const fieldGroup = this.all_fields.at(fieldIndex) as FormGroup;
      if (!fieldGroup) {
        console.warn(`Field group is undefined for fieldIndex ${fieldIndex}`);
        return;
      }
  
      const conditions = fieldGroup.get('conditions') as FormArray;
      if (!conditions || !conditions.controls[conditionIndex]) {
        console.warn(`Conditions array or condition at index ${conditionIndex} is not defined for fieldIndex ${fieldIndex}`);
        return;
      }
  
      if (!formFieldValue) {
        console.warn('formFieldValue is empty or invalid');
        conditions.controls[conditionIndex].get('type')?.setValue('text');
        this.globalFieldData[fieldIndex][conditionIndex] = { type: 'text', options: null };
        return;
      }
  
      const formName = this.formlistValues[fieldIndex];
      console.log('formName from formlistValues:', formName);
      if (!formName) {
        console.warn(`Form name is missing for fieldIndex ${fieldIndex} in formlistValues`);
        conditions.controls[conditionIndex].get('type')?.setValue('text');
        this.globalFieldData[fieldIndex][conditionIndex] = { type: 'text', options: null };
        return;
      }
  
      const metadataAtFieldIndex = this.populateFormBuilder[fieldIndex];
      console.log('metadataAtFieldIndex check:', metadataAtFieldIndex);
      if (!metadataAtFieldIndex || !metadataAtFieldIndex[formName]) {
        console.error(`Form name '${formName}' not found in metadataAtFieldIndex. Available forms:`, Object.keys(metadataAtFieldIndex || {}));
        conditions.controls[conditionIndex].get('type')?.setValue('text');
        this.globalFieldData[fieldIndex][conditionIndex] = { type: 'text', options: null };
        return;
      }
  
      const matchingMetadata = metadataAtFieldIndex[formName];
      console.log('matchingMetadata check:', matchingMetadata);
  
      const foundField = matchingMetadata.find((field: Field) => field.name === formFieldValue);
      if (foundField) {
        console.log(`Found field for ${formFieldValue}:`, foundField);
  
        // Set the type and options in the global variable
        if (foundField.type === 'select') {
          // Check if options are empty or contain only empty strings/spaces
          const optionsIsEmpty = !foundField.options || foundField.options.every((option: string) => option.trim() === '');
        
          if (!optionsIsEmpty) {
            // If options are not empty, proceed with appending 'All' to options
            const optionsWithAll = ['All', ...foundField.options];
            conditions.controls[conditionIndex].get('type')?.setValue(foundField.type);
            this.globalFieldData[fieldIndex][conditionIndex] = { type: foundField.type, options: optionsWithAll };
          } else {
            // If options are considered empty, check if validation.user is true
            if (foundField.validation && foundField.validation?.user === true) {
              const lookupKey = `${this.SK_clientID}#user#lookup`;
              console.log('lookupKey',lookupKey)

     
                // Ensure that you are awaiting the async function to get the resolved value
                const optionsSet = await this.fetchLookupUser(lookupKey, 1); // Await the async function
              
                console.log('this.userlistCheck check', optionsSet); // Log the resolved value
              
                // Ensure the 'type' form control exists and is being updated properly
                const typeControl = conditions.controls[conditionIndex].get('type');
                
                if (typeControl) {
                  typeControl.setValue(foundField.type); // Set the 'type' value
              
                  // Now set the options once the 'type' is set
                  this.globalFieldData[fieldIndex][conditionIndex] = {
                    type: foundField.type,
                    options: optionsSet // Assign the resolved options here
                  };
                } else {
                  console.error('Type control not found at index', conditionIndex);
                }
 
              
              // Handle the logic for the user dropdown here
              console.log("User list dropdown is here");
            }else if(foundField.validation?.lookup === true && foundField.validation?.form){
              const lookupKey = `${this.SK_clientID}#${foundField.validation.form}#lookup`;

              const extractedIds = await this.fetchLookupFormData(lookupKey, 1, foundField.validation?.field);
              console.log('Received Extracted IDs:', extractedIds);
              const typeControl = conditions.controls[conditionIndex].get('type');
              if (typeControl) {
                typeControl.setValue(foundField.type); // Set the 'type' value
            
                // Now set the options once the 'type' is set
                this.globalFieldData[fieldIndex][conditionIndex] = {
                  type: foundField.type,
                  options: extractedIds // Assign the resolved options here
                };
              } else {
                console.error('Type control not found at index', conditionIndex);
              }
              



            }

            else if(foundField.validation?.isDerivedUser === true && foundField.validation?.form){
         
              const lookupKey = `${this.SK_clientID}#${foundField.validation.form}#lookup`;
              
             const extractedDerivedUser = await this.fetchLookupIsDerivedUser(lookupKey,1,foundField.validation?.field)
             const typeControl = conditions.controls[conditionIndex].get('type');
             if (typeControl) {
               typeControl.setValue(foundField.type); // Set the 'type' value
           
               // Now set the options once the 'type' is set
               this.globalFieldData[fieldIndex][conditionIndex] = {
                 type: foundField.type,
                 options: extractedDerivedUser // Assign the resolved options here
               };
             } else {
               console.error('Type control not found at index', conditionIndex);
             }


            }
            // else if()
          }
        } else {
          conditions.controls[conditionIndex].get('type')?.setValue('text');
          this.globalFieldData[fieldIndex][conditionIndex] = { type: 'text', options: null };
          // Handle other types if needed
        }
        
        
      } else {
        console.warn(`Field with name ${formFieldValue} not found in metadata for index ${fieldIndex}`);
        console.log('Available field names:', matchingMetadata.map((field: Field) => field.name));
        conditions.controls[conditionIndex].get('type')?.setValue('text');
        this.globalFieldData[fieldIndex][conditionIndex] = { type: 'text', options: null };
      }
    } catch (error) {
      console.error('Error in getOptionsForField:', error);
    }
  }
  
  
  async fetchLookupUser(lookupKey: any, sk: any) {
    console.log("Iam called Bro");
    try {
      const response = await this.api.GetMaster(lookupKey, sk);
  
      if (response && response.options) {
        if (typeof response.options === 'string') {
          let data = JSON.parse(response.options);
          console.log("d1 =", data);
  
          if (Array.isArray(data)) {
            for (let index = 0; index < data.length; index++) {
              const element = data[index];
  
              if (element !== null && element !== undefined) {
                const key = Object.keys(element)[0];
                const { P1, P2, P3, P4, P5, P6, P7 } = element[key];
  
                // Ensure userList is initialized
                if (!this.userList) {
                  this.userList = [];
                }
  
                // Check if P1 exists before pushing
                if (P1 !== undefined && P1 !== null) {
                  this.userList.push({ P1, P2, P3, P4, P5, P6, P7 });
                  console.log("Pushed to userList: ", { P1, P2, P3, P4, P5, P6, P7 });
                  this.userlistRead = this.userList.map((item: { P1: any; }) => item.P1);
                  console.log('this.userlistRead', this.userlistRead);
                } else {
                  console.warn("Skipping element because P1 is not defined or null");
                }
              } else {
                break;
              }
            }
  
            // Continue fetching recursively
            await this.dashboardIds(sk + 1);
          } else {
            console.error('Invalid data format - not an array.');
            return this.userlistRead; // return userlistRead here
          }
        } else {
          console.error('response.options is not a string.');
        }
      } else {
        console.log("Lookup to be displayed", this.userlistRead);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  
    return this.userlistRead; // return userlistRead at the end of the function
  }
  


  async fetchLookupFormData(lookupKey: any, sk: any, readField: any): Promise<any[]> {
    console.log('readField checking', readField);
    console.log("Iam called Bro");
    
    try {
      const response = await this.api.GetMaster(lookupKey, sk);
  
      if (response && response.options) {
        if (typeof response.options === 'string') {
          let data = JSON.parse(response.options);
          console.log("form data check", data);
  
          // Declare extractedValues inside the function
          let extractedValues: any[] = [];
          
          // Loop through data to find the matching value
          data.forEach((entry: any) => {
            entry.forEach((item: any) => {
              if (item.includes(readField)) {
                let splitValue = item.split('#');
                let extractedId = splitValue[1]; // Get the value after '#'
                extractedValues.push(extractedId);
              }
            });
          });
  
          console.log('Extracted IDs:', extractedValues);
  
          // Return the extracted IDs
          return extractedValues;
          
        } else {
          console.error('response.options is not a string.');
        }
      } else {
        console.log("Lookup to be displayed", this.userlistRead);
      }
    } catch (error) {
      console.error('Error:', error);
    }
    
    // Return an empty array if no data is found
    return [];
  }

  async fetchLookupIsDerivedUser(lookupKey: any, sk: any, readField: any): Promise<any[]> {
    console.log('readField checking', readField);
    console.log("Iam called Bro");
    
    try {
      const response = await this.api.GetMaster(lookupKey, sk);
  
      if (response && response.options) {
        if (typeof response.options === 'string') {
          let data = JSON.parse(response.options);
          console.log("is Derived user Data", data);
          let extractedDerivedUsers: any[] = [];
          
          // Loop through data to find the matching value
          data.forEach((entry: any) => {
            entry.forEach((item: any) => {
              if (item.includes(readField)) {
                let splitValue = item.split('#');
                let extractedId = splitValue[1]; // Get the value after '#'
                extractedDerivedUsers.push(extractedId);
              }
            });
          });
  
          console.log('Extracted IDs:', extractedDerivedUsers);
  
          // Return the extracted IDs
          return extractedDerivedUsers;
  
          // Declare extractedValues inside the function

   
          
        } else {
          console.error('response.options is not a string.');
        }
      } else {
        console.log("Lookup to be displayed", this.userlistRead);
      }
    } catch (error) {
      console.error('Error:', error);
    }
    
    // Return an empty array if no data is found
    return [];
  }
  
  
  
  
  
  
  
  
  
  
  
  
  
  remove(fieldIndex: number): void {
    // Access the specific field group
    const parentGroup = this.all_fields.at(fieldIndex) as FormGroup;
  
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
  
  
  
  
  
  

}
