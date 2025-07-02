import { ChangeDetectorRef, Component, EventEmitter, Injector, Input, NgZone, Output, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import dayjs, { Dayjs } from 'dayjs';
import Highcharts from 'highcharts';
import moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { APIService } from 'src/app/API.service';
import { LocationPermissionService } from 'src/app/location-permission.service';
import { SharedService } from 'src/app/pages/shared.service';
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
  selector: 'app-stacked-bar-config',

  templateUrl: './stacked-bar-config.component.html',
  styleUrl: './stacked-bar-config.component.scss'
})
export class StackedBarConfigComponent {
  createChart:FormGroup

 
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
  getLoggedUser: any;
  SK_clientID: string;
  formList: any;
  listofDeviceIds: any;
  listofDynamicParam: any;
  @ViewChild('calendarModalChart') calendarModalChart: any;
  showIdField = false;
  dropsDown = 'down';
  opensCenter = 'center';
  tooltips: { date: Dayjs; text: string }[] = [];
  invalidDates: Dayjs[] = [];
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
  maxDate?: Dayjs;
  minDate?: Dayjs;
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
  parsedParam: any;
  shoRowData:boolean=false
  columnVisisbilityFields: any;
  selectedText: any;
  userIsChanging: boolean;
  readOperation: any;
  FormRead: any;
  filteredResults: any;
  extractedTables: unknown[];
  readMinitableName: any;
  readMinitableLabel: any;
  filteredHeaders: {
    value: any; // Set the 'name' field as value
    label: any; // Set the 'label' field as label
  }[];
  selectedMiniTableFields: any;
  listofFormValues: any;
  dynamicParamMap = new Map<number, any[]>();
  dynamicDateParamMap = new Map<number, any[]>()
  formValidationFailed:boolean =true;
  userdetails: any;
  userClient: string;
  permissionsMetaData: any;
  permissionIdRequest: any;
  storeFormIdPerm: any;
  parsedPermission: any;
  readFilterEquation: any;
  summaryPermission: any;
  allDeviceIds: any;
  dynamicIDArray: any;

  IdsFetch: string[];
  projectDetailListRead: any[];
  projectDetailList: any[];
  projectListRead: any[];
  projectList: any[];
  dashboardIdList: string[] | PromiseLike<string[]>;
  dashboardListRead: any[];
  dashboardList: any[];
  reportStudioListRead: any[];
  reportStudioDetailList: any[];
  helpherObjCalender: any;
  formListTitles: any;
  isSummaryDashboardSelected = false;

  SelectTypeSummary = [
    { value: 'NewTab', text: 'New Tab' },
    { value: 'Modal', text: 'Modal(Pop Up)' },
    { value: 'Same page Redirect', text: 'Same Page Redirect' },
    // { value: 'drill down', text: 'Drill Down' },
  ];

  filteredSelectTypeSummary = [...this.SelectTypeSummary]; 
  summaryIds: any;
  FormNames: any;


 
  ngOnInit() {

    this.getLoggedUser = this.summaryConfiguration.getLoggedUserDetails()
    console.log('this.getLoggedUser check', this.getLoggedUser)
    // this.getWorkFlowDetails = this.summaryConfiguration.getLoggedUserDetails()
    // console.log('this.getLoggedUser check',this.getWorkFlowDetails)


    this.SK_clientID = this.getLoggedUser.clientID;
    console.log('this.SK_clientID check', this.SK_clientID)
    this.initializeTileFields()
    this.setupRanges();
  
    this.dashboardIds(1)
    this.fetchUserPermissions(1)
    this.dynamicDataEquation()
    this.createChart.get('toggleCheck')?.valueChanges.subscribe((isChecked) => {
      if (isChecked) {
        this.createChart.get('dashboardIds')?.enable();
        this.createChart.get('selectType')?.enable();
      } else {
        this.createChart.get('dashboardIds')?.disable();
        this.createChart.get('selectType')?.disable();
      }
    });



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
        item => item.value !== 'Modal' && item.value !== 'drill down'
      );
    
      // Clear "Modal" if it was previously selected
      const currentType = this.createChart.get('selectType')?.value;
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
  
  tooltipContent: string = 'Group data by time periods such as Today, Last 7 Days, This Month, or This Year to view filtered insights based on the selected range. For example, "This Year" refers to data from January to December of the current year.';
formTooltip: string = 'Select a form to view and analyze data specific to that form only.';
parameterTooltip: string = 'Specify which form fields to analyze. Results will be based solely on your selection.';

formatTypeTooltip: string = 'Select a format to represent the output value appropriately, such as Rupee for money, Distance for measurements, or Percentage for ratios.';
customLabelTooltip: string = 'Specify a custom label to be used as the title displayed on the widget.';
moduleNamesTooltip: string = 'Select the module that the user will be redirected to when the widget is clicked.';
selectTypeTooltip: string = 'Choose how the dashboard should open when the widget is clicked—open in a new tab, within a modal, on the same page.';

redirectToTooltip: string = 'Select the specific dashboard or module to which the user should be redirected when the widget is clicked.';

columnVisibilityTooltip: string = 'Select the fields you want to display in the drill-down table. Only the selected columns will be visible in the detailed view.';

UndefinedtooltipContent: string = 'Enter the text to display when the output label is undefined. This will replace the default "undefined" label in the final result.';
DateRangetooltipContent: string = 'Select how the date range should be labeled. "Any" supports flexible time grouping.';

CustomLabeltooltipContent: string = 'This text will appear as a tooltip on the widget to describe the displayed value.';
ParametertooltipContent: string = 'Specifies the number of parameters to configure.';
ChartTitletooltipContent: string = 'This title will appear as the heading of the chart.';
customLabelValue: string = 'Enter a custom label to display inside the donut chart along with the value. This label helps identify what the value represents.';
CustomValueLabelFontSize: string = 'Defines the font size of the custom label shown inside the donut chart.';
CustomColumnColorTooltip: string = 'Defines the color of the column in the column chart. The selected color will be applied to the plotted bar.';

filterParameterTooltip: string = 'Select form fields to apply filter conditions. The chosen fields will be used to filter data based on matching or non-matching values.';
filterEquationTooltip: string = 'Displays the generated filter equation based on selected fields. Field values are inserted dynamically in the format: Field Name - ${fieldId}. Example: Customer Name-${text-1732773051881} && Status-${single-select-1732769559973}';
highchartsOptionsTooltip: string = 'This area shows the chart settings in JSON format. You can edit it to change how the chart looks, like its type, colors, title, and more.';
MiniformTooltip:string ='Select a minitable name to view and analyze data specific to that minitable only.'
miniTableFieldsTooltip:string = 'Specify which minitable fields to analyze. Results will be based solely on your selection.'
minitableEquationTooltip: string = 'Displays a formatted equation using the selected mini-table fields. Example: Count MultiplePram(${Personal Info.dynamic_table_values.table-1736939655825.text-1730976463331}). The equation is auto-generated based on your selections.';
drillDownTypeTooltip: string = 'Select the drill down type for the chart. Choosing "Multi Level Drill Down" will allow you to configure infinite-level drill down logic dynamically.';
drillSelectFieldTooltip: string = 'Choose the field to display in the next drill down level. For example, selecting "Customer Name" will show customer-specific data when a chart slice is clicked.';

drillCustomLabelTooltip: string = 'Enter a custom label that will be used as the chart title at this drill down level. This helps identify the data shown at each step.';
dataLabelFontColorTooltip: string = 'Choose a custom font color for the data labels displayed on the chart.';
bgGradientTopColorTooltip: string = 'Select the top color for the chart background gradient. This will blend with the bottom color to create a smooth background effect.';
bgGradientBottomColorTooltip: string = 'Select the bottom color for the chart background gradient. It merges with the top color to form the gradient.';

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

    openFormatTypeModal(stepperModal: TemplateRef<any>){
      this.modalService.open(stepperModal, {   backdrop: 'static',  // Disable closing on backdrop click
        keyboard: false    });
  
    }
    openCustomValueModal(stepperModal: TemplateRef<any>){
      this.modalService.open(stepperModal, {   backdrop: 'static',  // Disable closing on backdrop click
        keyboard: false    });
  
    }
  
    openRedirectionTypeInfoModal(stepperModal: TemplateRef<any>){
      this.modalService.open(stepperModal, {   backdrop: 'static',  // Disable closing on backdrop click
        keyboard: false    });
  
    }
  
      openPrimaryValueInfoModal(stepperModal: TemplateRef<any>) {
        this.modalService.open(stepperModal, {   backdrop: 'static',  // Disable closing on backdrop click
          keyboard: false    });
    
      }
  
  onCombinedAddFieldsChange(event: any): void {
    this.onAdd_fieldsChange(event);
    this.addControls(event, 'html');
  }



