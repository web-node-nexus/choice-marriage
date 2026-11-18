import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { AuthService } from 'src/app/auth/auth.service';
import { RegistrationComponent } from 'src/app/shared/registration/registration.component';
import { ApiParameterScript } from 'src/app/script/api-parameter';
import { environment } from 'src/environments/environment';
import { AppService } from 'src/app/services/app.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { ForgetComponent } from 'src/app/auth/forget/forget.component';
import { AppInitializationServiceService } from 'src/app/services/app-initialization-service.service';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;

  isLogin: boolean = false;
  authInfo: any;
  applik: any;
  homepagecontent: any;
  homepageicon: any;
  url: any = environment.filePath + 'logo_image/';
  urladv: any = environment.filePath + 'Advertisement/banner/';
  hide: boolean = true;
  loginForm = new FormGroup({
    userID: <any>new FormControl('', [Validators.required]),
    password: <any>new FormControl('', [Validators.required]),
  });
  redirectUrl: any;

  signAndRegisterBtnClick: boolean = true;
  maritalstatus: any[] = [];
  urlsstory: any = environment.filePath + 'successstory/';
  whatsapp: any;
  adv2: any;
  adv1: any;
  city: any[] = [];
  latitude: number;
  longitude: number;
  // **************************
  constructor(
    config: NgbModalConfig,
    private modalService: NgbModal,
    private auth: AuthService,
    private ApiParameter: ApiParameterScript,
    private app: AppService,
    private alert: ToastrService,
    private activeRouter: ActivatedRoute,
    private router: Router,
    private AppInitializationServiceService: AppInitializationServiceService,
    private ApiService: ApiService
  ) { }
  customOptionsMainBanner: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    navSpeed: 1200,
    navText: ['&#8249', '&#8250;'],
    responsive: {
      0: {
        items: 1,
      },
      400: {
        items: 1,
      },
      760: {
        items: 1,
      },
      1000: {
        items: 1,
      },
    },
    nav: false,
    autoplay: true,
    autoplaySpeed: 1500,
  };

  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: true,
    navSpeed: 600,
    navText: ['&#8249', '&#8250;'],
    responsive: {
      0: {
        items: 1,
        margin: 10,
      },
      400: {
        items: 2,
        margin: 10,
      },
      760: {
        items: 3,
        margin: 10,
      },
      1000: {
        items: 4,
        margin: 10,
      },
    },
    nav: false,
  };
  customOptionsadv: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: true,
    navSpeed: 600,
    navText: ['&#8249', '&#8250;'],
    autoplay: true,
    autoplayTimeout: 3000,
    responsive: {
      0: {
        items: 1,
        margin: 10,
      },
      400: {
        items: 1,
        margin: 10,
      },
      760: {
        items: 1,
        margin: 10,
      },
      1000: {
        items: 1,
        margin: 10,
      },
    },
    nav: false,
  };

  ngOnInit(): void {
    this.city = [];
    this.promptForLocation();
    this.getAllData();
    this.redirectUrl =
      this.activeRouter.snapshot.queryParamMap.get('redirectUrl') || '/';
    this.applik = this.app['appConfig']
      ? this.app['appConfig']['socialMediaList']['application_link']
      : {};
    this.homepagecontent = this.app['appConfig']
      ? this.app['appConfig']['homePageContent']['home_page_content']
      : '<h1>Connecting <span class="text-danger">Hearts <i class="fa-solid fa-hand-holding-heart" style="color: #ff0505;"></i></span> Creating Futures: Your Matrimonial Destiny!</h1>';
    this.homepageicon = this.app['appConfig']
      ? this.app['appConfig']['homePageMainImage']['image']
      : 'relationship_cuple.png';
    this.whatsapp = this.app['appConfig']?.socialMediaList?.whatsapp_no;
    this.auth.authCredential.subscribe((res: any) => {
      if (res) {
        this.isLogin = res.token ? true : false;
        this.authInfo = this.auth.getAuthStatus()
          ? this.auth.getAuthStatus()
          : res;
        if (this.isLogin) {
          this.router.navigateByUrl('/v1/search_match');
        }
      }
    });
  }

  promptForLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.latitude = position.coords.latitude;
          this.longitude = position.coords.longitude;
          console.log(this.latitude);
          console.log(this.longitude);

          let param = {
            latitude: this.latitude,
            longitude: this.longitude,
          };
          this.ApiService.getcitynamefromlogitudeandlatitude(param).subscribe(
            (res: any) => {
              if (res.status) {
                this.city = res?.city_name;
                console.log(this.city);
                this.upAdv(this.city);
                this.downAdv(this.city);
              } else {
                this.city = [];
                //console.log(this.city);
                this.upAdv(this.city);
                this.downAdv(this.city);
              }
            }
          );
        },
        (error) => {
          this.city = [];
          // console.log(this.city);
          this.upAdv(this.city);
          this.downAdv(this.city);
        }
      );
    } else {
      this.city = [];
      this.upAdv(this.city);
      this.downAdv(this.city);
      // console.log(this.city);
    }
  }

  public letsBegin() {
    this.blockUI.start('Just Wait..');
    const modalRef = this.modalService.open(RegistrationComponent, {
      size: 'xl',
      backdrop: false,
      scrollable: true,
    });
  }

  login() {


    if (this.loginForm.valid) {
      var loginData: any = this.loginForm.value;
      loginData['login_date_time'] = moment().toISOString();
      this.auth.signIn(loginData).subscribe(
        (authRes: any) => {
          // let authRes = JSON.parse(atob(res.id));
          //console.log(res);

          if (authRes.status) {
            //   var date = moment.utc().format('YYYY-MM-DD HH:mm:ss');
            //   var localTime: any = moment.utc(date).toDate();
            //   localTime = moment().format('YYYY-MM-DD HH:mm:ss');
            //   let logindata = {
            //     "data": {
            //       'user_id': res.profile_id,
            //       'login_date_time': localTime,
            //       'current_login_states': 1
            //     },
            //     'table': 'login_activity'
            //   }
            // this.ApiService.save(logindata).subscribe((res) => { });
            // localStorage.setItem('loginiinfo', JSON.stringify(res))
            // this.PlanService.fetchPlanInfo(res.profile_id).subscribe((plan: any) => {
            //   this.blockUI.stop()
            //   this.alert.success(res.message, "Done");
            //   this.PlanService.plan.next(plan)
            //   secureCryptoStorage.setItem("planInfo", plan);
            // var expiration_date = new Date(new Date().getTime() + 86400 * 1000).toString();
            this.auth.authentication(
              authRes.profile_id,
              authRes.profile_name,
              authRes.profile_email,
              true,
              'LOGIN_USER',
              authRes.token,
              authRes.exp
            );
            location.href = this.redirectUrl;
            // })
          } else {
            this.blockUI.stop();
            this.alert.error(authRes.message);
          }
        },
        (err: any) => {
          this.blockUI.stop();
          this.alert.error('error', 'Error');
        }
      );
    } else {
    }
  }

  getAllData() {
    this.ApiParameter.unsecuredFatchquary('success_story_by_user', {
      projection: ['*'],
      whereConditions: { status: 1 },
    }).subscribe((res: any) => {
      if (res.success && res['data'].length > 0) {
        this.maritalstatus = res['data'];
      }
    });
  }
  upAdv(data: any) {
    console.log('upAdv');

    if (data.length == 0) {
      this.ApiParameter.unsecuredFatchquary('advertisement', {
        projection: ['*'],
        whereConditions: { type: 1, status: 1, global: 1 },
      }).subscribe((res: any) => {
        if (res.success && res['data'].length > 0) {
          //console.log();
          this.adv1 = res['data'];
          console.log('top', this.adv1);
        }
      });
    } else {
      var query = `
      (SELECT * FROM advertisement
 WHERE type = 1
   AND status = 1
   AND global = 1
   )
UNION
(SELECT * FROM advertisement
 WHERE type = 1
   AND status = 1
   AND global = 0
   AND city LIKE '%${data[0]?.city_name}%')
UNION
(SELECT * FROM advertisement
 WHERE type = 1
   AND status = 1
   AND global = 0
   AND city LIKE '%${data[1]?.city_name}%')
   UNION
(SELECT * FROM advertisement
 WHERE type = 1
   AND status = 1
   AND global = 0
   AND city LIKE '%${data[2]?.city_name}%')
   UNION
   (SELECT * FROM advertisement
 WHERE type = 1
   AND status = 1
   AND global = 0
   AND city LIKE '%${data[3]?.city_name}%')
   UNION
   (SELECT * FROM advertisement
 WHERE type = 1
   AND status = 1
   AND global = 0
   AND city LIKE '%${data[4]?.city_name}%')
   UNION
   (SELECT * FROM advertisement
 WHERE type = 1
   AND status = 1
   AND global = 0
   AND city LIKE '%${data[5]?.city_name}%')
   UNION
   (SELECT * FROM advertisement
 WHERE type = 1
   AND status = 1
   AND global = 0
   AND city LIKE '%${data[6]?.city_name}%')
   UNION
   (SELECT * FROM advertisement
 WHERE type = 1
   AND status = 1
   AND global = 0
   AND city LIKE '%${data[7]?.city_name}%')
   UNION
   (SELECT * FROM advertisement
 WHERE type = 1
   AND status = 1
   AND global = 0
   AND city LIKE '%${data[8]?.city_name}%')
   UNION
   (SELECT * FROM advertisement
 WHERE type = 1
   AND status = 1
   AND global = 0
   AND city LIKE '%${data[9]?.city_name}%')

   `;
      // console.log(query);

      this.ApiService.dynaquayunsequary(query).subscribe((res: any) => {
        if (res.success && res['data'].length > 0) {
          this.adv1 = res['data'];
        }
      });
    }
  }
  downAdv(data: any) {
    // console.log('downAdv');

    if (data.length == 0) {
      this.ApiParameter.unsecuredFatchquary('advertisement', {
        projection: ['*'],
        whereConditions: { type: 2, status: 1, global: 1 },
      }).subscribe((res: any) => {
        if (res.success && res['data'].length > 0) {
          //console.log();
          this.adv2 = res['data'];
          console.log('down', this.adv2);
        }
      });
    } else {
      var query = `
        (SELECT * FROM advertisement
 WHERE type = 2
   AND status = 1
   AND global = 1
   )
UNION
(SELECT * FROM advertisement
 WHERE type = 2
   AND status = 1
   AND global = 0
   AND city LIKE '%${data[0]?.city_name}%')
   UNION
   (SELECT * FROM advertisement
 WHERE type = 2
   AND status = 1
   AND global = 0
   AND city LIKE '%${data[1]?.city_name}%')
   UNION
   (SELECT * FROM advertisement
 WHERE type = 2
   AND status = 1
   AND global = 0
   AND city LIKE '%${data[2]?.city_name}%')
      UNION
      (SELECT * FROM advertisement
 WHERE type = 2
   AND status = 1
   AND global = 0
   AND city LIKE '%${data[3]?.city_name}%')
   UNION
      (SELECT * FROM advertisement
 WHERE type = 2
   AND status = 1
   AND global = 0
   AND city LIKE '%${data[4]?.city_name}%')
   UNION
      (SELECT * FROM advertisement
 WHERE type = 2
   AND status = 1
   AND global = 0
   AND city LIKE '%${data[5]?.city_name}%')
   UNION
      (SELECT * FROM advertisement
 WHERE type = 2
   AND status = 1
   AND global = 0
   AND city LIKE '%${data[6]?.city_name}%')
   UNION
      (SELECT * FROM advertisement
 WHERE type = 2
   AND status = 1
   AND global = 0
   AND city LIKE '%${data[7]?.city_name}%')
   UNION
      (SELECT * FROM advertisement
 WHERE type = 2
   AND status = 1
   AND global = 0
   AND city LIKE '%${data[8]?.city_name}%')
   UNION
      (SELECT * FROM advertisement
 WHERE type = 2
   AND status = 1
   AND global = 0
   AND city LIKE '%${data[9]?.city_name}%')

   `;
      this.ApiService.dynaquayunsequary(query).subscribe((res: any) => {
        if (res.success && res['data'].length > 0) {
          this.adv2 = res['data'];
          // console.log('down city', this.adv2);
        }
      });
    }
  }
}
