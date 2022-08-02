import { Component, OnInit } from '@angular/core';
import { SeoService } from '../../../services/seo.service';
import { HelperService } from '../../../services/helper.service';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
declare const fbq: any;
@Component({
  selector: 'app-mlb',
  templateUrl: './mlb.component.html',
  styleUrls: ['./mlb.component.css']
})
export class MlbComponent implements OnInit {
  Experts:Array<{ name: string, bio: string, avatar: string, tool: string[], button_text:string}> = [
    {
      name: ' Chris Meaney NHL Product Manager ', 
      bio: '<p>Chris Meaney is a DFS contributor for The Quant Edge, covering fantasy sports. Chris covered NHL, NBA, NFL and MLB as the producer, writer and host at FNTSY Sports Network. He was lead host of the daily live shows, "Fantasy Sports Toda" and "Home Ice Advantage." Chris has written for The Athletic, the Associated Press, the New York Daily News, Fantasy Footballers, NBA Fantasy, Play Picks, Fantrax and more. @chrismeaney. </p>', 
      avatar: 'chris_meany_headshot.jpg', 
      tool: ['MLB', 'NHL'],
      button_text: 'Ask him a question!'
    },
    {
      name: ' Matthew Dickason ', 
      bio: '<p>Matt contributes in multiple sports at TQE. He specializes in single entry and three entry max game types in DFS for both MLB and NFL. He has been playing DFS for four years now and has won multiple GPPs. His most recent big score was a five-figure win in the NFL Playoffs. He also covers NCAA basketball betting, where he went 422-373 (53%) in the ‘18-‘19 season, including 15-10 in posted picks during March Madness (60%). You can follow Matt on Twitter @MattydTQE. </p>', 
      avatar: 'matthew_dIckason.jpg', 
      tool: ['NFL','MLB','NCAAB'],
      button_text: 'Ask him a question!'
    },
    {
      name: ' Steve Buchanan ', 
      bio: "<p>After spending a number of years in the poker world, Steve shifted his full attention to fantasy sports and sports betting. For over six years, Steve has focused on those subjects, which have given him an immense amount of opportunities including hosting his own fantasy sports radio show in the Boston area and having his written work appear on the New England Patriots’ website. Aside from the Quant Edge, Steve also writes for DraftKings and appears on DK Live as well as their nightly show “The Sweat.” He’s also appeared on platforms like ESPN Radio, Sirius XM radio and SNY Network in New York. Steve focuses on daily fantasy baseball, football and betting on team totals </p>", 
      avatar: 'steve_buchannan.jpg', 
      tool: ['MLB'],
      button_text: 'Ask him a question!'
    },
    {
      name: 'Brian Entrekin ', 
      bio: "<p>Brian has been playing fantasy sports, and more importantly fantasy baseball for over a decade. He’s been playing DFS for 4 years now, and this will be his 4th season recording MLB DFS Quick Hits. He runs and writes for FantasySportsDegens. He records many podcasts including Benched with Bubba, Around the Bases with Bubba & Mo, Always Pressing PGA DFS POD and the 2 Point Conversion NFL DFS POD. You can contact him on Twitter @bdentrek. </p>", 
      avatar: 'Brian_E.jpg', 
      tool: ['MLB'],
      button_text: 'Ask him a question!'
    },
    {
      name: ' Matt Lo MLB ', 
      bio: "<p>Matt is a MLB contributor for The Quant Edge, specifically covering pitching regression. After graduating from Rutgers University, Matt gained six years of game theory and risk management experience as a professional poker player which helped him win several single entry MLB GPPs on FanDuel and Draftkings. With the knowledge acquired through his Master’s education in Business Analytics and current work experience with FanDuel, Matt hopes to show you how impactful predictive analysis can be in sports. During his leisure time, Matt enjoys watching the Mets blow late leads, pigging out on cookies and pizza, napping, and searching for underrated diners. </p>", 
      avatar: 'matt_lo.jpg', 
      tool: ['MLB'],
      button_text: 'Ask him a question!'
    },
    {
      name: ' Joe Pisapia MLB Contributor ', 
      bio: '<p><b>Joe Pisapia</b><i>is the author of the #1 best-selling </i><b><i>Fantasy Black Book Series</i></b><i> and creator of the revolutionary player evaluation tool </i><b><i>Relative Position Value</i></b><i> (RPV). He currently hosts </i><b><i>The Fantasy Black Book Podcast</i></b><i>, </i><b><i>The Pre-Snap NFL DFS Podcast</i></b><i> and </i><b><i>The On Deck MLB DFS Podcast</i></b><i> for </i><b><i>LineStarApp</i></b><i>. Joe is also a senior fantasy columnist for </i><b><i>Fantrax </i></b><i>covering NFL and MLB. He’s a former radio host for </i><b><i>Sirius XM Fantasy Sports Radio</i></b><i>, and </i><b><i>FNTSY Radio</i></b><i> where he won the Fantasy Sports Radio Show of The Year Award (FSTA 2016). He appears frequently on </i><b><i>CBS TV NY on The Sports Desk Show</i></b><i>. He’s also worked for </i><b><i>RotoWire, The Sporting News</i></b><i>, </i><b><i>FanDuel Insider</i></b><i> and </i><b><i>FantasyAlarm</i></b><i>.</i></p>', 
      avatar: 'joe-pisapia.jpg', 
      tool: ['NFL', 'MLB'],
      button_text: 'Get some advice!'
    }
  ]

  constructor( private seoService: SeoService, private helperService: HelperService, private router: Router) { }

  async ngOnInit() {
    let url = this.router.url;
    url = url.substring(1, url.length);
    
    try{
      let res: any = await this.helperService.get_meta_tags(url).toPromise();
      
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
          if (environment.production) {
            func();
          }
        }
      }
    }catch(e) {}
  }

}
