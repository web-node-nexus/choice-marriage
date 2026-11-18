import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppService } from './app.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class AppInitializationServiceService {
  @BlockUI() blockUI: NgBlockUI;
  constructor(private http: HttpClient, private app: AppService,private api:ApiService) {}

  getAppConfiguration() {
    this.blockUI.start('Please Wait This App Is Getting Ready For You...');
    const simpleObservable = new Observable((observer) => {
      this.api.dynamicGetApi('setting',{cacheEnable:true,cacheTTL:10 * 60 *60* 1000}).subscribe(
      // this.http.get(this.app.getApipath() + 'setting').subscribe(
        (config: any) => {
          this.blockUI.stop();
          localStorage.setItem('AppConfig', JSON.stringify(config));
          observer.next(config);
          observer.complete();
        },
        () => {
          this.blockUI.stop();
          observer.next(null);
          observer.complete();
        }
      );
    });
    return simpleObservable;
  }
}
