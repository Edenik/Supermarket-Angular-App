import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/core/services/admin.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { FullUser } from 'src/app/core/models/user';
import { PresenceService } from 'src/app/core/services/presence.service';
import { MDBModalService, MDBModalRef } from 'ng-uikit-pro-standard';
import { SubscribedUsersModalComponent } from '../../components/subscribed-users-modal/subscribed-users-modal.component';
import { OnlineUsersModalComponent } from '../../components/online-users-modal/online-users-modal.component';
import { ConvertToCSVService } from 'src/app/core/services/convert-to-csv.service';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { Order } from 'src/app/core/models/store/order';
import { ActionsFirebaseService } from 'src/app/core/services/actions-firebase.service';

@Component({
  selector: 'app-control-panel',
  templateUrl: './control-panel.component.html',
  styleUrls: ['./control-panel.component.scss']
})
export class ControlPanelComponent implements OnInit {

  constructor(
    private adminService: AdminService,
    private modalService: MDBModalService,
    private csvService: ConvertToCSVService,
    private afs: AngularFirestore,
    private presence: PresenceService,
    private datePipe: DatePipe,
    private actions:ActionsFirebaseService,
    private router: Router) { }

  subscribedUsers: string[] = [];
  onlineUsers: string[] = [];
  registeredUsers: number = 0;
  modalRef: MDBModalRef;
  users: FullUser[] = [];
  orders: Order[] = [];
  incomes: number = 0;
  incomesLast24Hours: number = 0;

  navigate(url) {
    this.router.navigate([url])
  }

  downloadData() {
    var sortedArray = this.adminService.sortData(this.users);
    let date = this.datePipe.transform(new Date(), 'dd.MM.yy HH.mm');
    this.csvService.downloadFile(sortedArray, `Resgistered Users- ${date}`, 'users');
  }

  openOnlineUsersModal(subscribedUsers) {
    let modalOptions = {
      class: 'modal-dialog  modal-notify modal-success',
      data: {
        users: subscribedUsers
      }
    }
    this.modalRef = this.modalService.show(OnlineUsersModalComponent, modalOptions);
  }


  openSubscribersModal(subscribedUsers) {
    let modalOptions = {
      class: 'modal-dialog  modal-notify modal-info',
      data: {
        users: subscribedUsers
      }
    }
    this.modalRef = this.modalService.show(SubscribedUsersModalComponent, modalOptions);
  }

  getAllUsers() {
    this.afs.collection<FullUser>('users').valueChanges().subscribe(res => {
      this.subscribedUsers = this.adminService.getSubscribers(res);
      this.registeredUsers = res.length;
      this.users = res;
    })
  }

  getAllOrders() {
    this.orders = [];
    this.actions.getCollection('orders').subscribe((res: Order[]) => {
      this.orders = res;
      this.orders.forEach(element => {
        if (Number(new Date()) - Number(new Date(element.orderDate)) <= 86400000 * 7) {
          this.incomes += (element.originalOrderPrice - element.orderDiscount);
        }
        if (Number(new Date()) - Number(new Date(element.orderDate)) <= 86400000 * 1) {
          this.incomesLast24Hours += (element.originalOrderPrice - element.orderDiscount);
        }

      });
    })
  }

  getOnlineUsers() {
    this.presence.getAllPresence().subscribe(res => {
      this.onlineUsers = [];
      Object.entries(res).forEach(user => {
        if (user[1].status === "online" || user[1].status === "away") {
          this.onlineUsers.push(user[0]);
        }
      });
    })
  }

  ngOnInit(): void {
    this.getAllOrders();
    this.getAllUsers();
    this.getOnlineUsers();
  }

}
