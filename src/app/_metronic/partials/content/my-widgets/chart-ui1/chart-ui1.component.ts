import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as Highcharts from 'highcharts';
import Swal from 'sweetalert2';
import { HttpClient } from '@angular/common/http';
import { SummaryEngineService } from 'src/app/pages/summary-engine/summary-engine.service';
import { NgxSpinnerService } from 'ngx-spinner';

import * as CryptoJS from 'crypto-js';
import { PageInfoService } from 'src/app/_metronic/layout';

interface CustomPointOptions {
  customIndex: number;
  // Other properties of options if needed
}

interface CustomPoint {
  options: CustomPointOptions;
  category: string;
  y: number;
  colorIndex: number;
}

interface FormTableConfig {
  columnVisibility: Array<{
    formlist: string;
    parameterName: string[];
    primaryValue: string;
    groupByFormat: string;
    constantValue: string;
    // Include other properties as needed
  }>;
  formName?: string;
}
interface ColumnVisibility {
  formlist: string;
  parameterName: string[];
  primaryValue: string;
  groupByFormat: string;
  constantValue: string;
  // Add other properties that are part of the object
}
interface storeColumnVisibility {
  formlist: string;
  parameterName: string[];
  primaryValue: string;
  groupByFormat: string;
  constantValue: string;
  columnVisibility: string[]; // This expects an array of strings
}


@Component({
  selector: 'app-chart-ui1',

  templateUrl: './chart-ui1.component.html',
  styleUrl: './chart-ui1.component.scss'
})
export class ChartUi1Component implements OnChanges,OnInit {
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
    iframeSafeUrl: SafeResourceUrl = ''; 

  @Input() permissionIdRequest:any
  @Input() readFilterEquation:any
  @Input() userdetails:any
  @Input () summaryDashboardView :any
  @Input() summaryDashboardUpdate:any;
  isMobile: boolean = false;
  mobileChartWidth: number = window.innerWidth * 0.85;  // Custom mobile width
  mobileChartHeight: number = window.innerWidth * 0.70; // Custom mobile height
  
  allChartsData:any[] =[]
  
  checkResBody: any;
  parsedResBody: any[]=[];
  processedData: any;
  @Output() paresdDataEmit = new EventEmitter<any>();
  @Output() emitChartConfigTable = new EventEmitter<any>();
  @Output() emitIframeUrlCharts = new EventEmitter<any>()
  @Input() eventFilterConditions : any
  @Input() mainFilterCon:any
  isChecked: boolean = false;
  counter: number=0;
  isHomeChecked:boolean = false;
  @Input() userId:any;
  @Input() userPass:any;

  storeDrillFilter: string;
  DrillFilterLevel: any;
  parseChartData: any;
  storeDrillConfig: any;

  storeDrillPacket: any;
  storeRedirectionCheck: any;

