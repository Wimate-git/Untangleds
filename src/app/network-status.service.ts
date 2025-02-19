import { Injectable } from '@angular/core';
import { BehaviorSubject, fromEvent, Observable, merge, interval } from 'rxjs';
import { map, distinctUntilChanged, switchMap, catchError } from 'rxjs/operators';

export interface NetworkStatus {
  online: boolean;
  connectionType?: string;
  downlink?: number;
  effectiveType?: string;
  rtt?: number;
  lastChecked: Date;
}

@Injectable({
  providedIn: 'root'
})
export class NetworkStatusService {
  private networkStatus = new BehaviorSubject<NetworkStatus>({
    online: navigator.onLine,
    connectionType: this.getConnectionType(),
    downlink: this.getDownlink(),
    effectiveType: this.getEffectiveType(),
    rtt: this.getRTT(),
    lastChecked: new Date()
  });

  private readonly PING_URL = 'https://www.google.com/generate_204';
  private readonly PING_INTERVAL = 60000; // 10 seconds

  constructor() {
    this.initializeNetworkListeners();
    this.initializeActiveChecking();
  }

  private initializeNetworkListeners(): void {
    // Listen for online/offline events
    merge(
      fromEvent(window, 'online'),
      fromEvent(window, 'offline')
    ).pipe(
      map(() => this.getFullStatus())
    ).subscribe(status => this.networkStatus.next(status));

    // Listen for connection changes if supported
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      fromEvent(connection, 'change').pipe(
        map(() => this.getFullStatus())
      ).subscribe(status => this.networkStatus.next(status));
    }
  }

  private initializeActiveChecking(): void {
    // Actively check connection status periodically
    interval(this.PING_INTERVAL).pipe(
      switchMap(() => this.checkConnection())
    ).subscribe(isConnected => {
      const currentStatus = this.networkStatus.getValue();

      console.log("Checking internet connectivity ");
      if (currentStatus.online !== isConnected) {
        this.networkStatus.next({
          ...this.getFullStatus(),
          online: isConnected
        });
      }
    });
  }

  private async checkConnection(): Promise<boolean> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
  
      const response = await fetch(this.PING_URL, {
        method: 'HEAD',
        mode: 'no-cors',
        signal: controller.signal
      });
  
      clearTimeout(timeoutId);
      return true;
    } catch (error) {
      console.log('Connection check failed:', error);
      return false;
    }
  }

  private getFullStatus(): NetworkStatus {
    return {
      online: navigator.onLine,
      connectionType: this.getConnectionType(),
      downlink: this.getDownlink(),
      effectiveType: this.getEffectiveType(),
      rtt: this.getRTT(),
      lastChecked: new Date()
    };
  }

  private getConnectionType(): string | undefined {
    if ('connection' in navigator) {
      return (navigator as any).connection?.type;
    }
    return undefined;
  }

  private getDownlink(): number | undefined {
    if ('connection' in navigator) {
      return (navigator as any).connection?.downlink;
    }
    return undefined;
  }

  private getEffectiveType(): string | undefined {
    if ('connection' in navigator) {
      return (navigator as any).connection?.effectiveType;
    }
    return undefined;
  }

  private getRTT(): number | undefined {
    if ('connection' in navigator) {
      return (navigator as any).connection?.rtt;
    }
    return undefined;
  }

  public getNetworkStatus(): Observable<NetworkStatus> {
    return this.networkStatus.asObservable();
  }

  public isOnline(): Observable<boolean> {
    return this.networkStatus.pipe(
      map(status => status.online),
      distinctUntilChanged()
    );
  }

  public isLowBandwidth(): Observable<boolean> {
    return this.networkStatus.pipe(
      map(status => {
        const rtt = status.rtt || 251;
        const effectiveType = status.effectiveType;
        return rtt > 250 || effectiveType === 'slow-2g' || effectiveType === '2g';
      }),
      distinctUntilChanged()
    );
  }
}