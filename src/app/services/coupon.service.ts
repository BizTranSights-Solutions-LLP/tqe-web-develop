import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class CouponService {

  constructor(private http: HttpClient) { }

  create_coupon() {
    return this.http.post(environment.base_url + 'webhook/stripe_coupon', {});
  }



}
