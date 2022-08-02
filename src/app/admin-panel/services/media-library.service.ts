import { Injectable, EventEmitter } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpRequest, HttpEvent, HttpEventType } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MediaLibraryService {

  openML = new EventEmitter();
  selectedMedia = new EventEmitter();
  imageForEditor = new EventEmitter();
  
  constructor(
    private authService: AuthService,
    private http: HttpClient
  ) { }

  get_media(offset = 0, fileType) {
    let { auth_code } = this.authService.getUserDetail();

    return this.http.post(environment.base_url + 'admin/'+ fileType + 's', { 
      auth_code,
      offset: offset, 
      length: 20
    });
  }

  upload_file(data, file, fileType) {

    const req = new HttpRequest('POST', environment.base_url + 'admin/'+fileType+'/save', data, { reportProgress: true });
    return this.http.request(req).pipe(
      map(event => this.getEventMessage(event, file)),
    );
  }

  update_file(data, fileType) {
    return this.http.post(environment.base_url + 'admin/'+fileType+'/save', data);
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
}
