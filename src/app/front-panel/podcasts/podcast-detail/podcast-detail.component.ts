import { Component, OnInit, ViewChild, ChangeDetectorRef, OnDestroy, ElementRef } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../../services/data.service';
import { PlyrComponent, PlyrDriverUpdateSourceParams, PlyrDriverCreateParams, PlyrDriverDestroyParams } from 'ngx-plyr';
import Plyr from 'plyr';
import { SeoService } from '../../../services/seo.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-podcast-detail',
  templateUrl: './podcast-detail.component.html',
  styleUrls: ['./podcast-detail.component.css']
})
export class PodcastDetailComponent implements OnInit, OnDestroy {

  @ViewChild('audioPlyr') audioPlyr: ElementRef;
   // get the component instance to have access to plyr instance
   @ViewChild(PlyrComponent)
   plyr: PlyrComponent;
 
   // or get it from plyrInit event
   player: Plyr;
 
   

  allData: any = {};
  LoggedIn: boolean = false;
  loader: boolean = true;
  show_player: boolean = false;

  src: string = '';

  user_subscription: Subscription;
  podcast_subscription: Subscription;
  editOnDashboardSubscription: Subscription;
  audioSources: Plyr.Source[] = [
    {
      src: '',
      type: 'audio/mp3',
    }
  ];
  constructor(
    private authService: AuthService,
    private route: ActivatedRoute, 
    private dataService: DataService, 
    private router: Router, 
    private seoService: SeoService,
    private cd: ChangeDetectorRef
    ) { }

  ngOnInit() {
    this.LoggedIn = this.authService.isUserLoggedIn();
    
    this.user_subscription = this.authService.logginEvent.subscribe(
      (res) => {
        if(res) {
          this.authService.overLay.emit(false);
          this.LoggedIn = true;
          this.getPodcast();
        }
      }
    )
    
    this.getPodcast();
    
    this.authService.logoutEvent.subscribe(
      (res:any) => {
        if(res) {
          this.LoggedIn = false;
          this.authService.overLay.emit(false);
        }
      }
    )
  }

  getPodcast() {
    //let podcast_id = this.route.snapshot.queryParams['id'];
    let podcast_title = this.route.snapshot.params['title'];
    //this.route.queryParams.subscribe(param => console.log(param['id']));

    this.podcast_subscription = this.dataService.get_podcast(podcast_title).subscribe(
      (res: any) => {
        this.allData = res.result;
        if(typeof this.allData === 'string') {
          this.router.navigate(['podcasts']);
        } else {
        
          this.loader = false;
          this.seoService.updateTitle(this.allData.title);
          if(this.allData.meta_tags.length > 0) {
            let meta_data = this.allData.meta_tags[0];
            // this.seoService.updateTitle(meta_data.title);
            // this.seoService.updateKeywords(meta_data.keyword);
            // this.seoService.updateDescription(meta_data.description);
            // this.seoService.updateOgUrl(window.location.href);
            if(this.allData.images.length > 0) {
              this.seoService.updateImage(this.allData.images[0].file_path);            
            }

            this.seoService.updateAllTags({type:'podcast', title: this.allData.title, description: meta_data.description, url: window.location.href, image: this.allData.images.length > 0 ? this.allData.images[0].file_path : '' });
            this.seoService.updateSeoTags(meta_data.title,meta_data.description,window.location.href,meta_data.keyword);
          }

          if(this.allData.files && this.allData.files.length > 0 && this.allData.files[0].file_path) {
            this.audioSources.map(d => {
              d.src = this.allData.files[0].file_path;
              return d;
            })
            this.show_player = true;
            // this.cd.detectChanges();
            // console.log(this.audioSources);
          // this.audioSources[0].src = this.allData.files[0].file_path;
          }

          this.editOnDashboardSubscription = this.dataService.editOnDashboard.subscribe(
            (res: string) => {
              if(res && Object.keys(this.allData).length > 0){
                let url = 'admin/'+res+'/'+this.allData.id;
                // this.router.navigate([url]);
                window.open(url, "_blank");
              }
            }
          );
        }
      },
      err => console.log(err)
    ); 
  }
  showOverlay() {
    this.authService.overLay.emit(true);
  }
 
  setAudioPlaybackRate(speed: string) {
    this.audioPlyr.nativeElement.playbackRate = speed ? speed : 1;
  }

  played(event: Plyr.PlyrEvent) {
    //console.log('played', event);
  }


  // create(params: PlyrDriverCreateParams) {
  //   return new Plyr(params.videoElement, params.options);
  // }

  // updateSource(params: PlyrDriverUpdateSourceParams) {
  //   params.plyr.source = params.source;
  // }

  // destroy(params: PlyrDriverDestroyParams) {
  //   params.plyr.destroy();
  // }

  tryItFree() {
    this.authService.tryFree.emit(true);
    sessionStorage.setItem('is_trial','1');
    this.router.navigate(['membership-plan']);
  }

  ngOnDestroy() {
    if(this.user_subscription) { this.user_subscription.unsubscribe(); }
    if(this.podcast_subscription) { this.podcast_subscription.unsubscribe(); }
    if(this.editOnDashboardSubscription) { this.editOnDashboardSubscription.unsubscribe(); }
  }
}

