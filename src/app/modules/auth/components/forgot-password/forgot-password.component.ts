import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { filter, first } from 'rxjs/operators';
import { AuthenticationDetails, CognitoUser, CognitoUserAttribute, CognitoUserPool } from 'amazon-cognito-identity-js';
import Swal from 'sweetalert2';
import { SharedService } from 'src/app/pages/shared.service';
import { APIService } from 'src/app/API.service';
import { Router } from '@angular/router';
import { DynamicApiService } from 'src/app/pages/dynamic-api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuditTrailService } from 'src/app/pages/services/auditTrail.service';

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
  passwordChangedMobileFlag = false 

  // private fields
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/
  lookup_All_User: any = [];
  filterUser: any = []
  selectedUser: any;
  errorForInvalidName: any = '';
  restrictMobileProvision: any;
  constructor(private fb: FormBuilder, private authService: AuthService,
    private cd:ChangeDetectorRef,private api:APIService, private router:Router,private DynamicApi:DynamicApiService,private toast:MatSnackBar,  private auditTrail:AuditTrailService) {
    this.isLoading$ = this.authService.isLoading$;
  }

  ngOnInit(): void {

    //For Mobile login provisions provided
    this.restrictMobileProvision = localStorage.getItem('restrictMobileProvision')
    console.log("this.restrictMobileProvision Forgot component",this.restrictMobileProvision);


    this.initForm();

    this.initialize_form()

 

    this.cd.detectChanges()
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

  if(authuser == undefined || authuser == '' || authuser == undefined){
    return Swal.fire({
      title: 'Error',
      text: 'Please enter Username/Email to continue.',
      icon: 'error',
      confirmButtonText: 'Okay'
    });
  }



  const result = await this.fetchAllUsersData(1) 

  this.filterUser = result.filter((item:any)=>item.P3 == authuser || item.P1 == authuser)

  console.log("Filtered user is ",this.filterUser);

  if(this.filterUser && this.filterUser[0] && this.filterUser[0].P2){
    this.auditTrail.getFormInputData('SYSTEM_AUDIT_TRAIL', this.filterUser[0].P2)
  }


  if(authuser.includes('@')){
   
    if(this.filterUser.length == 1){
      authuser = this.filterUser[0].P1
      this.selectedUser = this.filterUser[0].P1
    }
  }
  else{
    this.selectedUser = authuser.toLowerCase()
  }

  console.log("Selected user is here ",this.selectedUser);
  
  if(this.selectedUser == undefined || this.selectedUser == null || this.selectedUser == ''){
    return  Swal.fire({
      title: 'Error',
      text: "User not found. Please check your username or email and try again.",  
      icon: 'error',
      confirmButtonText: 'Okay'
    });
  }


  //Get the client ID here

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



        try{
          const UserDetails = {
            "User Name": this.selectedUser,
            "Action": "Login",
            "Module Name": "Forgot Password",
            "Form Name": "Forgot Password",
            "Description": `${this.selectedUser} initiated a password reset request and received a reset code.`,
            "User Id": this.selectedUser,
            "Client Id": this.filterUser && this.filterUser[0].P2,
            "created_time": Date.now(),
            "updated_time": Date.now()
          }
      
          this.auditTrail.mappingAuditTrailData(UserDetails,this.filterUser && this.filterUser[0].P2)
          console.log("Audit trails for login created ");
        }
        catch(error){
          console.log("Error while creating audit trails ",error);
        }


        this.cd.detectChanges()
      },
      onFailure: (err) => {
        console.error('Error in forgotPassword: ', err);
        // Extract the error message from the error object if available
        const errorMessage = err.message || 'An error occurred while sending the verification code. Please check your input and try again.';


        if(errorMessage == 'Username/client id combination not found.'){
          Swal.fire({
            title: 'Error',
            text: "User not found. Please check your username or email and try again.",  
            icon: 'error',
            confirmButtonText: 'Okay'
          });
        }
        else{
        Swal.fire({
          title: 'Error',
          text: errorMessage,  
          icon: 'error',
          confirmButtonText: 'Okay'
        });
        }
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


      //Update cognito Custom attributes as well



      try{
        const UserDetails = {
          "User Name": this.selectedUser,
          "Action": "Login",
          "Module Name": "Forgot Password",
          "Form Name": "Forgot Password",
          "Description": `${this.selectedUser} successfully reset their password.`,
          "User Id": this.selectedUser,
          "Client Id": this.filterUser && this.filterUser[0].P2,
          "created_time": Date.now(),
          "updated_time": Date.now()
        }
    
        this.auditTrail.mappingAuditTrailData(UserDetails,this.filterUser && this.filterUser[0].P2)
        console.log("Audit trails for login created ");
      }
      catch(error){
        console.log("Error while creating audit trails ",error);
      }





      const tempResult = JSON.parse(result.metadata || '')

      tempResult.password = newPassword


      this.updateCognitoAttributes(this.selectedUser,newPassword);

      

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
        if(this.restrictMobileProvision != 'true'){
        this.router.navigate(['/auth/login']);
        }
        else{
          this.passwordChangedMobileFlag = true
          this.cd.detectChanges()
        }
      }
    })

   
    },
    onFailure: (err) => {
      console.error('Error confirming password: ', err);
      // Handle error
        // Display the error message in the Swal alert
        return Swal.fire({
          title: 'Error',
          text: err.message,  // Display the extracted error message
          icon: 'error',
          confirmButtonText: 'Okay'
        });
    }
  });
}



