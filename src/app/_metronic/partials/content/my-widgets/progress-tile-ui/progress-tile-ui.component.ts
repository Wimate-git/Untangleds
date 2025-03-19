import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SummaryEngineService } from 'src/app/pages/summary-engine/summary-engine.service';

@Component({
  selector: 'app-progress-tile-ui',

  templateUrl: './progress-tile-ui.component.html',
  styleUrl: './progress-tile-ui.component.scss'
})
export class ProgressTileUiComponent implements OnInit{
  @Input() item:any
  @Input() index:any
  @Input() isEditModeView:any;
  @Output() customEvent = new EventEmitter<{ arg1: any; arg2: number }>();
  @Output() customEvent1 = new EventEmitter<{ data: { arg1: any; arg2: number }; all_Packet_store: any }>();
  @Output() customEvent2 = new EventEmitter<{ data: { arg1: any; arg2: number }; all_Packet_store: any }>();

  // @Output() customEvent2 = new EventEmitter<{ arg1: any; arg2: number }>();
  @Input()  all_Packet_store: any;
  @Input () hideButton:any
  @Input () liveDataDynamicTile:any
  @Input () summaryDashboardUpdate:any
  @Input() summaryDashboardView:any
  // (summaryDashboardUpdate || (summaryDashboardUpdate && !summaryDashboardView))
  
  iframeUrl: any;
  selectedMarkerIndex: any;
  tile1Config: any;
  splitData: any;
  descriptionData: any;
  primaryValue: any;
  parsedTileConfig: any;
  tileConfig: any;
  tileTiltle: any;
  showTotalSumValue: any;
  equationProcessValue: any;
  calculatedValue: any;
  dataDisplay: any;
  calculatedPercentage: any;
  dataDisplay2: any;
  ngOnInit(){
    // console.log('item chacke',this.item.grid_details)
    this.summaryService.lookUpData$.subscribe((data: any)=>{
      console.log('data check>>>',data)
 let tempCharts:any=[]
data.forEach((packet: any,matchedIndex:number) => {
  
  if(packet.grid_type == 'progressTile'&& this.index==matchedIndex && packet.id === this.item.id){
    tempCharts[matchedIndex] = packet
    this.dynamicTileFormat(packet)

  }
});

      
      // console.log("✅ Matched Charts:", matchedCharts);
      
    
      
      
    })


  }

  dynamicTileFormat(dinamicTileresponse?:any){

    console.log('dinamicTileresponse check',dinamicTileresponse)
    if(dinamicTileresponse){
      this.parsedTileConfig = JSON.parse(dinamicTileresponse.tileConfig)
      console.log('this.parsedTileConfig check',this.parsedTileConfig)
      this.equationProcessValue = JSON.parse(dinamicTileresponse.equationProcess)
      console.log('this.equationProcessValue checking',this.equationProcessValue)
    }else
    console.log('this.item checking progress',this.item )
    this.parsedTileConfig = JSON.parse(this.item.tileConfig);
    console.log('this.parsedTileConfig check', this.parsedTileConfig);
    this.dataDisplay=this.parsedTileConfig[0]
    console.log('this.dataDisplay checking',this.dataDisplay)
    this.dataDisplay2 = this.parsedTileConfig[1]
    
    if (this.parsedTileConfig.length >= 2) {
      const num1 = parseFloat(this.parsedTileConfig[0].processed_value) || 0; // Pending projects
      const num2 = parseFloat(this.parsedTileConfig[1].processed_value) || 0; // Total projects
      // const num1: number = 70; // Pending projects
      // const num2: number = 100; // Total projects (assumed value for testing)
    
      if (num2 === 0) {
        console.warn("Division by zero error! Setting percentage to 0.");
        this.calculatedPercentage = 0;
      } else {
        this.calculatedPercentage = Math.round((num1 / num2) * 100); // Convert to percentage
        if (this.calculatedPercentage > 100) {
          this.calculatedPercentage = 100; // Cap at 100%
        }
        console.log('this.calculatedPercentage', this.calculatedPercentage);
      }
    } else {
      console.warn("Insufficient data to calculate percentage");
    }
    
    
    


    // this.equationProcessValue = this.item.equationProcess
    // console.log('this.equationProcessValue checking',this.equationProcessValue)
  }

  ngAfterViewInit(){
    setTimeout(() => {
      this.dynamicTileFormat()
    }, 500);
  

  }

