import {Component, HostListener, NgModule, OnInit} from '@angular/core';
import {NbaPlayerExportImpactComponent} from '../best-bets/nba-player-impact/nba-player-impact-export.component';
import {MlbPlayerExportImpactComponent} from '../best-bets/mlb-player-impact/mlb-player-impact-export.component';
import {SoccerPlayerExportImpactComponent} from '../best-bets/soccer-player-impact/soccer-player-impact-export.component';
import {IfNflComponent} from './if-nfl/if-nfl.component';

@NgModule({
  declarations: [
    IfNflComponent,

    NbaPlayerExportImpactComponent,
    MlbPlayerExportImpactComponent,
    SoccerPlayerExportImpactComponent,
  ],
})

@Component({
  selector: 'app-ifream-picks',
  templateUrl: './ifream-picks.component.html',
  styleUrls: ['./ifream-picks.component.scss']
})
export class IfreamPicksComponent implements OnInit {

  constructor() {
  }

  isAuthorized = false;

  sport: string;
  nba: any;
  nfl: any;
  mlb: any;
  soccer: any;
  ncaab: any;
  ncaaf: any;
  nhl: any;


  ngOnInit() {
    this.sport = 'NBA';
    this.nba = true;
    this.nfl = false;
    this.mlb = false;
    this.soccer = false;
    this.ncaab = false;
    this.ncaaf = false;
    this.nhl = false;
  }

  //   Authorize partner
  // e.g.  window.parent.window.postMessage({"key":"eyJtZXNzYWdlIjoiSldUIFJ1b", "data":"anything"}, 'https://staging.thequantumedge.com')
  @HostListener('window:message', ['$event'])
  onMessage(e) {
    const whitelist =                                       // set allowed origins e.g. https://www.rotoballer.com
      [
        'https://dev.rotoballer.com',
        'https://www.rotoballer.com',
        'https://staging.thequantumedge.com',
        'http://localhost:4200',
        // 'https://www.thequantedge.com'
      ];
    console.log('msg is:', e.origin);
    if (whitelist.indexOf(e.origin) === -1) {
      console.log('not in whitelist');
      // BP Temp set the return false statement below to allow iframe access to any origin
      return false;
    }
    // BP Temp replace e.data.key === 'eyJtZXNzYWdlIjoiSldUIFJ1b' with if (e.data.key != 'xxxx') to allow for any key 
    if (e.data.key === 'eyJtZXNzYWdlIjoiSldUIFJ1b') {
    // if (e.data.key != 'xxxx') {
      this.isAuthorized = true;
      console.log('access granted');
    }
  }

  onClickNBA() {
    this.sport = 'NBA';
    this.nba = true;
    this.nfl = false;
    this.mlb = false;
    this.soccer = false;
    this.ncaab = false;
    this.ncaaf = false;
    this.nhl = false;
  }

  onClickNFL() {
    this.sport = 'NFL';
    this.nba = false;
    this.nfl = true;
    this.mlb = false;
    this.soccer = false;
    this.ncaab = false;
    this.ncaaf = false;
    this.nhl = false;
  }

  onClickMLB() {
    this.sport = 'MLB';
    this.nba = false;
    this.nfl = false;
    this.mlb = true;
    this.soccer = false;
    this.ncaab = false;
    this.ncaaf = false;
    this.nhl = false;
  }

  onClickSOCCER() {
    this.sport = 'SOCCER';
    this.nba = false;
    this.nfl = false;
    this.mlb = false;
    this.soccer = true;
    this.ncaab = false;
    this.ncaaf = false;
    this.nhl = false;
  }

  onClickNCAAB() {
    this.sport = 'NCAAB';
    this.nba = false;
    this.nfl = false;
    this.mlb = false;
    this.soccer = false;
    this.ncaab = true;
    this.ncaaf = false;
    this.nhl = false;
  }

  onClickNCAAF() {
    this.sport = 'NCAAF';
    this.nba = false;
    this.nfl = false;
    this.mlb = false;
    this.soccer = false;
    this.ncaab = false;
    this.ncaaf = true;
    this.nhl = false;
  }

  onClickNHL() {
    this.sport = 'NHL';
    this.nba = false;
    this.nfl = false;
    this.mlb = false;
    this.soccer = false;
    this.ncaab = false;
    this.ncaaf = false;
    this.nhl = true;
  }
}
