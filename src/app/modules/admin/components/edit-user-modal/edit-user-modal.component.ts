import { Component, OnInit } from '@angular/core';
import { FullUser } from 'src/app/core/models/user';
import { UserService } from 'src/app/core/services/user.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { ToastService, MDBModalRef, MDBModalService } from 'ng-uikit-pro-standard'
import { ConfirmDeleteModalComponent } from 'src/app/modules/moderator/components/confirm-delete-modal/confirm-delete-modal.component';

@Component({
  selector: 'app-edit-user-modal',
  templateUrl: './edit-user-modal.component.html',
  styleUrls: ['./edit-user-modal.component.scss']
})
export class EditUserModalComponent implements OnInit {

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private toast: ToastService,
    private modalRef: MDBModalRef,
    private modalService: MDBModalService) { }

  user: FullUser;
  modalOpen:MDBModalRef;

  updateRole(role, uid) {
    this.userService.getUser(uid).then(res => {
      this.authService.updateUserRole(this.user, role, res);
      this.toast.success(`User uid: ${uid}, has been promoted to ${role}`)
    })
    this.user.roleType = role;
  }

  updateSubscribe(user, condition) {
    if (condition==true) {
      this.toast.success(`${user.displayName} נרשם בהצלחה לניוזלטר`)
    }
    else {
      this.toast.warning(`${user.displayName} לא ברשימת הניוזלטר יותר`)
    }
    this.userService.updateSubscribe(user, condition)
    this.user.subscribeToNews = condition;
  }

  deleteUser(uid) {
    let modalOptions = {
      class: 'modal-dialog modal-sm modal-notify modal-danger',
    }
    this.modalOpen = this.modalService.show(ConfirmDeleteModalComponent, modalOptions);
    this.modalOpen.content.action.subscribe((result: boolean) => {
      if (result) {
        this.userService.deleteUser(uid)
        this.modalRef.hide();
      }
    });
  }

  resetPassword(user) {
    this.userService.resetPassword(user.email)
      .then(res => {
        this.toast.success("A mail with reset password form was sent to user email!")
      }, err => {
        this.toast.warning(err)
      })
  }

  closeModal() {
    this.modalRef.hide();
  }

  ngOnInit(): void {
  }

}
