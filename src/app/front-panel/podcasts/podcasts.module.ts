import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {OwlModule} from 'ngx-owl-carousel';

import { PodcastRoutingModule } from './podcasts-routing.module';
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


@NgModule({
  declarations: [
    PodcastsComponent,
    MondayMorningPivotComponent,
    MoveTheLineComponent,
    TqeMmaPodcastComponent,
    DgCourtroomComponent,
    NflBestBallPodcastComponent,
    MlbDfsQuickHitsComponent,
    DFSPowerHourComponent,
    DraftStrategyComponent,
    FanshareOwnershipPodcastComponent,
    PrimeTimeProccessComponent
  ],
  imports: [
    CommonModule,
    PodcastRoutingModule,
    OwlModule
  ]
})
export class PodcastsModule { }
