import { Component, OnInit } from '@angular/core';
import { MDBModalRef, MDBModalService } from 'ng-uikit-pro-standard';
import { Order, OrderItem, OrderItemFull } from 'src/app/core/models/store/order';
import { Product } from 'src/app/core/models/store/product';
import { UserInfoModalComponent } from 'src/app/modules/admin/components/user-info-modal/user-info-modal.component';
import { FullProductModalComponent } from 'src/app/modules/home/components/full-product-modal/full-product-modal.component';
import { ActionsFirebaseService } from 'src/app/core/services/actions-firebase.service';

@Component({
  selector: 'app-full-details-order-modal',
  templateUrl: './full-details-order-modal.component.html',
  styleUrls: ['./full-details-order-modal.component.scss']
})
export class FullDetailsOrderModalComponent implements OnInit {

  constructor(
    private modalRef: MDBModalRef,
    private modalService: MDBModalService,
    private actions: ActionsFirebaseService) { }

  order: Order;
  orderItems: OrderItem[];
  fullOrderItems: OrderItemFull[] = [];
  product: Product;
  modalOpen: MDBModalRef;
  products: Product[] = [];




  openFullDetailsProductModal(product: Product) {
    let modalOptions = {
      class: 'modal-dialog modal-dialog-scrollable modal-notify modal-info',
      data: {
        product: product[0],
        moderator: true
      },
    }
    this.modalOpen = this.modalService.show(FullProductModalComponent, modalOptions);
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

  getAllProductById(element) {
    this.actions.getCollectionByID('products', element.product_id).then((res: Product) => {
      this.product = res;
      this.products.push(res);
      this.fullOrderItems.push({
        product_id: res[0].id,
        quantity: element.quantity,
        order_item_price: element.order_item_price,
        order_item_discount: element.order_item_discount,
        photoURL: res[0].photoURL,
        product_name: res[0].productName
      })
    })
  }


  closeModal() {
    this.modalRef.hide();
  }

  ngOnInit(): void {
    this.order.orderItems.forEach(element => {
      this.getAllProductById(element)
    });
  }

}
