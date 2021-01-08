import { Component, OnInit, Input } from '@angular/core';
import { MDBModalRef, ToastService } from 'ng-uikit-pro-standard';
import { Subject } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FullUser } from 'src/app/core/models/user';
import { CartItemFull } from 'src/app/core/models/store/cart-item';
import { OrderItem, Order } from 'src/app/core/models/store/order';
import { ActionsFirebaseService } from 'src/app/core/services/actions-firebase.service';

@Component({
  selector: 'app-create-order-modal',
  templateUrl: './create-order-modal.component.html',
  styleUrls: ['./create-order-modal.component.scss']
})
export class CreateOrderModalComponent implements OnInit {

  constructor(
    private modalRef: MDBModalRef,
    private actions:ActionsFirebaseService) { }

  action: Subject<string> = new Subject();
  @Input() user:FullUser;
  @Input() products:CartItemFull[];
  @Input() originalCartPrice:number;
  @Input() totalCartPrice:number;
  newOrder:Order;
  orderItem:OrderItem;
  orderItems:OrderItem[] = [];
  orders:Order[] = [];
  validatingForm: FormGroup;

  closeModal(){
    this.modalRef.hide();
    this.action.next(null);
  }

  sendOrder(){
    this.products.forEach(element => {
      this.orderItems.push({
        product_id:element.item.id,
        quantity:element.quantity,
        order_item_price:element.item.price,
        order_item_discount:element.item.salePrice || 0
      })
    });
    
    this.newOrder = {
      id:this.orders.length+1,
      fullName: this.user.displayName,
      phone:this.validatingForm.value.createOrderModalPhone,
      email:this.validatingForm.value.createOrderModalEmail,
      city:this.validatingForm.value.createOrderModalCity,
      adress:this.validatingForm.value.createOrderModalAdress,
      comments:this.validatingForm.value.createOrderModalComments,
      orderStatus:'ההזמנה התקבלה בחנות',
      uid:this.user.uid,
      orderDiscount:this.originalCartPrice-this.totalCartPrice,
      originalOrderPrice:this.originalCartPrice,
      orderDate:String(new Date()),
      statusUpdateDate:null,
      statusUpdateUID:null,
      orderItems:this.orderItems
    }


    this.actions.updateCollection('orders',this.newOrder).then(res=>{
          this.action.next('delete');
          this.modalRef.hide();
    })
  }



  getAllOrders(){
    this.actions.getCollection('orders').subscribe(res => {
      this.orders = res;
    })
  }


  ngOnInit(): void {
    this.validatingForm = new FormGroup({
      createOrderModalPhone: new FormControl(this.user.phoneNumber || null, Validators.required),
      createOrderModalEmail: new FormControl(this.user.email || null, Validators.email,),
      createOrderModalCity: new FormControl('', Validators.required),
      createOrderModalAdress: new FormControl('', Validators.required),
      createOrderModalComments: new FormControl('')
    });

    this.getAllOrders();
  }

  get createOrderModalPhone() {
    return this.validatingForm.get('createOrderModalPhone');
  }

  get createOrderModalEmail() {
    return this.validatingForm.get('createOrderModalEmail');
  }

  get createOrderModalCity() {
    return this.validatingForm.get('createOrderModalCity');
  }

  get createOrderModalAdress() {
    return this.validatingForm.get('createOrderModalAdress');
  }
  get createOrderModalComments() {
    return this.validatingForm.get('createOrderModalComments');
  }
}
