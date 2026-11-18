import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbDate } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/auth/auth.service';
import { RegisterService } from 'src/app/services/register.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  // **************************
  date: Date;
  model: NgbDate;
  hide: boolean = true;

  form1: FormGroup;
  form2: FormGroup;
  form3: FormGroup;

  profileID: any;

  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private registerServices: RegisterService,
    private alert: ToastrService,
    private router: Router,
    private auth: AuthService
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
      year: ['', [Validators.required, Validators.min(1900), Validators.max(2100)]]
      // dob: ['', [Validators.required]],
    });
    this.form3 = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required,Validators.pattern(/^(?:\+?91)?[789]\d{9}$/)]],
      password: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {

    setTimeout(() => {
      this.activeFormTab('form1');
      this.blockUI.stop()
    }, 500);


  }

  back() {
    var getactiveForm = document.querySelector('.active-step');
    var activeFormArrayList = [
      {
        "index": 1,
        "name": 'form1',
        'active': getactiveForm?.classList.contains('form1'),
      },
      {
        "index": 2,
        "name": 'form2',
        'active': getactiveForm?.classList.contains('form2'),
      },
      {
        "index": 3,
        "name": 'form3',
        'active': getactiveForm?.classList.contains('form3'),
      }

    ]

    console.log("get",getactiveForm);
    
    activeFormArrayList.forEach((e1: any) => {
      if (e1.active && e1.name !== 'form1') {
        var deactiveForm = document.querySelector('.' + e1.name);
        var activeForm = document.querySelector('.form' + (e1.index - 1));
        deactiveForm?.classList.remove('active-step');
        activeForm?.classList.add('active-step');
      }
    })

  }

  activeFormTab(name: any) {

    var form = document.querySelector('.' + name);
    form?.classList.add('active-step');

  }

  continue() {

    console.log("Form 1", this.form1.value);
    var form1 = document.querySelector('.form1');
    form1?.classList.remove('active-step')
    this.activeFormTab('form2')



  }

  signup() {

    this.blockUI.start('Setup Account...')
    var apiData = {
      "profileType": this.form1.value.profileType,
      "gender": this.form1.value.gender,
      "fname": this.form2.value.fname,
      "lname": this.form2.value.lname,
      "dob": `${this.form2.value.year}-${this.form2.value.month}-${this.form2.value.day}`,
      "email": this.form3.value.email,
      "phone": `${this.form3.value.phone}`,
      "password": this.form3.value.password
      // "profileID":this.profileID


    }
    console.log("Formdata", apiData);

    this.registerServices.setupuserAuthAccount(apiData).subscribe(
      (res: any) => {
        this.blockUI.stop();
        if (res.success) {

          // this.profileID = res.profileID;



          Swal.fire('Success!', res.message, 'success').then(() => {

            var credential = {
              userID: this.form3.value.email,
              password: this.form3.value.password
            }

           // this.blockUI.start('Please Wait')
            this.auth.signIn(credential).subscribe((authRes: any) => {
              this.blockUI.stop()
              authRes = JSON.parse(atob(authRes.id));
              if (authRes.status) {
                var expiration_date = new Date(new Date().getTime() + 86400 * 1000).toString();
                this.auth.authentication(authRes.profile_id, authRes.profile_name, authRes.profile_email, true, "LOGIN_USER",  authRes.token, authRes.exp);
                location.reload()
              } else {
                this.alert.error(res.message);
              }
            })
            this.activeModal.close();

          })
          // this.alert.success(res.message,'Congratulations')
          // var form2 = document.querySelector('.form2');
          // form2?.classList.remove('active-step')      
          // this.activeFormTab('form3')

        } else {
          this.alert.error(res.message, 'Information')
          // this.activeModal.dismiss()
          // this.router.navigateByUrl('auth/login')


        }
        console.log(res);

      }, (err: any) => {
        this.blockUI.stop()
        this.alert.error(err.message, 'OPS!')
        console.log(err);

      })

  }

  setProfile() {

    // console.log("Form 1", this.form1.value);
    // var form1 = document.querySelector('.form2');
    // form1?.classList.remove('active-step')
    // this.activeFormTab('form3')

    var dob = `${this.form2.value.year}-${this.form2.value.month}-${this.form2.value.day}`
    console.log(dob);


    const inputDate = new Date(dob);
    const currentDate = new Date();
    const minDate = new Date(currentDate.getFullYear() - 18, currentDate.getMonth(), currentDate.getDate());

    if (inputDate >= minDate) {
      Swal.fire("Warning",'Please Enter DOB Greater Than 18','warning')

    } else {

      var form1 = document.querySelector('.form2');
      form1?.classList.remove('active-step')
      this.activeFormTab('form3')
    }

  }

}
