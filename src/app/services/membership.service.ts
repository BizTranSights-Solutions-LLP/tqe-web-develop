import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {AuthService} from './auth.service';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class MembershipService {

  selectedMembershipPlan;
  monthlyPlans;
  seasonPlans;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router,
  ) {
  }

  subscribe(subscriptionType, recurringPeriod) {
    const userInfo = this.authService.getUserDetail();
    if (userInfo && userInfo.is_whop_user) {
      this.redirectToWhop(subscriptionType);
    }
    else {
      // Fetch membership plans if user is not logged in
      this.get_membership_plans().subscribe(
        (res: any) => {
          console.log(res);
          
          // Check if the response is valid
          if (res && res.meta && res.meta.code === 200) {
            // Select the membership plan based on subscriptionType and recurringPeriod
            this.selectedMembershipPlan = this.selectMembershipPlan(subscriptionType, recurringPeriod, res.result);
            // Log if no valid plan was found
            if (!this.selectedMembershipPlan) {
              console.log('Invalid Plan');
              return;
            }
          }  
          // Redirect if a valid plan was selected
          if (this.selectedMembershipPlan) {
            localStorage.setItem('selected-plan', JSON.stringify(this.selectedMembershipPlan));
            const redirectUrl = this.authService.isUserLoggedIn() ? 'billing-information' : 'create-account';
            this.router.navigate([redirectUrl]);
          }
        },
        (err) => {
          console.error('Unable to fetch Membership Plans');
        }
      );
    }
  }
  
  // Helper function to determine the membership plan based on the type and period
  selectMembershipPlan(subscriptionType, recurringPeriod, plans) {
    if (subscriptionType === 'Professional' && recurringPeriod === 'Trial') {
      return plans.new_passes.professional_edition.monthly_trial;
    } else if (subscriptionType === 'Basic') {
      return recurringPeriod === 'Month' ? plans.new_passes.basic_edition.monthly_passes : plans.new_passes.basic_edition.annual_passes;
    } else if (subscriptionType === 'Professional') {
      return recurringPeriod === 'Month' ? plans.new_passes.professional_edition.monthly_passes : plans.new_passes.professional_edition.annual_passes;
    } else {
      return null;
    }
  }

  redirectToWhop(subscriptionType) {
    var redirectionLink = ""
    if (subscriptionType === "Basic") {
      redirectionLink = environment.tqeBasicViewAnnualPlan;
    }
    else if (subscriptionType === "Professional") {
      redirectionLink = environment.tqeProfessionViewAnnualPlan;
    }
    else if (subscriptionType === "Free") {
      redirectionLink = environment.tqeProfessionViewAnnualPlan;
    }
    else {
      alert("Unknown Subscription Type");
    }
    if (confirm("The Quant Edge uses Whop for subscription payments. Click OK to be redirected to Whop, or Cancel to stay on this page.")) {
      window.open(redirectionLink, "_blank");
    }
  }

  updateUserActiveMemberships() {
    this.get_user_active_memberships().subscribe(
      (res: any) => { // Use `any` type to bypass type checking
        console.log(res);

        if (res && res.meta && res.meta.code === 200) {
          const data = localStorage.getItem('data') ? JSON.parse(localStorage.getItem('data')) : {};
          data.memberships = res.result;
          
          // Save the updated data back to localStorage
          localStorage.setItem('data', JSON.stringify(data));
          console.log("Memberships saved to localStorage:", data);
        } else {
          console.log("Unexpected response code:", res && res.meta ? res.meta.code : "No meta code available");
        }
      },
      (err) => {
        console.log("Error fetching memberships:", err);
      }
    );
  }

  get_user_active_memberships() {
    const {auth_code} = this.authService.getUserDetail();
    return this.http.post(environment.base_url + 'active_memberships', {auth_code: auth_code});
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
