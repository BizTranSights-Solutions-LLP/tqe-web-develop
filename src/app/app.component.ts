import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router, NavigationStart, NavigationEnd, ResolveEnd} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'TQE';

  constructor(private authService: AuthService, private router: Router) {
    router.events.subscribe(
      (res:any) => {

        // I hate this -EH
        if ((res instanceof NavigationEnd) && (res.url.match(/nba-(dk|fd)-optimizer/))) {
          document.body.style.overflow = "hidden";
        } else if ((res instanceof NavigationEnd) && !(res.url.match(/nba-(dk|fd)-optimizer/))) {
          document.body.style.overflow = "auto";
        }

        if((res instanceof NavigationStart) && (res.url === "/login" || res.url === "/register" || res.url === "/" || res.url === '/create-account')) {

          if (this.authService.isUserLoggedIn()) {
            this.router.navigate(['landing']);
          }
        }
        if((res instanceof NavigationStart) && res.url !== "/login" && res.url !== "/register" && res.url !== "/") {
          if(!this.authService.isUserLoggedIn()) {
            this.authService.logoutEvent.emit(true);
          }else {
            this.authService.logginEvent.emit(true);
          }
        }
      }
    )
  }
  ngOnInit() {
    this.router.events.subscribe((evt:any) => {
        if ((evt instanceof NavigationEnd)) {
          let sports = ['/','/nba','/nfl','/betting','/cbb','/ufc','/mlb'];
          if(!(evt.url && evt.url.includes('landing') || sports.indexOf(evt.url) !== -1)) {
            window.scrollTo(0, 0)
          }
            return;
        }
        if ((evt instanceof ResolveEnd)) {
          let campaign_referral = localStorage.getItem("campaign_referral");
          let tx_id             = localStorage.getItem("tx_id");
          let cr_token_exists   = evt.state.root.queryParams.hasOwnProperty("r");

          if (cr_token_exists) {
            campaign_referral = evt.state.root.queryParams.r;
            localStorage.setItem("campaign_referral", campaign_referral);
            if (evt.state.root.queryParams.hasOwnProperty("click_id")) {
              tx_id = evt.state.root.queryParams.transaction_id;
              localStorage.setItem("tx_id", tx_id);
            }
          } else {
            if (campaign_referral === null) {
              localStorage.setItem("campaign_referral", "web_organic");
            }
          }
        }
    });
  }
}
