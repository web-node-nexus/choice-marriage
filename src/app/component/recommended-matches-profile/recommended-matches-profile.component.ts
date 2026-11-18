
import { Component, Input, OnInit, Output } from '@angular/core';
import * as _ from 'lodash';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ApiParameterScript } from 'src/app/script/api-parameter';
import { AppService } from 'src/app/services/app.service';
import Party from 'party-js';
import { CommonService } from 'src/app/services/common.service';
import { SharedDataService } from 'src/app/shared/shared-data-service.service';

@Component({
  selector: 'app-recommended-matches-profile',
  templateUrl: './recommended-matches-profile.component.html',
  styleUrls: ['./recommended-matches-profile.component.scss']
})
export class RecommendedMatchesProfileComponent implements OnInit {

  @BlockUI() blockUI: NgBlockUI;
  @Input() sectionNameRequired: boolean = true
  @Input() sectionName: String = "Recommended Matches For You"
  // @Input() sectionCategory: String = "Vegetable"
  @Input() matchUserList: any[] = [];
  @Input() loadingSkeltonLoader: boolean = true;
  @Input() imageURL: string = "https://choicemarriage.com/"
  @Input() nodataVisible: boolean = false
  @Input() link: any = '';
  @Output() count:number = 0;
  @Input() query: string = 'select'
  @Input() apiName: string = ''
  @Input() requiredApiCall: boolean = true
  @Input() sideScollView: boolean = true
  visible: boolean = false;
  imgURL: string = "https://choicemarriage.com/"
  constructor(
    private ApiParameterScript: ApiParameterScript,
    private AppService: AppService,
    private commonService: CommonService,
    private SharedDataService: SharedDataService
  ) {
    this.imgURL = this.AppService.getFilePath()
  }

  ngOnInit(): void {
    if (this.requiredApiCall) {
      this.getDynamicApiCallForFetchData()
    } else {
      this.loadingSkeltonLoader = false
    }
  }

  like(data: any, index: number) {
    // this.blockUI.start("Please Wait...")
    data['isLiked'] = data['isLiked'] ? false : true;
    this.matchUserList[index] = data;
    var like = document.getElementById(`profile_animation_id_${index}`);
    if (like != null && data['isLiked']) {
      Party.confetti(like, {
        // Specify further (optional) configuration here.
        count: Party.variation.range(10, 50),
        spread: 10,
        size: Party.variation.range(0.6, 1.4),
      });
    }
    this.matchUserList[index] = data;
    this.commonService.likeDislikeProfile(data)
  }


  getDynamicApiCallForFetchData() {
    //console.log('lllll');

    this.AppService.generateApiEndPoint.subscribe((apiendpoint: string) => {
      this.loadingSkeltonLoader = true
      this.matchUserList = []
      this.apiName = this.apiName == '' ? apiendpoint : this.apiName
     // this.ApiParameterScript.fetchdata('user_like', { "projection": ["liked_profile"], "whereConditions": { liked_by_profile_id: this.AppService.authStatus.profile_id, isLiked: 1 } }).subscribe((likeProfileRes: any) => {
        this.ApiParameterScript.getmatches({ user_id: this.AppService.authStatus.profile_id }, this.apiName).subscribe(
          (matchData: any) => {
            let count:any =[]
            this.loadingSkeltonLoader = false
            if (matchData.success && matchData['data'].length > 0) {

             // var likeProfiles = _.map(likeProfileRes['data'], "liked_profile")


              // _.map(matchData['data'], (e: any) => {
              //   e['isLiked'] = likeProfiles.includes(e.user_id)
              // })
              this.matchUserList = matchData['data'];
              console.log(this.matchUserList);

            } else {
              this.matchUserList = []
            }
          }, (eror: any) => {
            this.loadingSkeltonLoader = false;
            this.matchUserList = []
          }
        )
      })
    //})
  }

  hight(data:number){
    let flore = data * 0.0328084
    let inc = (data * 0.0328084 % 1) * 12;
    return Math.floor(flore)+' ft '+ Math.ceil(inc)+' in'
  }

}
