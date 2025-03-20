import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, firstValueFrom, Observable } from 'rxjs';
import { EncriptionServiceService } from './encription-service.service';
import { AuthService } from '../modules/auth';
import { CognitoUser } from 'amazon-cognito-identity-js';
import { APIService } from '../API.service';
import { signOut } from 'aws-amplify/auth';

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

  private myBehaviorSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  apiUrl = 'https://vux77bi1vi.execute-api.ap-south-1.amazonaws.com/default/api_for_Batch';

  constructor(private http: HttpClient,private encryption: EncriptionServiceService,private authService:AuthService,private api:APIService) { }

  dropdownSettings: {};


  setValue(value: any) {
    this.myBehaviorSubject.next(value);
  }
  getValue() {
    return this.myBehaviorSubject.asObservable();
  }




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


  async submit(username:any,password:any){
    username = this.encryption.decryptValue(username)
    password = this.encryption.decryptValue(password)

    await signOut()
    .then(() => {
      console.log("Cognito signout ");
    })
    .catch(err => console.error(err));

    console.log(username,password);

    return await this.authService.signIn(username, password)
      .then(async (user: CognitoUser | any) => {
        localStorage.setItem('userAttributes','{}')

        try {
          const result:any = await this.api.GetMaster(`${(username).toLowerCase()}#user#main`, 1);
          if (result) {
  
            const metaData = JSON.parse(result.metadata)  
            localStorage.setItem('userAttributes', JSON.stringify(metaData));
            return true
          }
        } catch (err) {
          console.error("Error in fetching the user ", user);
          return false
        }
      })
  }

}
