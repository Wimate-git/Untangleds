import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  userDetails: any;
  onlyUserPermissionID: any;
  userClientID: any;
  userClientIDCognito: any;

  constructor() { }

  dropdownSettings: {};



  public getSettings() {
    return this.dropdownSettings = {
      singleSelection: false,
      idField: 'value',
      textField: 'text',
      selectAllText: 'All',
      unSelectAllText: 'All',
      itemsShowLimit: 1,
      allowSearchFilter: true,
      // limitSelection: 100
    };
  }


  public getLoggedUserDetails() {

    this.userDetails = JSON.parse(JSON.parse(JSON.stringify(localStorage.getItem("userAttributes"))));

  
    // this.getPermission_basedonUser();

    return  JSON.parse(JSON.parse(JSON.stringify(localStorage.getItem("userAttributes"))));

  }



}
