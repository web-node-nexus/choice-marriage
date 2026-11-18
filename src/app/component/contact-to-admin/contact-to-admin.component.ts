import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { ApiParameterScript } from 'src/app/script/api-parameter';
import { AppService } from 'src/app/services/app.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-contact-to-admin',
  templateUrl: './contact-to-admin.component.html',
  styleUrls: ['./contact-to-admin.component.scss']
})
export class ContactToAdminComponent implements OnInit {
  userid: any;
  contactadmindata: any;

  constructor(
    private ApiParameterScript: ApiParameterScript,
    private AppService: AppService,

  ) { }
  query: string = '';
  ngOnInit(): void {
    this.userid = this.AppService.authStatus.profile_id == '' ? 'unknown' : this.AppService.authStatus.profile_id ;
    this.fatchData();
  }

  generateRandomStringForToken(length: number): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }

  generateRandomDigits(length: number): string {
    let result = '';
    for (let i = 0; i < length; i++) {
      result += Math.floor(Math.random() * 10).toString();
    }
    return result;
  }


  submitForm() {
    if (this.query == '' || this.query == null || this.query == undefined) {
      Swal.fire({
        text: 'Please Write Your Query',
      });
    } else {
      let api = {
        data: {
          user_id: this.userid,
          user_content: this.query,
          ticket_no:
            'CM' +
            this.generateRandomStringForToken(4) +
            this.generateRandomDigits(4),
          created_At: moment().format('YYYY-MM-DD HH:mm:ss'),
        },
      };
      this.ApiParameterScript.savedata('contact_admin', api).subscribe(
        (res: any) => {
          if (res.success) {
            Swal.fire({
              icon: 'success',
              title: 'Form Submitted Successfully!',
              text: 'Admin will contact you shortly.',
            }).then(() => {
              this.ngOnInit();
            });
          }
        }
      );
    }
    // console.log('Query submitted:', this.query);
  }

  fatchData(){
    this.ApiParameterScript.fetchdata('contact_admin', {
      projection: ['*'],whereConditions: { user_Id: this.userid },
    }).subscribe((res: any) => {
      if (res.success && res['data'].length > 0) {
          this.contactadmindata = res['data'];
      }
    })
  }
  adminmessage(data:any){
    this.ApiParameterScript.fetchdata('contact_admin', {
      projection: ['admin_message'],whereConditions: { id: data },
    }).subscribe((res: any) => {
      if (res.success && res['data'].length > 0) {
        alert(res['data'][0].admin_message);
      }
    })

  }

}
