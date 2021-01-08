import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import { AngularFirestoreDocument, AngularFirestore  } from '@angular/fire/firestore';
import {  FullUser } from '../models/user';
import { ToastService } from 'ng-uikit-pro-standard'


@Injectable()
export class UserService {

  constructor(
    public afs: AngularFirestore,
    public afAuth: AngularFireAuth,
    private toast:ToastService
  ) { }
  photo: string;

  getUser(uid) {
    return new Promise<any>((resolve, reject) => {
      this.afs.collection<any>('users').doc(uid).valueChanges().subscribe(res => {
        resolve(res);
      }, err => {
        reject(err)
      })
    })
  }


  get(uid): AngularFirestoreDocument<any[]> {
    return this.afs.collection('users').doc(uid)
  }

  getCurrentUser() {
    return new Promise<any>((resolve, reject) => {
      var user = firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
          resolve(user);
        } else {
          reject('No user logged in');
        }
      })
    })
  }


  updateEmail(email) {
    return new Promise<any>((resolve, reject) => {
      var user = firebase.auth().currentUser;
      user.updateEmail(email).then(res => {
        resolve(res);
      }, err => reject(err))
    })
  }

  resetPassword(email) {
    return new Promise<any>((resolve, reject) => {
      var auth = firebase.auth();
      auth.sendPasswordResetEmail(email).then(res => {
        resolve(res);
      }, err => reject(err))
    })
  }

  updateUserData(user, displayName, photoURL) {
    // Update user data on from profile component in firebase database
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
    console.error(user)
    const data: FullUser = {
      uid: user.uid,
      email: user.email,
      displayName: displayName,
      photoURL: photoURL,
      providerId: user.providerId,
      creationTime: user.creationTime,
      lastSignInTime: user.lastSignInTime,
      phoneNumber: user.phoneNumber,
      roleType: user.roleType,
      subscribeToNews: user.subscribeToNews
    }
    return userRef.set(data, { merge: true })
  }

  
  updateSubscribe(user, subscribeToNews){

    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);

    const data: FullUser = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      providerId: user.providerId,
      creationTime: user.creationTime,
      lastSignInTime: user.lastSignInTime,
      phoneNumber: user.phoneNumber,
      roleType: user.roleType,
      subscribeToNews: subscribeToNews
    }

    return userRef.set(data, { merge: true })
  }

  updateCurrentUser(value, userData) {
    //update user profile in firebase
    return new Promise<any>((resolve, reject) => {
      console.error(value)
      console.error(user)
      var user = firebase.auth().currentUser;
      user.updateProfile({
        displayName: value.name,
        photoURL: value.photoURL
      }).then(res => {
        this.updateUserData(userData, value.name, value.photoURL)
        resolve(res);
      }, err => reject(err))
    })
  }


  deleteUser(uid){
    this.toast.error(`User uid: ${uid}, has been deleted successfully!`)
    this.afs.collection('users').doc(uid).delete()
  }
}