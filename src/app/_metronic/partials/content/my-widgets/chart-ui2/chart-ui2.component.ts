import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Highcharts from 'highcharts';
import { SummaryEngineService } from 'src/app/pages/summary-engine/summary-engine.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-chart-ui2',

  templateUrl: './chart-ui2.component.html',
  styleUrl: './chart-ui2.component.scss'
})
export class ChartUi2Component implements OnInit{
  chartOptions: any;
  gridOptions: any;
  @Input() chartWidth:any
  @Input() chartHeight:any
  @Output() sendCellInfo = new EventEmitter<any>();

  @Input() hidingLink:any;
  @Input () hideButton:any
  @Input() routeId:any
  @Input() SK_clientID:any
  @Output() emitChartConfigTable = new EventEmitter<any>();
  @Input () liveDataLineChart:any
  @Input () summaryDashboardView :any
  @Input() summaryDashboardUpdate:any;
  
  formTableConfig: {};
  checkResBody: any;
  parsedResBody: any;
  processedData: any;
  @Input() permissionIdRequest:any
  @Input() readFilterEquation:any
  @Input() userdetails:any
  @Output() paresdDataEmit = new EventEmitter<any>();
  isMobile: boolean = false;
  mobileChartWidth: number = window.innerWidth * 0.85;  // Custom mobile width
  mobileChartHeight: number = window.innerWidth * 0.87; // Custom mobile height
  @Input() eventFilterConditions : any
  iframeUrl: any;
  selectedMarkerIndex: any;
  storeRedirectionCheck: any;
  tile1Config: any;
  ngOnChanges(changes: SimpleChanges): void {
    console.log('dashboardChange dynamic ui',this.all_Packet_store)
    console.log('eventFilterConditions chart ui1',this.eventFilterConditions)
    this.storeRedirectionCheck = this.item.toggleCheck

    this.tile1Config = this.item;
 
      // console.log("DynamicLine chart",this.item)

    //   if (this.all_Packet_store?.LiveDashboard === true ||(this.all_Packet_store?.grid_details &&
    //     this.all_Packet_store.grid_details.some((packet: { grid_type: string; }) => packet.grid_type === "filterTile"))) {
    //     console.log("✅ LiveDashboard is TRUE - Updating highchartsOptionsJson & chartConfig...");
    
    //     if (this.item && this.liveDataLineChart && Array.isArray(this.liveDataLineChart)) {
    //         // Find the matching packet from this.liveDataChart based on id
    //         const matchingLiveChart = this.liveDataLineChart.find(liveChart => liveChart.id === this.item.id);
    
    //         console.log('🔍 Matching Live Chart for ID:', this.item.id, matchingLiveChart);
    
    //         // Update highchartsOptionsJson and chartConfig only if a match is found
    //         if (matchingLiveChart) {
    //             this.item.highchartsOptionsJson = matchingLiveChart.highchartsOptionsJson;
    //             this.item.chartConfig = matchingLiveChart.chartConfig;
    //         }
    
    //         console.log('✅ Updated this.item: after Live', this.item);
    //         if (typeof this.item.highchartsOptionsJson === 'string') {
    //           try {
    //             this.chartOptions = JSON.parse(this.item.highchartsOptionsJson);
    //             console.log('this.chartOptions for line chart', this.chartOptions);
    //           } catch (error) {
    //             console.error('Error parsing JSON:', error);
    //           }
    //         } else {
    //           // If it's already an object, assign it directly
    //           this.chartOptions = this.item.highchartsOptionsJson;
    //           console.log('this.chartOptions', this.chartOptions);
    //         }
            
      
    //         if (typeof this.item.chartConfig === 'string') {
    //           this.gridOptions = JSON.parse(this.item.chartConfig);
    //         } else {
    //           this.gridOptions = this.item.chartConfig; // Already an object
    //         }
    //     } else {
    //         console.warn("⚠️ Either this.item is empty or this.liveDataChart is not an array.");
    //     }
    // } else {
    //     console.log("❌ LiveDashboard is FALSE - Keeping original item.");
    //     if (typeof this.item.highchartsOptionsJson === 'string') {
    //       try {
    //         this.chartOptions = JSON.parse(this.item.highchartsOptionsJson);
    //         console.log('this.chartOptions for line chart', this.chartOptions);
    //       } catch (error) {
    //         console.error('Error parsing JSON:', error);
    //       }
    //     } else {
    //       // If it's already an object, assign it directly
    //       this.chartOptions = this.item.highchartsOptionsJson;
    //       console.log('this.chartOptions', this.chartOptions);
    //     }
        
  
    //     if (typeof this.item.chartConfig === 'string') {
    //       this.gridOptions = JSON.parse(this.item.chartConfig);
    //     } else {
    //       this.gridOptions = this.item.chartConfig; // Already an object
    //     }
    //     // Do nothing, retain the existing this.item as is
    // }


      
    //   console.log('this.gridOptions check', this.gridOptions);
     
    //   this.createLineChart()
    
  }
  constructor(
    private modalService: NgbModal,private router: Router,private sanitizer: DomSanitizer,private http: HttpClient,private summaryService:SummaryEngineService
    
   ){}
  ngAfterViewInit(){
  
    setTimeout(() => {
      this.createLineChart()
    }, 500);


  

  }
  @Input() item:any
  @Input() index:any
  @Input() isEditModeView:any;
  @Output() customEvent = new EventEmitter<{ arg1: any; arg2: number }>();
  @Output() customEvent1 = new EventEmitter<{ data: { arg1: any; arg2: number }; all_Packet_store: any }>();
  @Output() customEvent2 = new EventEmitter<{ data: { arg1: any; arg2: number }; all_Packet_store: any }>();

