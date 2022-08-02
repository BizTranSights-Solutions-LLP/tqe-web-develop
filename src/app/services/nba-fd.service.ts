import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NbaFdService {
  private BASE_URL = environment.tool_api_base_url;

  constructor(private http: HttpClient) {}

  getLineupWithOptions(options) {
    let url = this.BASE_URL + "NBA_FD_plumber2";
    return this.http.post(url, options);
  }

  getOptimalLineup(options) {
    let url = this.BASE_URL + "NBA_FD_plumber";
    return this.http.post(url,options);
  }

  getMainTable(slate) {
    let url = this.BASE_URL + "NBA_FD_main_table";
    if (slate) {
      url += "?slate=" + slate;
    } else {
      url += "?slate=Main Slate";
    }
    return this.http.get(encodeURI(url));
  }

  getSlates() {
    let url = this.BASE_URL + "NBA_FD_slates";
    return this.http.get(url);
  }
}