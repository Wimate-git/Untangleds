import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { LayoutType } from '../../../core/configs/config';
import { LayoutService } from '../../../core/layout.service';
import { ClientLogoService } from 'src/app/modules/auth/services/client-logo.service';

@Component({
  selector: 'app-sidebar-logo',
  templateUrl: './sidebar-logo.component.html',
  styleUrls: ['./sidebar-logo.component.scss'],
})
export class SidebarLogoComponent implements OnInit, OnDestroy {
  private unsubscribe: Subscription[] = [];
  @Input() toggleButtonClass: string = '';
  @Input() toggleEnabled: boolean ;
  @Input() toggleType: string = '';
  @Input() toggleState: string = '';
  currentLayoutType: any;
  showLogo :boolean = false

  private linkElement: HTMLLinkElement
  private splashScreenLogoElement: HTMLImageElement;

  toggleAttr: string;
  clientLogo: any = '';
  isDarkMode: any = '';

  constructor(private layout: LayoutService,private cd: ChangeDetectorRef,private getImage:ClientLogoService) {
    this.splashScreenLogoElement = document.getElementById('splash-screen-logo') as HTMLImageElement;
    this.linkElement = document.querySelector("link[rel*='icon']") as HTMLLinkElement;
  }

  async ngOnInit() {

    this.isDarkMode = localStorage.getItem('kt_theme_mode_menu')

      console.log("Sidebar executed");

    this.toggleAttr = `app-sidebar-${this.toggleType}`;
    const layoutSubscr = this.layout.currentLayoutTypeSubject
      .asObservable()
      .subscribe((layout) => {
        this.currentLayoutType = layout;
        if (this.linkElement && this.clientLogo) {
          if(this.isDarkMode == 'light' || this.isDarkMode == null){
            this.linkElement.href = this.clientLogo[1]
          }
          else{
            this.linkElement.href = this.clientLogo[3];
          }
        }
      });
    this.unsubscribe.push(layoutSubscr);

    // this.clientLogo = await this.getImage.getClientLogo()

    const tempDataHolder = await this.getImage.getClientLogo()
    this.clientLogo = tempDataHolder[0]

    this.showLogo = true


    if (this.linkElement && this.clientLogo) {
      if(this.isDarkMode == 'light' || this.isDarkMode == null){
        this.linkElement.href = this.clientLogo[1]
      }
      else{
        this.linkElement.href = this.clientLogo[3];
      }
    }

    // this.clientLogo = ''

    this.cd.detectChanges()
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
