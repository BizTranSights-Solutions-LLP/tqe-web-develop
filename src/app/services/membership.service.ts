import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {AuthService} from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class MembershipService {

  selectedMembershipPlan;
  monthlyPlans;
  seasonPlans;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {
  }

  get_membership_plans() {
    const body = {};

    if (sessionStorage.getItem('is_trial') && sessionStorage.getItem('is_trial') === '1') {
      body['is_trial'] = 1;
    }

    if (this.authService.isUserLoggedIn()) {
      const user_datail = this.authService.getUserDetail();
      if (user_datail) {
        body['auth_code'] = user_datail.auth_code;
      }
    }

    return this.http.post(environment.base_url + 'memberships', body);
  }

  get_plan_detail(trial_url: string) {
    return this.http.post(environment.base_url + 'trial_membership', {trial_url});
  }

  get_stripe_key() {
    const {auth_code} = this.authService.getUserDetail();
    // console.log({ auth_code: auth_code});
    return this.http.post(environment.base_url + 'account/public/data', {auth_code: auth_code});
  }

  subscribe_membership(body) {
    return this.http.post(environment.base_url + 'membership/subscribe', body);
  }

  update_card(body) {
    return this.http.post(environment.base_url + 'user/update_card', body);
  }

  apply_promo_code(body) {
    return this.http.post(environment.base_url + 'membership/discount_code', body);
  }

  apply_coupon(body) {
    return this.http.post(environment.base_url + 'membership/coupon', body);
  }


  unsubscribeMembershipPackage(id: number) {
    const {auth_code} = this.authService.getUserDetail();

    const body = {
      auth_code: auth_code,
      membership_user_id: id
    };

    return this.http.post(environment.base_url + 'membership/cancel', body);
  }


  // send cancellation reasons to the database
  set_cancellation_reasons(reasons) {
    return this.http.post(environment.base_url + 'cancel_reason', reasons);
  }

  // fake!!!!!!!!!!!!!!!!!!!
  fake_subscribe_membership() {
    return this.http.post(environment.base_url + 'fake_membership', {}, {responseType: 'text'});
  }

  // create coupon
  send_coupon(data2) {
    return this.http.post(environment.base_url + 'send_coupon', data2, {responseType: 'text'});
  }


}
