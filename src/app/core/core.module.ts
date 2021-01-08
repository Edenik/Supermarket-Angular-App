import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';
import { MDBSpinningPreloader, MDBBootstrapModulesPro, ToastModule, } from 'ng-uikit-pro-standard';
import { RouterModule } from '@angular/router';
import { WindowService } from './services/window.service';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ShoppingCartComponent } from './components/shopping-cart/shopping-cart.component';
import { HeaderComponent } from './components/header/header.component';
import { ShoppingCartItemComponent } from './components/shopping-cart-item/shopping-cart-item.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';


@NgModule({
  declarations: [HeaderComponent, ShoppingCartComponent, ShoppingCartItemComponent],
  imports: [
    CommonModule,
    MDBBootstrapModulesPro.forRoot(),
    RouterModule,
    FlexLayoutModule,
    FormsModule,
  ],
  exports:[HeaderComponent,],
  providers: [ AuthService, UserService, MDBSpinningPreloader, WindowService, DatePipe],
  bootstrap: [HeaderComponent],

})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error(
        'CoreModule is already loaded. Import it in the AppModule only'
      );
    }
  }
}