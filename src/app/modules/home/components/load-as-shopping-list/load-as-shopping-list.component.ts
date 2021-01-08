import { Component, OnInit } from '@angular/core';
import { MDBModalRef } from 'ng-uikit-pro-standard';
import { OrderItemFull, OrderItem } from 'src/app/core/models/store/order';
import { Product } from 'src/app/core/models/store/product';
import { CartItem } from 'src/app/core/models/store/cart-item';
import { StorageMap } from '@ngx-pwa/local-storage';

@Component({
  selector: 'app-load-as-shopping-list',
  templateUrl: './load-as-shopping-list.component.html',
  styleUrls: ['./load-as-shopping-list.component.scss']
})
export class LoadAsShoppingListComponent implements OnInit {

  constructor(
    private modalRef: MDBModalRef,
    private storageMap: StorageMap) { }

  fullOrderItems: OrderItemFull[] = [];
  OrderItemsToShow: OrderItemFull[] = [];
  orderItems: OrderItem[];
  product: Product;
  products: Product[] = [];
  cartItems: CartItem[] = [];
  index = 0;
  newArr: CartItem[] = [];

  closeModal() {
    this.modalRef.hide();
  }


  /* This Component isn't 100% ready.... */

  // getAllProductById(element) {
  //   this.api.getProductById(element.product_id).subscribe((res: Product) => {
  //     this.product = res;
  //     this.products.push(res);
  //     this.fullOrderItems.push({
  //       id: element.id,
  //       order_id: element.order_id,
  //       product_id: element.product_id,
  //       quantity: element.quantity,
  //       order_item_price: element.order_item_price,
  //       order_item_discount: element.order_item_discount,
  //       photoURL: this.product.photoURL,
  //       product_name: this.product.productName
  //     })
  //   }, err => {
  //   }, () => {
  //     if (this.orderItems.length == this.fullOrderItems.length) {
  //       this.OrderItemsToShow = this.fullOrderItems;
  //     }
  //   })
  // }


  addProductsToCart() {
    this.cartItems = [];
    this.storageMap.get<CartItem[]>('cartItems').subscribe((items: CartItem[]) => {
      this.cartItems = items;
      this.newArr = this.cartItems;
      this.OrderItemsToShow.forEach(ele => {
        this.index++;
        this.addProducts(ele)
      })

      this.storageMap.delete('cartItems').subscribe(() => {
        this.storageMap.set('cartItems', this.newArr).subscribe(() => { 
          this.closeModal();
        });
      });
    });
  }

  addProducts(product) {
    let itemExist: boolean = false;
    let quantity: number = 0;


    if (this.cartItems && this.cartItems.length > 0) {
      this.cartItems.forEach(element => {
        quantity = element.quantity;
        if (element.productID == product.product_id) {
          itemExist = true;
          this.newArr.splice(this.index, 1);
        }
        else {
          itemExist = false;
        }
      })
    }
    else {
      itemExist = false;
    }

    if (!itemExist) {
      if (this.index == 1) {
        this.newArr = [{ productID: product.product_id, quantity: product.quantity, dateAdded: new Date() }];
      }
      else {
        this.newArr.push({ productID: product.product_id, quantity: product.quantity, dateAdded: new Date() });
      }
      // this.cartItems.push({ productID: product.product_id, quantity: quantity, dateAdded: new Date() });
      // this.storageMap.set('cartItems', this.cartItems).subscribe(() => { });
    }
    else {
      this.newArr.push({ productID: product.product_id, quantity: quantity + product.quantity, dateAdded: new Date() });

      // filteredArr = this.cartItems.filter(ele => ele.productID != product.product_id);

      // this.cartItems.push({ productID: product.product_id, quantity: quantity + product.quantity, dateAdded: new Date() });
      // this.storageMap.set('cartItems', this.cartItems).subscribe(() => { });
    }
  }

  ngOnInit(): void {
    // this.orderItems.forEach(element => {
    //   this.getAllProductById(element);
    // });
  }

}



