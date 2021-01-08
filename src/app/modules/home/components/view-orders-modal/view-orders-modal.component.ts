import { Component, OnInit } from '@angular/core';
import { MDBModalRef, MDBModalService } from 'ng-uikit-pro-standard';
import { Order, OrderItem, OrderItemFull } from 'src/app/core/models/store/order';
import { FullDetailsOrderModalComponent } from 'src/app/modules/moderator/components/full-details-order-modal/full-details-order-modal.component';
import { Product } from 'src/app/core/models/store/product';
import { LoadAsShoppingListComponent } from '../load-as-shopping-list/load-as-shopping-list.component';
import { ActionsFirebaseService } from 'src/app/core/services/actions-firebase.service';

@Component({
  selector: 'app-view-orders-modal',
  templateUrl: './view-orders-modal.component.html',
  styleUrls: ['./view-orders-modal.component.scss']
})
export class ViewOrdersModalComponent implements OnInit {

  constructor(
    private modalRef: MDBModalRef,
    private modalService: MDBModalService,
    private actions: ActionsFirebaseService) { }

  modalOpen: MDBModalRef;
  uid: string;
  orders: Order[];
  ordersToShow: Order[] = [];
  orderItems: OrderItem[] = [];
  products: Product[] = [];
  product: Product;
  fullOrderItems: OrderItemFull[] = [];
  loading: boolean = true;


  closeModal() {
    this.modalRef.hide();
  }

  getAllOrders() {
    this.orders = [];
    this.actions.getCollection('orders').subscribe((res: Order[]) => {
      this.loading = true;
      this.orders = res.filter(ele => ele.uid == this.uid);
      this.sort();
    })
  }

  openFullDetailsOrderModal(order: Order) {
    let modalOptions = {
      class: 'modal-dialog modal-dialog-scrollable modal-notify modal-info',
      data: {
        order: order,
      },
    }
    this.modalOpen = this.modalService.show(FullDetailsOrderModalComponent, modalOptions);
  }

  // getAllOrderItemsById(order) {
  //   this.orderItems = [];
  //   this.api.getAllOrderItemsByOrderId(order.id).subscribe((res: OrderItem[]) => {
  //     this.orderItems = res;
  //   }, err => {
  //   }, () => {
  //     this.openLoadAsShoppingListModal();
  //   })
  // }

  openLoadAsShoppingListModal() {
    let modalOptions = {
      class: 'modal-dialog modal-dialog-scrollable modal-notify modal-info',
      data: {
        orderItems: this.orderItems,
      },
    }
    this.modalOpen = this.modalService.show(LoadAsShoppingListComponent, modalOptions);
  }


  sort() {
    let sortedArray: Order[] = this.orders.sort((obj1, obj2) => {
      let sortObject1 = obj1.id;
      let sortObject2 = obj2.id;
      if (sortObject1 < sortObject2)
        return 1;
      if (sortObject1 > sortObject2)
        return -1;
      return 0;
    });
    this.ordersToShow = sortedArray;
    this.loading = false;
  }

  ngOnInit(): void {
    this.getAllOrders();
  }
}
