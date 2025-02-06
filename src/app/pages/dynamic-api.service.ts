import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DynamicApiService {

  private apiUrl = 'https://d2uqsj8nfg.execute-api.ap-south-1.amazonaws.com/Dynamic_Lambda/Dynamic_Lambda';

  constructor(private http: HttpClient) {   }

  
  sendData(data: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<any>(this.apiUrl, data, { headers });
  }



  async getData(data: any): Promise<any> {
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
