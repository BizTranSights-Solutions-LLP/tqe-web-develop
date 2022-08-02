import { Component, OnInit } from '@angular/core';
import { DataService } from '../../../services/data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cbb',
  templateUrl: './cbb.component.html',
  styleUrls: ['./cbb.component.css']
})
export class CbbComponent implements OnInit {

  allData: any = [];

  constructor(private dataService: DataService, private router: Router) { }

  
  ngOnInit() {
    let result = this.dataService.preservedCBBArticles;
    if(result.length !== 0) {
      this.allData = result;
    } else {
      this.dataService.get_articles(5).subscribe(
        (res: any) => {
          this.allData = res.result.article_data;
          if(typeof this.allData == 'object') {
            this.dataService.preserve_cbb_articles(this.allData);
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
