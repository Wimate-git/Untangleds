import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import Highcharts from 'highcharts';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { SummaryEngineService } from 'src/app/pages/summary-engine/summary-engine.service';
import { NgxSpinnerService } from 'ngx-spinner';
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
  @Input() permissionIdRequest:any
  @Input() readFilterEquation:any
  @Input() userdetails:any
  @Input () summaryDashboardView :any
  @Input() summaryDashboardUpdate:any;
  @Input() eventFilterConditions : any
  
  checkResBody: any;
  parsedResBody: any[]=[];
  processedData: any;
  @Output() paresdDataEmit = new EventEmitter<any>();
  @Output() emitChartConfigTable = new EventEmitter<any>();
  formTableConfig: { columnVisibility: any; formName: any; };
  isMobile: boolean = false;
  mobileChartWidth: number = window.innerWidth * 0.85;  // Custom mobile width
  mobileChartHeight: number = window.innerWidth * 0.87; 
  iframeUrl: any;
  selectedMarkerIndex: any;
  tile1Config: any;
  isChecked: boolean = false; // Initial state is false
  isHomeChecked:boolean = false;
  parseChartData: any;
  storeDrillFilter: any;
  DrillFilterLevel: any;
  storeDrillConfig: any;
  counter: number=0;
  isLoading = false;
  storeDrillPacket: any;
  storeRedirectionCheck: any;
  isDrillPacketAvailable: any;
  disable: boolean = false;
  toggleCheck(isChecked: boolean,index:any) {
    this.isChecked = isChecked;
    console.log('this.isChecked checking', this.isChecked);
    console.log('this.storeDrillFilter  checking from initial',this.storeDrillFilter )
    console.log('this.DrillFilterLevel checking from initial',this.DrillFilterLevel)
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
                ChartClick:this.isChecked,
                       DrillFilter:this.storeDrillFilter ||'',
            DrillFilterLevel:this.DrillFilterLevel ||''
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
                console.log('this.parseChartDatav checking',this.parseChartData)
                this.storeDrillFilter = this.parseChartData.DrillFilter,
                this.DrillFilterLevel = this.parseChartData.DrillFilterLevel
                this.summaryService.updatelookUpData(this.parseChartData)
                console.log('this.parsedResBody checking',this.parsedResBody)
                
                
            
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
  
    }
  
  
    
        // Emit the cell info if needed
        // this.sendCellInfo.emit(event);
    
  
  }

  homeCheck(isChecked: boolean,index:any) {
  
    this.isHomeChecked = isChecked;
    console.log('this.isChecked checking', this.isHomeChecked);


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
              this.counter=0
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
              DrillFilterLevel:this.DrillFilterLevel ||''
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


  ngOnChanges(changes: SimpleChanges): void {
    console.log('dashboardChange dynamic ui',this.all_Packet_store)
 
      console.log("check chart3 data",this.item)
      this.storeDrillPacket = JSON.parse(this.item.DrillConfig)
      console.log('this.storeDrillPacket checking',this.storeDrillPacket)
          // Check if storeDrillPacket is not empty
    this.isDrillPacketAvailable = this.storeDrillPacket && this.storeDrillPacket.length > 0;


      console.log('this.storeDrillPacket checking',this.storeDrillPacket )
      this.storeRedirectionCheck = this.item.toggleCheck
      console.log('liveDataColumnChart check',this.liveDataColumnChart)
      console.log('eventFilterConditions chart ui1',this.eventFilterConditions)
      console.log('this.storeDrillFilter checking',this.storeDrillFilter)
      // this.parseChartOptions = this.item.highchartsOptionsJson;
      // console.log('this.parseChartOptions checking',this.parseChartOptions)
      // const check = JSON.parse(this.parseChartOptions);
      // console.log('check parsed data',check)
      // this.extractSeries = check.series[0].name
      // console.log('this.extractSeries',this.extractSeries)
    //   if (this.all_Packet_store?.LiveDashboard === true ||(this.all_Packet_store?.grid_details &&
    //     this.all_Packet_store.grid_details.some((packet: { grid_type: string; }) => packet.grid_type === "filterTile"))) {
    //     console.log("✅ LiveDashboard is TRUE - Updating highchartsOptionsJson & chartConfig...");
    
    //     if (this.item && this.liveDataColumnChart && Array.isArray(this.liveDataColumnChart)) {
    //         // Find the matching packet from this.liveDataChart based on id
    //         const matchingLiveChart = this.liveDataColumnChart.find(liveChart => liveChart.id === this.item.id);
    
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
             
    //           } catch (error) {
    //             console.error('Error parsing JSON:', error);
    //           }
    //         } else {
    //           // If it's already an object, assign it directly
    //           this.chartOptions = this.item.highchartsOptionsJson;
    //           console.log('this.chartOptions from column', this.chartOptions);
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
         
    //       } catch (error) {
    //         console.error('Error parsing JSON:', error);
    //       }
    //     } else {
    //       // If it's already an object, assign it directly
    //       this.chartOptions = this.item.highchartsOptionsJson;
    //       console.log('this.chartOptions from column', this.chartOptions);
    //     }
        
  
    //     if (typeof this.item.chartConfig === 'string') {
    //       this.gridOptions = JSON.parse(this.item.chartConfig);
    //     } else {
    //       this.gridOptions = this.item.chartConfig; // Already an object
    //     }
    //     // Do nothing, retain the existing this.item as is
    // }




      
      // console.log('this.gridOptions check', this.gridOptions);
     
      // this.chartOptions.series = this.chartOptions.series.map((series: any) => {
      //   return {
      //     ...series,
      //     data: series.data.map((value: any, index: number) => ({
      //       y: value, 
      //       name: series.name, 
      //       customIndex: index, 
      //       events: {
      //         click: (event: Highcharts.PointClickEventObject) => this.onBarClick(event),
      //       },
      //     })),
      //   };
      // });
     
      this.tile1Config = this.item;
    
  }
  constructor(
    private modalService: NgbModal,private router: Router,private sanitizer: DomSanitizer,private http: HttpClient,private summaryService:SummaryEngineService,private spinner: NgxSpinnerService,private cdr: ChangeDetectorRef
    
   ){}

   onBarClick(event: Highcharts.PointClickEventObject, index: any): void {
    console.log('index checking from toggle', index);

    if(this.isEditModeView==true){


      this.spinner.show('dataProcess' + index);

      console.log('event check for column chart', event);
      console.log('Bar clicked:', {
          category: event.point.category,
          value: event.point.y,
          colorIndex: event.point.colorIndex
      });
  
      const pointData = {
          name: event.point.category,
          value: event.point.y,
          customIndex: (event.point.options as CustomPointOptions).customIndex, 
          colorIndex: event.point.colorIndex
      };
  
      console.log('pointData checking column chart', pointData);
      const chartConfig = JSON.parse(this.item.chartConfig);
      console.log('chartConfig check from chart ui', chartConfig);
  
      this.cdr.detectChanges();
      console.log('this.isLoading checking', this.isLoading);
  
      const extractcolumnVisibility = chartConfig;
  
      this.formTableConfig = {
          columnVisibility: extractcolumnVisibility,
          formName: this.item.chartConfig.formlist
      };
  
      this.storeDrillConfig = JSON.parse(this.item.DrillConfig);
      console.log('this.storeDrillConfig checking', this.storeDrillConfig);
  
      const storeconditionsLength = this.storeDrillConfig[0]?.conditions.length;
      console.log('storeconditionsLength checking', storeconditionsLength);
      console.log('this.counter checking', this.counter);
  
      if (storeconditionsLength === this.counter || storeconditionsLength === undefined) {
          console.log('Emitting action, either conditions are empty or second bar clicked');
          
          // Emit action
          this.emitChartConfigTable.emit(this.formTableConfig);
          this.sendCellInfo.emit(event);
          this.counter = 0; // Reset counter after emitting
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
            DrillFilterLevel: this.DrillFilterLevel || ''
        }),
    };

    console.log('requestBody checking chart1Drilldown', requestBody);

    this.http.post(apiUrl, requestBody).subscribe(
        (response: any) => {
            if (response?.statusCode === 200) {
                console.log('Lambda function triggered successfully:', response);
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


      // Show the spinner while API is processing

      // Once the request is finished, hide the spinner
  
      this.counter++;
    }

    // Show the spinner for the specific index

}



  
  ngAfterViewInit(){
    setTimeout(() => {
      this.createColumnChart()
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

  detectScreenSize() {
    this.isMobile = window.innerWidth <= 760; // Adjust breakpoint as needed
    // if (this.isMobile)
      // alert(`${this.mobileChartWidth}, 'X',${this.mobileChartHeight}`)
  }

  // createBarChart() {

  //   console.log('culomnchart dynamic data check', this.chartOptions);
  

  //   // console.log()

  // }


  ngOnInit(){
    console.log('item chacke',this.item.grid_details)
    this.summaryService.lookUpData$.subscribe((data: any) => {
      console.log('data check from chart3', data);
    
      let tempCharts: any[] = [];
    
      // If data is not an array, convert it into an array to ensure we can use forEach
      const dataArray = Array.isArray(data) ? data : [data];
    
      // Loop through the data array
      dataArray.forEach((packet: any, matchedIndex: number) => {
        console.log('packet:', packet); // Log each packet to ensure it is as expected
    
        // If data is a single item, skip the check for this.index == matchedIndex
        if (packet.grid_type == 'Columnchart' && packet.id === this.item.id) {
          if (dataArray.length > 1) {
            // For multiple data, match the index as well
            if (this.index == matchedIndex) {
              tempCharts[matchedIndex] = packet;
              setTimeout(() => {
                this.createColumnChart(packet);
              }, 1000);
            }
          } else {
            // For single data, do not check index, just use the packet
            tempCharts[0] = packet;
            setTimeout(() => {
              this.createColumnChart(packet);
            }, 1000);
          }
        }
      });
    });
    
    



    this.summaryService.queryParamsData$.subscribe((data: any)=>{
      console.log('data check filterConditions',data)

if(data){
  this.eventFilterConditions = data
}
      
      
    
      
      
    })

    this.detectScreenSize()
  }
createColumnChart(columnChartData?:any){
  console.log('columnChartData check chartui3',columnChartData)
  if(columnChartData){

    const columnChartDataFormat = JSON.parse(columnChartData.highchartsOptionsJson)
    columnChartDataFormat.series = columnChartDataFormat.series.map((series: any) => {
      return {
        ...series,
        data: series.data.map((value: any, index: number) => ({
          y: value, // Data value
          name: series.name, // Series name (optional)
          customIndex: index, // Custom property to track index
          events: {
            click: (event: Highcharts.PointClickEventObject) => this.onBarClick(event,this.index),
          },
        })),
      };
    });
    Highcharts.chart(`Columnchart${this.index+1}`, columnChartDataFormat);
  }else{
   
    const columnChartDataFormat = JSON.parse(this.item.highchartsOptionsJson)
    console.log('columnChartDataFormat from else',columnChartDataFormat)
    columnChartDataFormat.series = columnChartDataFormat.series.map((series: any) => {
      return {
        ...series,
        data: series.data.map((value: any, index: number) => ({
          y: value, // Data value
          name: series.name, // Series name (optional)
          customIndex: index, // Custom property to track index
          events: {
            click: (event: Highcharts.PointClickEventObject) => this.onBarClick(event,this.index),
          },
        })),
      };
    });

    Highcharts.chart(`Columnchart${this.index+1}`, columnChartDataFormat);
  }


}

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

}
