import { Component, OnInit, Input } from '@angular/core';
import { Product } from 'src/app/core/models/store/product';
import { StorageMap } from '@ngx-pwa/local-storage';
import { CartItem } from 'src/app/core/models/store/cart-item';
import { ToastService, MDBModalService, MDBModalRef } from 'ng-uikit-pro-standard';
import { FullProductModalComponent } from '../full-product-modal/full-product-modal.component';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {

  constructor(
    private toast: ToastService,
    private storageMap: StorageMap,
    private modalService: MDBModalService) { }

  @Input() product: Product;
  cartItems: CartItem[] = [];
  modalRef: MDBModalRef;

  addProduct(product) {
    this.storageMap.get<CartItem[]>('cartItems').subscribe((items: CartItem[]) => {
      if (items) {
        let itemExist: boolean = false;
        this.cartItems = items;

        this.cartItems.forEach(element => {
          if (element.productID == product.id) {
            itemExist = true;
            this.toast.error('המוצר כבר קיים בעגלה')
          }
        });

        if (!itemExist) {
          this.cartItems.push({ productID: product.id, quantity: 1, dateAdded: new Date() });
          this.storageMap.set('cartItems', this.cartItems).subscribe(() => { });
        }
      }
      else {
        this.cartItems = [{ productID: product.id, quantity: 1, dateAdded: new Date() }];
        this.storageMap.set('cartItems', this.cartItems).subscribe(() => { });
      }
    });
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
  }

}
