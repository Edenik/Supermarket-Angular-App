import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './pages/profile/profile.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { RegisterComponent } from './pages/register/register.component';
import { LoginComponent } from './pages/login/login.component';
import { AuthRoutingModule } from './auth-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MDBSpinningPreloader, MDBBootstrapModulesPro, } from 'ng-uikit-pro-standard';
import { PhoneLoginComponent } from './pages/phone-login/phone-login.component';



@NgModule({
  declarations: [ProfileComponent, ForgotPasswordComponent, RegisterComponent, LoginComponent, PhoneLoginComponent],
  imports: [
    CommonModule,
    AuthRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MDBBootstrapModulesPro.forRoot(),
  ],
  providers: [MDBSpinningPreloader],
})
export class AuthModule { }
