import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { BestBetsService } from '../best-bets.service';
import { DataService } from '../../../services/data.service';
import { AuthService } from '../../../services/auth.service';
import { AngularBootstrapToastsService } from 'angular-bootstrap-toasts';
import { Router } from '@angular/router';
import * as moment from 'moment'

@Component({
  selector: 'tqe-todays-best-bets',
  templateUrl: './todays-best-bets.component.html',
  styleUrls: ['./todays-best-bets.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class TodaysBestBetsComponent implements OnInit {
  // @ViewChild('signupModal') signupModal: ModalDirective;
  constructor(
    private authService: AuthService,
    private dataService: DataService,
    private router: Router,
    private plumber: BestBetsService,
    private toast: AngularBootstrapToastsService
  ) { }

  games: any[]      = [];
  ihatethis: any    = [0,0,0,0,0,0];
  loading: boolean  = true;
  nflWeek: string   = "";
  isAuthorized: boolean = true;
  sortBy: string = 'rating';
  gameDate: string;

  ngOnInit() {
    this.authorizeUser();
    /*this.gameDate = moment().format('dddd, MMMM Do, YYYY');
    this.plumber.getBestBetsBySport("all").subscribe(
       win => {
          let games = win[0];
          this.games = games.sort((a,b) => parseFloat(b.final_prob.match(/\d\d\.?\d?/)[0]) - parseFloat(a.final_prob.match(/\d\d\.?\d?/)[0]));
          this.nflWeek = games[0].nfl_week;
          this.loading = false;
          this.games.forEach( g => {
            g.local_start_time = moment(g.Schedule).format('MMMM Do YYYY, h:mm a');
            g.started = moment(g.schedule).isSame(moment(), 'day') && moment(g.schedule).isBefore(moment());
          });
       },
      fail => { },
        () => {
          this.loading = false;
        },
    );*/
  }

  // === PUBLIC METHODS ====================================================
  
  public stars(n: number): any[] {
    return Array(n);
  }

  public sortByStartTime() {
    this.sortBy = 'time';
    this.games = this.games.sort((a, b) => Date.parse(a.Schedule) - Date.parse(b.Schedule));
  }

  public sortByRating() {
    this.sortBy = 'rating';
    this.games = this.games.sort((a,b) => parseFloat(b.final_prob.match(/\d\d\.?\d?/)[0]) - parseFloat(a.final_prob.match(/\d\d\.?\d?/)[0]));
  }
  
  // === PRIVATE METHODS ===================================================

  private authorizeUser () {
    let isLoggedIn: any = this.authService.isUserLoggedIn();
    let tool: string = "nba-dk-optimizer"

    this.dataService.get_tool(tool).subscribe(
      (res: any) => {
        this.isAuthorized = (res.meta.code === 200);
      },
      (err) => {
        this.isAuthorized = false;
      },
      ()  => {}
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

}