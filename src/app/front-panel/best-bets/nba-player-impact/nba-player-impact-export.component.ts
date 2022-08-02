import {Component, OnInit, ViewChild, ViewEncapsulation, HostListener} from '@angular/core';

import {BestBetsService} from '../best-bets.service';
import {DataService} from '../../../services/data.service';
import {AuthService} from '../../../services/auth.service';
import {AngularBootstrapToastsService} from 'angular-bootstrap-toasts';
import {Router} from '@angular/router';
import * as moment from 'moment';

declare var require: any;

@Component({
  selector: 'tqe-nba-player-impact-export',
  templateUrl: './nba-player-impact-export.component.html',
  styleUrls: ['./nba-player-impact.component.scss']
})

export class NbaPlayerExportImpactComponent implements OnInit {
  errorrMessage: any;

  // @ViewChild('signupModal') signupModal: ModalDirective;
  constructor(
    private authService: AuthService,
    private dataService: DataService,
    private router: Router,
    private plumber: BestBetsService,
    private toast: AngularBootstrapToastsService
  ) {
  }

  selected_teams: string = '';
  selected_player_set: any;
  selected_player_a: any;
  selected_player_a_name: string = '';
  selected_player_h: any;
  selected_player_h_name: string = '';
  selected_match: any;
  player_value_a: number[];
  player_value_h: number[];
  away_player_idx: number = 0;
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
  // if no game/ api not working
  hasGames: boolean = false;
  hasApiError: boolean = false;
  gamesLoading: boolean = true;

