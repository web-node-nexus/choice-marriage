import { Component, EventEmitter, HostListener, OnInit, Output } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { AuthService } from 'src/app/auth/auth.service';
import { ApiParameterScript } from 'src/app/script/api-parameter';
import { AppService } from 'src/app/services/app.service';

@Component({
  selector: 'app-buttom-navigation-bar',
  templateUrl: './buttom-navigation-bar.component.html',
  styleUrls: ['./buttom-navigation-bar.component.scss']
})
export class ButtomNavigationBarComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  // **************************
  public screenWidth: any;
  @HostListener('window:resize', ['$event'])
  onResizes(event: any) {
    this.screenWidth = window.innerWidth;
  }
  public isLogin: Boolean = false;
  public LoginInformation: any;
  public authInfo: any
  sidebarVisible: boolean = false
  
  notificationCount:number=0
  @Output() sidebarVisibleOption: EventEmitter<boolean> = new EventEmitter();
  openProfile() {
    console.log("openProfile");

    // this.sidebarVisible = !this.sidebarVisible;
    // this.sidebarVisibleOption.emit(this.sidebarVisible);
  
  }
  constructor(
    private auth: AuthService,
    private ApiParameterScript: ApiParameterScript,
    private App: AppService
  ) { }

  ngOnInit(): void {

    this.screenWidth = window.innerWidth;
    // console.log(this.screenWidth);
    this.auth.authCredential.subscribe((res: any) => {
      // console.log(res);

      if (res) {
        // console.log(res);
        this.isLogin = res.profile_id != null ? true : false;
        this.authInfo = this.auth.getAuthStatus() ? this.auth.getAuthStatus() : res;
        // console.log(this.authInfo);

      }
    })

    this.App.notificationCount.subscribe((res:number)=>{
      this.notificationCount=res
    })
  }
  public logout() {
    var apidata = {
      "data": { "online_status": 0 },
      "whereConditions": { "user_id": this.App.authStatus.profile_id }
    }

    this.blockUI.start("Please Wait We Are Reverting Your Access")
    this.ApiParameterScript.updatedata("user_info", apidata).subscribe((res: any) => {
      this.blockUI.stop()
      // if(res.success){
      this.auth.logout()
      // }
    })

  }
}