  isDrillPacketAvailable: any;
  enableDrillButton: boolean =true;
  formTableConfig: FormTableConfig = { columnVisibility: [] };
  storeMainFilterCon: any;
  isBarClickableMap: { [key: number]: boolean } = {};
  @ViewChild('htmlModal', { static: false }) htmlModal: TemplateRef<any>;
  // const storeColumnVisibility: FormTableConfig = this.formTableConfig.columnVisibility[0];
  
  
ngOnChanges(changes: SimpleChanges): void {
    console.log('dashboardChange dynamic ui', this.all_Packet_store);
    console.log("Dynamic data check for chart1", this.item);
    console.log('liveDataChart from child chart1', this.liveDataChart);
    console.log('routeId checking from ui', this.routeId);
    console.log('SK_clientID checking', this.SK_clientID);
    console.log('eventFilterConditions chart ui1',this.eventFilterConditions)
    this.storeDrillPacket = JSON.parse(this.item.DrillConfig)


    console.log('this.storeDrillPacket checking',this.storeDrillPacket )
    this.isDrillPacketAvailable = this.storeDrillPacket && this.storeDrillPacket.length > 0;
    this.storeRedirectionCheck = this.item.toggleCheck





    if(this.storeDrillFilter==undefined && this.DrillFilterLevel==undefined){
      this.enableDrillButton = false
    }

   
    this.tile1Config = this.item;
}


updateDrillButtonState() {
  // Check the initial state of storeDrillFilter and DrillFilterLevel
  if (this.storeDrillFilter !== undefined && this.storeDrillFilter !== '' && 
      this.DrillFilterLevel !== undefined && this.DrillFilterLevel !== '') {
      this.enableDrillButton = true;
  } else {
      this.enableDrillButton = false;
  }
}
// toggleCheck(isChecked: boolean,index:any) {
//   this.isChecked = isChecked;
//   console.log('this.isChecked checking', this.isChecked);
//   console.log('this.storeDrillFilter  checking from initial',this.storeDrillFilter )
//   console.log('this.DrillFilterLevel checking from initial',this.DrillFilterLevel)

  
//   if(this.storeDrillFilter !== undefined && this.storeDrillFilter !== '' && 
//     this.DrillFilterLevel !== undefined && this.DrillFilterLevel !== ''){

//       this.enableDrillButton = true
//     this.spinner.show('dataProcess' + index);


//     const chartConfig =JSON.parse(this.item.chartConfig)
//     console.log('chartConfig check from chart ui',chartConfig)
//     const extractcolumnVisibility = chartConfig
    
//         this.formTableConfig = {
//           columnVisibility:extractcolumnVisibility,
  
//           formName:this.item.chartConfig.formlist
//           }
//      
//           const apiUrl = 'https://1vbfzdjly6.execute-api.ap-south-1.amazonaws.com/stage1';
        
//           // Prepare the request body
//           const requestBody = {
//             body: JSON.stringify({
//               clientId: this.SK_clientID,
//               routeId: this.routeId,
//               widgetId:this.item.id,
       
//               MsgType:'DrillDown',
//               permissionId:this.permissionIdRequest,
//               permissionList:this.readFilterEquation,
//               userName:this.userdetails,
//               conditions:this.eventFilterConditions ||[],
//               ChartClick:this.isChecked,
//                      DrillFilter:this.storeDrillFilter ||'',
//           DrillFilterLevel:this.DrillFilterLevel ||''
//             }),
//           };
        
//           console.log('requestBody checking chart1Drilldown from button click', requestBody);
        
//           // Send a POST request to the Lambda function with the body
//           this.http.post(apiUrl, requestBody).subscribe(
//             (response: any) => {
//               console.log('Lambda function triggered successfully:', response);
//               this.checkResBody = response.body
//               console.log('this.checkResBody',this.checkResBody)
//               const storeparsedResBody=JSON.parse(this.checkResBody)
  
  
  
//               this.parseChartData = JSON.parse(storeparsedResBody.ChartData)
//               console.log('this.parseChartDatav checking',this.parseChartData)
//               this.storeDrillFilter = this.parseChartData.DrillFilter,
//               this.DrillFilterLevel = this.parseChartData.DrillFilterLevel
//               this.summaryService.updatelookUpData(this.parseChartData)
//               console.log('this.parsedResBody checking',this.parsedResBody)
              
              
          
//               // Display SweetAlert success message
//               // Swal.fire({
//               //   title: 'Success!',
//               //   text: 'Lambda function triggered successfully.',
//               //   icon: 'success',
//               //   confirmButtonText: 'OK'
//               // });
        
//               // Proceed with route parameter handling
    
        
//        // Reset loading state
  
//        this.spinner.hide('dataProcess' + index);
//             },
//             (error: any) => {
//               console.error('Error triggering Lambda function:', error);
        
//               // Display SweetAlert error message
//               Swal.fire({
//                 title: 'Error!',
//                 text: 'Failed to trigger the Lambda function. Please try again.',
//                 icon: 'error',
//                 confirmButtonText: 'OK'
//               });
//        // Reset loading state
//             }
//           );

//   }else if (this.DrillFilterLevel==1){
//     console.log('i am on level1',this.DrillFilterLevel)

//     this.enableDrillButton = false
  
//   }


  
//       // Emit the cell info if needed
//       // this.sendCellInfo.emit(event);
  

// }



toggleCheck(isChecked: boolean, index: any) {
  this.counter =0; 
  this.isChecked = isChecked;
  console.log('this.isChecked checking', this.isChecked);
  console.log('this.storeDrillFilter checking from initial', this.storeDrillFilter);
  console.log('this.DrillFilterLevel checking from initial', this.DrillFilterLevel);

  // Proceed with logic only if DrillFilterLevel is not 1
  // if (this.DrillFilterLevel !== 1) {
    if (this.storeDrillFilter !== undefined && this.storeDrillFilter !== '' && 
        this.DrillFilterLevel !== undefined && this.DrillFilterLevel !== '') {
      
      this.enableDrillButton = true; // Enable the drill button
      this.spinner.show('dataProcess' + index);

      const chartConfig = JSON.parse(this.item.chartConfig);
      console.log('chartConfig check from chart UI', chartConfig);
      const extractcolumnVisibility = chartConfig;
      
      this.formTableConfig = {
        columnVisibility: extractcolumnVisibility,
        formName: this.item.chartConfig.formlist
      };

      
      const apiUrl = 'https://1vbfzdjly6.execute-api.ap-south-1.amazonaws.com/stage1';
      
      const requestBody = {
        body: JSON.stringify({
          clientId: this.SK_clientID,
          routeId: this.routeId,
          widgetId: this.item.id,
          MsgType: 'DrillDown',
          permissionId: this.permissionIdRequest,
          permissionList: this.readFilterEquation,
          userName: this.userdetails,
          conditions: this.eventFilterConditions || [],
          ChartClick: this.isChecked,
          DrillFilter: this.storeDrillFilter || '',
          DrillFilterLevel: this.DrillFilterLevel || '',
          MainFilter:this.mainFilterCon ||''
        }),
      };

      console.log('requestBody checking chart1Drilldown from button click', requestBody);

      this.http.post(apiUrl, requestBody).subscribe(
        (response: any) => {
          console.log('Lambda function triggered successfully:', response);
          this.checkResBody = response.body;
          console.log('this.checkResBody', this.checkResBody);
          
          const storeparsedResBody = JSON.parse(this.checkResBody);
          this.parseChartData = JSON.parse(storeparsedResBody.ChartData);
          console.log('this.parseChartDatav checking', this.parseChartData);
          
          this.storeDrillFilter = this.parseChartData.DrillFilter;
          this.DrillFilterLevel = this.parseChartData.DrillFilterLevel;
          this.summaryService.updatelookUpData(this.parseChartData);
          
          console.log('this.parsedResBody checking', this.parsedResBody);

          // After processing the data, disable the drill button
          if (this.DrillFilterLevel == 0) {
            console.log('I am on level 1, disabling drill button');
            this.enableDrillButton = false;
          }

          // Hide spinner once done
          this.spinner.hide('dataProcess' + index);
        },
        (error: any) => {
          console.error('Error triggering Lambda function:', error);

          Swal.fire({
            title: 'Error!',
            text: 'Failed to trigger the Lambda function. Please try again.',
            icon: 'error',
            confirmButtonText: 'OK'
          });

          this.spinner.hide('dataProcess' + index); // Reset loading state
        }
      );
    }
 else {
    // If DrillFilterLevel is 1, disable the drill button immediately
    console.log('I am on level 1, disabling drill button');
    // this.enableDrillButton = false;
  }
}


onBarClick(event: Highcharts.PointClickEventObject,index:any): void {
  console.log('event check for donut chart', event);

if(this.isEditModeView==true){
  this.enableDrillButton = true
  console.log('i am in editmode',this.isEditModeView)
  this.spinner.show('dataProcess' + index);
  console.log('Bar clicked:', {
    category: event.point.category,
    name: event.point.name,
    value: event.point.y,
    colorIndex: event.point.colorIndex
  });

  const pointData = {
    name: event.point.name,
    value: event.point.y,
    customIndex: (event.point.options as CustomPointOptions).customIndex,
    colorIndex: event.point.colorIndex
  };

  console.log('pointData checking column chart', pointData);
  
  // Get chart config and storeDrillConfig
  const chartConfig = JSON.parse(this.item.chartConfig);
  console.log('chartConfig check from chart ui', chartConfig);
  const extractcolumnVisibility = chartConfig;

  this.formTableConfig = {
    columnVisibility: extractcolumnVisibility,
    formName: this.item.chartConfig.formlist
  };

  console.log('this.formTableConfig checking from ui', this.formTableConfig);

  this.storeDrillConfig = JSON.parse(this.item.DrillConfig);
  console.log('this.storeDrillConfig checking', this.storeDrillConfig);
  const storeconditionsLength = this.storeDrillConfig[0]?.conditions.length



  // // Check the index of the clicked bar and control the logic
  // const currentConditionIndex = this.storeDrillConfig[0]?.conditions.findIndex((condition: { drillTypeFields: string | number; }) => {
  //   return condition.drillTypeFields === event.point.category; // Assuming 'category' matches drillTypeFields
  // });
  

  // if (currentConditionIndex === 0) {
  //   console.log('First bar clicked, no action triggered');
  //   // Do not emit if it's the first bar click
  //   return;
  // }

console.log('storeconditionsLength checking',storeconditionsLength)
console.log('this.counter checking',this.counter)
  if (storeconditionsLength === this.counter || storeconditionsLength === undefined) {
    console.log('storeconditionsLength checking from donut',storeconditionsLength)
    console.log('this.counter checking from donut',this.counter)
    console.log('Emitting action, either conditions are empty or second bar clicked');
    console.log('this.formTableConfig checking from donut',this.formTableConfig)
    console.log('this.formTableConfig checking from donut', this.formTableConfig);
    console.log('access columnVisibility',this.formTableConfig.columnVisibility);
    const storeObject = this.formTableConfig.columnVisibility
    const storeColumnVisibility:any =this.formTableConfig.columnVisibility[0]
    console.log('storeColumnVisibility checking',storeColumnVisibility)
   const columnVisibility = storeColumnVisibility?.columnVisibility || [];
   console.log('columnVisibility check from donut',columnVisibility)
   if (!columnVisibility.length) {
    // Show SweetAlert with the updated message if columnVisibility is empty or undefined
    Swal.fire({
        icon: 'warning',
        title: 'Final Stage',
        text: 'columnVisibility is not configured.',
        confirmButtonText: 'OK'
    });
    this.counter--; 
} 
else {
    // Proceed with emitting events if columnVisibility is valid
    this.emitChartConfigTable.emit(this.formTableConfig);
    this.sendCellInfo.emit(event);
    this.counter--; 





    const apiUrl = 'https://1vbfzdjly6.execute-api.ap-south-1.amazonaws.com/stage1';
  
    const requestBody = {
      body: JSON.stringify({
        clientId: this.SK_clientID,
        routeId: this.routeId,
        widgetId: this.item.id,
        chartData: pointData,
        MsgType: 'DrillDown',
        permissionId: this.permissionIdRequest,
        permissionList: this.readFilterEquation,
        userName: this.userdetails,
        conditions: this.eventFilterConditions || [],
        DrillFilter: this.storeDrillFilter || '',
        DrillFilterLevel: this.DrillFilterLevel || '',
        MainFilter:this.mainFilterCon ||''
      }),
    };
  
    console.log('requestBody checking chart1Drilldown data Table', requestBody);
  
    // Send a POST request to the Lambda function
    this.http.post(apiUrl, requestBody).subscribe(
      (response: any) => {
          if (response?.statusCode === 200) {
              console.log('Lambda function triggered successfully chart1 drilldown', response);
              this.checkResBody = response.body;
              this.parsedResBody.push(JSON.parse(this.checkResBody));
              console.log('this.parsedResBody checking', this.parsedResBody);
  
              this.parsedResBody.forEach((item, index) => {
                  if (Object.keys(item).includes('ChartData')) {
                      this.parseChartData = JSON.parse(item.ChartData);
                      console.log(`this.parseChartDatav checking at index ${index}`, this.parseChartData);
                      this.storeDrillFilter = this.parseChartData.DrillFilter;
                      this.DrillFilterLevel = this.parseChartData.DrillFilterLevel;
  
                      // this.summaryService.updatelookUpData(this.parseChartData);
                  } else {
                      this.processedData = JSON.parse(item.rowdata);
                      console.log(`this.processedData check at index ${index}`, this.processedData);
                      this.paresdDataEmit.emit(this.processedData);
                  }
          
              });
              // Hide the spinner after API processing
              this.spinner.hide('dataProcess' + index);
          } else {
              // Hide the spinner in case of an error
              this.spinner.hide('dataProcess' + index);
              console.error('Unexpected statusCode:', response?.statusCode);
              Swal.fire({
                  title: 'Error!',
                  text: `Unexpected response received (Status Code: ${response?.statusCode}).`,
                  icon: 'error',
                  confirmButtonText: 'OK'
              });
          }
      },
      (error: any) => {
          // Hide the spinner if there's an error
          this.spinner.hide('dataProcess' + index);
          console.error('Error triggering Lambda function:', error);
  
          if (error.status === 404) {
              console.log('Received 404 error - stopping loading and showing error message.');
              Swal.fire({
                  title: 'Error!',
                  text: 'Data not found. Please check your inputs and try again.',
                  icon: 'error',
                  confirmButtonText: 'OK'
              });
          } else {
              Swal.fire({
                  title: 'Error!',
                  text: 'Failed to trigger the Lambda function. Please try again.',
                  icon: 'error',
                  confirmButtonText: 'OK'
              });
          }
      }
  );
}


    // this.emitChartConfigTable.emit(this.formTableConfig);
    // this.sendCellInfo.emit(event);
    // this.counter--; 
}



const apiUrl = 'https://1vbfzdjly6.execute-api.ap-south-1.amazonaws.com/stage1';
  
const requestBody = {
  body: JSON.stringify({
    clientId: this.SK_clientID,
    routeId: this.routeId,
    widgetId: this.item.id,
    chartData: pointData,
    MsgType: 'DrillDown',
    permissionId: this.permissionIdRequest,
    permissionList: this.readFilterEquation,
    userName: this.userdetails,
    conditions: this.eventFilterConditions || [],
    DrillFilter: this.storeDrillFilter || '',
    DrillFilterLevel: this.DrillFilterLevel || '',
    MainFilter:this.mainFilterCon ||''
  }),
};

console.log('requestBody checking chart1Drilldown', requestBody);

// Send a POST request to the Lambda function
this.http.post(apiUrl, requestBody).subscribe(
  (response: any) => {
      if (response?.statusCode === 200) {
          console.log('Lambda function triggered successfully chart1 drilldown', response);
          this.checkResBody = response.body;
          this.parsedResBody.push(JSON.parse(this.checkResBody));
          console.log('this.parsedResBody checking', this.parsedResBody);

          this.parsedResBody.forEach((item, index) => {
              if (Object.keys(item).includes('ChartData')) {
                  this.parseChartData = JSON.parse(item.ChartData);
                  console.log(`this.parseChartDatav checking at index ${index}`, this.parseChartData);
                  this.storeDrillFilter = this.parseChartData.DrillFilter;
                  this.DrillFilterLevel = this.parseChartData.DrillFilterLevel;

                  

                  this.summaryService.updatelookUpData(this.parseChartData);
              } 
              // else {
              //     this.processedData = JSON.parse(item.rowdata);
              //     console.log(`this.processedData check at index ${index}`, this.processedData);
              //     this.paresdDataEmit.emit(this.processedData);
              // }
      
          });
          // Hide the spinner after API processing
          setTimeout(() => {
            this.spinner.hide('dataProcess' + index);
            
          }, 2000);
   
      } else {
          // Hide the spinner in case of an error
          this.spinner.hide('dataProcess' + index);
          console.error('Unexpected statusCode:', response?.statusCode);
          Swal.fire({
              title: 'Error!',
              text: `Unexpected response received (Status Code: ${response?.statusCode}).`,
              icon: 'error',
              confirmButtonText: 'OK'
          });
      }
  },
  (error: any) => {
      // Hide the spinner if there's an error
      this.spinner.hide('dataProcess' + index);
      console.error('Error triggering Lambda function:', error);

      if (error.status === 404) {
          console.log('Received 404 error - stopping loading and showing error message.');
          Swal.fire({
              title: 'Error!',
              text: 'Data not found. Please check your inputs and try again.',
              icon: 'error',
              confirmButtonText: 'OK'
          });
      } else {
          Swal.fire({
              title: 'Error!',
              text: 'Failed to trigger the Lambda function. Please try again.',
              icon: 'error',
              confirmButtonText: 'OK'
          });
      }
  }
);


if(storeconditionsLength === undefined){
      this.enableDrillButton = false

}

  // Proceed with API request


  // Emit the cell info if needed

  this.counter++

}



}

