import { Component, HostBinding, Input, OnInit, ViewChild } from '@angular/core';
import { ModalConfig, ModalComponent } from '../../_metronic/partials';
import { APIService } from 'src/app/API.service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit{

  
  modalConfig: ModalConfig = {
    modalTitle: 'Modal title',
    dismissButtonLabel: 'Submit',
    closeButtonLabel: 'Cancel'
  };
  @ViewChild('modal') private modalComponent: ModalComponent;
  login_detail: any;
  loginDetail_string: any;
  client: any;
  user: any;
  formList: any[]=[];
  cards_2:any[]=[]
  formgroup: any[]=[];
  showCards2 = true;
  permission_data: any;
  helpherObj: any;
  permissionForm: any;
  permissionFormgroup: any;
  response: any
  image: any;
  url: any;

  
  constructor(
    private api: APIService,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit(): Promise<void> {
    setTimeout(async () => {
    this.login_detail = localStorage.getItem('userAttributes')

    this.loginDetail_string = JSON.parse(this.login_detail) 
    console.log("AFTER JSON STRINGIFY",this.loginDetail_string)

    this.client=this.loginDetail_string.clientID
    this.user=this.loginDetail_string.username


    const test = await this.api.GetMaster(this.user+'#user#main',1);
    this.permission_data = JSON.parse(JSON.parse(JSON.stringify(test.metadata)))

    console.log("PERMISSION DATA:",this.permission_data)

    const permisson_response = await this.api.GetMaster(this.client+'#permission#'+this.permission_data.permission_ID+'#main',1);

    this.permission_data = JSON.parse(JSON.parse(JSON.stringify(permisson_response.metadata)))

    this.permissionFormgroup = (this.permission_data.formgroup)

    console.log("FORMGROUP:",this.permissionFormgroup)


    await this.api.GetMaster(this.client + "#formgroup#lookup", 1).then((result:any)=>{
      if (result) {
        const helpherObj = JSON.parse(result.options)

        this.formgroup = helpherObj.map((item: any) => item)  
        
        console.log("FORMS LIST:",this.formgroup)

       
      }
    }).catch((error)=>{
     console.log("FORMGROUP:",error)
    })

  const filteredData = this.formgroup.filter(data => {
    const key = Object.keys(data)[0]; 
    const item = data[key];
    // Check if the P1 value exists in the permissionFormgroup array
    return this.permissionFormgroup.includes(item.P1);
  });

  // Process the filtered data with async/await and map
  this.cards_2 = await Promise.all(
    filteredData.map(async data => {
      const key = Object.keys(data)[0];
      const item = data[key]; // Extract the actual data using the key

      const request_data = {
        bucket_name: "dreamboard-dynamic",
        operation_type: "generate",
        "key": item.P4,
    };

    try {
        // Call your API endpoint that triggers the Lambda function
        const response = await fetch('https://3luwbeeuk0.execute-api.ap-south-1.amazonaws.com/s1/s3Bucket', {
            method: 'POST',
            body: JSON.stringify(request_data)
        });

        const data = await response.json();
        console.log(data);

        const data_ = JSON.parse(data.body);
        const data_1 = JSON.parse(data_.data);
        console.log('data_1 :', data_1);

        this.url = data_1[0].url;
        console.log("URL:", this.url);
      }catch(error){

      }
      return {
        icon: this.url || ' ',
        name: item.P1 || ' ',  // Fallback in case P1 is empty
        job: item.P3 || ' ',   // Fallback in case P3 is empty
        avgEarnings: new Date(item.P7 * 1000).toLocaleDateString('en-GB', { 
          day: '2-digit', 
          month: 'short', 
          year: 'numeric' 
        }),  // Convert timestamp to a readable date format
        totalEarnings: item.P5 || '',  // Fallback in case P5 is empty
        online: '', // Placeholder for 'online' status
      };
    })
  );
  


  //   this.cards_2 = this.formgroup.map(data => {
  //     // Accessing the first key of the object, e.g., L1, L2, L3
  //     const key = Object.keys(data)[0]; 
  //     const item = data[key]; // Extracting the actual data using the key
  
  //     return {
  //         // Assuming name, job, avgEarnings are mapped to certain properties in your structure
  //         name: item.P2 || ' ',  // Fallback in case P2 is empty
  //         job: item.P3 || ' ',  // Fallback in case P3 is empty
  //         avgEarnings: new Date(item.P7 * 1000).toLocaleDateString('en-GB', { 
  //             day: '2-digit', 
  //             month: 'short', 
  //             year: 'numeric' 
  //         }),  // Convert timestamp to a readable date format
  //         totalEarnings: item.P5 || '',  // Fallback in case P5 is empty
  //         online: '' , // Placeholder for 'online' status, you can set it later
  //         formgroup:item.P4
  //     };
  // });

    console.log("CARDS ON FORMGROUP:",this.cards_2)
    this.cdr.detectChanges();


    // const allowedForms = this.permissionForm.reduce((acc: string[], permission: any) => {
    //   return acc.concat(permission.dynamicForm);
    // }, []);
    
    // console.log("ALLOW FORMS:",allowedForms)

    
    // // Filter formList data based on allowedForms
    // const filteredFormList = this.formList.filter((formItem: any) => {
    //   console.log('FORMITEM:',formItem,)
    //   return allowedForms.includes(formItem[0]);  // Matching the first element of formList (form name) with allowedForms
    // });

    // console.log("FILTERED FORMS LIST:", filteredFormList);

        // console.log("FORMS LIST:",this.formList)

        // this.cards = filteredFormList.map(data => ({

        //   icon:'https://dreamboard-dynamic.s3.ap-south-1.amazonaws.com/public/Climaveneta/Live+Contract/liveContract.png',
        //   name: data[0],
        //   job: data[1],
        //   avgEarnings: new Date(data[3] *1000).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),  // Handle cases where values may be empty
        //   totalEarnings: data[5] || '',
        //   online:''
        // }));

        // console.log("CARDS ON FORMLIST:",this.cards.length)
        // this.cdr.detectChanges();
    }   , 1000);
  }
    
  async openModal() {
    return await this.modalComponent.open();
  }
  
}
