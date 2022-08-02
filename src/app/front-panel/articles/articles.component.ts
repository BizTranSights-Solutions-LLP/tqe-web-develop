import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { DataService } from '../../services/data.service';
import { Subscription } from 'rxjs';
import { SeoService } from '../../services/seo.service';


@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.css']
})
export class ArticlesComponent implements OnInit {
  articleTitle:string = '';

  getToolNameSubscription: Subscription;

  constructor(private dataService: DataService, private seoService:SeoService) { }
  ngOnInit() {
    this.seoService.updateTitle('Sports Articles and Sports Betting Insight | The Quant Edge');
    this.getToolNameSubscription = this.dataService.updateToolTitle.subscribe(
      (res: string) => {
        this.articleTitle = res;
      }
    )
  }

  ngOnDestroy() {
    if(this.getToolNameSubscription) this.getToolNameSubscription.unsubscribe();
  }

}
