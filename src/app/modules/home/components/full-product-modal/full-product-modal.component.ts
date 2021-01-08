import { Component, OnInit } from '@angular/core';
import { MDBModalRef, ToastService, MDBModalService } from 'ng-uikit-pro-standard';
import { Product } from 'src/app/core/models/store/product';
import { StorageMap } from '@ngx-pwa/local-storage';
import { CartItem } from 'src/app/core/models/store/cart-item';
import { UserInfoModalComponent } from 'src/app/modules/admin/components/user-info-modal/user-info-modal.component';

@Component({
  selector: 'app-full-product-modal',
  templateUrl: './full-product-modal.component.html',
  styleUrls: ['./full-product-modal.component.scss']
})
export class FullProductModalComponent implements OnInit {

  constructor(
    private modalRef: MDBModalRef,
    private storageMap: StorageMap,
    private toast: ToastService,
    private modalService: MDBModalService) { }

  cartItems: CartItem[] = [];
  product: Product;
  moderator: boolean;
  modalOpen: MDBModalRef;

  closeModal() {
    this.modalRef.hide();
  }

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

  openUserInfoModal(uid) {
    let modalOptions = {
      class: 'modal-dialog modal-dialog-scrollable modal-notify modal-info',
      data: {
        uid: uid
      }
    }
    this.modalOpen = this.modalService.show(UserInfoModalComponent, modalOptions)
  }

  ngOnInit(): void {
  }

}
