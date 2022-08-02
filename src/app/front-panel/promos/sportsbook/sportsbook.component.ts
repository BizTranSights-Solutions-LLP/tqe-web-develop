import { Component, OnInit } from '@angular/core';
import { SeoService } from '../../../services/seo.service';
import { Router } from '@angular/router';
import { HelperService } from '../../../services/helper.service';
import { environment } from '../../../../environments/environment';
declare const fbq: any;

@Component({
  selector: 'app-sportsbook',
  templateUrl: './sportsbook.component.html',
  styleUrls: ['./sportsbook.component.css']
})
export class SportsbookComponent implements OnInit {

  Promos = [
    {
      logo: 'pointbets.png',
      bouns: '<p>When you use promo code TQE</p><span>Get a <strong>$50</strong> Bonus Bet +<br>2 Risk-Free Bets Up to <strong>$1,000</strong></span>',
      readmore: 'pointsbet-review',
      App_ios: '',
      App_android: '',
      active_link: 'https://join.pointsbet.com/thequantedge?utm_source=Unbounce_TheQuantEdge&utm_medium=Digital_Affiliate_CPA&utm_campaign=Affiliate_Acquisition&utm_term=Unbounce&utm_content=TheQuantEdge',
    },
    {
      logo: 'draftkings-sportsbook.png',
      bouns: '<span>Deposit match up to <strong>$500</strong><br> available to all users. New users get the first bet matched up to a <strong>$200</strong> risk-free bet.</span>',
      readmore: 'draftking-review',
      App_ios: '',
      App_android: '',
      active_link: "https://www.draftkings.com/gateway?s=515360267&bTag=a_5915b_713c_",
    },
    {
      logo: '888point.png',
      bouns: '<span> <strong>100%</strong> deposit match up to <strong>500</strong> dollars AND <strong>$10</strong> free no deposit needed</span>',
      readmore: '',
      App_ios: '',
      App_android: '',
      active_link: 'https://mmwebhandler.aff-online.com/C/43613?sr=1645963',
    },
    {
      logo: 'betstars.jpg',
      bouns: '<span>UP TO <strong>$500</strong><br> IN FREE BETS</span>',
      readmore: 'betstars-review',
      App_ios: '',
      App_android: '',
      active_link: 'https://amaya.onelink.me/TKLZ?af_prt=thequantedge&pid=Affiliate&c=BS-US-MOB-FDB-Affiliates-thequantedge-Direct-OpenMarket-ROS-All-All-FDB-500-LP-1x1-P-X&af_sub4=16133134&af_android_url=https://www.betstars.com/us/&source=16133134&utm_medium=affiliates&utm_campaign=BS-US-MOB-FDB-Affiliates-thequantedge-Direct-OpenMarket-ROS-All-All-FDB-500-LP-1x1-P-X',
    },
    {
      logo: 'sugarhouse.jpg',
      bouns: '<span>Sports Betting and Casino Games! First Deposit Matched 100% up to <br><strong>$250 </strong> </span>',
      readmore: 'sugarhouse-review',
      App_ios: 'https://wlsugarhouseaffiliates.adsrv.eacdn.com/C.ashx?btag=a_564b_37c_&affid=241&siteid=564&adid=37&c=',
      App_android: 'https://wlsugarhouseaffiliates.adsrv.eacdn.com/C.ashx?btag=a_564b_45c_&affid=241&siteid=564&adid=45&c=',
      active_link: 'https://wlsugarhouseaffiliates.adsrv.eacdn.com/C.ashx?btag=a_564b_305c_&affid=241&siteid=564&adid=305&c=',
    },
    {
      logo: 'caesars@2x.png',
      bouns: '<span>FIRST TIME DEPOSITOR <strong>$300</strong><br> MATCHED SPORTS FREE BET</span><p>Make your first deposit using SPORTS300 and Caesars will match your first sports bet – up to $300!</p>',
      readmore: 'caesers-review',
      App_ios: '',
      App_android: '',
      active_link: 'https://wlcaesarsinteractive.adsrv.eacdn.com/C.ashx?btag=a_987655446b_854c_&affid=817&siteid=987655446&adid=854&c=',
    },
    {
      logo: 'stacked-darkbackground.png',
      bouns: '<span>Risk Free Bet up to  <strong>$500</strong></span>',
      readmore: '',
      App_ios: '',
      App_android: '',
      active_link: 'https://wlfanduel.adsrv.eacdn.com/C.ashx?btag=a_15969b_1985c_&affid=11551&siteid=15969&adid=1985',
    }
  ]
  constructor(private seoService:SeoService, private router: Router, private helperService: HelperService) { }

  async ngOnInit() {
    this.seoService.updateTitle('New Jersey Sportsbooks | The Quant Edge | Line Shopping Simplified');

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
