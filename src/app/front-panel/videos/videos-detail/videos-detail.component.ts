import { Component, OnInit, ViewChild, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../../services/data.service';
import { SeoService } from '../../../services/seo.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-videos-detail',
  templateUrl: './videos-detail.component.html',
  styleUrls: ['./videos-detail.component.css']
})
export class VideosDetailComponent implements OnInit {

  allData: any = {};
  LoggedIn: boolean = false;
  loader: boolean = true;
  show_player: boolean = false;

  error: string = '';
  src: string = '';

  user_subscription: Subscription;
  getVideoSubscription: Subscription;
  editOnDashboardSubscription: Subscription;
  
  constructor(
    private authService: AuthService,
    private route: ActivatedRoute, 
    private dataService: DataService, 
    private router: Router, 
    private seoService: SeoService
    ) { }

  ngOnInit() {
    this.LoggedIn = this.authService.isUserLoggedIn();
    
    this.user_subscription = this.authService.logginEvent.subscribe(
      (res) => {
        if(res) {
          this.error = '';
          this.authService.overLay.emit(false);
          this.LoggedIn = true;
          this.getTQEVideo();
        }
      }
    )
    
    this.getTQEVideo();
    
    this.authService.logoutEvent.subscribe(
      (res:any) => {
        if(res) {
          this.LoggedIn = false;
          this.authService.overLay.emit(false);
        }
      }
    )
  }

  getTQEVideo() {
    
    let video_title = this.route.snapshot.params['title'];

    this.getVideoSubscription = this.dataService.get_tqe_video(video_title).subscribe(
      (res: any) => {
        this.loader = false;
        if(res.meta.code !== 200) {
          // this.router.navigate(['tqe-videos']);
          this.error = res.meta.message;
        } else {
          this.allData = res.result;
          this.seoService.updateTitle(this.allData.title);
          if(this.allData.meta_tags.length > 0) {
            let meta_data = this.allData.meta_tags[0];
            
            if(this.allData.images.length > 0) {
              this.seoService.updateImage(this.allData.images[0].file_path);            
            }

            this.seoService.updateAllTags({type:'videos', title: this.allData.title, description: meta_data.description, url: window.location.href, image: this.allData.images.length > 0 ? this.allData.images[0].file_path : '' });
            this.seoService.updateSeoTags(meta_data.title,meta_data.description,window.location.href,meta_data.keyword);
          }

        }
      },
      err => {
        this.loader = false;
        this.error = 'Your token has been expired.';
        this.authService.logoutEvent.emit(true);
      }
    ); 
  }

  showOverlay() {
    this.authService.overLay.emit(true);
  }

  tryItFree() {
    this.authService.tryFree.emit(true);
    sessionStorage.setItem('is_trial','1');
    this.router.navigate(['membership-plan']);
  }

  ngOnDestroy() {
    if(this.user_subscription) { this.user_subscription.unsubscribe(); }
    if(this.getVideoSubscription) { this.getVideoSubscription.unsubscribe(); }
    if(this.editOnDashboardSubscription) { this.editOnDashboardSubscription.unsubscribe(); }
  }

}
