import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-how-to-understand-player-impact-tool-layout',
  templateUrl: './how-to-understand-player-impact-tool-layout.component.html',
  styleUrls: ['./how-to-understand-player-impact-tool-layout.component.scss']
})
export class HowToUnderstandPlayerImpactToolLayoutComponent implements OnInit {

  pdf: SafeResourceUrl;
  isMobile: boolean = false;

  constructor(private sanitizer: DomSanitizer, protected breakpointObserver: BreakpointObserver,) { }

  ngOnInit() {
    this.pdf = this.sanitizeUrl('../../assets/images/how-tqe-works/how-to-understand-player-impact-tool-layout.pdf');
    this.breakpointObserver.observe([Breakpoints.Handset]).subscribe(result => {
      this.isMobile = result.matches;
    });
  }

  sanitizeUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

}
