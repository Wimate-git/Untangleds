import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { GridApi ,Column} from 'ag-grid-community';

@Component({
  selector: 'app-data-table-show',

  templateUrl: './data-table-show.component.html',
  styleUrl: './data-table-show.component.scss'
})
export class DataTableShowComponent {
  modalRef: NgbModalRef | undefined;
  @Input() modal :any
  @Input() modalData: any[] = []; // Accept row data
  @Input() columnDefs: any[] = [];
  @Output() modalClose = new EventEmitter<void>(); // Emit an event when the modal is closed
  @Input() sendRowDynamic :any
  @Input() all_Packet_store :any
  // columnDefs: any[]; 
  private gridApi!: GridApi;

  // @Input() columnDefs: any[] = []; 




  // Dummy column definitions


  // Default column properties
  defaultColDef = {
    sortable: true,
    filter: true,
    resizable: true,
  };


  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    console.log('columnDefs check',this.columnDefs)
    console.log('sendRowDynamic checking from data table',this.sendRowDynamic)
    console.log('all_Packet_store from data table',this.all_Packet_store)
    this.parseChartConfig(this.all_Packet_store);
    
  }

  parseChartConfig(data: any) {
    // Iterate through the grid_details array
    data.grid_details.forEach((detail: { grid_type: string; chartConfig: string; }) => {
      // Check if the current detail's grid_type is 'chart'
      if (detail.grid_type === 'Columnchart') {
        console.log('Found chart config:', detail.chartConfig);
        try {
          // Parse the chartConfig JSON string to access its properties
          const chartConfig = JSON.parse(detail.chartConfig);
          console.log('chartConfig checking', chartConfig);

          // Check if chartConfig is not empty and has at least one element
          if (chartConfig.length > 0 && chartConfig[0].columnVisibility) {
            console.log('Column Visibility from Chart Config:', chartConfig[0].columnVisibility);
            // Generate column definitions from the columnVisibility
            this.columnDefs = this.createColumnDefs(chartConfig[0].columnVisibility);
            console.log('this.columnDefs checking',this.columnDefs)
          } else {
            console.log('No column visibility data found in chart config.');
          }
        } catch (e) {
          console.error('Error parsing chartConfig:', e);
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
