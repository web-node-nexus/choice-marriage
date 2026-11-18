import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { ApiParameterScript } from 'src/app/script/api-parameter';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-success-story',
  templateUrl: './success-story.component.html',
  styleUrls: ['./success-story.component.scss'],
})
export class SuccessStoryComponent implements OnInit {
  maritalstatus: any[] = [];
  show: boolean = true;
  loading = true;
  usingFallback = false;
  url: any = environment.filePath + 'successstory/';

  private fallbackStories = [
    {
      id: 'local-1',
      login_name: 'Aarav',
      partner_name: 'Ananya',
      wedding_photo: 'assets/images/landing/cm-hero-pro.jpg',
      life_after_marriage:
        'Our families were looking for a match based on values, education, and emotional maturity. Choice Marriage helped us find each other without pressure. The first conversations were simple and honest — about career dreams, family expectations, and the kind of home we wanted to build. Over months of knowing each other, respect turned into companionship. Today, marriage for us means partnership in daily life: supporting each other’s goals, celebrating small wins, and making decisions together. We are grateful that our beginning felt calm, clear, and full of intention.',
      local_image: true,
    },
    {
      id: 'local-2',
      login_name: 'Rohan',
      partner_name: 'Meera',
      wedding_photo: 'assets/images/landing/cm-couple-walk.jpg',
      life_after_marriage:
        'We were both tired of incomplete profiles and uncertain intentions. On Choice Marriage, Meera’s profile felt complete and thoughtful, and our preferences aligned naturally. Family involvement made the journey smoother, and every step — from interest to meeting — felt respectful. After marriage, we discovered how powerful shared values can be. We communicate openly, plan our future with balance, and keep gratitude at the center of our relationship. Looking back, we realize that choosing carefully made loving deeply much easier.',
      local_image: true,
    },
    {
      id: 'local-3',
      login_name: 'Kabir',
      partner_name: 'Ishita',
      wedding_photo: 'assets/images/landing/cm-story.jpg',
      life_after_marriage:
        'Ishita and I connected through a preference-based match and quickly found comfort in each other’s honesty. We talked about family roles, finances, faith, and lifestyle before taking the next step. That clarity helped both families feel confident. Married life has been a beautiful mix of learning and laughter. We still appreciate that Choice Marriage gave us a serious space to meet — not a noisy feed, but a guided path toward forever.',
      local_image: true,
    },
    {
      id: 'local-4',
      login_name: 'Vihaan',
      partner_name: 'Saanvi',
      wedding_photo: 'assets/images/landing/cm-detail.jpg',
      life_after_marriage:
        'As a family, we wanted a platform where privacy and seriousness both mattered. Choice Marriage made the process organized: complete profiles, clear preferences, and meaningful conversations. Saanvi and Vihaan’s bond grew through patience and understanding. After marriage, they continue to build a home filled with warmth, ambition, and mutual support. Their story reminds us that the right match is less about rush and more about readiness.',
      local_image: true,
    },
    {
      id: 'local-5',
      login_name: 'Arjun',
      partner_name: 'Diya',
      wedding_photo: 'assets/images/landing/cm-couple-walk.jpg',
      life_after_marriage:
        'We lived in different cities, but our goals felt aligned from the beginning. Choice Marriage helped us discover each other through detailed preferences and genuine profile information. The distance taught us communication; marriage taught us partnership. Today we celebrate the little routines — morning calls to parents, weekend planning, and growing together through every challenge. We always tell others: complete your profile sincerely, and let the right conversation find you.',
      local_image: true,
    },
    {
      id: 'local-6',
      login_name: 'Dev',
      partner_name: 'Aisha',
      wedding_photo: 'assets/images/landing/cm-ambiance.jpg',
      life_after_marriage:
        'What we loved most was how respectful the process felt. No confusion, no pressure — just a clear journey from profile to family introduction. After marriage, life became a shared adventure of careers, traditions, travel dreams, and quiet evenings at home. Choice Marriage will always be part of our story because it helped two serious hearts meet at the right time.',
      local_image: true,
    },
  ];

  constructor(
    private auth: AuthService,
    private ApiParameter: ApiParameterScript,
    private activatedroute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedroute.params.subscribe((ress: any) => {
      if (ress.id !== undefined) {
        if (ress.id !== '') {
          this.getAllData(ress.id);
        } else {
          this.getAllData('');
        }
      } else {
        this.getAllData('');
      }
    });
  }

  getAllData(data: any) {
    this.loading = true;
    this.usingFallback = false;
    this.ApiParameter.unsecuredFatchquary('success_story_by_user', {
      projection: ['*'],
      whereConditions: { status: 1 },
    }).subscribe({
      next: (res: any) => {
        if (res.success && res['data']?.length > 0) {
          if (data == '') {
            this.maritalstatus = res['data'];
          } else {
            this.maritalstatus = res['data'].filter((ele: any) => ele.id == data);
            if (!this.maritalstatus.length) {
              this.maritalstatus = this.fallbackStories.filter((ele: any) => ele.id == data);
              this.usingFallback = !!this.maritalstatus.length;
            }
          }
        } else {
          this.applyFallback(data);
        }
      },
      error: () => this.applyFallback(data),
      complete: () => {
        this.loading = false;
      },
    });
  }

  private applyFallback(data: any) {
    this.usingFallback = true;
    if (data == '') {
      this.maritalstatus = [...this.fallbackStories];
    } else {
      this.maritalstatus = this.fallbackStories.filter((ele: any) => ele.id == data);
    }
    this.loading = false;
  }

  storyImage(item: any): string {
    if (item?.local_image) {
      return item.wedding_photo;
    }
    return this.url + item.wedding_photo;
  }
}
