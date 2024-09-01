import { Component } from '@angular/core';

import { MlbBestBetsComponent } from '../../best-bets/mlb/mlb-best-bets.component';


@Component({
  selector: 'app-if-mlb',
  templateUrl: '../../best-bets/mlb/mlb-best-bets.component.html',
  styleUrls: ['../../best-bets/mlb/mlb-best-bets.component.scss']
})
export class IfMlbComponent extends MlbBestBetsComponent {
  
  authorizeUser() {
    this.isAuthorized = true;
  }
}
