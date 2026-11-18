import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ApiParameterScript } from 'src/app/script/api-parameter';
// import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-lockprofilealert',
  templateUrl: './lockprofilealert.component.html',
  styleUrls: ['./lockprofilealert.component.scss']
})
export class LockprofilealertComponent implements OnInit {
  admindata: any;

  constructor(
    public dialogRef: MatDialogRef<LockprofilealertComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ApiParameterScript: ApiParameterScript,
    private Router: Router
  ) { }

  ngOnInit(): void {
    this.fatchAdminData();
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
  requestKundali(){

  }
  close(): void {
    this.dialogRef.close();
  }

}
