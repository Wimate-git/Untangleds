import { ChangeDetectorRef, Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { GridApi ,Column} from 'ag-grid-community';
import { event } from 'jquery';
import pdfMake from 'pdfmake/build/pdfmake';
import { APIService } from 'src/app/API.service';
import { SharedService } from 'src/app/pages/shared.service';
import { SummaryEngineService } from 'src/app/pages/summary-engine/summary-engine.service';
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

  private gridApi!: any;
  pageSizeOptions = [10, 25, 50, 100,150,200,250,300];

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
  getLoggedUser: any;
  @Input() SK_clientID:any
  formattedRowData: any[];


 constructor(private modalService: NgbModal,private summaryService:SummaryEngineService,private api: APIService,private cdr: ChangeDetectorRef,private summaryConfiguration: SharedService) {
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
  
  async ngOnChanges(changes: SimpleChanges): Promise<void> {
console.log('modalData check',this.storeDrillDown)
console.log('columnDefs check',this.all_Packet_store)

this.FormName = this.storeDrillDown.formlist
console.log('this.storeDrillDown checking datatable tile1',this.storeDrillDown)
console.log('this.FormName for drill name',this.FormName)
console.log('responseRowData c hecking from datatable Tile1',this.responseRowData)


const dateKeys: string[] = [];

this.responseRowData.forEach((row: any) => {
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
const matchedDateFields = await this.fetchDynamicFormData(this.FormName, dateKeys);
console.log('Received date fields in caller:', matchedDateFields);




this.formattedRowData = this.formatDateFields(this.responseRowData,matchedDateFields);
console.log('Formatted Data:', this.responseRowData);



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
      console.log('this.columnDefs checking from ui',this.columnDefs)
    } catch (e) {
      console.error('Error parsing columnVisibility:', e);
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

    }));
  }
  
  
  onBtnClick(receivedata:any){
    console.log('i am clicked')

  }
  // closeModal(): void {
  //   this.modalClose.emit();
  // }


  closeModal(): void {
    if (this.gridApi) {
      this.gridApi.destroy(); // Destroys the grid instance
      this.gridApi  = null ;    // Clean reference
    }
    this.cdr.detectChanges()
    this.modalService.dismissAll();
  

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
        // Use getRenderedNodes() to check for filtered data
        const dataToExport = this.gridApi.getRenderedNodes().length > 0
          ? this.gridApi.getRenderedNodes().map((node: any) => node.data)  // Use filtered rows if available
          : this.responseRowData;  // Fallback to full data if no filtered rows
      
        if (!dataToExport || dataToExport.length === 0) {
          console.error('No data available for export.');
          return; // Exit if there's no data to export
        }
      
        const docDefinition: any = {
          content: [],
          pageSize: { width: 500, height: 1000 },
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
      
        // Dynamically extract column headers and map them to row data
        const columnHeaders = this.columnDefs.map((column: any) => column.headerName);
        const columnFields = this.columnDefs.map((column: any) => column.field);
      
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
        dataToExport.forEach((row: Record<string, any>, index: number) => {
          const rowData = columnFields.map((col: string | number) => {
            const cellData = row[col];
            console.log('cellData checking', cellData);
      
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



        const maxRows = this.responseRowData.length;
        const maxColumns = this.responseRowData.length > 0
          ? Object.keys(this.responseRowData[0]).length
          : 0;
        
        console.log('Row Count:', maxRows);
        console.log('Column Count:', maxColumns);
        
        
        console.log('Maximum Rows:', maxRows);
        console.log('Maximum Columns:', maxColumns);
        
    
        let dynamicWidth = this.calculatePageWidth(maxColumns)
        let dynamicHight = 0;
    
        if (maxColumns >= 100) {
          dynamicHight = 2500 + (70 * maxColumns); // higher offset for large tables
        } else if (maxColumns >= 50) {
          dynamicHight = 2200 + (50 * maxColumns);
        } else if (maxColumns >= 10) {
          dynamicHight = 1800 + (35 * maxColumns);
        } else {
          dynamicHight = 1200;
        }
        
    
        const minWidth = 595.28; // A4 width in points
        const minHeight = 841.89; // A4 height in points
    
        // Check and enforce minimum dimensions
        if (dynamicWidth < minWidth) {
          dynamicWidth = minWidth;
        }
        if (dynamicHight < minHeight) {
          dynamicHight = minHeight;
        }
    
        docDefinition.pageSize = { width: dynamicWidth, height: dynamicHight }
      
      
        // Error handling during PDF generation
        try {
          pdfMake.createPdf(docDefinition).download(`${this.FormName}` + '.pdf');
        } catch (error) {
          console.error('Error generating PDF:', error);
          alert('Failed to generate PDF. Please try again.');
        }
      }
      
      calculatePageWidth(columns: number): number {
        const [minColumns, maxColumns, minWidth, maxWidth] = [10, 300, 2000, 9000]; // adjusted limits
        return Math.max(
          minWidth,
          Math.min(
            minWidth + ((columns - minColumns) * (maxWidth - minWidth)) / (maxColumns - minColumns),
            maxWidth
          )
        );
      }
      
      

      onGridReady(params:any) {
        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;
      }


      clickLock = false; // Lock flag to prevent multiple clicks
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
          this.miniTableIcon.emit(eventData);
          // If keys start with 'table', do nothing
          console.log("Data contains 'table' key, no action taken.", eventData);
        } else {
          // If no key starts with 'table', proceed with the else block
          console.log("Row clicked, eventData: ", eventData);
        
            // Emit the event after a delay (500ms here)
            setTimeout(() => {
              this.dataTableCellInfo.emit(eventData);
              
            }, 500);
      
        
        }
      
        // Unlock click after processing (to prevent multiple triggers)
        setTimeout(() => {
          this.clickLock = false;
        }, 500); // The same delay as the timeout for emitting data
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

  async ngOnInit(){

    this.getLoggedUser = this.summaryConfiguration.getLoggedUserDetails()
    console.log('this.getLoggedUser read for redirect',this.getLoggedUser)
  
  
    // this.SK_clientID = this.getLoggedUser.clientID;



  }
      
}
