import {
  AfterViewChecked,
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';
import * as moment from 'moment';
import * as _ from 'lodash';
import { ApiParameterScript } from 'src/app/script/api-parameter';
import { AppService } from 'src/app/services/app.service';
import Swal from 'sweetalert2';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ImageCroperComponent } from 'src/app/shared/image-croper/image-croper.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ImageCroppedEvent, LoadedImage } from 'ngx-image-cropper';
import { DomSanitizer } from '@angular/platform-browser';
import { forkJoin, Observable, Subject } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { MatStep, MatStepper } from '@angular/material/stepper';
import { ValidationAlertComponent } from 'src/app/shared/validation-alert/validation-alert.component';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-setup-account',
  templateUrl: './setup-account.component.html',
  styleUrls: ['./setup-account.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SetupAccountComponent implements OnInit, OnDestroy {
  @BlockUI() blockUI: NgBlockUI;
  // **************************
  @ViewChild(MatStepper) stepper!: MatStepper;
  @ViewChild('targetElement') targetElement: ElementRef;
  allowprofileUpdate: boolean = true;
  profile: any;
  email: string = '';
  name: string = '';
  phone: number;
  address: string = '';
  showupload: boolean = false;
  uloadedImageFile: any = [];
  actualUploadedFiles: any[] = [];

  profileCreatedBy: string[] = ['GUEST'];
  genderOptions: string[] = ['Male', 'Female'];
  profileOptions: string[] = [
    'myself',
    'my son',
    'my daughter',
    'my brother',
    'my sister',
    'my friend',
    'my relative',
  ];
  motherTounghOptions: any[] = [];
  maritalOptions: any = [
    { name: 'Single' },
    { name: 'Married' },
    { name: 'Divorced' },
    { name: 'Widowed' },
    { name: 'Separated' },
  ];
  LikeOptions: any = [
    { name: 'Like Tv Serial' },
    { name: 'Like Game' },
    { name: 'Like Book' },
  ];

  mothersac: any = [
    'Govt employee [State]',
    'Govt employee [Central]',
    'Retired Govt employee [State]',
    'Retired Govt employee [Central]',
    'Business Man',
    'Farmer',
    'Private Company Employee',
    'Retired Private Company Employee',
    'Late',
    'Other',
    'House Wife',
  ];
  fathersoc: any = [
    'Govt employee [State]',
    'Govt employee [Central] ',
    'Retired Govt employee [State]',
    'Retired Govt employee [Central]',
    'Business Man',
    'Farmer',
    'Private Company Employee',
    'Retired Private Company Employee',
    'Late',
    'Other',
  ];
  religionOptions: any = [];
  religionCasteOptions: any = [];

  religionSubcasteOptions: any = [];

  aducationalOptions1: any = [];
  aducationalOptions2: any = [];

  ocupationOptions: any = [];

  employeeInOptions: any = [];

  anualIncomeOptions: any = [];

  familytypeOptions: any = [{ name: 'joint' }, { name: 'juclear' }];

  familyvalueOptions: any = [
    { name: 'Orthodox' },
    { name: 'Traditional' },
    { name: 'Moderate' },
    { name: 'Liberal' },
  ];

  familystatusOptions: any = [
    { name: 'reach' },
    { name: 'Affluent' },
    { name: 'middle class' },
    { name: 'upper middle class' },
    { name: 'upper lower class' },
    { name: 'upper class' },
    { name: 'lower class' },
    { name: 'working class' },
    { name: 'single-parent' },
    { name: 'blended' },
    { name: 'divorced' },
    { name: 'widowed' },
  ];

  noofbrothersisterOptins: any = [
    { name: 0 },
    { name: 1 },
    { name: 2 },
    { name: 3 },
    { name: 4 },
    { name: 5 },
    { name: 6 },
    { name: 7 },
  ];

  countryOption: any = [{ name: 'India' }];

  stateOption: any = [];
  cityOption: any = [];
  stateOption1: any = [];
  cityOption1: any = [];

  dietOptions: any = [{ name: 'Vegetarian' }, { name: 'Non-Vegetarian' }];
  smokingOptions: any = [
    { name: 'Yes' },
    { name: 'No' },
    { name: 'Occasionally' },
  ];
  drinkOptions: any = [
    { name: 'Yes' },
    { name: 'No' },
    { name: 'Occasionally' },
  ];

  heightOptions: any = [
    { name: 'Below 4ft 6in - 137cm', value: 137 },
    { name: '4ft 6in - 137cm', value: 137 },
    { name: '4ft 7in - 139cm', value: 139 },
    { name: '4ft 8in - 142cm', value: 142 },
    { name: '4ft 9in - 144cm', value: 144 },
    { name: '4ft 10in - 147cm', value: 147 },
    { name: '4ft 11in - 149cm', value: 149 },
    { name: '5ft - 152cm', value: 152 },
    { name: '5ft 1in - 154cm', value: 154 },
    { name: '5ft 2in - 157cm', value: 157 },
    { name: '5ft 3in - 160cm', value: 160 },
    { name: '5ft 4in - 162cm', value: 162 },
    { name: '5ft 5in - 165cm', value: 165 },
    { name: '5ft 6in - 167cm', value: 167 },
    { name: '5ft 7in - 170cm', value: 170 },
    { name: '5ft 8in - 172cm', value: 172 },
    { name: '5ft 9in - 175cm', value: 175 },
    { name: '5ft 10in - 177cm', value: 177 },
    { name: '5ft 11in - 180cm', value: 180 },
    { name: '6ft - 182cm', value: 182 },
    { name: '6ft 1in - 185cm', value: 185 },
    { name: '6ft 2in - 187cm', value: 187 },
    { name: '6ft 3in - 190cm', value: 190 },
    { name: '6ft 4in - 193cm', value: 193 },
    { name: '6ft 5in - 195cm', value: 195 },
    { name: '6ft 6in - 198cm', value: 198 },
    { name: '6ft 7in - 200cm', value: 200 },
    { name: '6ft 8in - 203cm', value: 203 },
    { name: '6ft 9in - 205cm', value: 205 },
    { name: '6ft 10in - 208cm', value: 208 },
    { name: '6ft 11in - 210cm', value: 210 },
    { name: '7ft - 213cm', value: 213 },
    { name: 'Above 7ft - 213cm', value: 213 },
  ];

  weightOptions: any = [
    { name: 20 },
    { name: 21 },
    { name: 22 },
    { name: 23 },
    { name: 24 },
    { name: 25 },
    { name: 26 },
    { name: 27 },
    { name: 28 },
    { name: 29 },
    { name: 30 },
    { name: 31 },
    { name: 32 },
    { name: 33 },
    { name: 34 },
    { name: 35 },
    { name: 36 },
    { name: 37 },
    { name: 38 },
    { name: 39 },
    { name: 40 },
    { name: 41 },
    { name: 42 },
    { name: 43 },
    { name: 44 },
    { name: 45 },
    { name: 46 },
    { name: 47 },
    { name: 48 },
    { name: 49 },
    { name: 50 },
    { name: 51 },
    { name: 52 },
    { name: 53 },
    { name: 54 },
    { name: 55 },
    { name: 56 },
    { name: 57 },
    { name: 58 },
    { name: 59 },
    { name: 60 },
    { name: 61 },
    { name: 62 },
    { name: 63 },
    { name: 64 },
    { name: 65 },
    { name: 66 },
    { name: 67 },
    { name: 68 },
    { name: 69 },
    { name: 70 },
    { name: 71 },
    { name: 72 },
    { name: 73 },
    { name: 74 },
    { name: 75 },
    { name: 76 },
    { name: 77 },
    { name: 78 },
    { name: 79 },
    { name: 80 },
    { name: 81 },
    { name: 82 },
    { name: 83 },
    { name: 84 },
    { name: 85 },
    { name: 86 },
    { name: 87 },
    { name: 88 },
    { name: 89 },
    { name: 90 },
    { name: 91 },
    { name: 92 },
    { name: 93 },
    { name: 94 },
    { name: 95 },
    { name: 96 },
    { name: 97 },
    { name: 98 },
    { name: 99 },
    { name: 100 },
  ];

  bodyTpeOptions: any = [
    { name: 'Athletic' },
    { name: 'Slim' },
    { name: 'Muscular' },
    { name: 'Curvy' },
    { name: 'Toned' },
    { name: 'Petite' },
    { name: 'Husky' },
    { name: 'Slim' },
  ];

  ComplextionOptions: any = [
    { name: 'Very Fair' },
    { name: 'Fair' },
    { name: 'Wheatish' },
    { name: 'Wheatish Brown' },
    { name: 'Dark' },
  ];

  physicalStatusOptions: any = [
    { name: 'Normal' },
    { name: 'Physical Chalenges' },
  ];
  likeOption: any = [
    { name: 'Like Tv Serial' },
    { name: 'Like Game' },
    { name: 'Like Book' },
  ];

  nakhyatraOption: any = [];
  zodiacsOptions: any = [];
  gotraOption: any = [];

  responsiveOptions: any[] = [
    {
      breakpoint: '1024px',
      numVisible: 1,
    },
    {
      breakpoint: '768px',
      numVisible: 1,
    },
    {
      breakpoint: '560px',
      numVisible: 1,
    },
  ];

  uploadURL = 'http://localhost/waywala-admin-api/shop/upload.php';
  uploadedFiles: any = [];
  selecteduploadedFiles: any[] = [];

  images: any[] = [];
  displayBasic: boolean = false;
  profileImage: any;

  userAllData: any;
  private confettiInterval: any;
  private containerEl: HTMLElement;

  private confettiColors = [
    '#EF2964',
    '#00C09D',
    '#2D87B0',
    '#48485E',
    '#EFFF1D',
  ];
  private confettiAnimations = ['slow', 'medium', 'fast'];
  public activestepNo: number = 1;
  // **************************
  imageChangedEvent: any = '';
  croppedImage: any = '';
  fileSelected = false;

  crop_imgae: any;

  active_taitel: string = 'Education & Occupation Details';
  // All Step Form
  profileDetailsForm: FormGroup;
  basicDetailsForm: FormGroup;
  education_occupationDetailsForm: FormGroup;
  userFamilyDetailsForm: FormGroup;
  locationDetailsForm: FormGroup;
  userAboutDetailsForm: FormGroup;
  habitHobbiesForm: FormGroup;
  physicalDeatilsForm: FormGroup;
  partnerPreferenceForm: FormGroup;
  horoscopeForm: FormGroup;

  all_process_step: any[] = [
    {
      fn: 'handler_user_education_occupations',
      formGroup: 'education_occupationDetailsForm',
      id: 'user_education_occupations',
      isCompleted: false,
      active_title: 'Education & Occupation Details',
    },
    {
      fn: 'handler_userPhysicaldetalsForm',
      formGroup: 'physicalDeatilsForm', // Assuming this form is associated with this step
      id: 'user_physical_details',
      isCompleted: false,
      active_title: 'Physical Details',
    },
    {
      formGroup: 'horoscopeForm', // Assuming this form is associated with this step
      id: 'user_horoscope_deatils',
      db: 'user_horoscope',
      isCompleted: false,
      active_title: 'Horoscope Details',
    },
    {
      formGroup: 'userFamilyDetailsForm', // Assuming this form is associated with this step
      id: 'user_family',
      isCompleted: false,
      active_title: 'Family Details',
    },
    {
      formGroup: 'locationDetailsForm', // Assuming this form is associated with this step
      id: 'user_locations',
      isCompleted: false,
      active_title: 'Location Details',
    },
    {
      formGroup: 'habitHobbiesForm', // Assuming this form is associated with this step
      id: 'user_diet_hobbies',
      isCompleted: false,
      active_title: 'Habit and Hobbies',
    },
    {
      formGroup: 'userAboutDetailsForm', // Assuming this form is associated with this step
      id: 'user_about',
      isCompleted: false,
      active_title: 'About You',
    },
    {
      formGroup: 'profileImagesForm', // Assuming this form is associated with this step
      id: 'user_profile_images',
      isCompleted: false,
      active_title: 'Profile Pictures',
    },
    {
      formGroup: 'partnerPreferenceForm', // Assuming this form is associated with this step
      id: 'user_partnerpreference',
      isCompleted: false,
      active_title: 'Partner Details',
    },
  ];
  // activeProcess:
  $activeProcess: Subject<any> = new Subject<any>();

  degOptions: any;
  phonenumber: any;
  whatsappnumber: any;
  countryCodes: any;
  ccode: any = '91';
  likedata: any = [];
  private skipStepProcess: any;

  public formLabels: any = {
    // Basic Details Form
    user_fname: 'First Name',
    user_lname: 'Last Name',
    user_email: 'Email',
    user_profileType: 'Profile Type',
    user_gender: 'Gender',
    user_mother_toungh: 'Mother Tongue',
    user_marital_status: 'Marital Status',
    user_dob: 'Date of Birth',
    user_whatsapp_no: 'WhatsApp Number',
    user_phone_no: 'Phone Number',
    whats_app_c_code: 'WhatsApp Country Code',

    // Education & Occupation Details Form
    user_ID: 'User ID',
    user_occupation: 'Occupation',
    user_employed_In: 'Employed In',
    user_anual_income: 'Annual Income',
    user_additional_education: 'Additional Education',
    user_highest_education: 'Highest Education',
    user_occupation_details: 'Occupation Details',
    user_occupation_location: 'Occupation Location',
    user_deg: 'Degree',
    completed: 'Completed',

    // Family Details Form
    user_family_type: 'Family Type',
    user_family_value: 'Family Value',
    user_family_status: 'Family Status',
    user_father_name: "Father's Name",
    user_mother_name: "Mother's Name",
    user_father_occupation: "Father's Occupation",
    user_mothers_occupation: "Mother's Occupation",
    user_no_of_unmarried_brother: 'No. of Unmarried Brothers',
    user_no_of_unmarried_sister: 'No. of Unmarried Sisters',
    user_no_of_married_sister: 'No. of Married Sisters',
    user_no_of_married_brother: 'No. of Married Brothers',

    // Location Details Form
    user_country: 'Country',
    user_state: 'State',
    user_city: 'City',
    user_Address: 'Address',
    user_Permanent_Address: 'Permanent Address',
    user_current_and_permanent_address_same: 'Current & Permanent Address Same',
    user_Permanent_city: 'Permanent City',
    user_Permanent_state: 'Permanent State',
    user_Permanent_country: 'Permanent Country',

    // About Details Form
    user_about: 'About',

    // Habits & Hobbies Form
    user_diet: 'Diet',
    user_smoking: 'Smoking',
    user_drinking: 'Drinking',
    user_like: 'Likes',

    // Physical Details Form
    user_height: 'Height',
    user_weight: 'Weight',
    user_body_type: 'Body Type',
    user_complextion: 'Complexion',
    user_physical_status: 'Physical Status',
    // Partner Preference Form
    user_religion: 'Religion',
    user_min_anual_income: 'Minimum Annual Income',
    user_max_anual_income: 'Maximum Annual Income',

    // Horoscope Details
    user_dateoftime: 'Time of Bath',
    user_dateofplace: 'Place of Bath',
    user_gotra: 'Gotra',
    user_zodiacs: 'Rashi',
    user_nakhyatra: 'Nakhyatra',
  };
  // @ViewChild('stepper') stepper: MatStepper;

  public allDropDownList: any = {};
  constructor(
    private appservices: AppService,
    private ApiParameterScript: ApiParameterScript,
    private router: Router,
    private confirmationService: ConfirmationService,
    private el: ElementRef,
    private alert: ToastrService,
    private modalService: NgbModal,
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    private fb: FormBuilder
  ) {
    // this.loadingStaticDropDownData();

    this.profileDetailsForm = this.fb.group({
      profile_id: ['', Validators.required],
      profile_name: ['', Validators.required],
      profile_email: ['', Validators.required],
      profile_phone: ['', Validators.required],
    });

    this.basicDetailsForm = this.fb.group({
      user_fname: ['', Validators.required],
      user_lname: ['', Validators.required],
      user_email: ['', Validators.required],
      user_profileType: ['', Validators.required],
      user_gender: ['', Validators.required],
      user_mother_toungh: ['', Validators.required],
      user_marital_status: ['', Validators.required],
      user_dob: ['', Validators.required],
      user_whatsapp_no: [
        '',
        [Validators.required, Validators.pattern(/^\d{10}$/)],
      ],
      user_phone_no: [''],
      whats_app_c_code: ['91'],
    });

    this.education_occupationDetailsForm = this.fb.group({
      user_ID: [''],
      user_occupation: ['', Validators.required],
      user_employed_In: ['', Validators.required],
      user_anual_income: ['', Validators.required],
      user_additional_education: ['', Validators.required],
      user_highest_education: ['', Validators.required],
      user_occupation_details: ['', Validators.required],
      user_occupation_location: ['', Validators.required],
      user_deg: ['', Validators.required],
      completed: [0, Validators.required],
    });

    this.userFamilyDetailsForm = this.fb.group({
      user_ID: [''],
      user_family_type: ['', Validators.required],
      user_family_value: ['', Validators.required],
      user_family_status: ['', Validators.required],
      user_father_name: ['', Validators.required],
      user_mother_name: ['', Validators.required],
      user_father_occupation: ['', Validators.required],
      user_mothers_occupation: ['', Validators.required],
      user_no_of_unmarried_brother: ['', Validators.required],
      user_no_of_unmarried_sister: ['', Validators.required],
      user_no_of_married_sister: ['', Validators.required],
      user_no_of_married_brother: ['', Validators.required],
      completed: [0, Validators.required],
    });

    this.locationDetailsForm = this.fb.group({
      user_ID: [''],
      user_country: ['', Validators.required],
      user_state: ['', Validators.required],
      user_city: ['', Validators.required],
      user_Address: ['', Validators.required],
      user_Permanent_Address: ['', Validators.required],
      user_current_and_permanent_address_same: ['No', Validators.required],
      user_Permanent_city: ['', Validators.required],
      user_Permanent_state: ['', Validators.required],
      user_Permanent_country: ['', Validators.required],
      completed: [0, Validators.required],
    });

    this.userAboutDetailsForm = this.fb.group({
      user_ID: [''],
      user_about: ['', Validators.required],
      completed: [0, Validators.required],
    });

    this.habitHobbiesForm = this.fb.group({
      user_ID: [''],
      user_diet: ['', Validators.required],
      user_smoking: ['', Validators.required],
      user_drinking: ['', Validators.required],
      user_like: ['', Validators.required],
      completed: [0, Validators.required],
    });

    this.physicalDeatilsForm = this.fb.group({
      user_ID: [''],
      user_height: ['', Validators.required],
      user_weight: ['', Validators.required],
      user_body_type: ['', Validators.required],
      user_complextion: ['', Validators.required],
      user_physical_status: ['', Validators.required],
      completed: [0, Validators.required],
    });

    this.partnerPreferenceForm = this.fb.group({
      user_ID: [''],
      user_height: [[], Validators.required],
      user_religion: [[], Validators.required],
      user_country: [[], Validators.required],
      user_marital_status: [[], Validators.required],
      user_state: [[], Validators.required],
      user_city: [[], Validators.required],
      user_employed_In: [[], Validators.required],
      user_occupation: [[], Validators.required],
      user_mother_toungh: [[], Validators.required],
      user_min_anual_income: ['', Validators.required],
      user_max_anual_income: ['', Validators.required],
    });
    this.horoscopeForm = this.fb.group({
      user_id: new FormControl('', []),
      user_horoscope: new FormControl('Yes', [Validators.required]), //1
      user_mangalik: new FormControl('No', [Validators.required]), //1
      user_dateoftime: new FormControl('', [Validators.required]), //1
      user_dateofplace: new FormControl('', [Validators.required]), //1
      user_gotra: new FormControl('', [Validators.required]), //1
      user_zodiacs: new FormControl('', [Validators.required]), //1
      user_nakhyatra: new FormControl('', [Validators.required]), //1
      completed: new FormControl(0, []),
    });
    // this.monitorFormGroupChanges();
  }

  previousValues: any = {};
  MODE: string = 'SAVE';
  ngOnInit(): void {
    this.blockUI.start('Please Wait....');
    forkJoin(this.generateRequest()).subscribe((results) => {
      this.countryCodes = results.countryCodes;
      this.countryOption = results.countryOption;
      this.anualIncomeOptions = results.anualIncomeOptions;
      this.aducationalOptions2 = results.aducationalOptions2;
      this.motherTounghOptions = results.motherTounghOptions;
      this.aducationalOptions1 = results.aducationalOptions1;
      this.employeeInOptions = results.employeeInOptions;
      this.degOptions = results.degOptions;
      this.ocupationOptions = results.ocupationOptions;
      this.religionOptions = results.religionOptions;
      this.religionCasteOptions = results.religionCasteOptions;
      this.gotraOption = results.gotraOption;
      this.likedata = results.likedata;
      this.nakhyatraOption = results.nakhyatraOption;
      this.zodiacsOptions = results.zodiacsOptions;

      this.actualUploadedFiles = [];
      this.selecteduploadedFiles = [];

      this.uploadURL = `${this.appservices.getApipath()}upload?q=${
        this.appservices.authStatus.profile_id
      }`;
      this.profile = this.appservices.authStatus;
      this.ApiParameterScript.getprofile({
        userid: this.appservices.authStatus.profile_id,
      }).subscribe((userInfo: any) => {
        if (userInfo.success) {
          console.log('%c =====USER INFO FOUND=====', 'color: green');
          // this.stepper.selectedIndex = 1
          const {
            user_profile_status,
            user_info,
            user_locations,
            user_religion,
          } = userInfo;

          if (
            user_profile_status === 'Completed' &&
            user_info.user_status === 'Approved'
          ) {
            this.setupElements();
            this.renderConfetti();
            this.router.navigate(['/v1/search_match']);
          } else {
            this.blockUI.stop();
          }
          var activeProcess = false;
          this.all_process_step.map((i: any, index) => {
            i['isCompleted'] =
              userInfo[i.id] &&
              (userInfo[i.id]['completed'] == '1' ||
                userInfo[i.id]['completed'] == 1 ||
                ('user_profile_images' == i.id &&
                  userInfo['user_profile_images'].length > 0))
                ? true
                : false;
            console.log('Hii');

            if (!activeProcess && !i['isCompleted']) {
              this.$activeProcess.next(this.all_process_step[index]);
              activeProcess = true;
              this.waitForStepperAndSkip(index);
            }

            // if(i.isCompleted)this.stepper.steps()
          });
          console.log('pro', activeProcess);
          console.log(this.all_process_step);

          this.userAllData = userInfo;

          this.getstatefilter(user_locations.user_country);
          this.getcityfilter(user_locations.user_state);
          this.getstatefilter1(user_locations.user_Permanent_country);
          this.getcityfilter1(user_locations.user_Permanent_state);
          // this.getSubcaste(user_religion.user_caste);
          this.setValue(userInfo);
        } else {
          console.log('%c NO USER INFO FOUND', 'color: red');
        }
      });

      var query = `
      SELECT *
      FROM social_media_links
      WHERE id = 1`;
      this.ApiParameterScript.fetchDataFormQuery(query).subscribe(
        (res: any) => {
          if (res.status) {
            this.phonenumber = res['data'][0].phone_no;
            this.whatsappnumber = res['data'][0].whatsapp_no;
          }
        }
      );
    });
  }

  private waitForStepperAndSkip(stepIndex: number): void {
    if (this.skipStepProcess) {
      clearInterval(this.skipStepProcess);
    }
    this.skipStepProcess = setInterval(() => {
      if (this.stepper) {
        // console.log('%c ===SKIP THE COMPLETED STEP===', 'color:red');
        // console.log(this.stepper);
        // console.log(stepIndex);
        const currentIndex = this.stepper.selectedIndex;
        const stepsToSkip = stepIndex - currentIndex;

        if (stepsToSkip > 0) {
          for (let i = 0; i < stepsToSkip; i++) {
            this.stepper.next();
          }
        }
        clearInterval(this.skipStepProcess);
      }
    }, 100);
  }
  onStepChange(event: any) {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
    console.log('====ONSTEPCHANGE===', event);
    this.active_taitel =
      this.all_process_step[event.selectedIndex]['active_title'];
  }

  setValue(userInfo: any) {
    this.userAllData = userInfo;
    this.education_occupationDetailsForm.patchValue(
      this.userAllData['user_education_occupations']
    );
    this.userAboutDetailsForm.patchValue(this.userAllData['user_about']);
    this.userFamilyDetailsForm.patchValue(this.userAllData['user_family']);
    this.habitHobbiesForm.patchValue(this.userAllData['user_diet_hobbies']);
    this.physicalDeatilsForm.patchValue(
      this.userAllData['user_physical_details']
    );
    this.horoscopeForm.patchValue(this.userAllData['user_horoscope_deatils']);
    this.locationDetailsForm.patchValue(this.userAllData['user_locations']);
    // this.user_religionDetailsForm.patchValue(this.userAllData['user_religion'])
    // }
    // });
  }

  trackByFn(index: number, item: any): number {
    return item.id; // Assuming each `value` has a unique `id`
  }

  generateRequest() {
    const requests = {
      countryCodes: this.ApiParameterScript.unsecuredFatchquary(
        'country',
        { projection: ['*'] },
        true,
        5 * 60 * 60 * 1000
      ).pipe(
        map((res: any) =>
          res.success && res['data'].length > 0
            ? res['data'].map((item: any) => ({
                name: item.name,
                dial_code: item.phonecode,
              }))
            : []
        )
      ),
      countryOption: this.ApiParameterScript.fetchdata(
        'country',
        { projection: ['*'], whereConditions: { status: 1 } },
        0,
        1000,
        '',
        true,
        5 * 60 * 60 * 1000
      ).pipe(
        map((res: any) =>
          res.success && res['data'].length > 0
            ? this.mapAndSort(res['data'], 'name')
            : []
        )
      ),
      anualIncomeOptions: this.ApiParameterScript.fetchdata(
        'annual_income',
        { projection: ['*'], whereConditions: { status: 1 } },
        0,
        1000,
        '',
        true,
        5 * 60 * 60 * 1000
      ).pipe(
        map((res: any) =>
          res.success && res['data'].length > 0
            ? this.mapAndSort(res['data'], 'amount', 'annualincome_text')
            : []
        )
      ),
      aducationalOptions2: this.ApiParameterScript.fetchdata(
        'additional_education',
        { projection: ['*'], whereConditions: { status: 1 } },
        0,
        1000,
        '',
        true,
        5 * 60 * 60 * 1000
      ).pipe(
        map((res: any) =>
          res.success && res['data'].length > 0
            ? this.mapAndSort(res['data'], 'additional_education_name')
            : []
        )
      ),
      motherTounghOptions: this.ApiParameterScript.fetchdata(
        'mother_tongue',
        { projection: ['*'], whereConditions: { status: 1 } },
        0,
        1000,
        '',
        true,
        5 * 60 * 60 * 1000
      ).pipe(
        map((res: any) =>
          res.success && res['data'].length > 0
            ? this.mapAndSort(res['data'], 'mother_tongue_name')
            : []
        )
      ),
      aducationalOptions1: this.ApiParameterScript.fetchdata(
        'highest_education',
        { projection: ['*'], whereConditions: { status: 1 } },
        0,
        1000,
        '',
        true,
        5 * 60 * 60 * 1000
      ).pipe(
        map((res: any) =>
          res.success && res['data'].length > 0
            ? this.mapAndSort(res['data'], 'highest_education_name')
            : []
        )
      ),
      employeeInOptions: this.ApiParameterScript.fetchdata(
        'employer_in',
        { projection: ['*'], whereConditions: { status: 1 } },
        0,
        1000,
        '',
        true,
        5 * 60 * 60 * 1000
      ).pipe(
        map((res: any) =>
          res.success && res['data'].length > 0
            ? this.mapAndSort(res['data'], 'Employer_in_name')
            : []
        )
      ),
      degOptions: this.ApiParameterScript.fetchdata(
        'designation',
        { projection: ['*'], whereConditions: { status: 1 } },
        0,
        1000,
        '',
        true,
        5 * 60 * 60 * 1000
      ).pipe(
        map((res: any) =>
          res.success && res['data'].length > 0
            ? this.mapAndSort(res['data'], 'designation')
            : []
        )
      ),
      ocupationOptions: this.ApiParameterScript.fetchdata(
        'occupation',
        { projection: ['*'], whereConditions: { status: 1 } },
        0,
        1000,
        '',
        true,
        5 * 60 * 60 * 1000
      ).pipe(
        map((res: any) =>
          res.success && res['data'].length > 0
            ? this.mapAndSort(res['data'], 'occupation_name')
            : []
        )
      ),
      religionOptions: this.ApiParameterScript.fetchdata(
        'religion',
        { projection: ['*'], whereConditions: { status: 1 } },
        0,
        1000,
        '',
        true,
        5 * 60 * 60 * 1000
      ).pipe(
        map((res: any) =>
          res.success && res['data'].length > 0
            ? this.mapAndSort(res['data'], 'religion_name')
            : []
        )
      ),
      religionCasteOptions: this.ApiParameterScript.fetchdata(
        'cast_table',
        { projection: ['*'], whereConditions: { status: 1 } },
        0,
        1000,
        '',
        true,
        5 * 60 * 60 * 1000
      ).pipe(
        map((res: any) =>
          res.success && res['data'].length > 0
            ? this.mapAndSort(res['data'], 'cast_name')
            : []
        )
      ),
      gotraOption: this.ApiParameterScript.fetchdata(
        'gotra',
        { projection: ['*'], whereConditions: { status: 1 } },
        0,
        1000,
        '',
        true,
        5 * 60 * 60 * 1000
      ).pipe(
        map((res: any) =>
          res.success && res['data'].length > 0
            ? this.mapAndSort(res['data'], 'name')
            : []
        )
      ),
      likedata: this.ApiParameterScript.fetchdata(
        'like_detalis',
        { projection: ['*'], whereConditions: { status: 1 } },
        0,
        1000,
        '',
        true,
        5 * 60 * 60 * 1000
      ).pipe(
        map((res: any) =>
          res.success && res['data'].length > 0
            ? this.mapAndSort(res['data'], 'Like_name')
            : []
        )
      ),
      nakhyatraOption: this.ApiParameterScript.fetchdata(
        'nakshatra',
        { projection: ['*'], whereConditions: { status: 1 } },
        0,
        1000,
        '',
        true,
        5 * 60 * 60 * 1000
      ).pipe(
        map((res: any) =>
          res.success && res['data'].length > 0
            ? this.mapAndSort(res['data'], 'nakshatra_name')
            : []
        )
      ),
      zodiacsOptions: this.ApiParameterScript.fetchdata(
        'zodiacs',
        { projection: ['*'], whereConditions: { status: 1 } },
        0,
        1000,
        '',
        true,
        5 * 60 * 60 * 1000
      ).pipe(
        map((res: any) =>
          res.success && res['data'].length > 0
            ? res['data']
                .map(
                  (obj: any) => ({
                    name: obj.name,
                    display: `${obj.name} / ${obj.odia_name}`,
                  }),
                  0,
                  1000,
                  '',
                  true
                )
                .sort((a: any, b: any) => a.name.localeCompare(b.name))
            : []
        )
      ),
      educationOccupationDetails: this.ApiParameterScript.fetchdata(
        'user_education_occupations',
        {
          projection: ['*'],
          whereConditions: { user_ID: this.appservices.authStatus.profile_id },
        },
        0,
        1000,
        '',
        true,
        5 * 60 * 60 * 1000
      ).pipe(
        map((res: any) =>
          res.success && res['data'].length > 0 ? res['data'][0] : {}
        )
      ),
    };
    // this.blockUI.start("Please Wait...")
    return requests;
  }

  mapAndSort(data: any[], key: string, additionalKey?: string) {
    // console.log("Key", key);
    // console.log("Data", data);
    return data
      .filter((obj) => obj.status == 1)
      .map((obj) =>
        additionalKey
          ? { name: `${obj[key]} ${obj[additionalKey]}`, value: obj[key] }
          : { name: obj[key] }
      )
      .sort((a: any, b: any) => a.name.localeCompare(b.name));
  }

  onchangeAddress() {
    this.blockUI.start('Please Wait...');
    if (this.locationDetailsForm.value.user_Address == '') {
      this.blockUI.stop();
      this.locationDetailsForm.controls[
        'user_current_and_permanent_address_same'
      ].setValue('No');
      this.alert.error('Enter Current Address');
    } else if (this.locationDetailsForm.value.user_country == '') {
      this.blockUI.stop();
      this.locationDetailsForm.controls[
        'user_current_and_permanent_address_same'
      ].setValue('No');
      this.alert.error('Select Country Living in');
    } else if (this.locationDetailsForm.value.user_state == '') {
      this.blockUI.stop();
      this.locationDetailsForm.controls[
        'user_current_and_permanent_address_same'
      ].setValue('No');
      this.alert.error('Select State Living in');
    } else if (this.locationDetailsForm.value.user_city == '') {
      this.blockUI.stop();
      this.locationDetailsForm.controls[
        'user_current_and_permanent_address_same'
      ].setValue('No');
      this.alert.error('Select City Living in');
    } else {
      if (
        this.locationDetailsForm.value
          .user_current_and_permanent_address_same == 'Yes'
      ) {
        this.getstatefilter1(this.locationDetailsForm.value['user_country']);
        this.getcityfilter1(this.locationDetailsForm.value['user_state']);
        this.locationDetailsForm.controls['user_Permanent_city'].setValue(
          this.locationDetailsForm.value['user_city'] || null
        );
        this.locationDetailsForm.controls['user_Permanent_state'].setValue(
          this.locationDetailsForm.value['user_state'] || null
        );
        this.locationDetailsForm.controls['user_Permanent_country'].setValue(
          this.locationDetailsForm.value['user_country'] || null
        );
        this.locationDetailsForm.controls['user_Permanent_Address'].setValue(
          this.locationDetailsForm.value['user_Address'] || null
        );
      } else {
        this.locationDetailsForm.controls['user_Permanent_city'].setValue('');
        this.locationDetailsForm.controls['user_Permanent_state'].setValue(
          ''
        );
        this.locationDetailsForm.controls['user_Permanent_country'].setValue(
          ''
        );
        this.locationDetailsForm.controls['user_Permanent_Address'].setValue(
          ''
        );
      }
      setTimeout(() => {
        this.blockUI.stop();
        this.locationDetailsForm.patchValue(this.locationDetailsForm.value);
      }, 2000);
    }
  }

  previewImage() {
    this.displayBasic = true;
  }

  onSelectFile(event: any) {
    event.currentFiles.forEach((element: any) => {
      this.selecteduploadedFiles.push({
        previewImageSrc:
          element.objectURL.changingThisBreaksApplicationSecurity,
        thumbnailImageSrc:
          element.objectURL.changingThisBreaksApplicationSecurity,
        alt: '01673172483.jpg',
        title: '01673172483.jpg',
      });
    });
  }

  onClearSelectedFile() {
    this.selecteduploadedFiles = this.images;
  }

  onRemoveFile(event: any) {
    _.remove(
      this.selecteduploadedFiles,
      (item) =>
        item.previewImageSrc ===
        event.file.objectURL.changingThisBreaksApplicationSecurity
    );
  }

  getSubcaste(caste: any) {
    console.log('get Subcaste', caste);

    this.ApiParameterScript.fetchdata('sub_cast', {
      projection: ['*'],
      whereConditions: { cast_name: caste },
    }).subscribe((res: any) => {
      if (res.success && res['data'].length > 0) {
        this.religionSubcasteOptions = res['data'].map((obj: any) => {
          if (obj.status == 1) {
            return { name: obj.sub_cast_name };
          } else {
            return null;
          }
        });
      } else {
        this.religionSubcasteOptions = [];
      }
    });
  }

  getstatefilter(country_name: any) {
    console.log('getstatefilter', country_name);
    if (_.isArray(country_name)) {
      this.blockUI.start('State is Loading...s');
      let query = `SELECT * FROM state WHERE status=1 AND country_name IN (${
        "'" + country_name.join("', '") + "'"
      })`;
      this.ApiParameterScript.fetchDataFormQuery(query).subscribe(
        (res: any) => {
          this.blockUI.stop();
          if (res.success && res['data'].length > 0) {
            this.stateOption = res['data'].map((obj: any) => {
              return { name: obj.name };
            });
            this.stateOption.sort((a: any, b: any) =>
              a.name.localeCompare(b.name)
            );
          } else {
            this.blockUI.stop();
            this.stateOption = [];

            // this.partnerPreferenceForm.controls.user_state.reset();
          }
        }
      );
    } else {
      this.blockUI.start('State is Loading...');
      this.ApiParameterScript.fetchdata(
        'state',
        {
          projection: ['*'],
          whereConditions: { country_name: country_name, status: 1 },
        },
        0,
        1000,
        '',
        true,
        5 * 60 * 60 * 1000
      ).subscribe((res: any) => {
        console.log(res);

        if (res.success && res['data'].length > 0) {
          this.blockUI.stop();
          this.stateOption = res['data'].map((obj: any) => {
            return { name: obj.name };
          });
          this.stateOption.sort((a: any, b: any) =>
            a.name.localeCompare(b.name)
          );

          //console.log(this.stateOption);
        } else {
          this.blockUI.stop();
          this.stateOption = [];
          // this.partnerPreferenceForm.controls.user_state.reset();
        }
      });
    }
  }

  getstatefilter1(country_name: any) {
    if (_.isArray(country_name)) {
      let query = `SELECT * FROM state WHERE status=1 AND country_name IN (${
        "'" + country_name.join("', '") + "'"
      })`;
      this.ApiParameterScript.fetchDataFormQuery(query).subscribe(
        (res: any) => {
          if (res.success && res['data'].length > 0) {
            this.stateOption1 = res['data'].map((obj: any) => {
              return { name: obj.name };
            });
            this.stateOption1.sort((a: any, b: any) =>
              a.name.localeCompare(b.name)
            );
          } else {
            this.stateOption1 = [];
            // this.partnerPreferenceForm.controls.user_state.reset();
          }
        }
      );
    } else {
      this.ApiParameterScript.fetchdata(
        'state',
        {
          projection: ['*'],
          whereConditions: { country_name: country_name, status: 1 },
        },
        0,
        10000000,
        '',
        true,
        5 * 60 * 60 * 1000
      ).subscribe((res: any) => {
        // console.log(res);

        if (res.success && res['data'].length > 0) {
          this.stateOption1 = res['data'].map((obj: any) => {
            return { name: obj.name };
          });
          this.stateOption1.sort((a: any, b: any) =>
            a.name.localeCompare(b.name)
          );

          //console.log(this.stateOption);
        } else {
          this.stateOption1 = [];
          // this.partnerPreferenceForm.controls.user_state.reset();
        }
      });
    }
  }

  generateAboutUs(): void {
    // Generate the content for the "About Me" textarea (replace this with your actual content generation logic)
    let aboutMeContent =
      "I'm a [Your Age] year old [Your Gender], residing in [Your Current Location]. Professionally, I'm a [Your Occupation] with [Number of Years] years of experience. I'm passionate about [Your Interests/Hobbies] and value spending quality time with loved ones. I'm [Personality Trait 1], [Personality Trait 2], and [Personality Trait 3]. Seeking a life partner who shares similar values, respects traditions, and believes in mutual understanding. I believe in the sanctity of marriage and look forward to building a loving, respectful, and fulfilling relationship based on trust and companionship.";
    this.userAboutDetailsForm.patchValue({
      user_about: aboutMeContent,
    });
  }

  getcityfilter(state_name: any) {
    if (_.isArray(state_name)) {
      let query = `SELECT * FROM city WHERE state_name IN (${
        "'" + state_name.join("', '") + "'"
      })`;

      this.ApiParameterScript.fetchDataFormQuery(query).subscribe(
        (res: any) => {
          if (res.success && res['data'].length > 0) {
            this.cityOption = res['data'].map((obj: any) => {
              return { name: obj.city_name };
            });
            this.cityOption.sort((a: any, b: any) =>
              a.name.localeCompare(b.name)
            );
          } else {
            this.cityOption = [];
            // this.partnerPreferenceForm.controls.user_city.reset();
          }
        }
      );
    } else {
      this.ApiParameterScript.fetchdata(
        'city',
        {
          projection: ['*'],
          whereConditions: { state_name: state_name, status: 1 },
        },
        0,
        1000,
        '',
        true,
        5 * 60 * 60 * 1000
      ).subscribe((res: any) => {
        if (res.success && res['data'].length > 0) {
          this.cityOption = res['data'].map((obj: any) => {
            return { name: obj.city_name };
          });
          this.cityOption.sort((a: any, b: any) =>
            a.name.localeCompare(b.name)
          );
        } else {
          this.cityOption = [];
          // this.partnerPreferenceForm.controls.user_city.reset();
        }
      });
    }
  }
  getcityfilter1(state_name: any) {
    if (_.isArray(state_name)) {
      let query = `SELECT * FROM city WHERE state_name IN (${
        "'" + state_name.join("', '") + "'"
      })`;

      this.ApiParameterScript.fetchDataFormQuery(query).subscribe(
        (res: any) => {
          if (res.success && res['data'].length > 0) {
            this.cityOption1 = res['data'].map((obj: any) => {
              return { name: obj.city_name };
            });
            this.cityOption1.sort((a: any, b: any) =>
              a.name.localeCompare(b.name)
            );
          } else {
            this.cityOption1 = [];
            // this.partnerPreferenceForm.controls.user_city.reset();
          }
        }
      );
    } else {
      this.ApiParameterScript.fetchdata(
        'city',
        {
          projection: ['*'],
          whereConditions: { state_name: state_name, status: 1 },
        },
        0,
        100000000000,
        '',
        true,
        5 * 60 * 60 * 1000
      ).subscribe((res: any) => {
        if (res.success && res['data'].length > 0) {
          this.cityOption1 = res['data'].map((obj: any) => {
            return { name: obj.city_name };
          });
          this.cityOption1.sort((a: any, b: any) =>
            a.name.localeCompare(b.name)
          );
        } else {
          this.cityOption1 = [];
          // this.partnerPreferenceForm.controls.user_city.reset();
        }
      });
    }
  }

  private setupElements(): void {
    this.containerEl = document.createElement('div');
    const elPosition = this.el.nativeElement.style.position;

    if (elPosition !== 'relative' && elPosition !== 'absolute') {
      this.el.nativeElement.style.position = 'relative';
    }

    this.containerEl.classList.add('confetti-container');
    this.el.nativeElement.appendChild(this.containerEl);
  }

  private renderConfetti(): void {
    this.confettiInterval = setInterval(() => {
      const confettiEl = document.createElement('div');
      const confettiSize = Math.floor(Math.random() * 3) + 7 + 'px';
      const confettiBackground =
        this.confettiColors[
          Math.floor(Math.random() * this.confettiColors.length)
        ];
      const confettiLeft =
        Math.floor(Math.random() * this.el.nativeElement.offsetWidth) + 'px';
      const confettiAnimation =
        this.confettiAnimations[
          Math.floor(Math.random() * this.confettiAnimations.length)
        ];

      confettiEl.classList.add(
        'confetti',
        'confetti--animation-' + confettiAnimation
      );
      confettiEl.style.left = confettiLeft;
      confettiEl.style.width = confettiSize;
      confettiEl.style.height = confettiSize;
      confettiEl.style.backgroundColor = confettiBackground;

      setTimeout(() => {
        this.containerEl.removeChild(confettiEl);
      }, 3000);

      this.containerEl.appendChild(confettiEl);
    }, 25);
  }

  ngOnDestroy(): void {
    clearInterval(this.confettiInterval);
    clearInterval(this.skipStepProcess);
  }

  fileChangeEvent(event: any): void {
    const allowedTypes = ['image/jpeg', 'image/png']; // Allowed file types
    const maxSize = 5 * 1024 * 1024; // Maximum file size in bytes (5MB)

    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];

      // Check file type
      if (!allowedTypes.includes(file.type)) {
        Swal.fire({
          icon: 'error',
          title: 'Invalid File Type',
          text: 'Only JPG, PNG, and JPEG files are allowed.',
        });
        return;
      }

      // Check file size
      if (file.size > maxSize) {
        Swal.fire({
          icon: 'error',
          title: 'File Too Large',
          text: 'Please select a file smaller than 5MB.',
        });
        return;
      }

      // If both type and size are valid
      console.log(event);
      this.imageChangedEvent = event;
      this.fileSelected = true;
    }
  }

  remove() {
    (this.imageChangedEvent = ''), (this.fileSelected = false);
  }
  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = this.sanitizer.bypassSecurityTrustUrl(
      event.objectUrl ? event.objectUrl : ''
    );
    console.log(event.blob);
    this.crop_imgae = event.blob;
    // event.blob can be used to upload the cropped image
  }

  imageLoaded(image: LoadedImage) {
    // show cropper
  }
  cropperReady() {
    // cropper ready
  }
  loadImageFailed() {
    // show message
  }

  goToPrevioudStep() {
    //console.log('Active State', this.stepper.selectedIndex);
    try {
      this.active_taitel =
        this.all_process_step[this.stepper.selectedIndex - 1]['active_title'];
      this.$activeProcess.next(
        this.all_process_step[this.stepper.selectedIndex - 1]
      );

      this.stepper.previous();
      setTimeout(() => {
        window.scroll({
          top: 0,
          left: 0,
          behavior: 'smooth',
        });
      }, 200);
      // window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.log('%c ===ERROR IN goToPrevioudStep ===', 'color:red', error);
    }
  }

  goFoeMatch() {
    location.reload();
  }

  printInvalidFields(form: FormGroup) {
    //console.log('form', form);

    let invalidControls = [];
    let errorList: any[] = [];
    Object.keys(form.controls).map((control: any) => {
      if (!form.controls[control].valid) {
        console.log('Control', control);
        var obj = { name: control, text: this.formLabels[control] };
        if (form.controls[control].errors !== null) {
          errorList.push({ obj: obj, value: form.controls[control].errors });
        }
      }
    });

    if (errorList.length > 0) {
      const alertModal = this.modalService.open(ValidationAlertComponent, {
        centered: true,
      });
      alertModal.componentInstance.controls = form.controls;
      alertModal.componentInstance.invalidControls = errorList;

      alertModal.result.then((res: any) => {
        try {
          var doc: any = document.getElementById(errorList[0]['obj']['name']);
          //console.log(doc);

          // window.scroll({
          //   top:this.getTopOffset(doc),
          //   left:0,
          //   behavior:'smooth'
          // })
          document.getElementById(doc)?.focus();
        } catch (error) {
          console.log('%c ===ERROR===', 'color: red');
          console.log(error);
        }
      });
    }
    // console.log("%c ===INVALID FORM FIELD===","color");
    console.log('%c ===INVALID FORM FIELD===', 'color: red');
    console.log(errorList);
  }
  saveAndNext() {
    // console.log('===CLICK SAVE AND NEXT BUTTON===');
    const index = this.stepper.selectedIndex;
    const currentstep: any = this.stepper.selected;
    const currentForm: FormGroup = currentstep['stepControl'];
    const currentProcess = this.all_process_step[this.stepper.selectedIndex];
    if (!['user_profile_images'].includes(currentProcess.id)) {
      //console.log("currect",currentstep);
      if (currentForm.valid) {
        let mode =
          currentstep &&
          currentstep['completed'] &&
          currentProcess['isCompleted']
            ? 'UPDATE'
            : 'SAVE';
        this.blockUI.start('Please Wait....');
        this.handelerServices(currentProcess, currentForm, mode).subscribe(
          (taskCompleted: any) => {
            if (taskCompleted) {
              this.all_process_step[index]['isCompleted'] = true;
              setTimeout(() => {
                this.stepper.next();
                this.blockUI.stop();
                window.scroll({
                  top: 0,
                  left: 0,
                  behavior: 'smooth',
                });
              }, 500);
            } else {
              this.blockUI.stop();
            }
          }
        );
      } else {
        this.printInvalidFields(currentForm);
      }
    } else {
      const _this: any = this;
      if (['user_profile_images'].includes(currentProcess.id)) {
        _this['uploadFile']();
      }
    }
  }

  handelerServices(process: any, currentForm: FormGroup, MODE: string) {
    console.log('hi', this.MODE);

    console.log('%c===MODE===', MODE);

    console.log('%c===handelerServices===', 'color:red', process);
    const simpleObservable = new Observable((observer) => {
      var db = process && process.id ? process.id : '';
      var finalData: any = {
        ...currentForm.value,
        ...{ completed: 1, user_ID: this.appservices.authStatus.profile_id },
      };
      var whereConditions: any = {
        user_ID: this.appservices.authStatus.profile_id,
      };
      if (['user_horoscope_deatils'].includes(db)) {
        finalData = {
          ...currentForm.value,
          ...{ completed: 1, user_id: this.appservices.authStatus.profile_id },
        };
        whereConditions = { user_id: this.appservices.authStatus.profile_id };
        db = process.db;
      }
      console.log('FinalData', finalData);
      var apiName: 'savedata' | 'updatedata' =
        MODE == 'SAVE' ? 'savedata' : 'updatedata';

      var apiData = {
        data: finalData,
        whereConditions: whereConditions,
      };

      if (db != '') {
        this.ApiParameterScript[apiName](db, apiData).subscribe((res: any) => {
          console.log(res);

          if (res.success || res['message'] == 'No Data Updated') {
            this.blockUI.stop();
            var message =
              '<h2>Congratulation</h2><div class="pyro"><div class="before"></div><div class="after"></div></div>';
            if (res['message'] == 'No Data Updated') {
              message = "<h2>It'S Ok </h2>";
            }

            Swal.fire({
              title: `<strong style='color:#5c54a0; font-size:30px;'>${res.message}</strong>`,
              html: message,
              icon: 'success',
              // icon: 'success',
              // title: res.message,
              // text: 'success',
              allowOutsideClick: false,
            }).then(() => {
              observer.next(true);
              observer.complete();
            });
          } else {
            observer.next(false);
            observer.complete();
          }
        });
      } else {
        observer.next(false);
        observer.complete();
      }
    });
    return simpleObservable;
  }

  public getTopOffset(controlE1: HTMLElement): number {
    const labelOffset = 300;
    return controlE1.getBoundingClientRect().top + window.scrollY - labelOffset;
  }
  relode() {
    location.reload();
  }

  uploadFile() {
    if (this.crop_imgae) {
      const uploadData = new FormData();
      uploadData.append('file', this.crop_imgae);

      this.blockUI.start('Uploading ....');

      const loginInfo = this.appservices.authStatus;
      const headers = new HttpHeaders().set(
        'Authorization',
        `Bearer ${loginInfo._refreshkey}`
      );

      this.http.post<any>(this.uploadURL, uploadData, { headers }).subscribe(
        (response: any) => {
          this.blockUI.stop();

          if (response && response.success) {
            this.crop_imgae = '';
            Swal.fire({
              title: `<strong style='color:#5c54a0; font-size:30px;'>${response.message}</strong>`,
              html: '<h2>Congratulations</h2><div class="pyro"><div class="before"></div><div class="after"></div></div>',
              icon: 'success',
              allowOutsideClick: true,
            }).then(() => {
              this.stepper.next();
            });
          } else {
            Swal.fire(response.message, '', 'error');
          }
        },
        (error: any) => {
          this.blockUI.stop();
          Swal.fire('Error occurred during file upload', '', 'error');
          console.error('Error occurred during file upload:', error);
        }
      );
    } else {
      if (this.userAllData['user_profile_images'].length === 0) {
        Swal.fire(
          'Warning',
          'Please select or upload at least one photo',
          'warning'
        );
      } else {
        this.stepper.next();
      }
    }
  }
}
