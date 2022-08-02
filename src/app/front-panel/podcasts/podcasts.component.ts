import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { SeoService } from '../../services/seo.service';
import { HelperService } from '../../services/helper.service';
import { environment } from '../../../environments/environment';
declare const fbq: any;
@Component({
  selector: 'app-podcasts',
  templateUrl: './podcasts.component.html',
  styleUrls: ['./podcasts.component.css']
})
export class PodcastsComponent implements OnInit {

  Podcasts = [ ]

  serverErr:string = '';
  loader: boolean = false;


  
  constructor(private dataService: DataService, private seoService:SeoService, private helperService: HelperService) { }


  async ngOnInit() {
    this.seoService.updateTitle('TQE All Podcasts | The Quant Edge | Sports &amp; Sports Betting Insight');

    this.loader = true;
    this.dataService.get_all_podcast_tags().subscribe(
      (res:any) => {
        this.loader = false;
        
        if(res.meta.code === 200) {
          this.Podcasts = res.result.podcast_tags;

          if(res.result.meta_tags.length > 0) {
            let { title, description, keyword } = res.result.meta_tags[0];
              this.seoService.updateSeoTags(title, description, window.location.href, keyword);
          }

          if(res.result.fb_pixel_scripts.length > 0) {
            let func = new Function(res.result.fb_pixel_scripts[0]);
            if (environment.production) {
              func();
            }
          }
          
        }else{
          this.serverErr = res.meta.message;
        }
      },
      (err) => {
        this.serverErr = err.statusText;
        this.loader = false;
      }
    )
  }

}
