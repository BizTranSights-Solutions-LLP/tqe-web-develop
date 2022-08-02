import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  headers: HttpHeaders; 
  
  private auth_code = this.authService.getUserDetail().auth_code;

  constructor(private http: HttpClient, private authService: AuthService) {
    this.headers = new HttpHeaders().set('Content-Type','application/json')
  }

  get_user_listing() {
    return this.http.post(environment.base_url + 'admin/users', { auth_code: this.authService.getUserDetail().auth_code});
  }

  get_user_detail(user_id) {
    return this.http.post(environment.base_url + 'admin/user/id', {  auth_code: this.authService.getUserDetail().auth_code, user_id });
  }

  get_user_roles() {
    return this.http.post(environment.base_url + 'admin/user/roles', { auth_code: this.authService.getUserDetail().auth_code});
  }

  update_create_user(form_data) {

    delete form_data['file_path'];

    let keys = Object.keys(form_data);
    let to_encrypt: Array<string> = ['role_ids','discount_code','delete_memberships','user_memberships'];
    let form = new FormData();
    form.append('auth_code', this.authService.getUserDetail().auth_code);

    for(let k of keys) {
      if(to_encrypt.indexOf(k) !== -1) {
        form.append(k, JSON.stringify(form_data[k]));
      } else {
        form.append(k, form_data[k]);
      }
    }

    return this.http.post(environment.base_url + 'admin/user/save', form);
  }

  delete_user(user_id) {
    return this.http.post(environment.base_url + 'admin/user/delete', {  auth_code: this.authService.getUserDetail().auth_code, user_id });
  }
}
