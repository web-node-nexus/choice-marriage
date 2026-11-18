import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ApiParameterScript } from 'src/app/script/api-parameter';
import { AppService } from 'src/app/services/app.service';
import { CommonService } from 'src/app/services/common.service';
import Swal from 'sweetalert2';
import { profileObject } from './profileObject';

@Component({
  selector: 'app-view-profile-list',
  templateUrl: './view-profile-list.component.html',
  styleUrls: ['./view-profile-list.component.scss'],
})
export class ViewProfileListComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  profileList: profileObject[] = [];
  imageURL: string = 'http://localhost/matrimonial/';
  sectionTitel: string;
  operationType: string;
  constructor(
    private AppService: AppService,
    private ApiParameterScript: ApiParameterScript,
    private commonService: CommonService,
    private router: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.profileList = [];
    let casepass = 0;

    this.imageURL = this.AppService.getFilePath();

    this.router.params.subscribe((res: any) => {
      this.operationType = res.view_profile_type;
      // console.log("res", res.view_profile_type);
      switch (res.view_profile_type) {
        case 'who_view_my_profile_list':
          this.sectionTitel = 'Who View My Profile ';
          casepass = 1;
          break;
        case 'my_view_profile_list':
          this.sectionTitel = 'My Viewed Profile ';
          casepass = 1;
          break;

        case 'my_view_profile_list':
          this.sectionTitel = 'My Viewed Profile ';
          casepass = 1;
          break;

        default:
          break;
      }

      var LOGIN_INFO = this.AppService.authStatus;

      var apiData: any = {
        projection: ['*'],
        whereConditions: { viewed_profile_id: LOGIN_INFO.profile_id },
      };

      if (this.operationType == 'my_view_profile_list') {
        apiData = {
          projection: ['*'],
          whereConditions: {
            profile_view_by_profile_id: LOGIN_INFO.profile_id,
          },
        };
      }

      this.blockUI.start('Loading...');
      this.ApiParameterScript.fetchdata(
        'user_activities_for_view_profile',
        apiData
      ).subscribe((res: any) => {
        this.blockUI.stop();
        if (res.success && res['data'].length > 0) {
          res['data'].map((i: any) => {
            // console.log(i);
            i['profile_id'] =
              this.operationType == 'my_view_profile_list'
                ? i['viewed_profile_id']
                : i['profile_view_by_profile_id'];
            i['profile_name'] =
              this.operationType == 'my_view_profile_list'
                ? i['viewed_profile_name']
                : i['profile_view_by_name'];
            i['modify_date_time'] = i['modify_date_time']
              ? i['modify_date_time']
              : i['created_At'];
            i['profile_image_url'] =
              this.operationType == 'my_view_profile_list'
                ? this.imageURL + i.viewed_profile_picture
                : this.imageURL + i.profile_view_by_profile_picture;
          });
          // console.log("res",res);
          this.profileList = res['data'];
          // console.log("profileList",this.profileList);
        } else {
          this.profileList = [];
        }
      });
    });
  }

  removeFromIgnoreList(profile_id: any) {
    var updatedblocklistarray = this.profileList;
    _.pull(updatedblocklistarray, profile_id);

    this.blockUI.start('Please Wait...');

    let updatedblocklistString = _.join(updatedblocklistarray, ',');
    let updateData = {
      data: {
        user_block_list: updatedblocklistString,
      },
      whereConditions: { user_id: this.AppService.authStatus.profile_id },
    };
    this.ApiParameterScript.updatedata('user_activities', updateData).subscribe(
      (res: any) => {
        this.blockUI.stop();
        if (res.success) {
          Swal.fire(
            'Success',
            'You successfully Remove This profile form your ignore list',
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

  intialtedChat(profile: any) {
    //console.log(profile);

    this.commonService.initiateChatConnection(profile);
  }
}
