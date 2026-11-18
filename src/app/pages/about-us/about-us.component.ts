import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
ApiService

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.scss']
})
export class AboutUsComponent implements OnInit {
  privacypalicy: any;

  constructor(
    private ApiService:ApiService
  ) { }

  ngOnInit(): void {
    this.getAllData();
  }

  getAllData() {
    this.privacypalicy = `
      <h2>Additional platform notes</h2>
      <p>Choice Marriage continues to improve profile tools, membership experience, search quality, and member support so that every serious marriage journey feels clearer and more confident.</p>
      <p>From free registration to advanced search and membership upgrades, our focus remains the same: authentic profiles, respectful communication, and thoughtful matchmaking for individuals and families.</p>
      <p>If you are new here, start by creating your free profile, completing your details, uploading photos, and setting partner preferences. If you need help at any step, our Contact Us team is ready to support you.</p>
    `;
    this.ApiService.aboutus({'status':25}).subscribe({
      next: (res: any) => {
        if (res.success && res.message?.[0]?.about_us_content) {
          this.privacypalicy = res.message[0].about_us_content;
        }
      },
      error: () => { }
    });
  }

}
