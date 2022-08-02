import { Component, OnInit, OnDestroy, NgModule } from '@angular/core';
import { Router, RouteConfigLoadStart } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'site-footer',
  templateUrl: './site-footer.component.html',
  styleUrls: ['./site-footer.component.css']
})

export class SiteFooterComponent implements OnInit, OnDestroy {
  user_role:any;

  LoggedIn: boolean = false;

  user_subscription: Subscription;
 


  constructor(private authService: AuthService) {}

  ngOnInit() {
    
    // console.log(this.authService.getUserDetail());
    // this.user_info = this.authService.getUserDetail();

    
    let user  = this.authService.isUserLoggedIn();

    if(user) {
      this.user_role = this.authService.getUserDetail().roles_status;
      
      this.LoggedIn = true;
    }
    
    this.user_subscription = this.authService.logginEvent.subscribe(
      (res) => {
        if(res) {
          this.user_role = this.authService.getUserDetail().roles_status;
          this.authService.overLay.emit(false);
          
          this.LoggedIn = res;
        }
      }
    )
    
    
    this.authService.logoutEvent.subscribe(
    (res:any) => {
      if(res) {
        this.LoggedIn = false;
      }
    }

    )











    // const container = document.querySelector('.tabs');
    // const primary = container.querySelector('.-primary');
    // const primaryItems = container.querySelectorAll('.-primary > li:not(.-more)');
    // container.classList.add('--jsfied');

    // // insert "more" button and duplicate the list

    // primary.insertAdjacentHTML('beforeend', `
    //   <li class="-more">
    //     <button class="btnMore" type="button" aria-haspopup="true" aria-expanded="false">
    //       <span></span>
    //       <span></span>
    //       <span></span>
    //       <span></span>
    //     </button>
    //     <ul class="-secondary">
    //       ${primary.innerHTML}
    //     </ul>
    //   </li>
    // `);
    // const secondary = container.querySelector('.-secondary');
    // const secondaryItems = secondary.querySelectorAll('li');
    // const allItems = container.querySelectorAll('li');
    // const moreLi = primary.querySelector('.-more');
    // const moreBtn = moreLi.querySelector('button');
    // moreBtn.addEventListener('click', e => {
    //   e.preventDefault();
    //   container.classList.toggle('--show-secondary');
    //   moreBtn.setAttribute('aria-expanded', container.classList.contains('--show-secondary'));
    // });

    // // adapt tabs

    // const doAdapt = () => {
    //   // reveal all items for the calculation
    //   allItems.forEach(item => {
    //     item.classList.remove('--hidden');
    //   });

    //   // hide items that won't fit in the Primary
    //   let stopWidth = moreBtn.offsetWidth;
    //   let hiddenItems = [];
    //   const primaryWidth = primary.offsetWidth;
    //   primaryItems.forEach((item, i) => {
    //     if (primaryWidth >= stopWidth + item.offsetWidth) {
    //       stopWidth += item.offsetWidth;
    //     } else {
    //       item.classList.add('--hidden');
    //       hiddenItems.push(i);
    //     }
    //   });

    //   // toggle the visibility of More button and items in Secondary
    //   if (!hiddenItems.length) {
    //     moreLi.classList.add('--hidden');
    //     container.classList.remove('--show-secondary');
    //     moreBtn.setAttribute('aria-expanded', false);
    //   } else
    //   {
    //     secondaryItems.forEach((item, i) => {
    //       if (!hiddenItems.includes(i)) {
    //         item.classList.add('--hidden');
    //       }
    //     });
    //   }
    // };

    // doAdapt(); // adapt immediately on load
    // window.addEventListener('resize', doAdapt); // adapt on window resize

    // // hide Secondary on the outside click

    // document.addEventListener('click', e => {
    //   let el = e.target;
    //   while (el) {
    //     if (el === secondary || el === moreBtn) {
    //       return;
    //     }
    //     el = el.parentNode;
    //   }
    //   container.classList.remove('--show-secondary');
    //   moreBtn.setAttribute('aria-expanded', false);
    // });
  }


  ngOnDestroy() {
    if(this.user_subscription) { this.user_subscription.unsubscribe(); } 
  }
}
