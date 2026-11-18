import { query } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiParameterScript } from 'src/app/script/api-parameter';
import { AppService } from 'src/app/services/app.service';
import Swal from 'sweetalert2';
Router;
@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
})
export class ContactComponent implements OnInit {
  contact: any = [];
  count: any;
  hader:any = '';
  constructor(
    private app: AppService,
    private api: ApiParameterScript,
    private ActivatedRoute: ActivatedRoute,
    private Router: Router
  ) {}

  ngOnInit(): void {
    this.ActivatedRoute.params.subscribe((ide: any) => {
      // console.log(ide);
      if (ide.ide == 'i_viewed') {
        this.hader= 'I Viewed Contact'
        this.iViewed();
      } else if (ide.ide == 'viewed_my_contact') {
        this.hader = 'Who View My Contact'
        this.viewedMyContact();
      }
    });
    //
  }
  iViewed() {
    let query = `select b.user_profile_image,a.auth_phone_no,c.viewed_profile_id,c.created_At ,c.viewed_contact
    from
    auth_user  as a inner join
    user_info as b inner join
    user_activities_for_contact_details as c on a.auth_ID = c.viewed_profile_id AND b.user_id = c.viewed_profile_id
    where c.profile_view_by_profile_id='${this.app.authStatus.profile_id}'`;
    this.api.fetchDataFormQuery(query).subscribe((res: any) => {
      // console.log(res);
      if (res.status) {
        this.contact = res['data'];
      }
      this.count = this.contact.length;
      // console.log(this.count);
    });
  }
  viewedMyContact() {
    let query = `select b.user_profile_image,a.auth_phone_no,c.viewed_profile_id,c.created_At ,c.viewed_contact
    from
    auth_user  as a inner join
    user_info as b inner join
    user_activities_for_contact_details as c on a.auth_ID = c.viewed_profile_id AND b.user_id = c.viewed_profile_id
    where c.viewed_profile_id ='${this.app.authStatus.profile_id}'`;
    this.api.fetchDataFormQuery(query).subscribe((res: any) => {
      // console.log(res);
      if (res.status) {
        this.contact = res['data'];
      }
      this.count = this.contact.length;
      //console.log(this.count);
    });
  }
  reroute(profile: any, id: any) {
    if (profile == 1) {
      this.Router.navigate(['v1/member-profile/', id]);
      // v1/member-profile/CHOICEMARRIAGEY0I8X9417
    } else {
      var query = `
           SELECT *
           FROM social_media_links
           WHERE id = 1`;
      this.api.fetchDataFormQuery(query).subscribe((res: any) => {
        if (res.status) {
          let socialmedialinks = res['data'][0];
          Swal.fire({
            html: `<h1>Contact To ADMIN</h1>
              <p>Phone Number: ${socialmedialinks?.phone_no}</p>
              <p>WhatsApp Number: ${socialmedialinks?.socialmedialinks}</p>
              <p>Gmail: ${socialmedialinks?.gmail_id}</p>`,
          }).then(()=>{
            this.Router.navigate(['v1/member-profile/', id]);
          });
        }
      });
    }
  }
}
