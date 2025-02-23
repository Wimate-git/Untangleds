import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as Highcharts from 'highcharts';
import Swal from 'sweetalert2';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-chart-ui1',

  templateUrl: './chart-ui1.component.html',
  styleUrl: './chart-ui1.component.scss'
})
export class ChartUi1Component implements OnChanges {
  chartOptions: any;
  gridOptions: any;
  @Input() chartWidth:any
  @Input() chartHeight:any
  tile1Config: any;
  selectedMarkerIndex: any;
  iframeUrl: any;
  @Input () hideButton:any
  @Output() sendCellInfo = new EventEmitter<any>();
  @Input() routeId:any
  @Input() SK_clientID:any
  @Input() liveDataChart:any

  @Input() permissionIdRequest:any
  @Input() readFilterEquation:any
  @Input() userdetails:any
  @Input () summaryDashboardView :any
  @Input() summaryDashboardUpdate:any;
  isMobile: boolean = false;
  mobileChartWidth: number = window.innerWidth * 0.85;  // Custom mobile width
  mobileChartHeight: number = window.innerWidth * 0.87; // Custom mobile height
  
  
  
  checkResBody: any;
  parsedResBody: any;
  processedData: any;
  @Output() paresdDataEmit = new EventEmitter<any>();
  @Output() emitChartConfigTable = new EventEmitter<any>();
  formTableConfig: {};
  
  ngOnChanges(changes: SimpleChanges): void {
    console.log('dashboardChange dynamic ui',this.all_Packet_store)
 
      console.log("Dynamic data check fro chart1",this.item)
      console.log('liveDataChart from child chart1',this.liveDataChart)
   
      console.log('routeId checking from ui',this.routeId)
      console.log('SK_clientID checking',this.SK_clientID)


      if (this.all_Packet_store?.LiveDashboard === true ||(this.all_Packet_store?.grid_details &&
        this.all_Packet_store.grid_details.some((packet: { grid_type: string; }) => packet.grid_type === "filterTile"))) {
        console.log("✅ LiveDashboard is TRUE - Updating highchartsOptionsJson & chartConfig...");
    
        if (this.item && this.liveDataChart && Array.isArray(this.liveDataChart)) {
            // Find the matching packet from this.liveDataChart based on id
            const matchingLiveChart = this.liveDataChart.find(liveChart => liveChart.id === this.item.id);
    
            console.log('🔍 Matching Live Chart for ID:', this.item.id, matchingLiveChart);
    
            // Update highchartsOptionsJson and chartConfig only if a match is found
            if (matchingLiveChart) {
                this.item.highchartsOptionsJson = matchingLiveChart.highchartsOptionsJson;
                this.item.chartConfig = matchingLiveChart.chartConfig;
            }
    
            console.log('✅ Updated this.item: after Live', this.item);
            if (typeof this.item.highchartsOptionsJson === 'string') {
              try {
                this.chartOptions = JSON.parse(this.item.highchartsOptionsJson);
                console.log('this.chartOptions', this.chartOptions);
              } catch (error) {
                console.error('Error parsing JSON:', error);
              }
            } else {
              // If it's already an object, assign it directly
              this.chartOptions = this.item.highchartsOptionsJson;
              console.log('this.chartOptions', this.chartOptions);
            }
            
      
            if (typeof this.item.chartConfig === 'string') {
              this.gridOptions = JSON.parse(this.item.chartConfig);
            } else {
              this.gridOptions = this.item.chartConfig; // Already an object
            }
        } else {
            console.warn("⚠️ Either this.item is empty or this.liveDataChart is not an array.");
        }
    } else {
        console.log("❌ LiveDashboard is FALSE - Keeping original item.");
        if (typeof this.item.highchartsOptionsJson === 'string') {
          try {
            this.chartOptions = JSON.parse(this.item.highchartsOptionsJson);
            console.log('this.chartOptions', this.chartOptions);
          } catch (error) {
            console.error('Error parsing JSON:', error);
          }
        } else {
          // If it's already an object, assign it directly
          this.chartOptions = this.item.highchartsOptionsJson;
          console.log('this.chartOptions', this.chartOptions);
        }
        
  
        if (typeof this.item.chartConfig === 'string') {
          this.gridOptions = JSON.parse(this.item.chartConfig);
        } else {
          this.gridOptions = this.item.chartConfig; // Already an object
        }
        // Do nothing, retain the existing this.item as is
    }
    





      console.log('this.chartOptions check before live', this.chartOptions);
      console.log('this.gridOptions check', this.gridOptions);

      
   
      this.tile1Config = this.item
    
  }
  onBarClick(event: Highcharts.PointClickEventObject): void {
    console.log('event checking from ui',event)
    console.log('Pie clicked:', {
      name: event.point.name, // Use `name` for pie chart labels
      value: event.point.y,   // Use `y` for the data value
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
  console.log('this.permissionIdRequest',this.permissionIdRequest)
  console.log('this.readFilterEquation',this.readFilterEquation)
  console.log('this.userdetails',this.userdetails)
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
          userName:this.userdetails

         

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
  ngAfterViewInit(){
    setTimeout(() => {
      this.createPieChart()
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

  @Input() hidingLink:any;
  @Input() isFullscreen: boolean = false; 

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
    this.detectScreenSize()
  }

  createPieChart() {
    console.log('this.chartOptions in initialization>>>>>', this.chartOptions);
  
    // Fix the series data structure
    this.chartOptions.series = this.chartOptions.series.map((series: any) => {
      return {
        ...series,
        data: series.data.map((point: any, index: number) => ({
          name: point[0], // First element as name
          y: point[1],    // Second element as value
          customIndex: index,
          events: {
            click: (event: Highcharts.PointClickEventObject) => this.onBarClick(event),
          },
        })),
      };
    });
  
    // Initialize the Highcharts pie chart
    Highcharts.chart(`pieChart${this.index + 1}`, this.chartOptions);
  }
  
  get shouldShowButton(): boolean {
    return this.item.dashboardIds !== "";
  }
  
    constructor(
     private modalService: NgbModal,private router: Router,private sanitizer: DomSanitizer,private http: HttpClient
     
    ){}

  helperDashboard(item:any,index:any,modalContent:any,selectType:any){
    console.log('selectType checking dashboard',selectType)
    console.log('item checking from ',item)
    // if (typeof this.item.chartConfig === 'string') {
    //   this.gridOptions = JSON.parse(this.item.chartConfig);
    // } else {
    //   this.gridOptions = this.item.chartConfig; // Already an object
    // }
    const viewMode = true;
    const disableMenu = true


console.log('this.gridOptions checking from chart',this.gridOptions)
    localStorage.setItem('isFullScreen', JSON.stringify(true));
    const modulePath = this.item.dashboardIds; // Adjust with your module route
    console.log('modulePath checking from chart',modulePath)
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
  detectScreenSize() {
    this.isMobile = window.innerWidth <= 760; // Adjust breakpoint as needed
    // if (this.isMobile)
      // alert(`${this.mobileChartWidth}, 'X',${this.mobileChartHeight}`)
  }
  


}
