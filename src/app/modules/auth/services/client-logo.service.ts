import { Injectable } from '@angular/core';
import { APIService } from 'src/app/API.service';
import { S3ServiceService } from './s3-service.service';
import { S3bucketService } from './s3bucket.service';

@Injectable({
  providedIn: 'root'
})
export class ClientLogoService {
  private linkElement: HTMLLinkElement
  private splashScreenLogoElement: HTMLImageElement;

  constructor(private api:APIService,private S3service:S3bucketService) { 
    this.splashScreenLogoElement = document.getElementById('splash-screen-logo') as HTMLImageElement;
    this.linkElement = document.querySelector("link[rel*='icon']") as HTMLLinkElement;
    // this.splashScreenLogoElement = document.querySelector('splash-screen-logo') as HTMLImageElement; // Assume your logo has this ID
  }

  async getClientLogo(){
    const fullUrl = window.location.href

    const baseUrl = new URL(fullUrl).origin
    // const baseUrl = new URL(fullUrl).origin == 'http://localhost:4200'?'https://main.d171psdgt7n0kh.amplifyapp.com':'http://localhost:4200'
    // console.log("Base url is here ",baseUrl); https://untangled.cloudtesla.com/

    const metadata = await this.getLogo(baseUrl)

    if(metadata){

      const logUrls = await this.getFilesFromFolder(metadata.clientID.split('#')[0]);
      console.log("Logos are here btw ",logUrls);

      if (this.linkElement && logUrls) {
        this.linkElement.href =logUrls[1];
      }
  
      if (this.splashScreenLogoElement && logUrls) {
        this.splashScreenLogoElement.src =  logUrls[0];
      }

      return logUrls
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



  async getFilesFromFolder(getValues:any){
    // Initialize an array with `undefined` values to hold the images in specific order

    let imageUrls = []
    try{


      localStorage.setItem('clientFetched',JSON.stringify(getValues))
 
    console.log("Client to be fetched is ",getValues);
    
    let orderedUrls: any[] = [undefined, undefined, undefined, undefined];

    let filesUrls = await this.S3service.getFilesFromFolder(getValues)

    console.log("Api is called BTW",filesUrls);

    const data =filesUrls && filesUrls.body && JSON.parse(filesUrls.body).data

    console.log("Data is here ",data);

    filesUrls =data && data.map((item:any)=>item.Key)


    for(let fileName of await filesUrls){
       // Determine the index based on file name (e.g., imageInput2, imageInput4)
       if (fileName?.includes('imageInput1')) {
        orderedUrls[0] = `https://assets-untangleds.s3.ap-south-1.amazonaws.com/${fileName}`;  // Place imageInput1 at index 0
      } else if (fileName?.includes('imageInput2')) {
        orderedUrls[1] = `https://assets-untangleds.s3.ap-south-1.amazonaws.com/${fileName}` // Place imageInput2 at index 1
      } else if (fileName?.includes('imageInput3')) {
        orderedUrls[2] = `https://assets-untangleds.s3.ap-south-1.amazonaws.com/${fileName}` // Place imageInput3 at index 2
      } else if (fileName?.includes('imageInput4')) {
        orderedUrls[3] = `https://assets-untangleds.s3.ap-south-1.amazonaws.com/${fileName}`  // Place imageInput4 at index 3
      }
    }


      // After processing all files, assign the ordered URLs to the imageUrls array
      imageUrls = orderedUrls;


      return imageUrls;


    } catch (error) {
      console.error('Error fetching files:', error);
    }

    return imageUrls;
   
  }



}
