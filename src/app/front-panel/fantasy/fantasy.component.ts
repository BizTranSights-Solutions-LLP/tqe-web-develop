import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { SeoService } from '../../services/seo.service';
import { DataService } from '../../services/data.service';
import { ToolsServiceService } from '../../services/tools-service.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { HelperService } from '../../services/helper.service';
declare const fbq: any;

@Component({
  selector: 'app-fantasy',
  templateUrl: './fantasy.component.html',
  styleUrls: ['./fantasy.component.scss']
})
export class FantasyComponent implements OnInit {

  @ViewChild('tourGuide') tourGuide: ModalDirective;
    allTools:any = [];
    membership:any = [];
    nfl_best_bets:any = [];
    nba_best_bets:any = [];
    mlb_best_bets:any = [];

    serverErrors: string = '';
    loader: boolean = true;

    onPageLoad: boolean = false;
    Tools:Array<{id: number, name: string, desc: string, img: string}> = [
      {id: 1, name: 'NFL PLAYER IMPACT', desc: 'The Power to change the Odds', img: '../../../assets/images/placeholder.png'},
      {id: 2, name: 'NFL BEST BETS', desc: 'Win Rate 66.7%', img: '../../../assets/images/placeholder.png'},
      {id: 3, name: 'NFL INJURY IMPACT', desc: 'Exclusive TQE Injury Information', img: '../../../assets/images/placeholder.png'},
      {id: 4, name: 'WR/CB MATCHUPS', desc: 'In Depth, Exclusive Matchups', img: '../../../assets/images/placeholder.png'},
      {id: 5, name: 'Parlay Calculator', desc: 'Bet Smart! Win Big!', img: '../../../assets/images/placeholder.png'},
      {id: 6, name: 'NBA ADVANCED DVP', desc: 'Get Matchups by Player Type', img: '../../../assets/images/placeholder.png'},
      {id: 7, name: 'EVERY GAME, EVERY PICK', desc: 'NFL, NBA, MLB, and NCAAB', img: '../../../assets/images/placeholder.png'},
      {id: 8, name: 'NFL FD Optimizer', desc: 'Build up to 150 NFL FD Lineups in Minutes!', img: '../../../assets/images/placeholder.png'},

      {id: 9, name: 'NFL DK Optimizer', desc: 'Build up to 150 NFL DK Lineups in Minutes!', img: '../../../assets/images/placeholder.png'},
      {id: 10, name: 'Head to Head Player Comparison', desc: 'Compare NFL Players Strengths and Weaknesses ', img: '../../../assets/images/placeholder.png'},
      {id: 11, name: 'NBA FD Optimizer', desc: 'Build up to 150 NBA FD Lineups in Minutes!', img: '../../../assets/images/placeholder.png'},
      {id: 12, name: ' NBA FD Optimizer', desc: 'Build up to 150 NBA DK Lineups in Minutes!', img: '../../../assets/images/placeholder.png'},
      {id: 13, name: 'NBA Player Impact - Team', desc: 'Player Effects on Team', img: '../../../assets/images/placeholder.png'},
      {id: 14, name: 'NBA Player Impact - Individual', desc: 'Player Effects on Players', img: '../../../assets/images/placeholder.png'},
      {id: 15, name: 'Back to Back', desc: 'NBA Schedule Impacts', img: '../../../assets/images/placeholder.png'},
      {id: 16, name: 'Player Performance vs Team', desc: 'Historical Player Performances', img: '../../../assets/images/placeholder.png'},
      {id: 17, name: 'MLB FD Optimizer', desc: 'Build up to 150 MLB FD Lineups in Minutes!', img: '../../../assets/images/placeholder.png'},
      {id: 18, name: 'MLB DK Optimizer', desc: 'Build up to 150 MLB DK Lineups in Minutes!', img: '../../../assets/images/placeholder.png'},
      {id: 19, name: 'MLB Lineups and Weather', desc: 'Daily Lineups and Weather Updates', img: '../../../assets/images/placeholder.png'},
      {id: 20, name: 'MLB Park Factors', desc: 'Stadium Impacts', img: '../../../assets/images/placeholder.png'},
      {id: 21, name: 'MLB Line Movement', desc: 'MLB Vegas Line Movement', img: '../../../assets/images/placeholder.png'},
      {id: 22, name: 'MLB Advanced Stats Dashboard', desc: 'See Advanced MLB Metrics', img: '../../../assets/images/placeholder.png'},
      {id: 23, name: 'MLB Site Price Comparison', desc: 'Compare FD + DK Salaries ', img: '../../../assets/images/placeholder.png'},
      {id: 24, name: 'Umpire Factors', desc: 'Umpire Impacts', img: '../../../assets/images/placeholder.png'},
      {id: 25, name: 'Bullpen Factors', desc: 'In-depth Bullpen Analysis', img: '../../../assets/images/placeholder.png'},
      {id: 26, name: 'UFC DK Optimizer', desc: 'Build up to 150 UFC DK Lineups in Minutes ', img: '../../../assets/images/placeholder.png'},
      {id: 27, name: 'NBA Moneyline', desc: 'Find the best ML values ', img: '../../../assets/images/placeholder.png'},
      {id: 28, name: 'NCAA Moneyline', desc: 'Find the best ML values ', img: '../../../assets/images/placeholder.png'},
      {id: 29, name: 'NBA Picks', desc: 'Every Pick on Every NBA Game', img: '../../../assets/images/placeholder.png'},
      {id: 30, name: 'NBA Best Bets', desc: 'The Day’s Most Likely NBA Winners ', img: '../../../assets/images/placeholder.png'},
      {id: 31, name: 'MLB Picks', desc: 'Every Pick on Every MLB Game', img: '../../../assets/images/placeholder.png'},
      {id: 32, name: 'MLB Best Bets', desc: 'Best Valued MLB Bets of the Day', img: '../../../assets/images/placeholder.png'},
      {id: 33, name: 'NCAAB Picks', desc: 'Every Pick on Every NCAAB Game ', img: '../../../assets/images/placeholder.png'},
      {id: 34, name: 'NCAAB Best Bets', desc: 'The Day’s Most Likely NCAAB Winners ', img: '../../../assets/images/placeholder.png'},
      {id: 35, name: 'NFL Picks', desc: 'Every Pick on Every NFL Game ', img: '../../../assets/images/placeholder.png'},
    ]
    Players:Array<{id: number, p1: string, p2: string}> = [
      {id: 1, p1: '../../../assets/images/tool_1.png', p2: '../../../assets/images/tool_2.png'},
      {id: 2, p1: '../../../assets/images/tool_3.png', p2: '../../../assets/images/tool_4.png'},
      {id: 3, p1: '../../../assets/images/tool_5.png', p2: '../../../assets/images/tool_6.png'},
      {id: 4, p1: '../../../assets/images/tool_4.png', p2: '../../../assets/images/tool_2.png'},
    ]
    