  parseChartOptions(arg0: string, parseChartOptions: any) {
    throw new Error('Method not implemented.');
  }

  ngAfterViewInit(){
    setTimeout(() => {
      this.createPieChart()
    }, 1000);

  

  }
  @Input() item:any
  @Input() index:any
  @Input() chartIndex:any

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

    this.summaryService.lookUpData$.subscribe((data: any) => {
      console.log('data check from chart3', data);
    
      let tempCharts: any[] = [];
    
      // If data is not an array, convert it into an array to ensure we can use forEach
      const dataArray = Array.isArray(data) ? data : [data];
    
      // Loop through the data array
      dataArray.forEach((packet: any, matchedIndex: number) => {
        // console.log('packet:', packet); // Log each packet to ensure it is as expected
    
        // If data is a single item, skip the check for this.index == matchedIndex
        if (packet.grid_type == 'chart' && packet.id === this.item.id) {
          if (dataArray.length > 1) {
            // For multiple data, match the index as well
            if (this.index == matchedIndex) {
              tempCharts[matchedIndex] = packet;
              setTimeout(() => {
                this.createPieChart(packet);
              }, 1500);
            }
          } else {
            // For single data, do not check index, just use the packet
            tempCharts[0] = packet;
            setTimeout(() => {
              this.createPieChart(packet);
            }, 1500);
          }
        }
      });
    });



