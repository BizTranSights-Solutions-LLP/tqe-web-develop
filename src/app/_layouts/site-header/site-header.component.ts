import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs';

declare var $: any;
@Component({
  selector: 'site-header',
  templateUrl: './site-header.component.html',
  styleUrls: ['./site-header.component.scss']
})
export class SiteHeaderComponent implements OnInit, OnDestroy {

  loggedIn: boolean = false;
  is_admin: boolean = false;
  is_whop_user: boolean = false;
  Name: string = '';
  user_name: Subscription;

  @ViewChild('navbarNav') navbarNav: ElementRef;
  closeNavbar(): void {
    if (this.navbarNav && this.navbarNav.nativeElement.classList.contains('show')) {
      this.navbarNav.nativeElement.classList.remove('show');
    }
  }

  navigationLinks: any = [
    {
      label: 'Home',
    },
    {
      label: 'Picks',
      subNav: [
        // Hide till future update
        // {label: 'Today\'s Best Bets', loggedInURL: '/tool/best-bets/today', loggedOutURL: '/tool/best-bets/today' },

        { label: 'NFL Picks', loggedInURL: '/tool/best-bets/nfl', loggedOutURL: '/tool/best-bets/nfl' },
        { label: 'NBA Picks', loggedInURL: '/tool/best-bets/nba', loggedOutURL: '/tool/best-bets/nba' },
        // { label: 'Cricket Picks',loggedInURL: '/tool/best-bets/cricket', loggedOutURL: '/tool/best-bets/cricket' },
        { label: 'MLB Picks', loggedInURL: '/tool/best-bets/mlb', loggedOutURL: '/tool/best-bets/mlb' },
        { label: 'Soccer Picks', loggedInURL: '/tool/best-bets/soccer', loggedOutURL: '/tool/best-bets/soccer' },
        { label: 'NCAAB Picks', loggedInURL: '/tool/best-bets/cb', loggedOutURL: '/tool/best-bets/cb' },
        { label: 'NCAAF Picks', loggedInURL: '/tool/best-bets/cf', loggedOutURL: '/tool/best-bets/cf' },
        { label: 'NHL Picks', loggedInURL: '/tool/best-bets/nhl', loggedOutURL: '/tool/best-bets/nhl' },
        //{label: 'Statistical Surveillance', loggedInURL: '/', loggedOutURL: '/'},

        // {label: 'Today\'s NCAA Basketball Picks', loggedInURL: '/tool/best-bets/cb', loggedOutURL: '/tool/best-bets/cb'},
        // {label: 'MLB', loggedInURL: '', loggedOutURL: ''},
        // {label: 'NCAA Football Picks', loggedInURL: '/tool/best-bets/cf', loggedOutURL: '/tool/best-bets/cf' },
        // {label: 'Betting Results', loggedInURL: '/picks-history', loggedOutURL: '/membership-plan' }
      ]
    },

    {
      label: 'Player Impact Tools',
      subNav: [
        // Till the TQE Registration and Login Issues are fixed, we are going to rely on Whop for User Subscriptions.
        // So, changing loggedoutURL to the player impact pages temporarily. Those pages will display 2 options to users
        // Either to login or signup through Whop


        // { label: 'NFL Player Impact', loggedInURL: '/tool/nfl-player-impact', loggedOutURL: '/membership-plan' },
        // { label: 'NBA Player Impact', loggedInURL: '/tool/nba-player-impact', loggedOutURL: '/membership-plan' },
        // { label: 'NCAAF Player Impact', loggedInURL: '/tool/cf-player-impact', loggedOutURL: '/membership-plan' },
        // { label: 'Cricket Player Impact', loggedInURL: '/tool/cricket-player-impact', loggedOutURL: '/membership-plan' },
        // BP Change comment out 2 lines below 202200206
        // {label: 'NFL Demo', loggedInURL: '/nfl-demo', loggedOutURL: '/nfl-demo'},
        // {label: 'NBA Demo', loggedInURL: '/nba-demo', loggedOutURL: '/nba-demo'},



        { label: 'NFL Player Impact', loggedInURL: '/tool/nfl-player-impact', loggedOutURL: '/tool/nfl-player-impact' },
        { label: 'NBA Player Impact', loggedInURL: '/tool/nba-player-impact', loggedOutURL: '/tool/nba-player-impact' },
        { label: 'NCAAF Player Impact', loggedInURL: '/tool/cf-player-impact', loggedOutURL: '/tool/cf-player-impact' },

      ]
    },
    {
      label: 'How TQE Works',
      subNav: [
        { label: 'Find The Player Impact Tool', loggedInURL: '/how-to-find-player-impact-tool', loggedOutURL: '/how-to-find-player-impact-tool' },
        { label: 'Understand the Player Impact Tool Layout', loggedInURL: '/understand-player-impact-tool-layout', loggedOutURL: '/understand-player-impact-tool-layout' },
        { label: 'Changing the Player Performance', loggedInURL: '/use-player-performance', loggedOutURL: '/use-player-performance' },
        { label: 'How The Math Works', loggedInURL: '/how-it-works', loggedOutURL: '/how-it-works' },
       
      ],
    },
    {
      label: 'About Us',
      subNav: [
        { label: 'Meet the Team', loggedInURL: '/meet-the-team', loggedOutURL: '/meet-the-team' },
        { label: 'Betting 101', loggedInURL: '/education-page', loggedOutURL: '/education-page' },
        { label: 'TQE Tools Tutorial', loggedInURL: '/TQE-Tools-Info', loggedOutURL: '/TQE-Tools-Info' }
        /*        {label: 'Chat With Us', loggedInURL: '/chat', loggedOutURL: '/chat'},
                {label: 'Shop TQE', loggedInURL: '/shop-tqe', loggedOutURL: '/shop-tqe'},*/
      ]
    }
  ];

