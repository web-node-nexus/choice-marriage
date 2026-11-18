import { NgModule } from '@angular/core';
import { ActivatedRouteSnapshot, RouterModule, RouterStateSnapshot, Routes } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';
import { FindmatchesComponent } from './findmatches/findmatches.component';
import { IgnoreProfileListComponent } from './ignore-profile-list/ignore-profile-list.component';
import { MemberProfileComponent } from './member-profile/member-profile.component';
import { ProfileComponent } from './profile/profile.component';
import { SetupAccountComponent } from './setup-account/setup-account.component';
import { ShortlistProfileListComponent } from './shortlist-profile-list/shortlist-profile-list.component';
import { ViewProfileListComponent } from './view-profile-list/view-profile-list.component';
import { PartnerPreferenceComponent } from './partner-preference/partner-preference.component';
import { HomeComponent } from '../pages/home/home.component';
import { PermissionGuard } from '../auth/permission.guard';
import { Roles } from '../auth/roles.enum';
import { Permission } from '../auth/permissions.enum';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { MessageAlertComponent } from './message-alert/message-alert.component';
import { MyProfileComponent } from './my-profile/my-profile.component';
import { RequestComponent } from './request/request.component';
import { AcceptanceComponent } from './acceptance/acceptance.component';
import { MyPlanComponent } from './my-plan/my-plan.component';
import { MatchesComponent } from './matches/matches.component';
import { ContactToAdminComponent } from './contact-to-admin/contact-to-admin.component';
import { UploadPaymentSlipComponent } from './upload-payment-slip/upload-payment-slip.component';
import { MyExpressionComponent } from './my-expression/my-expression.component';
import { MyMessageComponent } from './my-message/my-message.component';
import { UploadHoroscopeComponent } from './upload-horoscope/upload-horoscope.component';
import { UploadIdProofComponent } from './upload-id-proof/upload-id-proof.component';
import { UploadPhotoComponent } from './upload-photo/upload-photo.component';
import { UploadVideoComponent } from './upload-video/upload-video.component';
import { NotificationComponent } from './notification/notification.component';
import { LikeProfileComponent } from './like-profile/like-profile.component';
import { DeleteprofileComponent } from './deleteprofile/deleteprofile.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { CheckProfileStatusGuard } from './check-profile-status.guard';
import { ContactComponent } from './contact/contact.component';
import { SuspendGuard } from './suspend.guard';




const routes: Routes = [
  {
    path: '',

    component: HomeComponent
  },
  {
    path: 'setup/profile',
    //canActivate:[SuspendGuard],
    component: SetupAccountComponent
  },
  {
    path: 'ignore_profile_list',
    canActivate:[CheckProfileStatusGuard,SuspendGuard],
    component: IgnoreProfileListComponent
  },
  {
    path: 'shortlisted_profile_list',
    canActivate:[CheckProfileStatusGuard,SuspendGuard],
    component: ShortlistProfileListComponent
  },
  {
    path: 'activity/:view_profile_type',
    canActivate:[CheckProfileStatusGuard,SuspendGuard],
    component: ViewProfileListComponent
  },
  {
    path: 'search_match',
    component: FindmatchesComponent,
    canActivate:[CheckProfileStatusGuard,SuspendGuard],
  },
  {
    path: 'search_match/:search_type',
    component: MatchesComponent,
    canActivate:[CheckProfileStatusGuard,SuspendGuard],
  },

  {
    path: 'member-profile/:user_id',
    component: MemberProfileComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: [Roles.MEMBERSHIP_USER],
        requiredPermissions: [Permission.PROFILE_PHOTO, Permission.PROFILE_DETAILS],
        redirectTo: (
          _rejectedPermissionName: string,
          _activateRouteSnapshot: ActivatedRouteSnapshot,
          _routeStateSnapshot: RouterStateSnapshot,
        ) => {
          return '/v1/upgrade/plan';
        },
      }

    }
  },
  {
    path: 'upgrade/plan',
    canActivate:[CheckProfileStatusGuard,SuspendGuard],
    component: MessageAlertComponent,
    data: {
      permissions: {
        only: [Roles.NOTMEMBERSHIP_USER],
        redirectTo: (
          _rejectedPermissionName: string,
          _activateRouteSnapshot: ActivatedRouteSnapshot,
          _routeStateSnapshot: RouterStateSnapshot,
        ) => {
          return '/';
        },
      }

    }
  },
  {
    path: 'profile',
    canActivate:[CheckProfileStatusGuard,SuspendGuard],
    component: ProfileComponent
  },
  {
    path: 'my-profile',
    component: MyProfileComponent
  },
  {
    path: 'my-preference',
    canActivate:[CheckProfileStatusGuard,SuspendGuard],
    component: PartnerPreferenceComponent
  },
  {
    path: 'my-plan',
    canActivate:[CheckProfileStatusGuard,SuspendGuard],
    component: MyPlanComponent
  },
  {
    path: 'acceptance',
    canActivate:[CheckProfileStatusGuard,SuspendGuard],
    component: AcceptanceComponent
  },
  {
    path: 'request/:user_id',
    canActivate:[CheckProfileStatusGuard,SuspendGuard],
    component: RequestComponent,
    // canActivate: [NgxPermissionsGuard],
    // data: {
    //   permissions: {
    //     only: [Roles.VIEW_PRIVATE_USER],
    //     redirectTo: (
    //       _rejectedPermissionName: string,
    //       _activateRouteSnapshot: ActivatedRouteSnapshot,
    //       _routeStateSnapshot: RouterStateSnapshot,
    //     ) => {
    //       return '/';
    //     }
    //   }

    // }
  },
  {
    path: 'contact-to-admin',
    canActivate:[CheckProfileStatusGuard,SuspendGuard],
    component: ContactToAdminComponent
  }
  ,
  {
    path: 'upload_payment_slip',
    canActivate:[CheckProfileStatusGuard,SuspendGuard],
    component: UploadPaymentSlipComponent
  }
  ,
  {
    path: 'upload-horoscope',
    canActivate:[CheckProfileStatusGuard,SuspendGuard],
    component: UploadHoroscopeComponent

  },
  {
    path: 'upload_id_proof',
    canActivate:[CheckProfileStatusGuard,SuspendGuard],
    component: UploadIdProofComponent
  },
  {
    path: 'upload_photo',
    canActivate:[SuspendGuard],
    component: UploadPhotoComponent
  },
  // {
  //   path: 'upload_video',
  //   component: UploadVideoComponent
  // },
  {
    path: 'my_message',
    canActivate:[CheckProfileStatusGuard,SuspendGuard],

    component: MyMessageComponent
  },
  // {
  //   path: 'notification',
  //   canActivate:[CheckProfileStatusGuard],
  //   component: NotificationComponent
  // },
  {
    path: 'like-profile',
    canActivate:[CheckProfileStatusGuard,SuspendGuard],
    component: LikeProfileComponent
  },
  {
    path: 'delete-profile',
    canActivate:[CheckProfileStatusGuard,SuspendGuard],
    component: DeleteprofileComponent
  },
  {
    path:'change-password',
    canActivate:[CheckProfileStatusGuard,SuspendGuard],
    component : ChangePasswordComponent
  },
  {
    path:'contact/:ide',
    component:ContactComponent,
    canActivate:[CheckProfileStatusGuard,SuspendGuard]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComponentRoutingModule { }
