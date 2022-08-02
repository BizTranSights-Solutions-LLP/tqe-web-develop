import { Component, OnInit } from '@angular/core';
import { DataService } from '../../../services/data.service';
import { Router } from '@angular/router';
import { SeoService } from '../../../services/seo.service';
import { HelperService } from '../../../services/helper.service';
import { environment } from '../../../../environments/environment';

declare const fbq: any;
@Component({
  selector: 'app-nfl',
  templateUrl: './nfl.component.html',
  styleUrls: ['./nfl.component.css']
})
export class NflComponent implements OnInit {
  oldArticles:any = []
  nflData: any = [];
  
  hideLoadMore:boolean = false;
  Loader:boolean = false;
  Offset = 0;
  top:number = 550;

  constructor(private dataService: DataService, private router:Router, private seoService: SeoService, private helperService: HelperService) { }

  
  ngOnInit() {
    let nfl = this.dataService.preAllArticles.nfl.latest;
    if(nfl.length !== 0) {
      this.nflData = nfl;
    }else {
      this.dataService.get_all_articles(1,8,0, this.router.url).subscribe(
        (res:any) => {
          this.nflData = res.result.article_data;
          this.dataService.pre_all_articles('nfl','latest',this.nflData,this.Offset);

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

    let oldnfl = this.dataService.preAllArticles.nfl.old;
    if(oldnfl.length !== 0) {
      this.oldArticles = oldnfl;
      this.Offset = this.dataService.preAllArticles['betting']['offset'];
    }else {
      this.dataService.get_all_articles(1,8,8).subscribe(
        (res:any) => {
          //console.log(res);
          this.oldArticles = res.result.article_data;
          this.Offset = 16;
          this.dataService.pre_all_articles('nfl','old',this.oldArticles,this.Offset);
        },
        err => console.log(err)
      )
    }
    this.dataService.updateToolTitle.emit('NFL Articles')
  }
  displayImage(index) {
    $('.image_ph_'+index).hide();
    $('.image_show_'+index).show();
  }
  loadMore() {
    this.Loader = true;
    this.hideLoadMore = true;
    this.dataService.get_all_articles(1,4,this.Offset).subscribe(
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
