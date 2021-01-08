import { Component, OnInit } from '@angular/core';
import { MDBModalRef } from 'ng-uikit-pro-standard';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-confirm-delete-modal',
  templateUrl: './confirm-delete-modal.component.html',
  styleUrls: ['./confirm-delete-modal.component.scss']
})
export class ConfirmDeleteModalComponent implements OnInit {

  constructor(private modalRef: MDBModalRef,) { }

  action: Subject<boolean> = new Subject();

  closeModal() {
    this.modalRef.hide();
    this.action.next(false);
  }

  confirm() {
    this.modalRef.hide();
    this.action.next(true);
  }
  ngOnInit(): void {
  }

}
