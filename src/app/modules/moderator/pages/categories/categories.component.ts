import { Component, OnInit } from '@angular/core';
import { MDBModalService, MDBModalRef, ToastService } from 'ng-uikit-pro-standard';
import { Category, } from 'src/app/core/models/store/category';
import { EditCategoryModalComponent } from '../../components/edit-category-modal/edit-category-modal.component';
import { Product } from 'src/app/core/models/store/product';
import { HeadElements } from 'src/app/core/models/store/headElements';
import { ActionsFirebaseService } from 'src/app/core/services/actions-firebase.service';
import { ExportImportDataService } from 'src/app/core/services/export-import-data.service';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {

  constructor(
    private datePipe: DatePipe,
    private modalService: MDBModalService,
    private actions: ActionsFirebaseService,
    private jsonData: ExportImportDataService,
    private activeRoute: ActivatedRoute,
    private toast: ToastService
  ) { }

  modalRef: MDBModalRef;
  categories: Category[] = [];
  nullCategory: Category = {
    id: null,
    name: null,
    dateAdded: null,
    addedByUID: null,
    dateEdited: null,
    editedByUID: null
  }
  reqComplete: boolean;
  products: Product[];
  viewType: string = 'table';
  headElements: HeadElements[] = [
    { value: 'id', display: 'ID' },
    { value: 'categoryName', display: 'שם קטגוריה' },
    { value: 'quantity', display: 'מוצרים' },
    { value: 'dateAdded', display: 'תאריך הוספה' },
  ];
  searchQuery: string;

  checkIfItemIsProduct(item) {
    let modalOptions = {
      class: 'modal-dialog modal-dialog-scrollable modal-notify modal-warning',
      data: {
        category: null,
        formType: 'importCategory'
      },
      ignoreBackdropClick: true
    }

    return new Promise<boolean>((resolve, reject) => {
      if (item.name) {
        modalOptions.data.category = item;
        this.modalRef = this.modalService.show(EditCategoryModalComponent, modalOptions);
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


  exportJsonData() {
    if (this.categories) {
      let date = this.datePipe.transform(new Date(), 'dd.MM.yy HH.mm');
      this.jsonData.dynamicDownloadJson(this.categories, 'קטגוריות - ' + date);
    }
  }



  openAddCategoryModal() {
    let modalOptions = {
      class: 'modal-dialog modal-notify modal-info',
      data: {
        category: this.nullCategory,
        formType: 'addCategory'
      },
      ignoreBackdropClick: true
    }
    this.modalRef = this.modalService.show(EditCategoryModalComponent, modalOptions);
    this.modalRef.content.action.subscribe((result: Category) => {
      this.categories.push(result);
    });
  }



  getAllCategories() {
    this.categories = [];
    this.actions.getCollection('categories').subscribe((res: Category[]) => {
      this.reqComplete = false;
      this.categories = res;
      this.getAllProducts();
    })
  }


  deleteCategory(id) {
    this.categories = this.categories.filter(category => category.id != id);
  }

  getAllProducts() {
    this.products = [];
    let filteredProducts: Product[];
    this.actions.getCollection('products').subscribe((res: Product[]) => {
      this.products = res;
      this.categories.forEach(element => {
        filteredProducts = this.products.filter(product => product.category == String(element.id))
        element.quantity = filteredProducts.length;
      });
      this.sort('id', 'minus');

      this.reqComplete = true;
    })
  }

  changeView(view: string) {
    this.viewType = view;
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

  ngOnInit(): void {
    this.activeRoute.params.subscribe(params => {
      this.searchQuery = params.query;
    })

    this.getAllCategories();
  }

}
