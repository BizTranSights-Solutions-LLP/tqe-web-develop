import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ExpertsComponent } from './experts.component';
import { AllComponent } from './all/all.component';
import { NflComponent } from './nfl/nfl.component';
import { NbaComponent } from './nba/nba.component';
import { MlbComponent } from './mlb/mlb.component';
import { NcaabComponent } from './ncaab/ncaab.component';
import { NcaafComponent } from './ncaaf/ncaaf.component';
import { UfcComponent } from './ufc/ufc.component';

const routes: Routes = [
  { 
    path: '', 
    component: ExpertsComponent,
    children: [
      { path: '', redirectTo: 'all', pathMatch: 'prefix' },
      { path: 'all', component: AllComponent },
      { path: 'nfl', component: NflComponent },
      { path: 'nba', component: NbaComponent },
      { path: 'mlb', component: MlbComponent },
      { path: 'cbb', component: NcaabComponent },
      { path: 'caa', component: NcaafComponent },
      { path: 'ufc', component: UfcComponent },
    ] 
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExpertsRoutingModule { }
