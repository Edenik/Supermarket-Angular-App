import { Component, OnInit, HostListener } from '@angular/core';
import { FullUser } from 'src/app/core/models/user';
import { Product } from 'src/app/core/models/store/product';
import { ActionsFirebaseService } from 'src/app/core/services/actions-firebase.service';
import { ActivatedRoute } from '@angular/router';
import { SubCategory } from 'src/app/core/models/store/category';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

  constructor(
    private actions: ActionsFirebaseService,
    private activeRoute: ActivatedRoute) { }

  serverError: boolean = false;
  currentUser: FullUser;
  products: Product[];
  inSaleProducts: Product[];
  hasNutritialMark: Product[];
  loading: boolean = true;
  catFromQuery: string;
  subcatFromQuery: string;
  productsToShow: Product[] = null;
  allProducts: Product[] = null;
  categoryText: string;
  subCategoruText: string;
  innerWidth: number;
  subcategories: SubCategory[] = [];
  selectedValue: string = null;

  options = [
    { value: '1', label: 'Option 1' },
    { value: '2', label: 'Option 2' },
    { value: '3', label: 'Option 3' },
  ];
  @HostListener('window:resize', ['$event'])

  onResize(event) {
    this.innerWidth = window.innerWidth;
    // console.error(this.innerWidth)
  }

  getAllProducts() {
    this.products = [];
    return new Promise<any>((resolve, reject) => {
      this.actions.getCollection('products').subscribe((res: Product[]) => {
        this.products = res;
        if (res.length > 0) {
          if (!this.catFromQuery) {
            this.productsToShow = this.products;
            this.categoryText = "כל המוצרים";
          }
          else if (this.catFromQuery && !this.subcatFromQuery) {
            if (this.catFromQuery == "sale") {
              this.productsToShow = this.products.filter(ele => ele.inSale == true);
              this.categoryText = "מוצרים במבצע";

            }
            else {
              this.productsToShow = this.products.filter(ele => ele.categoryName == this.catFromQuery);
              this.categoryText = this.catFromQuery;

            }
          }

          else if (this.catFromQuery && this.subcatFromQuery) {
            this.productsToShow = this.products.filter(ele => ele.subcategoryName == this.subcatFromQuery);
            this.categoryText = this.catFromQuery;
            this.subCategoruText = this.subcatFromQuery;

          }
        }

        this.allProducts = this.productsToShow;
        resolve(true)
      }, err => {
        this.serverError = true;
        reject(false)
      });
    })

  }


  getAllSubcategories() {
    this.actions.getCollection('subcategories').subscribe((res: SubCategory[]) => {
      if(this.catFromQuery !="sale"){
        this.subcategories = res.filter(ele => ele.categoryName == this.catFromQuery);
      }
      else {
        this.subcategories = res;
      }
    })
  }

  filterBySubcategories(value: Array<string>) {
    if(value.length == this.subcategories.length){
      this.productsToShow = this.allProducts;
    }
    else if (value.length > 0) {
      let products: Product[] = null;
      this.productsToShow = [];
      value.forEach(element => {
        products = this.allProducts.filter(ele => ele.subcategoryName == element)
        products.forEach(element => {
          this.productsToShow.push(element)
        });
      });
    }
    else {
      this.productsToShow = this.allProducts;
    }
  }


  sort(direction, object) {
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
    this.innerWidth = window.innerWidth;

    this.activeRoute.params.subscribe(params => {
      this.catFromQuery = params.category;
      this.subcatFromQuery = params.subcategory || null;

      if (!this.subcatFromQuery) {
        this.getAllSubcategories();
      }

      this.getAllProducts().then(res => {
        this.loading = false;
      })
    })
  }

}
