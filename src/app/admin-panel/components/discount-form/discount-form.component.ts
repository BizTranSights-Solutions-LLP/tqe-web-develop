import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DiscountService } from '../../services/discount.service';
import { FormGroup, FormControl, FormArray, Validators, AbstractControl } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { MembershipService } from '../../services/membership.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-discount-form',
  templateUrl: './discount-form.component.html',
  styleUrls: ['./discount-form.component.css'],
  providers: [DatePipe]
})
export class DiscountFormComponent implements OnInit, OnDestroy {

  dcForm: FormGroup = new FormGroup({
    discount_codes_id: new FormControl(''),
    code: new FormControl('', []),
    starts_at: new FormControl('', []),
    expires_at: new FormControl('', []),
    // uses: new FormControl(''),
    delete_membership_association: new FormControl([]),
    memberships: new FormArray([])
  });

  memberships: any = [];
  dcMemberships: any = {};
  // membershipsApplied: any = {};

  disableBtn: boolean = false;
  dcLoading: boolean = true;
  membershipLoading: boolean = true;

  successMsg: string = '';
  errorMsg: string = '';
  discountSubscription: Subscription;

  constructor(
    private dcService: DiscountService,
    private route: ActivatedRoute,
    private router: Router,
    private datePipe: DatePipe,
    private membershipService: MembershipService
  ) { }

  dateValidation(ctrl: AbstractControl) {
    let given_date = new Date(ctrl.value);
    let today = new Date();
    today.setHours(0,0,0,0);

    if(given_date < today) {
      return { invalid_date : true};
    }

    return null;
  }

  validateDate(key) {
    let start = this.dcForm.get('starts_at').value;
    let end = this.dcForm.get('expires_at').value;

    if(start && end) {
      start = new Date(start);
      // start.setHours(0,0,0,0);
      end = new Date(end);
      // end.setHours(0,0,0,0);

      // if(start < end) {
      //   console.log('1.1')
      //   this.dcForm.get('starts_at').setErrors({start_invalid: true});
      //   this.dcForm.get('expires_at').setErrors({expires_invalid: true});
      // } else{
      //   this.dcForm.get('starts_at').setErrors({start_invalid: null});
      //   this.dcForm.get('expires_at').setErrors({expires_invalid: null});
      // }
    }
  }

  async ngOnInit() {

    let id = this.route.snapshot.params['id'];

    if(id) {
      try{
        let dc_res: any = await this.dcService.get_dc_detail(id).toPromise();
        this.dcLoading = false;
        if(dc_res.meta.code === 200) {
          let { result } = dc_res;
          let starts_at = result.starts_at.split(' ')[0];
          let expires_at = result.expires_at.split(' ')[0];

          this.dcForm.patchValue({
            discount_codes_id: result.id,
            code: result.code,
            starts_at: this.datePipe.transform(starts_at,'yyyy-MM-dd'),
            expires_at: this.datePipe.transform(expires_at,'yyyy-MM-dd')
          });

          this.memberships = typeof result.memberships !== 'string' ? result.memberships : [];
          // if(this.memberships.length > 0) {
          //   this.memberships.map(m => {
          //     this.dcMemberships[m.membership_id] = m.id;
          //   });
          // }

          // this.memberships = this.memberships.reduce((a,m)=>{
          //   a.push(m.membership_id);
          //   return a;
          // },[]);
        }
      } catch(e) {
        this.dcLoading = false;
        this.is_Authenticate(e);
      }
    } else {
      this.dcLoading = false;
    }

    try{
      let memberships = await this.membershipService.get_membership_listing().toPromise();
      this.membershipLoading = false;
      if(memberships.meta.code === 200) {
        let temp = memberships.result;

        // let membership_ids = temp.reduce((obj, m) => {
        //     if(this.memberships.indexOf(m.id) !== -1) {
        //       obj[m.id] = true;
        //     } else {
        //       obj[m.id] = false;
        //     }
        //   return obj;
        // },{});
        // this.membershipsApplied = membership_ids;
        // this.memberships = temp;

        let memberships_control = this.dcForm.get('memberships') as FormArray;

        temp.map(m => {
          let subscribed_membership = this.memberships.find(d => d.membership_id === m.id);

          let expiration;
          if(m.expiration_date) {
            expiration = m.expiration_date.split(' ')[0];
            expiration = this.datePipe.transform(expiration,'yyyy-MM-dd');
          }

          let recurring = +m.cycle_number !== 0 ? true : false;
          let custom_trial = +m.trial_limit !== 0 ? true : false;

          if(subscribed_membership) {
            recurring = +subscribed_membership.cycle_number !== 0 ? true : false;
            custom_trial = +subscribed_membership.trial_limit !== 0 ? true : false;
          }

          let data = new FormGroup({
            name: new FormControl(m.name),
            initial_payment: new FormControl(subscribed_membership ? subscribed_membership.initial_payment : m.initial_payment),
            billing_amount: new FormControl(subscribed_membership ? subscribed_membership.billing_amount : m.billing_amount),
            cycle_number: new FormControl(subscribed_membership ? subscribed_membership.cycle_number : m.cycle_number),
            cycle_period: new FormControl(subscribed_membership ? subscribed_membership.cycle_period.toLowerCase() : m.cycle_period.toLowerCase()),
            billing_limit: new FormControl(subscribed_membership ? subscribed_membership.billing_limit : m.billing_limit),
            trial_amount: new FormControl(subscribed_membership ? subscribed_membership.trial_amount : m.trial_amount),
            trial_limit: new FormControl(subscribed_membership ? subscribed_membership.trial_limit : m.trial_limit),
            expiration_number: new FormControl(subscribed_membership ? subscribed_membership.expiration_number : m.expiration_number),
            expiration_period: new FormControl(subscribed_membership ? subscribed_membership.expiration_period.toLowerCase() : m.expiration_period.toLowerCase()),
            expiration_date: new FormControl(expiration ? expiration : '', this.dateValidation),
            allow_signups: new FormControl(m.allow_signups),
            membership_id: new FormControl(m.id),
            enabled: new FormControl(subscribed_membership ? true : false),
            membership_discount_code_id: new FormControl(subscribed_membership ? subscribed_membership.id : 0),
            recurring: new FormControl(recurring),
            custom_trial: new FormControl(custom_trial),
            membership_expires: new FormControl(expiration ? true : (m.expiration_number !== 0 ? true : false)),
            expiration_format: new FormControl(expiration ? true : false),
            id: new FormControl(subscribed_membership ? subscribed_membership.id : 0)
          });
          memberships_control.push(data);
        });
        // console.log(memberships_control);
      }
    } catch(e) {
      this.membershipLoading = false;
      this.is_Authenticate(e);
    }
  }

