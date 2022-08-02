import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { sportsTags } from '../models/sports-tags-model';
import { responsePodcast } from '../models/podcast-ById-model';
import { AuthService } from '../../services/auth.service';


@Injectable({
  providedIn: 'root'
})

 
export class PodcastService {
  
  headers: HttpHeaders;
 
  
  constructor(private http: HttpClient, private authService: AuthService) {
    this.headers = new HttpHeaders().set('Content-Type','application/json')
  }


  save_podcast( podcast:any ): Observable<any>  {
    
    let update_or_save = podcast.podcast_id ? 'update' : 'save';
    delete podcast['file_path'];
    delete podcast['podcast_image'];

    if(podcast.podcast_id) {
      if(!podcast.podcast_audio) {
        delete podcast.podcast_audio;
      }
    }
    let audi_file: any = podcast['podcast_audio'];
    var formData = new FormData();

    for ( var key in podcast ) {

      if(key !== 'podcast_meta_tag' && key!== 'podcast_sports_tag') {
        if (key === "podcast_image" ) 
        {
          podcast[key] ? formData.append(key, podcast[key]): '';
          
        } else 
        { 
          formData.append(key, podcast[key]);
        } 
      }
      else{
          formData.append(key, JSON.stringify(podcast[key]));
      }
      
      if(key === 'podcast_audio') {
        formData.append('podcast_file', audi_file);
      }
        
    }
  
    formData.append('auth_code', this.authService.getUserDetail().auth_code);
    

     return this.http.post(environment.base_url + 'admin/podcast/'+update_or_save, formData);
    
  }

  get_sports_tags(tag_type: string): Observable<sportsTags> {

    let Headers = {
      headers: this.headers
    }
    let auth_code = this.authService.getUserDetail().auth_code;   
    return this.http.post<sportsTags>(environment.base_url + 'sports_tags', { auth_code, tag_type }, Headers);
  }

  delete_podcast( podcast:any ) : Observable<any>  {

    let Headers = {
      headers: this.headers
    }
    let auth_code = this.authService.getUserDetail().auth_code;
    podcast.auth_code = auth_code;   
    return this.http.post(environment.base_url + 'admin/podcast/delete', podcast, Headers);

  }

  find_podcast_by_id( podcast:any ) : Observable<responsePodcast>  {

    let Headers = {
      headers: this.headers
    }
    let auth_code = this.authService.getUserDetail().auth_code;
    podcast.auth_code = auth_code;   
    return this.http.post<responsePodcast>(environment.base_url + 'admin/podcast/id', podcast, Headers);
    
  }

  get_podcast_listing(): Observable<any> {
     
    var body = {      
      "auth_code":	this.authService.getUserDetail().auth_code,
      "offset":	0,
      "length":	5000,
      "total_count":	1
      };

    return this.http.post<any>(environment.base_url + 'admin/podcasts', body)    
    

  }

  



} 
