import { Component, Input, SimpleChanges } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-over-view-modal',
  templateUrl: './over-view-modal.component.html',
  styleUrl: './over-view-modal.component.scss'
})
export class OverViewModalComponent {
  @Input() blobUrl: any;
  @Input() modal: any;

  sanitizedBlobUrl: SafeResourceUrl | null = null;

  constructor(private sanitizer: DomSanitizer) {} // Inject DomSanitizer

  ngOnChanges(changes: SimpleChanges): void {
    console.log('blobUrl checking', this.blobUrl);

    // Sanitize blob URL before using it in iframe
    if (this.blobUrl) {
      this.sanitizedBlobUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.blobUrl);
    }
  }
}


