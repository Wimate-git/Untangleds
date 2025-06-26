import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { GridApi ,Column} from 'ag-grid-community';
import pdfMake from 'pdfmake/build/pdfmake';
import { APIService } from 'src/app/API.service';
import * as XLSX from 'xlsx';  

@Component({
  selector: 'app-data-table-dynamic-tile',

  templateUrl: './data-table-dynamic-tile.component.html',
  styleUrl: './data-table-dynamic-tile.component.scss'
})
export class DataTableDynamicTileComponent {
  modalRef: NgbModalRef | undefined;
  @Input() modal :any
  @Input() responseRowData: any[] = []; // Accept row data
  @Input() all_Packet_store: any[] = [];
  @Output() modalClose = new EventEmitter<void>(); // Emit an event when the modal is closed
  


  @Output() dataTableCellInfo = new EventEmitter<any>();
  @Input() storeDrillDown :any
  @Input() SK_clientID:any

  private gridApi!: GridApi;
  FormName: any;
  //   [responseRowData]="responseRowData"
  // [all_Packet_store]="all_Packet_store"
  // @Input() columnDefs: any[] = []; 


  clickLock = false; // Lock flag to prevent multiple clicks
  formattedRowData: any[];

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
      // this.miniTableIconChart1.emit(eventData);
      // If keys start with 'table', do nothing
      console.log("Data contains 'table' key, no action taken.", eventData);
    } else {
      // If no key starts with 'table', proceed with the else block
      console.log("Row clicked, eventData: ", eventData);

      const recordIdObj = {
        type: "view",
        fields: {},
        mainTableKey: JSON.stringify(eventData.data.SK)  // No prefix
      };
      console.log('recordIdObj checking from datatable chart1:', recordIdObj);
  
      // 🔹 Step 2: Convert to JSON and escape quotes
      const jsonString = JSON.stringify(recordIdObj);
      const escapedString = `"${jsonString.replace(/"/g, '\\"')}"`;
  
      // 🔹 Step 3: Encode for URL usage
      const encodedRecordId = encodeURIComponent(escapedString);
  
      // 🔹 Step 4: Final URL
      const targetUrl = `/view-dreamboard/Forms/${this.FormName}&recordId=${encodedRecordId}`;
      console.log('targetUrl checking from datatable:', targetUrl);
  
      // 🔹 Step 5: Open in new tab
      window.open(targetUrl, '_blank');
    
  

      
      
      // window.open(targetUrl, '_blank');
      
      // setTimeout(() => {
      //   // Emit the event after a delay (500ms here)
      //   this.dataTableCellInfo.emit(eventData);
      // }, 500);
    }
  
    // Unlock click after processing (to prevent multiple triggers)
    setTimeout(() => {
      this.clickLock = false;
    }, 500); // The same delay as the timeout for emitting data
  }

  // Dummy column definitions


  // Default column properties
  defaultColDef = {
    sortable: true,
    filter: true,
    resizable: true,
  };
  columnDefs: { headerName: any; field: any; sortable: boolean; filter: boolean; resizable: boolean; }[];


  constructor(private modalService: NgbModal,private api: APIService) {}

  async ngOnChanges(changes: SimpleChanges): Promise<void> {
console.log('modalData check',this.responseRowData)
const dateKeys: string[] = [];
// this.responseRowData = this.formatDateFields(this.responseRowData);
// console.log('Formatted Data:', this.responseRowData);





this.responseRowData.forEach((row: any) => {
  Object.keys(row).forEach((key) => {
    if (
      (key.startsWith('date') ||
       key.startsWith('datetime') ||
       key.startsWith('epoch-date') ||
       key.startsWith('epoch-datetime-local') ||  key === 'created_time' ||
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
const matchedDateFields = await this.fetchDynamicFormData(this.FormName, dateKeys);
console.log('Received date fields in caller:', matchedDateFields);

this.responseRowData = this.formatDateFields(this.responseRowData,matchedDateFields);
console.log('Formatted Data:', this.responseRowData);



console.log('columnDefs check',this.all_Packet_store)
this.FormName = this.storeDrillDown.formlist
console.log('this.FormName for drill name',this.FormName)
this.parseChartConfig(this.all_Packet_store)

    
  }

  private formatDateFields(data: any[], receiveformatPckets: any[]): any[] {
    const allowedDateFormats = ['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY/MM/DD'];
    const allowedTimeFormats = ['12-hour (hh:mm AM/PM)', '24-hour (hh:mm)'];
  
    return data.map(row => {
      Object.keys(row).forEach(key => {
        const isDateKey = key.startsWith('date-');
        const isDateTimeKey = key.startsWith('datetime-');
        const isEpochDate = key.startsWith('epoch-date-');
        const isEpochDateTime = key.startsWith('epoch-datetime-local-');
        const isCreatedOrUpdated = key === 'created_time' || key === 'updated_time';
        const isTime = key.startsWith('time-');
  
        if (isCreatedOrUpdated) {
          const epoch = parseInt(row[key], 10);
          if (!isNaN(epoch)) {
            const epochMs = epoch < 1e12 ? epoch * 1000 : epoch;
            row[key] = this.formatDate(new Date(epochMs).toISOString(), 'DD/MM/YYYY', '24-hour (hh:mm)');
          }
          return;
        }
        
  
        if (isDateKey || isDateTimeKey || isEpochDate || isEpochDateTime || isTime) {
          const matchingField = receiveformatPckets.find((packet: any) => packet.name === key);
          if (matchingField) {
            const validation = matchingField.validation || {};
  
            // ✅ Validate and select date/time formats
            const dateFormat = allowedDateFormats.includes(validation.dateFormatType)
              ? validation.dateFormatType
              : 'DD/MM/YYYY';
  
            const timeFormat = allowedTimeFormats.includes(validation.timeFormatType)
              ? validation.timeFormatType
              : '12-hour (hh:mm AM/PM)';
  
            let rawValue = row[key];
  
            // ✅ Handle epoch fields
            if ((isEpochDate || isEpochDateTime) && rawValue) {
              const epoch = parseInt(rawValue, 10);
              if (!isNaN(epoch)) {
                const epochMs = epoch < 1e12 ? epoch * 1000 : epoch;
                rawValue = new Date(epochMs).toISOString();
              }
            }
  
            // ✅ Handle time-only values like "13:45"
            if (isTime && typeof rawValue === 'string' && /^\d{1,2}:\d{2}$/.test(rawValue)) {
              rawValue = `1970-01-01T${rawValue}`;
            }
  
            const requiresTime = isDateTimeKey || isEpochDateTime || isTime;
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
  
  

  parseChartConfig(data: any) {
    console.log('datachecking', data);
    // Iterate through the grid_details array
    data.grid_details.forEach((detail: any) => {
      // Check if the current detail's grid_type is 'tile'
      if (detail.grid_type === 'tile') {
        console.log('Found tile config:', detail);
        try {
          // Parse the columnVisibility JSON string if it's a string, otherwise use directly if it's already an object
          const columnVisibility = typeof detail.columnVisibility === 'string' ? JSON.parse(detail.columnVisibility) : detail.columnVisibility;
          console.log('Column Visibility from Tile Config:', columnVisibility);
          // Generate column definitions from the columnVisibility
          this.columnDefs = this.createColumnDefs(columnVisibility);
        } catch (e) {
          console.error('Error parsing columnVisibility:', e);
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

}
