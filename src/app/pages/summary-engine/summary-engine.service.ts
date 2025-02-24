import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SummaryEngineService {



  constructor() { }


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
}
