import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiCallService {
  // private apiUrl = 'https://0oedfp8pe8.execute-api.ap-south-1.amazonaws.com/test/s3Bucket';
  private apiUrl = 'https://3luwbeeuk0.execute-api.ap-south-1.amazonaws.com/s1/s3Bucket';
  private apiUrl_dynamic = 'https://ij04y4zwda.execute-api.ap-south-1.amazonaws.com/s1/dynamic';

  constructor(private http: HttpClient) { }

  postData(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, data);


  }

  postData_dynamic(data: any): Observable<any> {
    console.log("data",data)
    return this.http.post<any>(`${this.apiUrl_dynamic}`, data);
  }


}
