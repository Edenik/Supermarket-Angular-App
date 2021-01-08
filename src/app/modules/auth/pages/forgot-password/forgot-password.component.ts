import { Component, OnInit } from '@angular/core';
import { ToastService } from 'ng-uikit-pro-standard'
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  constructor(
    private userService: UserService,
    private toast: ToastService) { }

  ngOnInit(): void {
  }

  resetPassword(email) {
    console.log(email)
    this.userService.resetPassword(email)
      .then(res => {
        this.toast.success("A mail with reset password instructions was sent to your email!")
      }, err => {
        this.toast.error(err)
      })
  }
}
