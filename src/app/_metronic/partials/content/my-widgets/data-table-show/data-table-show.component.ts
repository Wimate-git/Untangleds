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
  @Input() chartDataConfigExport :any
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
  gridColumnApi: any;


  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    console.log('columnDefs check',this.columnDefs)
    console.log('sendRowDynamic checking from data table',this.sendRowDynamic)
    console.log('all_Packet_store from data table',this.all_Packet_store)
    console.log('chartDataConfigExport',this.chartDataConfigExport)
    // this.parseChartConfig(this.all_Packet_store);
    this.parseChartConfig(this.chartDataConfigExport)
    
  }

  parseChartConfig(chartDataConfigExport:any) {
    if (!chartDataConfigExport || !Array.isArray(chartDataConfigExport.columnVisibility)) {
      console.error('Invalid chartDataConfigExport format:', this.chartDataConfigExport);
      return;
    }
  
    try {
      const flattenedColumnVisibility = chartDataConfigExport.columnVisibility.flatMap((col: any) => col.columnVisibility || []);
      console.log('Flattened Column Visibility:', flattenedColumnVisibility);
  
      this.columnDefs = this.createColumnDefs(flattenedColumnVisibility);
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

  onGridReady(params:any) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

}
