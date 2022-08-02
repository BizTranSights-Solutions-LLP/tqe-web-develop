import { Component, OnInit, OnDestroy } from '@angular/core';
import {ActivatedRoute, Router, NavigationEnd} from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { DataService } from '../../../services/data.service';
import { SeoService } from '../../../services/seo.service';
import { Subscription } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { Meta } from '@angular/platform-browser';

declare var window: any;
declare var FB: any;
declare var $: any;
@Component({
  selector: 'app-article-detail',
  templateUrl: './article-detail.component.html',
  styleUrls: ['./article-detail.component.css']
})
export class ArticleDetailComponent implements OnInit,OnDestroy {

  allData: any = {};

  trendingArticles: any = [];
  relatedTool: any = [];
  shareObj: any;

  LoggedIn: boolean = false;
  loader: boolean = true;

  top:number = 100;

  serverErrors: string = '';
  related_tool_server_message: string = '';


  user_subscription: Subscription;
  editOnDashboardSubscription: Subscription;

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private dataService: DataService,
    private router: Router,
    private seoService: SeoService,
    private domSanitizer:DomSanitizer,
    private meta: Meta
  ) {

  }

  ngOnInit() {
    this.loadScript();

    this.LoggedIn = this.authService.isUserLoggedIn();

    this.user_subscription = this.authService.logginEvent.subscribe(
      (res) => {
        if(res) {
          this.authService.overLay.emit(false);
          this.LoggedIn = true;
          this.getArticle();
        }
      }
    )

    this.getArticle();

    this.authService.logoutEvent.subscribe(
      (res:any) => {
        if(res) {
          this.LoggedIn = false;
          this.authService.overLay.emit(false);
        }
      }
    )

    this.dataService.trending_articles(5).subscribe(
      (res:any) => {
        this.trendingArticles = res.result.article_data;
      }
    )
  }
  loadScript() {
    let node = document.createElement('script');
    node.type = 'text/javascript';
    node.async = true;
    node.charset = 'utf-8';
    node.src = "https://connect.facebook.net/en_US/sdk.js";
    // node.innerHTML = `!function(f,b,e,v,n,t,s)
    // {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    // n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    // if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    // n.queue=[];t=b.createElement(e);t.async=!0;
    // t.src=v;s=b.getElementsByTagName(e)[0];
    // s.parentNode.insertBefore(t,s)}(window, document,'script',
    // 'https://connect.facebook.net/en_US/fbevents.js');
    // fbq('init', '322283231786473');
    // fbq('track', 'PageView');`;
    document.getElementsByTagName('head')[0].appendChild(node);


    window.fbAsyncInit = () => {
      console.log("fbasyncinit")
      //  334800210757618
      //906950309685426
      FB.init({
          appId            : '334800210757618',
          autoLogAppEvents : true,
          xfbml            : true,
          version          : 'v2.10',
          status           : true,
          cookie           : true
      });
      FB.AppEvents.logPageView();
      console.log(FB.AppEvents.logPageView());
      // This is where we do most of our code dealing with the FB variable like adding an observer to check when the user signs in

      // ** ADD CODE TO NEXT STEP HERE **
    }

  }

  async getArticle(){
    this.loader = true;
    let article_title = this.route.snapshot.params['title'];
    let data:any;
    try{
      data = await this.dataService.get_article(article_title).toPromise();

      if(typeof data.result === 'string') {
        this.router.navigate(['articles']);
      } else {
        this.serverErrors = '';
        this.loader = false;
        this.allData = data.result;
        this.editOnDashboardSubscription = this.dataService.editOnDashboard.subscribe(
          (res: string) => {
            if(res && Object.keys(this.allData).length > 0){
              let url = 'admin/'+res+'/'+this.allData.id;
              window.open(url, "_blank");
            }
          }
        );

        this.relatedTools();
        this.seoService.updateTitle(this.allData.title);
        if(this.allData.meta_tags.length > 0) {
          let meta_data = this.allData.meta_tags[0];
          if(this.allData.images.length > 0) {
            this.seoService.updateImage(this.allData.images[0].file_path);
          }
          this.seoService.updateAllTags({type:'article', title: this.allData.title, description: meta_data.description, url: window.location.href, image: this.allData.images.length > 0 ? this.allData.images[0].file_path : '' });
          this.seoService.updateSeoTags(meta_data.title,meta_data.description,window.location.href,meta_data.keyword);

          this.meta.addTags([
            { name: 'twitter:card', content: 'summary_large_image' },
            { name: 'twitter:site', content: '@TheQuantEdge' }
          ]);

        }
        this.shareObj = {
          href: 'https://www.thequantedge.com/article/' + this.allData.article_url,
          hashtag: "#"+this.allData.title,
          name: this.allData.title,
          description: "Awesome desc",
          picture: this.allData.images[0].file_path
        };
      }
    }catch(e) {
      if(e.status === 401 || e.error.message === 'Unauthenticated.') {
        this.serverErrors = 'You are UnAuthenticated. Please login again!';
        this.loader = false;
        setTimeout(()=>{
          this.authService.logoutEvent.emit(true);
          localStorage.clear();
          sessionStorage.clear();
          this.router.navigate(['/'])
        },1000);
      }
    }
  }

  getInnerHTMLValue(html){
    return this.domSanitizer.bypassSecurityTrustHtml(html);
  }
  share() {
    FB.ui({
      // method: 'feed',
      // name: this.allData.title,
      // link: 'https://www.thequantedge.com/article/' + this.allData.article_url,
      // picture: this.allData.images[0].file_path,
      // description: this.allData.content
      method: 'share_open_graph',
      action_type: 'og.shares',
      action_properties: JSON.stringify({
        object : {
          'og:url': window.location.origin +'/article/' + this.allData.article_url,
          'og:title': this.allData.title,
          'og:description': this.allData.content,
          'og:image': this.allData.images[0].file_path
        }
      })
    });
  }

  getConvertedNumber(number:number): string{
    if(number == 1) {
      return 'One';
    }else if(number == 2) {
      return 'Two';
    }else {
      return 'Three';
    }
  }
  getFreeArticle(id: number) {
    this.loader = true;
    this.dataService.get_free_article(id).subscribe(
      (res: any) => {
        if(res){
          this.getArticle();
        }
      },
      err => console.log(err)
    );
  }

  relatedTools(){
    this.dataService.get_related_tools(this.allData.id).subscribe(
      (res: any) => {
        this.relatedTool = res.result.tool_data;
        this.related_tool_server_message = res.result.message;
      },
      err => console.log(err)
    );
  }

  trendingArticle(url) {

    const element = document.querySelector('#scrollId');
    element.scrollIntoView({
      block: "start"
    });
    if(this.user_subscription) { this.user_subscription.unsubscribe(); }

    this.loader = true;
    this.dataService.get_article(url).subscribe(
      (res: any) => {

        this.relatedTools();
        this.allData = res.result;
        this.loader = false;
        this.router.navigate(['/article/',url])
        this.seoService.updateTitle(this.allData.title);
        if(this.allData.meta_tags.length > 0) {
          let meta_data = this.allData.meta_tags[0];
          this.seoService.updateDescription(meta_data.description);
          this.seoService.updateOgUrl(window.location.href);
          if(this.allData.images.length > 0) {
            this.seoService.updateImage(this.allData.images[0].file_path);
          }
        }
      },
      err => console.log(err)
    );
  }
  tryItFree() {
    this.authService.tryFree.emit(true);
    sessionStorage.setItem('is_trial','1');
    this.router.navigate(['membership-plan']);
  }
  ngOnDestroy() {
    localStorage.removeItem('article-id');
    if(this.user_subscription) { this.user_subscription.unsubscribe(); }
    if(this.editOnDashboardSubscription) { this.editOnDashboardSubscription.unsubscribe(); }
  }
  showOverlay() {
    this.authService.overLay.emit(true);
  }


}


