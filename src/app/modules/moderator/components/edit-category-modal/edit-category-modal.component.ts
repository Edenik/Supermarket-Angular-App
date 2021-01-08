import { Component, OnInit } from '@angular/core';
import { MDBModalRef, ToastService } from 'ng-uikit-pro-standard';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { AngularFireAuth } from '@angular/fire/auth';
import { Subject } from 'rxjs';
import { Category } from 'src/app/core/models/store/category';
import { ActionsFirebaseService } from 'src/app/core/services/actions-firebase.service';


@Component({
  selector: 'app-edit-category-modal',
  templateUrl: './edit-category-modal.component.html',
  styleUrls: ['./edit-category-modal.component.scss']
})
export class EditCategoryModalComponent implements OnInit {

  constructor(
    private modalRef: MDBModalRef,
    private toast: ToastService,
    public afAuth: AngularFireAuth,
    private actions: ActionsFirebaseService) { }


  category: Category;
  newCategory: Category;
  validatingForm: FormGroup;
  formType: string;
  uid: string;
  action: Subject<Category> = new Subject();
  categories: Category[] = [];

  closeModal() {
    this.action.next(null);
    this.modalRef.hide();
  }


  get editCategoryName() {
    return this.validatingForm.get('editCategoryName');
  }

  save() {
    let dateAdded;
    let addedByUID;
    let dateEdited;
    let editedByUID;
    let id;


    if (this.formType == "editCategory") {
      dateAdded = this.category.dateAdded;
      addedByUID = this.category.addedByUID;
      dateEdited = String(new Date());
      editedByUID = this.uid;
      id = this.category.id;
    }
    else {
      dateAdded = String(new Date());
      addedByUID = this.uid;
      dateEdited = null;
      editedByUID = null;
      id = null;
    }
    this.newCategory = {
      name: this.validatingForm.value.editCategoryName,
      dateAdded: dateAdded,
      addedByUID: addedByUID,
      dateEdited: dateEdited,
      editedByUID: editedByUID
    }

    if (this.formType == "editCategory") {
      this.newCategory.id = this.category.id;
      this.editCategory(this.newCategory.id, this.newCategory);
    }
    else {
      this.addCategory(this.newCategory);
    }
  }

  editCategory(id, newCategory: Category) {
    newCategory.id = id;

    this.actions.updateCollection('categories', newCategory).then(res => {
      this.toast.success(`Category ${newCategory.name}, added!`)
      console.error(newCategory)
      this.action.next(newCategory);
      this.modalRef.hide()
    }, err => {
      this.toast.error(err)
      this.action.next(null);
      this.modalRef.hide()
    })
  }

  addCategory(newCategory: Category) {

    if (this.categories.length > 0) {
      newCategory.id = this.categories[0].id + 1;
    }
    else {
      newCategory.id = 0;
    }

    this.actions.updateCollection('categories', newCategory).then(res => {
      this.action.next(newCategory);
      this.toast.success(`Category ${newCategory.name}, added!`)
      this.modalRef.hide()
    }, err => {
      this.toast.error(err)
      this.action.next(null);
      this.modalRef.hide()
    })
  }

  getUser() {
    this.afAuth.user.subscribe((res: any) => {
      this.uid = res.uid;
    })
  }

  sort() {
    let sortedArray: Category[] = this.categories.sort((obj1, obj2) => {
      let sortObject1 = obj1.id;
      let sortObject2 = obj2.id;
      if (sortObject1 < sortObject2)
        return 1;
      if (sortObject1 > sortObject2)
        return -1;
      return 0;
    });
    this.categories = sortedArray;
  }

  getCategories() {
    this.actions.getCollection('categories').subscribe(res => {
      this.categories = res;
      this.sort();
    })
  }
  ngOnInit(): void {
    this.getUser();
    if (this.formType == "importCategory") {
      this.getCategories();
    }

    this.validatingForm = new FormGroup({
      editCategoryName: new FormControl(this.category.name, Validators.required),
    });
  }

}