  get calculateWidthPercentage(): any {
    if (this.parsedTileConfig.length >= 2) {
      const num1 = parseFloat(this.parsedTileConfig[0].processed_value) || 0; // Pending projects
      const num2 = parseFloat(this.parsedTileConfig[1].processed_value) || 0; // Total projects
    const percentage = (num1 / num2) * 100;
    return Math.min(percentage, 100);
    }
  }
  get formattedWidthPercentage(): any {
    if (this.parsedTileConfig.length >= 2) {
      const num1 = parseFloat(this.parsedTileConfig[0].processed_value) || 0; // Pending projects
      const num2 = parseFloat(this.parsedTileConfig[1].processed_value) || 0; // Total projects
    const percentage = (num1 / num2) * 100;
    return Math.min(percentage, 100).toFixed(2) + '%';}
  }
  ngOnChanges(changes: SimpleChanges): void {
    console.log('dashboardChange dynamic ui',this.all_Packet_store)
 
    console.log("tile data check from dynamic Title",this.liveDataDynamicTile)
    console.log('this ngonchanges',this.item )

    // this.tileTiltle = this.item.chart_title
    // if (this.item && this.liveDataDynamicTile !==undefined) {
    //   console.log("✅ LiveDashboard is TRUE - Updating multi_value...");
    
    //   if (this.item && this.liveDataDynamicTile && Array.isArray(this.liveDataDynamicTile)) {
    //       // Find the matching packet from this.liveDataTile based on id
    //       const matchingLiveTile = this.liveDataDynamicTile.find(liveTile => liveTile.id === this.item.id);
    
    //       console.log('🔍 Matching Live Tile:', matchingLiveTile);
    
    //       // Update multi_value only if a match is found
    //       if (matchingLiveTile && matchingLiveTile.tileConfig) {
    //           if (Array.isArray(matchingLiveTile.tileConfig)) {
    //               this.item.tileConfig = matchingLiveTile.tileConfig; // Assign directly if already an array
    //           } else if (typeof matchingLiveTile.tileConfig === "string") {
    //               try {
    //                   this.item.tileConfig = JSON.parse(matchingLiveTile.tileConfig); // Parse if stringified JSON
    //               } catch (error) {
    //                   console.error("⚠️ JSON Parsing Error for tileConfig:", matchingLiveTile.tileConfig, error);
    //               }
    //           }
    //       }
    
    //       console.log('✅ Updated this.item: after live', this.item);
    //           this.parsedTileConfig = this.item.tileConfig
    // console.log('this.parsedTileConfig check',this.parsedTileConfig)
    // this.equationProcessValue = this.item.equationProcess
    // console.log('this.equationProcessValue checking',this.equationProcessValue)
    //   } else {
    //       console.warn("⚠️ Either this.item is empty or this.liveDataTile is not an array.");
    //   }
    // } else {
    //   console.log("❌ LiveDashboard is FALSE - Keeping original item.");
    //   console.log('this.Item',this.item)
    //   this.parsedTileConfig = JSON.parse(this.item.tileConfig)
    //   console.log('this.parsedTileConfig check',this.parsedTileConfig)
    //   this.equationProcessValue = this.item.equationProcess
    //   console.log('this.equationProcessValue checking',this.equationProcessValue)
    
    //   // Do nothing, retain the existing this.item as is
    // }
    // this.tileConfig = this.item.tileConfig



  

   
   
    let description = this.item.filterDescription; // This will contain your string
    console.log('description check', description);
    
 
    



    this.tile1Config = this.item

  
 

  
}
get shouldShowButton(): boolean {
  return this.item.dashboardIds !== "";
}

  constructor(
   private modalService: NgbModal,private router: Router,private sanitizer: DomSanitizer,private summaryService:SummaryEngineService
   
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
  helperDashboard(item:any,index:any,modalContent:any,selectType:any){

    console.log('selectType check',selectType)
    console.log('index checking for dynamic',item)
    const viewMode = true;
    const disableMenu = true



    localStorage.setItem('isFullScreen', JSON.stringify(true));
    // const parseData = JSON.parse(item.tileConfig); // Adjust with your module route
    // selectType = parseData[0].selectType
    const modulePath =item.dashboardIds
    // console.log('modulePath checking',parseData)
    const queryParams = `?viewMode=${viewMode}&disableMenu=${disableMenu}`;

 this.selectedMarkerIndex = index
 if (selectType === 'NewTab') {
  this.iframeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(window.location.origin +"/summary-engine/"+ modulePath);
  // Open in a new tab
  window.open(this.iframeUrl.changingThisBreaksApplicationSecurity, '_blank');
} else if(selectType === 'Modal'){
  this.iframeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(window.location.origin +"/summary-engine/"+ modulePath+queryParams);
  // Open in the modal
  this.modalService.open(modalContent, { size: 'xl' });
}


  }

  closeModal() {
    this.modalService.dismissAll(); // Close the modal programmatically
  }
  


}
