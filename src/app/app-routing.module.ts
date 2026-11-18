import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './auth/login/login.component';
import { AuthGuard } from './auth/auth.guard';
import { SubscriptionComponent } from './component/subscription/subscription.component';
import { RegistrationPageComponent } from './shared/registration-page/registration-page.component';
import { PartnerPreferenceComponent } from './component/partner-preference/partner-preference.component';

import { NotificationComponent } from './component/notification/notification.component';
import { PaymentPageComponent } from './component/payment-page/payment-page.component';
import { AuthViewComponent } from './layout/auth-view/auth-view.component';
import { DashboardViewComponent } from './layout/dashboard-view/dashboard-view.component';
import { DefaultViewComponent } from './layout/default-view/default-view.component';
import { CheckProfileStatusGuard } from './component/check-profile-status.guard';
import { SuspendGuard } from './component/suspend.guard';

const routes: Routes = [

  {
    path: '',
    // component:DefaultViewComponent,
    // loadChildren: () => import('./component/component.module').then(m => m.ComponentModule),

    children: [
      {
        path: '',
        loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule)
      },
      {
        path:'v1',
        canActivate: [AuthGuard],
        component:DashboardViewComponent,
        loadChildren: () => import('./component/component.module').then(m => m.ComponentModule),
      }



    ]
  },


  {
    path: "auth",
    component: AuthViewComponent,
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  },

  {
    path: "chat",
    canActivate: [AuthGuard,CheckProfileStatusGuard,SuspendGuard],
    loadChildren: () => import('./feature/chat/chat.module').then(m => m.ChatModule)
  },
  // {
  //   path: "user",
  //   loadChildren: () => import('./component/component.module').then(m => m.ComponentModule),
  //   canActivate: [AuthGuard]
  // },

  {
    path: 'subscription/plan',
    //canActivate: [CheckProfileStatusGuard],
    component: SubscriptionComponent
  },
  {
    path: 'subscription/payment/:plan_id',
    canActivate: [CheckProfileStatusGuard,SuspendGuard],
    component: PaymentPageComponent
  },
  {
    path: 'register',
    component: RegistrationPageComponent
  },


  {
    path: 'notification',
    canActivate: [AuthGuard,CheckProfileStatusGuard,SuspendGuard],
    component: NotificationComponent
  },
  {
    path: "**",
    redirectTo: "error",
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'top' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
