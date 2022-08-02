import { Component, OnInit } from '@angular/core';
import { SeoService } from '../../services/seo.service';
import { AuthService } from '../../services/auth.service';
import { Router, NavigationEnd } from '@angular/router';
import { HelperService } from '../../services/helper.service';
import { environment } from '../../../environments/environment';

declare const fbq: any;
@Component({
  selector: 'app-experts',
  templateUrl: './experts.component.html',
  styleUrls: ['./experts.component.css']
})
export class ExpertsComponent implements OnInit {

  constructor(private seoService:SeoService,
    private authService: AuthService,
    private router: Router,
    private helperService: HelperService
  ) { }

  ngOnInit() {
    this.seoService.updateTitle('TQE Tool Experts');

    this.router.events.subscribe(async (event: any) => {
      if(event instanceof NavigationEnd) {
        
        let url = event.url;
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
    });
  }

  tryItFree() {
    this.authService.tryFree.emit(true);
    sessionStorage.setItem('is_trial','1');
    this.router.navigate(['membership-plan']);
  }

}
