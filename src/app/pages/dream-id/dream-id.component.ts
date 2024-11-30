import { ChangeDetectorRef,Component, OnInit } from '@angular/core';
import { APIService } from 'src/app/API.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Route } from "@angular/router";
import { param } from 'jquery';

@Component({
  selector: 'app-dream-id',
  standalone: true,
  imports: [],
  templateUrl: './dream-id.component.html',
  styleUrl: './dream-id.component.scss'
})
export class DreamIdComponent implements OnInit{
  url_result: any;
  url: string;
  send_data: any;
  loginDetail_string: any;
  response: any;
  login_detail: any;
  client: any;
  user: any;
  user_response: string;
  permission_data: any;
  id: string | null;
  login_string: string;
  theme: string | null;
  form_id: any;
  formId: string | null;
  recordId: string | null;
  project: any;
  
  constructor(

    private apiService: APIService,
    private changeDetection: ChangeDetectorRef,
    private sanitizer: DomSanitizer,
    private route: ActivatedRoute,

  ){}

  async ngOnInit() {


    console.log("DREAM BOARD ID IFRAME")

    this.login_detail = localStorage.getItem('userAttributes')

    this.login_string = JSON.stringify(localStorage.getItem('userAttributes'))
    console.log("LOGIN DETAIL FROM LOCAL STORAGE:",this.login_detail)


    this.theme = localStorage.getItem('kt_theme_mode_menu')    //theme code light or dark

     this.loginDetail_string = JSON.parse(this.login_detail) 
    console.log("AFTER JSON STRINGIFY",this.loginDetail_string)

    delete this.loginDetail_string.profile_picture;


    console.log("AFTER REMOVE OF pic:",this.loginDetail_string)
    
    // this.loginDetail = JSON.parse(localStorage.getItem("currentUser")) 
      this.client=this.loginDetail_string.clientID
      this.user=this.loginDetail_string.username

    console.log("CLIENT ID",this.client)
    console.log("USER ID",this.user)
    
    const test = await this.apiService.GetMaster(this.user+'#user#main',1);
    this.permission_data = JSON.parse(JSON.parse(JSON.stringify(test.metadata)))

    console.log("PERMISSION DATA:",this.permission_data)

    const permisson_response = await this.apiService.GetMaster(this.client+'#permission#'+this.permission_data.permission_ID+'#main',1);

    this.permission_data = JSON.parse(JSON.parse(JSON.stringify(permisson_response.metadata)))

    console.log("GET PERMISSION DATA RESPONSE:",this.permission_data.dreamBoardIDs)

    const userPermissions = JSON.stringify(this.permission_data.dreamBoardIDs|| []);
    // const userPermissions = ['view-dreamboard/Dreamboard_4'];

    console.log("USER DREAMBOARD PERMISSION",userPermissions)

    this.route.paramMap.subscribe(async params => {
      console.log(this.route);
      this.id = params.get('id')
      this.form_id = params.get('formId')
      
      // this.form_id = params.get('formId') || 'All'; // Default to 'All' if no formId is found
      // console.log(this.formId);
      console.log(this.id);


      this.project =  await this.apiService.GetMaster(this.client+'#project#'+this.form_id+'#main',1)

      console.log("PROJECT:",this.project)

      // this.project.PK = this.project.PK.replace(/#/g, "_");

      // console.log(this.project.PK); 
  
      this.route.queryParamMap.subscribe(queryParams => {
        // Handle query parameters such as formId and recordId
        this.formId = queryParams.get('formId');
        this.recordId = queryParams.get('recordId');
        
        let params_url = '';
  
        if (this.formId && this.formId.length > 0) {
          params_url = `&formId=${this.formId}`;
        }
        // if (this.form_id && this.form_id.length > 0) {
        //   params_url = `&formId=${this.form_id}`;
        // }

        console.log("PARAMS URL:",params_url)


        if(params_url && params_url.length > 0 && this.recordId && this.recordId.length > 0)
          params_url = params_url + '&recordId='+this.recordId;

        if(params_url.length>1){

          if (this.form_id && this.form_id.length > 0) {
            // params_url = params_url+`&formId=${this.form_id}`;

            params_url = params_url+`&formId=All`;
          }

        }
        else{
           if (this.form_id && this.form_id.length > 0) {
          params_url = `&formId=${this.form_id}`;
        }
        }

        console.log("AFTER RECORD ID:",params_url)
  
        // API call to fetch Dreamboard data
        var x = this.apiService.GetMaster('WIMATE_ADMIN' + "#dreamboard#" + this.id + "#main", 1).then((res: any) => {
        // var x = this.apiService.GetMaster(this.client + "#dreamboard#" + this.id + "#main", 1).then((res: any) => {
          this.response = JSON.parse(res.metadata);
          this.url_result = this.response.HTML;
          console.log("URL RES", this.url_result);
          const timestamp = new Date().getTime();
  
          // Build the URL based on whether formId is provided or not
          this.url = `https://dreamboard-dynamic.s3.ap-south-1.amazonaws.com/` + this.url_result +
            `?t=${timestamp}` +
            `&loginDetail=${JSON.stringify(JSON.stringify(this.loginDetail_string))}` +
            `&userPermissions=${userPermissions}` +
            `&theme=${this.theme}` +
            params_url+`&project=${JSON.stringify(this.project)}`
  
          this.send_data = this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
          console.log(this.send_data);
          this.changeDetection.detectChanges();
        });
      });

    });
    
  }
}

