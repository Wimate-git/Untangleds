import { Component, ElementRef, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-html-tile-ui',

  templateUrl: './html-tile-ui.component.html',
  styleUrl: './html-tile-ui.component.scss'
})
export class HtmlTileUiComponent implements OnInit{
 
  @Output() customEvent = new EventEmitter<{ arg1: any; arg2: number }>();
  @Output() customEvent1 = new EventEmitter<{ data: { arg1: any; arg2: number }; all_Packet_store: any }>();
  @Output() customEvent2 = new EventEmitter<{ data: { arg1: any; arg2: number }; all_Packet_store: any }>();
  @Input()  all_Packet_store: any;
  @Input() item:any
  @Input() summaryDashboardUpdate:any;
  @Input() isFullscreen: boolean = false; 
  @Input() index :any
  @Input () isEditModeView :any
  sanitizedHtml: SafeHtml = '';
  @ViewChild('previewFrame', { static: false }) previewFrame!: ElementRef;

  @Input () hidingLink:any
  htmlPreview: SafeHtml = '';
 
  @Input () hideButton:any
  descriptionData: any;
  primaryValue: any;
  tile1Config: any;

  constructor(
    private modalService: NgbModal,private router: Router,private sanitizer: DomSanitizer
    
   ){}
  ngOnInit() {

  }
 
  ngOnChanges(changes: SimpleChanges): void {
    console.log('dashboardChange dynamic ui',this.all_Packet_store)
 
    console.log("tile data check htmlTile ",this.item)

    const parsehtmlTextArea = this.item.htmlTextArea
    console.log('parsehtmlTextArea checking',parsehtmlTextArea)
    // this.htmlPreview = this.sanitizer.bypassSecurityTrustHtml(parsehtmlTextArea) as string;
    // console.log('this.htmlPreview checking', this.htmlPreview);


    

    // ✅ Ensure preview updates
    this.updatePreview();
    this.tile1Config = this.item


  
 

  
}
  edit_each_tileUI(value1: any,value2: number) {
    const data = { arg1: value1, arg2: value2 }; // Two arguments
  this.customEvent.emit(data); // Emitting an event with two arguments

  }
  edit_each_duplicate(value1: any, value2: number) {
    const data = { arg1: value1, arg2: value2 }; // Two arguments
    console.log('Data check from dynamic UI:', data);
  
    // Combine data with all_Packet_store
    const payload = {
      data,
      all_Packet_store: this.all_Packet_store, // Include all_Packet_store
    };
  
    console.log('Combined payload:', payload);
  
    // Emit the payload
    this.customEvent1.emit(payload);
  }
  deleteTile(value1: any,value2: number) {
    const data = { arg1: value1, arg2: value2 }; // Two arguments
    const payloadDelete = {
      data,
      all_Packet_store: this.all_Packet_store, // Include all_Packet_store
    };
  this.customEvent2.emit(payloadDelete); // Emitting an event with two arguments
}

  get shouldShowButton(): boolean {
    return this.item.dashboardIds !== "";
  }


  closeModal() {
    this.modalService.dismissAll(); // Close the modal programmatically
  }
  updatePreview() {
    if (this.previewFrame && this.previewFrame.nativeElement) {
      const iframe = this.previewFrame.nativeElement as HTMLIFrameElement;

      // Create a Blob URL
      const blob = new Blob([this.item.htmlTextArea], { type: 'text/html' });
      const url = URL.createObjectURL(blob);

      // Set the iframe src to the blob URL
      iframe.src = url;
    }
  }

}
