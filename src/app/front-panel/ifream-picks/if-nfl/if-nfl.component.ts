import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {DataService} from '../../../services/data.service';
import {AuthService} from '../../../services/auth.service';
import {AngularBootstrapToastsService} from 'angular-bootstrap-toasts';
import {Router} from '@angular/router';
import * as moment from 'moment';
import {BestBetsService} from '../../best-bets/best-bets.service';

@Component({
  selector: 'app-if-nfl',
  templateUrl: './if-nfl.component.html',
  styleUrls: ['./if-nfl.component.scss']
})
export class IfNflComponent implements OnInit {
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
  games_this_week: any[] = [];
  loading = true;
  isAuthorized = true;
  gameDate: string;
  finalDate: string;
  sortBy = 'rating';
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
      // tslint:disable-next-line:max-line-length
      this.games = this.games.sort((a, b) => parseFloat(b.final_prob.match(/\d\d\.?\d?/)[0]) - parseFloat(a.final_prob.match(/\d\d\.?\d?/)[0]));
      if (this.sortDir[this.sortBy]) {
        this.games.reverse();
      }

      this.sortDir[this.sortBy] = !this.sortDir[this.sortBy];
    }
  }

  // === PRIVATE METHODS ===================================================

  private authorizeUser() {
    const tool = 'nba-dk-optimizer';

    this.dataService.get_tool(tool).subscribe(
      (res: any) => {

        console.log(res);

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


  private getData() {
    this.games = [];
    // this.games_today = [];
    this.gameDate = moment().format('dddd, MMMM Do, YYYY');
    this.games_this_week = [];
    this.plumber.getIfNflTable().subscribe(
      win => {
        for (const i in win) {
          this.games.push(win[i]);
        }
        this.games.forEach(g => {
          g.local_start_time = moment(g.schedule).format('MMM D YYYY, HH:mm');
          g.started = (moment(g.schedule) < moment());
          g.ml_pick = g.moneyline_pick;
          g.sp_pick = g.spread_pick;
          g.ou_pick = g.total_pick;
          g.week = g.week;
          this.games_this_week.push(g);
        });
        this.nflWeek = this.games_this_week[0].week;
        this.games_this_week = this.games_this_week.filter(game => (game.week === this.nflWeek));
      },
      fail => {
      },
      () => {
        this.games = this.games.filter(game => !(game.week === this.nflWeek));
      },
    );
  }

}

