import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders, HttpEvent, HttpEventType, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { sportsTags } from '../models/sports-tags-model';
import { responseArticle } from '../models/article-ById-model';
import { AuthService } from '../../services/auth.service';

import { map,tap,catchError,last } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})


export class ArticleService {
  
  headers: HttpHeaders;
  imageLibrary: any = [];  
  
  constructor(private http: HttpClient, private authService: AuthService) {
    this.headers = new HttpHeaders().set('Content-Type','application/json')
  }


  save_article( article:any ): Observable<any>  {
      
    var formData = new FormData();
    let update_or_save = article.article_id ? 'update' : 'save';

    delete article['file_path'];
    delete article['image'];

    for ( var key in article ) {

      if(key !== 'article_meta_tag' && key!== 'article_sports_tag' && key !== 'article_tool_association') {
        if (key === "article_image" ) 
        {
          article[key] ? formData.append(key, article[key]): '';
          
        }
        else 
        {
          formData.append(key, article[key]);
        }
      }
      else{
        formData.append(key, JSON.stringify(article[key]));
      }    
        
    }
  
    formData.append('auth_code', this.authService.getUserDetail().auth_code);
      

     return this.http.post(environment.base_url + 'admin/article/'+update_or_save, formData);
    
  }

  get_images(offset = 0) {
    let { auth_code } = this.authService.getUserDetail();

    return this.http.post(environment.base_url + 'admin/images', { 
      auth_code,
      offset: offset, 
      length: 20
    });
  }

  upload_file(data, file) {

    const req = new HttpRequest('POST', environment.base_url + 'admin/image/save', data, { reportProgress: true });
    return this.http.request(req).pipe(
      map(event => this.getEventMessage(event, file)),
      // tap(message => this.showProgress(message)),
      // last(), // return last (completed) message to caller
      // catchError(this.handleError(file))
    );
  }

  private showProgress(message) {
    console.log(message);
  }
  private handleError(file) : any{
    console.log('Error======',file)
    // return {error: file}
  }
  private getEventMessage(event: HttpEvent<any>, file: File) {
    switch (event.type) {
      case HttpEventType.Sent:
        return `Uploading file "${file.name}" of size ${file.size}.`;
  
      case HttpEventType.UploadProgress:
        // Compute and show the % done:
        const percentDone = Math.round(100 * event.loaded / event.total);
        return { status: 'progress', message: percentDone };
  
      case HttpEventType.Response:
        return {status: 'done', message: event.body};
  
      default:
        return `File "${file.name}" surprising upload event: ${event.type}.`;
    }
  }

  get_sports_tags(tag_type: string): Observable<sportsTags> {

    let Headers = {
      headers: this.headers
    }
    let auth_code = this.authService.getUserDetail().auth_code;   
    return this.http.post<sportsTags>(environment.base_url + 'sports_tags', { auth_code, tag_type }, Headers);
  }

  delete_article( article:any ) : Observable<any>  {

    let Headers = {
      headers: this.headers
    }
    let auth_code = this.authService.getUserDetail().auth_code;
    article.auth_code = auth_code;   
    return this.http.post(environment.base_url + 'admin/article/delete', article, Headers);

  }

  find_article_by_id( article:any ) : Observable<responseArticle>  {

    let Headers = {
      headers: this.headers
    }
    let auth_code = this.authService.getUserDetail().auth_code;
    article.auth_code = auth_code;   

    return this.http.post<responseArticle>(environment.base_url + 'admin/article/id', article, Headers);
    
    
  }

  get_article_listing(): Observable<any> {
     
    var body = {      
      "auth_code":	this.authService.getUserDetail().auth_code,
      "offset":	0,
      "length":	5000,
      "total_count":	1
      };

    return this.http.post<any>(environment.base_url + 'admin/articles', body);    
    

  }




} 
