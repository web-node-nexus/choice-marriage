import { Injectable } from '@angular/core';
import { AppService } from './app.service';
import { ApiParameterScript } from '../script/api-parameter';
import { Plan } from '../appInterface/plan';
import * as _ from 'lodash';

import * as moment from 'moment';
import { BehaviorSubject, Observable } from 'rxjs';
const SecureStorage = require('secure-web-storage');
import * as CryptoJS from 'crypto-js';
import { HttpClient } from '@angular/common/http';
import { ApiService } from './api.service';
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
export class PlanService {

  plan = new BehaviorSubject<any>(null);
  private planDetails: Plan = {
    profile_id: undefined,
    current_active_plan: undefined,
    currect_active_plan_id: undefined,
    plan_history: [],
    plan_start_date: undefined,
    plan_end_date: undefined,
    plan_type: undefined,
    currect_active_plan_information: [],
    plan_expire_in_days: undefined,
    status: false,
    success: false
  }
  constructor(
    private AppService: AppService,
    // private ApiParameterScript: ApiParameterScript,
    private api:ApiService,
    private http: HttpClient
  ) {
   // console.log("Calling PlanService");

  }


  managementProfileViewPlanCount(viewuserid: any) {
    this.http.post(this.AppService.getApipath() + "profileView", { "loginuserid": this.AppService.authStatus ? this.AppService.authStatus.profile_id : '', "viewuserid": viewuserid }).subscribe((res: any) => {
      // console.log(res);
    })
  }

  fetchPlanInfo(profile_id = '') {
    const simpleObservable = new Observable((observer) => {

      const url=`getUserPlan?userId=${profile_id == '' ? this.AppService.authStatus ? this.AppService.authStatus.profile_id : '' : profile_id}`
      console.log("url",url);
      
      this.api.dynamicGetApi(url,{cacheEnable:true,cacheTTL:5*60*1000})
      // this.http.post(this.AppService.getApipath() + "getUserPlan", { "userId": profile_id == '' ? this.AppService.authStatus ? this.AppService.authStatus.profile_id : '' : profile_id })
      .subscribe((res: any) => {
        // if(res.success){
        observer.next(res);
        observer.complete();
      })
    })
    return simpleObservable

  }

  get getPlanInfo() {
    try {
      var planInfo = secureCryptoStorage.getItem('planInfo');
      // console.log("getAuthStatus",loginiinfo);
      if (planInfo != null) {
        return planInfo
      } else {
        return undefined;
      }

    } catch (error) {
      //console.log("error", error);

      return undefined
    }

  }

  set setPlanInfor(plan: Plan) {

  }

  contactViewOtherCalculation(data:any){
    return this.http.post(this.AppService.getApipath()+'contactViewOtherCalculation',data)
  }
  contactViewCalculation(data:any){
    return this.http.post(this.AppService.getApipath()+'contactViewCalculation',data)
  }


  managementSendMessageCount(){
    this.http.post(this.AppService.getApipath() + "sendMessageCalculation", { "userid": this.AppService.authStatus ? this.AppService.authStatus.profile_id : ''}).subscribe((res: any) => {
      // console.log(res);
    })
  }
  horscopeCalculation(data:any){
    return this.http.post(this.AppService.getApipath() + "horscopeCalculation", data)
  }


}
