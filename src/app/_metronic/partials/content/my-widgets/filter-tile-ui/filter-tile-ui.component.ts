import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SummaryEngineService } from 'src/app/pages/summary-engine/summary-engine.service';

@Component({
  selector: 'app-filter-tile-ui',

  templateUrl: './filter-tile-ui.component.html',
  styleUrl: './filter-tile-ui.component.scss'
})
export class FilterTileUiComponent implements OnInit{
  @Input() item:any
  @Input() index:any
  @Input() isEditModeView:any;
  @Output() customEvent = new EventEmitter<{ arg1: any; arg2: number }>();
  @Output() customEvent1 = new EventEmitter<{ data: { arg1: any; arg2: number }; all_Packet_store: any }>();
  @Output() customEvent2 = new EventEmitter<{ data: { arg1: any; arg2: number }; all_Packet_store: any }>();

  // @Output() customEvent2 = new EventEmitter<{ arg1: any; arg2: number }>();
  @Input()  all_Packet_store: any;
  @Input () hideButton:any
  iframeUrl: any;
  selectedMarkerIndex: any;
  tile1Config: any;
  splitData: any;
  descriptionData: any;
  primaryValue: any;
  parsedTileConfig: any;
  tileConfig: any;
  tileTiltle: any;
  filterTileConfig: any;
  @Input() isFullscreen: boolean = false; 
  @Input () summaryDashboardView :any
  @Input() summaryDashboardUpdate:any;
  @Input() hidingLink:any;
  parsedFilterTileConfig: any;
  combinedArray: any;
  appliedFilter = false;
  formattedFilterConditions: string[];
  ngOnInit(){
    console.log('item chacke',this.item.grid_details)
    this.summaryService.lookUpData$.subscribe((data: any) => {
      console.log('data check>>> filter ui', data);
  
      // If data is present, consider the filter applied
      this.appliedFilter = data && data.length > 0;
  
      // Trigger change detection
      // this.cdRef.detectChanges();
    });

    

  }

  getCustomLabel(): string {
    let label = this.item.custom_Label || '';
  
    if (this.shouldApplyMessage()) {
      label += ' - Applied';
    } else {
      label += ' - All';
    }
  
    return label;
  }
  
  shouldApplyMessage(): boolean {
    return this.appliedFilter;
  }
  


  ngOnChanges(changes: SimpleChanges): void {
    console.log('dashboardChange dynamic ui',this.all_Packet_store)
 
    console.log("tile data check from dynamic Title",this.item)
    this.filterTileConfig = this.item
    console.log('this.filterTileConfig check',this.filterTileConfig)
    this.parsedFilterTileConfig =JSON.parse(this.filterTileConfig.filterTileConfig)
    console.log('this.parsedFilterTileConfig checking',this.parsedFilterTileConfig)
    
//     this.combinedArray = this.parsedFilterTileConfig.flatMap((item: any) => item);

// console.log('Combined Array:', this.combinedArray);
this.formattedFilterConditions = this.formatFilterConfig(this.parsedFilterTileConfig);
console.log('this.formattedFilterConditions check',this.formattedFilterConditions)
  
  

   
   
   
    
    // Split the description by '&&'
    // let conditions = description.split('&&').map((cond: string) => cond.trim());
    
    // // Iterate over each condition to extract values
    // let extractedValues: any[] = [];
    
    // conditions.forEach((condition: string) => {
    //   // Use regex to capture the value after "=="
    //   let regex = /\$\{[^\}]+\}==(['"]?)(.+?)\1/;
    //   let match = condition.match(regex);
      
    //   if (match) {
    //     let value = match[2].trim(); // Extract the value after ==
    //     extractedValues.push(value); // Store the extracted value
    //   }
    // });
    
    // Assign the first extracted value to descriptionData
    // if (extractedValues.length > 0) {
    //   this.descriptionData = extractedValues[0];
    //   console.log('this.descriptionData check', this.descriptionData);
    // } else {
    //   this.primaryValue = this.item.multi_value[0].value;
    // }
    
    // // Log all extracted values
    // console.log('Extracted Values:', extractedValues);
    





  
 

  
}




shouldShowNotAppliedMessage(): boolean {
  if (this.item.dateType === 'any') {
    return false; // If dateType is 'any', we don't show "Not Applied"
  }

  if (!this.parsedFilterTileConfig || !Array.isArray(this.parsedFilterTileConfig)) {
    return true; // If the parsed config is empty or not an array, consider it "Not Applied"
  }

  for (const subArray of this.parsedFilterTileConfig) {
    if (Array.isArray(subArray)) {
      for (const item of subArray) {
        if (item.filterValue && item.filterValue.trim() !== '') {
          return false; // If any valid filter is applied, don't show "Not Applied"
        }
      }
    }
  }

  return true; // If no filters have values, show "Not Applied"
}




get shouldShowButton(): boolean {
  return this.item.dashboardIds !== "";
}

  constructor(
   private modalService: NgbModal,private router: Router,private sanitizer: DomSanitizer,private summaryService:SummaryEngineService
   
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
   formatFilterConfig(parsedFilterTileConfig: any[]): string[] {
    // Initialize an array to hold the formatted strings for each condition
    const formattedConditions: any[] = [];

    // Iterate over each array of conditions
    parsedFilterTileConfig.forEach((conditions) => {
        // Map each condition to a formatted string
        const formattedGroup = conditions.map((condition: { formField: any; operator: any; filterValue: any; }) => {
            // Deconstruct necessary fields from the condition
            const { formField, operator, filterValue } = condition;

            // Return the formatted string
            return `${formField} ${operator} ${filterValue}`;
        }).join(' AND '); // Join all conditions within the same group with 'AND'

        // Push the formatted group string to the main array
        formattedConditions.push(formattedGroup);
    });

    return formattedConditions;
}

  

}
