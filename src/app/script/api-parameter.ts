import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { ApiService } from '../services/api.service';
import { AppService } from '../services/app.service';
import { CryptographyService } from '../services/cryptography.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Injectable({
  providedIn: 'root',
})
export class ApiParameterScript {
  @BlockUI() blockUI: NgBlockUI;
  // **************************
  constructor(
    private http: HttpClient,
    private apiservices: ApiService,
    // private appservices: AppService,
    private cryptography: CryptographyService
  ) {
    // console.log('Calling API Parametere');
  }

  /**
     * {
            "table":"country_table",
            "projection":["*"],
            "whereConditions":[
                ["country_name", "INDIA"]

          ]
        }

     * @param db
     * @param apiData
     * @param offset :Numbser
     * @param limit :Numbser
     * @param order_by
     * @param cacheEnable 
     * @example "column_name"
     * @author Suryanarayan Biswal
     * @since 20-10-2022
     */
  public fetchdata(
    db: string,
    apiData: any,
    offset: Number = 0,
    limit: Number = 250,
    order_by?: string,
    cacheEnable: boolean = false,
    cacheTTL: number = 10 * 60 * 1000
  ) {
    const simpleObservable = new Observable((observer) => {
      try {
        // const cache_id=
        const cachesConfig = {
          cacheEnable: cacheEnable,
          cache_id: `${db}_${JSON.stringify(apiData)}_${offset}_${limit}_${order_by}_${cacheEnable}`,
          cacheTTL: cacheTTL
        }
        // apiData['cacheEnable']=cacheEnable
        apiData['table'] = db;
        apiData['offset'] = offset;
        apiData['limit'] = limit;
        apiData['order_by'] = order_by && order_by !== '' ? order_by : '';

        // console.log("active",this.blockUI.isActive);
        // if (!this.blockUI.isActive) this.blockUI.start('Please Wait');
        const encryptedData = this.cryptography.encryptData(apiData);
        this.apiservices.getdata(encryptedData, cachesConfig).subscribe(
          (res: any) => {
            // console.log("fetchDta",res);
            // if (this.blockUI.isActive)this.blockUI.stop();
            res = JSON.parse(
              this.cryptography.decryptData(JSON.stringify(res))
            );
            observer.next(res);
            observer.complete();
          },
          (err: any) => {

            // this.blockUI.stop();

            observer.next(err);
            observer.complete();
          }
        );
      } catch (error) {
        // this.blockUI.stop();
        // console.log({
        //   methodName: 'ApiParameterScript.fetchdata',
        //   error: error,
        // });
        observer.next(error);
        observer.complete();
      }
    });
    return simpleObservable;
  }

  public fetchdatawitherLoder(
    db: string,
    apiData: any,
    offset: Number = 0,
    limit: Number = 250,
    order_by?: string,
  ) {
    const simpleObservable = new Observable((observer) => {
      try {
        apiData['table'] = db;
        apiData['offset'] = offset;
        apiData['limit'] = limit;
        apiData['order_by'] = order_by && order_by !== '' ? order_by : '';

        const encryptedData = this.cryptography.encryptData(apiData);
        this.apiservices.getdata(encryptedData).subscribe(
          (res: any) => {

            res = JSON.parse(
              this.cryptography.decryptData(JSON.stringify(res))
            );
            observer.next(res);
            observer.complete();
          },
          (err: any) => {

            observer.next(err);
            observer.complete();
          }
        );
      } catch (error) {
        // this.blockUI.stop();
        // console.log({
        //   methodName: 'ApiParameterScript.fetchdata',
        //   error: error,
        // });
        observer.next(error);
        observer.complete();
      }
    });
    return simpleObservable;
  }
  public unsecuredFatchquary(db: string, apiData: any, cacheEnable: boolean = false,
    cacheTTL: number = 10 * 60 * 1000) {
    const simpleObservable = new Observable((observer) => {
      try {
        apiData['table'] = db;
        const cachesConfig = {
          cacheEnable: cacheEnable,
          cache_id: `${db}_${JSON.stringify(apiData)}_${cacheEnable}`,
          cacheTTL: cacheTTL
        }
        // this.blockUI.start('Please Wait');
        this.apiservices.unsecuredFatchquary(apiData,cachesConfig).subscribe(
          (res: any) => {
            // this.blockUI.stop();
            observer.next(res);
            observer.complete();
          },
          (err: any) => {
            // this.blockUI.stop();
            observer.next(err);
            observer.complete();
          }
        );
      } catch (error) {
        // this.blockUI.stop();
        // console.log({
        //   methodName: 'ApiParameterScript.fetchdata',
        //   error: error,
        // });
        observer.next(error);
        observer.complete();
      }
    });
    return simpleObservable;
  }
  /**
    * {
            "table":"country_table",
            "data":{},
            "whereConditions":{
                "country_name":"INDIA"
            ]
        } Upadte data parametr formate

    * @param db
    * @param apiData
    * @returns
    * @author Suryanarayan Biswal
    * @since 20-10-2022
    */
  public updatedata(db: string, apiData: any) {
    const simpleObservable = new Observable((observer) => {
      try {
        apiData['table'] = db;
        const encryptedData = this.cryptography.encryptData(apiData);
        this.apiservices.update(encryptedData).subscribe((res: any) => {
          observer.next(res);
          observer.complete();
        });
      } catch (error) {
        // console.log({
        //   methodName: 'ApiParameterScript.fetchdata',
        //   error: error,
        // });
        observer.next(error);
        observer.complete();
      }
    });
    return simpleObservable;
  }

