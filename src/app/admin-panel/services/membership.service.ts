import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { responseMembership } from '../models/membership-ById-model';
import { AuthService } from '../../services/auth.service';


@Injectable({
  providedIn: 'root'
})


export class MembershipService {
  
  headers: HttpHeaders;  
  constructor(private http: HttpClient, private authService: AuthService) {
    this.headers = new HttpHeaders().set('Content-Type','application/json')
  }


  save_membership( membership:any ): Observable<any>  {
      
    var formData = new FormData();

    for ( var key in membership ) {
        formData.append(key, membership[key]); 
    }

    formData.forEach((value,key) => {
      console.log(key+" "+value)     
    });
  
    formData.append('auth_code', this.authService.getUserDetail().auth_code);     

     return this.http.post(environment.base_url + 'admin/membership/save', formData);
    
  }

  delete_membership( membership:any ) : Observable<any>  {

    let Headers = {
      headers: this.headers
    }
    let auth_code = this.authService.getUserDetail().auth_code;
    membership.auth_code = auth_code;   
    return this.http.post(environment.base_url + 'admin/membership/delete', membership, Headers);

  }

  find_membership_by_id( membership:any ) : Observable<responseMembership>  {

    let Headers = {
      headers: this.headers
    }
    let auth_code = this.authService.getUserDetail().auth_code;
    membership.auth_code = auth_code;   
    return this.http.post<responseMembership>(environment.base_url + 'admin/membership/id', membership, Headers);
    
  }

  get_membership_listing(): Observable<any> {
     
    var body = {      
      "auth_code":	this.authService.getUserDetail().auth_code,
      "offset":	0,
      "length":	100,
      "total_count":	1
      };

    return this.http.post<any>(environment.base_url + 'admin/memberships', body)    
    

  }


  

} 
