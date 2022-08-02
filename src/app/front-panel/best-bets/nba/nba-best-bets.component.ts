import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {SeoService} from '../../../services/seo.service';

import {BestBetsService} from '../best-bets.service';
import {DataService} from '../../../services/data.service';
import {environment} from '../../../../environments/environment';
import {AuthService} from '../../../services/auth.service';
import {Subscription} from 'rxjs';
import {AngularBootstrapToastsService} from 'angular-bootstrap-toasts';
import {ModalDirective} from 'ngx-bootstrap/modal';
import {Router} from '@angular/router';
import * as moment from 'moment';

@Component({
  selector: 'tqe-nba-best-bets',
  templateUrl: './nba-best-bets.component.html',
  styleUrls: ['./nba-best-bets.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class NbaBestBetsComponent implements OnInit {
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
  loading: boolean = true;
  isAuthorized: boolean = false;
  gameDate: string;
  finalDate: string;
  sortBy: string = 'rating';
  sortDir: any = {
    'rating': true,
    'time': false
  };

  ngOnInit() {
    this.authorizeUser();
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

  // === PRIVATE METHODS ===================================================

  private authorizeUser() {
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
        this.loading = false;
        this.sortByStartTime();
      },
      () => {
        this.loading = false;
        // console.log('Auth: ' + this.isAuthorized);
      }
    );
  }


  private getFinalDate(games: any[]): string {
    if (games.length == 0) {
      return 'null';
    }
    let res = games[0].schedule;
    this.games.forEach(g => {
      if (moment(g.schedule).isAfter(moment(res), 'day')) {
        res = g.schedule;
      }
    });
    return res;
  }

  private getData() {
    this.games = [];
    this.games_today = [];
    this.gameDate = moment().format('dddd, MMMM Do, YYYY');


    // console.log('localStorage.getItem(\'data\'): ' + localStorage.getItem('data'));


    if (localStorage.getItem('data')) {
      this.plumber.getNbaTable().subscribe(
        win => {
          for (let i in win) {
            this.games.push(win[i]);
          }
          this.games.forEach(g => {
            g.local_start_time = moment(g.schedule).format('MMM D YYYY, HH:mm');
            g.started = (moment(g.schedule) < moment());
            //g.show_ml_pick = g['ML Expected Return'] > 0.05;
            g.ml_pick = g.moneyline_pick;
            g.sp_pick = g.spread_pick;
            g.ou_pick = g.total_pick;
            // if (moment(g.schedule).isSame(moment(), 'day')) {
            if (moment(g.schedule).isSame(moment(), 'week')) {
              this.games_today.push(g);
            }
          });
        },
        fail => {
        },
        () => {
          // Pop today's games
          this.games = this.games.filter(game => !moment(game.schedule).isSame(moment(), 'day'));
          // Get latest date
          this.finalDate = this.getFinalDate(this.games);
          this.finalDate = moment(this.finalDate).format('dddd, MMMM Do, YYYY');
          // this.loading = false;
        },
      );
    }
    else {
      this.plumber.getNbaTablePublic().subscribe(
        win => {
          for (let i in win) {
            this.games.push(win[i]);
          }
          this.games.forEach(g => {
            g.local_start_time = moment(g.schedule).format('MMM D YYYY, HH:mm');
            g.started = (moment(g.schedule) < moment());
            //g.show_ml_pick = g['ML Expected Return'] > 0.05;
            // if (moment(g.schedule).isSame(moment(), 'day')) {
            if (moment(g.schedule).isSame(moment(), 'week')) {
              this.games_today.push(g);
            }
          });
        },
        fail => {
        },
        () => {
          // Pop today's games
          this.games = this.games.filter(game => !moment(game.schedule).isSame(moment(), 'day'));
          // Get latest date
          this.finalDate = this.getFinalDate(this.games);
          this.finalDate = moment(this.finalDate).format('dddd, MMMM Do, YYYY');
        },
      );
    }
  }

}
