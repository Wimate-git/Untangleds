import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class S3bucketService {

  private apiUrl = 'https://3luwbeeuk0.execute-api.ap-south-1.amazonaws.com/s1/s3Bucket'; // Your API URL

  constructor() {}

  // Upload file to S3 via API
  async uploadFile(path: string, file: File): Promise<any> {
    const formData = {
      bucket_name: 'assets-untangleds',
      bucket_region: 'ap-south-1',
      operation_type: 'store_base64', // operation type
      key: path,
      data: (await this.convertFileToBase64(file)).split(',')[1], // Convert file to Base64
      contentType: file.type,
    };

    return this.makeApiCall(formData);
  }

  // Convert file to Base64 (as expected by the API)
  private convertFileToBase64(file: File): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  // Make the API call using fetch
  private async makeApiCall(formData: any): Promise<any> {
    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      return data; // Return API response
    } catch (error) {
      console.error('Error during API call:', error);
      throw error; // Re-throw the error to be handled by the caller
    }
  }

  // Delete file from S3 via API
  async deleteFile(filePath: string): Promise<any> {
    const formData = {
      bucket_name: 'assets-untangleds',
      bucket_region: 'ap-south-1',
      operation_type: 'delete',
      key: filePath,
    };

    return this.makeApiCall(formData);
  }

  // Get files from a folder (API implementation)
  async getFilesFromFolder(clientName: string): Promise<any> {
    const formData = {
      bucket_name: 'assets-untangleds',
      bucket_region: 'ap-south-1',
      operation_type: 'list',
      path: `clientLogos/${clientName}`,
    };

    return this.makeApiCall(formData);
  }

  // Delete existing files by extensions (API implementation)
  async deleteExistingFiles(folderPath: string, baseName: string): Promise<any> {
    const extensions = ['jpg', 'jpeg', 'png', 'gif', 'svg', 'bmp'];
    const deletionPromises = extensions.map((ext) => {
      const filePath = `${folderPath}${baseName}.${ext}`;
      return this.deleteFile(filePath);
    });

    try {
      const deleteResults = await Promise.all(deletionPromises);
      return deleteResults;
    } catch (error) {
      console.error('Error deleting files:', error);
      throw error;
    }
  }

  // Remove folder by deleting all objects inside (API implementation)
  async removeFolder(folderPath: string): Promise<any> {
    const formData = {
      bucket_name: 'assets-untangleds',
      bucket_region: 'ap-south-1',
      operation_type: 'delete',
      key: folderPath,
    };

    return this.makeApiCall(formData);
  }
}