    this.summaryService.queryParamsData$.subscribe((data: any)=>{
      console.log('data check filterConditions',data)
      if (data) {
        console.log('data checking from chart1', data);
      
        // Extract indexed data (all indexes) and assign to eventFilterConditions
        this.eventFilterConditions = [];
        for (let key in data) {
          if (Array.isArray(data[key])) {
            this.eventFilterConditions.push(data[key]);
          }
        }
      
        // Extract non-indexed data and assign to mainFilterCon
        const { dateType, daysAgo, startDate, endDate, singleDate } = data;
        this.mainFilterCon = {
          dateType,
          daysAgo,
          startDate,
          endDate,
          singleDate
        };
      
        console.log('Indexed conditions assigned to eventFilterConditions', this.eventFilterConditions);
        console.log('Non-indexed conditions assigned to mainFilterCon', this.mainFilterCon);
      }
      
      
      
    
      
      
    })
    this.updateDrillButtonState();
    this.detectScreenSize()
  }

  
  createPieChart(chartdata?:any) {

    console.log(' Initializing Pie Chart for ', chartdata);
    if(chartdata){
      const chartOptionsCopy = JSON.parse(chartdata.highchartsOptionsJson);
      console.log('data check from initialiaze',chartOptionsCopy)
      const readOptions = chartOptionsCopy; // Use chartOptionsCopy directly
      console.log('readOptions checking from chart1', readOptions);
      readOptions.series = readOptions.series.map((series: any) => {
        return {
          ...series,
          data: series.data.map((point: any, index: number) => ({
            name: point.name,         // Directly access the name property
            y: point.y,               // Directly access the y property (value)
            customIndex: index,       // Custom index for the point
            selected: point.selected, // Directly access the selected property
            sliced: point.sliced,  
            events: {
              click: (event: Highcharts.PointClickEventObject) => this.onBarClick(event,this.index),
            },
          })),
        };
      });
    
      // Initialize the Highcharts pie chart
      Highcharts.chart(`pieChart${this.index + 1}`, readOptions);

    }
    else {
      // Declare or ensure a per-chart control map
      if (!this.isBarClickableMap) this.isBarClickableMap = {};
      this.isBarClickableMap[this.index] = true; // Initialize clickable flag
    
      // Create a deep copy of the original chart options
      const chartOptionsCopy = JSON.parse(this.item.highchartsOptionsJson);
      console.log('chartOptionsCopy with preserved properties:', chartOptionsCopy);
    
      const readOptions = chartOptionsCopy;
      console.log('readOptions checking from chart1', readOptions);
    
      // Modify the series data
      readOptions.series = readOptions.series.map((series: any) => {
        console.log('readOptions.series checking', readOptions.series);
        return {
          ...series,
          data: series.data.map((point: any, index: number) => ({
            name: point.name,
            y: point.y,
            customIndex: index,
            selected: point.selected,
            sliced: point.sliced,
            events: {
              click: (event: Highcharts.PointClickEventObject) => {
                if (!this.isBarClickableMap[this.index]) return;
    
                this.isBarClickableMap[this.index] = false; // Disable further clicks temporarily
                this.onBarClick(event, this.index);
    
                setTimeout(() => {
                  this.isBarClickableMap[this.index] = true; // Re-enable after 1 second
                }, 1000); // Adjust delay if needed
              },
            },
          })),
        };
      });
    
      // Initialize the chart
      Highcharts.chart(`pieChart${this.index + 1}`, chartOptionsCopy);
    }
    
    

    // Ensure that each chart gets a unique copy of the options

}

  
  get shouldShowButton(): boolean {
    return this.item.dashboardIds !== "";
  }

  
    constructor(
     private modalService: NgbModal,private router: Router,private sanitizer: DomSanitizer,private http: HttpClient,private summaryService:SummaryEngineService,private spinner: NgxSpinnerService,private route: ActivatedRoute,private pageInfoService: PageInfoService
     
    ){}

    helperDashboard(item: any, index: any, modalContent: any, selectType: any, ModuleNames: any, receiveModal: any) {
      console.log('selectType checking dashboard', selectType);
      console.log('item checking from', item);
      console.log('ModuleNames:', ModuleNames);
    
      this.route.queryParams.subscribe((params) => {
        if (params['uID']) this.userId = params['uID'];
        if (params['pass']) this.userPass = params['pass'];
      });
    
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
    
        // ✅ Updated logic for 'NewTab'
        if (selectType === 'NewTab') {
          const rawUrl = (this.iframeUrl as any)?.changingThisBreaksApplicationSecurity || window.location.origin + fullUrl;
    console.log('this.iframeUrl checking from chartui1',this.iframeUrl)
          if (this.userId && this.userPass) {
            this.iframeSafeUrl = rawUrl;
    
            this.modalService.open(receiveModal, {
              fullscreen: true,
              modalDialogClass: 'p-9',
              centered: true,
              backdrop: 'static',
              keyboard: false
            });
          } else {
            window.open(rawUrl, '_blank');
          }
    
        } else if (selectType === 'Modal') {
          this.modalService.open(modalContent, { size: 'xl' });
    
        } else if (selectType === 'Same page Redirect') {
          setTimeout(() => {
            this.pageInfoService.setTitle(( modulePath as any))
          }, 500);
          this.router.navigateByUrl(fullUrl).catch(err => console.error('Navigation error:', err));
        }
    
      } else if (selectType && ModuleNames !== 'Summary Dashboard') {
        // ✅ General redirect for other modules
        this.redirectModule(item, this.htmlModal);
      }
    }
    
    
    
    SECRET_KEY = 'mobile-encrypt-params-123';
    redirectModule(receiveItem: any, htmlModalRef: any) {
      const moduleName = receiveItem.dashboardIds;
      const selectedModule = receiveItem.ModuleNames;
      const redirectType = receiveItem.selectType; // 'NewTab' or 'Same page Redirect'
      const filterDescriptionAccess = receiveItem.filterDescription;
      const formattedCondition = this.formatConditions(filterDescriptionAccess);
    
      this.route.queryParams.subscribe((params) => {
        if (params['uID']) this.userId = params['uID'];
        if (params['pass']) this.userPass = params['pass'];
      });
    
      const isNewTab = redirectType === 'NewTab';
      const encodedCondition = encodeURIComponent(formattedCondition);
      const encryptedUserId = this.userId ? this.encryptValue(this.userId) : '';
      const encryptedPass = this.userPass ? this.encryptValue(this.userPass) : '';
    
      const queryString = `isFullScreen=true` +
        (encryptedUserId ? `&uID=${encodeURIComponent(encryptedUserId)}` : '') +
        (encryptedPass ? `&pass=${encodeURIComponent(encryptedPass)}` : '');
    
      let baseUrl = '';
    
      switch (selectedModule) {
        case 'Forms':
          baseUrl = `/view-dreamboard/Forms/${moduleName}&filter=${encodedCondition}`;
          break;
    
        case 'Summary Dashboard':
          baseUrl = `/summary-engine/${moduleName}`;
          break;
    
        case 'Dashboard':
          baseUrl = `/dashboard/dashboardFrom/Forms/${moduleName}`;
          break;
    
        case 'Projects':
          baseUrl = `/project-dashboard/project-template-dashboard/${moduleName}`;
          break;
    
        case 'Calender':
          baseUrl = `/view-dreamboard/Calendar/${moduleName}`;
          break;
    
        case 'Report Studio': {
          const tree = this.router.createUrlTree(['/reportStudio'], {
            queryParams: { savedQuery: moduleName }
          });
          baseUrl = this.router.serializeUrl(tree);
          break;
        }
    
        default:
          console.error('Unknown module:', selectedModule);
          return;
      }
    
      // ✅ Append queryString to baseUrl properly
    //   let targetUrl = baseUrl.includes('?')
    //     ? `${baseUrl}&${queryString}`
    //     : `${baseUrl}?${queryString}`;
    // console.log('targetUrl checking from module redirect',targetUrl)
    const targetUrl = `${baseUrl}?${queryString}`;
    console.log('targetUrl checking from module redirect', targetUrl);
      // ✅ Redirection behavior
      if (isNewTab) {
        if (this.userId && this.userPass) {
          this.iframeSafeUrl = targetUrl;
          this.emitIframeUrlCharts.emit(this.iframeSafeUrl);

          this.modalService.open(htmlModalRef, {
            fullscreen: true,
            modalDialogClass: 'p-9',
            centered: true,
            backdrop: 'static',
            keyboard: false
          });
        } else {
          window.open(targetUrl, '_blank');
        }
      } else {
        this.router.navigateByUrl(targetUrl).catch(err =>
          console.error('Navigation error:', err)
        );
      }
    }




