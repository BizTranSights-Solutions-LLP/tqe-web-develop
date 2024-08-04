import {Component, OnInit, ViewChild} from '@angular/core';
import {DataService} from '../../services/data.service';
import {ModalDirective} from 'ngx-bootstrap/modal';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {MembershipService} from '../../services/membership.service';
import {SeoService} from '../../services/seo.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';

class ImageSnippet {
  pending = false;
  status = 'init';

  constructor(public src: string, public file: File) {
  }
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  @ViewChild('tourGuide') tourGuide: ModalDirective;

  userData: any = [];

  loader = true;
  user_subscriptionLoader = false;
  profile_picture_holder = false;
  upload_picture_modal = false;
  uploading = false;

  serverErrors = '';
  selectedMemberShipId: number;
  selectedMemberShipName = '';

  user_subscription: Subscription;


  unsubscribe_reasons = [
    "Planning to re-subscribe next season",
    "Subscription cost is too high",
    "Dissatisfied with the product",
    "Looking for additional features",
    "Found a better alternative",
    "Technical issues with the app",
    "Customer support was unhelpful",
    "Content not relevant to my needs",
    "Not using the service enough",
    "Other reasons"
]
  unsubscribe_reason = '';
  other = '';


  // tslint:disable-next-line:max-line-length
  constructor(private dataService: DataService, private authService: AuthService, private router: Router, private membershipService: MembershipService, private seoService: SeoService) {
  }


  ngOnInit() {
    this.seoService.updateTitle('My Profile | The Quant Edge | Sports Betting Tools and Optimizers');
    this.user_subscription = this.authService.logginEvent.subscribe(
      res => {
        if (res) {
          this.get_user_data();
        }
      }
    );
    this.get_user_data();
  }


  showModal(id: number, name: string) {
    this.selectedMemberShipId = id;
    this.selectedMemberShipName = name;
    this.tourGuide.show();
  }

  hideModal() {
    this.tourGuide.hide();
  }

  unsubscribe(id: number) {
    const form = {
      reason: this.unsubscribe_reason,
      detail: this.other
    };
    console.log(form);


    // cancel membership
    this.membershipService.set_cancellation_reasons(form).subscribe(
      (res: any) => {
        // console.log("reason!!!", res.meta.code);
      }
    );

    this.user_subscriptionLoader = true;
    this.membershipService.unsubscribeMembershipPackage(id).subscribe(
      (res: any) => {
        if (res.meta.code === 200) {
          const index = this.userData.memberships_users.findIndex((d: any) => d.id === id);
          if (index > -1) {
            this.userData.memberships_users.splice(index, 1);
            this.tourGuide.hide();
            this.user_subscriptionLoader = false;
          }
        } else if (res.meta.code === 400 || res.meta.message === 'No membership found.') {
          this.tourGuide.hide();
        }
      }
    );
  }

  async get_user_data() {

    let data: any;
    try {
      data = await this.dataService.get_user_information().toPromise();
      this.serverErrors = '';
      this.userData = data.result;
      this.loader = false;
    } catch (e) {
      if (e.status === 401 || e.error.message === 'Unauthenticated.') {
        this.serverErrors = 'You are UnAuthenticated. Please login again!';
        this.loader = false;
        setTimeout(() => {
          this.authService.logoutEvent.emit(true);
          localStorage.clear();
          sessionStorage.clear();
          this.router.navigate(['/']);
        }, 1000);
      }
    }
  }


  // tslint:disable-next-line:use-life-cycle-interface
  ngOnDestroy() {
    if (this.user_subscription) {
      this.user_subscription.unsubscribe();
    }
  }
}
