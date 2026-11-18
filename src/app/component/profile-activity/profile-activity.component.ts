import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { AppService } from 'src/app/services/app.service';


@Component({
  selector: 'app-profile-activity',
  templateUrl: './profile-activity.component.html',
  styleUrls: ['./profile-activity.component.scss']
})
export class ProfileActivityComponent implements OnInit {
  BlockedProfile : any
  LikeProfile : any
  Shortlistedprofile : any
  ViewedMyContact : any
  iviewedcontact : any
  iviewedprofile : any
  viewedmyprofile: any;
  constructor(
    private AppService: AppService,
    private  ApiService : ApiService

  ) { }

  ngOnInit(): void {
    let id = this.AppService.authProfile.user_religion.user_ID
    this.allData(id);
  }
  allData(id:any){
    this.ApiService.getAllCount({'user_id' : id}).subscribe((res:any)=>{
     // console.log(res);
      if(res.status){
        this.BlockedProfile = res.BlockedProfile
        this.LikeProfile = res.LikeProfile
        this.Shortlistedprofile = res.Shortlistedprofile
        this.ViewedMyContact  =res.ViewedMyContact
        this.iviewedcontact = res.iviewedcontact
        this.iviewedprofile = res.iviewedprofile
        this.viewedmyprofile = res.viewedmyprofile
      }
    })
  }


}
