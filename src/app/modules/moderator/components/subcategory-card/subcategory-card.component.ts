import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Category, SubCategory } from 'src/app/core/models/store/category';
import { MDBModalRef, MDBModalService } from 'ng-uikit-pro-standard';
import { ConfirmDeleteModalComponent } from '../confirm-delete-modal/confirm-delete-modal.component';
import { EditSubcategoryModalComponent } from '../edit-subcategory-modal/edit-subcategory-modal.component';
import { Product } from 'src/app/core/models/store/product';
import { FullDetailsSubcategoryModalComponent } from '../full-details-subcategory-modal/full-details-subcategory-modal.component';
import { ActionsFirebaseService } from 'src/app/core/services/actions-firebase.service';
import { ExportImportDataService } from 'src/app/core/services/export-import-data.service';

@Component({
  selector: 'app-subcategory-card',
  templateUrl: './subcategory-card.component.html',
  styleUrls: ['./subcategory-card.component.scss']
})
export class SubcategoryCardComponent implements OnInit {

  constructor(
    private modalService: MDBModalService,
    private actions: ActionsFirebaseService,
    private jsonData: ExportImportDataService) { }

  @Input() subcategory: SubCategory;
  @Input() categories: Category[];
  @Output() delete = new EventEmitter<number>();
  modalRef: MDBModalRef;
  products: Product[];

  exportJsonData(item: SubCategory) {
    this.jsonData.dynamicDownloadJson(item, "תת-קטגוריה - " + item.name);
  }

  deleteSubcategory(id) {
    let modalOptions = {
      class: 'modal-dialog modal-sm modal-notify modal-danger',
    }
    this.modalRef = this.modalService.show(ConfirmDeleteModalComponent, modalOptions);
    this.modalRef.content.action.subscribe((result: boolean) => {
      if (result) {
        this.actions.deleteCollection('subcategories', id).then(res => {
          this.delete.emit(this.subcategory.id)
        })
      }
    });
  }


  openEditSubcategoryModal(subcategory: SubCategory) {
    let modalOptions = {
      class: 'modal-dialog modal-notify modal-warning',
      data: {
        subcategory: subcategory,
        formType: 'editSubcategory',
        categories: this.categories
      },
      ignoreBackdropClick: true
    }
    this.modalRef = this.modalService.show(EditSubcategoryModalComponent, modalOptions);
    this.modalRef.content.action.subscribe((result: SubCategory) => {
      this.subcategory = result;
    });
  }

  openFullDetailsSubategoryModal(subcategory: SubCategory) {
    let modalOptions = {
      class: 'modal-dialog modal-dialog-scrollable modal-notify modal-info',
      data: {
        subcategory: subcategory,
      },
    }
    this.modalRef = this.modalService.show(FullDetailsSubcategoryModalComponent, modalOptions);
  }



  ngOnInit(): void {
  }

}
