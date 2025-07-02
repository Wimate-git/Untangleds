import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, QueryList, SimpleChanges, TemplateRef, ViewChild, ViewChildren } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AgGridAngular } from 'ag-grid-angular';
import pdfMake from 'pdfmake/build/pdfmake';
import * as XLSX from 'xlsx';  
import { GridApi ,Column} from 'ag-grid-community';
import { SharedService } from 'src/app/pages/shared.service';
import { APIService } from 'src/app/API.service';
import { SummaryEngineService } from 'src/app/pages/summary-engine/summary-engine.service';

@Component({
  selector: 'app-multi-table-ui',

  templateUrl: './multi-table-ui.component.html',
  styleUrl: './multi-table-ui.component.scss'
})
export class MultiTableUiComponent implements OnInit{
  @Input() item:any
  @Input() index:any
  @Input() isEditModeView:any;
  @Input() summaryDashboardUpdate:any;
  @Input() summaryDashboardView:any;

  @Input() hidingLink:any;
  @Input() isFullscreen: boolean = false; 
  @ViewChild('agGrid') agGrid!: AgGridAngular;
  tableDataWithFormFilters: any = [];
  @ViewChildren(AgGridAngular) agGrids!: QueryList<AgGridAngular>;
  iconCellRenderer: (params: any) => string; 
  // @Output() sendCellInfo:
  @Output() sendCellInfo = new EventEmitter<any>();
  @Output() sendminiTableData = new EventEmitter<any>();
  @Output() sendFormNameForMini = new EventEmitter<any>();
  pinnedBottomRowData: any[];
  
  pageSizeOptions = [10, 25, 50, 100];

  @Output() dataTableCellInfo = new EventEmitter<any>();
  
  @Output() customEvent = new EventEmitter<{ arg1: any; arg2: number }>();
  @Output() customEvent1 = new EventEmitter<{ data: { arg1: any; arg2: number }; all_Packet_store: any }>();
  @Output() customEvent2 = new EventEmitter<{ data: { arg1: any; arg2: number }; all_Packet_store: any }>();
  @Input()  all_Packet_store: any;
 
  @Input () hideButton:any
  iframeUrl: any;
  selectedMarkerIndex: any;
  tile1Config: any;
  splitData: any;
  descriptionData: any;
  primaryValue: any;
  tabledata: any;
  parsedTableData: any;
  rowData: any;
  columnDefs: any;
  private gridApi!: GridApi;
  private gridColumnApi!: Column;
  columnApi: any;
  parsedColumns: any;
  columnLabelsArray: any;
  mutitableColumns: any;
  extractRowData: any;
  extractFormName: any;
  getLoggedUser: any;
  SK_clientID: any;
  formName: any;
  customLabel: any;
  finalColumns: any;
  extractedTables: unknown[];
  extractedTableHeaders: any;
  storeFormLabel: any;

  
  ngOnInit(){
    console.log('item chacke',this.item.grid_details)
    this.getLoggedUser = this.summaryConfiguration.getLoggedUserDetails()
    console.log('this.getLoggedUser read for redirect',this.getLoggedUser)
  
  
    this.SK_clientID = this.getLoggedUser.clientID;
    this.summaryService.lookUpData$.subscribe((data: any)=>{
      console.log('data check>>> from multiTable',data)
  let tempCharts:any=[]
  data.forEach((packet: any,matchedIndex:number) => {
  
  if(packet.grid_type == 'MultiTableWidget'&& this.index==matchedIndex && packet.id === this.item.id){
    tempCharts[matchedIndex] = packet
    // this.sendRowDynamic = this.formatDateFields(this.sendRowDynamic);
    // console.log('Formatted Data:', this.sendRowDynamic);
    console.log('packet checking from multitable widget',packet)
    setTimeout(() => {
      this.createtableWidget(packet)
      
    }, 500);
  
   
  }
  });
  
  
  
  
  
      
      // console.log("✅ Matched Charts:", matchedCharts);
      
    
      
      
    })
  
  
  }

