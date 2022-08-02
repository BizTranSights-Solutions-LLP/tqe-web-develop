import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, FormArray, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent implements OnInit, OnDestroy {  

  loginForm: FormGroup;
  login_error_message: 'USERNAME & PASSWORD REQUIRED';
  server_error_message: string;
  disable_login: boolean = false;
  login_subscription: Subscription;
  ip_address: any;

  constructor(private authService: AuthService, private router: Router) { }

  async ngOnInit() {
    this.initializeForm();
    let address_info:any;
    try{
      address_info = await this.authService.get_address_info().toPromise();
      this.ip_address = address_info.ip;
    }catch(e) {}
  }

  initializeForm() {

    this.loginForm = new FormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
    });

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
          (res: any) => {
            this.disable_login = false;
            if(res.meta.code === 200) {
              let roles = res.result.roles_status;

              if((Object.keys(roles).length > 0) && (roles.is_admin || roles.is_editor || roles.is_author)) {
                console.log('123');
                localStorage.setItem('data', JSON.stringify(res.result));
                this.router.navigate(['admin']);
              } else {
                this.server_error_message = "Provided credentail doesn't belongs to an Admin!";
              }
            } else {
              this.server_error_message = res.meta.message;
            }
          },
          (err) => {
            this.disable_login = false;
            this.server_error_message = err.message;
          }
        );
    }
  }

  ngOnDestroy() {
    if(this.login_subscription) 
      this.login_subscription.unsubscribe();
  }


}
 