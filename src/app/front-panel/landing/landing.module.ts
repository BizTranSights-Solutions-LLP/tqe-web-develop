import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LandingRoutingModule } from './landing-routing.module';
import { AllComponent } from './all/all.component';
import { LandingComponent } from './landing.component';

import { SharedModule }  from '../../shared/shared/shared.module';
import { OwlModule } from 'ngx-owl-carousel';
import { BettingComponent } from './betting/betting.component';
import { NflComponent } from './nfl/nfl.component';
import { NbaComponent } from './nba/nba.component';
import { CbbComponent } from './cbb/cbb.component';
import { UfcComponent } from './ufc/ufc.component';
import { MlbComponent } from './mlb/mlb.component';
import { ModalModule } from 'ngx-bootstrap/modal';

@NgModule({
  declarations: [
    LandingComponent,
    AllComponent,
    BettingComponent,
    NflComponent,
    NbaComponent,
    CbbComponent,
    UfcComponent,
    MlbComponent
  ],
  imports: [
    CommonModule,
    OwlModule,
    LandingRoutingModule,
    SharedModule,
    ModalModule.forRoot()
  ]
})
export class LandingModule { }
