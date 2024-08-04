import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ActivatedRoute, Router, NavigationStart } from '@angular/router';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LoginResponse } from '../../models/login';
import { filter } from 'rxjs/operators';



@Component({
  selector: 'app-whop-login',
  templateUrl: './whop-login.component.html',
  styleUrls: ['./whop-login.component.css']
})
export class WhopLoginComponent implements OnInit {

  login_subscription: Subscription;
  userSubscribedOnWhop: boolean = false;

  constructor(private authService: AuthService, private route: ActivatedRoute, private http: HttpClient, private router: Router) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const whopCode = params['code']
      if (whopCode) {
        this.requestAuthorizationTokenFromWhop(whopCode);
      }
    });
    this.router.events.pipe(
      filter(event => event instanceof NavigationStart)
    ).subscribe((event: NavigationStart) => {
      if (event.navigationTrigger === 'popstate') {
        this.router.navigateByUrl('/');
      }
    })
  }

  requestAuthorizationTokenFromWhop(whopCode: string) {
    const url = 'https://api.whop.com/v5/oauth/token';
    const body = {
      code: whopCode,
      client_id: environment.whopClientId,
      client_secret: environment.whopClientSecret,
      redirect_uri: environment.whopRedirectURI
    };
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    this.http.post(url, body, { headers }).subscribe(
      (response: any) => {
        if (response.access_token) {
          this.checkUserWhopSubscription(response.access_token);
        }
      },
      (error) => {
        console.error('Unable to request Authorization Token from Whop...', error);
      }
    );
  }

  checkUserWhopSubscription(accessToken: string) {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${accessToken}`,
    });
    this.http.get('https://api.whop.com/api/v5/me/memberships', { headers }).subscribe(
      (response: any) => {
        for (let membership of response.data) {
          if (membership.product_id === environment.basicViewProductIDOnWhop || membership.product_id === environment.professionalViewProductIDOnWhop) {
            this.userSubscribedOnWhop = true;
            break;
          }
        }
        if (this.userSubscribedOnWhop) {
          this.fetchUserDetails(accessToken);
        }
        else {
          const isConfirmed = window.confirm('Please subscribe to The Quant Edge through Whop. Click OK to be redirected to Whop.');
          if (isConfirmed) {
            window.location.href = environment.tqeLocationOnWhop;
          } else {
            this.router.navigateByUrl('/');
          }
        }
      },
      (error) => {
        console.error('Unable to check User Membership Details...', error);
      }
    );
  }

  fetchUserDetails(accessToken: string) {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${accessToken}`,
    });
    const url = 'https://api.whop.com/v5/me';
    this.http.get(url, { headers }).subscribe(
      (response: any) => {
        console.log(response);
        console.log(accessToken);
        this.login_subscription = this.authService.login(environment.whopUserLoginData).subscribe(
          (res: LoginResponse) => {
            if (res.meta.code === 200) {
              console.log(res);
              res.result.first_name = response.username;
              res.result.is_whop_user = true;
              res.result.whop_user_access_token = accessToken;
              localStorage.setItem('data', JSON.stringify(res.result));
              this.authService.logginEvent.emit(true);
              this.router.navigate(['landing']);
            }
          }
        )
      },
      (error) => {
        console.error('Unable to fetch User Data...', error);
      }
    );
  }

  ngOnDestroy() {
    this.userSubscribedOnWhop = false;
    if (this.login_subscription) { this.login_subscription.unsubscribe(); }
  }
}
