import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/services/app.service';
import { ApiParameterScript } from 'src/app/script/api-parameter';
import Swal from 'sweetalert2';
import { ApiService } from 'src/app/services/api.service';
import { FormsModule } from '@angular/forms';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
})
export class ChangePasswordComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  // **************************
  newPassword: any;
  oldPassword: any;
  confirmPassword: any;
  id: any;
  showMessage:any ;
  changepasscount: any;
  contact: any;
  constructor(
    private AppService: AppService,
    private ApiParameterScript: ApiParameterScript,
    private ApiService:ApiService
  ) {}

  ngOnInit(): void {
    this.blockUI.start('Loading...');
    this.id = this.AppService.authStatus.profile_id;
    let param = {
      projection: ['change_pass_count'],
      whereConditions: { auth_ID: this.id },
    };
    this.ApiParameterScript.fetchdata('auth_user', param).subscribe(
      (res: any) => {
        this.blockUI.stop();
        if (res.status && res['data'].length > 0) {
          this.showMessage = res['data'][0].change_pass_count > 5 ? true : false ;
          this.changepasscount = res['data'][0].change_pass_count;


        }
        //console.log(this.changepasscount);
      }
    );
    let param1 = {
      projection: ['whatsapp_no', 'phone_no', 'gmail_id'],
      whereConditions: { id: 1 },
    };
    this.ApiParameterScript.fetchdata('social_media_links', param1).subscribe(
      (res: any) => {
        if (res.status && res['data'].length > 0) {
          this.contact = res['data'][0];
        }
         console.log(this.contact);
      }
    );
  }
  changepass() {
    if (this.oldPassword == '' || this.oldPassword == undefined) {
      Swal.fire({
        icon: 'question',
        title: 'Change Password',
        text: 'Enter Old password',
      });
    } else if (this.newPassword == '' || this.newPassword == undefined) {
      Swal.fire({
        icon: 'question',
        title: 'Change Password',
        text: 'Enter New password',
      });
    } else if (this.confirmPassword != this.newPassword) {
      Swal.fire({
        icon: 'question',
        title: 'Change Password',
        text: 'New password and Conform password should same',
      });
    } else {
      let param = {
        'auth_ID': this.AppService.authStatus.profile_id,
        'newPassword': this.newPassword,
        'oldPassword': this.oldPassword,
      }
      this.ApiService.checkpass(param).subscribe((res:any)=>{

        if(res.success){
          Swal.fire({
            icon: 'success',
            title: 'Change Password',
            text: res.msg,
          });
        }else{
          Swal.fire({
            icon: 'error',
            title: 'Change Password',
            text: res.msg,
          });
        }

      })
    }
  }
}
