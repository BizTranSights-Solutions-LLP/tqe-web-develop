import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReferralService {
  private BASE_URL: string = environment.base_url;

  constructor(private http: HttpClient) { }

  // save referral
  save_referral(data) {
    return this.http.post(this.BASE_URL + 'referral', data);
  }

  // send referral
  send_referral(data) {
    console.log(data);
    return this.http.post(this.BASE_URL + 'referral_email', data, {responseType: 'text'});
  }
}
