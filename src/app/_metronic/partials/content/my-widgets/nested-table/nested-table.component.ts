import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
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
  @Input() emitEvent: any;
 
  private gridApi!: GridApi;
  tableKeys: string[];
  @Input() SK_clientID:any
  @Input() FormNameMini:any
  tableIds: string[] = [];  // Your array of table IDs
  columnDefsMap: { [key: string]: any[] } = {}; 
  tableNamesMap: { [key: string]: string } = {}; 
  pageSizeOptions = [10, 25, 50, 100];
  
  


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

  extractedTables: unknown[];
  fetchFormName: Promise<void>;
  extractedTableHeaders: any;
  assignFormName: any;
  generateColumnDefs: any;
  columnDefsSet: any;
  TableName: any;
  storeFormLabel: any;



  constructor(private api: APIService,private modalService: NgbModal) {}

  ngOnChanges(changes: SimpleChanges): void {

console.log('miniTableData checking',this.miniTableData)
console.log('emitEvent checking',this.emitEvent)
console.log('SK_clientID checking',this.SK_clientID)
console.log('FormNameMini checking',this.FormNameMini)
this.assignFormName = this.FormNameMini
console.log('this.assignFormName',this.assignFormName)

this.processEvent(this.emitEvent);

// if (changes.emitEvent && changes.emitEvent.currentValue) {
//   // Check if it's an array and take appropriate action
//   if (Array.isArray(changes.emitEvent.currentValue)) {
//       // Handle it as an array if that's expected
//       console.log('Received an array of events', changes.emitEvent.currentValue);
//   } else {
//       // Handle it as a single event object
//       this.processEvent(changes.emitEvent.currentValue);
//   }
// }

// this.processMultipleTables(this.emitEvent.data.dynamic_table_values);
    
  }




  async processEvent(event:any) {
    // Declare once at the top (outside the function or loop)


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
  
        this.dynamicTableValues[tableId].forEach(async (row: any, index: number) => {
            console.log(`Row ${index + 1}:`, row);
  
            // Wait for fetchMiniTableData to complete
  
        
        });
    }
  
  
    const tablesReceive = await this.fetchMiniTableData(this.assignFormName); 
  
    if (!tablesReceive) {
        console.log('No data received for tables');
        return;
    }
    
    console.log('Received Tables:', tablesReceive);
    
    // Array to store all matching tables
    const matchingTables: any[] = [];
    
    // Iterate through each tableId in the array and check for matches
    for (let tableId of this.tableIds) {
        // Remove the `-table` suffix from the tableId
        const modifiedTableId = tableId.replace('-table', '');
    
        console.log('Checking tableId:', tableId);
        console.log('modifiedTableId:', modifiedTableId);
    
        // Find all matching tables
        const foundTables = tablesReceive.filter((table: any) => {
            const modifiedName = table.name.replace('-table', ''); // Remove the -table suffix from the table name
            return modifiedName === modifiedTableId;
        });
    console.log('foundTables checking from tile1',foundTables)
    const tableLabels = foundTables.map((table: any) => table.label).filter(Boolean); // Remove undefined/empty
    // this.allTableLabels.push(...tableLabels); // Spread into push to avoid concat
    // console.log('Updated All Table Labels:', this.allTableLabels);
    

    // this.allTableLabels = this.allTableLabels.concat(tableLabels);
    
    // console.log('Accumulated Table Labels:', this.allTableLabels);
    

        // Add all found matching tables to the matchingTables array
        if (foundTables.length > 0) {
            matchingTables.push(...foundTables);
        } else {
            console.log(`No matching tables found for tableId: ${tableId}`);
        }
    }
    
    if (matchingTables.length > 0) {
        console.log('Matching Tables:', matchingTables);
    
        // Loop over the matching tables and process them
        for (let matchedTableData of matchingTables) {
            console.log('Matched Table Data:', matchedTableData);
    
      
    
            // Update TableName if it exists
            // console.log()
            // this.tableNamesMap[matchedTableData.name] = minitableName;
            // console.log('')
            
    
            // Fetch column definitions
            const tableId = matchedTableData.name + '-table';  // Add '-table' suffix to the tableId
            console.log('tableId checking for columns', tableId);  // Log the updated tableId
            
  
            const receiveData:any = await this.fetchMiniTableHeaders(matchedTableData);
            console.log('receiveData checking',receiveData)
            
            // console.log('columnDefs checking from Tile mini',columnDefs)

  
            this.columnDefsMap[tableId] = receiveData.columnDefs;
            console.log('this.columnDefsMap[tableId] chgeck from tile1',this.columnDefsMap[tableId])
            this.tableNamesMap[tableId] = receiveData.minitableName
            console.log('this.tableNamesMap[tableId] checking from tile1',this.tableNamesMap[tableId])
            
            this.columnDefsSet = receiveData.columnDefs;
            // console.log('Received Column Definitions:', columnDefs);
        }
    } else {
        console.log('No matching tables found for any tableId.');
    }
    
    
  

    if (event.data && event.data.dynamic_table_values) {
        console.log('event.data.dynamic_table_values', event.data.dynamic_table_values);
    }
  
    console.log('Form Names:', Array.from(formNames));
  }
  
  
  
  async fetchMiniTableData(item: any) {
    try {
        this.extractedTables = []; // Initialize as an empty array to prevent undefined errors
  
        const resultMain: any = await this.api.GetMaster(this.SK_clientID + "#dynamic_form#" + item + "#main", 1);
        if (resultMain) {
            console.log('forms chaecking', resultMain);
            const helpherObjmain = JSON.parse(resultMain.metadata);
            console.log('mini table data checking from nested Table', helpherObjmain);
  
            const extractFormFields = helpherObjmain.formFields;
  
            // Ensure extractedTables is set properly
            this.extractedTables = Object.values(extractFormFields).filter((item: any) =>
              typeof item === 'object' &&
              item !== null &&
              item.type === 'table'
            );
            
            console.log('Extracted Table Records:', this.extractedTables);
            return this.extractedTables;
            
        }
    } catch (err) {
        console.log("Error fetching the dynamic form data", err);
    }
  }
  
  
  
  async fetchMiniTableHeaders(items: any) {

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
          console.log('forms checking', resultHeaders);
          const helpherObjmainHeaders = JSON.parse(resultHeaders.metadata);
          console.log('minitable headers from nested table', helpherObjmainHeaders);
  
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
                formName:helpherObjmainHeaders.formLabel,

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
            console.log('this.extractedTableHeaders[formLabel] checking before applying',this.extractedTableHeaders[formLabel])
            this.storeFormLabel = formLabel
            // const formNameMini=receiveActualTableNames

            console.log('Column Definitions:', this.extractedTableHeaders[formLabel].columnDefs);
            console.log('this.storeFormLabel chcking',this.storeFormLabel)
  
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
  












  // closeModal(): void {
  //   this.modalClose.emit();
  // }

  closeModal(): void {
    this.modalService.dismissAll()
      }
    


  updateGrids() {
  
    this.gridApi.redrawRows(); // Redraw or refresh the grid if already existing
  }


  onGridReady(event: any, tableId: string) {
    event.api.sizeColumnsToFit();
  }

  

}
