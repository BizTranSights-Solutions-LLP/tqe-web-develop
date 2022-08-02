import { Component, OnInit, ViewChild, ViewEncapsulation, HostListener } from '@angular/core';
import { SeoService } from '../../../services/seo.service';

import { BestBetsService } from '../best-bets.service';
import { DataService } from '../../../services/data.service';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../services/auth.service';
import { Subscription } from 'rxjs';
import { AngularBootstrapToastsService } from 'angular-bootstrap-toasts';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import * as moment from 'moment';
declare var require: any;

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'tqe-nfl-player-impact-export',
  templateUrl: './nfl-player-impact-export.component.html',
  styleUrls: ['./nfl-player-impact.component.scss'],
})

export class NflPlayerExportImpactComponent implements OnInit {
  standings: any[];
  away_team_id: any;
  // player_img_loading: boolean;
  // player_image_xml_info: string;
  // @ViewChild('signupModal') signupModal: ModalDirective;
  constructor(
    private authService: AuthService,
    private dataService: DataService,
    private router: Router,
    private plumber: BestBetsService,
    private toast: AngularBootstrapToastsService
  ) { }

  selected_teams: string = '';
  selected_player_set: any;
  selected_player_away: any;
  selected_player_home: any;
  selected_player_a: any;
  selected_player_a_name: string = '';
  selected_player_h: any;
  selected_player_h_name: string = '';
  selected_match: any;
  // this is for pos_change tool:
  selected_pos_a: any;
  selected_pos_h: any
  selected_player_a_pos: string = '';
  selected_player_h_pos: string = '';
  selected_player_away_all_pos: any;
  selected_player_home_all_pos: any;
  selected_by_pos: any;
  player_value_a: number[] = [50, 50, 50, 50, 50, 50, 50];
  player_value_h: number[] = [50, 50, 50, 50, 50, 50, 50];
  away_player_idx = 0;
  home_player_idx: number = 0;
  s_pred: number;
  t_pred: number;
  s_pick: string;
  t_pick: string;
  m_pick: string;
  sprob: number;
  sER: number;
  tprob: number;
  tER: number;
  mprob: number;
  mER: number;
  matches: any[] = [];
  teams: string[] = [];
  away_team: string = '';
  home_team: string = '';
  games: any[] = [];
  games_today: any[] = [];
  games_this_week: any[] = [];
  auth_loading: boolean = true;
  match_loading: boolean = true;
  player_loading: boolean = true;
  isAuthorized: boolean = false;
  isShowPlayerImpact: boolean = false;
  updateTime: string;
  gameDate: string;
  sortBy: string = 'rating';
  sortDir: any = {
    'rating': true,
    'time': false
  };
  nflWeek: string = "";

  ngOnInit() {
    this.isAuthorized = true;
    this.selected_pos_a ="QB";
    this.selected_pos_h ="QB";
    this.getDataNFL();
  }

  // === PUBLIC METHODS ====================================================

  public stars(n: number): any[] {
    return Array(n);
  }

  public sortByStartTime() {
    this.sortBy = 'time';
    this.games = this.games.sort(function (a, b) {
      return moment(a.Schedule).valueOf() - moment(b.Schedule).valueOf();
    });
    if (this.sortDir[this.sortBy]) {
      this.games.reverse();
    }

    this.sortDir[this.sortBy] = !this.sortDir[this.sortBy];
  }

  // === PRIVATE METHODS ===================================================
  //  When user change position for away team:
  private OnchangePosA(event: any) {
    this.selected_pos_a = event.target.value
    this.playerDataResolver();
  }

  // When user change position for home team:
  private OnchangePosH(event: any) {
    this.selected_pos_h = event.target.value
    this.playerDataResolver();
  }

  private formatTime(time: any) {
    return moment(time).format('MMM D, YY h:mm a');
  }
  private authorizeUser() {
    let isLoggedIn: any = this.authService.isUserLoggedIn();
    let tool: string = "nba-dk-optimizer"

    this.dataService.get_tool(tool).subscribe(
      (res: any) => {
        this.isAuthorized = (res.meta.code === 200);
      },
      (err) => {
        this.isAuthorized = false;
        this.auth_loading = false;
        this.sortByStartTime();
      },
      () => {
        this.auth_loading = false;
        this.getDataNFL();
      }
    );
  }

