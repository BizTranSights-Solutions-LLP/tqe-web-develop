import { Component, OnInit } from '@angular/core';
import { SeoService } from '../../../services/seo.service';
import { HelperService } from '../../../services/helper.service';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
declare const fbq: any;
@Component({
  selector: 'app-nba',
  templateUrl: './nba.component.html',
  styleUrls: ['./nba.component.css']
})
export class NbaComponent implements OnInit {
  Experts:Array<{ name: string, bio: string, avatar: string, tool: string[], button_text:string}> = [
    {
      name: 'Stefano Vaccarino NBA Product Manager ', 
      bio: "<p>Stefano Vaccarino is the NBA Product Manager for The Quant Edge. Formerly known as Rotodamus NBA on Twitter, Stefano provides consistently accurate NBA insights and predictions. His perception of the game and understanding of analytics allows him to identify profitable NBA DFS and Betting opportunities. </p>", 
      avatar: 'stefano.jpg', 
      tool: ['NBA'],
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
      name: ' Alex Blickle ', 
      bio: "<p>A GPP specialist with degrees in Mathematics and Economics, Alex uses analytics and smart bankroll management to gain the edge on the competition with multiple GPP wins in the 2019 NBA DFS season alone. While his focus in DFS is in NBA, Alex is also a professional golfer currently competing on the Florida Elite Tour. </p>", 
      avatar: 'bg-avatar.png', 
      tool: ['NBA'],
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