  ngOnInit() {
    this.isAuthorized = true;
    this.getData();
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
  //
  //
  // private resetData() {
  //   this.player_value_a = 50;
  //   this.player_value_h = 50;
  //   this.away_player_idx = 0;
  //   this.home_player_idx = 0;
  //   this.s_pred = this.selected_match.s_pred;
  //   this.t_pred = this.selected_match.t_pred;
  //   this.s_pick = (this.selected_match.spread_pick == 'away') ? this.away_team : this.home_team;
  //   this.t_pick = this.selected_match.total_pick;
  //   this.m_pick = (this.selected_match.moneyline_pick == 'away') ? this.away_team : this.home_team;
  //   this.sprob = this.selected_match.s_prob;
  //   this.sER = this.selected_match.sER;
  //   this.tprob = this.selected_match.t_prob;
  //   this.tER = this.selected_match.tER;
  //   this.mprob = this.selected_match.m_prob;
  //   this.mER = this.selected_match.mER;
  // }
  //
  // // Excute when user changes team
  // private onClickTeamSel() {
  //   this.isShowPlayerImpact = false;
  //   this.match_loading = true;
  //   this.selected_match = this.getGame(this.selected_teams);
  //   this.playerDataResolver();
  //   this.resetData();
  // }
  //
  // // Update player data when user changes away team player
  // private onClickPlayerSelA() {
  //   this.selected_player_a = null;
  //   for (let i in this.selected_player_set.away_lineup) {
  //     if (this.selected_player_set.away_lineup[i].player_name == this.selected_player_a_name) {
  //       this.selected_player_a = this.selected_player_set.away_lineup[i];
  //       this.away_player_idx = +i;
  //       break;
  //     }
  //   }
  //   this.player_value_a = this.selected_player_a.perf;
  // }
  //
  // // Update player data when user changes home team player
  // private onClickPlayerSelH() {
  //   this.selected_player_h = null;
  //   for (let i in this.selected_player_set.home_lineup) {
  //     if (this.selected_player_set.home_lineup[i].player_name == this.selected_player_h_name) {
  //       this.selected_player_h = this.selected_player_set.home_lineup[i];
  //       this.home_player_idx = +i;
  //       break;
  //     }
  //   }
  //   this.player_value_h = this.selected_player_h.perf;
  // }
  //
  // // Excute when user changes away team player's performance
  // private onInputChangeA(event: any) {
  //   this.isShowPlayerImpact = true;
  //   this.selected_player_set.away_lineup[this.away_player_idx].perf = event.value;
  //   console.log(this.selected_player_set);
  //   console.log(this.selected_player_set.away_lineup[this.away_player_idx]);
  //   this.stPredResolver();
  //   this.pickResolver();
  //   this.updateProbER();
  // }
  //
  // // Excute when user changes home team player's performance
  // private onInputChangeH(event: any) {
  //   this.isShowPlayerImpact = true;
  //   this.selected_player_set.home_lineup[this.home_player_idx].perf = event.value;
  //   this.stPredResolver();
  //   this.pickResolver();
  //   this.updateProbER();
  // }
  //
  // private toFixedNumber(num, digits) {
  //   let pow = Math.pow(10, digits);
  //   return Math.round(num * pow) / pow;
  // }
  //
  // // Calculate s_pred and t_pred
  // private stPredResolver() {
  //   this.player_loading = true;
  //   this.s_pred = this.selected_match.s_pred;
  //   this.t_pred = this.selected_match.t_pred;
  //   for (let i in this.selected_player_set.away_lineup) {
  //     if (this.selected_player_set.away_lineup[i].perf == 0) {
  //       let number = this.toFixedNumber(+this.selected_player_set.away_lineup[i].pminus, 1);
  //       this.s_pred = this.toFixedNumber((this.s_pred + number), 1);
  //       this.t_pred = this.toFixedNumber((this.t_pred - number), 1);
  //     } else if (this.selected_player_set.away_lineup[i].perf == 100) {
  //       let number = this.toFixedNumber(+this.selected_player_set.away_lineup[i].pplus, 1);
  //       this.s_pred = this.toFixedNumber((this.s_pred - number), 1);
  //       this.t_pred = this.toFixedNumber((this.t_pred + number), 1);
  //     }
  //   }
  //   for (let i in this.selected_player_set.home_lineup) {
  //     if (this.selected_player_set.home_lineup[i].perf == 0) {
  //       let number = this.toFixedNumber(+this.selected_player_set.home_lineup[i].pminus, 1);
  //       this.s_pred = this.toFixedNumber((this.s_pred - number), 1);
  //       this.t_pred = this.toFixedNumber((this.t_pred - number), 1);
  //     } else if (this.selected_player_set.home_lineup[i].perf == 100) {
  //       let number = this.toFixedNumber(+this.selected_player_set.home_lineup[i].pplus, 1);
  //       this.s_pred = this.toFixedNumber((this.s_pred + number), 1);
  //       this.t_pred = this.toFixedNumber((this.t_pred + number), 1);
  //     }
  //   }
  //   this.player_loading = false;
  // }
  //
  // private pickResolver() {
  //   this.s_pick = (this.s_pred > this.selected_match.away_spread) ? this.home_team : this.away_team;
  //   this.t_pick = (this.t_pred > this.selected_match.OU_line) ? 'over' : 'under';
  //   // this.m_pick = (this.selected_match.moneyline_pick == "home") ? this.home_team : this.away_team;
  //   this.m_pick = (this.s_pred > 0) ? this.home_team : this.away_team;
  // }
  //
  // // Get corresponding match
  // private getGame(match: string) {
  //   let teams = match.split(' ', 3);
  //   this.away_team = teams[0];
  //   this.home_team = teams[2];
  //   for (let i in this.games_today) {
  //     if (this.games_today[i].away_team_abbr == this.away_team) {
  //       this.match_loading = false;
  //       return this.games_today[i];
  //     }
  //   }
  //   this.match_loading = false;
  //   return 'null';
  // }
  //
  // // Get corresponding player set
  // private getPlayerSet(match: string) {
  //   let teams = match.split(' ', 3);
  //   this.away_team = teams[0];
  //   this.home_team = teams[2];
  //   for (let i in this.matches) {
  //     if (this.matches[i].away_team == this.away_team) {
  //       return this.matches[i];
  //     }
  //   }
  //   return 'null';
  // }
  //
  // // Init seperate a/h player lists
  // private playerDataResolver() {
  //   this.player_loading = true;
  //   this.selected_player_set = this.getPlayerSet(this.selected_teams);
  //   for (let i in this.selected_player_set.home_lineup) {
  //     this.selected_player_set.home_lineup[i].perf = 50;
  //   }
  //   for (let i in this.selected_player_set.away_lineup) {
  //     this.selected_player_set.away_lineup[i].perf = 50;
  //   }
  //   this.selected_player_a = null;
  //   this.selected_player_h = null;
  //   this.selected_player_a = this.selected_player_set.away_lineup[0];
  //   this.selected_player_a_name = this.selected_player_a.player_name;
  //   this.selected_player_h = this.selected_player_set.home_lineup[0];
  //   this.selected_player_h_name = this.selected_player_h.player_name;
  //   this.player_loading = false;
  // }
  //
  // // Update Pick Probability and Expected Return data
  // private updateProbER() {
  //   this.player_loading = true;
  //   let R = require('j6');
  //   let sodds = (this.selected_match.spread_pick == 'away') ? +this.selected_match.away_odds : +this.selected_match.home_odds;
  //   let modds = (this.selected_match.moneyline_pick == 'away') ? +this.selected_match.away_money : +this.selected_match.home_money;
  //   let todds = (this.selected_match.total_pick == 'over') ? +this.selected_match.over_odds : +this.selected_match.under_odds;
  //   let oppmodds = (this.selected_match.moneyline_pick == 'away') ? +this.selected_match.home_money : +this.selected_match.away_money;
  //
  //   let sdodds = (sodds > 0) ? (sodds + 100) / 100 : (-100 + sodds) / sodds;
  //   let mdodds = (modds > 0) ? (modds + 100) / 100 : (-100 + modds) / modds;
  //   let tdodds = (todds > 0) ? (todds + 100) / 100 : (-100 + todds) / todds;
  //   let oppmdodds = (oppmodds > 0) ? (oppmodds + 100) / 100 : (-100 + oppmodds) / oppmodds;
  //
  //   this.sprob = R.pnorm(Math.abs(this.s_pred - (+this.selected_match.away_spread)) / 25);
  //   this.sER = sdodds * this.sprob - 1;
  //
  //   this.mprob = R.pnorm(Math.abs(this.s_pred - 0) / 25);
  //   this.mER = mdodds * this.mprob - 1;
  //
  //   let oppmprob = 1 - this.mprob;
  //   let oppmER = oppmdodds * oppmprob - 1;
  //
  //   if (this.mER < oppmER) {
  //     // this.selected_match.moneyline_pick = (this.selected_match.moneyline_pick == "away") ? "home" : "away";
  //     this.m_pick = (this.m_pick == this.away_team) ? this.home_team : this.away_team;
  //     this.mprob = oppmprob;
  //     this.mER = oppmER;
  //   }
  //
  //   this.tprob = R.pnorm(Math.abs(this.t_pred - (+this.selected_match.OU_line)) / 25);
  //   this.tER = tdodds * this.tprob - 1;
  //
  //   this.player_loading = false;
  // }

  private resetData() {
    // this.player_value_a = 50;
    this.player_value_a = [50, 50, 50, 50, 50, 50, 50, 50, 50, 50];
    this.player_value_h = [50, 50, 50, 50, 50, 50, 50, 50, 50, 50];
    this.away_player_idx = 0;
    this.home_player_idx = 0;
    this.s_pred = this.selected_match.s_pred;
    this.t_pred = this.selected_match.t_pred;
    this.s_pick = (this.selected_match.spread_pick == 'away') ? this.away_team : this.home_team;
    this.t_pick = this.selected_match.total_pick;
    this.m_pick = (this.selected_match.moneyline_pick == 'away') ? this.away_team : this.home_team;
    this.sprob = this.selected_match.s_prob;
    this.sER = this.selected_match.sER;
    this.tprob = this.selected_match.t_prob;
    this.tER = this.selected_match.tER;
    this.mprob = this.selected_match.m_prob;
    this.mER = this.selected_match.mER;
  }

  // Excute when user changes team
  private onClickTeamSel() {
    this.isShowPlayerImpact = false;
    this.match_loading = true;
    this.selected_match = this.getGame(this.selected_teams);
    this.playerDataResolver();
    this.resetData();
  }

  // Excute when user changes away team player's performance
  private onInputChangeA(event: any, player_index: number) {
    this.isShowPlayerImpact = true;
    this.selected_player_set.away_lineup[player_index].perf = event.value;
    this.stPredResolver();
    this.pickResolver();
    this.updateProbER();
  }

  // Excute when user changes home team player's performance
  private onInputChangeH(event: any, player_index: number) {
    this.isShowPlayerImpact = true;
    this.selected_player_set.home_lineup[player_index].perf = event.value;
    this.stPredResolver();
    this.pickResolver();
    this.updateProbER();
  }

  // Calculate s_pred and t_pred
  private stPredResolver() {
    this.player_loading = true;
    console.log(this.selected_match.s_pred);
    console.log(this.selected_match.t_pred);
    this.s_pred = this.selected_match.s_pred;
    this.t_pred = this.selected_match.t_pred;
    for (const i in this.selected_player_set.home_lineup) {
      if (this.selected_player_set.home_lineup[i].perf == 0) {
        const number = +this.selected_player_set.home_lineup[i].pminus;
        this.s_pred -= number;
        this.t_pred -= number;
      } else if (this.selected_player_set.home_lineup[i].perf == 100) {
        const number = +this.selected_player_set.home_lineup[i].pplus;
        this.s_pred += number;
        this.t_pred += number;
      }
    }
    for (let i in this.selected_player_set.away_lineup) {
      if (this.selected_player_set.away_lineup[i].perf == 0) {
        let number = +this.selected_player_set.away_lineup[i].pminus;
        this.s_pred += number;
        this.t_pred -= number;
      } else if (this.selected_player_set.away_lineup[i].perf == 100) {
        let number = +this.selected_player_set.away_lineup[i].pplus;
        this.s_pred -= number;
        this.t_pred += number;
      }
    }
    this.player_loading = false;
  }

  private pickResolver() {
    this.s_pick = (this.s_pred > this.selected_match.away_spread) ? this.home_team : this.away_team;
    this.t_pick = (this.t_pred > this.selected_match.OU_line) ? 'over' : 'under';
    this.m_pick = (this.s_pred > 0) ? this.home_team : this.away_team;
  }

  // Get corresponding match
  private getGame(match: string) {
    let teams = match.split(' ', 3);
    this.away_team = teams[0];
    this.home_team = teams[2];
    for (let i in this.games_today) {
      if (this.games_today[i].away_team_abbr == this.away_team) {
        this.match_loading = false;
        return this.games_today[i];
      }
    }
    this.match_loading = false;
    return 'null';
  }

  // Get corresponding player set
  private getPlayerSet(match: string) {
    let teams = match.split(' ', 3);
    this.away_team = teams[0];
    this.home_team = teams[2];
    for (let i in this.matches) {
      if (this.matches[i].away_team == this.away_team) {
        return this.matches[i];
      }
    }
    return 'null';
  }

  // Init seperate a/h player lists
  private playerDataResolver() {
    this.player_loading = true;
    this.selected_player_set = this.getPlayerSet(this.selected_teams);
    for (let i in this.selected_player_set.home_lineup) {
      this.selected_player_set.home_lineup[i].perf = 50;
    }
    for (let i in this.selected_player_set.away_lineup) {
      this.selected_player_set.away_lineup[i].perf = 50;
    }
    this.selected_player_a = null;
    this.selected_player_h = null;
    this.selected_player_a = this.selected_player_set.away_lineup[0];
    this.selected_player_a_name = this.selected_player_a.player_name;
    this.selected_player_h = this.selected_player_set.home_lineup[0];
    this.selected_player_h_name = this.selected_player_h.player_name;
    this.player_loading = false;
    this.gamesLoading = false;
  }

  // Update Pick Probability and Expected Return data
  private updateProbER() {
    this.player_loading = true;
    let R = require('j6');
    let sodds = (this.selected_match.spread_pick == 'away') ? +this.selected_match.away_odds : +this.selected_match.home_odds;
    let modds = (this.selected_match.moneyline_pick == 'away') ? +this.selected_match.away_money : +this.selected_match.home_money;
    let todds = (this.selected_match.total_pick == 'over') ? +this.selected_match.over_odds : +this.selected_match.under_odds;
    let oppmodds = (this.selected_match.moneyline_pick == 'away') ? +this.selected_match.home_money : +this.selected_match.away_money;

    let sdodds = (sodds > 0) ? (sodds + 100) / 100 : (-100 + sodds) / sodds;
    let mdodds = (modds > 0) ? (modds + 100) / 100 : (-100 + modds) / modds;
    let tdodds = (todds > 0) ? (todds + 100) / 100 : (-100 + todds) / todds;
    let oppmdodds = (oppmodds > 0) ? (oppmodds + 100) / 100 : (-100 + oppmodds) / oppmodds;

    // tslint:disable-next-line:max-line-length
    this.sprob = (this.selected_match.spread_pick == 'away') ? R.pnorm((this.selected_match.away_spread - this.s_pred) / 10) : R.pnorm((this.s_pred - this.selected_match.away_spread) / 10);
    this.sER = sdodds * this.sprob - 1;

    this.mprob = R.pnorm(Math.abs(this.s_pred - 0) / 10);
    this.mER = mdodds * this.mprob - 1;

    let oppmprob = 1 - this.mprob;
    let oppmER = oppmdodds * oppmprob - 1;

    if (this.mER < oppmER) {
      // this.selected_match.moneyline_pick = (this.selected_match.moneyline_pick == "away") ? "home" : "away";
      this.m_pick = (this.m_pick == this.away_team) ? this.home_team : this.away_team;
      this.mprob = oppmprob;
      this.mER = oppmER;
    }

    this.tprob = (this.selected_match.total_pick == 'over') ? R.pnorm((this.t_pred - this.selected_match.OU_line) / 10) : R.pnorm((this.selected_match.OU_line - this.t_pred) / 10);
    this.tER = tdodds * this.tprob - 1;

    this.player_loading = false;
  }

  private formatTime(time: any) {
    return moment(time).format('MMM D, YY h:mm a');
  }

  private getData() {
    this.games = [];
    this.games_today = [];

    // Get NBA Player Impact data
    this.plumber.getIFNbaPlayerImpactData().subscribe(
      res => {
        for (let i in res) {
          this.matches.push(res[i]);
          let matchname = res[i].away_team + ' - ' + res[i].home_team;
          this.teams.push(matchname);
        }
        // If no games today
        if (this.matches && this.matches.length > 0) {
          this.hasGames = true;
        }
        this.gameDate = moment(this.matches[0].time).format('MMM D, YYYY');
        this.teams.sort();
        this.selected_teams = this.teams[0];
        this.playerDataResolver();

      },
      (error) => {
        console.log('nba lineup api failed');
        this.errorrMessage = error;
        console.log('Error msg is:', this.errorrMessage);
        // If Api not working
        this.hasApiError = true;
        this.gamesLoading = false;
      },
      () => {
        // Get NBA table
        this.plumber.getIfNbaTable().subscribe(
          win => {
            for (let i in win) {
              this.games.push(win[i]);
            }
            this.games.forEach(g => {
              g.local_start_time = moment(g.schedule).format('MMM D YYYY, HH:mm');
              g.started = (moment(g.schedule) < moment());
              g.ml_pick = g.moneyline_pick;
              g.sp_pick = g.spread_pick;
              g.ou_pick = g.total_pick;
              g.s_pred = (Math.round((g.s_pred) * 1e1) / 1e1);
              g.t_pred = (Math.round((g.t_pred) * 1e1) / 1e1);
              if (moment(g.schedule).isSame(moment(this.gameDate), 'day')) {
                this.games_today.push(g);
              }
            });
          },
          (error) => {
            console.log('nab api failed');
            this.errorrMessage = error;
            console.log('Error msg is:', this.errorrMessage);
            this.hasApiError = true;
            this.gamesLoading = false;
          },
          () => {
            this.selected_match = this.getGame(this.selected_teams);
            this.resetData();
          },
        );
      }
    );
  }

}

