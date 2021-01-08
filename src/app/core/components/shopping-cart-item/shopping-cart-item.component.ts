import { Component, OnInit, Input } from '@angular/core';
import { CartItemFull, CartItem } from '../../models/store/cart-item';
import { StorageMap } from '@ngx-pwa/local-storage';
import { MDBModalService, MDBModalRef } from 'ng-uikit-pro-standard';
import { FullProductModalComponent } from 'src/app/modules/home/components/full-product-modal/full-product-modal.component';
import { Product } from '../../models/store/product';

@Component({
  selector: 'app-shopping-cart-item',
  templateUrl: './shopping-cart-item.component.html',
  styleUrls: ['./shopping-cart-item.component.scss']
})
export class ShoppingCartItemComponent implements OnInit {

  constructor(
    private storageMap: StorageMap,
    private modalService: MDBModalService
  ) { }

  @Input() product: CartItemFull;
  cartItems: CartItem[] = [];
  productQuantity: number;
  modalRef: MDBModalRef;
  productToShow:CartItemFull = {dateAdded:null,item:null,quantity:null};

  updateQuantity(event) {
    if (event == 'plus') {
      if (this.product.item.weight == 1000 && this.product.item.unit != "unit") {
        this.productQuantity = this.productQuantity + 0.1;
      }
      else {
        this.productQuantity++;
      }
    }
    else if (event == 'minus') {
      if (this.productQuantity > 0.2) {
        if (this.product.item.weight == 1000 && this.product.item.unit != "unit") {
          this.productQuantity = this.productQuantity - 0.1;
        }
        else {
          if (this.productQuantity > 1) {
            this.productQuantity--;
          }
        }
      }
    }


    this.storageMap.get('cartItems').subscribe((res: CartItem[]) => {
      this.cartItems = res;
      this.cartItems = this.cartItems.filter(item => item.productID != this.product.item.id)
      this.cartItems.push({ quantity: this.productQuantity, productID: this.product.item.id, dateAdded: this.product.dateAdded })
      this.storageMap.set('cartItems', this.cartItems).subscribe();
    })
  }

  deleteItem(id) {
    this.storageMap.get('cartItems').subscribe((res: CartItem[]) => {
      this.cartItems = res;
      console.error(res)
      this.cartItems = this.cartItems.filter(item => item.productID != id)
      if (this.cartItems.length > 0) {
        this.storageMap.set('cartItems', this.cartItems).subscribe();
      }
      else {
        this.storageMap.delete('cartItems').subscribe(() => { });
      }
    })
  }

  openFullDetailsProductModal(product: Product) {
    let modalOptions = {
      class: 'modal-dialog modal-dialog-scrollable modal-notify modal-info',
      data: {
        product: product,
        moderator: false
      },
    }
    this.modalRef = this.modalService.show(FullProductModalComponent, modalOptions);
  }
  ngOnInit(): void {

    this.productQuantity = this.product.quantity;
  }
}
