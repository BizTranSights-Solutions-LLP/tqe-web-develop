// import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
// import { SeoService } from '../../services/seo.service';
// import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
// import { environment } from '../../../environments/environment';
// import { AuthService } from '../../services/auth.service';
// import { DataService } from '../../services/data.service';
// import { Subscription } from 'rxjs';
// import { NbaFdService } from '../../services/nba-fd.service';
// import { AngularBootstrapToastsService } from 'angular-bootstrap-toasts';
// import { ModalDirective } from 'ngx-bootstrap/modal';
// import { NbaFdPlayerPoolComponent } from './player-pool/player-pool.component';
// import { TeamFilterComponent } from '../nba-dk-optimizer/team-filter/team-filter.component';
// import { Router } from '@angular/router';
// import { ngxCsv } from 'ngx-csv';
// import * as moment from 'moment';
//
// @Component({
//   selector: 'app-nba-fd-optimizer',
//   templateUrl: './nba-fd-optimizer.component.html',
//   styleUrls: ['./nba-fd-optimizer.component.scss'],
//   encapsulation: ViewEncapsulation.None
// })
// @ViewChild(NbaFdPlayerPoolComponent)
// @ViewChild(TeamFilterComponent)
//
// export class NbaFdOptimizerComponent implements OnInit {
//   @ViewChild('signupModal') signupModal: ModalDirective;
//   constructor(
//     private authService: AuthService,
//     private dataService: DataService,
//     private router: Router,
//     private plumber: NbaFdService,
//     private toast: AngularBootstrapToastsService
//   ) { }
//
//   storageKey: string  = "tqe-nba-fd-optimizer";
//   currentTab: string = "pools"
//   loading: boolean = false;
//   loaded: boolean = false;
//   isAuthorized: boolean = false;
//   currentSlate: string = "Main Slate";
//   slates: any = {"Main Slate": {}};
//   gameDate: string = moment().format("YYYYMMDD");
//   searchText: string = "";
//   excludedArgs = {excluded: true};
//   includedArgs = {excluded: false};
//   objectValues = Object.values;
//   objectKeys   = Object.keys;
//   g_pos: string = "any";
//   f_pos: string = "any";
//   x_pos: any = ["PG","SG","SF","PF","C"];
//
//   rosterPositions: any = [
//     {lineupKey: "PG0", displayPos: "PG"},
//     {lineupKey: "PG1", displayPos: "PG"},
//     {lineupKey: "SG2", displayPos: "SG"},
//     {lineupKey: "SG3", displayPos: "SG"},
//     {lineupKey: "SF4", displayPos: "SF"},
//     {lineupKey: "SF5", displayPos: "SF"},
//     {lineupKey: "PF6", displayPos: "PF"},
//     {lineupKey: "PF7", displayPos: "PF"},
//     {lineupKey: "C8", displayPos: "C"}
//   ];
//
//   slate: any = {};
//
//   ngOnInit() {
//     this.authorizeUser();
//     this.loading = true;
//     this.plumber.getSlates().subscribe(
//       res => {
//         let slates: any = res;
//         for (var i = 0; i < slates.length; i++) {
//           let slate = slates[i];
//           this.slates[slate] = {
//             slateName: slate,
//             lineup_options: {
//               lineup_num: 1,
//               unique_player: 1,
//               cap_max: 60000,
//               cap_min: 35000,
//             },
//             sortKey: null,
//             sortAsc: true,
//             teamDict: {},
//             teams: [],
//             playerDict: {},
//             playerPool: [],
//             groups: [],
//             groupDict: {},
//             myLineups: {},
//             lineupSummary: {
//               "PG": [],
//               "SG": [],
//               "SF": [],
//               "PF": [],
//               "C": []
//             },
//             groupSummary: [],
//             optimalLineup: {
//               "PG0": false,
//               "PG1": false,
//               "SG2": false,
//               "SG3": false,
//               "SF4": false,
//               "SF5": false,
//               "PF6": false,
//               "PF7": false,
//               "C8": false,
//             },
//             optimalLineupPoints: 0,
//             optimalLineupSalary: 0,
//             filteredPos: null,
//             posFilter: function (pos) {
//               for (var i = 0; i < this.playerPool.length; i++) {
//                 let player = this.playerPool[i];
//                 if (pos === null) {
//                   player.shown = true;
//                   this.filteredPos = null;
//                 } else if (player.selectedpos.match(pos)) {
//                   player.shown = true;
//                   this.filteredPos = pos;
//                 } else {
//                   player.shown = false;
//                 }
//                 // return false;
//               }
//             },
//             sort: function (key, asc) {
//               if (key === this.sortKey) {
//                 if (asc === this.sortAsc) {
//                   return this.playerPool;
//                 } else {
//                   this.playerPool = this.playerPool.reverse();
//                   this.sortAsc = !this.sortAsc;
//                   return this.playerPool;
//                 }
//               } else {
//                 this.playerPool = [];
//                 this.sortKey = key;
//                 this.sortAsc = asc;
//                 if (asc) {
//                   this.playerPool = Object.values(this.playerDict).sort((a,b) => a[key] - b[key]);
//                 } else {
//                   this.playerPool = Object.values(this.playerDict).sort((a,b) => b[key] - a[key]);
//                 }
//               }
//             },
//             unlock: function (key) {
//               let p       = this.playerDict[key];
//               p.locked    = false;
//               p.optimized = false;
//               this.optimalLineup[p.lineup_pos] = false;
//             },
//             exclude: function (key) {
//               this.playerDict[key].excluded = true;
//               this.unlock(key);
//             },
//             include: function (key) {
//               this.playerDict[key].excluded = false;
//               this.teamDict[this.playerDict[key].team].excluded = false;
//             },
//             excludeAll: function () {
//               const playerIds = Object.keys(this.playerDict)
//               for (const id of playerIds) {
//                 this.exclude(id);
//               }
//             },
//             includeAll: function () {
//               const playerIds = Object.keys(this.playerDict)
//               for (const id of playerIds) {
//                 this.include(id);
//               }
//             },
//             clearExposure: function () {
//               const playerIds = Object.keys(this.playerDict)
//               for (const id of playerIds) {
//                 this.playerDict[id].min_exp = "0";
//                 this.playerDict[id].max_exp = "100";
//               }
//             },
//             toCsv: function () {
//               let csvName = "Lineups_FD_" + this.slateName + "_" + moment().format("YYYYMMDD");
//               let lineups: any = Object.values(this.myLineups);
//               let body    = lineups.map((lineup) => {
//                 let players: any = Object.values(lineup.roster);
//                 return players.map(player => player.id + ":" + player.name)
//               })
//               new ngxCsv(body, csvName, {headers: ["PG","PG","SG","SG","SF","SF","PF","PF","C"]});
//             },
//             exportProjections: function () {
//               let csvName  = "Projections_" + this.slateName + "_" + moment().format("YYYYMMDD");
//               let body:any = this.playerPool.map((player) => {
//                 return [player.id, player.name, player.projected_pts, player.floor, player.ceiling]
//               })
//               new ngxCsv(body, csvName, {headers: ["Player ID","Player Name","Projection","Floor","Ceiling"]});
//             },
//             optimalLineupStats () {
//               let optimalLineup: any = Object.values(this.optimalLineup).filter(p => !!p);
//               this.optimalLineupPoints = optimalLineup.reduce( (acc, p) => ( acc + p.projected_pts ), 0).toFixed(1);
//               this.optimalLineupSalary = optimalLineup.reduce( (acc, p) => ( acc + p.salary ), 0).toString().replace(/(-?\d+)(\d{3})/, "$1,$2");
//             }
//           };
//         }
//       },
//       err => console.log("  Error:", err),
//       () => {
//         this.plumber.getMainTable(this.currentSlate).subscribe(
//           res => {
//             if (this.loadSlate(this.currentSlate)) {
//               // Great
//             } else {
//               this.processSlate(res, this.currentSlate);
//             }
//             this.slate = this.slates[this.currentSlate];
//           },
//           err => console.log("  Error:", err),
//           () => {
//             for (var i = 1; i < Object.keys(this.slates).length; i++) {
//               let slateName = Object.keys(this.slates)[i];
//               this.plumber.getMainTable(slateName).subscribe(
//                 res => {
//                   if (this.loadSlate(slateName)) {
//                     // Great!
//                   } else {
//                     this.processSlate(res, slateName);
//                   }
//                 },
//                 err => console.log("  Error:", err),
//                 () => { }
//               )
//             }
//             this.loading = false;
//             this.loaded = true;
//           },
//         );
//       },
//     );
//     setInterval (() => {
//       this.saveSlate({quiet: true});
//     }, 5000);
//   }
//
//   // === PUBLIC METHODS ====================================================
//
//   public optimize() {
//     let players     = this.slate.playerPool.filter(p => (!p.excluded && !p.ignored));
//     let game_count  = 0;
//     let games       = {};
//
//     if (!this.isAuthorized) {
//       this.signupModal.show()
//       return false;
//     }
//
//     for (var i = 0; i < players.length; i++) {
//       let player    = players[i];
//       let home_team = player.team_is_home ? player.team : player.OPP;
//       if (game_count >= 2) {
//         break;
//       }
//
//       if (!games.hasOwnProperty(home_team)) {
//         games[home_team] = true;
//         game_count++;
//       }
//     }
//     if (game_count < 2) {
//       this.toastErrorMsg("Can't Optimize Lineup", "<b>Invalid Player Pool</b>. You must include players from at least 2 games before optimizing.");
//       return false;
//     }
//
//     this.slate.myLineups = [];
//     let locked_players = this.slate.playerPool.filter(p => p.locked);
//     if (locked_players.length < 2) {
//       this.toastErrorMsg("Can't Optimize Lineup", "<b>Invalid Player Pool</b>. You must lock at least 2 players before optimizing.");
//       return false;
//     }
//
//     let options = Object.assign(this.slate.lineup_options, {
//       current_player_pool: this.slate.playerPool.filter(p => !p.excluded && !p.ignored),
//       locked_players: locked_players,
//     });
//
//     for (var i = 0; i < Object.values(this.slate.optimalLineup).length; i++) {
//       let lineupPlayer: any = Object.values(this.slate.optimalLineup)[i];
//       if (lineupPlayer) {
//         lineupPlayer.optimized = false;
//       }
//     }
//
//     this.plumber.getOptimalLineup(options).subscribe(
//       res => {
//         let players: any = res;
//         if (players.length > 0) {
//           for (var i = 0; i < players.length; i++) {
//             let rawPlayer = players[i];
//             let playerId  = rawPlayer.player.match(/\((\d+-\d+)\)/)[1];
//             let lineupPos = (rawPlayer.pos1 + i); // this.rosterPositions[].lineupKey;
//
//             this.slate.playerDict[playerId].optimized = true;
//             this.slate.playerDict[playerId].lineup_pos = lineupPos;
//             this.slate.optimalLineup[lineupPos] = this.slate.playerDict[playerId];
//           }
//           this.slate.optimalLineupStats();
//         } else {
//           this.toastErrorMsg("Optimization Error", "Unable to optimize this lineup.")
//         }
//       },
//       err => {
//         this.toastErrorMsg("Unknown Error", "There was a problem processing your request. An engineer has already been notified. If the problem persists contact <b>info@thequantedge.com</b>")
//       }
//     );
//   }
//
//   public build() {
//     if (!this.validateConfig()) {
//       return false;
//     }
//
//     let groupOptions = this.processGroupOptions();
//
//     // Reset
//     this.slate.myLineups      = [];
//     this.slate.lineupSummary  = { "PG": [], "SG": [], "SF": [], "PF": [], "C": [] };
//     this.slate.groupSummary   = [];
//     this.loading              = true;
//
//     let locked_players  = this.slate.playerPool.filter(p => p.locked);
//     let options         = Object.assign({}, this.slate.lineup_options);
//
//     options = Object.assign(options, {
//       current_player_pool: this.slate.playerPool.filter(p => !p.excluded && !p.ignored),
//       locked_players: locked_players,
//     });
//
//     if (groupOptions) {
//       Object.assign(options, groupOptions);
//     }
//
//     this.plumber.getLineupWithOptions(options).subscribe(
//       res => {
//         let response_status = res[0][0];
//         let players = res[1];
//         let lineupSummary = res[2];
//         this.slate.groupSummary = res[3];
//
//         if (response_status === "Optimization Succeeds") {
//           for (var i = 0; i < players.length; i++) {
//             console.log(0);
//             let player          = players[i];
//             let playerId        = player.player.match(/\((\d+-\d+)\)/)[1];
//             let lineupPositions = this.rosterPositions.filter(p => p.displayPos === player.pos1);
//
//             player.id             = playerId;
//             player.salary_display = player.salary.toString().replace(/(-?\d+)(\d{3})/, "$1,$2");
//             player.first_name     = player.name.split(" ").shift();
//             player.last_name      = player.name.split(" ").slice(1).join(" ");
//
//             if (this.slate.myLineups.hasOwnProperty(player.lineup_num)) {
//               // Lineup already exists
//               for (var j = 0; j < lineupPositions.length; j++) {
//                 let pos = lineupPositions[j].lineupKey;
//                 if (!this.slate.myLineups[player.lineup_num].roster.hasOwnProperty(pos)) {
//                   this.slate.myLineups[player.lineup_num].roster[pos] = player;
//                   break;
//                 }
//               }
//             } else {
//               // Lineup does not exist
//               this.slate.myLineups[player.lineup_num] = {
//                 "TeamSalary": player.TeamSalary.toString().replace(/(-?\d+)(\d{3})/, "$1,$2"),
//                 "TotalPoints": player.TotalPoints,
//                 "roster": {}
//               };
//               this.slate.myLineups[player.lineup_num].roster[lineupPositions[0].lineupKey] = player;
//             }
//           }
//
//           for (var i = 0; i < lineupSummary.length; i++) {
//             let p = lineupSummary[i];
//             this.slate.lineupSummary[p.pos1].push({name: p.name, pos_exp: (p.pos_exp * 100).toFixed(0), total_exp: (p.total_exp * 100).toFixed(0)})
//           }
//
//           this.slate.myLineups = Object.values(this.slate.myLineups).sort((a,b) => b["TotalPoints"] - a["TotalPoints"])
//         } else {
//           this.toastErrorMsg("Optimization Error", response_status)
//         }
//       },
//       err => {
//         this.toastErrorMsg("Unknown Error", "There was a problem processing your request. An engineer has already been notified. If the problem persists contact <b>info@thequantedge.com</b>")
//       },
//       ()  => {
//         this.loading = false;
//       }
//     );
//   }
//
//   public setLineupNum (n) {
//     this.slate.lineup_options.lineup_num = n;
//   }
//
//   public unlockPlayer (e) {
//     let key           = e.playerId;
//     let player        = this.slate.playerDict[key];
//     player.locked     = false;
//     player.optimized  = false;
//     this.slate.optimalLineup[player.lineup_pos] = false;
//     this.slate.optimalLineupStats();
//   }
//
//   public lockPlayer (e) {
//     let key             = e.playerId;
//     let player          = this.slate.playerDict[key];
//     let lineupPositions = this.rosterPositions.filter(p => p.displayPos === player.selectedpos);
//     let canLock         = false;
//
//     if (player.locked) {
//       this.toastErrorMsg("Can't Lock Player", `<b>${player.name}</b> is already locked in <b>${player.lineup_pos}</b> position.`);
//       return false;
//     }
//
//     if (player.optimized) {
//       player.locked = true;
//       return true;
//     }
//
//     for (var i = 0; i < lineupPositions.length; i++) {
//       let pos = lineupPositions[i];
//       if (!this.slate.optimalLineup[pos.lineupKey] || !this.slate.optimalLineup[pos.lineupKey].locked) {
//         player.locked     = true;
//         player.optimized  = true;
//         player.excluded   = false;
//         player.lineup_pos = pos.lineupKey;
//         this.slate.optimalLineup[pos.lineupKey] = player;
//         this.slate.optimalLineupStats();
//         canLock = true;
//         break;
//       }
//     }
//
//     if (!canLock) {
//       this.toastErrorMsg("Can't Lock Player", `The <b>${player.selectedpos}</b> position is already full of locked players. Remove a player from one of these positions to add <b>${player.name}</b>`);
//       return false;
//     }
//   }
//
//   public handleMinSalChange (n) {
//     this.slate.lineup_options.cap_min = n;
//   }
//
//   public handleMaxSalChange (n) {
//     this.slate.lineup_options.cap_max = n;
//   }
//
//   public handleUniquePlayerChange (n) {
//     this.slate.lineup_options.unique_player = n;
//   }
//
//   public createStack (playerId) {
//     let player  = this.slate.playerDict[playerId];
//     let groupId = this.slate.groups.length;
//     let stack = {
//       basePlayer : player,
//       players: [player],
//       min_exp: 0,
//       max_exp: 100,
//     };
//     this.slate.groups.unshift(stack);
//
//     this.searchText = "";
//   }
//
//   public deleteStack (stackId) {
//     this.slate.groups.splice(stackId, 1);
//   }
//
//   public removePlayerFromStack (playerId, stackId) {
//     let player = this.slate.playerDict[playerId];
//     let playerIndex = -1;
//
//     for (var i = 0; i < this.slate.groups[stackId].players.length; i++) {
//       let p = this.slate.groups[stackId].players[i];
//       if (p.id === playerId) {
//         playerIndex = i;
//         break;
//       }
//     }
//     if (playerIndex > -1) {
//       this.slate.groups[stackId].players.splice(playerIndex, 1);
//     }
//   }
//
//   public addPlayerToStack (e, stackId) {
//     let playerId = e.playerId;
//     let player = this.slate.playerDict[playerId];
//     let playerInStack = false;
//
//     for (var i = 0; i < this.slate.groups[stackId].players.length; i++) {
//       let p = this.slate.groups[stackId].players[i];
//       if (p.id === playerId) {
//         playerInStack = true;
//         break;
//       }
//     }
//
//     if (playerInStack) {
//       this.toastErrorMsg("Can't Add Player To Stack", `<b>${player.name}</b> is already in the stack.`)
//       return false;
//     } else {
//       this.slate.groups[stackId].players.push(player);
//       return true;
//     }
//   }
//
//   public updateMinExposure (n, stackId) {
//     if (isNaN(n)) {
//       this.toastErrorMsg("Can't Update Exposure", `<b>Min Exposure</b> should be a number.`);
//     } else if (n < 0 || n > 100) {
//       this.toastErrorMsg("Can't Update Exposure", `<b>Min Exposure</b> should be between 1 and 100.`);
//     } else {
//       this.slate.groups[stackId].min_exp = n;
//     }
//   }
//
//   public updateMaxExposure (n, stackId) {
//     if (isNaN(n)) {
//       this.toastErrorMsg("Can't Update Exposure", `<b>Max Exposure</b> should be a number.`);
//     } else if (n < 0 || n > 100) {
//       this.toastErrorMsg("Can't Update Exposure", `<b>Max Exposure</b> should be between 1 and 100.`);
//     } else {
//       this.slate.groups[stackId].max_exp = n;
//     }
//   }
//
//   public handleGPosUpdate (p) {
//     this.g_pos = p;
//     switch (this.g_pos) {
//     case "any":
//       this.slate.lineup_options.force_g     = 0;
//       this.slate.lineup_options.force_g_pos = "";
//       break;
//     case "sg":
//       this.slate.lineup_options.force_g     = 1;
//       this.slate.lineup_options.force_g_pos = "SG";
//       break;
//     case "pg":
//       this.slate.lineup_options.force_g     = 1;
//       this.slate.lineup_options.force_g_pos = "PG";
//       break;
//     }
//   }
//
//   public handleFPosUpdate (p) {
//     this.f_pos = p;
//     switch (this.f_pos) {
//     case "any":
//       this.slate.lineup_options.force_f     = 0;
//       this.slate.lineup_options.force_f_pos = "";
//       break;
//     case "sf":
//       this.slate.lineup_options.force_f     = 1;
//       this.slate.lineup_options.force_f_pos = "SF";
//       break;
//     case "pf":
//       this.slate.lineup_options.force_f     = 1;
//       this.slate.lineup_options.force_f_pos = "PF";
//       break;
//     }
//   }
//
//   public handleXPosUpdate (target) {
//     let posIndex = this.x_pos.indexOf(target.value);
//     if (target.checked && posIndex < 0) {
//       // add pos to this.x_pos
//       this.x_pos.push(target.value);
//     } else if (posIndex >= 0){
//       // remove pos from this.x_pos
//       this.x_pos.splice(posIndex, 1);
//     }
//     this.slate.lineup_options.force_flex  = (this.x_pos.length === 5 ? 0 : 1);
//     this.slate.lineup_options.force_pos = this.x_pos.join(",");
//   }
//
//   public handleSlateChange (slate) {
//     this.currentSlate = slate;
//     this.slate = this.slates[this.currentSlate];
//   }
//
//   public saveSlate (options) {
//     let savedData = localStorage.getItem(this.storageKey);
//     let parsedData;
//     let diskSlate: any = {};
//     let opto = this;
//
//     if (savedData) {
//       parsedData = JSON.parse(savedData);
//
//       Object.keys(this.slates).forEach(slateName => {
//         parsedData.slates[slateName] = opto.slates[slateName];
//       });
//
//       localStorage.setItem(this.storageKey, JSON.stringify(parsedData));
//
//     } else {
//       diskSlate = {
//         expiration: this.gameDate,
//         slates: {}
//       }
//
//       Object.keys(this.slates).forEach(slateName => {
//         diskSlate.slates[slateName] = this.slates[slateName];
//       });
//
//       localStorage.setItem(this.storageKey, JSON.stringify(diskSlate));
//     }
//
//     if (!options.quiet) {
//       this.toastInfoMsg("Saved!","Successfully saved your work.");
//     }
//   }
//
//   public loadSlate (slateName) {
//     let diskSlate: any = null;
//     let savedData: any = localStorage.getItem(this.storageKey);
//     let parsedData: any = JSON.parse(savedData);
//
//     if (!savedData) {
//       return false;
//     } else if (parseInt(parsedData.expiration) < parseInt(this.gameDate)) {
//       localStorage.removeItem(this.storageKey);
//       return false;
//     } else {
//       diskSlate = parsedData.slates[slateName];
//     }
//
//     if (!diskSlate) {
//       return false;
//     }
//
//     this.plumber.getMainTable(slateName).subscribe(
//       res => {
//         this.processSlate(res, slateName);
//         let slate = this.slates[slateName];
//
//         slate.groups = diskSlate.groups;
//         slate.lineup_options = diskSlate.lineup_options;
//         slate.optimalLineup = diskSlate.optimalLineup;
//         slate.optimalLineupStats();
//         for (var i = 0; i < slate.playerPool.length; i++) {
//           let apiPlayer   = slate.playerPool[i];
//           let diskPlayer  = diskSlate.playerDict[apiPlayer.id]
//
//           apiPlayer.min_exp   = diskPlayer.min_exp;
//           apiPlayer.max_exp   = diskPlayer.max_exp;
//           apiPlayer.excluded  = diskPlayer.excluded;
//           apiPlayer.locked    = diskPlayer.locked;
//           apiPlayer.optimized = diskPlayer.optimized;
//         }
//         Object.keys(slate.optimalLineup).forEach(pos => {
//           let p = slate.optimalLineup[pos];
//           if (p) {
//             slate.playerDict[p.id].lineup_pos = pos;
//           }
//         });
//       },
//       err => console.log("  Error:", err),
//       () => {
//         this.toastInfoMsg("Loaded Data","Successfully loaded your saved <b>" + slateName + "</b> data.");
//       }
//     )
//
//     return true;
//   }
//
//   public resetSlate () {
//     let diskSlate = localStorage.getItem(this.storageKey);
//     if (diskSlate) {
//       localStorage.removeItem(this.storageKey)
//     }
//
//     location.reload();
//   }
//
//   // === PRIVATE METHODS ===================================================
//
//   private authorizeUser () {
//     let isLoggedIn: any = this.authService.isUserLoggedIn();
//     let tool: string = "nba-dk-optimizer"
//
//     this.dataService.get_tool(tool).subscribe(
//       res => {
//         let toolDetail: any = res;
//         this.isAuthorized = !!isLoggedIn && (toolDetail.result.is_allowed === 1);
//       },
//       err => console.log("  Error:", err),
//       ()  => {}
//     );
//
//   }
//
//   private processSlate(slate, name) {
//     for (let i = 0; i < slate.length; i++) {
//       let rawPlayer = slate[i];
//       let playerId  = rawPlayer.player.match(/\((\d+-\d+)\)/)[1];
//       rawPlayer.id  = playerId;
//       rawPlayer.excluded = false;
//       rawPlayer.locked = false;
//       rawPlayer.first_name = rawPlayer.name.split(" ").shift();
//       rawPlayer.last_name = rawPlayer.name.split(" ").slice(1).join(" ");
//       rawPlayer.positions = rawPlayer.pos1.split("/");
//       rawPlayer.selectedpos = rawPlayer.positions[0];
//       rawPlayer.min_exp = "0";
//       rawPlayer.max_exp = "100";
//       rawPlayer.shown = true;
//       rawPlayer.optimized = false;
//       rawPlayer.salary_display = rawPlayer.salary.toString().replace(/(-?\d+)(\d{3})/, "$1,$2");
//       if (!this.isAuthorized) {
//         rawPlayer.projected_pts = 0;
//         rawPlayer.floor = 0;
//         rawPlayer.ceiling = 0;
//         rawPlayer.Own = 0;
//         rawPlayer.PPD = 0;
//         rawPlayer.ignored = false;
//       } else if (rawPlayer.projected_pts > 9.99) {
//         rawPlayer.projected_pts = parseFloat(rawPlayer.projected_pts.toFixed(1));
//         rawPlayer.floor = parseFloat(rawPlayer.floor.toFixed(1));
//         rawPlayer.ceiling = parseFloat(rawPlayer.ceiling.toFixed(1));
//         rawPlayer.ignored = false;
//       } else {
//         rawPlayer.ignored = true;
//       }
//       this.slates[name].playerDict[playerId] = rawPlayer;
//       this.slates[name].playerPool.push(rawPlayer);
//
//       if (!this.slates[name].teamDict.hasOwnProperty(rawPlayer.team)) {
//         let t = {
//           abbr: rawPlayer.team,
//           first_name: rawPlayer.team_first_name,
//           last_name: rawPlayer.team_last_name,
//           is_home: rawPlayer.team_is_home,
//           TT: rawPlayer.TT,
//           pace: rawPlayer.OTP,
//           opponent: rawPlayer.opp_last_name,
//           isExcluded: function () {
//             for (var i = 0; i < this.players.length; i++) {
//               if (this.players[i].excluded === false) {
//                 return false;
//                 break;
//               }
//             }
//             return true;
//           },
//           isIncluded: function () {
//             for (var i = 0; i < this.players.length; i++) {
//               if (this.players[i].excluded === true) {
//                 return false;
//                 break;
//               }
//             }
//             return true;
//           },
//           players: [rawPlayer]
//         }
//         this.slates[name].teamDict[rawPlayer.team] = t;
//         this.slates[name].teams.push(t);
//       } else {
//         this.slates[name].teamDict[rawPlayer.team].players.push(rawPlayer);
//       }
//
//     }
//     this.slates[name].sort('PPD', false);
//   };
//
//   private toastErrorMsg(title, msg) {
//     this.toast.showSimpleToast({
//       text: msg,
//       title: title,
//       iconClass: "fas fa-exclamation-triangle",
//       titleClass: "bg-danger text-white",
//       closeButtonClass: "text-white",
//       toastClass: "border-danger",
//       duration: 5000,
//       bodyClass: "",
//       toolbarClass: "",
//     });
//   };
//
//   private toastInfoMsg(title, msg) {
//     this.toast.showSimpleToast({
//       text: msg,
//       title: title,
//       iconClass: "fas fa-info-circle",
//       titleClass: "bg-info text-white",
//       closeButtonClass: "text-white",
//       toastClass: "border-info",
//       duration: 5000,
//       bodyClass: "",
//       toolbarClass: "",
//     });
//   };
//
//   private validateConfig() {
//     let   errorFound = false;
//     const errorTitle = "Can't Optimize Lineup";
//
//     if (!this.isAuthorized) {
//       this.signupModal.show()
//       return false;
//     }
//
//     if (isNaN(this.slate.lineup_options.cap_max)) {
//       this.toastErrorMsg(errorTitle, "Invalid value for <b>Max Salary</b>");
//       errorFound = true;
//     } else if (this.slate.lineup_options.cap_max > 60000) {
//       this.toastErrorMsg(errorTitle, "<b>Max Salary</b> can't be greater than $50,000.");
//       errorFound = true;
//     } else if (this.slate.lineup_options.cap_max < 1) {
//       this.toastErrorMsg(errorTitle, "<b>Max Salary</b> should be atleast $1.");
//       errorFound = true;
//     }
//
//     if (isNaN(this.slate.lineup_options.cap_min)) {
//       this.toastErrorMsg(errorTitle, "Invalid value for <b>Min Salary</b>");
//       errorFound = true;
//     } else if (this.slate.lineup_options.cap_min < 1) {
//       this.toastErrorMsg(errorTitle, "<b>Min Salary</b> should be at least $1.");
//       errorFound = true;
//     } else if (!isNaN(this.slate.lineup_options.cap_max) && this.slate.lineup_options.cap_min >+ this.slate.lineup_options.cap_max) {
//       this.toastErrorMsg(errorTitle, "<b>Min Salary</b> should be less than or equal to <b>Max Salary</b>");
//       errorFound = true;
//     }
//
//     if (isNaN(this.slate.lineup_options.lineup_num)) {
//       this.toastErrorMsg(errorTitle, "Invalid value for <b>No. of lineups</b>");
//       errorFound = true;
//     } else if (this.slate.lineup_options.lineup_num < 1) {
//       this.toastErrorMsg(errorTitle, "<b>No. of Lineups</b> can't be less than 1.");
//       errorFound = true;
//     } else if (this.slate.lineup_options.lineup_num > 150) {
//       this.toastErrorMsg(errorTitle, "<b>No. of Lineups</b> can't be greater than 150.");
//       errorFound = true;
//     }
//
//     for (var i = 0; i < this.slate.groups.length; i++) {
//       let g = this.slate.groups[i];
//       if (![2,3,4,5].includes(g.players.length) ) {
//         this.toastErrorMsg(errorTitle, `<b>Stack #${i + 1} is Invalid.</b> Stacks must have 2 or 3 players.`);
//         errorFound = true;
//       } else if (isNaN(g.min_exp) || parseInt(g.min_exp) < 0 || parseInt(g.min_exp) > 100) {
//         this.toastErrorMsg(errorTitle, `<b>Stack #${i + 1} is Invalid.</b> Min Exposure should be a number between 0 and 100.`);
//         errorFound = true;
//       } else if (isNaN(g.max_exp) || parseInt(g.max_exp) < 0 || parseInt(g.max_exp) > 100) {
//         this.toastErrorMsg(errorTitle, `<b>Stack #${i + 1} is Invalid.</b> Max Exposure should be a number between 0 and 100.`);
//         errorFound = true;
//       } else if (parseInt(g.min_exp) > parseInt(g.max_exp)) {
//         this.toastErrorMsg(errorTitle, `<b>Stack #${i + 1} is Invalid.</b> Max Exposure should greater than Min Exposure.`);
//         errorFound = true;
//       }
//     }
//
//     let players = this.slate.playerPool.filter(p => (!p.excluded && !p.ignored));
//     let exposure_count  = 0;
//     let game_count      = 0;
//     let games           = {};
//     for (var i = 0; i < players.length; i++) {
//       let player    = players[i];
//       let home_team = player.team_is_home ? player.team : player.OPP;
//       if (exposure_count >= 2 && game_count >= 2) {
//         break;
//       }
//
//       if (!games.hasOwnProperty(home_team)) {
//         games[home_team] = true;
//         game_count++;
//       }
//
//       if (player.locked) {
//         exposure_count ++;
//       } else if (parseInt(player.min_exp) !== 0) {
//         exposure_count ++;
//       } else if (parseInt(player.max_exp) !== 100) {
//         exposure_count ++;
//       }
//     }
//     if (exposure_count < 2) {
//       errorFound = true;
//       this.toastErrorMsg("Can't Build Lineups", "<b>Invalid Player Pool</b>. You must set an exposure at least 2 players before building.");
//     }
//     if (game_count < 2) {
//       errorFound = true;
//       this.toastErrorMsg("Can't Build Lineups", "<b>Invalid Player Pool</b>. You must include players from at least 2 games before building.");
//     }
//
//     return !errorFound;
//   };
//
//   private processGroupOptions() {
//     let groupOptions = {};
//
//     if (this.slate.groups.length === 0) {
//       return false;
//     } else {
//       for (var i = 0; i < this.slate.groups.length; i++) {
//         let group = this.slate.groups[i];
//           let player_key = "group_player_id";
//           let exp_max_key = "group_rate";
//           let exp_min_key = "group_rate_min";
//           if (i > 0) {
//             player_key = `group_player${i}_id`;
//             exp_max_key += `${i}`;
//             exp_min_key += `${i}`;
//           }
//           groupOptions[player_key] = group.players.map(p => p.id).join(",");
//           groupOptions[exp_min_key] = parseInt(group.min_exp) / 100.0;
//           groupOptions[exp_max_key] = parseInt(group.max_exp) / 100.0;
//       }
//       return groupOptions;
//     }
//   };
// }
