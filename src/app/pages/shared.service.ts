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





 
  public getMultiSelectSettings() {
    return this.dropdownSettings = {
      singleSelection: false,
      idField: 'value',
      textField: 'text',
      selectAllText: 'All',
      unSelectAllText: 'All',
      itemsShowLimit: 100,
      allowSearchFilter: true,
      limitSelection: 1
    };
  }
  public showSingleSelection() {
    return this.dropdownSettings = {
      singleSelection: true,
      idField: 'value',
      textField: 'text',
      enableCheckAll: false,
      // selectAllText: 'All',
      // unSelectAllText: 'All',
      itemsShowLimit: 100,
      allowSearchFilter: true,
      // limitSelection: 1
    };
  }


  public showSingleSelection_magic() {
    return this.dropdownSettings = {
      singleSelection: false,
      idField: 'value',
      textField: 'text',
      selectAllText: 'All',
      unSelectAllText: 'All',
      itemsShowLimit: 100,
      allowSearchFilter: true,
      limitSelection: 1
    };
  }


  public showSingleSelection_dream() {
    return this.dropdownSettings = {
      singleSelection: false,
      idField: 'PK',
      textField: 'PK',
      selectAllText: 'All',
      unSelectAllText: 'All',
      itemsShowLimit: 100,
      allowSearchFilter: true,
      limitSelection: 1
    };
  }



  public getLoggedUserDetails() {

    this.userDetails = JSON.parse(JSON.parse(JSON.stringify(localStorage.getItem("userAttributes"))));

  
    // this.getPermission_basedonUser();

    return  JSON.parse(JSON.parse(JSON.stringify(localStorage.getItem("userAttributes"))));

  }



}