updateCognitoAttributes(username:any,password:any) {


  let authenticationData = {
    Username: username,
    Password: password,
  };

  let poolData = {
    UserPoolId: "ap-south-1_aaPSwPS14", // user pool id here
    ClientId: "42pb85v3sv84jdrfi1rub7a4e5"// client id here
  };

  let userPool = new CognitoUserPool(poolData);


  let poolDetails: any = {
    Username:username,
    Pool: userPool
  }



  let userData: any = {
    // "email": this.createUserField.get('email')?.value,
    // 'custom:userID': this.createUserField.value.userID,
    'custom:password':password,
    // 'custom:clientID': this.allUserDetails.clientID,
    // 'custom:companyID': this.allUserDetails.companyID,
    // 'custom:username': this.tempUpdateUser,
    // 'custom:description': this.createUserField.value.description,
    // 'custom:mobile': JSON.stringify(this.createUserField.value.mobile),
    // 'custom:mobile_privacy': this.createUserField.value.mobile_privacy,
    // // 'custom:admin': JSON.stringify(this.createUserField.value.admin),
    // // 'custom:user_type': JSON.stringify(this.createUserField.value.user_type),
    // 'custom:user_type': JSON.stringify(this.createUserField.value.user_type),
    // 'custom:enable_user': JSON.stringify(this.createUserField.value.enable_user == null ? false : this.createUserField.value.enable_user),
    // 'custom:disable_user': JSON.stringify(this.createUserField.value.disable_user == null ? false : this.createUserField.value.disable_user),
    // 'custom:alert_email': JSON.stringify(this.createUserField.value.alert_email == null ? false : this.createUserField.value.alert_email),
    // 'custom:alert_sms': JSON.stringify(this.createUserField.value.alert_sms == null ? false : this.createUserField.value.alert_sms),
    // 'custom:alert_telegram': JSON.stringify(this.createUserField.value.alert_telegram == null ? false : this.createUserField.value.alert_telegram),
    // 'custom:escalation_email': JSON.stringify(this.createUserField.value.escalation_email == null ? false : this.createUserField.value.escalation_email),
    // 'custom:escalation_sms': JSON.stringify(this.createUserField.value.escalation_sms == null ? false : this.createUserField.value.escalation_sms),
    // 'custom:escalation_telegram': JSON.stringify(this.createUserField.value.escalation_telegram == null ? false : this.createUserField.value.escalation_telegram),
    // 'custom:telegramID': JSON.stringify(this.createUserField.value.telegramID),
    // 'custom:permission_id': this.allUserDetails.permission_ID,
    // 'custom:defaultdevloc': this.createUserField.value.default_dev_loc,
    // "phone_number": (this.registrationForm.value.phone_number)
  }

  let cognitoUser = new CognitoUser(poolDetails);

  let authenticationDetails = new AuthenticationDetails(authenticationData);

  cognitoUser.authenticateUser(authenticationDetails, {
    onSuccess: function (result) {
      let accessToken = result.getAccessToken().getJwtToken();

      // console.log('after authenicated result', result);

      // console.log('accessToken after receiving result', accessToken);

      /* Use the idToken for Logins Map when Federating User Pools 
      with identity pools or when passing through an Authorization Header to an API Gateway Authorizer */
      //let idToken = result.idToken.jwtToken;
      let attributeList = [];
      for (let key in userData) {
        let attrData = {
          Name: key,
          Value: userData[key]
        }
        //console.log('attribute data', attrData)
        let attribute = new CognitoUserAttribute(attrData);
        attributeList.push(attribute);
      }
      // console.log('userData', userData);
      // console.log('attributeList', attributeList);
      //cognitoUser.getUserAttributes
      cognitoUser.updateAttributes(attributeList, (err, result) => {
        if (err) {
          console.log("\n\nUpdate Error: ", err, "\n\n");
        } else {
          console.log('after updating', result);
        }
      });
    },

    

    onFailure: function (err) {13419
      console.log("Cognito Error",err);

      if(err.message != 'User is disabled.'){
        Swal.fire(err.message)
        if(err.message == 'User is not confirmed.'){
          Swal.fire({
            icon: 'error',
            title: 'User is not confirmed!',
            text: 'User details weren\'t updated in Cognito.'
          });
        }
        else{
          Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: err.message
          });
        }
      }
    },

  });



}


checkName_asPassword(getPassword: Event) {
  const password = (getPassword.target as HTMLInputElement).value;

  const temp_Password = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*()_+[\]{};':"\\|,.<>?`~_-]).{6,}$/;
  this.errorForInvalidName = ''; // Clear previous error
  if (!temp_Password.test(password)) {
    this.confirmPassword.setErrors({ invalidForm: true });
      this.errorForInvalidName =
          "Password must be at least 6 characters long and include 1 number, 1 lowercase letter, 1 uppercase letter, and 1 special character.";
  }
  console.log(this.errorForInvalidName);
}

}
