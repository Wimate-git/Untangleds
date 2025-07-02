import { ChangeDetectorRef, Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { GridApi } from 'ag-grid-community';
import pdfMake from 'pdfmake/build/pdfmake';
import { APIService } from 'src/app/API.service';
import { SharedService } from 'src/app/pages/shared.service';
import { SummaryEngineService } from 'src/app/pages/summary-engine/summary-engine.service';
import * as XLSX from 'xlsx';  

@Component({
  selector: 'app-data-table-stacked-bar',

  templateUrl: './data-table-stacked-bar.component.html',
  styleUrl: './data-table-stacked-bar.component.scss'
})
export class DataTableStackedBarComponent {
  modalRef: NgbModalRef | undefined;
    @Input() modal :any
    @Input() modalData: any[] = []; // Accept row data
    @Input() columnDefs: any[] = [];
    @Output() modalClose = new EventEmitter<void>(); // Emit an event when the modal is closed
    @Input() sendRowDynamic :any
    @Input() all_Packet_store :any
    @Input() chartDataConfigExport :any
    @Output() sendFormNameForMini = new EventEmitter<any>();
    @Output() emitfullRowData = new EventEmitter<any>();
    // columnDefs: any[]; 
    iconCellRenderer: (params: any) => string; 
    private gridApi!: GridApi;
    pageSizeOptions = [10, 25, 50, 100,150,200,250,300];
    @Output() dataTableCellInfo = new EventEmitter<any>();
    @Output() miniTableIconChart1 = new EventEmitter<any>()
    // @Input() columnDefs: any[] = []; 
  
  
  
  
    // Dummy column definitions
  
  
    // Default column properties
    defaultColDef = {
      sortable: true,
      filter: true,
      resizable: true,
    };
    gridColumnApi: any;
    FormName: any;
  getLoggedUser: any;
  @Input() SK_clientID:any
  displayStackedBarchart: any[];
  formattedRowData: any[];
  extractedTables: unknown[];
  extractedTableHeaders: any;
  storeFormLabel: any;
  
  
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
  
    async ngOnChanges(changes: SimpleChanges): Promise<void> {
      console.log('columnDefs check',this.columnDefs)
      console.log('sendRowDynamic checking from stacked bar chart',this.sendRowDynamic)
      this.FormName = this.chartDataConfigExport.formlist
      console.log('this.FormName chart3',this.FormName)
      const dateKeys: string[] = [];
      const storeAllRowData = this.sendRowDynamic
      storeAllRowData.forEach((row: any) => {
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
      const matchedDateFields = await this.fetchDynamicFormData(this.FormName, dateKeys);
      console.log('Received date fields in caller:', matchedDateFields);
      
      
      
      
      this.formattedRowData = this.formatDateFields(storeAllRowData,matchedDateFields);
      console.log('Formatted displayStackedBarchart: ', this.displayStackedBarchart);
      console.log('all_Packet_store from data table',this.all_Packet_store)
      console.log('chartDataConfigExport',this.chartDataConfigExport)

      // this.parseChartConfig(this.all_Packet_store);
      this.emitfullRowData.emit(storeAllRowData)
      this.parseChartConfig(this.chartDataConfigExport)
      this.sendFormNameForMini.emit(this.FormName)
      
    }
  

    

  ngOnInit(){

    this.getLoggedUser = this.summaryConfiguration.getLoggedUserDetails()
    console.log('this.getLoggedUser read for redirect',this.getLoggedUser)
  
  
    // this.SK_clientID = this.getLoggedUser.clientID;

  }


    
    parseChartConfig(chartDataConfigExport:any) {
      console.log('chartDataConfigExport checking',chartDataConfigExport)
      if (!chartDataConfigExport || !Array.isArray(chartDataConfigExport.columnVisibility)) {
        console.error('Invalid chartDataConfigExport format:', this.chartDataConfigExport);
        return;
      }
    
      try {
        // const flattenedColumnVisibility = chartDataConfigExport.columnVisibility.flatMap((col: any) => col.columnVisibility || []);
        // console.log('Flattened Column Visibility:', flattenedColumnVisibility);
    const storeAllthecolumns = chartDataConfigExport.columnVisibility
    console.log('storeAllthecolumns checking from data table stacked bar',storeAllthecolumns)
        this.columnDefs = this.createColumnDefs(storeAllthecolumns);
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
        resizable: true,
        cellClass: 'pointer-cursor',
        cellRenderer: (column.value === 'dynamic_table_values') ? this.iconCellRenderer : undefined, 
      }));
    }
  


    
    formatDateFields(data: any[], receiveformatPckets: any[]): any[] {
      const allowedDateFormats = ['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY/MM/DD'];
      const allowedTimeFormats = ['12-hour (hh:mm AM/PM)', '24-hour (hh:mm)'];
    
      return data.map(row => {
        const newRow = { ...row }; // ✅ Don't mutate original row
    
        Object.keys(newRow).forEach(key => {
          const isDateKey = key.startsWith('date-');
          const isDateTimeKey = key.startsWith('datetime-');
          const isEpochDate = key.startsWith('epoch-date-');
          const isEpochDateTime = key.startsWith('epoch-datetime-local-');
          const isCreatedOrUpdated = key === 'created_time' || key === 'updated_time';
          const isTime = key.startsWith('time-');
    
          // created_time / updated_time
          if (isCreatedOrUpdated) {
            const rawValue = newRow[key];
            if (rawValue !== null && rawValue !== undefined && rawValue !== '' && rawValue !== '0') {
              const epoch = parseInt(rawValue, 10);
              if (!isNaN(epoch) && epoch > 0) {
                const epochMs = epoch < 1e12 ? epoch * 1000 : epoch;
                newRow[key] = this.formatDate(new Date(epochMs).toISOString(), 'DD/MM/YYYY', '24-hour (hh:mm)');
              } else {
                newRow[key] = '';
              }
            } else {
              newRow[key] = '';
            }
            return;
          }
    
          if (isDateKey || isDateTimeKey || isEpochDate || isEpochDateTime || isTime) {
            const matchingField = receiveformatPckets.find((packet: any) => packet.name === key);
            if (matchingField) {
              const validation = matchingField.validation || {};
    
              const dateFormat = allowedDateFormats.includes(validation.dateFormatType)
                ? validation.dateFormatType
                : 'DD/MM/YYYY';
    
              const timeFormat = allowedTimeFormats.includes(validation.timeFormatType)
                ? validation.timeFormatType
                : '12-hour (hh:mm AM/PM)';
    
              let rawValue = newRow[key];
    
              // Epoch
              if ((isEpochDate || isEpochDateTime) && rawValue) {
                const epoch = parseInt(rawValue, 10);
                if (!isNaN(epoch) && epoch > 0) {
                  const epochMs = epoch < 1e12 ? epoch * 1000 : epoch;
                  rawValue = new Date(epochMs).toISOString();
                } else {
                  rawValue = '';
                }
              }
    
              // Time-only field
              if (isTime && typeof rawValue === 'string' && /^\d{1,2}:\d{2}$/.test(rawValue)) {
                rawValue = rawValue; // Do not modify or prepend 1970
              }
    
              const requiresTime = isDateTimeKey || isEpochDateTime || isTime;
              const finalDateFormat = isTime ? null : dateFormat;
    
              newRow[key] = this.formatDate(rawValue, finalDateFormat, requiresTime ? timeFormat : null);
            }
          }
        });
    
        return newRow;
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
  
    closeModal(): void {
  this.modalService.dismissAll()
    }
  
    onGridReady(params:any) {
      this.gridApi = params.api;
      this.gridColumnApi = params.columnApi;
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
  async exportAllTablesAsExcel() {
    let dataToExport: any[] = [];
  
    const isFilterApplied = this.gridApi && Object.keys(this.gridApi.getFilterModel()).length > 0;
    const displayedRowCount = this.gridApi.getDisplayedRowCount();
  
    if (isFilterApplied && displayedRowCount > 0) {
      this.gridApi.forEachNodeAfterFilter((node: any) => {
        if (node.data) dataToExport.push(node.data);
      });
    } else {
      dataToExport = this.sendRowDynamic || [];
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
    const matchedDateFields = await this.fetchDynamicFormData(this.FormName, dateKeys);
    dataToExport = await this.formatDateFields(dataToExport, matchedDateFields);
    console.log('dataToExport checking from exportExcel',dataToExport)
  
    // ✅ Fetch mini table metadata and headers ONCE
    const tablesReceive: any = await this.fetchMiniTableData(this.FormName);

    console.log('tablesReceive check',tablesReceive)
    const tableHeaderMap: { [key: string]: any[] } = {};

    for (const table of tablesReceive) {
      if (!table?.name) {
        console.warn('⚠️ Invalid mini table entry skipped:', table);
        continue;
      }
    
      try {
        const headerData = await this.fetchMiniTableHeaders(table);
    
        // Log for debugging
        console.log(`✅ Headers for ${table.name}:`, headerData);
    
        if (Array.isArray(headerData)) {
          tableHeaderMap[table.name] = headerData[0]?.columnDefs || [];
        } else if (typeof headerData === 'object' && headerData !== null) {
          tableHeaderMap[table.name] = headerData.columnDefs || [];
        } else {
          console.warn(`⚠️ Unexpected format for headers of ${table.name}`, headerData);
          tableHeaderMap[table.name] = [];
        }
      } catch (err) {
        console.error(`❌ Error fetching headers for ${table.name}`, err);
        tableHeaderMap[table.name] = [];
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
          return columnFields.map(field =>
            row && field in row && row[field] != null ? String(row[field]) : ''
          );
        } catch (err) {
          console.warn('⚠️ Row export failed:', row, err);
          return columnFields.map(() => '');
        }
      })
    ];
  
    const mainSheet = XLSX.utils.aoa_to_sheet(mainData);
    XLSX.utils.book_append_sheet(wb, mainSheet, this.FormName);
  
    // ✅ Append mini-table sheets
    Object.entries(extractedDynamicTables).forEach(([label, data]) => {
      const { headers, rows } = data;
      if (!Array.isArray(rows) || rows.length === 0) return;
  
      const columnTitles = headers.map((h: { header: any; }) => h.header);
      const fieldKeys = headers.map((h: { field: any; }) => h.field);
  
      const sheetData = [
        columnTitles,
        ...rows.map(row => fieldKeys.map((field: string | number) => row[field] ?? ''))
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
    a.download = `${this.FormName || 'ExportedData'}.xlsx`;
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
  
    // console.log('✅ Final Formatted DateTime Fields:', formattedResults);
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
    // Use getRenderedNodes() to check for filtered data
    const dataToExport = this.gridApi.getRenderedNodes().length > 0
      ? this.gridApi.getRenderedNodes().map((node: any) => node.data)  // Use filtered rows if available
      : this.sendRowDynamic;  // Fallback to full data if no filtered rows
  
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
  
    // Extract column headers from columnDefs (ensure these are correct)
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
      pdfMake.createPdf(docDefinition).download(`${this.FormName}` + '.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    }
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
        this.miniTableIconChart1.emit(eventData);
        // If keys start with 'table', do nothing
        console.log("Data contains 'table' key, no action taken.", eventData);
      } else {
        // If no key starts with 'table', proceed with the else block
        console.log("Row clicked, eventData: ", eventData);
  
        setTimeout(() => {
          // Emit the event after a delay (500ms here)
          this.dataTableCellInfo.emit(eventData);
        }, 500);
      
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


    calculatePageWidth(columns: number): number {
      const [minColumns, maxColumns, minWidth, maxWidth] = [10, 300, 1000, 50000]; // adjusted limits
      return Math.max(
        minWidth,
        Math.min(
          minWidth + ((columns - minColumns) * (maxWidth - minWidth)) / (maxColumns - minColumns),
          maxWidth
        )
      );
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
