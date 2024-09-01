import { Component } from '@angular/core';

import { NhlBestBetsComponent } from '../../best-bets/nhl/nhl-best-bets.component';


@Component({
  selector: 'app-if-nhl',
  templateUrl: '../../best-bets/nhl/nhl-best-bets.component.html',
  styleUrls: ['../../best-bets/nhl/nhl-best-bets.component.scss']
})
export class IfNhlComponent extends NhlBestBetsComponent {
  
  authorizeUser() {
    this.isAuthorized = true;
  }
}
