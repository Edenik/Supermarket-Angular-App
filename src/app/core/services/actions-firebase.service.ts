import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestoreDocument, AngularFirestore  } from '@angular/fire/firestore';
import { Category } from '../models/store/category';

@Injectable({
  providedIn: 'root'
})
export class ActionsFirebaseService {

  constructor(
    public afs: AngularFirestore,
    public afAuth: AngularFireAuth,
  ) { }



  getCollection(collection){
    return this.afs.collection<any>(collection).valueChanges()
  }

  getCollectionByID(collection, id){
    return new Promise<any>((resolve, reject) => {
      this.afs.collection<any>(collection).valueChanges().subscribe(res => {
        let collection = res.filter(ele => ele.id == id);
        resolve(collection);
      }, err => {
        reject(err)
      })
    })
  }


  getCollectionByUID(collection, uid){
    return new Promise<any>((resolve, reject) => {
      this.afs.collection<any>(collection).valueChanges().subscribe(res => {
        let collection = res.filter(ele => ele.uid == uid);
        resolve(collection);
      }, err => {
        reject(err)
      })
    })
  }


  deleteCollection(collection, id){
    const ref: AngularFirestoreDocument<any> = this.afs.doc(`${collection}/${id}`);
    return ref.delete()
  }

  updateCollection(collection ,data){
    const ref: AngularFirestoreDocument<Category> = this.afs.doc(`${collection}/${data.id}`);
    return ref.set(data, { merge: true })
  }
}