  async createtableWidget(mapWidgetData?:any){
    
    if(mapWidgetData){
      console.log("tile data check from multi table Widget",this.item)
      this.extractFormName = mapWidgetData.formlist
      console.log('this.extractFormName',this.extractFormName)
      this.sendFormNameForMini.emit(this.extractFormName)
  
  
      this.mutitableColumns = JSON.parse(mapWidgetData.multiTableWidget_Config)
      console.log('this.mutitableColumns checking',this.mutitableColumns)
      
  // Parse the conditions
  this.parsedColumns = JSON.parse(mapWidgetData.conditions);
  console.log('this.parsedColumns checking', this.parsedColumns);
  
  // Extract columnLabel values
  const columnLabels = this.parsedColumns.map((column: { columnLabel: string }) => column.columnLabel);
  
  // Log or store the extracted column labels
  console.log('Extracted column labels:', columnLabels);
  
  // Store in a variable
  this.columnLabelsArray = columnLabels; // Example variable to hold the column labels
  console.log('this.columnLabelsArray checking',this.columnLabelsArray)
  
  
  
    
  
     
  
     
  this.tabledata = mapWidgetData.multiTableWidget_Config; // This will contain your data
  console.log('description check', this.tabledata);
  
  
  
  try {
    this.tabledata = mapWidgetData.multiTableWidget_Config; // Source data for columns
    console.log('description check', this.tabledata);
  
    // Parse tableWidget_Config
    this.parsedTableData = JSON.parse(this.tabledata);
    console.log('this.parsedTableData checking', this.parsedTableData);
  
    const tableWidgetColumns = this.parsedTableData.map((column: { text: any; value: string; }) => ({
      headerName: column.text || 'Default Header',
      field: column.value,
      sortable: true,
      filter: true,
      resizable: true,
      cellRenderer: (column.value === 'dynamic_table_values') ? this.iconCellRenderer : undefined,
    }));
    
    
    console.log('tableWidget column definitions:', tableWidgetColumns);
    
    // Define the cell renderer function
  
  
    // Include additional columns from columnLabelsArray
    const additionalColumns = this.columnLabelsArray
    .filter((label: any) => label && label.trim() !== '')
    .map((label: any) => ({
      headerName: label,
      field: label,
      sortable: true,
      filter: true,
      resizable: true,
    }));
  
  this.columnDefs = [...tableWidgetColumns, ...additionalColumns];
  
    console.log('Final column definitions:', this.columnDefs);
        this.extractRowData = JSON.parse(mapWidgetData.rowData)
      console.log('this.extractRowData checking',this.extractRowData)
    console.log('this.extractRowData checking from',this.extractRowData)
    this.sendminiTableData.emit(this.extractRowData)
  // this.rowData = this.extractRowData

  const parseRowData = this.extractRowData


  console.log('this.rowData from table Tile', parseRowData);

  const dateKeys: string[] = [];




  parseRowData.forEach((row: any) => {
    Object.keys(row).forEach((key) => {
      if (
        (key.startsWith('date') ||
         key.startsWith('datetime') ||
         key.startsWith('epoch-date') ||
         key.startsWith('epoch-datetime-local') ||
         key === 'created_time' ||
         key === 'updated_time' ||
         key.startsWith('time')) &&
        !dateKeys.includes(key)
      ) {
        dateKeys.push(key);
      }
    });
  });
  
  console.log('Extracted date/datetime keys:', dateKeys);
  
  // Pass both date and datetime keys to fetchDynamicFormData
  const matchedDateFields = await this.fetchDynamicFormData(this.extractFormName, dateKeys);
  console.log('Received date fields in caller:', matchedDateFields);
  
  
  

  this.rowData = this.formatDateFields(parseRowData,matchedDateFields);
console.log('Formatted Data: multitableWidget', this.rowData);
    // Generate dummy row data based on column definitions
  
  
    console.log('Generated dummy row data:', this.rowData);
  } catch (error) {
    console.error('Error parsing table data:', error);
  }
}
    
    
    else{
      console.log("tile data check from multi table Widget",this.item)
      this.extractFormName = this.item.formlist
      this.formName = this.item.formlist
      console.log('this.extractFormName',this.extractFormName)
      this.sendFormNameForMini.emit(this.extractFormName)
  
  
      this.mutitableColumns = JSON.parse(this.item.multiTableWidget_Config)
      console.log('this.mutitableColumns checking',this.mutitableColumns)
      
  // Parse the conditions
  this.parsedColumns = JSON.parse(this.item.conditions);
  console.log('this.parsedColumns checking', this.parsedColumns);
  
  // Extract columnLabel values
  const columnLabels = this.parsedColumns.map((column: { columnLabel: string }) => column.columnLabel);
  
  // Log or store the extracted column labels
  console.log('Extracted column labels:', columnLabels);
  
  // Store in a variable
  this.columnLabelsArray = columnLabels; // Example variable to hold the column labels
  console.log('this.columnLabelsArray checking',this.columnLabelsArray)
  
  
  
    
  
     
  
     
  this.tabledata = this.item.multiTableWidget_Config; // This will contain your data
  console.log('description check', this.tabledata);
  
  
  
  try {
    this.tabledata = this.item.multiTableWidget_Config; // Source data for columns
    console.log('description check', this.tabledata);
  
    // Parse tableWidget_Config
    this.parsedTableData = JSON.parse(this.tabledata);
    console.log('this.parsedTableData checking', this.parsedTableData);
  
    const tableWidgetColumns = this.parsedTableData.map((column: { text: any; value: string; }) => ({
      headerName: column.text || 'Default Header',
      field: column.value,
      sortable: true,
      filter: true,
      resizable: true,
      cellRenderer: (column.value === 'dynamic_table_values') ? this.iconCellRenderer : undefined,
    }));
    
    
    console.log('tableWidget column definitions:', tableWidgetColumns);
    
    // Define the cell renderer function
  
  
    // Include additional columns from columnLabelsArray
    const additionalColumns = this.columnLabelsArray
    .filter((label: any) => label && label.trim() !== '')
    .map((label: any) => ({
      headerName: label,
      field: label,
      sortable: true,
      filter: true,
      resizable: true,
    }));
  
  this.columnDefs = [...tableWidgetColumns, ...additionalColumns];
  
    console.log('Final column definitions:', this.columnDefs);
        this.extractRowData = JSON.parse(this.item.rowData)
      console.log('this.extractRowData checking',this.extractRowData)
    console.log('this.extractRowData checking from',this.extractRowData)
    this.sendminiTableData.emit(this.extractRowData)
    const parseRowData = this.extractRowData


  console.log('this.rowData from table Tile', parseRowData);

  const dateKeys: string[] = [];




  parseRowData.forEach((row: any) => {
    Object.keys(row).forEach((key) => {
      if (
        (key.startsWith('date') ||
         key.startsWith('datetime') ||
         key.startsWith('epoch-date') ||
         key.startsWith('epoch-datetime-local')||
         key === 'created_time' ||
         key === 'updated_time' || key.startsWith('time')) &&
        !dateKeys.includes(key)
      ) {
        dateKeys.push(key);
      }
    });
  });
  
  console.log('Extracted date/datetime keys:', dateKeys);
  
  // Pass both date and datetime keys to fetchDynamicFormData
  const matchedDateFields = await this.fetchDynamicFormData(this.formName, dateKeys);
  console.log('Received date fields in caller:', matchedDateFields);
  
  
  

  this.rowData = this.formatDateFields(parseRowData,matchedDateFields);
console.log('Formatted Data: multitableWidget from multitable', this.rowData);
    // Generate dummy row data based on column definitions
  
  
    console.log('Generated dummy row data:', this.rowData);
  } catch (error) {
    console.error('Error parsing table data:', error);
  }
}
  
  }

