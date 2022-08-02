import {Injectable, EventEmitter} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private BASE_URL: string = environment.base_url;

  logginEvent = new EventEmitter();
  logoutEvent = new EventEmitter();
  hideFooter = new EventEmitter();
  tryFree = new EventEmitter();
  overLay = new EventEmitter();

  billingPageStep = {
    prev: '2',
    curr: '2'
  };

  billingPageSuccessMessage = {
    message: 'Congrats on your new membership!'
  };

  membershipName = {
    package_name: ''
  };

  updateUserName = new EventEmitter();

  constructor(private http: HttpClient) {
  }

  // save where user us know from
  save_where(data) {
    return this.http.post(this.BASE_URL + 'where', data);
  }

  login(data) {
    return this.http.post(this.BASE_URL + 'login', data);
  }

  register(data) {
    return this.http.post(this.BASE_URL + 'subscriber/signup', data);
  }

  updateAffiliate(data) {
    return this.http.post(this.BASE_URL + 'affiliate/save_detail', data);
  }

  bankDetail(data) {
    return this.http.post(this.BASE_URL + 'affiliate/save_bank_detail', data);
  }

  inquiry(data) {
    const headers = {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    };
    return this.http.post(this.BASE_URL + 'site_inquires', data, headers);
  }

  get_address_info() {
    return this.http.get('https://json.geoiplookup.io/');
  }

  isUserLoggedIn(): boolean {
    const data = localStorage.getItem('data') ? JSON.parse(localStorage.getItem('data')) : null;

    if (data && data.auth_code) {
      return true;
    }

    return false;
  }

  getUserDetail() {
    const data = localStorage.getItem('data') ? JSON.parse(localStorage.getItem('data')) : {};

    // console.log('user data: ');
    // console.log(data);

    return data;
  }

  forgot_password(body) {
    return this.http.post(this.BASE_URL + 'forgot_password', body);
  }

  reset_password(body) {
    return this.http.post(this.BASE_URL + 'rest_password', body);
  }

  update_profile(data) {
    const {auth_code} = this.getUserDetail();

    const body = {
      auth_code: auth_code,
      ...data
    };
    return this.http.post(this.BASE_URL + 'user/update_profile', body);
  }

  update_profile_image(file) {
    const {auth_code} = this.getUserDetail();

    const formData = new FormData();
    formData.append('photo', file);
    formData.append('auth_code', auth_code);
    // let body = {
    //   auth_code: auth_code,
    //   ...data
    // }
    return this.http.post(this.BASE_URL + 'user/update_profile_image', formData);
  }
}
