import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalModule } from 'ngx-bootstrap/modal';
import { HomeRoutingModule } from './home-routing.module';
import { AllComponent } from './all/all.component';
import { HomeComponent } from './home.component';

import { SharedModule }  from '../../shared/shared/shared.module';
import { OwlModule } from 'ngx-owl-carousel';
import { BettingComponent } from './betting/betting.component';
import { NflComponent } from './nfl/nfl.component';
import { NbaComponent } from './nba/nba.component';
import { CbbComponent } from './cbb/cbb.component';
import { UfcComponent } from './ufc/ufc.component';
import { MlbComponent } from './mlb/mlb.component';

@NgModule({
  declarations: [
    HomeComponent,
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
    HomeRoutingModule,
    SharedModule,
    ModalModule.forRoot()
  ]
})
export class HomeModule { }
