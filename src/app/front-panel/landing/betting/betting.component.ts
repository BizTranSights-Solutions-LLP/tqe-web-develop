import { Component, OnInit } from '@angular/core';
import { DataService } from '../../../services/data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-betting',
  templateUrl: './betting.component.html',
  styleUrls: ['./betting.component.css']
})
export class BettingComponent implements OnInit {

  allData: any = [];

  constructor(private dataService: DataService, private router:Router) { }

  ngOnInit() {
    let result = this.dataService.preservedBettingArticles;
    if(result.length !== 0) {
      this.allData = result;
    } else {
      this.dataService.get_articles(2).subscribe(
        (res: any) => {
          this.allData = res.result.article_data;
          if(typeof this.allData == 'object') {
            this.dataService.preserve_betting_articles(this.allData);
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
}
