import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'site-sidebar',
  templateUrl: './site-sidebar.component.html',
  styleUrls: ['./site-sidebar.component.css']
})
export class SiteSidebarComponent {

  @Input() items: any[];

  constructor(
    private router: Router
  ) { }

  isActive(currentNavUrl: any): boolean {
    return currentNavUrl === this.router.url;
  }
}
