import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDateFormats } from '@angular/material/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { AuthService } from 'src/app/auth/auth.service';
import { ApiParameterScript } from 'src/app/script/api-parameter';
import { ApiService } from 'src/app/services/api.service';
import { AppService } from 'src/app/services/app.service';
import { environment } from 'src/environments/environment';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-addsucessstory',
  templateUrl: './addsucessstory.component.html',
  styleUrls: ['./addsucessstory.component.scss'],
})
export class AddsucessstoryComponent implements OnInit {
  successstorybyuser = new FormGroup({
    id: new FormControl(''),
    login_name: new FormControl(''),
    partner_name: new FormControl('', [Validators.required]),
    ring_exchange_date: new FormControl('', [Validators.required]),
    how_we_met: new FormControl('', [Validators.required]),
    marriage_date: new FormControl('', [Validators.required]),
    the_proposal: new FormControl('', [Validators.required]),
    our_edding_day: new FormControl('', [Validators.required]),
    life_after_marriage: new FormControl('', [Validators.required]),
    wedding_photo: new FormControl('', [Validators.required]),
    dta: new FormControl(''),
  });
  relationshipStatusOptions: any;
  // [
  //   { label: 'Engaged', value: 'engaged' },
  //   { label: 'Married', value: 'married' },
  //   { label: 'In a Relationship', value: 'relationship' },
  // ];
  imageSrc: any;
  maritalstatus: any;
  image: any;
  url: any = environment.filePath;
  id: any;
  changeid: any;
  imagetag: any = false;
  alldata: any;
  constructor(
    private auth: AuthService,
    private ApiParameter: ApiParameterScript,
    private AppService: AppService,
    private Router: Router,
    private apiservice: ApiService
  ) {}

  ngOnInit(): void {
    this.imagetag = false;
    this.image = this.AppService.authProfile.user_info.user_profile_image;
    console.log(this.AppService.authProfile.user_info.user_full_name);
    console.log(this.AppService.authProfile.user_info.user_gender);
    this.id = this.AppService.authProfile.user_info.user_id;
    this.successstorybyuser = new FormGroup({
      id: new FormControl(''),
      login_name: new FormControl(''),
      partner_name: new FormControl(''),
      ring_exchange_date: new FormControl(''),
      how_we_met: new FormControl(''),
      marriage_date: new FormControl(''),
      the_proposal: new FormControl(''),
      our_edding_day: new FormControl(''),
      life_after_marriage: new FormControl(''),
      wedding_photo: new FormControl(''),
      dta: new FormControl(''),
    });
    let alldata = this.auth.getAuthStatus();
    this.successstorybyuser.patchValue({
      login_name: alldata.profile_name,
    });
    this.getAllData(alldata.profile_id);
    console.log(alldata);
  }
  getAllData(id: any) {
    var query = `select * from user_info where user_gender <> '${this.AppService.authProfile.user_info.user_gender}' `;
    this.ApiParameter.fetchDataFormQuery(query).subscribe(
      (onlineProfileRes: any) => {
        // console.log(onlineProfileRes);
        if (onlineProfileRes.success && onlineProfileRes['data'].length > 0) {
          this.relationshipStatusOptions = onlineProfileRes['data'];
        }
      }
    );

    console.log(this.relationshipStatusOptions);
  }
  fatchdata(data: any) {
    var query = `select * from success_story_by_user where '${data}' `;
    this.ApiParameter.fetchDataFormQuery(query,true,5*60*1000).subscribe(
      (onlineProfileRes: any) => {
        // console.log(onlineProfileRes);
        if (onlineProfileRes.success && onlineProfileRes['data'].length > 0) {
        }
      }
    );
  }
  handleInputChange(e: any) {
    var file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
    var pattern = /image-*/;
    var reader = new FileReader();
    if (!file.type.match(pattern)) {
      alert('invalid format');
      return;
    }
    reader.onload = this._handleReaderLoaded.bind(this);
    reader.readAsDataURL(file);
  }
  _handleReaderLoaded(e: any) {
    let reader = e.target;
    this.imageSrc = reader.result;
    this.successstorybyuser.patchValue({
      wedding_photo: this.imageSrc,
    });
    //console.log(this.successstorybyuser.value.wedding_photo)
  }

  submit() {
    let date1 = moment(this.successstorybyuser.value.marriage_date).format(
      'YYYY-MM-DD'
    );
    this.successstorybyuser.patchValue({
      marriage_date: date1,
    });
    let date2 = moment(this.successstorybyuser.value.ring_exchange_date).format(
      'YYYY-MM-DD'
    );
    this.successstorybyuser.patchValue({
      ring_exchange_date: date2,
    });
    //console.log(this.successstorybyuser.value);
    if (this.successstorybyuser.valid) {
      Swal.fire({
        title: 'Do you want to save the changes?',
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: 'Save',
        denyButtonText: `Don't save`,
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          this.apiservice
            .successStory(this.successstorybyuser.value)
            .subscribe((res: any) => {
              if (res.success) {
                Swal.fire();
              }
              Swal.fire({
                icon: 'success',
                title: 'Your work has been saved',
                showConfirmButton: true,
              }).then(() => {
                this.ngOnInit();
              });
            });
        } else if (result.isDenied) {
          Swal.fire('Changes are not saved', '', 'info');
        }
      });
    } else {
      Swal.fire('Fill All Data', '', 'info');
    }

    //   this.apiservice
    //     .successStory(this.successstorybyuser.value)
    //     .subscribe((res: any) => {
    //       if (res.success) {
    //         Swal.fire();
    //       }
    //     });
  }

  viweImage(data: any) {
    this.changeid = data;

    var query = `select * from user_info where user_id = '${data}' `;
    this.ApiParameter.fetchDataFormQuery(query).subscribe(
      (onlineProfileRes: any) => {
        // console.log(onlineProfileRes);
        if (onlineProfileRes.success && onlineProfileRes['data'].length > 0) {
          this.alldata = onlineProfileRes['data'][0];
          this.imagetag = true;
          this.successstorybyuser.patchValue({
            partner_name: onlineProfileRes['data'][0].user_full_name,
          });
          //console.log(this.alldata);
        }
      }
    );
  }
}
