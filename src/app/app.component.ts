import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { TranslationService } from './modules/i18n';
import { locale as enLang } from './modules/i18n/vocabs/en';
import { locale as chLang } from './modules/i18n/vocabs/ch';
import { locale as esLang } from './modules/i18n/vocabs/es';
import { locale as jpLang } from './modules/i18n/vocabs/jp';
import { locale as deLang } from './modules/i18n/vocabs/de';
import { locale as frLang } from './modules/i18n/vocabs/fr';
import { ThemeModeService } from './_metronic/partials/layout/theme-mode-switcher/theme-mode.service';
import { Observable, Subscription } from 'rxjs';
import { NetworkStatusService } from './network-status.service';
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';

@Component({
  selector: 'body[root]',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit, OnDestroy {
  isOnline$!: Observable<boolean>;
  isLowBandwidth$!: Observable<boolean>;
  private offlineToast: MatSnackBarRef<any> | null = null;
  private lowBandwidthToast: MatSnackBarRef<any> | null = null;
  private subscriptions = new Subscription();
  private wasOffline = false; 

  constructor(
    private translationService: TranslationService,
    private modeService: ThemeModeService,
    private networkStatus: NetworkStatusService,
    private snackBar: MatSnackBar
  ) {
    this.translationService.loadTranslations(
      enLang,
      chLang,
      esLang,
      jpLang,
      deLang,
      frLang
    );
  }

  ngOnInit() {

    this.modeService.init();

    try{
      console.log("Navigator connection", (navigator as any).connection);

      this.isOnline$ = this.networkStatus.isOnline();
      this.isLowBandwidth$ = this.networkStatus.isLowBandwidth();
  
     
  
     
  
      // Handle offline status
      this.subscriptions.add(
        this.isOnline$.subscribe(isOnline => {
          console.log("Network status: Online Status", isOnline);
          if (!isOnline) {
            this.dismissLowBandwidthToast(); // Dismiss low bandwidth toast when offline
            this.showOfflineToast();

          } else {
            this.dismissOfflineToast();
            // Check bandwidth after coming back online
            if(/firefox|fxios/i.test(navigator.userAgent) == false){
              console.log("Not an firefox ");
              this.checkBandwidth();
            }
  
         
          }
        })
      );
  
      // Handle low bandwidth
      this.subscriptions.add(
        this.isLowBandwidth$.subscribe(isLowBandwidth => {
          console.log("Network status: Low Bandwidth Status", isLowBandwidth);
          if (isLowBandwidth) {
            if(/firefox|fxios/i.test(navigator.userAgent) == false){
              console.log("Not an firefox ");
              this.showLowBandwidthToast();
            }
          } else {
            this.dismissLowBandwidthToast();
          }
        })
      );
  
      // Log full network status updates
      this.subscriptions.add(
        this.networkStatus.getNetworkStatus().subscribe(status => {
          console.log('Full network status:', status);
        })
      );
    }
    catch(error){
      console.log("Error in checking internet status ",error);
    }


  }

  // ngOnInit() {
  //   console.log("Navigator connection", (navigator as any).connection);

  //   this.isOnline$ = this.networkStatus.isOnline();
  //   this.isLowBandwidth$ = this.networkStatus.isLowBandwidth();

  //   // Handle offline status
  //   this.subscriptions.add(
  //     this.isOnline$.subscribe(isOnline => {
  //       console.log("Network status: Online Status", isOnline);
  //       if (!isOnline) {
  //         this.dismissLowBandwidthToast(); // Dismiss low bandwidth toast when offline
  //         this.showOfflineToast();
  //       } else {
  //         this.dismissOfflineToast();
  //         // Check bandwidth after coming back online
  //         this.checkBandwidth();
  //       }
  //     })
  //   );

  //   // Handle low bandwidth
  //   this.subscriptions.add(
  //     this.isLowBandwidth$.subscribe(isLowBandwidth => {
  //       console.log("Network status: Low Bandwidth Status", isLowBandwidth);
  //       if (isLowBandwidth) {
  //         this.showLowBandwidthToast();
  //       } else {
  //         this.dismissLowBandwidthToast();
  //       }
  //     })
  //   );

  //   // Log full network status updates
  //   this.subscriptions.add(
  //     this.networkStatus.getNetworkStatus().subscribe(status => {
  //       console.log('Full network status:', status);
  //     })
  //   );

  //   this.modeService.init();
  // }

  private showOfflineToast() {
    if (!this.offlineToast) {
      this.offlineToast = this.snackBar.open('⚠️ No internet connection. Please check your network settings.', '', {
        duration: 0,
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: ['network-offline']
      });
    }
  }

  private showLowBandwidthToast() {
    if (!this.lowBandwidthToast && !this.offlineToast) { // Don't show if offline
      this.lowBandwidthToast = this.snackBar.open('⚠️ The connection is slow. Some features might not work properly.', '', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: ['network-low-bandwidth']
      });
    }
  }

  private dismissOfflineToast() {
    if (this.offlineToast) {
      this.offlineToast.dismiss();
      this.offlineToast = null;
    }
  }

  private dismissLowBandwidthToast() {
    if (this.lowBandwidthToast) {
      this.lowBandwidthToast.dismiss();
      this.lowBandwidthToast = null;
    }
  }

  private checkBandwidth() {
    this.networkStatus.isLowBandwidth().subscribe(isLowBandwidth => {
      if (isLowBandwidth) {
        this.showLowBandwidthToast();
      }
    });
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
    this.dismissOfflineToast();
    this.dismissLowBandwidthToast();
  }
}