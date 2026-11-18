import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { AppService } from 'src/app/services/app.service';

@Component({
  selector: 'app-generate-link',
  templateUrl: './generate-link.component.html',
  styleUrls: ['./generate-link.component.scss']
})
export class GenerateLinkComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  // **************************
  hide: boolean = false
  isTokenValid: boolean = true

  autorizationData: any

  imageElement: string;
  capcha: string = '';
  url_token: string = ''
  changePasswordForm = new FormGroup({
    password: <any>new FormControl('', [Validators.required]),
    confrim_password: <any>new FormControl('', [Validators.required]),
    capcha: <any>new FormControl('', [Validators.required]),
  });

  constructor(
    private router: ActivatedRoute,
    private _rout:Router,
    private auth: AuthService,
    private alert: ToastrService,
    private app: AppService
  ) { }

  ngOnInit(): void {

    this.router.params.subscribe((url: any) => {
      console.log(url);

      if (url.token && url.token != '') {
        this.url_token = url.token
        this.auth.validateResetlink(url.token).subscribe((validateRes: any) => {
          console.log(validateRes);

          if (validateRes.success) {
            this.autorizationData = validateRes.encryptedAccessData
            console.log(validateRes.encryptedAccessData);
            this.renderCaptcha()
          }

        }, (e: any) => {
          this.isTokenValid = false
        })
      }

    })


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
      ctx.fillStyle = '#000000'; // Set text color
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


  changePassword() {
    if (this.changePasswordForm.valid) {
      if (this.changePasswordForm.value.capcha == this.capcha) {


        if (this.changePasswordForm.value.password == this.changePasswordForm.value.confrim_password) {
          console.log("this.", this.changePasswordForm);
          this.blockUI.start("Please Wait..")
          this.auth.resetPassword(this.changePasswordForm.value, this.url_token).subscribe((res: any) => {
            console.log(res);
            this.blockUI.stop()
            if (res.success) {
              Swal.fire('Success', res.message, 'success').then((i: any) => {
                this.changePasswordForm.reset()

                this._rout.navigateByUrl('/')
                // this.ngOnInit()
              })
            } else {
              Swal.fire('Error', res.message, 'error').then((i: any) => {
                // this.generateResetLinkForm.reset()
              })
            }

          }, (error: any) => {
            console.log(error);
            
            this.blockUI.stop()
            this.alert.error( error['error'].message, 'Error')
          })
        } else {
          this.blockUI.stop()
          this.alert.error('Password Mismatch', 'Error')
          this.renderCaptcha()
        }

      } else {
        this.blockUI.stop()
        this.alert.error('Wrong capcha code', 'Error')
        this.renderCaptcha()
      }
    } else {
      this.blockUI.stop()
      this.alert.error('Enter All Fild', 'Error')
      this.renderCaptcha()
    }
  }
}
