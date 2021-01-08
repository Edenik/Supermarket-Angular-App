import { Component, OnInit } from '@angular/core';
import { MDBModalRef, MDBModalService } from 'ng-uikit-pro-standard';
import { Category } from 'src/app/core/models/store/category';
import { UserInfoModalComponent } from 'src/app/modules/admin/components/user-info-modal/user-info-modal.component';

@Component({
  selector: 'app-full-details-category-modal',
  templateUrl: './full-details-category-modal.component.html',
  styleUrls: ['./full-details-category-modal.component.scss']
})
export class FullDetailsCategoryModalComponent implements OnInit {

  constructor(
    private modalRef: MDBModalRef,
    private modalService: MDBModalService) { }

  modalOpen: MDBModalRef;
  category: Category;

  closeModal() {
    this.modalRef.hide();
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

  ngOnInit(): void {
  }

}
