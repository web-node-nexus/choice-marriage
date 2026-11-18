import { HttpClient } from '@angular/common/http';
import {
  AfterContentInit,
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash';
import * as moment from 'moment';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { AuthService } from 'src/app/auth/auth.service';
import { AgePipe } from 'src/app/customPipe/age.pipe';
import { ApiParameterScript } from 'src/app/script/api-parameter';
import { AppService } from 'src/app/services/app.service';
import { CommonService } from 'src/app/services/common.service';
import { PlanService } from 'src/app/services/plan.service';
import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { ShowkundaliComponent } from '../showkundali/showkundali.component';
import { ShowmeaagaeforhoroscpeComponent } from '../showmeaagaeforhoroscpe/showmeaagaeforhoroscpe.component';
import { LockprofilealertComponent } from '../lockprofilealert/lockprofilealert.component';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-member-profile',
  templateUrl: './member-profile.component.html',
  styleUrls: ['./member-profile.component.scss'],
})
export class MemberProfileComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  // @ViewChild(MatAccordion) accordion: MatAccordion;
  @ViewChild(MatAccordion) accordion: MatAccordion;
  @BlockUI() blockUI: NgBlockUI;
  member_profile_Data: any = {};
  imgURL: string = 'http://localhost/matrimonial/';
  member_profile_picture: any[] = [];
  selecteduploadedFiles: any[] = [];
  displayBasic: boolean = false;
  valueforshowhide: boolean = false;
  Requestkundali: string = 'View Kundali';
  responsiveOptions: any[] = [
    {
      breakpoint: '1024px',
      numVisible: 2,
    },
    {
      breakpoint: '768px',
      numVisible: 2,
    },
    {
      breakpoint: '560px',
      numVisible: 2,
    },
  ];
  preferenceuserid: any;
  showContact: boolean = false;
  hororsopebtn: boolean = true;
  hororsopecon: boolean = false;
  contactbtn: boolean = true;
  contactcontent: boolean = false;
  contact: any;
  watermarkimg: any;
  filteredArray: any[] = [];
  likecount: number = 0;
  profileviewcount: number = 0;
  viewadminbtn:boolean = false;
  constructor(
    private ApiParameterScript: ApiParameterScript,
    private AppService: AppService,
    private _rout: ActivatedRoute,
    private roter: Router,
    private AgePipe: AgePipe,
    private CommonService: CommonService,
    private AuthService: AuthService,
    private plan: PlanService,
    private dialog: MatDialog,
    private ApiService: ApiService
  ) {}

  ngOnInit(): void {
    this.AuthService.setupPermissionForViewProfile().subscribe(
      (permission: any) => {
        // alert(permission);
        if (permission) {
          this.loadMember();
        } else {
        }
      }
    );
  }
  contactAdmin(){
    this.dialog.open(LockprofilealertComponent, {
      width: '400px', // Adjust width as needed
    });
  }
  viewContact(): void {
    // Ensure that the expansion panel containing Contact Details is expanded
    this.accordion.openAll(); // This will expand all panels, adjust if needed
    // Optionally, you can also scroll to the expansion panel for better visibility
    const contactPanel = document.getElementById('contactPanel');
    if (contactPanel) {
      contactPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  viewContactHoroscop(): void {
    // Ensure that the expansion panel containing Contact Details is expanded
    this.accordion.openAll(); // This will expand all panels, adjust if needed
    // Optionally, you can also scroll to the expansion panel for better visibility
    const contactPanel = document.getElementById('HoroscopeDetails');
    if (contactPanel) {
      contactPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  ngOnDestroy() {
    // this.AuthService.revokePermission()
  }

  ngAfterViewInit(): void {
    //console.log("calling ngAfterViewInit");
  }
  loadMember() {
    this.imgURL = this.AppService.getFilePath();
    this.blockUI.start('Please Wait');
    this.getWotermark();

    this._rout.params.subscribe((res: any) => {
      this.preferenceuserid = res.user_id;
      if (this.preferenceuserid == this.AppService.authStatus.profile_id) {
        this.roter.navigate(['v1/my-profile']);
      }
      this.profileImageSlider(this.preferenceuserid);
      this.profileView(this.preferenceuserid);
      this.profileLike(this.preferenceuserid);
      let user_id = res.user_id;
      this.AuthService.setupPermissionBaseOnUserProfile(user_id).subscribe(
        () => {
          var query = `SELECT viewed_contact
            FROM user_activities_for_contact_details
            WHERE viewed_profile_id = '${this.preferenceuserid}' AND profile_view_by_profile_id = '${this.AppService.authStatus.profile_id}'`;
          // c-start
          this.ApiParameterScript.fetchDataFormQuery(query,true,5*60*1000).subscribe(
            (res: any) => {
              // console.log();
              if (res.success && res['data'].length > 0) {
                if (res['data'][0].viewed_contact == 1) {
                  this.viewadminbtn = true;
                  this.contactbtn = false;
                  this.contactcontent = true;
                } else if(res['data'][0].viewed_contact == 0) {
                  this.contactbtn = false;
                  this.contactcontent = false;
                  this.viewadminbtn = true;
                }else{
                  this.contactbtn = true;
                  this.contactcontent = false;
                  this.viewadminbtn = false;
                }
              }
            }
          );
          // c-start
          //h-start

          var query = `SELECT viewed_horoscope
          FROM user_activities_for_horoscope_details
          WHERE viewed_profile_id = '${this.preferenceuserid}' AND profile_view_by_profile_id = '${this.AppService.authStatus.profile_id}'`;
          //console.log(query);
          this.ApiParameterScript.fetchDataFormQuery(query,true,5*60*1000).subscribe(
            (responce: any) => {
              if (responce.success && responce['data'].length > 0) {
                if (responce['data'][0].viewed_horoscope == 0) {
                  this.hororsopebtn = true;
                  this.hororsopecon = false;
                } else {
                  this.hororsopebtn = false;
                  this.hororsopecon = true;
                }
              }
            }
          );

          //h-end
          this.CommonService.checkForUserAcceptanceSatus(user_id).subscribe(
            (satus: any) => {
              if (satus) {
                let query = `SELECT *,auth_user.auth_phone_no FROM user_info
        LEFT JOIN user_religion ON user_info.user_id = user_religion.user_ID
        LEFT JOIN auth_user ON user_info.user_id = auth_user.auth_ID
        LEFT JOIN user_locations ON user_info.user_id = user_locations.user_ID
        LEFT JOIN user_family ON user_info.user_id = user_family.user_ID
        LEFT JOIN user_physical_details ON user_info.user_id = user_physical_details.user_ID
        LEFT JOIN user_about ON user_info.user_id = user_about.user_ID
        LEFT JOIN user_diet_hobbies ON user_info.user_id = user_diet_hobbies.user_ID
        LEFT JOIN user_education_occupations ON user_info.user_id = user_education_occupations.user_ID
        LEFT JOIN user_horoscope ON user_info.user_id = user_horoscope.user_ID
        WHERE (user_info.user_status = 'Approved' AND user_info.user_id='${user_id}')`;
                this.ApiParameterScript.fetchDataFormQuery(query,true,5*60*1000).subscribe(
                  (res: any) => {
                    this.blockUI.stop();
                    //console.log("hi");
                    if (res.success && res['data'].length > 0) {
                      this.member_profile_Data = res['data'][0];
                      // console.log(this.member_profile_Data);
                      this.CommonService.createLogHistoryForViewProfile(
                        res['data'][0]
                      );
                      this.plan.managementProfileViewPlanCount(user_id);
                    } else {
                      this.roter.navigate(['/']);
                    }
                  }
                );
              } else {
                this.roter.navigate(['v1/request/' + user_id]);
              }
            }
          );
        }
      );
    });

    //console.log(this.preferenceuserid);

    this.ApiParameterScript.fetchdata('use_horoscope_upload', {
      projection: ['*'],
      whereConditions: { user_id: this.preferenceuserid },
    }).subscribe((res: any) => {
      if (res.success && res['data'].length > 0) {
        this.Requestkundali = 'View Kundali';
      } else {
        this.Requestkundali = 'Request for Kundali';
      }
    });
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

  shortlistedProfile(memberProfileData: any) {
    this.blockUI.start('Please Wait...');
    let loginuserid = this.AppService.authStatus.profile_id;
    this.ApiParameterScript.fetchdata(
      'user_activities_for_shortlisted_profile',
      {
        projection: ['*'],
        whereConditions: {
          shortlisted_by_user_id: loginuserid,
          shortlist_user_id: memberProfileData.user_id,
        },
      }
    ).subscribe((res: any) => {
      if (res.success && res['data'].length > 0) {
        let updateData = {
          data: {
            shortlisted_by_user_id: loginuserid,
            shortlist_user_id: memberProfileData.user_id,
            shortlisted_by_profile_images: `${this.AppService.authProfile.user_info.user_profile_image}`,
            shortlisted_profile_images: memberProfileData.user_profile_image,
            created_At: moment().toISOString(),
          },
          whereConditions: {
            shortlisted_by_user_id: loginuserid,
            shortlist_user_id: memberProfileData.user_id,
          },
        };
        this.ApiParameterScript.updatedata(
          'user_activities_for_shortlisted_profile',
          updateData
        ).subscribe((res: any) => {
          this.blockUI.stop();
          if (res.success) {
            Swal.fire(
              'Success',
              'You Already Shortlisted This Profile',
              'success'
            ).then((ress: any) => {});
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
            shortlisted_by_user_id: loginuserid,
            shortlist_user_id: memberProfileData.user_id,
            shortlisted_by_profile_images: `${this.AppService.authProfile.user_info.user_profile_image}`,
            shortlisted_profile_images: memberProfileData.user_profile_image,
            created_At: moment().toISOString(),
          },
        };
        this.ApiParameterScript.savedata(
          'user_activities_for_shortlisted_profile',
          saveData
        ).subscribe((res: any) => {
          this.blockUI.stop();
          if (res.success) {
            Swal.fire(
              'Success',
              'You Shortlisted This Profile',
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
      }
    });
  }

  getPicture(userid: any) {
    var apiData = {
      projection: ['*'],
      whereConditions: {
        user_ID: userid,
        status: 'approved',
      },
    };
    this.member_profile_picture = [];
    this.selecteduploadedFiles = [];
    this.blockUI.start('Loading Profile Photo..');
    this.ApiParameterScript.fetchdata('user_profile_images', apiData).subscribe(
      (res: any) => {
        this.blockUI.stop();

        if (res.success && res['data'].length > 0) {
          this.displayBasic = true;
          this.member_profile_picture = res['data'];
          res['data'].forEach((element: any) => {
            this.selecteduploadedFiles.push({
              previewImageSrc: `${this.AppService.getFilePath()}${
                element.user_profile_images
              }`,
              thumbnailImageSrc: `${this.AppService.getFilePath()}${
                element.user_profile_images
              }`,
              alt: element.user_profile_images,
              title: element.user_profile_images,
            });
          });
        }
      }
    );
  }
  generateIntroduction(profile: any) {
    //

    // return `${profile.user_fname} ${profile.user_lname} is a ${this.AgePipe.transform(profile.user_dob)} year old ${profile.user_occupation} residing at ${profile.user_Permanent_city} in ${profile.user_Permanent_state}, ${profile.user_Permanent_country}.`
    return `<h1 class="fw-600 text_name text-uppercase" >${
      profile.user_fname
    } ${profile.user_lname},</h1>
                    <p  class=" text-justify ">
                        Is a ${this.AgePipe.transform(
                          profile.user_dob
                        )}-year-old ${profile.user_gender} from <strong>${
      profile.user_Permanent_city
    }, ${profile.user_Permanent_state}, ${
      profile.user_Permanent_country
    }.</strong> she hold a <strong class="text-danger">${
      profile.user_highest_education
    }</strong>  degree and additional education with an <strong class="text-danger">${
      profile.user_additional_education
    }</strong>. Currently, she is  employed as a <strong class="text-success">${
      profile.user_occupation
    }</strong> at a private company in ${profile.user_occupation_location}.
                    </p>`;
  }

  initiateChatConnection(profile: any) {
    let fetchdata = {
      projection: ['*'],
      whereConditions: {
        requested_by: this.AppService.authStatus.profile_id,
        requested_to: profile.user_id,
      },
    };
    var query = `SELECT *
    FROM chat_connection_details
    WHERE chat_connection_details.requested_to = '${this.AppService.authStatus.profile_id}' AND chat_connection_details.requested_by = '${this.preferenceuserid}'
    UNION
    SELECT *
    FROM chat_connection_details
    WHERE chat_connection_details.requested_by = '${this.AppService.authStatus.profile_id}' AND chat_connection_details.requested_to = '${this.preferenceuserid}'`;

    console.log('query', query);
    this.blockUI.start('Please wait, the connection is stabilizing.');
    this.ApiParameterScript.fetchDataFormQuery(query).subscribe((res: any) => {
      console.log('Connection Msg', res);

      if (res.success && res['data'].length == 0) {
        let apiData = {
          data: {
            connection_id: this.generateUniqueString(),
            requested_by: this.AppService.authStatus.profile_id,
            requested_to: profile.user_id,
            created_At: moment().toISOString(),
          },
        };
        this.ApiParameterScript.savedata(
          'chat_connection_details',
          apiData
        ).subscribe((res: any) => {
          this.blockUI.stop();
          this.roter.navigate(['/chat/' + apiData['data'].connection_id]);
        });
      } else {
        this.blockUI.stop();
        this.roter.navigate(['/chat/' + res['data'][0].connection_id]);
      }
    });
  }

  generateUniqueString() {
    const timestamp = new Date().getTime();
    const randomString = Math.random().toString(36).substring(2); // Generate a random string

    return `${randomString}_${timestamp}_${randomString}`;
  }

  like(data: any) {
    data['isLiked'] = data['isLiked'] ? false : true;
    this.CommonService.likeDislikeProfile(data);
  }

  openModal(): void {
    let data = {
      id: this.preferenceuserid,
    };
    const dialogRef = this.dialog.open(ShowkundaliComponent, {
      width: '400px',
      data, // Adjust width as needed
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
    });
  }

  showHoroscopeDetails() {
    var query = `SELECT viewed_horoscope
    FROM user_activities_for_horoscope_details
    WHERE viewed_profile_id = '${this.preferenceuserid}' AND profile_view_by_profile_id = '${this.AppService.authStatus.profile_id}'`;
    //console.log(query);
    this.ApiParameterScript.fetchDataFormQuery(query).subscribe(
      (responce: any) => {
        if (responce.success && responce['data'].length > 0) {
          //data present in user_activities_for_horoscope_details
          if (responce['data'][0].viewed_horoscope == 0) {
            //data present in user_activities_for_horoscope_details but not view happen
            let param = {
              userid: this.AppService.authStatus.profile_id,
            };
            this.plan.horscopeCalculation(param).subscribe((res: any) => {
              if (res.status) {
                this.member_profile_Data.viewed_horoscope = '1';
                this.member_profile_Data.viewed_horoscope_reason = res.message;
                this.CommonService.createLogHistoryForHororscope(
                  this.member_profile_Data
                );
                this.openModal();
                this.hororsopebtn = false;
                this.hororsopecon = true;
              } else {
                this.member_profile_Data.viewed_horoscope = '0';
                this.member_profile_Data.viewed_horoscope_reason = res.message;
                this.CommonService.createLogHistoryForHororscope(
                  this.member_profile_Data
                );

                this.hororsopebtn = true;
                this.hororsopecon = false;
                let data = {
                  horoscope: true,
                  contact: false,
                };
                this.dialog.open(ShowmeaagaeforhoroscpeComponent, {
                  width: '400px', // Adjust width as needed
                  data,
                });
              }
            });
          } else {
            this.member_profile_Data.viewed_horoscope = '1';
            this.member_profile_Data.viewed_horoscope_reason = 'Done';
            this.CommonService.createLogHistoryForHororscope(
              this.member_profile_Data
            );
            this.openModal();
            this.hororsopebtn = false;
            this.hororsopecon = true;
          }
        } else {
          //data not present in user_activities_for_horoscope_details
          let param = {
            userid: this.AppService.authStatus.profile_id,
          };
          this.plan.horscopeCalculation(param).subscribe((res: any) => {
            if (res.status) {
              this.member_profile_Data.viewed_horoscope = '1';
              this.member_profile_Data.viewed_horoscope_reason = res.message;
              this.CommonService.createLogHistoryForHororscope(
                this.member_profile_Data
              );
              this.hororsopebtn = false;
              this.hororsopecon = true;
            } else {
              if (res.message == 'Not Done database issue') {
              } else if (res.message == 'Plan End') {
                this.member_profile_Data.viewed_horoscope = '0';
                this.member_profile_Data.viewed_horoscope_reason = res.message;
                this.CommonService.createLogHistoryForHororscope(
                  this.member_profile_Data
                );
                this.hororsopebtn = true;
                this.hororsopecon = false;
                let data = {
                  horoscope: true,
                  contact: false,
                };
                this.dialog.open(ShowmeaagaeforhoroscpeComponent, {
                  width: '300px', // Adjust width as needed
                  data,
                });
              }
            }
          });
        }
      }
    );
  }
  showContactDetails() {
    // let parm = {
    //   viewid: this.preferenceuserid, // view id
    //   loginid: this.AppService.authStatus.profile_id, //login id
    // };

    // this.ApiService.contactViewOveralCalculation(parm).subscribe(
    //   (res: any) => {
    //     console.log(res);

    //   }
    // );

    // alert('entry');
    this.preferenceuserid; // view id
    this.AppService.authStatus.profile_id; //login id
    //get edited_plan_details contact_view for login user
    let apidata = {
      projection: ['contact_view'],
      whereConditions: {
        user_id: this.AppService.authStatus.profile_id,
      },
    };
    this.ApiParameterScript.fetchdata('edited_plan_details', apidata).subscribe(
      (res: any) => {
        if (res.success && res['data'].length > 0) {
          let plan = res['data'][0].contact_view;
          if (plan <= 0) {
            // alert('contact_view end');
            // if contact_view end
            let data = {
              horoscope: false,
              contact: true,
            };

            this.dialog.open(ShowmeaagaeforhoroscpeComponent, {
              width: '400px', // Adjust width as needed
              data,
            });
            this.member_profile_Data.contact_view_states = 0;
            this.member_profile_Data.contact_view_reason = 'Contact View End';
            this.CommonService.createLogHistoryForContact(
              this.member_profile_Data
            );
          } else {
            // alert('contact_view not end');
            // if contact_view present
            //get edited_plan_details contact_view_other for view user
            let apidata = {
              projection: ['contact_view_other'],
              whereConditions: {
                user_id: this.preferenceuserid,
              },
            };
            this.ApiParameterScript.fetchdata(
              'edited_plan_details',
              apidata
            ).subscribe((res: any) => {
              if (res.success && res['data'].length > 0) {
                let contactviewother = res['data'][0].contact_view_other;
                if (contactviewother <= 0) {
                  //alert('contact_view_other end');
                  // if contact_view_other end
                  this.dialog.open(LockprofilealertComponent, {
                    width: '400px', // Adjust width as needed
                  });
                  this.member_profile_Data.contact_view_states = 0;
                  this.member_profile_Data.contact_view_reason =
                    'Contact View Other End';
                  this.CommonService.createLogHistoryForContact(
                    this.member_profile_Data
                  );
                } else {
                  //alert('contact_view_other not end');
                  // check all data available
                  let plantype =
                    this.AppService.authProfile.user_plan_deatils.filter(
                      (ele: any) => {
                        if (ele.active_status == 1) {
                          return ele.user_plan_type;
                        }
                      }
                    );
                  //login id is free or not
                  var query = `
                    SELECT user_plan_type
                    FROM user_plan_deatils
                    WHERE user_id = '${this.preferenceuserid}' AND active_status = 1`;
                  this.ApiParameterScript.fetchDataFormQuery(query).subscribe(
                    (reponce: any) => {
                      // console.log(reponce);
                      if (reponce.status) {
                        if (
                          plantype.user_plan_type != 'Free' &&
                          reponce['data'][0].user_plan_type == 'Free'
                        ) {
                          // if free
                          // alert('free');
                          let param = {
                            userid: this.AppService.authStatus.profile_id,
                          };
                          this.plan
                            .contactViewCalculation(param)
                            .subscribe((resforcontact: any) => {
                              if (resforcontact.status) {
                                let para = {
                                  userid: this.preferenceuserid,
                                };
                                this.plan
                                  .contactViewOtherCalculation(para)
                                  .subscribe((resforcontactViewOther: any) => {
                                    if (resforcontactViewOther.status) {
                                      this.member_profile_Data.contact_view_states = 0;
                                      this.member_profile_Data.contact_view_reason =
                                        'free member';
                                      this.CommonService.createLogHistoryForContact(
                                        this.member_profile_Data
                                      );
                                      this.dialog.open(
                                        LockprofilealertComponent,
                                        {
                                          width: '400px', // Adjust width as needed
                                        }
                                      );
                                    }
                                  });
                              }
                            });
                        } else {
                          // alert('not free');
                          let param = {
                            userid: this.AppService.authStatus.profile_id,
                          };
                          this.plan
                            .contactViewCalculation(param)
                            .subscribe((resforcontact: any) => {
                              if (resforcontact.status) {
                                let para = {
                                  userid: this.preferenceuserid,
                                };
                                this.plan
                                  .contactViewOtherCalculation(para)
                                  .subscribe((resforcontactViewOther: any) => {
                                    if (resforcontactViewOther.status) {
                                      this.member_profile_Data.contact_view_states = 1;
                                      this.member_profile_Data.contact_view_reason =
                                        'done';
                                      this.CommonService.createLogHistoryForContact(
                                        this.member_profile_Data
                                      );
                                      this.contactbtn = false;
                                      this.contactcontent = true;
                                    }
                                  });
                              }
                            });
                        }
                      }
                    }
                  );
                }
              }
            });
          }
        }
      }
    );
  }
  hight(data: number) {
    let flore = data * 0.0328084;
    let inc = ((data * 0.0328084) % 1) * 12;
    return Math.floor(flore) + ' ft ' + Math.ceil(inc) + ' in';
  }
  getWotermark() {
    var query = `
    SELECT image FROM watermark WHERE status = 1`;
    this.ApiParameterScript.fetchDataFormQuery(query).subscribe(
      (reponce: any) => {
        if (reponce.status && reponce['data'].length > 0) {
          this.watermarkimg =
            this.imgURL + 'watermark/' + reponce['data'][0].image;
        }
      }
    );
  }
  profileImageSlider(data: any) {
    this.filteredArray = [];

    // First query to get approved user profile images
    var query = `
    SELECT user_profile_images FROM user_profile_images WHERE status = 'approved' AND user_ID = '${data}'`;

    this.ApiParameterScript.fetchDataFormQuery(query).subscribe(
      (response: any) => {
        if (response.status && response['data'].length > 0) {
          const approvedImages = response['data'];

          // Second query to get user profile image from user_info
          var queryr = `
          SELECT user_profile_image FROM user_info WHERE user_id = '${data}'`;

          this.ApiParameterScript.fetchDataFormQuery(queryr).subscribe(
            (responseFromUser: any) => {
              if (
                responseFromUser.status &&
                responseFromUser['data'].length > 0
              ) {
                const userImages = responseFromUser['data'];

                // Filter and prioritize images
                userImages.forEach((ele: any) => {
                  const match = approvedImages.find(
                    (ele1: any) =>
                      ele1.user_profile_images === ele.user_profile_image
                  );
                  if (match) {
                    this.filteredArray.push(match);
                  }
                });

                // Add remaining approved images that are not matched
                approvedImages.forEach((ele: any) => {
                  const match = userImages.find(
                    (ele1: any) =>
                      ele.user_profile_images === ele1.user_profile_image
                  );
                  if (!match) {
                    this.filteredArray.push(ele);
                  }
                });
              } else {
                // If no user images, just add all approved images
                this.filteredArray = approvedImages;
              }
              console.log(this.filteredArray);
            }
          );
        }
      }
    );
  }
  profileLike(data: any) {
    var queryr = `
    SELECT count(1) as count  FROM user_like WHERE liked_profile = '${data}'`;
    this.ApiParameterScript.fetchDataFormQuery(queryr).subscribe(
      (responseFromUser: any) => {
        if (responseFromUser.status && responseFromUser['data'].length > 0) {
          this.likecount = responseFromUser['data'][0].count;
        }
      }
    );
  }
  profileView(data: any) {
    var queryr = `
    SELECT count(1) as count FROM user_activities_for_view_profile WHERE viewed_profile_id = '${data}'`;
    this.ApiParameterScript.fetchDataFormQuery(queryr).subscribe(
      (responseFromUser: any) => {
        if (responseFromUser.status && responseFromUser['data'].length > 0) {
          this.profileviewcount = responseFromUser['data'][0].count;
        }
      }
    );
  }
}
