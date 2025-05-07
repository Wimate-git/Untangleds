import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { GridApi ,Column} from 'ag-grid-community';
import { event } from 'jquery';
import pdfMake from 'pdfmake/build/pdfmake';
import * as XLSX from 'xlsx';  

@Component({
  selector: 'app-data-table-tile1',

  templateUrl: './data-table-tile1.component.html',
  styleUrl: './data-table-tile1.component.scss'
})
export class DataTableTile1Component {
  modalRef: NgbModalRef | undefined;
  @Input() modal :any
  @Input() responseRowData: any[] = []; // Accept row data
  @Input() all_Packet_store: any[] = [];
  @Output() modalClose = new EventEmitter<void>(); // Emit an event when the modal is closed
  @Input() storeDrillDown :any

  private gridApi!: GridApi;
  pageSizeOptions = [10, 25, 50, 100];

  @Output() dataTableCellInfo = new EventEmitter<any>();
  @Output() miniTableIcon = new EventEmitter<any>() 
  @Output() sendFormNameForMini = new EventEmitter<any>();
  @Output() emitfullRowDataToParent = new EventEmitter<any>();
  
  rowClass: 'clickable-row'
  modalData: any[] = [];
  iconCellRenderer: (params: any) => string; 
  

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


  constructor(private modalService: NgbModal) {
    this.iconCellRenderer = function (params) {
      console.log('check what params params is getting', params);
    
      // Check if 'dynamic_table_values' exists and is not empty
      if (params.data.dynamic_table_values && Object.keys(params.data.dynamic_table_values).some(key => params.data.dynamic_table_values[key].length > 0)) {
        // If conditions are met, return the icon HTML with a click event
        return `
          <i 
            class="bi bi-table" 
            style="color: #204887; font-size: 25px;" 
            (click)="onIconClick($event, ${params.node.rowIndex}, ${params})"></i>`;
      } else {
        // If conditions are not met, return an empty string
        return '';
      }
    };
    
    
    
  }


  onIconClick(event: MouseEvent, rowIndex?: number) {
    console.log('i am clicked',event)
    console.log('Icon clicked in row index:', rowIndex);
    // const rowData = this.responseRowData[rowIndex];
    // console.log('Row data:', rowData);
  
    // You can now perform any logic you need with the clicked row data
    // For example, you might want to open a modal or navigate somewhere
  }
  
  ngOnChanges(changes: SimpleChanges): void {
console.log('modalData check',this.storeDrillDown)
console.log('columnDefs check',this.all_Packet_store)
this.FormName = this.storeDrillDown.formlist
console.log('this.storeDrillDown checking datatable tile1',this.storeDrillDown)
console.log('this.FormName for drill name',this.FormName)
console.log('responseRowData c hecking from datatable Tile1',this.responseRowData)
this.emitfullRowDataToParent.emit(this.responseRowData)
// this.extractRowData = JSON.parse(this.item.rowData)
// console.log('this.extractRowData checking',this.extractRowData)
// console.log('this.extractRowData checking from',this.extractRowData)
// this.sendminiTableData.emit(this.extractRowData)

// this.extractFormName = this.item.formlist
// console.log('this.extractFormName',this.extractFormName)
this.sendFormNameForMini.emit(this.FormName)

this.parseChartConfig(this.storeDrillDown)

    
  }



  ngOnInit(){}
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
  
  // Function to create AG Grid column definitions

  

  // createColumnDefs(columnVisibility: any[]) {
  //   return columnVisibility.map(column => ({
  //     headerName: column.text,
  //     field: column.value,
  //     sortable: true,
  //     filter: true,
  //     resizable: true,
  //     cellClass: 'pointer-cursor' , // Add this class to the cells
  //     cellRenderer: (column.value === 'dynamic_table_values') ? this.iconCellRenderer : undefined,
  //   }));
  // }



  createColumnDefs(columnVisibility: any[]) {
    return columnVisibility.map(column => ({
      headerName: column.text,
      field: column.value,
      sortable: true,
      filter: true,
      resizable: true,
      cellClass: 'pointer-cursor',
      cellRenderer: (column.value === 'dynamic_table_values') ? this.iconCellRenderer : undefined, // Set the appropriate cellRenderer
      // If you want to handle click events for dynamic_table_values separately, you can define params like this:
      cellRendererParams: (column.value === 'dynamic_table_values') 
        ? {
            onClick: (event: MouseEvent) => this.onIconClick(event)  // If needed, handle icon clicks
          }
        : undefined
    }));
  }
  
  
  onBtnClick(receivedata:any){
    console.log('i am clicked')

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
        if (!this.responseRowData || this.responseRowData.length === 0) {
          console.error('No data available for export.');
          // alert('No data available for export.');
          return; // Exit if there's no data to export
        }
        console.log('this.rowData checking',this.responseRowData)
      
        const wb = XLSX.utils.book_new(); // Create a new workbook
        
    
      
        // Extract column headers and fields dynamically from finalColumns
        const columnHeaders = this.columnDefs.map((column: any) => column.headerName);
        const columnFields = this.columnDefs.map((column: any) => column.field);
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
          ...this.responseRowData.map((row: Record<string, any>) =>
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


      clickLock = false; // Lock flag to prevent multiple clicks
      onCellClick(eventData: any, isIconClick: boolean = false) {
        console.log('eventdata checking from cell',eventData)
        if (this.clickLock) {
          console.log("Click ignored: Already processing a click.");
          return; // Ignore repeated clicks
        }
        const storeminiTableData = eventData.value;

        if (Object.keys(storeminiTableData).some(key => key.startsWith('table'))) {
          this.miniTableIcon.emit(eventData)
          // If keys start with 'table', do nothing
          console.log("Data contains 'table' key, no action taken.",eventData);
        } else {
          // If no key starts with 'table', proceed with the else block
          console.log("Row clicked, eventData: ", eventData);
          setTimeout(() => {
            
            this.dataTableCellInfo.emit(eventData); 
          }, 500);
 
        }
      
    // Lock the click
      
   
          // This is the row click handler
 // Emit data to parent if needed
        
      
        // Unlock click after a short delay (e.g., 500ms)
        setTimeout(() => {
          this.clickLock = false;
        }, 500);
      }

      getRowClass(params:any) {
        if (params.node && params.node.data && params.node.data.clickable) {
          return 'ag-row-clickable'; // Add the class for clickable rows
        }
        return '';
      }

      isModalOpen = false;

      onRowClick(event: any): void {
        console.log('Row clicked:', event.data);
        this.modalData = [event.data]; // Pass the clicked row data to the modal
        this.isModalOpen = true;
      }
}
