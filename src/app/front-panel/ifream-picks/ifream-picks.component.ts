import { Component, HostListener, NgModule, OnInit } from '@angular/core';

@Component({
  selector: 'app-ifream-picks',
  templateUrl: './ifream-picks.component.html',
  styleUrls: ['./ifream-picks.component.scss']
})
export class IfreamPicksComponent implements OnInit {
  isAuthorized = false;
  sport = 'NBA';
  sports = ['NBA', 'NFL', 'MLB', 'SOCCER', 'NCAAB', 'NCAAF', 'NHL'];

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
