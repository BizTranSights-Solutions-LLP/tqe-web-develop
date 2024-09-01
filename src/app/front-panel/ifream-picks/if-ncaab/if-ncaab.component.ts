import { Component } from '@angular/core';

import { CbBestBetsComponent } from '../../best-bets/cb/cb-best-bets.component';


@Component({
  selector: 'app-if-ncaab',
  templateUrl: '../../best-bets/cb/cb-best-bets.component.html',
  styleUrls: ['../../best-bets/cb/cb-best-bets.component.scss']
})
export class IfNcaabComponent extends CbBestBetsComponent {
  
  authorizeUser() {
    this.isAuthorized = true;
  }
}
