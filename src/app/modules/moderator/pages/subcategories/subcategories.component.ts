import { Component, OnInit } from '@angular/core';
import { MDBModalService, MDBModalRef, ToastService } from 'ng-uikit-pro-standard';
import { Category, SubCategory } from 'src/app/core/models/store/category';
import { EditSubcategoryModalComponent } from '../../components/edit-subcategory-modal/edit-subcategory-modal.component';
import { Product } from 'src/app/core/models/store/product';
import { HeadElements } from 'src/app/core/models/store/headElements';
import { ActionsFirebaseService } from 'src/app/core/services/actions-firebase.service';
import { ExportImportDataService } from 'src/app/core/services/export-import-data.service';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-subcategories',
  templateUrl: './subcategories.component.html',
  styleUrls: ['./subcategories.component.scss']
})
export class SubcategoriesComponent implements OnInit {

  constructor(
    private modalService: MDBModalService,
    private actions: ActionsFirebaseService,
    private jsonData: ExportImportDataService,
    private datePipe: DatePipe,
    private activeRoute: ActivatedRoute,
    private toast: ToastService) { }

  modalRef: MDBModalRef;
  categories: Category[] = [];
  subcategories: SubCategory[] = [];
  nullSubcategory: SubCategory = {
    id: null,
    name: null,
    dateAdded: null,
    addedByUID: null,
    dateEdited: null,
    editedByUID: null,
    categoryName: null,
    categoryID: null
  }
  reqComplete: boolean = false;
  products: Product[];
  viewType: string = 'table';
  headElements: HeadElements[] = [
    { value: 'id', display: 'ID' },
    { value: 'subcategoryName', display: 'שם תת-קטגוריה' },
    { value: 'quantity', display: 'מוצרים' },
    { value: 'categoryName', display: 'שם קטגוריית אב' },
    { value: 'dateAdded', display: 'תאריך הוספה' },
  ];
  searchQuery: string;

  checkIfItemIsProduct(item) {
    let modalOptions = {
      class: 'modal-dialog modal-dialog-scrollable modal-notify modal-warning',
      data: {
        subcategory: null,
        formType: 'importSubcategory',
        categories: this.categories
      },
      ignoreBackdropClick: true
    }

    return new Promise<boolean>((resolve, reject) => {
      if (item.name && item.categoryID) {
        modalOptions.data.subcategory = item;
        this.modalRef = this.modalService.show(EditSubcategoryModalComponent, modalOptions);
        this.modalRef.content.action.subscribe(res => {
          resolve(true);
        })
      }
      else {
        resolve(false);
      }
    })
  }

  async asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
  }


  uploadJson(event) {
    this.jsonData.uploadJson(event).then(res => {
      if (!res.length) {
        this.checkIfItemIsProduct(res).then(bool => {
          if (!bool) {
            this.toast.error(res.productName + " this product has missing properties")
          }
        })
      }
      else {
        let index;
        this.asyncForEach(res, async (item) => {
          let run = [];
          run[index] = await this.checkIfItemIsProduct(item).then(bool => {
            if (!bool) {
              this.toast.error(item.productName + " this product has missing properties")
            }
          })
        }
        )
      }
    })
  }


  openAddSubcategoryModal() {
    let modalOptions = {
      class: 'modal-dialog modal-notify modal-info',
      data: {
        subcategory: this.nullSubcategory,
        formType: 'addSubcategory',
        categories: this.categories
      },
      ignoreBackdropClick: true
    }
    this.modalRef = this.modalService.show(EditSubcategoryModalComponent, modalOptions);
  }


  exportJsonData() {
    if (this.subcategories) {
      let date = this.datePipe.transform(new Date(), 'dd.MM.yy HH.mm');
      this.jsonData.dynamicDownloadJson(this.subcategories, 'תת-קטגוריות - ' + date);
    }
  }

  getAllCategories() {
    this.categories = [];
    this.actions.getCollection('categories').subscribe((res: Category[]) => {
      this.categories = res;
    })
  }

  getAllSubcategories() {
    this.categories = [];
    this.actions.getCollection('subcategories').subscribe((res: SubCategory[]) => {
      this.reqComplete = false;
      this.subcategories = res;
      this.getAllProducts();
    })
  }


  getAllProducts() {
    this.products = [];
    let filteredProducts: Product[];
    this.actions.getCollection('products').subscribe((res: Product[]) => {
      this.products = res;
      this.subcategories.forEach(element => {
        filteredProducts = this.products.filter(product => product.subCategory == String(element.id))
        element.quantity = filteredProducts.length;
      });
      this.sort('id', 'minus')

      this.reqComplete = true;
    })
  }

  deleteSubcategory(id) {
    this.subcategories = this.subcategories.filter(subcategory => subcategory.id != id);
  }

  changeView(view: string) {
    this.viewType = view;
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

  ngOnInit(): void {
    this.activeRoute.params.subscribe(params => {
      this.searchQuery = params.query;
    })

    this.getAllCategories();
    this.getAllSubcategories();
  }

}
