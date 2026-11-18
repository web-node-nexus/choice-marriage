import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComponentRoutingModule } from './component-routing.module';
import { SetupAccountComponent } from './setup-account/setup-account.component';
import { ProfileComponent } from './profile/profile.component';
import { MaterialModule } from '../material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PrimengModule } from '../primeng/primeng.module';
import { CustomDirectiveModule } from '../customDirective/custom-directive.module';
import { CustomPipeModule } from '../customPipe/custom-pipe.module';
import { FindmatchesComponent } from './findmatches/findmatches.component';
import { ProfileCardComponent } from './profile-card/profile-card.component';
import { SubscriptionComponent } from './subscription/subscription.component';
import { PartnerPreferenceComponent } from './partner-preference/partner-preference.component';
import { NotificationComponent } from './notification/notification.component';
import { MemberProfileComponent } from './member-profile/member-profile.component';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { IgnoreProfileListComponent } from './ignore-profile-list/ignore-profile-list.component';
import { ShortlistProfileListComponent } from './shortlist-profile-list/shortlist-profile-list.component';
import { RecommendedMatchesProfileComponent } from './recommended-matches-profile/recommended-matches-profile.component';
import { MatchCirclePogressBarComponent } from './match-circle-pogress-bar/match-circle-pogress-bar.component';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { AgePipe } from '../customPipe/age.pipe';
import { ViewProfileListComponent } from './view-profile-list/view-profile-list.component';
import { NgxPermissionsModule } from 'ngx-permissions';
import { PagesModule } from '../pages/pages.module';
import { MessageAlertComponent } from './message-alert/message-alert.component';
import { MyProfileComponent } from './my-profile/my-profile.component';
import { RequestComponent } from './request/request.component';
import { AcceptanceComponent } from './acceptance/acceptance.component';
import { MyPlanComponent } from './my-plan/my-plan.component';
import { MatchesComponent } from './matches/matches.component';
import { MatchesOptionHolderComponent } from './matches-option-holder/matches-option-holder.component';
import { PaymentPageComponent } from './payment-page/payment-page.component';
import { ContactToAdminComponent } from './contact-to-admin/contact-to-admin.component';
import { PackageInformationComponent } from './package-information/package-information.component';
import { ProfileActivityComponent } from './profile-activity/profile-activity.component';
import { UploadPaymentSlipComponent } from './upload-payment-slip/upload-payment-slip.component';
import { MyExpressionComponent } from './my-expression/my-expression.component';
import { MyMessageComponent } from './my-message/my-message.component';
import { UploadVideoComponent } from './upload-video/upload-video.component';
import { UploadPhotoComponent } from './upload-photo/upload-photo.component';
import { UploadIdProofComponent } from './upload-id-proof/upload-id-proof.component';
import { UploadHoroscopeComponent } from './upload-horoscope/upload-horoscope.component';
import { NearbymeComponent } from './nearbyme/nearbyme.component';
import { MatchofthedayComponent } from './matchoftheday/matchoftheday.component';
import { MessageComponent } from './message/message.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { LikeProfileComponent } from './like-profile/like-profile.component';
import { SharedModule } from '../shared/shared.module';
import { DeleteprofileComponent } from './deleteprofile/deleteprofile.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ContactComponent } from './contact/contact.component';
import { ShowkundaliComponent } from './showkundali/showkundali.component';
import { FormatAnnualPipe } from './my-profile/format-annual.pipe';
import { TimeConversionPipe } from './member-profile/time-conversion.pipe';
import { ShowmeaagaeforhoroscpeComponent } from './showmeaagaeforhoroscpe/showmeaagaeforhoroscpe.component';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { LockprofilealertComponent } from './lockprofilealert/lockprofilealert.component';

@NgModule({
  declarations: [
    SetupAccountComponent,
    ProfileComponent,
    FindmatchesComponent,
    ProfileCardComponent,
    SubscriptionComponent,
    PartnerPreferenceComponent,
    NotificationComponent,
    MemberProfileComponent,
    IgnoreProfileListComponent,
    ShortlistProfileListComponent,
    RecommendedMatchesProfileComponent,
    MatchCirclePogressBarComponent,
    ViewProfileListComponent,
    MessageAlertComponent,
    MyProfileComponent,
    RequestComponent,
    AcceptanceComponent,
    MyPlanComponent,
    MatchesComponent,
    MatchesOptionHolderComponent,
    PaymentPageComponent,
    ContactToAdminComponent,
    PackageInformationComponent,
    ProfileActivityComponent,
    UploadPaymentSlipComponent,
    MyExpressionComponent,
    MyMessageComponent,
    UploadVideoComponent,
    UploadPhotoComponent,
    UploadIdProofComponent,
    UploadHoroscopeComponent,
    NearbymeComponent,
    MatchofthedayComponent,
    MessageComponent,
    LikeProfileComponent,
    DeleteprofileComponent,
    ChangePasswordComponent,
    ContactComponent,
    ShowkundaliComponent,
    FormatAnnualPipe,
    TimeConversionPipe,
    ShowmeaagaeforhoroscpeComponent,
    LockprofilealertComponent

  ],
  imports: [
    CommonModule,
    ComponentRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MaterialModule,
    PrimengModule,
    CustomPipeModule,
    CarouselModule,
    NgCircleProgressModule.forRoot({
      // set defaults here
      radius: 100,
      outerStrokeWidth: 16,
      innerStrokeWidth: 8,
      outerStrokeColor: "#78C000",
      innerStrokeColor: "#C7E596",
      animationDuration: 300
    }),
    NgxPermissionsModule,
    PagesModule,
    SharedModule,
    ImageCropperModule,
    // NgbDropdownModule,
  ],
  exports: [
    PackageInformationComponent,
    ProfileActivityComponent

  ],
  providers: [AgePipe]
})
export class ComponentModule { }
