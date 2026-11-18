import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { AppService } from 'src/app/services/app.service';
import Swal from 'sweetalert2';
import { ApiParameterScript } from 'src/app/script/api-parameter';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-upload-payment-slip',
  templateUrl: './upload-payment-slip.component.html',
  styleUrls: ['./upload-payment-slip.component.scss']
})
export class UploadPaymentSlipComponent implements OnInit {

  uploadedImageUrl: any = [];
  file : any = environment.filePath+'paymentslip/'
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
    this.ApiParameterScript.fetchdata('use_payment_slip_upload', apidata).subscribe((res:any)=>{
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
    this.ApiService.paymentSlipUplode(param).subscribe((res:any)=>{
      if(res.success){
        Swal.fire({
          icon:'success',
          title:'Uplode photo',
          text: res.message
        })
        this.ngOnInit();
        this.selectedImage=null;
      }
    })

  }

}
