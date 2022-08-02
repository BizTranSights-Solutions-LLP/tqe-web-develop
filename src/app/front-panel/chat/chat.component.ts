import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataService } from '../../services/data.service';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';
import { SeoService } from '../../services/seo.service';
import { HelperService } from '../../services/helper.service';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

declare const fbq: any;
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {
  loader:boolean = true;
  LoggedIn:boolean = false;
  serverErr: string = '';
  discrods:any = [];

  loginEventSubscription:Subscription;
  discordChat:Subscription;
  

  constructor(private dataService: DataService, private authService: AuthService, private seoService: SeoService, private helperService: HelperService, private router: Router,) { }

  async ngOnInit() {
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

    this.seoService.updateTitle('Sports Betting Chat | NFL, NBA, NCAA, MLB, UFC | The Quant Edge');

    this.LoggedIn = this.authService.isUserLoggedIn();
    // if(!this.LoggedIn) {
    //   this.loader = false;
    // } else {
    //   this.get_chat();
    // }

    this.loginEventSubscription = this.authService.logginEvent.subscribe(
      (res) => {
        if(res) {          
          this.loader = true;          
          this.LoggedIn = true;
          this.get_user_data();
          this.get_chat();
        }
      }
    )
    this.get_chat();
    this.get_user_data(); 

    
  }
  async get_user_data(){

    let data:any;
    try{
      data = await this.dataService.get_user_information().toPromise();
      this.loader = false;      
      
    }catch(e) {
      if(e.status === 401 || e.error.message === 'Unauthenticated.') {
        // this.serverErrors = 'You are UnAuthenticated. Please login again!';
        this.loader = false;
        this.LoggedIn = false;
        
        setTimeout(()=>{
          this.authService.logoutEvent.emit(true);
          localStorage.clear();
          sessionStorage.clear();
          // this.router.navigate(['/'])
        },1000);
      }
      // else if(e.status === 400 || e.error.message === 'No membership found.') {
      //   // this.serverErrors = 'You are UnAuthenticated. Please login again!';
      //   this.tourGuide.hide();
      //   console.log(this.serverErrors);

      // }
    }
  }

  get_chat() {
    this.discordChat = this.dataService.get_discord_chat().subscribe(
      (res:any) => {
        this.loader = false;
        this.discrods = res.result.discord_chat_data;
      }
    )
  }
  showOverlay() {
    this.authService.overLay.emit(true);
  }
  ngOnDestroy() {
    
    if(this.loginEventSubscription) { this.loginEventSubscription.unsubscribe(); }
    if(this.discordChat) { this.discordChat.unsubscribe(); }
  }
}

