import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiParameterScript } from 'src/app/script/api-parameter';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-showkundali',
  templateUrl: './showkundali.component.html',
  styleUrls: ['./showkundali.component.scss'],
})
export class ShowkundaliComponent implements OnInit {
  imagecontener: any[] = [];
  admindata: any;
  showadmindata : any = false;
  filepath :any = environment.filePath+'horoscope/';
  constructor(
    public dialogRef: MatDialogRef<ShowkundaliComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ApiParameterScript: ApiParameterScript
  ) {}

  ngOnInit(): void {
    this.fatchImage();
    this.fatchAdminData();
  }



  fatchImage() {
    var query = `SELECT ID_image FROM use_horoscope_upload WHERE user_ID = '${this.data.id}' AND status = 1`;
    this.ApiParameterScript.fetchDataFormQuery(query).subscribe((res: any) => {
      console.log(res);

      if (res.status && res['data'].length > 0) {
          this.imagecontener = res['data'];
      }else{
        this.imagecontener = [];
        this.showadmindata = true;
      }
      console.log(this.imagecontener);

    });
  }
  fatchAdminData(){
    var query = `SELECT * FROM social_media_links WHERE id = 1`;
    this.ApiParameterScript.fetchDataFormQuery(query).subscribe((res: any) => {
      if (res.status && res['data'].length > 0 ) {
        this.admindata = res['data'][0];
      }
      console.log(this.admindata);

    });
  }
  requestKundali() {
    // Logic to send a request to the admin
    // This could involve opening a modal, sending an email, making an HTTP request, etc.
  }

  close(): void {
    this.dialogRef.close();
  }
}
