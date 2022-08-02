import { NgModule } from '@angular/core';
import {OwlModule} from 'ngx-owl-carousel';
import { ModalModule } from 'ngx-bootstrap/modal';

import { ToolsListRoutingModule } from './toolslist-routing.module';
import { ToolsListComponent } from './tools-list.component';
import { BettingComponent } from './betting/betting.component';
import { PicksComponent } from './picks/picks.component';
import { NflComponent } from './nfl/nfl.component';
import { NbaComponent } from './nba/nba.component';
import { UfcComponent } from './ufc/ufc.component';
import { MlbComponent } from './mlb/mlb.component';
import { SharedModule } from '../../shared/shared/shared.module';

// import { ToolsComponent } from '../tools/tools.component';
import { OptimizerComponent } from './optimizer/optimizer.component';

@NgModule({
  declarations: [
    ToolsListComponent,
    BettingComponent,
    NflComponent,
    NbaComponent,
    UfcComponent,
    MlbComponent,
    PicksComponent,
    OptimizerComponent
  ],
  imports: [
    ToolsListRoutingModule,
    OwlModule,
    ModalModule,
    SharedModule
  ]
})
export class ToolsListModule { }
