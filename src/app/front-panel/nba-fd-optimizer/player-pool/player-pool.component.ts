// import { Component, Input, Output, OnChanges, SimpleChanges, EventEmitter } from '@angular/core';
//
// @Component({
//   selector: 'tqe-fd-player-pool',
//   templateUrl: './player-pool.component.html',
//   styleUrls: ['./player-pool.component.scss']
// })
// export class NbaFdPlayerPoolComponent implements OnChanges {
//   @Input() slate: any;
//   @Input() filterArgs: any;
//   @Input() isAuthorized: boolean;
//   @Output() lock: EventEmitter<any> = new EventEmitter();
//   @Output() unlock: EventEmitter<any> = new EventEmitter();
//   constructor() { }
//
//   public includedPool: boolean;
//   public playerFilter: string;
//
//   ngOnChanges(changes: SimpleChanges): void {
//     this.includedPool = !this.filterArgs.excluded;
//   }
//
//   // template helpers
//   public sortColumn(col) {
//     this.slate.sort(col, (this.slate.sortKey === col ? !this.slate.sortAsc : false));
//   }
//
//   public handleProjChange(pts, id) {
//     let player  = this.slate.playerDict[id];
//     let ppd     = 0.0;
//
//     player.projected_pts = parseFloat(pts);
//     ppd = player.projected_pts / (player.salary / 1000);
//     player.PPD = ppd.toFixed(2);
//   }
//
//   public handlePositionChange(p, id) {
//     let player = this.slate.playerDict[id];
//     player.selectedpos = p;
//   }
//
//   public handleFloorChange(f,id) {
//     let player = this.slate.playerDict[id];
//     player.floor = f
//   }
//   public handleCeilingChange(c,id) {
//     let player = this.slate.playerDict[id];
//     player.ceiling = c;
//   }
//   public handleMinExChange(pts,id) {
//     let player = this.slate.playerDict[id];
//     player.min_exp = pts;
//   }
//   public handleMaxExChange(pts,id) {
//     let player = this.slate.playerDict[id];
//     player.max_exp = pts;
//   }
// }
