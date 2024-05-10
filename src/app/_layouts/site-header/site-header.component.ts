import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';

import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoginResponse } from '../../models/login';
import { Location } from '@angular/common';
import { DataService } from '../../services/data.service';

declare var $:any;
@Component({
  selector: 'site-header',
  templateUrl: './site-header.component.html',
  styleUrls: ['./site-header.component.scss']
})
export class SiteHeaderComponent implements OnInit,OnDestroy {

  showPassword: boolean = false;
  loggedIn: boolean = false;
  dropDownCollapse: boolean = false;
  hideEle:boolean = false;
  overLay:boolean = false;
  burgerMenu:boolean = false;
  is_admin:boolean = false;
  searchBarDrop:boolean = false;
  typeofComponent: string = 'light';

  selectTool:string = 'All';
  forgot_pass_error:string = '';
  Name: string = '';
  className:string;

  dashboardUrls = {
    article: 'article-form',
    podcast: 'podcast-form',
  }

  login_error_message:string = 'All highlighted fields are required';
  server_error_message:string = '';

  disable_login: boolean = false;
  disable_forgot: boolean = false;
  editBtn: boolean = false;

  loginForm = new FormGroup({
    username: new FormControl(null, Validators.required),
    password: new FormControl(null, Validators.required)
  });

  forgotForm = new FormGroup({
    email: new FormControl(null, [Validators.required,Validators.email])
  });

  searchForm = new FormGroup({
    value: new FormControl(null),
  });

  private ip_address:string = '';

  login_subscription: Subscription;
  getOverLayState: Subscription;
  user_name: Subscription;
  updtae_user_name: Subscription;
  navigationLinks:any = [
    {
      label: 'Picks',
      subNav: [
        // Hide till future update
        // {label: 'Today\'s Best Bets', loggedInURL: '/tool/best-bets/today', loggedOutURL: '/tool/best-bets/today' },
        
        {label: 'NFL Picks', loggedInURL: '/tool/best-bets/nfl', loggedOutURL: '/tool/best-bets/nfl'},
        {label: 'NBA Picks', loggedInURL: '/tool/best-bets/nba', loggedOutURL: '/tool/best-bets/nba'},
        {label: 'MLB Picks', loggedInURL: '/tool/best-bets/mlb', loggedOutURL: '/tool/best-bets/mlb'},
        {label: 'Soccer Picks', loggedInURL: '/tool/best-bets/soccer', loggedOutURL: '/tool/best-bets/soccer'},
        {label: 'NCAAB Picks', loggedInURL: '/tool/best-bets/cb', loggedOutURL: '/tool/best-bets/cb'},
        {label: 'NCAAF Picks', loggedInURL: '/tool/best-bets/cf', loggedOutURL: '/tool/best-bets/cf'},
        {label: 'NHL Picks', loggedInURL: '/tool/best-bets/nhl', loggedOutURL: '/tool/best-bets/nhl'},
        //{label: 'Statistical Surveillance', loggedInURL: '/', loggedOutURL: '/'},
        
        // {label: 'Today\'s NCAA Basketball Picks', loggedInURL: '/tool/best-bets/cb', loggedOutURL: '/tool/best-bets/cb'},
        // {label: 'MLB', loggedInURL: '', loggedOutURL: ''},
        // {label: 'NCAA Football Picks', loggedInURL: '/tool/best-bets/cf', loggedOutURL: '/tool/best-bets/cf' },
        // {label: 'Betting Results', loggedInURL: '/picks-history', loggedOutURL: '/membership-plan' }
      ]
    },

    {
      label: 'Player Impact Tools',
      subNav: [
        {label: 'NFL Player Impact', loggedInURL: '/tool/nfl-player-impact', loggedOutURL: '/membership-plan'},
        {label: 'NBA Player Impact', loggedInURL: '/tool/nba-player-impact', loggedOutURL: '/membership-plan' },
        // BP Change comment out 2 lines below 202200206
        // {label: 'NFL Demo', loggedInURL: '/nfl-demo', loggedOutURL: '/nfl-demo'},
        // {label: 'NBA Demo', loggedInURL: '/nba-demo', loggedOutURL: '/nba-demo'},
      ]
    },
    {
      label: 'About Us',
      subNav: [
        {label: 'How TQE Works', loggedInURL: '/how-it-works', loggedOutURL: '/how-it-works'},
        {label: 'Meet the Team', loggedInURL: '/meet-the-team', loggedOutURL: '/meet-the-team'},
        {label: 'Betting 101', loggedInURL: '/education-page', loggedOutURL: '/education-page'},
        {label: 'TQE Tools Tutorial', loggedInURL: '/TQE-Tools-Info', loggedOutURL:'/TQE-Tools-Info'}
/*        {label: 'Chat With Us', loggedInURL: '/chat', loggedOutURL: '/chat'},
        {label: 'Shop TQE', loggedInURL: '/shop-tqe', loggedOutURL: '/shop-tqe'},*/
      ]
    }
  ];

