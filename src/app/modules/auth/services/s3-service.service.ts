import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class S3ServiceService {
  private baseUrl = 'https://assets-untangleds.s3.ap-south-1.amazonaws.com/';

  constructor(private http: HttpClient) {}

  getHtmlContent(fileName: string): Observable<string> {
    return this.http.get(`${this.baseUrl}${fileName}`, { responseType: 'text' });
  }


  getImage(fileName: string): Observable<any> {
    return this.http.get(`${this.baseUrl}${fileName}`, { responseType: 'blob' });
  }
}

