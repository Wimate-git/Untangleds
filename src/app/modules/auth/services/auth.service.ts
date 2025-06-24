import { Injectable, OnDestroy } from '@angular/core';
import { Observable, BehaviorSubject, of, Subscription } from 'rxjs';
import { map, catchError, switchMap, finalize } from 'rxjs/operators';
import { UserModel } from '../models/user.model';
import { AuthModel } from '../models/auth.model';
import { AuthHTTPService } from './auth-http';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
// import { Auth } from '@aws-amplify/auth';
import { AuthenticationDetails, CognitoRefreshToken, CognitoUser, CognitoUserPool } from 'amazon-cognito-identity-js';
// import { UserDetails } from '../models/user-details';
import Amplify from '@aws-amplify/core';

import { signIn, type SignInInput } from 'aws-amplify/auth';
import { APIService } from 'src/app/API.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';

export type UserType = UserModel | undefined;

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {


  private sessionTimer: any;

  private userPool = new CognitoUserPool({
    UserPoolId: 'ap-south-1_aaPSwPS14', // Your User Pool ID
    ClientId: '42pb85v3sv84jdrfi1rub7a4e5', // Your Client ID
  });


  getSessionCustom(username: string, password: string){
    const authenticationData = {
      Username: username.toLowerCase(),
      Password: password,
    };

    const authenticationDetails = new AuthenticationDetails(authenticationData);
    const cognitoUser = new CognitoUser({
      Username: username.toLowerCase(),
      Pool: this.userPool,
    });

    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: (result:any) => {

        console.log("Result for session is here ",result);

        const accessToken = result.getAccessToken().getJwtToken();
        const idToken = result.idToken.jwtToken;
        const refreshToken = result.refreshToken.token

        // Store tokens
        // localStorage.setItem('accessToken', accessToken);
        // localStorage.setItem('idToken', idToken);
        // localStorage.setItem('refreshToken', refreshToken);
        // localStorage.setItem('username', username.toLowerCase());

          // Store the session tokens if needed for later use
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('idToken', idToken);
          localStorage.setItem('refreshToken', refreshToken);


         // Start session timer
          // this.startSessionTimer(result.getAccessToken().getExpiration());

          // console.log('Successfully logged in', result);

        // Start session timer
        // this.startSessionTimer();

        // console.log('Successfully logged in', result);
      },
      onFailure: (err) => {
        // alert(err);
      },
    });
  }




  checkSession() {
    
    console.log("Session is triggered");
    
    const cognitoUser = this.userPool.getCurrentUser();
    console.log("cognitoUser session details are here ", cognitoUser);
    
    if (cognitoUser != null) {
      cognitoUser.getSession((err: any, session: any) => {
        if (err) {
          console.log("Error logging session ", err);
          this.logout();
          return;
        }
        
        // Check if session is valid
        if (session.isValid()) {
          console.log("Session is valid", session);
          
          // Add check for refresh token expiration
          const refreshToken = localStorage.getItem('refreshToken');
          if (!refreshToken) {
            console.log("No refresh token found");
            this.logout();
            cognitoUser.signOut();
            document.location.reload();
            this.router.navigate(['auth/login']);
            return;
          }
          
          // Check token expiration time
          const currentTime = Math.floor(Date.now() / 1000);
          const expirationTime = session.getAccessToken().getExpiration();
          console.log("Token expires at: ", expirationTime, "Current time: ", currentTime);
          
          // If token is close to expiring, try to refresh it
          if (expirationTime - currentTime < 300) { // 5 minutes buffer
            this.refreshSession(cognitoUser);
          }
        } else {
          console.log("Session is invalid");
          this.logout();
          cognitoUser.signOut();
          document.location.reload();
          this.router.navigate(['auth/login']);
        }
      });
    } else {
      this.logout();
      // this.router.navigate(['auth/login']);
      document.location.reload();
    }
  }
  
  async refreshSession(cognitoUser: any) {
    const refreshTokenValue = localStorage.getItem('refreshToken');
    
    if (!refreshTokenValue) {
      console.log("No refresh token found");
      this.logout();
      cognitoUser.signOut();
      document.location.reload();
      this.router.navigate(['auth/login']);
      return;
    }
    
    const refreshToken = new CognitoRefreshToken({RefreshToken: refreshTokenValue});
    
    cognitoUser.refreshSession(refreshToken, async (err: any, session: any) => {
      if (err) {


        await Swal.fire({
          // toast: true,
          position: 'center',
          icon: 'warning',
          title: `Session expired! Please re-login.`,
          showConfirmButton: true,
          timer: 5000,
          timerProgressBar: true,
        }).then((err)=>{
          console.log("Error refreshing token: ", err);
          this.logout();
          cognitoUser.signOut();
          document.location.reload();
          this.router.navigate(['auth/login']);
          return
        });



        // console.log("Error refreshing token: ", err);
        // this.logout();
        // cognitoUser.signOut();
        // document.location.reload();
        // this.router.navigate(['auth/login']);
        // return;
      }
      
      // Update tokens in session storage
      const accessToken = session.getAccessToken().getJwtToken();
      const idToken = session.getIdToken().getJwtToken();
      
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('idToken', idToken);
      
      console.log("Token refreshed successfully");
    });
  }

  // startSessionTimer(expirationTime: number) {

  //   console.log("expiration Time is here ",expirationTime);

  //   const timeoutDuration = (expirationTime * 1000) - Date.now() - 60000; // 60 seconds before expiration
  
  //   setTimeout(() => {
  //     this.refreshSession();
  //   }, timeoutDuration);
  // }


 
