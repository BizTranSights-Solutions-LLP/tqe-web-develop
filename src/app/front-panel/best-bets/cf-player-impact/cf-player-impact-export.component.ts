import { Component } from '@angular/core';

import { CfPlayerImpactComponent } from './cf-player-impact.component';

@Component({
  selector: 'tqe-cf-player-impact-export',
  templateUrl: './cf-player-impact.component.html',
  styleUrls: ['./cf-player-impact.component.scss']
})

export class CfPlayerExportImpactComponent extends CfPlayerImpactComponent {

  authorizeUser() {
    this.isAuthorized = true;
    this.auth_loading = false;
    this.getGameData();
  }
}