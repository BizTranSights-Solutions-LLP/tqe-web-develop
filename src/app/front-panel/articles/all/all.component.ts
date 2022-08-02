import { Component, OnInit } from '@angular/core';
import { DataService } from '../../../services/data.service';
import { OwlCarousel } from 'ngx-owl-carousel';
import { Router } from '@angular/router';
import { SeoService } from '../../../services/seo.service';
import { HelperService } from '../../../services/helper.service';
import { environment } from '../../../../environments/environment';

declare var $;
declare const fbq: any;
@Component({
  selector: 'app-all',
  templateUrl: './all.component.html',
  styleUrls: ['./all.component.css']
})
export class AllComponent implements OnInit {
  
  isDragging: boolean;
  isLoading: boolean = true;

  allArticlesOption: any = {
    items: 5,
    dots: false, 
    nav: true, 
    margin: 10, 
    touchDrag: true, 
    navElement: 'div',
    responsive: {
      0: {
        items: 1,
        margin: 0
      },
      400: {
        items: 2
      },
      740: {
        items: 3
      },
      940: {
        items: 5
      }
    },
  }

  
  bettingData: any = [];
  nflData: any = [];
  nbaData: any = [];
  ncaabData: any = [];
  ufcData: any = [];
  mlbData: any = [];
  
  private offset: number = 0;

  constructor(private dataService: DataService,private router: Router, private seoService: SeoService, private helperService: HelperService) { }

  async ngOnInit() {
    this.dataService.updateToolTitle.emit('All Articles')    

    let resNFL:any = [];
    let resBetting:any = [];
    let resNba:any = [];
    let resNcaab:any = [];
    let resUfc:any = [];
    let resMlb:any = [];

    // let result = this.dataService.preservedUFCArticles;
    // if(result.length !== 0) {
    //   this.allData = result;
    // } else {
    //   this.dataService.get_articles(4).subscribe(
    //     (res: any) => {
    //       this.allData = res.result.article_data;
    //       if(typeof this.allData == 'object') {
    //         this.dataService.preserve_ufc_articles(this.allData);
    //       }
    //     },
    //     err => console.log(err)
    //   );
    // }

    try{
      let nfl = this.dataService.preservedNFLArticles;

      if(nfl.length !== 0){
        this.nflData = nfl;
      }else {
        resNFL = await this.dataService.get_all_articles(1, 5, this.offset, '/articles').toPromise();
        this.nflData = resNFL.result.article_data;
        if(typeof this.nflData == 'object') {
          this.dataService.preserve_nfl_articles(this.nflData);
        }

        if(resNFL.meta.code === 200) {
          
          if(resNFL.result.meta_tags.length > 0) {
            let { title, description, keyword } = resNFL.result.meta_tags[0];
              this.seoService.updateSeoTags(title, description, window.location.href, keyword);
          }

          if(resNFL.result.fb_pixel_script.length > 0) {
            let func = new Function(resNFL.result.fb_pixel_scripts[0]);
            if (environment.production) {
              func();
            }
          }
        }
        
      }
    }catch(e){  }
    try{

      let betting = this.dataService.preservedBettingArticles;

      if(betting.length !== 0){
        this.bettingData = betting;
      }else {
        resBetting = await this.dataService.get_all_articles(2, 5, this.offset).toPromise();
        this.bettingData = resBetting.result.article_data;
        if(typeof this.bettingData == 'object') {
          this.dataService.preserve_betting_articles(this.bettingData);
        }
      }
    }catch(e){  }
    try{
      let nba = this.dataService.preservedNBAArticles;

      if(nba.length !== 0){
        this.nbaData = nba;
      }else {
        resNba = await this.dataService.get_all_articles(3, 5, this.offset).toPromise();
        this.nbaData = resNba.result.article_data;
        if(typeof this.nbaData == 'object') {
          this.dataService.preserve_nba_articles(this.nbaData);
        }
      }
    }catch(e){  }
    try{
      let ufc = this.dataService.preservedUFCArticles;

      if(ufc.length !== 0){
        this.ufcData = ufc;
      }else {
        resUfc = await this.dataService.get_all_articles(4, 5, this.offset).toPromise();
        this.ufcData = resUfc.result.article_data;
        if(typeof this.ufcData == 'object') {
          this.dataService.preserve_ufc_articles(this.ufcData);
        }
      }
    }catch(e){  }
    try{
      let cbb = this.dataService.preservedCBBArticles;

      if(cbb.length !== 0){
        this.ncaabData = cbb;
      }else {
        resNcaab = await this.dataService.get_all_articles(5, 5, this.offset).toPromise();
        this.ncaabData = resNcaab.result.article_data;
        if(typeof this.ncaabData == 'object') {
          this.dataService.preserve_cbb_articles(this.ncaabData);
        }
      }
    }catch(e){  }
    try{
      let mlb = this.dataService.preservedMLBArticles;

      if(mlb.length !== 0){
        this.mlbData = mlb;
      }else {
        resMlb = await this.dataService.get_all_articles(6, 5, this.offset).toPromise();
        this.mlbData = resMlb.result.article_data;
        if(typeof this.mlbData == 'object') {
          this.dataService.preserve_mlb_articles(this.mlbData);
        }
      }
      


    } catch(e) {
      console.log(e);
    }
    
  }
  displayImage(index) {
    $('.image_ph_'+index).hide();
    $('.image_show_'+index).show();
  }
  // getArticleDetails(title,id) {
  //   localStorage.setItem('article-id',id);
  //   let params = title.replace(/[^A-Z0-9]/ig, "-").toLowerCase();
  //   this.router.navigate(['/articles/article-detail',params]);
  // }

}
