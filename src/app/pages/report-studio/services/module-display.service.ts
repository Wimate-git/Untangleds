import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModuleDisplayService {
  private displayModuleSubject = new BehaviorSubject<boolean>(false);
  displayModule$ = this.displayModuleSubject.asObservable();

  constructor() {}

  showModule(): void {
    this.displayModuleSubject.next(true);
  }

  hideModule(): void {
    this.displayModuleSubject.next(false);
  }
}