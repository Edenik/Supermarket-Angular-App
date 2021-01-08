import { Injectable } from "@angular/core";
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import { AngularFirestoreDocument, AngularFirestore } from '@angular/fire/firestore';
import { UserService } from './user.service';
import { FullUser } from '../models/user';
import { PresenceService } from './presence.service';
@Injectable()
export class AuthService {

  constructor(
    public afAuth: AngularFireAuth, private afs: AngularFirestore, private userService: UserService, private presence: PresenceService
  ) { }
  userId: string = '';
  users: any[] = [];
  photo: string;
  creationTime: string;
  lastSignInTime: string;
  providerId: string;
  firstTime: boolean = false;
  subscribeToNews: boolean = false;

  updateUserRole(fbUser, roleType, user) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${fbUser.uid}`);

    if (user.photoURL) {
      this.photo = user.photoURL;
    }
    else {
      this.photo = "https://d1bvpoagx8hqbg.cloudfront.net/259/4ea4217efbbf179e02269b065d23a60e.jpg"
    }

    if (fbUser.creationTime != null) {
      this.creationTime = fbUser.creationTime;
      this.lastSignInTime = fbUser.lastSignInTime;
    }
    else {
      this.creationTime = fbUser.metadata.creationTime;
      this.lastSignInTime = fbUser.metadata.lastSignInTime;
    }

    if (this.firstTime) {
      this.providerId = user.providerData[0].providerId;
      this.subscribeToNews = false;
    }
    else {
      this.providerId = user.providerId;
      this.subscribeToNews = user.subscribeToNews;
    }
    const data: FullUser = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: this.photo,
      providerId: this.providerId,
      creationTime: this.creationTime,
      lastSignInTime: this.lastSignInTime,
      phoneNumber: user.phoneNumber,
      roleType: roleType,
      subscribeToNews: this.subscribeToNews
    }
    this.firstTime = false;

    return userRef.set(data, { merge: true })
  }





  checkIfUserHaveRole(user) {
    this.userService.getUser(user.uid).then(res => {
      if (res) {
        console.error('there is role')
        /*Should be update user data with last time signed status*/
        // console.error('there')
        console.error(res)
        this.updateUserRole(user, res.roleType, res);

      }
      else if (res == null) {
        //first time login
        this.firstTime = true;
        console.error('no role')

        this.userService.getCurrentUser().then(res => {
          console.error(res)
          this.updateUserRole(user, 'user', res);

        }, err => {
          console.error(err)
        })
      }
    },
      err => {
        console.log(err)
        // return null
      }
    )
  }

  doRegister(value) {
    return new Promise<any>((resolve, reject) => {
      firebase.auth().createUserWithEmailAndPassword(value.email, value.password)
        .then(res => {
          return res.user.updateProfile({
            displayName: value.displayName,
          }).then(res2 => {
            this.checkIfUserHaveRole(res.user);
            this.SendVerificationMail(value.email);
            resolve(res2)
          })
        }, err => reject(err))
    })
  }


  SendVerificationMail(email) {
    let actionCodeSettings = {
      // URL you want to redirect back to. The domain (www.example.com) for this
      // URL must be whitelisted in the Firebase Console.
      url: 'https://www.edenik.com/firebase/user',
      handleCodeInApp: true
    };
    return this.afAuth.sendSignInLinkToEmail(email, actionCodeSettings)
      .then(() => {
      })
      .catch(function (error) {
        console.log(error)
      });
  }

  doFacebookLogin() {
    let provider = new firebase.auth.FacebookAuthProvider();
    return this.oAuthLogin(provider);
  }

  doGoogleLogin() {
    let provider = new firebase.auth.GoogleAuthProvider();
    return this.oAuthLogin(provider);
  }


  private oAuthLogin(provider) {
    return new Promise<any>((resolve, reject) => {
      this.afAuth
        .signInWithPopup(provider)
        .then(res => {
          this.checkIfUserHaveRole(res.user);
          this.presence.updateOnUser()
          resolve(res);
        }, err => {
          console.log(err);
          reject(err);
        })
    })
  }


  doLogin(value) {
    return new Promise<any>((resolve, reject) => {
      firebase.auth().signInWithEmailAndPassword(value.email, value.password)
        .then(res => {
          this.checkIfUserHaveRole(res.user);
          this.presence.updateOnUser()

          resolve(res);
        }, err => reject(err))
    })
  }


  getCurrentUser() {
    return new Promise(
      (resolve, reject) => {
        if (firebase.auth().currentUser) {
          resolve(firebase.auth().currentUser);
        }
        else {
          reject('user not found');
        }
      }
    )
  }

  logout() {
    return new Promise(
      (resolve, reject) => {
        if (firebase.auth().currentUser) {
          this.afAuth.signOut();
          this.presence.signOut();
          resolve(true);
        }
        else {
          reject('user not found');
        }
      }
    )
  }

}