import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavBarComponent } from './shared/nav-bar/nav-bar.component';
import { FooterComponent } from './shared/footer/footer.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BlockUiCustomTemplateComponent } from './block-ui-custom-template.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { LoadingBarRouterModule } from '@ngx-loading-bar/router';
import { BlockUIModule } from 'ng-block-ui';
import { MaterialModule } from './material/material.module';
import { RegistrationComponent } from './shared/registration/registration.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthModule } from './auth/auth.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RegisterService } from './services/register.service';
import { AppService } from './services/app.service';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { PagesModule } from './pages/pages.module';
import { PrimengModule } from './primeng/primeng.module';
import { ComponentModule } from './component/component.module';
import { SharedModule } from './shared/shared.module';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { ConfirmationService } from 'primeng/api';
import { NgxPermissionsModule, NgxPermissionsService } from 'ngx-permissions';
import { APP_INITIALIZER } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { ImageCropperModule } from 'ngx-image-cropper';
import { AuthorizationInterceptor } from './utils/authorization.interceptor';
import { AppInitializationServiceService } from './services/app-initialization-service.service';
import { AuthViewComponent } from './layout/auth-view/auth-view.component';
import { DashboardViewComponent } from './layout/dashboard-view/dashboard-view.component';
import { DefaultViewComponent } from './layout/default-view/default-view.component';
import { MatDialogModule } from '@angular/material/dialog';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
// import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
export function SettingOfAppConfiguration(appInitializationServiceService: AppInitializationServiceService) {
  //console.log("APP_INITIALIZER");
  return () => {
    // Initialization code, e.g., fetching configuration data
    return appInitializationServiceService.getAppConfiguration();
  };
}


export function checkLoginMode(auth: AuthService) {
  //console.log("REBUILDING AUTH STATE....");
  return () => {
    // Initialization code, e.g., fetching configuration data
    return auth.autoSignIn();
  };
}

export function checkPermission(auth: AuthService) {
  //console.log("CHECK PERMISSION....");
  return () => {
    // Initialization code, e.g., fetching configuration data
    return auth.setupPermissionForViewProfile();
  };
}
@NgModule({
  declarations: [
    AppComponent,
    AuthViewComponent,
    DashboardViewComponent,
    DefaultViewComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MaterialModule,
    PrimengModule,
    FormsModule,
    ReactiveFormsModule,
    AuthModule,
    NgbModule,
    SharedModule,
    PagesModule,
    ComponentModule,
    LoadingBarRouterModule,
    NgxUiLoaderModule,
    MatDialogModule,
    BlockUIModule.forRoot(
      {
        template: BlockUiCustomTemplateComponent
      }
    ),
    // NgMultiSelectDropDownModule.forRoot(),
    ToastrModule.forRoot(),
    CarouselModule,
    NgxPermissionsModule.forRoot(),
    ImageCropperModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    // NgMultiSelectDropDownModule.forRoot()

  ],
  // schemas: [NO_ERRORS_SCHEMA],
  exports: [FooterComponent],
  providers: [
    AppService,
    RegisterService,
    ConfirmationService,
    AppInitializationServiceService,
    {
      provide: APP_INITIALIZER,
      useFactory: SettingOfAppConfiguration,
      deps: [AppInitializationServiceService],
      multi: true, // Indicates that there can be multiple APP_INITIALIZER functions
    },
    {
      provide: APP_INITIALIZER,
      useFactory: checkLoginMode,
      deps: [AuthService],
      multi: true, // Indicates that there can be multiple APP_INITIALIZER functions
    },
    {
      provide: APP_INITIALIZER,
      useFactory: checkPermission,
      deps: [AuthService],
      multi: true, // Indicates that there can be multiple APP_INITIALIZER functions
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthorizationInterceptor,
      multi: true
    }
  ],
  entryComponents: [BlockUiCustomTemplateComponent, RegistrationComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
