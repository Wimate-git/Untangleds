import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NetworkService {
  private onlineStatus = new BehaviorSubject<boolean>(navigator.onLine);
  private offlineToast: any = null;
  private hasReloaded = false; // Prevent multiple reloads

  constructor(private snackBar: MatSnackBar) {
    window.addEventListener('online', () => this.updateOnlineStatus(true));
    window.addEventListener('offline', () => this.updateOnlineStatus(false));
  }

  private updateOnlineStatus(status: boolean) {
    this.onlineStatus.next(status);
    this.showNetworkStatus(status);
  }

  getNetworkStatus(): Observable<boolean> {
    return this.onlineStatus.asObservable();
  }

  showNetworkStatus(isOnline: boolean) {
    if (!isOnline) {
      // Show persistent toast when offline (NO "OK" BUTTON)
      this.offlineToast = this.snackBar.open('⚠️ No Internet Connection', '', {
        duration: 0, // Stays until user goes online
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: ['network-offline']
      });

      this.hasReloaded = false; // Reset reload flag when offline
    } else {
      // Dismiss previous offline toast when back online
      if (this.offlineToast) {
        this.offlineToast.dismiss();
        this.offlineToast = null;
      }

      // Show quick 'Back Online' toast (NO "OK" BUTTON)
      this.snackBar.open('✅ Back Online', '', {
        duration: 3000, // Auto close after 3 seconds
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: ['network-online']
      });

      // Reload only once to prevent infinite loops
      if (!this.hasReloaded) {
        this.hasReloaded = true;
        setTimeout(() => {
          window.location.reload();
        }, 2000); // Delay reload for a better user experience
      }
    }
  }
}
