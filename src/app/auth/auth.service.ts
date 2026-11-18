import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { BehaviorSubject, Observable, Subject, map, take, tap } from 'rxjs';
import { AuthRespose } from '../appInterface/Auth-Respons';
import { authCredential } from '../appModules/authCredential';
const SecureStorage = require('secure-web-storage');
import * as CryptoJS from 'crypto-js';
import { environment } from 'src/environments/environment';
import { PlanService } from '../services/plan.service';
import { ApiParameterScript } from '../script/api-parameter';
import { Roles } from './roles.enum';
import { NgxPermissionsService, NgxRolesService } from 'ngx-permissions';
import * as _ from 'lodash';
import { Permission } from './permissions.enum';
import { AppService } from '../services/app.service';
import { CryptographyService } from '../services/cryptography.service';

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
export class AuthService {
  authCredential = new BehaviorSubject<any>(null);
  deactiveAutoLogout: any
  httpOptions: any
  constructor(
    private http: HttpClient,
    private PlanService: PlanService,
    private ApiParameterScript: ApiParameterScript,
    private ngxRolesService: NgxRolesService,
    private permissionsService: NgxPermissionsService,
    private app: AppService,
    private crypto: CryptographyService
  ) {
    // console.log("Calling Auth Services");
    this.httpOptions = {
      withCredentials: true,
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
  }
  private getApipath() {
    return environment.baseApiURL;
  }
  public signIn(credential: any) {

    return this.http.post<AuthRespose>(`${this.getApipath()}auth`, credential, this.httpOptions)
  }

  public generateResetlink(apidata: any) {
    return this.http.post<any>(`${this.getApipath()}generate_reset_password`, apidata)
  }

  public validateResetlink(urlToken: any) {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${urlToken}`);
    const requestOptions = {
      headers: headers,
    };
    return this.http.get(`${this.getApipath()}reset_password_token_validator`, requestOptions).pipe(
      take(1),
      map((res: any) => {

        if (res.success) {
          res['encryptedAccessData'] = this.crypto.decryptData(res['encryptedAccessData'])
        }
        return res
      })

    );
  }

  public resetPassword(apiData: any, token: any) {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const requestOptions = {
      headers: headers,
    };
    return this.http.post<any>(`${this.getApipath()}reset_password`, apiData, requestOptions)

  }

  public getAuthStatus() {
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

  public authentication(profile_id: any, profile_name: string, profile_email: string, isLogin: boolean, role: String, _refreshkey: any, expiration_date: any) {
    var userInfo = new authCredential(profile_id, profile_name, profile_email, isLogin, role, _refreshkey, expiration_date);
    // (window as any).isLoggedIn = userInfo.token;
    this.authCredential.next(userInfo);
    secureCryptoStorage.setItem("authInfo", userInfo);
    this.autoLogout(expiration_date)
    this.authCredential.subscribe((authInfo: any) => {
      if (authInfo) {
        this.setupPermissionForViewProfile().subscribe()
        this.app.setAuthorizationTokenKey = authInfo.token ? authInfo.token : null
        this.PlanService.fetchPlanInfo().subscribe((res: any) => {
          secureCryptoStorage.setItem("planInfo", res);
          this.PlanService.plan.next(res)
        })
        this.ApiParameterScript.getprofile({ "userid": `${profile_id}` }).subscribe((res: any) => {
          // console.log(res);
          secureCryptoStorage.setItem("authProfile", res);
        })
      }
    })

  }
  public autoSignIn() {
    // console.log("AutoSignIn Time", moment().format());
    var authInfo = this.getAuthStatus();
    if (!authInfo) {
      //console.log("APP IS LOST AUTH MODE PLEASE LOGIN AGAIN...");
      this.ngxRolesService.addRole(Roles.GUEST_USER, [])
      return;
    }
    const currentDate = Math.floor(new Date().getTime() / 1000);
    // Convert the current date and time to a Unix timestamp in seconds
    if (authInfo.expiration_date > currentDate) {
      //console.log("AUTO LOGIN SUCCESSFULL");
      this.ngxRolesService.addRole(Roles.LOGIN_USER, [])
      // this.ngxRolesService.addRole(Roles.MEMBERSHIP_USER,[])
      this.authentication(authInfo.profile_id, authInfo.profile_name, authInfo.profile_email, true, authInfo.role, authInfo._refreshkey, authInfo.expiration_date)
    } else {
      this.ngxRolesService.addRole(Roles.GUEST_USER, [])
      // console.log("YOUR TOKEN EXPIRA");
      this.authCredential.next(null)
      localStorage.clear()
    }

  }
  public autoLogout(expiration_date: number) {
    const currentDate = Math.floor(new Date().getTime() / 1000);
    // console.log("activating Auto Logout", expiration_date);
    var delay = (expiration_date - currentDate) * 1000;
    // console.log("delay", delay);

    // console.log("expiration_date", moment(expiration_date * 1000).format('llll'));
    this.deactiveAutoLogout = setTimeout(() => {
      this.logout()
    }, delay);

  }
  public logout() {
    this.authCredential.next(null);
    location.reload()
    localStorage.clear();
    if (this.deactiveAutoLogout) {
      // console.log("deactivating Auto Logout");
      clearTimeout(this.deactiveAutoLogout)
    }

  }
  public logoutForSUser() {
    this.authCredential.next(null);
    localStorage.clear();
    if (this.deactiveAutoLogout) {
      // console.log("deactivating Auto Logout");
      clearTimeout(this.deactiveAutoLogout)
    }

  }








  public setupPermissionForViewProfile() {
    // console.log("Calling setupPermissionForViewProfile");

    const simpleObservable = new Observable((observer) => {
      try {
        var LOGIN_INFO = this.getAuthStatus();
        if (LOGIN_INFO) {
          this.PlanService.fetchPlanInfo(LOGIN_INFO.profile_id).subscribe((planInfo: any) => {
            if (planInfo && planInfo.success) {
              let plan_expire_in_days = planInfo.plan_expire_in_days ? planInfo.plan_expire_in_days : 0;
              let current_active_plan = planInfo.current_active_plan ? planInfo.current_active_plan : {}

              if (plan_expire_in_days >= 1 && current_active_plan['active_status']) {

                this.ngxRolesService.addRole(Roles.MEMBERSHIP_USER, [])
                // console.log(LOGIN_INFO);
                let param = {
                  "projection": ['*'],
                  "whereConditions": { "user_id": LOGIN_INFO.profile_id }
                }
                this.ApiParameterScript.fetchdata('edited_plan_details', param).subscribe((edited_plan_details: any) => {

                  // console.log("chiku", edited_plan_details);
                  if (edited_plan_details.success && edited_plan_details['data'].length > 0) {
                    const edited_plan_detailsRes = edited_plan_details['data'][0];
                    this.permissionsService.addPermission([Permission.PROFILE_PHOTO], (): boolean => {
                      return planInfo.currect_active_plan_information ? planInfo.currect_active_plan_information.membership_plan_no_of_photo > 0 : false
                    });
                    this.permissionsService.addPermission([Permission.PROFILE_CONTACT], (): boolean => {
                      return planInfo.currect_active_plan_information ? planInfo.currect_active_plan_information.membership_plan_no_of_contact > 0 : false
                    });
                    this.permissionsService.addPermission([Permission.PROFILE_PHOTO], (): boolean => {
                      return edited_plan_detailsRes.profile_viwe > 0 && edited_plan_detailsRes.photoviwe > 0
                    });
                    this.permissionsService.addPermission([Permission.PROFILE_CONTACT], (): boolean => {
                      return edited_plan_detailsRes.profile_viwe > 0 && edited_plan_detailsRes.contact_view > 0
                    });
                    this.permissionsService.addPermission([Permission.PROFILE_DETAILS], (): boolean => {
                      return edited_plan_detailsRes.profile_viwe > 0
                    });
                    this.permissionsService.addPermission([Permission.PROFILE_SEND_MESSAGE], (): boolean => {
                      return edited_plan_detailsRes.sendmessage > 0
                    });
                  }
                })
                observer.next(true);
                observer.complete();
              } else {
                this.ngxRolesService.flushRolesAndPermissions()
                observer.next(false);
                observer.complete();
              }

            } else {
              this.ngxRolesService.addRole(Roles.NOTMEMBERSHIP_USER, [])
              observer.next(false);
              observer.complete();
            }

          }, (error: any) => {
            this.ngxRolesService.addRole(Roles.NOTMEMBERSHIP_USER, [])
            observer.next(false);
            observer.complete();

          })
        } else {
          observer.next(false);
          observer.complete();
        }


      } catch (error) {
        console.log({ "methodName": "AuthServices.setupPermissionForViewProfile", "error": error });
        observer.next(false);
        observer.complete();
      }
    });


    return simpleObservable;
  }


  public setupPermissionBaseOnUserProfile(user_id: string) {
    // console.log("Calling setupPermissionBaseOnUserProfile For =>>>",user_id);
    const simpleObservable = new Observable((observer) => {
      try {
        var LOGIN_INFO = this.getAuthStatus();
        let param = {
          "projection": ['*'],
          "whereConditions": { "profile_view_by_profile_id": LOGIN_INFO.profile_id, "viewed_profile_id": user_id }
        }
        this.ApiParameterScript.fetchdata('user_activities_for_view_profile', param).subscribe((res: any) => {
          // console.log("user_activities_for_view_profile", res);
          // var grantPermission=false
          if (res.success && res['data'].length > 0) {
            //  this.permissionsService.
            // this.permissionsService.addPermission([Permission.PROFILE_PHOTO, Permission.PROFILE_DETAILS], (): boolean => {
            //   return true
            // });
            setTimeout(() => {
              this.permissionsService.loadPermissions([Permission.PROFILE_PHOTO, Permission.PROFILE_DETAILS])
            }, 200);

          } else {

            this.setupPermissionForViewProfile().subscribe()
          }

          // setTimeout(() => {
          observer.next(true);
          observer.complete();
          // }, 200);

        })
      } catch (error) {
        //  console.log({ "methodName": "setupPermissionBaseOnUserProfile", "error": error });
        observer.next(false);
        observer.complete();
      }
    });


    return simpleObservable;


  }

  public revokePermission() {
    this.permissionsService.flushPermissions()
  }
}
