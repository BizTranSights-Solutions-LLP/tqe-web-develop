import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DiscountService {

  headers: HttpHeaders; 
  
  private auth_code = this.authService.getUserDetail().auth_code;

  constructor(private http: HttpClient, private authService: AuthService) {
    this.headers = new HttpHeaders().set('Content-Type','application/json')
  }

  get_dc_list() {
    return this.http.post(environment.base_url + 'admin/codes', { auth_code: this.authService.getUserDetail().auth_code});
  }

  get_dc_detail(discount_code_id) {
    return this.http.post(environment.base_url + 'admin/code/id', { auth_code: this.authService.getUserDetail().auth_code, discount_code_id});
  }

  create_update_dc(data) {
    return this.http.post(environment.base_url + 'admin/code/save', { auth_code: this.authService.getUserDetail().auth_code, ...data});
  }

  del_dc(discount_code_id) {
    return this.http.post(environment.base_url + 'admin/code/delete', { auth_code: this.authService.getUserDetail().auth_code, discount_code_id});
  }

}
