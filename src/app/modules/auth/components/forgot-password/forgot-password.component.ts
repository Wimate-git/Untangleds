import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { filter, first } from 'rxjs/operators';
import { CognitoUser, CognitoUserPool } from 'amazon-cognito-identity-js';
import Swal from 'sweetalert2';
import { SharedService } from 'src/app/pages/shared.service';
import { APIService } from 'src/app/API.service';
import { Router } from '@angular/router';
import { DynamicApiService } from 'src/app/pages/dynamic-api.service';
import { MatSnackBar } from '@angular/material/snack-bar';

enum ErrorStates {
  NotSubmitted,
  HasError,
  NoError,
}

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm: FormGroup;
  errorState: ErrorStates = ErrorStates.NotSubmitted;
  errorStates = ErrorStates;
  isLoading$: Observable<boolean>;

  confirmPassword: FormGroup;
  showVerificationFields = false;

  // private fields
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/
  lookup_All_User: any = [];
  filterUser: any = []
  selectedUser: any;
  constructor(private fb: FormBuilder, private authService: AuthService,
    private cd:ChangeDetectorRef,private api:APIService, private router:Router,private DynamicApi:DynamicApiService,private toast:MatSnackBar) {
    this.isLoading$ = this.authService.isLoading$;
  }

  ngOnInit(): void {
    this.initForm();

    this.initialize_form()
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.forgotPasswordForm.controls;
  }


  initialize_form(){
    this.confirmPassword = this.fb.group({
      verificationCode: ['',Validators.required],
      newPassword: ['',Validators.required],
      confirmPassword:['',Validators.required]
    });
  }

  initForm() {
    this.forgotPasswordForm = this.fb.group({
      email: [
        '',
        Validators.compose([
          Validators.required
       // https://stackoverflow.com/questions/386294/what-is-the-maximum-length-of-a-valid-email-address
        ]),
      ],
    });
  }

  submit() {
    this.errorState = ErrorStates.NotSubmitted;
    const forgotPasswordSubscr = this.authService
      .forgotPassword(this.f.email.value)
      .pipe(first())
      .subscribe((result: boolean) => {
        this.errorState = result ? ErrorStates.NoError : ErrorStates.HasError;
      });
    this.unsubscribe.push(forgotPasswordSubscr);
  }

  fetchAllUsersData(sk:any):any {
    console.log("I am called Bro");
    
    return new Promise((resolve, reject) => {
      this.api.GetMaster("#user" + "#All", sk)
        .then(response => {
          if (response && response.options) {
            // Check if response.options is a string
            if (typeof response.options === 'string') {
              let data = JSON.parse(response.options);
              console.log("d1 =", data);
              
              if (Array.isArray(data)) {
                const promises = []; // Array to hold promises for recursive calls
  
                for (let index = 0; index < data.length; index++) {
                  const element = data[index];
  
                  if (element !== null && element !== undefined) {
                    // Extract values from each element and push them to lookup_data_user
                    const key = Object.keys(element)[0]; // Extract the key (e.g., "L1", "L2")
                    const { P1, P2, P3, P4, P5 } = element[key]; // Extract values from the nested object
                    this.lookup_All_User.push({ P1, P2, P3, P4, P5}); // Push an array containing P1, P2, P3, P4, P5, P6
                    console.log("d2 =", this.lookup_All_User);
                  } else {
                    break;
                  }
                }
  
                // Sort the lookup_data_user array based on P5 values in descending order
                this.lookup_All_User.sort((a: { P5: number; }, b: { P5: number; }) => b.P5 - a.P5);
                console.log("Lookup sorting", this.lookup_All_User);
  
                // Continue fetching recursively
                promises.push(this.fetchAllUsersData(sk + 1)); // Store the promise for the recursive call
                
                // Wait for all promises to resolve
                Promise.all(promises)
                  .then(() => resolve(this.lookup_All_User)) // Resolve with the final lookup data
                  .catch(reject); // Handle any errors from the recursive calls
              } else {
                console.error('Invalid data format - not an array.');
                reject(new Error('Invalid data format - not an array.'));
              }
            } else {
              console.error('response.options is not a string.');
              reject(new Error('response.options is not a string.'));
            }
          } else {
            console.log("All the users are here", this.lookup_All_User);
            resolve(this.lookup_All_User); // Resolve with the current lookup data
          }
        })
        .catch(error => {
          console.error('Error:', error);
          reject(error); // Reject the promise on error
        });
    });
  }





 
