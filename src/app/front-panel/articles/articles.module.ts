import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {OwlModule} from 'ngx-owl-carousel';
import { SharedModule }  from '../../shared/shared/shared.module';
import { ArticlesRoutingModule } from './articles-routing.module';
import { AllComponent } from './all/all.component';
import { ArticlesComponent } from './articles.component';
import { BettingComponent } from './betting/betting.component';
import { NflComponent } from './nfl/nfl.component';
import { NbaComponent } from './nba/nba.component';
import { CbbComponent } from './cbb/cbb.component';
import { MlbComponent } from './mlb/mlb.component';
import { UfcComponent } from './ufc/ufc.component';
// import { ArticleDetailComponent } from './article-detail/article-detail.component';


@NgModule({
  declarations: [
    AllComponent,
    ArticlesComponent,
    BettingComponent,
    NflComponent,
    NbaComponent,
    CbbComponent,
    MlbComponent,
    UfcComponent,
    // ArticleDetailComponent
  ],
  imports: [
    CommonModule,
    ArticlesRoutingModule,
    OwlModule,
    SharedModule
  ]
})
export class ArticlesModule { }
