import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
import { SharedService } from 'src/app/pages/shared.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard  {
  constructor(private authService: AuthService,private getPermission:SharedService,private router:Router) {}

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    console.log(route,"\n", state)
    const currentUser = this.authService.currentUserValue;
    if (currentUser) {
      // logged in so return true
      return true;
    }

    console.log("Auth guard is called ",route);


    if(route.queryParams && Object.keys(route.queryParams).length > 0){
      console.log("Query Params found ",route.queryParams)
      
      const test= await this.getPermission.submit(route.queryParams.uID,route.queryParams.pass)
      console.log(test)
      if(test===true){
        console.log(state.url)
        this.getPermission.setValue(false);
        return true
      }
    }

    // not logged in so redirect to login page with the return url
    this.authService.logout();
    return false;
  }
}
