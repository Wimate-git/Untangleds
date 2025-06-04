import { ChangeDetectorRef, Component, EventEmitter, Injector, Input, NgZone, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SummaryEngineService } from 'src/app/pages/summary-engine/summary-engine.service';


@Component({
  selector: 'app-dynamic-tile-ui',

  templateUrl: './dynamic-tile-ui.component.html',
  styleUrl: './dynamic-tile-ui.component.scss'
})
export class DynamicTileUiComponent implements OnInit{

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
  storeDynamicTileConfig: any;
  ngOnInit(){
    // console.log('item chacke',this.item.grid_details)
    this.summaryService.lookUpData$.subscribe((data: any)=>{
      console.log('data check>>> from dynamicTile',data)
 let tempCharts:any=[]
data.forEach((packet: any,matchedIndex:number) => {
  
  if(packet.grid_type == 'dynamicTile'&& this.index==matchedIndex && packet.id === this.item.id){
    tempCharts[matchedIndex] = packet
    console.log('packet checking from dynamic Tile',packet)
    setTimeout(() => {
      this.dynamicTileFormat(packet)
      
    }, 1000);


  }
});

      
      // console.log("✅ Matched Charts:", matchedCharts);
      
    
      
      
    })


  }




  dynamicTileFormat(dinamicTileresponse?: any) {
   
      if (dinamicTileresponse) {
        console.log('dinamicTileresponse checking from dynamicTile',dinamicTileresponse)

        try {
          setTimeout(() => {
            this.parsedTileConfig = JSON.parse(dinamicTileresponse.tileConfig);
            this.cdr.detectChanges();
            console.log('this.parsedTileConfig check from liveData', this.parsedTileConfig);
            
          }, 500);

    
        } catch (error) {
          console.error('Error parsing tileConfig from this.item:', error);
          // this.parsedTileConfig = {}; // Provide a fallback value if parsing fails
        }
    
        // this.equationProcessValue = dinamicTileresponse.equationProcess;
        // console.log('this.equationProcessValue checking', this.equationProcessValue);
        // Check if tileConfig and equationProcess are valid JSON strings before parsing

      }

    else {
      console.log('this.item checking dynamic', this.item);
      try {
        this.parsedTileConfig = JSON.parse(this.item.tileConfig);
        this.cdr.detectChanges();
        console.log('this.parsedTileConfig check from dynamicFormat', this.parsedTileConfig);
      } catch (error) {
        console.error('Error parsing tileConfig from this.item:', error);
        // this.parsedTileConfig = {}; // Provide a fallback value if parsing fails
      }
  
      this.equationProcessValue = this.item.equationProcess;
      console.log('this.equationProcessValue checking', this.equationProcessValue);
    }
    console.log('dinamicTileresponse check', dinamicTileresponse);
  

  }
  

  ngAfterViewInit(){
    setTimeout(() => {
      this.dynamicTileFormat('')
    }, 1500);
  

  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('dashboardChange dynamic ui',this.all_Packet_store)
 
    console.log("tile data check from dynamic Title",this.liveDataDynamicTile)
    console.log('this ngonchanges dynamicTile',this.item )
    this.storeDynamicTileConfig = JSON.parse(this.item.tileConfig)
    console.log('this.storeDynamicTileConfig checking',this.storeDynamicTileConfig)
    

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
   private modalService: NgbModal,private router: Router,private sanitizer: DomSanitizer,private summaryService:SummaryEngineService,private cdr: ChangeDetectorRef
   
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