  ngAfterViewInit(){

    this.createtableWidget()



}

private formatDateFields(data: any[], receiveformatPckets: any[]): any[] {
  console.log('receiveformatPckets checking', receiveformatPckets);

  return data.map(row => {
    Object.keys(row).forEach(key => {
      const isDateKey = key.startsWith('date-');
      const isDateTimeKey = key.startsWith('datetime-');
      const isEpochDate = key.startsWith('epoch-date-');
      const isEpochDateTime = key.startsWith('epoch-datetime-local-');
      const isCreatedOrUpdated = key === 'created_time' || key === 'updated_time';
      const isTime = key.startsWith('time-');

      // ✅ Handle created_time / updated_time
      if (isCreatedOrUpdated) {
        const epoch = parseInt(row[key], 10);
        if (!isNaN(epoch)) {
          const epochMs = epoch < 1e12 ? epoch * 1000 : epoch;
          row[key] = this.formatDate(new Date(epochMs).toISOString(), 'DD/MM/YYYY');
        }
        return;
      }

      if (isDateKey || isDateTimeKey || isEpochDate || isEpochDateTime || isTime) {
        const matchingField = receiveformatPckets.find((packet: any) => packet.name === key);
        if (matchingField) {
          const validation = matchingField.validation || {};
          const dateFormat = validation.dateFormatType || 'DD/MM/YYYY';
          const timeFormat = validation.timeFormatType || '12-hour (hh:mm AM/PM)';

          // console.log('Date Format Applied:', dateFormat);
          // console.log('Time Format Applied:', timeFormat);

          let rawValue = row[key];

          // ✅ Convert epoch to ISO string if applicable
          if ((isEpochDate || isEpochDateTime || isTime) && rawValue) {
            const epoch = parseInt(rawValue, 10);
            if (!isNaN(epoch)) {
              const epochMs = epoch < 1e12 ? epoch * 1000 : epoch;
              rawValue = new Date(epochMs).toISOString();
            }
          }

          // ✅ Decide if time formatting is needed
          const requiresTime = isDateTimeKey || isEpochDateTime || isTime;

          // ✅ If it's a pure time field, skip dateFormat
          const finalDateFormat = isTime ? null : dateFormat;

          row[key] = this.formatDate(rawValue, finalDateFormat, requiresTime ? timeFormat : null);
        }
      }
    });
    return row;
  });
}





private formatDate(dateStr: string, dateFormat?: string, timeFormat?: string): string {
  if (!dateStr) return '';

  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return '';

  let formattedDate = '';
  if (dateFormat) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear());

    switch (dateFormat.toUpperCase()) {
      case 'MM/DD/YYYY':
        formattedDate = `${month}/${day}/${year}`;
        break;
      case 'YYYY/MM/DD':
        formattedDate = `${year}/${month}/${day}`;
        break;
      case 'DD/MM/YYYY':
      default:
        formattedDate = `${day}/${month}/${year}`;
        break;
    }
  }

  if (!timeFormat) return formattedDate;

  const resolvedTimeFormat = timeFormat.trim().toLowerCase();
  const hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');

  let formattedTime = '';
  if (resolvedTimeFormat.includes('am/pm')) {
    const hour12 = (hours % 12) || 12;
    const meridian = hours >= 12 ? 'PM' : 'AM';
    formattedTime = `${String(hour12).padStart(2, '0')}:${minutes} ${meridian}`;
  } else {
    formattedTime = `${String(hours).padStart(2, '0')}:${minutes}`;
  }

  return formattedDate ? `${formattedDate} ${formattedTime}` : formattedTime;
}


