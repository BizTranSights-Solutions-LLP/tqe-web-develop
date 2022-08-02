import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { ReactiveFormsModule,FormBuilder ,FormGroup, FormControl, FormArray, Validators, AbstractControl } from '@angular/forms';

import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../services/auth.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { MembershipService } from '../../../services/membership.service';
import { SeoService } from '../../../services/seo.service';
import { DataService } from '../../../services/data.service';
import { HelperService } from '../../../services/helper.service';

declare const fbq: any;
class Product {
  name: string
  discount_code: DiscountCode[]
}

class DiscountCode {
  selling_point: string
}

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.css']
})
export class AffiliateCreateAccountComponent implements OnInit,AfterViewInit {

  // If User LoggedIn
  loggedIn: boolean = false;
  loading: boolean = true;
  user_role:any;
  user_name: Subscription;
  user_subscription: Subscription;
  allSubscriptions: Subscription[] = [];


  
  showPassword: boolean = false;
  disable_register: boolean = false;

  register_error_message:string = 'All highlighted fields are required';
  server_error_message: string = '';
  frontErrorEmail:string = '';
  serverResponse: string = '';
  selectedPlan:any = {};
  private ip_address = '';

  register_subscription: Subscription;

  // registerForm = new FormGroup({
    
  // });

  // updateForm = new FormGroup({
    
    
  // });

  registerForm: FormGroup;
  updateForm: FormGroup;
  
  emailValidation(control: AbstractControl) {
    if (control.value && control.value.match(/[\'\["!*#$%&+^,:;?|\]`~{=}_<> \\\-/\(\)]/g)) {
      return { special_char_found : true }
    }
    return null;
  }
  
  constructor(
    private authService:AuthService, 
    private router: Router,
    private seoService: SeoService,
    private dataService: DataService,
    private fb: FormBuilder,
    private helperService: HelperService
    ) { }

  async ngOnInit() {
    this.seoService.updateTitle('Affiliate Create Account Page | The Quant Edge');
    this.registerForm = this.fb.group({
      first_name: new FormControl(null, Validators.required),
      last_name: new FormControl(null, Validators.required),
      username: new FormControl(null, Validators.required),
      email: new FormControl(null, [Validators.required, this.emailValidation, Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/)]),
      confirmEmail: new FormControl(null, [Validators.required, this.emailValidation, Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/)]),
      paypal_email: new FormControl(null, [Validators.required, this.emailValidation, Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/)]),
      twitter_account: new FormControl(null),
      // discount_code: new FormControl(null),
      role_id: new FormControl(4),
      password: new FormControl(null, [Validators.required, Validators.minLength(6)]),
      discount_code: this.fb.array([this.fb.group({discount_code:''}, this.fb.control('', Validators.required))])
    })

    this.updateForm = this.fb.group({
      paypal_email: new FormControl(null, [Validators.required, Validators.email]),
      twitter_account: new FormControl(null, [Validators.required, Validators.email]),
      // discount_code: new FormControl(null)
      discount_code: this.fb.array([this.fb.group({discount_code:''}, this.fb.control('', Validators.required))])
    })

    try{
      let address_info:any = await this.authService.get_address_info().toPromise();
      this.ip_address = address_info.ip;
    }catch(e){}


    this.loggedIn = this.authService.isUserLoggedIn();
    this.user_name = this.authService.logginEvent.subscribe(
      (res:any) => {
        if(res) {
          this.loggedIn = res;
        }
      }
    )
    let user  = this.authService.isUserLoggedIn();
    
    if(user) {
      let user_role = this.authService.getUserDetail().roles_status;
      this.user_role = this.authService.getUserDetail();
      
      if(user_role.is_affiliate){
        setTimeout(()=>this.router.navigate(['affiliate/dashboard']),2500);
        this.loggedIn = true;
      }else {
        this.loggedIn = true;
      }
      
      
    }
    
   
    setTimeout(()=>this.loading = false,2500);

    
    this.allSubscriptions.push(this.authService.logoutEvent.subscribe(
      res => {
        if(res) {
          this.loading = false;
          this.loggedIn = false;
        }
      }
    )
    );

