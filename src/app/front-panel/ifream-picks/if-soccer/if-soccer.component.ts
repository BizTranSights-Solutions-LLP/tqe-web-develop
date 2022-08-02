import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {SeoService} from '../../../services/seo.service';

import {DataService} from '../../../services/data.service';
import {environment} from '../../../../environments/environment';
import {AuthService} from '../../../services/auth.service';
import {Subscription} from 'rxjs';
import {AngularBootstrapToastsService} from 'angular-bootstrap-toasts';
import {ModalDirective} from 'ngx-bootstrap/modal';
import {Router} from '@angular/router';
import * as moment from 'moment';
import {BestBetsService} from '../../best-bets/best-bets.service';

@Component({
  selector: 'app-if-soccer',
  templateUrl: './if-soccer.component.html',
  styleUrls: ['./if-soccer.component.scss']
})
export class IfSoccerComponent implements OnInit {

  // @ViewChild('signupModal') signupModal: ModalDirective;
  constructor(
    private authService: AuthService,
    private dataService: DataService,
    private router: Router,
    private plumber: BestBetsService,
    private toast: AngularBootstrapToastsService
  ) {
  }

  games: any[] = [];
  games_today: any[] = [];
  summary: any[] = [];
  loading: boolean = true;
  isAuthorized: boolean = true;
  gameDate: string;
  finalDate: string;
  sortBy: string = 'rating';
  sortDir: any = {
    'rating': true,
    'time': false
  };
  league: string;

  ngOnInit() {
    this.authorizeUser();
    this.league = 'EPL';
    this.getData();
  }

  // === PUBLIC METHODS ====================================================

  public decToAmOdds(d: number): string {
    let res: number;
    if (d > 2) {
      res = 100 * (d - 1);
      return '+' + res.toFixed();
    } else {
      res = -100 / (d - 1);
      return '' + res.toFixed();
    }
  }

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

  public sortByRating() {
    if (this.isAuthorized) {
      this.sortBy = 'rating';
      this.games = this.games.sort((a, b) => parseFloat(b.final_prob.match(/\d\d\.?\d?/)[0]) - parseFloat(a.final_prob.match(/\d\d\.?\d?/)[0]));
      if (this.sortDir[this.sortBy]) {
        this.games.reverse();
      }

      this.sortDir[this.sortBy] = !this.sortDir[this.sortBy];
    }
  }

  onClickEPL() {
    this.league = 'EPL';
    this.getData();
  }

  onClickLaLiga() {
    this.league = 'LA-LIGA';
    this.getData();
  }

  onClickSerieA() {
    this.league = 'SerieA';
    this.getData();
  }

  onClickBundesliga() {
    this.league = 'Bundesliga';
    this.getData();
  }

  onClickLigue1() {
    this.league = 'Ligue1';
    this.getData();
  }

  onClickSuperLig() {
    this.league = 'Super-Lig';
    this.getData();
  }

  onClickUEFAChamp() {
    this.league = 'UEFA-Champ';
    this.getData();
  }

  onClickMLS() {
    this.league = 'MLS';
    this.getData();
  }

  // === PRIVATE METHODS ===================================================

  private authorizeUser() {
    let isLoggedIn: any = this.authService.isUserLoggedIn();
    let tool: string = 'nba-dk-optimizer';

    this.dataService.get_tool(tool).subscribe(
      (res: any) => {
        this.isAuthorized = true;
      },
      (err) => {
        this.isAuthorized = true;
        this.loading = false;
        this.sortByStartTime();
      },
      () => {
        this.loading = false;
      }
    );
  }


  private getFinalDate(games: any[]): string {
    if (games.length == 0) {
      return 'null';
    }
    let res = games[0].EST_schedule;
    this.games.forEach(g => {
      if (moment(g.EST_schedule).isAfter(moment(res), 'day')) {
        res = g.EST_schedule;
      }
    });
    return res;
  }

  private getData() {
    this.games = [];
    this.games_today = [];
    this.gameDate = moment().format('dddd, MMMM Do, YYYY');

    this.plumber.getIfSoccerTable(this.league).subscribe(
      win => {
        for (let i in win) {
          this.games.push(win[i]);
        }
        this.games.forEach(g => {
          g.started = g.EST_schedule == 'TOMORROW';
          g.local_start_time = moment(g.EST_schedule).format('MMM D YYYY, HH:mm');
          if (g.started == false) {
            g.started = (moment(g.EST_schedule) < moment());
          }
          g.ml_pick_h = (g['m_tqe_pick'] == 'home');
          g.ml_pick_d = (g['m_tqe_pick'] == 'tie');
          g.ml_pick_a = (g['m_tqe_pick'] == 'away');
          g.ml_H_odds = g.m_h_odds;
          g.ml_D_odds = g.m_t_odds;
          g.ml_A_odds = g.m_a_odds;
          if (moment(g.EST_schedule).isSame(moment(), 'day')) {
            this.games_today.push(g);
          }
        });
      },
      fail => {
      },
      () => {
        // Pop today's games
        this.games = this.games.filter(game => !moment(game.EST_schedule).isSame(moment(), 'day'));
        // Get latest date
        this.finalDate = this.getFinalDate(this.games);
        this.finalDate = moment(this.finalDate).format('dddd, MMMM Do, YYYY');
        // this.loading = false;
      },
    );

  }
}
