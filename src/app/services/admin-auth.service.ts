import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminAuthService implements CanActivate {

  constructor(private authService: AuthService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean|boolean>|Promise<boolean>|boolean {
    console.log('can activate');
    let user = this.authService.getUserDetail();
    let loggedIn = this.authService.isUserLoggedIn();
    let isAdmin = Object.keys(user).length > 0 ? ((user.roles_status.is_admin || user.roles_status.is_editor || user.roles_status.is_author) ? true : false) : false;
    if (loggedIn && isAdmin) {
      this.router.navigate(['admin']);
      return false;
    }
    localStorage.removeItem('data');
    return true;
  }
}
