import { Component, OnInit, OnDestroy } from '@angular/core';
import { StorageMap } from '@ngx-pwa/local-storage';
import { Subscription } from 'rxjs';
import { CartItem, CartItemFull } from '../../models/store/cart-item';
import { StoreApiService } from '../../services/store-api.service';
import { MDBModalService, MDBModalRef, ToastService } from 'ng-uikit-pro-standard';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { FullUser } from '../../models/user';
import { CreateOrderModalComponent } from 'src/app/modules/home/components/create-order-modal/create-order-modal.component';
import { ViewOrdersModalComponent } from 'src/app/modules/home/components/view-orders-modal/view-orders-modal.component';
import { ActionsFirebaseService } from '../../services/actions-firebase.service';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.scss']
})
export class ShoppingCartComponent implements OnInit, OnDestroy {

  constructor(
    private storageMap: StorageMap,
    private storeApi: StoreApiService,
    private modalService: MDBModalService,
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    public toast: ToastService,
    private actions: ActionsFirebaseService) { }

  dataSubscription: Subscription;
  data: CartItem[];
  products: CartItemFull[];
  productsToShow: CartItemFull[];
  totalCartPrice: number = 0;
  originalCartPrice: number = 0
  modalRef: MDBModalRef;
  userFromDatabase: FullUser;
  userLogged: boolean = false;
  uid: string;
  loading:boolean = true;


  openCreateOrderModal() {
    let modalOptions = {
      class: 'modal-dialog modal-dialog-scrollable modal-notify modal-info',
      data: {
        user: this.userFromDatabase,
        products: this.productsToShow,
        originalCartPrice: this.originalCartPrice,
        totalCartPrice: this.totalCartPrice
      },
      ignoreBackdropClick: true,
      backdrop: true
    }
    this.modalRef = this.modalService.show(CreateOrderModalComponent, modalOptions);
    this.modalRef.content.action.subscribe((result: string) => {
      if (result == 'delete') {
        this.deleteAll();
      }
    });
  }

  openViewOrdersModal() {
    let modalOptions = {
      class: 'modal-dialog modal-dialog-scrollable modal-notify modal-info',
      data: {
        uid: this.uid,
      },
    }
    this.modalRef = this.modalService.show(ViewOrdersModalComponent, modalOptions);
  }

  deleteAll() {
    this.storageMap.delete('cartItems').subscribe(() => { });
    this.totalCartPrice = 0;
    this.originalCartPrice = 0;
  }


  sort() {
    let sortedArray: CartItemFull[] = this.products.sort((obj1, obj2) => {
      let sortObject1 = obj1.dateAdded;
      let sortObject2 = obj2.dateAdded;
      if (sortObject1 < sortObject2)
        return 1;
      if (sortObject1 > sortObject2)
        return -1;
      return 0;
    });
    this.products = sortedArray;
    this.productsToShow = sortedArray;
  }

  checkIfUserLogged() {
    this.afAuth.user.subscribe((res: any) => {
      if (res) {
        this.uid = res.uid;
        this.getUser(res.uid);
        this.userLogged = true;
      }
      else {
        this.userFromDatabase = null;
        this.userLogged = false;
      }
    })
  }

  getUser(uid) {
    this.afs.collection<any>('users').doc(uid).valueChanges().subscribe((res: FullUser) => {
      if (res != undefined) {
        this.userFromDatabase = res;
      }
    }, err => {
      this.userFromDatabase = null;
    })
  }

  getDataFromLocalStorage() {
    this.data = [];
    this.dataSubscription = this.storageMap.watch('cartItems')
      .subscribe((result: CartItem[]) => {
        this.loading = true;
        this.totalCartPrice = 0;
        this.originalCartPrice = 0;
        this.products = [];
        if (result) {
          this.data = result;
          for (let index = 0; index < this.data.length; index++) {
            const element = this.data[index];
              this.actions.getCollectionByID('products', element.productID).then(res => {
              this.products.push({ quantity: element.quantity, item: res[0], dateAdded: element.dateAdded })
              this.sort();

              this.originalCartPrice += (res[0].price * element.quantity);

              if (res[0].inSale) {
                this.totalCartPrice += (res[0].salePrice * element.quantity);
              }
              else {
                this.totalCartPrice += (res[0].price * element.quantity);
              }

              if(index == this.data.length -1){
                this.loading = false;
              }
            })
          };

        }
        else {
          this.productsToShow = null;
          this.products = [];
          this.loading = false;

        }
      });
  }

  ngOnInit(): void {
    this.checkIfUserLogged();
    this.getDataFromLocalStorage();
  }
  ngOnDestroy() {
    this.dataSubscription.unsubscribe();
  }

}
