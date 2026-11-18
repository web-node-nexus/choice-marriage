import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ApiParameterScript } from 'src/app/script/api-parameter';

@Component({
  selector: 'app-approve',
  templateUrl: './approve.component.html',
  styleUrls: ['./approve.component.scss'],
})
export class ApproveComponent implements OnInit {
  user_Data: any;
  id: any;
  value: any;
  mobile: any;
  gender: any;
  gamil: any;
  whatsap: any;
  newmobile: any;
  newemail: any;
  newwhatsapp: any;
  valuereverse: any;
  countryid: any;
  seletcountry:any = '91';
  constructor(
    public modal: NgbActiveModal,
    private ApiParameterScript: ApiParameterScript,
    private alert: ToastrService
  ) {}

  ngOnInit(): void {
    console.log(this.user_Data);
    this.id = this.user_Data.id;
    this.value = this.user_Data.value;
    this.mobile = this.user_Data.mobile;
    this.gender = this.user_Data.gender;
    this.gamil = this.user_Data.gamil;
    this.whatsap = this.user_Data.whatsap;
    this.valuereverse = this.value == 'Female' ? 'Male' : 'Female';
    this.seletcountry = '91';
    this.ApiParameterScript.fetchdata(
      'country',
      {
        projection: ['*']
      },
      0,
      240
    ).subscribe((res: any) => {
      console.log(res);
      if(res.success == true){
        this.countryid = res['data']
       }
     //sss  console.log(this.countryid);

    });
  }

  closeModal() {
    this.modal.close();
  }

  submitValue(data: any) {
    if (data == 'Mobile') {
      if (this.newmobile == '' || this.newmobile == undefined) {
        this.alert.error('Enter your New Mobile No');
      } else if( this.newmobile == this.value){
        this.alert.error('Old and new Mobile No is same');
      }else {
        this.ApiParameterScript.updatedata('mobile_no_update', {data:{change_states:1},whereConditions: {user_id: this.id}}).subscribe((res: any) => {})
        let param = {
          data: {
            user_id: this.id,
            old_mobile_no: this.value,
            new_mobile_no: this.newmobile,
            c_code: this.seletcountry
          },
        };
        this.ApiParameterScript.savedata('mobile_no_update', param).subscribe(
          (res: any) => {
            if (res.success) {
              this.alert.success(
                'Changes will reflect on your profile after admin approval'
              );
              this.modal.close();
            }
          }
        );
      }
    }
    if (data == 'Gender') {
      this.ApiParameterScript.updatedata('gender_update', {data:{change_states:1},whereConditions: {user_id: this.id}}).subscribe((res: any) => {})
      let param = {
        data: {
          user_id: this.id,
          old_gender: this.value,
          new_gender: this.valuereverse,
        },
      };
      this.ApiParameterScript.savedata('gender_update', param).subscribe(
        (res: any) => {
          if (res.success) {
            this.alert.success(
              'Changes will reflect on your profile after admin approval'
            );
            this.modal.close();
          }
        }
      );
    }
    if (data == 'Email') {
      if (this.newemail == '' || this.newemail == undefined) {
        this.alert.error('Enter your New Email Id');
      }
      else if(this.newemail == this.value){
        this.alert.error('Old and new Email Id is same');
      }else {
      this.ApiParameterScript.updatedata('email_id_update', {data:{change_states:1},whereConditions: {user_id: this.id}}).subscribe((res: any) => {})
        let param = {
          data: {
            user_id: this.id,
            old_email_id: this.value,
            new_email_id: this.newemail,
          },
        };
        this.ApiParameterScript.savedata('email_id_update', param).subscribe(
          (res: any) => {
            if (res.success) {
              this.alert.success(
                'Changes will reflect on your profile after admin approval'
              );
              this.modal.close();
            }
          }
        );
      }
    }
    if (data == 'Whatsapp') {
      console.log(this.newwhatsapp);

      this.ApiParameterScript.updatedata('whatsapp_no_update', {data:{change_states:1},whereConditions: {user_id: this.id}}).subscribe((res: any) => {})
      if (this.newwhatsapp == '' || this.newwhatsapp == undefined) {
        this.alert.error('Enter your New Whatsapp No');
      } else if(this.newwhatsapp == this.value){
        this.alert.error('Old and new Whatsapp No is same');
      }else {
        let param = {
          data: {
            user_id: this.id,
            old_whatsapp_no: this.value,
            new_whatsapp_no: this.newwhatsapp,
            c_code: this.seletcountry
          },
        };
        this.ApiParameterScript.savedata('whatsapp_no_update', param).subscribe(
          (res: any) => {
            if (res.success) {
              this.alert.success(
                'Changes will reflect on your profile after admin approval'
              );
              this.modal.close();
            }
          }
        );
      }
    }
  }
}
