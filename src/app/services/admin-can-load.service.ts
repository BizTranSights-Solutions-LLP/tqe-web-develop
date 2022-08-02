import { Injectable } from '@angular/core';
import { Router, CanLoad, UrlSegment, Route } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminCanLoadService implements CanLoad {

  constructor(private authService: AuthService, private router: Router) { }

  canLoad(route: Route, segments: UrlSegment[]): Observable<boolean>|Promise<boolean>|boolean {
    console.log('can load');
    let user = this.authService.getUserDetail();
    let loggedIn = this.authService.isUserLoggedIn();
    let isAllowed = Object.keys(user).length > 0 ? ((user.roles_status.is_admin || user.roles_status.is_editor || user.roles_status.is_author) ? true : false) : false;
    if (loggedIn && isAllowed) {
      return true;
    }
    localStorage.removeItem('data');
    this.router.navigate(['admin-auth/login']);
    return false;
  }
}
