import { Component, OnInit, HostListener } from '@angular/core';
import { FullUser } from 'src/app/core/models/user';
import { Product } from 'src/app/core/models/store/product';
import { ActionsFirebaseService } from 'src/app/core/services/actions-firebase.service';
import { SubCategory } from 'src/app/core/models/store/category';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(
    private actions: ActionsFirebaseService) { }

  serverError: boolean = false;
  currentUser: FullUser;
  products: Product[];
  productsToShow: Product[];
  inSaleProducts: Product[];
  hasNutritialMark: Product[];
  loading: boolean = true;
  selectedValue: string = null;
  subcategories: SubCategory[] = [];
  searchQuery: string = null;
  innerWidth: number;
  maxWidth: string = "380px";

  @HostListener('window:resize', ['$event'])

  onResize(event) {
    this.innerWidth = window.innerWidth;
  }

  getInSaleProducts() {
    this.inSaleProducts = this.products.filter(ele => ele.inSale == true);
  }

  getNutritialMarkProducts() {
    this.hasNutritialMark = this.products.filter(ele => ele.hasNutritialMark == true);
  }

  search(query) {
    this.searchQuery = query;
    this.productsToShow = this.products.filter(ele => ele.productName.includes(query))
  }

  getAllCategories() {
    this.actions.getCollection('categories').subscribe((res: SubCategory[]) => {
      this.subcategories = res;
    })
  }

  filterByCategories(value: Array<string>) {
    if (value.length == this.subcategories.length) {
      this.productsToShow = this.products;
    }
    else if (value.length > 0) {
      let products: Product[] = null;
      this.productsToShow = [];
      value.forEach(element => {
        products = this.products.filter(ele => ele.categoryName == element)
        products.forEach(element => {
          this.productsToShow.push(element)
        });
      });
    }
    else {
      this.productsToShow = this.products;
    }
    if (this.searchQuery) {
      this.productsToShow = this.productsToShow.filter(ele => ele.productName.includes(this.searchQuery))
    }
  }

  getAllProducts() {
    this.products = [];
    return new Promise<any>((resolve, reject) => {
      this.actions.getCollection('products').subscribe((res: Product[]) => {
        this.products = res;
        this.productsToShow = res;
        if (res.length > 0) {
          this.getInSaleProducts();
          this.getNutritialMarkProducts();
        }
        resolve(true)
      }, err => {
        this.serverError = true;
        reject(false)
      });
    })

  }

  sort(direction, object) {
    if (this.searchQuery) {
      this.search(this.searchQuery);
    }
    let sortedArray: Product[] = this.productsToShow.sort((obj1, obj2) => {
      let sortObject1 = null;
      let sortObject2 = null;

      switch (object) {
        case 'price':
          sortObject1 = obj1.salePrice || obj1.price;
          sortObject2 = obj2.salePrice || obj2.price;
          break;
        case 'name':
          sortObject1 = obj1.productName;
          sortObject2 = obj2.productName;
          break;
      }

      if (sortObject1 && sortObject2) {
        if (direction == 'minus') {
          if (sortObject1 < sortObject2)
            return 1;
          if (sortObject1 > sortObject2)
            return -1;
          return 0;
        }
        else if (direction == 'plus') {
          if (sortObject1 > sortObject2)
            return 1;
          if (sortObject1 < sortObject2)
            return -1;
          return 0;
        }


      }
    });
    this.productsToShow = sortedArray;
  }

  ngOnInit(): void {
    this.getAllCategories();
    this.innerWidth = window.innerWidth;

    this.getAllProducts().then(res => {
      this.loading = false;
    })
  }
}
