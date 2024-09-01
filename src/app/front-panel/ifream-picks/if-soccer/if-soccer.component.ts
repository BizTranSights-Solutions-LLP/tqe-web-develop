import { Component } from '@angular/core';

import { SoccerBestBetsComponent } from '../../best-bets/soccer/soccer-best-bets.component';


@Component({
  selector: 'app-if-soccer',
  templateUrl: '../../best-bets/soccer/soccer-best-bets.component.html',
  styleUrls: ['../../best-bets/soccer/soccer-best-bets.component.scss']
})
export class IfSoccerComponent extends SoccerBestBetsComponent {
  
  authorizeUser() {
    this.isAuthorized = true;
  }
}
