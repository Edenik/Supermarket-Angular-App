import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ProductsComponent } from './pages/products/products.component';


const routes: Routes = [
  {path: '' , component: HomeComponent},
  {path: 'home' , component: HomeComponent },
  {path: 'products' , component: ProductsComponent },
  {path: 'products/:category' , component: ProductsComponent },
  {path: 'products/:category/:subcategory' , component: ProductsComponent },

];


@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
