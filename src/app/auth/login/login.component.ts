import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';

import { environment } from '../../../environments/environment';
import { LoginResponse } from '../../models/login';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit,OnDestroy {

  bg_img = `../../../../assets/images/home_page/login_bg.jpg`
  login_error_message:string = 'All highlighted fields are required';
  server_error_message:string = '';

  disable_login: boolean = false;

  loginForm = new FormGroup({
    username: new FormControl(null, Validators.required),
    password: new FormControl(null, Validators.required)
  });

  private ip_address:string = '';
  
  login_subscription: Subscription;

  constructor(private authService:AuthService, private router: Router) { }

  async ngOnInit() {
    let address_info:any;
    try{
      address_info = await this.authService.get_address_info().toPromise();
      this.ip_address = address_info.ip;
    }catch(e) {}
  }

  login() {
    if(this.loginForm.valid) {
      this.server_error_message = '';
      this.disable_login = true;

      let formdata = this.loginForm.value;

      formdata.device_type = environment.device_type;
      formdata.device_token = environment.device_token;
      formdata.ip_address = this.ip_address;

      this.login_subscription = this.authService.login(formdata).subscribe(
        (res: LoginResponse) => {
          this.disable_login = false;
          if(res.meta.code === 200) {
            console.log(res);
            res.result.is_whop_user = false;
            localStorage.setItem('data', JSON.stringify(res.result));
            this.authService.logginEvent.emit(true);
            this.router.navigate(['landing']);
          } else {
            this.server_error_message = 'Username/Email/Password is Incorrect.';
          }
        },
        (err) => {
          this.disable_login = false;
          this.server_error_message = 'Username/Email/Password is Incorrect.';
        }
      )

    }

  }

  authWithWhop(): string {
    return `https://whop.com/oauth?client_id=${environment.whopClientId}&redirect_uri=${encodeURIComponent(environment.whopRedirectURI)}`;
  }

  ngOnDestroy() {
    if(this.login_subscription) { this.login_subscription.unsubscribe(); }
  }

}
