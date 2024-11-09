import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { AuthService } from '../services/auth.service';
import { MembershipService } from '../services/membership.service';

@Injectable({
  providedIn: 'root'
})
export class PicksAccessResolver implements Resolve<boolean> {

  constructor(
    private authService: AuthService,
    private membershipService: MembershipService,
    private http: HttpClient,
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    // Need to update active memberships as user might have subscribed/unsubscribed to plans after logging into their account
    this.membershipService.updateUserActiveMemberships();
    
    const userData = this.authService.getUserDetail();
    // If the user is a Whop user, check their membership status
    if (userData.is_whop_user) {
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${userData.whop_user_access_token}`,
      });
  
      return this.http.get('https://api.whop.com/api/v5/me/memberships', { headers }).pipe(
        map((response: any) => {
          // Return true if response.data is not empty (User has a membership), otherwise false
          return response.data && response.data.length > 0;
        }),
        catchError((error) => {
          console.error('Unable to check User Membership Details...', error);
          return of(false);
        })
      );
    }

    // For non-Whop users, return true if they have memberships, otherwise false
    return of(!!(userData && userData.memberships && Object.keys(userData.memberships).length > 0));
  }
}
