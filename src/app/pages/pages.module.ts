import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { MaterialModule } from '../material/material.module';
import { ErrorPageComponent } from './error-page/error-page.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesRoutingModule } from './pages-routing.module';
import { AboutUsComponent } from './about-us/about-us.component';
import { SharedModule } from '../shared/shared.module';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { TermConditionComponent } from './term-condition/term-condition.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { NgxPermissionsModule } from 'ngx-permissions';
import { SuccessStoryComponent } from './success-story/success-story.component';
import { AddsucessstoryComponent } from './addsucessstory/addsucessstory.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AdvanceSearchComponent } from './advance-search/advance-search.component';
import { IdSearchComponent } from './id-search/id-search.component';
import { KeywordSearchComponent } from './keyword-search/keyword-search.component';
import { AuthModule } from '../auth/auth.module';
import { QuickSearchComponent } from './quick-search/quick-search.component';




@NgModule({
    declarations: [
        HomeComponent,
        ErrorPageComponent,
        AboutUsComponent,
        ContactUsComponent,
        TermConditionComponent,
        PrivacyPolicyComponent,
        SuccessStoryComponent,
        AddsucessstoryComponent,
        IdSearchComponent,
        AdvanceSearchComponent,
        KeywordSearchComponent,
        QuickSearchComponent

    ],
    imports: [
        CommonModule,
        PagesRoutingModule,
        MaterialModule,
        FormsModule,
        ReactiveFormsModule,
        NgbModule,
        NgxUiLoaderModule,
        SharedModule,
        CarouselModule,
        NgxPermissionsModule,
        MatDatepickerModule,
        MatInputModule ,
        MatButtonModule ,
        ReactiveFormsModule,
        AuthModule
        // PermissionPageComponent
    ]
})
export class PagesModule { }
