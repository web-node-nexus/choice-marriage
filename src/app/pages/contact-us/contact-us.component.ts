import { Component, OnInit } from '@angular/core';
import { ApiParameterScript } from 'src/app/script/api-parameter';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { ApiService } from 'src/app/services/api.service';
import * as moment from 'moment';


@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss'],
})
export class ContactUsComponent implements OnInit {
  contactForm: FormGroup;
  contactUsData: any;
  imageElement: any;
  capcha: any;
  private fallbackContactHtml = `
    <div class="cm-contact-fallback">
      <p><strong>Choice Marriage Support Desk</strong></p>
      <p>We are here to help with profile setup, photo uploads, partner preferences, membership questions, payment confirmation, privacy settings, login issues, and general account guidance.</p>
      <p>Whether you are creating a profile for the first time or already speaking with matches, our team is available to make your journey smoother and clearer.</p>
      <p><strong>Email:</strong> support@choicemarriage.com</p>
      <p><strong>Phone / WhatsApp support:</strong> +91 98765 43210</p>
      <p><strong>Support hours:</strong> Monday to Saturday, 10:00 AM – 7:00 PM IST</p>
      <p><strong>Average response goal:</strong> within 1 business day for most queries</p>
      <p><strong>Helpdesk:</strong> Choice Marriage Member Support, India</p>
      <hr />
      <p><strong>What you can contact us for</strong></p>
      <ul>
        <li>Help completing or editing your profile</li>
        <li>Membership plan explanation and upgrade guidance</li>
        <li>Payment slip / payment confirmation questions</li>
        <li>Login, password, and account access support</li>
        <li>Privacy, photo visibility, and communication concerns</li>
        <li>Reporting suspicious or disrespectful behavior</li>
        <li>Feedback to improve Choice Marriage</li>
      </ul>
      <p><strong>For faster resolution, please share:</strong> registered email, profile ID, and a short description of your issue.</p>
      <p>You can also use the Enquiry / Feedback form on this page to send us a detailed message directly.</p>
    </div>
  `;
  constructor(
    private ApiParameter: ApiParameterScript,
    private fb: FormBuilder,
    private ApiService: ApiService
  ) {}

  ngOnInit(): void {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      country_code: ['+91'],
      phone: [
        '',
        [
          Validators.required,
          Validators.minLength(7),
          Validators.maxLength(13),
        ],
      ],
      subject: ['', Validators.required],
      description: ['', Validators.required],
      code_captcha: ['', Validators.required],
    });
    this.renderCaptcha();
    this.contactUsData = this.fallbackContactHtml;
    this.ApiParameter.unsecuredFatchquary('contactus', { projection: ['*'] }).subscribe({
      next: (res: any) => {
        if (res.success && res['data']?.[0]?.contact_us_content) {
          this.contactUsData = res['data'][0].contact_us_content;
        }
      },
      error: () => {
        this.contactUsData = this.fallbackContactHtml;
      }
    });
  }
  // ngAfterViewInit() {
  //   this.convertTextToImage(); // Call convertTextToImage() after the page loads
  // }
  generateRandomString(length: number): string {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
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
      canvas.width = 200;
      canvas.height = 50;

      // Render text onto canvas
      ctx.fillStyle = '#FFFFFF'; // Set text color
      ctx.fillRect(0, 0, canvas.width, canvas.height); // Fill canvas with background color
      ctx.font = '30px Arial'; // Set font size and style
      ctx.fillStyle = '#000000'; // Set text color
      ctx.fillText(captchaText, 10, 40); // Render text at position (10, 40)

      // Convert canvas to data URL
      this.imageElement = canvas.toDataURL();
      // console.log(imageDataUrl); // Output the data URL to the console

      // // Display the CAPTCHA image to the user
      // const captchaImage = new Image();
      // captchaImage.src = imageDataUrl;
      // document.body.appendChild(captchaImage); // Append the image to the DOM
    } else {
      console.error('Canvas context is null.');
    }
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

  submitFb() {
    if (this.capcha == this.contactForm.value.code_captcha) {
      let api = {
        Name: this.contactForm.value.name,
        Email: this.contactForm.value.email,
        Contac_No:
          this.contactForm.value.country_code + this.contactForm.value.phone,
        Subject: this.contactForm.value.subject,
        Feedback: this.contactForm.value.description,
        ticket_no:'CM'+this.generateRandomStringForToken(4)+this.generateRandomDigits(4),
        created_At: moment().format('YYYY-MM-DD HH:mm:ss')
      };

      this.ApiService.feedback(api).subscribe((res: any) => {
        if (res.success) {
          Swal.fire({
            icon: 'success',
            title: 'Feedback Submitted Successfully!',
            text: 'Admin will contact you shortly.',
          }).then(() => {
            this.contactForm = this.fb.group({
              name: ['', Validators.required],
              email: ['', [Validators.required, Validators.email]],
              country_code: ['+91'],
              phone: [
                '',
                [
                  Validators.required,
                  Validators.minLength(7),
                  Validators.maxLength(13),
                ],
              ],
              subject: ['', Validators.required],
              description: ['', Validators.required],
              code_captcha: ['', Validators.required],
            });
            this.renderCaptcha();
          });
        }
      });
    } else {
      this.renderCaptcha();
    }
  }
}
