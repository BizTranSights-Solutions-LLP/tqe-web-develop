import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BestBetsRoutesModule } from './best-bets-routes.module';
import { ModalModule } from 'ngx-bootstrap/modal';

import { BestBetsComponent } from './best-bets.component';
import { NflBestBetsComponent } from './nfl/nfl-best-bets.component';
import { NbaBestBetsComponent } from './nba/nba-best-bets.component';
import { MlbBestBetsComponent } from './mlb/mlb-best-bets.component';
import { SoccerBestBetsComponent } from './soccer/soccer-best-bets.component';
import { CfBestBetsComponent } from './cf/cf-best-bets.component';
import { CbBestBetsComponent } from './cb/cb-best-bets.component';
import { NhlBestBetsComponent } from './nhl/nhl-best-bets.component';
import { TodaysBestBetsComponent } from './todays/todays-best-bets.component';

@NgModule({
  declarations: [
    NflBestBetsComponent,
    NbaBestBetsComponent,
    MlbBestBetsComponent,
    SoccerBestBetsComponent,
    CfBestBetsComponent,
    CbBestBetsComponent,
    BestBetsComponent,
    NhlBestBetsComponent,
    TodaysBestBetsComponent,
  ],
  imports: [
    CommonModule,
    BestBetsRoutesModule,
    ModalModule.forRoot()
  ]
})
export class BestBetsModule { }
