import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as _ from 'lodash';
import { AuthService } from 'src/app/auth/auth.service';
import { ApiParameterScript } from 'src/app/script/api-parameter';
import { AppService } from 'src/app/services/app.service';
import { CommonService } from 'src/app/services/common.service';
import { PlanService } from 'src/app/services/plan.service';

@Component({
  selector: 'app-matches-option-holder',
  templateUrl: './matches-option-holder.component.html',
  styleUrls: ['./matches-option-holder.component.scss']
})
export class MatchesOptionHolderComponent implements OnInit {

  ignoreProfileCount: any = 0
  shortlistedYourProfileCount: any = 0
  viewMyprofileCount: any = 0
  acceptanceRequestCount: any = 0
  constructor(
    private ApiParameterScript: ApiParameterScript,
    private AppService: AppService,
    private _rout: Router,
    private PlanServices: PlanService,
    private commonService: CommonService,
    private AuthServics:AuthService
  ) { }

  ngOnInit(): void {

    var apiData = {
      "projection": ["*"],
      "whereConditions": { "user_id": this.AppService.authStatus.profile_id }
    }
    this.ApiParameterScript.fetchdata("user_activities", apiData).subscribe((res: any) => {
      if (res.success && res['data'].length > 0 && (res['data'][0].user_block_list != "" && res['data'][0].user_block_list)) {
        this.ignoreProfileCount = _.split(res['data'][0].user_block_list, ',').length;
      } else {
        this.ignoreProfileCount = 0
      }

    })
    var query = `SELECT COUNT(shortlist_user_id) as count FROM user_activities_for_shortlisted_profile WHERE shortlist_user_id= '${this.AppService.authStatus.profile_id}'`;
    this.ApiParameterScript.fetchDataFormQuery(query).subscribe((res: any) => {

      if (res.success) {
        this.shortlistedYourProfileCount = res['data'][0].count
      }

    })

    var query = `SELECT COUNT(id) as count FROM user_activities_for_view_profile WHERE viewed_profile_id= '${this.AppService.authStatus.profile_id}'`;
    this.ApiParameterScript.fetchDataFormQuery(query).subscribe((res: any) => {
      if (res.success) {
        this.viewMyprofileCount = res['data'][0].count
      }
    })

    var query = `SELECT COUNT(id) as count FROM user_activities_for_profile_privacy WHERE acceptance_status != 'Allow' AND requested_to_profile_id= '${this.AppService.authStatus.profile_id}'`;
    this.ApiParameterScript.fetchDataFormQuery(query).subscribe((res: any) => {
      if (res.success) {
        this.acceptanceRequestCount = res['data'][0].count
      }
    })
  }


  generateApiEndPoint(apiendpoint:string){

    this.AppService.generateApiEndPoint.next(apiendpoint)

  }

}
