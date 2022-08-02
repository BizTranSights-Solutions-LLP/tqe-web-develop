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
  selector: 'tqe-nfl-best-bets-internal',
  templateUrl: './nfl-best-bets-internal.component.html',
  styleUrls: ['./nfl-best-bets-internal.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class NflBestBetsInternalComponent implements OnInit {
  // @ViewChild('signupModal') signupModal: ModalDirective;
  constructor(
    private authService: AuthService,
    private dataService: DataService,
    private router: Router,
    private plumber: BestBetsService,
    private toast: AngularBootstrapToastsService
  ) { }

  games: any[] = [];
  // games_today: any[] = [];
  games_this_week: any[] = [];
  loading: boolean = true;
  isAuthorized: boolean = true;
  gameDate: string;
  finalDate: string;
  sortBy: string = 'rating';
  sortDir: any = {
    'rating': true,
    'time': false
  };
  nflWeek: string;

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
      () => {
        this.loading = false;
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
    // this.games_today = [];
    this.gameDate = moment().format('dddd, MMMM Do, YYYY');
    this.games_this_week = [];
    this.plumber.getNflTable().subscribe(
      win => {
        for (let i in win)
          this.games.push(win[i]);
        this.games.forEach(g => {
          g.local_start_time = moment(g.schedule).format('MMM D YYYY, HH:mm');
          g.started = (moment(g.schedule) < moment());
          g.ml_pick = g.moneyline_pick;
          g.sp_pick = g.spread_pick;
          g.ou_pick = g.total_pick;
          g.week = g.week;
          this.games_this_week.push(g);
        });
        this.nflWeek =this.games_this_week[0].week 
        this.games_this_week = this.games_this_week.filter(game =>(game.week == this.nflWeek));
      },
      fail => { },
      () => {
        this.games = this.games.filter(game => !(game.week == this.nflWeek));
      },
    );
  }

}
