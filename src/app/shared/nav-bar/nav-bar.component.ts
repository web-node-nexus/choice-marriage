import {
  Component,
  EventEmitter,
  HostListener,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { Location, PopStateEvent } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoginComponent } from 'src/app/auth/login/login.component';
import { AuthService } from 'src/app/auth/auth.service';
import { AppService } from 'src/app/services/app.service';
import { ApiParameterScript } from 'src/app/script/api-parameter';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import * as moment from 'moment';
import { ApiService } from 'src/app/services/api.service';
import Swal from 'sweetalert2';
import { AppInitializationServiceService } from 'src/app/services/app-initialization-service.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
})
export class NavBarComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  // **************************
  public isCollapsed = true;
  private lastPoppedUrl: any;
  private yScrollStack: number[] = [];
  public version: any;
  public screenWidth: any;
  public navBtnCollapse: Boolean = false;
  public isLogin: Boolean = false;
  public LoginInformation: any;
  public authInfo: any;
  public profile_image = '';
  @Input() sidebarVisible: boolean = false;
  perfectshoe: boolean = false;
  applicationlinkios: any;
  applicationlinkand: any;
  image: any;
  url: any = environment.filePath + '/logo_image/';
  @HostListener('window:resize', ['$event'])
  onResizes(event: any) {
    this.screenWidth = window.innerWidth;
  }
  @HostListener('window:scroll', ['$event'])
  onscroll(event: any) {
    var selectHeader = document.getElementById('header');
    // if (window.scrollY > 100) {
    //   selectHeader?.classList.add('background-custom')
    // } else {
    //   selectHeader?.classList.remove('background-custom')
    // }
  }
  persentage: number = 0;
  activeServiceDropDown: boolean = false;
  logoUrl: any = '';
  user_privacy: any;
  notificationCount: any = 0;
  elem: any;
  // @Inject(DOCUMENT) private document: any
  activeFullScreenMode: boolean = false;
  constructor(
    private appservices: AppService,
    public location: Location,
    private router: Router,
    private modalService: NgbModal,
    private auth: AuthService,
    private app: AppService,
    private ApiParameterScript: ApiParameterScript,
    private ApiService: ApiService,
    private AppInitializationServiceService: AppInitializationServiceService,
    @Inject(DOCUMENT) private document: any
  ) {}

  openFullscreen() {
   // console.log('active FullScreen Mode');
    if (!this.activeFullScreenMode) {
      this.activeFullScreenMode = true;
      if (this.elem.requestFullscreen) {
        this.elem.requestFullscreen();
      } else if (this.elem.mozRequestFullScreen) {
        /* Firefox */
        this.elem.mozRequestFullScreen();
      } else if (this.elem.webkitRequestFullscreen) {
        /* Chrome, Safari and Opera */
        this.elem.webkitRequestFullscreen();
      } else if (this.elem.msRequestFullscreen) {
        /* IE/Edge */
        this.elem.msRequestFullscreen();
      }
    } else {
      this.activeFullScreenMode = false;
      this.closeFullscreen();
    }
  }
  /* Close fullscreen */
  closeFullscreen() {
    //console.log('In active FullScreen Mode');
    if (this.document.exitFullscreen) {
      this.document.exitFullscreen();
    } else if (this.document.mozCancelFullScreen) {
      /* Firefox */
      this.document.mozCancelFullScreen();
    } else if (this.document.webkitExitFullscreen) {
      /* Chrome, Safari and Opera */
      this.document.webkitExitFullscreen();
    } else if (this.document.msExitFullscreen) {
      /* IE/Edge */
      this.document.msExitFullscreen();
    }
  }

  ngOnInit() {
    this.getSocialMedia();
    this.getLogo();
    const logoImage = this.app.appConfig?.logoList?.image;
    this.logoUrl = logoImage
      ? this.app.getFilePath() + 'logo_image/' + logoImage
      : '';
    this.elem = document.documentElement;
    this.auth.authCredential.subscribe((res: any) => {
      if (res) {
        this.isLogin = res.token ? true : false;
        this.authInfo = this.auth.getAuthStatus()
          ? this.auth.getAuthStatus()
          : res;


        this.ApiParameterScript.fetchdata('user_info', {
          projection: ['user_privacy', 'user_profile_image'],
          whereConditions: { user_id: this.app.authStatus?.profile_id },
        }).subscribe((res: any) => {
          if (res.success && res['data'].length > 0) {
            this.ApiParameterScript.fetchdata('user_profile_images', {
              projection: ['user_profile_images'],
              whereConditions: { user_id: this.app.authStatus?.profile_id },
            }).subscribe((res: any) => {
              if (res.success && res['data'].length > 0) {
               // console.log(res['data']);

                let profile_image_array = res['data'].map((ele: any) => {
                  return ele.user_profile_images;
                });
                if (profile_image_array.includes(this.app.authProfile.user_info.user_profile_image)){
                  this.profile_image = this.app.authProfile.user_info.user_profile_image;
                }else{
                  this.profile_image = profile_image_array[0];
                }
                //console.log(this.profile_image);
              }
            });
            this.user_privacy =
              res['data'][0].user_privacy == 'public' ? true : false;
          }
        });
        this.matchPerfect();
      }
    });
    this.router.events.subscribe((event) => {
      this.isCollapsed = true;
      if (event instanceof NavigationStart) {
        if (event.url != this.lastPoppedUrl)
          this.yScrollStack.push(window.scrollY);
      } else if (event instanceof NavigationEnd) {
        if (event.url == this.lastPoppedUrl) {
          this.lastPoppedUrl = undefined;
          //    window.scrollTo(0, this.yScrollStack.pop());
        } else window.scrollTo(0, 0);
      }
    });
    this.location.subscribe((ev: PopStateEvent) => {
      this.lastPoppedUrl = ev.url;
    });

    const notification = setInterval(() => {
      if (!this.app.authStatus) {
        clearInterval(notification);
      } else {
        var query = `SELECT COUNT(notify_status_view) as count FROM notification INNER JOIN user_info ON notification.notify_by_id=user_info.user_id AND notification.notify_to_id='${this.app.authStatus?.profile_id}' AND notification.notify_status_view=0`;
        this.ApiParameterScript.fetchDataFormQuery(query).subscribe(
          (res: any) => {
            if (res.success) {
              this.notificationCount = res['data'][0].count;
              this.app.notificationCount.next(parseInt(res['data'][0].count));
            }
          }
        );
      }
    }, 15000);

    
  }
  matchPerfect() {
    let param = {
      user_id: this.appservices.authStatus?.profile_id,
    };
    this.ApiService.perfactMatch(param).subscribe((res: any) => {
      if (res.success) {
        this.perfectshoe = true;
      } else {
        this.perfectshoe = false;
        //this.router.navigate(['v1/search_match/recommend_matches']);
      }
    });
  }

  isHome() {
    var titlee = this.location.prepareExternalUrl(this.location.path());

    if (titlee === '#/home') {
      return true;
    } else {
      return false;
    }
  }
  isDocumentation() {
    var titlee = this.location.prepareExternalUrl(this.location.path());
    if (titlee === '#/documentation') {
      return true;
    } else {
      return false;
    }
  }

  public toggleNavBtn() {
    // if (this.isLogin) {
    this.sidebarVisible = true;
    // } else {
    //   this.navBtnCollapse = !this.navBtnCollapse;
    // }
  }

  activeDropDownForMobail() {
    if (this.activeServiceDropDown) {
      this.activeServiceDropDown = false;
    } else {
      this.activeServiceDropDown = true;
    }
  }
  onclickHideNav() {
    if (this.navBtnCollapse) {
      this.navBtnCollapse = !this.navBtnCollapse;
    }

    var navbar = document.getElementById('navbar');
    navbar?.classList.remove('navbar-mobile');
  }

  public logout() {
    var date = moment.utc().format('YYYY-MM-DD HH:mm:ss');
    var localTime: any = moment.utc(date).toDate();
    localTime = moment(localTime).format('YYYY-MM-DD HH:mm:ss');
    let logindata = {
      data: {
        logout_date_time: localTime,
        current_login_states: 0,
      },
      whereConditions: {
        user_id: this.app.authStatus.profile_id,
        current_login_states: 1,
      },
    };

    this.ApiParameterScript.updatedata('login_activity', logindata).subscribe(
      (res) => {}
    );
    var apidata = {
      data: { online_status: 0 },
      whereConditions: { user_id: this.app.authStatus.profile_id },
    };

    this.blockUI.start('Please Wait We Are Reverting Your Access');
    this.ApiParameterScript.updatedata('user_info', apidata).subscribe(
      (res: any) => {
        this.blockUI.stop();
        // if(res.success){
        this.auth.logout();
        // }
      }
    );
  }

  public changePrivacy() {
    //this.blockUI.start('Please wait...')
    this.ApiParameterScript.updatedata('user_info', {
      data: { user_privacy: this.user_privacy ? 'public' : 'private' },
      whereConditions: { user_id: this.app.authStatus.profile_id },
    }).subscribe((res: any) => {
     // console.log(res);
      this.blockUI.stop();
    });
  }

  requestForDeletemyAcount() {
    this.sidebarVisible = false;
    let alldata = this.auth.getAuthStatus();
    //console.log(alldata);
    Swal.fire({
      html: `
          <p>
          ID: <strong>${alldata.profile_id}</strong>
          </p>
          <p>
          Name: <strong>${alldata.profile_name}</strong>
          </p>
          <p>
          Name: <strong>${alldata.profile_email}</strong>
          </p>

          `,
    });
  }

  getSocialMedia() {
    var fetchData = {
      projection: ['application_link_ios', 'application_link_and'],
      whereConditions: { id: 1 },
    };
    this.ApiParameterScript.unsecuredFatchquary(
      'social_media_links',
      fetchData,
      true,5 * 60 * 60 * 1000

    ).subscribe((res: any) => {
     // console.log(res['data'][0]);
      if (res.status) {
        this.applicationlinkios = res['data'][0].application_link_ios;
        this.applicationlinkand = res['data'][0].application_link_and;
      }
    });
  }
  getLogo() {
    const appConfigString = localStorage.getItem('AppConfig');
    if (appConfigString) {
      try {
        const appConfig = JSON.parse(appConfigString);
        this.image = appConfig.logoList.image;
      } catch (error) {
        console.error('Error parsing AppConfig:', error);
      }
    } else {
      console.warn('AppConfig is not found in localStorage');
    }
  }
  borgerclicked() {
    if (this.isLogin) {
      this.persentage = 0;
      this.ApiParameterScript.getprofile({
        userid: this.appservices.authStatus.profile_id,
      }).subscribe((res: any) => {
        if (res.status) {
          // console.log('about us '+ );
          // console.log('user_diet_hobbies '+typeof(res.user_diet_hobbies));
          // console.log('user_education_occupations '+typeof(res.user_education_occupations));
          // console.log('user_family '+typeof(res.user_family));
          // console.log('user_horoscope_deatils '+typeof(res.user_horoscope_deatils));
          // console.log('user_info '+typeof(res.user_info));
          // console.log('user_locations '+Object.keys(res.user_locations).length);
          // console.log('user_partnerpreference '+typeof(res.user_partnerpreference));
          // console.log('user_physical_details '+typeof(res.user_physical_details));
          // console.log('user_profile_images '+typeof(res.user_profile_images));
          // console.log('user_religion '+typeof(res.user_religion));

          if (Object.keys(res.user_about).length > 0) {
            this.persentage += 7;
          }
          if (Object.keys(res.user_diet_hobbies).length > 0) {
            this.persentage += 7;
          }
          if (Object.keys(res.user_education_occupations).length > 0) {
            this.persentage += 7;
          }
          if (Object.keys(res.user_family).length > 0) {
            this.persentage += 7;
          }
          if (Object.keys(res.user_horoscope_deatils).length > 0) {
            this.persentage += 7;
          }
          if (Object.keys(res.user_info).length > 0) {
            this.persentage += 7;
          }
          if (Object.keys(res.user_locations).length > 0) {
            this.persentage += 7;
          }
          if (Object.keys(res.user_partnerpreference).length > 0) {
            this.persentage += 6;
          }
          if (Object.keys(res.user_physical_details).length > 0) {
            this.persentage += 6;
          }
          if (Object.keys(res.user_profile_images).length > 0) {
            this.persentage += 7;
          }
          if (Object.keys(res.user_religion).length > 0) {
            this.persentage += 7;
          }
          if (res.user_profile_status == 'Completed') {
            this.persentage += 1;
          }
          var fetchData1 = {
            projection: ['*'],
            whereConditions: {
              user_ID: this.appservices.authStatus.profile_id,
            },
          };
          this.ApiParameterScript.fetchdatawitherLoder(
            'user_profile_images',
            fetchData1
          ).subscribe((images: any) => {
            if (images.status && images['data'].length > 0) {
              // alert
              this.persentage += 6;
            }
          });
          this.ApiParameterScript.fetchdatawitherLoder(
            'use_horoscope_upload',
            fetchData1
          ).subscribe((images: any) => {
            if (images.status && images['data'].length > 0) {
              this.persentage += 6;
            }
          });
          this.ApiParameterScript.fetchdatawitherLoder(
            'use_id_upload',
            fetchData1
          ).subscribe((images: any) => {
            if (images.status && images['data'].length > 0) {
              this.persentage += 6;
            }
          });
          this.ApiParameterScript.fetchdatawitherLoder(
            'use_payment_slip_upload',
            fetchData1
          ).subscribe((images: any) => {
            if (images.status && images['data'].length > 0) {
              this.persentage += 6;
            }
          });
        }
        // if(this.persentage > 100){
        //   this.borgerclicked();
        // }
      });
    }
  }
}
