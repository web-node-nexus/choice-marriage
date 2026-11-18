import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ApiParameterScript } from 'src/app/script/api-parameter';
import { AppService } from 'src/app/services/app.service';

@Component({
  selector: 'app-payment-page',
  templateUrl: './payment-page.component.html',
  styleUrls: ['./payment-page.component.scss'],
})
export class PaymentPageComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  // **************************
  planInformation: any;
  qrcode: string = '';
  phone_no: any;
  gmail_id: any;
  whatsapp_no: any;
  name: any;
  upiid: any;
  constructor(
    private AppService: AppService,
    private ApiParameterScript: ApiParameterScript,
    private router: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.router.params.subscribe((urlData: any) => {
      this.blockUI.start('Fetching Plan Information');
      this.ApiParameterScript.fetchdata('membership_plan', {
        projection: ['*'],
        whereConditions: {
          membership_plan_id: urlData.plan_id,
          membership_plan_status: 1,
        },
      }).subscribe({
        next: (res: any) => {
          if (res.success && res['data'].length > 0) {
            this.planInformation = res['data'][0];
          }
        },
        error: () => {
          try { this.blockUI.stop(); } catch (_) { }
        },
        complete: () => {
          try { this.blockUI.stop(); } catch (_) { }
        }
      });
      this.ApiParameterScript.fetchdata('barcode', {
        projection: ['*'],
        whereConditions: { status: 1 },
      }).subscribe({
        next: (res: any) => {
          if (res.success && res['data'].length > 0) {
            this.qrcode =
              this.AppService.getFilePath() + 'barcode/' + res['data'][0].image;
            this.name = res['data'][0].name;
            this.upiid = res['data'][0].upi;
          }
        },
        error: () => { }
      });
    });
    this.phone_no = this.AppService.appConfig?.socialMediaList?.phone_no;
    this.gmail_id = this.AppService.appConfig?.socialMediaList?.gmail_id;
    this.whatsapp_no = this.AppService.appConfig?.socialMediaList?.whatsapp_no;
  }

  getDiscountPercentage() {
    // ((100-planInformation?.membership_plan_amount-planInformation?.membership_plan_dicount)/planInformation?.membership_plan_amount)*100
    var mrpPrice = this.planInformation.membership_plan_amount;
    var sellingPrice = 100 - this.planInformation.membership_plan_dicount;
    let total =  mrpPrice*sellingPrice/100
    // let percentage = (sellingPrice / mrpPrice) * 100;
    return Math.ceil(total);
  }
}
