import {Component, OnInit, ViewChild} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap/modal';
import {SeoService} from '../../services/seo.service';
import {DataService} from '../../services/data.service';
import {ToolsServiceService} from '../../services/tools-service.service';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import {HelperService} from '../../services/helper.service';
import {environment} from '../../../environments/environment';
import {BestBetsService} from '../best-bets/best-bets.service';

declare const fbq: any;

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['../landing/landing.component.scss']
})
export class LandingComponent implements OnInit {
  @ViewChild('tourGuide') tourGuide: ModalDirective;
  allTools: any = [];
  membership: any = [];
  nfl_best_bets: any = [];
  nba_best_bets: any = [];
  mlb_best_bets: any = [];
  curr_season_prediction: any;
  past_season_prediction: any;
  prediction_data: any = [];
	loggedIn : boolean = false;
  serverErrors: string = '';
  loader: boolean = true;
  bigTab: string = 'betting';

  onPageLoad: boolean = false;
  Tools: any = [
    {link: '/tool/nba-dk-optimizer', title: 'NBA DK Optimizer', short_description: 'Build up to 150 NBA DK Lineups in Minutes!'},
    {link: '/tool/nba-fd-optimizer', title: 'NBA FD Optimizer', short_description: 'Build up to 150 NBA FD Lineups in Minutes!'},
    {link: '/tool/nba-player-injury', title: 'NBA Player Impact - Individual', short_description: 'Player Effects on Players'},
    {link: '/tool/injury-tool-team', title: 'NBA Player Impact - Team', short_description: 'Player Effects on Teams'},
    {link: '/tool/mlb-lineups-weather', title: 'MLB Lineups and Weather', short_description: 'Daily Lineups and Weather Updates'},
    {link: '/tool/mlb-advanced-stats', title: 'MLB Advanced Stats Dashboard', short_description: 'See Advanced MLB Metrics'},
    {link: '/tool/injury-impact', title: 'NFL INJURY IMPACT', short_description: 'Exclusive TQE Injury Information'},
    {link: '/tool/wr-cb-matchup', title: 'WR/CB MATCHUPS', short_description: 'In Depth, Exclusive Matchups'},
  ];
  Players: Array<{ id: number, p1: string, p2: string }> = [
    {id: 1, p1: '../../../assets/images/tool_1.png', p2: '../../../assets/images/tool_2.png'},
    {id: 2, p1: '../../../assets/images/tool_3.png', p2: '../../../assets/images/tool_4.png'},
    {id: 3, p1: '../../../assets/images/tool_5.png', p2: '../../../assets/images/tool_6.png'},
    {id: 4, p1: '../../../assets/images/tool_4.png', p2: '../../../assets/images/tool_2.png'},
  ];

  constructor(
    private seoService: SeoService,
    private dataService: DataService,
    private tools: ToolsServiceService,
    private authService: AuthService,
    private router: Router,
    private plumber: BestBetsService,
    private helperService: HelperService) {
  }


  toolsOpt: any = {
    items: 4,
    dots: false,
    nav: true,
    width: 320,
    touchDrag: true,
    navElement: 'div',
    responsive: {
      0: {
        items: 1,
        margin: 0
      },
      400: {
        items: 2
      },
      740: {
        items: 3
      },
      940: {
        items: 4
      }
    },
  };

  toolslistOpt: any = {
    items: 3,
    autoplay: true,
    center: true,
    dots: false,
    nav: true,
    width: 450,
    marign: 10,
    touchDrag: true,
    navElement: 'div',
    responsive: {
      0: {
        items: 1,
        margin: 0
      },
      400: {
        items: 1,
        margin: 0
      },
      740: {
        items: 2
      },
      940: {
        items: 3
      }
    },
  };

  async ngOnInit() {

    this.seoService.updateTitle('Sports Betting Picks by TQE');

    let url = this.router.url;
    url = url.substring(1, url.length);

    try {
      let res: any = await this.helperService.get_meta_tags('home').toPromise();
      console.log('in try, res is', res);

      if (res.meta.code === 200) {

        if (!(Array.isArray(res.result.meta_tags))) {
          let {title, description, keyword} = res.result.meta_tags;
          title = 'Sports Betting Picks by TQE';
          this.seoService.updateSeoTags(title, description, window.location.href, keyword);
        } else if (Array.isArray(res.result.meta_tags) && res.result.meta_tags.length > 0) {
          let {title, description, keyword} = res.result.meta_tags[0];
          title = 'Sports Betting Picks by TQE';
          this.seoService.updateSeoTags(title, description, window.location.href, keyword);
        }

        if (res.result.fb_pixel_scripts.length > 0) {
          let func = new Function(res.result.fb_pixel_scripts[0]);
          if (environment.production) {
            func();
          }
        }
      }
    } catch (e) {
    }
    this.dataService.get_all_tools(8).subscribe(
      (res: any) => {
        this.allTools = res.result.tool_data;
      },
      (err) => {
        console.log(err);
      }
    );
    this.tools.get_nfl_best_bets_game().subscribe(
      (res: any) => {
        this.nfl_best_bets = res[1];
      },
      (err) => {
        console.log(err);
      }
    );
    this.tools.get_nba_best_bets_game().subscribe(
      (res: any) => {
        this.nba_best_bets = res[1];
      },
      (err) => {
        console.log(err);
      }
    );
    this.tools.get_mlb_best_bets_game().subscribe(
      (res: any) => {
        this.mlb_best_bets = res[1];
      },
      (err) => {
        console.log(err);
      }
    );
    this.get_user_data();
    this.getHomepageData();
	
	
	if(this.authService.isUserLoggedIn() == true){
      this.loggedIn = true;
    }
    else{
      this.loggedIn = false;
    }

  }
	
  



  private getHomepageData() {
    this.prediction_data = [];
    this.plumber.getHomePageData().subscribe(
      res => {
        for (let i in res) {
          this.prediction_data.push(res[i]);
        }
        console.log('prediction_data after push is,', this.prediction_data);
        this.past_season_prediction = this.prediction_data[0]['past player impact tool'];
        this.curr_season_prediction = this.prediction_data[0]['current season'];

        console.log('past_season_prediction is: ', this.past_season_prediction);
        console.log('this.curr_season_prediction is: ', this.curr_season_prediction);
      },
      (error) => {
        console.log('homepage prediction data api failed');
        console.log('Error msg is:', error);
      },
      () => {
      }
    );


  }

  async get_user_data() {

    let data: any;
    try {
      data = await this.dataService.get_user_information().toPromise();
      this.membership = data.result.memberships_users;
      this.loader = false;
    } catch (e) {
      if (e.status === 401 || e.error.message === 'Unauthenticated.') {
        this.serverErrors = 'You are UnAuthenticated. Please login again!';

        setTimeout(() => {
          this.authService.logoutEvent.emit(true);
          localStorage.clear();
          sessionStorage.clear();

          this.router.navigate(['/']);

        }, 1000);
      }
    }
  }

  changeBigTab(tab) {
    this.bigTab = tab;
  }

  showModal(): void {
    window.open('https://www.youtube.com/watch?v=Fano265b8Zc', 'C-Sharpcorner', 'width=700,height=600');
  }

  goToBestBets() {
    this.router.navigate(['tool/best-bets/nfl']);
  }

  goToFantasy() {
    this.router.navigate(['fantasy']);
  }

  nottryItFree() {
    this.authService.tryFree.emit(false);
    sessionStorage.setItem('is_trial', '0');
    this.router.navigate(['membership-plan']);
  }

  referLink() {
    // alert('111');
    this.router.navigate(['referral']);
  }

}
