import { Component, OnInit } from '@angular/core';
import { MDBModalRef, MDBModalService } from 'ng-uikit-pro-standard';
import { UserService } from 'src/app/core/services/user.service';
import { FullUser } from 'src/app/core/models/user';
import { PresenceService } from 'src/app/core/services/presence.service';
import { ConvertToCSVService } from 'src/app/core/services/convert-to-csv.service';
import { EditUserModalComponent } from '../edit-user-modal/edit-user-modal.component';
import { AdminService } from 'src/app/core/services/admin.service';
import { DatePipe } from '@angular/common';
import { AngularFireAuth } from '@angular/fire/auth';
import { Order } from 'src/app/core/models/store/order';
import { ActionsFirebaseService } from 'src/app/core/services/actions-firebase.service';

@Component({
  selector: 'app-user-info-modal',
  templateUrl: './user-info-modal.component.html',
  styleUrls: ['./user-info-modal.component.scss']
})
export class UserInfoModalComponent implements OnInit {

  constructor(
    private userService: UserService,
    private modalRef: MDBModalRef,
    private presence: PresenceService,
    private modalService: MDBModalService,
    private csvService: ConvertToCSVService,
    private adminService: AdminService,
    private datePipe: DatePipe,
    private afAuth: AngularFireAuth,
    private actions: ActionsFirebaseService) { }

  public presence$;
  uid: string;
  fullUser: FullUser;
  exportFullUser: FullUser[] = [];
  modalOpen: MDBModalRef;
  roleType: string;
  orders: Order[];
  incomes: number = 0;

  closeModal() {
    this.modalRef.hide();
  }

  editUserModal(user) {
    let modalOptions = {
      class: 'modal-dialog  modal-notify modal-info',
      data: {
        user: user
      }
    }
    this.modalOpen = this.modalService.show(EditUserModalComponent, modalOptions);
  }



  downloadData() {
    let sortedArray = this.adminService.sortData(this.exportFullUser);
    let date = this.datePipe.transform(new Date(), 'dd.MM.yy HH.mm');
    this.csvService.downloadFile(sortedArray, `User- ${this.fullUser.displayName} Date- ${date}`, 'users')
  }

  checkUserRole() {
    this.afAuth.user.subscribe((res: any) => {
      if (res) {
        this.uid = res.uid;
        this.userService.get(res.uid).valueChanges().subscribe((res: any) => {
          this.roleType = res.roleType;
        })
      }
    })
  }

  getAllUserOrders(uid) {
    this.orders = [];

    this.actions.getCollectionByUID('orders', uid).then((res: Order[]) => {
      this.orders = res;
      this.orders.forEach(ele => {
        this.incomes += ele.originalOrderPrice - ele.orderDiscount;
      })
    })
  }

  ngOnInit(): void {
    this.fullUser = null;
    this.checkUserRole();
    this.userService.getUser(this.uid).then((res: FullUser) => {
      this.fullUser = res;
      this.exportFullUser.push(this.fullUser);
      this.getAllUserOrders(res.uid);
    })
    this.presence$ = this.presence.getPresence(this.uid);
  }

}
