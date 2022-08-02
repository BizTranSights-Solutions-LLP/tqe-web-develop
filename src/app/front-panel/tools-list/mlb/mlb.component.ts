import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataService } from '../../../services/data.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { SeoService } from '../../../services/seo.service';
import { HelperService } from '../../../services/helper.service';
import { environment } from '../../../../environments/environment';

declare const fbq: any;

@Component({
  selector: 'app-mlb',
  templateUrl: './mlb.component.html',
  styleUrls: ['./mlb.component.css']
})
export class MlbComponent implements OnInit, OnDestroy {

  tools: any = [];
  message: string = '';
  loading: boolean = false;
  toolsData: Subscription;
  constructor(
    private dataService: DataService,
    private router: Router,
    private seoService: SeoService,
    private helperService: HelperService
    ) { }

  ngOnInit() {
    this.loading = true;
    this.dataService.updateToolTitle.emit('MLB Fantasy Tools')
    this.toolsData = this.dataService.get_tools(6, this.router.url).subscribe(
      (res:any) => {
        this.loading = false;
        this.tools = res.result.tool_data;
        this.message = res.result.message;

        if(res.meta.code === 200) {

          if(res.result.meta_tags.length > 0) {
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
      },
      (err) => {
        console.log(err);
        this.message = err.statusText;
        this.loading = false;
      }
    )
  }
  openModal(url, name) {
    const Url =  url;
    const Show = true;
    const Name = name;
    this.dataService.popupToolVideo.emit({Url , Name, Show});
  }
  displayImage(index) {
    $('.image_ph_'+index).hide();
    $('.image_show_'+index).show();
  }

  ngOnDestroy() {
    if(this.toolsData) { this.toolsData.unsubscribe(); }
  }
}
