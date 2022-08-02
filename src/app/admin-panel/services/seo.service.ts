import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SeoService {

  headers: HttpHeaders; 
  
  private auth_code = this.authService.getUserDetail().auth_code;

  constructor(private http: HttpClient, private authService: AuthService) {
    this.headers = new HttpHeaders().set('Content-Type','application/json')
  }

  get_listing() {
    return this.http.post(environment.base_url + 'admin/pages', { auth_code: this.authService.getUserDetail().auth_code });
  }

  get_data_for(page_id) {
    return this.http.post(environment.base_url + 'admin/page/id', { auth_code: this.authService.getUserDetail().auth_code, page_id });
  }

  save(data) {
    return this.http.post(environment.base_url + 'admin/page/save', { auth_code: this.authService.getUserDetail().auth_code , ...data });
  }
}
