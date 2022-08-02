import {Component, OnInit, ViewChild, OnDestroy} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap/modal';
import {MembershipService} from '../../services/membership.service';
import {Router} from '@angular/router';
import {AuthService} from '../../services/auth.service';
import {environment} from '../../../environments/environment';
import {Subscription} from 'rxjs';
import {SeoService} from '../../services/seo.service';
import {HelperService} from '../../services/helper.service';
import {HttpClient} from '@angular/common/http';
import {CouponService} from '../../services/coupon.service';

declare const fbq: any;

@Component({
  selector: 'app-membership',
  templateUrl: './membership.component.html',
  styleUrls: ['./membership.component.scss']
})
export class MembershipComponent implements OnInit, OnDestroy {

  @ViewChild('serverErrorPopup') serverErrorPopup: ModalDirective;
  @ViewChild('seasonPassPopup') seasonPassPopup: ModalDirective;
  @ViewChild('autoShownModal') autoShownModal: ModalDirective;
  isModalShown = false;

  seasonPasses: any = {};
  monthlyPasses: any = {};

  freeTry: boolean = false;
  loggedIn: boolean = false;
  loading: boolean = false;
  is_free: boolean = false;

  selectedSeasonPass: string = '';
  selectSeasonFantasyPrice: string = '';
  selectSeasonBettingPrice: string = '';
  selectSeasonAllPrice: string = '';
  serverErrorMessage: string = '';

  seasonPassesSelect = {
    fantasy_plan: false,
    betting_plan: false,
    all_inclusive: false
  };

  disableSeasonSelect = {
    nfl: false,
    nba: false,
    mlb: false,
    ncaab: false,
    ncaaf: false,
    ufc: false,
    nfl_best_ball: false,
    nescar: false
  };

  loginSubscription: Subscription;
  tryItFreeSubscription: Subscription;
  user_name: Subscription;

  constructor(
    private membershipService: MembershipService,
    private router: Router,
    private authService: AuthService,
    private seoService: SeoService,
    private helperService: HelperService,
    private http: HttpClient,
    private couponService: CouponService
  ) {
  }

  async ngOnInit() {
    this.seoService.updateTitle('Membership Levels | The Quant Edge | Sports Betting and DFS Tools');
    this.loggedIn = this.authService.isUserLoggedIn();
    this.loginSubscription = this.authService.logginEvent.subscribe(
      async (res) => {

        if (res) {
          try {
            this.loading = true;
            let data: any = await this.membershipService.get_membership_plans().toPromise();
            this.loading = false;
            this.monthlyPasses = data.result.monthly_passes;
            this.seasonPasses = data.result.season_passes;
            this.membershipService.monthlyPlans = this.monthlyPasses;
            this.membershipService.seasonPlans = this.seasonPasses;
          } catch (e) {
            this.loading = false;
            if (e.status === 201 || e.error.message === 'Unauthenticated.') {
              this.serverErrorMessage = 'You are UnAuthenticated. Please login again!';
              // this.serverErrorPopup.show();
              this.authService.logoutEvent.emit(true);
              setTimeout(() => {
                localStorage.clear();
                sessionStorage.clear();
                this.router.navigate(['']);
              }, 2000);
            }
          }
        }
      },
      this.user_name = this.authService.logginEvent.subscribe(
        (res: any) => {
          if (res) {
            this.loggedIn = this.authService.isUserLoggedIn();
          }
        }
      )
    );

    try {
      this.loading = true;
      let data: any = await this.membershipService.get_membership_plans().toPromise();
      this.loading = false;
      this.monthlyPasses = data.result.monthly_passes;
      this.seasonPasses = data.result.season_passes;
      this.membershipService.monthlyPlans = this.monthlyPasses;
      this.membershipService.seasonPlans = this.seasonPasses;
    } catch (e) {
      this.loading = false;
      if (e.status === 201 || e.error.message === 'Unauthenticated.') {
        this.serverErrorMessage = 'You are UnAuthenticated. Please login again!';
        // this.serverErrorPopup.show();
        this.authService.logoutEvent.emit(true);
        setTimeout(() => {
          localStorage.clear();
          sessionStorage.clear();
          this.router.navigate(['']);
        }, 2000);
      }
    }

    let sports_array = ['nfl', 'nba', 'mlb', 'ncaab', 'ufc', 'nfl_best_ball', 'nescar'];

    sports_array.forEach(
      (s) => {
        if (Object.keys(this.seasonPasses[s]).length <= 1) {
          if (this.seasonPasses[s][Object.keys(this.seasonPasses[s])[0]].is_subscribed) {
            this.disableSeasonSelect[s] = true;
          }
        }
      }
    );

    // script to add facebook pixel
    // start
    let url = this.router.url;
    url = url.substring(1, url.length);

    try {
      let res: any = await this.helperService.get_meta_tags(url).toPromise();

      if (res.meta.code === 200) {
        if (res.result.fb_pixel_scripts.length > 0) {
          let func = new Function(res.result.fb_pixel_scripts[0]);
          if (environment.production) {
            func();
          }
        }

        if (!(Array.isArray(res.result.meta_tags))) {
          let {title, description, keyword} = res.result.meta_tags;
          this.seoService.updateSeoTags(title, description, window.location.href, keyword);
        } else if (Array.isArray(res.result.meta_tags) && res.result.meta_tags.length > 0) {
          let {title, description, keyword} = res.result.meta_tags[0];
          this.seoService.updateSeoTags(title, description, window.location.href, keyword);
        }
      }
    } catch (e) {
    }
    // end

    if (sessionStorage.getItem('is_trial') && sessionStorage.getItem('is_trial') === '1') {
      this.freeTry = true;
      this.is_free = true;
    }

    this.tryItFreeSubscription = this.authService.tryFree.subscribe(
      (res: boolean) => {
        this.freeTry = res;
      }
    );
  }

