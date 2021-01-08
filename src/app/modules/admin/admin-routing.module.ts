import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ControlPanelComponent } from './pages/control-panel/control-panel.component';
import { UsersComponent } from './pages/users/users.component';


const routes: Routes = [
  {path: '' , component: ControlPanelComponent},
  {path: 'control-panel' , component: ControlPanelComponent},
  {path: 'users' , component: UsersComponent},
];


@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
