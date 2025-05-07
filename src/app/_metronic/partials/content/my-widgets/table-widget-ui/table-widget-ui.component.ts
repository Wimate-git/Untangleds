
import { Component, EventEmitter, Input, OnInit, Output, QueryList, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import pdfMake from 'pdfmake/build/pdfmake';

import pdfFonts from 'pdfmake/build/vfs_fonts';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AgGridAngular } from 'ag-grid-angular';
import { GridApi ,Column, RowClassParams} from 'ag-grid-community';

import * as XLSX from 'xlsx';  

import { vfs } from 'pdfmake/build/vfs_fonts';
import { SummaryEngineService } from 'src/app/pages/summary-engine/summary-engine.service';
(pdfMake as any).vfs = vfs;

// Configure pdfMake to use the fonts



@Component({
  selector: 'app-table-widget-ui',

  templateUrl: './table-widget-ui.component.html',
  styleUrl: './table-widget-ui.component.scss'
})
export class TableWidgetUiComponent implements OnInit{


  @Input() item:any
  @Input() index:any
  @Input() isEditModeView:any;
  @Input() summaryDashboardUpdate:any;
  @Input() summaryDashboardView:any;

  @Input() hidingLink:any;
  @Input() liveDataTableTile:any;

  
  @Input() isFullscreen: boolean = false; 
  @ViewChild('agGrid') agGrid!: AgGridAngular;
  tableDataWithFormFilters: any = [];
  @ViewChildren(AgGridAngular) agGrids!: QueryList<AgGridAngular>;
  pageSizeOptions = [10, 25, 50, 100];
  @Output() dataTableCellInfo = new EventEmitter<any>();
  isMobile: boolean = false;
  mobileChartWidth: number = window.innerWidth * 0.85;  // Custom mobile width
  mobileChartHeight: number = window.innerWidth * 0.60; 
  
  
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
  finalColumns: any;
  customLabel: any;
  formName: any;


  defaultColDef = {
    resizable: true, // Allow columns to be resized
    sortable: true, // Enable sorting
    filter: true, // Enable filtering
    enableColMove: true
  };
  pinnedBottomRowData: any[];
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
    console.log('liveDataTableTile checking',this.liveDataTableTile)
    console.log('dashboardChange dynamic ui',this.all_Packet_store)
  //   if (this.item && this.liveDataTableTile !== undefined) {
  //     console.log("✅ LiveDashboard is TRUE - Updating highchartsOptionsJson & chartConfig...");
  
  //     if (this.item && this.liveDataTableTile && Array.isArray(this.liveDataTableTile)) {
  //         // Find the matching packet from this.liveDataChart based on id
  //         const matchingLiveChart = this.liveDataTableTile.find(liveChart => liveChart.id === this.item.id);
  
  //         console.log('🔍 Matching Live Chart for ID:', this.item.id, matchingLiveChart);
  
  //         // Update highchartsOptionsJson and chartConfig only if a match is found
  //         if (matchingLiveChart) {
  //             this.item.tableWidget_Config = matchingLiveChart.tableWidget_Config;
  //             this.item.rowData =matchingLiveChart.rowData
     
  //         }
  
  //         console.log('✅ Updated this.item: after Live', this.item);
  //         this.formName = this.item.formlist
  //         this.customLabel = this.item.custom_Label
  //         console.log('this.customLabel checcking',this.customLabel)
  //     // Parse the conditions
  //     this.parsedColumns = JSON.parse(this.item.conditions);
  //     console.log('this.parsedColumns checking', this.parsedColumns);
      
  //     // Extract columnLabel values
  //     const columnLabels = this.parsedColumns.map((column: { columnLabel: string }) => column.columnLabel);
      
  //     // Log or store the extracted column labels
  //     console.log('Extracted column labels:', columnLabels);
      
  //     // Store in a variable
  //     this.columnLabelsArray = columnLabels; // Example variable to hold the column labels
  //     console.log('this.columnLabelsArray checking',this.columnLabelsArray)
        
  //     this.tabledata = this.item.tableWidget_Config; // This will contain your data
  //     console.log('description check', this.tabledata);
      
  //     try {
  //       this.tabledata = this.item.tableWidget_Config; // Source data for columns
  //       console.log('description check', this.tabledata);
      
  //       // Parse tableWidget_Config
  //       this.parsedTableData = JSON.parse(this.tabledata);
  //       console.log('this.parsedTableData checking', this.parsedTableData);
      
  //       // Generate column definitions from tableWidget_Config
  //       const tableWidgetColumns = this.parsedTableData.map((column: { text: string; value: string }) => ({
  //         headerName: column.text || 'Default Header', // Use a default name if text is missing
  //         field: column.value,
  //         sortable: true,
  //         filter: true,
  //         resizable: true,
  //       }));
      
