import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../auth.service';
import { AppService } from 'src/app/services/app.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.scss']
})
export class ForgotpasswordComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  // **************************
  imageElement: string;
  capcha: string = '';
  constructor(private alert: ToastrService,private auth:AuthService,private app:AppService) { }

  generateResetLinkForm = new FormGroup({
    userID: <any>new FormControl('', [Validators.required]),
    capcha: <any>new FormControl('', [Validators.required]),
    application_url:<any>new FormControl(this.app.application_url, [Validators.required]),
  });
  ngOnInit(): void {

    this.renderCaptcha()
  }
  email: string = '';
  submitForm() {
    // Logic to generate reset link using the provided email
    const resetLink = `https://yourwebsite.com/reset-password?email=${this.email}`;
    console.log(resetLink); // Just for demonstration, you'll redirect user to this link
    // Redirect user to resetLink
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
      ctx.fillStyle = '#FF0000'; // Set text color
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

  generatedResetLink() {

    if (this.generateResetLinkForm.valid) {
      if (this.generateResetLinkForm.value.capcha == this.capcha) {

        console.log("this.",this.generateResetLinkForm);
        this.blockUI.start("Please Wait..")
        this.auth.generateResetlink(this.generateResetLinkForm.value).subscribe((res:any)=>{
          console.log(res);
          this.blockUI.stop()
          if(res.success){
            Swal.fire('Success',res.message,'success').then((i:any)=>{
              this.generateResetLinkForm.reset()
            })
          }else{
            Swal.fire('Error',res.message,'error').then((i:any)=>{
              // this.generateResetLinkForm.reset()
            })
          }

        },(error:any)=>{
          this.blockUI.stop()
          this.alert.error('Somethings Went Wroung', 'Error')
        })

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
