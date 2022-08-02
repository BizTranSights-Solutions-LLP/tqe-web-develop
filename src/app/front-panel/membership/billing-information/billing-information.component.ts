import {Component, OnInit, ChangeDetectorRef, NgZone, AfterViewInit, OnDestroy} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {AuthService} from '../../../services/auth.service';
import {MembershipService} from '../../../services/membership.service';
import {environment} from '../../../../environments/environment';
import {Router} from '@angular/router';
import {SeoService} from '../../../services/seo.service';
import {HelperService} from '../../../services/helper.service';
import {DataService} from 'src/app/services/data.service';
import {Subscription} from 'rxjs';


declare const fbq: any;
declare var Stripe: any;

@Component({
  selector: 'app-billing-information',
  templateUrl: './billing-information.component.html',
  styleUrls: ['./billing-information.component.css']
})
export class BillingInformationComponent implements OnInit, AfterViewInit, OnDestroy {

  paymentForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]),
    address_zip: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(6)]),
    number: new FormControl(null, [Validators.required, Validators.pattern('[0-9]\\d{0,}'), Validators.minLength(13), Validators.maxLength(19)]),
    exp_month: new FormControl(null, [Validators.required, Validators.pattern('[0-9]\\d{0,}'), Validators.minLength(2), Validators.maxLength(2)]),
    exp_year: new FormControl(null, [Validators.required, Validators.pattern('[0-9]\\d{0,}'), Validators.minLength(4), Validators.maxLength(4)]),
    cvc: new FormControl(null, [Validators.required, Validators.pattern('[0-9]\\d{0,}'), Validators.minLength(3), Validators.maxLength(4)])
  });

  billingButtonText: string = '';
  serverError: string = '';
  promoError: string = '';
  serverResponse: string = '';
  private promoCode: string = '';
  membershipDesclaimerText: string = '';

  showPassword: boolean = false;
  showPromo: boolean = false;
  billingSuccess: boolean = false;
  disablePay: boolean = false;
  loggedIn: boolean = false;
  isTrial: boolean = false;
  disablePromo: boolean = false;
  loader: boolean = true;
  prev: string = '';
  curr: string = '';
  billingMessage: string = '';
  membershipName: string = '';
  user_subscription: Subscription;

  constructor(
    private cd: ChangeDetectorRef,
    private authService: AuthService,
    private membershipService: MembershipService,
    private router: Router,
    private seoService: SeoService,
    private ngZone: NgZone,
    private helperService: HelperService,
    private dataService: DataService,
    private http: HttpClient
  ) {
  }

  public navigate(commands: any[]): void {
    this.ngZone.run(() => this.router.navigate(commands)).then();
  }

  async ngOnInit() {
    this.user_subscription = this.authService.logginEvent.subscribe(
      res => {
        if (res) {
          this.get_user_data();
        }
      }
    );
    this.get_user_data();
    this.seoService.updateTitle('Billing Information');
    const {message} = this.authService.billingPageSuccessMessage;
    this.billingMessage = message;

    const {package_name} = this.authService.membershipName;
    this.membershipName = package_name;

    const {prev, curr} = this.authService.billingPageStep;
    this.prev = prev;
    this.curr = curr;

    const selectedPlan: any = localStorage.getItem('selected-plan');
    this.loggedIn = this.authService.isUserLoggedIn();
    this.isTrial = JSON.parse(selectedPlan).is_trial;

    if (this.isTrial) {
      this.billingButtonText = 'Start My FREE Trial!';
      this.membershipDesclaimerText = (JSON.parse(selectedPlan)).trial_membership_disclaimer_text;
    } else {
      if (selectedPlan) {
        this.billingButtonText = 'Pay  $ ' + (JSON.parse(selectedPlan)).initial_payment;
      }
      this.membershipDesclaimerText = (JSON.parse(selectedPlan)).membership_disclaimer_text;
      // }
    }

    try {
      let stripe_key: any = await this.membershipService.get_stripe_key().toPromise();
      let {result} = stripe_key;

      // decode the key
      if (result) {
        let key = result.replace('a7uq8', '').replace('eg6detn', '');
        Stripe.setPublishableKey(key);
      }

    } catch (e) {
    }

    // script to add facebook pixel
    // start
    let url = this.router.url;
    url = url.substring(1, url.length);

    try {
      let res: any = await this.helperService.get_meta_tags(url).toPromise();

      if (res.meta.code === 200) {
        if (res.result.fb_pixel_scripts.length > 0) {
          let func = new Function(res.result.fb_pixel_scripts[0]);
          if (environment.production) {
            func();
          }
        }

        if (!(Array.isArray(res.result.meta_tags))) {
          let {title, description, keyword} = res.result.meta_tags;
          this.seoService.updateSeoTags(title, description, window.location.href, keyword);
        } else if (Array.isArray(res.result.meta_tags) && res.result.meta_tags.length > 0) {
          let {title, description, keyword} = res.result.meta_tags[0];
          this.seoService.updateSeoTags(title, description, window.location.href, keyword);
        }
      }
    } catch (e) {
    }
    // end

  }

  async ngAfterViewInit() {
  }

  async get_user_data() {

    let data: any;
    try {
      data = await this.dataService.get_user_information().toPromise();
      this.loader = false;
    } catch (e) {
      if (e.status === 401 || e.error.message === 'Unauthenticated.') {
        this.serverError = 'You are UnAuthenticated. Please login again!';
        this.loader = false;
        setTimeout(() => {
          this.authService.logoutEvent.emit(true);
          localStorage.clear();
          sessionStorage.clear();
          this.router.navigate(['/']);
        }, 1000);
      }
      // else if(e.status === 400 || e.error.message === 'No membership found.') {
      //   // this.serverErrors = 'You are UnAuthenticated. Please login again!';
      //   this.tourGuide.hide();
      //   console.log(this.serverErrors);

      // }
    }
  }


  async applyPromoCode(code: string) {

    if (code) {
      const data = {
        email: this.authService.getUserDetail().email,
        code: code,
        // tslint:disable-next-line:max-line-length
        membership_id: this.membershipService.selectedMembershipPlan ? this.membershipService.selectedMembershipPlan.id : (JSON.parse(localStorage.getItem('selected-plan'))).id,
        auth_code: this.authService.getUserDetail().auth_code
      };
      this.serverError = '';
      this.promoError = '';
      let response: any;
      this.disablePromo = true;
      try {
        response = await this.membershipService.apply_coupon(data).toPromise();
        this.loader = false;
      } catch (e) {
        if (e.status === 201 || e.error.message === 'Unauthenticated.') {
          this.serverError = 'You are UnAuthenticated. Please login again!';
          this.loader = false;
          setTimeout(() => {
            this.router.navigate(['/']);
            this.authService.logoutEvent.emit(true);
            localStorage.clear();
            sessionStorage.clear();
          }, 2000);
        }
      }

      if (response.meta.code === 200) {
        this.promoCode = code;


        const selectedPlan: any = localStorage.getItem('selected-plan');
        const float = parseFloat((JSON.parse(selectedPlan)).initial_payment) - 10;
        this.billingButtonText = 'Pay  $ ' + float.toString();
        this.promoError = 'Coupon Code Applied.';
        this.showPromo = false;
        this.disablePromo = false;
        this.membershipDesclaimerText = response.result.message;
        setTimeout(() => this.promoError = '', 1500);
      } else {
        try {
          response = await this.membershipService.apply_promo_code(data).toPromise();
          this.loader = false;
        } catch (e) {
          if (e.status === 201 || e.error.message === 'Unauthenticated.') {
            this.serverError = 'You are UnAuthenticated. Please login again!';
            this.loader = false;
            setTimeout(() => {
              this.router.navigate(['/']);
              this.authService.logoutEvent.emit(true);
              localStorage.clear();
              sessionStorage.clear();
            }, 2000);
          }
        }

        if (response.meta.code === 200) {
          this.promoCode = code;
          this.billingButtonText = 'Pay  $ ' + response.result.membership_discount.initial_payment;
          this.promoError = 'Promo Code Applied.';
          this.showPromo = false;
          this.disablePromo = false;
          this.membershipDesclaimerText = response.result.message;
          setTimeout(() => this.promoError = '', 1500);

        } else {
          this.promoError = response.meta.message;
          setTimeout(() => this.promoError = '', 2500);
          this.disablePromo = false;
        }
      }
    }
  }


  async createToken() {
    if (this.paymentForm.valid) {
      this.disablePay = true;

      Stripe.card.createToken(this.paymentForm.value, (status, response) => {
        if (status === 200) {

          // console.log(this.paymentForm.value);

          const data = {
            auth_code: this.authService.getUserDetail().auth_code,
            membership_id: this.membershipService.selectedMembershipPlan ? this.membershipService.selectedMembershipPlan.id : (JSON.parse(localStorage.getItem('selected-plan'))).id,
            card: response.card.id,
            card_holder_name: response.card.name,
            stripe_token: response.id,
            card_last4: response.card.last4,
            card_brand: response.card.brand,
            expiry_month: response.card.exp_month,
            expiry_year: response.card.exp_year,
            is_trial: 0,
            zip_code: this.paymentForm.value.address_zip
          };

          if (this.promoCode) {
            data['code'] = this.promoCode;
          }

          if (sessionStorage.getItem('is_trial') && sessionStorage.getItem('is_trial') === '1') {
            data['is_trial'] = 1;
          }

          const selectedPlan: any = localStorage.getItem('selected-plan');

          this.membershipName = (JSON.parse(selectedPlan)).name;

          this.serverError = '';
          this.membershipService.subscribe_membership(data).subscribe(
            (res: any) => {
              if (res.meta.code === 200) {
                let pch_tx_code = localStorage.getItem('tx_id');
                window.history.pushState({'pageTitle': 'TQE Subscription Successful'}, '', '/billing-success');

                if (pch_tx_code) {
                  let pch_url = 'http://liquidpch.go2cloud.org/aff_lsr?transaction_id=' + pch_tx_code;
                  this.http.post(pch_url, {}).subscribe(
                    () => {
                    }
                  );
                  localStorage.removeItem('tx_id');
                }

                this.serverResponse = 'Subscription Successfully Added to Your Account';
                this.paymentForm.reset();
                this.billingSuccess = true;
                this.cd.detectChanges();
                this.membershipService.selectedMembershipPlan.is_subscribed = 1;
                localStorage.removeItem('selected-plan');
                sessionStorage.removeItem('is_trial');
                const {message} = this.authService.billingPageSuccessMessage;
                this.billingMessage = message;

                if (res.result.fb_pixel_scripts.length > 0) {
                  let func = new Function(res.result.fb_pixel_scripts[0]);
                  if (environment.production) {
                    func();
                  } else {


                    const data2 = {
                      auth_code: this.authService.getUserDetail().auth_code,
                      email: this.authService.getUserDetail().email
                    };

                    this.membershipService.send_coupon(data2).subscribe(
                      (res: any) => {
                      }
                    );

                    // console.log(res.result.fb_pixel_scripts[0]);
                  }
                }
              } else {
                this.disablePay = false;
                this.serverError = res.meta.message;
                this.cd.detectChanges();
                if (res.result.is_trial_consumed) {
                  let price = this.membershipService.selectedMembershipPlan ? this.membershipService.selectedMembershipPlan.initial_payment : (JSON.parse(localStorage.getItem('selected-plan'))).initial_payment;
                  this.billingButtonText = 'Pay  $ ' + price;
                  this.membershipDesclaimerText = res.meta.message + ' ' + (JSON.parse(selectedPlan)).membership_disclaimer_text;
                  this.cd.detectChanges();
                  sessionStorage.removeItem('is_trial');
                }
                if (res.result.is_already_subscribed) {
                  this.disablePay = true;
                }
              }
            },
            (err) => {
              this.disablePay = false;
            }
          );
        } else {
          this.disablePay = false;
          this.paymentForm.controls['number'].setErrors({'incorrect': true});
          this.serverError = response.error.message;
          this.cd.detectChanges();
        }
      });
    }

  }

  ngOnDestroy() {
    if (this.user_subscription) {
      this.user_subscription.unsubscribe();
    }
  }

  button_show_promo() {
    if (!this.showPromo) {
      this.showPromo = true;
    } else {
      this.showPromo = false;
    }
  }

  button_show_password() {
    if (!this.showPassword) {
      this.disablePromo = false;
      this.showPassword = true;
    } else {
      this.showPassword = false;
    }
  }

}
