import { Component, OnInit } from '@angular/core';
import { MDBModalRef, MDBModalService } from 'ng-uikit-pro-standard';
import { AdminService } from 'src/app/core/services/admin.service';
import { ConvertToCSVService } from 'src/app/core/services/convert-to-csv.service';
import { UserService } from 'src/app/core/services/user.service';
import { FullUser, MinUser } from 'src/app/core/models/user';
import { UserInfoModalComponent } from '../user-info-modal/user-info-modal.component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-subscribed-users-modal',
  templateUrl: './subscribed-users-modal.component.html',
  styleUrls: ['./subscribed-users-modal.component.scss']
})
export class SubscribedUsersModalComponent implements OnInit {

  constructor(
    private modalRef: MDBModalRef,
    private modalService: MDBModalService,
    private csvService: ConvertToCSVService,
    private adminService: AdminService,
    private userService: UserService,
    private datePipe: DatePipe) { }

  users: MinUser[];
  fullUsers: FullUser[] = [];
  modalOpen: MDBModalRef;

  downloadData() {
    var sortedArray = this.adminService.sortData(this.fullUsers);
    let date = this.datePipe.transform(new Date(), 'dd.MM.yy HH.mm');
    this.csvService.downloadFile(sortedArray, `Subscribers- ${date}`, 'users')
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

  closeModal() {
    this.modalRef.hide();
  }
  ngOnInit(): void {
    this.users.forEach(user => {
      this.userService.getUser(user.uid).then(res => {
        this.fullUsers.push(res);
      })
    });
  }

}
