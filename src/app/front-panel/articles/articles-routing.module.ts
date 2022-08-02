import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AllComponent } from './all/all.component';
import { BettingComponent } from './betting/betting.component';
import { NflComponent } from './nfl/nfl.component';
import { NbaComponent } from './nba/nba.component';
import { CbbComponent } from './cbb/cbb.component';
import { UfcComponent } from './ufc/ufc.component';
import { MlbComponent } from './mlb/mlb.component';
import { ArticlesComponent } from './articles.component';
// import { ArticleDetailComponent } from './article-detail/article-detail.component';

const routes: Routes = [
  { 
    path: '', 
    component: ArticlesComponent,
    children: [
      { path: '', redirectTo: 'all', pathMatch: 'prefix' },
      { path: 'all', component: AllComponent },
      { path: 'betting', component: BettingComponent },
      { path: 'nfl', component: NflComponent },
      { path: 'nba', component: NbaComponent },
      { path: 'cbb', component: CbbComponent },
      { path: 'ufc', component: UfcComponent },
      { path: 'mlb', component: MlbComponent },
    ] 
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ArticlesRoutingModule { }
