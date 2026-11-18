import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ApiParameterScript } from 'src/app/script/api-parameter';
import { AppService } from 'src/app/services/app.service';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-shortlist-profile-list',
  templateUrl: './shortlist-profile-list.component.html',
  styleUrls: ['./shortlist-profile-list.component.scss']
})
export class ShortlistProfileListComponent implements OnInit {

  @BlockUI() blockUI: NgBlockUI;
  shortlistedProfileData: any[] = []
  imageURL: string = "http://localhost/matrimonial/storage/"
  constructor(
    private AppService: AppService,
    private ApiParameterScript: ApiParameterScript,
    private alert : ToastrService
  ) { }

  ngOnInit(): void {
    this.imageURL = this.AppService.getFilePath()
    var apiData = {
      "projection": ["*"],
      "whereConditions": { "shortlisted_by_user_id": this.AppService.authStatus.profile_id }
    }

    this.blockUI.start("Loading...")
    this.ApiParameterScript.fetchdata("user_activities_for_shortlisted_profile", apiData).subscribe((res: any) => {
      this.blockUI.stop()
      if (res.success && res['data'].length > 0) {
        this.shortlistedProfileData = res['data']
      } else {
        this.shortlistedProfileData = []
      }
    })
  }


  removeFromIgnoreList(profile_id: any) {

    var updatedblocklistarray = this.shortlistedProfileData
    _.pull(updatedblocklistarray, profile_id);

    this.blockUI.start("Please Wait...")

    let updatedblocklistString = _.join(updatedblocklistarray, ',');
    let updateData = {
      "data": {
        "user_block_list": updatedblocklistString,
      },
      "whereConditions": { user_id: this.AppService.authStatus.profile_id }
    }
    this.ApiParameterScript.updatedata('user_activities', updateData).subscribe((res: any) => {
      this.blockUI.stop()
      if (res.success) {
        Swal.fire('Success', 'You successfully Remove This profile form your ignore list', 'success').then((ress: any) => {
          this.ngOnInit()
        });
      } else {
        Swal.fire({
          icon: 'warning',
          text: res.message
        });
      }
    })






  }
  remove(data:any){

    var apiData: any = {
      "whereConditions": { shortlisted_by_user_id: this.AppService.authStatus.profile_id , shortlist_user_id:data }
    }

    this.blockUI.start("Please Wait...")
    this.ApiParameterScript.deletedata('user_activities_for_shortlisted_profile', apiData).subscribe((res: any) => {
      console.log(res);
      this.blockUI.stop()
      if (res.success) {
        this.alert.success(res.message, 'Success');
        this.ngOnInit();
      } });

  }

}