// import { ChangeDetectorRef,Component, OnInit } from '@angular/core';
// import { APIService } from 'src/app/API.service';
// import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
// import { ActivatedRoute, Route } from "@angular/router";

// @Component({
//   selector: 'app-dream-id',
//   standalone: true,
//   imports: [],
//   templateUrl: './dream-id.component.html',
//   styleUrl: './dream-id.component.scss'
// })
// export class DreamIdComponent implements OnInit{
//   url_result: any;
//   url: string;
//   send_data: any;
//   loginDetail_string: any;
//   // login_detail: { id: string; client: string; username: string; name: string; user_type: string; password: string; role: string; token: string; };

//   response: any;
//   login_detail: any;
//   client: any;
//   user: any;
//   user_response: string;
//   permission_data: any;
//   id: string | null;
//   login_string: string;

//   //prem 04/11/2024
//   formId: string | null;
//   recordId: string | null;
//   //prem 04/11/2024

//   constructor(

//     private apiService: APIService,
//     private changeDetection: ChangeDetectorRef,
//     private sanitizer: DomSanitizer,
//     private route: ActivatedRoute,

//   ){}

//   async ngOnInit() {


//     console.log("DREAM BOARD ID IFRAME")

//     this.login_detail = localStorage.getItem('userAttributes')

//     this.login_string = JSON.stringify(localStorage.getItem('userAttributes'))
//     console.log("LOGIN DETAIL FROM LOCAL STORAGE:",this.login_detail)

//      this.loginDetail_string = JSON.parse(this.login_detail)
//     console.log("AFTER JSON STRINGIFY",this.loginDetail_string)
//     // this.loginDetail = JSON.parse(localStorage.getItem("currentUser"))
//       this.client=this.loginDetail_string.clientID
//       this.user=this.loginDetail_string.userID

//     console.log("CLIENT ID",this.client)
//     console.log("USER ID",this.user)

//     const test = await this.apiService.GetMaster(this.user+'#user#main',1);
//     this.permission_data = JSON.parse(JSON.parse(JSON.stringify(test.metadata)))

//     console.log("PERMISSION DATA:",this.permission_data)

//     const permisson_response = await this.apiService.GetMaster(this.client+'#permission#'+this.permission_data.permission_ID+'#main',1);

//     this.permission_data = JSON.parse(JSON.parse(JSON.stringify(permisson_response.metadata)))

//     console.log("GET PERMISSION DATA RESPONSE:",this.permission_data.dreamBoardIDs)

//     const userPermissions = JSON.stringify(this.permission_data.dreamBoardIDs|| []);
//     // const userPermissions = ['view-dreamboard/Dreamboard_4'];

//     console.log("USER DREAMBOARD PERMISSION",userPermissions)

//     this.route.paramMap.subscribe(params => {
//       console.log(this.route)
//       this.id = params.get('id');
//       console.log(this.id)

//       this.route.queryParamMap.subscribe(queryParams => {//prem

//       //prem 04/11/2024
//       //qr operation
//       this.formId = queryParams.get('formId');
//       this.recordId = queryParams.get('recordId');
//       var params_url = ''
//       if(this.formId && this.formId.length > 0)
//       params_url = '&formId='+ this.formId;
//       if(params_url && params_url.length > 0 && this.recordId && this.recordId.length > 0)
//       params_url = params_url + '&recordId='+this.recordId;
//       //qr operation
//       //prem 04/11/2024

//       // this.loginDetail = JSON.parse(localStorage.getItem("currentUser"))

//       // this.client=this.loginDetail.client
//       // this.user=this.loginDetail.id
//       var x= this.apiService.GetMaster(this.client+"#dreamboard#"+this.id+"#main",1).then((res:any)=>{
//         //this.Description=res.description;
//         //this.name=res.name;
//         this.response = JSON.parse(res.metadata)
//         this.url_result=this.response.HTML
//         console.log("URL RES")
//         console.log(this.url_result,)
//         const timestamp = new Date().getTime();
//         //prem 04/11/2024
//         //this.url=`https://dreamboard-dynamic.s3.ap-south-1.amazonaws.com/`+this.url_result+`?t=${timestamp}`+`&loginDetail=${this.login_string}`+`&userPermissions=${userPermissions}`
//         this.url=`https://dreamboard-dynamic.s3.ap-south-1.amazonaws.com/`+this.url_result+`?t=${timestamp}`+`&loginDetail=${this.login_string}`+`&userPermissions=${userPermissions}`+params_url
//         this.send_data=this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
//         console.log(this.send_data)
//         this.changeDetection.detectChanges()
//       })

//     });//prem

//     });
//   }
// }

