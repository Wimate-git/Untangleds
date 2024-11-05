import { ChangeDetectorRef,Component, OnInit } from '@angular/core';
import { APIService } from 'src/app/API.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Route } from "@angular/router";

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
  // login_detail: { id: string; client: string; username: string; name: string; user_type: string; password: string; role: string; token: string; };

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



    // this.route.queryParams.subscribe(queryParams => {
    //   console.log("QueryPARMA:",queryParams)
    //   this.form_id = queryParams['formId'];
    //   console.log('Form ID:', this.form_id);
  
    //   // Handle any additional logic with 'formId' here
    // });

    // this.form_id = localStorage.getItem('title')

    // console.log("FORMID:",this.form_id)

    // formid 


     this.loginDetail_string = JSON.parse(this.login_detail) 
    console.log("AFTER JSON STRINGIFY",this.loginDetail_string)
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

    this.route.paramMap.subscribe(params => {
      console.log(this.route)
      this.id = params.get('id');
      this.form_id = params.get('formId');

      if((this.form_id == null)|| (this.form_id == undefined)){
        this.form_id= 'All'
      }

      console.log(this.form_id)
      console.log(this.id)
    
      // this.loginDetail = JSON.parse(localStorage.getItem("currentUser"))
     
      // this.client=this.loginDetail.client
      // this.user=this.loginDetail.id
      var x= this.apiService.GetMaster(this.client+"#dreamboard#"+this.id+"#main",1).then((res:any)=>{
        //this.Description=res.description;
        //this.name=res.name;
        this.response = JSON.parse(res.metadata)
        this.url_result=this.response.HTML
        console.log("URL RES")
        console.log(this.url_result,)
        const timestamp = new Date().getTime();
        if(this.form_id == 'All'){
          this.url=`https://dreamboard-dynamic.s3.ap-south-1.amazonaws.com/`+this.url_result+`?t=${timestamp}`+`&loginDetail=${this.login_string}`+`&userPermissions=${userPermissions}`+`&theme=${this.theme}`
        }
        else{
        this.url=`https://dreamboard-dynamic.s3.ap-south-1.amazonaws.com/`+this.url_result+`?t=${timestamp}`+`&loginDetail=${this.login_string}`+`&userPermissions=${userPermissions}`+`&theme=${this.theme}`+`&formId=${this.form_id}`
        }
        this.send_data=this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
        console.log(this.send_data)
        this.changeDetection.detectChanges()
      })
    });
  }
}

