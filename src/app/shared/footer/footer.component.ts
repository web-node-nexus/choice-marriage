import { Component, OnInit ,HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { ApiParameterScript } from 'src/app/script/api-parameter';
import { AppService } from 'src/app/services/app.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  public screenWidth: any;
  Facebook: any;
  Twitter: any;
  YouTube: any;
  Instagram: any;
  whatsappthis: any;
  @HostListener('window:resize', ['$event'])
  onResizes(event: any) {
    this.screenWidth = window.innerWidth;
  }
  public isLogin: Boolean = false;
  public LoginInformation: any;
  public authInfo: any
  sidebarVisible: boolean = false
  test: Date = new Date();
  socialMediaLink: any;
  constructor(
    private router: Router,
    private auth: AuthService,
    private app: AppService,
    private ApiParameterScript: ApiParameterScript
  ) { }

  ngOnInit() {
    this.socialMediaLink = this.app['appConfig'] ? this.app['appConfig']['socialMediaList'] : {}
    this.screenWidth = window.innerWidth;
    this.auth.authCredential.subscribe((res: any) => {
      if (res) {
        this.isLogin = res.profile_id != null ? true : false;
        this.authInfo = this.auth.getAuthStatus() ? this.auth.getAuthStatus() : res;
      }
    });
     this.getSocialMedia();
  }
  getPath() {
    return this.router.url;
  }
  getSocialMedia(){
    var fetchData = {
      projection: ['*'],
      whereConditions: { id: 1 },
    };
    this.ApiParameterScript.unsecuredFatchquary('social_media_links',fetchData,true,5 * 60 * 60 * 1000).subscribe((res:any)=>{
      //console.log(res['data'][0].twitter_link);

      if(res.status){
        this.Facebook  = res['data'][0].facebook_link;
       // console.log(this.Facebook);
        this.Twitter = res['data'][0].twitter_link;
        //console.log(this.Twitter);
        this.YouTube = res['data'][0].youtub_link;
        //console.log(this.YouTube);
        this.Instagram = res['data'][0].insta_id ;
        //console.log(this.Instagram);
        this.whatsappthis = res['data'][0].whatsapp_no;
       // console.log(this.whatsappthis);

      }

    });
  }
}