  //       console.log('tableWidget column definitions:', tableWidgetColumns);
      
  //       // Include additional columns from columnLabelsArray
  //       const additionalColumns = this.columnLabelsArray
  //         .filter((label: string) => label && label.trim() !== '') // Filter out empty labels
  //         .map((label: string) => ({
  //           headerName: label,
  //           field: label,
  //           sortable: true,
  //           filter: true,
  //           resizable: true,
  //           cellRenderer: (params: { value: string; }) => {
  //             // put the value in bold
  //             return 'Value is <b>' + params.value + '</b>';
  //         }
  //         }));
      
  //       console.log('Filtered additional columns from columnLabelsArray:', additionalColumns);
      
  //       // Combine tableWidget columns and additional columns
  //       this.columnDefs = [...tableWidgetColumns, ...additionalColumns];
  //       console.log('Final column definitions:', this.columnDefs);
  //       this.finalColumns = this.columnDefs
      
  //       // Parse row data
  //       this.rowData = JSON.parse(this.item.rowData);
  //       console.log('this.rowData', this.rowData);
  //     } catch (error) {
  //       console.error('Error parsing table data:', error);
  //     }

  //     } else {
  //         console.warn("⚠️ Either this.item is empty or this.liveDataChart is not an array.");
  //     }
  // } else {
  //     console.log("❌ LiveDashboard is FALSE - Keeping original item.");
  //     this.formName = this.item.formlist
  //     this.customLabel = this.item.custom_Label
  //     console.log('this.customLabel checcking',this.customLabel)
  // // Parse the conditions
  // this.parsedColumns = JSON.parse(this.item.conditions);
  // console.log('this.parsedColumns checking', this.parsedColumns);
  
  // // Extract columnLabel values
  // const columnLabels = this.parsedColumns.map((column: { columnLabel: string }) => column.columnLabel);
  
  // // Log or store the extracted column labels
  // console.log('Extracted column labels:', columnLabels);
  
  // // Store in a variable
  // this.columnLabelsArray = columnLabels; // Example variable to hold the column labels
  // console.log('this.columnLabelsArray checking',this.columnLabelsArray)
    
  // this.tabledata = this.item.tableWidget_Config; // This will contain your data
  // console.log('description check', this.tabledata);
  
  // try {
  //   this.tabledata = this.item.tableWidget_Config; // Source data for columns
  //   console.log('description check', this.tabledata);
  
  //   // Parse tableWidget_Config
  //   this.parsedTableData = JSON.parse(this.tabledata);
  //   console.log('this.parsedTableData checking', this.parsedTableData);
  
  //   // Generate column definitions from tableWidget_Config
  //   const tableWidgetColumns = this.parsedTableData.map((column: { text: string; value: string }) => ({
  //     headerName: column.text || 'Default Header', // Use a default name if text is missing
  //     field: column.value,
  //     sortable: true,
  //     filter: true,
  //     resizable: true,
  //   }));
  
  //   console.log('tableWidget column definitions:', tableWidgetColumns);
  
  //   // Include additional columns from columnLabelsArray
  //   const additionalColumns = this.columnLabelsArray
  //     .filter((label: string) => label && label.trim() !== '') // Filter out empty labels
  //     .map((label: string) => ({
  //       headerName: label,
  //       field: label,
  //       sortable: true,
  //       filter: true,
  //       resizable: true,
  //       cellRenderer: (params: { value: string; }) => {
  //         return params.value
  //         // put the value in bold
  //         // return 'Value is <b>' + params.value + '</b>';
  //     }
  //     }));
  
  //   console.log('Filtered additional columns from columnLabelsArray:', additionalColumns);
  
  //   // Combine tableWidget columns and additional columns
  //   this.columnDefs = [...tableWidgetColumns, ...additionalColumns];
  //   console.log('Final column definitions:', this.columnDefs);
  //   this.finalColumns = this.columnDefs
  
  //   // Parse row data
  //   this.rowData = JSON.parse(this.item.rowData);
  //   console.log('this.rowData', this.rowData);
  // } catch (error) {
  //   console.error('Error parsing table data:', error);
  // }

