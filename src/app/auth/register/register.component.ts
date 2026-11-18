import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { RegisterService } from 'src/app/services/register.service';
import Swal from 'sweetalert2';
import { AuthService } from '../auth.service';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';
import { ApiParameterScript } from 'src/app/script/api-parameter';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  // **************************
  date: Date;
  model: NgbDate;
  hide: boolean = true;
  formSubmitted = false;
  form1: FormGroup;
  form2: FormGroup;
  form3: FormGroup;

  profileID: any;
  dayOption: any[];
  months: any = [
    { value: '01', display: 'Jan' },
    { value: '02', display: 'Feb' },
    { value: '03', display: 'Mar' },
    { value: '04', display: 'Apr' },
    { value: '05', display: 'May' },
    { value: '06', display: 'Jun' },
    { value: '07', display: 'Jul' },
    { value: '08', display: 'Aug' },
    { value: '09', display: 'Sep' },
    { value: '10', display: 'Oct' },
    { value: '11', display: 'Nov' },
    { value: '12', display: 'Dec' },
  ];
  Frofilefor: any = [
    { name: 'Myself' },
    { name: 'Son' },
    { name: 'Daughter' },
    { name: 'Brother' },
    { name: 'Sister' },
    { name: 'Relative' },
    { name: 'Friend' },
  ];
  maritalOptions: any = [
    { name: 'Unmarried', value: 'Single' },
    { name: 'Divorced', value: 'Divorced' },
    { name: 'Widowed', value: 'Widowed' },
    { name: 'Separated', value: 'Separated' },
  ];
  year: any[] = Array.from({ length: 101 }, (_, index) => 1950 + index);

  countryCodes: any[] = [];
  mothertonguename: any = [];
  religionname: any = [];
  castnname: any = [];
  subcastnname: any = [];
  defultcountrycode: any = '91';
  defultcountrycodew: any = '91';
  @ViewChild('registerFormData', { static: true }) registerFormData: NgForm;
  childshowvar: boolean = false;
  termsChecked: boolean = false;
  constructor(
    private formBuilder: FormBuilder,
    private registerServices: RegisterService,
    private alert: ToastrService,
    private router: Router,
    private auth: AuthService,
    private http: HttpClient,
    private ApiParameterScript: ApiParameterScript
  ) {
    this.form1 = this.formBuilder.group({
      profileType: ['', Validators.required],
      gender: ['', [Validators.required]],
    });
    this.form2 = this.formBuilder.group({
      fname: ['', [Validators.required, Validators.pattern(/^[A-Za-z\s]+$/)]],
      lname: ['', [Validators.required, Validators.pattern(/^[A-Za-z\s]+$/)]],
      day: ['', [Validators.required, Validators.min(1), Validators.max(31)]],
      month: ['', [Validators.required, Validators.min(1), Validators.max(12)]],
      year: [
        '',
        [Validators.required, Validators.min(1900), Validators.max(2100)],
      ],
      // dob: ['', [Validators.required]],
    });
    this.form3 = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      phone: [
        '',
        [Validators.required, Validators.pattern(/^(?:\+?91)?[7869]\d{9}$/)],
      ],
      password: ['', [Validators.required, Validators.minLength(4)]],
    });
  }

  ngOnInit(): void {
    this.termsChecked = false;
    this.dayOption = Array.from({ length: 31 }, (_, i) =>
      (i + 1).toString().padStart(2, '0')
    );
    console.log(this.dayOption);
    setTimeout(() => {
      this.activeFormTab('form1');
      this.blockUI.stop();
    }, 500);
    // ,"whereConditions": { "status": 1 }
    this.ApiParameterScript.unsecuredFatchquary(
      'country',
      {
        projection: ['*'],
      },
      true,
      5 * 60 * 1000
    ).subscribe((res: any) => {
      if (res.success && res['data'].length > 0) {
        this.countryCodes = res['data'].map((item: any) => {
          return { name: item.name, dial_code: item.phonecode };
        });
      }
    });
    // this.http.get('/assets/json/CountryCodes.json').subscribe((res: any) => {
    //   console.log(res);
    //   this.countryCodes = res
    // })
    this.motherTongue();
    this.religion();
    this.Caste();

    // this.registerFormData.setValue({"countryId":'India'})
    // this.registerFormData.form.patchValue({ countryId: "91" });
  }
  profilechange(data: any) {
    if (data == 'Female') {
      this.Frofilefor = [
        { name: 'Myself' },
        { name: 'Daughter' },
        { name: 'Sister' },
        { name: 'Relative' },
        { name: 'Friend' },
      ];
    } else if (data == 'Male') {
      this.Frofilefor = [
        { name: 'Myself' },
        { name: 'Son' },
        { name: 'Brother' },
        { name: 'Relative' },
        { name: 'Friend' },
      ];
    }
  }

  back() {
    var getactiveForm = document.querySelector('.active-step');
    var activeFormArrayList = [
      {
        index: 1,
        name: 'form1',
        active: getactiveForm?.classList.contains('form1'),
      },
      {
        index: 2,
        name: 'form2',
        active: getactiveForm?.classList.contains('form2'),
      },
      {
        index: 3,
        name: 'form3',
        active: getactiveForm?.classList.contains('form3'),
      },
    ];

    // console.log("get", getactiveForm);

    activeFormArrayList.forEach((e1: any) => {
      if (e1.active && e1.name !== 'form1') {
        var deactiveForm = document.querySelector('.' + e1.name);
        var activeForm = document.querySelector('.form' + (e1.index - 1));
        deactiveForm?.classList.remove('active-step');
        activeForm?.classList.add('active-step');
      }
    });
  }

  activeFormTab(name: any) {
    var form = document.querySelector('.' + name);
    form?.classList.add('active-step');
  }

  continue() {
    // console.log("Form 1", this.form1.value);
    var form1 = document.querySelector('.form1');
    form1?.classList.remove('active-step');
    this.activeFormTab('form2');
  }

  signup() {
    this.blockUI.start('Setup Account...');
    var apiData = {
      profileType: this.form1.value.profileType,
      gender: this.form1.value.gender,
      fname: this.form2.value.fname,
      lname: this.form2.value.lname,
      dob: `${this.form2.value.year}-${this.form2.value.month}-${this.form2.value.day}`,
      email: this.form3.value.email,
      phone: `${this.form3.value.phone}`,
      password: this.form3.value.password,
      user_mother_toungh: this.form3.value.user_mother_toungh,
      url: environment.filePath + 'login',
      // "profileID":this.profileID
    };
    // console.log("Formdata", apiData);

    this.registerServices.setupuserAuthAccount(apiData).subscribe(
      (res: any) => {
        this.blockUI.stop();
        if (res.success) {
          Swal.fire('Success!', res.message, 'success').then(() => {
            var credential = {
              userID: this.form3.value.email,
              password: this.form3.value.password,
            };

            this.blockUI.start('Please Wait');
            this.auth.signIn(credential).subscribe((authRes: any) => {
              this.blockUI.stop();
              authRes = JSON.parse(atob(authRes.id));
              if (authRes.status) {
                this.auth.authentication(
                  authRes.profile_id,
                  authRes.profile_name,
                  authRes.profile_email,
                  true,
                  'LOGIN_USER',
                  authRes.token,
                  authRes.exp
                );
                this.router.navigateByUrl('/');
              } else {
                this.alert.error(res.message);
              }
            });
          });
        } else {
          this.alert.error(res.message, 'Information');
        }
        // console.log(res);
      },
      (err: any) => {
        this.blockUI.stop();
        this.alert.error(err.message, 'OPS!');
        console.log(err);
      }
    );
  }

  setProfile() {
    // console.log("Form 1", this.form2.value);
    var dob = `${this.form2.value.year}-${this.form2.value.month}-${this.form2.value.day}`;
    // console.log(dob);

    const inputDate = new Date(dob);
    const currentDate = new Date();
    const minDate = new Date(
      currentDate.getFullYear() - 18,
      currentDate.getMonth(),
      currentDate.getDate()
    );

    if (inputDate >= minDate) {
      Swal.fire('Warning', 'Please Enter DOB Greater Than 18', 'warning');
    } else {
      var form1 = document.querySelector('.form2');
      form1?.classList.remove('active-step');
      this.activeFormTab('form3');
    }

    // var apiData = {
    //   "fname": this.form3.value.fname,
    //   "lname": this.form3.value.lname,
    //   "dob": moment(this.form3.value.dob).format('YYYY-MM-DD'),
    //   "profileID":this.profileID
    // }
    // console.log(apiData);
    // this.blockUI.start("Please Wait...")
    // this.registerServices.setProfile(apiData).subscribe((res:any)=>{

    //   this.blockUI.stop();
    //   if(res.success){

    //     Swal.fire('Success!',res.message,'success').then(()=>{

    //       var credential={
    //         userID: this.form2.value.email,
    //         password: this.form2.value.password
    //       }

    //       this.blockUI.start('Please Wait')
    //       this.auth.signIn(credential).subscribe((authRes:any)=>{
    //         this.blockUI.stop()
    //         if (authRes.status) {
    //           // this.alert.success(res.message, "Done");
    //           // localStorage.setItem('loginiinfo', JSON.stringify(res))
    //           var expiration_date = new Date(new Date().getTime() + 86400 * 1000).toString();
    //           this.auth.authentication(authRes.profile_id, authRes.profile_name, authRes.profile_email, true, "LOGIN_USER", expiration_date);
    //           location.reload()
    //         } else {
    //           this.alert.error(res.message);
    //         }
    //       })
    //       this.activeModal.close();
    //     })
    //   }else{
    //     Swal.fire('OPS!',res.message,'error')
    //   }

    // })
  }
  validateDoB(formData: any) {
    var dob = `${formData.value.year}-${formData.value.month}-${formData.value.day}`;
    // console.log(dob);

    const inputDate = new Date(dob);
    const currentDate = new Date();
    const minDate = new Date(
      currentDate.getFullYear() - 18,
      currentDate.getMonth(),
      currentDate.getDate()
    );

    if (inputDate >= minDate) {
      Swal.fire('Warning', 'Please Enter DOB Greater Than 18', 'warning');
      return false;
    } else {
      return true;
    }
  }
  showchildpart(data: any) {
    let takendata = data.target.value;
    let mstaus = ['Married', 'Divorced', 'Widowed', 'Separated'];
    if (mstaus.includes(takendata)) {
      this.childshowvar = true;
    } else {
      this.childshowvar = false;
    }
  }

  onSubmit(formData: any) {
    this.blockUI.start('Setup Account...');
    this.formSubmitted = true;
    var apiData = {
      profileType: formData.value.profileType,
      gender: formData.value.gender,
      fname: formData.value.fname,
      lname: formData.value.lname,
      dob: `${formData.value.year}-${formData.value.month}-${formData.value.day}`,
      email: formData.value.email,
      phone: `${formData.value.phone}`,
      password: formData.value.password,
      user_mother_toungh: formData.value.user_mother_toungh,
      user_marital_status: formData.value.usermaritalstatus,
      user_religion: formData.value.religionId,
      user_caste: formData.value.casteId,
      user_subcaste: formData.value.SubCaste,
      url: environment.filePath + 'login',
      ccode: this.defultcountrycode,
      wccode: this.defultcountrycodew,
      wno: formData.value.WhatsApp,
      userchild: formData.value.userchildstates,
      // "profileID":this.profileID
    };
    // console.log('Formdata', apiData);
    // console.log(formData.value.terms);
    if (formData.valid) {
      if (this.validateDoB(formData)) {
        if (!this.termsChecked) {
          this.blockUI.stop();
          this.alert.error('Please Accept Terms and Conditions', 'Error');
        } else {
          this.registerServices.setupuserAuthAccount(apiData).subscribe(
            (res: any) => {
              this.blockUI.stop();
              if (res.success) {
                Swal.fire('Success!', res.message, 'success').then(() => {
                  var credential = {
                    userID: formData.value.email,
                    password: formData.value.password,
                    login_date_time: moment().toISOString(),
                  };
                  this.blockUI.start('Please Wait');
                  this.auth.signIn(credential).subscribe((authRes: any) => {
                    this.blockUI.stop();
                    // authRes = JSON.parse(atob(authRes.id));
                    if (authRes.status) {
                      // var expiration_date = new Date(new Date().getTime() + 86400 * 1000).toString();
                      this.auth.authentication(
                        authRes.profile_id,
                        authRes.profile_name,
                        authRes.profile_email,
                        true,
                        'LOGIN_USER',
                        authRes.token,
                        authRes.exp
                      );
                      // // this.router.navigateByUrl('/')
                      location.href = '/';
                      // location.reload()
                    } else {
                      this.alert.error(res.message);
                    }
                  });
                });
              } else {
                this.alert.error(res.message, 'Information');
              }
              // console.log(res);
            },
            (err: any) => {
              this.blockUI.stop();
              this.alert.error(err.message, 'OPS!');
              console.log(err);
            }
          );
        }
      } else {
        this.blockUI.stop();
        Swal.fire('Warning', 'Please Enter DOB Greater Than 18', 'warning');
      }
    } else {
      this.blockUI.stop();
      window.scroll({
        top: 0,
        left: 0,
        behavior: 'smooth',
      });
      this.alert.error('Please Enter All Required Fields', 'Error');
      //Swal.fire('Warning', 'Please Enter All Required Fields', 'warning');
    }
  }
  change(data: any) {
    if (data.checked) {
      this.termsChecked = true;
    } else {
      this.termsChecked = false;
    }
  }

  motherTongue() {
    this.ApiParameterScript.unsecuredFatchquary(
      'mother_tongue',
      {
        projection: ['*'],
        whereConditions: { status: 1 },
      },
      true,
      5 * 60 * 1000
    ).subscribe((res: any) => {
      if (res.success && res['data'].length > 0) {
        this.mothertonguename = res['data'].map((item: any) => {
          return { name: item.mother_tongue_name };
        });
      }
    });
  }
  religion() {
    this.ApiParameterScript.unsecuredFatchquary(
      'religion',
      {
        projection: ['*'],
        whereConditions: { status: 1 },
      },
      true,
      5 * 60 * 1000
    ).subscribe((res: any) => {
      if (res.success && res['data'].length > 0) {
        this.religionname = res['data'].map((item: any) => {
          return { name: item.religion_name };
        });
      }
    });
  }
  Caste() {
    this.ApiParameterScript.unsecuredFatchquary(
      'cast_table',
      {
        projection: ['*'],
        whereConditions: { status: 1 },
      },
      true,
      5 * 60 * 1000
    ).subscribe((res: any) => {
      if (res.success && res['data'].length > 0) {
        this.castnname = res['data'].map((item: any) => {
          return { name: item.cast_name };
        });
      }
    });
  }
  subCastFilter(data: any) {
    this.ApiParameterScript.unsecuredFatchquary(
      'sub_cast',
      {
        projection: ['*'],
        whereConditions: { status: 1, cast_name: data },
      },
      true,
      5 * 60 * 1000
    ).subscribe((res: any) => {
      if (res.success && res['data'].length > 0) {
        this.subcastnname = res['data'].map((item: any) => {
          return { name: item.sub_cast_name };
        });
      }
    });
  }
}