    constructor(
      private seoService:SeoService, 
      private dataService: DataService, 
      private tools: ToolsServiceService, 
      private authService:AuthService,
      private router: Router,
      private helperService: HelperService) { }

  
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
    }

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
    }

    async ngOnInit() {
    
      this.seoService.updateTitle('Sports Betting Picks by TQE');
    
      let url = this.router.url;
      url = url.substring(1, url.length);
    
      try{
        let res: any = await this.helperService.get_meta_tags('home').toPromise();
      
        if(res.meta.code === 200) {

          if(!(Array.isArray(res.result.meta_tags))) {
            let { title, description, keyword } = res.result.meta_tags;
            this.seoService.updateSeoTags(title, description, window.location.href, keyword);
          } else if(Array.isArray(res.result.meta_tags) && res.result.meta_tags.length > 0){
            let { title, description, keyword } = res.result.meta_tags[0];
            this.seoService.updateSeoTags(title, description, window.location.href, keyword);
          }
  
          if(res.result.fb_pixel_scripts.length > 0) {
            let func = new Function(res.result.fb_pixel_scripts[0]);
                func();
          }
        }
      }catch(e) {}
      this.dataService.get_all_tools(8).subscribe(
        (res:any) => {
          this.allTools = res.result.tool_data;
        },
        (err) => {
          console.log(err);
        }
      )
      this.tools.get_nfl_best_bets_game().subscribe(
        (res:any) => {        
          this.nfl_best_bets = res[1];
        },
        (err) => {
          console.log(err);
        }
      )
      this.tools.get_nba_best_bets_game().subscribe(
        (res:any) => {        
          this.nba_best_bets = res[1];
        },
        (err) => {
          console.log(err);
        }
      )
      this.tools.get_mlb_best_bets_game().subscribe(
        (res:any) => {        
          this.mlb_best_bets = res[1];
        },
        (err) => {
          console.log(err);
        }
      )
      this.get_user_data();
    }

    async get_user_data(){

      let data:any;
      try{
        data = await this.dataService.get_user_information().toPromise();
        this.membership = data.result.memberships_users;
        this.loader = false;
      }catch(e) {
        if(e.status === 401 || e.error.message === 'Unauthenticated.') {
          this.serverErrors = 'You are UnAuthenticated. Please login again!';
        
          setTimeout(()=>{
            this.authService.logoutEvent.emit(true);
            localStorage.clear();
            sessionStorage.clear();
          
            this.router.navigate(['/'])
          
          },1000);
        }
      }
    }

}
