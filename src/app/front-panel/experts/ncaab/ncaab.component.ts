import { Component, OnInit } from '@angular/core';
import { SeoService } from '../../../services/seo.service';
import { HelperService } from '../../../services/helper.service';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
declare const fbq: any;
@Component({
  selector: 'app-ncaab',
  templateUrl: './ncaab.component.html',
  styleUrls: ['./ncaab.component.css']
})
export class NcaabComponent implements OnInit {
  Experts:Array<{ name: string, bio: string, avatar: string, tool: string[], button_text:string}> = [
    {
      name: 'Mike Cutri CBB Product Manager', 
      bio: '<p>Mike Cutri is a former DIII collegiate basketball player and 1,000 point scorer. Mike’s focus is exclusively on CBB DFS where he uses his knowledge of the game and an advanced statistical approach to gain a competitive advantage. Over 5+ years, Mike has racked up 10+ GPP wins and qualified for the DraftKings March Mania twice. He primarily focuses on Draftkings, where his DFS handle is DaReelIMC. </p>', 
      avatar: 'mike-cutri.jpg', 
      tool: ['NCAAB'],
      button_text: 'Ask him a question!'
    },
    {
      name: ' Matthew Dickason ', 
      bio: '<p>Matt contributes in multiple sports at TQE. He specializes in single entry and three entry max game types in DFS for both MLB and NFL. He has been playing DFS for four years now and has won multiple GPPs. His most recent big score was a five-figure win in the NFL Playoffs. He also covers NCAA basketball betting, where he went 422-373 (53%) in the ‘18-‘19 season, including 15-10 in posted picks during March Madness (60%). You can follow Matt on Twitter @MattydTQE. </p>', 
      avatar: 'matthew_dIckason.jpg', 
      tool: ['NFL','MLB','NCAAB'],
      button_text: 'Ask him a question!'
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
