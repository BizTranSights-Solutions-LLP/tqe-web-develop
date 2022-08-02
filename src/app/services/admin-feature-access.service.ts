import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminFeatureAccessService implements CanActivate {

  constructor(private authService: AuthService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean|boolean>|Promise<boolean>|boolean {
    console.log('can activate');
    let user = this.authService.getUserDetail();
    let url = route.url[0].path;
    let loggedIn = this.authService.isUserLoggedIn();
    let navigation = [];
    let roles = Object.keys(user.roles_status);
    roles = roles.map(d => d.replace('is_',''));
    let isAdmin = Object.keys(user).length > 0 ? ((user.roles_status.is_admin || user.roles_status.is_editor || user.roles_status.is_author) ? true : false) : false;
    
    for(let data of Object.values(user.roles_navigation)) {
      let makeFormUrl = Object.values(data['dropDown']).length === 1 ? true : false;
      for(let dd of Object.values(data['dropDown'])) {
        let nav:any = dd;
        navigation.push(nav.link);

        if(makeFormUrl) {
          if(roles.indexOf('editor') > -1 || roles.indexOf('author') > -1 || roles.indexOf('admin') > -1) {
            let _module = nav.link.split('-')[0];
            let nmodule = _module.endsWith('s') ? _module.replace('s','') : _module;
            nmodule += '-form';
            navigation.push(nmodule);
          }
        }
      }
    }

    // console.log(navigation);

    if (loggedIn && isAdmin && navigation.indexOf(url) > -1) {
      return true;
    }

    // localStorage.removeItem('data');
    this.router.navigate(['admin']);
    return false;
  }
}
