import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
// import { take } from 'lodash';
import { ApiParameterScript } from 'src/app/script/api-parameter';
import { AppService } from 'src/app/services/app.service';
import { ImageCroperComponent } from 'src/app/shared/image-croper/image-croper.component';
import { take, map } from 'rxjs/operators';
import * as _ from 'lodash';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-upload-photo',
  templateUrl: './upload-photo.component.html',
  styleUrls: ['./upload-photo.component.scss'],
})
export class UploadPhotoComponent implements OnInit {
  public uploadedFile: any[] = [];
  profileimg: any;
  constructor(
    private modalService: NgbModal,
    private app: AppService,
    private api: ApiParameterScript,
    private router: Router
  ) {}

  ngOnInit(): void {
    var fetchData = {
      projection: ['*'],
      whereConditions: { user_ID: this.app.authStatus.profile_id },
    };
    this.api
      .fetchdata('user_profile_images', fetchData)
      .pipe(
        take(1),
        map((res: any) => {
          if (res.success && res['data'].length > 0) {
            _.map(res['data'], (i: any) => {
              i['user_profile_images'] =
                this.app.getFilePath() + i['user_profile_images'];
              i['user_feature_images'] =
                this.app.getFilePath() + i['user_feature_images'];
            });
          }
          return res;
        })
      )
      .subscribe((res: any) => {
        if (res.success && res['data'].length > 0) {
          this.uploadedFile = res['data'];
          console.log(this.uploadedFile);

        }
      });
    let fetchDatafatch = {
      projection: ['user_profile_image'],
      whereConditions: { user_id: this.app.authStatus.profile_id },
    };
    this.api.fetchdata('user_info', fetchDatafatch).subscribe((res: any) => {
      if (res.success && res['data'].length > 0) {
        this.profileimg = res['data'][0].user_profile_image;
        console.log(this.profileimg);
      }
    });
  }

  loadUploadComponent() {
    const modalRef = this.modalService.open(ImageCroperComponent, {
      size: 'xl',
      backdrop: false,
      scrollable: true,
    });
  }
  setAsProfilePicture(data: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to set this as your profile picture?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, do it!',
      cancelButtonText: 'No, cancel!',
    }).then((result) => {
      if (result.isConfirmed) {
        let name = data.split('/');
        let file = name[data.split('/').length - 1];
        //console.log(file);
        let updateData = {
          data: {
            user_profile_image: file,
          },
          whereConditions: {
            user_id: this.app.authStatus.profile_id,
          },
        };
        this.api.updatedata('user_info', updateData).subscribe((res: any) => {
          if (res.success) {
            Swal.fire('Success', 'Profile Picture Set', 'success').then(() => {
              this.ngOnInit();
            });
          }
        });
      }
    });
  }

  deletePhoto(id: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        // User confirmed, proceed with deletion
        var apiData: any = {
          whereConditions: { id: id },
        };
        this.api
          .deletedata('user_profile_images', apiData)
          .subscribe((res: any) => {
            if (res.success) {
              this.ngOnInit();
              Swal.fire('Deleted!', 'Your photo has been deleted.', 'success');
            }
          });
      }
    });
  }
  removeProfilePicture(data: any) {}
}
