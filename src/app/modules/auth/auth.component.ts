import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { S3ServiceService } from './services/s3-service.service';
import { ClientLogoService } from './services/client-logo.service';
import { LayoutService } from 'src/app/_metronic/layout/core/layout.service';
import { Subscription } from 'rxjs';
import { LayoutType } from 'src/app/_metronic/layout/core/configs/config';
import { ActivatedRoute, Router } from '@angular/router';

// const BODY_CLASSES = ['bgi-size-cover', 'bgi-position-center', 'bgi-no-repeat'];

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '<body[root]>',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit, OnDestroy {
  private linkElement: HTMLLinkElement
  private splashScreenLogoElement: HTMLImageElement;

  private unsubscribe: Subscription[] = [];
  currentLayoutType:  any;

  today: Date = new Date();
  logoUrl: string;
  untangledImage: string;
  backgroundUrl: string;
  htmlContent: string;
  clientLogo: any= '';
  showLogo:boolean = false;

  testCSS:string ='fa-regular fa-user'

  dynamicFields:any;
  client: any;
  restrictMobileProvision: any = false;

  constructor(private layout: LayoutService,private s3Service: S3ServiceService,private cd:ChangeDetectorRef,private getImage:ClientLogoService,private router: Router,private route:ActivatedRoute) {
    this.splashScreenLogoElement = document.getElementById('splash-screen-logo') as HTMLImageElement;
    this.linkElement = document.querySelector("link[rel*='icon']") as HTMLLinkElement;
  }

  async ngOnInit() {
    // BODY_CLASSES.forEach((c) => document.body.classList.add(c));


    this.logoUrl = 'https://assets-untangleds.s3.ap-south-1.amazonaws.com/Wimate_Logo.png';

    this.untangledImage = 'https://assets-untangleds.s3.ap-south-1.amazonaws.com/untangled-project.png'

    this.backgroundUrl = 'https://assets-untangleds.s3.ap-south-1.amazonaws.com/backgroundImage2.jpg'

    this.s3Service.getHtmlContent('login-content.html').subscribe(content => {
      this.htmlContent = content;
      this.cd.detectChanges()
    });

   
    const tempDataHolder = await this.getImage.getClientLogo()

    if(tempDataHolder && tempDataHolder[0]){
      this.clientLogo = tempDataHolder[0]
      if(tempDataHolder[1]){
        this.dynamicFields = JSON.parse(tempDataHolder[1].dynamicFields)
        this.client = tempDataHolder[1].clientID.split('#')[0]
      }
    }

    console.log("Dynamic fields are here ",this.dynamicFields);
  

      const element = document.querySelector('body');

      let computedStyle:any
      let backgroundColor:any
      if(element != null){
        computedStyle = getComputedStyle(element);
        backgroundColor = computedStyle.backgroundColor;
      }
     
      this.currentLayoutType = backgroundColor
      console.log("backgorund color ",backgroundColor);

    this.showLogo = true

    if (this.linkElement && this.clientLogo) {
      this.linkElement.href = backgroundColor !== 'rgb(15, 16, 20)'?this.clientLogo && this.clientLogo[1] && this.clientLogo[1]:this.clientLogo && this.clientLogo[3] && this.clientLogo[3]
    }

    console.log("Client Logo is",this.clientLogo);


    this.route.queryParams.subscribe((params) => {
      this.restrictMobileProvision = params['restrict'];

      console.log("restrictMobileProvision auth component",this.restrictMobileProvision);

      localStorage.setItem('restrictMobileProvision',this.restrictMobileProvision)


      this.cd.detectChanges()

      // if (this.savedQuery) {
        
      // }
    })







    this.cd.detectChanges()
    
  }
    // Method to handle redirection (for external URLs)
    redirectTo(url: string,dreamboardID:any): void {
      
      let redirectUrl
      if(url != ''){
        redirectUrl = url
      }
      else{
        redirectUrl = `https://dreamboard-dynamic.s3.ap-south-1.amazonaws.com/public/${this.client}/${dreamboardID}/src/index.html?loginDetail=${this.client}`;
      }

      console.log("Url is here ",redirectUrl);

      // Open the URL in a new tab
      window.open(redirectUrl, '_blank');
    }
      ngOnDestroy() {
        // BODY_CLASSES.forEach((c) => document.body.classList.remove(c));
      }
}
