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
export class ImpactToolsAccessResolver implements Resolve<{viewAccessLevel: string, isWhopUser: boolean}> {

  constructor(
    private authService: AuthService,
    private membershipService: MembershipService,
    private http: HttpClient,
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<{viewAccessLevel: string, isWhopUser: boolean}> {
    // Need to update active memberships as user might have subscribed/unsubscribed to plans after logging into their account
    this.membershipService.updateUserActiveMemberships();

    const userData = this.authService.getUserDetail();
    let accessLevel = 'No_Access'

    // If the user is a Whop user, check their membership status
    if (userData.is_whop_user) {
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${userData.whop_user_access_token}`,
      });

      return this.http.get('https://api.whop.com/api/v5/me/memberships', { headers }).pipe(
        map((response: any) => {
            console.log(response.data);
            
            for (let membership of response.data) {
                if (membership.product_id == environment.professionalViewProductIDOnWhop) {
                    accessLevel = 'Professional';
                    break;
                }
                if (membership.product_id == environment.basicViewProductIDOnWhop) {
                    accessLevel = 'Basic';
                }
              }
              return {viewAccessLevel: accessLevel, isWhopUser: true};
        }),
        catchError((error) => {
          console.error('Unable to check User Membership Details...', error);
          return of({viewAccessLevel: 'No_Access', isWhopUser: true});
        })
      );
    }

    console.log(userData);
    // For non-Whop users, return true if they have memberships, otherwise false
    if (userData && userData.memberships && Object.keys(userData.memberships).length > 0) {

      for (const [id, name] of Object.entries(userData.memberships)) {

          // 30 - Professional Edition Free Trial
          // 31 - Professional Edition Monthly Plan
          // 32 - Professional Edition Annual Plan
          // 33 - Basic Edition Annual Plan
          // 34 - Basic Edition Monthly Plan
          if ([30, 31, 32].includes(Number(id))) {
              accessLevel = 'Professional';
              break;
          } else if ([33, 34].includes(Number(id))) {
              accessLevel = 'Basic';
          }
      }
      return of({ viewAccessLevel: accessLevel, isWhopUser: false });
  }
    return of({viewAccessLevel: 'No_Access', isWhopUser: false});
    }
}
