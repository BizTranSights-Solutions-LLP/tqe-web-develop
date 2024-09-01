import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { BestBetsService } from '../best-bets.service';
import { DataService } from '../../../services/data.service';
import { AuthService } from '../../../services/auth.service';
import * as moment from 'moment';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'tqe-soccer-best-bets',
  templateUrl: './soccer-best-bets.component.html',
  styleUrls: ['./soccer-best-bets.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})

export class SoccerBestBetsComponent implements OnInit {

  isMobile: boolean = false;
  game_logo: string = `../../../../assets/images/home_page/soccer_logo.svg`;
  game_background_img: string = `../../../../assets/images/picks/Soccer_Picks_bg.png`;
  game_background_mobile_img: string = `../../../../assets/images/picks/Soccer_Picks_bg.png`;
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
  selected_league: string;
  all_leagues: string[] = [
    "EPL",
    "LA-LIGA",
    "SerieA",
    "Bundesliga",
    "Ligue1",
    // "Super-Lig",
    // "UEFA-Champ",
    "MLS"
  ];

  ngOnInit() {
    this.authorizeUser();
    this.breakpointObserver.observe([Breakpoints.Handset]).subscribe(result => {
      this.isMobile = result.matches;
    });
    this.selected_league = this.all_leagues[0];
    this.getData();
  }

  // === PUBLIC METHODS ====================================================


  public keys(dict: any) {
    return Object.keys(dict);
  }

  // TQE Pick
  public isTQEP(game: any, team: string): boolean {
    if (this.isAuthorized && game[`ml_pick_${team}`] && game[`m_${team}_prob`] > game[`m_${team}_improb`] && game[`m_${team}_prob`] * 100 < 60.0) {
      return true;
    }
    return false;
  }

  // TQE High Confidence Pick
  public isTQEHCP(game: any, team: string): boolean {
    if (this.isAuthorized && game[`ml_pick_${team}`] && game[`m_${team}_prob`] > game[`m_${team}_improb`] && game[`m_${team}_prob`] * 100 >= 60.0) {
      return true;
    }
    return false;
  }


  public decToAmOdds(d: number): string {
    let res: number;
    if (d > 2) {
      res = 100 * (d - 1)
      return '+' + res.toFixed();
    }
    else {
      res = -100 / (d - 1);
      return '' + res.toFixed();
    }
  }

  onClickLeague(league) {
    if (this.all_leagues.includes(league)) {
      this.selected_league = league;
      this.getData();
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

  private processGames = win => {
    this.loading = true;
    for (const i in win) {
      this.games.push(win[i]);
    }
    this.games.forEach(g => {
      g.local_start_date = moment(g.EST_schedule).format('MMM D, YYYY');
      g.local_start_time = moment(g.EST_schedule).format('hh:mm A');
      g.started = (moment(g.EST_schedule) < moment());
      g.ml_pick_h = (g['m_tqe_pick'] == "home");
      g.ml_pick_t = (g['m_tqe_pick'] == "tie");
      g.ml_pick_a = (g['m_tqe_pick'] == "away");
      g.day = moment(g.EST_schedule).format('dddd, MMMM Do, YYYY');
      if (g.day !== 'Invalid date') if (g.day !== 'Invalid date') (this.games_by_day[g.day] = this.games_by_day[g.day] || []).push(g);
    });
    this.loading = false;
  };

  private getData() {
    this.games = [];
    this.games_by_day = {};
    if (localStorage.getItem('data')) {
      this.plumber.getSoccerTable(this.selected_league).subscribe(
        this.processGames
      );
    } else {
      this.plumber.getSoccerTablePublic(this.selected_league).subscribe(
        this.processGames
      );
    }
  }
}