  // @Output() customEvent2 = new EventEmitter<{ arg1: any; arg2: number }>();
  @Input()  all_Packet_store: any;

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
  ngOnInit(){
    console.log('item chacke',this.item.grid_details)
    this.summaryService.lookUpData$.subscribe((data: any)=>{
      console.log('data check>>> LineChart',data)
 let tempCharts:any=[]
data.forEach((packet: any,matchedIndex:number) => {
  
  if(packet.grid_type == 'Linechart'&& this.index==matchedIndex && packet.id === this.item.id){
    tempCharts[matchedIndex] = packet
    setTimeout(() => {
      this.createLineChart(packet)
    }, 1000);
  }
});

      
      // console.log("✅ Matched Charts:", matchedCharts);
      
    
      
      
    })

    this.summaryService.queryParamsData$.subscribe((data: any)=>{
      console.log('data check filterConditions',data)

if(data){
  this.eventFilterConditions = data
}
      
      
    
      
      
    })

    this.detectScreenSize()
  }

  detectScreenSize() {
    this.isMobile = window.innerWidth <= 760; // Adjust breakpoint as needed
    // if (this.isMobile)
      // alert(`${this.mobileChartWidth}, 'X',${this.mobileChartHeight}`)
  }
  
  onBarClick(event: Highcharts.PointClickEventObject): void {
    console.log('Line chart clicked:', {
      name: event.point.name, // Use `name` for pie chart labels
   
      value: event.point.y,
  
    });
    const pointData = {
      name: event.point.name,  // Pie chart label
      value: event.point.y     // Data value
    };
    console.log('checking data for chart',this.item)
const chartConfig =JSON.parse(this.item.chartConfig)
console.log('chartConfig check from chart ui',chartConfig)
const extractcolumnVisibility = chartConfig

this.formTableConfig = {
  columnVisibility:extractcolumnVisibility,
  formName:this.item.chartConfig.formlist
  }
  this.emitChartConfigTable.emit(this.formTableConfig); 

      // Define the API Gateway URL
      const apiUrl = 'https://1vbfzdjly6.execute-api.ap-south-1.amazonaws.com/stage1';
      console.log('check id',this.item.id)
    
      // Prepare the request body
      const requestBody = {
        body: JSON.stringify({
          clientId: this.SK_clientID,
          routeId: this.routeId,
          widgetId:this.item.id,
          chartData:pointData,
          MsgType:'DrillDown',
          permissionId:this.permissionIdRequest,
          permissionList:this.readFilterEquation,
          userName:this.userdetails,
          conditions:this.eventFilterConditions ||[]
         

        }),
      };
    
      console.log('requestBody checking', requestBody);
    
      // Send a POST request to the Lambda function with the body
      this.http.post(apiUrl, requestBody).subscribe(
        (response: any) => {
          console.log('Lambda function triggered successfully:', response);
          this.checkResBody = response.body
          console.log('this.checkResBody',this.checkResBody)
          this.parsedResBody = JSON.parse(this.checkResBody)
          console.log('this.parsedResBody checking',this.parsedResBody)
          this.processedData = JSON.parse(this.parsedResBody.rowdata)
          console.log('this.processedData check',this.processedData)
          this.paresdDataEmit.emit(this.processedData); 
          
          
      
          // Display SweetAlert success message
          // Swal.fire({
          //   title: 'Success!',
          //   text: 'Lambda function triggered successfully.',
          //   icon: 'success',
          //   confirmButtonText: 'OK'
          // });
    
          // Proceed with route parameter handling

    
   // Reset loading state
        },
        (error: any) => {
          console.error('Error triggering Lambda function:', error);
    
          // Display SweetAlert error message
          Swal.fire({
            title: 'Error!',
            text: 'Failed to trigger the Lambda function. Please try again.',
            icon: 'error',
            confirmButtonText: 'OK'
          });
   // Reset loading state
        }
      );
  
    // Emit the cell info if needed
    this.sendCellInfo.emit(event);
  }

