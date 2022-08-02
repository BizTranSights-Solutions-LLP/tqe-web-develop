import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home.component';
import { AllComponent } from './all/all.component';
import { BettingComponent } from './betting/betting.component';
import { NflComponent } from './nfl/nfl.component';
import { NbaComponent } from './nba/nba.component';
import { CbbComponent } from './cbb/cbb.component';
import { UfcComponent } from './ufc/ufc.component';
import { MlbComponent } from './mlb/mlb.component';

const routes: Routes = [
  { 
    path: '', 
    component: HomeComponent,
    children: [
      // { path: '', redirectTo: 'all', pathMatch: 'prefix' },
      { path: '', component: AllComponent },
      { path: 'betting', component: BettingComponent },
      { path: 'nfl', component: NflComponent },
      { path: 'nba', component: NbaComponent },
      { path: 'cbb', component: CbbComponent },
      { path: 'ufc', component: UfcComponent },
      { path: 'mlb', component: MlbComponent },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { } 
