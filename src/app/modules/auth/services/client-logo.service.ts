import { Injectable } from '@angular/core';
import { APIService } from 'src/app/API.service';

@Injectable({
  providedIn: 'root'
})
export class ClientLogoService {
  private linkElement: HTMLLinkElement
  private splashScreenLogoElement: HTMLImageElement;

  constructor(private api:APIService) { 
    this.splashScreenLogoElement = document.getElementById('splash-screen-logo') as HTMLImageElement;
    this.linkElement = document.querySelector("link[rel*='icon']") as HTMLLinkElement;
    // this.splashScreenLogoElement = document.querySelector('splash-screen-logo') as HTMLImageElement; // Assume your logo has this ID
  }

  async getClientLogo(){
    const fullUrl = window.location.href

    const baseUrl = new URL(fullUrl).origin
    // const baseUrl = new URL(fullUrl).origin == 'http://localhost:4200'?'https://main.d171psdgt7n0kh.amplifyapp.com':'http://localhost:4200'
    // console.log("Base url is here ",baseUrl);

    const metadata = await this.getLogo(baseUrl)

    if(metadata){
      if (this.linkElement) {
        this.linkElement.href = metadata.clientLogo2;
      }
  
      if (this.splashScreenLogoElement) {
        this.splashScreenLogoElement.src = metadata.clientLogo1;
      }

      return metadata.clientLogo1
    }
    return ''
   
  }


  async getLogo(Url:any){
    try{
      const result = await this.api.GetMaster(Url,1)
      if(result && result.metadata){
        const metadata = JSON.parse(result.metadata);

        console.log("Metadata is here ",metadata);

        const logo  = metadata.clientLogo1
        console.log("Custom Logo is here ",logo);

        return metadata
      }
     
    }
    catch(error){
      console.log("Error fetching the client Logo");
    }
  }

}
