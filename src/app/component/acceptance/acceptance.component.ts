import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ApiParameterScript } from 'src/app/script/api-parameter';
import { AppService } from 'src/app/services/app.service';
import { CommonService } from 'src/app/services/common.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-acceptance',
  templateUrl: './acceptance.component.html',
  styleUrls: ['./acceptance.component.scss']
})
export class AcceptanceComponent implements OnInit {

  @BlockUI() blockUI: NgBlockUI;
  requestedProfileList: any[] = []
  imageURL: string = "http://localhost/matrimonial/"
  constructor(
    private AppService: AppService,
    private ApiParameterScript: ApiParameterScript,
    private CommonService:CommonService
  ) { }

  ngOnInit(): void {
    this.imageURL = this.AppService.getFilePath()
    var apiData = {
      "projection": ["*"],
      "whereConditions": { "requested_to_profile_id": this.AppService.authStatus.profile_id }
    }

    this.blockUI.start("Loading...")
    this.ApiParameterScript.fetchdata("user_activities_for_profile_privacy", apiData).subscribe((res: any) => {
      
      this.blockUI.stop()
      if (res.success && res['data'].length > 0) {
        this.requestedProfileList = res['data']
      } else {
        this.requestedProfileList = []
      }

    })
  }

  allow(profile:any,status:string){
    
    var apiData = {
      "data": {"acceptance_status":status},
      "whereConditions": {"request_by_profile_id": profile.request_by_profile_id , "requested_to_profile_id": this.AppService.authStatus.profile_id }
    }

    this.blockUI.start('Please wait...')
    this.ApiParameterScript.updatedata("user_activities_for_profile_privacy",apiData).subscribe((res:any)=>{
      this.blockUI.stop()
     
      if (res.success) {
       this.CommonService.createNotification({user_id:profile.request_by_profile_id},'PROFILE_PRIVATE_ACCOUNT_ACCEPT_NOTIFICATION_OPERATION','Is accept your request to view profile')
        Swal.fire(res.success,res.message,'success').then(()=>{
          this.ngOnInit()
        })

      } else {
        Swal.fire(res.success,res.message,'warning')
      }
      
    })
    
  }


}
