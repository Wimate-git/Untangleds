import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { GridApi ,Column} from 'ag-grid-community';
import pdfMake from 'pdfmake/build/pdfmake';
import * as XLSX from 'xlsx';  

@Component({
  selector: 'app-data-table-pie-chart',

  templateUrl: './data-table-pie-chart.component.html',
  styleUrl: './data-table-pie-chart.component.scss'
})
export class DataTablePieChartComponent {
  modalRef: NgbModalRef | undefined;
  @Input() modal :any

  // @Input() columnDefs: any[] = [];
  @Output() modalClose = new EventEmitter<void>(); // Emit an event when the modal is closed
  @Input() sendRowDynamic :any
  @Input() all_Packet_store :any
  @Input() chartDataConfigExport :any
  
  @Output() dataTableCellInfo = new EventEmitter<any>();
  columnDefs: any[]; 
  private gridApi!: GridApi;
  pageSizeOptions = [10, 25, 50, 100];

  

  // @Input() columnDefs: any[] = []; 




  // Dummy column definitions

  gridColumnApi: any;
  FormName: any;

  onGridReady(params:any) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }



  // Default column properties
  defaultColDef = {
    sortable: true,
    filter: true,
    resizable: true,
    enableColMove: true
  };


  constructor(private modalService: NgbModal) {

  }

  ngOnChanges(changes: SimpleChanges): void {

console.log('columnDefs check',this.columnDefs)
console.log('sendRowDynamic checking from data table',this.sendRowDynamic)
this.sendRowDynamic = this.formatDateFields(this.sendRowDynamic);
console.log('Formatted Data:', this.sendRowDynamic);
console.log('all_Packet_store from data table',this.all_Packet_store)
console.log('chartDataConfigExport',this.chartDataConfigExport)
this.FormName = this.chartDataConfigExport.columnVisibility[0].formlist
console.log('this.FormName',this.FormName)

// this.parseChartConfig(this.all_Packet_store);
this.parseChartConfig(this.chartDataConfigExport)
    
  }


  private formatDateFields(data: any[]): any[] {
    return data.map(row => {
      Object.keys(row).forEach(key => {
        if (key.startsWith('date-')) {
          // Format the date if the key starts with 'date-'
          row[key] = this.formatDate(row[key]);
        }
      });
      return row;
    });
  }
  
  private formatDate(dateStr: string): string {
    console.log('dateStr checking from table widget', dateStr);
  
    // Check if dateStr is empty or invalid
    if (!dateStr || isNaN(new Date(dateStr).getTime())) {
      return '';  // Return an empty string or any default message if the date is invalid or empty
    }
  
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

  // closeModal(): void {
  //   this.modalClose.emit();
  // }

  closeModal(): void {
    this.modalService.dismissAll()
      }
  parseChartConfig(chartDataConfigExport:any) {
    if (!chartDataConfigExport || !Array.isArray(chartDataConfigExport.columnVisibility)) {
      console.error('Invalid chartDataConfigExport format:', this.chartDataConfigExport);
      return;
    }
  
    try {
      const flattenedColumnVisibility = chartDataConfigExport.columnVisibility.flatMap((col: any) => col.columnVisibility || []);
      console.log('Flattened Column Visibility:', flattenedColumnVisibility);
  
      this.columnDefs = this.createColumnDefs(flattenedColumnVisibility);
      console.log('Generated Column Definitions:', this.columnDefs);
    } catch (e) {
      console.error('Error processing chartDataConfigExport:', e);
    }
  }
  createColumnDefs(columnVisibility: any[]) {
    console.log('columnVisibility check',columnVisibility)
    return columnVisibility.map(column => ({
      headerName: column.text,
      field: column.value,
      sortable: true,
      filter: true,
      resizable: true
    }));
  }
  // deleteColumn(colId: string): void {
  //   // Filter out the column with the specified colId
  //   this.columnDefs = this.columnDefs.filter(col => col.field !== colId);
  //   // Update the grid with the new column definitions
  //   if (this.gridApi) {
  //     this.gridApi.setColumnDefs(this.columnDefs);
  //   }
  // }
  

  exportToCSV(): void {
    if (this.gridApi) {
      this.gridApi.exportDataAsCsv({
        fileName: `${this.FormName}`+'.csv',
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
    link.download = `${this.FormName}`+'.xlsx';
    link.click();
  }

  exportAllTablesAsPDF() {
    if (!this.sendRowDynamic || this.sendRowDynamic.length === 0) {
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
    const columnHeaders = this.columnDefs.map((column: any) => column.headerName);
    const columnFields = this.columnDefs.map((column: any) => column.field);
    console.log('columnFields checking',columnFields)
    // const columns = Object.keys(this.rowData[0] || {});
    // console.log('columns checking',columns)

    if (columnHeaders.length === 0) {
      console.error('No columns available for export.');
      return;
    }
  
    // Adjust page size dynamically
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
    this.sendRowDynamic.forEach((row: Record<string, any>, index: number) => {
      const rowData = columnFields.map((col: string | number) => {
        const cellData = row[col];
        console.log('cellData checking',cellData)
  
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
        widths: Array(columnFields.length).fill('auto'),
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
      pdfMake.createPdf(docDefinition).download(`${this.FormName}`+'.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  }

  clickLock = false; // Lock flag to prevent multiple clicks

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


}
