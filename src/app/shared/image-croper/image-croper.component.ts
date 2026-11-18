import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ImageCroppedEvent, LoadedImage,ImageTransform } from 'ngx-image-cropper';
import { ApiParameterScript } from 'src/app/script/api-parameter';
import { AppService } from 'src/app/services/app.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-image-croper',
  templateUrl: './image-croper.component.html',
  styleUrls: ['./image-croper.component.scss']
})
export class ImageCroperComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  // **************************
  imageChangedEvent: any = '';
  croppedImage: any = '';
  fileSelected = false
  uploadURL: any
  crop_imgae: any

  uploadedFileDetail: any
  transform: ImageTransform = {
    translateUnit: 'px',
    scale: 1,
  };
  constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    public activeModal: NgbActiveModal,
    private appservices: AppService,
    private api: ApiParameterScript
  ) {
    this.uploadURL = `${this.appservices.getApipath()}upload?q=${this.appservices.authStatus.profile_id}`

  }

  zoomOut() {
    this.transform = {
      ...this.transform,
      scale: this.transform.scale! - .1
    };
  }

  zoomIn() {
    this.transform = {
      ...this.transform,
      scale: this.transform.scale! + .1
    };
  }
 

  fileChangeEvent(event: any): void {
    this.uploadedFileDetail = event
    console.log(event);
    this.imageChangedEvent = event;
    this.fileSelected = true
  }
  imageCropped(event: any) {
    this.croppedImage = this.sanitizer.bypassSecurityTrustUrl(event.objectUrl ? event.objectUrl : '');
    // console.log("hii",event);
    this.crop_imgae = event.blob
    // this.uploadedFileDetail=event
    // event.blob can be used to upload the cropped image
  }
  imageLoaded(image: LoadedImage) {
    // console.log("Image Loaded",image);


    // show cropper
  }
  cropperReady() {
    // cropper ready
  }
  loadImageFailed() {
    // show message
    Swal.fire("Error", "Unable To Load Images", 'error')
    this.fileSelected = false
  }
  ngOnInit(): void {
  }

  uploadFile() {
    const uploadData = new FormData();
    uploadData.append('file', this.crop_imgae);
    this.blockUI.start('Uploading ....')
    var loginInfo = this.appservices.authStatus;
    var headers = new HttpHeaders()
      // .set("Access-Control-Allow-Origin", "*")
      .set('Authorization', `Bearer ${loginInfo._refreshkey}`)
    // .set("Content-Type", "application/x-www-form-urlencoded; charset=utf-8, application/json")

    this.http.post<any>(this.uploadURL, uploadData, { headers: headers }).subscribe(
      (response: any) => {
        this.blockUI.stop()
        if (response.success) {
          Swal.fire('Success', response.message, 'success').then(() => {
            location.reload()
          })
        } else {
          Swal.fire("Error", response.message, 'error')
        }
        // console.log('Upload successful!', response);
        // Handle success response
      },
      (error: any) => {
        this.blockUI.stop()
        Swal.fire('Error occurred during file upload', '', 'error')
        // console.error('Error occurred during file upload:', error);
        // Handle error response
      }
    );


  }


  onConfirmUploadImage() {
    console.log(this.uploadedFileDetail);
    console.log("hiii", this.imageChangedEvent);

    // this.blockUI.start('Loading');
    // const httpHeaders = this.httpUtils.getHTTPHeaders();

    // const url = this.appService.getBuildPath() + '/upload';
    const formData: any = new FormData();


    if (false) {
      for (let i = 0; i < this.uploadedFileDetail.target.files.length; i++) {
        let fileDetails = this.uploadedFileDetail.target.files[i];
        const filename = fileDetails.name.substr(0, fileDetails.name.lastIndexOf('.'))
        const extension = fileDetails.name.replace(/.*\./, '').toLowerCase();
        var tempName;
        if (filename.length > 3) {
          tempName = filename + '.' + extension;
        } else {
          tempName = filename + '  .' + extension;
        }
        formData.append('uploadFiles', fileDetails, tempName);
      }
      formData.append('multiUpload', true);
    } else {
      const extension = this.uploadedFileDetail.target.files[0].name.replace(/.*\./, '').toLowerCase();
      const tempName = this.uploadedFileDetail.target.files[0].name.substr(
        0,
        this.uploadedFileDetail.target.files[0].name.lastIndexOf('.')
      ) + '  .' + extension;

      formData.append('size', ~~(this.uploadedFileDetail.target.files[0].size / 1024));
      formData.append('fileName', this.uploadedFileDetail.target.files[0].name);
      formData.append('tag', this.uploadedFileDetail.target.files[0].name);
      formData.append('file', this.uploadedFileDetail.target.files[0], tempName);
      formData.append('multiUpload', false);
    }


    console.log(formData);
    // const uploadData = new FormData();
    // uploadData.append('file', this.crop_imgae);

    this.blockUI.start('Uploading ....')
    var loginInfo = this.appservices.authStatus;
    var headers = new HttpHeaders()
      // .set("Access-Control-Allow-Origin", "*")
      .set('Authorization', `Bearer ${loginInfo._refreshkey}`)
    // .set("Content-Type", "application/x-www-form-urlencoded; charset=utf-8, application/json")

    this.http.post<any>(this.uploadURL, formData, { headers: headers }).subscribe(
      (response: any) => {
        this.blockUI.stop()
        if (response.success) {
          Swal.fire('Success', response.message, 'success').then(() => {
            location.reload()
          })
        } else {
          Swal.fire("Error", response.message, 'error')
        }
        // console.log('Upload successful!', response);
        // Handle success response
      },
      (error: any) => {
        this.blockUI.stop()
        Swal.fire('Error occurred during file upload', '', 'error')
        // console.error('Error occurred during file upload:', error);
        // Handle error response
      }
    );

  }

}
