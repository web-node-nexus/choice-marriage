import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiParameterScript } from 'src/app/script/api-parameter';
import { AppService } from 'src/app/services/app.service';
import  Swal  from 'sweetalert2';



@Component({
  selector: 'app-quick-search',
  templateUrl: './quick-search.component.html',
  styleUrls: ['./quick-search.component.scss'],
})
export class QuickSearchComponent implements OnInit {
  id: any;
  useris: any;
  constructor(
    private api: ApiParameterScript,
    private AppService: AppService,
    private Router:Router
  ) {}

  ngOnInit(): void {
    // console.log();
    this.useris = this.AppService.authProfile['user_info'].user_id
    // CMV9A3B8848

  }
  searchById() {

    if(this.id == this.useris){
      Swal.fire({
        text: 'Provided User ID is the same as Your User Id.',
        confirmButtonText: 'OK'
      });
    }else{

    this.api
      .fetchdata('user_info', {
        projection: ['*'],
        whereConditions: { user_id: this.id },
      })
      .subscribe((res: any) => {
        console.log(res);
        if(res.count == 0){
          Swal.fire({
            text: 'Provided User ID is Not Present In Our Record',
            confirmButtonText: 'OK'
          });
        }else{
            this.Router.navigate(['/v1/member-profile',this.id]);
        }

      });
    }
  }
}
