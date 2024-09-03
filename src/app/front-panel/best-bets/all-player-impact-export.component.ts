import { Component, HostListener, NgModule, OnInit } from '@angular/core';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'tqe-all-player-impact',
  templateUrl: './all-player-impact-export.component.html',
  styleUrls: ['./all-player-impact.component.scss']
})
export class AllPlayerExportImpactComponent implements OnInit {


  isAuthorized = false;
  sport = 'NBA';
  sports = ['NBA', 'NFL', 'NCAAF', 'MLB', 'SOCCER'];

  ngOnInit() {
    this.setSport(this.sport);
  }

  @HostListener('window:message', ['$event'])
  onMessage(e: MessageEvent) {
    const whitelist = [
      'https://dev.rotoballer.com',
      'https://www.rotoballer.com',
      'https://staging.thequantumedge.com',
      'http://localhost:4200',
    ];
    this.isAuthorized = whitelist.includes(e.origin) && e.data.key === 'eyJtZXNzYWdlIjoiSldUIFJ1b';
    console.log(this.isAuthorized ? 'access granted' : 'not in whitelist');
  }

  setSport(sport: string) {
    this.sport = sport;
  }
}
