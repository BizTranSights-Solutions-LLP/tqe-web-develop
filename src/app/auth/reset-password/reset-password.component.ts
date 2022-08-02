import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  email: string = '';
  localErrors: string = '';
  serverErrors: string = '';

  resetSuccess: boolean = false;

  resetForm = new FormGroup({
    code: new FormControl(null, Validators.required),
    new_password: new FormControl(null, [Validators.required, Validators.minLength(6)]),
    confirm_password: new FormControl(null, [Validators.required, Validators.minLength(6)])
  });

  constructor(private location: Location,private authService: AuthService, private router: Router) { }

  ngOnInit() {
    let email_data = sessionStorage.getItem('rpfm');
    if(email_data) {
      this.email = email_data.split('-')[1];
    } else {
      this.location.back();
    }
  }

  async resetPassword() {
    if(this.resetForm.valid) {

      this.serverErrors = '';
      this.localErrors = '';

      let form = JSON.parse(JSON.stringify(this.resetForm.value));
      
      if(form.new_password === form.confirm_password) {
        let body = form;
        body.code = +body.code
        body.email = this.email;
        delete body.confirm_password;
        let response:any 
        
        try{
          response = await this.authService.reset_password(body).toPromise();
        }catch(e) {
          if(e.status === 201 || e.error.message === 'Unauthenticated.') {
            this.serverErrors = 'You are UnAuthenticated. Please login again!';
  
            setTimeout(()=>{
              this.authService.logoutEvent.emit(true);
              localStorage.clear();
              sessionStorage.clear();
              this.router.navigate(['']);
            },2000);
          }
        }

        if(response.meta.code === 200) {
          sessionStorage.removeItem('rpfm');
          this.resetSuccess = true;
        } else {
          this.serverErrors = response.meta.message;
        }
      } else {
        this.localErrors = `Both password fields doesn't match`;
      }
    }
  }

}
