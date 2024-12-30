import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-tile-ui3',

  templateUrl: './tile-ui3.component.html',
  styleUrl: './tile-ui3.component.scss'
})
export class TileUi3Component {
  @Input() item:any
  @Input() index:any
  @Input() isEditModeView:any;
  @Output() customEvent = new EventEmitter<{ arg1: any; arg2: number }>();
  @Output() customEvent1 = new EventEmitter<{ data: { arg1: any; arg2: number }; all_Packet_store: any }>();
  @Output() customEvent2 = new EventEmitter<{ data: { arg1: any; arg2: number }; all_Packet_store: any }>();
  @Input()  all_Packet_store: any;
  @Input () hideButton:any
  @Input() summaryDashboardUpdate:any;
  @Input() hidingLink:any;
  @Input() isFullscreen: boolean = false; 
  iframeUrl: any;
  selectedMarkerIndex: any;
  tile1Config: any;
  descriptionData: any;
  primaryValue: any;


  constructor(
    private modalService: NgbModal,private router: Router,private sanitizer: DomSanitizer
    
   ){}

   ngOnChanges(changes: SimpleChanges): void {
    console.log('dashboardChange dynamic ui',this.all_Packet_store)
 
    console.log("tile data check from tile3 ",this.item)


    let description = this.item.filterDescription; // This will contain your string

    // Use regular expression to capture the value after "=="
    let regex = /\$\{single-select-[^\}]+\}==(.+)/;
    
    // Match the string and extract the value
    let match = description.match(regex);
    
    if (match) {
      // The value you want is in match[1]
      let value = match[1].trim(); // Remove any leading or trailing spaces
      
      // Remove surrounding quotes if any (both single and double quotes)
      value = value.replace(/^['"]+|['"]+$/g, '');
      
      console.log(value); // This will log 'Open' without quotes
      this.descriptionData = value;
      console.log('this.descriptionData check', this.descriptionData); // Logs the cleaned value
    } else {
      this.primaryValue = this.item.multi_value[0].value

    }
    this.tile1Config = this.item

  
 

  
}
  edit_each_tileUI(value1: any,value2: number) {
    const data = { arg1: value1, arg2: value2 }; // Two arguments
    console.log('data checkingt',data)
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
  helperDashboard(item:any,index:any,modalContent:any,selectType:any){
    const viewMode = true;
    const disableMenu = true



    localStorage.setItem('isFullScreen', JSON.stringify(true));
    const modulePath = item.dashboardIds; // Adjust with your module route
    const queryParams = `?viewMode=${viewMode}&disableMenu=${disableMenu}`;
    this.iframeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(window.location.origin +"/summary-engine/"+ modulePath+queryParams);
 this.selectedMarkerIndex = index
 if (selectType === 'NewTab') {
  // Open in a new tab
  window.open(this.iframeUrl.changingThisBreaksApplicationSecurity, '_blank');
} else if(selectType === 'Modal'){
  // Open in the modal
  this.modalService.open(modalContent, { size: 'xl' });
}


  }

  closeModal() {
    this.modalService.dismissAll(); // Close the modal programmatically
  }

}
