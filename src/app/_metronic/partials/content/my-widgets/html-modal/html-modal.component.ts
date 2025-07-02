import { Component, Input, SimpleChanges } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-html-modal',
  templateUrl: './html-modal.component.html',
  styleUrls: ['./html-modal.component.scss'] // Fix typo: should be "styleUrls" instead of "styleUrl"
})
export class HtmlModalComponent {
  @Input() blobUrl: any;
  @Input() modal: any;
   @Input()  iframeSafeUrl: any;

  sanitizedBlobUrl: SafeResourceUrl | null = null;

  constructor(private sanitizer: DomSanitizer, private modalService: NgbModal,) {} // Inject DomSanitizer

  ngOnChanges(changes: SimpleChanges): void {
    console.log('blobUrl checking from child', this.blobUrl);

    // Sanitize blob URL before using it in iframe
    if (this.iframeSafeUrl) {
      this.sanitizedBlobUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.iframeSafeUrl);
    }
  }


  closeModal() {
    this.modalService.dismissAll(); // Close the modal programmatically
    // window.location.reload()
  }
}

