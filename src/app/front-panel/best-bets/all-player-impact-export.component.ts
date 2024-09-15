import { Component, HostListener, NgModule, OnInit } from '@angular/core';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'tqe-all-player-impact',
  templateUrl: './all-player-impact-export.component.html',
  styleUrls: ['./all-player-impact.component.scss']
})
export class AllPlayerExportImpactComponent implements OnInit {


  isAuthorized = false;
  sport = 'NFL';
  sports = ['NFL', 'NBA', 'NCAAF', 'MLB', 'SOCCER'];

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
      'http://localhost:5501',
      'https://js.stripe.com',
    ];
    // this.isAuthorized = whitelist.includes(e.origin) && e.data.key == 'eyJtZXNzYWdlIjoiSldUIFJ1b';
    // There's some issue with iframe origin checking. Disabling key matching temporarily
    this.isAuthorized = whitelist.includes(e.origin);
    console.log(this.isAuthorized ? 'access granted for ' + e.origin : e.origin + 'not in whitelist');
  }

  setSport(sport: string) {
    this.sport = sport;
  }
}
