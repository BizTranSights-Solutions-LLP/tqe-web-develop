import { Component, OnInit } from '@angular/core';
import { SeoService } from '../../services/seo.service';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';
import { HelperService } from '../../services/helper.service';
import { Router } from '@angular/router';

declare const fbq:any;
@Component({
  selector: 'app-aboutus',
  templateUrl: './aboutus.component.html',
  styleUrls: ['./aboutus.component.scss']
})
export class AboutusComponent implements OnInit {
  
  server_error_message = '';
  serverResponse = '';
  private ip_address = '';
  disable_register:boolean = false;

  register_subscription: Subscription;
  
  inquiryForm = new FormGroup({
    name: new FormControl(null, Validators.required),
    email: new FormControl(null, [Validators.required, this.emailValidation, Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/)]),
    message: new FormControl(null, [Validators.required]),
  });
  constructor(
    private seoService: SeoService, 
    private authService: AuthService, 
    private helperService: HelperService, 
    private router: Router
  ) { }

  emailValidation(control: AbstractControl) {
    if (control.value && control.value.match(/[\'\["!*#$%&+^,:;?|\]`~{=}_<> \\\-/\(\)]/g)) {
      return { special_char_found : true }
    }
    return null;
  }
  
  async ngOnInit() {
    this.seoService.updateTitle('About Us | The Quant Edge | Predictive Sports Betting Tools');
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

  register() {
    let form = this.inquiryForm;
    if(form.valid) {
      this.server_error_message = '';
      
      this.server_error_message = '';
      this.disable_register = true;
      
      let formdata = this.inquiryForm.value;

      formdata.device_type = environment.device_type;
      formdata.device_token = environment.device_token;
      formdata.ip = this.ip_address;
      
      this.register_subscription = this.authService.inquiry(formdata).subscribe(
        
        async (res:any) => {
          
          
          if(res.meta.code === 200) {
            let response:any = await this.authService.login(formdata).toPromise();
            this.inquiryForm.reset();
            this.serverResponse = res.meta.message;
            this.disable_register = false;
            setTimeout(()=>this.serverResponse='',5000);
            
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

}
