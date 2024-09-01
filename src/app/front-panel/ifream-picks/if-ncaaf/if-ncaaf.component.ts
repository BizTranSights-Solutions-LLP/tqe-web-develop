import { Component } from '@angular/core';

import { CfBestBetsComponent } from '../../best-bets/cf/cf-best-bets.component';


@Component({
  selector: 'app-if-ncaaf',
  templateUrl: '../../best-bets/cf/cf-best-bets.component.html',
  styleUrls: ['../../best-bets/cf/cf-best-bets.component.scss']
})
export class IfNcaafComponent extends CfBestBetsComponent {
  
  authorizeUser() {
    this.isAuthorized = true;
  }
}
