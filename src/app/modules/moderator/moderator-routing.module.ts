import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductsComponent } from './pages/products/products.component';
import { OrdersComponent } from './pages/orders/orders.component';
import { CategoriesComponent } from './pages/categories/categories.component';
import { ControlPanelComponent } from './pages/control-panel/control-panel.component';
import { SubcategoriesComponent } from './pages/subcategories/subcategories.component';


const routes: Routes = [
  {path: '' , component: ControlPanelComponent},
  {path: 'control-panel' , component: ControlPanelComponent },
  {path: 'products' , component: ProductsComponent },
  {path: 'products/:query' , component: ProductsComponent },
  {path: 'orders' , component: OrdersComponent },
  {path: 'orders/:uid' , component: OrdersComponent },
  {path: 'categories' , component: CategoriesComponent },
  {path: 'categories/:query' , component: CategoriesComponent },
  {path: 'subcategories' , component: SubcategoriesComponent },
  {path: 'subcategories/:query' , component: SubcategoriesComponent },
];


@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class ModeratorRoutingModule { }