  // apply(checked, id) {
  //   this.membershipsApplied[id] = checked;
  // }

  createMembership(): FormGroup {
    return new FormGroup({
      initial_payment: new FormControl(),
      billing_amount: new FormControl(),
      cycle_number: new FormControl(),
      cycle_period: new FormControl(),
      billing_limit: new FormControl(),
      trial_amount: new FormControl(),
      trial_limit: new FormControl(),
      expiration_number: new FormControl(),
      expiration_period: new FormControl(),
      allow_signups: new FormControl(),
      membership_id: new FormControl(),
      enabled: new FormControl(false),
      membership_discount_codes_id: new FormControl()
    });
  }

  disableMembership(data) {
    let deleted_control = this.dcForm.get('delete_membership_association') as FormControl;
    if(!data.enabled) {
      if(data.id !== 'null') {
        deleted_control.value.push(data.id);
      }
    }
     else {
      let index = deleted_control.value.indexOf(data.id);
      if(index > -1) {
        deleted_control.value.splice(index, 1);
      }
    }
  }

  onSubmit(form) {
    this.successMsg = '';
    this.errorMsg = '';

    let formData = form;

    formData.memberships = formData.memberships
                          .filter(m => m.enabled)
                          .map(d => {

                            if(d.expiration_format) {
                              delete d.expiration_number;
                              delete d.expiration_period;
                              return d;
                            } else {
                              delete d.expiration_date;
                              return d;
                            }

                          });

    if(formData.memberships.length === 0) {
      this.errorMsg = 'The memberships must have at least 1 item.';
      return;
    }

    this.disableBtn = true;
    // console.log(formData);
    this.discountSubscription = this.dcService.create_update_dc(formData).subscribe(
      (res: any) => {
        this.disableBtn = false;
        if(res.meta.code === 200) {
          this.successMsg = res.meta.message;
          setTimeout(()=>{
            this.router.navigate(['admin/discounts-list']);
          },2000);
        } else {
          this.errorMsg = res.meta.message;
        }
      },(err) => {
        this.disableBtn = false;
        this.errorMsg = err.error.message;
        this.is_Authenticate(err);
      }
    );

  }

  is_Authenticate(error) {
    if(error.status === 401) {
      localStorage.removeItem('data');
      this.router.navigate(['admin-auth/login']);
    }
  }

  ngOnDestroy() {
    if(this.discountSubscription) this.discountSubscription.unsubscribe();
  }

}
