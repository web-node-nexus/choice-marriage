import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

const SecureStorage = require('secure-web-storage');
import * as CryptoJS from 'crypto-js';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { CommonService } from './common.service';
var SECRET_KEY = '1E99412323A4ED2WAYWALASECRET_KEY';
var secureCryptoStorage = new SecureStorage(localStorage, {
  hash: function hash(key: any) {
    // key = CryptoJS.SHA256(key, SECRET_KEY);
    key = CryptoJS.SHA256(key, [SECRET_KEY])
    return key.toString();
  },
  encrypt: function encrypt(data: any) {
    data = CryptoJS.AES.encrypt(data, SECRET_KEY);
    data = data.toString();
    return data;
  },
  decrypt: function decrypt(data: any) {
    data = CryptoJS.AES.decrypt(data, SECRET_KEY);
    data = data.toString(CryptoJS.enc.Utf8);
    return data;
  }
});



@Injectable({
  providedIn: 'root'
})
export class AppService {

  generateApiEndPoint: BehaviorSubject<string> = new BehaviorSubject<string>('matchesforindivisual')
  notificationCount:BehaviorSubject<number> = new BehaviorSubject<number>(0)
  private _authorizationTokenKey: any;
  constructor(

  ) {

  }
  public getApipath() {
    return environment.baseApiURL;
  }
  public getFilePath() {
    return environment.filePath;
  }


  set setAuthorizationTokenKey(token: string) {
    this._authorizationTokenKey = token
  }

  get authorizationTokenKey() {
    return this._authorizationTokenKey
  }
  get authStatus() {
    // return this._auth.getAuthStatus();
    try {
      var loginiinfo = secureCryptoStorage.getItem('authInfo');
      // console.log("getAuthStatus",loginiinfo);
      if (loginiinfo != null) {
        return loginiinfo
      } else {
        return undefined;
      }

    } catch (error) {
      return undefined
    }
  }
  get authProfile() {
    // return this._auth.getAuthStatus();
    try {
      var loginiinfo = secureCryptoStorage.getItem('authProfile');
      // console.log("getAuthStatus",loginiinfo);
      if (loginiinfo != null) {
        return loginiinfo
      } else {
        return undefined;
      }

    } catch (error) {
      return undefined
    }
  }

  get appConfig(): any { // You might want to replace 'any' with a specific type if you have one
    try {
      const config = localStorage.getItem('AppConfig');
      // Handle null value or other checks if necessary
      if (!config) {
        throw new Error('AppConfig not found in localStorage');
      }
      return JSON.parse(config); // Assuming 'AppConfig' is stored as a JSON string
    } catch (error: any) {
      console.error('Error fetching AppConfig:', error.message);
      // Handle the error as appropriate for your application.
      // For example, you could return a default config, throw a custom error, etc.
      return null; // Or return a default value or handle the error differently based on your needs.
    }
  }
  get application_url() {
    return environment.application_url;
  }

}
