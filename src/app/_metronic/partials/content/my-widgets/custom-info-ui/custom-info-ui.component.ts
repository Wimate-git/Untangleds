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
 
    console.log("custom info check for ui ",this.tile1Config)
    console.log('item checking',this.item)

    // console.log('tile1Config check',this.tile1Config)
 
}
ngOnInit(): void {
  
}

getDashboardId(): string | undefined {
  // Check if 'tile1Config' exists and has the 'dashboardIds' property
  if (this.tile1Config && this.tile1Config.dashboardIds) {
    console.log("Data from tile1Config:", this.tile1Config.dashboardIds);
    return this.tile1Config.dashboardIds;
  }
  // If not found, check 'item'
  else if (this.item && this.item.dashboardIds) {
    console.log("Data from item:", this.item.dashboardIds);
    return this.item.dashboardIds;
  }
  // Return undefined if neither contains the dashboard ID
  else {
    console.warn("Dashboard ID is undefined in both 'tile1Config' and 'item'.");
    return undefined;
  }
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
