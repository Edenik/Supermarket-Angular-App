import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/core/models/store/product';
import { Order } from 'src/app/core/models/store/order';
import { Router } from '@angular/router';
import { Category, SubCategory } from 'src/app/core/models/store/category';
import { ActionsFirebaseService } from 'src/app/core/services/actions-firebase.service';

@Component({
  selector: 'app-control-panel',
  templateUrl: './control-panel.component.html',
  styleUrls: ['./control-panel.component.scss']
})
export class ControlPanelComponent implements OnInit {

  constructor(
    private actions: ActionsFirebaseService,
    private router: Router
  ) { }

  products: Product[];
  saleProducts: Product[] = [];
  orders: Order[];
  categories: Category[] = [];
  subcategories: SubCategory[] = [];

  navigate(url) {
    this.router.navigate([url])
  }

  getAllProducts() {
    this.products = [];
    this.actions.getCollection('products').subscribe((res: Product[]) => {
      this.products = res;
      this.getAllProductsInSale();
    })
  }

  getAllProductsInSale() {
    this.saleProducts = this.products.filter(ele => ele.inSale == true);
  }


  getAllOrders() {
    this.orders = [];
    this.actions.getCollection('orders').subscribe((res: Order[]) => {
      this.orders = res;

    })
  }

  getAllCategories() {
    this.categories = [];
    this.actions.getCollection('categories').subscribe((res: Category[]) => {
      this.categories = res;
    })
  }

  getAllSubcategories() {
    this.categories = [];
    this.actions.getCollection('subcategories').subscribe((res: SubCategory[]) => {
      this.subcategories = res;
    })
  }



  ngOnInit(): void {
    this.getAllCategories();
    this.getAllSubcategories();
    this.getAllProducts();
    this.getAllOrders();
  }

}
