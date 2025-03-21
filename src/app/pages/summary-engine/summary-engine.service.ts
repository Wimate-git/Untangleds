import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SummaryEngineService {



  constructor() { }

  private fullscreenSubject = new BehaviorSubject<boolean>(false);
  fullscreen$ = this.fullscreenSubject.asObservable();

  setFullscreen(value: boolean) {
    localStorage.setItem('fullscreen', value.toString());
    this.fullscreenSubject.next(value);
  }

  getFullscreen(): boolean {
    return localStorage.getItem('fullscreen') === 'true';
  }
  private lookUpDataSubject = new BehaviorSubject<any>(null);

  // Observable for components to subscribe to
  lookUpData$ = this.lookUpDataSubject.asObservable();

  // Method to update device logs
  updatelookUpData(logs: any): void {
    this.lookUpDataSubject.next(logs);
  }
  getCurrentlookUpData(): void {
   return  this.lookUpDataSubject.getValue();
  }

  private queryParamsCheck = new BehaviorSubject<any>(null);

  // Observable for components to subscribe to
  queryParamsData$ = this.queryParamsCheck.asObservable();

  // Method to update device logs
  queryPramsFunction(logs: any): void {
    this.queryParamsCheck.next(logs);
  }
  getqueryPramsFunction(): void {
   return  this.queryParamsCheck.getValue();
  }
  
}
