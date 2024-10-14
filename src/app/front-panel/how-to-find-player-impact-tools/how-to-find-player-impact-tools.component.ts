import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';


@Component({
  selector: 'app-how-to-find-player-impact-tools',
  templateUrl: './how-to-find-player-impact-tools.component.html',
  styleUrls: ['./how-to-find-player-impact-tools.component.scss']
})
export class HowToFindPlayerImpactToolsComponent implements OnInit {

  pdf: SafeResourceUrl;
  isMobile: boolean = false;

  constructor(private sanitizer: DomSanitizer, protected breakpointObserver: BreakpointObserver,) { }

  ngOnInit() {
    this.pdf = this.sanitizeUrl('../../assets/images/how-tqe-works/how-to-find-player-impact-tool.pdf');
    this.breakpointObserver.observe([Breakpoints.Handset]).subscribe(result => {
      this.isMobile = result.matches;
    });
  }

  sanitizeUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

}