  openWidgetFilterHelp(stepperModal: TemplateRef<any>){
    this.modalService.open(stepperModal, {   backdrop: 'static',  // Disable closing on backdrop click
      keyboard: false    });

  }

    openWidgetAdvanceEquationHelp(stepperModal: TemplateRef<any>){
      this.modalService.open(stepperModal, {   backdrop: 'static',  // Disable closing on backdrop click
        keyboard: false    });
  
    }



    openHelpChartOtions(stepperModal: TemplateRef<any>){
      this.modalService.open(stepperModal, {   backdrop: 'static',  // Disable closing on backdrop click
        keyboard: false    });
  
    }
  DrillDownTypeFields = [
    // { value: 'Table', text: 'Table' },
    { value: 'Multi Level', text: 'Multi Level Drill Down' },
  ]
  onAdd_fieldsChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input.valueAsNumber; // gets the number directly
    console.log('Changed add_fields value:', value);
  
    // Optional: Use the value to add fields
    if (!isNaN(value) && value > 0) {
 // or repopulateDrill_fields
    }
  }
  ngOnChanges(changes: SimpleChanges): void {
    console.log('dashboardChange',this.all_Packet_store)
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
  setupRanges(): void {
    this.ranges = {
      Today: [moment().startOf('day'), moment().endOf('day')],
      Yesterday: [moment().subtract(1, 'day').startOf('day'), moment().subtract(1, 'day').endOf('day')],
      'Last 7 Days': [moment().subtract(6, 'days').startOf('day'), moment().endOf('day')],
      'Last 30 Days': [moment().subtract(29, 'days').startOf('day'), moment().endOf('day')],
      'This Month': [moment().startOf('month'), moment().endOf('month')],
      'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
      'This Year': [moment().startOf('year'), moment().endOf('year')],
      'Last Year': [moment().subtract(1, 'year').startOf('year'), moment().subtract(1, 'year').endOf('year')],
      // ... add other ranges as needed
    };
  }
  initializeTileFields(): void {
    console.log('i am initialize');
  
    this.createChart = this.fb.group({
      add_fields: ['', Validators.required],
      all_fields: new FormArray([]),
      drill_fields: new FormArray([]),
      conditions: this.fb.array([]),
      widgetid: [this.generateUniqueId()],
      chart_title: ['', Validators.required],
      highchartsOptionsJson: [JSON.stringify(this.defaultHighchartsOptionsJson, null, 4)],
      filterForm: [''],
      miniForm: [''],
      MiniTableNames: [''],
      MiniTableFields: [''],
      minitableEquation: [''],
      EquationOperationMini: [''],
      filterFormList: [''],
      dashboardIds: [''],
      selectType: [''],
      toggleCheck: [],
      DrillDownType: [''],
      DrillFilter:[''],
      DrillFilterLevel:[''],
      dataLabelFontColor:[''],
      chartBackgroundColor1:[''],
      chartBackgroundColor2:[''],
      ChartTypeSelection:['bar'],
      ModuleNames:['']

      // multiColorCheck: [true]
    });
  
    // Subscribe to DrillDownType changes
    this.createChart.get('DrillDownType')?.valueChanges.subscribe(() => {
      this.updateDrillFields();
    });

    this.createChart.get('ChartTypeSelection')?.valueChanges.subscribe((selectedChartType: string) => {
      this.updateChartType(selectedChartType);
    });

  
    // Subscribe to add_fields changes
    this.createChart.get('add_fields')?.valueChanges.subscribe((val: any) => {
      if (val === null || val === undefined || val === '') return;
  
      const parsedVal = parseInt(val, 10);
      if (isNaN(parsedVal)) return;
  
      if (parsedVal < 0) {
        this.toast.open("Negative values not allowed", "Check again", {
          duration: 5000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
        return;
      }
  
      // Call both methods
      const fakeEvent = { target: { value: parsedVal } };
      this.addControls(fakeEvent, 'html');
      this.updateDrillFields();
    });
  }
  getFormControlValue(selectedTextConfi:any): void {
    // const formlistControl = this.createChart.get('formlist');
    console.log('Formlist Control Value:', selectedTextConfi);
    this.fetchDynamicFormDataConfig(selectedTextConfi);
  }

  updateChartType(selectedChartType: string): void {
    this.defaultHighchartsOptionsJson.chart.type = selectedChartType;
  
    // Reinitialize or update the chart here
    // For example, if you're using Highcharts to render the chart:
    this.createChart.patchValue({
      highchartsOptionsJson: JSON.stringify(this.defaultHighchartsOptionsJson, null, 4)
    });
    Highcharts.chart('chartContainer', this.defaultHighchartsOptionsJson);
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
              value: 'created_time',
              text: 'Created Time' // You can customize the label here if needed
            });
          }

          if (parsedMetadata.updated_time) {
            this.columnVisisbilityFields.push({
              value: 'updated_time',
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



  updateDrillFields(): void {
    const selectedType = this.createChart.get('DrillDownType')?.value;
    const count = parseInt(this.createChart.get('add_fields')?.value, 10);
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
  get drillFields(): FormArray {
    return this.createChart?.get('drill_fields') as FormArray || this.fb.array([]);
  }
  
  addCondition(fieldIndex: number, initialValue: string = '', fieldValue: string = '') {
    const drillFieldsArray = this.createChart.get('drill_fields') as FormArray;
    const conditionsArray = drillFieldsArray.at(fieldIndex).get('conditions') as FormArray;
  
    const newConditionGroup = this.fb.group({
      drillTypeFields: [fieldValue], // Ensure ngx-select control is properly initialized
      drillTypeLabel:[''],
      drillTypePrimary:[''],
  
    });
  
    conditionsArray.push(newConditionGroup);
  }
  
  get drill_fields() {
    return this.createChart.get('drill_fields') as FormArray;
  }
  addNewDrillField() {
    const drillFieldsArray = this.createChart.get('drill_fields') as FormArray;
  
    // Create a new drill field group
    const fieldGroup = this.fb.group({
      conditions: this.fb.array([]), // Initialize conditions array
      
    });
  
    // Push it to the form array
    drillFieldsArray.push(fieldGroup);
  
    // Ensure at least one condition is added
    this.addCondition(drillFieldsArray.length - 1, '', '');
  }
  
  

  addDrillFields() {
    const drillFieldsArray = this.createChart.get('drill_fields') as FormArray;
    if (drillFieldsArray.length === 0) {  // Prevent duplicate generation
      this.addNewDrillField();  // Add an initial field
    }
  }
  
  // Function to clear the form array when 'Table' is selected
  clearDrillFields() {
    this.createChart.setControl('drill_fields', this.fb.array([])); // Reset the array
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

  chartTypeOptions=[    
    { value: 'bar', text: ' Bar' },
    { value: 'column', text: 'Column' },
   ]
      
  getFormArrayControls(field: AbstractControl | null): AbstractControl[] {
    if (field) {
      const formArray = field.get('conditions') as FormArray;
      return formArray?.controls || [];
    }
    return [];
  }


  formHeadings: Map<number, string> = new Map(); 
  fetchDynamicFormData(value: any, index: number) {
    console.log("Fetching data for:", value);
    this.formHeadings.set(index, value);  
    

    // Simulating API call
    this.api
      .GetMaster(`${this.SK_clientID}#dynamic_form#${value}#main`, 1)
      .then((result: any) => {
        if (result && result.metadata) {
          const parsedMetadata = JSON.parse(result.metadata);
          const formFields = parsedMetadata.formFields;

          const dynamicParamList  = formFields
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

          // Trigger change detection
          this.cdr.detectChanges();
        }
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
      });
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

  removeCondition(fieldIndex: number, conditionIndex: number) {
    const drillFieldsArray = this.createChart.get('drill_fields') as FormArray;
    const parentGroup = drillFieldsArray.at(fieldIndex) as FormGroup;
    const conditions = parentGroup.get('conditions') as FormArray;
  
    if (conditions && conditions.length > conditionIndex) {
      conditions.removeAt(conditionIndex);
      console.log(`Condition removed from index ${fieldIndex}, condition ${conditionIndex}`);
    } else {
      console.warn('Condition index out of range or conditions not found');
    }
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

  // addControls(event: any, _type: string) {
  //   const getConfigCount =this.createChart.get('add_fields')?.value
  //   console.log('getConfigCount checking',getConfigCount)
  //   console.log('event check', event);
  
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
  //   console.log('noOfParams check', noOfParams);
  
  //   // Update all_fields based on noOfParams
  //   if (this.createChart.value.all_fields.length < noOfParams) {
  //     const firstFieldValues = this.getFormArrayValues();
  //     for (let i = this.all_fields.length; i < noOfParams; i++) {
  //       const newGroup = this.fb.group({
  //         formlist: [ firstFieldValues.formlist || '', Validators.required],
  //         parameterName: [ firstFieldValues.parameterName || '', Validators.required],

  //         primaryValue: [firstFieldValues.primaryValue || '', Validators.required],
  //         groupByFormat: [firstFieldValues.groupByFormat || '', Validators.required],

   
  //         selectedRangeType: [firstFieldValues.selectedRangeType || '', Validators.required], 
  //         columnVisibility:[firstFieldValues.columnVisibility || []],

  //         formatType:[firstFieldValues.formatType || '', Validators.required],
  //         undefinedCheckLabel:[firstFieldValues.undefinedCheckLabel || ''],
  //         custom_Label:[firstFieldValues.custom_Label || '', Validators.required],
  //         XaxisFormat:[firstFieldValues.XaxisFormat || ''],
  //         drillTypeFields:[firstFieldValues.drillTypeFields || []],
  //         drillTypeCustomLable:[firstFieldValues.drillTypeCustomLable || ''],
  //         // selectFromTime: [''],
  //         // selectToTime: [''],
  //         parameterValue:[''],
  //         constantValue: [''],
  //         processed_value: ['234567'],
  //         rowData:[''],
  //         selectedColor: [this.selectedColor || '#FFFFFF'], // Default to white if no color is set

  //         filterParameter:[[]],
  //         filterDescription:[''],
   
  //         CustomColumnColor:['']
       
  //       })
  //       this.all_fields.push(newGroup);
  //       console.log('this.all_fields check', this.all_fields);
  
  //       // After adding a new form group, subscribe to value changes
  //       this.subscribeToValueChanges(i);
  //       console.log('this.all_fields check', this.all_fields);
  //       console.log('this.all_fields check', this.all_fields);
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


  addControls(event: any, _type: string) {
    console.log('event check', event);
  
    let noOfParams: number = 0; // Default to 0 to handle edge cases
  
    // Handle HTML type event
    if (_type === 'html' && event && event.target) {
      if (event.target.value >= 0) {
        noOfParams = JSON.parse(event.target.value);
      } else {
        return this.toast.open("Negative values not allowed", "Check again", {
          duration: 5000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
      }
    } else if (_type === 'ts') { // Handle TypeScript event
      if (event >= 0) {
        noOfParams = event;
      }
    }
  
    console.log('noOfParams check', noOfParams);
  
    // If the current form array has fewer items than noOfParams, add new controls
    if (this.all_fields.length < noOfParams) {
      for (let i = this.all_fields.length; i < noOfParams; i++) {
        // Access the first field value safely or use defaults if the array is empty
        const firstFieldValues = this.all_fields.length > 0 ? this.all_fields.at(0).value : {};
        
        this.all_fields.push(
          this.fb.group({
            formlist: [firstFieldValues.formlist || '', Validators.required],
            parameterName: [firstFieldValues.parameterName || [], Validators.required],
            primaryValue: [firstFieldValues.primaryValue || '', Validators.required],
            groupByFormat: [firstFieldValues.groupByFormat || '', Validators.required],
            constantValue: [''],
            processed_value: ['234567'],
            selectedColor: [this.selectedColor || '#FFFFFF'], // Default to white if no color is set
            selectedRangeType: [firstFieldValues.selectedRangeType || '', Validators.required],
            selectFromTime: [''],
            selectToTime: [''],
            parameterValue: [''],
            columnVisibility: [firstFieldValues.columnVisibility || []],
            rowData: [''],
            formatType: [firstFieldValues.formatType || '', Validators.required],
            undefinedCheckLabel: [firstFieldValues.undefinedCheckLabel || ''],
            custom_Label: ['', Validators.required],
            filterParameter: [[]],
            filterDescription: [''],
            XaxisFormat: [firstFieldValues.XaxisFormat || ''],
            drillTypeFields: [[]],
            drillTypeCustomLable: [''],
            CustomColumnColor: ['']
          })
        );
        console.log('this.all_fields check', this.all_fields);
      }
    } else if (this.all_fields.length > noOfParams) {
      // Remove extra fields if the array length is greater than noOfParams
      for (let i = this.all_fields.length - 1; i >= noOfParams; i--) {
        this.all_fields.removeAt(i);
      }
    }

    // Update noOfParams for future use
    this.noOfParams = noOfParams;
  }
  onValue() {
  const getConfigCount = this.createChart.get('add_fields')?.value;
  console.log('getConfigCount checking from oncHange', getConfigCount);
}

  get all_fields() {
    return this.createChart.get('all_fields') as FormArray;
  }

  getFormArrayValues() {
    // Check if form array has at least one element
    if (this.createChart.value.all_fields.length > 0) {
      // Get the first form group
      const firstField = this.createChart.value.all_fields[0];
  
      // Extract the desired values from the first form group
      const formValues = {
        groupByFormat: firstField.groupByFormat,
        selectedRangeType: firstField.selectedRangeType,
        parameterName:firstField.parameterName,
        formlist:firstField.formlist,
        formatType:firstField.formatType,
        custom_Label:firstField.custom_Label,
        primaryValue:firstField.primaryValue,
        columnVisibility:firstField.columnVisibility,
        XaxisFormat:firstField.XaxisFormat,
        drillTypeFields:firstField.drillTypeFields,
        drillTypeCustomLable:firstField.drillTypeCustomLable,
        undefinedCheckLabel:firstField.undefinedCheckLabel



      };
  
      console.log('Extracted values from the first form group:', formValues);
      return formValues;  // Returning or processing the extracted values
    } else {
      console.log('Form array is empty');
      return { groupByFormat: '', selectedRangeType: '' ,formatType:'',formlist:'',parameterName:'',primaryValue:'',custom_Label:'',columnVisibility:'',undefinedCheckLabel:'',drillTypeCustomLable:'',drillTypeFields:'',XaxisFormat:''};  // Return default empty values
    }
  }


  
  subscribeToValueChanges(fieldIndex: number) {
    const group = this.all_fields.at(fieldIndex);
    
    // Subscribe to groupByFormat field value changes
    group.get('groupByFormat')?.valueChanges.subscribe((value) => {
      if (value) {
        // Update all form groups with the new groupByFormat value, except the current one
        for (let i = 0; i < this.all_fields.length; i++) {
          const innerGroup = this.all_fields.at(i);
          if (i !== fieldIndex) {
            innerGroup.get('groupByFormat')?.setValue(value, { emitEvent: false });
          }
        }
      }
    });
  
    // Subscribe to selectedRangeType field value changes
    group.get('selectedRangeType')?.valueChanges.subscribe((value) => {
      if (value) {
        // Update all form groups with the new selectedRangeType value, except the current one
        for (let i = 0; i < this.all_fields.length; i++) {
          const innerGroup = this.all_fields.at(i);
          if (i !== fieldIndex) {
            innerGroup.get('selectedRangeType')?.setValue(value, { emitEvent: false });
          }
        }
      }
    });
    group.get('formatType')?.valueChanges.subscribe((value) => {
      if (value) {
        // Update all form groups with the new selectedRangeType value, except the current one
        for (let i = 0; i < this.all_fields.length; i++) {
          const innerGroup = this.all_fields.at(i);
          if (i !== fieldIndex) {
            innerGroup.get('formatType')?.setValue(value, { emitEvent: false });
          }
        }
      }
    });

    group.get('formlist')?.valueChanges.subscribe((value) => {
      if (value) {
        // Update all form groups with the new selectedRangeType value, except the current one
        for (let i = 0; i < this.all_fields.length; i++) {
          const innerGroup = this.all_fields.at(i);
          if (i !== fieldIndex) {
            innerGroup.get('formlist')?.setValue(value, { emitEvent: false });
          }
        }
      }
    });
    group.get('parameterName')?.valueChanges.subscribe((value) => {
      if (value) {
        // Update all form groups with the new selectedRangeType value, except the current one
        for (let i = 0; i < this.all_fields.length; i++) {
          const innerGroup = this.all_fields.at(i);
          if (i !== fieldIndex) {
            innerGroup.get('parameterName')?.setValue(value, { emitEvent: false });
          }
        }
      }
    });



    group.get('primaryValue')?.valueChanges.subscribe((value) => {
      if (value) {
        // Update all form groups with the new selectedRangeType value, except the current one
        for (let i = 0; i < this.all_fields.length; i++) {
          const innerGroup = this.all_fields.at(i);
          if (i !== fieldIndex) {
            innerGroup.get('primaryValue')?.setValue(value, { emitEvent: false });
          }
        }
      }
    });
    group.get('custom_Label')?.valueChanges.subscribe((value) => {
      if (value) {
        // Update all form groups with the new selectedRangeType value, except the current one
        for (let i = 0; i < this.all_fields.length; i++) {
          const innerGroup = this.all_fields.at(i);
          if (i !== fieldIndex) {
            innerGroup.get('custom_Label')?.setValue(value, { emitEvent: false });
          }
        }
      }
    });
    group.get('columnVisibility')?.valueChanges.subscribe((value) => {
      if (value) {
        // Update all form groups with the new selectedRangeType value, except the current one
        for (let i = 0; i < this.all_fields.length; i++) {
          const innerGroup = this.all_fields.at(i);
          if (i !== fieldIndex) {
            innerGroup.get('columnVisibility')?.setValue(value, { emitEvent: false });
          }
        }
      }
    });

    group.get('undefinedCheckLabel')?.valueChanges.subscribe((value) => {
      if (value) {
        // Update all form groups with the new selectedRangeType value, except the current one
        for (let i = 0; i < this.all_fields.length; i++) {
          const innerGroup = this.all_fields.at(i);
          if (i !== fieldIndex) {
            innerGroup.get('undefinedCheckLabel')?.setValue(value, { emitEvent: false });
          }
        }
      }
    });


    group.get('drillTypeCustomLable')?.valueChanges.subscribe((value) => {
      if (value) {
        // Update all form groups with the new selectedRangeType value, except the current one
        for (let i = 0; i < this.all_fields.length; i++) {
          const innerGroup = this.all_fields.at(i);
          if (i !== fieldIndex) {
            innerGroup.get('drillTypeCustomLable')?.setValue(value, { emitEvent: false });
          }
        }
      }
    });

    group.get('drillTypeFields')?.valueChanges.subscribe((value) => {
      if (value) {
        // Update all form groups with the new selectedRangeType value, except the current one
        for (let i = 0; i < this.all_fields.length; i++) {
          const innerGroup = this.all_fields.at(i);
          if (i !== fieldIndex) {
            innerGroup.get('drillTypeFields')?.setValue(value, { emitEvent: false });
          }
        }
      }
    });

    group.get('XaxisFormat')?.valueChanges.subscribe((value) => {
      if (value) {
        // Update all form groups with the new selectedRangeType value, except the current one
        for (let i = 0; i < this.all_fields.length; i++) {
          const innerGroup = this.all_fields.at(i);
          if (i !== fieldIndex) {
            innerGroup.get('XaxisFormat')?.setValue(value, { emitEvent: false });
          }
        }
      }
    });

    
    
  }

  generateUniqueId(): number {
    this.widgetIdCounter++;
    return Date.now() + this.widgetIdCounter; // Use timestamp and counter for uniqueness
  }
  

//   addTile(key: any) {
//     console.log('this.noOfParams check', this.noOfParams);
  
//     // Only proceed if the key is 'chart'
//     if (key === 'Stackedchart') {
//       const uniqueId = this.generateUniqueId();
//       console.log('this.createChart.value:', this.createChart.value);  // Log form values for debugging
  
//       // Check for highchartsOptionsJson
//       let highchartsOptionsJson = this.createChart.value.highchartsOptionsJson || {};
      
//       // Update highchartsOptionsJson


// // If it's stringified, parse it to an object first
// if (typeof highchartsOptionsJson === 'string') {
//   highchartsOptionsJson = JSON.parse(highchartsOptionsJson);
// }

// // Update the chart options dynamically
// const updatedHighchartsOptionsJson = {
//   ...highchartsOptionsJson,
//   title: {
//     ...highchartsOptionsJson.title,
//     text: this.createChart.value.chart_title || ''  // Update the title dynamically
//   }
// };
// console.log('updatedHighchartsOptionsJson check',updatedHighchartsOptionsJson)
// this.chartFinalOptions =JSON.stringify(updatedHighchartsOptionsJson,null,4)
// console.log('this.chartFinalOptions check',this.chartFinalOptions)
    
  
//       // Create the new tile object with all the required properties
//       const newTile = {
//         id: uniqueId,
//         x: 0,
//         y: 0,
//         rows: 20,
//         cols: 20,
//         rowHeight: 100,
//         colWidth: 100,
//         fixedColWidth: true,
//         fixedRowHeight: true,
//         grid_type: 'Stackedchart',
  
//         chart_title: this.createChart.value.chart_title || '',  // Ensure this value exists
//         fontSize: `${this.createChart.value.fontSize || 16}px`,  // Provide a fallback font size
//         themeColor: 'var(--bs-body-bg)',  // Default theme color
//         chartConfig: this.createChart.value.all_fields || [],  // Default to empty array if missing
//         filterForm: this.createChart.value.filterForm || {},
//         // filterParameter: this.createChart.value.filterParameter || {},
//         // filterDescription: this.createChart.value.filterDescription || '',
//         custom_Label: this.createChart.value.custom_Label || '',
//         toggleCheck: this.createChart.value.toggleCheck ||'',
//         dashboardIds: this.createChart.value.dashboardIds||'',
//         selectType: this.createChart.value.selectType ||'',
//         miniForm:this.createChart.value.miniForm || '',
//         MiniTableNames:this.createChart.value.MiniTableNames ||'',
//         MiniTableFields:this.createChart.value.MiniTableFields ,
//         minitableEquation:this.createChart.value.minitableEquation,
//         EquationOperationMini:this.createChart.value.EquationOperationMini,
//         add_fields:this.createChart.value.add_fields,
//         DrillConfig:this.createChart.value.drill_fields || [],
//         DrillDownType:this.createChart.value.DrillDownType ||'',
//         DrillFilter:this.createChart.value.DrillFilter ||'',
//         DrillFilterLevel:this.createChart.value.DrillFilterLevel ||'',
//         dataLabelFontColor:this.createChart.value.dataLabelFontColor,
//         chartBackgroundColor1:this.createChart.value.chartBackgroundColor1,
//         chartBackgroundColor2:this.createChart.value.chartBackgroundColor2,
//         filterDescription:'',
//         ChartTypeSelection:this.createChart.value.ChartTypeSelection,
    
      

  
//         highchartsOptionsJson: this.chartFinalOptions,
//         noOfParams: this.noOfParams || 0,  // Ensure noOfParams has a valid value

//       };
  
//       // Log the new tile object to verify it's being created correctly
//       console.log('New Tile Object:', newTile);
  
//       // Initialize dashboard array if it doesn't exist
//       if (!this.dashboard) {
//         console.log('Initializing dashboard array');
//         this.dashboard = [];
//       }
  
//       // Push the new tile to the dashboard array
//       this.dashboard.push(newTile);
//       console.log('Updated Dashboard:', this.dashboard);  // Log updated dashboard
  
//       // Emit the updated dashboard array
//       this.grid_details = this.dashboard;
//       this.dashboardChange.emit(this.grid_details);
  
//       // Optionally update the summary if required
//       if (this.grid_details) {
//         this.updateSummary('','add_tile');
//       }
  
//       // Optionally reset the form fields after adding the tile
//       this.createChart.patchValue({
//         widgetid: uniqueId,
//         chart_title: '',  // Reset chart title field (or leave it if needed)
//         highchartsOptionsJson: {},  // Reset chart options (or leave it if needed)
//       });
//     }
//   }
  


addTile(key: any) {
  console.log('this.noOfParams check', this.noOfParams);

  if (key === 'Stackedchart') {
    const uniqueId = this.generateUniqueId();
    console.log('this.createChart.value:', this.createChart.value);

    // Parse highchartsOptionsJson if it's a string
    let highchartsOptionsJson = this.createChart.value.highchartsOptionsJson || {};
    if (typeof highchartsOptionsJson === 'string') {
      highchartsOptionsJson = JSON.parse(highchartsOptionsJson);
    }

    // Define the click event handler
    const clickEventHandler = (event: { point: { category: any; series: { name: any }; y: any } }) => {
      const category = event.point.category;
      const seriesName = event.point.series.name;
      const value = event.point.y;

      console.log('check click event for stacked bar chart', event);
      // Example: Trigger any Angular method here
      // this.onBarClick(seriesName, category, value);
    };

    // Update the chart options without attaching the click event handler
    const updatedHighchartsOptionsJson = {
      ...highchartsOptionsJson,
      title: {
        ...highchartsOptionsJson.title,
        text: this.createChart.value.chart_title || '',
      },
      plotOptions: {
        ...highchartsOptionsJson.plotOptions,
        series: {
          ...highchartsOptionsJson.plotOptions?.series,
          events: {}, // Leave events empty for now
        },
      },
    };

    console.log('updatedHighchartsOptionsJson check', updatedHighchartsOptionsJson);

    // Stringify the chart options
    const chartOptionsStringified = JSON.stringify(updatedHighchartsOptionsJson);

    // Create the new tile object
    const newTile = {
      id: uniqueId,
      x: 0,
      y: 0,
      rows: 20,
      cols: 20,
      rowHeight: 100,
      colWidth: 100,
      fixedColWidth: true,
      fixedRowHeight: true,
      grid_type: 'Stackedchart',
      chart_title: this.createChart.value.chart_title || '',
      fontSize: `${this.createChart.value.fontSize || 16}px`,
      themeColor: 'var(--bs-body-bg)',
      chartConfig: this.createChart.value.all_fields || [],
      filterForm: this.createChart.value.filterForm || {},
      custom_Label: this.createChart.value.custom_Label || '',
      toggleCheck: this.createChart.value.toggleCheck || '',
      dashboardIds: this.createChart.value.dashboardIds || '',
      selectType: this.createChart.value.selectType || '',
      miniForm: this.createChart.value.miniForm || '',
      MiniTableNames: this.createChart.value.MiniTableNames || '',
      MiniTableFields: this.createChart.value.MiniTableFields,
      minitableEquation: this.createChart.value.minitableEquation,
      EquationOperationMini: this.createChart.value.EquationOperationMini,
      add_fields: this.createChart.value.add_fields,
      DrillConfig: this.createChart.value.drill_fields || [],
      DrillDownType: this.createChart.value.DrillDownType || '',
      DrillFilter: this.createChart.value.DrillFilter || '',
      DrillFilterLevel: this.createChart.value.DrillFilterLevel || '',
      dataLabelFontColor: this.createChart.value.dataLabelFontColor,
      chartBackgroundColor1: this.createChart.value.chartBackgroundColor1,
      chartBackgroundColor2: this.createChart.value.chartBackgroundColor2,
      filterDescription: '',
      ChartTypeSelection: this.createChart.value.ChartTypeSelection,
      highchartsOptionsJson: chartOptionsStringified, // Store the stringified chart options
      noOfParams: this.noOfParams || 0,
      ModuleNames:this.createChart.value.ModuleNames ||''
    };

    console.log('New Tile Object:', newTile);

    // Initialize dashboard array if it doesn't exist
    if (!this.dashboard) {
      console.log('Initializing dashboard array');
      this.dashboard = [];
    }

    // Push the new tile to the dashboard array
    this.dashboard.push(newTile);
    console.log('Updated Dashboard:', this.dashboard);

    // Emit the updated dashboard array
    this.grid_details = this.dashboard;
    this.dashboardChange.emit(this.grid_details);

    // Optionally update the summary if required
    if (this.grid_details) {
      this.updateSummary('', 'stacked_save');
    }

    // Optionally reset the form fields after adding the tile
    this.createChart.patchValue({
      widgetid: uniqueId,
      chart_title: '',
      highchartsOptionsJson: {},
    });

    // Reattach the click event handler after the tile is added
    const lastTile = this.dashboard[this.dashboard.length - 1];
    const parsedOptions = JSON.parse(lastTile.highchartsOptionsJson);
    parsedOptions.plotOptions.series.events.click = clickEventHandler;

    // Update the tile with the reattached event handler
    lastTile.highchartsOptionsJson = parsedOptions;
    console.log('Reattached click event handler:', lastTile.highchartsOptionsJson);
  }
}






  
  onFontColorChange(event: Event): void {
    const color = (event.target as HTMLInputElement).value;
    this.createChart.patchValue({ fontColor: color });
  }
  
  updateTile(key: any) {
    console.log('key checking from update', key);
    // console.log('highchartsOptionsJson checking',highchartsOptionsJson)
   let tempParsed = this.createChart.value.highchartsOptionsJson
    if (this.editTileIndex !== null) {
      console.log('this.editTileIndex check', this.editTileIndex);
      console.log('Tile checking for update:', this.dashboard[this.editTileIndex]);
  
  if (typeof tempParsed === 'string') {
    tempParsed = JSON.parse(tempParsed);
}

// Update the chart options dynamically
const updatedHighchartsOptionsJson = {
  ...tempParsed,
  title: {
    ...tempParsed.title,
    text: this.createChart.value.chart_title || ''  // Update the title dynamically
  },
  chart:{
    ...tempParsed.chart,
type: this.createChart.value.ChartTypeSelection || 'bar'
  }
};


// chart.type 
console.log('updatedHighchartsOptionsJson check',updatedHighchartsOptionsJson)
this.chartFinalOptions =JSON.stringify(updatedHighchartsOptionsJson,null,4)
console.log('this.chartFinalOptions check',this.chartFinalOptions)
      // Update the multi_value array with the new processed_value and constantValue

  
      // Add defensive checks for predefinedSelectRange

  
      
      console.log('this.dashboard',this.dashboard)
      // Now update the tile with the updated multi_value
      const updatedTile = {
        ...this.dashboard[this.editTileIndex], // Keep existing properties


   
    chart_title: this.createChart.value.chart_title ||'',
    // fontSize: this.createChart.value.fontSize,
    // themeColor: this.createChart.value.themeColor,
    // fontColor: this.createChart.value.fontColor,
    chartConfig: this.createChart.value.all_fields ||'',
    highchartsOptionsJson: this.chartFinalOptions,
    filterParameter:this.createChart.value.filterParameter ||'',
    filterDescription:this.createChart.value.filterDescription ||'',
    toggleCheck:this.createChart.value.toggleCheck ||'',
    dashboardIds:this.createChart.value.dashboardIds ||'',
    selectType: this.createChart.value.selectType ||'',
    miniForm:this.createChart.value.miniForm || '',
    MiniTableNames:this.createChart.value.MiniTableNames ||'',
    MiniTableFields:this.createChart.value.MiniTableFields ||'',
    minitableEquation:this.createChart.value.minitableEquation ||'',
    EquationOperationMini:this.createChart.value.EquationOperationMini ||'',
    add_fields:this.createChart.value.add_fields ||'',
    DrillConfig:this.createChart.value.drill_fields || [],
    DrillDownType:this.createChart.value.DrillDownType ||'',
    dataLabelFontColor:this.createChart.value.dataLabelFontColor ||'',
    chartBackgroundColor1:this.createChart.value.chartBackgroundColor1 ||'',
    chartBackgroundColor2:this.createChart.value.chartBackgroundColor2 ||'',
    ChartTypeSelection:this.createChart.value.ChartTypeSelection || 'bar',
    ModuleNames:this.createChart.value.ModuleNames ||'',

    // filterForm:this.createChart.value.filterForm,
    // filterParameter:this.createChart.value.filterParameter,
    // filterDescription:this.createChart.value.filterDescription,
    // Include noOfParams
    noOfParams:this.dashboard[this.editTileIndex].noOfParams,


      };
      console.log('updatedTile checking', updatedTile);
  
      // Update the dashboard array using a non-mutative approach
      this.dashboard = [
        ...this.dashboard.slice(0, this.editTileIndex),
        updatedTile,
        ...this.dashboard.slice(this.editTileIndex + 1),
      ];
  
      console.log('Updated Tile Details:', this.dashboard[this.editTileIndex]);
  
      // Update the grid_details as well
      this.all_Packet_store.grid_details[this.editTileIndex] = {
        ...this.all_Packet_store.grid_details[this.editTileIndex],
        ...updatedTile,
      };
      console.log(
        '  this.all_Packet_store.grid_details[this.editTileIndex]',
        this.all_Packet_store.grid_details[this.editTileIndex]
      );
      console.log('this.dashboard checking from gitproject', this.dashboard);
      this.grid_details = this.dashboard;
      this.dashboardChange.emit(this.grid_details);
  
      if (this.grid_details) {
        this.updateSummary(this.all_Packet_store,'update_tile');
      }
      this.cdr.detectChanges()
  
      console.log('this.dashboard check from updateTile', this.dashboard);
      console.log('Updated all_Packet_store.grid_details:', this.all_Packet_store.grid_details);
  
      // Reset the editTileIndex after the update
      this.editTileIndex = null;
    } else {
      console.error('Edit index is null. Unable to update the tile.');
    }
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
// alert('cloned tile')
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
        // alert('grid details is there')
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


// openStackedChartModal(tile: any, index: number) {
//   console.log('Index checking:', index); // Log the index

//   if (tile) {
//     this.selectedTile = tile;
//     this.editTileIndex = index ?? null;
//     this.paramCount = tile.noOfParams;
//     this.highchartsOptionsJson = JSON.parse(tile.highchartsOptionsJson);

//     const fontSizeValue = tile.fontSize ? parseInt(tile.fontSize.replace('px', ''), 10) : 14;

//     let parsedFilterParameter = [];
//     try {
//       parsedFilterParameter = tile.filterParameterLine ? JSON.parse(tile.filterParameterLine) : [];
//     } catch (error) {
//       console.error('Error parsing filterParameter:', error);
//     }

//     let parsedMiniTableFields = [];
//     try {
//       parsedMiniTableFields = typeof tile.MiniTableFields === 'string'
//         ? JSON.parse(tile.MiniTableFields)
//         : tile.MiniTableFields;
//     } catch (error) {
//       console.error('Error parsing MiniTableFields:', error);
//     }

//     // ✅ Initialize form group and valueChanges
//     this.initializeTileFields();

//     // ✅ Now patch values into the form
//     this.createChart.patchValue({
//       add_fields: tile.add_fields,
//       chart_title: tile.chart_title,
//       highchartsOptionsJson: JSON.stringify(this.highchartsOptionsJson, null, 4),
//       custom_Label: tile.custom_Label,
//       fontSize: fontSizeValue,
//       filterDescription: tile.filterDescription,
//       filterForm: tile.filterForm,
//       filterFormList: tile.filterFormList,
//       filterParameterLine: parsedFilterParameter,
//       miniForm: tile.miniForm || '',
//       MiniTableNames: tile.MiniTableNames || '',
//       MiniTableFields: parsedMiniTableFields,
//       minitableEquation: tile.minitableEquation,
//       EquationOperationMini: tile.EquationOperationMini,
//       dashboardIds: tile.dashboardIds,
//       toggleCheck: tile.toggleCheck,
//       selectType: tile.selectType,
//       DrillDownType: tile.DrillDownType,
//       multiColorCheck:tile.multiColorCheck,
//       dataLabelFontColor:tile.dataLabelFontColor,
//       chartBackgroundColor1:tile.chartBackgroundColor1,
//       chartBackgroundColor2:tile.chartBackgroundColor2,
//       ChartTypeSelection:tile.ChartTypeSelection
//     });

//     // ✅ Populate all_fields and drill_fields separately
//     this.all_fields.clear(); // Clear existing FormArray
//     const populatedAllFields = this.repopulate_fields(tile);
//     // populatedAllFields.controls.forEach(control => this.all_fields.push(control));

//     this.drill_fields.clear(); // Clear existing FormArray
//     const populatedDrillFields = this.repopulateDrill_fields(tile);
//     populatedDrillFields.controls.forEach(control => this.drill_fields.push(control));

//     // ✅ Manually trigger addControls and updateDrillFields once
//     const fakeEvent = { target: { value: tile.add_fields } };
//     this.addControls(fakeEvent, 'html');
//     this.updateDrillFields();

//     this.isEditMode = true;
//   } else {
//     this.selectedTile = null;
//     this.isEditMode = false;
//     this.createChart.reset();
//   }

//   this.cdr.detectChanges();
// }

openStackedChartModal(tile: any, index: number) {
  console.log('Index checking:', index);

  if (tile) {
    this.selectedTile = tile;
    this.editTileIndex = index ?? null;
    this.paramCount = tile.noOfParams;

    // Step 1: Parse the highchartsOptionsJson from the tile
    let parsedHighchartsOptionsJson;
    try {
      parsedHighchartsOptionsJson = JSON.parse(tile.highchartsOptionsJson);
    } catch (error) {
      console.error('Error parsing highchartsOptionsJson:', error);
      return;
    }

    // Step 2: Type assertion to tell TypeScript this is an object with `plotOptions` (for access)
    const highchartsOptionsJson = parsedHighchartsOptionsJson as { 
      plotOptions: { series: { events: { click: Function } } };
    };

    // Step 3: Check if `plotOptions` and `series` exist before trying to add the event handler
    if (highchartsOptionsJson?.plotOptions?.series) {
      // Step 4: Reattach the event handler
      const clickEventHandler = function (event: { point: { category: any; series: { name: any; }; y: any; }; }) {
        const category = event.point.category;
        const seriesName = event.point.series.name;
        const value = event.point.y;
        console.log('check click event for stacked bar chart', event);
      };

      // Reattach the click event handler
      highchartsOptionsJson.plotOptions.series.events = {
        click: clickEventHandler
      };
    } else {
      console.error('Invalid structure for plotOptions or series.');
      return;
    }

    // Step 5: Proceed with setting up the form and other operations
    const fontSizeValue = tile.fontSize ? parseInt(tile.fontSize.replace('px', ''), 10) : 14;

    let parsedFilterParameter = [];
    try {
      parsedFilterParameter = tile.filterParameterLine ? JSON.parse(tile.filterParameterLine) : [];
    } catch (error) {
      console.error('Error parsing filterParameter:', error);
    }

    let parsedMiniTableFields = [];
    try {
      parsedMiniTableFields = typeof tile.MiniTableFields === 'string'
        ? JSON.parse(tile.MiniTableFields)
        : tile.MiniTableFields;
    } catch (error) {
      console.error('Error parsing MiniTableFields:', error);
    }

    // Initialize form group and valueChanges
    this.initializeTileFields();

    // Patch the values into the form
    this.createChart.patchValue({
      add_fields: tile.add_fields,
      chart_title: tile.chart_title,
      highchartsOptionsJson: JSON.stringify(highchartsOptionsJson, null, 4),
      custom_Label: tile.custom_Label,
      fontSize: fontSizeValue,
      filterDescription: tile.filterDescription,
      filterForm: tile.filterForm,
      filterFormList: tile.filterFormList,
      filterParameterLine: parsedFilterParameter,
      miniForm: tile.miniForm || '',
      MiniTableNames: tile.MiniTableNames || '',
      MiniTableFields: parsedMiniTableFields,
      minitableEquation: tile.minitableEquation,
      EquationOperationMini: tile.EquationOperationMini,
      dashboardIds: tile.dashboardIds,
      toggleCheck: tile.toggleCheck,
      selectType: tile.selectType,
      DrillDownType: tile.DrillDownType,
      multiColorCheck: tile.multiColorCheck,
      dataLabelFontColor: tile.dataLabelFontColor,
      chartBackgroundColor1: tile.chartBackgroundColor1,
      chartBackgroundColor2: tile.chartBackgroundColor2,
      ChartTypeSelection: tile.ChartTypeSelection,
      ModuleNames:tile.ModuleNames || ''
    });

    // Populate fields and drill fields
    this.all_fields.clear(); // Clear existing FormArray
    const populatedAllFields = this.repopulate_fields(tile);
    this.drill_fields.clear(); // Clear existing FormArray
    const populatedDrillFields = this.repopulateDrill_fields(tile);
    populatedDrillFields.controls.forEach(control => this.drill_fields.push(control));

    // Manually trigger addControls and updateDrillFields
    const fakeEvent = { target: { value: tile.add_fields } };
    this.addControls(fakeEvent, 'html');
    this.updateDrillFields();

    this.isEditMode = true;
  } else {
    this.selectedTile = null;
    this.isEditMode = false;
    this.createChart.reset();
  }

  this.cdr.detectChanges();
}




repopulateDrill_fields(getValues: any): FormArray {
  console.log('getValues check from readbackDrill', getValues);

  if (!getValues) {
    console.warn('No data to repopulate');
    return this.drill_fields;
  }

  const noOfParams = getValues.add_fields || '';
  this.drill_fields.clear();

  let parsedChartConfig: any[] = [];
  try {
    if (typeof getValues.DrillConfig === 'string') {
      parsedChartConfig = JSON.parse(getValues.DrillConfig || '[]');
    } else if (Array.isArray(getValues.DrillConfig)) {
      parsedChartConfig = getValues.DrillConfig;
    }
  } catch (error) {
    console.error('Error parsing chartConfig:', error);
    parsedChartConfig = [];
  }

  console.log('Parsed chartConfig:', parsedChartConfig);
  const readCount = this.createChart?.get('add_fields')?.value;
  console.log('readCount checking the value ', readCount);

  if (parsedChartConfig.length > 0) {
    parsedChartConfig.forEach((configItem) => {
      const conditionArray = this.fb.array([]);
      const conditions = Array.isArray(configItem.conditions) ? configItem.conditions : [];

      conditions.forEach((condition: any) => {
        conditionArray.push(
          this.fb.group({
            drillTypeFields: [condition.drillTypeFields || ''],
            drillTypeLabel: [condition.drillTypeLabel || ''],
            drillTypePrimary:[condition.drillTypePrimary ||''],
     
          })
        );
      });

      this.drill_fields.push(
        this.fb.group({
          conditions: conditionArray
        })
      );
    });
  } else {
    console.warn('No parsed data to populate fields');

    const parsedCount = parseInt(noOfParams, 10);
    if (!isNaN(parsedCount) && parsedCount > 0) {
      for (let i = 0; i < parsedCount; i++) {
        this.drill_fields.push(this.createDrillField());
      }
    }
  }

  console.log('Final FormArray Values:', this.drill_fields.value);

  return this.drill_fields;
}

preDefinedRange(preDefined:any){
  console.log('preDefined check',preDefined)

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
    if (typeof getValues.chartConfig === 'string') {
      parsedChartConfig = JSON.parse(getValues.chartConfig || '[]');
    } else if (Array.isArray(getValues.chartConfig)) {
      parsedChartConfig = getValues.chartConfig;
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
      const columnVisibility = Array.isArray(configItem.columnVisibility)
        ? configItem.columnVisibility.map((item: { text: any; value: any; }) => ({
            text: item.text || '',
            value: item.value || '',
          }))
        : [];

      // Handle filterParameter dynamically
      const filterParameterValue = Array.isArray(configItem.filterParameter)
        ? configItem.filterParameter
        : [];

      // Handle filterParameter1 dynamically
      const filterParameter1Value = Array.isArray(configItem.filterParameter1)
        ? configItem.filterParameter1
        : [];

      const arrayParameter = Array.isArray(configItem.parameterName)
        ? configItem.parameterName
        : [];

      const dateParameter = Array.isArray(configItem.XaxisFormat)
        ? configItem.XaxisFormat
        : [];

      // Create and push FormGroup into FormArray
      this.all_fields.push(
        this.fb.group({
          formlist: [configItem.formlist || '', Validators.required],
          parameterName: this.fb.control(arrayParameter, Validators.required),
          primaryValue: [configItem.primaryValue || '', Validators.required],
          groupByFormat: [configItem.groupByFormat || '', Validators.required],
          constantValue: [configItem.constantValue || ''],
          selectedRangeType: [configItem.selectedRangeType || '', Validators.required],
          // selectFromTime: [configItem.selectFromTime || ''],
          // selectToTime: [configItem.selectToTime || ''],
          parameterValue: [configItem.parameterValue || ''],
          columnVisibility: this.fb.control(columnVisibility),
          filterParameter: this.fb.control(filterParameterValue),
          filterParameter1: this.fb.control(filterParameter1Value),
          formatType: [configItem.formatType || '', Validators.required],
          undefinedCheckLabel: [configItem.undefinedCheckLabel || ''],
          custom_Label: [configItem.custom_Label || '', Validators.required],
          filterDescription: [configItem.filterDescription || ''],
          XaxisFormat: this.fb.control(dateParameter)
        })
      );

      // Log the added FormGroup for debugging
      console.log(`FormGroup at index ${index}:`, this.all_fields.at(index).value);
    });
  } else {
    console.warn('No parsed data to populate fields');
  }

  console.log('Final FormArray Values:', this.all_fields.value);

  // **Validate if any required field is missing**
  const allFieldsValid = this.validateRequiredFields();
  if (!allFieldsValid) {
    console.error('Required fields missing in the form');
    // alert('Some required fields are missing. Please complete all required fields.');
    return this.all_fields; // Return without proceeding with the update
  }

  return this.all_fields;
}





validateRequiredFields(): boolean {
  let isValid = true;

  // Loop through all controls and check for required fields
  this.all_fields.controls.forEach((control: AbstractControl, index: number) => {
    // Cast AbstractControl to FormGroup
    const formGroupControl = control as FormGroup;
  
    if (
      formGroupControl.get('formlist')?.invalid ||
      formGroupControl.get('parameterName')?.invalid ||
      formGroupControl.get('primaryValue')?.invalid ||
      formGroupControl.get('groupByFormat')?.invalid ||
      formGroupControl.get('selectedRangeType')?.invalid ||
      formGroupControl.get('formatType')?.invalid ||
      formGroupControl.get('custom_Label')?.invalid
    ) {
      isValid = false;
      console.error('A required field is missing or invalid');
    }
  });
  

  return isValid;
}


validateAndUpdate() {
  let isFormValid = true;
  // this.formValidationFailed = true; // Assume valid initially

  Object.values(this.createChart.controls).forEach(control => {
    if (control instanceof FormControl) {
      control.markAsTouched();
      control.updateValueAndValidity();

      if (control.hasError('required') && !control.value) {
        console.error('Required field is empty, update stopped');
        isFormValid = false;
        this.formValidationFailed = false;
      }
    } else if (control instanceof FormArray) {
      control.controls.forEach((controlItem) => {
        if (controlItem instanceof FormGroup) {
          Object.values(controlItem.controls).forEach(innerControl => {
            innerControl.markAsTouched();
            innerControl.updateValueAndValidity();

            if (innerControl.hasError('required') && !innerControl.value) {
              console.error('Required field is empty in FormGroup, update stopped');
              isFormValid = false;
              this.formValidationFailed = false;
            }
          });
        }
      });
    }
  });

  const allFieldsValid = this.createChart.get('all_fields')?.valid;
  console.log('check form array', allFieldsValid);
  console.log('this.formValidationFailed checking from ui', this.formValidationFailed);
  console.log('isFormValid checking', isFormValid);

  if (isFormValid && this.createChart.valid && allFieldsValid) {
    this.updateTile('Stackedchart');
    this.modal.dismiss();
  } else {
    console.error('Form is invalid. Cannot update.');
    // Optional: Keep the message visible for a few seconds then hide
    setTimeout(() => {
      this.formValidationFailed = true;
    }, 5000);
  }
}





toggleCheckbox1(themeOrEvent: any): void {
  // If it's a color picker input (e.g., from a custom input field)
  if (themeOrEvent.target) {
    this.selectedColor = themeOrEvent.target.value;  // Get the color from the input field
  } else {
    // Predefined theme selection (from color boxes)
    const theme = themeOrEvent;

    // Clear the selected state for all themes (ensure only one is selected)
    this.themes.forEach(t => t.selected = false);  // Reset selection for all themes

    // Toggle the selection state of the clicked theme
    theme.selected = true;  // Select the clicked theme

    this.selectedColor = theme.color;  // Set selected color based on the clicked theme
  }

  // Update the form control with the selected color
  this.createChart.get('themeColor')?.setValue(this.selectedColor);
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
  
  
  onMouseLeave(): void {
    this.isHovered = false;
  }



  getDynamicParams(index: number): any[] {
    return this.dynamicParamMap.get(index) || [];

  }


  getDynamicDateParams(index: number): any[] {
    return this.dynamicDateParamMap.get(index) || [];

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
              value: 'created_time',
              text: 'Created Time' // You can customize the label here if needed
            });
          }

          if (parsedMetadata.updated_time) {
            this.listofDynamicParamFilter.push({
              value: 'updated_time',
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



  dynamicparameterValue(event: any, index: any): void {
    console.log('Event check for dynamic param:', event);
    console.log('Index check:', index);
  
    // Access the specific FormGroup from the FormArray
    const formDynamicParam = this.all_fields.at(index) as FormGroup;
  
    if (!formDynamicParam) {
      console.warn(`FormGroup not found for index ${index}`);
      return;
    }
  
    // Access the filterParameter FormControl
    const filterParameter = formDynamicParam.get('filterParameter');
    console.log('filterParameter check:', filterParameter);
  
    if (event && event.value && Array.isArray(event.value)) {
      const valuesArray = event.value;
  
      if (valuesArray.length === 1) {
        // Handle single selection
        const singleItem = valuesArray[0];
        const { value, text } = singleItem; // Destructure value and text
        console.log('Single Selected Item:', { value, text });
  
        if (filterParameter) {
          // Update the form control with the single value (object)
          filterParameter.setValue([{ value, text }]); // Store as an array of objects
          this.cdr.detectChanges(); // Trigger change detection
        } else {
          console.warn(`filterParameter control not found in FormGroup for index ${index}`);
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
  
        if (filterParameter) {
          // Update the form control with the concatenated values (array of objects)
          filterParameter.setValue(formattedValues);
          this.cdr.detectChanges(); // Trigger change detection
        } else {
          console.warn(`filterParameter control not found in FormGroup for index ${index}`);
        }
  
        // Store the multiple selected parameters
        this.selectedParameterValue = formattedValues;
      }
    } else {
      console.warn('Invalid event structure or missing value array:', event);
    }
  }
  
  
  

  onAdd(index: any): void {
    console.log('Index checking from onAdd:', index);
  
    // Access the specific form group from the form array
    const formDescParam = this.all_fields.at(index) as FormGroup;
  
    // Retrieve the `filterDescription` control from the group
    const groupByFormatControl = formDescParam.get('filterDescription');
  
    if (!groupByFormatControl) {
      console.warn(`filterDescription control not found for index ${index}.`);
      return;
    }
  
    // Get existing text from `filterDescription`
    let existingText = groupByFormatControl.value?.trim() || '';
    console.log('Existing Text before:', existingText);
  
    // Capture the selected parameters
    const selectedParameters = this.selectedParameterValue;
    console.log('Selected parameters checking:', selectedParameters);
  
    let newEquationParts: string[] = [];
  
    if (Array.isArray(selectedParameters)) {
      // Format the selected parameters and remove already existing ones
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
    console.log('Filtered newEquationParts:', newEquationParts);
  
    // Construct the new equation string
    const newEquation = newEquationParts.join(' && ');
  
    // Append new equation to existing text properly
    existingText = existingText ? `${existingText} && ${newEquation}` : newEquation;
  
    // Ensure we don't have redundant `&&`
    existingText = existingText.replace(/&&\s*&&/g, '&&').trim();
  
    console.log(`Updated Equation for index ${index}:`, existingText);
  
    // Update the specific form control value for `filterDescription`
    groupByFormatControl.patchValue(existingText);
  
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
      this.selectedText = event[0].data.text;  // Adjust based on the actual structure
      console.log('Selected Form Text:', this.selectedText);
      this.getFormControlValue(this.selectedText); 

      if (this.selectedText) {
        this.fetchDynamicFormData(this.selectedText, index);
      }
    } else {
      console.error('Event data is not in the expected format:', event);
    }
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
  
    { value: 'Count', text: 'Count' },
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
  showStatusValues = [
    { value: 'Open', text: 'Open' },
    { value: 'In-Progress', text: 'In-Progress' },
    { value: 'Solved', text: 'Solved' },
    { value: 'Closed', text: 'Closed' },



  ]


  showCustomValues = [

    { value: 'Hourly', text: 'Hourly' },
    { value: 'Daily', text: 'Daily' },
    { value: 'Hour of the Day', text: 'Hour of the Day' },
    { value: 'Weekly', text: 'Weekly' },
    { value: 'Day of Week', text: 'Day of Week' },
    { value: 'Monthly', text: 'Monthly' },
    { value: 'Day of Month', text: 'Day of Month' },
    { value: 'Yearly', text: 'Yearly' },
    { value: 'Any', text: 'Any' }
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

  openModalCalender(fieldIndex: number) {
    console.log('Field Index:', fieldIndex);
    this.calenderIndex = fieldIndex;
  
    const modalRef = this.modalService.open(this.calendarModalChart);
    modalRef.result.then(
      (result) => {
        console.log('Modal closed with:', result);
        // Handle modal close
      },
      (reason) => {
        console.log('Modal dismissed with:', reason);
      }
    );
  }
  
  

  handleModalClose(selectedValue: string) {
    // Logic to handle what happens after the modal closes
    console.log('Handling post modal close logic with value:', selectedValue);
    // You can update your UI or state here based on the selectedValue
  }
  isTooltipDate = (m: Dayjs) => {
    // Ensure tooltips is an array and has valid data
    if (!Array.isArray(this.tooltips) || this.tooltips.length === 0) {
      return false;
    }
  
    const tooltip = this.tooltips.find((tt) => tt.date.isSame(m, 'day'));
    return tooltip ? tooltip.text : false;
  };
  
  
  isCustomDate = (date: Dayjs) => {
    return date.month() === 0 || date.month() === 6 ? 'mycustomdate' : false;
  };
  isInvalidDate = (m: Dayjs) => {
    return this.invalidDates.some((d) => d.isSame(m, 'day'));
  };
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

  

toggleCheckbox(theme: any): void {
  // Clear the 'selected' state for all themes
  this.themes.forEach(t => t.selected = false);

  // Set the clicked theme as selected
  theme.selected = true;

  // Update the selected color based on the theme selection
  this.selectedColor = theme.color;
  console.log('this.selectedColor checking', this.selectedColor);

  // Update the form control with the selected color
  // this.createChart.get('themeColor')?.setValue(this.selectedColor);
  // console.log('Updated themeColor:', this.createChart.get('themeColor')?.value);

  // Manually trigger change detection if required
  this.cdr.detectChanges();
}

  onColorChange1(event: Event) {
    // const colorInput = event.target as HTMLInputElement;
    // this.createChart.get('themeColor')?.setValue(colorInput.value)

    // console.log('Color changed:', this.createChart.get('themeColor')?.value);
  }


  locale = {
    firstDay: 1,
    startDate: dayjs().startOf('day'),
    endDate: dayjs().endOf('day'),
    format: 'DD.MM.YYYY',
    applyLabel: 'Apply',
    cancelLabel: 'Cancel',
    fromLabel: 'From',
    toLabel: 'To',
  };


  defaultHighchartsOptionsJson: any = {
    chart: {
      backgroundColor: {
        "linearGradient": [
            0,
            0,
            100,
            1000
        ],
        stops: [
            [
             0,
                "rgb(255, 255, 255)"
            ],
            [
   1,
                "rgb(200, 200, 255)"
            ]
        ]
      },
      type: 'bar', // Use 'bar' for horizontal stacked bar, 'column' for vertical
      // backgroundColor: 'var(--bs-body-bg)',
    },
    title: {
      text: 'Stacked Bar Chart',
      style: {
        color: 'var(--bs-body-color)',
      },
    },
    tooltip: {
      pointFormat: '{series.name}: <b>{point.y}</b>',
    },
    exporting: {
      enabled: false,
    },
    credits: {
      enabled: false,
    },
    xAxis: {
      categories: [], // Add your categories dynamically
      title: {
        text: null,
      },
      labels: {
        style: {
          color: 'var(--bs-body-color)',
        },
      },
    },
    yAxis: {
      min: 0,
      title: {
        text: 'Total Value',
        align: 'high',
      },
      labels: {
        overflow: 'justify',
        style: {
          color: 'var(--bs-body-color)',
        },
      },
      gridLineDashStyle: 'dash',
    },
    legend: {
      enabled: true,
      layout: 'horizontal',
      align: 'center',
      verticalAlign: 'bottom',
    },
    plotOptions: {
      series: {
        stacking: 'normal', // 'normal' for stacked bars, 'percent' for percentage stacked
        dataLabels: {
          enabled: true,
          format: '{point.y}', // Show values on bars
          style: {
            fontSize: '1em',
            textOutline: 'none',
          },
        },

      },
    },
    series: [
      {
        data: [],
        marker: {
            enabled: true
        }
      }


    ],  
  
  };
  



  // Method to initialize the chart using the form's JSON value
initializeChart(): void {
  const highchartsOptionsJson = this.highchartsForm.value.highchartsOptionsJson;
  console.log('highchartsOptionsJson check',highchartsOptionsJson)

  if (highchartsOptionsJson) {  // Check if the JSON string is neither null nor undefined
    try {
      // Parse the JSON entered in the textarea
      const highchartsOptions = JSON.parse(highchartsOptionsJson);

      // Check if the options are valid and initialize the chart
      if (highchartsOptions && typeof highchartsOptions === 'object') {
        Highcharts.chart('chartContainer', highchartsOptions); // Create the Highcharts chart
      } else {
        console.error('Invalid Highcharts options');
      }
    } catch (e) {
      console.error('Invalid JSON:', e); // Catch invalid JSON errors
    }
  } else {
    console.error('Highcharts options are empty or undefined');
  }
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
  { value: 'Rupee with Percentage', text: 'Rupee with Percentage' },


]




FormatXaxisValues = [

  { value: 'Default', text: 'Default' },
  // { value: 'Default', text: 'Default' },
]

validateAndSubmit() {
  if (this.createChart.invalid) {
    // ✅ Mark all fields as touched to trigger validation messages
    Object.values(this.createChart.controls).forEach(control => {
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
  this.addTile('Stackedchart');
  this.modal.dismiss();
}

setUserSatus(){
  this.userIsChanging = true
  this.cdr.detectChanges()
}
selectedOperationMini(readOperation:any){
  console.log('readOperation',readOperation)
  this.readOperation = readOperation[0].value

}
checkSelectedFormPram(readForm:any){
  console.log('readForm checking',readForm)
  this.FormRead = readForm[0].value
  this.fetchMiniTable(this.FormRead)

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


miniTableNames(readMinitableName:any){
console.log('readMinitableName',readMinitableName)
this.readMinitableName = readMinitableName[0].value
this.readMinitableLabel = readMinitableName[0].data.label
console.log('this.readMinitableLabel',this.readMinitableLabel)

this.fetchMiniTableHeaders(this.readMinitableName)

}

async fetchMiniTableHeaders(item: any) {
  console.log('minitable name check',item)
  // console.log('')
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

        this.cd.detectChanges()
        
        console.log('Formatted Headers:', this.filteredHeaders);
    }
} catch (err) {
    console.log("Error fetching the dynamic form data", err);
}
}
showValuesForMini = [
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
  const miniTableFieldsValue = this.createChart.get('MiniTableFields')?.value;
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
      this.createChart.controls['minitableEquation'].setValue("("+equation+")");
  } else {
      console.log('Error: One or more required values are missing.');
  }
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

miniTableFieldsRead(readFields:any){
  console.log('readFields',readFields)
  if (readFields && readFields.value && Array.isArray(readFields.value)) {
    // Extract all 'value' properties from the selected items
    const selectedValues = readFields.value.map((item: any) => item.value);

    console.log('Extracted Values:', selectedValues);
    
    // Store the extracted values in a variable
    this.selectedMiniTableFields = selectedValues;
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

}
