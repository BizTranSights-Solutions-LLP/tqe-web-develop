import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataService } from '../../../services/data.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { SeoService } from '../../../services/seo.service';
import { HelperService } from '../../../services/helper.service';
import { environment } from '../../../../environments/environment';

declare const fbq: any;
@Component({
  selector: 'app-nfl-best-ball-podcast',
  templateUrl: './nfl-best-ball-podcast.component.html',
  styleUrls: ['./nfl-best-ball-podcast.component.css']
})
export class NflBestBallPodcastComponent implements OnInit, OnDestroy {
  podcastData: any = [];
  serverMessage: string = '';
  hideLoadMore:boolean = false;
  Loader:boolean = false;
  mainLoader:boolean = true;
  bettingOffset = 0;
  top:number = 900;
  podcast_subscription:Subscription;
  constructor(private dataService:DataService, private router: Router, private seoService: SeoService, private helperService: HelperService) { }

  ngOnInit() {
    this.podcast_subscription = this.dataService.get_all_podcasts(23,4,this.bettingOffset, this.router.url).subscribe(
      (res:any) => {
        this.serverMessage = res.result.message;
        this.mainLoader = false;
        if(this.serverMessage === 'No data available') {
          this.mainLoader = false;
        }
        this.bettingOffset = 4;
        this.podcastData = res.result.podcast_data;
        if(res.meta.code === 200) {

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
        }
      },
      err => console.log(err)
    )
  }

  loadMore() {
    this.Loader = true;
    this.hideLoadMore = true;
    this.podcast_subscription = this.dataService.get_all_podcasts(23,4,this.bettingOffset).subscribe(
      (res:any) => {
        this.bettingOffset = this.bettingOffset + 4;
        this.podcastData = this.podcastData.concat(res.result.podcast_data);
        this.hideLoadMore = res.result.podcast_data.length == 0 ? true : false;
        this.Loader = false;
        if(res.result.podcast_data.length > 0) { this.top = this.top + 450; }
        window.scroll({
          top: this.top,
          behavior: 'smooth'
        })
      },
      err => {
        this.Loader = false;
        console.log(err)
      }
    )
  }
  displayImage(index) {
    $('.image_ph_'+index).hide();
    $('.image_show_'+index).show();
  }
  ngOnDestroy() {
    if(this.podcast_subscription) { this.podcast_subscription.unsubscribe(); }
  }
}
