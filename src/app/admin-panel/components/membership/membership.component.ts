import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, FormArray, Validators, AbstractControl } from '@angular/forms';
import { ToolbarService, LinkService, ImageService, HtmlEditorService, TableService } from '@syncfusion/ej2-angular-richtexteditor';
import { MembershipService } from '../../services/membership.service';
import { Subscription } from 'rxjs';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from "@angular/router";


@Component({
  selector: 'app-membership',
  templateUrl: './membership.component.html',
  styleUrls: ['./membership.component.css'],
  providers: [ToolbarService, LinkService, ImageService, HtmlEditorService, TableService, DatePipe]

})

export class MembershipComponent implements OnInit, OnDestroy {

  
  saveMembershipSub: Subscription; 
  findMembershipByIdSub: Subscription; 

  public tools: object = {
    items: [
           'Bold', 'Italic', 'Underline', 'StrikeThrough', '|',
           'FontName', 'FontSize', 'FontColor', 'BackgroundColor', '|',
           'LowerCase', 'UpperCase', '|', 'Undo', 'Redo', '|',
           'Formats', 'Alignments', '|', 'OrderedList', 'UnorderedList', '|',
           'Indent', 'Outdent', '|', 'CreateLink','CreateTable',
           'Image', '|', 'ClearFormat', 'Print', 'SourceCode']
   };
  sportsTags = [];
  membershipForm: FormGroup;
  submitted = false; 

  
  constructor(
    private membershipService: MembershipService,
    private datePipe:DatePipe,
    private route: ActivatedRoute 
     ){
         
      }


  ngOnInit() {  
   var membershipId = this.route.snapshot.paramMap.get("id");
   membershipId ? this.findMembershipById(membershipId): '';    
   this.initializeForm();  

  } 

  ngOnDestroy() {    
    this.saveMembershipSub ?  this.saveMembershipSub.unsubscribe(): '';    
    this.findMembershipByIdSub ? this.findMembershipByIdSub.unsubscribe(): '';
  }

  initializeForm() {

    this.membershipForm = new FormGroup({
      membership_id: new FormControl(''),
      name: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      confirmation_message: new FormControl('', Validators.required),
      initial_payment: new FormControl('', Validators.required),
      billing_amount: new FormControl(''),
      cycle_number: new FormControl('1'),
      cycle_period: new FormControl('month'),
      billing_limit: new FormControl(''),
      trial_amount: new FormControl(''),
      trial_limit: new FormControl(''),
      expiration_number: new FormControl(''),
      expiration_period: new FormControl('day'),
      allow_signups: new FormControl(''),
      expiration_date: new FormControl(''),

     
      recurringSubs: new FormControl(''),
      customTrial: new FormControl(''),    
      membershipExp: new FormControl(''),     
      
     
     
   
    });    

  }  


  onSubmit(membershipData) {
    // Process checkout data here 
    
    this.submitted = true;

    // stop here if form is invalid
    if (this.membershipForm.invalid) {
        return;
    }
    
    
    membershipData.allow_signups = membershipData.allow_signups ? 1: 0;
    membershipData.expiration_date = membershipData.expiration_date ? this.datePipe.transform(membershipData.expiration_date, 'yyyy-MM-dd HH:mm:ss'): '';

    console.log('Your membership has been submitted', membershipData);

     this.saveMembershipSub = this.membershipService.save_membership(membershipData).subscribe( 
      (response) => { 
        console.log('resp',response);
        this.submitted = false;
      },
      (error) => console.log('error',error) 
      ) ; 

   
      
    //  this.membershipForm.reset();

  }

 
   findMembershipById(membershipId) {


      let membershipData = {
        membership_id: membershipId
      }
      
      this.findMembershipByIdSub = this.membershipService.find_membership_by_id(membershipData).subscribe(
        (response) => {

          console.log(response) 
          if(response.meta.code === 200 ){             
            this.setMembershipFormFields(response.result);
            
          }         
          
        },
        (error) => console.log('error',error) 
        ); 
    }


   setMembershipFormFields(data) { 
   
   

    this.membershipForm.setValue({
      membership_id: data.id,
      name: data.name,
      description: data.description,
      confirmation_message: data.confirmation_message,
      initial_payment: data.initial_payment,
      billing_amount: data.billing_amount ? data.billing_amount: '' ,
      cycle_number: data.cycle_number,
      cycle_period: data.cycle_period,
      billing_limit: data.billing_limit ? data.billing_limit: '',
      trial_amount: data.trial_amount ? data.trial_amount: '',
      trial_limit: data.trial_limit ? data.trial_limit: '',
      expiration_number: data.expiration_number ? data.expiration_number: '',
      expiration_period: data.expiration_period,
      expiration_date: data.expiration_date ? new Date(data.expiration_date): '',
      allow_signups: data.allow_signups === 1 ? true:false,

      
      recurringSubs: data.billing_amount ? true: false,
      customTrial: data.trial_amount ? true: false,
      membershipExp: data.expiration_number ? true: false,
    })

    

   }

}
 
