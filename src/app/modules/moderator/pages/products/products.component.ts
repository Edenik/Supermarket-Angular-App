import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/core/models/store/product';
import { Order, OrderItem } from 'src/app/core/models/store/order';
import { DatePipe } from '@angular/common';
import { MDBModalService, MDBModalRef, ToastService } from 'ng-uikit-pro-standard';
import { EditProductModalComponent } from '../../components/edit-product-modal/edit-product-modal.component';
import { HeadElements } from 'src/app/core/models/store/headElements';
import { ActionsFirebaseService } from 'src/app/core/services/actions-firebase.service';
import { SubCategory, Category } from 'src/app/core/models/store/category';
import { ExportImportDataService } from 'src/app/core/services/export-import-data.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

  constructor(
    private datePipe: DatePipe,
    private activeRoute: ActivatedRoute,
    private modalService: MDBModalService,
    private actions: ActionsFirebaseService,
    private jsonData: ExportImportDataService,
    private toast: ToastService) { }
    
  products: Product[];
  saleProducts: Product[];
  orders: Order[];
  orderItems: OrderItem[];
  modalRef: MDBModalRef;
  reqComplete: boolean = false;
  nullProduct: Product = {
    id: null,
    productName: null,
    price: null,
    brand: null,
    unit: null,
    inSale: null,
    weight: null,
    salePrice: null,
    saleDescription: null,
    hasNutritialMark: null,
    nutritialSodium: null,
    nutritialSugar: null,
    nutritialFat: null,
    category: null,
    subCategory: null,
    photoURL: null,
    dateAdded: null,
    addedByUID: null,
    dateEdited: null,
    editedByUID: null
  }
  viewType: string = 'table';
  headElements: HeadElements[] = [
    { value: 'id', display: 'ID' },
    { value: 'productName', display: 'שם המוצר' },
    { value: 'categoryName', display: 'קטגוריה' },
    { value: 'subcategoryName', display: 'תת-קטגוריה' },
    { value: 'price', display: 'מחיר' },
    { value: 'inSale', display: 'מבצע' },
    { value: 'dateAdded', display: 'תאריך הוספה' },
  ];
  searchQuery: string;


  checkIfItemIsProduct(item) {
    let modalOptions = {
      class: 'modal-dialog modal-dialog-scrollable modal-notify modal-warning',
      data: {
        product: null,
        formType: 'importProduct'
      },
      ignoreBackdropClick: true
    }

    return new Promise<boolean>((resolve, reject) => {
      if (item.productName && item.price && item.photoURL && item.unit && item.weight && item.brand && item.hasNutritialMark != null && item.inSale != null) {
        modalOptions.data.product = item;
        this.modalRef = this.modalService.show(EditProductModalComponent, modalOptions);
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


  openModal(formtype, product?: Product) {
    let modalOptions = {
      class: 'modal-dialog modal-dialog-scrollable modal-notify modal-info',
      data: {
        product: product || this.nullProduct,
        formType: formtype
      },
      ignoreBackdropClick: true
    }

    this.modalRef = this.modalService.show(EditProductModalComponent, modalOptions);
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
          sortObject1 = obj1.category;
          sortObject2 = obj2.category;
          break;
        case 'productName':
          sortObject1 = obj1.productName;
          sortObject2 = obj2.productName;
          break;
        case 'subcategoryName':
          sortObject1 = obj1.subCategory;
          sortObject2 = obj2.subCategory;
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

  getAllProducts() {
    this.products = [];
    this.actions.getCollection('products').subscribe((res: Product[]) => {
      this.reqComplete = false;
      this.products = res;

      for (let index = 0; index < this.products.length; index++) {
        const element = this.products[index];
        this.actions.getCollectionByID('subcategories', element.subCategory).then((res: SubCategory) => {
          this.products[index].subcategoryName = res[0].name;
        })

        this.actions.getCollectionByID('categories', element.category).then((res: Category) => {
          this.products[index].categoryName = res[0].name;
          if (index + 1 == this.products.length) {
            this.reqComplete = true;
          }
        })
      }

    })
  }

  changeView(view: string) {
    this.viewType = view;
  }

  deleteProduct(id) {
    this.products = this.products.filter(product => product.id != id);
  }

  downloadProductsData() {
    if (this.products) {
      let date = this.datePipe.transform(new Date(), 'dd.MM.yy HH.mm');
      this.jsonData.dynamicDownloadJson(this.products, 'מוצרים - ' + date);
    }
  }


  ngOnInit(): void {
    this.activeRoute.params.subscribe(params => {
      this.searchQuery = params.query;
    })

    this.getAllProducts();
  }

}