  selectSeasonPass(name: string) {
    this.selectedSeasonPass = name;

    let new_name = name !== 'NFL Best Ball' ? name : 'nfl_best_ball';
    new_name = new_name.toLowerCase();

    let data = this.seasonPasses[new_name];

    if (Object.keys(data).length > 1) {

      this.selectSeasonFantasyPrice = data.fantasy_plan ? data.fantasy_plan.initial_payment ? data.fantasy_plan.initial_payment : '---' : '';
      this.selectSeasonBettingPrice = data.betting_plan ? data.betting_plan.initial_payment ? data.betting_plan.initial_payment : '---' : '';
      this.selectSeasonAllPrice = data.all_inclusive ? data.all_inclusive.initial_payment ? data.all_inclusive.initial_payment : '---' : '';

      this.seasonPassesSelect.fantasy_plan = data.fantasy_plan ? data.fantasy_plan.is_subscribed ? true : false : false;
      this.seasonPassesSelect.betting_plan = data.betting_plan ? data.betting_plan.is_subscribed ? true : false : false;
      this.seasonPassesSelect.all_inclusive = data.all_inclusive ? data.all_inclusive.is_subscribed ? true : false : false;

      this.seasonPassPopup.show();
    } else {
      let plan_name = Object.keys(data)[0];
      this.selectedPlan('season', plan_name);
    }
  }

  selectedPlan(type: string, plan_name: string) {
    let new_name = this.selectedSeasonPass !== 'NFL Best Ball' ? this.selectedSeasonPass : 'nfl_best_ball';
    new_name = new_name.toLowerCase();
    if (type === 'month') {
      this.membershipService.selectedMembershipPlan = this.monthlyPasses.all_sports[plan_name];
    } else if (type === 'season') {
      this.membershipService.selectedMembershipPlan = this.seasonPasses[new_name][plan_name];
    }

    localStorage.setItem('selected-plan', JSON.stringify(this.membershipService.selectedMembershipPlan));

    let redirect_url = this.authService.isUserLoggedIn() ? 'billing-information' : 'create-account';
    if (this.router.url.includes('try-it-free')) {
      redirect_url = 'try-it-free/' + redirect_url;
    }

    this.router.navigate([redirect_url]);


    // this.membershipService.fake_subscribe_membership().subscribe(
    //   (res: any) => {
    //     alert("Fake Subscribe successfully!");
    //   }
    // )


  }

  ngOnDestroy() {
    if (this.loginSubscription) {
      this.loginSubscription.unsubscribe();
    }
    if (this.tryItFreeSubscription) {
      this.tryItFreeSubscription.unsubscribe();
    }
    if (this.user_name) {
      this.user_name.unsubscribe();
    }
  }

  showModal(): void {
    this.isModalShown = true;
  }

  hideModal(): void {
    this.autoShownModal.hide();
  }

  onHidden(): void {
    this.isModalShown = false;
  }
}
