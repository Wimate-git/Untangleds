import { Injectable } from '@angular/core';
import { S3Client, PutObjectCommand, DeleteObjectCommand, ListObjectsV2Command, S3ClientConfig, DeleteObjectsCommand } from '@aws-sdk/client-s3';
import { env } from 'process';
import { from } from 'rxjs'; // Using RxJS for async handling (optional)
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class S3bucketService {
  private s3: S3Client;
  private bucketName = 'assets-untangleds'; // Set your S3 bucket name here
  private region = 'ap-south-1'; // Set your region

  constructor() {
    // // Initialize the S3 client with your region
    // this.s3 = new S3Client({ region: this.region });

    // Hard-coded credentials (for testing only)
    const hardCodedCredentials: any = {
      accessKeyId: 'AKIAQ4NXP4MBOXGQ7X4S',
      secretAccessKey: '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'
    };

    this.s3 = new S3Client({
      region: this.region,
      credentials: hardCodedCredentials,  // Use the hard-coded credentials here
    });
  }

   // Method to fetch files from a folder in S3
   async getFilesFromFolder(clientName: string): Promise<any> {
    try {
      const folderPath = `clientLogos/${clientName}`; // Folder path in S3
      const fileUrls: string[] = [];
      
      // List objects in the specified folder
      const command = new ListObjectsV2Command({
        Bucket: this.bucketName,
        Prefix: folderPath, // Folder path as the prefix
      });

      const result = await this.s3.send(command);
      
      if (!result.Contents) {
        return fileUrls
      }

      // Process the listed files and get their URLs
      for (const file of result.Contents) {
        const fileName = file.Key?.split('/').pop(); // Extract the file name from the key

        // You can decide on how to filter the files, e.g., based on file name or type
        console.log('File found:', fileName);

        // Generate the URL for each file
        const fileUrl = this.getFileUrl(file.Key || '');
        fileUrls.push(fileUrl);
      }

      console.log('All file URLs:', fileUrls);
      return fileUrls;

    } catch (error) {
      console.error('Error fetching files from folder:', error);
      throw error; // Rethrow the error to be handled in the component
    }
  }

  // Helper method to generate a file URL (assuming public access to the file)
  private getFileUrl(fileKey: string): string {
    return `https://${this.bucketName}.s3.${this.region}.amazonaws.com/${fileKey}`;
  }

  // Method to delete existing files from S3 (check file extensions before deleting)
  async deleteExistingFiles(folderPath: string, baseName: string): Promise<void> {
    const extensions = ['jpg', 'jpeg', 'png', 'gif', 'svg', 'bmp'];

    for (let ext of extensions) {
      const filePath = `${folderPath}${baseName}.${ext}`;

      try {
        // Check if the file exists in S3
        await this.getFileMetadata(filePath); // This will throw an error if the file does not exist
        console.log(`File exists, deleting old .${ext} file:`, filePath);

        // Delete the file from S3
        await this.deleteFile(filePath);
      } catch (error) {
        console.log(`No .${ext} file found for deletion:`, filePath);
      }
    }
  }

  // Method to get metadata of a file (check if it exists)
  private async getFileMetadata(filePath: string): Promise<any> {
    try {
      const command = new ListObjectsV2Command({
        Bucket: this.bucketName,
        Prefix: filePath,
      });

      const result = await this.s3.send(command);

      if (result.KeyCount && result.KeyCount > 0) {
        return result.Contents && result.Contents[0]; // If file exists, return its metadata
      } else {
        throw new Error('File does not exist');
      }
    } catch (error) {
      throw error;
    }
  }



    // Method to remove a folder (delete all objects within the folder)
    async removeFolder(filePath: string): Promise<void> {
      try {
        console.log('File path to remove: ', filePath);
  
        // List objects in the folder
        const listParams = {
          Bucket: this.bucketName,
          Prefix: filePath,  // List files within the folder
        };
        const listCommand = new ListObjectsV2Command(listParams);
        const results = await this.s3.send(listCommand);
  
        // If there are no objects, just return
        if (!results.Contents || results.Contents.length === 0) {
          console.log('No files found to delete in the folder.');
          return;
        }
  
        // Delete all the objects in the folder
        const deleteParams = {
          Bucket: this.bucketName,
          Delete: {
            Objects: results.Contents.map((file: any) => ({ Key: file.Key })), // Collect all file keys
          },
        };
  
        // Perform batch delete for all objects in the folder
        const deleteCommand = new DeleteObjectsCommand(deleteParams);
        await this.s3.send(deleteCommand);
        console.log(`Successfully removed ${results.Contents.length} files from the folder.`);
  
  
      } catch (error) {
        console.error('Error removing folder:', error);
      }
    }



  // Method to delete a file from S3
  private async deleteFile(filePath: string): Promise<void> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: filePath,
      });

      await this.s3.send(command);
      console.log('File deleted successfully:', filePath);
    } catch (error) {
      console.error('Error deleting file:', error);
      throw error; // Rethrow the error to be handled in the component
    }
  }

  // Method to upload a file to S3
  async uploadFile(path: string, file: File): Promise<any> {
    try {
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: path,
        Body: file,
        ContentType: file.type,
      });

      // Upload the file to S3
      const result = await this.s3.send(command);
      console.log('File uploaded successfully:', result);
      return result.$metadata.requestId; // You can return some relevant identifier like the requestId or file path
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error; // Rethrow the error to be handled in the component
    }
  }
}
