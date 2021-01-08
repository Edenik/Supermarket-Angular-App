import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import * as firebase from 'firebase/app';
import { ToastService } from 'ng-uikit-pro-standard'
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { FullUser } from '../../models/user';
import { Category, SubCategory } from '../../models/store/category';
import { ActionsFirebaseService } from '../../services/actions-firebase.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {


  constructor(
    public userService: UserService,
    public afAuth: AngularFireAuth,
    private authService: AuthService,
    private router: Router,
    private toast: ToastService,
    private actions:ActionsFirebaseService
  ) {
    router.events.subscribe(val => {
      let pathname = location.pathname;
      if (pathname.includes('admin')) {
        this.path = 'admin';
      }
      else if (pathname.includes('moderator')) {
        this.path = 'moderator';
      }
      else if (pathname.includes('auth')) {
        this.path = 'auth';
      }
      else {
        this.path = 'home';
      }
    })
  }


  uid: string = '';
  fullUser: FullUser;
  path: string;
  categories:Category[];
  subcategories:SubCategory[];
  reqComplete:boolean = false;

  logout() {
    this.authService.logout()
      .then((res) => {
        this.router.navigate(['/home']);
      }, (error) => {
        console.log("Logout error", error);
      });
  }


  updateImageUrl(uid) {
    this.userService.get(uid).valueChanges().subscribe((res: any) => {
      this.fullUser = res;
      this.fullUser.photoURL = 'https://d1bvpoagx8hqbg.cloudfront.net/259/4ea4217efbbf179e02269b065d23a60e.jpg'
      this.authService.updateUserRole(this.fullUser, this.fullUser.roleType, this.fullUser);
      var user = firebase.auth().currentUser;
      user.updateProfile({
        displayName: this.fullUser.displayName,
        photoURL: this.fullUser.photoURL
      })
    })
  }

  getUser() {
    this.afAuth.user.subscribe((res: any) => {
      if (res) {
        this.uid = res.uid;
        this.userService.get(res.uid).valueChanges().subscribe((res: any) => {
          this.fullUser = res;
        })
      }
      else {
        const path = window.location.pathname;
        if (!path.includes('/auth/')) {
          /*If user logs out, all of his opened pages will redirect to home.*/
          this.router.navigate(['']);
        }
      }
    }, err => {
      console.error(err)
    })
  }

  getAllCategories() {
    this.categories = [];
    this.actions.getCollection('categories').subscribe((res: Category[]) => {
      this.categories = res;
    this.getAllSubcategories();
    })
  }

  getAllSubcategories() {
    this.subcategories = [];
    this.actions.getCollection('subcategories').subscribe((res: SubCategory[]) => {
      this.subcategories = res;
      this.reqComplete = true;
    })
  }

  getSubcategoryByCategory(categoryID){
    let categories:Category[] = this.subcategories.filter(ele => ele.categoryID == categoryID)
    // console.error(categories.length)
    if(categories.length>0) return categories;
    else return false;
    // return categories ? categories.length>0 : false;
  }

  ngOnInit(): void {
    this.getAllCategories();
    this.getUser();
  }

}

