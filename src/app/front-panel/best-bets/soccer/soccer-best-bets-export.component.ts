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

@Component({
  selector: 'tqe-soccer-best-bets-export',
  templateUrl: './soccer-best-bets.component.html',
  styleUrls: ['./soccer-best-bets.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class SoccerBestBetsExportComponent implements OnInit {
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
  summary: any[]    = [];
  loading: boolean  = true;
  isAuthorized: boolean = false;
  gameDate: string;
  finalDate: string;
  sortBy: string = 'rating';
  sortDir: any = {
    'rating': true,
    'time': false
  };
  league: string;

  ngOnInit() {
    //this.authorizeUser();
    this.league = "EPL"
  }

  // === PUBLIC METHODS ====================================================

  public decToAmOdds(d: number): string{
    let res : number;
    if(d > 2) {
      res = 100*(d-1)
      return '+'+ res.toFixed();
    }
    else{
      res = -100/(d-1);
      return '' + res.toFixed();
    }
  }

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

  onClickEPL() {
    this.league = "EPL";
    this.getData();
  }

  onClickLaLiga() {
    this.league = "LA-LIGA";
    this.getData();
  }

  onClickSerieA() {
    this.league = "SerieA";
    this.getData();
  }

  onClickBundesliga() {
    this.league = "Bundesliga";
    this.getData();
  }

  onClickLigue1() {
    this.league = "Ligue1";
    this.getData();
  }

  // === PRIVATE METHODS ===================================================

  // Authorize partner
  // e.g.  window.parent.window.postMessage({"key":"eyJtZXNzYWdlIjoiSldUIFJ1b", "data":"anything"}, 'https://staging.thequantumedge.com')
  @HostListener('window:message', ['$event'])
  onMessage(e) {
    let whitelist =                                       // set allowed origins e.g. https://www.rotoballer.com
    [
    "https://dev.rotoballer.com",
    "https://www.rotoballer.com"
    ];
    if (whitelist.indexOf(e.origin) === -1) {
      return false;
    }
    if (e.data.key == "eyJtZXNzYWdlIjoiSldUIFJ1b") {
      this.loading = false;
      this.isAuthorized = true;
      this.getData();
      console.log("access granted");
    }
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
        this.loading = false;
        this.sortByStartTime();
      },
      ()  => {
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

  private getFinalDate(games: any[]): string{
    if(games.length == 0)
      return "null";
    let res = games[0].date;
    this.games.forEach( g => {
      if(moment(g.date).isAfter(moment(res),'day'))
        res = g.date;
    })
    return res;
  }

  private getData() {
    this.games = [];
    this.games_today = [];
    this.gameDate = moment().format('dddd, MMMM Do, YYYY');
    this.plumber.getSoccerTable(this.league).subscribe(
      win => {
        for(let i in win) 
          this.games.push(win[i]);
        this.games.forEach( g => {
          g.started = g.date == 'TOMORROW';
          g.local_start_time = moment(g.date).format('MMM D YYYY, HH:mm');
          if(g.started == false)
            g.started = (moment(g.date) < moment());
          g.ml_pick_h = g['ml_H_return'] > 0;
          g.ml_pick_d = g['ml_D_return'] > 0;
          g.ml_pick_a = g['ml_A_return'] > 0;
          g.sp_pick_h = g['sprd_H_dmnt_return'] > 0;
          g.sp_pick_a = g['sprd_A_dmnt_return'] > 0;
          g.ou_pick_o = g['OU_over_dmnt_return'] > 0;
          g.ou_pick_u = g['OU_under_dmnt_return'] > 0;
          g.ml_H_odds = this.decToAmOdds(g.ml_H_odds);
          g.ml_D_odds = this.decToAmOdds(g.ml_D_odds);
          g.ml_A_odds = this.decToAmOdds(g.ml_A_odds);
          g.sprd_H_dmnt_odds = this.decToAmOdds(g.sprd_H_dmnt_odds);
          g.sprd_A_dmnt_odds = this.decToAmOdds(g.sprd_A_dmnt_odds);
          g.OU_over_dmnt_odds = this.decToAmOdds(g.OU_over_dmnt_odds);
          g.OU_under_dmnt_odds = this.decToAmOdds(g.OU_under_dmnt_odds);
          if(moment(g.date).isSame(moment(),'day')){
            this.games_today.push(g);
          }
         });

      },
     fail => {console.log("failed")},
     () => {
       // Pop today's games
       this.games = this.games.filter(game => !moment(game.date).isSame(moment(),'day'));
       // Get latest date
       this.finalDate = this.getFinalDate(this.games);
       this.finalDate = moment(this.finalDate).format('dddd, MMMM Do, YYYY');
       // this.loading = false;
     },
   );
  }
}
