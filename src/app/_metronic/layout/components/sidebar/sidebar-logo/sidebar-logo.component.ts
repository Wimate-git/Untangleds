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
  currentLayoutType: LayoutType | null;

  toggleAttr: string;
  clientLogo: any = '';

  constructor(private layout: LayoutService,private cd: ChangeDetectorRef,private getImage:ClientLogoService) {}

  async ngOnInit() {

      console.log("Sidebar executed");

    this.toggleAttr = `app-sidebar-${this.toggleType}`;
    const layoutSubscr = this.layout.currentLayoutTypeSubject
      .asObservable()
      .subscribe((layout) => {
        this.currentLayoutType = layout;
      });
    this.unsubscribe.push(layoutSubscr);

    // this.clientLogo = await this.getImage.getClientLogo()

    this.clientLogo = JSON.parse(localStorage.getItem('clientLogo') || '');
    console.log("Client Logo from local Storage is:", this.clientLogo);

    // this.clientLogo = ''

    this.cd.detectChanges()
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
