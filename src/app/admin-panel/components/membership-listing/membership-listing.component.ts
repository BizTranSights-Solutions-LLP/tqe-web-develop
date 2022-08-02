import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Subject  } from 'rxjs';
import { Router } from "@angular/router";
import { MembershipService } from '../../services/membership.service';


@Component({
  selector: 'app-membership-listing',
  templateUrl: './membership-listing.component.html',
  styleUrls: ['./membership-listing.component.css']
})
export class MembershipListingComponent implements OnInit, OnDestroy {

  getMembershipListSub: Subscription;  
  deleteMembershipSub: Subscription; 
  dtTrigger = new Subject();
  dtOptions: DataTables.Settings = {};
  memberships = [];
  Loading = false;
  

  constructor(private membershipService: MembershipService, private router: Router) { }

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      responsive: true
    };
    this.getMembershipListSub = this.membershipService.get_membership_listing().subscribe(
      (response) => {
        if(response.result){
          this.memberships = response['result'];
          this.Loading = true;
          // Calling the DT trigger to manually render the table
          this.dtTrigger.next();                    
        } 
      },
      (err) => {
        if(err.status === 401) {
          localStorage.removeItem('data');
          this.router.navigate(['admin-auth/login']);
        }
      }   
      );    
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
    this.getMembershipListSub ? this.getMembershipListSub.unsubscribe(): '';
    this.deleteMembershipSub ? this.deleteMembershipSub.unsubscribe(): '';
  }

  editMembership(membershipId) {
    this.router.navigate(['/admin/membership-form/', membershipId]);    
  }

  deleteMembership(membershipId, index) {

    // console.log(membershipId, index)

    if (!window.confirm('Are you sure you want to delete ?') ) {
      return false;
    }

    let membershipData = {
      membership_id: membershipId
    }   
  
    this.deleteMembershipSub = this.membershipService.delete_membership(membershipData).subscribe( 
      (response) => {

        if (response.meta.code === 200) {

          console.log('resp',response);
          var memberships = [...this.memberships] ;
          memberships.splice(index, 1);
          this.memberships = memberships;
        }
        
      },
      (error) => console.log('error',error) 
      ); 
  }



}
 