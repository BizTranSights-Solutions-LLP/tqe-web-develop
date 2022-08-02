import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../../../../services/auth.service';
import { DataService } from '../../../../services/data.service';
import { Router } from '@angular/router';
import { SeoService } from '../../../../services/seo.service';
import { MembershipService } from '../../../../services/membership.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { HelperService } from '../../../../services/helper.service';
import { environment } from '../../../../../environments/environment';

declare const fbq: any;
@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditAffiliateComponent implements OnInit {
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
    twitter_account: new FormControl(null, Validators.required),
    paypal_email: new FormControl(null, Validators.required)
  });
  
  constructor(
    private authService: AuthService, 
    private dataService: DataService, 
    private router:Router, 
    private seoService: SeoService,
    private membershipService: MembershipService,
    private cd: ChangeDetectorRef,
    private helperService: HelperService
    ) { }

  async ngOnInit() {
    this.seoService.updateTitle('Affiliate Edit Profile | The Quant Edge');
    this.user_subscription = this.authService.logginEvent.subscribe(
      res => {
        if(res){
          this.get_user_data();
        }
      } 
    );

    this.get_user_data();

    let url = this.router.url;
    url = url.substring(1, url.length);
    
    try{
      let res: any = await this.helperService.get_meta_tags(url).toPromise();
      if(res.meta.code === 200) {

        if(!(Array.isArray(res.result.meta_tags))) {
          let { title, description, keyword } = res.result.meta_tags;
          this.seoService.updateSeoTags(title, description, window.location.href, keyword);
        } else if(Array.isArray(res.result.meta_tags) && res.result.meta_tags.length > 0){
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
    }catch(e) {}
  }

  async get_user_data(){

    let data:any;
    try{
      data = await this.dataService.get_user_information().toPromise();
      this.serverErrors = '';
      this.userData = data.result;
      this.updateProfileForm.patchValue(this.userData);
      console.log(this.userData);
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

}
