
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, QueryList, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
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
import { APIService } from 'src/app/API.service';
import { SharedService } from 'src/app/pages/shared.service';
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
  pageSizeOptions = [10, 25, 50, 100,150,200,250,300];
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
  SK_clientID: any;
  getLoggedUser: any;
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
  this.getLoggedUser = this.summaryConfiguration.getLoggedUserDetails()
  console.log('this.getLoggedUser read for redirect',this.getLoggedUser)


  this.SK_clientID = this.getLoggedUser.clientID;
  this.summaryService.lookUpData$.subscribe((data: any)=>{
    console.log('data check>>>',data)
let tempCharts:any=[]
data.forEach((packet: any,matchedIndex:number) => {

if(packet.grid_type == 'TableWidget'&& this.index==matchedIndex && packet.id === this.item.id){
  tempCharts[matchedIndex] = packet
  // this.sendRowDynamic = this.formatDateFields(this.sendRowDynamic);
  // console.log('Formatted Data:', this.sendRowDynamic);
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


  async createtableWidget(mapWidgetData?:any){
    
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
  

  const dateKeys: string[] = [];
  console.log('check row data from table widget live data',this.rowData)
  const storeRowadata = JSON.parse(mapWidgetData.rowData)
  console.log('check storeRowadata data from table widget live',storeRowadata)




  storeRowadata.forEach((row: any) => {
    Object.keys(row).forEach((key) => {
      if (
        (key.startsWith('date') ||
         key.startsWith('datetime') ||
         key.startsWith('epoch-date') ||
         key.startsWith('epoch-datetime-local')) &&
        !dateKeys.includes(key)
      ) {
        dateKeys.push(key);
      }
    });
  });
  
  console.log('Extracted date/datetime keys:', dateKeys);
  console.log('Extracted date keys:', dateKeys);
  const matchedDateFields = await this.fetchDynamicFormData(this.formName, dateKeys);
  console.log('Received date fields in caller:', matchedDateFields);
  
  

  this.rowData = this.formatDateFields(storeRowadata,matchedDateFields);
console.log('Formatted Data:', this.rowData);


const getFilterFields = JSON.parse(mapWidgetData.filter_duplicate_data)


// Log the filtered data
console.log('getFilterFields rowData:', getFilterFields);

// Check if getFilterFields has a length before calling removeDuplicatePacketsBasedOnFilterFields
if (getFilterFields && getFilterFields.length > 0) {
  // If getFilterFields has data, call the function with getFilterFields
  this.rowData = this.removeDuplicatePacketsBasedOnFilterFields(this.rowData, getFilterFields);
  console.log('Filtered rowData based on filterFields:', this.rowData);
} else {
  // If getFilterFields is empty, call the function without it
  // this.rowData = this.removeDuplicatePacketsBasedOnFilterFields(this.rowData, []);
  console.log('Filtered rowData without filterFields:', this.rowData);
}


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
  // Parse row data
  console.log('mapWidgetData.rowData checking from',JSON.parse(mapWidgetData.rowData))
  // this.rowData = JSON.parse(mapWidgetData.rowData);
  // this.rowData = this.formatDateFields(this.rowData);
  console.log('Formatted Data:', this.rowData);
  console.log('this.rowData', this.rowData);
  } catch (error) {
  console.error('Error parsing table data:', error);
  }
  }
  
  else{
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
    const parseRowData = JSON.parse(this.item.rowData);
    console.log('this.rowData from table Tile', parseRowData);

    const dateKeys: string[] = [];

    parseRowData.forEach((row: any) => {
      Object.keys(row).forEach((key) => {
        if (
          (key.startsWith('date') ||
           key.startsWith('datetime') ||
           key.startsWith('epoch-date') ||
           key.startsWith('epoch-datetime-local')) &&
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
console.log('Formatted Data:', this.rowData);
    
    // this.rowData = this.removeMatchingPackets(this.rowData);
    const getFilterFields = JSON.parse(this.item.filter_duplicate_data)


// Log the filtered data
console.log('getFilterFields rowData:', getFilterFields);

// Check if getFilterFields has a length before calling removeDuplicatePacketsBasedOnFilterFields
if (getFilterFields && getFilterFields.length > 0) {
  // If getFilterFields has data, call the function with getFilterFields
  this.rowData = this.removeDuplicatePacketsBasedOnFilterFields(this.rowData, getFilterFields);
  console.log('Filtered rowData based on filterFields:', this.rowData);
} else {
  // If getFilterFields is empty, call the function without it
  // this.rowData = this.removeDuplicatePacketsBasedOnFilterFields(this.rowData, []);
  console.log('Filtered rowData without filterFields:', this.rowData);
}


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





private formatDateFields(data: any[], receiveformatPckets: any[]): any[] {
  console.log('receiveformatPckets checking', receiveformatPckets);

  return data.map(row => {
    Object.keys(row).forEach(key => {
      const isDateKey = key.startsWith('date-');
      const isDateTimeKey = key.startsWith('datetime-');
      const isEpochDate = key.startsWith('epoch-date-');
      const isEpochDateTime = key.startsWith('epoch-datetime-local-');

      if (isDateKey || isDateTimeKey || isEpochDate || isEpochDateTime) {
        const matchingField = receiveformatPckets.find(
          (packet: any) => packet.name === key
        );

        if (matchingField) {
          const validation = matchingField.validation || {};
          const dateFormat = validation.dateFormatType || 'DD/MM/YYYY';
          const timeFormat = validation.timeFormatType || '12-hour (hh:mm AM/PM)';

          console.log('Date Format Applied:', dateFormat);
          console.log('Time Format Applied:', timeFormat);

          let rawValue = row[key];

          // ✅ Convert epoch to ISO string (only if it's a number)
          if ((isEpochDate || isEpochDateTime) && rawValue) {
            const epoch = parseInt(rawValue, 10);
            if (!isNaN(epoch)) {
              const epochMs = epoch < 1e12 ? epoch * 1000 : epoch; // Detect seconds vs milliseconds
              rawValue = new Date(epochMs).toISOString();
            }
          }

          // ✅ Apply formatting
          const requiresTime = isDateTimeKey || isEpochDateTime;
          row[key] = this.formatDate(rawValue, dateFormat, requiresTime ? timeFormat : null);
        }
      }
    });
    return row;
  });
}




private formatDate(dateStr: string, dateFormat: string = 'DD/MM/YYYY', timeFormat?: string): string {
  if (!dateStr || typeof dateStr !== 'string') return '';

  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return '';

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = String(date.getFullYear());

  let formattedDate = '';
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

  const resolvedTimeFormat = (timeFormat || '12-hour (hh:mm AM/PM)').trim().toLowerCase();
  let formattedTime = '';
  const hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');

  if (resolvedTimeFormat.includes('am/pm')) {
    const hour12 = (hours % 12) || 12;
    const meridian = hours >= 12 ? 'PM' : 'AM';
    formattedTime = `${String(hour12).padStart(2, '0')}:${minutes} ${meridian}`;
  } else {
    formattedTime = `${String(hours).padStart(2, '0')}:${minutes}`;
  }

  return timeFormat ? `${formattedDate} ${formattedTime}` : formattedDate;
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
   private modalService: NgbModal,private router: Router,private sanitizer: DomSanitizer,private summaryService:SummaryEngineService,private api: APIService,private cdr: ChangeDetectorRef,private summaryConfiguration: SharedService
   
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
    // Get all the rows, not just the rendered (visible) ones
    const rowCount = this.gridApi.getDisplayedRowCount();  // Get the total number of rows
    const dataToExport = [];
  
    // Loop through all rows and push them into dataToExport
    for (let i = 0; i < rowCount; i++) {
      const rowNode = this.gridApi.getDisplayedRowAtIndex(i);  // Get row data at each index
      if (rowNode) {
        dataToExport.push(rowNode.data);  // Push row data into the array
      }
    }
  
    if (!dataToExport || dataToExport.length === 0) {
      console.error('No data available for export.');
      return; // Exit if there's no data to export
    }
  
    console.log('Data to Export:', dataToExport);
  
    const wb = XLSX.utils.book_new(); // Create a new workbook
  
    // Extract column headers and fields dynamically from finalColumns
    const columnHeaders = this.finalColumns.map((column: any) => column.headerName);
    const columnFields = this.finalColumns.map((column: any) => column.field);
    console.log('Extracted Column Headers:', columnHeaders);
    console.log('Extracted Column Fields:', columnFields);
  
    if (columnHeaders.length === 0) {
      console.error('No columns available for export.');
      return;
    }
  
    // Build the Excel data: column headers + row data
    const excelData = [
      columnHeaders, // Add headers as the first row
      ...dataToExport.map((row: any) => 
        columnFields.map((field: string) => 
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
    link.download = `${this.formName}.xlsx`;
    link.click();
  }
  
  
  exportAllTablesAsPDF() {
    // Get the filter model (this returns the active filters in the grid)
    const filterModel = this.gridApi.getFilterModel();
  
    // Use the filter model to determine which rows are filtered
    // Get all rows (filtered or unfiltered)
    const rowCount = this.gridApi.getDisplayedRowCount();  // Get the total number of rows displayed
    const dataToExport = [];
  
    // Loop through all rows and push them to dataToExport
    for (let i = 0; i < rowCount; i++) {
      const rowNode = this.gridApi.getDisplayedRowAtIndex(i); // Get the row node at the given index
      if (rowNode) {
        dataToExport.push(rowNode.data); // Push row data into the array
      }
    }
  
    if (!dataToExport || dataToExport.length === 0) {
      console.error('No data available for export.');
      return; // Exit if there's no data to export
    }
  
    const docDefinition: any = {
      content: [],
      defaultStyle: {},
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
  
    // Extract column headers from finalColumns (ensure these are correct)
    const columnHeaders = this.finalColumns.map((column: any) => column.headerName);
    const columnFields = this.finalColumns.map((column: any) => column.field);
  
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
        text: col,
        style: 'tableHeader',
      }))
    );
  
    // Add data rows
    dataToExport.forEach((row: Record<string, any>, index: number) => {
      const rowData = columnFields.map((col: string | number) => {
        const cellData = row[col];
  
        // Handle missing values
        if (cellData === null || cellData === undefined) {
          return ''; // Treat null/undefined as empty string
        }
  
        // If the cell data is an object, convert it to a string
        if (typeof cellData === 'object') {
          return JSON.stringify(cellData); // Convert objects to string
        }
  
        // Handle base64 images (if present in your data)
        if (typeof cellData === 'string' && cellData.includes('data:image')) {
          return {
            image: cellData,
            width: 50,
            height: 50,
          }; // Render base64 images
        }
  
        return cellData.toString(); // Convert other data types to string
      });
  
      // Add row data to the table body
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
    setTimeout(() => {
      this.createtableWidget()
      
    }, 500);



  

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


  getFilteredData() {
    // Get the filtered nodes (those that are rendered based on the applied filters)
    const filteredNodes = this.gridApi.getRenderedNodes();  // Use getRenderedNodes instead of getFilteredNodes
    console.log('filteredNodes checking from table',filteredNodes)
  
    // Map them to their data
    const filteredData = filteredNodes.map((node: any) => node.data); 
    console.log('filteredData checking',filteredData)
  
    console.log(filteredData);  // Log or use the filtered data
    return filteredData;  // Return the filtered data
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
  
  

}
