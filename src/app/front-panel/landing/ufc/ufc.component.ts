import { Component, OnInit } from '@angular/core';
import { DataService } from '../../../services/data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ufc',
  templateUrl: './ufc.component.html',
  styleUrls: ['./ufc.component.css']
})
export class UfcComponent implements OnInit {

  allData: any = [];

  constructor(private dataService: DataService, private router:Router) { }

  ngOnInit() {
    let result = this.dataService.preservedUFCArticles;
    if(result.length !== 0) {
      this.allData = result;
    } else {
      this.dataService.get_articles(4).subscribe(
        (res: any) => {
          this.allData = res.result.article_data;
          if(typeof this.allData == 'object') {
            this.dataService.preserve_ufc_articles(this.allData);
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
