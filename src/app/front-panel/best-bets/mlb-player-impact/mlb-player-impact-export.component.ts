import { Component, OnInit, HostListener } from '@angular/core';

@Component({
  selector: 'tqe-mlb-player-impact-export',
  templateUrl: './mlb-player-impact.component.html',
  styleUrls: ['./mlb-player-impact.component.scss']
})
export class MlbPlayerExportImpactComponent implements OnInit {

  constructor() { }
  isAuthorized: boolean = false;

  ngOnInit() {
    this.isAuthorized = true;
  }

}