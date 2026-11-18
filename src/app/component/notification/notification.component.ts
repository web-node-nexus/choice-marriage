import { query } from '@angular/animations';
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ApiParameterScript } from 'src/app/script/api-parameter';
import { AppService } from 'src/app/services/app.service';
import { Notification } from '../../appInterface/notification';
import { map } from 'lodash';
import * as _ from 'lodash';
import Swal from 'sweetalert2';
import { CommonService } from 'src/app/services/common.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
})
export class NotificationComponent implements OnInit, OnDestroy {
  @BlockUI() blockUI: NgBlockUI;
  // **************************
  notificationData: any[] = [];
  imageURL: string = '';
  notification_loader: boolean = true;
  notificationLoadingInterval: any;

  offset = 0;
  limit = 10;
  fetching = false;
  totalNotificatinAvailble: number = 0;
  @HostListener('window:scroll', ['$event'])
  onScroll(event: Event): void {
    if (
      window.innerHeight + window.scrollY >= document.body.offsetHeight &&
      !this.notification_loader &&
      this.totalNotificatinAvailble > this.offset
    ) {
      this.offset = this.notificationData.length;
      // console.log("fetching",this.offset);
      this.loadNotification();
    } else {
      console.log('All Notification Loaded');
    }
  }
  constructor(
    private ApiParameterScript: ApiParameterScript,
    private AppService: AppService,
    private router: Router,
    private commonService: CommonService,
    private alert: ToastrService
  ) {}

  ngOnInit(): void {
    this.imageURL = `${this.AppService.getFilePath()}`;
    this.loadNotification();

    // this.notificationLoadingInterval = setInterval(() => {
    //   console.log("Refresh Notification");

    //   if (!this.AppService.authStatus) {
    //     clearInterval(this.notificationLoadingInterval);
    //   } else {
    //     this.loadNotification()
    //   }
    // }, 10000);
  }

  ngOnDestroy(): void {
    clearInterval(this.notificationLoadingInterval);
  }

  public loadNotification() {
    // this.fetching=true
    console.log('Calling LoadNotification');
    var query = `SELECT notification.*,user_info.user_fname,user_info.user_lname,user_info.user_profile_image ,COUNT(*) OVER () AS total_count FROM notification INNER JOIN user_info ON notification.notify_by_id=user_info.user_id AND notification.notify_to_id='${this.AppService.authStatus.profile_id}' ORDER BY notification.id DESC LIMIT ${this.limit} OFFSET ${this.offset}`;
    console.log(query);

    this.notification_loader = true;
    // this.notificationData = []
    this.ApiParameterScript.fetchDataFormQuery(query).subscribe((res: any) => {
      console.log(res);
      // this.fetching=false
      this.notification_loader = false;
      if (res.success && res['data'].length > 0) {
        this.totalNotificatinAvailble = res['data'][0]['total_count'];
        // _.map(res['data'], (i: any) => {
        //   i['actions'] =this.generateAction(i.notify_type)
        // })

        this.notificationData = [...this.notificationData, ...res['data']];
      }
    });
  }

  // Inside your Angular component class
  generateAction(notificationType: string): any[] {
    switch (notificationType) {
      case 'CONTACT_VIEW_NOTIFICATION_OPERATION':

      case 'PROFILE_VIEW_NOTIFICATION_OPERATION':
        return [
          {
            name: 'View',
            iconCls: 'fa-regular fa-eye',
            btnCls: 'btn btn-outline-success',
            method: 'viewNotification',
          },
          // { name: 'Call', iconCls: 'fa-solid fa-phone', btnCls: 'btn btn-outline-primary', method: 'call' }
        ];
      case 'PROFILE_VIEW_FOR_PRIVATE_ACCOUNT_NOTIFICATION_OPERATION':
        return [
          {
            name: 'View',
            iconCls: 'fa-regular fa-eye',
            btnCls: 'btn btn-outline-success',
            method: 'viewNotification',
          },
          {
            name: 'Accept',
            iconCls: 'fa-regular fa-check-circle',
            btnCls: 'btn btn-outline-info',
            method: 'accept',
          },
          {
            name: 'Ignore',
            iconCls: 'fa-regular fa-times-circle',
            btnCls: 'btn btn-outline-warning',
            method: 'ignore',
          },
        ];
      case 'PROFILE_PRIVATE_ACCOUNT_ACCEPT_NOTIFICATION_OPERATION':
        return [
          {
            name: 'View',
            iconCls: 'fa-regular fa-eye',
            btnCls: 'btn btn-outline-success',
            method: 'viewNotification',
          },
          // { name: 'Call', iconCls: 'fa-solid fa-phone', btnCls: 'btn btn-outline-primary', method: 'call' },
          {
            name: 'Like',
            iconCls: 'fa-solid fa-thumbs-up',
            btnCls: 'btn btn-outline-primary',
            method: 'like',
          },
        ];
      case 'LIKE_NOTIFICATION_OPERATION':
        return [
          {
            name: 'View',
            iconCls: 'fa-regular fa-eye',
            btnCls: 'btn btn-outline-success',
            method: 'viewNotification',
          },
          {
            name: 'Like',
            iconCls: 'fa-solid fa-thumbs-up',
            btnCls: 'btn btn-outline-primary',
            method: 'like',
          },
          // { name: 'Call', iconCls: 'fa-solid fa-phone', btnCls: 'btn btn-outline-primary', method: 'call' }
        ];
      case 'SEND_MESSAGE_NOTIFICATION_OPERATION':
      case 'PROFILE_INTEREST_ACCEPT_NOTIFICATION_OPERATION':
        return [
          {
            name: 'View',
            iconCls: 'fa-regular fa-eye',
            btnCls: 'btn btn-outline-success',
            method: 'viewNotification',
          },
          {
            name: 'Send Message',
            iconCls: 'fa-solid fa-envelope',
            btnCls: 'btn btn-outline-primary',
            method: 'sendMessage',
          },
          // { name: 'Call', iconCls: 'fa-solid fa-phone', btnCls: 'btn btn-outline-primary', method: 'call' }
        ];
      // Add cases for other notification types
      default:
        return [];
    }
  }

