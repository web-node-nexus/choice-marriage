import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrimengModule } from '../primeng/primeng.module';
import { FormsModule ,ReactiveFormsModule} from '@angular/forms';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { MaterialModule } from '../material/material.module';
import { LoadingBarRouterModule } from '@ngx-loading-bar/router';
import { NgbActiveModal, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { BlockUiCustomTemplateComponent } from '../block-ui-custom-template.component';
import { ButtomNavigationBarComponent } from './buttom-navigation-bar/buttom-navigation-bar.component';
import { FooterComponent } from './footer/footer.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { RegistrationComponent } from './registration/registration.component';
import { BannerComponent } from './banner/banner.component';
import { RegistrationPageComponent } from './registration-page/registration-page.component';
import { CustomAlertComponent } from './custom-alert/custom-alert.component';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { NgxPermissionsModule } from 'ngx-permissions';
import { ImageCroperComponent } from './image-croper/image-croper.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { NoDataAvailbleComponent } from './no-data-availble/no-data-availble.component';
import { ApproveComponent } from './approve/approve.component';
import { ValidationAlertComponent } from './validation-alert/validation-alert.component';

@NgModule({
  declarations: [
    NavBarComponent,
    FooterComponent,
    BlockUiCustomTemplateComponent,
    RegistrationComponent,
    ButtomNavigationBarComponent,
    BannerComponent,
    RegistrationPageComponent,
    CustomAlertComponent,
    ImageCroperComponent,
    NoDataAvailbleComponent,
    ApproveComponent,
    ValidationAlertComponent

  ],
  imports: [
    CommonModule,
    NgxUiLoaderModule,
    PrimengModule,
    FormsModule,
    MaterialModule,
    LoadingBarRouterModule,
    ReactiveFormsModule,
    CarouselModule,
    NgxPermissionsModule,
    ImageCropperModule

  ],
  exports:[
    NavBarComponent,
    FooterComponent,
    BlockUiCustomTemplateComponent,
    RegistrationComponent,
    ButtomNavigationBarComponent,
    BannerComponent,
    NoDataAvailbleComponent,
    ValidationAlertComponent

  ]
})
export class SharedModule { }
