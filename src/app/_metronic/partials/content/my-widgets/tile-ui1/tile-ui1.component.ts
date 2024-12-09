import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-tile-ui1',

  templateUrl: './tile-ui1.component.html',
  styleUrl: './tile-ui1.component.scss'
})
export class TileUi1Component implements OnInit{
  @Input() item:any
  @Input() index:any
  @Input() isEditModeView:any;
  @Output() customEvent = new EventEmitter<{ arg1: any; arg2: number }>();
  @Output() customEvent1 = new EventEmitter<{ arg1: any; arg2: number }>();
  @Output() customEvent2 = new EventEmitter<{ arg1: any; arg2: number }>();
  @Input () hideButton:any
  iframeUrl: any;
  selectedMarkerIndex: any;
  tile1Config: any;
  ngOnInit(): void {

    
  }


  ngOnChanges(changes: SimpleChanges): void {
 
    console.log("tile data check ",this.item)
    this.tile1Config = this.item

  
 

  
}
get shouldShowButton(): boolean {
  return this.item.dashboardIds !== "";
}

  constructor(
   private modalService: NgbModal,private router: Router,private sanitizer: DomSanitizer
   
  ){}

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
  helperDashboard(item:any,index:any,modalContent:any,selectType:any){
    const viewMode = true;
    const disableMenu = true



    localStorage.setItem('isFullScreen', JSON.stringify(true));
    const modulePath = item.dashboardIds; // Adjust with your module route
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
