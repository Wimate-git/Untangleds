import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class scheduleApiService {

  private apiUrl = 'https://2c35t3l2a2.execute-api.ap-south-1.amazonaws.com/default/schedule_Worker';

  private reportStudioapiUrl = 'https://wrl6zi49dh.execute-api.ap-south-1.amazonaws.com/default/report_studio_api';

  constructor(private http: HttpClient) {   }

  
  // sendData(data: any): Observable<any> {
  //   const headers = new HttpHeaders({
  //     'Content-Type': 'application/json'
  //   });

  //   return this.http.post<any>(this.apiUrl, data, { headers });
  // }


  async sendDataV2(data: any): Promise<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    try {
      const response = await firstValueFrom(this.http.post<any>(this.reportStudioapiUrl, data, { headers }));
      return response;  // Resolving the API response as a Promise
    } catch (error) {
      throw error;  // Propagate the error for handling in the component
    }
  }




  async sendData(data: any): Promise<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    try {
      const response = await firstValueFrom(this.http.post<any>(this.apiUrl, data, { headers }));
      return response;  // Resolving the API response as a Promise
    } catch (error) {
      throw error;  // Propagate the error for handling in the component
    }
  }
}