// refreshSession() {
//   const refreshTokenValue = localStorage.getItem('refreshToken');
//   const username = localStorage.getItem('username'); // Ensure you have stored the username after login

//   if (refreshTokenValue && username) {
//     const cognitoUser = new CognitoUser({
//       Username: username.toLowerCase(),
//       Pool: this.userPool,
//     });

//     const refreshToken = new CognitoRefreshToken({ RefreshToken: refreshTokenValue });

//     cognitoUser.refreshSession(refreshToken, (err, session) => {
//       if (err) {
//         console.error(err);
//         this.signOut(); // Sign out if refresh fails
//         return;
//       }

//       // Store new tokens
//       const newAccessToken = session.getAccessToken().getJwtToken();
//       const newIdToken = session.idToken.jwtToken;
//       const newRefreshToken = session.refreshToken.token;

//       localStorage.setItem('accessToken', newAccessToken);
//       localStorage.setItem('idToken', newIdToken);
//       localStorage.setItem('refreshToken', newRefreshToken);

//       // Restart session timer
//       this.startSessionTimer(session.getAccessToken().getExpiration());

//       console.log('Session refreshed successfully');
//     });
//   } else {
//     console.error('No refresh token found');
//     this.signOut(); // Sign out if no refresh token is found
//   }
// }

  private clearSession() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('idToken');
    clearTimeout(this.sessionTimer);
  }


  signOut() {
    const username = localStorage.getItem('username');
    if (username) {
      const cognitoUser = new CognitoUser({
        Username: username,
        Pool: this.userPool,
      });
  
      cognitoUser.signOut();
      localStorage.removeItem('accessToken');
      localStorage.removeItem('idToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('username');
  
      console.log('User signed out due to session expiration');
      // Optionally redirect or notify the user
    }
  }


  loggedIn: boolean;
  signIn(username: string, password: string):Promise<CognitoUser | any>{
    console.log("real sign from auth sign",)
    return new Promise((resolve, reject) => {

     signIn({ username, password })
     .then(async(user: CognitoUser | any) => {
       this.loggedIn = true;
       resolve(user);
     }).catch((error: any) => reject(error));
    });
  }
  // private fields
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/
  private authLocalStorageToken = `${environment.appVersion}-${environment.USERDATA_KEY}`;

  // public fields
  currentUser$: Observable<UserType>;
  isLoading$: Observable<boolean>;
  currentUserSubject: BehaviorSubject<UserType>;
  isLoadingSubject: BehaviorSubject<boolean>;

  get currentUserValue(): UserType {
    return this.currentUserSubject.value;
  }

  set currentUserValue(user: UserType) {
    this.currentUserSubject.next(user);
  }

  constructor(
    private authHttpService: AuthHTTPService,
    private router: Router,
    private api:APIService,
    private toastr: MatSnackBar,
  ) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.currentUserSubject = new BehaviorSubject<UserType>(undefined);
    this.currentUser$ = this.currentUserSubject.asObservable();
    this.isLoading$ = this.isLoadingSubject.asObservable();
    const subscr = this.getUserByToken().subscribe();
    this.unsubscribe.push(subscr);
  }

  // public methods
  login(email: string, password: string): Observable<UserType> {
    this.isLoadingSubject.next(true);
    return this.authHttpService.login(email, password).pipe(
      map((auth: AuthModel) => {
        const result = this.setAuthFromLocalStorage(auth);
        return result;
      }),
      switchMap(() => this.getUserByToken()),
      catchError((err) => {
        console.error('err', err);
        return of(undefined);
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  logout() {
    localStorage.removeItem(this.authLocalStorageToken);
    localStorage.removeItem('userAttributes');
    localStorage.removeItem('permissionDetails');
    localStorage.clear()
    this.router.navigate(['/auth/login'], {
      queryParams: {},
    });
  }

  getUserByToken(): Observable<UserType> {
    const auth = this.getAuthFromLocalStorage();
    if (!auth || !auth.authToken) {
      return of(undefined);
    }

    this.isLoadingSubject.next(true);
    return this.authHttpService.getUserByToken(auth.authToken).pipe(
      map((user: UserType) => {
        if (user) {
          this.currentUserSubject.next(user);
        } else {
          this.logout();
        }
        return user;
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  // need create new user then login
  registration(user: UserModel): Observable<any> {
    this.isLoadingSubject.next(true);
    return this.authHttpService.createUser(user).pipe(
      map(() => {
        this.isLoadingSubject.next(false);
      }),
      switchMap(() => this.login(user.email, user.password)),
      catchError((err) => {
        console.error('err', err);
        return of(undefined);
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  forgotPassword(email: string): Observable<boolean> {
    this.isLoadingSubject.next(true);
    return this.authHttpService
      .forgotPassword(email)
      .pipe(finalize(() => this.isLoadingSubject.next(false)));
  }

  // private methods
  private setAuthFromLocalStorage(auth: AuthModel): boolean {
    // store auth authToken/refreshToken/epiresIn in local storage to keep user logged in between page refreshes
    if (auth && auth.authToken) {
      localStorage.setItem(this.authLocalStorageToken, JSON.stringify(auth));
      return true;
    }
    return false;
  }

  private getAuthFromLocalStorage(): AuthModel | undefined {
    try {
      const lsValue = localStorage.getItem(this.authLocalStorageToken);
      if (!lsValue) {
        return undefined;
      }

      const authData = JSON.parse(lsValue);
      return authData;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
