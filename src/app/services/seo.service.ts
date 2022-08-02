import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class SeoService {

  constructor(private title: Title,private meta: Meta) { }

  updateTitle(title: string) {
    this.title.setTitle(title);
    this.meta.updateTag({property:'og:title', content: title});
  }

  updateOgUrl(url: string) {
    this.meta.updateTag({ property: 'og:url', content: url });
  }

  updateDescription(desc: string) {
    this.meta.updateTag({ name: 'description', content: desc });
    this.meta.updateTag({ property: 'og:description', content: desc });
    this.meta.updateTag({ property: 'twitter:description', content: desc });
  }

  updateKeywords(keywords: string) {
    this.meta.updateTag({ name: 'keywords', content: keywords});
  }

  updateImage(image_url: string) {
    this.meta.updateTag({property: 'og:image', content: image_url});
  }

  updateSeoTags(title: string, description: string, url: string, keywords: string) {
    this.updateTitle(title);
    this.updateDescription(description);
    this.updateOgUrl(url);
    this.updateKeywords(keywords);
  }

  updateAllTags({ type, title, description, url, image }: any) {

    this.meta.updateTag({ property: 'og:type', content: type})
    this.meta.updateTag({ property: 'og:title', content: title})
    this.meta.updateTag({ property: 'og:description', content: description})
    this.meta.updateTag({ property: 'url', content: url})
    this.meta.updateTag({ property: 'og:image', content: image})
    this.meta.updateTag({ property: 'og:image:secure_url', content: image})
    this.meta.updateTag({ name: 'twitter:description', content: description})
    this.meta.updateTag({ name: 'twitter:title', content: title})
    this.meta.updateTag({ name: 'twitter:image', content: image})
  }
}
