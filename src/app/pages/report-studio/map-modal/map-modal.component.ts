import { Component, Input, AfterViewInit, ChangeDetectorRef, ElementRef, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-map-modal',
  templateUrl: './map-modal.component.html',
  styleUrls:['./map-modal.component.scss']
})
export class MapModalComponent implements AfterViewInit {
  @Input() coordinates:any;
  @Input() latitude: string;
  @Input() longitude: string;

  markers: google.maps.Marker[] = [];

  @ViewChild('mapContainer') gmap: ElementRef;
  // map: google.maps.Map;
  marker: google.maps.Marker;

  map: google.maps.Map;

  constructor(public modal: NgbActiveModal, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    console.log("coordinates ",this.coordinates);
    console.log('Latitude:', this.latitude);
    console.log('Longitude:', this.longitude);
  }

  ngAfterViewInit() {
    
    if(this.coordinates == undefined){
      this.loadMap();
    }
    else{
      this.initMap();
    }
   
  }

  loadMap() {
    console.log("Map is being loaded");

    const mapOptions = {
      center: new google.maps.LatLng(parseFloat(this.latitude), parseFloat(this.longitude)),
      zoom: 8,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    this.map = new google.maps.Map(this.gmap.nativeElement, mapOptions);

    this.marker = new google.maps.Marker({
      position: new google.maps.LatLng(parseFloat(this.latitude), parseFloat(this.longitude)),
      map: this.map,
      // draggable: true,
      // clickable: true
    });

    this.cdr.detectChanges();
  }



  initMap(): void {
    // Ensure Google Maps API is loaded
    if (typeof google === 'undefined' || typeof google.maps === 'undefined') {
      console.error('Google Maps API not loaded.');
      return;
    }

    const mapOptions: google.maps.MapOptions = {
      center: { lat: 12.959227, lng: 77.547899 },
      zoom: 10
    };

    this.map = new google.maps.Map(this.gmap.nativeElement, mapOptions);
    this.addMarkers();
  }


  addMarkers(): void {
    if (!this.map) {
      console.error('Map not initialized.');
      return;
    }

    // Clear existing markers
    this.markers.forEach(marker => marker.setMap(null));
    this.markers = [];

    const markersData = this.coordinates.map((item: any) => ({
      lat: item.latitude,
      lng: item.longitude,
      name: item.name,
      type: item.type
    }));

    console.log("Markers Data: ", markersData);

    const bounds = new google.maps.LatLngBounds();

    markersData.forEach((markerInfo: any) => {
      let iconUrl = ''; // Initialize empty icon URL

      // Change the marker icon based on type (this is just an example)
      if (markerInfo.type === 'Open to Accept') {
        iconUrl = 'https://maps.google.com/mapfiles/ms/icons/green-dot.png'; // Green marker icon
      } else {
        iconUrl = 'https://maps.google.com/mapfiles/ms/icons/red-dot.png'; // Red marker icon
      }

      const marker:any = new google.maps.Marker({
        position: { lat: markerInfo.lat, lng: markerInfo.lng },
        map: this.map,
        icon: {
          labelOrigin: new google.maps.Point(11, 50),
          url: iconUrl
        }
      });

      marker.addListener('click', () => {
        this.openInfoWindow(marker, markerInfo);
      });

      this.markers.push(marker);

      if (marker.getPosition()) {
        bounds.extend(marker.getPosition());
      }
    });

    // Fit the map to the bounds containing all markers
    if (this.markers.length > 1) {
      this.map.fitBounds(bounds);
    } else if (this.markers.length === 1) {
      // Adjust the map to zoom level 10 if there's only one marker
      this.map.setCenter(bounds.getCenter());
      this.map.setZoom(10);
    }
  }



  openInfoWindow(marker: google.maps.Marker, markerInfo: any): void {
    console.log('Opening info window for marker:', markerInfo);

    if (!markerInfo.name || !markerInfo.type) {
      console.error('Invalid marker info:', markerInfo);
      return;
    }

    const contentString = `
      <div style="padding:10px">
        <h4>${markerInfo.name}</h4>
        <p>Type: ${markerInfo.type}</p>
      </div>
    `;

    const infoWindow = new google.maps.InfoWindow({
      content: contentString
    });

    infoWindow.open(this.map, marker);
  }
 


  // loadMapWithMarkers() {
  //   console.log("Map is being loaded with multiple markers");

  //   const bounds = new google.maps.LatLngBounds();
    
  //   // Initialize variables to calculate the center (average coordinates)
  //   let totalLat = 0;
  //   let totalLng = 0;
  //   let validCoordinatesCount = 0;

  //   // Add markers for each valid location in the coordinates array
  //   this.coordinates.forEach((coordinate: any) => {
  //     if (coordinate.latitude !== null && coordinate.longitude !== null) {
  //       console.log("Adding marker for coordinates:", coordinate.latitude, coordinate.longitude);

  //       // Calculate the center of the map (average latitude and longitude)
  //       totalLat += coordinate.latitude;
  //       totalLng += coordinate.longitude;
  //       validCoordinatesCount++;

  //       // Add the marker for the valid location
  //       this.addMarker(coordinate.latitude, coordinate.longitude, coordinate.name, coordinate.type);

  //       // Extend the bounds to include this marker
  //       bounds.extend(new google.maps.LatLng(coordinate.latitude, coordinate.longitude));
  //     }
  //   });

  //   // Calculate the center of the map by averaging the coordinates
  //   const centerLat = validCoordinatesCount > 0 ? totalLat / validCoordinatesCount : parseFloat(this.latitude);
  //   const centerLng = validCoordinatesCount > 0 ? totalLng / validCoordinatesCount : parseFloat(this.longitude);

  //   // Initialize the map with the calculated center and bounds
  //   const mapOptions = {
  //     center: new google.maps.LatLng(centerLat, centerLng),
  //     zoom: 8,
  //     mapTypeId: google.maps.MapTypeId.ROADMAP
  //   };

  //   this.map = new google.maps.Map(this.gmap.nativeElement, mapOptions);

  //   // If valid coordinates were found, fit the map to the bounds of the markers
  //   if (validCoordinatesCount > 0) {
  //     this.map.fitBounds(bounds);
  //   } else {
  //     // If no valid coordinates were found, center the map at default position
  //     this.map.setCenter(new google.maps.LatLng(centerLat, centerLng));
  //   }

  //   this.cdr.detectChanges();
  // }

  // addMarker(latitude: number, longitude: number, name?: string, type?: string) {
  //   const position = new google.maps.LatLng(latitude, longitude);
  //   const marker = new google.maps.Marker({
  //     position: position,
  //     map: this.map,
  //   });

  //   // Optionally, add an info window for the marker with additional information
  //   if (name && type) {
  //     const infoWindowContent = `
  //       <div>
  //         <strong>${name}</strong><br>
  //         Type: ${type}
  //       </div>
  //     `;
  //     const infoWindow = new google.maps.InfoWindow({
  //       content: infoWindowContent
  //     });

  //     marker.addListener('click', () => {
  //       infoWindow.open(this.map, marker);
  //     });
  //   }

  //   this.markers.push(marker);  // Store the marker in the array
  // }
}
