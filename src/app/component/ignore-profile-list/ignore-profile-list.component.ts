import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ApiParameterScript } from 'src/app/script/api-parameter';
import { AppService } from 'src/app/services/app.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ignore-profile-list',
  templateUrl: './ignore-profile-list.component.html',
  styleUrls: ['./ignore-profile-list.component.scss']
})
export class IgnoreProfileListComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  ignoreProfileData: any[] = []
  constructor(
    private AppService: AppService,
    private ApiParameterScript: ApiParameterScript
  ) { }

  ngOnInit(): void {

    var apiData = {
      "projection": ["*"],
      "whereConditions": { "user_id": this.AppService.authStatus.profile_id }
    }

    this.blockUI.start("Loading...")
    this.ApiParameterScript.fetchdata("user_activities", apiData).subscribe((res: any) => {
      
      this.blockUI.stop()
      if (res.success && res['data'].length > 0 && res['data'][0].user_block_list != "" && res['data'][0].user_block_list) {

        this.ignoreProfileData = _.split(res['data'][0].user_block_list, ',');
        
      } else {
        this.ignoreProfileData = []
      }

    })
  }


  removeFromIgnoreList(profile_id: any) {
    
    var updatedblocklistarray = this.ignoreProfileData
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

}
