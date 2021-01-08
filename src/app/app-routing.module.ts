import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RoleGuard } from './core/guards/role.guard';


const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('src/app/modules/home/home.module').then(m => m.HomeModule)
  },
  {
    path: 'home',
    loadChildren: () => import('src/app/modules/home/home.module').then(m => m.HomeModule)
  },
  {
    path: 'auth',
    loadChildren: () => import('src/app/modules/auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'admin',
    loadChildren: () => import('src/app/modules/admin/admin.module').then(m => m.AdminModule), canActivate: [RoleGuard], data: { role: 'admin' }
  },
  {
    path: 'moderator',
    loadChildren: () => import('src/app/modules/moderator/moderator.module').then(m => m.ModeratorModule), canActivate: [RoleGuard], data: { role: 'moderator' }
  },
  {
    path: '**',
    loadChildren: () => import('src/app/modules/home/home.module').then(m => m.HomeModule)
  },
];


@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
