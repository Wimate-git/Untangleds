import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, interval, Subscription, takeWhile } from 'rxjs';
import { SharedService } from 'src/app/pages/shared.service';

@Component({
  selector: 'app-profile-details',
  templateUrl: './profile-details.component.html',
})
export class ProfileDetailsComponent implements OnInit, OnDestroy {
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading: boolean;
  private unsubscribe: Subscription[] = [];
  userProfileDetailAttributes: any;
  getLoggedUser: any;
  imageUrlData: any

  constructor(private cdr: ChangeDetectorRef,private userConfiguration:SharedService) {
    const loadingSubscr = this.isLoading$
      .asObservable()
      .subscribe((res) => (this.isLoading = res));
    this.unsubscribe.push(loadingSubscr);
  }

  ngOnInit(): void {

    console.log("Iam in profile init");

    this.getLoggedUser = this.userConfiguration.getLoggedUserDetails();

    this.userProfileDetailAttributes= this.getLoggedUser
    
    console.log("ALl the attriutes are here ",this.userProfileDetailAttributes);

     this.getLocalStorage()
  }

  saveSettings() {
    this.isLoading$.next(true);
    setTimeout(() => {
      this.isLoading$.next(false);
      this.cdr.detectChanges();
    }, 1500);
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
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


  private checkLocalStorageData(key: string): void {

    this.getLoggedUser = this.userConfiguration.getLoggedUserDetails()
    this.imageUrlData = this.getLoggedUser.profile_picture


    console.log("ALl the input values to be displayed are here ",this.getLoggedUser );

    
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


  getKeys(obj:any) {
    return Object.keys(obj);
  }


  formatLabel(key:any) {
    return key.replace(/_/g, ' ').replace(/\b\w/g, (char: string) => char.toUpperCase());
  }



  isTextInput(key: any) {
    return typeof key == 'string'
  }
  
  isPasswordInput(key: string) {
    return key === 'password';
  }
  
  isEmailInput(key: string) {
    return key === 'email';
  }
  
  isPhoneInput(key: string) {
    return key === 'mobile';
  }
  
  isBooleanInput(key: string) {
    return typeof key == 'boolean'
  }
  
  toggleBoolean(key: string | number) {
    this.getLoggedUser[key] = !this.getLoggedUser[key];
  }
  
  isRequired(key: string) {
    return ['clientID', 'companyID', 'email', 'password', 'mobile'].includes(key);
  }


  isFieldEmpty(key: string): boolean {
    const value = this.getLoggedUser[key];
    return value === null || value === undefined || value === '';
  }
  
  getEmptyFields(): string[] {
    return this.getKeys(this.getLoggedUser).filter(key => this.isFieldEmpty(key));
  }
  
  isArray(value: any): boolean {
    return Array.isArray(value);
  }

}
