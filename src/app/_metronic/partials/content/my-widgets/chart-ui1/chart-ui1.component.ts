import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import * as Highcharts from 'highcharts';

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
  ngOnChanges(changes: SimpleChanges): void {
 
      console.log("Dynamic",this.item)
      this.chartOptions = JSON.parse(this.item.highchartsOptionsJson)
      console.log('this.chartOptions',this.chartOptions)

      if (typeof this.item.chartConfig === 'string') {
        this.gridOptions = JSON.parse(this.item.chartConfig);
      } else {
        this.gridOptions = this.item.chartConfig; // Already an object
      }
      
      console.log('this.gridOptions check', this.gridOptions);
     

    
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
  @Output() customEvent1 = new EventEmitter<{ arg1: any; arg2: number }>();
  @Output() customEvent2 = new EventEmitter<{ arg1: any; arg2: number }>();

  edit_each_tileUI(value1: any,value2: number) {
    const data = { arg1: value1, arg2: value2 }; // Two arguments
    console.log('data checking from tile1',data)
  this.customEvent.emit(data); // Emitting an event with two arguments

  }
  edit_each_duplicate(value1: any,value2: number) {
    const data = { arg1: value1, arg2: value2 }; // Two arguments
  this.customEvent1.emit(data); // Emitting an event with two arguments

  }
  deleteTile(value1: any,value2: number) {
    const data = { arg1: value1, arg2: value2 }; // Two arguments
  this.customEvent2.emit(data); // Emitting an event with two arguments

  }
  ngOnInit(){
    console.log('item chacke',this.item.grid_details)
  }

  createPieChart() {

  
    Highcharts.chart(`pieChart${this.index+1}`, this.chartOptions);
  }
  


}
