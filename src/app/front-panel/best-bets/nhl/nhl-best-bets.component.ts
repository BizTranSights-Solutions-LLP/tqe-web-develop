import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { BestBetsService } from '../best-bets.service';
import { DataService } from '../../../services/data.service';
import { AuthService } from '../../../services/auth.service';
import * as moment from 'moment';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'tqe-nhl-best-bets',
  templateUrl: './nhl-best-bets.component.html',
  styleUrls: ['./nhl-best-bets.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})

export class NhlBestBetsComponent implements OnInit {

  isMobile: boolean = false;
  game_logo: string = `../../../../assets/images/home_page/nhl_logo.svg`;
  game_background_img: string = `../../../../assets/images/picks/NHL_Picks_bg.png`;
  game_background_mobile_img: string = `../../../../assets/images/picks/NHL_Picks_bg.png`;
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
      g.local_start_date = moment(g.EST_schedule).format('MMM D, YYYY');
      g.local_start_time = moment(g.EST_schedule).format('hh:mm A');
      g.started = (moment(g.EST_schedule) < moment());
      g.ml_pick = 'm_tqe_pick' in g ? g.m_tqe_pick : '';
      g.sp_pick = 's_tqe_pick' in g ? g.s_tqe_pick : '';
      g.ou_pick = 't_tqe_pick' in g ? g.t_tqe_pick : '';
      g.day = moment(g.EST_schedule).format('dddd, MMMM Do, YYYY');
      if (g.day !== 'Invalid date') (this.games_by_day[g.day] = this.games_by_day[g.day] || []).push(g);
      g.away_improb = g.m_a_improb;
      g.home_improb = g.m_h_improb;
      g.away_money = g.m_a_odds;
      g.home_money = g.m_h_odds;
      g.mpick_prob = g.m_a_prob;
      g.away_spread = g.s_a_line;
      g.home_spread = g.s_h_line;
      g.away_odds = g.s_a_odds;
      g.home_odds = g.s_h_odds;
      g.spick_prob = g.s_a_prob;
      g.OU_line = g.t_line;
      g.over_odds = g.t_o_odds;
      g.under_odds = g.t_u_odds;
      g.tpick_prob = g.t_o_prob;
    });
    this.loading = false;
  };

  private getData() {
    this.games = [];
    this.games_by_day = {};
    if (localStorage.getItem('data')) {
      this.plumber.getnhlTable().subscribe(
        this.processGames
      );
    } else {
      this.plumber.getnhlTablePublic().subscribe(
        this.processGames
      );
    }
  }
}
