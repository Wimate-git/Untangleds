import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { S3ServiceService } from './services/s3-service.service';
import { ClientLogoService } from './services/client-logo.service';

// const BODY_CLASSES = ['bgi-size-cover', 'bgi-position-center', 'bgi-no-repeat'];

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '<body[root]>',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit, OnDestroy {
  today: Date = new Date();
  logoUrl: string;
  untangledImage: string;
  backgroundUrl: string;
  htmlContent: string;
  clientLogo: any= '';
  showLogo:boolean = false;

  constructor(private s3Service: S3ServiceService,private cd:ChangeDetectorRef,private getImage:ClientLogoService) {}

  async ngOnInit() {
    // BODY_CLASSES.forEach((c) => document.body.classList.add(c));

    this.logoUrl = 'https://assets-untangleds.s3.ap-south-1.amazonaws.com/Wimate_Logo.png';

    this.untangledImage = 'https://assets-untangleds.s3.ap-south-1.amazonaws.com/untangled-project.png'

    this.backgroundUrl = 'https://assets-untangleds.s3.ap-south-1.amazonaws.com/backgroundImage2.jpg'

    this.s3Service.getHtmlContent('login-content.html').subscribe(content => {
      this.htmlContent = content;
      this.cd.detectChanges()
    });

    this.clientLogo = await this.getImage.getClientLogo()

    if(this.clientLogo == '' || this.clientLogo == null){
      localStorage.setItem('clientLogo',JSON.stringify(this.logoUrl))
    }
    else{
      localStorage.setItem('clientLogo',JSON.stringify(this.clientLogo))
    }

    this.showLogo = true

    this.cd.detectChanges()
    
  }

  ngOnDestroy() {
    // BODY_CLASSES.forEach((c) => document.body.classList.remove(c));
  }
}
