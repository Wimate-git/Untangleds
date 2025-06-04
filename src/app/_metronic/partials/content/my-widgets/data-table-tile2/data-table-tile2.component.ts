import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { GridApi ,Column} from 'ag-grid-community';
import pdfMake from 'pdfmake/build/pdfmake';
import * as XLSX from 'xlsx';  

@Component({
  selector: 'app-data-table-tile2',

  templateUrl: './data-table-tile2.component.html',
  styleUrl: './data-table-tile2.component.scss'
})
export class DataTableTile2Component {
  modalRef: NgbModalRef | undefined;
  @Input() modal :any
  @Input() responseRowData: any[] = []; // Accept row data
  @Input() all_Packet_store: any[] = [];
  @Output() modalClose = new EventEmitter<void>(); // Emit an event when the modal is closed
  @Input() storeDrillDown :any

  private gridApi!: GridApi;
  pageSizeOptions = [10, 25, 50, 100];
  

  //   [responseRowData]="responseRowData"
  // [all_Packet_store]="all_Packet_store"
  // @Input() columnDefs: any[] = []; 




  // Dummy column definitions


  // Default column properties
  defaultColDef = {
    sortable: true,
    filter: true,
    resizable: true,
  };
  columnDefs: { headerName: any; field: any; sortable: boolean; filter: boolean; resizable: boolean; }[];
  FormName: any;
  gridColumnApi: any;


  constructor(private modalService: NgbModal) {}

  ngOnChanges(changes: SimpleChanges): void {
console.log('modalData check',this.storeDrillDown)
console.log('columnDefs check',this.all_Packet_store)
this.FormName = this.storeDrillDown.formlist
console.log('this.FormName for drill name',this.FormName)
this.responseRowData = this.formatDateFields(this.responseRowData);
console.log('Formatted Data:', this.responseRowData);

this.parseChartConfig(this.storeDrillDown)

    
  }

  parseChartConfig(data: any) {
    console.log('datachecking tile1 drill', data);
  
    try {
      // Parse columnVisibility if it's a string
      const columnVisibility = typeof data.columnVisibility === 'string'
        ? JSON.parse(data.columnVisibility)
        : data.columnVisibility;
  
      console.log('Column Visibility:', columnVisibility);
  
      // Generate AG Grid column definitions
      this.columnDefs = this.createColumnDefs(columnVisibility);
    } catch (e) {
      console.error('Error parsing columnVisibility:', e);
    }
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

  

  createColumnDefs(columnVisibility: any[]) {
    return columnVisibility.map(column => ({
      headerName: column.text,
      field: column.value,
      sortable: true,
      filter: true,
      resizable: true
    }));
  }

  // closeModal(): void {
  //   this.modalClose.emit();
  // }

  closeModal(): void {
    this.modalService.dismissAll()
      }

      exportToCSV(): void {
        if (this.gridApi) {
          this.gridApi.exportDataAsCsv({
            fileName: `${this.FormName}`+'.csv',
            columnSeparator: ',',
          });
        } else {
          console.error('Grid API is not initialized!');
          // alert('Unable to export to CSV. Please ensure the grid is loaded.');
        }
      }
      exportAllTablesAsExcel() {
        let dataToExport: any[] = [];
      
        // Check if filters are applied and rows are reduced
        const isFilterApplied = this.gridApi && Object.keys(this.gridApi.getFilterModel()).length > 0;
        const displayedRowCount = this.gridApi.getDisplayedRowCount();
      
        if (isFilterApplied && displayedRowCount > 0) {
          // ✅ Export only filtered data
          this.gridApi.forEachNodeAfterFilter((node: any) => {
            if (node.data) dataToExport.push(node.data);
          });
        } else {
          // ✅ No filters — export all raw data
          dataToExport = this.responseRowData || [];
        }
      
        if (!dataToExport.length) {
          console.error('No data available for export.');
          return;
        }
      
        const wb = XLSX.utils.book_new();
      
        // Extract headers and fields dynamically
        const columnHeaders = this.columnDefs.map((col: any) => col.headerName);
        const columnFields = this.columnDefs.map((col: any) => col.field);
      
        if (!columnHeaders.length) {
          console.error('No columns available for export.');
          return;
        }
      
        const excelData = [
          columnHeaders,
          ...dataToExport.map(row =>
            columnFields.map(field =>
              row[field] !== null && row[field] !== undefined ? row[field].toString() : ''
            )
          )
        ];
      
        const ws = XLSX.utils.aoa_to_sheet(excelData);
        XLSX.utils.book_append_sheet(wb, ws, 'Work Orders');
      
        const excelFile = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelFile], { type: 'application/octet-stream' });
      
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${this.FormName || 'ExportedData'}.xlsx`;
        link.click();
      }
      exportAllTablesAsPDF() {
        if (!this.responseRowData || this.responseRowData.length === 0) {
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
        this.responseRowData.forEach((row: Record<string, any>, index: number) => {
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
          // alert('Failed to generate PDF. Please try again.');
        }
      }

      onGridReady(params:any) {
        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;
      }


}
