import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

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


  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
console.log('modalData check',this.responseRowData)
console.log('columnDefs check',this.all_Packet_store)
this.parseChartConfig(this.all_Packet_store)

    
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
    if (this.modalRef) {
      this.modalRef.close(); // Close the modal
    }
  }



}
