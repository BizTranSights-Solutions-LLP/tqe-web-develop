import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';


@Component({
  selector: 'app-how-to-use-picks-tools',
  templateUrl: './how-to-use-picks-tools.component.html',
  styleUrls: ['./how-to-use-picks-tools.component.scss']
})
export class HowToUsePicksToolsComponent implements OnInit {

  pdf: SafeResourceUrl;
  isMobile: boolean = false;


  constructor(private sanitizer: DomSanitizer, protected breakpointObserver: BreakpointObserver,) { }

  ngOnInit() {
    this.pdf = this.sanitizeUrl('../../assets/images/how-tqe-works/how-to-change-player-performance-in-player-impact-tool.pdf');
    this.breakpointObserver.observe([Breakpoints.Handset, Breakpoints.Tablet]).subscribe(result => {
      this.isMobile = result.matches;
    });
  }

  sanitizeUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

}
