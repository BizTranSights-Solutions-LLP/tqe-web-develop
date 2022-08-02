// import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
//
// @Component({
//   selector: 'tqe-team-filter',
//   templateUrl: './team-filter.component.html',
//   styleUrls: ['./team-filter.component.scss']
// })
// export class TeamFilterComponent implements OnChanges {
//   @Input() slate: any;
//   constructor() { }
//
//   ngOnChanges(changes: SimpleChanges): void { }
//
//   public excludeTeam(team) {
//     for (var i = 0; i < this.slate.teamDict[team].players.length; i++) {
//       let player = this.slate.teamDict[team].players[i];
//       this.slate.exclude(player.id);
//     }
//   }
//   public includeTeam(team) {
//     for (var i = 0; i < this.slate.teamDict[team].players.length; i++) {
//       let player = this.slate.teamDict[team].players[i];
//       this.slate.include(player.id);
//     }
//   }
// }