  constructor(private authService: AuthService, private router: Router, private location: Location, private dataService: DataService) {
    this.router.events.subscribe(
      event => {
        if(event instanceof NavigationStart) {
          let url = event.url;
		  
		           let module_name = url.substring(1, url.length).split('/')[0];
          this.editBtn = module_name in this.dashboardUrls;
        }
      }
    );
  }

  async ngOnInit() {

    let url = this.router.url;


    if(url.includes("/best-bets") || url.includes("/nfl-player-impact") || url.includes("/nba-player-impact")){
      this.typeofComponent = 'dark'

    }else{
      this.typeofComponent = 'light'
    }

    let module_name = url.substring(1, url.length).split('/')[0];
    this.editBtn = module_name in this.dashboardUrls;

    let user_data = this.authService.getUserDetail();
    if(this.authService.isUserLoggedIn() && Object.keys(user_data).length > 0) {
      if(user_data.roles_status && (user_data.roles_status.is_admin || user_data.roles_status.is_editor || user_data.roles_status.is_author)) {
        this.is_admin = true;
      }
    }

    let address_info:any;
    try{
      address_info = await this.authService.get_address_info().toPromise();
      this.ip_address = address_info.ip;
    }catch(e) {}

    this.loggedIn = this.authService.isUserLoggedIn();
    this.Name = this.authService.getUserDetail() ? this.authService.getUserDetail().first_name : '';

    this.user_name = this.authService.logginEvent.subscribe(
      (res:any) => {
        if(res) {
          this.loggedIn = this.authService.isUserLoggedIn();
          this.Name = this.authService.getUserDetail() ? this.authService.getUserDetail().first_name : '';
          let user_data = this.authService.getUserDetail();
          if(this.authService.isUserLoggedIn() && Object.keys(user_data).length > 0) {
            if(user_data.roles_status && (user_data.roles_status.is_admin || user_data.roles_status.is_editor || user_data.roles_status.is_author)) {
              this.is_admin = true;
            }
          }
        }
      }
    )

    this.updtae_user_name = this.authService.updateUserName.subscribe(
      (res:string) => {
        if(res) {
          this.Name = res;
        }
      }
    )

    this.authService.logoutEvent.subscribe(
      (res:any) => {
        if(res) {
          this.loggedIn = false;
          this.is_admin = false;
        }
      }
    )

    this.getOverLayState = this.authService.overLay.subscribe(
      (res: boolean) => {
        this.overLay = res;
      }
    )
    // setTimeout(function(){
    //   $(".error").removeClass("showErr");
    // }, 1000);

    // setTimeout(() => {
    //   this.className = "showErr";
    // }, 1500);
    this.router.events.subscribe(
      event => {
        if(event instanceof NavigationEnd) {
          this.overLay = false;
          this.burgerMenu = false;
          this.searchBarDrop = false;
        }
      }
    )
  }

