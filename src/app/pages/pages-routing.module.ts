import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ErrorPageComponent } from './error-page/error-page.component';
import { HomeComponent } from './home/home.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { TermConditionComponent } from './term-condition/term-condition.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { SuccessStoryComponent } from './success-story/success-story.component';
import { AddsucessstoryComponent } from './addsucessstory/addsucessstory.component';
import { AuthGuard } from '../auth/auth.guard';
import { AdvanceSearchComponent } from './advance-search/advance-search.component';
import { IdSearchComponent } from './id-search/id-search.component';
import { KeywordSearchComponent } from './keyword-search/keyword-search.component';
import { QuickSearchComponent } from './quick-search/quick-search.component';
import { ContactToAdminComponent } from '../component/contact-to-admin/contact-to-admin.component';
import { CheckProfileStatusGuard } from '../component/check-profile-status.guard';
import { SuspendGuard } from '../component/suspend.guard';
// import { AuthGuard } from '../auth/auth.guard';
// import { LandingPageComponent } from './landing-page/landing-page.component';


const routes: Routes = [

  {
    path: "",
    component: HomeComponent
  },
  {
    path: "home",
    component: HomeComponent
  },
  {
    path:"error",
    component:ErrorPageComponent
  },
  {
    path:"about-us",
    //canActivate:[CheckProfileStatusGuard],
    component:AboutUsComponent
  },
  {
    path:"contact-us",
    //canActivate:[CheckProfileStatusGuard],
    component:ContactUsComponent
  },
  {
    path:"privacy-policy",
    //canActivate:[CheckProfileStatusGuard],
    component:PrivacyPolicyComponent
  },
  {
    path:"terms_conditions",
    //canActivate:[CheckProfileStatusGuard],
    component:TermConditionComponent
  },
  {
    path:"privacy_policy",
   // canActivate:[CheckProfileStatusGuard],
    component:PrivacyPolicyComponent
  },
  {
    path:"success_story",
    //canActivate:[CheckProfileStatusGuard],
    component:SuccessStoryComponent
  },
  {
    path:"success_story/:id",
    //canActivate:[CheckProfileStatusGuard],
    component:SuccessStoryComponent
  },
  {
    path:'add_success_story',
    canActivate : [AuthGuard , CheckProfileStatusGuard,SuspendGuard],
    component : AddsucessstoryComponent
  },
  {
    path:'quick-search',
    canActivate:[CheckProfileStatusGuard],
    component:QuickSearchComponent
  },
  {
    path:'advance-search',
    canActivate:[CheckProfileStatusGuard],
    component:AdvanceSearchComponent
  },
  {
    path:'keyword-search',
    canActivate:[CheckProfileStatusGuard],
    component:KeywordSearchComponent
  },
  {
    path:'id-search',
    canActivate:[CheckProfileStatusGuard],
    component:IdSearchComponent
  },
  {
    path:'contact-to-admin',
    canActivate:[CheckProfileStatusGuard],
    component:ContactToAdminComponent
  },



];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
