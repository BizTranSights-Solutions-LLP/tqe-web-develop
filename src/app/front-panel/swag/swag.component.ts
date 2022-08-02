import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { SeoService } from '../../services/seo.service';
import { Router } from '@angular/router';
import { HelperService } from '../../services/helper.service';
import { environment } from '../../../environments/environment';

declare const fbq: any;

@Component({
  selector: 'app-swag',
  templateUrl: './swag.component.html',
  styleUrls: ['./swag.component.css']
})
export class SwagComponent implements OnInit {
  @ViewChild('myDiv') myDiv: ElementRef;
  

  content = "<script>  var spread_shop_config = {      shopName: 'thequantedge',      locale: 'us_US',      prefix: 'https://shop.spreadshirt.com',      baseId: 'myShop'  }; </script> <script type='text/javascript' src='https://shop.spreadshirt.com/shopfiles/shopclient/shopclient.nocache.js'> </script>";
  constructor(private renderer: Renderer2, private seoService: SeoService,
    private router: Router, private helperService: HelperService) { }

  async ngOnInit() {
    this.renderer.setAttribute(this.myDiv.nativeElement, 'innerHTML', this.content);
    this.seoService.updateTitle('TQE Swag');

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

}
