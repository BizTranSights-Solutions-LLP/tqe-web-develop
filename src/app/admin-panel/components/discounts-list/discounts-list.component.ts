import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { DiscountService } from '../../services/discount.service';
import { Subscription } from 'rxjs';
import { Subject  } from 'rxjs';
import { Router } from "@angular/router";
import { DataTableDirective } from 'angular-datatables';

@Component({
  selector: 'app-discounts-list',
  templateUrl: './discounts-list.component.html',
  styleUrls: ['./discounts-list.component.css']
})
export class DiscountsListComponent implements OnInit, OnDestroy {

  @ViewChild(DataTableDirective) dtElement: DataTableDirective;
  
  dtTrigger = new Subject();
  dtOptions: DataTables.Settings = {};
  discountCodes: any = [];
  Loading = false;

  subscriptions: Subscription[] = [];

  constructor(
    private dcService: DiscountService,
    private router: Router
    ) { }

  ngOnInit() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      // responsive: true,
      order: []
    };

    this.subscriptions.push(this.dcService.get_dc_list().subscribe(
        (res:any) => {
          // console.log(res);
          if(res.meta.code === 200) {
            let discount_codes = res.result.discount_codes_data;
            this.discountCodes = discount_codes;
            this.Loading = true;
            this.dtTrigger.next();  
          }
        },
        (err) => {
          this.Loading = true;
          this.is_Authenticate(err);
        }
      )
    );
  }

  deleteDC(id, index) {
    if (!window.confirm('Are you sure you want to delete ?') ) {
      return false;
    }

    this.subscriptions.push(this.dcService.del_dc(id).subscribe(
        (res:any) => {
          if(res.meta.code === 200) {
            this.discountCodes.splice(index, 1);

            this.Loading = false;
            this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
              dtInstance.destroy();
              this.dtTrigger.next();
              this.Loading = true;
            });
          }
        },(err) => {
          this.is_Authenticate(err);
        }
      )
    );
  }

  is_Authenticate(error) {
    if(error.status === 401) {
      localStorage.removeItem('data');
      this.router.navigate(['admin-auth/login']);
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(d => {
      d.unsubscribe();
    });
  }

}
