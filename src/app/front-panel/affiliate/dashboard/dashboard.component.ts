import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { DataService } from '../../../services/data.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { Subscription } from 'rxjs';
import { MembershipService } from '../../../services/membership.service';
import { SeoService } from '../../../services/seo.service';
import { Router } from '@angular/router';
import { HelperService } from '../../../services/helper.service';

declare const fbq: any;
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  user_role:any;
  
  server_error_message: string = '';
  private ip_address = '';

  disable_register: boolean = false;
  showPassword: boolean = false;

  userData: any = [];

  loader: boolean = true;
  user_subscriptionLoader: boolean = false;
  profile_picture_holder: boolean = false;
  upload_picture_modal: boolean = false;
  uploading: boolean = false;
  
  serverErrors: string = '';
  selectedMemberShipId: number;
  selectedMemberShipName: string = '';
  image_size_exceed_error: string = '';
  bank_detail_saved: string = '';
  
  bank_subscription: Subscription;
  user_subscription: Subscription;

  bankDetailForm = new FormGroup({
    bank_name: new FormControl(null, Validators.required),
    bank_account_number: new FormControl(null,[Validators.required,Validators.pattern('[0-9]\\d{0,}'),Validators.minLength(16),Validators.maxLength(16)]),
    bank_routing_number: new FormControl(null,[Validators.required,Validators.pattern('[0-9]\\d{0,}'),Validators.minLength(9),Validators.maxLength(9)]),
  });
  constructor(private dataService: DataService, private authService:AuthService, private router:Router, private membershipService: MembershipService, private seoService: SeoService, private helperService: HelperService) { }

  async ngOnInit() {
    this.seoService.updateTitle('Affiliate Marketing Program | The Quant Edge | Start Earning Today');
    this.user_subscription = this.authService.logginEvent.subscribe(
      res => {
        if(res){
          this.get_user_data();
        }
      } 
    );
    this.get_user_data();  
    try{
      let address_info:any = await this.authService.get_address_info().toPromise();
      this.ip_address = address_info.ip;
    }catch(e){}
    // let user  = this.authService.isUserLoggedIn();

    // if(user) {
    //   this.user_role = this.authService.getUserDetail().roles_status;
    // }

    let user_data:any;
    try{
      user_data = await this.dataService.get_user_role().toPromise();
      this.user_role = user_data.result;
      // console.log(this.user_role)
    }catch(e) {
      console.log(e);
    }
    
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
      this.bankDetailForm.patchValue(this.userData.bank_details);
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
  save() {
    let form = this.bankDetailForm;
    if(form.valid) {
      
      this.server_error_message = '';
      this.disable_register = true;
      
      let formdata = this.bankDetailForm.value;

      formdata.device_type = environment.device_type;
      formdata.device_token = environment.device_token;
      formdata.ip = this.ip_address;
      // formdata.role_id = 4; // Affiliate Role ID is 4
      formdata.auth_code = this.authService.getUserDetail().auth_code;
      
      this.bank_subscription = this.authService.bankDetail(formdata).subscribe(
        async (res:any) => {
          if(res.meta.code === 200) {
            this.disable_register = false;
            this.bank_detail_saved = res.meta.message;
            setTimeout(()=>{
              this.bank_detail_saved = '';              
              this.get_user_data(); 
            },2000);
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

  button_show_password() {    
    if(!this.showPassword){
      this.showPassword = true;
    }else{
      this.showPassword = false;
    }    
  }

  ngOnDestroy() {
    if(this.bank_subscription) { this.bank_subscription.unsubscribe(); }
  }
}
