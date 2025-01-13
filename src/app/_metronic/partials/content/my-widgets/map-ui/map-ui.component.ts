import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { GoogleMap, MapInfoWindow } from '@angular/google-maps';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-map-ui',

  templateUrl: './map-ui.component.html',
  styleUrl: './map-ui.component.scss'
})
export class MapUiComponent implements OnInit{

  @Input() item:any
  @Input() index:any
  @Input() isEditModeView:any;
  @Output() customEvent = new EventEmitter<{ arg1: any; arg2: number }>();
  @Output() customEvent1 = new EventEmitter<{ data: { arg1: any; arg2: number }; all_Packet_store: any }>();
  @Output() customEvent2 = new EventEmitter<{ data: { arg1: any; arg2: number }; all_Packet_store: any }>();

  // @Output() customEvent2 = new EventEmitter<{ arg1: any; arg2: number }>();
  @Input()  all_Packet_store: any;
  @Input () hideButton:any
  @Input() mapWidth:any
  @Input() mapHeight:any
    //  [chartHeight]="chartHeight[i]"  
    //                   [chartWidth]="chartWidth[i]"
  iframeUrl: any;
  selectedMarkerIndex: any;
  tile1Config: any;
  splitData: any;
  descriptionData: any;
  primaryValue: any;
  parsedTileConfig: any;
  tileConfig: any;
  tileTiltle: any;
  selectedMarker: any;
  @ViewChild(MapInfoWindow) infoWindow!: MapInfoWindow; // Reference the InfoWindow
  @ViewChild(GoogleMap) map!: GoogleMap;

  // center: google.maps.LatLngLiteral = { lat: 37.7749, lng: -122.4194 }; // Default location
  // markers = [
  //   { position: { lat: 37.7749, lng: -122.4194 }, title: 'San Francisco', label: 'A' },
  //   { position: { lat: 37.7849, lng: -122.4094 }, title: 'Nearby Location 1', label: 'B' },
  //   { position: { lat: 37.7649, lng: -122.4294 }, title: 'Nearby Location 2', label: 'C' }
  // ];
  parsedData: any;
  markers: any[];

  ngOnInit(): void {

    
  }


  ngOnChanges(changes: SimpleChanges): void {
    console.log('dashboardChange dynamic ui',this.all_Packet_store)
 
    console.log("tile data check from dynamic Title",this.item)
// Parse the MapConfig and log parsed data
this.parsedData = JSON.parse(this.item.MapConfig);
console.log('Parsed data check:', this.parsedData);

// Ensure parsedData is an array
if (Array.isArray(this.parsedData)) {
  console.log('Parsed data check:', this.parsedData);

  // Extract markers dynamically
  this.markers = this.parsedData
    .filter((packet: any) => packet.add_Markers && Array.isArray(packet.add_Markers)) // Ensure add_Markers exists
    .flatMap((packet: any) => {
      return packet.add_Markers.map((marker: any) => {
        const baseMarker = {
          position: {
            lat: parseFloat(marker.position.lat), // Convert latitude to number
            lng: parseFloat(marker.position.lng), // Convert longitude to number
          },
          title: marker.title || '', // Default to empty string if title is missing
          label: marker.label || '', // Default to empty string if label is missing
          mapType: packet.map_type || '', // Include map_type from parent packet
        };

        // Include marker_info only if packet label is "Track Location"
        if (packet.parameterName === "TrackLocation") {
          return { ...baseMarker, marker_info: marker.marker_info || {} };
        }

        return baseMarker;
      });
    });

  // Process markers to include mapType and scaled size
  this.markers = this.markers.map(marker => ({
      ...marker,
      mapType: {
        url: marker.mapType, // Use mapType as icon URL
        scaledSize: { width: 30, height: 30 }, // Set custom dimensions
      },
    }));

  console.log('Formatted markers with map types and sizes:', this.markers);
}





 

  
}

  openInfoWindow(markerinfo: any,templateRef:any): void {
    console.log('marker checking', markerinfo); // Debugging marker data
    this.selectedMarker = markerinfo; // Set selected marker details
    if (this.infoWindow) {
      this.infoWindow.open(templateRef); // Open the InfoWindow if it exists
    } else {
      console.error('InfoWindow is not initialized.');
    }
  }
ngAfterViewInit(): void {
  // this.initializeMapData();
}


// private initializeMapData(): void {
//   if (this.item && this.item.latitude && this.item.longitude) {
//     // Use real data if available
//     this.center = { lat: this.item.latitude, lng: this.item.longitude };
//     this.markers = [
//       {
//         position: { lat: this.item.latitude, lng: this.item.longitude },
//         title: this.item.custom_Label || 'Location',
//         label: this.item.custom_Label || ''
//       }
//     ];
//   } else {
//     // Fallback to dummy data
//     console.log('Using dummy data for the map');
//     this.center = { lat: 37.7749, lng: -122.4194 }; // San Francisco
//     this.markers = [
//       {
//         position: { lat: 37.7749, lng: -122.4194 },
//         title: 'San Francisco',
//         label: 'SF'
//       },
//       {
//         position: { lat: 37.7849, lng: -122.4094 },
//         title: 'Nearby Location 1',
//         label: 'NL1'
//       },
//       {
//         position: { lat: 37.7649, lng: -122.4294 },
//         title: 'Nearby Location 2',
//         label: 'NL2'
//       }
//     ];
//   }
//   console.log('Map Center:', this.center);
//   console.log('Map Markers:', this.markers);
// }
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
  

}