  //     // Do nothing, retain the existing this.item as is
  // }
 





  
    
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




ngOnInit(){
  console.log('item chacke',this.item.grid_details)
  this.summaryService.lookUpData$.subscribe((data: any)=>{
    console.log('data check>>>',data)
let tempCharts:any=[]
data.forEach((packet: any,matchedIndex:number) => {

if(packet.grid_type == 'TableWidget'&& this.index==matchedIndex && packet.id === this.item.id){
  tempCharts[matchedIndex] = packet
  console.log('packet checking from table widget',packet)
  setTimeout(() => {
    this.createtableWidget(packet)
    
  }, 500);

 
}
});

    
    // console.log("✅ Matched Charts:", matchedCharts);
    
  
    
    
  })


}


// exportToCSV(): void {
//   this.gridApi.exportDataAsCsv();
// }

// exportToExcel(): void {
//   this.gridApi.exportDataAsExcel();
// }


createtableWidget(mapWidgetData?:any){
  if(mapWidgetData){
    console.log('mapWidgetData check',mapWidgetData)
    console.log("❌ LiveDashboard is FALSE - Keeping original item.");
    this.formName = mapWidgetData.formlist
    this.customLabel = mapWidgetData.custom_Label
    console.log('this.customLabel checcking',this.customLabel)
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
  
  this.tabledata = mapWidgetData.tableWidget_Config; // This will contain your data
  console.log('description check', this.tabledata);
  
  try {
  this.tabledata = mapWidgetData.tableWidget_Config; // Source data for columns
  console.log('description check', this.tabledata);
  
  // Parse tableWidget_Config
  this.parsedTableData = JSON.parse(this.tabledata);
  console.log('this.parsedTableData checking', this.parsedTableData);
  
  // Generate column definitions from tableWidget_Config
  const tableWidgetColumns = this.parsedTableData.map((column: { text: string; value: string }) => ({
    headerName: column.text || 'Default Header', // Use a default name if text is missing
    field: column.value,
    sortable: true,
    filter: true,
    resizable: true,
  }));
  
  console.log('tableWidget column definitions:', tableWidgetColumns);
  
  // Include additional columns from columnLabelsArray
  const additionalColumns = this.columnLabelsArray
    .filter((label: string) => label && label.trim() !== '') // Filter out empty labels
    .map((label: string) => ({
      headerName: label,
      field: label,
      sortable: true,
      filter: true,
      resizable: true,
      cellRenderer: (params: { value: string; }) => {
        return params.value
        // put the value in bold
        // return 'Value is <b>' + params.value + '</b>';
    }
    }));
  
  console.log('Filtered additional columns from columnLabelsArray:', additionalColumns);
  
  // Combine tableWidget columns and additional columns
  this.columnDefs = [...tableWidgetColumns, ...additionalColumns];
  console.log('Final column definitions:', this.columnDefs);
  this.finalColumns = this.columnDefs
  
  // Parse row data
  this.rowData = JSON.parse(mapWidgetData.rowData);
  console.log('this.rowData', this.rowData);
  } catch (error) {
  console.error('Error parsing table data:', error);
  }
  }else{
    console.log("❌ LiveDashboard is FALSE - Keeping original item.");
      this.formName = this.item.formlist
      this.customLabel = this.item.custom_Label
      console.log('this.customLabel checcking',this.customLabel)
  // Parse the conditions
  this.parsedColumns = JSON.parse(this.item.conditions);
  console.log('this.parsedColumns checking else', this.parsedColumns);
  
  // Extract columnLabel values
  const columnLabels = this.parsedColumns.map((column: { columnLabel: string }) => column.columnLabel);
  
  // Log or store the extracted column labels
  console.log('Extracted column labels:', columnLabels);
  
  // Store in a variable
  this.columnLabelsArray = columnLabels; // Example variable to hold the column labels
  console.log('this.columnLabelsArray checking',this.columnLabelsArray)
    
  this.tabledata = this.item.tableWidget_Config; // This will contain your data
  console.log('description check', this.tabledata);
  
  try {
    this.tabledata = this.item.tableWidget_Config; // Source data for columns
    console.log('description check', this.tabledata);
  
    // Parse tableWidget_Config
    this.parsedTableData = JSON.parse(this.tabledata);
    console.log('this.parsedTableData checking', this.parsedTableData);
  
    // Generate column definitions from tableWidget_Config
    const tableWidgetColumns = this.parsedTableData.map((column: { text: string; value: string }) => ({
      headerName: column.text || 'Default Header', // Use a default name if text is missing
      field: column.value,
      sortable: true,
      filter: true,
      resizable: true,
    }));
  
    console.log('tableWidget column definitions:', tableWidgetColumns);
  
    // Include additional columns from columnLabelsArray
    const additionalColumns = this.columnLabelsArray
      .filter((label: string) => label && label.trim() !== '') // Filter out empty labels
      .map((label: string) => ({
        headerName: label,
        field: label,
        sortable: true,
        filter: true,
        resizable: true,
        cellRenderer: (params: { value: string; }) => {
          return params.value
          // put the value in bold
          // return 'Value is <b>' + params.value + '</b>';
      }
      }));
  
    console.log('Filtered additional columns from columnLabelsArray:', additionalColumns);
  
    // Combine tableWidget columns and additional columns
    this.columnDefs = [...tableWidgetColumns, ...additionalColumns];
    console.log('Final column definitions:', this.columnDefs);
    this.finalColumns = this.columnDefs
  
    // Parse row data
    // this.rowData = JSON.parse(this.item.rowData);
    // console.log('this.rowData from table Tile', this.rowData);


      // After parsing your row data and setting the rowData
  try {
    // Parse row data
    this.rowData = JSON.parse(this.item.rowData);
    console.log('this.rowData from table Tile', this.rowData);

    const enableRowCal = this.item.enableRowCal
    console.log('enableRowCal checking',enableRowCal)
    if(enableRowCal==true){

    if (this.rowData && this.rowData.length > 0) {
      const lastRow = this.rowData[this.rowData.length - 1]; // Get the last row

      // Set pinned row data to pin the last row
      this.pinnedBottomRowData = [{
        ...lastRow,
        style: { backgroundColor: '#f0f0f0' } // Add custom style for the pinned row
      }];
    
      

      // Log the pinned row data
      console.log('Pinned bottom row data:', this.pinnedBottomRowData);
    } else {
      console.warn('No rows found in rowData.');
    }

    }

    // Check if rowData has rows and pin the last row

  } catch (error) {
    console.error('Error parsing row data:', error);
  }

  } catch (error) {
    console.error('Error parsing table data:', error);
  }

  }


}

getRowStyle = ({ node }: RowClassParams): { [key: string]: string } | undefined => 
  node.rowPinned ? { fontWeight: 'bold', backgroundColor: 'lightblue' } : undefined;





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
   private modalService: NgbModal,private router: Router,private sanitizer: DomSanitizer,private summaryService:SummaryEngineService
   
  ){}

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
        fileName: `${this.formName}`+'.csv',
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
    console.log('this.rowData checking',this.rowData)
  
    const wb = XLSX.utils.book_new(); // Create a new workbook
    

  
    // Extract column headers and fields dynamically from finalColumns
    const columnHeaders = this.finalColumns.map((column: any) => column.headerName);
    const columnFields = this.finalColumns.map((column: any) => column.field);
    console.log('Extracted Column Headers:', columnHeaders);
    console.log('Extracted Column Fields:', columnFields);
  
    if (columnHeaders.length === 0) {
      console.error('No columns available for export.');
      // alert('No columns available for export.');
      return;
    }
  
    // Build the Excel data: column headers + row data
    const excelData = [
      columnHeaders, // Add headers as the first row
      ...this.rowData.map((row: Record<string, any>) =>
        columnFields.map((field: string | number) =>
          row[field] !== null && row[field] !== undefined ? row[field].toString() : '' // Handle null/undefined
        )
      ),
    ];
    console.log('Excel Data Check:', excelData);
  
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
    link.download = `${this.formName}`+'.xlsx';
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
  
    // Dynamically extract column headers from finalColumns (ensuring these are correct)
    const columnHeaders = this.finalColumns.map((column: any) => column.headerName);
    console.log('columnHeaders checking from table',columnHeaders)
    const columnFields = this.finalColumns.map((column: any) => column.field);
    console.log('columnFields checking from table', columnFields);
  
    if (columnHeaders.length === 0) {
      console.error('No columns available for export.');
      return;
    }
  
    // Adjust page size dynamically based on the number of columns
    const columnCount = columnFields.length;
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
      columnHeaders.map((col: any) => ({
        text: col, // Use column headers directly
        style: 'tableHeader',
      }))
    );
  
    // Add data rows
    this.rowData.forEach((row: Record<string, any>, index: number) => {
      const rowData = columnFields.map((col: string | number) => {
        const cellData = row[col];
        console.log('cellData checking', cellData);
  
        // Check for missing or undefined values
        if (cellData === null || cellData === undefined) {
          return ''; // Treat null/undefined as empty string
        }
  
        // If the cell data is an object, convert to string
        if (typeof cellData === 'object') {
          return JSON.stringify(cellData); // Convert objects to string
        }
  
        // Handle base64 images
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
        widths: Array(columnFields.length).fill('auto'), // Set column widths dynamically (can also be custom)
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
      pdfMake.createPdf(docDefinition).download(`${this.formName}` + '.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
      // Optionally show an alert or message here
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


  ngAfterViewInit(){

      this.createtableWidget()

  

  }



  clickLock = false;
  onCellClick(eventData: any) {
    if (this.clickLock) {
      console.log("Click ignored: Already processing a click.");
      return; // Ignore repeated clicks
    }
  
    this.clickLock = true; // Lock the click
    console.log("eventData check for", eventData);
  
    this.dataTableCellInfo.emit(eventData);
  
    // Unlock click after a short delay (e.g., 500ms)
    setTimeout(() => {
      this.clickLock = false;
    }, 500);
  }
  
    detectScreenSize() {
    this.isMobile = window.innerWidth <= 760; // Adjust breakpoint as needed
    // if (this.isMobile)
      // alert(`${this.mobileChartWidth}, 'X',${this.mobileChartHeight}`)
  }

}
