import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ToolsComponent } from './tools.component';
import { AllComponent } from './all/all.component';
import { ExcludedComponent } from './excluded/excluded.component';
import { LineupsComponent } from './lineups/lineups.component';
import { InjuryComponent } from './injury/injury.component';

const routes: Routes = [
  {
    path: '',
    component: ToolsComponent,
    children: [
      // { path:'', redirectTo: 'all', pathMatch:'prefix' },
      { path:'', component: AllComponent },
      { path:'excluded', component: ExcludedComponent },
      { path:'lineups', component: LineupsComponent },
      { path:'injury', component: InjuryComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ToolsRoutingModule { }
