import { Component, OnInit } from '@angular/core';
import { ApiParameterScript } from 'src/app/script/api-parameter';
import { AppService } from 'src/app/services/app.service';
import { chat } from './chat';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  @BlockUI() blockUI: NgBlockUI;
  total_connection: any[] = []
  filterText: any
  constructor(
    private appService: AppService,
    private apiParameterScript: ApiParameterScript
  ) { }

  ngOnInit(): void {



    var query = `SELECT
   user_info.user_fname,
   user_info.user_lname,
   user_info.user_gender,
   user_info.user_profile_image,
   user_info.user_dob,
   user_info.user_age,
   chat_connection_details.*,
   user_religion.user_religion,
   user_religion.user_caste,
   user_religion.user_subcaste,
   user_education_occupations.*,
   user_locations.*,
   user_physical_details.*
FROM
   user_info
INNER JOIN chat_connection_details ON user_info.user_id = chat_connection_details.requested_by
INNER JOIN user_religion ON user_info.user_id = user_religion.user_ID
INNER JOIN user_education_occupations ON user_info.user_id = user_education_occupations.user_ID
INNER JOIN user_locations ON user_info.user_id = user_locations.user_ID
INNER JOIN user_physical_details ON user_info.user_id = user_physical_details.user_ID
WHERE
   chat_connection_details.requested_to = '${this.appService.authStatus.profile_id}'
UNION
SELECT
   user_info.user_fname,
   user_info.user_lname,
   user_info.user_gender,
   user_info.user_profile_image,
   user_info.user_dob,
   user_info.user_age,
   chat_connection_details.*,
   user_religion.user_religion,
   user_religion.user_caste,
   user_religion.user_subcaste,
   user_education_occupations.*,
    user_locations.*,
    user_physical_details.*
FROM
   user_info
INNER JOIN chat_connection_details ON user_info.user_id = chat_connection_details.requested_to
INNER JOIN user_religion ON user_info.user_id = user_religion.user_ID
INNER JOIN user_education_occupations ON user_info.user_id = user_education_occupations.user_ID
INNER JOIN user_locations ON user_info.user_id = user_locations.user_ID
INNER JOIN user_physical_details ON user_info.user_id = user_physical_details.user_ID
WHERE
   chat_connection_details.requested_by = '${this.appService.authStatus.profile_id}';`
    this.blockUI.start("Loading...")
    console.log(query);

    this.apiParameterScript.fetchDataFormQuery(query).subscribe((res: any) => {
      console.log("chat Connection", res);
      this.blockUI.stop()
      if (res.data.length > 0) {
        this.total_connection = res['data']

      }
    })

  }

  redirectToMessage(message: any) {

  }
}
