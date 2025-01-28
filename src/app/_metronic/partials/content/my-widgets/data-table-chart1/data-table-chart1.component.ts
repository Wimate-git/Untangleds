import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { GridApi ,Column} from 'ag-grid-community';
import * as XLSX from 'xlsx';  

@Component({
  selector: 'app-data-table-chart1',

  templateUrl: './data-table-chart1.component.html',
  styleUrl: './data-table-chart1.component.scss'
})
export class DataTableChart1Component {
  modalRef: NgbModalRef | undefined;
  @Input() modal :any

  // @Input() columnDefs: any[] = [];
  @Output() modalClose = new EventEmitter<void>(); // Emit an event when the modal is closed
  @Input() sendRowDynamic :any
  @Input() all_Packet_store :any
  columnDefs: any[]; 
  private gridApi!: GridApi;

  

  // @Input() columnDefs: any[] = []; 




  // Dummy column definitions

  gridColumnApi: any;

  onGridReady(params:any) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }



  // Default column properties
  defaultColDef = {
    sortable: true,
    filter: true,
    resizable: true,
  };


  constructor() {

  }

  ngOnChanges(changes: SimpleChanges): void {

console.log('columnDefs check',this.columnDefs)
console.log('sendRowDynamic checking from data table',this.sendRowDynamic)
console.log('all_Packet_store from data table',this.all_Packet_store)
this.parseChartConfig(this.all_Packet_store);
    
  }



  // closeModal(): void {
  //   this.modalClose.emit();
  // }

  closeModal(): void {
    if (this.modalRef) {
      this.modalRef.close(); // Close the modal
    }
  }
  parseChartConfig(data: any) {
    // Iterate through the grid_details array
    data.grid_details.forEach((detail: { grid_type: string; chartConfig: string; }) => {
      // Check if the current detail's grid_type is 'chart'
      if (detail.grid_type === 'chart') {
        console.log('Found chart config:', detail.chartConfig);
        try {
          // Parse the chartConfig JSON string to access its properties
          const chartConfig = JSON.parse(detail.chartConfig);
          console.log('chartConfig checking', chartConfig);

          // Check if chartConfig is not empty and has at least one element
          if (chartConfig.length > 0 && chartConfig[0].columnVisibility) {
            console.log('Column Visibility from Chart Config:', chartConfig[0].columnVisibility);
            // Generate column definitions from the columnVisibility
            this.columnDefs = this.createColumnDefs(chartConfig[0].columnVisibility);
          } else {
            console.log('No column visibility data found in chart config.');
          }
        } catch (e) {
          console.error('Error parsing chartConfig:', e);
        }
      }
    });
  }
  createColumnDefs(columnVisibility: any[]) {
    return columnVisibility.map(column => ({
      headerName: column.text,
      field: column.value,
      sortable: true,
      filter: true,
      resizable: true
    }));
  }

  exportToCSV(): void {
    if (this.gridApi) {
      this.gridApi.exportDataAsCsv({
        fileName: 'data.csv',
        columnSeparator: ',',
      });
    } else {
      console.error('Grid API is not initialized!');
      alert('Unable to export to CSV. Please ensure the grid is loaded.');
    }
  }
  exportAllTablesAsExcel() {
    if (!this.sendRowDynamic || this.sendRowDynamic.length === 0) {
      console.error('No data available for export.');
      alert('No data available for export.');
      return; // Exit if there's no data to export
    }
    console.log('this.rowData checking',this.sendRowDynamic)
  
    const wb = XLSX.utils.book_new(); // Create a new workbook
    

  
    // Extract column headers and fields dynamically from finalColumns
    const columnHeaders = this.columnDefs.map((column: any) => column.headerName);
    const columnFields = this.columnDefs.map((column: any) => column.field);
    console.log('Extracted Column Headers:', columnHeaders);
    console.log('Extracted Column Fields:', columnFields);
  
    if (columnHeaders.length === 0) {
      console.error('No columns available for export.');
      alert('No columns available for export.');
      return;
    }
  
    // Build the Excel data: column headers + row data
    const excelData = [
      columnHeaders, // Add headers as the first row
      ...this.sendRowDynamic.map((row: Record<string, any>) =>
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
    link.download = 'table-data.xlsx';
    link.click();
  }


}
