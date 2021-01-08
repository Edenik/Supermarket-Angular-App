import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from 'ng-uikit-pro-standard'
import { FirebaseUserModel, FullUser } from 'src/app/core/models/user';
import { UserService } from 'src/app/core/services/user.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {


  constructor(
    public userService: UserService,
    public authService: AuthService,
    public afAuth: AngularFireAuth,
    private fb: FormBuilder,
    private toast: ToastService,
    private afs: AngularFirestore) { }

  user: FirebaseUserModel = new FirebaseUserModel();
  fullUser: FullUser;
  profileForm: FormGroup;
  error: string;
  userFromDatabase: FullUser;
  updatedUser: FullUser;

  getUser(uid) {
    this.afs.collection<any>('users').doc(uid).valueChanges().subscribe((res: FullUser) => {
      if (res != undefined) {
        this.userFromDatabase = res;
        this.updatedUser = res;
      }

    }, err => {
      this.userFromDatabase = null;
    })
  }


  resetPassword() {
    this.userService.resetPassword(this.userFromDatabase.email)
      .then(res => {
        this.error = "";
        this.toast.success("A mail with reset password form was sent to your email!")
      }, err => {
        this.error = err
      })
  }


  updateSubscribe(condition) {
    if (condition == true) {
      this.toast.success(`${this.userFromDatabase.displayName} נרשמת בהצלחה לניוזלטר`)
    }
    else {
      this.toast.warning(`${this.userFromDatabase.displayName} הנך כבר לא ברשימת הניוזלטר`)
    }
    this.userService.updateSubscribe(this.userFromDatabase, condition)
  }


  updateMail(value) {
    this.userService.updateEmail(value.email)
      .then(res => {
        this.error = "";
        this.toast.success("Email updated successfully!")
      }, err => {
        this.toast.error(err)
      })
  }

  updateUser(value) {
    this.userService.updateCurrentUser(value, this.userFromDatabase)
      .then(res => {
        this.error = "";
        this.toast.success("פרטי המשתמש עודכנו בהצלחה")
        this.updatedUser.photoURL = value.photoURL;
        this.updatedUser.displayName = value.name;
        this.authService.updateUserRole(this.userFromDatabase, this.userFromDatabase.roleType, this.updatedUser);
      }, err => {
        this.toast.error(err)
      })
    this.user.name = value.name;
    this.user.image = value.photoURL;
  }

  save(value) {
    if (value.name != this.userFromDatabase.displayName || value.photoURL != this.userFromDatabase.photoURL) {
      if (value.photoURL == null) {
        value.photoURL = "https://d1bvpoagx8hqbg.cloudfront.net/259/4ea4217efbbf179e02269b065d23a60e.jpg"
        this.updateUser(value)
      }
      else {
        this.updateUser(value);
      }

    }
  }

  ngOnInit(): void {
    this.afAuth.user.subscribe((res: any) => {
      if (res) {
        this.profileForm = this.fb.group({
          name: [res.displayName, Validators.required],
          photoURL: [res.photoURL]
        });
        this.getUser(res.uid);
      }
    })
  }
}