import { Component } from '@angular/core';

import { NflPlayerImpactComponent } from './nfl-player-impact.component';

@Component({
  selector: 'tqe-nfl-player-impact-export',
  templateUrl: './nfl-player-impact.component.html',
  styleUrls: ['./nfl-player-impact.component.scss']
})

export class NflPlayerExportImpactComponent extends NflPlayerImpactComponent {

  authorizeUser() {
    this.isAuthorized = true;
    this.auth_loading = false;
    this.getGameData();
  }
}