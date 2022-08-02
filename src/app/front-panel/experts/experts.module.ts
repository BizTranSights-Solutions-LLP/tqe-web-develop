import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {OwlModule} from 'ngx-owl-carousel';

import { ExpertsRoutingModule } from './experts-routing.module';
import { ExpertsComponent } from './experts.component';
import { NflComponent } from './nfl/nfl.component';
import { NbaComponent } from './nba/nba.component';
import { MlbComponent } from './mlb/mlb.component';
import { AllComponent } from './all/all.component';
import { NcaabComponent } from './ncaab/ncaab.component';
import { NcaafComponent } from './ncaaf/ncaaf.component';
import { UfcComponent } from './ufc/ufc.component';


@NgModule({
  declarations: [
    ExpertsComponent,
    NflComponent,
    NbaComponent,
    MlbComponent,
    AllComponent,
    NcaabComponent,
    NcaafComponent,
    UfcComponent
  ],
  imports: [
    CommonModule,
    ExpertsRoutingModule,
    OwlModule
  ]
})
export class ExpertsModule { }
