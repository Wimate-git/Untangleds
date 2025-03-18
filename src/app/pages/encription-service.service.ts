import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class EncriptionServiceService {
  private SECRET_KEY = 'mobile-encrypt-params-123';

  // encrypt(value: string): string {
  //   const encryptedValue = CryptoJS.AES.encrypt(value, this.secretKey).toString();
  //   return encodeURIComponent(encryptedValue);
  // }

  // decrypt(encryptedValue: string): string {
  //   const decryptedValue = CryptoJS.AES.decrypt(decodeURIComponent(encryptedValue), this.secretKey);
  //   return decryptedValue.toString(CryptoJS.enc.Utf8);
  // }

  encryptValue(value: string): string {
    return encodeURIComponent(CryptoJS.AES.encrypt(value, this.SECRET_KEY).toString());
  }

  decryptValue(encryptedValue: string): string {
    const bytes = CryptoJS.AES.decrypt(decodeURIComponent(encryptedValue), this.SECRET_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  }
}
