import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { GridApi ,Column} from 'ag-grid-community';
import { APIService } from 'src/app/API.service';


interface EmitEvent {
  type: string;
  node: any; // Further specify these types as needed
  data: {
      dynamic_table_values: { [key: string]: any[] };
      [key: string]: any; // Add other expected properties here
  };
  value: any;
  column: any;
  api: any;
  event: PointerEvent;
  eventPath: any[];
  rowIndex: number;
  rowPinned?: any;
}
interface TableItem {
  name: string;
  validation?: {
    formName_table?: string;
};
}

@Component({
  selector: 'app-nested-table',

  templateUrl: './nested-table.component.html',
  styleUrl: './nested-table.component.scss'
})


export class NestedTableComponent {

 // Data passed to the modal
 modalRef: NgbModalRef | undefined;
  @Input() modal :any
 // Accept row data
 
  @Output() modalClose = new EventEmitter<void>(); // Emit an event when the modal is closed
  @Input() miniTableData: any[] = [];
  @Input() emitEvent: any[] = [];
 
  private gridApi!: GridApi;
  tableKeys: string[];
  @Input() SK_clientID:any
  @Input() FormNameMini:any
  
  


  // @Input() columnDefs: any[] = []; 




  // Dummy column definitions


  // Default column properties
  defaultColDef = {
    sortable: true,
    filter: true,
    resizable: true,
  };
  gridConfigs: { tableName: string; columnDefs: { headerName: unknown; field: unknown; sortable: boolean; filter: boolean; resizable: boolean; }[]; rowData: any; }[];
  gridColumnApi: any;
  dynamicTableValues: { [key: string]: any[]; };
  tableIds: string[];
  extractedTables: unknown[];
  fetchFormName: Promise<void>;
  extractedTableHeaders: any;


  constructor(private api: APIService) {}

  ngOnChanges(changes: SimpleChanges): void {

console.log('miniTableData checking',this.miniTableData)
console.log('emitEvent checking',this.emitEvent)
console.log('SK_clientID checking',this.SK_clientID)
console.log('FormNameMini checking',this.FormNameMini)
this.fetchMiniTableData(this.FormNameMini)


if (changes.emitEvent && changes.emitEvent.currentValue) {
  // Check if it's an array and take appropriate action
  if (Array.isArray(changes.emitEvent.currentValue)) {
      // Handle it as an array if that's expected
      console.log('Received an array of events', changes.emitEvent.currentValue);
  } else {
      // Handle it as a single event object
      this.processEvent(changes.emitEvent.currentValue);
  }
}

// this.processMultipleTables(this.emitEvent.data.dynamic_table_values);
    
  }


