import { Component, OnInit, } from '@angular/core';
import { Order, OrderItem } from 'src/app/core/models/store/order';
import { ConvertToCSVService } from 'src/app/core/services/convert-to-csv.service';
import { DatePipe } from '@angular/common';
import { MDBModalRef } from 'ng-uikit-pro-standard';
import { ActivatedRoute } from '@angular/router';
import { ActionsFirebaseService } from 'src/app/core/services/actions-firebase.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {

  constructor(
    private csvService: ConvertToCSVService,
    private datePipe: DatePipe,
    private activeRoute: ActivatedRoute,
    private actions: ActionsFirebaseService) { }

  modalRef: MDBModalRef;
  searchUID: string;
  orders: Order[] = null;
  orderItems: OrderItem[];
  reqComplete: boolean = false;

  sort(category, direction) {
    let sortObject1;
    let sortObject2;

    let sortedArray: Order[] = this.orders.sort((obj1, obj2) => {

      switch (category) {
        case 'id':
          sortObject1 = obj1.id;
          sortObject2 = obj2.id;
          break;
        case 'name':
          sortObject1 = obj1.fullName;
          sortObject2 = obj2.fullName;
          break;
        case 'date':
          sortObject1 = Number(new Date(obj1.orderDate));
          sortObject2 = Number(new Date(obj2.orderDate));
          break;
        case 'name':
          sortObject1 = obj1.fullName;
          sortObject2 = obj2.fullName;
          break;
        case 'price':
          sortObject1 = obj1.originalOrderPrice - obj1.orderDiscount;
          sortObject2 = obj2.originalOrderPrice - obj2.orderDiscount;
          break;
        default:
          break;
      }
      if (direction == 'minus') {
        if (sortObject1 < sortObject2)
          return 1;
        if (sortObject1 > sortObject2)
          return -1;
        return 0;
      }
      else {
        if (sortObject1 > sortObject2)
          return 1;
        if (sortObject1 < sortObject2)
          return -1;
        return 0;
      }

    });
    this.orders = sortedArray;
  }

  getAllOrders() {
    this.orders = [];
    this.actions.getCollection('orders').subscribe((res: Order[]) => {
      this.orders = res;
      this.sort('id', 'minus');
      this.reqComplete = true;
    })
  }

  downloadOrdersData() {
    let date = this.datePipe.transform(new Date(), 'dd.MM.yy HH.mm');
    this.csvService.downloadFile(this.orders, `Orders- ${date}`, 'orders');
  }


  ngOnInit() {
    this.activeRoute.params.subscribe(params => {
      this.searchUID = params.uid
    })
    this.getAllOrders();
  }

}