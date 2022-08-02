import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../services/auth.service';
import { DataService } from '../../../services/data.service';
import { Router } from '@angular/router';
import { SeoService } from '../../../services/seo.service';
import { MembershipService } from '../../../services/membership.service';

declare var Stripe: any;
@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {
  userData: any = [];

  loader: boolean = true;
  disablePay: boolean = false;
  user_subscriptionLoader: boolean = false;
  disable_register: boolean = false;
  disable_button: boolean = false;
  showPassword: boolean = false;

  serverErrors: string = '';
  serverError: string = '';
  serverResponse: string = '';


  server_error_message: string = '';
  frontErrorEmail: string = '';
  updateRes: string = '';
  updatePassword: string = '';

  user_subscription: Subscription;
  update_profile_subscription: Subscription;


  updateProfileForm = new FormGroup({
    first_name: new FormControl(null, Validators.required),
    last_name: new FormControl(null, Validators.required),
    new_password: new FormControl(null, Validators.minLength(6))
  });

  paymentForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]),
    address_zip: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(6)]),
    number: new FormControl(null, [Validators.required, Validators.pattern('[0-9]\\d{0,}'), Validators.minLength(16), Validators.maxLength(16)]),
    exp_month: new FormControl(null, [Validators.required, Validators.pattern('[0-9]\\d{0,}'), Validators.minLength(2), Validators.maxLength(2)]),
    exp_year: new FormControl(null, [Validators.required, Validators.pattern('[0-9]\\d{0,}'), Validators.minLength(4), Validators.maxLength(4)]),
    cvc: new FormControl(null, [Validators.required, Validators.pattern('[0-9]\\d{0,}'), Validators.minLength(3), Validators.maxLength(4)])
  });

  constructor(
    private authService: AuthService,
    private dataService: DataService,
    private router:Router,
    private seoService: SeoService,
    private membershipService: MembershipService,
    private cd: ChangeDetectorRef,
    ) { }

  async ngOnInit() {
    this.seoService.updateTitle('Edit My Profile | The Quant Edge');
    this.user_subscription = this.authService.logginEvent.subscribe(
      res => {
        if(res){
          this.get_user_data();
        }
      }
    );

    this.get_user_data();

    try {
      let stripe_key:any = await this.membershipService.get_stripe_key().toPromise();
      let { result } = stripe_key;

      if(result) {
        let key = result.replace('a7uq8','').replace('eg6detn','');
        Stripe.setPublishableKey(key);
      }

      } catch(e) {}
  }

  async get_user_data(){

    let data:any;
    try{
      data = await this.dataService.get_user_information().toPromise();
      this.serverErrors = '';
      this.userData = data.result;
      this.updateProfileForm.patchValue(this.userData);
      this.loader = false;
    }catch(e) {
      if(e.status === 401 || e.error.message === 'Unauthenticated.') {
        this.serverErrors = 'You are UnAuthenticated. Please login again!';
        this.loader = false;

        setTimeout(()=>{
          this.authService.logoutEvent.emit(true);
          localStorage.clear();
          sessionStorage.clear();
          this.router.navigate(['/'])
        },1000);
      }
      // else if(e.status === 400 || e.error.message === 'No membership found.') {
      //   // this.serverErrors = 'You are UnAuthenticated. Please login again!';
      //   this.tourGuide.hide();
      //   console.log(this.serverErrors);

      // }
    }
  }
  button_show_password() {

    if(!this.showPassword){
      this.showPassword = true;
    }else{
      this.showPassword = false;
    }

  }
  updateRrofile(){

    this.server_error_message = '';

    this.disable_register = true;
    let formdata = this.updateProfileForm.value;
    this.disable_button = true;

    let  { first_name, last_name, new_password } = formdata;

    if(first_name === this.userData.first_name && last_name === this.userData.last_name && new_password === null ) {
      this.server_error_message = 'Nothing changed';
      this.disable_register = false;
      this.disable_button = false;
      setTimeout(()=>this.server_error_message = '',2500);
    } else {

      this.update_profile_subscription = this.authService.update_profile(formdata).subscribe(
        async (res:any) => {
          if(res.meta.code === 200) {
            this.updateRes = 'Profile Update Successfully';
            this.disable_register = false;
            let user_data = JSON.parse(localStorage.getItem('data'));
            user_data.first_name = formdata.first_name;
            localStorage.setItem('data', JSON.stringify(user_data))
            this.authService.updateUserName.emit(formdata.first_name);
            if(formdata.new_password){
              this.authService.logoutEvent.emit(true);
              localStorage.clear();
              this.updatePassword = 'Your Password has been Updated Successfully. Plaase Login your account with New Password.'
              setTimeout(()=>this.router.navigate(['/']),2500);

            }else{
              setTimeout(()=>this.router.navigate(['profile']),2500);
            }

          } else {
            this.disable_register = false;
            this.disable_button = false;
            this.server_error_message = res.meta.message;
          }
        },
        (err) => {
          this.disable_register = false;
          this.server_error_message = err.message;
        }
      );
    }
  }

  async createToken() {
    if (this.paymentForm.valid) {
      this.disablePay = true;
      Stripe.card.createToken(this.paymentForm.value, (status, response) => {
        if (status === 200) {
          const data = {
            auth_code: this.authService.getUserDetail().auth_code,
            stripe_token: response.id,
            card_last4: response.card.last4,
            card_brand: response.card.brand,
            expiry_month: response.card.exp_month,
            expiry_year: response.card.exp_year,
            card_holder_name: response.card.name
          }

          this.serverError = '';
          this.membershipService.update_card(data).subscribe(
            (res: any) => {
              if (res.meta.code === 200) {
                this.disablePay = false;
                this.serverResponse = res.meta.message;
                this.paymentForm.reset();
                setTimeout(() => this.serverResponse = '', 2000);
                this.cd.detectChanges();

              } else {
                this.disablePay = false;
                this.serverError = res.meta.message;
                this.cd.detectChanges();

              }
            },
            (err) => {
              this.disablePay = false;
              if (err.status === 201 || err.error.message === 'Unauthenticated.') {
                this.serverError = 'You are UnAuthenticated. Please login again!';

                setTimeout(() => {
                  this.authService.logoutEvent.emit(true);
                  localStorage.clear();
                  sessionStorage.clear();
                  this.router.navigate(['']);
                }, 2000);
              }
            }
          )
        } else {
          this.disablePay = false;
          this.paymentForm.controls[response.error.param].setErrors({ 'incorrect': true });
          this.cd.detectChanges();
        }
      });
    }

  }

  ngOnDestroy() {
    if(this.update_profile_subscription) { this.update_profile_subscription.unsubscribe(); }
    if(this.user_subscription) { this.user_subscription.unsubscribe(); }
  }
}
