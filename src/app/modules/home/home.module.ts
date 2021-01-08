import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './pages/home/home.component';
import { HomeRoutingModule } from './home-routing.module';
import { MDBBootstrapModulesPro, MDBSpinningPreloader, ToastModule } from 'ng-uikit-pro-standard';
import { ProductComponent } from './components/product/product.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CreateOrderModalComponent } from './components/create-order-modal/create-order-modal.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FullProductModalComponent } from './components/full-product-modal/full-product-modal.component';
import { ViewOrdersModalComponent } from './components/view-orders-modal/view-orders-modal.component';
import { LoadAsShoppingListComponent } from './components/load-as-shopping-list/load-as-shopping-list.component';
import { CategoriesSidenavComponent } from './components/categories-sidenav/categories-sidenav.component';
import { ProductsComponent } from './pages/products/products.component';



@NgModule({
  declarations: [HomeComponent, ProductComponent, CreateOrderModalComponent, FullProductModalComponent, ViewOrdersModalComponent, LoadAsShoppingListComponent, CategoriesSidenavComponent, ProductsComponent],
  imports: [
    CommonModule,
    HomeRoutingModule,
    MDBBootstrapModulesPro.forRoot(),
    FlexLayoutModule,
    ReactiveFormsModule,
    FormsModule


  ], 
  providers: [MDBSpinningPreloader]
})
export class HomeModule { }
