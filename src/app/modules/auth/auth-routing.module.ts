import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProfileComponent } from './pages/profile/profile.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { AuthGuard } from 'src/app/core/guards/auth.guard';
import { PhoneLoginComponent } from './pages/phone-login/phone-login.component';


const routes: Routes = [
  {path: '' , component: ProfileComponent},
  {path: 'profile' , component: ProfileComponent},
  {path: 'login' , component: LoginComponent , canActivate: [AuthGuard] },
  {path: 'phone-login' , component: PhoneLoginComponent , canActivate: [AuthGuard] },
  {path: 'register' , component: RegisterComponent, canActivate: [AuthGuard]},
  {path: 'forgot-password' , component: ForgotPasswordComponent, canActivate: [AuthGuard]},
];


@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
