import { Component, OnInit, HostListener } from '@angular/core';

@Component({
  selector: 'tqe-soccer-player-impact-export',
  templateUrl: './soccer-player-impact.component.html',
  styleUrls: ['./soccer-player-impact.component.scss']
})
export class SoccerPlayerExportImpactComponent implements OnInit {

  constructor() { }
  isAuthorized: boolean = false;

  ngOnInit() {
    this.isAuthorized = true;
  }
}