    this.allSubscriptions.push(this.authService.logginEvent.subscribe(
      res => {
        if(res) {
          let role = this.authService.getUserDetail().roles_status;
          if(role.is_affiliate) {
            this.loading = true; 
            setTimeout(()=>this.router.navigate(['affiliate/dashboard']),2500);
          }
        }
      }
    )
    );
    
  }

  ///////// Discount Code ////////
  get discountCodeNew() {
    return this.registerForm.get('discount_code') as FormArray;
  }
  addDiscountCodeNew() {
    this.discountCodeNew.push(this.fb.group({discount_code:''}, this.fb.control('', Validators.required)));
  }

  deleteDiscountCodeNew(index) {
    this.discountCodeNew.removeAt(index);
  }

  get discountCodeUpdate() {
    return this.updateForm.get('discount_code') as FormArray;
  }
  addDiscountCodeUpdate() {
    this.discountCodeUpdate.push(this.fb.group({discount_code:''}, this.fb.control('', Validators.required)));
  }

  deleteDiscountCodeUpdate(index) {
    this.discountCodeUpdate.removeAt(index);
  }
  /////////// End ////////////////

  
  ngAfterViewInit() {
  }

  update() {
    let form = this.updateForm;
    if(form.valid) {
      
      this.server_error_message = '';
      this.disable_register = true;
      
      let formdata = this.updateForm.value;
      delete formdata.confirmEmail;

      formdata.device_type = environment.device_type;
      formdata.device_token = environment.device_token;
      formdata.ip = this.ip_address;
      // formdata.role_id = 4; // Affiliate Role ID is 4
      formdata.auth_code = this.authService.getUserDetail().auth_code;

      let promo_codes = formdata.discount_code;
      let new_promo_codes = promo_codes.reduce((array,data) => {
        array.push(data.discount_code);
        return array
      },[]);

      if(new_promo_codes.length > 0) {
        formdata.discount_code = new_promo_codes;
      }

      this.register_subscription = this.authService.updateAffiliate(formdata).subscribe(
        async (res:any) => {
          if(res.meta.code === 200) {
            let user_data = this.authService.getUserDetail();            
            

            if(!user_data.roles_status.is_affiliate) {
              user_data.roles_status.affiliate_message = "Your application is still being reviewed. Please check back later!";
              user_data.roles_status.is_affiliate = 1;
              localStorage.setItem('data', JSON.stringify(user_data));
              setTimeout(()=>this.router.navigate(['affiliate/dashboard']),2500);
            }
            
            // let response:any = await this.authService.login(formdata).toPromise();
            
            // if(response.meta.code === 200) {
            //   localStorage.setItem('data', JSON.stringify(response.result));
            //   this.authService.logginEvent.emit(true);
            //   this.updateForm.reset();
            //   this.serverResponse = 'Account Created Successfully';
              
            // } else {
            //   this.server_error_message = res.meta.message;
            //   this.disable_register = false;
            // }
            setTimeout(()=>this.router.navigate(['affiliate/dashboard']),2500);
            
            
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

    }
  }

  register() {
    let form = this.registerForm;
    if(form.valid) {
      this.server_error_message = '';
      if(form.value.email === form.value.confirmEmail) {
        this.server_error_message = '';
        this.disable_register = true;
        
        let formdata = this.registerForm.value;
        let promo_codes = formdata.discount_code;
        let new_promo_codes = promo_codes.reduce((array,data) => {
          array.push(data.discount_code);
          return array
        },[]);

        delete formdata.confirmEmail;

        if(new_promo_codes.length > 0) {
          formdata.discount_code = new_promo_codes;
        }

        formdata.device_type = environment.device_type;
        formdata.device_token = environment.device_token;
        formdata.ip = this.ip_address;
        formdata.role_id = 4; // Affiliate Role ID is 4
        
        this.register_subscription = this.authService.register(formdata).subscribe(
          async (res:any) => {
            if(res.meta.code === 200) {
              let response:any = await this.authService.login(formdata).toPromise();
              
              if(response.meta.code === 200) {
                localStorage.setItem('data', JSON.stringify(response.result));
                this.authService.logginEvent.emit(true);
                this.registerForm.reset();
                this.serverResponse = 'Account Created Successfully';

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
                setTimeout(()=>this.router.navigate(['affiliate/dashboard']),2500);
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
    if(this.user_subscription) { this.user_subscription.unsubscribe(); }

    this.allSubscriptions.forEach(s => s.unsubscribe());
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
