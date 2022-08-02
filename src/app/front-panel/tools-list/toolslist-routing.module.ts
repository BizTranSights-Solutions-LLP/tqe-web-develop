import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BettingComponent } from './betting/betting.component';
import { PicksComponent } from './picks/picks.component';
import { NflComponent } from './nfl/nfl.component';
import { NbaComponent } from './nba/nba.component';
import { UfcComponent } from './ufc/ufc.component';
import { MlbComponent } from './mlb/mlb.component';
import { ToolsListComponent } from './tools-list.component';

const routes: Routes = [
  { 
    path: '', 
    component: ToolsListComponent,
    children: [
      { path: '', redirectTo: 'picks', pathMatch: 'prefix' },
      { path: 'picks', component: PicksComponent },
      { path: 'betting', component: BettingComponent },
      { path: 'nfl', component: NflComponent },
      { path: 'nba', component: NbaComponent },
      { path: 'ufc', component: UfcComponent },
      { path: 'mlb', component: MlbComponent },
    ] 
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ToolsListRoutingModule { }