removeMatchingPackets(data: any[]) {
  const seenValues = new Set();
  const uniqueData: any[] = [];

  // Filter out duplicates based on the 'value' field
  data.forEach(item => {
    // Check if the value already exists
    if (seenValues.has(item.value)) {
      // If value is already seen, skip this packet
      return;
    }
    
    // If the value is unique, add to uniqueData and mark as seen
    seenValues.add(item.value);
    uniqueData.push(item);
  });

  return uniqueData;
}
removeDuplicatePacketsBasedOnFilterFields(rowData: any[], filterFields: any[]): any[] {
  const uniqueRows: any[] = [];
  const seenValues = new Set();

  // Iterate through rowData to check and remove duplicates based on filterFields
  rowData.forEach(row => {
    // Create a composite key for each row based on the combination of values from the fields in filterFields
    const key = filterFields
      .map(field => row[field.value]) // Dynamically get the value from the row based on filterFields
      .join('|'); // Combine the field values with a separator to create a unique key

    // Check if this combination of field values has already been encountered
    if (seenValues.has(key)) {
      return; // Skip this row if the combination of values is a duplicate
    }

    // If the combination is unique, mark it as seen and add the row to the result
    seenValues.add(key);
    uniqueRows.push(row);
  });

  return uniqueRows;
}
  async fetchDynamicFormData(value: any, receiveDateKeys: any): Promise<any[]> {
    console.log("Data from lookup:", value);
    console.log('receiveDateKeys checking table ui', receiveDateKeys);
  
    try {
      const result: any = await this.api.GetMaster(`${this.SK_clientID}#dynamic_form#${value}#main`, 1);
  
      if (result && result.metadata) {
        const parsedMetadata = JSON.parse(result.metadata);
        const formFields = parsedMetadata.formFields;
        console.log('fields checking table ui', formFields);
  
        const receiveSet = new Set(receiveDateKeys);
  
        const filteredFields = formFields.filter(
          (field: any) => receiveSet.has(field.name)
        );
  
        console.log('Matched date fields:', filteredFields);
        return filteredFields;
      }
    } catch (err) {
      console.log("Can't fetch", err);
    }
  
    return []; // fallback if error or no metadata
  }
  defaultColDef = {
    resizable: true, // Allow columns to be resized
    sortable: true, // Enable sorting
    filter: true, // Enable filtering
  };
  rowDataMini: any[] = [
    { id: 1, name: 'John Doe', age: 25 },
    { id: 2, name: 'Jane Smith', age: 30 },
    { id: 3, name: 'Sam Green', age: 35 },
  ];

  columnDefsMini: any[] = [
    { field: 'id', headerName: 'ID', sortable: true, filter: true },
    { field: 'name', headerName: 'Name', sortable: true, filter: true },
    { field: 'age', headerName: 'Age', sortable: true, filter: true },
  ];

  defaultColDefMini: any = {
    sortable: true,
    filter: true,
    resizable: true,
  };
  modalData: any[] = [];
  nestedColumnDefs: any[] = [];


  autoSizeAllColumns() {
    const allColumnIds: string[] = [];
    this.columnApi.getAllColumns().forEach((column: { getId: () => string; }) => {
      if (column) {
        allColumnIds.push(column.getId());
      }
    });
    this.columnApi.autoSizeColumns(allColumnIds);
  }


  ngOnChanges(changes: SimpleChanges): void {
    console.log('dashboardChange dynamic ui',this.all_Packet_store)
 
 


    // this.FormName = this.storeDrillDown.formlist

  
    
    // Split the description by '&&'
    // let conditions = description.split('&&').map((cond: string) => cond.trim());
    
    // Iterate over each condition to extract values
    // let extractedValues: any[] = [];
    
    // conditions.forEach((condition: string) => {
    //   // Use regex to capture the value after "=="
    //   let regex = /\$\{[^\}]+\}==(['"]?)(.+?)\1/;
    //   let match = condition.match(regex);
      
    //   if (match) {
    //     let value = match[2].trim(); // Extract the value after ==
    //     extractedValues.push(value); // Store the extracted value
    //   }
    // });
    
    // // Assign the first extracted value to descriptionData
    // if (extractedValues.length > 0) {
    //   this.descriptionData = extractedValues[0];
    //   console.log('this.descriptionData check', this.descriptionData);
    // } else {
    //   this.primaryValue = this.item.multi_value[0].value;
    // }
    
    // // Log all extracted values
    // console.log('Extracted Values:', extractedValues);
    



    // this.tile1Config = this.item

  
 

  
}


// exportToCSV(): void {
//   this.gridApi.exportDataAsCsv();
// }

// exportToExcel(): void {
//   this.gridApi.exportDataAsExcel();
// }

onGridReady(params: any): void {
  this.gridApi = params.api; // Initialize Grid API
  this.gridColumnApi = params.columnApi; // Initialize Column API
  params.api.sizeColumnsToFit(); 
  console.log('Grid API initialized:', this.gridApi); // Debugging
}



onResize() {
  this.resizeColumns();
}

private resizeColumns() {
  if (this.agGrid?.api) {
    this.agGrid.api.sizeColumnsToFit();
  }
}

