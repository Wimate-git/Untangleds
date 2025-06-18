import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
import { SharedService } from 'src/app/pages/shared.service';
import { EncriptionServiceService } from 'src/app/pages/encription-service.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard {
  constructor(private authService: AuthService, private getPermission: SharedService, private router: Router, private encryption: EncriptionServiceService) { }

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    console.log(route, "\n", state)
    const currentUser = this.authService.currentUserValue;
    if (currentUser) {
      // logged in so return true
      return true;
    }

    console.log("Auth guard is called ", route);


    if (route.queryParams && Object.keys(route.queryParams).length > 0) {
      console.log("Query Params found ", route.queryParams)

      const test = await this.getPermission.submit(route.queryParams.uID, route.queryParams.pass)
      console.log(test)
      if (test === true) {
        console.log(state.url)
        this.getPermission.setValue(false);
        return true
      } else {
        this.authService.logout();
        return false;
      }
    } else {


      try {
        const currentURL = window.location.href//'/view-dreamboard/Forms/OT Details&recordId=%22%7B%5C%22type%5C%22%3A%5C%22view%5C%22%2C%5C%22fields%5C%22%3A%7B%7D%2C%5C%22mainTableKey%5C%22%3A%5C%221750036637682%5C%22%7D%22&isFullScreen=true&uID=U2FsdGVkX1%2B4WDOok3SsQ7LEuYFLl0FgL%2Fwg4nUukxs%3D&pass=U2FsdGVkX1%2F1nW6A60REvnHASB68uQo2RkMsa2%2BhcR8%3D';


        // Find the part after the first &
        const indexOfFirstParam = currentURL.indexOf('&');
        if (indexOfFirstParam === -1) throw new Error("No parameters found in URL");

        const queryString = currentURL.substring(indexOfFirstParam + 1); // everything after the first &
        const params = new URLSearchParams(queryString);

        console.log(params);

        const uID = params.get('uID');
        const pass = params.get('pass');

        console.log('uID :>> ', uID);
        console.log('pass :>> ', pass);

        let userID = this.encryption.decryptValue(decodeURIComponent(uID ?? ''))
        console.log('decrypted :>>user ', userID);
        let passWord = this.encryption.decryptValue(decodeURIComponent(pass ?? ''))
        console.log('decrypted :>>pass ', passWord);

        if (userID && passWord) {

          const test = await this.getPermission.submit(userID, passWord)
          console.log('result from authguard', test)
          if (test === true) {
            console.log(state.url)
            this.getPermission.setValue(false);
            return true;
          } else {
            this.authService.logout();
            return false;
          }

        }


      } catch (error) {

        console.error('Error extracting raw params:', error);
        this.authService.logout();
        return false;
      }

    }

    // not logged in so redirect to login page with the return url
    this.authService.logout();
    return false;
  }
}
