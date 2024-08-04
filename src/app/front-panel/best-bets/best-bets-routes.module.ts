import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BestBetsComponent } from './best-bets.component';
import { NflBestBetsComponent } from './nfl/nfl-best-bets.component';
import { NbaBestBetsComponent } from './nba/nba-best-bets.component';
import { MlbBestBetsComponent } from './mlb/mlb-best-bets.component';
import { SoccerBestBetsComponent } from './soccer/soccer-best-bets.component';
import { CfBestBetsComponent } from './cf/cf-best-bets.component';
import { CbBestBetsComponent } from './cb/cb-best-bets.component';
import { NhlBestBetsComponent } from './nhl/nhl-best-bets.component';
import { TodaysBestBetsComponent } from './todays/todays-best-bets.component';
import { CricketBestBetsComponent } from './cricket/cricket-best-bets.component';

const routes: Routes = [
  {
    path: '',
    component: BestBetsComponent,
    children: [
      { path: 'nfl', component: NflBestBetsComponent },
      { path: 'nba', component: NbaBestBetsComponent },
      { path: 'cricket', component: CricketBestBetsComponent },
      { path: 'mlb', component: MlbBestBetsComponent },
      { path: 'soccer', component: SoccerBestBetsComponent },
      { path: 'cf', component: CfBestBetsComponent },
      { path: 'cb', component: CbBestBetsComponent },
      { path: 'nhl', component: NhlBestBetsComponent },
      // Hide till future update
      //{ path: 'today', component: TodaysBestBetsComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BestBetsRoutesModule { }
