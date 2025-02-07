import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-data-table-chart2',

  templateUrl: './data-table-chart2.component.html',
  styleUrl: './data-table-chart2.component.scss'
})
export class DataTableChart2Component {
  modalRef: NgbModalRef | undefined;
  @Input() modal :any
  @Input() modalData: any[] = []; // Accept row data
  @Input() columnDefs: any[] = [];
  @Output() modalClose = new EventEmitter<void>(); // Emit an event when the modal is closed

  // @Input() columnDefs: any[] = []; 


  pageSizeOptions = [10, 25, 50, 100];

  // Dummy column definitions


  // Default column properties
  defaultColDef = {
    sortable: true,
    filter: true,
    resizable: true,
  };


  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
console.log('modalData check',this.modalData)
console.log('columnDefs check',this.columnDefs)
    
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
