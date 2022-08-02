/*import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
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

@Component({
  selector: 'tqe-cf-best-bets',
  templateUrl: './cf-best-bets.component.html',
  styleUrls: ['./cf-best-bets.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class CfBestBetsComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private dataService: DataService,
    private router: Router,
    private plumber: BestBetsService,
    private toast: AngularBootstrapToastsService
  ) { }

  games: any[]      = [];
  summary: any[]    = [];
  ihatethis: any    = [0,0,0,0,0,0];
  loading: boolean  = true;
  isAuthorized: boolean = true;
  gameDate: string;
  sortBy: string = 'rating';
  sortDir: any = {
    'rating': true,
    'time': true
  };

  ngOnInit() {
    this.authorizeUser();
    this.plumber.getBestBetsBySport("cf").subscribe(
       win => {
        let response_status = win[0];
        let games = win[1];
        this.games = games.sort((a,b) => parseFloat(b.final_prob.match(/\d\d\.?\d?/)[0]) - parseFloat(a.final_prob.match(/\d\d\.?\d?/)[0]));
        this.games.forEach( g => {
          g.local_start_time = moment(g.Schedule).format('MMMM Do YYYY, h:mm a');
          g.started = (moment(g.Schedule) < moment());
          g.real_pct = parseFloat(g.final_prob.match(/\d\d\.?\d?/)[0]).toFixed(1);
        });
       },
      fail => {},
      () => { },
    );
    this.plumber.getSummaryTableBySport('ncaaf').subscribe(
      win => {
        let summary = win[1];
        this.summary = summary;
        this.summary.forEach( g => {
          g.local_start_time = moment(g.Schedule).format('MMMM Do YYYY, h:mm a');
          g.started = (moment(g.Schedule) < moment());
          this.gameDate = moment(g.Schedule).format('dddd, MMMM Do, YYYY');
          g.sp_pick = g['Spread Pick'] === g.home_team ? 'home' : 'away';
          g.ou_pick = g['O/U Pick'] === 'OVER' ? 'away' : 'home';
        });
        this.summary = this.summary.sort(function(a, b){
          return moment(a.Schedule).valueOf() - moment(b.Schedule).valueOf();
        });
      },
     fail => {},
     () => { },
    );
  }

  // === PUBLIC METHODS ====================================================

  public stars(n: number): any[] {
    return Array(n);
  }

  public sortByStartTime() {
    this.sortBy = 'time';
    this.games = this.games.sort(function(a, b){
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
      this.games = this.games.sort((a,b) => parseFloat(b.final_prob.match(/\d\d\.?\d?/)[0]) - parseFloat(a.final_prob.match(/\d\d\.?\d?/)[0]));
      if (this.sortDir[this.sortBy]) {
        this.games.reverse();
      }

      this.sortDir[this.sortBy] = !this.sortDir[this.sortBy];
    }
  }
  // === PRIVATE METHODS ===================================================

  private authorizeUser() {
    let isLoggedIn: any = this.authService.isUserLoggedIn();
    let tool: string = "nba-dk-optimizer"
    this.dataService.get_tool(tool).subscribe(
      (res: any) => {
        this.isAuthorized = (res.meta.code === 200);
      },
      (err) => {
        this.isAuthorized = false;
        this.loading = false;
        this.sortByStartTime();
      },
      ()  => {
        this.loading = false;
      }
    );
  }

}*/




import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
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

@Component({
  selector: 'tqe-cf-best-bets',
  templateUrl: './cf-best-bets.component.html',
  styleUrls: ['./cf-best-bets.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class CfBestBetsComponent implements OnInit {
  // @ViewChild('signupModal') signupModal: ModalDirective;
  constructor(
    private authService: AuthService,
    private dataService: DataService,
    private router: Router,
    private plumber: BestBetsService,
    private toast: AngularBootstrapToastsService
  ) { }

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

  private toastErrorMsg(title, msg) {
    this.toast.showSimpleToast({
      text: msg,
      title: title,
      iconClass: "fas fa-exclamation-triangle",
      titleClass: "bg-danger text-white",
      closeButtonClass: "text-white",
      toastClass: "border-danger",
      duration: 5000,
      bodyClass: "",
      toolbarClass: "",
    });
  };

  private toastInfoMsg(title, msg) {
    this.toast.showSimpleToast({
      text: msg,
      title: title,
      iconClass: "fas fa-info-circle",
      titleClass: "bg-info text-white",
      closeButtonClass: "text-white",
      toastClass: "border-info",
      duration: 5000,
      bodyClass: "",
      toolbarClass: "",
    });
  };

  private getFinalDate(games: any[]): string {
    if (games.length == 0)
      return "null";
    let res = games[0].schedule;
    this.games.forEach(g => {
      if (moment(g.schedule).isAfter(moment(res), 'day'))
        res = g.schedule;
    })
    return res;
  }

  private getData() {
    this.games = [];
    this.games_today = [];
    this.gameDate = moment().format('dddd, MMMM Do, YYYY');
    if(localStorage.getItem('data')) {
      this.plumber.getcfTable().subscribe(
        win => {
          for (let i in win)
            this.games.push(win[i]);
          this.games.forEach(g => {
            g.local_start_time = moment(g.EST_schedule).format('MMM D YYYY, HH:mm');
            g.started = (moment(g.EST_schedule) < moment());
            //g.show_ml_pick = g['ML Expected Return'] > 0.05;
            g.ml_pick = g.m_tqe_pick;
            g.sp_pick = g.s_tqe_pick;
            g.ou_pick = g.t_tqe_pick;
            if (moment(g.EST_schedule).isSame(moment(), 'day')) {
              this.games_today.push(g);
            }
          });
        },
        fail => { },
        () => {
          // Pop today's games
          this.games = this.games.filter(game => !moment(game.EST_schedule).isSame(moment(), 'day'));
          // Get latest date
          this.finalDate = this.getFinalDate(this.games);
          this.finalDate = moment(this.finalDate).format('dddd, MMMM Do, YYYY');
          // this.loading = false;
        },
      );
    } else {
      this.plumber.getcfTablePublic().subscribe(
        win => {
          for (let i in win)
            this.games.push(win[i]);
          this.games.forEach(g => {
            g.local_start_time = moment(g.EST_schedule).format('MMM D YYYY, HH:mm');
            g.started = (moment(g.EST_schedule) < moment());
            //g.show_ml_pick = g['ML Expected Return'] > 0.05s;
            if (moment(g.EST_schedule).isSame(moment(), 'day')) {
              this.games_today.push(g);
            }
          });
        },
        fail => { },
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

}


