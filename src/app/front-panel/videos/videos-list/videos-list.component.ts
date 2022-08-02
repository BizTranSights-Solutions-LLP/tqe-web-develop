import { Component, OnInit } from '@angular/core';
import { DataService } from '../../../services/data.service';
import { Subscription } from 'rxjs';
import { SeoService } from '../../../services/seo.service';
import { Router } from '@angular/router';
import { HelperService } from '../../../services/helper.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-videos-list',
  templateUrl: './videos-list.component.html',
  styleUrls: ['./videos-list.component.css']
})
export class VideosListComponent implements OnInit {

  tqeVideosData: any = [];
  serverMessage: string = '';
  hideLoadMore:boolean = false;
  Loader:boolean = false;
  mainLoader:boolean = true;
  bettingOffset = 0;
  top:number = 900;
  tqeVideosSubscription:Subscription;

  constructor(
    private dataService:DataService, 
    private seoService: SeoService, 
    private router: Router, 
    private helperService: HelperService
    ) { }

  ngOnInit() {
    this.tqeVideosSubscription = this.dataService.get_all_videos(1000,this.bettingOffset, this.router.url).subscribe(
      (res:any) => {
        this.mainLoader = false;
        
        this.tqeVideosData = res.result.tqe_videos_data;
        
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
      err => {
        this.mainLoader = false;
        this.serverMessage = err.message; 
      }
    )
  }

  // loadMore() {
  //   this.Loader = true;
  //   this.hideLoadMore = true;
  //   this.tqeVideosSubscription = this.dataService.get_all_podcasts(14,4,this.bettingOffset).subscribe(
  //     (res:any) => {
  //       this.bettingOffset = this.bettingOffset + 4;
  //       this.tqeVideosData = this.tqeVideosData.concat(res.result.podcast_data);
  //       this.hideLoadMore = res.result.podcast_data.length == 0 ? true : false;
  //       this.Loader = false;
  //       if(res.result.podcast_data.length > 0) { this.top = this.top + 450; }
  //       window.scroll({
  //         top: this.top,
  //         behavior: 'smooth'
  //       })
  //     },
  //     err => {
  //       this.Loader = false;
  //       console.log(err)
  //       this.serverMessage = err.message; 
  //     }
  //   )
  // }
  
  displayImage(index) {
    $('.image_ph_'+index).hide();
    $('.image_show_'+index).show();
  }
  
  ngOnDestroy() {
    if(this.tqeVideosSubscription) { this.tqeVideosSubscription.unsubscribe(); }
  }

}
