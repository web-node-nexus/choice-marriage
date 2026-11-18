import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth/auth.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CustomAlertComponent } from './shared/custom-alert/custom-alert.component';
import { ApiParameterScript } from './script/api-parameter';
import { AppService } from './services/app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Patarabibaha :-Find Your Perfect Match, Together Forever!';
  sidebarVisible:boolean=false
  constructor(
    public _router: Router,
    // private _auth: AuthService,
    // private _modalService: NgbModal,
    // private ApiParameterScript:ApiParameterScript,
    // private app:AppService
    

  ) {

  }
  ngOnInit(): void {
    // this._auth.autoSignIn();

    // this._auth.authCredential.subscribe((authInfo: any) => {
    //   // console.log(authInfo);
     
    //   if (authInfo) {
       
    //     // this.ApiParameterScript.getprofile({"userid":authInfo.profile_id}).subscribe((profile_info:any)=>{
    //     //   // console.log(profile_info);

    //     //   if(profile_info.user_profile_status=='Not Completed'){
    //     //     // const modalRef= this._modalService.open(CustomAlertComponent)
    //     //     // modalRef.componentInstance.auth_Info=authInfo
    //     //     this._router.navigateByUrl('setup/profile')
          
    //     //   }
          
    //     // })
       
    //   }
    // })




  }

  openProfile(event:any){
    this.sidebarVisible=event
  }

  display_fottor() {

    var hidden_footer = ['/chat','/notification']
    var isAllowTo_show_footer = true;
    hidden_footer.forEach((url: any) => {
          if(this._router.url.includes(url))isAllowTo_show_footer=false
    })

    return isAllowTo_show_footer;
  }
}
