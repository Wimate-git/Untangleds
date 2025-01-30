import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { GridApi ,Column} from 'ag-grid-community';


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


  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {

console.log('miniTableData checking',this.miniTableData)
console.log('emitEvent checking',this.emitEvent)
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
  processEvent(event: EmitEvent) {
    this.dynamicTableValues = event.data.dynamic_table_values
    console.log('this.dynamicTableValues checking',this.dynamicTableValues)
    this.tableIds = Object.keys(this.dynamicTableValues);
    Object.keys(this.dynamicTableValues).forEach(tableId => {
      console.log(`Data for ${tableId}:`);
      this.dynamicTableValues[tableId].forEach((row, index) => {
        console.log(`Row ${index + 1}:`, row);
      });
    });
    if (event.data && event.data.dynamic_table_values) {
      console.log('event.data.dynamic_table_values',event.data.dynamic_table_values)

        // this.processMultipleTables(event.data.dynamic_table_values);
    }
}

  // closeModal(): void {
  //   this.modalClose.emit();
  // }

  closeModal(): void {
    if (this.modalRef) {
      this.modalRef.close(); // Close the modal
    }
  }
  generateColumnDefs(tableId: string) {
    const firstRow = this.dynamicTableValues[tableId][0];
    return Object.keys(firstRow).map(key => ({
      headerName: key,
      field: key
    }));
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
