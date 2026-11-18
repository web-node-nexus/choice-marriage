import { Component, OnInit } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ApiService } from 'src/app/services/api.service';


@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.scss']
})
export class SubscriptionComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  plan: any[] = [];
  loading = false;
  loadError = false;

  constructor(
    private ApiService: ApiService
  ) { }

  ngOnInit(): void {
    this.getAllData();
  }

  getAllData() {
    this.loading = true;
    this.loadError = false;
    this.blockUI.start('Please Wait...');
    this.ApiService.getAllData().subscribe({
      next: (res: any) => {
        if (res?.success) {
          this.plan = res.message || [];
        } else {
          this.plan = [];
          this.loadError = true;
        }
      },
      error: () => {
        this.plan = [];
        this.loadError = true;
        this.finishLoading();
      },
      complete: () => {
        this.finishLoading();
      }
    });
  }

  private finishLoading() {
    this.loading = false;
    try {
      this.blockUI.stop();
    } catch (_) { }
  }

  planTone(amount: number): string {
    const value = Number(amount) || 0;
    if (value === 0) return 'free';
    if (value <= 500) return 'rose';
    if (value <= 1000) return 'teal';
    return 'ink';
  }

  retry() {
    this.getAllData();
  }
}
