import { Injectable } from '@angular/core';
import { AppService } from './app.service';
import { ApiParameterScript } from '../script/api-parameter';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Roles } from '../auth/roles.enum';
import { NgxPermissionsService, NgxRolesService } from 'ngx-permissions';
import { Notification } from '../appInterface/notification';
import { Router } from '@angular/router';
import { Permission } from '../auth/permissions.enum';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  @BlockUI() blockUI: NgBlockUI;
  constructor(
    private AppService: AppService,
    private ApiParameterScript: ApiParameterScript,
    private ngxRolesService: NgxRolesService,
    private permissionsService: NgxPermissionsService,
    private router: Router,
    private alert: ToastrService
  ) { }

  public createLogHistoryForViewProfile(viewProfile: any) {
    try {
      var LOGIN_INFO = this.AppService.authStatus;
      if (viewProfile && viewProfile.user_ID != '') {
        var apiData = {
          projection: ['*'],
          whereConditions: {
            profile_view_by_profile_id: `${this.AppService.authStatus.profile_id}`,
            viewed_profile_id: `${viewProfile.user_ID}`,
          },
        };
        this.ApiParameterScript.fetchdata(
          'user_activities_for_view_profile',
          apiData
        ).subscribe((res: any) => {
          if (res.success && res['data'].length > 0) {
            var updatedata = {
              data: {
                profile_view_by_profile_id: `${this.AppService.authStatus.profile_id}`,
                profile_view_by_name: `${this.AppService.authStatus.profile_name}`,
                viewed_profile_id: `${viewProfile.user_ID}`,
                viewed_profile_name: `${viewProfile.user_fname} ${viewProfile.user_lname}`,
                created_At: moment().toISOString(),
                profile_view_by_profile_picture: `${this.AppService.authProfile.user_info.user_profile_image}`,
                viewed_profile_picture: `${viewProfile.user_profile_image}`,
              },
              whereConditions: { id: res['data'][0]['id'] },
            };
            this.ApiParameterScript.updatedata(
              'user_activities_for_view_profile',
              updatedata
            ).subscribe((res: any) => { });
          } else {
            this.permissionsService
              .hasPermission(Permission.PROFILE_DETAILS)
              .then((grantPermission) => {
                if (grantPermission) {
                  var savedata = {
                    data: {
                      profile_view_by_profile_id: `${this.AppService.authStatus.profile_id}`,
                      profile_view_by_name: `${this.AppService.authStatus.profile_name}`,
                      viewed_profile_id: `${viewProfile.user_ID}`,
                      viewed_profile_name: `${viewProfile.user_fname} ${viewProfile.user_lname}`,
                      created_At: moment().toISOString(),
                      profile_view_by_profile_picture: `${this.AppService.authProfile.user_info.user_profile_image}`,
                      viewed_profile_picture: `${viewProfile.user_profile_image}`,
                    },
                    whereConditions: {},
                  };
                  this.ApiParameterScript.savedata(
                    'user_activities_for_view_profile',
                    savedata
                  ).subscribe(() => { });
                } else {
                 // console.log('Permmission Denied');
                }
              });
          }
          this.createNotification(
            viewProfile,
            'PROFILE_VIEW_NOTIFICATION_OPERATION',
            'Viewed your profile'
          );
        });
      }
    } catch (error) {
      // console.log(
      //   'Error In CommonService.createLogHistoryForViewProfile',
      //   error
      // );
    }
  }

  public createLogHistoryForContact(viewProfile: any) {
    // console.log(viewProfile);

    try {
      if (viewProfile && viewProfile.auth_ID != '') {
        var apiData = {
          projection: ['*'],
          whereConditions: {
            profile_view_by_profile_id: `${this.AppService.authStatus.profile_id}`,
            viewed_profile_id: `${viewProfile.user_ID}`,
          },
        };
        this.ApiParameterScript.fetchdata(
          'user_activities_for_contact_details',
          apiData
        ).subscribe((res: any) => {
          if (res.success && res['data'].length > 0) {
            var updatedata = {
              data: {
                profile_view_by_profile_id: `${this.AppService.authStatus.profile_id}`,
                profile_view_by_name: `${this.AppService.authStatus.profile_name}`,
                viewed_profile_id: `${viewProfile.auth_ID}`,
                viewed_profile_name: `${viewProfile.user_fname} ${viewProfile.user_lname}`,
                created_At: moment().toISOString(),
                viewed_contact: Number(viewProfile.contact_view_states),
                contact_view_reason: `${viewProfile.contact_view_reason}`,
                profile_view_by_profile_picture: `${this.AppService.authProfile.user_info.user_profile_image}`,
                // "viewed_profile_picture": `${viewProfile.user_profile_image}`
              },
              whereConditions: { id: res['data'][0]['id'] },
            };
            this.ApiParameterScript.updatedata(
              'user_activities_for_contact_details',
              updatedata
            ).subscribe((res: any) => {
              // //console.log(res);
            });
          } else {
            var savedata = {
              data: {
                profile_view_by_profile_id: `${this.AppService.authStatus.profile_id}`,
                profile_view_by_name: `${this.AppService.authStatus.profile_name}`,
                viewed_profile_id: `${viewProfile.auth_ID}`,
                viewed_profile_name: `${viewProfile.user_fname} ${viewProfile.user_lname}`,
                viewed_contact: Number(viewProfile.contact_view_states),
                contact_view_reason: `${viewProfile.contact_view_reason}`,
                created_At: moment().toISOString(),
                profile_view_by_profile_picture: `${this.AppService.authProfile.user_info.user_profile_image}`,
                // "viewed_profile_picture": `${viewProfile.user_profile_image}`
              },
              whereConditions: {},
            };
            this.ApiParameterScript.savedata(
              'user_activities_for_contact_details',
              savedata
            ).subscribe((res: any) => {
              // //console.log(res);
            });
          }
          if (viewProfile.contact_view_states == 1) {
            this.createNotification(
              viewProfile,
              'CONTACT_VIEW_NOTIFICATION_OPERATION',
              'Viewed your CONTACT'
            );
          }
        });
      }
    } catch (error) {
      // console.log(
      //   'Error In CommonService.createLogHistoryForViewProfile',
      //   error
      // );
    }
  }


  public createLogHistoryForHororscope(viewProfile: any) {
   // console.log(viewProfile);


    try {
      if (viewProfile && viewProfile.auth_ID != '') {
        var apiData = {
          projection: ['*'],
          whereConditions: {
            profile_view_by_profile_id: `${this.AppService.authStatus.profile_id}`,
            viewed_profile_id: `${viewProfile.user_ID}`,
          },
        };
        this.ApiParameterScript.fetchdata(
          'user_activities_for_horoscope_details',
          apiData
        ).subscribe((res: any) => {
         // console.log(res);

          if (res.success && res['data'].length > 0) {
            var updatedata = {
              data: {
                profile_view_by_profile_id: `${this.AppService.authStatus.profile_id}`,
                profile_view_by_name: `${this.AppService.authStatus.profile_name}`,
                viewed_profile_id: `${viewProfile.auth_ID}`,
                viewed_profile_name: `${viewProfile.user_fname} ${viewProfile.user_lname}`,
                created_At: moment().toISOString(),
                viewed_horoscope: viewProfile.viewed_horoscope,
                viewed_horoscope_reason: `${viewProfile.viewed_horoscope_reason}`,
                profile_view_by_profile_picture: `${this.AppService.authProfile.user_info.user_profile_image}`,
                // "viewed_profile_picture": `${viewProfile.user_profile_image}`
              },
              whereConditions: { id: res['data'][0]['id'] },
            };
            this.ApiParameterScript.updatedata(
              'user_activities_for_horoscope_details',
              updatedata
            ).subscribe((res: any) => {
              // //console.log(res);
            });
          } else {
            var savedata = {
              data: {
                profile_view_by_profile_id: `${this.AppService.authStatus.profile_id}`,
                profile_view_by_name: `${this.AppService.authStatus.profile_name}`,
                viewed_profile_id: `${viewProfile.auth_ID}`,
                viewed_profile_name: `${viewProfile.user_fname} ${viewProfile.user_lname}`,
                viewed_horoscope: viewProfile.viewed_horoscope,
                viewed_horoscope_reason: `${viewProfile.viewed_horoscope_reason}`,
                created_At: moment().toISOString(),
                profile_view_by_profile_picture: `${this.AppService.authProfile.user_info.user_profile_image}`,
                // "viewed_profile_picture": `${viewProfile.user_profile_image}`
              },
              whereConditions: {},
            };
            this.ApiParameterScript.savedata(
              'user_activities_for_horoscope_details',
              savedata
            ).subscribe((res: any) => {
              // //console.log(res);
            });
          }
          // if (viewProfile.contact_view_states == 1) {
          //   this.createNotification(
          //     viewProfile,
          //     'CONTACT_VIEW_NOTIFICATION_OPERATION',
          //     'Viewed your CONTACT'
          //   );
          // }
        });
      }
    } catch (error) {
      // console.log(
      //   'Error In CommonService.createLogHistoryForViewProfile',
      //   error
      // );
    }
  }

  public likeDislikeProfile(data: any) {
    try {
      let loginUserID = this.AppService.authStatus.profile_id;
      this.ApiParameterScript.fetchdata('user_like', {
        projection: ['*'],
        whereConditions: {
          liked_by_profile_id: loginUserID,
          liked_profile: data.user_id || data.auth_ID,
        },
      }).subscribe((res: any) => {
        if (res.success && res['data'].length > 0) {
          let updateData = {
            data: {
              liked_by_profile_id: `${loginUserID}`,
              liked_profile: `${data.user_id || data.auth_ID}`,
              isLiked: data['isLiked'],
              created_At: moment().toISOString(),
            },
            whereConditions: { id: res['data'][0].id },
          };
          this.ApiParameterScript.updatedata('user_like', updateData).subscribe(
            (res: any) => {

              this.alert.success("You Liked This Profile")
             }
          );
        } else {
          let saveData = {
            data: {
              liked_by_profile_id: `${loginUserID}`,
              liked_profile: `${data.user_id || data.auth_ID}`,
              isLiked: data['isLiked'],
              created_At: moment().toISOString(),
            },
          };
          this.ApiParameterScript.savedata('user_like', saveData).subscribe(
            (res: any) => {
              this.alert.success("You Liked This Profile")
             }
          );
        }
      });
      // if (data['isLiked']) {
        this.createNotification(
          data,
          'LIKE_NOTIFICATION_OPERATION',
          'Like your profile'
        );
      // }
    } catch (error) {
     // console.log('error in method likeDislikeProfile()', error);
    }
  }

  public checkForUserAcceptanceSatus(user_id: any) {
    // console.log("checkForUserAcceptanceSatus", user_id);
    const simpleObservable = new Observable((observer) => {
      try {
        let query = `SELECT user_privacy,marriage_status,user_status FROM user_info WHERE (user_info.user_status = 'Approved' AND user_info.user_privacy = 'private' AND  user_info.marriage_status = 0 AND user_info.user_id='${user_id}')`;
        this.ApiParameterScript.fetchDataFormQuery(query).subscribe(
          (res: any) => {
            // this.blockUI.stop();
            if (res.success && res['data'].length > 0) {
              var apiData = {
                projection: ['*'],
                whereConditions: {
                  request_by_profile_id: this.AppService.authStatus.profile_id,
                  requested_to_profile_id: user_id,
                  acceptance_status: 'allow',
                },
              };
              this.ApiParameterScript.fetchdata(
                'user_activities_for_profile_privacy',
                apiData
              ).subscribe((res: any) => {
                if (res.success && res['data'].length > 0) {
                  observer.next(true);
                  observer.complete();
                } else {
                  this.ngxRolesService.addRole(Roles.VIEW_PRIVATE_USER, []);
                  observer.next(false);
                  observer.complete();
                }
              });
            } else {
              observer.next(true);
              observer.complete();
            }
          }
        );
      } catch (error) {
       // console.log('error in method checkForUserAcceptanceSatus()', error);
        observer.error();
        observer.complete();
      }
    });
    return simpleObservable;
  }

  /**
    * @param data
    * @param type ['CONTACT_VIEW_NOTIFICATION_OPERATION','SEND_MESSAGE_NOTIFICATION_OPERATION','PROFILE_PRIVATE_ACCOUNT_ACCEPT_NOTIFICATION_OPERATION','PROFILE_VIEW_FOR_PRIVATE_ACCOUNT_NOTIFICATION_OPERATION','PROFILE_VIEW_NOTIFICATION_OPERATION',"LIKE_NOTIFICATION_OPERATION"]
    * @param notify_desc
    * @author Suryanarayan Biswal
    * @since 01-01-2024
    */
  public createNotification(
    data: any,
    type: string,
    notify_desc: string | any
  ) {

    var notification: Notification = {
      notify_by_id: this.AppService.authStatus.profile_id,
      notify_to_id: data.user_ID || data.user_id || data.receiver_id || data,
      notify_created_date_time: moment().toISOString(),
      notify_status_view: false,
      notify_desc: notify_desc,
      notify_type: type,
      notify_url: this.AppService.application_url,
      notify_update_date_time: moment().toISOString(),
      notify_expire_data_time: moment().add(5, 'days').toISOString(),
      notify_action_taken:false
    };
    var query = `SELECT *
    FROM notification
    WHERE notify_desc='${notify_desc}' AND notify_created_date_time < notify_expire_data_time AND TIMESTAMPDIFF(HOUR,notify_created_date_time, '${moment().toISOString()}') <=24 AND notify_by_id='${this.AppService.authStatus.profile_id
      }' AND notify_to_id='${notification.notify_to_id}'`;
    // console.log("query", query);
    this.ApiParameterScript.fetchDataFormQuery(query).subscribe(
      (previousNotificationData: any) => {
       // console.log(previousNotificationData);
        if (
          previousNotificationData.success &&
          previousNotificationData['data'].length == 0
        ) {
          switch (type) {
            case 'LIKE_NOTIFICATION_OPERATION':
              notification['notify_url'] =
                this.AppService.application_url +
                'v1/member-profile/' +
                this.AppService.authStatus.profile_id;

              this.ApiParameterScript.savedata('notification', {
                data: notification,
              }).subscribe((res: any) => {
                // //console.log(res);
              });

              break;
            case 'PROFILE_VIEW_NOTIFICATION_OPERATION':
              notification['notify_url'] =
                this.AppService.application_url +
                'v1/member-profile/' +
                this.AppService.authStatus.profile_id;


              this.ApiParameterScript.savedata('notification', {
                data: notification,
              }).subscribe((res: any) => {
                // //console.log(res);
              });

              break;
            case 'PROFILE_VIEW_FOR_PRIVATE_ACCOUNT_NOTIFICATION_OPERATION':
              notification['notify_url'] =
                this.AppService.application_url + 'v1/acceptance';


              this.ApiParameterScript.savedata('notification', {
                data: notification,
              }).subscribe((res: any) => {
                //console.log(res);
              });

              break;
            case 'PROFILE_PRIVATE_ACCOUNT_ACCEPT_NOTIFICATION_OPERATION':
              notification['notify_url'] =
                this.AppService.application_url +
                '/v1/member-profile/' +
                this.AppService.authStatus.profile_id;



              this.ApiParameterScript.savedata('notification', {
                data: notification,
              }).subscribe((res: any) => {
                //console.log(res);
              });

              break;
            case 'SEND_MESSAGE_NOTIFICATION_OPERATION':
              notification['notify_url'] =
                this.AppService.application_url + 'chat/' + data.chat_room_id;
              notification[
                'notify_desc'
              ] = `Send Message that "${notify_desc}"`;


              this.ApiParameterScript.savedata('notification', {
                data: notification,
              }).subscribe((res: any) => {
                //console.log(res);
              });
              break;

            case 'CONTACT_VIEW_NOTIFICATION_OPERATION':
              notification['notify_url'] =
                this.AppService.application_url + 'activity/who_view_my_contact_list/';
              this.ApiParameterScript.savedata('notification', {
                data: notification,
              }).subscribe((res: any) => {
                //console.log(res);
              });
              break;

            default:
              break;
          }
        } else {
         // console.log("No need to send notification it's less than 24 hours");
        }
      }
    );
  }

  initiateChatConnection(profile: any) {
    console.log(profile);

    let fetchdata = {
      projection: ['*'],
      whereConditions: {
        requested_by: this.AppService.authStatus.profile_id,
        requested_to: profile.user_id,
      },
    };
    var query = `SELECT *
    FROM chat_connection_details
    WHERE chat_connection_details.requested_to = '${this.AppService.authStatus.profile_id}' AND chat_connection_details.requested_by = '${profile.viewed_profile_id}'
    UNION
    SELECT *
    FROM chat_connection_details
    WHERE chat_connection_details.requested_by = '${this.AppService.authStatus.profile_id}' AND chat_connection_details.requested_to = '${profile.viewed_profile_id}'`;

    console.log(query);
    this.ApiParameterScript.fetchDataFormQuery(query).subscribe((res: any) => {
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
          this.router.navigate(['/chat']);
        });
      } else {
        this.router.navigate(['/chat/' + res['data'][0].connection_id]);
      }
    });
  }

  generateUniqueString() {
    const timestamp = new Date().getTime();
    const randomString = Math.random().toString(36).substring(2); // Generate a random string

    return `${randomString}_${timestamp}_${randomString}`;
  }
  public createLogHistoryForHoroscope(viewProfile: any) {
    // console.log(viewProfile);

    try {
      if (viewProfile && viewProfile.user_ID != '') {
        var apiData = {
          projection: ['*'],
          whereConditions: {
            profile_view_by_profile_id: `${this.AppService.authStatus.profile_id}`,
            viewed_profile_id: `${viewProfile.user_ID}`,
          },
        };
        this.ApiParameterScript.fetchdata(
          'user_activities_for_horoscope_details',
          apiData
        ).subscribe((res: any) => {
          if (res.success && res['data'].length > 0) {
            var updatedata = {
              data: {
                profile_view_by_profile_id: `${this.AppService.authStatus.profile_id}`,
                profile_view_by_name: `${this.AppService.authStatus.profile_name}`,
                viewed_profile_id: `${viewProfile.user_ID}`,
                viewed_profile_name: `${viewProfile.user_fname} ${viewProfile.user_lname}`,
                created_At: moment().toISOString(),
                viewed_contact: Number(viewProfile.contact_view_states),
                contact_view_reason: `${viewProfile.contact_view_reason}`,
                profile_view_by_profile_picture: `${this.AppService.authProfile.user_info.user_profile_image}`,
                // "viewed_profile_picture": `${viewProfile.user_profile_image}`
              },
              whereConditions: { id: res['data'][0]['id'] },
            };
            this.ApiParameterScript.updatedata(
              'user_activities_for_horoscope_details',
              updatedata
            ).subscribe((res: any) => {
              // //console.log(res);
            });
          } else {
            var savedata = {
              data: {
                profile_view_by_profile_id: `${this.AppService.authStatus.profile_id}`,
                profile_view_by_name: `${this.AppService.authStatus.profile_name}`,
                viewed_profile_id: `${viewProfile.user_ID}`,
                viewed_profile_name: `${viewProfile.user_fname} ${viewProfile.user_lname}`,
                viewed_contact: Number(viewProfile.contact_view_states),
                contact_view_reason: `${viewProfile.contact_view_reason}`,
                created_At: moment().toISOString(),
                profile_view_by_profile_picture: `${this.AppService.authProfile.user_info.user_profile_image}`,
                // "viewed_profile_picture": `${viewProfile.user_profile_image}`
              },
              whereConditions: {},
            };
            this.ApiParameterScript.savedata(
              'user_activities_for_contact_details',
              savedata
            ).subscribe((res: any) => {
              // //console.log(res);
            });
          }
          // if (viewProfile.contact_view_states == 1) {
          //   this.createNotification(
          //     viewProfile,
          //     'CONTACT_VIEW_NOTIFICATION_OPERATION',
          //     'Viewed your CONTACT'
          //   );
          // }
        });
      }
    } catch (error) {
      // console.log(
      //   'Error In CommonService.createLogHistoryForViewProfile',
      //   error
      // );
    }
  }
}
