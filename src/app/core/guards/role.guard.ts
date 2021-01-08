import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root'
})

export class RoleGuard implements CanActivate {

  constructor(
    public userService: UserService,
    private router: Router
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    let role = route.data.role as string;

    return new Promise((resolve, reject) => {
      this.userService.getCurrentUser()
        .then(user => {
          this.userService.get(user.uid).valueChanges().subscribe((res: any) => {
            if(res.roleType == 'admin'){
              return resolve(true);
            }
            else if(res.roleType == 'moderator' && role == 'moderator' || res.roleType == 'moderator' && role == 'user'){
              return resolve(true);
            }

            else if (res.roleType == 'user' && role == 'user') {
              return resolve(true);
            }
            else {
              this.router.navigate(['/home']);
              return resolve(false);
            }
          })
        }, err => {
          this.router.navigate(['/home']);
          return resolve(false);
        })
    })
  }
}
