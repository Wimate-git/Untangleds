import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-custom-info-ui',

  templateUrl: './custom-info-ui.component.html',
  styleUrl: './custom-info-ui.component.scss'
})
export class CustomInfoUiComponent implements OnInit{
  @Input() item:any
  @Input() infoWindowContent: string = '';
  @Input() iframeUrl: string = '';
  @Input() selectedMarkerIndex: number = -1;
  @Output() closeModalEvent = new EventEmitter<void>();
  @Input() tile1Config:any

  isModalOpen: boolean = false;
  ngOnChanges(changes: SimpleChanges): void {
 
    console.log("custom info check ",this.item)
    // console.log('tile1Config check',this.tile1Config)
 
}
ngOnInit(): void {
  
}

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.closeModalEvent.emit();  // Notify parent when modal is closed
  }

  onIframeLoad(event: any) {
    console.log('Iframe loaded');
  }



}