  redirectToDashboard() {
    let url = this.router.url;
    let module_name = url.substring(1,url.length).split('/')[0];
    let admin_module_name = this.dashboardUrls[module_name];

    if(admin_module_name) {
      this.dataService.editOnDashboard.emit(admin_module_name);
    } else {
      console.log('Redirect not possible');
    }

  }

  async forgotPassword() {
    if(this.forgotForm.valid) {
      let email = 'rpfm-' + this.forgotForm.value.email
      this.disable_forgot = true;
      this.forgot_pass_error = '';

      let response: any;

      try{
        response = await this.authService.forgot_password(this.forgotForm.value).toPromise();
      }catch(e) {
        this.forgot_pass_error = e.error.message;
      }

      if(response.meta.code === 200) {
        this.disable_forgot = false;
        this.forgotForm.reset();
        sessionStorage.setItem('rpfm',email);
        $('.login-form-dropdown').click();
        this.router.navigate(['reset-password']);

        this.overLay = false;

      } else {
        this.disable_forgot = false;
        this.forgot_pass_error = response.meta.message;
      }
    }
  }

  tryItFree() {
    this.authService.tryFree.emit(true);
    sessionStorage.setItem('is_trial','1');
    this.router.navigate(['/try-it-free/create-account/allinclusive']);
    this.burgerMenu = false;
    this.searchBarDrop = false;
  }

  joinNow() {
    this.authService.tryFree.emit(false);
    if(sessionStorage.getItem('is_trial')) {
      sessionStorage.removeItem('is_trial');
    }
    this.router.navigate(['membership-plan']);
  }

  onClickDropExpend() {
    this.dropDownCollapse = true;
  }

  logOut() {
    localStorage.removeItem('data');
    this.loggedIn = false;
    this.router.navigate(['']);
    this.authService.logoutEvent.emit(true);
  }

  forgot() {

  }

  login() {
    if(this.loginForm.valid) {
      this.server_error_message = '';
      this.disable_login = true;

      let formdata = this.loginForm.value;

      formdata.device_type = environment.device_type;
      formdata.device_token = environment.device_token;
      formdata.ip_address = this.ip_address;

      this.login_subscription = this.authService.login(formdata).subscribe(
        (res: any) => {
          this.disable_login = false;
          if(res.meta.code === 200) {
            localStorage.setItem('data', JSON.stringify(res.result));
            this.authService.logginEvent.emit(true);
            if(this.router.url === '/') {
              this.router.navigate(['landing']);
            }
            this.overLay = false;
          } else {
            this.server_error_message = res.meta.message;
            setTimeout(()=>this.server_error_message = '',2000);
          }
        },
        (err) => {
          this.disable_login = false;
          this.server_error_message = err.message;
          setTimeout(()=>this.server_error_message = '',2000 );
        }
      )

    }

  }

  ngOnDestroy() {
    if(this.login_subscription) { this.login_subscription.unsubscribe(); }
    if(this.getOverLayState) this.getOverLayState.unsubscribe();
    if(this.user_name) this.user_name.unsubscribe();
    if(this.updtae_user_name) this.updtae_user_name.unsubscribe();
  }

  button_show_password() {
    if (!this.showPassword){
      this.showPassword = true;
    } else {
      this.showPassword = false;
    }
  }

  button_get_tool(tool: string) {
    this.selectTool = tool.toLowerCase( );
  }
  showOverlay() {
    this.burgerMenu = false;
    if(!this.overLay){
      this.overLay = true;
    }else{
      this.overLay = false;
    }
  }
  onSearchChange(searchValue : any){
    const search_type = this.selectTool.toLowerCase( )
    const search = searchValue.value
    if(search !== '') {
      this.router.navigate(['/search/'], { queryParams: { search_type, search } });
    }
  }
  menu() {
    if(!this.burgerMenu){
      this.burgerMenu = true;

    }else{
      this.burgerMenu = false;
    }
    this.searchBarDrop = false;
  }

  search_bar(){
    if(!this.searchBarDrop){
      this.searchBarDrop = true;

    }else{
      this.searchBarDrop = false;
    }
    this.burgerMenu = false;
  }
}
