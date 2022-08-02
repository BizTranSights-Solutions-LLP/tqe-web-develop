import { Component, OnInit, OnDestroy } from '@angular/core';
import { SeoService } from '../../services/seo.service';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';
import { HelperService } from '../../services/helper.service';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

declare const fbq: any;
@Component({
  selector: 'app-affiliate',
  templateUrl: './affiliate.component.html',
  styleUrls: ['./affiliate.component.css']
})
export class AffiliateComponent implements OnInit, OnDestroy {

  loggedIn: boolean = false;
  user_name: Subscription;
  user_info = {};
  user_subscription: Subscription;

  constructor(private seoService:SeoService, private authService: AuthService,
    private helperService: HelperService,
    private router: Router) { }

  async ngOnInit() {
    this.seoService.updateTitle('Affiliate Marketing Program | The Quant Edge | Start Earning Today');

    this.loggedIn = this.authService.isUserLoggedIn();

    this.user_name = this.authService.logginEvent.subscribe(
      (res:any) => {
        if(res) {
          this.loggedIn = this.authService.isUserLoggedIn();
        }
      }
    )


    this.user_detail()



    this.user_subscription = this.authService.logginEvent.subscribe(
      (res) => {
        if(res) {
          this.user_detail();
          this.authService.overLay.emit(false);
          this.loggedIn = true;
        }
      }
    )
    let url = this.router.url;
    url = url.substring(1, url.length);

    try{
      let res: any = await this.helperService.get_meta_tags(url).toPromise();
      if(res.meta.code === 200) {

        if(!(Array.isArray(res.result.meta_tags))) {
          let { title, description, keyword } = res.result.meta_tags;
          this.seoService.updateSeoTags(title, description, window.location.href, keyword);
        } else if(Array.isArray(res.result.meta_tags) && res.result.meta_tags.length > 0){
          let { title, description, keyword } = res.result.meta_tags[0];
          this.seoService.updateSeoTags(title, description, window.location.href, keyword);
        }

        if(res.result.fb_pixel_scripts.length > 0) {
          let func = new Function(res.result.fb_pixel_scripts[0]);
          if (environment.production) {
            func();
          }
        }
      }
    }catch(e) {}
  }
  user_detail(){
    this.user_info = this.authService.getUserDetail();
  }

  ngOnDestroy() {
    if(this.user_name) this.user_name.unsubscribe();
    if(this.user_subscription) { this.user_subscription.unsubscribe(); }
  }

}
