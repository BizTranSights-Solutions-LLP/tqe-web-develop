import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-site-layout',
  templateUrl: './site-layout.component.html',
  styleUrls: ['./site-layout.component.css']
})
export class SiteLayoutComponent implements OnInit {

  isMobile: boolean = false;
  items: any[] = [];
  private routerSubscription: Subscription;

  picks_items: any[] = [
    {
      "name": "NFL",
      "link": "/tool/best-bets/nfl",
    },
    {
      "name": "NBA",
      "link": "/tool/best-bets/nba",
    },
    {
      "name": "Cricket\n(Coming Soon)",
      // "link": "/tool/best-bets/cricket",
    },
    {
      "name": "MLB",
      "link": "/tool/best-bets/mlb",
    },
    {
      "name": "Soccer",
      "link": "/tool/best-bets/soccer",
    },
    {
      "name": "NCAAB",
      "link": "/tool/best-bets/cb",
    },
    {
      "name": "NCAAF",
      "link": "/tool/best-bets/cf",
    },
    {
      "name": "NHL",
      "link": "/tool/best-bets/nhl",
    },
  ];

  player_impact_tools_items: any[] = [
    {
      "name": "NFL",
      "link": "/tool/nfl-player-impact",
    },
    {
      "name": "NBA",
      "link": "/tool/nba-player-impact",
    },
    {
      "name": "Cricket\n(Coming Soon)",
      // "link": "/tool/cricket-player-impact",
    },
    // {
    //   "name": "Golf",
    //   "link": "/tool/golf-player-impact",
    // },
    // {
    //   "name": "Hockey",
    //   "link": "/tool/nhl-player-impact",
    // },
    // {
    //   "name": "Soccer",
    //   "link": "/tool/soccer-player-impact",
    // },
  ];

  constructor(
    private breakpointObserver: BreakpointObserver,
    private router: Router
  ) { }

  ngOnInit() {

    this.breakpointObserver.observe([Breakpoints.Handset])
      .subscribe(result => {
        this.isMobile = result.matches;
      });

    this.routerSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      const url = event.urlAfterRedirects;
      this.items = this.getNavItemsByUrl(url);
    });

    // Initial load
    this.items = this.getNavItemsByUrl(this.router.url);
  }

  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  getNavItemsByUrl(url: string): any[] {
    if (/tool\/.*-player-impact/.test(url)) {
      return this.player_impact_tools_items;
    } else if (/tool\/best-bets/.test(url)) {
      return this.picks_items;
    }
    return [];
  }

}
