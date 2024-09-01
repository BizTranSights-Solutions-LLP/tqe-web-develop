import { Component } from '@angular/core';

import { NflBestBetsComponent } from '../../best-bets/nfl/nfl-best-bets.component';


@Component({
  selector: 'app-if-nfl',
  templateUrl: '../../best-bets/nfl/nfl-best-bets.component.html',
  styleUrls: ['../../best-bets/nfl/nfl-best-bets.component.scss']
})
export class IfNflComponent extends NflBestBetsComponent {
  
  authorizeUser() {
    this.isAuthorized = true;
  }
}
