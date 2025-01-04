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
  'formName': 'Testing Web Complaint',
  'title': 'How Can we help you',
  'searchButton': 'yes',
  'searchbutton_name': 'Search',
  'addButton': 'yes',
  'addButton_name': 'Create Ticket',
  'scanButton': 'yes',
  'scanButton_name': 'Scan QR Code',
}


this.loginDetail = {
  "clientID": this.firstWord,
  "allowNewCompanyID": false,
  "device_type_permission": [],
  "default_type": "Device",
  "start_node": "Default",
  "description": "Developer",
  "health_check": false,
  "userID": "swapnil",
  "telegramID": 123456789,
  "cognito_update": false,
  "device_timeout": false,
  "enable_user": false,
  "companyID": "tree_creation",
  "password": "Swap@05prajapati",
  "escalation_sms": true,
  "report_to": null,
  "alert_telegram": true,
  "escalation_email": false,
  "default_module": "Dashboard - Group",
  "location_object": "",
  "redirectionURL": "/dashboard",
  "email": "swapnil@wimate.in",
  "key": "U2FsdGVkX18CUyAdixEzQANiBbYUfka2I/kl4mN0BFQ=",
  "device_permission": [],
  "alert_email": false,
  "mobile": "8174941153",
  "alert_sms": false,
  "permission_ID": "Dreamboard Module",
  "default_dev": null,
  "token": "d1RTlcIYRIm604ZhkZgaB9:APA91bGpU3KCIorhkY_3nwNrhlG2rdBwJNLbHKzdsezLbMZSFBb5keUKYI59G19FueJJjwnjDW_nSf-wtz1v2MF-18NV8WbywLrb8rdyBgnrTk6AKgoay7M",
  "mobile_privacy": "Invisible",
  "allowOtherClient": false,
  "escalation_telegram": false,
  "alert_timeout": false,
  "allowOtherCompanyID": null,
  "alert_levels": "NONE",
  "default_loc": null,
  "location_permission": [
      "All"
  ],
  "form_permission": [
      "All"
  ],
  "updated": "2024-12-27T07:56:24.527Z",
  "allowNewClient": {},
  "disable_user": false,
  "username": `${this.firstWord}_withoutLogin`
}


    

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

    // this.route.paramMap.subscribe(params => {
    //   console.log(this.route)
    //   this.id = params.get('id');
    //   console.log(this.id)
    //   // Use this.itemId to fetch and display item details
      

    //   this.loginDetail = JSON.parse(localStorage.getItem("currentUser"))
     
    //   this.client=this.loginDetail.client
    //   this.user=this.loginDetail.id
    //   var x= this.api.GetDreamBoard(this.id, this.loginDetail.client).then((res)=>{
    //     //this.Description=res.description;
        //this.name=res.name;
        // this.url_result=res.HTML
        // console.log("URL RES")
        // console.log(this.url_result,)
        // const timestamp = new Date().getTime();
        // this.url=`https://dreamboard-dynamic.s3.ap-south-1.amazonaws.com/public/WIMATE_ADMIN/Without+Login/src/index.html?loginDetail="{\"username\":\"Wimate_Test\",\"clientID\":\"Climaveneta\",\"username_\":\"12345678\",\"name\":\"Wimate_Admin\",\"user_type\":\"Admin\",\"password\":\"DUMMY\",\"role\":\"Admin\",\"token\":\"admin-token\",\"permission_ID\":\"Dreamboard Module\"}"&withoutlogin="{\"formName\":\"Testing Web Complaint\",\"title\":\"How Can we help you\",\"searchButton\":\"yes\",\"searchbutton_name\":\"Search\",\"addButton\":\"yes\",\"addButton_name\":\"Create Ticket\",\"scanButton\":\"yes\",\"scanButton_name\":\"Scan QR Code\"}"`
        this.url = `https://dreamboard-dynamic.s3.ap-south-1.amazonaws.com/public/WIMATE_ADMIN/Without%20Login/src/index.html?`+`&loginDetail=${JSON.stringify(JSON.stringify(this.loginDetail))}`+`&withoutlogin=${JSON.stringify(JSON.stringify(this.withoutlogin))}`
        // this.url =`https://dreamboard-dynamic.s3.ap-south-1.amazonaws.com/public/WIMATE_ADMIN/Without Login/src/index.html?loginDetail="{\"username\":\"Wimate_Test\",\"clientID\":\"Climaveneta\",\"username_\":\"12345678\",\"name\":\"Wimate_Admin\",\"user_type\":\"Admin\",\"password\":\"DUMMY\",\"role\":\"Admin\",\"token\":\"admin-token\",\"permission_ID\":\"Dreamboard Module\"}"&withoutlogin="{\"formName\":\"Testing Web Complaint\",\"title\":\"How Can we help you\",\"searchButton\":\"yes\",\"searchbutton_name\":\"Search\",\"addButton\":\"yes\",\"addButton_name\":\"Create Ticket\",\"scanButton\":\"yes\",\"scanButton_name\":\"Scan QR Code\"}"`
        this.send_data = this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
        console.log(this.send_data)
        this.changeDetection.detectChanges()
    //   })
    // });
  

}
  
}
