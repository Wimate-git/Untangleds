import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import Highcharts from 'highcharts';

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
  ngOnChanges(changes: SimpleChanges): void {
    console.log('dashboardChange dynamic ui',this.all_Packet_store)
 
      console.log("DynamicLine chart",this.item)

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
      
      console.log('this.gridOptions check', this.gridOptions);
     

    
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

  createBarChart() {
    console.log('culomnchart dynamic data check', this.chartOptions);
  
    Highcharts.chart(`Columnchart${this.index+1}`, this.chartOptions);
  }
  

}
