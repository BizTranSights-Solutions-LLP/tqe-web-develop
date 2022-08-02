import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PodcastsComponent } from './podcasts.component';

import { MondayMorningPivotComponent } from './monday-morning-pivot/monday-morning-pivot.component';
import { MoveTheLineComponent } from './move-the-line/move-the-line.component';
import { TqeMmaPodcastComponent } from './tqe-mma-podcast/tqe-mma-podcast.component';
import { DgCourtroomComponent } from './dg-courtroom/dg-courtroom.component';
import { NflBestBallPodcastComponent } from './nfl-best-ball-podcast/nfl-best-ball-podcast.component';
import { MlbDfsQuickHitsComponent } from './mlb-dfs-quick-hits/mlb-dfs-quick-hits.component';
import { DFSPowerHourComponent } from './dfs-powerhour/dfs-powerhour.component';
import { DraftStrategyComponent } from './draft-strategy/draft-strategy.component';
import { FanshareOwnershipPodcastComponent } from './fanshare-ownership-podcast/fanshare-ownership-podcast.component';
import { PrimeTimeProccessComponent } from './prime-time-proccess/prime-time-proccess.component';

const routes: Routes = [
  { 
    path: '', 
    component: PodcastsComponent,
    children: [
      
    ]
  },
  { path: 'monday-morning-pivot', component: MondayMorningPivotComponent },
  { path: 'move-the-line', component: MoveTheLineComponent },
  { path: 'tqe-mma-podcast', component: TqeMmaPodcastComponent },
  { path: 'dg-courtroom', component: DgCourtroomComponent },
  { path: 'nfl-best-ball', component: NflBestBallPodcastComponent },
  { path: 'mlb-dfs-quick-hits', component: MlbDfsQuickHitsComponent },
  { path: 'dfs-powerhour', component: DFSPowerHourComponent },
  { path: 'draft-strategy', component: DraftStrategyComponent },
  { path: 'fanshare-ownership', component: FanshareOwnershipPodcastComponent },
  { path: 'ptp', component: PrimeTimeProccessComponent }  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PodcastRoutingModule { }
