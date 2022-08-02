import { Component, OnInit } from '@angular/core';
import { DataService } from '../../../services/data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-all',
  templateUrl: './all.component.html',
  styleUrls: ['./all.component.css']
})
export class AllComponent implements OnInit {
 
  allData: any = [];
  loading: boolean = false;
  errorMessage: string = '';

  constructor(private dataService: DataService, private router: Router) { }

  ngOnInit() {
    this.loading = true;
    let result = this.dataService.preservedAllArticles;
    if(result.length !== 0) {
      this.allData = result;
      this.loading = false;
    } else {
      this.dataService.get_articles().subscribe(
        (res: any) => {
          this.loading = false;
          this.allData = res.result.article_data;
          if(typeof this.allData == 'object') {
            this.dataService.preserve_all_articles(this.allData);
          }
        },
        err => {
          console.log(err)
          this.loading = false;
          if(err.name == "HttpErrorResponse"){
            this.errorMessage = "You're Offline.";
          }
        }

      );
    }
  }
  displayImage(index) {
    // console.log(index);
    $('.image_ph_'+index).hide();
    $('.image_show_'+index).show();
  }
  // getArticleDetails(title,id) {
  //   localStorage.setItem('article-id',id);
  //   let params = title.replace(/[^A-Z0-9]/ig, "-").toLowerCase();
  //   this.router.navigate(['/articles/article-detail',params]);
  // }

}
