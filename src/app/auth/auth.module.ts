import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material/material.module';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { RegisterComponent } from './register/register.component';
import { ForgetComponent } from './forget/forget.component';
import { ForgotpasswordComponent } from './forgotpassword/forgotpassword.component';
import { PrimengModule } from '../primeng/primeng.module';
import { GenerateLinkComponent } from './generate-link/generate-link.component';


@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    ForgetComponent,
    ForgotpasswordComponent,
    GenerateLinkComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxUiLoaderModule,
    PrimengModule
  ],
  exports:[
    LoginComponent,
    RegisterComponent,
    ForgetComponent
  ]
})
export class AuthModule { }
