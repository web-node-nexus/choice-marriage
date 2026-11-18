import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import Dexie from 'dexie';
import { catchError, from, map, Observable, of, switchMap, throwError } from 'rxjs';
import { AppService } from 'src/app/services/app.service';
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private db: Dexie;
  httpHeaders: any;
  constructor(private http: HttpClient, private appservices: AppService) {
    this.db = new Dexie('MyCacheDatabase');
    this.db.version(1).stores({
      postCache: 'id,timestamp',
      getCache:'id,timestamp'  // IndexedDB store with id and timestamp
    })
    // console.log("Calling Api Services");
    var headers = new HttpHeaders()
      // .set("Access-Control-Allow-Origin", "*")
      .set("Content-Type", "application/json")
    this.httpHeaders = headers;

  }


  public dynamicGetApi(apiPath: any, cacheConfig?: { cache_id?: string, cacheEnable?: boolean ,cacheTTL?:number}): Observable<any> {
    const cacheKey = `${this.appservices.getApipath()}${apiPath}`;
    const now = Date.now();
    // console.log(cacheConfig);
    const defaultTTL = 10 * 60 * 1000; // Default TTL of 5 minutes
    const cacheTTL = cacheConfig?.cacheTTL ?? defaultTTL; // Use provided TTL or default
    if (cacheConfig?.cacheEnable) {
      // Convert the Dexie get promise to an observable
      return from(this.db.table('getCache').get(cacheKey)).pipe(
        switchMap((cachedData: any) => {
          if (cachedData && (now - cachedData.timestamp < cacheTTL)) { // Cache expiration check
            // Return cached data if valid
            // console.log("cached data found",cachedData);
            return of(cachedData.data);
          } else {
            // Make HTTP request if data is not cached or expired
            return this.http.get(this.appservices.getApipath()+ apiPath).pipe(
              map(response => {
                // Store response in IndexedDB with timestamp
                this.db.table('getCache').put({ id: cacheKey, data: response, timestamp: now });
                return response;
              }),
              catchError(this.handleError)
            );
          }
        }),
        catchError(this.handleError)
      );
    } else {
      // Directly make HTTP request if caching is not enabled
      return  this.http.get(this.appservices.getApipath() + apiPath)

    }
  }

  public getdata(apiData: any, cacheConfig?: { cache_id: string, cacheEnable?: boolean ,cacheTTL?:number}): Observable<any> {
    const cacheKey = `post-cache-${cacheConfig?.cache_id}`;
    const now = Date.now();
    // console.log(cacheConfig);
    const defaultTTL = 10 * 60 * 1000; // Default TTL of 5 minutes
    const cacheTTL = cacheConfig?.cacheTTL ?? defaultTTL; // Use provided TTL or default
    if (cacheConfig?.cacheEnable) {
      // Convert the Dexie get promise to an observable
      return from(this.db.table('postCache').get(cacheKey)).pipe(
        switchMap((cachedData: any) => {
          if (cachedData && (now - cachedData.timestamp < cacheTTL)) { // Cache expiration check
            // Return cached data if valid
            // console.log("cached data found",cachedData);

            return of(cachedData.data);
          } else {
            // Make HTTP request if data is not cached or expired
            return this.http.post<any>(this.appservices.getApipath() + 'fetch', apiData, { headers: this.httpHeaders }).pipe(
              map(response => {
                // Store response in IndexedDB with timestamp
                this.db.table('postCache').put({ id: cacheKey, data: response, timestamp: now });
                return response;
              }),
              catchError(this.handleError)
            );
          }
        }),
        catchError(this.handleError)
      );
    } else {
      // Directly make HTTP request if caching is not enabled
      return this.http.post<any>(this.appservices.getApipath() + 'fetch', apiData, { headers: this.httpHeaders }).pipe(
        catchError(this.handleError)
      );
    }
  }

  private handleError(error: any) {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      // Client-side or network error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Backend error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(() => new Error(errorMessage));
  }
  public unsecuredFatchquary(apiData: any,cacheConfig?: { cache_id?: string, cacheEnable?: boolean ,cacheTTL?:number}) {
    const cacheKey = `post-cache-${cacheConfig?.cache_id}`;
    const now = Date.now();
    // console.log(cacheConfig);
    const defaultTTL = 10 * 60 * 1000; // Default TTL of 5 minutes
    const cacheTTL = cacheConfig?.cacheTTL ?? defaultTTL; // Use provided TTL or default
    if (cacheConfig?.cacheEnable) {
      // Convert the Dexie get promise to an observable
      return from(this.db.table('postCache').get(cacheKey)).pipe(
        switchMap((cachedData: any) => {
          if (cachedData && (now - cachedData.timestamp < cacheTTL)) { // Cache expiration check
            // Return cached data if valid
            // console.log("cached data found",cachedData);

            return of(cachedData.data);
          } else {
            // Make HTTP request if data is not cached or expired
            return this.http.post<any>(this.appservices.getApipath() + 'unsecuredFatchquary', apiData, { headers: this.httpHeaders }).pipe(
              map(response => {
                // Store response in IndexedDB with timestamp
                this.db.table('postCache').put({ id: cacheKey, data: response, timestamp: now });
                return response;
              }),
              catchError(this.handleError)
            );
          }
        }),
        catchError(this.handleError)
      );
    } else {
      // Directly make HTTP request if caching is not enabled
      return this.http.post<any>(this.appservices.getApipath() + 'unsecuredFatchquary', apiData, { headers: this.httpHeaders }).pipe(
        catchError(this.handleError)
      );
    }

    // return this.http.post(this.appservices.getApipath() + 'unsecuredFatchquary', JSON.stringify(apiData), { headers: this.httpHeaders });
  }

  public update(apiData: any) {
    return this.http.post(this.appservices.getApipath() + 'update', apiData, { headers: this.httpHeaders })

  }

  public save(apiData: any) {
    return this.http.post(this.appservices.getApipath() + 'save', apiData, { headers: this.httpHeaders })
  }

  public delete(apiData: any) {
    const options = {
      body: apiData  // Data to be sent in the body of the request
    };
    return this.http.delete(this.appservices.getApipath() + 'delete', options)
  }






  public fetchDataQueryApi(query: any, cacheConfig?: { cache_id: string, cacheEnable?: boolean ,cacheTTL?:number}):Observable<any> {
    // return this.http.get(this.appservices.getApipath() + 'generic/getDataFormQuery.php?token='+this.appservices.authStatus._refreshkey+'&query='+encodeURIComponent(JSON.stringify(query)));

    const cacheKey = `post-cache-${cacheConfig?.cache_id}`;
    const now = Date.now();
    // console.log(cacheConfig);
    const defaultTTL = 10 * 60 * 1000; // Default TTL of 5 minutes
    const cacheTTL = cacheConfig?.cacheTTL ?? defaultTTL; // Use provided TTL or default
    if (cacheConfig?.cacheEnable) {
      // Convert the Dexie get promise to an observable
      return from(this.db.table('postCache').get(cacheKey)).pipe(
        switchMap((cachedData: any) => {
          if (cachedData && (now - cachedData.timestamp < cacheTTL)) { // Cache expiration check
            // Return cached data if valid
            // console.log("cached data found",cachedData);

            return of(cachedData.data);
          } else {
            // Make HTTP request if data is not cached or expired
            return this.http.post<any>(this.appservices.getApipath() + 'getDataFormQuery', query, { headers: this.httpHeaders }).pipe(
              map(response => {
                // Store response in IndexedDB with timestamp
                this.db.table('postCache').put({ id: cacheKey, data: response, timestamp: now });
                return response;
              }),
              catchError(this.handleError)
            );
          }
        }),
        catchError(this.handleError)
      );
    } else {
      // Directly make HTTP request if caching is not enabled
      return this.http.post<any>(this.appservices.getApipath() + 'getDataFormQuery', query, { headers: this.httpHeaders }).pipe(
        catchError(this.handleError)
      );
    }

    // return this.http.post(this.appservices.getApipath() + 'getDataFormQuery', query, { headers: this.httpHeaders })
  }

  public deleteImage(apiData: any) {
    return this.http.post(this.appservices.getApipath() + `shop/delete_image.php`, apiData)
  }
  public socialMediaLink(apiData: any) {
    return this.http.post(this.appservices.getApipath() + `socialMediaLink`, apiData)
  }

  public getSocialMediaLink() {
    return this.http.get(this.appservices.getApipath() + `getsocialMediaLink`)
  }

  public insertCountry(param: any) {
    return this.http.post(this.appservices.getApipath() + `country`, param)
  }
  public state(param: any) {
    return this.http.post(this.appservices.getApipath() + `state`, param)
  }


  public getprofile(param: any) {
    return this.http.post(this.appservices.getApipath() + `getprofile`, JSON.stringify(param), { headers: this.httpHeaders })
  }

  public getmatches(param: any, apiname: any = 'matches') {
    return this.http.post(this.appservices.getApipath() + apiname, JSON.stringify(param), { headers: this.httpHeaders }).pipe(
      map((response: any) => {
        // Check if the "data" property exists and is an array
        if (response && response.data && Array.isArray(response.data)) {
          // Modify each user object by adding a timestamp property
          const modifiedData = response.data.map((user: any) => {
            return {
              ...user,
              profileImageUrl: this.appservices.getFilePath() + user.user_profile_image,
              profile_full_name: user.user_fname + ' ' + user.user_lname
            };
          });

          // Return the modified response object
          return { ...response, data: modifiedData };
        }

        // Return the original response if the structure is not as expected
        return response;
      })
    );
  }
  public successStory(param: any) {
    return this.http.post(this.appservices.getApipath() + 'successStory', param, { headers: this.httpHeaders })
  }
  public getAllData() {
    return this.http.post(this.appservices.getApipath() + 'getAllData', {}, { headers: this.httpHeaders })
  }
  public aboutus(param: any) {
    return this.http.post(this.appservices.getApipath() + 'aboutus', param, { headers: this.httpHeaders })
  }
  public getAllCount(param: any) {
    return this.http.post(this.appservices.getApipath() + 'getAllCount', param, { headers: this.httpHeaders })
  }
  public feedback(param: any) {
    return this.http.post(this.appservices.getApipath() + 'feedback', param, { headers: this.httpHeaders })
  }
  public checkpass(param: any) {
    return this.http.post(this.appservices.getApipath() + 'checkpass', param, { headers: this.httpHeaders })
  }
  public idProofUplode(param: any) {
    return this.http.post(this.appservices.getApipath() + 'idProofUplode', param, { headers: this.httpHeaders })
  }
  public horoscopeUplode(param: any) {
    return this.http.post(this.appservices.getApipath() + 'horoscopeUplode', param, { headers: this.httpHeaders })
  }
  public paymentSlipUplode(param: any) {
    return this.http.post(this.appservices.getApipath() + 'paymentSlipUplode', param, { headers: this.httpHeaders })
  }
  public perfactMatch(param: any) {
    return this.http.post(this.appservices.getApipath() + 'Perfect_Match', param, { headers: this.httpHeaders })
  }
  public spotlight(param: any) {
    return this.http.post(this.appservices.getApipath() + 'spotlight', param, { headers: this.httpHeaders })
  }
  public getOnlinedata(param: any) {
    return this.http.post(this.appservices.getApipath() + 'getOnlinedata', param, { headers: this.httpHeaders })
  }
  public RecentlyJoinedMatches(param: any) {
    return this.http.post(this.appservices.getApipath() + 'RecentlyJoinedMatches', param, { headers: this.httpHeaders })
  }

  public byCastpremimusMatches(param: any) {
    return this.http.post(this.appservices.getApipath() + 'byCastpremimusMatches', param, { headers: this.httpHeaders })
  }
  public byCastgetOnlinedata(param: any) {
    return this.http.post(this.appservices.getApipath() + 'byCastgetOnlinedata', param, { headers: this.httpHeaders })
  }
  public byCastgetSpotlightdata(param: any) {
    return this.http.post(this.appservices.getApipath() + 'byCastgetSpotlightdata', param, { headers: this.httpHeaders })
  }
  public byCastRecentlyJoinedMatches(param: any) {
    return this.http.post(this.appservices.getApipath() + 'byCastRecentlyJoinedMatches', param, { headers: this.httpHeaders })
  }
  public byCastmatchesforindivisual(param: any) {
    return this.http.post(this.appservices.getApipath() + 'byCastmatchesforindivisual', param, { headers: this.httpHeaders })
  }

  public byOtherCastpremimusMatches(param: any) {
    return this.http.post(this.appservices.getApipath() + 'byOtherCastpremimusMatches', param, { headers: this.httpHeaders })
  }
  public byOtherCastgetOnlinedata(param: any) {
    return this.http.post(this.appservices.getApipath() + 'byOtherCastgetOnlinedata', param, { headers: this.httpHeaders })
  }
  public byOtherCastgetSpotlightdata(param: any) {
    return this.http.post(this.appservices.getApipath() + 'byOtherCastgetSpotlightdata', param, { headers: this.httpHeaders })
  }
  public byOtherCastRecentlyJoinedMatches(param: any) {
    return this.http.post(this.appservices.getApipath() + 'byOtherCastRecentlyJoinedMatches', param, { headers: this.httpHeaders })
  }
  public byOtherCastmatchesforindivisual(param: any) {
    return this.http.post(this.appservices.getApipath() + 'byOtherCastmatchesforindivisual', param, { headers: this.httpHeaders })
  }
  public suspended(param: any) {
    return this.http.post(this.appservices.getApipath() + 'suspended', param, { headers: this.httpHeaders })
  }
  public getcitynamefromlogitudeandlatitude(param: any) {
    return this.http.post(this.appservices.getApipath() + 'getcitynamefromlogitudeandlatitude', param, { headers: this.httpHeaders })
  }
  public dynaquayunsequary(param: any) {
    return this.http.post(this.appservices.getApipath() + 'dynaquayunsequary', param, { headers: this.httpHeaders })
  }
  public contactViewOveralCalculation(param: any) {
    return this.http.post(this.appservices.getApipath() + 'contactViewOveralCalculation', param, { headers: this.httpHeaders })
  }

}
