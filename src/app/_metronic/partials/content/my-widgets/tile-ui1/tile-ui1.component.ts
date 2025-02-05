import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-tile-ui1',

  templateUrl: './tile-ui1.component.html',
  styleUrl: './tile-ui1.component.scss'
})
export class TileUi1Component implements OnInit{
  @Input() item:any
  @Input() index:any
  @Input() isEditModeView:any;
  @Input() summaryDashboardUpdate:any;
  @Input() hidingLink:any;
  @Input() isFullscreen:  any; 
  @Output() sendCellInfo = new EventEmitter<any>();
  @Input() tileWidth:any
  @Input() tileHeight:any
  @Output() dashboardAction = new EventEmitter<{
    item: any;
    index: any;
    modalContent: any;
    selectType: any;
  }>();
  
  
  @Output() customEvent = new EventEmitter<{ arg1: any; arg2: number }>();
  @Output() customEvent1 = new EventEmitter<{ data: { arg1: any; arg2: number }; all_Packet_store: any }>();
  @Output() customEvent2 = new EventEmitter<{ data: { arg1: any; arg2: number }; all_Packet_store: any }>();
  @Input()  all_Packet_store: any;
 
  @Input () hideButton:any
  iframeUrl: any;
  selectedMarkerIndex: any;
  tile1Config: any;
  splitData: any;
  descriptionData: any;
  primaryValue: any;
  ngOnInit(): void {

    
  }


  ngOnChanges(changes: SimpleChanges): void {
    console.log('dashboardChange dynamic ui',this.all_Packet_store)
 
    console.log("tile data check from tile1 ",this.item)
   

   
    let description = this.item.filterDescription; // This will contain your string
    console.log('description check', description);
    
    // Split the description by '&&'
    let conditions = description.split('&&').map((cond: string) => cond.trim());
    
    // Iterate over each condition to extract values
    let extractedValues: any[] = [];
    
    conditions.forEach((condition: string) => {
      // Use regex to capture the value after "=="
      let regex = /\$\{[^\}]+\}==(['"]?)(.+?)\1/;
      let match = condition.match(regex);
      
      if (match) {
        let value = match[2].trim(); // Extract the value after ==
        extractedValues.push(value); // Store the extracted value
      }
    });
    
    // Assign the first extracted value to descriptionData
    if (extractedValues.length > 0) {
      this.descriptionData = extractedValues[0];
      console.log('this.descriptionData check', this.descriptionData);
    } else {
      this.primaryValue = this.item.multi_value[0].value;
    }
    
    // Log all extracted values
    console.log('Extracted Values:', extractedValues);
    



    this.tile1Config = this.item

  
 

  
}
get shouldShowButton(): boolean {
  return this.item.dashboardIds !== "";
}

  constructor(
   private modalService: NgbModal,private router: Router,private sanitizer: DomSanitizer
   
  ){}

  edit_each_tileUI(value1: any,value2: number) {
    const data = { arg1: value1, arg2: value2 }; // Two arguments
    console.log('data checking from tile1',data)
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
  // helperDashboard(item: any, index: any, modalContent: any, selectType: any): void {
  //   const viewMode = true;
  //   const disableMenu = true;

  //   localStorage.setItem('isFullScreen', JSON.stringify(true));
  //   const modulePath = item.dashboardIds; // Adjust with your module route
  //   const queryParams = `?viewMode=${viewMode}&disableMenu=${disableMenu}`;

  //   this.dashboardAction.emit({ item, index, modalContent, selectType });

  //   if (selectType === 'NewTab') {
  //     this.iframeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
  //       `${window.location.origin}/summary-engine/${modulePath}`
  //     );
  //     window.open(this.iframeUrl.changingThisBreaksApplicationSecurity, '_blank');
  //   } else if (selectType === 'Modal') {
  //     this.iframeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
  //       `${window.location.origin}/summary-engine/${modulePath}${queryParams}`
  //     );
  //     this.modalService.open(modalContent, { size: 'xl' });
  //   } else if (selectType === 'Same page Redirect') {
  //     this.modalService.dismissAll();
  //     this.router.navigate([`/summary-engine/${modulePath}`]).then(() => {
  //       window.location.reload();
  //     });
  //   }
  // }

  closeModal() {
    this.modalService.dismissAll(); // Close the modal programmatically
  }

  get fontSize(): number {
    // Factor to adjust font size based on tile size
    const factor = 7; 
  
    // Apply font size logic based on window width
    if (window.innerWidth <= 430) {
      return 28;  // For very small screens (mobile)
    } else if (window.innerWidth > 430 && window.innerWidth <= 550) {
      return 32;  // For smaller tablets or portrait mode
    } else {
      // For larger screens, calculate font size based on tile width and height
      return (this.tileWidth + this.tileHeight) / 2 / factor;
    }
  }
  

}