  private resetData() {
    this.player_value_a = [50, 50, 50, 50, 50, 50, 50];
    this.player_value_h = [50, 50, 50, 50, 50, 50, 50];
    this.away_player_idx = 0;
    this.home_player_idx = 0;
    this.s_pred = this.selected_match.s_pred;
    this.t_pred = this.selected_match.t_pred;
    this.s_pick = (this.selected_match.spread_pick == 'away') ? this.away_team : this.home_team;
    this.t_pick = this.selected_match.total_pick;
    this.m_pick = (this.selected_match.moneyline_pick == 'away') ? this.away_team : this.home_team;
    this.sprob = this.selected_match.spick_prob;
    this.sER = this.selected_match.spick_ER;
    this.tprob = this.selected_match.tpick_prob;
    this.tER = this.selected_match.tpick_ER;
    this.mprob = this.selected_match.mpick_prob;
    this.mER = this.selected_match.mpick_ER;
  }

  // Excute when user changes team
  private onClickTeamSel() {
    this.isShowPlayerImpact = false;
    this.match_loading = true;
    this.selected_match = this.getGame(this.selected_teams);
    this.playerDataResolver();
    this.resetData();
  }

  private onInputChangeA(event: any, player_index: number) {
    this.isShowPlayerImpact = true;
    this.selected_player_away_all_pos.lineup[player_index].perf = event.value;
    this.stPredResolver();
    this.pickResolver();
    this.updateProbER();
  }

  // Excute when user changes home team player's performance
  private onInputChangeH(event: any, player_index: number) {
    this.isShowPlayerImpact = true;
    this.selected_player_home_all_pos.lineup[player_index].perf = event.value;
    this.stPredResolver();
    this.pickResolver();
    this.updateProbER();
  }

  // Calculate s_pred and t_pred
  private stPredResolver() {
    this.player_loading = true;

    this.s_pred = this.selected_match.s_pred;
    this.t_pred = this.selected_match.t_pred;
    for (let i in this.selected_player_away_all_pos.lineup) {
      if (this.selected_player_away_all_pos.lineup[i].perf == 0) {
        let number = +this.selected_player_home_all_pos.lineup[i].pminus;
        this.s_pred -= number;
        this.t_pred -= number;
      }
      else if (this.selected_player_away_all_pos.lineup[i].perf == 100) {
        let number = +this.selected_player_home_all_pos.lineup[i].pplus;
        this.s_pred += number;
        this.t_pred += number;
      }
    }
    for (let i in this.selected_player_home_all_pos.lineup) {
      if (this.selected_player_home_all_pos.lineup[i].perf == 0) {
        let number = +this.selected_player_away_all_pos.lineup[i].pminus;
        this.s_pred += number;
        this.t_pred -= number;
      }
      else if (this.selected_player_home_all_pos.lineup[i].perf == 100) {
        let number = +this.selected_player_away_all_pos.lineup[i].pplus;
        this.s_pred -= number;
        this.t_pred += number;
      }
    }
    this.player_loading = false;
  }

  private pickResolver() {
    this.s_pick = (this.s_pred > this.selected_match.away_spread) ? this.home_team : this.away_team;
    this.t_pick = (this.t_pred > this.selected_match.OU_line) ? 'over' : 'under';
    // this.m_pick = (this.selected_match.moneyline_pick == "home") ? this.home_team : this.away_team;
    this.m_pick = (this.s_pred > 0) ? this.home_team : this.away_team;
  }



  // Get corresponding match
  private getGame(match: string) {
    let teams = match.split(" ", 3);
    this.away_team = teams[0];
    this.home_team = teams[2];
    for (let i in this.games_today) {
      if (this.games_today[i].away_team_abbr == this.away_team) {
        this.match_loading = false;
        return this.games_today[i];
      }
    }

    this.match_loading = false;
    return "null";
  }

  private getPlayerAway(match: string) {
    let teams = match.split(" ", 3);
    this.away_team = teams[0];
    this.home_team = teams[2];

    for (let i in this.matches) {
      if (this.matches[i].team_name == this.away_team) {
        return this.matches[i];
      }
    }
    return "null";
  }

  // Get players by positions for away team:
  private getPlayerAwayByPos(pos: string) {
    this.selected_by_pos = []
    for (let i in this.selected_player_away_all_pos.lineup) {
      if (this.selected_player_away_all_pos.lineup[i].position == pos) {
        this.selected_by_pos.push(this.selected_player_away_all_pos.lineup[i])
      }
    }
    return this.selected_by_pos;
  }

  // Get players by positions for home team:
  private getPlayerHomeByPos(pos: string) {
    this.selected_by_pos = []
    for (let i in this.selected_player_home_all_pos.lineup) {
      if (this.selected_player_home_all_pos.lineup[i].position == pos) {
        this.selected_by_pos.push(this.selected_player_home_all_pos.lineup[i])
      }
    }
    return this.selected_by_pos;
  }

