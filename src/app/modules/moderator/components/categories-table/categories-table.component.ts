import { Component, OnInit, Input, ChangeDetectorRef, AfterViewInit, ViewChild, ElementRef, HostListener, Output, EventEmitter } from '@angular/core';
import { Category } from 'src/app/core/models/store/category';
import { MdbTableDirective, MdbTablePaginationComponent, MDBModalService, MDBModalRef } from 'ng-uikit-pro-standard';
import { HeadElements } from 'src/app/core/models/store/headElements';
import { ConfirmDeleteModalComponent } from '../confirm-delete-modal/confirm-delete-modal.component';
import { EditCategoryModalComponent } from '../edit-category-modal/edit-category-modal.component';
import { FullDetailsCategoryModalComponent } from '../full-details-category-modal/full-details-category-modal.component';
import { ActionsFirebaseService } from 'src/app/core/services/actions-firebase.service';
import { ExportImportDataService } from 'src/app/core/services/export-import-data.service';

@Component({
  selector: 'app-categories-table',
  templateUrl: './categories-table.component.html',
  styleUrls: ['./categories-table.component.scss']
})
export class CategoriesTableComponent implements OnInit, AfterViewInit {

  constructor(private cdRef: ChangeDetectorRef,
    private modalService: MDBModalService,
    private actions: ActionsFirebaseService,
    private jsonData: ExportImportDataService) { }

  @Input() categories: Category[];
  @Input() searchQuery: string;
  @Output() delete = new EventEmitter<number>();
  @ViewChild(MdbTableDirective, { static: true }) mdbTable: MdbTableDirective;
  @ViewChild(MdbTablePaginationComponent, { static: true }) mdbTablePagination: MdbTablePaginationComponent;
  @ViewChild('row', { static: true }) row: ElementRef;
  @HostListener('input') oninput() {
    this.mdbTablePagination.searchText = this.searchText;
  }
  modalRef: MDBModalRef;
  headElements: HeadElements[] = [
    { value: 'id', display: 'ID' },
    { value: 'categoryName', display: 'שם קטגוריה' },
    { value: 'quantity', display: 'מוצרים' },
    { value: 'dateAdded', display: 'תאריך הוספה' },
    { value: 'actions', display: 'פעולות' },
  ];
  searchText: string = '';
  previous: string;
  maxVisibleItems: number = 5;


  exportJsonData(item: Category) {
    this.jsonData.dynamicDownloadJson(item, "קטגוריה - " + item.name);
  }

  sort(category, direction) {
    let sortObject1;
    let sortObject2;

    let sortedArray: Category[] = this.categories.sort((obj1, obj2) => {

      switch (category) {
        case 'id':
          sortObject1 = obj1.id;
          sortObject2 = obj2.id;
          break;
        case 'categoryName':
          sortObject1 = obj1.name;
          sortObject2 = obj2.name;
          break;
        case 'dateAdded':
          sortObject1 = Number(new Date(obj1.dateAdded));
          sortObject2 = Number(new Date(obj2.dateAdded));
          break;
        case 'quantity':
          sortObject1 = obj1.quantity;
          sortObject2 = obj2.quantity;
          break;
        default:
          break;
      }
      if (direction == 'minus') {
        if (sortObject1 < sortObject2)
          return 1;
        if (sortObject1 > sortObject2)
          return -1;
        return 0;
      }
      else {
        if (sortObject1 > sortObject2)
          return 1;
        if (sortObject1 < sortObject2)
          return -1;
        return 0;
      }

    });
    this.categories = sortedArray;
  }

  deleteCategory(id) {
    let modalOptions = {
      class: 'modal-dialog modal-sm modal-notify modal-danger',
    }
    this.modalRef = this.modalService.show(ConfirmDeleteModalComponent, modalOptions);
    this.modalRef.content.action.subscribe((result: boolean) => {
      if (result) {
        this.actions.deleteCollection('categories', id).then(res => {
          this.delete.emit(id)
        })
      }
    });
  }

  openEditCategoryModal(category: Category) {
    let modalOptions = {
      class: 'modal-dialog modal-notify modal-warning',
      data: {
        category: category,
        formType: 'editCategory'
      },
      ignoreBackdropClick: true
    }
    this.modalRef = this.modalService.show(EditCategoryModalComponent, modalOptions);
    this.modalRef.content.action.subscribe((result: Category) => {
      if(result){
        this.categories = this.categories.filter(ele => ele.id != result.id)
        this.categories.push(result);
        this.sort('id', 'minus')
      }
    });
  }


  openFullDetailsCategoryModal(category: Category) {
    let modalOptions = {
      class: 'modal-dialog modal-dialog-scrollable modal-notify modal-info',
      data: {
        category: category,
      },
    }
    this.modalRef = this.modalService.show(FullDetailsCategoryModalComponent, modalOptions);
  }



  emitDataSourceChange() {
    this.mdbTable.dataSourceChange().subscribe((data: any) => {
    });
  }

  searchItems() {
    const prev = this.mdbTable.getDataSource();

    if (!this.searchText) {
      this.mdbTable.setDataSource(this.previous);
      this.categories = this.mdbTable.getDataSource();
    }

    if (this.searchText) {
      this.categories = this.mdbTable.searchLocalDataBy(this.searchText);
      this.mdbTable.setDataSource(prev);
    }

    this.mdbTablePagination.calculateFirstItemIndex();
    this.mdbTablePagination.calculateLastItemIndex();

    this.mdbTable.searchDataObservable(this.searchText).subscribe(() => {
      this.mdbTablePagination.calculateFirstItemIndex();
      this.mdbTablePagination.calculateLastItemIndex();
    });
  }


  ngOnInit(): void {
    this.mdbTable.setDataSource(this.categories);
    this.categories = this.mdbTable.getDataSource();
    this.previous = this.mdbTable.getDataSource();
  }


  ngAfterViewInit() {
    if (this.searchQuery) {
      this.searchText = this.searchQuery;
      this.searchItems();
    }

    this.mdbTablePagination.setMaxVisibleItemsNumberTo(this.maxVisibleItems);
    this.mdbTablePagination.calculateFirstItemIndex();
    this.mdbTablePagination.calculateLastItemIndex();
    this.cdRef.detectChanges();
  }

}