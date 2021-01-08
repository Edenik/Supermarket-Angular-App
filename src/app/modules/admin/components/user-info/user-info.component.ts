import { Component, OnInit, Input } from '@angular/core';
import { FullUser } from 'src/app/core/models/user';
import { PresenceService } from 'src/app/core/services/presence.service';
import { MDBModalRef, MDBModalService } from 'ng-uikit-pro-standard';
import { EditUserModalComponent } from '../edit-user-modal/edit-user-modal.component';
import { ConvertToCSVService } from 'src/app/core/services/convert-to-csv.service';
import { DatePipe } from '@angular/common';
import { Order } from 'src/app/core/models/store/order';
import { UserInfoModalComponent } from '../user-info-modal/user-info-modal.component';
import { ActionsFirebaseService } from 'src/app/core/services/actions-firebase.service';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss']
})
export class UserInfoComponent implements OnInit {

  constructor(
    private presence: PresenceService,
    private csvService: ConvertToCSVService,
    public modalService: MDBModalService,
    private datePipe: DatePipe,
    private actions: ActionsFirebaseService
  ) { }

  @Input() user: FullUser;
  exportFullUser: FullUser[] = [];
  public presence$;
  modalOpen: MDBModalRef;
  orders: Order[];
  incomes: number = 0;

  editUserModal(user) {
    let modalOptions = {
      class: 'modal-dialog  modal-notify modal-info',
      data: {
        user: user
      }
    }
    this.modalOpen = this.modalService.show(EditUserModalComponent, modalOptions);
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

  getAllUserOrders() {
    this.orders = [];
    this.actions.getCollectionByUID('orders', this.user.uid).then((res: Order[]) => {
      this.orders = res;
      this.orders.forEach(ele => {
        this.incomes += ele.originalOrderPrice - ele.orderDiscount;
      })
    })
  }

  downloadData() {
    let date = this.datePipe.transform(new Date(), 'dd.MM.yy HH.mm');
    this.csvService.downloadFile(this.exportFullUser, `User- ${this.user.displayName} Date- ${date}`, 'users')
  }


  ngOnInit(): void {
    this.getAllUserOrders();
    this.presence$ = this.presence.getPresence(this.user.uid);
    this.exportFullUser.push(this.user);
  }

}
