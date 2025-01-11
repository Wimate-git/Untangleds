// fullscreen.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FullscreenService {
  private isFullscreenSubject = new BehaviorSubject<boolean>(false);
  isFullscreen$ = this.isFullscreenSubject.asObservable();

  setFullscreen(value: boolean) {
    this.isFullscreenSubject.next(value);
  }
}