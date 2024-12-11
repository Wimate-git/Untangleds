import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';
import { filter, first } from 'rxjs/operators';
import { UserModel } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { getCurrentUser, signInWithRedirect, signOut } from 'aws-amplify/auth';
import { AuthenticationDetails, CognitoUser, CognitoUserPool } from 'amazon-cognito-identity-js';
import Swal from 'sweetalert2';
import { APIService } from 'src/app/API.service';
import { NgxSpinnerService } from 'ngx-spinner';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  // KeenThemes mock, change it to:
  defaultAuth: any = {
    email: '',
    password: '',
  };
  loginForm: FormGroup;
  hasError: boolean;
  returnUrl: string;
  isLoading$: Observable<boolean>;

  showPassword:boolean = false

  // private fields
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/
  userDetails: any;
  baseUrl:any;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private api:APIService,private spinner:NgxSpinnerService,
  ) {
    this.isLoading$ = this.authService.isLoading$;
    // redirect to home if already logged in
    if (this.authService.currentUserValue) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit(): void {
    this.initForm();
    // get return url from route parameters or default to '/'
    this.returnUrl =
      this.route.snapshot.queryParams['returnUrl'.toString()] || '/';


    const fullUrl = window.location.href
    this.baseUrl = new URL(fullUrl).origin

    // this.baseUrl = 'https://main.d171psdgt7n0kh.amplifyapp.com/'
  }


  onClick(){
    this.showPassword = !this.showPassword; 
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.loginForm.controls;
  }

  initForm() {
    this.loginForm = this.fb.group({
      email: [
        "",
        Validators.compose([
          Validators.required,
         // https://stackoverflow.com/questions/386294/what-is-the-maximum-length-of-a-valid-email-address
        ]),
      ],
      password: [
        "",
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
        ]),
      ],
    });
  }

  async submit() {


    let clientID = '';

    try {
        // Try to parse the value from localStorage
        const clientFetched = localStorage.getItem('clientFetched');
        if (clientFetched) {
            clientID = JSON.parse(clientFetched);  // Parsing only if the value is not null
        }
    } catch (error) {
        console.error('Error parsing clientFetched from localStorage:', error);
    }

    // Proceed with your logic
    console.log("Client ID in login is here", clientID);

    await signOut()
    .then(() => {
      console.log("Cognito signout ");
    })
    .catch(err => console.error(err));




    if(!navigator.onLine){
      return Swal.fire({
        title: 'Not connected to Internet',
        text: 'Please check your Internet connection and try again.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }


    if(this.loginForm.get('email')?.value == '' || this.loginForm.get('password')?.value == ''){
      return Swal.fire({
        title: '⚠️ Missing Information',
        text: 'Both username and password are required. Please fill in both fields and try again.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }

    console.log("Logged in user is here ",this.f.email.value);

    try {
      this.spinner.show()
      const user = await this.authService.signIn((this.f.email.value).toLowerCase(), this.f.password.value);

      this.authService.getSession((this.f.email.value).toLowerCase(), this.f.password.value)

      if(user.isSignedIn == false){
        this.spinner.hide()
        return Swal.fire({
          title: '⚠️ Incorrect Credentials',
          text: 'Username or Password is Incorrect please try again.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }

      localStorage.setItem('userAttributes','{}')

      try {
        const result:any = await this.api.GetMaster(`${(this.f.email.value).toLowerCase()}#user#main`, 1);
        if (result) {

          const metaData = JSON.parse(result.metadata)

          console.log(`result is here ${clientID} != ${metaData.clientID}`);

          if(this.baseUrl != 'https://untangled.cloudtesla.com' && this.baseUrl != 'http://localhost:4200' ){
            if(clientID != metaData.clientID && metaData.clientID != 'WIMATE_ADMIN'){
              this.spinner.hide();
              return Swal.fire({
                title: '⚠️ Client Mismatch',
                text: 'The username is not associated with this client ID and does not match the URL. Please ensure that you are logging in using the correct URL and credentials specific to your client.',
                icon: 'error',
                confirmButtonText: 'OK'
              });
            }
          }


            //Redirection logic is here 
            if(metaData && metaData.redirectionURL && metaData.redirectionURL != 'None'){
              this.returnUrl = metaData.redirectionURL
            }


          localStorage.setItem('userAttributes', JSON.stringify(metaData));

          if (result && result.metadata && result.metadata.profile_picture) {
            localStorage.setItem('profileImage', result.metadata.profile_picture)
          }
        }
      } catch (err) {
        console.error("Error in fetching the user ", user);
      }

    
      const loginCredentials = {
        username: this.f.email.value,
        password: this.f.password.value
      };
    
    
      this.hasError = false;
      const loginSubscr = this.authService
        .login('admin@demo.com', 'demo')
        .pipe(first())
        .subscribe((user: UserModel | undefined) => {
          if (user) {
            this.router.navigate([this.returnUrl]);
          } else {
            this.hasError = true;
          }
        });
      this.unsubscribe.push(loginSubscr);

      




     
    
      localStorage.setItem('loginDetails', JSON.stringify(loginCredentials));
    
      this.userDetails = JSON.parse(localStorage.getItem("userAttributes") || '{}');
      this.spinner.hide()
      console.log("User details are here ", this.userDetails);
    
    } catch (error) {
      this.spinner.hide()
      console.error("Login error: ", error);
      this.hasError = true;

      return Swal.fire({
        title: '⚠️ Incorrect Credentials',
        text: 'Username or Password is Incorrect please try again.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
    
    // catch(err:any){
     
      
      
    //   console.log("Error in Log in");
    // }
   
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
