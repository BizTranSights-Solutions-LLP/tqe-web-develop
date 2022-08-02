import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray, AbstractControl } from '@angular/forms';
import { Router, Route, ActivatedRoute } from '@angular/router';
import { UsersService } from '../../services/users.service';
import { MembershipService } from '../../services/membership.service';
import { DatePipe } from '@angular/common'
import { Subscription } from 'rxjs';
import { EditorConfigurations } from '../../config';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css'],
  providers: [DatePipe]
})
export class UserFormComponent implements OnInit, OnDestroy {

  userForm: FormGroup = new FormGroup({
    user_id: new FormControl(''),
    first_name: new FormControl('', Validators.required),
    last_name: new FormControl('', Validators.required),
    username: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, this.emailValidation, Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/)]),
    password: new FormControl('', [Validators.required,Validators.minLength(6)]),
    role_ids: new FormControl([], Validators.required),
    twitter_account: new FormControl(''),
    paypal_email: new FormControl(''),
    discount_code: new FormArray([new FormControl('')]),
    delete_memberships: new FormArray([]),
    photo: new FormControl(null),
    file_path: new FormControl(''),
    user_memberships: new FormArray([]),
    biographical_info: new FormControl('')
  });

  editorConfig: object = EditorConfigurations;
  roles: Array<Object> = [
    // { id: 1, name: 'Administrator' },
    // { id: 3, name: 'Subscriber' },
    // { id: 4, name: 'Affiliate' }
  ]

  memberships: Array<Object> = [];
  userMemberships: Array<Object> = [];

  loader: boolean = false;
  update: boolean = false;
  disableBtn: boolean = false;

  errorMsg: string = '';
  successMsg: string = '';
  userSubscription: Subscription;

  emailValidation(control: AbstractControl) {
    if (control.value && control.value.match(/[\'\["!*#$%&+^,:;?|\]`~{=}_<> \\\-/\(\)]/g)) {
      return { special_char_found : true }
    }
    return null;
  }
  
  constructor(
    private route: ActivatedRoute,
    private userService: UsersService,
    private membershipService: MembershipService,
    private datePipe:DatePipe,
    private router: Router
    ) { }

  async ngOnInit() {
    let id = this.route.snapshot.params['id'];
    
    if(id) {
      this.update = true;
      try{
        this.loader = true;
        let response: any = await this.userService.get_user_detail(+id).toPromise();
        this.loader = false;

        if(response.meta.code === 200) {

          let { result } = response;
          // console.log(result);

          this.userForm.get('password').setValidators([]);
          this.userForm.get('password').updateValueAndValidity();

          this.userForm.patchValue(result);
          this.userForm.patchValue({user_id: +id, file_path: result.photo});

          if(result.affiliate_details) {
            this.userForm.patchValue({
              twitter_account: result.affiliate_details.twitter_account,
              paypal_email: result.affiliate_details.paypal_email
            });

            let discount_code = result.affiliate_details.discount_code[0];
            let dc_control = this.userForm.get('discount_code') as FormArray;
            let index = 0;
            for(let code of discount_code) {
              if(index === 0) {
                dc_control.get('0').setValue(code);
              } else {
                dc_control.push(new FormControl(code));
              }
              index++;
            }
          }

          if(result.user_roles && result.user_roles.length > 0) {
            this.userForm.controls.role_ids.setValue(result.user_roles);

            if(result.user_roles.indexOf(4) !== -1) {
              this.userForm.get('paypal_email').setValidators([Validators.required, Validators.email]);
              this.userForm.get('paypal_email').updateValueAndValidity();
              this.userForm.get('twitter_account').setValidators([Validators.required]);
              this.userForm.get('twitter_account').updateValueAndValidity();
              let dc_control = this.userForm.get('discount_code') as FormArray;
              dc_control.get('0').setValidators([Validators.required]);
              dc_control.get('0').updateValueAndValidity();
            }
          }

          if(result.memberships_users && result.memberships_users.length > 0) {
            this.userMemberships = result.memberships_users;
            let memberships = result.memberships_users;
            let membership_control = this.userForm.get('user_memberships') as FormArray;

            memberships.map(d => {
              let data : FormGroup = new FormGroup({
                id: new FormControl(d.id),
                membership_id: new FormControl(d.membership_id),
                expiration: new FormControl(d.end_date ? 1 : 0),
                end_date: new FormControl(this.datePipe.transform(d.end_date,'yyyy-MM-dd'))
              });
              membership_control.push(data);
            });
          }
        }
      } catch(e) { 
        this.loader = false;
        this.is_Authenticate(e); 
      }
    }

    try{
      let roles: any = await this.userService.get_user_roles().toPromise();
      if(roles.meta.code === 200) {
        this.roles = roles.result;
      }
    }catch(e) {
      this.is_Authenticate(e);
    }

    try{
      let memberships = await this.membershipService.get_membership_listing().toPromise();
      
      if(memberships.meta.code === 200) {
        this.memberships = memberships.result.reduce((array,data) => {array.push({id: data.id, name: data.name}); return array;} ,[]);
      }
    } catch(e) {
      this.is_Authenticate(e);
    }

  }

  updatePaypalValidators(remove: number = 0) {
    setTimeout(()=>{
      let roles = this.userForm.get('role_ids').value;
      let paypal_control = this.userForm.get('paypal_email');
      let twitter_control = this.userForm.get('twitter_account');
      let dc_control = this.userForm.get('discount_code') as FormArray;
      if(remove === 1) {
        if(roles.indexOf(4) === -1) {
          paypal_control.setValidators([]);
          paypal_control.updateValueAndValidity();
          twitter_control.setValidators([]);
          twitter_control.updateValueAndValidity();
          dc_control.get('0').setValidators([]);
          dc_control.get('0').updateValueAndValidity();
        }
      } else {
        if(roles.indexOf(4) !== -1) {
          paypal_control.setValidators([Validators.required, Validators.email]);
          paypal_control.updateValueAndValidity();
          paypal_control.markAsUntouched();
          twitter_control.setValidators([Validators.required]);
          twitter_control.updateValueAndValidity();
          twitter_control.markAsUntouched();
          dc_control.get('0').setValidators([Validators.required]);
          dc_control.get('0').updateValueAndValidity();
          dc_control.get('0').markAsUntouched();
        }
      }
    },1);
    
  }

  createMembership(): FormGroup {
    return new FormGroup({
      id: new FormControl(0),
      membership_id: new FormControl(''),
      expiration: new FormControl(0),
      end_date: new FormControl('')
    });
  }

  removeMembership(index) {
    let memberships_control = this.userForm.get('user_memberships') as FormArray;
    let deleted_memberships_control = this.userForm.get('delete_memberships') as FormArray;
    if(memberships_control.value[index].id) {
      deleted_memberships_control.push(new FormControl(memberships_control.value[index].id));
    }
    memberships_control.removeAt(index);
  }

  addMoreMemberships() {
    let memberships_control = this.userForm.get('user_memberships') as FormArray;
    memberships_control.push(this.createMembership());
  }

  addDiscountCode() {
    let discount_code_control = this.userForm.get('discount_code') as FormArray;
    discount_code_control.push(new FormControl());
  }

  removeDiscountCode(index) {
    let discount_code_control = this.userForm.get('discount_code') as FormArray;
    discount_code_control.removeAt(index);
  }

  onFileChange(event) {
    let file = event.target.files[0];
    let is_image = file.type.includes('image');
    if(is_image) {
      this.userForm.get('photo').setValue(file);
    }
  }
  
  onSubmit() {
    let form = this.userForm.value;
    
    if(!this.userForm.valid) {
      let controls = Object.keys(this.userForm.controls);
      for(let k of controls) {
        if(k !== 'discount_code') {
          this.userForm.get(k).markAsTouched();
        } else {
          let discount_code_control = this.userForm.get(k) as FormArray;
          discount_code_control.get('0').markAsTouched();
        }
      }
      this.errorMsg = 'Fill all highlighted fields to continue.';
      return;
    }

    if('discount_code' in form && form.discount_code.length > 0) {
      form['discount_code'] = form.discount_code.reduce((array,dc) => {
        if(typeof dc === 'string') {
          array.push(dc);
        }
        return array;
      },[])
    }

    if(form.user_memberships.length > 0) {
      form['user_memberships'] = form.user_memberships.map(d => {
        if(!+d.expiration) {
          d['end_date'] = '';
          return d;
        }
        return d;
      });
    }

    if(this.update) {
      delete form['username'];
      delete form['email'];
    }

    if(form.role_ids && form.role_ids.length > 0 && form.role_ids.indexOf(4) === -1) {
      delete form['paypal_email'];
      delete form['twitter_account'];
      delete form['discount_code'];
    }

    if(typeof form.photo === 'string' || form.photo === null) {
      delete form['photo'];
    }

    this.successMsg = '';
    this.errorMsg = '';
    this.disableBtn = true;
    this.userSubscription = this.userService.update_create_user(form).subscribe(
      (res:any) => {
        this.disableBtn = false;
        // console.log(res);
        if(res.meta.code === 200) {
          this.successMsg = res.meta.message;

          setTimeout(()=>{
            this.router.navigate(['admin/users-list']);
          },2000);
        } else {
          this.errorMsg = res.meta.message;
        }
      },(err) => {
        // console.log(err);
        this.disableBtn = false;
        this.errorMsg = err.statusText;
        this.is_Authenticate(err);
      }
    )

  }

  is_Authenticate(error) {
    if(error.status === 401) {
      localStorage.removeItem('data');
      this.router.navigate(['admin-auth/login']);
    }
  }

  ngOnDestroy() {
    if(this.userSubscription) this.userSubscription.unsubscribe();
  }

}
