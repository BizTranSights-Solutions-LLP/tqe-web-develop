import { Component, OnInit } from '@angular/core';
import { SeoService } from '../../../services/seo.service';
import { HelperService } from '../../../services/helper.service';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
declare const fbq: any;
@Component({
  selector: 'app-nfl',
  templateUrl: './nfl.component.html',
  styleUrls: ['./nfl.component.css']
})
export class NflComponent implements OnInit {
  Experts:Array<{ name: string, bio: string, avatar: string, tool: string[], button_text:string}> = [
    {
      name: 'Eliot Crist Sports Product Manager ', 
      bio: '<p>Eliot is the director of content and product at The Quant Edge. He oversees the NFL product and writes multiple articles, records podcast, and is very active in the NFL chat throughout the entire season. Heard on Sirius XM, previously seen at PFF, 4for4, and Bleacher Report, Eliot combines analytics and film to give you an edge in DFS and betting. He has won over 10 GPPs in his DFS career and you can find him in mid-high stakes single entry and three max NFL GPPs.<p>', 
      avatar: 'eliot_crist.jpg', 
      tool: ['NFL'],
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
      name: ' Derek Brown ', 
      bio: "<p>Derek also writes for Gridiron Experts, Fantasy Data, & is a co-author of the 2019 Fantasy Football Black Book. He's weekly guest on Sirius Fantasy Sports Radio and expert consensus ranker at FantasyPros. Born in Louisiana, he is a diehard Saints fan. </p>", 
      avatar: 'derek_brown.jpg', 
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
      name: ' John Owning (Editor) ', 
      bio: "<p>John Owning is the editor here at The Quant Edge. He is an ASU graduate and current Galt, California resident. When he is not teaching Brazilian Jiu-Jitsu, he is usually knee-deep in some NFL or NCAA football tape. He has written for Bleacher Report and Football Insiders, and was also the lead NFL content editor at FanRag Sports. </p>", 
      avatar: 'john-owning.jpg', 
      tool: ['NFL'],
      button_text: 'Get some advice!'
    },
    {
      name: 'Joe Paeno ', 
      bio: '<p>Joe Paeno is a contrarian with a growth mindset. During the "offseason" he spends all of his free time grinding film, pouring over statistics, and looking for edges for the upcoming season. From March to August he leverages those edges for best ball leagues – in which he has profited the last three years and has averaged a 64.5% ROI over the last two.<br> Once the season begins, he uses his naturally contrarian mindset to find low owned DFS tournament plays. In 2018, he broke down the primetime slates for TQE subscribers with his podcast “Prime Time Process” and brought in a 38.57% ROI. </p>', 
      avatar: 'joepaeno.jpg', 
      tool: ['NFL'],
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
      name: 'John Proctor', 
      bio: "<p>John is a practicing personal injury attorney, who has been involved with fantasy sports for almost 15 years. He began playing Daily Fantasy Sports with DraftStreet in 2013. Since 2016, John has focused primarily on DFS with the launch of the DFS Power Hour Podcast with Scott Barett of Pro Football Focus. Since Scott's departure from the Podcast in 2017, John and Ryan successfully grew the PHP Podcast into a full scale DFS community with a very active Slack Chat and Livestreaming videocasts. They are now merging their community with the TQE community, to create an even more epic chatroom environment for the 2019 season with TQE's Discord.</p><p>John has been a high volume DFS player since 2017, with over $100K in DFS profits. John has been a profitable NFL, NBA and DFS Tennis player, but he also enjoys playing Nascar, MMA, MLB and PGA DFS. John's primary focus is on High Stakes Single Entry tournaments and Cash Games. </p><p>You can find John on Twitter @JohnProctorDFS, where he is likely fighting with someone who has notified him that he is on the clock in a Bestball draft. </p>", 
      avatar: 'johnproctor.jpg', 
      tool: ['NFL'],
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
