import {Component, OnInit, OnDestroy} from '@angular/core';
import {FormGroup, FormControl, Validators, AbstractControl, FormBuilder, FormArray} from '@angular/forms';

import {environment} from '../../../environments/environment';
import {AuthService} from '../../services/auth.service';
import {Subscription} from 'rxjs';
import {Router} from '@angular/router';
import {MembershipService} from '../../services/membership.service';
import {SeoService} from '../../services/seo.service';
import {HelperService} from '../../services/helper.service';

declare const fbq: any;

import {MessageService} from '../../app.message-service';

import {ReferralService} from '../../services/referral.service';

import {CouponService} from '../../services/coupon.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit, OnDestroy {
  title = 'angular-dynamic-form';
  feeForm: FormGroup;


  // where did you know us
  wheres: string[] = ['Friend', 'Email', 'Website', 'Instagram',
    'Facebook',
    'Twitter',
    'Youtube',
    'Linkedin',
    'Friends/Referral',
    'Other'
  ];
  where = '';
  other = '';


  showPassword = false;
  disable_register = false;

  register_error_message = 'All highlighted fields are required';
  server_error_message = '';
  frontErrorEmail = '';
  serverResponse = '';
  selectedPlan: any = {};
  private ip_address = '';

  register_subscription: Subscription;
  loginEventSubscription: Subscription;

  registerForm = new FormGroup({
    first_name: new FormControl(null, Validators.required),
    last_name: new FormControl(null, Validators.required),
    username: new FormControl(null, Validators.required),
    email: new FormControl(null, [Validators.required, this.emailValidation, Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/)]),
    confirmEmail: new FormControl(null, [Validators.required, this.emailValidation, Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/)]),
    password: new FormControl(null, [Validators.required, Validators.minLength(6)]),
    where: new FormControl(null, Validators.required),
    other: new FormControl()
  });

  emailValidation(control: AbstractControl) {
    if (control.value && control.value.match(/[\'\["!*#$%&+^,:;?|\]`~{=}_<> \\\-/\(\)]/g)) {
      return {special_char_found: true};
    }
    return null;
  }

  constructor(
    private authService: AuthService,
    private router: Router,
    private membershipService: MembershipService,
    private seoService: SeoService,
    private helperService: HelperService,
    private fb: FormBuilder,
    private messageService: MessageService,
    private referralService: ReferralService,
    private couponService: CouponService,
  ) {
  }

  async ngOnInit() {
    this.feeForm = this.fb.group({
      feeArray: this.fb.array([])
    });
    this.addFeeItem();

    let url = this.router.url;
    url = url.substring(1, url.length);

    try {
      const res: any = await this.helperService.get_meta_tags(url).toPromise();

      if (res.meta.code === 200) {
        if (res.result.fb_pixel_scripts.length > 0) {
          const func = new Function(res.result.fb_pixel_scripts[0]);
          if (environment.production) {
            func();
          }
        }

        if (!(Array.isArray(res.result.meta_tags))) {
          const {title, description, keyword} = res.result.meta_tags;
          this.seoService.updateSeoTags(title, description, window.location.href, keyword);
        } else if (Array.isArray(res.result.meta_tags) && res.result.meta_tags.length > 0) {
          const {title, description, keyword} = res.result.meta_tags[0];
          this.seoService.updateSeoTags(title, description, window.location.href, keyword);
        }
      }
    } catch (e) {
    }

    if (this.membershipService.selectedMembershipPlan) {
      this.selectedPlan = this.membershipService.selectedMembershipPlan;
    } else {
      this.selectedPlan = JSON.parse(localStorage.getItem('selected-plan'));
    }

    try {
      const address_info: any = await this.authService.get_address_info().toPromise();
      this.ip_address = address_info.ip;
    } catch (e) {
    }

    this.loginEventSubscription = this.authService.logginEvent.subscribe(
      res => {
        if (res) {
          setTimeout(() => {
            this.router.navigate(['/']);
          }, 100);
        }
      }
    );
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngAfterViewInit() {
  }

  get feeArray() {
    return <FormArray>this.feeForm.get('feeArray');
  }


  addFeeItem() {
    this.feeArray.push(
      this.fb.group({
        // tslint:disable-next-line:max-line-length
        r_email: ['', [Validators.required, this.emailValidation, Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/)]]
      })
    );
  }


  removeFeeItem() {
    this.feeArray.removeAt(this.feeArray.length - 1);
  }

  register() {
    const form = this.registerForm;
    const rform = this.feeForm;
    console.log(form.value.email);
    console.log(rform);

    if (this.feeForm.valid) {
      // create a json request
      const data = {
        user_email: form.value.email,
        referral_emails: this.feeForm.controls.feeArray.value
      };


      // save referral list
      this.referralService.save_referral(data).subscribe(
        (res: any) => {
          // send emails
          this.referralService.send_referral(data).subscribe(
            // tslint:disable-next-line:no-shadowed-variable
            (data: any) => {
            },
            error => {
              console.log(error);
            }
          );
          // alert('Referral email successfully sent!');
        },
        error => {
          console.log(error);
          // alert('This referral email already be referred!');
        }
      );
    } else {
      alert('The referral email is invalid!');
    }

    if (form.valid) {
      this.server_error_message = '';
      if (form.value.email === form.value.confirmEmail) {
        this.server_error_message = '';
        this.disable_register = true;

        let formdata = this.registerForm.value;
        delete formdata.confirmEmail;

        // console.log("dataA", formdata);


        formdata.device_type = environment.device_type;
        formdata.device_token = environment.device_token;
        formdata.ip = this.ip_address;

        // console.log("dataB", formdata);

        this.register_subscription = this.authService.register(formdata).subscribe(
          async (res: any) => {


            if (res.meta.code === 200) {
              // save where user us know from
              this.authService.save_where(formdata).subscribe();
              const response: any = await this.authService.login(formdata).toPromise();

              if (response.meta.code === 200) {
                localStorage.setItem('data', JSON.stringify(response.result));
                this.authService.logginEvent.emit(true);
                this.registerForm.reset();

                if (res.result.meta_tags.length > 0) {
                  const {title, description, keyword} = res.result.meta_tags[0];
                  this.seoService.updateSeoTags(title, description, window.location.href, keyword);
                }

                if (res.result.fb_pixel_scripts.length > 0) {
                  let func = new Function(res.result.fb_pixel_scripts[0]);
                  if (environment.production) {
                    func();
                  }
                }

                this.serverResponse = 'Account Created Successfully and redirecting to billing page.....';
                // setTimeout(()=>this.router.navigate(['/']),2500);
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
    if (this.register_subscription) {
      this.register_subscription.unsubscribe();
    }
    if (this.loginEventSubscription) {
      this.loginEventSubscription.unsubscribe();
    }
  }

  button_show_password() {
    if (!this.showPassword) {
      this.showPassword = true;
    } else {
      this.showPassword = false;
    }
  }

  showOverlay() {
    this.authService.overLay.emit(true);
  }
}
