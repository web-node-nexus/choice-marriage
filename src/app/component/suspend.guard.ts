import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable, map, take } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { AppService } from '../services/app.service';
import Swal from 'sweetalert2';
import { ApiService } from '../services/api.service';
import * as moment from 'moment';
import { ApiParameterScript } from '../script/api-parameter';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
Router

@Injectable({
  providedIn: 'root',
})
export class SuspendGuard implements CanActivate {
  @BlockUI() blockUI: NgBlockUI;
  // **************************
  constructor(
    private appservices: AppService,
    private _auth: AuthService,
    private _router: Router,
    private ApiService: ApiService,
    private ApiParameterScript: ApiParameterScript,
  ) {
    //console.log("AuthGaurd Activated");
  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this._auth.authCredential.pipe(
      take(1),
      map((user) => {
        let userid = localStorage.getItem('id');
        let query = {
          id: userid,
        };
        console.log(query);
        this.ApiService.suspended(query).subscribe((res: any) => {
          if (res.success) {
            console.log(res.data.deleted);
            if (res.data.deleted == 0) {
              this._router.navigate(['v1/my-profile']);
              Swal.fire({
                title: 'Suspended',
                text: 'Your account has been suspended.',
                icon: 'warning',
                allowOutsideClick: false,
                showConfirmButton: true,
                confirmButtonText: 'Logout',
              }).then((result) => {
                if (result.isConfirmed) {
                  var date = moment.utc().format('YYYY-MM-DD HH:mm:ss');
                  var localTime: any = moment.utc(date).toDate();
                  localTime = moment(localTime).format('YYYY-MM-DD HH:mm:ss');
                  let logindata = {
                    data: {
                      logout_date_time: localTime,
                      current_login_states: 0,
                    },
                    whereConditions: {
                      user_id: this.appservices.authStatus.profile_id,
                      current_login_states: 1,
                    },
                  };

                  this.ApiParameterScript.updatedata('login_activity', logindata).subscribe(
                    (res) => {}
                  );
                  var apidata = {
                    data: { online_status: 0 },
                    whereConditions: { user_id: this.appservices.authStatus.profile_id },
                  };

                  this.blockUI.start('Please Wait We Are Reverting Your Access');
                  this.ApiParameterScript.updatedata('user_info', apidata).subscribe(
                    (res: any) => {
                      this.blockUI.stop();
                      // if(res.success){
                      this._auth.logoutForSUser();
                      this._router.navigate(['/contact-us']).then(() => {
                        window.location.reload();
                      });
                      // }
                    }
                  );
                }
              });
              return false;
            } else {
              return true;
            }
          } else {
            return true;
          }
        });
        return true;
      })
    );
  }
}
