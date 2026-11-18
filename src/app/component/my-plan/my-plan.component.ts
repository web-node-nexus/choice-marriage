import { Component, OnInit } from '@angular/core';
import { PlanService } from 'src/app/services/plan.service';
import { ApiParameterScript } from 'src/app/script/api-parameter';
import { AppService } from 'src/app/services/app.service';
PlanService

@Component({
  selector: 'app-my-plan',
  templateUrl: './my-plan.component.html',
  styleUrls: ['./my-plan.component.scss']
})
export class MyPlanComponent implements OnInit {
  panelOpenState = false;
  plan: any;
  planRemaingFeature: any
  Object: any = Object;
  keyMapping: any = {
    "membership_plan_default": "Membership Plan Amount",
    "membership_plan_id": "Membership ID",
    "membership_plan_type": "Membership Type",
    "membership_plan_amount": "Amount",
    "membership_plan_visibility": "Visibility",
    "membership_plan_validity_date": "Membership Vlidity Data",
    "membership_plan_no_of_photo": "Membership Photo ",
    "membership_plan_of_send_message": "Membership Send Message",
    "membership_plan_no_of_horscope": "Membership Horscope",
    "membership_plan_no_of_contact": "Membership Contact",
    "membership_plan_created_date_time": "Membership Start Date",
    "membership_plan_updated_date_time": "Membership Update Date",
    "membership_plan_status": "Membership Status",
    "membership_plan_dicount": "Membership Discount",
    "membership_plan_show_contact_number_other": "Membership Contact View",
    "membership_plan_name": "Membership Name",
    "membership_plan_currency": "Membership Currency",
    "membership_plan_chating": "Membership Chating",


  };
  planRemaingFeaturefrom: any;
  planhistorydata: any;
  daysLeft: number;
  constructor(
    private planservice: PlanService,
    private ApiParameterScript: ApiParameterScript,
    private appService: AppService
  ) { }

  ngOnInit(): void {
    this.getAllplan();
    this.getAllplanFrom();
    this.getactiveplan();
  }
  getAllplan() {
    this.plan = this.planservice.getPlanInfo;
    console.log(this.plan);
    
    // 

    let param = {
      "projection": ['*'],
      "whereConditions": { "user_id": this.appService.authStatus.profile_id }
    }
    this.ApiParameterScript.fetchdata('edited_plan_details', param).subscribe((getprofile_res: any) => {


      if (getprofile_res.success && getprofile_res['data'].length > 0) {
        this.planRemaingFeature = getprofile_res['data'][0];
        // console.log(this.planRemaingFeature);

      }
    })
  }
  getAllplanFrom() {
    this.plan = this.planservice.getPlanInfo;
    // 

    let param = {
      "projection": ['*'],
      "whereConditions": { "user_id": this.appService.authStatus.profile_id }
    }
    this.ApiParameterScript.fetchdata('plan_details', param).subscribe((getprofile_res: any) => {


      if (getprofile_res.success && getprofile_res['data'].length > 0) {
        this.planRemaingFeaturefrom = getprofile_res['data'][0];
        // console.log(this.planRemaingFeaturefrom);

      }
    })
  }

  getactiveplan() {
    let query = `SELECT A.*,B.* FROM user_plan_deatils as A join membership_plan AS B 
           ON A.user_plan_id = B.membership_plan_id WHERE 
             A.active_status = 1 AND A.user_id = '${this.appService.authStatus.profile_id}'; `
    this.ApiParameterScript.fetchDataFormQuery(query).subscribe((res: any) => {
      if (res.success && res['data'].length > 0) {
        this.planhistorydata = res['data'][0];
        console.log("planhistorydata",this.planhistorydata);

        // Convert target date string to JavaScript Date object
        const targetDate: Date = new Date(this.planhistorydata.plan_ending_date);

        // Get today's date
        const today: Date = new Date();

        // Calculate the difference in milliseconds
        const differenceMs: number = targetDate.getTime() - today.getTime();

        // Convert milliseconds to days
         this.daysLeft = Math.ceil(differenceMs / (1000 * 60 * 60 * 24));

      //  console.log(`Days left: ${daysLeft}`);

      }
    });
  }

}
