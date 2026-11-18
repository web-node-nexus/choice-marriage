import { Component, OnInit } from '@angular/core';
import { ApiParameterScript } from 'src/app/script/api-parameter';
import { AppService } from 'src/app/services/app.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  user_profileInformations:any;
  profileImages:any;
  constructor(
    private apiparameter:ApiParameterScript,
    private appservices: AppService
  ) { }

  ngOnInit(): void {


    this.apiparameter.getprofile({userid:this.appservices.authStatus.profile_id}).subscribe((res:any)=>{
      
      if(res.success){
        this.user_profileInformations=res;
        this.profileImages=`${this.appservices.getFilePath()}${res['user_info'].user_profile_image}`
        
      }else{
        this.user_profileInformations={}
      }
      
    })
  }

}
