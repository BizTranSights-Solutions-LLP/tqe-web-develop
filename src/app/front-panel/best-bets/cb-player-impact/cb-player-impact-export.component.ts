import { Component } from '@angular/core';

import { CbPlayerImpactComponent } from './cb-player-impact.component';

@Component({
  selector: 'tqe-cb-player-impact-export',
  templateUrl: './cb-player-impact.component.html',
  styleUrls: ['./cb-player-impact.component.scss']
})

export class CbPlayerExportImpactComponent extends CbPlayerImpactComponent {

  authorizeUser() {
    this.isAuthorized = true;
    this.auth_loading = false;
    this.viewAccessLevel = 'Professional';
    this.getGameData();
  }
}