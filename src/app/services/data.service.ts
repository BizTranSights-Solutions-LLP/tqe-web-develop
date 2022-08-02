import {Injectable, EventEmitter} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AuthService} from './auth.service';
import {BehaviorSubject, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class DataService {

  private BASE_URL: string = environment.base_url;
  updateToolTitle = new EventEmitter();
  popupToolVideo = new EventEmitter();
  editOnDashboard = new EventEmitter();
  getSearchValue = new Subject();

  preservedAllArticles = [];
  preservedBettingArticles = [];
  preservedNFLArticles = [];
  preservedNBAArticles = [];
  preservedCBBArticles = [];
  preservedUFCArticles = [];
  preservedMLBArticles = [];

  preAllArticles = {
    betting: {
      latest: [],
      old: [],
      offset: 0
    },
    nfl: {
      latest: [],
      old: [],
      offset: 0
    },
    nba: {
      latest: [],
      old: [],
      offset: 0
    },
    ufc: {
      latest: [],
      old: [],
      offset: 0
    },
    cbb: {
      latest: [],
      old: [],
      offset: 0
    },
    mlb: {
      latest: [],
      old: [],
      offset: 0
    },
  };


  bettingOffset = 0;

  constructor(private http: HttpClient, private authService: AuthService) {
  }

  get_articles(sports_id: number = 0) {
    let {auth_code} = this.authService.getUserDetail();

    let body = {
      //auth_code: auth_code,
      length: 5
    };

    if (sports_id !== 0) {
      body['sports_id'] = sports_id;
    }

    let headers = {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    };
    return this.http.post(this.BASE_URL + 'articles', body, headers);
  }

  get_all_articles(sports_id: number, length: number, offset: number, url: string = '') {
    let {auth_code} = this.authService.getUserDetail();

    let body = {
      //auth_code: auth_code,
      offset: offset,
      length: length,
      sports_id: sports_id
    };

    if (url !== '') {
      body['page_url'] = url.substring(1, url.length);
    }

    let headers = {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    };
    return this.http.post(this.BASE_URL + 'articles', body, headers);
  }

  trending_articles(length: number) {
    let {auth_code} = this.authService.getUserDetail();

    let body = {
      //auth_code: auth_code,
      length: length
    };

    let headers = {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    };
    return this.http.post(this.BASE_URL + 'articles', body, headers);
  }

  get_tools(sports_id: number, url: string = '') {
    let {auth_code} = this.authService.getUserDetail();
    console.log('in auth, auth_code is,', auth_code);

    let body = {
      //auth_code: auth_code,
      sports_id: sports_id
    };

    if (url !== '') {
      body['page_url'] = url.substring(1, url.length);
    }

    let headers = {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    };
    return this.http.post(this.BASE_URL + 'tools', body, headers);
  }

  get_all_tools(length: number) {
    let {auth_code} = this.authService.getUserDetail();

    let body = {
      //auth_code: auth_code,
      length: length,
    };

    let headers = {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    };
    return this.http.post(this.BASE_URL + 'tools', body, headers);
  }

  get_article(url: string) {
    let {auth_code} = this.authService.getUserDetail();

    let body = {
      auth_code: auth_code,
      article_id: url
    };

    let headers = {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    };

    return this.http.post(this.BASE_URL + 'article/id', body, headers);
  }

  get_tool(url: string) {
    let {auth_code} = this.authService.getUserDetail();

    let body = {
      auth_code: auth_code,
      tool_id: url
    };

    let headers = {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    };

    return this.http.post(this.BASE_URL + 'tool/id', body, headers);
  }

  get_free_article(id: number) {
    let {auth_code} = this.authService.getUserDetail();

    let body = {
      auth_code: auth_code,
      article_id: id
    };
    let headers = {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    };
    return this.http.post(this.BASE_URL + 'article/free_article', body, headers);
  }

  get_related_tools(id: number) {

    let body = {
      article_id: id
    };
    let headers = {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    };
    return this.http.post(this.BASE_URL + 'article/associated_tools', body, headers);
  }

  get_podcast(podcast_url: string) {
    let {auth_code} = this.authService.getUserDetail();

    let body = {
      auth_code: auth_code,
      podcast_id: podcast_url
    };

    let headers = {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    };

    return this.http.post(this.BASE_URL + 'podcast/id', body, headers);
  }

  get_tqe_video(url: string) {
    let {auth_code} = this.authService.getUserDetail();

    let body = {
      auth_code: auth_code,
      tqe_video_id: url
    };

    let headers = {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    };

    return this.http.post(this.BASE_URL + 'tqe_video/id', body, headers);
  }

  get_all_videos(length: number, offset: number, url: string = '') {
    let {auth_code} = this.authService.getUserDetail();

    let body = {
      auth_code: auth_code,
      length: length,
      offset: offset
    };

    if (url !== '') {
      body['page_url'] = url.substring(1, url.length);
    }

    let headers = {
      headers: new HttpHeaders().set('Content-Type', 'applicaiton/json')
    };
    return this.http.post(this.BASE_URL + 'tqe_videos', body, headers);
  }

  get_all_podcasts(sports_tag_id: number, length: number, offset: number, url: string = '') {

    let {auth_code} = this.authService.getUserDetail();

    let body = {
      auth_code: auth_code,
      sports_tag_id: sports_tag_id,
      length: length,
      offset: offset
    };

    if (url !== '') {
      body['page_url'] = url.substring(1, url.length);
    }

    let headers = {
      headers: new HttpHeaders().set('Content-Type', 'applicaiton/json')
    };
    return this.http.post(this.BASE_URL + 'podcasts', body, headers);

  }

  get_all_podcast_tags() {
    let body = {};
    let headers = {
      headers: new HttpHeaders().set('Content-Type', 'applicaiton/json')
    };
    return this.http.post(this.BASE_URL + 'podcast/tags', body, headers);

  }

  get_user_information() {
    let {auth_code} = this.authService.getUserDetail();

    let body = {
      auth_code: auth_code
    };
    let headers = {
      headers: new HttpHeaders().set('Content-Type', 'applicaiton/json')
    };
    return this.http.post(this.BASE_URL + 'user/profile', body, headers);
  }

  searchMain(data) {
    let body = {
      ...data
    };
    return this.http.post(this.BASE_URL + 'search', body);
  }

  get_discord_chat() {

    let {auth_code} = this.authService.getUserDetail();

    let body = {
      auth_code: auth_code
    };
    let headers = {
      headers: new HttpHeaders().set('Content-Type', 'applicaiton/json')
    };
    return this.http.post(this.BASE_URL + 'discord_chat', body, headers);
  }

  get_user_role() {
    let {auth_code} = this.authService.getUserDetail();

    let body = {
      auth_code: auth_code
    };
    let headers = {
      headers: new HttpHeaders().set('Content-Type', 'applicaiton/json')
    };
    return this.http.post(this.BASE_URL + 'user/roles_status', body, headers);
  }

  // Perserve Home All Articles
  preserve_all_articles(articles) {
    this.preservedAllArticles = articles;
  }

  preserve_betting_articles(articles) {
    this.preservedBettingArticles = articles;
  }

  preserve_nfl_articles(articles) {
    this.preservedNFLArticles = articles;
  }

  preserve_nba_articles(articles) {
    this.preservedNBAArticles = articles;
  }

  preserve_ufc_articles(articles) {
    this.preservedUFCArticles = articles;
  }

  preserve_cbb_articles(articles) {
    this.preservedCBBArticles = articles;
  }

  preserve_mlb_articles(articles) {
    this.preservedMLBArticles = articles;
  }

  pre_all_articles(article_key, latest_old_key, data, offset) {
    this.preAllArticles[article_key][latest_old_key] = data;
    this.preAllArticles[article_key]['offset'] = offset;
  }

}
