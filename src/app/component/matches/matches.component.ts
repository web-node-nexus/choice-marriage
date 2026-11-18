import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ApiParameterScript } from 'src/app/script/api-parameter';
import { AppService } from 'src/app/services/app.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-matches',
  templateUrl: './matches.component.html',
  styleUrls: ['./matches.component.scss'],
})
export class MatchesComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  // **************************
  matchUserList: any[] = [];
  matchTaitel: any = '';
  constructor(
    private router: ActivatedRoute,
    private app: AppService,
    private ApiParameterScript: ApiParameterScript,
    private commonService: CommonService
  ) {}

  ngOnInit(): void {
    this.router.params.subscribe((res: any) => {
      this.blockUI.start('Loading...');
      this.ApiParameterScript.getmatches(
        { user_id: this.app.authStatus.profile_id },
        res.search_type
      ).subscribe(
        (matchData: any) => {
          // console.log("matchData", matchData);
          this.blockUI.stop();
          // this.loadingSkeltonLoader = false
          if (matchData.success && matchData['data'].length > 0) {
            // var likeProfiles = _.map(likeProfileRes['data'], "liked_profile")

            // _.map(matchData['data'], (e: any) => {
            //   e['isLiked'] = likeProfiles.includes(e.user_id)
            // })
            this.matchUserList = matchData['data'];
          } else {
            this.matchUserList = [];
          }
        },
        (eror: any) => {
          // this.loadingSkeltonLoader = false;
          this.blockUI.stop();
          this.matchUserList = [];
        }
      );

      this.app.generateApiEndPoint.next(res.search_type);

      switch (res.search_type) {
        case 'premium_matches':
          this.matchTaitel = 'Premium Recommended Matches';
          break;
        case 'byCastpremimusMatches':
          this.matchTaitel = 'Premium Recommended Matches';
          break;
        case 'byOtherCastpremimusMatches':
          this.matchTaitel = 'Premium Recommended Matches';
          break;
        case 'RecentlyJoinedMatches':
          this.matchTaitel = 'Recently Joined';
          break;
        case 'byCastRecentlyJoinedMatches':
          this.matchTaitel = 'Recently Joined';
          break;
        case 'byOtherCastRecentlyJoinedMatches':
          this.matchTaitel = 'Recently Joined';
          break;
        case 'spotlight':
          this.matchTaitel = 'Spotlight';
          break;
          case 'byOtherCastgetSpotlightdata':
          this.matchTaitel = 'Spotlight';
          break;
          case 'byCastgetSpotlightdata':
          this.matchTaitel = 'Spotlight';
          break;
        case 'getOnlinedata':
          this.matchTaitel = 'Online';
          break;
          case 'getOnlinedata':
          this.matchTaitel = 'Online';
          break;
          case 'byOtherCastgetOnlinedata':
          this.matchTaitel = 'Online';
          break;
          case 'byCastgetOnlinedata':
          this.matchTaitel = 'Online';
          break;

        default:
          this.matchTaitel = 'Recommended Matches';
          break;
      }
    });
  }

  intialtedChat(profile: any) {
    this.commonService.initiateChatConnection(profile);
  }
  hight(data:number){
    let flore = data * 0.0328084
    let inc = (data * 0.0328084 % 1) * 12;
    return Math.floor(flore)+' ft '+ Math.ceil(inc)+' in'
  }
}
