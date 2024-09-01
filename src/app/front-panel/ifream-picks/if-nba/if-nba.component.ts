import { Component } from '@angular/core';

import { NbaBestBetsComponent } from '../../best-bets/nba/nba-best-bets.component';


@Component({
  selector: 'app-if-nba',
  templateUrl: '../../best-bets/nba/nba-best-bets.component.html',
  styleUrls: ['../../best-bets/nba/nba-best-bets.component.scss']
})
export class IfNbaComponent extends NbaBestBetsComponent {
  
  authorizeUser() {
    this.isAuthorized = true;
  }
}
