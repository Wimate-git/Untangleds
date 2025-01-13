import { Component, OnInit } from "@angular/core";
import { ChangeDetectorRef} from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { APIService } from 'src/app/API.service';
import { ActivatedRoute, Route } from "@angular/router";
import { ClientLogoService } from "../../services/client-logo.service";


// import { PermissionService } from '../../configuration/permission.service';
// import { AuditTrialService } from '../../attendance/audit-trial.service';
@Component({
  selector: "app-web-complaints",
  templateUrl: "./web-Complaint.component.html",
  styleUrls: [".//web-Complaint.component.scss"],
})
export class WebComplaintsComponent
  implements OnInit
{
  // private currentUserSubject: BehaviorSubject<User>;
  // public currentUser: Observable<User>;
  
  loginDetail: any;
  client: any;
  id: string;
  url_result: string;
  url: string;
  user:string;
  send_data: SafeResourceUrl;
  loginDetail_string:any;
  data: any;
  withoutlogin: { formName: string; title: string; searchButton: string; searchbutton_name: string; addButton: string; addButton_name: string; scanButton: string; scanButton_name: string; };
  firstWord: any;
  loginDetail_: any;
  recordId: string | null;
  

  constructor(
    private route: ActivatedRoute,
    private api: APIService,
    private sanitizer: DomSanitizer,
    private changeDetection:ChangeDetectorRef,
    private clientlogoservice: ClientLogoService
   
  ) {
  }


  async ngOnInit() {


    this.data = await this.clientlogoservice.getClientLogo()

    console.log("Client:",this.data[1].clientID)

    this.client = this.data[1].clientID

    this.firstWord = this.client.split('#')[0];
      console.log(this.firstWord);

this.withoutlogin =
{
  'formName': 'Web Complaint',
  'title': 'How Can we help you',
  'searchButton': 'yes',
  'searchbutton_name': 'Search',
  'addButton': 'yes',
  'addButton_name': 'Create Ticket',
  'scanButton': 'yes',
  'scanButton_name': 'Scan QR Code',
}


// this.loginDetail = {
//   "clientID": this.firstWord,
//   "allowNewCompanyID": false,
//   "device_type_permission": [],
//   "default_type": "Device",
//   "start_node": "Default",
//   "description": "Developer",
//   "health_check": false,
//   "userID": "swapnil",
//   "telegramID": 123456789,
//   "cognito_update": false,
//   "device_timeout": false,
//   "enable_user": false,
//   "companyID": "tree_creation",
//   "password": "123456789",
//   "escalation_sms": true,
//   "report_to": null,
//   "alert_telegram": true,
//   "escalation_email": false,
//   "default_module": "Dashboard - Group",
//   "location_object": "",
//   "redirectionURL": "/dashboard",
//   "email": "swapnil@wimate.in",
//   "key": "U2FsdGVkX18CUyAdixEzQANiBbYUfka2I/kl4mN0BFQ=",
//   "device_permission": [],
//   "alert_email": false,
//   "mobile": "8174941153",
//   "alert_sms": false,
//   "permission_ID": "Dreamboard Module",
//   "default_dev": null,
//   "token": "d1RTlcIYRIm604ZhkZgaB9:APA91bGpU3KCIorhkY_3nwNrhlG2rdBwJNLbHKzdsezLbMZSFBb5keUKYI59G19FueJJjwnjDW_nSf-wtz1v2MF-18NV8WbywLrb8rdyBgnrTk6AKgoay7M",
//   "mobile_privacy": "Invisible",
//   "allowOtherClient": false,
//   "escalation_telegram": false,
//   "alert_timeout": false,
//   "allowOtherCompanyID": null,
//   "alert_levels": "NONE",
//   "default_loc": null,
//   "location_permission": [
//       "All"
//   ],
//   "form_permission": [
//       "All"
//   ],
//   "updated": "2024-12-27T07:56:24.527Z",
//   "allowNewClient": {},
//   "disable_user": false,
//   "username": `${this.firstWord}_withoutLogin`
// }


const test  = await this.api.GetMaster(this.firstWord.toLowerCase()+'_'+'withoutlogin#user#main',1)

console.log("USER RESPONSE:",test)

this.loginDetail_ =  JSON.parse(JSON.parse(JSON.stringify(test.metadata)))

console.log("LOGIN DETAIL:",this.loginDetail_)

delete this.loginDetail_.profile_picture;


console.log("AFTER REMOVE OF pic:",this.loginDetail_)

// this.recordId = {
//   "type": "view",  // "view", "create"
//   "fields": {
//       "Service Type.prefix-text-1735110082653": "Web_Complaint_1",
//       "Service Type.single-select-1735110320882": "divya",
//       "Customer Name.single-select-1735110727686": "Samsung",
//       "Name.single-select-1735110877149": "South Korea",
//       "Logo.single-select-1735111013692": "130",
//       "third Party.single-select-1735111127955": "Sprinkler"
//   },

//   "mainTableKey": "1736503505722" // web_1736503505722
// };


    

    // this.audittrial.audit_trail("Dreamboard","Page load","Entered dreamboard",1,'v1.2.1')
    // console.log("AUDIT trial called")
    // this.loginDetail_string = JSON.stringify(localStorage.getItem("currentUser"))
    // console.log(this.loginDetail_string)
    // this.loginDetail = JSON.parse(localStorage.getItem("currentUser")) 
    //   this.client=this.loginDetail.client
    //   this.user=this.loginDetail.id
    // console.log(this.client)
    // //this.user=this.loginDetail.id
    // const test= await this.api.GetUser(this.user, this.client);
    // const userPermissions = JSON.stringify(test.permission || []);

    // console.log(userPermissions)

    this.route.queryParamMap.subscribe(queryParams => {
    //   console.log(this.route)
    //   this.id = params.get('id');
    //   console.log(this.id)
    //   // Use this.itemId to fetch and display item details
    this.recordId = queryParams.get('recordId');

    let params_url = '';

    console.log("PARAMS URL:", params_url)


    if (this.recordId && this.recordId.length > 0)
      params_url = '&recordId=' + this.recordId;

        // this.url=`https://dreamboard-dynamic.s3.ap-south-1.amazonaws.com/public/WIMATE_ADMIN/Without+Login/src/index.html?loginDetail="{\"username\":\"Wimate_Test\",\"clientID\":\"Climaveneta\",\"username_\":\"12345678\",\"name\":\"Wimate_Admin\",\"user_type\":\"Admin\",\"password\":\"DUMMY\",\"role\":\"Admin\",\"token\":\"admin-token\",\"permission_ID\":\"Dreamboard Module\"}"&withoutlogin="{\"formName\":\"Testing Web Complaint\",\"title\":\"How Can we help you\",\"searchButton\":\"yes\",\"searchbutton_name\":\"Search\",\"addButton\":\"yes\",\"addButton_name\":\"Create Ticket\",\"scanButton\":\"yes\",\"scanButton_name\":\"Scan QR Code\"}"`
        this.url = `https://dreamboard-dynamic.s3.ap-south-1.amazonaws.com/public/WIMATE_ADMIN/Without%20Login/src/index.html?`+`&loginDetail=${JSON.stringify(JSON.stringify(this.loginDetail_))}`+`&withoutlogin=${JSON.stringify(JSON.stringify(this.withoutlogin))}`+params_url
        // this.url =`https://dreamboard-dynamic.s3.ap-south-1.amazonaws.com/public/WIMATE_ADMIN/Without Login/src/index.html?loginDetail="{\"username\":\"Wimate_Test\",\"clientID\":\"Climaveneta\",\"username_\":\"12345678\",\"name\":\"Wimate_Admin\",\"user_type\":\"Admin\",\"password\":\"DUMMY\",\"role\":\"Admin\",\"token\":\"admin-token\",\"permission_ID\":\"Dreamboard Module\"}"&withoutlogin="{\"formName\":\"Testing Web Complaint\",\"title\":\"How Can we help you\",\"searchButton\":\"yes\",\"searchbutton_name\":\"Search\",\"addButton\":\"yes\",\"addButton_name\":\"Create Ticket\",\"scanButton\":\"yes\",\"scanButton_name\":\"Scan QR Code\"}"`
        this.send_data = this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
        console.log(this.send_data)
        this.changeDetection.detectChanges()
    //   })
    });
  

}
  
}
