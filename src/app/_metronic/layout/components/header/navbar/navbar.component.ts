import { AfterViewInit, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { interval, Subscription, takeWhile } from 'rxjs';
import { menuReinitialization } from 'src/app/_metronic/kt/kt-helpers';
import { SharedService } from 'src/app/pages/shared.service';

@Component({
	selector: 'app-navbar',
	templateUrl: './navbar.component.html',
	styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit, AfterViewInit {
	@Input() appHeaderDefaulMenuDisplay: boolean;
	@Input() isRtl: boolean;

	imageUrlData: any

	itemClass: string = 'ms-1 ms-lg-3';
	btnClass: string = 'btn btn-icon btn-custom btn-icon-muted btn-active-light btn-active-color-primary w-35px h-35px w-md-40px h-md-40px';
	userAvatarClass: string = 'symbol-35px symbol-md-40px';
	btnIconClass: string = 'fs-2 fs-md-1';
	getLoggedUser: any;

	constructor(private userConfiguration:SharedService,private cdr:ChangeDetectorRef) { }

	ngAfterViewInit(): void {
		menuReinitialization();
	}

	ngOnInit(): void { 

		this.getLocalStorage()
	}

	private intervalSubscription: Subscription;
	getLocalStorage() {
	  console.log("profile picture")
	  this.intervalSubscription = interval(1000)
		.pipe(
		  takeWhile(() => !this.imageUrlData)
		)
		.subscribe(() => this.checkLocalStorageData('profileImage'));
	}
  
  
	// private checkLocalStorageData(key: string): void {
	//   const item = localStorage.getItem(key);
	//   if (item) {
	// 	this.imageUrlData = item;
  
  
	//   }
	// }


	private checkLocalStorageData(key: string): void {

		this.getLoggedUser = this.userConfiguration.getLoggedUserDetails()
		this.imageUrlData = this.getLoggedUser.profile_picture
	
		
		// const item = this.getLoggedUser.profile_picture
		// console.log("Iamge is here ",item);
		// if (item) {
		//   this.imageUrlData = item;
		//   console.log("Image is here:", this.imageUrlData);
		// } else {
		//   console.log("No image found in local storage.");
		// }
		this.cdr.detectChanges()
	  }
  

}