formatConditions(expression: string | undefined | null): string {
  if (!expression || typeof expression !== 'string') {
    return '';
  }

  const regex = /([a-zA-Z0-9_ ]+)-\$\{([a-zA-Z0-9_-]+)\}/g;

  return expression
    .replace(regex, (_match, label, value) => {
      return `\${${label.trim()}.${value}}`;
    })
    .replace(/(\s*)(\&\&|\|\|)(\s*)/g, ' $2 ');
}

  closeModal() {
    this.modalService.dismissAll(); // Close the modal programmatically
  }
  detectScreenSize() {
    this.isMobile = window.innerWidth <= 760; // Adjust breakpoint as needed
    // if (this.isMobile)
      // alert(`${this.mobileChartWidth}, 'X',${this.mobileChartHeight}`)
  }
  homeCheck(isChecked: boolean,index:any) {
    this.counter =0; 
  
    this.isHomeChecked = isChecked;
    console.log('this.isChecked checking', this.isHomeChecked);

    console.log('this.DrillFilterLevel from home button',this.DrillFilterLevel)
    console.log('this.storeDrillFilter from home button',this.storeDrillFilter)

    if(this.storeDrillFilter !== undefined && this.storeDrillFilter !== '' && 
      this.DrillFilterLevel !== undefined && this.DrillFilterLevel !== ''){
        this.spinner.show('dataProcess' + index);

        const chartConfig =JSON.parse(this.item.chartConfig)
        console.log('chartConfig check from chart ui',chartConfig)
        const extractcolumnVisibility = chartConfig
        
            this.formTableConfig = {
              columnVisibility:extractcolumnVisibility,
              formName:this.item.chartConfig.formlist
              }
      
              // this.emitChartConfigTable.emit(this.formTableConfig); 
        
        
              // Define the API Gateway URL
              const apiUrl = 'https://1vbfzdjly6.execute-api.ap-south-1.amazonaws.com/stage1';
            
              // Prepare the request body
              const requestBody = {
                body: JSON.stringify({
                  clientId: this.SK_clientID,
                  routeId: this.routeId,
                  widgetId:this.item.id,
           
                  MsgType:'DrillDown',
                  permissionId:this.permissionIdRequest,
                  permissionList:this.readFilterEquation,
                  userName:this.userdetails,
                  conditions:this.eventFilterConditions ||[],
                  chartHomeClick:this.isHomeChecked,
                         DrillFilter:this.storeDrillFilter ||'',
              DrillFilterLevel:this.DrillFilterLevel ||'',
              MainFilter:this.mainFilterCon ||''
                }),
              };
            
              console.log('requestBody checking chart1Drilldown from button click', requestBody);
            
              // Send a POST request to the Lambda function with the body
              this.http.post(apiUrl, requestBody).subscribe(
                (response: any) => {
                  console.log('Lambda function triggered successfully:', response);
                  this.checkResBody = response.body
                  console.log('this.checkResBody',this.checkResBody)
                  const storeparsedResBody=JSON.parse(this.checkResBody)
    
    
    
                  this.parseChartData = JSON.parse(storeparsedResBody.ChartData)
                  console.log('this.parseChartDatav checking from toggle',this.parseChartData)
                  this.storeDrillFilter = this.parseChartData.DrillFilter,
                  this.DrillFilterLevel = this.parseChartData.DrillFilterLevel
                  this.summaryService.updatelookUpData(this.parseChartData)
                  console.log('this.parsedResBody checking',this.parsedResBody)

                  if (this.DrillFilterLevel == 0) {
                    console.log('I am on level 1, disabling drill button');
                    this.enableDrillButton = false;
                  }
                  // this.processedData = JSON.parse(this.parsedResBody.rowdata)
                  // console.log('this.processedData check',this.processedData)
                  // this.paresdDataEmit.emit(this.processedData); 
                  
                  
              
                  // Display SweetAlert success message
                  // Swal.fire({
                  //   title: 'Success!',
                  //   text: 'Lambda function triggered successfully.',
                  //   icon: 'success',
                  //   confirmButtonText: 'OK'
                  // });
            
                  // Proceed with route parameter handling
        
            
           // Reset loading state
    
    
           this.spinner.hide('dataProcess' + index);
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
            // this.sendCellInfo.emit(event);
        

      }

  }
  encryptValue(value: string): string {
    return encodeURIComponent(CryptoJS.AES.encrypt(value, this.SECRET_KEY).toString());
  }
  
  // ✅ Decryption (if needed on receiving side)
  decryptValue(encryptedValue: string): string {
    const bytes = CryptoJS.AES.decrypt(decodeURIComponent(encryptedValue), this.SECRET_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  }
  

}
