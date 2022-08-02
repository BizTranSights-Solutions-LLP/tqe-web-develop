import { Component, OnInit  } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'admin-header',
  templateUrl: './admin-header.component.html',
  styleUrls: ['./admin-header.component.css']
})
export class AdminHeaderComponent implements OnInit {
  dropDownIcon: boolean = false;
  Navigation = [
    // {
    //   link_name: 'Articles',
    //   haveDropDown: true,
    //   dropDown: [
    //     {
    //       link_name: 'Articles List',
    //       link: 'article-lists',
    //     },
    //     {
    //       link_name: 'Add New',
    //       link: 'article-form',
    //     }
    //   ]
    // },
    // {
    //   link_name: 'Podcasts',
    //   haveDropDown: true,
    //   dropDown: [
    //     {
    //       link_name: 'Podcasts List',
    //       link: 'podcast-lists',
    //     },
    //     {
    //       link_name: 'Add New',
    //       link: 'podcast-form',
    //     }
    //   ]
    // },
    // {
    //   link_name: 'Users',
    //   haveDropDown: true,
    //   dropDown: [
    //     {
    //       link_name: 'Users List',
    //       link: 'users-list',
    //     },
    //     {
    //       link_name: 'Add New',
    //       link: 'user-form',
    //     }
    //   ]
    // },
    // {
    //   link_name: 'Discount Codes',
    //   haveDropDown: true,
    //   dropDown: [
    //     {
    //       link_name: 'Discounts List',
    //       link: 'discounts-list',
    //     },
    //     {
    //       link_name: 'Add New',
    //       link: 'discount-form',
    //     }
    //   ]
    // },
    // {
    //   link_name: 'SEO',
    //   haveDropDown: true,
    //   dropDown: [
    //     {
    //       link_name: 'SEO List',
    //       link: 'seo-list',
    //     },
    //     {
    //       link_name: 'Add New',
    //       link: 'seo-form',
    //     }
    //   ]
    // },
  ]
  constructor(
    private router: Router,
    private authService: AuthService
    ) { }

  ngOnInit() {
    let user_data = this.authService.getUserDetail();
    
    if(Object.keys(user_data).length > 0) {
      let navigation = 'roles_navigation' in user_data ? user_data.roles_navigation : '';

      if(navigation) {
        let parent = Object.values(navigation);
        navigation = parent;
        navigation.map(n => {
          n['dropDown'] = Object.values(n.dropDown)
          return n;
        });
        
        this.Navigation = navigation;
        // console.log(navigation)
      }
    }

    this.router.events.subscribe(
      event => {
        if(event instanceof NavigationEnd) {
          this.dropDownIcon = false;
        }
      }
    )
  }
  dropDown(key) {
    console.log(key)
  }
  logout() {
    localStorage.removeItem('data');
    this.router.navigate(['admin-auth/login']);
  }
  menu(){
    if(!this.dropDownIcon) {
      this.dropDownIcon = true;
    }else {
      this.dropDownIcon = false;
    }
  }
  openClose(key: string, event){
    event.preventDefault();
    console.log(key)
    $('li.has_drop'+ '.' + key).toggleClass('active');
    
    $('.dropdown_' + key).toggleClass('show');
      
    
    $('.' + key).closest('li').siblings().removeClass("active");
    // if(!this.dropDownIcon) {
    //   this.dropDownIcon = true;
    // }else {
    //   this.dropDownIcon = false;
    // }
  }

}
