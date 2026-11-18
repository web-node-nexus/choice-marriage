import { Component, OnInit } from '@angular/core';
import { ApiParameterScript } from 'src/app/script/api-parameter';
import { AppService } from 'src/app/services/app.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-deleteprofile',
  templateUrl: './deleteprofile.component.html',
  styleUrls: ['./deleteprofile.component.scss'],
})
export class DeleteprofileComponent implements OnInit {
  userid: any;
  reason: string = '';
  alertshow: any = false;
  fromdivshow: any = true;
  constructor(
    private AppService: AppService,
    private ApiParameterScript: ApiParameterScript
  ) {}

  ngOnInit(): void {
    this.userid = this.AppService.authStatus.profile_id;
    this.ApiParameterScript.fetchdata('user_delete_request', {
      projection: ['*'],
      whereConditions: { user_id: this.userid },
    }).subscribe((res: any) => {
      if (res.success && res['data'].length > 0) {
        this.alertshow = true;
        this.fromdivshow = false;
      } else {
        this.alertshow = false;
        this.fromdivshow = true;
      }
    });
  }

  submitForm() {
    if (this.reason == '') {
      Swal.fire({
        title: 'Delete Profile',
        icon: 'error',
        text: 'Reason For Deleting Your Profile should not Empty',
      });
    } else {
      Swal.fire(
        'Delete Profile',
        'Are you sure you want to delete your profile?',
        'question'
      ).then((result) => {
        if (result.isConfirmed) {
          let api = {
            data: {
              user_id: this.userid,
              user_cause: this.reason,
            },
          };
          this.ApiParameterScript.savedata(
            'user_delete_request',
            api
          ).subscribe((res: any) => {
            if (res.success) {
              this.alertshow = true;
              this.fromdivshow = false;
            }
          });
        }
      });
    }
  }
}
