import { Component, OnInit } from '@angular/core';
import { MDBModalRef, MDBModalService } from 'ng-uikit-pro-standard';
import { SubCategory } from 'src/app/core/models/store/category';
import { UserInfoModalComponent } from 'src/app/modules/admin/components/user-info-modal/user-info-modal.component';

@Component({
  selector: 'app-full-details-subcategory-modal',
  templateUrl: './full-details-subcategory-modal.component.html',
  styleUrls: ['./full-details-subcategory-modal.component.scss']
})
export class FullDetailsSubcategoryModalComponent implements OnInit {

  constructor(
    private modalRef: MDBModalRef,
    private modalService: MDBModalService) { }

  modalOpen: MDBModalRef;
  subcategory: SubCategory;

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

