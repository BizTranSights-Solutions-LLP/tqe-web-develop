import { Component, OnInit, OnDestroy, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';

import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../services/auth.service';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { MembershipService } from '../../../services/membership.service';
import { SeoService } from '../../../services/seo.service';
import { HelperService } from '../../../services/helper.service';
declare const fbq: any;
@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.css']
})
export class CreateAccountComponent implements OnInit,AfterViewInit {

  showPassword: boolean = false;
  disable_register: boolean = false;
  is_free: boolean = false;
  loader: boolean = false;
  directlyLanded: boolean = false;

  register_error_message:string = 'All highlighted fields are required';
  server_error_message: string = '';
  frontErrorEmail:string = '';
  serverResponse: string = '';
  planError: string = '';
  selectedPlan:any = {};
  private ip_address = '';

  from: number = 2;
  to: number = 3;

  register_subscription: Subscription;
  loginEventSubscription: Subscription;
  getPlanSubscription: Subscription;

  registerForm = new FormGroup({
    first_name: new FormControl(null, Validators.required),
    last_name: new FormControl(null, Validators.required),
    username: new FormControl(null, Validators.required),
    email: new FormControl(null, [Validators.required, this.emailValidation]),
    confirmEmail: new FormControl(null, [Validators.required, this.emailValidation]),
    password: new FormControl(null, [Validators.required, Validators.minLength(6)])
  });

  emailValidation(control: AbstractControl) {
    const email_rx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (control.value && !control.value.match(email_rx)) {
      return { special_char_found : true }
    }
    return null;
  }

  constructor(
    private authService:AuthService,
    private router: Router,
    private membershipService: MembershipService,
    private seoService: SeoService,
    private helperService: HelperService,
    private route: ActivatedRoute
    ) { }

  async ngOnInit() {
    this.seoService.updateTitle('Create Account');
    let plan = this.route.snapshot.params['plan'];
    if (plan) {
      this.is_free = true;
      this.directlyLanded = true;
      this.from = 1;
      this.to = 2;
      this.loader = true;
      this.getPlanSubscription = this.membershipService.get_plan_detail(plan).subscribe(
        (res: any) => {
          this.loader = false;
          if(res.meta.code === 200) {
            this.selectedPlan = res.result;
            sessionStorage.setItem('is_trial', '1');
            localStorage.setItem('selected-plan', JSON.stringify(res.result));
            if(this.authService.isUserLoggedIn()) {
              let redirect_url = 'billing-information';
              if(this.router.url.includes('try-it-free')) {
                redirect_url = 'try-it-free/' + redirect_url;
              }
              this.router.navigate([redirect_url]);
            }
          } else {
            this.planError = res.meta.message;
            this.registerForm.disable();
            this.router.navigate(['']);
          }
        },
        (err) => {
          this.loader = false;
          this.server_error_message = err.statusText;
        }
      );
    } else {
      if(this.membershipService.selectedMembershipPlan) {
        this.selectedPlan = this.membershipService.selectedMembershipPlan;
      } else {
        this.selectedPlan = JSON.parse(localStorage.getItem('selected-plan'));
      }
    }

    let free = sessionStorage.getItem('is_trial');
    if(free) {
      this.is_free = free === '1' ? true : false;
    }

    try{
      let address_info:any = await this.authService.get_address_info().toPromise();
      this.ip_address = address_info.ip;
    }catch(e){}

    // script to add facebook pixel
    // start
    let url = this.router.url;
    url = url.substring(1, url.length);

    try{
      let res: any = await this.helperService.get_meta_tags(url).toPromise();

      if(res.meta.code === 200) {
        if(res.result.fb_pixel_scripts.length > 0) {
          let func = new Function(res.result.fb_pixel_scripts[0]);
          if (environment.production) {
            func();
          }
        }

        if(!(Array.isArray(res.result.meta_tags))) {
          let { title, description, keyword } = res.result.meta_tags;
          this.seoService.updateSeoTags(title, description, window.location.href, keyword);
        } else if(Array.isArray(res.result.meta_tags) && res.result.meta_tags.length > 0){
          let { title, description, keyword } = res.result.meta_tags[0];
          this.seoService.updateSeoTags(title, description, window.location.href, keyword);
        }
      }
    }catch(e) {}
    // end
  }

  ngAfterViewInit() {
    this.loginEventSubscription = this.authService.logginEvent.subscribe(
      res => {
        if(res) {
          console.log('triggered---------------->',res);
          setTimeout(()=>{
            let redirect_url = 'billing-information';
            if(this.router.url.includes('try-it-free')) {
              redirect_url = 'try-it-free/' + redirect_url;
            }
            this.router.navigate([redirect_url]);
          },100);
        }
      }
    );
  }

  register() {
    let form = this.registerForm;
    if(form.valid) {
      this.server_error_message = '';
      if(form.value.email === form.value.confirmEmail) {
        this.server_error_message = '';
        this.disable_register = true;
        let campaign_referral = localStorage.getItem("campaign_referral");
        let formdata = this.registerForm.value;
        delete formdata.confirmEmail;

        formdata.campaign_referral = campaign_referral;
        formdata.device_type = environment.device_type;
        formdata.device_token = environment.device_token;
        formdata.ip = this.ip_address;

        this.register_subscription = this.authService.register(formdata).subscribe(
          async (res:any) => {
            if(res.meta.code === 200) {
              let response:any = await this.authService.login(formdata).toPromise();

              if(response.meta.code === 200) {
                localStorage.setItem('data', JSON.stringify(response.result));
                this.authService.logginEvent.emit(true);
                this.registerForm.reset();
                this.serverResponse = 'Account Created Successfully and redirecting to billing page.....';
                this.authService.billingPageStep = this.directlyLanded ? {prev: '2', curr: '2'} : { prev: '3', curr: '3'};
                this.authService.billingPageSuccessMessage = { message: 'Congrats for creating a new TQE account!' };
                this.authService.membershipName = { package_name: this.selectedPlan.name };

                if(res.meta.code === 200) {

                  if(res.result.meta_tags.length > 0) {
                    let { title, description, keyword } = res.result.meta_tags[0];
                    this.seoService.updateSeoTags(title, description, window.location.href, keyword);
                  }

                  if(res.result.fb_pixel_scripts.length > 0) {
                    let func = new Function(res.result.fb_pixel_scripts[0]);
                    if (environment.production) {
                      func();
                    }
                  }
                }

                let redirect_url = 'billing-information';
                if(this.router.url.includes('try-it-free')) {
                  redirect_url = 'try-it-free/' + redirect_url;
                }

                setTimeout(()=>this.router.navigate([redirect_url]),2500);
              } else {
                this.server_error_message = res.meta.message;
                this.disable_register = false;
              }

            } else {
              this.disable_register = false;
              this.server_error_message = res.meta.message;
            }
          },
          (err) => {
            this.disable_register = false;
            this.server_error_message = err.message;
          }
        );
      } else {
        this.frontErrorEmail = 'Your Email not matched';
      }

    }
  }

  ngOnDestroy() {
    if(this.register_subscription) { this.register_subscription.unsubscribe(); }
    if(this.loginEventSubscription) { this.loginEventSubscription.unsubscribe(); }
    if(this.getPlanSubscription) { this.getPlanSubscription.unsubscribe(); }
  }

  button_show_password() {
    if(!this.showPassword){
      this.showPassword = true;
    }else{
      this.showPassword = false;
    }
  }
  showOverlay() {
    this.authService.overLay.emit(true);
  }

}
