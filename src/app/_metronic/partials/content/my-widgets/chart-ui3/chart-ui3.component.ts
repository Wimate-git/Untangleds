import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import Highcharts from 'highcharts';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-chart-ui3',

  templateUrl: './chart-ui3.component.html',
  styleUrl: './chart-ui3.component.scss'
})
export class ChartUi3Component implements OnInit{
  chartOptions: any;
  gridOptions: any;
  @Input() chartWidth:any
  @Input() chartHeight:any
  parseChartOptions: any;
  extractSeries: any;
  @Output() sendCellInfo = new EventEmitter<any>();
  @Input() routeId:any
  @Input() SK_clientID:any
  @Input() liveDataColumnChart:any
  
  checkResBody: any;
  parsedResBody: any;
  processedData: any;
  @Output() paresdDataEmit = new EventEmitter<any>();
  @Output() emitChartConfigTable = new EventEmitter<any>();
  formTableConfig: { columnVisibility: any; formName: any; };
  
  ngOnChanges(changes: SimpleChanges): void {
    console.log('dashboardChange dynamic ui',this.all_Packet_store)
 
      console.log("DynamicLine chart",this.item)
      console.log('liveDataColumnChart check',this.liveDataColumnChart)
      this.parseChartOptions = this.item.highchartsOptionsJson;
      // console.log('this.parseChartOptions checking',this.parseChartOptions)
      // const check = JSON.parse(this.parseChartOptions);
      // console.log('check parsed data',check)
      // this.extractSeries = check.series[0].name
      // console.log('this.extractSeries',this.extractSeries)
      if (this.all_Packet_store?.LiveDashboard === true) {
        console.log("✅ LiveDashboard is TRUE - Updating highchartsOptionsJson & chartConfig...");
    
        if (this.item && this.liveDataColumnChart && Array.isArray(this.liveDataColumnChart)) {
            // Find the matching packet from this.liveDataChart based on id
            const matchingLiveChart = this.liveDataColumnChart.find(liveChart => liveChart.id === this.item.id);
    
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
             
              } catch (error) {
                console.error('Error parsing JSON:', error);
              }
            } else {
              // If it's already an object, assign it directly
              this.chartOptions = this.item.highchartsOptionsJson;
              console.log('this.chartOptions from column', this.chartOptions);
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
         
          } catch (error) {
            console.error('Error parsing JSON:', error);
          }
        } else {
          // If it's already an object, assign it directly
          this.chartOptions = this.item.highchartsOptionsJson;
          console.log('this.chartOptions from column', this.chartOptions);
        }
        
  
        if (typeof this.item.chartConfig === 'string') {
          this.gridOptions = JSON.parse(this.item.chartConfig);
        } else {
          this.gridOptions = this.item.chartConfig; // Already an object
        }
        // Do nothing, retain the existing this.item as is
    }




      
      console.log('this.gridOptions check', this.gridOptions);
     
      this.chartOptions.series = this.chartOptions.series.map((series: any) => {
        return {
          ...series,
          data: series.data.map((value: any, index: number) => ({
            y: value, // Data value
            name: series.name, // Series name (optional)
            customIndex: index, // Custom property to track index
            events: {
              click: (event: Highcharts.PointClickEventObject) => this.onBarClick(event),
            },
          })),
        };
      });
     

    
  }
  constructor(
    private modalService: NgbModal,private router: Router,private sanitizer: DomSanitizer,private http: HttpClient
    
   ){}

  onBarClick(event: Highcharts.PointClickEventObject): void {
    console.log('event check for column chart',event)
    console.log('Bar clicked:', {
      category: event.point.category,
      value: event.point.y,
     
    });

    const pointData = {
      name: event.point.category,  // Pie chart label
      value: event.point.y     // Data value
    };
    console.log('pointData checking column chart',pointData)
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
      this.createBarChart()
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
  @Input () hideButton:any
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
  get shouldShowButton(): boolean {
    return this.item.dashboardIds !== "";
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

  createBarChart() {

    console.log('culomnchart dynamic data check', this.chartOptions);
  
    Highcharts.chart(`Columnchart${this.index+1}`, this.chartOptions);
    // console.log()

  }
  

}
