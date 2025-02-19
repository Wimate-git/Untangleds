import { ChangeDetectorRef, Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { interval, Observable, Subscription, takeWhile } from 'rxjs';
import { TranslationService } from '../../../../../../modules/i18n';
import { AuthService, UserType } from '../../../../../../modules/auth';
import { signOut } from 'aws-amplify/auth';
import { SharedService } from 'src/app/pages/shared.service';
import { AuditTrailService } from 'src/app/pages/services/auditTrail.service';

@Component({
  selector: 'app-user-inner',
  templateUrl: './user-inner.component.html',
})
export class UserInnerComponent implements OnInit, OnDestroy {
  @HostBinding('class')
  class = `menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg menu-state-primary fw-bold py-4 fs-6 w-auto`;
  @HostBinding('attr.data-kt-menu') dataKtMenu = 'true';

  language: LanguageFlag;
  user$: Observable<UserType>;
  langs = languages;
  private unsubscribe: Subscription[] = [];
  getLoggedUser: any;
  username: any;
  email: any;
  imageUrlData: any;
  sk_ClientID: any;

  constructor(
    private auth: AuthService,
    private translationService: TranslationService,
    private shared:SharedService,
    private cd:ChangeDetectorRef,private auditTrail:AuditTrailService
  ) {}

  ngOnInit(): void {
    this.user$ = this.auth.currentUserSubject.asObservable();
    this.setLanguage(this.translationService.getSelectedLanguage());


    this.getLoggedUser = this.shared.getLoggedUserDetails()

    this.username = this.getLoggedUser.username;

    this.sk_ClientID = this.getLoggedUser.clientID;



    this.auditTrail.getFormInputData('SYSTEM_AUDIT_TRAIL',  this.sk_ClientID)

    this.email = this.getLoggedUser.email;

    this.getLocalStorage()
  }




  // private intervalSubscription: Subscription;
	// getLocalStorage() {
	//   console.log("profile picture")
	//   this.intervalSubscription = interval(1000)
	// 	.pipe(
	// 	  takeWhile(() => !this.imageUrlData)
	// 	)
	// 	.subscribe(() => this.checkLocalStorageData('profileImage'));
	// }
  
  
	// private checkLocalStorageData(key: string): void {
	//   const item = localStorage.getItem(key);
	//   if (item) {
	// 	this.imageUrlData = item;
  //     console.log("image is here ",this.imageUrlData);
  
	//   }
	// }
  

  logout() {


    try{
      const UserDetails = {
        "User Name": this.username,
        "Action": "Logout",
        "Module Name": "Logout",
        "Form Name": "Logout",
       "Description": `${this.username} logged out from the application`,
        "User Id": this.username,
        "Client Id": this.sk_ClientID,
        "created_time": Date.now(),
        "updated_time": Date.now()
      }
  
      this.auditTrail.mappingAuditTrailData(UserDetails,this.sk_ClientID)
      console.log("Audit trails for login created ");
    }
    catch(error){
      console.log("Error while creating audit trails ",error);
    }









    this.auth.logout();
    document.location.reload();
    signOut()
      .then(() => {
        console.log("Cognito signout ");
      })
      .catch(err => console.error(err));
  }

  selectLanguage(lang: string) {
    this.translationService.setLanguage(lang);
    this.setLanguage(lang);
    // document.location.reload();
  }

  setLanguage(lang: string) {
    this.langs.forEach((language: LanguageFlag) => {
      if (language.lang === lang) {
        language.active = true;
        this.language = language;
      } else {
        language.active = false;
      }
    });
  }

  // ngOnDestroy() {
  //   this.unsubscribe.forEach((sb) => sb.unsubscribe());
  // }


  private intervalSubscription: Subscription;



  ngOnDestroy() {
    // Unsubscribe to prevent memory leaks
    if (this.intervalSubscription) {
      this.intervalSubscription.unsubscribe();
    }
  }

  getLocalStorage() {
    
    
    console.log("Checking for profile picture...",this.getLoggedUser);
    console.log("Image url is ",this.imageUrlData);
    this.intervalSubscription = interval(1000)
      .pipe(takeWhile(() => !this.imageUrlData))
      .subscribe(() => this.checkLocalStorageData('profileImage'));
  }

  private checkLocalStorageData(key: string): void {

    this.getLoggedUser = this.shared.getLoggedUserDetails()
    this.imageUrlData = this.getLoggedUser.profile_picture

    this.username = this.getLoggedUser.username;

    this.email = this.getLoggedUser.email;
    
    // const item = this.getLoggedUser.profile_picture
    // console.log("Iamge is here ",item);
    // if (item) {
    //   this.imageUrlData = item;
    //   console.log("Image is here:", this.imageUrlData);
    // } else {
    //   console.log("No image found in local storage.");
    // }
    this.cd.detectChanges()
  }



}

interface LanguageFlag {
  lang: string;
  name: string;
  flag: string;
  active?: boolean;
}

const languages = [
  {
    lang: 'en',
    name: 'English',
    flag: './assets/media/flags/united-states.svg',
  },
  {
    lang: 'zh',
    name: 'Mandarin',
    flag: './assets/media/flags/china.svg',
  },
  {
    lang: 'es',
    name: 'Spanish',
    flag: './assets/media/flags/spain.svg',
  },
  {
    lang: 'ja',
    name: 'Japanese',
    flag: './assets/media/flags/japan.svg',
  },
  {
    lang: 'de',
    name: 'German',
    flag: './assets/media/flags/germany.svg',
  },
  {
    lang: 'fr',
    name: 'French',
    flag: './assets/media/flags/france.svg',
  },
];


