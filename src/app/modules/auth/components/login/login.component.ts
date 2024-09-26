import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { UserModel } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { getCurrentUser, signOut } from 'aws-amplify/auth';
import { CognitoUser } from 'amazon-cognito-identity-js';
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
    email: 'admin@demo.com',
    password: 'demo',
  };
  loginForm: FormGroup;
  hasError: boolean;
  returnUrl: string;
  isLoading$: Observable<boolean>;

  // private fields
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/
  userDetails: any;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private api:APIService,private spinner:NgxSpinnerService
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
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.loginForm.controls;
  }

  initForm() {
    this.loginForm = this.fb.group({
      email: [
        this.defaultAuth.email,
        Validators.compose([
          Validators.required,
          Validators.email,
          Validators.minLength(3),
          Validators.maxLength(320), // https://stackoverflow.com/questions/386294/what-is-the-maximum-length-of-a-valid-email-address
        ]),
      ],
      password: [
        this.defaultAuth.password,
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
        ]),
      ],
    });
  }

  async submit() {

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

    // try{
    //   await this.authService.signIn(this.f.email.value, this.f.password.value)
    //   .then(async(user: CognitoUser | any) => {
    //     console.log("Successfully  logged in ",user);

    //     let loginCredentials = {
    //       "username": this.f.email.value,
    //       "password": this.f.password.value
    //     }


    //     try{
    //       await this.api.GetMaster(`${user}#user#main`,1).then((result:any)=>{
    //         if(result){
    //           console.log("Result is here ",result);
    //           localStorage.setItem('userAttributes', JSON.stringify(JSON.parse(result.metadata)));
    //         }
    //       })
    //     }
    //     catch(err){
    //       console.error("Error in fetching the user ",user);
    //     }

    
    //     localStorage.setItem('loginDetails', JSON.stringify(loginCredentials));
    //     // localStorage.setItem('userAttributes', JSON.stringify(user));

    //     this.userDetails = JSON.parse(JSON.parse(JSON.stringify(localStorage.getItem("userAttributes"))));
   
    //     console.log("User details are here ",this.userDetails);

    //        this.hasError = false;
    //       const loginSubscr = this.authService
    //         .login('admin@demo.com', 'demo')
    //         .pipe(first())
    //         .subscribe((user: UserModel | undefined) => {
    //           if (user) {
    //             this.router.navigate([this.returnUrl]);
    //           } else {
    //             this.hasError = true;
    //           }
    //         });
    //       this.unsubscribe.push(loginSubscr);
           
    //   })
    // }
    try {
      this.spinner.show()
      const user = await this.authService.signIn(this.f.email.value, this.f.password.value);
      console.log("Successfully logged in ", user);
    
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


      try {
        const result:any = await this.api.GetMaster(`${this.f.email.value}#user#main`, 1);
        if (result) {
          console.log("Result is here ", result);
          localStorage.setItem('userAttributes', JSON.stringify(JSON.parse(result.metadata)));
        }
      } catch (err) {
        console.error("Error in fetching the user ", user);
      }
    
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
