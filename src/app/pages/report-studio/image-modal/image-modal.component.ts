import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-image-modal',
  template: `
    <div class="modal-header">
      <!-- <h5 class="modal-title">Image Preview</h5>
      <button type="button" class="close" (click)="close()" style="text-align: end;"> -->
        <!-- <span aria-hidden="true">&times;</span>
      </button> -->
    </div>
    <div class="modal-body">
      <img [src]="imageSrc" alt="Full Image" class="img-fluid"/>
    </div>
  `,
  styles: [`
    .modal-body {
      text-align: center;
    }
    img {
      max-width: 100%;
      max-height: 80vh;
    }
  `]
})
export class ImageModalComponent {

  constructor(public activeModal: NgbActiveModal){}

  @Input() imageSrc: string;

  // close() {
  //   this.activeModal.close();
  // }
}