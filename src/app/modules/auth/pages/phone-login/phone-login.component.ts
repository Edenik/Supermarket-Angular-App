import { Component, OnInit } from '@angular/core';
import { WindowService } from 'src/app/core/services/window.service';
import * as firebase from 'firebase';
import { PhoneNumber } from 'src/app/core/models/phone-number';
import { AuthService } from 'src/app/core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-phone-login',
  templateUrl: './phone-login.component.html',
  styleUrls: ['./phone-login.component.scss']
})
export class PhoneLoginComponent implements OnInit {

  constructor(
    private win: WindowService,
    private AuthService: AuthService,
    private Router: Router) { }

  windowRef: any;
  prefixes: string[] = ['050', '051', '052', '053', '054', '055', '056', '058', '059'];
  phoneNumber = new PhoneNumber()
  verificationCode: string;
  user: firebase.User;

  ngOnInit(): void {
    this.windowRef = this.win.windowRef;
    this.windowRef.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container')
    this.windowRef.recaptchaVerifier.render()
  }

  sendLoginCode() {

    const appVerifier = this.windowRef.recaptchaVerifier;

    const num = this.phoneNumber.il972;

    firebase.auth().signInWithPhoneNumber(num, appVerifier)
      .then(result => {

        this.windowRef.confirmationResult = result;

      })
      .catch(error => console.log(error));

  }

  verifyLoginCode() {
    this.windowRef.confirmationResult
      .confirm(this.verificationCode)
      .then(result => {
        this.user = result.user;
        if (!result.user.displayName && !result.user.photoURL) {
          result.user.updateProfile({
            displayName: 'משתמש חדש',
            photoURL: 'https://d1bvpoagx8hqbg.cloudfront.net/259/4ea4217efbbf179e02269b065d23a60e.jpg'
          })
        }
        this.AuthService.checkIfUserHaveRole(result.user);
        setTimeout(() => {
          this.Router.navigate(['/auth/profile'])
        }, 3000);

      })
      .catch(error => console.log(error, "Incorrect code entered?"));
  }

}