  /**
    * {
    {
          "data": {"name":"test"},
          "whereConditions": { user_ID: this.appservices.authStatus.profile_id },
          "isJsonData":true,
          "jsonDataID":{user_ID: this.appservices.authStatus.profile_id}//if isJsonData=true
        }

    * @param db
    * @param apiData
    * @returns
    * @author Suryanarayan Biswal
    * @since 20-10-2022
    */
  public savedata(db: string, apiData: any) {
    const simpleObservable = new Observable((observer) => {
      try {
        apiData['table'] = db;
        apiData['isJsonData'] = apiData['isJsonData']
          ? apiData['isJsonData']
          : false;
        apiData['jsonDataID'] = apiData['isJsonData']
          ? apiData['jsonDataID']
          : {};
        // console.log(apiData);

        // const appConfig = this.appservices.getappconfig;
        // const loginInfo = this.appservices.authStatus;
        // let getrole = loginInfo['role'] ? loginInfo['role'] : '';
        // let outh = appConfig['roleConfig'][getrole] ? appConfig['roleConfig'][getrole]['authorizationDBAcess'].includes(db) : false;
        // let outhForUpdate = appConfig['roleConfig'][getrole] ? appConfig['roleConfig'][getrole]['authorizationDBAcessForUpdate'] ? appConfig['roleConfig'][getrole]['authorizationDBAcessForUpdate'].includes(db) : false : false;
        // if (appConfig['roleConfig'][getrole] && (outh && outhForUpdate)) {
        //     apiData['loginInfo'] = loginInfo;
        const encryptedData = this.cryptography.encryptData(apiData);
        this.apiservices.save(encryptedData).subscribe((res: any) => {
          observer.next(res);
          observer.complete();
        });
        // } else {
        //     observer.next({ "success": false, "message": "Permission Denied To Save Date" });
        //     observer.complete();
        // }
      } catch (error) {
        // console.log({
        //   methodName: 'ApiParameterScript.fetchdata',
        //   error: error,
        // });
        observer.next(error);
        observer.complete();
      }
    });
    return simpleObservable;
  }

  /**
   * @param db
   * @example "DB_NAME"
   * @param apiData
   * @example  {"whereConditions": { user_ID: this.appservices.authStatus.profile_id }}
   * @author Suryanarayan Biswal
   * @since 20-10-2022
   */
  public deletedata(db: string, apiData: any) {
    const simpleObservable = new Observable((observer) => {
      try {
        apiData['table'] = db;
        if (apiData['multidelete'] == undefined) {
          apiData['multidelete'] = false;
          apiData['data'] = '';
        }
        // const appConfig = this.appservices.getappconfig;
        // const loginInfo = this.appservices.authStatus;
        // let getrole = loginInfo['role'] ? loginInfo['role'] : '';
        // let outh = appConfig['roleConfig'][getrole] ? appConfig['roleConfig'][getrole]['authorizationDBAcess'].includes(db) : false;
        // let outhForDelete = appConfig['roleConfig'][getrole] ? appConfig['roleConfig'][getrole]['authorizationDBAcessForDelete'] ? appConfig['roleConfig'][getrole]['authorizationDBAcessForDelete'].includes(db) : false : false;
        // if (appConfig['roleConfig'][getrole] && (outh && outhForDelete)) {
        //     apiData['loginInfo'] = loginInfo;
        const encryptedData = this.cryptography.encryptData(apiData);
        this.apiservices.delete(encryptedData).subscribe((res: any) => {
          observer.next(res);
          observer.complete();
        });
        // } else {
        //     observer.next({ "success": false, "message": "Permission Denied for Delete Operation" });
        //     observer.complete();
        // }
      } catch (error) {
        // console.log({
        //   methodName: 'ApiParameterScript.fetchdata',
        //   error: error,
        // });
        observer.next(error);
        observer.complete();
      }
    });
    return simpleObservable;
  }

