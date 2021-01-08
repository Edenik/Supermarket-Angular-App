import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Product } from 'src/app/core/models/store/product';
import { MDBModalService, MDBModalRef } from 'ng-uikit-pro-standard';
import { ConfirmDeleteModalComponent } from '../confirm-delete-modal/confirm-delete-modal.component';
import { EditProductModalComponent } from '../edit-product-modal/edit-product-modal.component';
import { FullProductModalComponent } from 'src/app/modules/home/components/full-product-modal/full-product-modal.component';
import { ActionsFirebaseService } from 'src/app/core/services/actions-firebase.service';
import { ExportImportDataService } from 'src/app/core/services/export-import-data.service';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent implements OnInit {

  constructor(
    private modalService: MDBModalService,
    private actions: ActionsFirebaseService,
    private jsonData: ExportImportDataService) { }
    
  @Input() product: Product;
  modalRef: MDBModalRef;
  @Output() delete = new EventEmitter<number>();

  exportJsonData(item: Product) {
    this.jsonData.dynamicDownloadJson(item, "מוצר - " + item.productName);
  }

  deleteProduct(id) {
    let modalOptions = {
      class: 'modal-dialog modal-sm modal-notify modal-danger',
    }
    this.modalRef = this.modalService.show(ConfirmDeleteModalComponent, modalOptions);
    this.modalRef.content.action.subscribe((result: boolean) => {
      if (result) {
        this.actions.deleteCollection('products', id).then(res => {
          this.delete.emit(this.product.id)
        })
      }
    });
  }

  openEditProductModal(product: Product) {
    let modalOptions = {
      class: 'modal-dialog modal-dialog-scrollable modal-notify modal-warning',
      data: {
        product: product,
        formType: 'editProduct'
      },
      ignoreBackdropClick: true
    }
    this.modalRef = this.modalService.show(EditProductModalComponent, modalOptions);
    this.modalRef.content.action.subscribe((result: Product) => {
      this.product = result;
    });
  }



  openFullDetailsProductModal(product: Product) {
    let modalOptions = {
      class: 'modal-dialog modal-dialog-scrollable modal-notify modal-info',
      data: {
        product: product,
        moderator: true
      },
    }
    this.modalRef = this.modalService.show(FullProductModalComponent, modalOptions);
  }

  ngOnInit(): void {
  }

}