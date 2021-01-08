import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from 'src/app/core/services/auth.service';
import { UserService } from 'src/app/core/services/user.service';
import { PresenceService } from 'src/app/core/services/presence.service';
import { FullUser } from 'src/app/core/models/user';
import { MDBModalRef, MDBModalService } from 'ng-uikit-pro-standard';
import { SubscribedUsersModalComponent } from '../../components/subscribed-users-modal/subscribed-users-modal.component';
import { AdminService } from 'src/app/core/services/admin.service';
import { OnlineUsersModalComponent } from '../../components/online-users-modal/online-users-modal.component';
import { ConvertToCSVService } from 'src/app/core/services/convert-to-csv.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private afs: AngularFirestore,
    private userService: UserService,
    private adminService: AdminService,
    public presence: PresenceService,
    private csvService: ConvertToCSVService,
    private modalService: MDBModalService,
    private datePipe: DatePipe) { }

  users: FullUser[];
  subscribedUsers: string[];
  onlineUsers: string[] = [];
  registeredUsers: number = 0;
  modalRef: MDBModalRef;

  downloadData() {
    var sortedArray = this.adminService.sortData(this.users);
    let date = this.datePipe.transform(new Date(), 'dd.MM.yy HH.mm');
    this.csvService.downloadFile(sortedArray, `Resgistered Users- ${date}`, 'users')
  }

  openOnlineUsersModal(subscribedUsers) {
    let modalOptions = {
      class: 'modal-dialog  modal-notify modal-success',
      data: {
        users: subscribedUsers
      }
    }
    this.modalRef = this.modalService.show(OnlineUsersModalComponent, modalOptions)
  }

  openSubscribersModal(subscribedUsers) {
    let modalOptions = {
      class: 'modal-dialog  modal-notify modal-info',
      data: {
        users: subscribedUsers
      }
    }
    this.modalRef = this.modalService.show(SubscribedUsersModalComponent, modalOptions)
  }

  updateRole(role, uid) {
    this.userService.getUser(uid).then(res => {
      this.authService.updateUserRole(uid, role, res);
    })
  }

  getAllUsers() {
    this.afs.collection<FullUser>('users').valueChanges().subscribe(res => {
      this.users = res;
      this.subscribedUsers = this.adminService.getSubscribers(res);
      this.registeredUsers = res.length;
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
    this.getAllUsers();
    this.getOnlineUsers();
  }

}
