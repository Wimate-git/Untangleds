import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { GridApi ,Column} from 'ag-grid-community';
import { APIService } from 'src/app/API.service';
interface TableData {
  name: string;
  options: string[];
  columnWidth: number;
  placeholder: string;
  label: string;
  type: string;
  validation: any; // You can define the type for validation if you know its structure
  // Add other fields as needed
}
interface Validation {
  alignment_heading: string | null;
  btnAction: string | null;
  btnColor: string | null;
  // Add other properties as needed
}





interface EmitEvent {
  type: string;
  node: any; // Further specify these types as needed
  data: {
      dynamic_table_values: { [key: string]: any[] };
      [key: string]: any; // Add other expected properties here
  };
  generateColumnDefs: { [key: string]: any[] }; 

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
  assignFormName: any;
  generateColumnDefs: any;
  columnDefsSet: any;
  TableName: any;



  constructor(private api: APIService) {}

  ngOnChanges(changes: SimpleChanges): void {

console.log('miniTableData checking',this.miniTableData)
console.log('emitEvent checking',this.emitEvent)
console.log('SK_clientID checking',this.SK_clientID)
console.log('FormNameMini checking',this.FormNameMini)
this.assignFormName = this.FormNameMini
console.log('this.assignFormName',this.assignFormName)



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
            return this.extractedTables;
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

  // Store form names for all matched tables
  let formNames: Set<string> = new Set(); // Using Set to avoid duplicates
  console.log('this.assignFormName', this.assignFormName);

  // ✅ **KEEPING YOUR EXISTING LOGIC UNCHANGED**
  for (const tableId of this.tableIds) {
      console.log(`Data for ${tableId}:`);
      const tablesReceive = await this.fetchMiniTableData(this.assignFormName); 

      if (!tablesReceive) {
          console.log('No data received for tables');
          return;
      }

      console.log('Received Tables:', tablesReceive);

      // Iterate over the received tables and compare with tableId
      const matchingTable = tablesReceive.find((table: any) => {
        // Remove the `-table` suffix from the table name and tableId
        const modifiedName = table.name.replace('-table', '');
        const modifiedTableId = tableId.replace('-table', ''); // Remove -table from tableId
    
        console.log('modifiedName', modifiedName);
        console.log('tableId check', tableId);
        console.log('modifiedTableId check', modifiedTableId);
    
        return modifiedName === modifiedTableId;
    });
    console.log('matchingTable',matchingTable)
    if (matchingTable) {
      console.log(`Found matching table for tableId: ${tableId}`);
      console.log('Matching Table:', matchingTable);
  
      // Store the matching table object in a variable
      const matchedTableData: any = matchingTable;
      console.log('Matched Table Data:', matchedTableData);
      
      // Accessing the validation field with a null check
      const validation = matchedTableData?.validation ?? 'No validation field available';
      console.log('Validation:', validation);
      const validateFormName = validation.formName_table
      console.log('validateFormName',validateFormName)
      this.TableName = validateFormName
      const columnDefs = await this.fetchMiniTableHeaders(validateFormName);
      this.columnDefsSet =columnDefs
console.log('Received Column Definitions:', columnDefs);
console.log('this.generateColumnDefs[tableId]:', this.generateColumnDefs[tableId]);
// this.generateColumnDefs[tableId]=columnDefs

//  console.log('this.generateColumnDefs[tableId]',this.generateColumnDefs[tableId]) 
//           const validation = matchedTableData?.validation;
// console.log('Validation:', validation);
  
      // Extract formName_table from validation
      // const formName = matchedTableData.validation?.formName_table ?? 'Not Provided';
      // console.log(`formName_table: ${formName}`);
  
      // // Only add to formNames if formName_table is not 'Not Provided'
      // if (formName !== 'Not Provided') {
      //     formNames.add(formName); // Add to set to avoid duplicates
      // }
  
      // Optionally, you can use matchedTableData for further processing
  } else {
      console.log(`No matching table found for tableId: ${tableId}`);
  }
      this.dynamicTableValues[tableId].forEach(async (row: any, index: number) => {
          console.log(`Row ${index + 1}:`, row);

          // Wait for fetchMiniTableData to complete

      
      });
  }

  // ✅ **Trigger fetchMiniTableHeaders() for multiple form names**
  if (event.data && event.data.dynamic_table_values) {
      console.log('event.data.dynamic_table_values', event.data.dynamic_table_values);
  }

  console.log('Form Names:', Array.from(formNames));
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

        // Return the columnDefs so that the caller can receive it
        return this.extractedTableHeaders[formLabel].columnDefs;
      }
    }
  } catch (err) {
    console.log("Error fetching the dynamic form data", err);
  }

  // In case no data is fetched, return an empty array
  return [];
}












  // closeModal(): void {
  //   this.modalClose.emit();
  // }

  closeModal(): void {
    if (this.modalRef) {
      this.modalRef.close(); // Close the modal
    }
  }


  updateGrids() {
  
    this.gridApi.redrawRows(); // Redraw or refresh the grid if already existing
  }


  onGridReady(event: any, tableId: string) {
    event.api.sizeColumnsToFit();
  }


}
