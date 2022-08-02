import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-forget-password',
    templateUrl: './forget-password.component.html',
    styleUrls: ['./forget-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
    forgotForm = new FormGroup({
        email: new FormControl(null, [Validators.required, Validators.email])
    });

    email: string = '';
    hasLocalErrors: boolean = false;
    hasServerErrors:boolean = false ;

    resetSuccess: boolean = false;
    disable_forgot: boolean;
    forgot_pass_error: string;
    overLay: boolean;

    constructor(private location: Location, private authService: AuthService, private router: Router) { }

    ngOnInit() {
    }

    async forgotPassword() {
        console.log("this called forgotPassword() function")
        if(this.forgotForm.valid) {
          let email = 'rpfm-' + this.forgotForm.value.email
          this.disable_forgot = true;
          this.forgot_pass_error = '';
          
    
          let response: any;
    
          try{
            response = await this.authService.forgot_password(this.forgotForm.value).toPromise();
          }catch(e) {
            this.hasLocalErrors = true;
            this.forgot_pass_error = e.error.message;
          }
    
          if(response.meta.code === 200) {
            this.disable_forgot = false;
            this.forgotForm.reset();
            sessionStorage.setItem('rpfm',email);
            $('.login-form-dropdown').click();
            this.router.navigate(['reset-password']);
    
            this.overLay = false;
    
          } else {
            this.disable_forgot = false;
            this.forgot_pass_error = response.meta.message;
          }
        }
      }

}
