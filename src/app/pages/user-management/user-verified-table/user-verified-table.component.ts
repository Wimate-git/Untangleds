import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DynamicApiService } from '../../dynamic-api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-verified-table',
  templateUrl: './user-verified-table.component.html',
  styleUrl: './user-verified-table.component.scss'
})
export class UserVerifiedTableComponent{
  unverifiedUsers: any[] = [];
  isModalOpen: boolean = false;


  constructor(private DynamicApi:DynamicApiService){}


 ngOnInit(){
  console.log("Unverified users are here ",this.unverifiedUsers);
 }  


 async resendVerification(userName: any) {


  const body = { "type": "cognitoServices",
    "event":{
      path: "/resendVerification",
      queryStringParameters: {
          email: "asadulla@wimate.in"
      },
      username:userName
    }
  }



  try {

    const response = await this.DynamicApi.getData(body);
   
    if(response){
      if(response.statusCode == 200){
        Swal.fire({
          position: "top-right",
          icon: "success",
          title: `Verification mail sent successfully `,
          showConfirmButton: false,
          timer: 1500,
        });
      }
      else{
        Swal.fire({
          position: "top-right",
          icon: "error",
          title: `Error sending mail`,
          showConfirmButton: false,
          timer: 1500,
        });
      }
    }

  } catch (error) {
    console.error('Error calling dynamic lambda:', error);
  }



  this.unverifiedUsers = this.unverifiedUsers.map((item: any) => {
    if (userName === item.username) {
      return { ...item, sentMail: true };
    }
    return item;
  });


}

}
