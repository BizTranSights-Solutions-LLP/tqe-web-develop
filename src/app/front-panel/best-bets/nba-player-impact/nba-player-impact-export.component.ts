import { Component } from '@angular/core';

import { NbaPlayerImpactComponent } from './nba-player-impact.component';

@Component({
  selector: 'tqe-nba-player-impact-export',
  templateUrl: './nba-player-impact.component.html',
  styleUrls: ['./nba-player-impact.component.scss']
})

export class NbaPlayerExportImpactComponent extends NbaPlayerImpactComponent {

  authorizeUser() {
    this.isAuthorized = true;
    this.auth_loading = false;
    this.getGameData();
  }
}