import { Component, OnInit, ViewChild } from '@angular/core';
import { SeoService } from '../../services/seo.service';
import { Subscription } from 'rxjs';
import { Subject  } from 'rxjs';
import { Router } from "@angular/router";
import { DataTableDirective } from 'angular-datatables';

@Component({
  selector: 'app-seo-listing',
  templateUrl: './seo-listing.component.html',
  styleUrls: ['./seo-listing.component.css']
})
export class SeoListingComponent implements OnInit {

  @ViewChild(DataTableDirective) dtElement: DataTableDirective;
  
  dtTrigger = new Subject();
  dtOptions: DataTables.Settings = {};
  seoData: any = [];
  Loading = false;
  
  constructor(
    private seoService: SeoService,
    private router: Router
  ) { }

  async ngOnInit() {

    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      // responsive: true,
      order: []
    };

    try{
      let response: any = await this.seoService.get_listing().toPromise();

      if(response.meta.code === 200) {
        let  { result } = response;
        if(result) {
          this.seoData = result;
          this.Loading = true;
          this.dtTrigger.next(); 
        }
      }
    } catch(e) {
      this.Loading = true;
      this.is_Authenticate(e);
    }
  }
  
  is_Authenticate(error) {
    if(error.status === 401) {
      localStorage.removeItem('data');
      this.router.navigate(['admin-auth/login']);
    }
  }

}