  constructor(private authService: AuthService, private router: Router) {
  }

  async ngOnInit() {

    this.updateUserDetails();
    this.authService.logginEvent.subscribe((res: any) => {
      if (res) {
        this.updateUserDetails();
      }
    });

    this.authService.logoutEvent.subscribe((res: any) => {
      if (res) {
        this.loggedIn = false;
        this.is_admin = false;
        this.is_whop_user = false;
      }
    });
  }

  private updateUserDetails() {
    this.loggedIn = this.authService.isUserLoggedIn();
    let user_data = this.authService.getUserDetail();
    if (user_data) {
      this.Name = user_data.first_name || '';
      if (Object.keys(user_data).length > 0) {
        this.is_admin = user_data.roles_status ?
          (user_data.roles_status.is_admin || user_data.roles_status.is_editor || user_data.roles_status.is_author)
          : false;
        this.is_whop_user = !!user_data.is_whop_user;
      }
    } else {
      this.Name = '';
      this.is_admin = false;
      this.is_whop_user = false;
    }
  }

  logOut() {
    localStorage.removeItem('data');
    this.loggedIn = false;
    this.router.navigate(['']);
    this.authService.logoutEvent.emit(true);
  }

  isDropdownActive(currentNav: any): boolean {
    if (currentNav) {
      const currentUrl = this.router.url;
      if (currentNav.label === "Home") {
        if (currentUrl === "/" || currentUrl === "/landing/all") {
          return true;
        }
        return false;
      }
      else if (currentNav.label === "How TQE Works") {
        if (currentUrl === "/how-it-works") {
          return true;
        }
        return false;
      }
      let urlToBeChecked = "loggedOutURL";
      if (this.loggedIn) {
        urlToBeChecked = "loggedInURL";
      }
      for (let subNav of currentNav["subNav"]) {
        if (subNav[urlToBeChecked] === currentUrl) {
          return true;
        }
      }
    }
    return false;
  }

  ngOnDestroy() {
    if (this.user_name) this.user_name.unsubscribe();
  }

}
