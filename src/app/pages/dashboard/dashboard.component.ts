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
  users: any;
  formList: any[]=[];
  cards:any[]=[]
  cards_:any[]=[]
  isViewingCard2: boolean;

  
  constructor(
    private api: APIService,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit(): Promise<void> {
    this.login_detail = localStorage.getItem('userAttributes')

    this.loginDetail_string = JSON.parse(this.login_detail) 
    console.log("AFTER JSON STRINGIFY",this.loginDetail_string)

    this.client=this.loginDetail_string.clientID
    this.users=this.loginDetail_string.username

    // await this.api.GetMaster(this.client + "#formgroup#lookup", 1).then((result:any)=>{
    //   if (result) {
    //     const helpherObj = JSON.parse(result.options)

    //     this.formList = helpherObj.map((item: any) => item)
        
    //     console.log("FORMS LIST:",this.formList)

    //     this.cards = this.formList.map(data => ({
    //       // avatar:'https://dreamboard-dynamic.s3.ap-south-1.amazonaws.com/public/Climaveneta/Live+Contract/liveContract.png',
    //       // avatar:'https://dreamboard-dynamic.s3.ap-south-1.amazonaws.com/public/Climaveneta/Live+Contract/test.png',
    //       icon:'https://dreamboard-dynamic.s3.ap-south-1.amazonaws.com/public/Climaveneta/Live+Contract/liveContract.png',
    //       name: data[0],
    //       job: data[1],
    //       avgEarnings: new Date(data[3] *1000).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),  // Handle cases where values may be empty
    //       totalEarnings: data[5] || '',
    //       online:''
    //     }));

    //     console.log("CARDS ON FORMLIST:",this.cards.length)
    //     this.cdr.detectChanges();

    //   }
    // })

    
    console.log("CARDS ON LOAD:",this.cards)

    await this.api.GetMaster(this.client + "#dynamic_form#lookup", 1).then((result: any) => {
      if (result) {
        const helpherObj = JSON.parse(result.options)

        this.formList = helpherObj.map((item: any) => item)
        
        console.log("FORMS LIST:",this.formList)

        this.cards = this.formList.map(data => ({
          // avatar:'https://dreamboard-dynamic.s3.ap-south-1.amazonaws.com/public/Climaveneta/Live+Contract/liveContract.png',
          // avatar:'https://dreamboard-dynamic.s3.ap-south-1.amazonaws.com/public/Climaveneta/Live+Contract/test.png',
          icon:'https://dreamboard-dynamic.s3.ap-south-1.amazonaws.com/public/Climaveneta/Live+Contract/liveContract.png',
          name: data[0],
          job: data[1],
          avgEarnings: new Date(data[3] *1000).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),  // Handle cases where values may be empty
          totalEarnings: data[5] || '',
          online:''
        }));

        console.log("CARDS ON FORMLIST:",this.cards.length)
        this.cdr.detectChanges();

      }
    })
  }

  async openModal() {
    return await this.modalComponent.open();
  }
}
