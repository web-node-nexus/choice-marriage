import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import * as _ from 'lodash';
import * as moment from 'moment';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { ApiParameterScript } from 'src/app/script/api-parameter';
import { AppService } from 'src/app/services/app.service';
import { PlanService } from 'src/app/services/plan.service';
import Swal from 'sweetalert2';
import Party from 'party-js';
import { CommonService } from 'src/app/services/common.service';
import { AuthService } from 'src/app/auth/auth.service';
import { SharedDataService } from 'src/app/shared/shared-data-service.service';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-findmatches',
  templateUrl: './findmatches.component.html',
  styleUrls: ['./findmatches.component.scss'],
})
export class FindmatchesComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  link: any = '';
  urladv: any = environment.filePath + 'Advertisement/banner/';
  sidebarVisible: boolean;
  loadingSkeltonLoader: boolean = true;
  customOptions: OwlOptions = {
    loop: false,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    navSpeed: 600,
    navText: ['&#8249', '&#8250;'],
    responsive: {
      0: {
        items: 2,
      },
      400: {
        items: 2,
      },
      760: {
        items: 2,
      },
      1000: {
        items: 3,
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
    autoplay: true, // Enable auto scroll
    autoplayTimeout: 3000, // Adjust the timing of auto scroll
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

  query: string;
  recommendedProfileList: any[] = [];
  matchSportlightList: any[] = [];
  matchOnlineUserList: any[] = [];
  visible: boolean = false;
  imgURL: string = 'http://localhost/matrimonial/storage/';
  sharedData: any = [];
  second: boolean = true;
  third: boolean = false;
  adv3: any;
  latitude: number;
  longitude: number;
  city: any;

  constructor(
    private ApiParameterScript: ApiParameterScript,
    private AppService: AppService,
    private _rout: Router,
    private PlanServices: PlanService,
    private commonService: CommonService,
    private AuthService: AuthService,
    private SharedDataService: SharedDataService,
    private ApiService: ApiService
  ) {}

  ngOnInit(): void {
    this.promptForLocation();
    this.imgURL = this.AppService.getFilePath();
    this.ApiParameterScript.getprofile({
      userid: this.AppService.authStatus.profile_id,
    }).subscribe((resProfile: any) => {
      console.log('res', resProfile);

      if (
        resProfile.success &&
        resProfile.user_profile_status == 'Completed' &&
        ['Approved'].includes(resProfile.user_info?.user_status)
      ) {
        this.ApiParameterScript.fetchdata('user_like', {
          projection: ['liked_profile'],
          whereConditions: {
            liked_by_profile_id: this.AppService.authStatus.profile_id,
            isLiked: 1,
          },
        }).subscribe((likeProfileRes: any) => {
          var query = `SELECT * FROM user_info  LEFT JOIN user_religion ON user_info.user_id = user_religion.user_ID LEFT JOIN user_locations ON user_info.user_id = user_locations.user_ID LEFT JOIN user_family ON user_info.user_id = user_family.user_ID LEFT JOIN user_physical_details ON user_info.user_id = user_physical_details.user_ID LEFT JOIN user_about ON user_info.user_id = user_about.user_ID LEFT JOIN user_diet_hobbies ON user_info.user_id = user_diet_hobbies.user_ID LEFT JOIN user_education_occupations ON user_info.user_id = user_education_occupations.user_ID WHERE user_info.user_gender = '${
            resProfile.user_info.user_gender == 'male' ? 'female' : 'male'
          }'  AND user_info.user_status = 'Approved' AND user_info.user_has_complete_profile = 1  AND (user_info.online_status=1 OR user_info.spotlight=1)`;
          // console.log(query);

          this.ApiParameterScript.fetchDataFormQuery(query).subscribe(
            (onlineProfileRes: any) => {
              // console.log("onlineProfileRes",onlineProfileRes);

              this.loadingSkeltonLoader = false;
              if (
                onlineProfileRes.success &&
                onlineProfileRes['data'].length > 0
              ) {
                if (
                  likeProfileRes.success &&
                  likeProfileRes['data'].length > 0
                ) {
                  var likeProfiles = _.map(
                    likeProfileRes['data'],
                    'liked_profile'
                  );
                  _.map(onlineProfileRes['data'], (e: any) => {
                    e['isLiked'] = likeProfiles.includes(e.user_id);
                  });
                } else {
                  _.map(onlineProfileRes['data'], (e: any) => {
                    e['isLiked'] = false;
                  });
                }
                this.matchSportlightList = _.filter(onlineProfileRes['data'], {
                  spotlight: 1,
                });
                this.matchOnlineUserList = _.filter(onlineProfileRes['data'], {
                  online_status: 1,
                });
              }
            }
          );
        });
      } else {
        // Swal.fire('YOU HAVE NOY YET COMPLETED YOUR ACCOUNT','Please active your account first','warning').
        // this.loadingSkeltonLoader = false
        // Swal.fire({
        //   title: 'YOU ARE NOT COMPLETED YOUR ACCOUNT ACCOUNT',
        //   text: "Please active your account first",
        //   icon: 'warning',
        //   backdrop: false,
        //   showCancelButton: false,
        //   confirmButtonColor: '#3085d6',
        //   cancelButtonColor: '#d33',
        //   cancelButtonText: 'Set up profile',
        //   confirmButtonText: 'Check Account Status'
        // }).then((res: any) => {

        //   if (res.isConfirmed) {
        this._rout.navigateByUrl('/v1/setup/profile');
        // }

        // })
      }
    });

    // setTimeout(() => {
    //   this.SharedDataService.sharedData$.subscribe((data: any) => {
    //     this.sharedData.push(data['count'][0]);
    //     console.log('count', this.sharedData);
    //   });
    // }, 5000);
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
                this.city = res.city_name;
                console.log(this.city);
                this.downAdv(this.city);
              } else {
                this.city = '';
                console.log(this.city);
                this.downAdv(this.city);
              }
            }
          );
        },
        (error) => {
          this.city = '';
          console.log(this.city);
          this.downAdv(this.city);
        }
      );
    } else {
      this.city = '';
      this.downAdv(this.city);
      console.log(this.city);
    }
  }

  viewProfile(data: any) {
    this.AuthService.setupPermissionForViewProfile().subscribe(
      (permission: any) => {
        if (permission) {
          this._rout.navigate(['/member-profile/' + data?.user_ID]);
        }
      }
    );
  }
  apply() {
    //
    this.query = 'SELECT * FROM user_info WHERE 	user_membership_plan_active=1';
  }

  openDeatailsModel() {
    this.visible = true;
  }
  ignoreProfile(userid: any) {
    this.blockUI.start('Please Wait...');
    let loginuserid = this.AppService.authStatus.profile_id;
    this.ApiParameterScript.fetchdata('user_activities', {
      projection: ['*'],
      whereConditions: { user_id: loginuserid },
    }).subscribe((res: any) => {
      if (res.success && res['data'].length > 0) {
        var updatedblocklistarray: any[] = [];
        var updatedblocklistString;
        //

        if (
          res['data'][0].user_block_list &&
          res['data'][0].user_block_list != ''
        ) {
          updatedblocklistarray = _.split(res['data'][0].user_block_list, ',');
          updatedblocklistarray.push(userid);
          updatedblocklistString = _.join(updatedblocklistarray, ',');
        } else {
          updatedblocklistString = userid;
        }

        let updateData = {
          data: {
            user_block_list: updatedblocklistString,
          },
          whereConditions: { user_id: loginuserid },
        };
        this.ApiParameterScript.updatedata(
          'user_activities',
          updateData
        ).subscribe((res: any) => {
          this.blockUI.stop();
          if (res.success) {
            Swal.fire(
              'Success',
              'You successfully ignore this profile, as it may not appear in your matches.',
              'success'
            ).then((ress: any) => {
              this.ngOnInit();
            });
          } else {
            Swal.fire({
              icon: 'warning',
              text: res.message,
            });
          }
        });
      } else {
        let saveData = {
          data: {
            user_id: loginuserid,
            user_block_list: userid,
          },
        };
        this.ApiParameterScript.savedata('user_activities', saveData).subscribe(
          (res: any) => {
            this.blockUI.stop();
            if (res.success) {
              Swal.fire(
                'Success',
                'You successfully ignore this profile, as it may not appear in your matches.',
                'success'
              ).then((ress: any) => {
                this.ngOnInit();
              });
            } else {
              Swal.fire({
                icon: 'warning',
                text: res.message,
              });
            }
          }
        );
      }
    });
  }

  sprtLightProfilelike(data: any, index: number) {
    // this.blockUI.start("Please Wait...")
    data['isLiked'] = data['isLiked'] ? false : true;
    this.recommendedProfileList[index] = data;
    var like = document.getElementById(`spotlight_container_id_${index}`);
    if (like != null && data['isLiked']) {
      Party.confetti(like, {
        // Specify further (optional) configuration here.
        count: Party.variation.range(50, 100),
        size: Party.variation.range(0.6, 1.4),
      });
    }
    this.recommendedProfileList[index] = data;

    this.commonService.likeDislikeProfile(data);
  }

  onlineProfilelike(data: any, index: number) {
    // this.blockUI.start("Please Wait...")
    data['isLiked'] = data['isLiked'] ? false : true;
    this.matchOnlineUserList[index] = data;
    var like = document.getElementById(`online_container_id_${index}`);
    if (like != null && data['isLiked']) {
      Party.confetti(like, {
        // Specify further (optional) configuration here.
        count: Party.variation.range(50, 100),
        size: Party.variation.range(0.6, 1.4),
      });
    }
    this.matchOnlineUserList[index] = data;

    this.commonService.likeDislikeProfile(data);
  }
  thirdTrueFu() {
    this.second = false;
    this.third = true;
  }
  secondTrueFu() {
    this.second = true;
    this.third = false;
  }
  downAdv(data: any) {
    if (data == '') {
      this.ApiParameterScript.unsecuredFatchquary('advertisement', {
        projection: ['*'],
        whereConditions: { type: 2, status: 1, global: 1 },
      }).subscribe((res: any) => {
        if (res.success && res['data'].length > 0) {
          //console.log();
          this.adv3 = res['data'];
          console.log('down', this.adv3);
        }
      });
    } else {
      var query = `
        (SELECT * FROM advertisement
     WHERE type = 3
   AND status = 1
   AND global = 1
   )
   UNION
  (SELECT * FROM advertisement
   WHERE type = 3
   AND status = 1
   AND global = 0
   AND city LIKE '%${data[0].city_name}}%')
      UNION
(SELECT * FROM advertisement
 WHERE type = 3
   AND status = 1
   AND global = 0
   AND city LIKE '%${data[1].city_name}%')
   UNION
(SELECT * FROM advertisement
 WHERE type = 3
   AND status = 1
   AND global = 0
   AND city LIKE '%${data[2].city_name}%')
   UNION
(SELECT * FROM advertisement
 WHERE type = 3
   AND status = 1
   AND global = 0
   AND city LIKE '%${data[3].city_name}%')
   UNION
(SELECT * FROM advertisement
 WHERE type = 3
   AND status = 1
   AND global = 0
   AND city LIKE '%${data[4].city_name}%')
   UNION
(SELECT * FROM advertisement
 WHERE type = 3
   AND status = 1
   AND global = 0
   AND city LIKE '%${data[5].city_name}%')
   UNION
(SELECT * FROM advertisement
 WHERE type = 3
   AND status = 1
   AND global = 0
   AND city LIKE '%${data[6].city_name}%')
   UNION
(SELECT * FROM advertisement
 WHERE type = 3
   AND status = 1
   AND global = 0
   AND city LIKE '%${data[7].city_name}%')
   UNION
(SELECT * FROM advertisement
 WHERE type = 3
   AND status = 1
   AND global = 0
   AND city LIKE '%${data[8].city_name}%')
   UNION
(SELECT * FROM advertisement
 WHERE type = 3
   AND status = 1
   AND global = 0
   AND city LIKE '%${data[9].city_name}%')
   `;
      this.ApiService.dynaquayunsequary(query).subscribe((res: any) => {
        if (res.success && res['data'].length > 0) {
          this.adv3 = res['data'];
          console.log('down city', this.adv3);
        }
      });
    }
  }
}
