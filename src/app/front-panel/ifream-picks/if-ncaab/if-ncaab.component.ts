import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { SeoService } from '../../../services/seo.service';

import { DataService } from '../../../services/data.service';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../services/auth.service';
import { Subscription } from 'rxjs';
import { AngularBootstrapToastsService } from 'angular-bootstrap-toasts';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import * as moment from 'moment';
import {BestBetsService} from '../../best-bets/best-bets.service';


@Component({
  selector: 'app-if-ncaab',
  templateUrl: './if-ncaab.component.html',
  styleUrls: ['./if-ncaab.component.scss']
})
export class IfNcaabComponent implements OnInit {

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
  isAuthorized: boolean = true;
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
    let tool: string = "nba-dk-optimizer"

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
    console.log(games);
    if (games.length == 0)
      return "null";
    let res = games[0]['EST_schedule'];
    this.games.forEach(g => {
      if (moment(g['EST_schedule']).isAfter(moment(res), 'day'))
        res = g['EST_schedule'];
    })
    return res;
  }

  private getData() {
    this.games = [];
    this.games_today = [];
    this.gameDate = moment().format('dddd, MMMM Do, YYYY');

      this.plumber.getIfcbTable().subscribe(
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
          console.log(this.finalDate);
          // this.loading = false;
        },
      );

  }

}
