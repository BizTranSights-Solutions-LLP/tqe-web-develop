import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { sportsTags } from '../models/sports-tags-model';
import { responseTool } from '../models/tool-ById-model';
import { AuthService } from '../../services/auth.service';


@Injectable({
  providedIn: 'root'
})


export class ToolService {
  
  headers: HttpHeaders; 
  
  constructor(private http: HttpClient, private authService: AuthService) {
    this.headers = new HttpHeaders().set('Content-Type','application/json')
  }


  save_tool( tool:any ): Observable<any>  {
      
    var formData = new FormData();

    for ( var key in tool ) {

      if(key !== 'tool_meta_tag' && key !== 'tool_sports_tag') 
      {

        if (key === "tool_image" ) 
        {
          tool[key] ? formData.append(key, tool[key]): '';
          
        }
        else 
        {
          formData.append(key, tool[key]);
        }    
            
      }
      else{
        formData.append(key, JSON.stringify(tool[key]));
      }    
        
    }

    formData.forEach((value,key) => {
      console.log(key+" "+value)     
    });
  
    formData.append('auth_code', this.authService.getUserDetail().auth_code);
      

     return this.http.post(environment.base_url + 'admin/tool/save', formData);
    
  }

  get_sports_tags(): Observable<sportsTags> {

    let Headers = {
      headers: this.headers
    }
    let auth_code = this.authService.getUserDetail().auth_code;   
    return this.http.post<sportsTags>(environment.base_url + 'sports_tags', auth_code, Headers);
  }

  delete_tool( tool:any ) : Observable<any>  {

    let Headers = {
      headers: this.headers
    }
    let auth_code = this.authService.getUserDetail().auth_code;
    tool.auth_code = auth_code;   
    return this.http.post(environment.base_url + 'admin/tool/delete', tool, Headers);

  }

  find_tool_by_id( tool:any ) : Observable<responseTool>  {

    let Headers = {
      headers: this.headers
    }
    let auth_code = this.authService.getUserDetail().auth_code;
    tool.auth_code = auth_code;   
    return this.http.post<responseTool>(environment.base_url + 'admin/tool/id', tool, Headers);
    
  }


  get_tool_listing(): Observable<any> {
     
    var body = {      
      "auth_code":	this.authService.getUserDetail().auth_code,
      "offset":	0,
      "length":	100,
      "total_count":	1
      };

    return this.http.post<any>(environment.base_url + 'admin/tools', body)    
    

  }



} 
