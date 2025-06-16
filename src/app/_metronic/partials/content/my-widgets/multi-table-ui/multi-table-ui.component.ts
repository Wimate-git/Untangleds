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


//   ngOnChanges(changes: SimpleChanges): void {
//     console.log('dashboardChange dynamic ui',this.all_Packet_store)
 
 




  
    
//     // Split the description by '&&'
//     // let conditions = description.split('&&').map((cond: string) => cond.trim());
    
//     // Iterate over each condition to extract values
//     // let extractedValues: any[] = [];
    
//     // conditions.forEach((condition: string) => {
//     //   // Use regex to capture the value after "=="
//     //   let regex = /\$\{[^\}]+\}==(['"]?)(.+?)\1/;
//     //   let match = condition.match(regex);
      
//     //   if (match) {
//     //     let value = match[2].trim(); // Extract the value after ==
//     //     extractedValues.push(value); // Store the extracted value
//     //   }
//     // });
    
//     // // Assign the first extracted value to descriptionData
//     // if (extractedValues.length > 0) {
//     //   this.descriptionData = extractedValues[0];
//     //   console.log('this.descriptionData check', this.descriptionData);
//     // } else {
//     //   this.primaryValue = this.item.multi_value[0].value;
//     // }
    
//     // // Log all extracted values
//     // console.log('Extracted Values:', extractedValues);
    



//     // this.tile1Config = this.item

  
 

  
// }


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







  onCellClick(event: any): void {
    console.log('Cell clicked:', event);

    // Pass row data and column definitions to the modal
    this.modalData = [event.data];
    this.nestedColumnDefs = this.columnDefs; // You can use a different set of column definitions if needed

    // Open the modal
    // this.modalService.open(modalRef, { size: 'lg' });
    this.sendCellInfo.emit(event)
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
  exportAllTablesAsExcel() {
    if (!this.rowData || this.rowData.length === 0) {
      console.error('No data available for export.');
      // alert('No data available for export.');
      return; // Exit if there's no data to export
    }
  
    const wb = XLSX.utils.book_new(); // Create a new workbook
  
    // Extract column headers dynamically from the first object
    const columnHeaders = Object.keys(this.rowData[0]);
    if (columnHeaders.length === 0) {
      console.error('No columns available for export.');
      // alert('No columns available for export.');
      return;
    }
  
    // Build the Excel data: column headers + row data
    const excelData = [
      columnHeaders, // Add headers as the first row
      ...this.rowData.map((row: Record<string, any>) =>
        columnHeaders.map((col) =>
          row[col] !== null && row[col] !== undefined ? row[col].toString() : '' // Handle null/undefined
        )
      ),
    ];
  
    // Convert data to a worksheet
    const ws = XLSX.utils.aoa_to_sheet(excelData);
  
    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(wb, ws, 'TableData');
  
    // Generate the Excel file
    const excelFile = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  
    // Create a Blob and trigger the download
    const blob = new Blob([excelFile], { type: 'application/octet-stream' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${this.extractFormName}`+'.xlsx';
    link.click();
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