  async fetchMiniTableData(item: any) {
    try {
        this.extractedTables = []; // Initialize as an empty array to prevent undefined errors

        const resultMain: any = await this.api.GetMaster(this.SK_clientID + "#dynamic_form#" + item + "#main", 1);
        if (resultMain) {
            console.log('forms chaecking', resultMain);
            const helpherObjmain = JSON.parse(resultMain.metadata);
            console.log('helpherObjmain checking', helpherObjmain);

            const extractFormFields = helpherObjmain.formFields;

            // Ensure extractedTables is set properly
            this.extractedTables = Object.values(extractFormFields).filter((item: any) =>
                typeof item === 'object' &&
                item !== null &&
                'name' in item &&
                typeof item.name === 'string' &&
                item.name.startsWith("table-")
            );

            console.log('Extracted Table Records:', this.extractedTables);
        }
    } catch (err) {
        console.log("Error fetching the dynamic form data", err);
    }
}

async processEvent(event: EmitEvent) {
  console.log('event', event);
  this.dynamicTableValues = event.data.dynamic_table_values;
  console.log('this.dynamicTableValues checking', this.dynamicTableValues);

  this.tableIds = Object.keys(this.dynamicTableValues);
  console.log('this.tableIds check', this.tableIds);



  // Wait for fetchMiniTableData to complete


  // Store form names for all matched tables
  let formNames: Set<string> = new Set(); // Using Set to avoid duplicates

  // ✅ **KEEPING YOUR EXISTING LOGIC UNCHANGED**
  this.tableIds.forEach(tableId => {
      console.log(`Data for ${tableId}:`);
      this.dynamicTableValues[tableId].forEach((row: any, index: number) => {
          console.log(`Row ${index + 1}:`, row);
      });

      // Extract base table name by removing '-table' suffix

  });

  // ✅ **Trigger fetchMiniTableHeaders() for multiple form names**


  if (event.data && event.data.dynamic_table_values) {
      console.log('event.data.dynamic_table_values', event.data.dynamic_table_values);
  }
}




getFormLabelFromTableId(tableId: string) {
  console.log('this.FormNameMini check', this.FormNameMini);
  this.fetchMiniTableData(this.FormNameMini);
  

 // Ensure extractedTables is initialized and is an array
 console.log('this.extractedTables',this.extractedTables)
 if (!Array.isArray(this.extractedTables) || this.extractedTables.length === 0) {
     console.warn('extractedTables is undefined or empty after fetching.');
     return;
 }
 let formNames: Set<string> = new Set(); 
 const baseTableName = tableId.replace('-table', '');

 // Find the matched table object
 const matchedTable = this.extractedTables.find((item: any): item is TableItem =>
     item && typeof item === 'object' && 'name' in item && item.name === baseTableName
 );

 console.log('matchedTable:', matchedTable);

 if (matchedTable) {
     console.log(`Matched Table Found: ${matchedTable.name}`);

     // Extract formName_table from validation if it exists
     const formName = matchedTable.validation?.formName_table ?? 'Not Provided';

     console.log(`formName_table: ${formName}`);

     if (formName !== 'Not Provided') {
         formNames.add(formName); // Add to set to avoid duplicates
     }
 } else {
     console.log(`No Match Found for: ${baseTableName}`);
 }
 if (formNames.size > 0) {
  console.log(`Fetching Mini Table Headers for: ${Array.from(formNames).join(', ')}`);

  formNames.forEach(formName => {
      this.fetchMiniTableHeaders(formName);
  });
} else {
  console.warn('No valid formName_table found to fetch mini table headers.');
}

}

async fetchMiniTableHeaders(item: any) {
  try {
      const resultHeaders: any = await this.api.GetMaster(this.SK_clientID + "#dynamic_form#" + item + "#main", 1);

      if (resultHeaders) {
          console.log('forms checking', resultHeaders);
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
                      columnDefs: helpherObjmainHeaders.formFields.map((field: { label: string; name: string }) => ({
                          headerName: field.label,
                          field: field.name,
                          sortable: true,
                          filter: true,
                          resizable: true
                      }))
                  };
              }

              console.log(`Extracted Form Fields for: ${formLabel}`);
              console.log('Column Definitions:', this.extractedTableHeaders[formLabel].columnDefs);
          }
      }
  } catch (err) {
      console.log("Error fetching the dynamic form data", err);
  }
}




generateColumnDefs(tableId: string): any[] {
  console.log('tableId checking:', tableId);

  const formLabel:any = this.getFormLabelFromTableId(tableId);
  console.log('Retrieved formLabel:', formLabel);

  if (formLabel && this.extractedTableHeaders[formLabel]) {
      console.log('Column Definitions for Table:', this.extractedTableHeaders[formLabel].columnDefs);
      return this.extractedTableHeaders[formLabel].columnDefs;
  }

  console.warn(`No column definitions found for tableId: ${tableId}`);
  return []; // Return an empty array if no matching form is found
}






  // closeModal(): void {
  //   this.modalClose.emit();
  // }

  closeModal(): void {
    if (this.modalRef) {
      this.modalRef.close(); // Close the modal
    }
  }


  // processMultipleTables(dynamicTableValues:any) {
  //   this.gridConfigs = Object.entries(dynamicTableValues).map(([tableName, tableData]) => {
  //     const columnKeys = new Set();
  //     const rowData = tableData.map((row: {}) => {
  //       Object.keys(row).forEach(key => columnKeys.add(key));
  //       return row;
  //     });
  
  //     const columnDefs = Array.from(columnKeys).map(key => ({
  //       headerName: key,
  //       field: key,
  //       sortable: true,
  //       filter: true,
  //       resizable: true,
  //     }));
  
  //     return { tableName, columnDefs, rowData };
  //   });
    
  //   this.updateGrids(); // If you need to render this in multiple AG Grids or some other components
  // }
  updateGrids() {
    // Assuming you have a template or some method to dynamically create these grids
    // This would typically be linked to your Angular template where the grids are defined
    // E.g., using *ngFor to create a grid for each config in gridConfigs
    this.gridApi.redrawRows(); // Redraw or refresh the grid if already existing
  }


  onGridReady(event: any, tableId: string) {
    event.api.sizeColumnsToFit();
  }


}
