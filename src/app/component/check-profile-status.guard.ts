import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, map, take } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { AppService } from '../services/app.service';

@Injectable({
  providedIn: 'root'
})
export class CheckProfileStatusGuard implements CanActivate {

  constructor(private appservices: AppService, private _auth: AuthService, private _router: Router) {
    //console.log("AuthGaurd Activated");

  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {


      return this._auth.authCredential.pipe(
        take(1),
        map(user => {
         // console.log("Profile",this.appservices.authProfile);
          //console.log();
          if (user && user.isLogin && user.token) {

            if(this.appservices.authProfile && this.appservices.authProfile['success'] && this.appservices.authProfile['user_profile_status']=='Completed' && this.appservices.authProfile.user_info.user_status == 'Approved' )
            {
              return true
            }else{
              this._router.navigate(['/v1/setup/profile']);
              return false
            }
          } else {
            // return this._router.createUrlTree(['pages/error']);

            if (state.url=='/') {
              return true
            }
            this._router.navigate(['/'], { queryParams: { redirectUrl: state.url } });
            return false
          }
        })
      );

  }

}
