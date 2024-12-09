import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
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
  tile1Config: any;
  selectedMarkerIndex: any;
  iframeUrl: any;
  @Input () hideButton:any
  ngOnChanges(changes: SimpleChanges): void {
 
      console.log("Dynamic",this.item)
      this.tile1Config = this.item

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
  get shouldShowButton(): boolean {
    return this.item.dashboardIds !== "";
  }
  
    constructor(
     private modalService: NgbModal,private router: Router,private sanitizer: DomSanitizer
     
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
