import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ApiParameterScript } from 'src/app/script/api-parameter';
import { AppService } from 'src/app/services/app.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.scss']
})
export class RequestComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  request_profile_id: any = ''
  request_profile: any
  imgURL: string = "http://localhost/matrimonial/storage/";
  resend:boolean =false;
  showRequest:boolean=false
  constructor(
    private AppService: AppService,
    private ApiParameterScript: ApiParameterScript,
    private _rout: ActivatedRoute,
    private CommonService:CommonService
  ) { }

  ngOnInit(): void {

    this.blockUI.start("Loading...")
    this._rout.params.subscribe((url_data: any) => {
      this.imgURL = this.AppService.getFilePath()

      this.request_profile_id = url_data.user_id
      var query = `SELECT user_id,user_profile_image,user_fname,user_lname FROM user_info WHERE user_id='${this.request_profile_id}'`
      this.ApiParameterScript.fetchDataFormQuery(query).subscribe((res: any) => {

        if (res.success && res['data'].length > 0) {
          this.request_profile = res['data'][0]
        }

        var apidata = {
          "projection": ["*"],
          "whereConditions": { "requested_to_profile_id": this.request_profile_id, "request_by_profile_id": this.AppService.authStatus.profile_id }
        }

        this.ApiParameterScript.fetchdata('user_activities_for_profile_privacy', apidata).subscribe((res: any) => {


          this.blockUI.stop()
          if (res.success && res['data'].length>0) {
            if(res['data'][0].acceptance_status == "pending"){
              this.showRequest=false;
              //this.resend = false;
            }
            else if(res['data'][0].acceptance_status == "Allow"){
              this.showRequest=false;
              //this.resend = false;
            }else{
              this.showRequest=true;
              //this.resend = true;
            }

          } else {
            this.showRequest=true
          }

        })

      })
    })
  }
  sendRequest() {


    var apidata = {
      "data": {
        "requested_to_profile_img": `${this.request_profile.user_profile_image}`,
        "requested_to_profile_name": this.request_profile.user_fname + ' ' + this.request_profile.user_lname,
        "requested_to_profile_id": this.request_profile.user_id,
        "created_At": moment().toISOString(),
        "request_by_name": this.AppService.authStatus.profile_name,
        "request_by_profile_id": this.AppService.authStatus.profile_id,
        "requested_by_profile_img": this.AppService.authProfile.user_info.user_profile_image,
      },
      "whereConditions": { "requested_to_profile_id": this.request_profile_id, "request_by_profile_id": this.AppService.authStatus.profile_id }
    }



    this.ApiParameterScript.savedata('user_activities_for_profile_privacy', apidata).subscribe((res: any) => {

      if (res.success) {
        this.showRequest=false
        this.CommonService.createNotification(this.request_profile,'PROFILE_VIEW_FOR_PRIVATE_ACCOUNT_NOTIFICATION_OPERATION',"Is request to view your profile")
      } else {
        this.showRequest=true
      }


    })


  }
}