get shouldShowButton(): boolean {
  return this.item.dashboardIds !== "";
}

  constructor(
   private router: Router,   private modalService: NgbModal,private sanitizer: DomSanitizer,private summaryService:SummaryEngineService,private api: APIService,private cdr: ChangeDetectorRef,private summaryConfiguration: SharedService
   
  ){
    this.iconCellRenderer = function (params) {
      // Check if 'dynamic_table_values' exists and is not empty
      if (params.data.dynamic_table_values && Object.keys(params.data.dynamic_table_values).some(key => params.data.dynamic_table_values[key].length > 0)) {
        // If conditions are met, return the icon HTML
        return `<i class="bi bi-table" style="color: #204887; font-size: 25px;"></i>`;
      } else {
        // If conditions are not met, return an empty string
        return '';
      }
    };
    
    
    
    
  }







  // onCellClick(event: any): void {
  //   console.log('Cell clicked:', event);

  //   // Pass row data and column definitions to the modal
  //   this.modalData = [event.data];
  //   this.nestedColumnDefs = this.columnDefs; // You can use a different set of column definitions if needed

  //   // Open the modal
  //   // this.modalService.open(modalRef, { size: 'lg' });
  //   this.sendCellInfo.emit(event)
  //   this.dataTableCellInfo.emit(event);
  // }


  clickLock = false;
  onCellClick(eventData: any, isIconClick: boolean = false) {
    console.log('eventdata checking from cell', eventData);
  
    // If already locked, ignore further clicks
    if (this.clickLock) {
      console.log("Click ignored: Already processing a click.");
      return;
    }
  
    // Lock the click immediately to prevent multiple triggers
    this.clickLock = true;
  
    const storeminiTableData = eventData.value;
  
    if (Object.keys(storeminiTableData).some(key => key.startsWith('table'))) {
      this.sendCellInfo.emit(eventData)
      // If keys start with 'table', do nothing
      console.log("Data contains 'table' key, no action taken.", eventData);
    } else {
      // If no key starts with 'table', proceed with the else block
      console.log("Row clicked, eventData: ", eventData);
      // console.log('check mobileViewUserId',this.userId)

      // const recordIdObj = {
      //   type: "view",
      //   fields: {},
      //   mainTableKey: JSON.stringify(eventData.data.SK)  // No prefix
      // };
      // console.log('recordIdObj checking from datatable chart1:', recordIdObj);
  
      // // 🔹 Step 2: Convert to JSON and escape quotes
      // const jsonString = JSON.stringify(recordIdObj);
      // const escapedString = `"${jsonString.replace(/"/g, '\\"')}"`;
  
      // // 🔹 Step 3: Encode for URL usage
      // const encodedRecordId = encodeURIComponent(escapedString);
  
      // // 🔹 Step 4: Final URL
      // const targetUrl = `/view-dreamboard/Forms/${this.FormName}&recordId=${encodedRecordId}`;
      // console.log('targetUrl checking from datatable:', targetUrl);
  
      // // 🔹 Step 5: Open in new tab
      // window.open(targetUrl, '_blank');
    
  

      
      
      // window.open(targetUrl, '_blank');
      
      setTimeout(() => {
        // Emit the event after a delay (500ms here)
        this.dataTableCellInfo.emit(eventData);
      }, 500);
    }
  
    // Unlock click after processing (to prevent multiple triggers)
    setTimeout(() => {
      this.clickLock = false;
    }, 500); // The same delay as the timeout for emitting data
  }


  edit_each_tileUI(value1: any,value2: number) {
    const data = { arg1: value1, arg2: value2 }; // Two arguments
    console.log('data checking from tile1',data)
  this.customEvent.emit(data); // Emitting an event with two arguments

  }
  edit_each_duplicate(value1: any, value2: number) {
    const data = { arg1: value1, arg2: value2 }; // Two arguments
    console.log('Data check from dynamic UI:', data);
  
    // Combine data with all_Packet_store
    const payload = {
      data,
      all_Packet_store: this.all_Packet_store, // Include all_Packet_store
    };
  
    console.log('Combined payload:', payload);
  
    // Emit the payload
    this.customEvent1.emit(payload);
  }
  deleteTile(value1: any,value2: number) {
    const data = { arg1: value1, arg2: value2 }; // Two arguments
    const payloadDelete = {
      data,
      all_Packet_store: this.all_Packet_store, // Include all_Packet_store
    };
  this.customEvent2.emit(payloadDelete); // Emitting an event with two arguments

  }
  helperDashboard(item:any,index:any,modalContent:any,selectType:any){
    const viewMode = true;
    const disableMenu = true



    localStorage.setItem('isFullScreen', JSON.stringify(true));
    const modulePath = item.dashboardIds; // Adjust with your module route
    const queryParams = `?viewMode=${viewMode}&disableMenu=${disableMenu}`;

 this.selectedMarkerIndex = index
 if (selectType === 'NewTab') {
  this.iframeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(window.location.origin +"/summary-engine/"+ modulePath);
  // Open in a new tab
  window.open(this.iframeUrl.changingThisBreaksApplicationSecurity, '_blank');
} else if(selectType === 'Modal'){
  this.iframeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(window.location.origin +"/summary-engine/"+ modulePath+queryParams);
  // Open in the modal
  this.modalService.open(modalContent, { size: 'xl' });
}


  }

  closeModal() {
    this.modalService.dismissAll(); // Close the modal programmatically
  }

  exportToCSV(): void {
    if (this.gridApi) {
      this.gridApi.exportDataAsCsv({
        fileName: `${this.extractFormName}`+'.csv',
        columnSeparator: ',',
      });
    } else {
      console.error('Grid API is not initialized!');
      // alert('Unable to export to CSV. Please ensure the grid is loaded.');
    }
  }

  exportToExcel(): void {
    if (this.gridApi) {
      this.gridApi.exportDataAsExcel({
        fileName: 'exported-data.xlsx', // File name
        sheetName: 'Sheet1' // Optional: Sheet name
      });
    } else {
      console.error('Grid API is not initialized!');
      // alert('Unable to export to Excel. Please ensure the grid is loaded.');
    }
  }




          async exportAllTablesAsExcel() {
            let dataToExport: any[] = [];
          
            const isFilterApplied = this.gridApi && Object.keys(this.gridApi.getFilterModel()).length > 0;
            const displayedRowCount = this.gridApi.getDisplayedRowCount();
          
            if (isFilterApplied && displayedRowCount > 0) {
              this.gridApi.forEachNodeAfterFilter((node: any) => {
                if (node.data) dataToExport.push(node.data);
              });
            } else {
              dataToExport = this.rowData || [];
            }
          
            // ✅ Limit export to 10,000 rows
            const exportLimit = 10000;
            if (dataToExport.length > exportLimit) {
              console.warn(`⚠️ Data exceeds export limit (${exportLimit}). Trimming.`);
              dataToExport = dataToExport.slice(0, exportLimit);
            }
          
            if (!dataToExport.length) {
              console.error('❌ No data to export.');
              return;
            }
          
            // ✅ Collect date-related keys
            const dateKeys: string[] = [];
            dataToExport.forEach((row: any) => {
              if (typeof row !== 'object' || row === null) return;
              Object.keys(row).forEach((key) => {
                if (
                  (key.startsWith('date') ||
                    key.startsWith('datetime') ||
                    key.startsWith('epoch-date') ||
                    key.startsWith('epoch-datetime-local') ||
                    key === 'created_time' ||
                    key === 'updated_time' ||
                    key.startsWith('time')) &&
                  !dateKeys.includes(key)
                ) {
                  dateKeys.push(key);
                }
              });
            });
          
            // ✅ Format date fields
            const matchedDateFields = await this.fetchDynamicFormData(this.extractFormName, dateKeys);
            dataToExport = await this.formatDateFields(dataToExport, matchedDateFields);
            console.log('dataToExport checking from exportExcel',dataToExport)
          
            // ✅ Fetch mini table metadata and headers ONCE
            const tablesReceive:any = await this.fetchMiniTableData(this.extractFormName);
            console.log('tablesReceive check',tablesReceive)
            const tableHeaderMap: any = {};
          
            if (Array.isArray(tablesReceive)) {
              for (const table of tablesReceive) {
                const headerData = await this.fetchMiniTableHeaders(table);
                console.log('headerData check',headerData)
                if (Array.isArray(headerData)) {
                  tableHeaderMap[table.name] = headerData[0]?.columnDefs || [];
                } else {
                  tableHeaderMap[table.name] = headerData?.columnDefs || [];
                }
              }
            }
          
            // ✅ Extract mini-tables using cached metadata
            const extractedDynamicTables = await this.extractDynamicTables(
              dataToExport,
              tablesReceive || [],  // ensure it's an array
              tableHeaderMap
            );
            console.log('extractedDynamicTables checking',extractedDynamicTables)
            
            // ✅ Create Excel workbook
            const wb = XLSX.utils.book_new();
          
            // ✅ Main sheet (excluding dynamic_table_values)
            const visibleColumns = this.columnDefs.filter((col: any) => col.field !== 'dynamic_table_values');
            const columnHeaders = visibleColumns.map((col: any) => col.headerName);
            const columnFields = visibleColumns.map((col: any) => col.field);
          
            const mainData = [
              columnHeaders,
              ...dataToExport.map(row => {
                try {
                  return columnFields.map((field: string) =>
                    row && field in row && row[field] != null ? String(row[field]) : ''
                  );
                } catch (err) {
                  console.warn('⚠️ Row export failed:', row, err);
                  return columnFields.map(() => '');
                }
              })
            ];
          
            const mainSheet = XLSX.utils.aoa_to_sheet(mainData);
            XLSX.utils.book_append_sheet(wb, mainSheet, this.extractFormName);
          
            // ✅ Append mini-table sheets
            Object.entries(extractedDynamicTables).forEach(([label, data]) => {
              const { headers, rows } = data;
              if (!Array.isArray(rows) || rows.length === 0) return;
          
              const columnTitles = headers.map(h => h.header);
              const fieldKeys = headers.map(h => h.field);
          
              const sheetData = [
                columnTitles,
                ...rows.map(row => fieldKeys.map(field => row[field] ?? ''))
              ];
          
              const safeLabel = label.slice(0, 31).replace(/[\\/?*[\]:]/g, '');
              const sheet = XLSX.utils.aoa_to_sheet(sheetData);
              XLSX.utils.book_append_sheet(wb, sheet, safeLabel);
            });
          
            // ✅ Trigger download
            const excelFile = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
            const blob = new Blob([excelFile], { type: 'application/octet-stream' });
          
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${this.extractFormName || 'ExportedData'}.xlsx`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
          }
        
        
          async fetchMiniTableData(item: any) {
            try {
                this.extractedTables = []; // Initialize as an empty array to prevent undefined errors
          
                const resultMain: any = await this.api.GetMaster(this.SK_clientID + "#dynamic_form#" + item + "#main", 1);
                if (resultMain) {
                    // console.log('forms chaecking', resultMain);
                    const helpherObjmain = JSON.parse(resultMain.metadata);
                    // console.log('helpherObjmain checking', helpherObjmain);
          
                    const extractFormFields = helpherObjmain.formFields;
          
                    // Ensure extractedTables is set properly
                    this.extractedTables = Object.values(extractFormFields).filter((item: any) =>
                        typeof item === 'object' &&
                        item !== null &&
                        'name' in item &&
                        typeof item.name === 'string' &&
                        item.name.startsWith("table-")
                    );
          
                    // console.log('Extracted Table Records:', this.extractedTables);
                    return this.extractedTables;
                }
            } catch (err) {
                console.log("Error fetching the dynamic form data", err);
            }
          }
        
          async fetchMiniTableHeaders(items: any) {
            console.log('items checking from fetchminitable headers',items)
        
            // Accessing the validation field with a null check
            const validation = items?.validation ?? 'No validation field available';
            console.log('Validation:', validation);
        
            // Ensure `validation.formName_table` exists and is being logged correctly for each table
            const validateFormName = validation?.formName_table ?? 'No formName_table available';
            console.log('validateFormName:', validateFormName);
            const minitableName = items.label
        try {
        // Check if items is an array or a single value
        const formNames = Array.isArray(validateFormName) ? validateFormName : [validateFormName];
        
        const allColumnDefs = [];
        const results = [];
        
        // Iterate over each formName (whether single or multiple)
        for (let formName of formNames) {
          const resultHeaders: any = await this.api.GetMaster(this.SK_clientID + "#dynamic_form#" + formName + "#main", 1);
        
          if (resultHeaders) {
            // console.log('forms checking', resultHeaders);
            const helpherObjmainHeaders = JSON.parse(resultHeaders.metadata);
            console.log('helpherObjmain checking', helpherObjmainHeaders);
        
            // Ensure formFields exist and is an array
            if (helpherObjmainHeaders?.formFields && Array.isArray(helpherObjmainHeaders.formFields)) {
        
              // Initialize extractedTableHeaders as an object
              if (!this.extractedTableHeaders) {
                this.extractedTableHeaders = {};
              }
        
              // Store extracted form fields by formLabel
              const formLabel = helpherObjmainHeaders.formLabel;
        
        
              if (!this.extractedTableHeaders[formLabel]) {
                this.extractedTableHeaders[formLabel] = {
                  formFields: helpherObjmainHeaders.formFields,
                  formName: helpherObjmainHeaders.formLabel,
              
                  columnDefs: helpherObjmainHeaders.formFields.map((field: { label: string; name: string; validation?: any }) => ({
                    headerName: field.label,
                    field: field.name,
                    sortable: true,
                    filter: true,
                    resizable: true,
                    validation: field.validation || {} // ✅ Include validation metadata
                  }))
                };
              }
        
              // console.log(`Extracted Form Fields for: ${formLabel}`);
              // console.log('this.extractedTableHeaders[formLabel] checking before applying',this.extractedTableHeaders[formLabel])
              this.storeFormLabel = formLabel
              // const formNameMini=receiveActualTableNames
        
              // console.log('Column Definitions:', this.extractedTableHeaders[formLabel].columnDefs);
              // console.log('this.storeFormLabel chcking',this.storeFormLabel)
        
              // Add columnDefs of this form to the allColumnDefs array
              results.push({
                minitableName,
                columnDefs: this.extractedTableHeaders[formLabel].columnDefs
              });
            }
          }
        }
        console.log('results checking from tile1',results)
        // Return all columnDefs for the forms (single or multiple)
        return results.length > 1 ? results : results[0];
        
        
        } catch (err) {
        console.log("Error fetching the dynamic form data", err);
        }
        
        // In case no data is fetched, return an empty array
        return [];
        }
          async extractDynamicTables(
            dataArray: any[],
            tablesReceive: any[],
            tableHeaderMap: { [name: string]: any }
          ): Promise<{
            [label: string]: { headers: { header: string; field: string }[]; rows: any[] };
          }> {
            const extractedTables: {
              [label: string]: { headers: { header: string; field: string }[]; rows: any[] };
            } = {};
        
        
            console.log('tablesReceive from extractDynamic',tablesReceive)
          
            for (const packet of dataArray) {
              const dynamicTables = packet?.dynamic_table_values || {};
              const tableIds = Object.keys(dynamicTables);
          
              for (const tableId of tableIds) {
                const modifiedTableId = tableId.replace('-table', '');
          
                const matchedTable = tablesReceive.find((table: any) => {
                  const nameWithoutSuffix = table.name.replace('-table', '');
                  return nameWithoutSuffix === modifiedTableId;
                });
          
                if (!matchedTable) {
                  console.warn(`❌ No matched table for tableId: ${tableId}`);
                  continue;
                }
          
                const columnDefs: any[] = tableHeaderMap[matchedTable.name] || [];
                if (!Array.isArray(columnDefs) || columnDefs.length === 0) {
                  console.warn(`⚠️ No columnDefs for table: ${matchedTable.name}`);
                  continue;
                }
          
                const fieldNames = columnDefs.map(col => col.field);
                const tableLabel = matchedTable.label || matchedTable.name || modifiedTableId;
                let rows = dynamicTables[tableId] || dynamicTables[matchedTable.name];
          
                if (!Array.isArray(rows)) {
                  console.warn(`⚠️ Rows for ${tableId} is not an array`);
                  continue;
                }
          
                // Format date/time fields
                rows = rows.map((row: any) => {
                  if (typeof row !== 'object' || row === null) return row;
                  try {
                    const filteredDateFields: any = {};
                    for (const key of Object.keys(row)) {
                      if (
                        key.startsWith('date') ||
                        key.startsWith('datetime') ||
                        key.startsWith('epoch-date') ||
                        key.startsWith('epoch-datetime-local') ||
                        key === 'created_time' ||
                        key === 'updated_time' ||
                        key.startsWith('time')
                      ) {
                        filteredDateFields[key] = row[key];
                      }
                    }
          
                    if (Object.keys(filteredDateFields).length === 0) return row;
          
                    const matchedPackets = columnDefs.filter((col: any) =>
                      Object.keys(filteredDateFields).includes(col.field)
                    );
          
                    const result = this.dynamicDateTimeFormat(filteredDateFields, matchedPackets);
                    for (const key of Object.keys(result)) {
                      row[key] = result[key];
                    }
          
                    return row;
                  } catch (err) {
                    console.warn('⚠️ Date formatting error:', row, err);
                    return row;
                  }
                });
          
                // Final cleaned rows
                // const processedRows = rows.map((row: any) => {
                //   const filtered: any = {};
                //   fieldNames.forEach((field: string) => {
                //     filtered[field] = row[field] ?? '';
                //   });
                //   return filtered;
                // });
        
                const processedRows = Array.isArray(rows)
          ? rows.map((row: any) => {
              const filtered: any = {};
              if (row && typeof row === 'object') {
                fieldNames.forEach((field: string) => {
                  filtered[field] = row[field] ?? '';
                });
              } else {
                // If row is null or not an object, assign empty values
                fieldNames.forEach((field: string) => {
                  filtered[field] = '';
                });
              }
              return filtered;
            })
          : [];
        
          
                const headers = columnDefs.map(col => ({
                  header: col.headerName,
                  field: col.field,
                }));
                console.log('final headers checking',headers)
          
                if (!extractedTables[tableLabel]) {
                  extractedTables[tableLabel] = { headers, rows: [] };
                }
          
                extractedTables[tableLabel].rows.push(...processedRows);
              }
            }
          
            return extractedTables;
          }
  
  
  
          dynamicDateTimeFormat(reciveData: any, receiveFields: any) {
            const formattedResults: any = {};
          
            receiveFields.forEach((packet: any) => {
              const fieldName = packet.field;
              let fieldValue = reciveData[fieldName];
          
              if (fieldValue) {
                const validation = packet.validation || {};
                const key = fieldName.toLowerCase();
          
                // ✅ Allowed format options
                const allowedDateFormats = ['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY/MM/DD'];
                const allowedTimeFormats = ['12-hour (hh:mm AM/PM)', '24-hour (hh:mm)'];
          
                const defaultDateFormat = 'DD/MM/YYYY';
                const defaultTimeFormat = '24-hour (hh:mm)';
          
                // ✅ Use format only if valid, else fallback
                const rawDateFormat = validation.dateFormatType;
                const rawTimeFormat = validation.timeFormatType;
          
                const dateFormatType = allowedDateFormats.includes(rawDateFormat) ? rawDateFormat : defaultDateFormat;
                const rawTimeFormatType = allowedTimeFormats.includes(rawTimeFormat) ? rawTimeFormat : defaultTimeFormat;
          
                // 🕒 Resolve time format string
                const timeFormat = rawTimeFormatType.includes('12-hour') ? 'hh:mm A' : 'HH:mm';
          
                let format = '';
          
                // 🧠 Convert epoch to Date (in ms if necessary)
                if (key.startsWith('epoch-datetime-local') || key.startsWith('epoch-date')) {
                  let epoch = typeof fieldValue === 'string' ? parseInt(fieldValue) : fieldValue;
                  if (epoch < 10000000000) epoch *= 1000; // seconds to milliseconds
                  fieldValue = new Date(epoch);
                }
          
                // 🧠 Patch time-only strings (e.g., "13:45")
                if (typeof fieldValue === 'string' && key.startsWith('time') && !key.startsWith('datetime')) {
                  fieldValue = `1970-01-01T${fieldValue}`;
                }
          
                // ⏱️ Parse final Date object
                const parsedDate = fieldValue instanceof Date ? fieldValue : new Date(fieldValue);
                if (isNaN(parsedDate.getTime())) {
                  formattedResults[fieldName] = '';
                  return;
                }
          
                // 🧩 Format resolution (specific to general order)
                if (key === 'created_time' || key === 'updated_time') {
                  format = 'DD/MM/YYYY HH:mm';
                }
                 else if (key.startsWith('epoch-datetime-local')) {
                  format = `${dateFormatType} ${timeFormat}`;
                } else if (key.startsWith('epoch-date')) {
                  format = dateFormatType;
                } else if (key.startsWith('datetime')) {
                  format = `${dateFormatType} ${timeFormat}`;
                } else if (key.startsWith('time') && !key.startsWith('datetime')) {
                  format = timeFormat;
                } else if (key.startsWith('date') && !key.startsWith('datetime')) {
                  format = dateFormatType;
                }
          
                const formattedDate = this.formatDateByPattern(parsedDate, format);
                formattedResults[fieldName] = formattedDate;
              }
            });
          
            console.log('✅ Final Formatted DateTime Fields:', formattedResults);
            return formattedResults;
          }
          formatDateByPattern(inputDate: string | number | Date, format: string): string {
            const date = new Date(inputDate);
            const pad = (num: number) => String(num).padStart(2, '0');
          
            const hours24 = date.getHours();
            const hours12 = hours24 % 12 || 12;
            const ampm = hours24 >= 12 ? 'PM' : 'AM';
          
            const replacements: Record<string, string> = {
              YYYY: String(date.getFullYear()),
              MM: pad(date.getMonth() + 1),
              DD: pad(date.getDate()),
              HH: pad(hours24),
              hh: pad(hours12),
              mm: pad(date.getMinutes()),
              ss: pad(date.getSeconds()),
              A: ampm,
              a: ampm.toLowerCase()
            };
          
            return format.replace(/YYYY|MM|DD|HH|hh|mm|ss|A|a/g, match => replacements[match]);
          }
  exportAllTablesAsPDF() {
    if (!this.rowData || this.rowData.length === 0) {
      console.error('No data available for export.');
      return; // Exit if there's no data to export
    }
  
    const docDefinition: any = {
      content: [],
      defaultStyle: {
        // font: 'Roboto',
      },
      styles: {
        tableHeader: {
          bold: true,
          fontSize: 14,
          alignment: 'center',
          fillColor: '#4CAF50',
          color: '#fff',
          margin: [0, 5],
          padding: [5, 10],
        },
        tableBody: {
          fontSize: 10,
          alignment: 'center',
          margin: [0, 5],
          padding: [5, 10],
        },
        alternatingRow: {
          fillColor: '#f9f9f9',
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
          color: '#333',
        },
      },
      footer: function (currentPage: number, pageCount: number) {
        return {
          text: `Page ${currentPage} of ${pageCount}`,
          alignment: 'center',
          margin: [0, 10],
        };
      },
    };
  
    // Dynamically extract column headers from rowData
    const columns = Object.keys(this.rowData[0] || {});
    if (columns.length === 0) {
      console.error('No columns available for export.');
      return;
    }
  
    // Adjust page size dynamically
    const columnCount = columns.length;
    docDefinition.pageSize =
      columnCount <= 6
        ? 'A4'
        : columnCount <= 10
        ? 'A3'
        : columnCount <= 15
        ? 'A2'
        : 'A1';
  
    // Add document title
    docDefinition.content.push({
      text: 'Exported Table Data',
      style: 'title',
      margin: [0, 10],
    });
  
    // Build table body
    const tableBody: any[] = [];
  
    // Add header row
    tableBody.push(
      columns.map((col) => ({
        text: col,
        style: 'tableHeader',
      }))
    );
  
    // Add data rows
    this.rowData.forEach((row: Record<string, any>, index: number) => {
      const rowData = columns.map((col) => {
        const cellData = row[col];
  
        if (cellData === null || cellData === undefined) {
          return ''; // Treat null/undefined as empty string
        }
  
        if (typeof cellData === 'object') {
          return JSON.stringify(cellData); // Convert objects to string
        }
  
        if (typeof cellData === 'string' && cellData.includes('data:image')) {
          return {
            image: cellData,
            width: 50,
            height: 50,
          }; // Render base64 images
        }
  
        return cellData.toString(); // Convert all other data types to string
      });
  
      // Push row as an array, not as an object
      tableBody.push(rowData);
    });
  
    // Add table to the document
    docDefinition.content.push({
      table: {
        body: tableBody,
        headerRows: 1,
        widths: Array(columns.length).fill('auto'),
      },
      layout: {
        fillColor: (rowIndex: number) => {
          return rowIndex % 2 === 0 ? null : '#f9f9f9'; // Apply alternating row colors
        },
      },
      margin: [0, 10],
    });
  
    // Error handling during PDF generation
    try {
      pdfMake.createPdf(docDefinition).download(`${this.extractFormName}`+'.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
      // alert('Failed to generate PDF. Please try again.');
    }
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


  modalColumnDefs = [
    { field: 'field1', headerName: 'Field 1' },
    { field: 'field2', headerName: 'Field 2' },
  ];


  isModalOpen = false;



  onRowClick(event: any): void {
    console.log('Row clicked:', event.data);
    this.modalData = [event.data]; // Pass the clicked row data to the modal
    this.isModalOpen = true;
  }

  openTableModal(nestedTable:TemplateRef<any>,modal:any){
    this.modalService.open(nestedTable, {size: 'lg' });
    // modal.dismiss();

  }
  

  


}
