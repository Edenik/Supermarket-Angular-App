import { Component, OnInit } from '@angular/core';
import { MDBModalRef, ToastService } from 'ng-uikit-pro-standard';
import { AngularFireAuth } from '@angular/fire/auth';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { Order } from 'src/app/core/models/store/order';
import { StoreApiService } from 'src/app/core/services/store-api.service';
import { ActionsFirebaseService } from 'src/app/core/services/actions-firebase.service';

@Component({
  selector: 'app-edit-order-modal',
  templateUrl: './edit-order-modal.component.html',
  styleUrls: ['./edit-order-modal.component.scss']
})
export class EditOrderModalComponent implements OnInit {

  constructor(
    private modalRef: MDBModalRef,
    private toast: ToastService,
    private afAuth: AngularFireAuth,
    private actions: ActionsFirebaseService) { }

  reactiveForm: FormGroup;
  validatingForm: FormGroup;
  uid: string;
  action: Subject<Order> = new Subject();
  order: Order;

  status: string[] = [
    "ההזמנה התקבלה בחנות",
    "ההזמנה בהכנה",
    "ההזמנה במשלוח",
    "ההזמנה הגיעה ליעדה"
  ]

  closeModal() {
    this.modalRef.hide();
  }


  get editOrderStatus() {
    return this.validatingForm.get('editOrderStatus');
  }

  changeStatus(e) {
    let newStatus = e.target.value;
    this.validatingForm.value.editOrderStatus = newStatus;
  }


  save() {
    if (this.validatingForm.value.editOrderStatus == this.order.orderStatus) {
      this.modalRef.hide();
      this.toast.error(`לא בוצע שינוי!`)
    }

    else {
      let editedOrder:Order = {
        id: this.order.id,
        fullName: this.order.fullName,
        phone: this.order.phone,
        email: this.order.email,
        city: this.order.city,
        adress: this.order.adress,
        comments: this.order.comments,
        orderStatus: this.validatingForm.value.editOrderStatus,
        uid: this.order.uid,
        orderDiscount: this.order.orderDiscount,
        originalOrderPrice: this.order.originalOrderPrice,
        orderDate: this.order.orderDate,
        statusUpdateUID: this.uid,
        orderItems:this.order.orderItems,
        statusUpdateDate: String(new Date())
      }

      this.actions.updateCollection('orders', editedOrder).then(res => {
        this.action.next(editedOrder);
        this.toast.success(`סטאטוס הזמנה ${editedOrder.id} עודכן בהצלחה!`)
        this.modalRef.hide();
      }, err => {
        this.toast.error(`לא היה ניתן לבצע את הבקשה!`)
        this.action.next(null);
        this.modalRef.hide();
      })
    }
  }



  getUser() {
    this.afAuth.user.subscribe((res: any) => {
      this.uid = res.uid;
    })
  }



  ngOnInit(): void {
    this.getUser();
    this.validatingForm = new FormGroup({
      editOrderStatus: new FormControl(this.order.orderStatus, Validators.required),
    });

  }

}