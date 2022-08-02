import { Component, OnInit } from '@angular/core';
import { SeoService } from '../../../services/seo.service';
import { Router } from '@angular/router';
import { HelperService } from '../../../services/helper.service';
import { environment } from '../../../../environments/environment';

declare const fbq: any;
@Component({
  selector: 'app-dfspromo',
  templateUrl: './dfspromo.component.html',
  styleUrls: ['./dfspromo.component.css']
})
export class DfspromoComponent implements OnInit {

  Promos = [
    {
      logo: 'prize-picks.png',
      bouns: '<span>25% Deposit match up to <strong>$1,000</strong> and free entry to win $25 when you use promo code TQE</span>',
      readmore: '',
      App_ios: '',
      App_android: '',
      active_link: 'https://www.myprizepicks.com/welcome?invite_code=TQE',
    },
    {
      logo: 'monkeyknife.png',
      bouns: '<span>100% deposit match up to <strong>$50</strong> dollars when you use promo code TQE</span>',
      readmore: 'monkey-knife-fight-review',
      App_ios: '',
      App_android: '',
      active_link: 'https://www.monkeyknifefight.com/?p_source=affiliate&p_affiliate=TQE',
    },
    {
      logo: 'Thrive-Fantasy.png',
      bouns: '<span>100% deposit match up to <strong>$10</strong></span>',
      readmore: 'thrive-review',
      App_ios: '',
      App_android: '',
      active_link: 'https://bit.ly/TheQuantEdge',
    },
    {
      logo: 'DraftKings_Primary_FC.png',
      bouns: '<span>Get a free month of TQE fantasy content when you create a Draftkings Account</span>',
      readmore: 'draftking-review',
      App_ios: '',
      App_android: '',
      active_link: 'https://www.draftkings.com/gateway?s=103337885',
    }
  ]
  constructor(private seoService:SeoService, private router: Router, private helperService: HelperService) { }

  async ngOnInit() {
    this.seoService.updateTitle('DFS Promo Codes | Fantasy Sports Betting | The Quant Edge');

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
