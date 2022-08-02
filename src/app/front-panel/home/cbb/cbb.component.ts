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
  loading: boolean = false;
  errorMessage: string = '';

  constructor(private dataService: DataService, private router: Router) { }

  
  ngOnInit() {
    this.loading = true;
    let result = this.dataService.preservedCBBArticles;
    if(result.length !== 0) {
      this.allData = result;
      this.loading = false;
    } else {
      this.dataService.get_articles(5).subscribe(
        (res: any) => {
          this.loading = false;
          this.allData = res.result.article_data;
          if(typeof this.allData == 'object') {
            this.dataService.preserve_cbb_articles(this.allData);
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
    $('.image_ph_'+index).hide();
    $('.image_show_'+index).show();
  }

}
