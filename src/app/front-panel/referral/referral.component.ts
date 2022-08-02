import {Component, OnInit} from '@angular/core';
import {FormGroup, FormBuilder, FormArray, Validators, FormControl, AbstractControl} from '@angular/forms';

import {MessageService} from '../../app.message-service';

import {ReferralService} from '../../services/referral.service';

import {CouponService} from '../../services/coupon.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-referral',
  templateUrl: './referral.component.html',
  styleUrls: ['./referral.component.css']
})

export class ReferralComponent implements OnInit {
  title = 'angular-dynamic-form';
  isSubmitted: boolean = false;
  feeForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private referralService: ReferralService,
    private couponService: CouponService,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.feeForm = this.fb.group({
      u_email: new FormControl(null, [Validators.required, Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/)]),
      feeArray: this.fb.array([])
    });
    this.addFeeItem();
  }


  get feeArray() {
    return <FormArray>this.feeForm.get('feeArray');
  }


  addFeeItem() {
    this.feeArray.push(
      this.fb.group({
        r_email: ['', [Validators.required, this.emailValidation, Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/)]]
      })
    );
  }

  emailValidation(control: AbstractControl) {
    if (control.value && control.value.match(/[\'\["!*#$%&+^,:;?|\]`~{=}_<> \\\-/\(\)]/g)) {
      return {special_char_found: true};
    }
    return null;
  }


  removeFeeItem() {
    this.feeArray.removeAt(this.feeArray.length - 1);
  }

  onSubmit() {
    this.isSubmitted = true;
    this.messageService.sendIsFeeItemsSubmit(this.isSubmitted);
    if (this.feeForm.valid) {
      // create a json request
      let data = {
        user_email: this.feeForm.controls.u_email.value,
        referral_emails: this.feeForm.controls.feeArray.value
      };


      // save referral list
      this.referralService.save_referral(data).subscribe(
        (res: any) => {
          // send emails
          this.referralService.send_referral(data).subscribe(
            (data: any) => {
            },
            error => {
              console.log(error);
            }
          );
          alert('Referral email successfully sent!');
          this.router.navigate(['home']);
        },
        error => {
          console.log(error);
          alert('This referral email already be referred!');
        }
      );


    } else {
      alert('There is an error in your form!');
    }


  }
}

