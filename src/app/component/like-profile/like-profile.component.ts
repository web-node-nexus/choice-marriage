import { Component, OnInit } from '@angular/core';
import { map, take } from 'rxjs';
import { ApiParameterScript } from 'src/app/script/api-parameter';
import { AppService } from 'src/app/services/app.service';

@Component({
  selector: 'app-like-profile',
  templateUrl: './like-profile.component.html',
  styleUrls: ['./like-profile.component.scss'],
})
export class LikeProfileComponent implements OnInit {
  LikeProfileList: any[] = [];
  imageURL: any;
  constructor(private app: AppService, private api: ApiParameterScript) {}

  ngOnInit(): void {
    var query = `SELECT user_like.*, user_info.user_fname, user_info.user_lname, user_info.user_full_name, user_info.user_id, user_info.user_profile_image FROM user_like INNER JOIN user_info ON user_info.user_id = user_like.liked_profile WHERE user_like.liked_by_profile_id = '${this.app.authStatus.profile_id}'`;

    // this.api.fetchdata('user_like', { "projection": ["liked_profile"], "whereConditions": { liked_by_profile_id: this.app.authStatus.profile_id, isLiked: 1 } }).subscribe((likeProfileRes: any) => {

    this.api
      .fetchDataFormQuery(query)
      .pipe(
        map((response: any) => {
          // Check if the "data" property exists and is an array
          if (response && response.data && Array.isArray(response.data)) {
            // Modify each user object by adding a timestamp property
            const modifiedData = response.data.map((user: any) => {
              return {
                ...user,
                profileImageUrl:
                  this.app.getFilePath() + user.user_profile_image,
                profile_full_name: user.user_fname + ' ' + user.user_lname,
                isLiked: user.isLiked ? true : false,
              };
            });

            // Return the modified response object
            return { ...response, data: modifiedData };
          }
          // Return the original response if the structure is not as expected
          return response;
        })
      )
      .subscribe((likeProfileRes: any) => {
        console.log(likeProfileRes);
        if (likeProfileRes.success && likeProfileRes['data'].length > 0) {
          this.LikeProfileList = likeProfileRes['data'];
        }
      });
  }
}
