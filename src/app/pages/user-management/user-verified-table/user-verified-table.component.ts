import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DynamicApiService } from '../../dynamic-api.service';
import Swal from 'sweetalert2';
import { AuditTrailService } from '../../services/auditTrail.service';

@Component({
  selector: 'app-user-verified-table',
  templateUrl: './user-verified-table.component.html',
  styleUrl: './user-verified-table.component.scss'
})
export class UserVerifiedTableComponent{
  unverifiedUsers: any[] = [];
  isModalOpen: boolean = true;
  @Input() username:any;
  @Input() SK_clientID:any;




  constructor(private DynamicApi:DynamicApiService,private auditTrail:AuditTrailService,public modal: NgbActiveModal,){}


 ngOnInit(){
  console.log("Unverified users are here ",this.unverifiedUsers);
 }  


 async resendCredentials(userName:any){

  const targetUser = this.unverifiedUsers.find((item:any)=>item.username == userName)

  const body = { type: "userVerify", username:targetUser.username,name:targetUser.password,email:targetUser.email};


  this.DynamicApi.sendData(body).subscribe(response => {
    console.log('Response from Lambda:', response);

    if(response){
        Swal.fire({
          position: "top-right",
          icon: "success",
          title: `Credentails mail sent successfully `,
          showConfirmButton: false,
          timer: 1500,
        });


        this.unverifiedUsers = this.unverifiedUsers.map((item: any) => {
          if (userName === item.username) {
            return { ...item, sentCredentailMail: true };
          }
          return item;
        });

    }
      
  }, error => {
    console.error('Error calling dynamic lambda:', error);
  });
 }


 async resendVerification(userName: any) {


  const body = { "type": "cognitoServices",
    "event":{
      path: "/resendVerification",
      queryStringParameters: {
          email: "dummy@wimate.in"
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


        try{
          const UserDetails = {
            "User Name": this.username,
            "Action": "View",
            "Module Name": "User Management",
            "Form Name": 'User Management',
           "Description": `Verification mail sent successfully to ${userName}`,
            "User Id": this.username,
            "Client Id": this.SK_clientID,
            "created_time": Date.now(),
            "updated_time": Date.now()
          }
      
          this.auditTrail.mappingAuditTrailData(UserDetails,this.SK_clientID)
        }
        catch(error){
          console.log("Error while creating audit trails ",error);
        }
    
    









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



page: number = 1;
pageSize: number = 10; // You can change this to show more rows per page

get paginatedUsers() {
  const start = (this.page - 1) * this.pageSize;
  return this.unverifiedUsers.slice(start, start + this.pageSize);
}

get totalPages() {
  return Math.ceil(this.unverifiedUsers.length / this.pageSize);
}

nextPage() {
  if (this.page < this.totalPages) {
    this.page++;
  }
}

previousPage() {
  if (this.page > 1) {
    this.page--;
  }
}


}