  createLineChart(lichartData?:any) {
    console.log('this.chartOptions from line chart function',this.chartOptions)
    if(lichartData){
      const linachartDataFormat = JSON.parse(lichartData.highchartsOptionsJson)
      linachartDataFormat.series = linachartDataFormat.series.map((series: any) => {
        return {
          ...series,
          data: series.data.map((value: any, index: number) => ({
            name: value.name, 
            y: value,
            customIndex: index,
            events: {
              click: (event: Highcharts.PointClickEventObject) => this.onBarClick(event),
            },
          })),
        };
      });
  
  
   
      Highcharts.chart(`lineChart${this.index+1}`, linachartDataFormat);

    }
    else{
    console.log('this.item in else chart2',this.item)

      const linachartDataFormat = JSON.parse(this.item.highchartsOptionsJson)
      console.log('linachartDataFormat checking',linachartDataFormat)
      linachartDataFormat.series = linachartDataFormat.series.map((series: any) => {
        return {
          ...series,
          data: series.data.map((value: any, index: number) => ({
            name: value.name, 
            y: value,
            customIndex: index,
            events: {
              click: (event: Highcharts.PointClickEventObject) => this.onBarClick(event),
            },
          })),
        };
      });
  
  
   
      Highcharts.chart(`lineChart${this.index+1}`, linachartDataFormat);
      
    }


  }

  helperDashboard(item: any, index: any, modalContent: any, selectType: any, ModuleNames: any) {
    console.log('selectType checking dashboard', selectType);
    console.log('item checking from', item);
    console.log('ModuleNames:', ModuleNames);
  
    // ✅ Only handle custom logic for Summary Dashboard
    if (selectType && ModuleNames === 'Summary Dashboard') {
      const viewMode = true;
      const disableMenu = true;
      localStorage.setItem('isFullScreen', JSON.stringify(true));
  
      const modulePath = item.dashboardIds;
      const isFullScreen = localStorage.getItem('isFullScreen') === 'true';
      const queryParams = `?viewMode=${viewMode}&disableMenu=${disableMenu}&isFullScreen=${isFullScreen}`;
  
      const fullUrl = `/summary-engine/${modulePath}${queryParams}`;
  
      this.iframeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
        window.location.origin + fullUrl
      );
  
      this.selectedMarkerIndex = index;
  
      if (selectType === 'NewTab') {
        window.open(this.iframeUrl.changingThisBreaksApplicationSecurity, '_blank');
      } else if (selectType === 'Modal') {
        this.modalService.open(modalContent, { size: 'xl' });
      } else if (selectType === 'Same page Redirect') {
        this.router.navigateByUrl(fullUrl).catch(err => console.error('Navigation error:', err));
      }
    } 
    // ✅ If module is NOT Summary Dashboard, delegate to general redirect
    else if (selectType && ModuleNames !== 'Summary Dashboard') {
      this.redirectModule(item);
    }
  }
  
  
  redirectModule(recieveItem: any) {
    console.log('recieveItem check', recieveItem);
  
    const moduleName = recieveItem.dashboardIds;
    const selectedModule = recieveItem.ModuleNames;
    const redirectType = recieveItem.selectType; // 'NewTab' or 'Same page Redirect'
  
    console.log('moduleName:', moduleName);
    console.log('selectedModule:', selectedModule);
    console.log('selectType (redirectType):', redirectType);
  
    let targetUrl: string = '';
    const isNewTab = redirectType === 'NewTab';
  
    switch (selectedModule) {
      case 'Forms':
        targetUrl = `/view-dreamboard/Forms/${moduleName}`;
        break;
  
      case 'Summary Dashboard':
        targetUrl = `/summary-engine/${moduleName}`;
        break;
  
      case 'Dashboard':
        targetUrl = `/dashboard/dashboardFrom/Forms/${moduleName}`;
        break;
  
      case 'Projects':
        targetUrl = `/project-dashboard/project-template-dashboard/${moduleName}`;
        break;
  
      case 'Calender':
        targetUrl = `/view-dreamboard/Calendar/${moduleName}`;
        break;
  
      case 'Report Studio':
        const tree = this.router.createUrlTree(['/reportStudio'], {
          queryParams: { savedQuery: moduleName }
        });
        targetUrl = this.router.serializeUrl(tree); // already serialized
        break;
  
      default:
        console.error('Unknown module:', selectedModule);
        return;
    }
  
    // 🔁 Navigation logic
    if (isNewTab) {
      // Open serialized or regular route as full URL
      window.open(targetUrl, '_blank');
    } else {
      // Same Page Navigation
      if (selectedModule === 'Report Studio') {
        this.router.navigateByUrl(targetUrl).catch(err => console.error('Navigation error:', err));
      } else {
        this.router.navigate([targetUrl]).catch(err => console.error('Navigation error:', err));
      }
    }
  }
  closeModal() {
    this.modalService.dismissAll(); // Close the modal programmatically
  }

}
