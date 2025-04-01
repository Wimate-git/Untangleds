import { Component, input, Input, OnInit } from '@angular/core';
import { IconUserModel } from '../icon-user.model';
import { Router } from '@angular/router';
import { AuditTrailService } from 'src/app/pages/services/auditTrail.service'; 
import { APIService } from 'src/app/API.service';

@Component({
  selector: 'app-card2',
  templateUrl: './card2.component.html',
})
export class Card2Component implements OnInit{
  @Input() componentSource: string = '';
  @Input() icon: string = '';
  @Input() badgeColor: string = '';
  @Input() status: string = '';
  @Input() statusColor: string = '';
  @Input() title: string = '';
  @Input() description: string = '';
  @Input() date: string = '';
  @Input() budget: string = '';
  @Input() progress: number = 50;
  @Input() online: string;
  @Input() formgroup: string =''
  @Input() updateUser: string = '';
  @Input() TileColor: string ='';
  @Input() Index: string ='';
  @Input() updatedTime:string ='';
  @Input() users: Array<IconUserModel> = [];
  @Input() icon_: { value: string; label: string; class1: string; class2: string };
 

  id: string;
  login_detail: any;
  loginDetail_string: any;
  client: any;
  user: any;
  groupFormResponse: any;
  groupForm: any;

  constructor(
    private router: Router, 
    private auditTrail: AuditTrailService,
    private api: APIService
  ) {}


  ngOnInit(): void {
    console.log("CARD2 LOAD")

    console.log("COMPONENT:",this.componentSource)

    this.login_detail = localStorage.getItem('userAttributes')

      this.loginDetail_string = JSON.parse(this.login_detail)
      console.log("AFTER JSON STRINGIFY", this.loginDetail_string)

      this.client = this.loginDetail_string.clientID
      this.user = this.loginDetail_string.username
      this.auditTrail.getFormInputData('SYSTEM_AUDIT_TRAIL', this.client)

  }

  async onStatusClick(data: { title: string; id: string }): Promise<void> {

    console.log("ID:", data.id)

    if(data.id == 'Calendar'){
      this.id = 'Calendar'
    }
    else{

    this.id = 'Forms'
    }

    // this.id = 'Calendar'

    console.log("ID:",this.id)


    if(this.componentSource == 'dashboard'){


      await this.api.GetMaster(this.client + "#formgroup#" + data.title + '#main', 1).then(async (result: any) => {

        this.groupFormResponse = JSON.parse(result.metadata)

        console.log("FORMGROUP MAIN:", this.groupFormResponse.formList)

        this.groupForm = this.groupFormResponse.formList

      }).catch((error)=>{

        console.log("ERROR:",error)

      })

      const UserDetails = {
        "User Name": this.user,
        "Action": "View",
        "Module Name": "Dashboard",
        "Form Name": "Dashboard Group",
        "Description": `Record ${data.title} is Viewed`,
        "User Id": this.user,
        "Client Id": this.client,
        "created_time": Date.now(),
        "updated_time": Date.now()
      }

      this.auditTrail.mappingAuditTrailData(UserDetails,this.client)


      if(this.groupForm.length === 1){

        this.router.navigate([`view-dreamboard/${this.id}/${this.groupForm[0] }`]);
      }
      else{
        this.router.navigate([`dashboard/dashboardFrom/${this.id}/${data.title}`]);
      }


    }
    else if(this.componentSource == 'dashboardForm'){

      const UserDetails = {
        "User Name": this.user,
        "Action": "View",
        "Module Name": "DashboardForm",
        "Form Name": "DashboardForm",
        "Description": `Record ${data.title} is Viewed`,
        "User Id": this.user,
        "Client Id": this.client,
        "created_time": Date.now(),
        "updated_time": Date.now()
      }

      this.auditTrail.mappingAuditTrailData(UserDetails,this.client)


      

      this.router.navigate([`view-dreamboard/${this.id}/${data.title}`]);
     

      // console.log('NAVIGATE:',title)
    }

  }

  
}
