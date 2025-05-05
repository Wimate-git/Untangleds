import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  // BehaviorSubjects to store the current values
  private notificationCountSubject = new BehaviorSubject<number>(0);
  private unreadNotificationSubject = new BehaviorSubject<number>(0);

  // Expose them as observables
  notificationCount$ = this.notificationCountSubject.asObservable();
  unreadNotification$ = this.unreadNotificationSubject.asObservable();

  constructor() { }

  // Methods to update values
  setNotificationCount(count: number): void {
    this.notificationCountSubject.next(count);
  }

  setUnreadNotification(count: number): void {
    this.unreadNotificationSubject.next(count);
  }

  // Optional methods to get current values directly
  getNotificationCount(): number {
    return this.notificationCountSubject.getValue();
  }

  getUnreadNotification(): number {
    return this.unreadNotificationSubject.getValue();
  }


}
