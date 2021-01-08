import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModeratorRoutingModule } from './moderator-routing.module';
import { MDBBootstrapModulesPro, MDBSpinningPreloader, MdbSelectModule } from 'ng-uikit-pro-standard';
import { EditProductModalComponent } from './components/edit-product-modal/edit-product-modal.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { ConfirmDeleteModalComponent } from './components/confirm-delete-modal/confirm-delete-modal.component';
import { ProductCardComponent } from './components/product-card/product-card.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ProductsComponent } from './pages/products/products.component';
import { OrdersComponent } from './pages/orders/orders.component';
import { CategoriesComponent } from './pages/categories/categories.component';
import { ControlPanelComponent } from './pages/control-panel/control-panel.component';
import { EditCategoryModalComponent } from './components/edit-category-modal/edit-category-modal.component';
import { EditSubcategoryModalComponent } from './components/edit-subcategory-modal/edit-subcategory-modal.component';
import { CategoryCardComponent } from './components/category-card/category-card.component';
import { SubcategoryCardComponent } from './components/subcategory-card/subcategory-card.component';
import { SubcategoriesComponent } from './pages/subcategories/subcategories.component';
import { CategoriesTableComponent } from './components/categories-table/categories-table.component';
import { SubcategoriesTableComponent } from './components/subcategories-table/subcategories-table.component';
import { ProductsTableComponent } from './components/products-table/products-table.component';
import { FullDetailsOrderModalComponent } from './components/full-details-order-modal/full-details-order-modal.component';
import { EditOrderModalComponent } from './components/edit-order-modal/edit-order-modal.component';
import { FullDetailsSubcategoryModalComponent } from './components/full-details-subcategory-modal/full-details-subcategory-modal.component';
import { FullDetailsCategoryModalComponent } from './components/full-details-category-modal/full-details-category-modal.component';
import { OrdersTableComponent } from './components/orders-table/orders-table.component';



@NgModule({
  declarations: [ EditProductModalComponent, ConfirmDeleteModalComponent, ProductCardComponent, ProductsComponent, OrdersComponent, CategoriesComponent, ControlPanelComponent, EditCategoryModalComponent, EditSubcategoryModalComponent, CategoryCardComponent, SubcategoryCardComponent, SubcategoriesComponent, CategoriesTableComponent, SubcategoriesTableComponent, ProductsTableComponent, FullDetailsOrderModalComponent, EditOrderModalComponent, FullDetailsSubcategoryModalComponent, FullDetailsCategoryModalComponent, OrdersTableComponent, ],
  imports: [
    CommonModule, 
    ModeratorRoutingModule,
    MDBBootstrapModulesPro.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MdbSelectModule
  ],
  providers: [MDBSpinningPreloader]
})
export class ModeratorModule { }
