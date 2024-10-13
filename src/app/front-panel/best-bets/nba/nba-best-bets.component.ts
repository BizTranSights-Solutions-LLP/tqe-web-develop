import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { BestBetsService } from '../best-bets.service';
import { DataService } from '../../../services/data.service';
import { AuthService } from '../../../services/auth.service';
import * as moment from 'moment';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'tqe-nba-best-bets',
  templateUrl: './nba-best-bets.component.html',
  styleUrls: ['./nba-best-bets.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})

export class NbaBestBetsComponent implements OnInit {

  isMobile: boolean = false;
  game_logo: string = `../../../../assets/images/nba/nba_logo.png`;
  game_background_img: string = `../../../../assets/images/picks/NBA_Picks_bg.png`;
  game_background_mobile_img: string = `../../../../assets/images/picks/NBA_Picks_bg.png`;

  constructor(
    private authService: AuthService,
    private dataService: DataService,
    private breakpointObserver: BreakpointObserver,
    private plumber: BestBetsService,
  ) { }

  games: any[] = [];
  games_by_day: {};
  loading = true;
  isAuthorized = false;

  ngOnInit() {
    this.breakpointObserver.observe([Breakpoints.Handset]).subscribe(result => {
      this.isMobile = result.matches;
    });
    this.authorizeUser();
    this.getData();
  }

  // === PUBLIC METHODS ====================================================

  public keys(dict: any) {
    return Object.keys(dict);
  }

  // TQE Pick
  public isTQEP(game: any, team: string, stat: string): boolean {
    if (this.isAuthorized) {
      if (stat === 'Money Line') {
        const improb = game[`${team}_improb`];
        if (game.ml_pick === team && game.mpick_prob > improb && game.mpick_prob * 100 < 60.0) {
          return true;
        }
      }
      else if (stat === 'Spread Line') {
        if (game.sp_pick === team && game.spick_prob * 100 < 60.0) {
          return true;
        }
      }
      else if (stat === 'Total Line') {
        if (game.ou_pick === team && game.tpick_prob * 100 < 60) {
          return true;
        }
      }
    }
    return false;
  }

  // TQE High Confidence Pick
  public isTQEHCP(game: any, team: string, stat: string): boolean {
    if (this.isAuthorized) {
      if (stat === 'Money Line') {
        const improb = game[`${team}_improb`];
        if (game.ml_pick === team && game.mpick_prob > improb && game.mpick_prob * 100 >= 60.0) {
          return true;
        }
      }
      else if (stat === 'Spread Line') {
        if (game.sp_pick === team && game.spick_prob * 100 >= 60.0) {
          return true;
        }
      }
      else if (stat === 'Total Line') {
        if (game.ou_pick === team && game.tpick_prob * 100 >= 60) {
          return true;
        }
      }
      return false;
    }
  }

  public redirectToWhop(subscriptionType) {
    this.authService.redirectToWhop(subscriptionType);
  }

  // === PRIVATE METHODS ===================================================

  protected authorizeUser() {
    let isLoggedIn: any = this.authService.isUserLoggedIn();
    let tool: string = 'nba-dk-optimizer';

    this.dataService.get_tool(tool).subscribe(
      (res: any) => {
        if (res.result.membership_plan === '') {
          this.isAuthorized = (res.meta.code === 200);
        }
      },
      (err) => {
        this.isAuthorized = false;
      }
    );
  }

  private processGames =  win => {
    this.loading = true;
    for (const i in win) {
      this.games.push(win[i]);
    }
    this.games.forEach(g => {
      g.local_start_date = moment(g.schedule).format('MMM D, YYYY');
      g.local_start_time = moment(g.schedule).format('hh:mm A');
      g.started = moment(g.schedule).isSame(moment(), 'day') && moment(g.schedule).isBefore(moment());
      g.ml_pick = 'moneyline_pick' in g ? g.moneyline_pick : '';
      g.sp_pick = 'spread_pick' in g ? g.spread_pick : '';
      g.ou_pick = 'total_pick' in g ? g.total_pick : '';
      g.home_team_logo = `../../../../assets/images/logos/nba/${g.home_team_abbr}.png`;
      g.away_team_logo = `../../../../assets/images/logos/nba/${g.away_team_abbr}.png`;
      g.day = moment(g.EST_schedule).format('dddd, MMMM Do, YYYY');
      if (g.day !== 'Invalid date') (this.games_by_day[g.day] = this.games_by_day[g.day] || []).push(g);
      g.mpick_prob = g.m_prob;
      g.spick_prob = g.s_prob;
      g.tpick_prob = g.t_prob;
    });
    this.loading = false;
  };

  private getData() {
    this.games = [];
    this.games_by_day = {};
    if (localStorage.getItem('data')) {
      this.plumber.getNbaTable().subscribe(
        this.processGames
      );
    } else {
      this.plumber.getNbaTablePublic().subscribe(
        this.processGames
      );
    }
  }
}
