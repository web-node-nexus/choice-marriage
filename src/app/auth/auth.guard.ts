import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, map, take } from 'rxjs';
import { AppService } from '../services/app.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private appservices: AppService, private _auth: AuthService, private _router: Router) {
    //console.log("AuthGaurd Activated");

  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    return this._auth.authCredential.pipe(
      take(1),
      map(user => {
        if (user && user.isLogin && user.token) {


          return true;
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
