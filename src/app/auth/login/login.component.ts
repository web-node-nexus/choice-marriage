import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { AuthService } from '../auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { PlanService } from 'src/app/services/plan.service';

const SecureStorage = require('secure-web-storage');
import * as CryptoJS from 'crypto-js';
import * as moment from 'moment';
import { ApiService } from 'src/app/services/api.service';
import Swal from 'sweetalert2';
import { ApiParameterScript } from 'src/app/script/api-parameter';
var SECRET_KEY = '1E99412323A4ED2WAYWALASECRET_KEY';

var secureCryptoStorage = new SecureStorage(localStorage, {
  hash: function hash(key: any) {
    // key = CryptoJS.SHA256(key, SECRET_KEY);
    key = CryptoJS.SHA256(key, [SECRET_KEY]);
    return key.toString();
  },
  encrypt: function encrypt(data: any) {
    data = CryptoJS.AES.encrypt(data, SECRET_KEY);
    data = data.toString();
    return data;
  },
  decrypt: function decrypt(data: any) {
    data = CryptoJS.AES.decrypt(data, SECRET_KEY);
    data = data.toString(CryptoJS.enc.Utf8);
    return data;
  },
});

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  // **************************
  hide: boolean = true;
  focus: any;
  focus1: any;
  capcha: string = '';
  loginForm = new FormGroup({
    userID: <any>new FormControl('', [Validators.required]),
    password: <any>new FormControl('', [Validators.required]),
    capcha: <any>new FormControl('', [Validators.required]),
  });
  redirectUrl: any;

  imageElement: string;
  constructor(
    private auth: AuthService,
    private router: Router,
    private activeRouter: ActivatedRoute,
    private alert: ToastrService,
    private ApiParameterScript:ApiParameterScript
  ) {}
  SECRET_KEY: any = '1E99412323A4ED2WAYWALASECRET_KEY';
  ngOnInit(): void {
    this.renderCaptcha();
    this.redirectUrl =
      this.activeRouter.snapshot.queryParamMap.get('redirectUrl') || '/';
  }

  login() {
    //this.blockUI.start('Please wait');

    if (this.loginForm.valid) {
      if (this.loginForm.value.capcha == this.capcha) {
        var loginData: any = this.loginForm.value;
        loginData['login_date_time'] = moment().toISOString();
        this.auth.signIn(loginData).subscribe(
          (authRes: any) => {
            localStorage.setItem('id',this.loginForm.value.userID)
            // let authRes = JSON.parse(atob(res.id));
            // console.log(authRes.id);
            // debugger;

            if (authRes.status) {
                var date = moment.utc().format('YYYY-MM-DD HH:mm:ss');
                var localTime: any = moment.utc(date).toDate();
                localTime = moment().format('YYYY-MM-DD HH:mm:ss');


               //debugger;
              // localStorage.setItem('loginiinfo', JSON.stringify(res))
              // this.PlanService.fetchPlanInfo(res.profile_id).subscribe((plan: any) => {
              //   this.blockUI.stop()
              //   this.alert.success(res.message, "Done");
              //   this.PlanService.plan.next(plan)
              //   secureCryptoStorage.setItem("planInfo", plan);
              // var expiration_date = new Date(new Date().getTime() + 86400 * 1000).toString();
              this.auth.authentication(
                authRes.profile_id,
                authRes.profile_name,
                authRes.profile_email,
                true,
                'LOGIN_USER',
                authRes.token,
                authRes.exp
              );
              //location.href = this.redirectUrl;
              // })
              let logindata = {
                "data": {
                  'user_id': authRes.id,
                  'login_date_time': localTime,
                  'current_login_states': 1
                }
              }
              this.ApiParameterScript.savedata('login_activity', logindata).subscribe((res: any) => {});
            } else {
              this.blockUI.stop();
              this.alert.error(authRes.message);
              this.renderCaptcha();
              this.loginForm.patchValue({
                capcha:'',
              })
            }
          },
          (err: any) => {
            this.loginForm.patchValue({
              capcha:'',
            })
            this.blockUI.stop();
            this.alert.error('error', 'Error');
            this.renderCaptcha();

          }
        );
      } else {
        this.blockUI.stop();
        this.loginForm.patchValue({
          capcha: '',
        })
        this.alert.error('Wrong capcha code', 'Error');
        this.renderCaptcha();
      }
    } else {
      this.blockUI.stop();
      this.loginForm.patchValue({
        capcha: '',
      })
      this.alert.error('Enter All Fild', 'Error');
      this.renderCaptcha();
    }
  }

  generateRandomString(length: number): string {
    const characters = '0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    this.capcha = result;
    return result;
  }

  renderCaptcha(): void {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (ctx) {
      const captchaText = this.generateRandomString(6); // Generate a 6-character random string

      // Set canvas dimensions
      canvas.width = 120; // Adjust the width as needed to fit the container
      canvas.height = 40; // Adjust the height as needed to fit the container

      // Render text onto canvas
      ctx.fillStyle = '#FFFFFF'; // Set background color
      ctx.fillRect(0, 0, canvas.width, canvas.height); // Fill canvas with background color
      ctx.font = 'bold 12px Arial'; // Set font size and style
      ctx.fillStyle = '#d10a11'; // Set text color
      ctx.textAlign = 'center'; // Align text horizontally to center
      ctx.textBaseline = 'middle'; // Align text vertically to middle
      ctx.fillText(captchaText, canvas.width / 2, canvas.height / 2); // Render text at the center of canvas

      // Convert canvas to data URL
      const imageDataUrl = canvas.toDataURL();

      // Set the imageElement property with the data URL
      this.imageElement = imageDataUrl;
    } else {
      console.error('Canvas context is null.');
    }
  }

  showemailpopef() {
    Swal.fire({
      html: `
        <p style="color: red;">phone number, email, or user ID:</p>
        <input type="text" id="swal-input1" class="swal2-input" placeholder="Enter here" />
      `,
      showCancelButton: true,
      confirmButtonText: 'Submit',
      allowOutsideClick: false,
      preConfirm: () => {
        const inputElement:any = document.getElementById('swal-input1');
        if (inputElement) {
          const inputValue = inputElement.value;
          if (!inputValue.trim()) {
            Swal.showValidationMessage('You need to enter something!');
          }
          return { inputValue: inputValue.trim() };
        } else {
          Swal.showValidationMessage('Input field not found!');
          return { inputValue: null };
        }
      }
    }).then((result:any) => {
      if (result.isConfirmed) {
        const inputValue = result.value.inputValue;
        Swal.fire(`You entered: ${inputValue}`);
      }
    });
  }
}
