import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  constructor(private http: HttpClient) { }

  get_meta_tags(page_url: string) {
    return this.http.post(environment.base_url + 'page/data', { page_url });
  }

  setup_fb_pixel(operation: string) {
    let pixel_script = `!function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', '322283231786473');`;
    pixel_script += operation;

    let node = (document.getElementById('fb-pixel-script'));
    // node.innerHTML = '';
    // node.innerHTML = pixel_script;
    // <script id="fb-pixel-script" type="text/javascript" async="true" charset="utf-8"></script>
    // (node).parentNode.removeChild(node);
    // let head = document.getElementsByTagName('head')[0];
    // let script = document.createElement('script');
    // script.id = 'fb-pixel-script';
    // script.type = 'text/javascrip';
    // script.async = true;
    // script.charset = 'utf-8';
    // script.innerHTML = pixel_script;

    // head.append(script);

  }
}
