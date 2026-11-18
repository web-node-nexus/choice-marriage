import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';
import * as moment from 'moment';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ConfirmationService } from 'primeng/api';

import { ApiParameterScript } from 'src/app/script/api-parameter';
import { ApiService } from 'src/app/services/api.service';
import { AppService } from 'src/app/services/app.service';
import { ApproveComponent } from 'src/app/shared/approve/approve.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss'],
})
export class MyProfileComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  // **************************
  allowprofileUpdate: boolean = true;
  editModeActive: boolean = false;
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

  religionOptions: any = [];
  religionCasteOptions: any = [];

  religionSubcasteOptions: any = [];

  aducationalOptions1: any = [];
  aducationalOptions2: any = [];

  ocupationOptions: any = [];

  employeeInOptions: any = [];

  anualIncomeOptions: any = [];

  familystatusOptions: any = [
    { name: 'Rich [ ଧନୀ ]', value: 'Rich' },
    { name: 'Middle Class [ମଧ୍ୟବିତ୍ତ]', value: 'Middle Class' },
    {
      name: 'Upper Middle Class [ଉଚ୍ଚ ମଧ୍ୟବିତ୍ତ]',
      value: 'Upper Middle Class',
    },
    { name: 'Upper Class [ଉଚ୍ଚ ଶ୍ରେଣୀ]', value: 'Upper Class' },
    {
      name: 'Lower Middle Class [ନିମ୍ନ ମଧ୍ୟବିତ୍ତ]',
      value: 'Lower Middle Class',
    },
    {
      name: 'Upper-Lower Class [ଉପର-ନିମ୍ନ ଶ୍ରେଣୀ]',
      value: 'Upper-Lower Class',
    },
    { name: 'Lower Class [ନିମ୍ନ ଶ୍ରେଣୀ]', value: 'Lower Class' },
  ];

  familytypeOptions: any = [
    { name: 'Joint Family' },
    { name: 'Extended Family' },
    { name: 'Single-Parent Family' },
    { name: 'Blended Family' },
    { name: 'Intercultural Family' },
    { name: 'Intergenerational Family' },
    { name: 'Multigenerational Family' },
    { name: 'Stay-at-Home Parent Family' },
  ];

  familyvalueOptions: any = [
    { name: 'Traditional' },
    { name: 'Moderate' },
    { name: 'Doesnot Matter' },
    //{ name: 'Liberal' },
  ];

  mothersac: any = [
    { name: 'Govt employee [State]' },
    { name: 'Govt employee [Central]' },
    { name: 'Retired Govt employee [State]' },
    { name: 'Retired Govt employee [Central]' },
    { name: 'Business Man' },
    { name: 'Farmer' },
    { name: 'Private Company Employee' },
    { name: 'Retired Private Company Employee' },
    { name: 'Late' },
    { name: 'Other' },
    { name: 'House Wife' },
  ];
  fathersoc: any = [
    { name: 'Govt employee [State]' },
    { name: 'Govt employee [Central] ' },
    { name: 'Retired Govt employee [State]' },
    { name: 'Retired Govt employee [Central]' },
    { name: 'Business Man' },
    { name: 'Farmer' },
    { name: 'Private Company Employee' },
    { name: 'Retired Private Company Employee' },
    { name: 'Late' },
    { name: 'Other' },
  ];

  // mothersac: any[] = [
  //   { name: 'Business Owner' },
  //   { name: 'Retired Business Owner' },
  //   { name: 'Entrepreneur' },
  //   { name: 'Retired Entrepreneur' },
  //   { name: 'Professional' },
  //   { name: 'Retired Professional' },
  //   { name: 'Doctor' },
  //   { name: 'Retired Doctor' },
  //   { name: 'Engineer' },
  //   { name: 'Retired Engineer' },
  //   { name: 'Employee' },
  //   { name: 'Retired Employee' },
  //   { name: 'Professor' },
  //   { name: 'Retired Professor' },
  //   { name: 'Accountant' },
  //   { name: 'Retired Accountant' },
  //   { name: 'Financial Advisor' },
  //   { name: 'Retired Financial Advisor' },
  //   { name: 'Architect' },
  //   { name: 'Retired Architect' },
  //   { name: 'Consultant' },
  //   { name: 'Retired Consultant' },
  //   { name: 'Artist' },
  //   { name: 'Retired Artist' },
  //   { name: 'Farmer' },
  //   { name: 'Retired Farmer' },
  //   { name: 'Pilot' },
  //   { name: 'Retired Pilot' },
  //   { name: 'Scientist' },
  //   { name: 'Retired Scientist' },
  //   { name: 'IT Professional' },
  //   { name: 'Retired IT Professional' },
  //   { name: 'Manager' },
  //   { name: 'Retired Manager' },
  //   { name: 'Salesperson' },
  //   { name: 'Retired Salesperson' },
  //   { name: 'Military Personnel' },
  //   { name: 'Retired Military Personnel' },
  //   { name: 'Police Officer' },
  //   { name: 'Retired Police Officer' },
  //   { name: 'Chef' },
  //   { name: 'Retired Chef' },
  //   { name: 'Musician' },
  //   { name: 'Retired Musician' },
  //   { name: 'Writer' },
  //   { name: 'Retired Writer' },
  //   { name: 'Actor' },
  //   { name: 'Retired Actor' },
  //   { name: 'Carpenter' },
  //   { name: 'Retired Carpenter' },
  //   { name: 'Electrician' },
  //   { name: 'Retired Electrician' },
  //   { name: 'Plumber' },
  //   { name: 'Retired Plumber' },
  //   { name: 'Mechanic' },
  //   { name: 'Retired Mechanic' },
  //   { name: 'Driver' },
  //   { name: 'Lete' },
  //   { name: 'House Wife' },
  //   { name: 'Other' },
  // ];

  // fathersoc: any[] = [
  //   { name: 'Business Owner' },
  //   { name: 'Retired Business Owner' },
  //   { name: 'Entrepreneur' },
  //   { name: 'Retired Entrepreneur' },
  //   { name: 'Professional' },
  //   { name: 'Retired Professional' },
  //   { name: 'Doctor' },
  //   { name: 'Retired Doctor' },
  //   { name: 'Engineer' },
  //   { name: 'Retired Engineer' },
  //   { name: 'Employee' },
  //   { name: 'Retired Employee' },
  //   { name: 'Professor' },
  //   { name: 'Retired Professor' },
  //   { name: 'Accountant' },
  //   { name: 'Retired Accountant' },
  //   { name: 'Financial Advisor' },
  //   { name: 'Retired Financial Advisor' },
  //   { name: 'Architect' },
  //   { name: 'Retired Architect' },
  //   { name: 'Consultant' },
  //   { name: 'Retired Consultant' },
  //   { name: 'Artist' },
  //   { name: 'Retired Artist' },
  //   { name: 'Farmer' },
  //   { name: 'Retired Farmer' },
  //   { name: 'Pilot' },
  //   { name: 'Retired Pilot' },
  //   { name: 'Scientist' },
  //   { name: 'Retired Scientist' },
  //   { name: 'IT Professional' },
  //   { name: 'Retired IT Professional' },
  //   { name: 'Manager' },
  //   { name: 'Retired Manager' },
  //   { name: 'Salesperson' },
  //   { name: 'Retired Salesperson' },
  //   { name: 'Military Personnel' },
  //   { name: 'Retired Military Personnel' },
  //   { name: 'Police Officer' },
  //   { name: 'Retired Police Officer' },
  //   { name: 'Chef' },
  //   { name: 'Retired Chef' },
  //   { name: 'Musician' },
  //   { name: 'Retired Musician' },
  //   { name: 'Writer' },
  //   { name: 'Retired Writer' },
  //   { name: 'Actor' },
  //   { name: 'Retired Actor' },
  //   { name: 'Carpenter' },
  //   { name: 'Retired Carpenter' },
  //   { name: 'Electrician' },
  //   { name: 'Retired Electrician' },
  //   { name: 'Plumber' },
  //   { name: 'Retired Plumber' },
  //   { name: 'Mechanic' },
  //   { name: 'Retired Mechanic' },
  //   { name: 'Driver' },
  //   { name: 'Retired Driver' },
  //   { name: 'Lete' },
  //   { name: 'Other' },
  // ];

  noofbrothersisterOptins: any = [
    { name: '0' },
    { name: '1' },
    { name: '2' },
    { name: '3' },
    { name: '4' },
    { name: '5' },
    { name: '6' },
    { name: '7' },
  ];

  countryOption: any = [{ name: 'India' }];

  stateOption: any = [];
  cityOption: any = [];

  dietOptions: any = [
    { name: 'Full Vegetarian' },
    { name: 'Non Vegetarian' },
    { name: 'Occasional Nonveg' },
    { name: 'Eggiterian' },
  ];
  smokingOptions: any = [{ name: 'Yes' }, { name: 'No' }, { name: 'Sometime' }];
  drinkOptions: any = [{ name: 'Yes' }, { name: 'No' }, { name: 'Sometime' }];

  heightOptions: any = [
    { name: 'Below 4ft 6in - 137cm', value: '137' },
    { name: '4ft 6in - 137cm', value: '137' },
    { name: '4ft 7in - 139cm', value: '139' },
    { name: '4ft 8in - 142cm', value: '142' },
    { name: '4ft 9in - 144cm', value: '144' },
    { name: '4ft 10in - 147cm', value: '147' },
    { name: '4ft 11in - 149cm', value: '149' },
    { name: '5ft - 152cm', value: '152' },
    { name: '5ft 1in - 154cm', value: '154' },
    { name: '5ft 2in - 157cm', value: '157' },
    { name: '5ft 3in - 160cm', value: '160' },
    { name: '5ft 4in - 162cm', value: '162' },
    { name: '5ft 5in - 165cm', value: '165' },
    { name: '5ft 6in - 167cm', value: '167' },
    { name: '5ft 7in - 170cm', value: '170' },
    { name: '5ft 8in - 172cm', value: '172' },
    { name: '5ft 9in - 175cm', value: '175' },
    { name: '5ft 10in - 177cm', value: '177' },
    { name: '5ft 11in - 180cm', value: '180' },
    { name: '6ft - 182cm', value: '182' },
    { name: '6ft 1in - 185cm', value: '185' },
    { name: '6ft 2in - 187cm', value: '187' },
    { name: '6ft 3in - 190cm', value: '190' },
    { name: '6ft 4in - 193cm', value: '193' },
    { name: '6ft 5in - 195cm', value: '195' },
    { name: '6ft 6in - 198cm', value: '198' },
    { name: '6ft 7in - 200cm', value: '200' },
    { name: '6ft 8in - 203cm', value: '203' },
    { name: '6ft 9in - 205cm', value: '205' },
    { name: '6ft 10in - 208cm', value: '208' },
    { name: '6ft 11in - 210cm', value: '210' },
    { name: '7ft - 213cm', value: '213' },
    { name: 'Above 7ft - 213cm', value: '213' },
  ];

  weightOptions: any = [
    { name: '20' },
    { name: '21' },
    { name: '22' },
    { name: '23' },
    { name: '24' },
    { name: '25' },
    { name: '26' },
    { name: '27' },
    { name: '28' },
    { name: '29' },
    { name: '30' },
    { name: '31' },
    { name: '32' },
    { name: '33' },
    { name: '34' },
    { name: '35' },
    { name: '36' },
    { name: '37' },
    { name: '38' },
    { name: '39' },
    { name: '40' },
    { name: '41' },
    { name: '42' },
    { name: '43' },
    { name: '44' },
    { name: '45' },
    { name: '46' },
    { name: '47' },
    { name: '48' },
    { name: '49' },
    { name: '50' },
    { name: '51' },
    { name: '52' },
    { name: '53' },
    { name: '54' },
    { name: '55' },
    { name: '56' },
    { name: '57' },
    { name: '58' },
    { name: '59' },
    { name: '60' },
    { name: '61' },
    { name: '62' },
    { name: '63' },
    { name: '64' },
    { name: '65' },
    { name: '66' },
    { name: '67' },
    { name: '68' },
    { name: '69' },
    { name: '70' },
    { name: '71' },
    { name: '72' },
    { name: '73' },
    { name: '74' },
    { name: '75' },
    { name: '76' },
    { name: '77' },
    { name: '78' },
    { name: '79' },
    { name: '80' },
    { name: '81' },
    { name: '82' },
    { name: '83' },
    { name: '84' },
    { name: '85' },
    { name: '86' },
    { name: '87' },
    { name: '88' },
    { name: '89' },
    { name: '90' },
    { name: '91' },
    { name: '92' },
    { name: '93' },
    { name: '94' },
    { name: '95' },
    { name: '96' },
    { name: '97' },
    { name: '98' },
    { name: '99' },
    { name: '100' },
  ];

  bodyTpeOptions: any = [
    { name: 'Average' },
    { name: 'Heavy' },
    { name: 'Slim' },
    { name: 'Athletic' },
    // { name: 'Toned' },
    // { name: 'Petite' },
    // { name: 'Husky' },
    // { name: 'Slim' },
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
    // { name: 'Like Tv Serial' },
    // { name: 'Like Game' },
    // { name: 'Like Book' },
  ];

  stateOption1: any = [];
  cityOption1: any = [];

  profileDetailsForm = new FormGroup({
    profile_id: new FormControl('', [Validators.required]),
    profile_name: new FormControl('', [Validators.required]),
    profile_email: new FormControl('', [Validators.required]),
    profile_phone: new FormControl('', [Validators.required]),
  });

  basicDetailsForm = new FormGroup({
    user_fname: new FormControl('', [Validators.required]),
    user_lname: new FormControl('', [Validators.required]),
    user_email: new FormControl(this.appservices.authStatus.profile_email, [
      Validators.required,
    ]),
    user_phone_no: new FormControl('', [Validators.required]),
    user_profileType: new FormControl('', [Validators.required]),
    user_gender: new FormControl('', [Validators.required]),
    user_mother_toungh: new FormControl('', [Validators.required]),
    user_marital_status: new FormControl('', [Validators.required]),
    user_dob: new FormControl('', [Validators.required]),
    user_whatsapp_no: new FormControl('', [
      Validators.pattern(/^(?:\+?91)?[789]\d{9}$/),
    ]),
  });

  user_religionDetailsForm = new FormGroup({
    user_ID: new FormControl('', []),
    user_religion: new FormControl('', [Validators.required]),
    user_caste: new FormControl('', [Validators.required]),
    user_subcaste: new FormControl('', [Validators.required]),
  });
  education_occupationDetailsForm = new FormGroup({
    user_ID: new FormControl('', []),
    user_occupation: new FormControl('', [Validators.required]),
    user_employed_In: new FormControl('', [Validators.required]),
    user_anual_income: new FormControl('', [Validators.required]),
    user_additional_education: new FormControl('', [Validators.required]),
    user_highest_education: new FormControl('', [Validators.required]),
    user_occupation_details: new FormControl('', [Validators.required]),
    user_occupation_location: new FormControl('', [Validators.required]),
    user_deg: new FormControl('', [Validators.required]),
    completed: new FormControl(1, []),
  });

  userFamilyDetailsForm = new FormGroup({
    user_ID: new FormControl('', []),
    user_family_type: new FormControl('', [Validators.required]),
    user_family_value: new FormControl('', [Validators.required]),
    user_family_status: new FormControl('', [Validators.required]),
    user_father_name: new FormControl('', [Validators.required]),
    user_mother_name: new FormControl('', [Validators.required]),
    user_father_occupation: new FormControl('', [Validators.required]),
    user_mothers_occupation: new FormControl('', [Validators.required]),
    user_no_of_unmarried_brother: new FormControl('', [Validators.required]),
    user_no_of_unmarried_sister: new FormControl('', [Validators.required]),
    user_no_of_married_sister: new FormControl('', [Validators.required]),
    user_no_of_married_brother: new FormControl('', [Validators.required]),
    completed: new FormControl(1, []),
  });

  locationDetailsForm = new FormGroup({
    user_ID: new FormControl('', []),
    user_country: new FormControl('', [Validators.required]),
    user_state: new FormControl('', [Validators.required]),
    user_city: new FormControl('', [Validators.required]),
    user_Address: new FormControl(''),
    user_Permanent_Address: new FormControl(''),
    user_current_and_permanent_address_same: new FormControl('No', [
      Validators.required,
    ]),
    user_Permanent_city: new FormControl('', [Validators.required]),
    user_Permanent_state: new FormControl('', [Validators.required]),
    user_Permanent_country: new FormControl('', [Validators.required]),
    completed: new FormControl(1, []),
  });
  userAboutDetailsForm = new FormGroup({
    user_ID: new FormControl('', []),
    user_about: new FormControl('', [Validators.required]),
    completed: new FormControl(1, []),
  });

  habitHobbiesForm = new FormGroup({
    user_ID: new FormControl('', []),
    user_diet: new FormControl('', [Validators.required]),
    user_smoking: new FormControl('', [Validators.required]),
    user_drinking: new FormControl('', [Validators.required]),
    user_like: new FormControl('', [Validators.required]),
    completed: new FormControl(1, []),
  });

  physicalDeatilsForm = new FormGroup({
    user_ID: new FormControl('', []),
    user_height: new FormControl('', [Validators.required]),
    user_weight: new FormControl('', [Validators.required]),
    user_body_type: new FormControl('', [Validators.required]),
    user_complextion: new FormControl('', [Validators.required]),
    user_physical_status: new FormControl('', [Validators.required]),
    completed: new FormControl(1, []),
  });

  partnerPreferenceForm = new FormGroup({
    user_ID: new FormControl('', []),
    user_height: new FormControl([], [Validators.required]),
    user_religion: new FormControl([], [Validators.required]),
    user_country: new FormControl([], [Validators.required]),
    user_marital_status: new FormControl([], [Validators.required]),
    user_state: new FormControl([], [Validators.required]),
    user_city: new FormControl([], [Validators.required]),
    user_employed_In: new FormControl([], [Validators.required]),
    user_occupation: new FormControl([], [Validators.required]),
    user_mother_toungh: new FormControl([], [Validators.required]),
    user_min_anual_income: new FormControl('', [Validators.required]),
    user_max_anual_income: new FormControl('', [Validators.required]),
  });
  horoscopeForm = new FormGroup({
    user_id: new FormControl('', []),
    user_horoscope: new FormControl('Yes', [Validators.required]),
    user_mangalik: new FormControl('Yes', [Validators.required]),
    user_dateoftime: new FormControl('', [Validators.required]),
    user_dateofplace: new FormControl('', [Validators.required]),
    user_gotra: new FormControl('', [Validators.required]),
    user_zodiacs: new FormControl('', [Validators.required]),
    user_nakhyatra: new FormControl('', [Validators.required]),
    completed: new FormControl(1, []),
  });

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

  imgURL: any;
  userAllData: any;
  user_privacy: any;
  user_privacystatu: any = 'show';
  profile_image: any;

  degOptions: any;
  curentadress: any;
  permanetadress: any;
  domaboutus: any;
  constructor(
    public appservices: AppService,
    private ApiParameterScript: ApiParameterScript,
    private router: Router,
    private confirmationService: ConfirmationService,
    public NgbModal: NgbModal
  ) {
    this.imgURL = this.appservices.getFilePath();
    this.loadingStaticDropDownData();
  }

  ngOnInit(): void {
    //this.profile_image = this.appservices.authProfile.user_info.user_profile_image;
    this.fathersoc.sort((a: any, b: any) => a.name.localeCompare(b.name));
    this.mothersac.sort((a: any, b: any) => a.name.localeCompare(b.name));

    var profileApiData = {
      projection: ['*'],
      whereConditions: { user_ID: this.appservices.authStatus.profile_id },
      orderBy: 'id',
      orderType: 'desc',
    };

    this.ApiParameterScript.fetchdata(
      'user_profile_images',
      profileApiData
    ).subscribe((getprofile_res: any) => {
      console.log('profile Image', getprofile_res);

      if (getprofile_res.success && getprofile_res['data'].length > 0) {
        let profile_image_array = getprofile_res['data'].map((ele: any) => {
          return ele.user_profile_images;
        });
        if (
          profile_image_array.includes(
            this.appservices.authProfile.user_info.user_profile_image
          )
        ) {
          this.profile_image =
            this.appservices.authProfile.user_info.user_profile_image;
        } else {
          this.profile_image = profile_image_array[0];
        }

        this.showupload = false;
        getprofile_res.data.forEach((element: any) => {
          this.actualUploadedFiles.push({
            previewImageSrc: `${this.appservices.getFilePath()}${
              element.user_profile_images
            }`,
            thumbnailImageSrc: `${this.appservices.getFilePath()}${
              element.user_profile_images
            }`,
            alt: element.user_profile_images,
            title: element.user_profile_images,
          });
          this.selecteduploadedFiles.push({
            previewImageSrc: `${this.appservices.getFilePath()}${
              element.user_profile_images
            }`,
            thumbnailImageSrc: `${this.appservices.getFilePath()}${
              element.user_profile_images
            }`,
            alt: element.user_profile_images,
            title: element.user_profile_images,
          });
        });
      } else {
      }
    });
    this.uploadURL = `${this.appservices.getApipath()}upload?q=${
      this.appservices.authStatus.profile_id
    }`;
    this.profile = this.appservices.authStatus;
    this.profileDetailsForm.patchValue(this.appservices.authStatus);
    this.blockUI.start('Loading...');
    this.ApiParameterScript.getprofile({
      userid: this.appservices.authStatus.profile_id,
    }).subscribe((res: any) => {
      this.blockUI.stop();
      if (res.success) {
        this.userAllData = res;

        this.user_privacy =
          res['user_info'].user_privacy == 'public' ? true : false;
        this.user_privacystatu = res['user_info'].user_privacy;
        this.user_religionDetailsForm.patchValue(res['user_religion']);
        this.education_occupationDetailsForm.patchValue(
          res['user_education_occupations']
        );
        this.userAboutDetailsForm.patchValue(res['user_about']);
        this.domaboutus = this.userAboutDetailsForm.value.user_about;
        this.locationDetailsForm.patchValue(res['user_locations']);
        this.curentadress = this.locationDetailsForm.value.user_Address;
        this.permanetadress = this.locationDetailsForm.value.user_Permanent_Address;
        this.userFamilyDetailsForm.patchValue(res['user_family']);
        this.habitHobbiesForm.patchValue(res['user_diet_hobbies']);
        this.physicalDeatilsForm.patchValue(res['user_physical_details']);
        this.horoscopeForm.patchValue(res['user_horoscope_deatils']);

        this.partnerPreferenceForm.patchValue(
          res['user_partnerpreference']['json_data']
            ? JSON.parse(res['user_partnerpreference']['json_data'])
            : {}
        );
        this.basicDetailsForm.patchValue(res['user_info']);
        this.basicDetailsForm
          .get('user_dob')
          ?.setValue(
            moment(this.basicDetailsForm.value.user_dob)
              .format('YYYY-MM-DD')
              .toString()
          );
        // this.getstatefilter(this.partnerPreferenceForm.value.user_country)
        // this.getcityfilter(this.partnerPreferenceForm.value.user_state)
        // this.getSubcaste(this.use)
        this.user_religionDetailsForm.updateValueAndValidity();
        console.log(res['user_info']);
      } else {
      }
    });
  }
  generateAboutUs(): void {
    // Generate the content for the "About Me" textarea (replace this with your actual content generation logic)
    let aboutMeContent =
      "I'm a [Your Age] year old [Your Gender], residing in [Your Current Location]. Professionally, I'm a [Your Occupation] with [Number of Years] years of experience. I'm passionate about [Your Interests/Hobbies] and value spending quality time with loved ones. I'm [Personality Trait 1], [Personality Trait 2], and [Personality Trait 3]. Seeking a life partner who shares similar values, respects traditions, and believes in mutual understanding. I believe in the sanctity of marriage and look forward to building a loving, respectful, and fulfilling relationship based on trust and companionship.";
    this.userAboutDetailsForm.patchValue({
      user_about: aboutMeContent,
    });
  }
  loadingStaticDropDownData() {
    this.ApiParameterScript.fetchdata(
      'country',
      { projection: ['*'], whereConditions: { status: 1 } },
      0,
      250
    ).subscribe((res: any) => {
      //
      if (res.success && res['data'].length > 0) {
        this.countryOption = res['data'].map((obj: any) => {
          if (obj.status == 1) {
            return { name: obj.name };
          } else {
            return null;
          }
        });
        this.countryOption.sort((a: any, b: any) =>
          a.name.localeCompare(b.name)
        );
      }
    });
    this.ApiParameterScript.fetchdata('annual_income', {
      projection: ['*'],
      whereConditions: { status: 1 },
    }).subscribe((res: any) => {
      if (res.success && res['data'].length > 0) {
        console.log('anual', this.anualIncomeOptions);

        this.anualIncomeOptions = res['data'].map((obj: any) => {
          if (obj.status == 1) {
            return {
              name: obj.amount + ' ' + obj.annualincome_text,
              value: obj.annualincome,
            };
          } else {
            return null;
          }
        });
        this.anualIncomeOptions.sort((a: any, b: any) => a.value - b.value);
      }
    });

    this.ApiParameterScript.fetchdata('additional_education', {
      projection: ['*'],
      whereConditions: { status: 1 },
    }).subscribe((res: any) => {
      if (res.success && res['data'].length > 0) {
        this.aducationalOptions2 = res['data'].map((obj: any) => {
          if (obj.status == 1) {
            return { name: obj.additional_education_name };
          } else {
            return null;
          }
        });
        this.aducationalOptions2.sort((a: any, b: any) =>
          a.name.localeCompare(b.name)
        );
      }
    });

    this.ApiParameterScript.fetchdata('mother_tongue', {
      projection: ['*'],
      whereConditions: { status: 1 },
    }).subscribe((res: any) => {
      if (res.success && res['data'].length > 0) {
        this.motherTounghOptions = res['data'].map((obj: any) => {
          if (obj.status == 1) {
            return { name: obj.mother_tongue_name };
          } else {
            return null;
          }
        });
        this.motherTounghOptions.sort((a: any, b: any) =>
          a.name.localeCompare(b.name)
        );
      }
    });

    this.ApiParameterScript.fetchdata('highest_education', {
      projection: ['*'],
      whereConditions: { status: 1 },
    }).subscribe((res: any) => {
      //
      if (res.success && res['data'].length > 0) {
        this.aducationalOptions1 = res['data'].map((obj: any) => {
          if (obj.status == 1) {
            return { name: obj.highest_education_name };
          } else {
            return null;
          }
        });
        this.aducationalOptions1.sort((a: any, b: any) =>
          a.name.localeCompare(b.name)
        );
      }
    });

    this.ApiParameterScript.fetchdata('employer_in', {
      projection: ['*'],
      whereConditions: { status: 1 },
    }).subscribe((res: any) => {
      //

      if (res.success && res['data'].length > 0) {
        this.employeeInOptions = res['data'].map((obj: any) => {
          if (obj.status == 1) {
            return { name: obj.Employer_in_name };
          } else {
            return null;
          }
        });
        this.employeeInOptions.sort((a: any, b: any) =>
          a.name.localeCompare(b.name)
        );
      }
    });

    this.ApiParameterScript.fetchdata('designation', {
      projection: ['*'],
      whereConditions: { status: 1 },
    }).subscribe((res: any) => {
      //

      if (res.success && res['data'].length > 0) {
        this.degOptions = res['data'].map((obj: any) => {
          if (obj.status == 1) {
            return { name: obj.designation };
          } else {
            return null;
          }
        });
        this.degOptions.sort((a: any, b: any) => a.name.localeCompare(b.name));
      }
    });

    this.ApiParameterScript.fetchdata('occupation', {
      projection: ['*'],
      whereConditions: { status: 1 },
    }).subscribe((res: any) => {
      //
      if (res.success && res['data'].length > 0) {
        this.ocupationOptions = res['data'].map((obj: any) => {
          if (obj.status == 1) {
            return { name: obj.occupation_name };
          } else {
            return null;
          }
        });
        this.ocupationOptions.sort((a: any, b: any) =>
          a.name.localeCompare(b.name)
        );
      }
    });

    this.ApiParameterScript.fetchdata('like_detalis', {
      projection: ['*'],
      whereConditions: { status: 1 },
    }).subscribe((res: any) => {
      //
      if (res.success && res['data'].length > 0) {
        this.likeOption = res['data'].map((obj: any) => {
          if (obj.status == 1) {
            return { name: obj.Like_name };
          } else {
            return null;
          }
        });
        this.likeOption.sort((a: any, b: any) => a.name.localeCompare(b.name));
      }
    });

    this.ApiParameterScript.fetchdata('religion', {
      projection: ['*'],
      whereConditions: { status: 1 },
    }).subscribe((res: any) => {
      //
      if (res.success && res['data'].length > 0) {
        this.religionOptions = res['data'].map((obj: any) => {
          if (obj.status == 1) {
            return { name: obj.religion_name };
          } else {
            return null;
          }
        });
        this.religionOptions.sort((a: any, b: any) =>
          a.name.localeCompare(b.name)
        );
      }
    });

    this.ApiParameterScript.fetchdata('cast_table', {
      projection: ['*'],
      whereConditions: { status: 1 },
    }).subscribe((res: any) => {
      //
      if (res.success && res['data'].length > 0) {
        this.religionCasteOptions = res['data'].map((obj: any) => {
          if (obj.status == 1) {
            return { name: obj.cast_name };
          } else {
            return null;
          }
        });
        this.religionCasteOptions.sort((a: any, b: any) =>
          a.name.localeCompare(b.name)
        );
      }
    });

    this.ApiParameterScript.fetchdata('gotra', { projection: ['*'] }).subscribe(
      (res: any) => {
        //
        if (res.success && res['data'].length > 0) {
          this.gotraOption = res['data'].map((obj: any) => {
            if (obj.status == 1) {
              return { name: obj.name };
            } else {
              return null;
            }
          });
          this.gotraOption.sort((a: any, b: any) =>
            a.name.localeCompare(b.name)
          );
        }
      }
    );
    this.ApiParameterScript.fetchdata('nakshatra', {
      projection: ['*'],
    }).subscribe((res: any) => {
      //
      if (res.success && res['data'].length > 0) {
        this.nakhyatraOption = res['data'].map((obj: any) => {
          if (obj.status == 1) {
            return { name: obj.nakshatra_name };
          } else {
            return null;
          }
        });
        this.nakhyatraOption.sort((a: any, b: any) =>
          a.name.localeCompare(b.name)
        );
      }
    });

    this.ApiParameterScript.fetchdata('zodiacs', {
      projection: ['*'],
      whereConditions: { status: 1 },
    }).subscribe((res: any) => {
      if (res.success && res['data'].length > 0) {
        this.zodiacsOptions = res['data'].map((obj: any) => {
          return { name: obj.name, display: `${obj.name} / ${obj.odia_name}` };
        });
        this.zodiacsOptions.sort((a: any, b: any) =>
          a.name.localeCompare(b.name)
        );
      }
    });

    this.ApiParameterScript.fetchdata('user_education_occupations', {
      projection: ['*'],
      whereConditions: { user_ID: this.appservices.authStatus.profile_id },
    }).subscribe((res: any) => {
      if (res.success && res['data'].length > 0) {
        this.education_occupationDetailsForm.patchValue(res['data'][0]);
      }
    });
  }

  updatebasicDetailsForm() {
    if (this.basicDetailsForm.valid) {
      var updateData = {
        data: {
          user_fname: this.basicDetailsForm.value.user_fname,
          user_lname: this.basicDetailsForm.value.user_lname,
          user_email: this.basicDetailsForm.value.user_email,
          user_profileType: this.basicDetailsForm.value.user_profileType,
          user_gender: this.basicDetailsForm.value.user_gender,
          user_mother_toungh: this.basicDetailsForm.value.user_mother_toungh,
          user_marital_status: this.basicDetailsForm.value.user_marital_status,
          user_dob: moment(this.basicDetailsForm.value.user_dob)
            .format('YYYY-MM-DD')
            .toString(),
          user_whatsapp_no: this.basicDetailsForm.value.user_whatsapp_no,
          user_has_complete_profile: 1,
        },
        whereConditions: {
          user_id: this.appservices.authStatus.profile_id,
        },
      };
      console.log(updateData);

      this.ApiParameterScript.updatedata('user_info', updateData).subscribe(
        (res: any) => {
          if (res.success) {
            Swal.fire('', res.message, 'success').then(() => {
              this.ngOnInit();
            });
          } else {
            Swal.fire('No Data Updated', res.message, 'error');
          }
        }
      );
    } else {
      Swal.fire('Warning', 'Please Fill All Input Fields', 'warning');
    }
  }
  religionDetailsForm() {
    if (this.user_religionDetailsForm.valid) {
      var updateData = {
        data: {
          user_religion: this.user_religionDetailsForm.value.user_religion,
          user_caste: this.user_religionDetailsForm.value.user_caste,
          user_subcaste: this.user_religionDetailsForm.value.user_subcaste,
          user_ID: this.appservices.authStatus.profile_id,
          completed: 1,
        },
        whereConditions: { user_ID: this.appservices.authStatus.profile_id },
      };

      if (this.user_religionDetailsForm.value.user_ID == '') {
        this.ApiParameterScript.savedata('user_religion', updateData).subscribe(
          (res: any) => {
            if (res.success) {
              Swal.fire('', res.message, 'success').then(() => {
                this.ngOnInit();
              });
            } else {
              Swal.fire('No Data Updated', res.message, 'error');
            }
          }
        );
      } else {
        this.ApiParameterScript.updatedata(
          'user_religion',
          updateData
        ).subscribe((res: any) => {
          if (res.success) {
            Swal.fire('', res.message, 'success').then(() => {
              this.ngOnInit();
            });
          } else {
            Swal.fire('No Data Updated', res.message, 'error');
          }
        });
      }
    } else {
      Swal.fire('Warning', 'Please Fill All Input Fields', 'warning');
    }
  }
  updateEducation_ocupation() {
    if (this.education_occupationDetailsForm.valid) {
      this.education_occupationDetailsForm.value['completed'] = 1;

      if (this.education_occupationDetailsForm.value.user_ID == '') {
        this.education_occupationDetailsForm.value['user_ID'] =
          this.appservices.authStatus.profile_id;
        var saveData = {
          data: this.education_occupationDetailsForm.value,
        };

        this.ApiParameterScript.savedata(
          'user_education_occupations',
          saveData
        ).subscribe((res: any) => {
          if (res.success) {
            Swal.fire('', res.message, 'success').then(() => {
              this.ngOnInit();
            });
          } else {
            Swal.fire('No Data Updated', res.message, 'error');
          }
        });
      } else {
        var updateData = {
          data: this.education_occupationDetailsForm.value,
          whereConditions: { user_ID: this.appservices.authStatus.profile_id },
        };
        this.education_occupationDetailsForm.value['user_ID'] =
          this.appservices.authStatus.profile_id;
        this.ApiParameterScript.updatedata(
          'user_education_occupations',
          updateData
        ).subscribe((res: any) => {
          if (res.success) {
            Swal.fire('', res.message, 'success').then(() => {
              this.ngOnInit();
            });
          } else {
            Swal.fire('No Data Updated', res.message, 'error');
          }
        });
      }
    } else {
      Swal.fire('Warning', 'Please Fill All Input Fields', 'warning');
    }
  }

  updateLocationForm() {
    if (this.locationDetailsForm.valid) {
      this.locationDetailsForm.value['completed'] = 1;

      if (this.locationDetailsForm.value.user_ID == '') {

        this.locationDetailsForm.value['user_ID'] =
          this.appservices.authStatus.profile_id;
        var saveData = {
          data: this.locationDetailsForm.value,
        };
        this.ApiParameterScript.savedata('user_locations', saveData).subscribe(
          (res: any) => {
            if (res.success) {
              Swal.fire('', res.message, 'success').then(() => {
                this.ngOnInit();
              });
            } else {
              Swal.fire('No Data Updated', res.message, 'error');
            }
          }
        );
      } else {
        var updateData = {
          data: this.locationDetailsForm.value,
          whereConditions: { user_ID: this.appservices.authStatus.profile_id },
        };
        this.locationDetailsForm.value['user_ID'] =
          this.appservices.authStatus.profile_id;
        this.ApiParameterScript.updatedata(
          'user_locations',
          updateData
        ).subscribe((res: any) => {
          if (res.success) {
            Swal.fire('', res.message, 'success').then(() => {
              this.ngOnInit();
            });
          } else {
            Swal.fire('No Data Updated', res.message, 'error');
          }
        });
      }
    } else {
      Swal.fire('Warning', 'Please Fill All Input Fields', 'warning');
    }
  }

  onchangeAddress() {
    if (
      this.locationDetailsForm.value.user_current_and_permanent_address_same ==
      'Yes'
    ) {
      this.locationDetailsForm.value['user_Permanent_city'] =
        this.locationDetailsForm.value['user_city'];
      this.locationDetailsForm.value['user_Permanent_state'] =
        this.locationDetailsForm.value['user_state'];
      this.locationDetailsForm.value['user_Permanent_country'] =
        this.locationDetailsForm.value['user_country'];
      this.locationDetailsForm.value['user_Permanent_Address'] =
        this.locationDetailsForm.value['user_Address'];
    } else {
      this.locationDetailsForm.value['user_Permanent_city'] = null;
      this.locationDetailsForm.value['user_Permanent_state'] = null;
      this.locationDetailsForm.value['user_Permanent_country'] = null;
      this.locationDetailsForm.value['user_Permanent_Address'] = null;
    }

    this.locationDetailsForm.patchValue(this.locationDetailsForm.value);
  }

  updatefamilyDetailsForm() {
    if (this.userFamilyDetailsForm.valid) {
      this.userFamilyDetailsForm.value['completed'] = 1;
      if (this.userFamilyDetailsForm.value.user_ID == '') {
        this.userFamilyDetailsForm.value['user_ID'] =
          this.appservices.authStatus.profile_id;
        var updateData = {
          data: this.userFamilyDetailsForm.value,
          whereConditions: { user_ID: this.appservices.authStatus.profile_id },
        };

        this.ApiParameterScript.savedata('user_family', updateData).subscribe(
          (res: any) => {
            if (res.success) {
              Swal.fire('', res.message, 'success').then(() => {
                this.ngOnInit();
              });
            } else {
              Swal.fire('No Data Updated', res.message, 'error');
            }
          }
        );
      } else {
        var updateData = {
          data: this.userFamilyDetailsForm.value,
          whereConditions: { user_ID: this.appservices.authStatus.profile_id },
        };
        this.ApiParameterScript.updatedata('user_family', updateData).subscribe(
          (res: any) => {
            if (res.success) {
              Swal.fire('', res.message, 'success').then(() => {
                this.ngOnInit();
              });
            } else {
              Swal.fire('No Data Updated', res.message, 'error');
            }
          }
        );
      }
    } else {
      Swal.fire('Warning', 'Please Fill All Input Fields', 'warning');
    }
  }

  updateHoroscopeForm_submit() {
    if (this.horoscopeForm.valid) {
      this.horoscopeForm.value['completed'] = 1;
      if (this.horoscopeForm.value.user_id == '') {
        this.horoscopeForm.value['user_id'] =
          this.appservices.authStatus.profile_id;
        var updateData = {
          data: this.horoscopeForm.value,
          whereConditions: { user_ID: this.appservices.authStatus.profile_id },
        };

        this.ApiParameterScript.savedata(
          'user_horoscope',
          updateData
        ).subscribe((res: any) => {
          if (res.success) {
            Swal.fire('', res.message, 'success').then(() => {
              this.ngOnInit();
            });
          } else {
            Swal.fire('No Data Updated', res.message, 'error');
          }
        });
      } else {
        var updateData = {
          data: this.horoscopeForm.value,
          whereConditions: { user_ID: this.appservices.authStatus.profile_id },
        };
        this.ApiParameterScript.updatedata(
          'user_horoscope',
          updateData
        ).subscribe((res: any) => {
          if (res.success) {
            Swal.fire('', res.message, 'success').then(() => {
              this.ngOnInit();
            });
          } else {
            Swal.fire('No Data Updated', res.message, 'error');
          }
        });
      }
    } else {
      Swal.fire('Warning', 'Please Fill All Input Fields', 'warning');
    }
  }

  diethobbiesForm() {
    if (this.habitHobbiesForm.valid) {
      this.habitHobbiesForm.value['completed'] = 1;
      if (this.habitHobbiesForm.value.user_ID == '') {
        this.habitHobbiesForm.value['user_ID'] =
          this.appservices.authStatus.profile_id;

        var updateData = {
          data: this.habitHobbiesForm.value,
          whereConditions: { user_ID: this.appservices.authStatus.profile_id },
        };

        this.ApiParameterScript.savedata(
          'user_diet_hobbies',
          updateData
        ).subscribe((res: any) => {
          if (res.success) {
            Swal.fire('', res.message, 'success').then(() => {
              this.ngOnInit();
            });
          } else {
            Swal.fire('No Data Updated', res.message, 'error');
          }
        });
      } else {
        var updateData = {
          data: this.habitHobbiesForm.value,
          whereConditions: { user_ID: this.appservices.authStatus.profile_id },
        };
        this.ApiParameterScript.updatedata(
          'user_diet_hobbies',
          updateData
        ).subscribe((res: any) => {
          if (res.success) {
            Swal.fire('', res.message, 'success').then(() => {
              this.ngOnInit();
            });
          } else {
            Swal.fire('No Data Updated', res.message, 'error');
          }
        });
      }
    } else {
      Swal.fire('Warning', 'Please Fill All Input Fields', 'warning');
    }
  }

  userAboutFormSubmit() {
    if (this.userAboutDetailsForm.valid) {
      this.userAboutDetailsForm.value['completed'] = 1;
      var updateData = {
        data: {
          user_ID: this.appservices.authStatus.profile_id,
          completed: 1,
          user_about: this.userAboutDetailsForm.value.user_about,
        },
        // "whereConditions": { user_ID: this.appservices.authStatus.profile_id }
      };

      if (this.userAboutDetailsForm.value.user_ID == '') {
        this.ApiParameterScript.savedata('user_about', updateData).subscribe(
          (res: any) => {
            if (res.success) {
              Swal.fire('', res.message, 'success').then(() => {
                this.ngOnInit();
              });
            } else {
              Swal.fire('No Data Updated', res.message, 'error');
            }
          }
        );
      } else {
        this.ApiParameterScript.updatedata('user_about', updateData).subscribe(
          (res: any) => {
            if (res.success) {
              Swal.fire('', res.message, 'success').then(() => {
                this.ngOnInit();
              });
            } else {
              Swal.fire('No Data Updated', res.message, 'error');
            }
          }
        );
      }
    } else {
      Swal.fire('Warning', 'Please Fill All Input Fields', 'warning');
    }
  }

  userPhysicaldetalsForm() {
    if (this.physicalDeatilsForm.valid) {
      this.physicalDeatilsForm.value['completed'] = 1;
      if (this.physicalDeatilsForm.value.user_ID == '') {
        this.physicalDeatilsForm.value['user_ID'] =
          this.appservices.authStatus.profile_id;
        var updateData = {
          data: this.physicalDeatilsForm.value,
          whereConditions: { user_ID: this.appservices.authStatus.profile_id },
        };

        this.ApiParameterScript.savedata(
          'user_physical_details',
          updateData
        ).subscribe((res: any) => {
          if (res.success) {
            Swal.fire('', res.message, 'success').then(() => {
              this.ngOnInit();
            });
          } else {
            Swal.fire('No Data Updated', res.message, 'error');
          }
        });
      } else {
        var updateData = {
          data: this.physicalDeatilsForm.value,
          whereConditions: { user_ID: this.appservices.authStatus.profile_id },
        };
        this.ApiParameterScript.updatedata(
          'user_physical_details',
          updateData
        ).subscribe((res: any) => {
          if (res.success) {
            Swal.fire('', res.message, 'success').then(() => {
              this.ngOnInit();
            });
          } else {
            Swal.fire('No Data Updated', res.message, 'error');
          }
        });
      }
    } else {
      Swal.fire('Warning', 'Please Fill All Input Fields', 'warning');
    }
  }

  onUpload(event: any) {
    var res = event.originalEvent['body'];

    if (res.success) {
      this.selecteduploadedFiles = [];
      var getAllFile = res['data'] ? res['data'] : '';
      var uloadedImageFile = getAllFile.split(',');

      this.profileImage = `${this.appservices.getFilePath()}${
        uloadedImageFile[0]
      }`;
      uloadedImageFile.forEach((img: any) => {
        this.images.push({
          previewImageSrc: `${this.appservices.getFilePath()}${img}`,
          thumbnailImageSrc: `${this.appservices.getFilePath()}${img}`,
          alt: '01673172483.jpg',
          title: '01673172483.jpg',
        });
      });
      for (let file of event.files) {
        this.uploadedFiles.push(file);
      }

      Swal.fire('Success', res.message, 'success').then((r) => {
        this.ngOnInit();
      });

      // this.messageService.add({ severity: 'success', summary: 'success', detail: res.msg });
    } else {
      Swal.fire(res.message, 'Please Try After Follow Instruction', 'error');
      // this.messageService.add({ severity: 'error', summary: 'error', detail: res.msg });
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

  activeAccount() {
    this.blockUI.start('Please Wait...');
    var upadteData: any = {
      data: { user_ready_for_active_account: 1 },
      whereConditions: {
        user_id: this.appservices.authStatus.profile_id,
      },
    };
    this.ApiParameterScript.updatedata('user_info', upadteData).subscribe(
      (res: any) => {
        this.blockUI.stop();
        if (res.success) {
          Swal.fire(
            'Congratulations',
            'You succesfully send a request to active your account',
            'success'
          ).then((res: any) => {
            this.router.navigate(['/search_match']);
          });
        } else {
          Swal.fire('Surry', res.message, 'error');
        }
      }
    );
  }

  deleteImage(image: any) {
    this.confirmationService.confirm({
      message: 'Are You Sure You Want Delete This Images ?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        // const imageFileNeedToUpdate = this.actualUploadedFiles.filter((obj) => obj.title !== image.title).map((obj) => obj.title);
        // var apiData = {
        //   "data": {"user_profile_images":image},
        //   "whereConditions": {user_ID:this.appservices.authStatus.profile_id}
        // }
        // this.blockUI.start("Deleting...")
        // this.ApiParameterScript.deletedata("user_profile_images", apiData).subscribe((res: any) => {
        //
        //   if(res.success){
        //     Swal.fire('Success','Delet Successfull','success')
        //   }
        // })
      },
    });
  }

  getSubcaste(caste: any) {
    console.log('Calling getSubcaste', caste);

    this.ApiParameterScript.fetchdata('sub_cast', {
      projection: ['*'],
      whereConditions: { cast_name: caste },
    }).subscribe((res: any) => {
      //
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
    if (_.isArray(country_name)) {
      let query = `SELECT * FROM state WHERE status=1 AND country_name IN (${
        "'" + country_name.join("', '") + "'"
      })`;
      this.ApiParameterScript.fetchDataFormQuery(query).subscribe(
        (res: any) => {
          if (res.success && res['data'].length > 0) {
            this.stateOption = res['data'].map((obj: any) => {
              return { name: obj.name };
            });
            this.stateOption.sort((a: any, b: any) =>
              a.name.localeCompare(b.name)
            );
          } else {
            this.stateOption = [];
            this.partnerPreferenceForm.controls.user_state.reset();
          }
        }
      );
    } else {
      this.ApiParameterScript.fetchdata('state', {
        projection: ['*'],
        whereConditions: { country_name: country_name, status: 1 },
      }).subscribe((res: any) => {
        if (res.success && res['data'].length > 0) {
          this.stateOption = res['data'].map((obj: any) => {
            return { name: obj.name };
          });
          this.stateOption.sort((a: any, b: any) =>
            a.name.localeCompare(b.name)
          );
        } else {
          this.stateOption = [];
          this.partnerPreferenceForm.controls.user_state.reset();
        }
      });
    }
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
            this.partnerPreferenceForm.controls.user_city.reset();
          }
        }
      );
    } else {
      this.ApiParameterScript.fetchdata('city', {
        projection: ['*'],
        whereConditions: { state_name: state_name },
      }).subscribe((res: any) => {
        if (res.success && res['data'].length > 0) {
          this.cityOption = res['data'].map((obj: any) => {
            return { name: obj.city_name };
          });
          this.cityOption.sort((a: any, b: any) =>
            a.name.localeCompare(b.name)
          );
        } else {
          this.cityOption = [];
          this.partnerPreferenceForm.controls.user_city.reset();
        }
      });
    }
  }

  public profilePrivacy() {
    this.blockUI.start('Please wait...');
    this.ApiParameterScript.updatedata('user_info', {
      data: { user_privacy: this.user_privacy ? 'private' : 'public' },
      whereConditions: { user_id: this.appservices.authStatus.profile_id },
    }).subscribe((res: any) => {
      this.ngOnInit();
      console.log(res);
      this.blockUI.stop();
    });
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
            this.partnerPreferenceForm.controls.user_state.reset();
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
        10000000
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
          this.partnerPreferenceForm.controls.user_state.reset();
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
            this.partnerPreferenceForm.controls.user_city.reset();
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
        100000000000
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
          this.partnerPreferenceForm.controls.user_city.reset();
        }
      });
    }
  }
  adminApprove(
    id: any,
    value: any,
    gender: any,
    mobile: any,
    whatsap: any,
    gamil: any
  ) {
    const modalRef = this.NgbModal.open(ApproveComponent, {
      size: 'sm',
      backdrop: 'static',
    });
    modalRef.componentInstance.user_Data = {
      id,
      value,
      gender,
      mobile,
      whatsap,
      gamil,
    };
  }
}