  private getPlayerHome(match: string) {
    let teams = match.split(" ", 3);
    this.away_team = teams[0];
    this.home_team = teams[2];

    for (let i in this.matches) {
      if (this.matches[i].team_name == this.home_team) {
        return this.matches[i];
      }
    }
    return "null";
  }

  private playerDataResolver() {
    this.player_loading = true;
    this.selected_player_away_all_pos = this.getPlayerAway(this.selected_teams);
    this.selected_player_away = this.getPlayerAwayByPos(this.selected_pos_a)
    this.selected_player_home_all_pos = this.getPlayerHome(this.selected_teams);
    this.selected_player_home = this.getPlayerHomeByPos(this.selected_pos_h)
    for (let i in this.selected_player_home) {
      this.selected_player_home[i].perf = 50;
    }
    for (let i in this.selected_player_away) {
      this.selected_player_away[i].perf = 50;
    }
    this.selected_player_a = null;
    this.selected_player_h = null;
    this.selected_player_a = this.selected_player_away[0];
    this.selected_player_a_name = this.selected_player_a.player_name;
    this.selected_player_h = this.selected_player_home[0];
    this.selected_player_h_name = this.selected_player_h.player_name;
    this.player_loading = false;
  }

  private updateProbER() {
    this.player_loading = true;
    let R = require("j6");
    let sodds = (this.selected_match.spread_pick == "away") ? +this.selected_match.away_odds : +this.selected_match.home_odds;
    let modds = (this.selected_match.moneyline_pick == "away") ? +this.selected_match.away_money : +this.selected_match.home_money;
    let todds = (this.selected_match.total_pick == "over") ? +this.selected_match.over_odds : +this.selected_match.under_odds;
    let oppmodds = (this.selected_match.moneyline_pick == "away") ? +this.selected_match.home_money : +this.selected_match.away_money;

    let sdodds = (sodds > 0) ? (sodds + 100) / 100 : (-100 + sodds) / sodds;
    let mdodds = (modds > 0) ? (modds + 100) / 100 : (-100 + modds) / modds;
    let tdodds = (todds > 0) ? (todds + 100) / 100 : (-100 + todds) / todds;
    let oppmdodds = (oppmodds > 0) ? (oppmodds + 100) / 100 : (-100 + oppmodds) / oppmodds;

    this.sprob = R.pnorm(Math.abs(this.s_pred - (+this.selected_match.away_spread)) / 20);
    this.sER = sdodds * this.sprob - 1;
    this.mprob = R.pnorm(Math.abs(this.s_pred - 0) /20);
    this.mER = mdodds * this.mprob - 1;

    let oppmprob = 1 - this.mprob
    let oppmER = oppmdodds * oppmprob - 1

    if (this.mER < oppmER) {
      // this.selected_match.moneyline_pick = (this.selected_match.moneyline_pick == "away") ? "home" : "away";
      this.m_pick = (this.m_pick == this.away_team) ? this.home_team : this.away_team;
      this.mprob = oppmprob;
      this.mER = oppmER;
    }

    this.tprob = R.pnorm(Math.abs(this.t_pred - (+this.selected_match.OU_line)) / 20);
    this.tER = tdodds * this.tprob - 1;

    this.player_loading = false;
  }

  private getDataNFL() {
    this.games = [];
    this.games_today = [];
    this.plumber.getNflTable().subscribe(
      win => {
        for (let i in win) {
          this.games.push(win[i]);
        }
        this.nflWeek = this.games[0].week;
        this.games.forEach(g => {
          g.local_start_time = moment(g.schedule).format('MMM D YYYY, HH:mm');
          g.started = (moment(g.schedule) < moment());
          g.ml_pick = g.ml_pick;
          g.sp_pick = g.spread_pick;
          g.ou_pick = g.total_pick;
          g.s_pred = (Math.round((Number(g.spred)) * 1e1) / 1e1);
          g.t_pred = (Math.round((Number(g.tpred)) * 1e1) / 1e1);
          if (g.week == this.nflWeek){
            this.games_today.push(g);
            let matchname = g.away_team_abbr + " - " + g.home_team_abbr;
            this.teams.push(matchname);
          }
        });
        this.gameDate = moment(this.games_today[0].time).format('MMM D, YYYY');
        this.teams.sort();
        this.selected_teams = this.teams[0];
      },
      fail => { },
      () => {
        this.plumber.getNflPlayerImpactData().subscribe(
          res => {
            for (let i in res) {
              this.matches.push(res[i]);
            }
            this.playerDataResolver();
          },
          fail => { },
        );
        this.selected_match = this.getGame(this.selected_teams);
        this.resetData();
      }
    );
  }
}

