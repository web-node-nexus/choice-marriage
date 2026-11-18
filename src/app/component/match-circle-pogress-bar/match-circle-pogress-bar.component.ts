import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { AppService } from 'src/app/services/app.service';

@Component({
  selector: 'app-match-circle-pogress-bar',
  templateUrl: './match-circle-pogress-bar.component.html',
  styleUrls: ['./match-circle-pogress-bar.component.scss']
})
export class MatchCirclePogressBarComponent implements OnInit {

  @Input() preferenceuserid: any = ''
  profile_matches_count: any = 0
  constructor(private http: HttpClient, private AppService: AppService) { }

  ngOnInit(): void {

    

    var getmatchApiData = {

      "loginuserid": this.AppService.authStatus.profile_id,
      "preferenceuserid": this.preferenceuserid
    }

    this.http.post(this.AppService.getApipath() + 'matchPersent', JSON.stringify(getmatchApiData)).subscribe((matchRes: any) => {
      console.log("Matching Percentage",matchRes);
      
      if (matchRes.success) {
        this.profile_matches_count = matchRes.matches_Count
      } else {
        this.profile_matches_count = 0
      }

    })
  }
 
}
