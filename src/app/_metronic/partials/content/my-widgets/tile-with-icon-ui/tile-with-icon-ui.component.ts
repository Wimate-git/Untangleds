import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SummaryEngineService } from 'src/app/pages/summary-engine/summary-engine.service';

@Component({
  selector: 'app-tile-with-icon-ui',

  templateUrl: './tile-with-icon-ui.component.html',
  styleUrl: './tile-with-icon-ui.component.scss'
})
export class TileWithIconUiComponent {
  @Input() item:any
  @Input() index:any
  @Input() isEditModeView:any;

  @Input() hidingLink:any;
  @Input() isFullscreen:  any; 
  @Output() sendCellInfo = new EventEmitter<any>();
  @Input() tileWidth:any
  @Input() tileHeight:any
  @Input() liveDataTile:any
  @Input() disableMenuQP:any
  @Input() viewModeQP:any
  
  

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
  @Input () summaryDashboardView :any
  @Input() summaryDashboardUpdate:any;
  @Input() queryParamsSend:any



 
  ngOnChanges(changes: SimpleChanges): void {
    console.log('dashboardChange tile1 ui',this.all_Packet_store)
    console.log('this.liveDataTile check',this.liveDataTile)
    console.log('this.queryParamsSend checking',this.queryParamsSend)
    console.log('this.item checking icon',this.item)
 








  

    

   

   


  
 

  
}
get shouldShowButton(): boolean {
  return this.item.dashboardIds !== "";
}

  constructor(
   private modalService: NgbModal,private router: Router,private sanitizer: DomSanitizer,private summaryService:SummaryEngineService
   
  ){}



  ngOnInit(){
    console.log('item chacke',this.item.grid_details)
    console.log('disableMenuQP check from ngOnint',this.disableMenuQP)
    console.log('this.queryParamsSend check ngOnInit',)



      this.summaryService.lookUpData$.subscribe((data: any)=>{
        console.log('data check>>> tileui1',data)
   let tempCharts:any=[]
  data.forEach((packet: any,matchedIndex:number) => {
    
    if(packet.grid_type == 'tile'&& this.index==matchedIndex && packet.id === this.item.id){
      tempCharts[matchedIndex] = packet
      console.log('packet checking response data',packet)
      this.formatTile(packet)
  
    }
  });
  
  
  
        
        // console.log("✅ Matched Charts:", matchedCharts);
        
      
        
        
      })
    




  
  }
  formatTile(receiveTilePacket:any){
    console.log('receiveTilePacket checking',receiveTilePacket)

    if(receiveTilePacket){
      this.item.multi_value = JSON.parse(receiveTilePacket.multi_value)
      console.log('this.item in if condition',this.item)

    }
    else{
      console.log('this.item in else',this.item)
    }

  
  }

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
  helperDashboard(item: any, index: any, modalContent: any, selectType: any): void {
    const viewMode = true;
    const disableMenu = true;

    localStorage.setItem('isFullScreen', JSON.stringify(true));
    const modulePath = item.dashboardIds; // Adjust with your module route
    const queryParams = `?viewMode=${viewMode}&disableMenu=${disableMenu}`;

    this.dashboardAction.emit({ item, index, modalContent, selectType });

    if (selectType === 'NewTab') {
      this.iframeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
        `${window.location.origin}/summary-engine/${modulePath}`
      );
      window.open(this.iframeUrl.changingThisBreaksApplicationSecurity, '_blank');
    } else if (selectType === 'Modal') {
      this.iframeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
        `${window.location.origin}/summary-engine/${modulePath}${queryParams}`
      );
      this.modalService.open(modalContent, { size: 'xl' });
    } else if (selectType === 'Same page Redirect') {
      this.modalService.dismissAll();
      this.router.navigate([`/summary-engine/${modulePath}`]).then(() => {
        window.location.reload();
      });
    }
  }

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
