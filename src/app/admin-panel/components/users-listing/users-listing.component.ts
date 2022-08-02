import { Component, OnInit, ViewChild } from '@angular/core';
import { Subscription, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { UsersService } from '../../services/users.service';
import { DataTableDirective } from 'angular-datatables';
import { ngxCsv } from 'ngx-csv';

@Component({
  selector: 'app-users-listing',
  templateUrl: './users-listing.component.html',
  styleUrls: ['./users-listing.component.css']
})
export class UsersListingComponent implements OnInit {

  getArticleListSub: Subscription;  
  deleteArticleSub: Subscription; 
  dtTrigger = new Subject();
  dtOptions: DataTables.Settings = {};
  users = [];
  Loading = false;

  @ViewChild(DataTableDirective) dtElement: DataTableDirective;
  

  constructor(private userService: UsersService, private router: Router) { }

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      // responsive: true,
      order: []
    };
    this.getArticleListSub = this.userService.get_user_listing().subscribe(
      (response: any) => {
        if(response.meta.code === 200){
          this.users = response.result.user_data;

          this.users.map(d => {
            let roles_object = d.roles_status;
            let data_roles = Object.keys(roles_object);
            let all_roles = [];
            data_roles.map(r => {
              if(roles_object[r] === 1) {
                let curr_role = r.replace('is_','');
                curr_role = curr_role.charAt(0).toUpperCase() + curr_role.slice(1);
                all_roles.push(curr_role);
              }
            });
            d['roles'] = all_roles.join(', ');
            return d;
          });
          // this.articles = response['result']['article_data'];
          this.Loading = true;
          // // Calling the DT trigger to manually render the table
          this.dtTrigger.next();                    
        } 
      },
      (err) => {
        this.Loading = true;
        if(err.status === 401) {
          localStorage.removeItem('data');
          this.router.navigate(['admin-auth/login']);
        }
      }      
      );    
  }

  exportAsCsv() {
    if (this.users.length > 0) {
           
      let headers = Object.keys(this.users[0]);
      
      let options = {
          fieldSeparator: ',',
          headers: headers
      }

      let csvName = "Users_Report_" + new Date().getTime();
      let csvData = this.users;
      new ngxCsv(csvData, csvName, options);
    }
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
    this.getArticleListSub ? this.getArticleListSub.unsubscribe(): '';
    this.deleteArticleSub ? this.deleteArticleSub.unsubscribe(): '';
  }

  editUser(userid) {
    this.router.navigate(['/admin/user-form/', userid]);    
  }

  deleteUser(userId, index) {

    if (!window.confirm('Are you sure you want to delete ?') ) {
      return false;
    }
    
    this.deleteArticleSub = this.userService.delete_user(userId).subscribe(
      (res: any) => {
        if(res.meta.code === 200) {
          this.users.splice(index, 1);

          this.Loading = false;
          this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.destroy();
            this.dtTrigger.next();
            this.Loading = true;
          });
        }
      },
      (err) => { console.log(err); }
    );

  }

}
