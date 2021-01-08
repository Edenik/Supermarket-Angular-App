import { Component, OnInit } from '@angular/core';
import { ActionsFirebaseService } from 'src/app/core/services/actions-firebase.service';
import { Category, SubCategory } from 'src/app/core/models/store/category';

@Component({
  selector: 'app-categories-sidenav',
  templateUrl: './categories-sidenav.component.html',
  styleUrls: ['./categories-sidenav.component.scss']
})
export class CategoriesSidenavComponent implements OnInit {

  constructor(
    private actions: ActionsFirebaseService
  ) { }

  categories: Category[];
  subcategories: SubCategory[];
  reqComplete: boolean = false;


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

  getSubcategoryByCategory(categoryID) {
    let categories: Category[] = this.subcategories.filter(ele => ele.categoryID == categoryID)
    if (categories.length > 0) return categories;
    else return false;
  }


  ngOnInit(): void {
    this.getAllCategories();

  }

}
