import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-dynamic-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dynamic-modal.component.html',
  styleUrl: './dynamic-modal.component.scss'
})
export class DynamicModalComponent {

  @Input() approvalHistory:any;

  constructor(public modal: NgbActiveModal){

  }



  ngOnInit() {
    console.log("Approval History is here ",this.approvalHistory);
  }


  formatTimestamp(timestamp: number): string {
    const date = new Date(timestamp * 1000); // Convert from seconds to milliseconds
    return date.toLocaleString(); // Formats the date to a readable string
  }
} 