  checkActionisTaken(notification: Notification, whichBtn: string) {
    // if(whichBtn!='View'){
    //   notification.notify_action_taken
    // }
    return !['View', 'Like', 'Send Message'].includes(whichBtn)
      ? notification.notify_action_taken
      : false;
  }
  notificationAction(notification: Notification) {
    this.ApiParameterScript.updatedata('notification', {
      data: {
        notify_action_taken: true,
        notify_update_date_time: moment().toISOString(),
      },
      whereConditions: { id: notification.id },
    }).subscribe((res: any) => {});
  }

  handleButtonClick(actions: any, params: Notification) {
    try {
      if (!params.notify_status_view) {
        this.ApiParameterScript.updatedata('notification', {
          data: {
            notify_status_view: true,
            notify_update_date_time: moment().toISOString(),
          },
          whereConditions: { id: params.id },
        }).subscribe((res: any) => {});
      }

      let _this: any = this;

      // if (actions.name != "View") {
      // Swal.fire({
      //   title: "Are you sure?",
      //   text: "You won't be able to revert this!",
      //   icon: "warning",
      //   showCancelButton: true,
      //   confirmButtonColor: "#3085d6",
      //   cancelButtonColor: "#d33",
      //   confirmButtonText: "Yes, Take Action !"
      // }).then((result) => {
      //   if (result.isConfirmed) {
      // If the user clicks on "Yes", perform the action
      // You can add your action logic here
      _this[actions.method](params);
      this.notificationAction(params);
      // } else if (result.dismiss === Swal.DismissReason.cancel) {
      //   // If the user clicks on "No" or outside the modal
      //   // Swal.fire('Action cancelled', '', 'info');
      //   Swal.fire({
      //     title: "Good job!",
      //     text: "You clicked the button!",
      //     icon: "success"
      //   });
      // }
      // });
      // } else {
      //   _this[actions.method](params)
      // }
    } catch (error: any) {
      Swal.fire(
        'UnExpected Error Occurs Please Try After Sometimes',
        error.toString(),
        'error'
      );
    }
  }

  viewNotification(notification: Notification) {
    // this.blockUI.start('Please Wait')

    // window.location.href = notification.notify_url
    var url = '/v1/member-profile/' + notification.notify_by_id;
    this.router.navigateByUrl(url);
  }

  remove(notification: Notification, index: number) {
    // this.ApiParameterScript.
    // console.log(notification);

    var apiData: any = {
      whereConditions: { id: notification.id },
    };

    this.blockUI.start('Please Wait...');
    this.ApiParameterScript.deletedata('notification', apiData).subscribe(
      (res: any) => {
        console.log(res);
        this.blockUI.stop();
        if (res.success) {
          this.notificationData.splice(index, 1);
          this.alert.success(res.message, 'Success');
        } else {
          this.alert.error(res.message, 'Error');
        }
      }
    );
  }

  call(notification: Notification) {
    console.log(notification);
  }

  sendMessage(notification: any) {
    console.log(notification.notify_url);
    window.location.href = notification.notify_url;
  }
  ignore(notification: Notification) {
    console.log(notification);
    var apiData = {
      data: { acceptance_status: 'Not Allow' },
      whereConditions: {
        request_by_profile_id: notification.notify_by_id,
        requested_to_profile_id: this.AppService.authStatus.profile_id,
      },
    };
    this.blockUI.start('Please wait...');
    this.ApiParameterScript.updatedata(
      'user_activities_for_profile_privacy',
      apiData
    ).subscribe((res: any) => {
      this.blockUI.stop();
      if (res.success) {
        this.commonService.createNotification(
          { user_id: notification.notify_by_id },
          'PROFILE_PRIVATE_ACCOUNT_ACCEPT_NOTIFICATION_OPERATION',
          'Is Deny your request to view profile'
        );
        Swal.fire(res.success, res.message, 'success').then(() => {
          // this.ngOnInit()
        });
      } else {
        Swal.fire(res.success, res.message, 'warning');
      }
    });
  }
  accept(notification: Notification) {
    console.log(notification);
    var apiData = {
      data: { acceptance_status: 'Allow' },
      whereConditions: {
        request_by_profile_id: notification.notify_by_id,
        requested_to_profile_id: this.AppService.authStatus.profile_id,
      },
    };
    this.blockUI.start('Please wait...');
    this.ApiParameterScript.updatedata(
      'user_activities_for_profile_privacy',
      apiData
    ).subscribe((res: any) => {
      this.blockUI.stop();
      if (res.success) {
        this.commonService.createNotification(
          { user_id: notification.notify_by_id },
          'PROFILE_PRIVATE_ACCOUNT_ACCEPT_NOTIFICATION_OPERATION',
          'Is accept your request to view profile'
        );

        this.alert.success('Profile Accepted Succesfully', 'Success');
        this.ngOnInit();
        // Swal.fire(res.success, res.message, 'success').then(() => {
        //   // this.ngOnInit()
        // })
      } else {
        Swal.fire(res.success, res.message, 'warning');
      }
    });
  }
  like(notification: Notification) {
    this.commonService.likeDislikeProfile(notification.notify_by_id);
  }
  readChart(notification: any) {}
  openChart(notification: any) {}

  refresh() {
    this.loadNotification();
  }

  trackByFunction(index: number, item: any): number {
    return item.id; // Assuming 'id' is a unique identifier for each item
  }
}
