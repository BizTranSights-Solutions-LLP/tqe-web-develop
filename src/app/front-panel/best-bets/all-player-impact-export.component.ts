import {Component, OnInit, HostListener} from '@angular/core';
import {NflPlayerExportImpactComponent} from './nfl-player-impact/nfl-player-impact-export.component';
import {NbaPlayerExportImpactComponent} from './nba-player-impact/nba-player-impact-export.component';
import {MlbPlayerExportImpactComponent} from './mlb-player-impact/mlb-player-impact-export.component';
import {SoccerPlayerExportImpactComponent} from './soccer-player-impact/soccer-player-impact-export.component';
import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {MatSelectModule, MatSliderModule} from '@angular/material';

@NgModule({
  declarations: [
    NflPlayerExportImpactComponent,
    NbaPlayerExportImpactComponent,
    MlbPlayerExportImpactComponent,
    SoccerPlayerExportImpactComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    MatSelectModule,
    MatSliderModule
  ]
})
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'tqe-all-player-impact',
  templateUrl: './all-player-impact-export.component.html',
  styleUrls: ['./all-player-impact.component.scss']
})
export class AllPlayerExportImpactComponent implements OnInit {

  constructor() {
  }

  isAuthorized = false;

  sport: string;
  nba: any;
  nfl: any;
  mlb: any;
  soccer: any;


  ngOnInit() {
    this.sport = 'NBA';
    this.nba = true;
    this.nfl = false;
    this.mlb = false;
    this.soccer = false;
  }

  //   Authorize partner
  // e.g.  window.parent.window.postMessage({"key":"eyJtZXNzYWdlIjoiSldUIFJ1b", "data":"anything"}, 'https://staging.thequantumedge.com')
  @HostListener('window:message', ['$event'])
  onMessage(e) {
    let whitelist =                                       // set allowed origins e.g. https://www.rotoballer.com
      [
        'https://dev.rotoballer.com',
        'https://www.rotoballer.com',
        'https://staging.thequantumedge.com',
        'https://www.thequantedge.com/'
      ];
    console.log('msg is:', e.origin);
    if (whitelist.indexOf(e.origin) === -1) {
      return false;
    }
    if (e.data.key == 'eyJtZXNzYWdlIjoiSldUIFJ1b') {
    //if (e.data.key != 'eyJtZXNzYWdlIjoiSldUIFJ1b') {
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
  }

  onClickNFL() {
    this.sport = 'NFL';
    this.nba = false;
    this.nfl = true;
    this.mlb = false;
    this.soccer = false;
  }

  onClickMLB() {
    this.sport = 'MLB';
    this.nba = false;
    this.nfl = false;
    this.mlb = true;
    this.soccer = false;
  }

  onClickSOCCER() {
    this.sport = 'SOCCER';
    this.nba = false;
    this.nfl = false;
    this.mlb = false;
    this.soccer = true;
  }
}