  public fetchDataFormQuery(query: any,cacheEnable: boolean = false,
    cacheTTL: number = 10 * 60 * 1000) {

      const cachesConfig = {
        cacheEnable: cacheEnable,
        cache_id: `${JSON.stringify(query)}_${cacheEnable}_${cacheTTL}`,
        cacheTTL: cacheTTL
      }
    const simpleObservable = new Observable((observer) => {
      try {
        var apData = {
          query: query,
        };
        query = this.cryptography.encryptData(apData);
        this.apiservices.fetchDataQueryApi(query,cachesConfig).subscribe(
          (res: any) => {
            try {
              res = JSON.parse(
                this.cryptography.decryptData(JSON.stringify(res))
              );
              observer.next(res);
              observer.complete();
            } catch (error) {
              observer.next({ success: false, message: error });
              observer.complete();
            }
          },
          (err: any) => {
            observer.next({ success: false, message: err });
            observer.complete();
          }
        );
      } catch (error) {
        // console.log({
        //   methodName: 'ApiParameterScript.fetchDataFormQuery',
        //   error: error,
        // });
        observer.next(error);
        observer.complete();
      }
    });
    return simpleObservable;
  }

  /**
   * @param FilePath
   * @param FileName
   * @returns
   * @author Suryanarayan Biswal
   * @since 01-11-2022
   */
  // public deleteImageFile(FilePath: any, FileName: any) {
  //     const simpleObservable = new Observable((observer) => {
  //         try {
  //             // apiData['db'] = db;
  //             var apiData: any = {}
  //             apiData['FilePath'] = FilePath;
  //             apiData['FileName'] = FileName
  //             // const appConfig = this.appservices.getappconfig;
  //             const loginInfo = this.appservices.authStatus;
  //             let getrole = loginInfo['role'] ? loginInfo['role'] : false;
  //             // let outh = appConfig['roleConfig'][getrole] ? appConfig['roleConfig'][getrole]['authorizationDBAcess'].includes(db) : false;
  //             // let outhForUpdate = appConfig['roleConfig'][getrole] ? appConfig['roleConfig'][getrole]['authorizationDBAcessForUpdate'] ? appConfig['roleConfig'][getrole]['authorizationDBAcessForUpdate'].includes(db) : false : false;
  //             if (getrole) {
  //                 apiData['loginInfo'] = loginInfo;
  //                 // this.apiservices.deleteImage(apiData).subscribe((res: any) => {
  //                 //     observer.next(res);
  //                 //     observer.complete();
  //                 // })
  //             } else {
  //                 observer.next({ "success": false, "message": "Permission Denied To Update Database" });
  //                 observer.complete();
  //             }
  //         } catch (error) {
  //             console.log({ "methodName": "ApiParameterScript.fetchdata", "error": error });
  //             observer.next(error);
  //             observer.complete();
  //         }
  //     });
  //     return simpleObservable;
  // }

  /**
        * {

            "userid":''

            }

        * @param apiData
        * @returns
        * @author Suryanarayan Biswal
        * @since 11-06-2023
        */
  public getprofile(apidata: any) {
    const simpleObservable = new Observable((observer) => {
      try {
        this.apiservices.getprofile(apidata).subscribe((res: any) => {
          observer.next(res);
          observer.complete();
        });
      } catch (error) {
        // console.log({
        //   methodName: 'ApiParameterScript.fetchdata',
        //   error: error,
        // });
        observer.next(error);
        observer.complete();
      }
    });
    return simpleObservable;
  }

  /**
        * {

            "user_id":''

            }

        * @param apiData
        * @param  apiName
        * @author Suryanarayan Biswal
        * @since 11-06-2023
        */
  public getmatches(apidata: any, apiName: any = 'matches') {
    const simpleObservable = new Observable((observer) => {
      try {
        this.apiservices.getmatches(apidata, apiName).subscribe(
          (res: any) => {
            observer.next(res);
            observer.complete();
          },
          (error: any) => {
            observer.error(error);
            observer.complete();
          }
        );
      } catch (error) {
        // console.log({methodName: 'ApiParameterScript.getmatches',error: error, });
        observer.next(error);
        observer.complete();
      }
    });
    return simpleObservable;
  }
}
