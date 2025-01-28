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
  checkResBody: any;
  parsedResBody: any;
  processedData: any;
  @Output() paresdDataEmit = new EventEmitter<any>();
  
  ngOnChanges(changes: SimpleChanges): void {
    console.log('dashboardChange dynamic ui',this.all_Packet_store)
 
      console.log("Dynamic data check",this.item)
      this.tile1Config = this.item
      console.log('routeId checking from ui',this.routeId)
      console.log('SK_clientID checking',this.SK_clientID)


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
      console.log('this.chartOptions check', this.chartOptions);
      console.log('this.gridOptions check', this.gridOptions);

      
     

    
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


      // Define the API Gateway URL
      const apiUrl = 'https://1vbfzdjly6.execute-api.ap-south-1.amazonaws.com/stage1';
    
      // Prepare the request body
      const requestBody = {
        body: JSON.stringify({
          clientId: this.SK_clientID,
          routeId: this.routeId,
          widgetId:this.item.id,
          chartData:pointData,
          MsgType:'DrillDown'
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
  @Input() summaryDashboardUpdate:any;
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
  }

  createPieChart() {
    console.log('this.chartOptions in initialization', this.chartOptions);
  
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
    console.log('item checking from ',item)
    if (typeof this.item.chartConfig === 'string') {
      this.gridOptions = JSON.parse(this.item.chartConfig);
    } else {
      this.gridOptions = this.item.chartConfig; // Already an object
    }
    const viewMode = true;
    const disableMenu = true


console.log('this.gridOptions checking from chart',this.gridOptions)
    localStorage.setItem('isFullScreen', JSON.stringify(true));
    const modulePath = this.gridOptions[0].dashboardIds; // Adjust with your module route
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
  


}
