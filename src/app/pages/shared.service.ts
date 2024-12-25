import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom, Observable } from 'rxjs';

interface Key {
  PK: string;
  SK: number | string;
}

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  userDetails: any;
  onlyUserPermissionID: any;
  userClientID: any;
  userClientIDCognito: any;

  apiUrl = 'https://vux77bi1vi.execute-api.ap-south-1.amazonaws.com/default/api_for_Batch';

  constructor(private http: HttpClient) { }

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


  async batchGetItems(data: Key[]): Promise<Observable<any>> {
  
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const keys =  {keys:data}

    try {
      const response = await firstValueFrom(this.http.post<any>(this.apiUrl, keys, { headers }));
      return response;  // Resolving the API response as a Promise
    } catch (error) {
      throw error;  // Propagate the error for handling in the component
    }
  }


}
