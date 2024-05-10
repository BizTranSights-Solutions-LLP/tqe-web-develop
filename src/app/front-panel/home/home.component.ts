import {Component, OnInit, NgZone, ViewChild} from '@angular/core';
import {OwlCarousel} from 'ngx-owl-carousel';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import {ModalDirective} from 'ngx-bootstrap/modal';
import {SeoService} from '../../services/seo.service';
import {DataService} from '../../services/data.service';
import {HelperService} from '../../services/helper.service';
import {environment} from '../../../environments/environment';
import {BestBetsService} from '../best-bets/best-bets.service';

declare const fbq: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  allTools: any = [];
  errorMessage: string = '';
  loading: boolean = false;
  curr_season_prediction: any;
  past_season_prediction: any;
  prediction_data: any = [];
	loggedIn : boolean = false;
  bigTab: string = 'betting';

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
  expertsList: Array<{ id: number, name: string, img: string }> = [
    {id: 1, name: '- Eliot Crist', img: '../../assets/images/experts/eliot_crist.jpg'},
    {id: 2, name: '- John Proctor', img: '../../assets/images/experts/johnproctor.jpg'},
    {id: 3, name: '- Ryan Hodge', img: '../../assets/images/experts/ryanhodge.jpg'},
    {id: 4, name: '- Stefano Vaccarino', img: '../../assets/images/experts/stefano.jpg'},
    {id: 5, name: '- Joe Pisapia', img: '../../assets/images/experts/joe-pisapia.jpg'},
    {id: 6, name: '- Matthew Hill', img: '../../assets/images/experts/matthewhill.jpg'},
    {id: 7, name: '- Tom Brolley', img: '../../assets/images/experts/tombrolley.jpg'},
    {id: 8, name: '- Jason Bales', img: '../../assets/images/experts/jasonbales.jpg'},
    {id: 9, name: '- Alex Blickle', img: '../../assets/images/bg-avatar.png'},
    {id: 10, name: '- Chris Meaney', img: '../../assets/images/experts/chris_meany_headshot.jpg'},
    {id: 11, name: '- Connor Allen', img: '../../assets/images/experts/connor_allen.jpg'},
    {id: 12, name: '- Matthew DIckason', img: '../../assets/images/experts/matthew_dIckason.jpg'},
    {id: 13, name: '- Ryan Noonan', img: '../../assets/images/experts/ryan_noonan.jpg'},
    {id: 14, name: '- Mike Cutri', img: '../../assets/images/experts/mike-cutri.jpg'},
    {id: 15, name: '- Derek Brown', img: '../../assets/images/experts/derek_brown.jpg'},
    {id: 16, name: '- Steve Buchannan', img: '../../assets/images/experts/steve_buchannan.jpg'},
    {id: 17, name: '- Joe Paeno', img: '../../assets/images/experts/joepaeno.jpg'},
    {id: 18, name: '- Brian Entrekin', img: '../../assets/images/experts/Brian_E.jpg'},
    {id: 19, name: '- John Owning ', img: '../../assets/images/experts/john-owning.jpg'},
    {id: 20, name: '- Matt Lo', img: '../../assets/images/experts/matt_lo.jpg'},
    {id: 21, name: '- Tyler Beard', img: '../../assets/images/experts/tyler-beard.jpg'},
    {id: 22, name: '- Brad Reyes ', img: '../../assets/images/experts/bradreyes.jpg'},
  ];

  hideContentMobile = false;

  @ViewChild('autoShownModal') autoShownModal: ModalDirective;
  isModalShown = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private ngZone: NgZone,
    private seoService: SeoService,
    private dataService: DataService,
    private helperService: HelperService,
    private plumber: BestBetsService
  ) {
    if (this.authService.isUserLoggedIn()) {
      this.router.navigate(['landing']);
    }

    window.onresize = (e) => {
      // ngZone.run will help to run change detection
      this.ngZone.run(() => {
        // console.log("Header---Width: " + window.innerWidth);
        // console.log("Header---Height: " + window.innerHeight);
      });
      if (window.innerWidth > 767) {
        this.hideContentMobile = true;
      } else {
        this.hideContentMobile = false;
      }

    };

  }

  expertsOpt: any = {
    items: 4,
    dots: false,
    nav: true,
    width: 225,
    margin: 37,
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

  async ngOnInit() {
    this.loading = true;
    this.seoService.updateTitle('Sports Betting Picks by TQE');

    let url = this.router.url;
    url = url.substring(1, url.length);

    try {
      const res: any = await this.helperService.get_meta_tags('home-unauthenticated').toPromise();

      if (res.meta.code === 200) {

        if (!(Array.isArray(res.result.meta_tags))) {
          // tslint:disable-next-line:prefer-const
          let {title, description, keyword} = res.result.meta_tags;
          title = 'Sports Betting Picks by TQE';
          this.seoService.updateSeoTags(title, description, window.location.href, keyword);
        } else if (Array.isArray(res.result.meta_tags) && res.result.meta_tags.length > 0) {
          // tslint:disable-next-line:prefer-const
          let {title, description, keyword} = res.result.meta_tags[0];
          title = 'Sports Betting Picks by TQE';
          this.seoService.updateSeoTags(title, description, window.location.href, keyword);
        }

        if (res.result.fb_pixel_scripts.length > 0) {
          const func = new Function(res.result.fb_pixel_scripts[0]);
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
        this.loading = false;
      },
      (err) => {
        console.log(err);
        this.loading = false;
        if (err.name == 'HttpErrorResponse') {
          this.errorMessage = 'You\'re Offline.';
        }
      }
    );
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

  openClose(key: string) {

    $('.link_1').on('click', function () {
      $(this).closest('li').addClass('active');
    });

    $('.' + key).closest('li').siblings().removeClass('active');
  }

  changeBigTab(tab) {
    this.bigTab = tab;
  }

  showModal(): void {
    window.open('https://www.youtube.com/watch?v=Fano265b8Zc', 'C-Sharpcorner', 'width=700,height=600');
  }

  hideModal(): void {
    this.autoShownModal.hide();
  }

  onHidden(): void {
    this.isModalShown = false;
  }


  tryItFree() {
    this.authService.tryFree.emit(true);
    sessionStorage.setItem('is_trial', '1');
    this.router.navigate(['membership-plan']);
  }

  nottryItFree() {
    this.authService.tryFree.emit(false);
    sessionStorage.setItem('is_trial', '0');
    this.router.navigate(['membership-plan']);
  }

  referLink() {
    // alert("111");
    this.router.navigate(['referral']);
  }
}
