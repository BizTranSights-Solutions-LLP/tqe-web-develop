import { Component, OnInit } from '@angular/core';
import { DataService } from '../../../services/data.service';
import { Router } from '@angular/router';
import { SeoService } from '../../../services/seo.service';
import { HelperService } from '../../../services/helper.service';
import { environment } from '../../../../environments/environment';

declare const fbq: any;
@Component({
  selector: 'app-nba',
  templateUrl: './nba.component.html',
  styleUrls: ['./nba.component.css']
})
export class NbaComponent implements OnInit {

  oldArticles:any = []
  nbaData: any = [];
  
  hideLoadMore:boolean = false;
  Loader:boolean = false;
  Offset = 0;
  top:number = 550;

  constructor(private dataService: DataService, private router: Router, private seoService: SeoService, private helperService: HelperService) { }

  
  ngOnInit() {
    let nba = this.dataService.preAllArticles.nba.latest;
    if(nba.length !== 0) {
      this.nbaData = nba;
    }else {
      this.dataService.get_all_articles(3,8,0, this.router.url).subscribe(
        (res:any) => {
          this.nbaData = res.result.article_data;
          this.dataService.pre_all_articles('nba','latest',this.nbaData,this.Offset);

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

    let oldnba = this.dataService.preAllArticles.nba.old;
    if(oldnba.length !== 0) {
      this.oldArticles = oldnba;
      this.Offset = this.dataService.preAllArticles['betting']['offset'];
    }else {
      this.dataService.get_all_articles(3,8,8).subscribe(
        (res:any) => {
          this.Offset = 16;
          this.oldArticles = res.result.article_data;
          this.dataService.pre_all_articles('nba','old',this.oldArticles,this.Offset);
        },
        err => console.log(err)
      )
    }
    this.dataService.updateToolTitle.emit('NBA Articles')
  }
  displayImage(index) {
    $('.image_ph_'+index).hide();
    $('.image_show_'+index).show();
  }
  loadMore() {
    this.Loader = true;
    this.hideLoadMore = true;
    this.dataService.get_all_articles(3,4,this.Offset).subscribe(
      (res:any) => {
        this.Offset = this.Offset + 4;
        this.oldArticles = this.oldArticles.concat(res.result.article_data);
        this.hideLoadMore = res.result.article_data.length == 0 ? true : false;
        this.Loader = false;
        if(res.result.article_data.length > 0) { this.top = this.top + 200; }
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
  
}
