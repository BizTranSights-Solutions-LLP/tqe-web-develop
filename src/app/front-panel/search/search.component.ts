import { Component, OnInit, OnDestroy, ChangeDetectorRef, AfterViewInit, AfterContentInit } from '@angular/core';

import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../../services/data.service';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit, OnDestroy {

  sreachText:any = {};
  data:any = [];
  search: Subscription;
  loadingSearch: boolean = false;
  allData: boolean = false;
  searchRoute: string = '';
  url: string = '';
  constructor(private route: ActivatedRoute, private dataService: DataService, private seoService:SeoService) { }

  ngOnInit() {
    this.seoService.updateTitle('TQE Search');
    // this.search = this.dataService.getSearchValue.subscribe(
    //   (res:any) => {
    //     console.log(res);
    //     this.sreachText = res;
    //   }
    // );
    // console.log(this.dataService.sreachText);
    // this.sreachText = this.dataService.sreachText;

    // this.sreachText = this.route.snapshot.queryParams;
    
    this.search = this.route.queryParams.subscribe(
      (res:any) => {
        this.sreachText = res;
        // console.log(this.sreachText)
        this.seoService.updateTitle('TQE Search: ' + this.sreachText.search_type.toUpperCase( ))
        if(this.sreachText.search_type == 'all') {
          this.getAllData();
        }
        else {
          this.getData(this.sreachText.search_type);
          if(this.sreachText.search_type == 'articles') {
            this.searchRoute = 'article'
          }else if(this.sreachText.search_type == 'podcasts') {
            this.searchRoute = 'podcast'
          }else {
            this.searchRoute = 'tool'
          }
        }
        
      }
    );
  }

  getData(key) {
    this.loadingSearch = true;
    this.allData = false;
    this.search = this.dataService.searchMain(this.sreachText).subscribe(
      (res:any) => {
        // console.log(res.result.search_results[0])
        this.data = res.result.search_results[0][key];
        this.loadingSearch = false;
      },
      (err) => {
        console.log(err)
      }
    );
  }
  getAllData() {
    this.loadingSearch = true;
    this.search = this.dataService.searchMain(this.sreachText).subscribe(
      (res:any) => {
        // console.log(res.result.search_results[0])
        this.data = res.result.search_results[0];
        this.loadingSearch = false;        
        this.allData = true;
      },
      (err) => {
        console.log(err)
      }
    );
  }

  ngOnDestroy() {
    if(this.search) this.search.unsubscribe();
  }
  
  displayImage(index) {
    $('.image_ph_'+index).hide();
    $('.image_show_'+index).show();
  }
}
