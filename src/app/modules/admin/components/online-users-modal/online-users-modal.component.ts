import { Component, OnInit } from '@angular/core';
import { MDBModalRef, MDBModalService } from 'ng-uikit-pro-standard';
import { UserService } from 'src/app/core/services/user.service';
import { FullUser } from 'src/app/core/models/user';
import { ConvertToCSVService } from 'src/app/core/services/convert-to-csv.service';
import { UserInfoModalComponent } from '../user-info-modal/user-info-modal.component';
import { AdminService } from 'src/app/core/services/admin.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-online-users-modal',
  templateUrl: './online-users-modal.component.html',
  styleUrls: ['./online-users-modal.component.scss']
})
export class OnlineUsersModalComponent implements OnInit {

  constructor(
    private modalRef: MDBModalRef,
    private modalService: MDBModalService,
    private userService: UserService,
    private adminService: AdminService,
    private csvService: ConvertToCSVService,
    private datePipe: DatePipe) { }

  users: string[];
  fullUsers: FullUser[] = [];
  modalOpen: MDBModalRef;

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

  downloadData() {
    let sortedArray = this.adminService.sortData(this.fullUsers);
    let date = this.datePipe.transform(new Date(), 'dd.MM.yy HH.mm');
    this.csvService.downloadFile(sortedArray, `Online Users- ${date}`, 'users')
  }

  ngOnInit(): void {
    this.fullUsers = [];
    this.users.forEach(uid => {
      this.userService.getUser(uid).then(res => {
        this.fullUsers.push(res);
      })
    });

  }

}
