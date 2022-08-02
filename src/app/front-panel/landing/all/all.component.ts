import { Component, OnInit } from '@angular/core';
import { DataService } from '../../../services/data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-all',
  templateUrl: './all.component.html',
  styleUrls: ['./all.component.scss']
})
export class AllComponent implements OnInit {
 
  allData: any = [];

  constructor(private dataService: DataService, private router: Router) { }

  ngOnInit() {

    let result = this.dataService.preservedAllArticles;
    if(result.length !== 0) {
      this.allData = result;
    } else {
      this.dataService.get_articles().subscribe(
        (res: any) => {
          this.allData = res.result.article_data;
          if(typeof this.allData == 'object') {
            this.dataService.preserve_all_articles(this.allData);
          }
        },
        err => console.log(err)
      );
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
