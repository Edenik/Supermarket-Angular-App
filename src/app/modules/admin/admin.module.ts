import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ControlPanelComponent } from './pages/control-panel/control-panel.component';
import { UsersComponent } from './pages/users/users.component';
import { AdminRoutingModule } from './admin-routing.module';
import { UserInfoComponent } from './components/user-info/user-info.component';
import { MDBBootstrapModulesPro, MDBSpinningPreloader } from 'ng-uikit-pro-standard';
import { FlexLayoutModule } from '@angular/flex-layout';
import { EditUserModalComponent } from './components/edit-user-modal/edit-user-modal.component';
import { SubscribedUsersModalComponent } from './components/subscribed-users-modal/subscribed-users-modal.component';
import { OnlineUsersModalComponent } from './components/online-users-modal/online-users-modal.component';
import { UserInfoModalComponent } from './components/user-info-modal/user-info-modal.component';
import { ConvertToCSVService } from 'src/app/core/services/convert-to-csv.service';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [ControlPanelComponent, UsersComponent, UserInfoComponent, EditUserModalComponent, SubscribedUsersModalComponent, OnlineUsersModalComponent, UserInfoModalComponent],
  imports: [
    CommonModule,
    AdminRoutingModule,
    MDBBootstrapModulesPro.forRoot(),
    FlexLayoutModule,
    FormsModule
  ],
  providers: [MDBSpinningPreloader, ConvertToCSVService, DatePipe],
})
export class AdminModule { }