async forgotCognitoPass() {

  this.filterUser = []

  var authuser = this.forgotPasswordForm.get('email')?.value;

  if(authuser.includes('@')){
    const result = await this.fetchAllUsersData(1) 
    this.filterUser = result.filter((item:any)=>item.P3 == authuser)

    if(this.filterUser.length == 1){
      authuser = this.filterUser[0].P1
      this.selectedUser = this.filterUser[0].P1
    }
  }
  else{
    this.selectedUser = authuser.toLowerCase()
  }

  console.log("Entered Auth is here ", authuser);

  const poolData = new CognitoUserPool({
      UserPoolId: 'ap-south-1_aaPSwPS14', // Your User Pool ID
      ClientId: '42pb85v3sv84jdrfi1rub7a4e5', // Your Client ID
  });

  // Setup cognitoUser first
  const cognitoUser = new CognitoUser({
      Username: this.selectedUser,
      Pool: poolData
  });


     // Start the forgot password process
     cognitoUser.forgotPassword({
      onSuccess: () => {
        console.log('Call to forgotPassword successful');
        this.showVerificationFields = true; // Show the verification fields

        this.cd.detectChanges()
      },
      onFailure: (err) => {
        console.error('Error in forgotPassword: ', err);
        // Handle the error appropriately
         // Handle the error appropriately
        Swal.fire({
          title: 'Error',
          text: 'An error occurred while sending the verification code. Please check your input and try again.',
          icon: 'error',
          confirmButtonText: 'Okay'
        });
      }
    });
}



async confirmNewPassword() {
  const authuser = this.selectedUser;
  const verificationCode = this.confirmPassword.get('verificationCode')?.value;
  const newPassword = this.confirmPassword.get('newPassword')?.value;
  const confirmPassword = this.confirmPassword.get('confirmPassword')?.value;

 // Check if new password and confirm password match
  if (newPassword !== confirmPassword) {
    return Swal.fire({
        title: 'Password Mismatch',
        text: 'The new password and confirm password do not match. Please try again.',
        icon: 'error',
        confirmButtonText: 'Okay'
    });
  }

  const poolData = new CognitoUserPool({
    UserPoolId: 'ap-south-1_aaPSwPS14', // Your User Pool ID
    ClientId: '42pb85v3sv84jdrfi1rub7a4e5', // Your Client ID
  });

  const cognitoUser = new CognitoUser({
    Username: authuser,
    Pool: poolData
  });

  // Call to confirm the new password
  cognitoUser.confirmPassword(verificationCode, newPassword, {
    onSuccess: async () => {
      console.log('Password confirmed!');


      const result = await this.api.GetMaster(this.selectedUser+'#user#main',1)

      console.log("Result is here for getting data ",result);

      const tempResult = JSON.parse(result.metadata || '')

      tempResult.password = newPassword
      

      const tempObj = {
        PK:this.selectedUser+'#user#main',
        SK:1,
        metadata:JSON.stringify(tempResult)
      };

      await this.api.UpdateMaster(tempObj)
      // Notify user of success
      this.showVerificationFields = false; // Hide the verification fields

      const body = { type: "forgot_password", username:this.selectedUser,email:tempResult.email,password:confirmPassword};


      this.DynamicApi.sendData(body).subscribe((response: any) => {
        console.log('Response from Lambda:', response);
  
  
        this.toast.open("Mail Sent Successfully", " ", {
  
          duration: 2000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
          //   //panelClass: ['blue-snackbar']
        })
  
  
      }, (error: any) => {
        console.error('Error calling dynamic lambda:', error);
      });

    
      return Swal.fire({
        title: 'Success!',
        text: `The password for ${this.selectedUser} has been changed successfully.`,
        icon: 'success',
        confirmButtonText: 'Okay'
    }).then((result)=>{
      if(result.isConfirmed){
        this.router.navigate(['/auth/login']);
      }
    })

   
    },
    onFailure: (err) => {
      console.error('Error confirming password: ', err);
      // Handle error
    }
  });
}

}
