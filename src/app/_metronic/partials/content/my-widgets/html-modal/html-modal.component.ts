import { Component, Input, SimpleChanges } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-html-modal',
  templateUrl: './html-modal.component.html',
  styleUrls: ['./html-modal.component.scss'] // Fix typo: should be "styleUrls" instead of "styleUrl"
})
export class HtmlModalComponent {
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

