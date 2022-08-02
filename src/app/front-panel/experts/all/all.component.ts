import { Component, OnInit } from '@angular/core';
import { HelperService } from '../../../services/helper.service';
import { Router } from '@angular/router';
import { SeoService } from '../../../services/seo.service';
import { environment } from '../../../../environments/environment';

declare const fbq: any;
@Component({
  selector: 'app-all',
  templateUrl: './all.component.html',
  styleUrls: ['./all.component.css']
})
export class AllComponent implements OnInit {

  
  Experts:Array<{ name: string, bio: string, avatar: string, tool: string[], button_text:string}> = [
    {
      name: 'Eliot Crist Sports Product Manager ', 
      bio: '<p>Eliot is the director of content and product at The Quant Edge. He oversees the NFL product and writes multiple articles, records podcast, and is very active in the NFL chat throughout the entire season. Heard on Sirius XM, previously seen at PFF, 4for4, and Bleacher Report, Eliot combines analytics and film to give you an edge in DFS and betting. He has won over 10 GPPs in his DFS career and you can find him in mid-high stakes single entry and three max NFL GPPs.<p>', 
      avatar: 'eliot_crist.jpg', 
      tool: ['NFL'],
      button_text: 'Ask him a question!'
    },
    {
      name: 'John Proctor', 
      bio: "<p>John is a practicing personal injury attorney, who has been involved with fantasy sports for almost 15 years. He began playing Daily Fantasy Sports with DraftStreet in 2013. Since 2016, John has focused primarily on DFS with the launch of the DFS Power Hour Podcast with Scott Barett of Pro Football Focus. Since Scott's departure from the Podcast in 2017, John and Ryan successfully grew the PHP Podcast into a full scale DFS community with a very active Slack Chat and Livestreaming videocasts. They are now merging their community with the TQE community, to create an even more epic chatroom environment for the 2019 season with TQE's Discord.</p><p>John has been a high volume DFS player since 2017, with over $100K in DFS profits. John has been a profitable NFL, NBA and DFS Tennis player, but he also enjoys playing Nascar, MMA, MLB and PGA DFS. John's primary focus is on High Stakes Single Entry tournaments and Cash Games. </p><p>You can find John on Twitter @JohnProctorDFS, where he is likely fighting with someone who has notified him that he is on the clock in a Bestball draft. </p>", 
      avatar: 'johnproctor.jpg', 
      tool: ['NFL'],
      button_text: 'Get some advice!'
    },
    {
      name: ' Ryan Hodge ', 
      bio: "<p>Ryan has been playing DFS since the DraftStreet and DailyJoust days. He has always specialized in NFL and took second place in the 2016 DraftKings King of The Beach live final in the Bahamas. He has been a top​-five​ ranked MLB and NFL ​DFS player on FantasyPros since 2014. Formerly of Powerhour, Hodge brings his community and knowledge to TQE starting in 2019! </p>", 
      avatar: 'ryanhodge.jpg', 
      tool: ['NFL'],
      button_text: 'Get some advice!'
    },
    {
      name: 'Stefano Vaccarino NBA Product Manager ', 
      bio: "<p>Stefano Vaccarino is the NBA Product Manager for The Quant Edge. Formerly known as Rotodamus NBA on Twitter, Stefano provides consistently accurate NBA insights and predictions. His perception of the game and understanding of analytics allows him to identify profitable NBA DFS and Betting opportunities. </p>", 
      avatar: 'stefano.jpg', 
      tool: ['NBA'],
      button_text: 'Get some advice!'
    },
    {
      name: ' Chris Meaney NHL Product Manager ', 
      bio: '<p>Chris Meaney is a DFS contributor for The Quant Edge, covering fantasy sports. Chris covered NHL, NBA, NFL and MLB as the producer, writer and host at FNTSY Sports Network. He was lead host of the daily live shows, "Fantasy Sports Toda" and "Home Ice Advantage." Chris has written for The Athletic, the Associated Press, the New York Daily News, Fantasy Footballers, NBA Fantasy, Play Picks, Fantrax and more. @chrismeaney. </p>', 
      avatar: 'chris_meany_headshot.jpg', 
      tool: ['MLB', 'NHL'],
      button_text: 'Ask him a question!'
    },
    {
      name: ' Connor Allen ', 
      bio: '<p>Connor Allen utilizes analytics and his knowledge of football to leverage sportsbooks, fantasy leagues, and DFS. He writes a weekly player prop column for TQE and hit at a 57.7% clip in 2018. He also predicted UVA as the winner of the NCAA tournament in his pre-tournament bracket and betting article. He is a Chicago native and you can find more of his work over at Rotoworld.com or on twitter @ConnorAllenNFL. </p>', 
      avatar: 'connor_allen.jpg', 
      tool: ['NFL'],
      button_text: 'Get some advice!'
    },
    {
      name: ' Matthew Dickason ', 
      bio: '<p>Matt contributes in multiple sports at TQE. He specializes in single entry and three entry max game types in DFS for both MLB and NFL. He has been playing DFS for four years now and has won multiple GPPs. His most recent big score was a five-figure win in the NFL Playoffs. He also covers NCAA basketball betting, where he went 422-373 (53%) in the ‘18-‘19 season, including 15-10 in posted picks during March Madness (60%). You can follow Matt on Twitter @MattydTQE. </p>', 
      avatar: 'matthew_dIckason.jpg', 
      tool: ['NFL','MLB','NCAAB'],
      button_text: 'Ask him a question!'
    },
    {
      name: 'Ryan Noonan ', 
      bio: '<p>Ryan Noonan utilizes analytics and his knowledge of football to leverage sportsbooks, fantasy leagues, and DFS. He hit 68% of his picks in his 2018 NFL Totals articles and is the host of our move the line podcast. You can find more of him @RyNoonan and @MoveTheLineTQE on Twitter. </p>', 
      avatar: 'ryan_noonan.jpg', 
      tool: ['NFL'],
      button_text: 'Get some advice!'
    },
    {
      name: 'Mike Cutri CBB Product Manager', 
      bio: '<p>Mike Cutri is a former DIII collegiate basketball player and 1,000 point scorer. Mike’s focus is exclusively on CBB DFS where he uses his knowledge of the game and an advanced statistical approach to gain a competitive advantage. Over 5+ years, Mike has racked up 10+ GPP wins and qualified for the DraftKings March Mania twice. He primarily focuses on Draftkings, where his DFS handle is DaReelIMC. </p>', 
      avatar: 'mike-cutri.jpg', 
      tool: ['NCAAB'],
      button_text: 'Ask him a question!'
    },
    {
      name: ' Derek Brown ', 
      bio: "<p>Derek also writes for Gridiron Experts, Fantasy Data, & is a co-author of the 2019 Fantasy Football Black Book. He's weekly guest on Sirius Fantasy Sports Radio and expert consensus ranker at FantasyPros. Born in Louisiana, he is a diehard Saints fan. </p>", 
      avatar: 'derek_brown.jpg', 
      tool: ['NFL'],
      button_text: 'Get some advice!'
    },
    {
      name: ' Steve Buchanan ', 
      bio: "<p>After spending a number of years in the poker world, Steve shifted his full attention to fantasy sports and sports betting. For over six years, Steve has focused on those subjects, which have given him an immense amount of opportunities including hosting his own fantasy sports radio show in the Boston area and having his written work appear on the New England Patriots’ website. Aside from the Quant Edge, Steve also writes for DraftKings and appears on DK Live as well as their nightly show “The Sweat.” He’s also appeared on platforms like ESPN Radio, Sirius XM radio and SNY Network in New York. Steve focuses on daily fantasy baseball, football and betting on team totals </p>", 
      avatar: 'steve_buchannan.jpg', 
      tool: ['MLB'],
      button_text: 'Ask him a question!'
    },
    {
      name: 'Joe Paeno ', 
      bio: '<p>Joe Paeno is a contrarian with a growth mindset. During the "offseason" he spends all of his free time grinding film, pouring over statistics, and looking for edges for the upcoming season. From March to August he leverages those edges for best ball leagues – in which he has profited the last three years and has averaged a 64.5% ROI over the last two.<br> Once the season begins, he uses his naturally contrarian mindset to find low owned DFS tournament plays. In 2018, he broke down the primetime slates for TQE subscribers with his podcast “Prime Time Process” and brought in a 38.57% ROI. </p>', 
      avatar: 'joepaeno.jpg', 
      tool: ['NFL'],
      button_text: 'Get some advice!'
    },
    {
      name: 'Brian Entrekin ', 
      bio: "<p>Brian has been playing fantasy sports, and more importantly fantasy baseball for over a decade. He’s been playing DFS for 4 years now, and this will be his 4th season recording MLB DFS Quick Hits. He runs and writes for FantasySportsDegens. He records many podcasts including Benched with Bubba, Around the Bases with Bubba & Mo, Always Pressing PGA DFS POD and the 2 Point Conversion NFL DFS POD. You can contact him on Twitter @bdentrek. </p>", 
      avatar: 'Brian_E.jpg', 
      tool: ['MLB'],
      button_text: 'Ask him a question!'
    },
    {
      name: ' John Owning (Editor) ', 
      bio: "<p>John Owning is the editor here at The Quant Edge. He is an ASU graduate and current Galt, California resident. When he is not teaching Brazilian Jiu-Jitsu, he is usually knee-deep in some NFL or NCAA football tape. He has written for Bleacher Report and Football Insiders, and was also the lead NFL content editor at FanRag Sports. </p>", 
      avatar: 'john-owning.jpg', 
      tool: ['NFL'],
      button_text: 'Get some advice!'
    },
    {
      name: ' Matt Lo MLB ', 
      bio: "<p>Matt is a MLB contributor for The Quant Edge, specifically covering pitching regression. After graduating from Rutgers University, Matt gained six years of game theory and risk management experience as a professional poker player which helped him win several single entry MLB GPPs on FanDuel and Draftkings. With the knowledge acquired through his Master’s education in Business Analytics and current work experience with FanDuel, Matt hopes to show you how impactful predictive analysis can be in sports. During his leisure time, Matt enjoys watching the Mets blow late leads, pigging out on cookies and pizza, napping, and searching for underrated diners. </p>", 
      avatar: 'matt_lo.jpg', 
      tool: ['MLB'],
      button_text: 'Ask him a question!'
    },
    {
      name: ' Tyler Beard UFC Product Manager ', 
      bio: "<p>Co-host of the Brews and Bets podcast // Winner of the 1st ever Draftkings UFC VIP Tourney // 2016 Fanduel MLB Playboy Finalist // Fantasy Aces NFL Champion </p>", 
      avatar: 'tyler-beard.jpg', 
      tool: ['UFC'],
      button_text: 'Get some advice!'
    },
    {
      name: 'Brad Reyes ', 
      bio: '<p>Brad Reyes is a snake-draft and auction specialist, coach and the co-host of two podcasts devoted to the subject: "DRAFT Strateg" on TQE and "Best Ball Owners Manual". He has a combined ROI of over 125% on the DRAFT site in baseball, football, and basketball. Hit him up for draft advice in the chat and check him out on twitter @MeanMrMode. </p>', 
      avatar: 'bradreyes.jpg', 
      tool: ['NFL', 'NBA'],
      button_text: 'Get some advice!'
    },
    {
      name: ' Joe Pisapia MLB Contributor ', 
      bio: '<p><b>Joe Pisapia</b><i>is the author of the #1 best-selling </i><b><i>Fantasy Black Book Series</i></b><i> and creator of the revolutionary player evaluation tool </i><b><i>Relative Position Value</i></b><i> (RPV). He currently hosts </i><b><i>The Fantasy Black Book Podcast</i></b><i>, </i><b><i>The Pre-Snap NFL DFS Podcast</i></b><i> and </i><b><i>The On Deck MLB DFS Podcast</i></b><i> for </i><b><i>LineStarApp</i></b><i>. Joe is also a senior fantasy columnist for </i><b><i>Fantrax </i></b><i>covering NFL and MLB. He’s a former radio host for </i><b><i>Sirius XM Fantasy Sports Radio</i></b><i>, and </i><b><i>FNTSY Radio</i></b><i> where he won the Fantasy Sports Radio Show of The Year Award (FSTA 2016). He appears frequently on </i><b><i>CBS TV NY on The Sports Desk Show</i></b><i>. He’s also worked for </i><b><i>RotoWire, The Sporting News</i></b><i>, </i><b><i>FanDuel Insider</i></b><i> and </i><b><i>FantasyAlarm</i></b><i>.</i></p>', 
      avatar: 'joe-pisapia.jpg', 
      tool: ['NFL', 'MLB'],
      button_text: 'Get some advice!'
    },
    {
      name: ' Matthew Hill ', 
      bio: `<p>Writing and providing draft and in-season rankings since 2014, Matthew Hill was named FantasyPros "Most Accurate Expert" for 2018. In addition to his 2018 first place in-season accuracy finish, Matthew's draft rankings are amongst the most accurate in the industry, finishing 13th overall for the years 2013-2017. </p><p>While he loves fantasy in all its forms, Matthew particularly enjoys best-ball, auctions, and DFS. There is not a day in the offseason where Matthew is not taking part in at least one best-ball draft across multiple platforms. </p><p>Matthew is a father of four, San Diego native and resides in Houston, Texas. You can find him on Twitter @mrhill9169 </p>`, 
      avatar: 'matthewhill.jpg', 
      tool: ['NFL'],
      button_text: 'Get some advice!'
    },
    {
      name: ' Tom Brolley ', 
      bio: "<p>Tom Brolley is a contributing betting and fantasy writer for The Quant Edge. He started in the fantasy industry back in 2012, working the previous seven seasons at Fantasy Guru before joining TQE for the 2019 season. Brolley owned a 53.8% winning percentage picking every game against the spread for his old site over the last two seasons. He also finished 10th out of 900 players in the regular season of the 2018 Scott Fish Bowl. Be sure to follow him on Twitter at @TomBrolley. </p>", 
      avatar: 'tombrolley.jpg', 
      tool: ['NFL'],
      button_text: 'Get some advice!'
    },
    {
      name: ' Jason Bales ', 
      bio: "<p>Jason Bales is an avid sports enthusiast. He has been writing professionally in the daily fantasy sports and sports betting industries since 2012. In 2016, he earned his B.A. degree in philosophy from Albright NCAA, and in 2019, he earned his M.A. degree in the same subject from West Chester University. Not only has his education provided him with excellent writing skills, but his unique philosophically-informed stance toward DFS and betting leans heavily on analytic reasoning and critical thinking. </p>", 
      avatar: 'jasonbales.JPG', 
      tool: ['UFC'],
      button_text: 'Get some advice!'
    },
    {
      name: ' Alex Blickle ', 
      bio: "<p>A GPP specialist with degrees in Mathematics and Economics, Alex uses analytics and smart bankroll management to gain the edge on the competition with multiple GPP wins in the 2019 NBA DFS season alone. While his focus in DFS is in NBA, Alex is also a professional golfer currently competing on the Florida Elite Tour. </p>", 
      avatar: 'bg-avatar.png', 
      tool: ['NBA'],
      button_text: 'Get some advice!'
    }
  ]


  constructor(  private seoService: SeoService, private helperService: HelperService, private router: Router) { }

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
