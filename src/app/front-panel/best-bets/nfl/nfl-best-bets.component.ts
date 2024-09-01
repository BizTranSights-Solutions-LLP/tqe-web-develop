import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { BestBetsService } from '../best-bets.service';
import { DataService } from '../../../services/data.service';
import { AuthService } from '../../../services/auth.service';
import * as moment from 'moment';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'tqe-nfl-best-bets',
  templateUrl: './nfl-best-bets.component.html',
  styleUrls: ['./nfl-best-bets.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})

export class NflBestBetsComponent implements OnInit {

  isMobile: boolean = false;
  game_logo: string = `../../../../assets/images/nfl/nfl_logo.png`;
  game_background_img: string = `../../../../assets/images/picks/NFL_Picks_bg.png`;
  game_background_mobile_img: string = `../../../../assets/images/picks/NFL_Picks_bg.png`;

  constructor(
    private authService: AuthService,
    private dataService: DataService,
    private breakpointObserver: BreakpointObserver,
    private plumber: BestBetsService,
  ) { }

  games: any[] = [];
  games_by_week: {};
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
      },
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
      g.started = (moment(g.schedule) < moment());
      g.ml_pick = 'moneyline_pick' in g ? g.moneyline_pick : '';
      g.sp_pick = 'spread_pick' in g ? g.spread_pick : '';
      g.ou_pick = 'total_pick' in g ? g.total_pick : '';
      g.home_team_full_name = (g.home_team_first_name + ' ' + g.home_team_last_name).trim();
      g.away_team_full_name = (g.away_team_first_name + ' ' + g.away_team_last_name).trim();
      g.away_team_logo = `../../../../assets/images/logos/nfl/${g.away_team_full_name}.png`;
      g.home_team_logo = `../../../../assets/images/logos/nfl/${g.home_team_full_name}.png`;
      if (g.week !== 'Invalid') (this.games_by_week[g.week] = this.games_by_week[g.week] || []).push(g);
    });
    this.loading = false;
  };

  private getData() {
    this.games = [];
    this.games_by_week = {};
    if (localStorage.getItem('data')) {
      this.plumber.getNflTable().subscribe(
        this.processGames
      );
    } else {
      this.plumber.getNflTablePublic().subscribe(
        this.processGames
      );
    }
  }
}
