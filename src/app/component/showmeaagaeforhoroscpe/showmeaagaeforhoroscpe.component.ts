import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ApiParameterScript } from 'src/app/script/api-parameter';
// import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-showmeaagaeforhoroscpe',
  templateUrl: './showmeaagaeforhoroscpe.component.html',
  styleUrls: ['./showmeaagaeforhoroscpe.component.scss'],
})
export class ShowmeaagaeforhoroscpeComponent implements OnInit {
  contact: any;
  horoscope: any;
  constructor(
    public dialogRef: MatDialogRef<ShowmeaagaeforhoroscpeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ApiParameterScript: ApiParameterScript,
    private Router: Router
  ) {}

  ngOnInit(): void {
    this.contact = this.data.contact;
    this.horoscope = this.data.horoscope
  }

  upgradePlan() {
    // Redirect to the subscription/plan page for upgrading the plan
    // window.location.href = 'subscription/plan';
    this.Router.navigate(['subscription/plan']);
    this.dialogRef.close();
  }

  goBack() {
    this.dialogRef.close();
  }
}
