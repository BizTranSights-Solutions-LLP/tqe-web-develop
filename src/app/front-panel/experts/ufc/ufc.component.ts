import { Component, OnInit } from '@angular/core';
import { SeoService } from '../../../services/seo.service';
import { HelperService } from '../../../services/helper.service';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
declare const fbq: any;
@Component({
  selector: 'app-ufc',
  templateUrl: './ufc.component.html',
  styleUrls: ['./ufc.component.css']
})
export class UfcComponent implements OnInit {
  Experts:Array<{ name: string, bio: string, avatar: string, tool: string[], button_text:string}> = [
    {
      name: ' Tyler Beard UFC Product Manager ', 
      bio: "<p>Co-host of the Brews and Bets podcast // Winner of the 1st ever Draftkings UFC VIP Tourney // 2016 Fanduel MLB Playboy Finalist // Fantasy Aces NFL Champion </p>", 
      avatar: 'tyler-beard.jpg', 
      tool: ['UFC'],
      button_text: 'Get some advice!'
    },
    {
      name: ' Jason Bales ', 
      bio: "<p>Jason Bales is an avid sports enthusiast. He has been writing professionally in the daily fantasy sports and sports betting industries since 2012. In 2016, he earned his B.A. degree in philosophy from Albright NCAA, and in 2019, he earned his M.A. degree in the same subject from West Chester University. Not only has his education provided him with excellent writing skills, but his unique philosophically-informed stance toward DFS and betting leans heavily on analytic reasoning and critical thinking. </p>", 
      avatar: 'jasonbales.JPG', 
      tool: ['UFC'],
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
