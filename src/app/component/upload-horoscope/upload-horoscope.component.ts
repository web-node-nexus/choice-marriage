import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { AppService } from 'src/app/services/app.service';
import Swal from 'sweetalert2';
import { ApiParameterScript } from 'src/app/script/api-parameter';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-upload-horoscope',
  templateUrl: './upload-horoscope.component.html',
  styleUrls: ['./upload-horoscope.component.scss']
})
export class UploadHoroscopeComponent implements OnInit {

  uploadedImageUrl: any = [];
  file : any = environment.filePath+'horoscope/'
  constructor(
    private ApiService:ApiService,
    private appservices: AppService,
    private ApiParameterScript: ApiParameterScript,
  ) { }

  ngOnInit(): void {
    var apidata = {
      "projection": ["*"],
      "whereConditions": { "user_ID": this.appservices.authStatus.profile_id }
    }
    this.ApiParameterScript.fetchdata('use_horoscope_upload', apidata).subscribe((res:any)=>{
      if(res.success && res['data'].length > 0){
        console.log(res['data']);
        this.uploadedImageUrl = res['data'][0].ID_image
      }else{
        this.uploadedImageUrl =[];
      }
    })
  }

  selectedImage: string | ArrayBuffer | null = null;

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    const reader = new FileReader();

    if (file) {
      if (file.size >= 3 * 1024 * 1024) {
        Swal.fire('Error', 'File size exceeds 3MB limit.', 'error');
      } else if (!(file.type === 'image/jpeg' || file.type === 'image/gif' || file.type === 'image/png')) {
        Swal.fire('Error', 'Invalid file type. Please upload JPG, GIF, or PNG.', 'error');
      } else {
        reader.onload = () => {
          this.selectedImage = reader.result;
           // Log the selectedImage after it's loaded
        };
        reader.readAsDataURL(file);

      }
    }

  }

  uplode() {
    //console.log(this.selectedImage);
    let param ={
      "data": this.selectedImage,
      "user_Id" :this.appservices.authStatus.profile_id
    }
    this.ApiService.horoscopeUplode(param).subscribe((res:any)=>{
      if(res.success){
        Swal.fire({
          icon:'success',
          title:'Uplode photo',
          text: res.message
        }).then(()=>{
          this.ngOnInit();
          this.selectedImage = null;
        });
      }
    })

  }

}
