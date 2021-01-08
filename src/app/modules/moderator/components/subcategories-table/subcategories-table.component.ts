import { Component, OnInit, Input, ChangeDetectorRef, AfterViewInit, ViewChild, ElementRef, HostListener, EventEmitter, Output } from '@angular/core';
import { Category, SubCategory } from 'src/app/core/models/store/category';
import { MdbTableDirective, MdbTablePaginationComponent, MDBModalRef, MDBModalService } from 'ng-uikit-pro-standard';
import { HeadElements } from 'src/app/core/models/store/headElements';
import { ConfirmDeleteModalComponent } from '../confirm-delete-modal/confirm-delete-modal.component';
import { EditSubcategoryModalComponent } from '../edit-subcategory-modal/edit-subcategory-modal.component';
import { FullDetailsSubcategoryModalComponent } from '../full-details-subcategory-modal/full-details-subcategory-modal.component';
import { ActionsFirebaseService } from 'src/app/core/services/actions-firebase.service';
import { ExportImportDataService } from 'src/app/core/services/export-import-data.service';

@Component({
  selector: 'app-subcategories-table',
  templateUrl: './subcategories-table.component.html',
  styleUrls: ['./subcategories-table.component.scss']
})
export class SubcategoriesTableComponent implements OnInit, AfterViewInit {

  constructor(
    private cdRef: ChangeDetectorRef,
    private modalService: MDBModalService,
    private actions: ActionsFirebaseService,
    private jsonData: ExportImportDataService) { }

  @Input() subcategories: SubCategory[];
  @Input() categories: Category[];
  @Input() searchQuery: string;
  @ViewChild(MdbTableDirective, { static: true }) mdbTable: MdbTableDirective;
  @ViewChild(MdbTablePaginationComponent, { static: true }) mdbTablePagination: MdbTablePaginationComponent;
  @ViewChild('row', { static: true }) row: ElementRef;
  @Output() delete = new EventEmitter<number>();
  @HostListener('input') oninput() {
    this.mdbTablePagination.searchText = this.searchText;
  }
  headElements: HeadElements[] = [
    { value: 'id', display: 'ID' },
    { value: 'subcategoryName', display: 'שם תת-קטגוריה' },
    { value: 'quantity', display: 'מוצרים' },
    { value: 'categoryName', display: 'שם קטגוריית אב' },
    { value: 'dateAdded', display: 'תאריך הוספה' },
    { value: 'actions', display: 'פעולות' },
  ];
  searchText: string = '';
  previous: string;
  modalRef: MDBModalRef;
  maxVisibleItems: number = 5;



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
          this.delete.emit(id)
        })
      }
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
      if(result){
        this.subcategories = this.subcategories.filter(ele => ele.id != result.id)
        this.subcategories.push(result);
        this.sort('id', 'minus')
      }
    });
  }
  sort(category, direction) {
    let sortObject1;
    let sortObject2;

    let sortedArray: SubCategory[] = this.subcategories.sort((obj1, obj2) => {

      switch (category) {
        case 'id':
          sortObject1 = obj1.id;
          sortObject2 = obj2.id;
          break;
        case 'subcategoryName':
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
        case 'categoryName':
          sortObject1 = obj1.categoryName;
          sortObject2 = obj2.categoryName;
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
    this.subcategories = sortedArray;
  }

  emitDataSourceChange() {
    this.mdbTable.dataSourceChange().subscribe((data: any) => {
    });
  }

  searchItems() {
    const prev = this.mdbTable.getDataSource();

    if (!this.searchText) {
      this.mdbTable.setDataSource(this.previous);
      this.subcategories = this.mdbTable.getDataSource();
    }

    if (this.searchText) {
      this.subcategories = this.mdbTable.searchLocalDataBy(this.searchText);
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
    this.mdbTable.setDataSource(this.subcategories);
    this.subcategories = this.mdbTable.getDataSource();
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