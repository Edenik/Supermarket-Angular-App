import { Component, OnInit, Input, ChangeDetectorRef, AfterViewInit, ViewChild, ElementRef, HostListener, EventEmitter, Output } from '@angular/core';
import { MdbTableDirective, MdbTablePaginationComponent, MDBModalRef, MDBModalService } from 'ng-uikit-pro-standard';
import { HeadElements } from 'src/app/core/models/store/headElements';
import { Product } from 'src/app/core/models/store/product';
import { ConfirmDeleteModalComponent } from '../confirm-delete-modal/confirm-delete-modal.component';
import { EditProductModalComponent } from '../edit-product-modal/edit-product-modal.component';
import { FullProductModalComponent } from 'src/app/modules/home/components/full-product-modal/full-product-modal.component';
import { ActionsFirebaseService } from 'src/app/core/services/actions-firebase.service';
import { ExportImportDataService } from 'src/app/core/services/export-import-data.service';


@Component({
  selector: 'app-products-table',
  templateUrl: './products-table.component.html',
  styleUrls: ['./products-table.component.scss']
})
export class ProductsTableComponent implements OnInit, AfterViewInit {

  constructor(
    private cdRef: ChangeDetectorRef,
    private modalService: MDBModalService,
    private actions: ActionsFirebaseService,
    private jsonData: ExportImportDataService) { }

  @Input() products: Product[];
  @ViewChild(MdbTableDirective, { static: true }) mdbTable: MdbTableDirective;
  @ViewChild(MdbTablePaginationComponent, { static: true }) mdbTablePagination: MdbTablePaginationComponent;
  @ViewChild('row', { static: true }) row: ElementRef;
  @Output() delete = new EventEmitter<number>();
  @Input() searchQuery: string;
  @HostListener('input') oninput() {
    this.mdbTablePagination.searchText = this.searchText;
  }
  headElements: HeadElements[] = [
    { value: 'id', display: 'ID' },
    { value: 'image', display: 'תמונה' },
    { value: 'productName', display: 'שם המוצר' },
    { value: 'categoryName', display: 'קטגוריה' },
    { value: 'subcategoryName', display: 'תת-קטגוריה' },
    { value: 'price', display: 'מחיר' },
    { value: 'inSale', display: 'מבצע' },
    { value: 'dateAdded', display: 'תאריך הוספה' },
    { value: 'actions', display: 'פעולות' },
  ];
  searchText: string = '';
  previous: string;
  maxVisibleItems: number = 10;
  modalRef: MDBModalRef;


  exportJsonData(item: Product) {
    this.jsonData.dynamicDownloadJson(item, "מוצר - " + item.productName);
  }

  sort(category, direction) {
    let sortObject1;
    let sortObject2;

    let sortedArray: Product[] = this.products.sort((obj1, obj2) => {

      switch (category) {
        case 'id':
          sortObject1 = obj1.id;
          sortObject2 = obj2.id;
          break;
        case 'categoryName':
          sortObject1 = obj1.categoryName;
          sortObject2 = obj2.categoryName;
          break;
        case 'productName':
          sortObject1 = obj1.productName;
          sortObject2 = obj2.productName;
          break;
        case 'subcategoryName':
          sortObject1 = obj1.subcategoryName;
          sortObject2 = obj2.subcategoryName;
          break;
        case 'id':
          sortObject1 = obj1.id;
          sortObject2 = obj2.id;
          break;
        case 'inSale':
          sortObject1 = obj1.inSale;
          sortObject2 = obj2.inSale;
          break;
        case 'price':
          if (obj1.inSale == true) {
            sortObject1 = obj1.salePrice
          }
          else {
            sortObject1 = obj1.price
          }

          if (obj2.inSale == true) {
            sortObject2 = obj2.salePrice
          }
          else {
            sortObject2 = obj2.price
          }
          break;
        case 'dateAdded':
          sortObject1 = Number(new Date(obj1.dateAdded));
          sortObject2 = Number(new Date(obj2.dateAdded));
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
    this.products = sortedArray;
  }

  deleteProduct(id) {
    let modalOptions = {
      class: 'modal-dialog modal-sm modal-notify modal-danger',
    }
    this.modalRef = this.modalService.show(ConfirmDeleteModalComponent, modalOptions);
    this.modalRef.content.action.subscribe((result: boolean) => {
      if (result) {
        this.actions.deleteCollection('products', id).then(res => {
          this.delete.emit(id)
        })
      }
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
      if(result){
        this.products = this.products.filter(ele => ele.id != result.id)
        this.products.push(result);
        this.sort('id', 'minus')
      }
    });
  }


  emitDataSourceChange() {
    this.mdbTable.dataSourceChange().subscribe((data: any) => {
    });
  }

  searchItems() {
    const prev = this.mdbTable.getDataSource();

    if (!this.searchText) {
      this.mdbTable.setDataSource(this.previous);
      this.products = this.mdbTable.getDataSource();
    }

    if (this.searchText) {
      this.products = this.mdbTable.searchLocalDataBy(this.searchText);
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
    this.mdbTable.setDataSource(this.products);
    this.products = this.mdbTable.getDataSource();
    this.previous = this.mdbTable.getDataSource();
    this.sort('id', 'minus')
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