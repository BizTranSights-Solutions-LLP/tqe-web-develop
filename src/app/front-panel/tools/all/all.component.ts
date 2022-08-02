import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy, ElementRef } from '@angular/core';
import { ToolsServiceService } from '../../../services/tools-service.service';
import { Subject, Subscription } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { ngxCsv } from 'ngx-csv/ngx-csv';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Papa } from 'ngx-papaparse';
import { PlayerList } from '../../../models/players-list';
import { AuthService } from '../../../services/auth.service';

declare var $;

@Component({
    selector: 'app-all',
    templateUrl: './all.component.html',
    styleUrls: ['./all.component.css']
})
export class AllComponent implements OnInit, AfterViewInit, OnDestroy {

    @ViewChild(DataTableDirective) dtElement: DataTableDirective;
    @ViewChild('searchPlayer') searchPlayer: ElementRef;
    @ViewChild('file') csvfile: ElementRef;
    @ViewChild('poolName') poolName: ElementRef;
    @ViewChild('emptyLineupError') emptyLineupError: ModalDirective;
    @ViewChild('playerPopup') playerPopup: ModalDirective;
    @ViewChild('playerPool') playerPoolPopup: ModalDirective;
    @ViewChild('initSavePool') initSavePoolPopup: ModalDirective;

    private lineupCount: number = 0;

    showLineupCol: string = 'proj';
    currentSlate: string = '';
    errorMessage: string = '';
    inputFieldText: string = 'Choose file';
    playerName: string = '';
    successMessage: string = '';
    savePoolErrMsg: string = '';
    playerSalary: number = 0;
    selectedPlayer: any = {};
    selectedPlayerIndex: number;
    remaining: number;
    remainingAvg: number;
    projected_points: number = 0;
    selected_player_pool: any;
    getWeekNSlateInterval: any;

    editable: boolean = false;
    hideTable: boolean = false;
    filterPlayers: boolean = false;
    optimizeInProcess: boolean = false;
    savePoolLoader: boolean = false;
    gameLogLoader: boolean = false;
    stopKeySearch: boolean = false;
    stopSubmitSearch: boolean = false;
    showRangeFilter: boolean = false;

    range_sliders_pos_wise = {
        QB: { salary: { min: 0, max: 100, from: 0,to: 100 }, proj: { min: 0, max: 100, from: 0,to: 100 }, ppd: { min: 0, max: 100, from: 0,to: 100 }, con: { min: 0, max: 100, from: 0,to: 100 }, def_vs_pos: { min: 0, max: 100, from: 0,to: 100 } },
        RB: { salary: { min: 0, max: 100, from: 0,to: 100 }, proj: { min: 0, max: 100, from: 0,to: 100 }, ppd: { min: 0, max: 100, from: 0,to: 100 }, con: { min: 0, max: 100, from: 0,to: 100 }, def_vs_pos: { min: 0, max: 100, from: 0,to: 100 } },
        WR: { salary: { min: 0, max: 100, from: 0,to: 100 }, proj: { min: 0, max: 100, from: 0,to: 100 }, ppd: { min: 0, max: 100, from: 0,to: 100 }, con: { min: 0, max: 100, from: 0,to: 100 }, def_vs_pos: { min: 0, max: 100, from: 0,to: 100 } },
        TE: { salary: { min: 0, max: 100, from: 0,to: 100 }, proj: { min: 0, max: 100, from: 0,to: 100 }, ppd: { min: 0, max: 100, from: 0,to: 100 }, con: { min: 0, max: 100, from: 0,to: 100 }, def_vs_pos: { min: 0, max: 100, from: 0,to: 100 } },
        DST: { salary: { min: 0, max: 100, from: 0,to: 100 }, proj: { min: 0, max: 100, from: 0,to: 100 }, ppd: { min: 0, max: 100, from: 0,to: 100 }, con: { min: 0, max: 100, from: 0,to: 100 }, def_vs_pos: { min: 0, max: 100, from: 0,to: 100 } }
    };

    listData: any = [];
    listTempData: any = [];
    playerLog: any = [];
    lineupData = [];
    teamLogos = [];
    savedPool:any = [];
    private headers: Array<string> = ["player","game","pos1","name","team","salary","projected_pts","floor","ceiling","site","slate","OPP","PPD","time","min","max"];
    private fetchedTeam = [];
    private lineupDataFromList = [];

    dtOptions: DataTables.Settings = {};
    dtOptions2: DataTables.Settings = {};

    dtTrigger: Subject<any> = new Subject();
    dtTrigger2: Subject<any> = new Subject();
    debounceFindPlayerTrigger = new Subject<any>();

    toolDataSubscription: Subscription;
    posFilterSubscription: Subscription;
    clearExposureSubscription: Subscription;
    excludeAllSubscription: Subscription;
    slateValSubscription: Subscription;
    popupEventSubscription: Subscription;
    resetAllSubscription: Subscription;
    openPlayerPoolSubscription: Subscription;
    allSubscription: Subscription[] = [];
    
    findPlayerTimeout: any;
    selected_player_pool_id: any;
    
    constructor(
        private toolService: ToolsServiceService, 
        private papa: Papa,
        private authService: AuthService
        ) { }

    ngOnInit() {
        // console.log(this.toolService.toolName);
        window.scrollTo(0, 0);

        this.resetRemainAndRemainAvg();
        this.showRangeFilter = ['ALL','FLEX'].indexOf(this.toolService.currentSelectedPos) === -1 ? true : false;

        this.slateValSubscription = this.toolService.weekNSlateValues.subscribe(
            (res: { week: string, slate: string, first_emit: boolean }) => {
                if (res) {
                    this.filterPlayers = false;
                    this.searchPlayer.nativeElement.value = '';
                    this.toolService.reset_player_n_exlude_arr();
                    this.toolService.preserve_lineup([], [], 0, 0, 0, 0);
                    this.toolService.filteredPlayerPool = [];
                    this.resetRemainAndRemainAvg();
                    this.updateSlate(res.week, res.slate);
                }
            }
        );

        this.dtOptions = {
            "dom": "<'table_wrap' rt><'table_footer' lp>",
            orderCellsTop: true,
            pageLength: 25,
            order: [[11, "desc"]],
            autoWidth: false
        };

        this.dtOptions2 = {
            order: [],
            paging: false,
            searching: false,
            info: false
        };

        $(".js-range-slider_13").ionRangeSlider({
            type: "double",
            grid: false,
            min: 0,
            postfix: ""
        });

        if(this.toolService.mainSearchVal !== '') {
            this.searchPlayer.nativeElement.value = this.toolService.mainSearchVal;
        }

        let playersList = this.toolService.get_players_list();
        if (playersList.length !== 0) {
            
            this.listData = playersList;
            this.toolService.filteredPlayerPool = this.listData;

            this.currentSlate = this.toolService.weekNSlate.slate;
            if (this.listData.length !== 0) {
                let row = this.listData[0];
                this.headers = Object.keys(row);
                
                // if(!this.toolService.poolLoadedFromOtherComp) {
                //     this.setup_preservered_range();
                // } else {
                this.setup_range_sliders(this.listData);
                // }
            }
            this.listTempData = this.listData;
            let data = this.listData.map(d => d.team);
            this.fetchedTeam = data.sort().filter(function (item, pos, ary) {
                return !pos || item != ary[pos - 1];
            });
            let teamLogos = this.toolService.get_team_logos();
            let teamLogosWithStatus = [];
            teamLogos.map(
                logo => {
                    let response = this.addGreyScale(logo);
                    let data = {};
                    data['logo'] = logo;
                    data['status'] = response;
                    teamLogosWithStatus.push(data);
                }
            );
            if(teamLogosWithStatus.length > 0) {
                this.teamLogos = teamLogosWithStatus;
            }
            this.hideTable = true;
            setTimeout(() => {

                let pos = this.toolService.currentSelectedPos;
                if(this.toolService.poolLoadedFromOtherComp) {
                    this.listData.map(
                        d => {
                            d['ppd_color'] = this.getColor('PPD',d.PPD);
                            d['def_vs_pos_color'] = this.getColor('Def vs Pos',d['Def vs Pos']);
                            return d;
                        }
                    );

                    if (pos !== 'ALL') {
                        if (pos === 'FLEX') {
                            this.listData = this.listData.filter(
                                (d) => d.pos1 === 'RB' || d.pos1 === 'WR' || d.pos1 === 'TE'
                            );
                        } else {
                            this.listData = this.listData.filter(
                                (d) => d.pos1 === pos
                            );
                        }
                    }
                    
                }

                if(pos === 'FLEX') {
                    this.listData = this.listData.filter(
                        (d) => d.pos1 === 'RB' || d.pos1 === 'WR' || d.pos1 === 'TE'
                    );
                }

                let { slate } = this.toolService.weekNSlate;
                if (pos === 'ALL') {

                    ['QB','WR','RB','TE','DST'].map(pos => {
                        let stored_data = localStorage.getItem(this.toolService.toolName + ' '+ slate+pos);
                        if(stored_data) {
                            stored_data = JSON.parse(stored_data);
                            if(stored_data[slate+pos].length > 0) {
                                this.listData = this.listData.filter(d => d.pos1 !== pos);
                                this.listData = this.listData.concat(stored_data[slate+pos]);
                            }
                        }
                    });
        
                } else if (pos === 'FLEX') {
                    
                    ['WR','RB','TE'].map(pos => {
                        let stored_data = localStorage.getItem(this.toolService.toolName + ' '+ slate+pos);
                        if(stored_data) {
                            stored_data = JSON.parse(stored_data);
                            if(stored_data[slate+pos].length > 0) {
                                this.listData = this.listData.filter(d => d.pos1 !== pos);
                                this.listData = this.listData.concat(stored_data[slate+pos]);
                            }
                        }
                    });
        
                    this.listData = this.listData.filter(
                        (d) => d.pos1 === 'RB' || d.pos1 === 'WR' || d.pos1 === 'TE'
                    );
                    
                } else {
                    // line to apply position filter 07-09-2019 
                    this.listData = this.listData.filter(
                        (d) => d.pos1 === pos
                    );
                }

                this.dtTrigger.next();

                let lineup = this.toolService.get_preserved_lineup();
                if (lineup.lineup.length !== 0) {
                    this.lineupData = lineup.lineup;
                    this.lineupDataFromList = lineup.lineup_data;
                    let calculations: any = lineup.lineup_cal;
                    this.remaining = calculations.remain;
                    this.remainingAvg = calculations.remainAvg;
                    this.lineupCount = calculations.count;
                    this.projected_points = calculations.point;
                } else {
                    this.lineupData = this.toolService.get_default_lineup();
                }
                this.dtTrigger2.next();
                setTimeout(() => {
                    if(this.toolService.poolLoadedFromOtherComp) {
                        this.hideTable = false;
                    } else {
                        this.filter_players();
                    }
                }, 10);

            }, 10);

        } else {

            if (this.toolService.get_excluded_list().length === 0) {
                this.hideTable = true;
                let week: any = this.toolService.weekNSlate.week;
                let slate = this.toolService.weekNSlate.slate;

                this.toolDataSubscription = this.toolService.get_data(week, slate).subscribe(
                    (res: PlayerList[]) => {
                        this.listData = res;
                        this.toolService.filteredPlayerPool = this.listData;
                        this.currentSlate = this.toolService.weekNSlate.slate;
                        if (this.listData.length !== 0) {
                            let row = this.listData[0];
                            this.headers = Object.keys(row);
                        }
                        // this.hideTable = true;

                        // load stored exposure on page reload for player pool
                        let saved_pool_exposure_key = this.toolService.toolName + ' '+ this.currentSlate + ' pool';
                        let stored_exposures = localStorage.getItem(saved_pool_exposure_key);
                        let stored_exposures_array = [];
                        let load_stored_exposures = false;

                        if(stored_exposures && (JSON.parse(stored_exposures)).length > 0) {
                            load_stored_exposures = true;
                            stored_exposures_array = JSON.parse(stored_exposures);
                        }

                        this.listData.map(
                            d => {
                                d['ppd_color'] = this.getColor('PPD',d.PPD);
                                d['def_vs_pos_color'] = this.getColor('Def vs Pos',d['Def vs Pos']);
                                if(!load_stored_exposures) {
                                    d['min'] = '';
                                    d['max'] = '';
                                } else {
                                    let player_id = d.player.split('(')[1].replace(')','');
                                    let player_stored_exposure = stored_exposures_array.find(e => e.player_id === player_id);
                                    if(player_stored_exposure) {
                                        if(player_stored_exposure.min) d['min'] = player_stored_exposure.min;
                                        if(player_stored_exposure.max) d['max'] = player_stored_exposure.max;
                                    } else {
                                        d['min'] = '';
                                        d['max'] = '';
                                    }
                                }
                                return d;
                            }
                        );

                        this.listTempData = this.listData;
                        this.toolService.set_players_list(this.listData);
                        
                        let pos = this.toolService.currentSelectedPos;
                        if (pos !== 'ALL') {
                            if (pos === 'FLEX') {
                                this.listData = this.listData.filter(
                                    (d) => d.pos1 === 'RB' || d.pos1 === 'WR' || d.pos1 === 'TE'
                                );
                            } else {
                                this.listData = this.listData.filter(
                                    (d) => d.pos1 === pos
                                );
                            }
                        }

                        this.applyDatatableAndAllFilters(true);

                        if (this.listData.length !== 0) {
                            this.setup_range_sliders(this.toolService.get_players_list());
                        }

                        let excluded: any = localStorage.getItem(this.toolService.toolName + ' '+ slate + ' excluded');
                        if(excluded) {
                            excluded = JSON.parse(excluded);

                            let excluded_players_data = [];
                            this.listData = this.toolService.get_players_list().filter(d => {
                                let id = d.player.split('(')[1].replace(')',''); 
                                if(excluded.indexOf(id) === -1) {
                                    return true;
                                } else {
                                    excluded_players_data.push(d);
                                    return false;
                                }
                            });

                            this.toolService.set_players_list(this.listData);

                            if (pos !== 'ALL') {
                                if (pos === 'FLEX') {
                                    this.listData = this.listData.filter(
                                        (d) => d.pos1 === 'RB' || d.pos1 === 'WR' || d.pos1 === 'TE'
                                    );
                                } else {
                                    this.listData = this.listData.filter(
                                        (d) => d.pos1 === pos
                                    );
                                }
                            }
                            this.toolService.set_excluded_list(excluded_players_data);

                            if(this.listData.length === 0) {
                                this.hideTable = false;
                            }

                        }

                        if (pos === 'ALL') {

                            ['QB','WR','RB','TE','DST'].map(pos => {
                                let stored_data = localStorage.getItem(this.toolService.toolName + ' '+ slate+pos);
                                if(stored_data) {
                                    stored_data = JSON.parse(stored_data);
                                    if(stored_data[slate+pos].length > 0) {
                                        this.listData = this.listData.filter(d => d.pos1 !== pos);
                                        this.listData = this.listData.concat(stored_data[slate+pos]);
                                    }
                                }
                            });
                
                        } else if (pos === 'FLEX') {
                            
                            ['WR','RB','TE'].map(pos => {
                                let stored_data = localStorage.getItem(this.toolService.toolName + ' '+ slate+pos);
                                if(stored_data) {
                                    stored_data = JSON.parse(stored_data);
                                    if(stored_data[slate+pos].length > 0) {
                                        this.listData = this.listData.filter(d => d.pos1 !== pos);
                                        this.listData = this.listData.concat(stored_data[slate+pos]);
                                    }
                                }
                            });
                
                            this.listData = this.listData.filter(
                                (d) => d.pos1 === 'RB' || d.pos1 === 'WR' || d.pos1 === 'TE'
                            );
                            
                        }

                        if(this.listData.length > 0) {
                            this.filter_players();
                        }

                        let data = this.toolService.get_players_list().map(d => d.team);
                        this.fetchedTeam = data.sort().filter(function (item, pos, ary) {
                            return !pos || item != ary[pos - 1];
                        });

                        let teamLogos = this.toolService.get_team_logos();
                        let teamLogosWithStatus = [];
                        teamLogos.map(
                            logo => {
                                let response = this.addGreyScale(logo);
                                let data = {};
                                data['logo'] = logo;
                                data['status'] = response;
                                teamLogosWithStatus.push(data);
                            }
                        );
                        if(teamLogosWithStatus.length > 0) {
                            this.teamLogos = teamLogosWithStatus;
                        }

                    },
                    (err) => {
                        this.hideTable = false;
                        this.errorMessage = "No Player Pool available currently.";
                        this.emptyLineupError.show();
                    }
                );
            } else {
                this.listData = [];
                this.toolService.filteredPlayerPool = this.listData;
                let teamLogos = this.toolService.get_team_logos();
                let teamLogosWithStatus = [];
                teamLogos.map(
                    logo => {
                        let response = this.addGreyScale(logo);
                        let data = {};
                        data['logo'] = logo;
                        data['status'] = response;
                        teamLogosWithStatus.push(data);
                    }
                );
                if(teamLogosWithStatus.length > 0) {
                    this.teamLogos = teamLogosWithStatus;
                }
                setTimeout(() => {
                    this.applyDatatableAndAllFilters();
                }, 10);
            }
        }

        this.posFilterSubscription = this.toolService.posFilterTrigger.subscribe(
            (res: string) => {
                this.filterPlayers = false;
                this.showRangeFilter = ['ALL','FLEX'].indexOf(res) === -1 ? true : false;
                if(this.toolService.get_players_list().length > 0) {
                    this.filterDataUsingPos(res);
                }
            }
        );

        this.popupEventSubscription = this.toolService.popupEvent.subscribe(
            (res:boolean) => this.filterPlayers = false
        )

        this.clearExposureSubscription = this.toolService.clearExposure.subscribe(
            (res: boolean) => {
                if (res) {
                    this.listData = this.toolService.get_players_list().map(
                        d => {
                            d['min'] = '';
                            d['max'] = '';
                            return d;
                        }
                    );

                    let pos = this.toolService.currentSelectedPos;
                    
                    if(pos !== 'ALL') {
                        this.listData = this.listData.filter(d => d.pos1 === pos);
                    }

                    this.filter_players();
                    // this.rerender();

                    let excluded = this.toolService.get_excluded_list();
                    if(excluded.length > 0) {
                        excluded.map(
                            d => {
                                d['min'] = '';
                                d['max'] = '';
                                return d;
                            }
                        );
                        this.toolService.set_excluded_list(excluded);
                    }
                    
                    let { slate } = this.toolService.weekNSlate;
                    ['QB','WR','RB','TE','DST'].map(pos => {
                        let stored_data = localStorage.getItem(this.toolService.toolName + ' '+ slate+pos);
                        if(stored_data) {
                            stored_data = JSON.parse(stored_data);
                            if(stored_data[slate+pos].length > 0) {
                                stored_data[slate+pos].map(d => {
                                    d['min'] = '';
                                    d['max'] = '';
                                    return d;
                                });

                                localStorage.setItem(this.toolService.toolName + ' '+ slate+pos, JSON.stringify(stored_data));
                                // localStorage.setItem(slate+pos, JSON.stringify(stored_data));
                            }
                        }
                    });

                    let saved_pool_exposure_key = this.toolService.toolName + ' '+ slate + ' pool';
                    let stored_exposures = localStorage.getItem(saved_pool_exposure_key);

                    if(stored_exposures) localStorage.removeItem(saved_pool_exposure_key);
                }
            }
        );

        this.resetAllSubscription = this.toolService.resetAll.subscribe(
            async (res: boolean) => {
                if(res) {

                    this.hideTable = true;

                    this.filterPlayers = false;
                    this.showRangeFilter = ['ALL','FLEX'].indexOf(this.toolService.currentSelectedPos) === -1 ? true : false;                    
                    this.searchPlayer.nativeElement.value = '';
                    this.toolService.clear_exclude_array();

                    let { week, slate } = this.toolService.weekNSlate;
                    // console.log(week, slate);
                    let resposne: any = [];
                    
                    try{
                        resposne = await this.toolService.get_data(week, slate).toPromise();
                    } catch(e) {
                        this.hideTable = false;
                    }

                    if(resposne.length > 0) {
                        this.hideTable = false;
                        this.listData = resposne;

                        this.toolService.reset_player_n_exlude_arr();
                        this.toolService.set_players_list(this.listData);

                        this.toolService.filteredPlayerPool = this.listData;
                        this.listData = this.listData.map(d => {
                            d['min'] = '';
                            d['max'] = '';
                            d['ppd_color'] = this.getColor('PPD',d.PPD);
                            d['def_vs_pos_color'] = this.getColor('Def vs Pos',d['Def vs Pos']);
                            return d;
                        });

                        let data = this.listData.map(d => d.team);
                        this.fetchedTeam = data.sort().filter(function (item, pos, ary) {
                            return !pos || item != ary[pos - 1];
                        });
                        this.fetchedTeam.forEach(
                            (elem) => {
                                if ($('.' + elem)[0]) $('.' + elem)[0].style.filter = "";
                            }
                        );

                        this.rerender();
                        this.resetSlate();

                        // this.setup_range_sliders(this.listData);

                        let saved_pool_exposure_key = this.toolService.toolName + ' '+ this.currentSlate + ' pool';
                        let saved_pool_filters_key = this.toolService.toolName + ' '+ this.currentSlate + ' filters';
                        let stored_exposures = localStorage.getItem(saved_pool_exposure_key);
                        let stored_filters = localStorage.getItem(saved_pool_filters_key);

                        if(stored_exposures) localStorage.removeItem(saved_pool_exposure_key);
                        if(stored_filters) localStorage.removeItem(saved_pool_filters_key);
                        localStorage.removeItem(this.toolService.toolName + ' '+ this.currentSlate + ' pos');
                        localStorage.removeItem(this.toolService.toolName + ' '+ this.currentSlate + ' excluded');

                        ['QB','RB','WR','TE','DST'].map(pos => {
                            localStorage.removeItem(this.toolService.toolName + ' '+ slate+pos);
                        });
                    } else {
                        this.errorMessage = "Empty player pool returned";
                        this.emptyLineupError.show(); 
                    }
                }
            }
        )

        this.excludeAllSubscription = this.toolService.excludeAll.subscribe(
            (res: boolean) => {
                if (res) {
                    this.listData = this.toolService.exclude_all();
                    
                    let { slate } = this.toolService.weekNSlate;
                    let excluded = this.toolService.get_excluded_list();

                    // let stored_excluded = localStorage.getItem(this.toolService.toolName + ' '+ slate + ' excluded');
                    // if(stored_excluded) {

                    //     let available_excluded = JSON.parse(stored_excluded);
                    //     excluded = excluded.reduce((array,data) => {
                    //         let id = data.player.split('(')[1].replace(')','');
                    //         array.push(id);
                    //         return array;
                    //     },[]);

                    //     if(excluded.length > 0) {
                    //         available_excluded = available_excluded.concat(excluded);
                    //     }

                    //     localStorage.setItem(this.toolService.toolName + ' '+ slate + ' excluded', JSON.stringify(available_excluded));
                    //     // localStorage.setItem(slate + ' excluded', JSON.stringify(available_excluded));

                    // } else {
                        excluded = excluded.reduce((array,data) => {
                            let id = data.player.split('(')[1].replace(')','');
                            array.push(id);
                            return array;
                        },[]);

                        localStorage.setItem(this.toolService.toolName + ' '+ slate + ' excluded', JSON.stringify(excluded));
                        // localStorage.setItem(slate + ' excluded', JSON.stringify(excluded));
                    // }

                    this.toolService.filteredPlayerPool = [];
                    this.fetchedTeam.forEach(
                        (elem) => {
                            if ($('.' + elem)[0]) $('.' + elem)[0].style.filter = "grayscale(1)";
                        }
                    )

                    let saved_pool_filters_key = this.toolService.toolName + ' '+ this.currentSlate + ' filters';
                    let stored_filters = localStorage.getItem(saved_pool_filters_key);

                    if(stored_filters) localStorage.removeItem(saved_pool_filters_key);
                    
                    ['QB','RB','WR','TE','DST'].map(pos => {
                        localStorage.removeItem(this.toolService.toolName + ' '+ slate+pos);
                    });
                    this.rerender();
                    this.resetSlate();
                }
            }
        );

    }

    updateInputValue(event, key, index) {
        let value = event.target.value;
        let playerid;
        let position;
        this.listData[index][key] = value;

        let id = this.listData[index].player.split('(')[1].replace(')','');

        this.toolService.set_exposure(id,key,value);
        
        this.toolService.filteredPlayerPool = this.listData;
        // this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        //     if (key === 'min') dtInstance.cell({ row: index, column: 15 }).invalidate().draw();
        //     if (key === 'max') dtInstance.cell({ row: index, column: 16 }).invalidate().draw();
        // });

        let { slate } = this.toolService.weekNSlate;
        // functionality to store exposures of player pool
        // let saved_pool_exposure_key = slate + ' pool';
        let saved_pool_exposure_key = this.toolService.toolName + ' '+ slate + ' pool';
        let stored_exposures = localStorage.getItem(saved_pool_exposure_key);
        if(stored_exposures) {
            let player_id = this.listData[index].player.split('(')[1].replace(')','');
            playerid = player_id;
            position = this.listData[index].pos1;
            let exposures = JSON.parse(stored_exposures);
            let data = {};

            data['player_id'] = player_id;
            data[key] = value;

            let push_data = true;
            exposures.map(
                d => {
                    if(d.player_id === player_id) {
                        push_data = false;
                        d[key] = value;
                        return d;
                    }
                    return d;
                }
            );
            
            if(push_data)
                exposures.push(data);

            localStorage.setItem(saved_pool_exposure_key, JSON.stringify(exposures));

        } else {
            let player_id = this.listData[index].player.split('(')[1].replace(')','');
            playerid = player_id;
            position = this.listData[index].pos1;
            let exposures = [];
            let data = {};

            data['player_id'] = player_id;
            data[key] = value;

            exposures.push(data);

            localStorage.setItem(saved_pool_exposure_key, JSON.stringify(exposures));
        }

        let pos = position;
        let stored_filtered_data = localStorage.getItem(this.toolService.toolName + ' '+ slate+pos);
        if(stored_filtered_data) {
            stored_filtered_data = JSON.parse(stored_filtered_data);
            if(stored_filtered_data[slate+pos].length > 0) {
                let abc: any = stored_filtered_data[slate+pos];
                abc.map(d => {
                    let player_id = d.player.split('(')[1].replace(')','');
                    if(player_id === playerid) {
                        d[key] = value;
                        return d;
                    }
                    return d;
                });

                localStorage.setItem(this.toolService.toolName + ' '+ slate+pos,JSON.stringify(stored_filtered_data));
            }
        }
        
    }

    async updateSlate(week, slate) {
        if (this.toolService.get_excluded_list().length === 0) {
            this.hideTable = true;
            let resposne: any = [];

            try{ 
                resposne = await this.toolService.get_data(week, slate).toPromise();
            } catch(e) { this.hideTable = false; }

            if(resposne.length > 0) {

                this.listData = resposne;
                this.toolService.filteredPlayerPool = this.listData;
                this.currentSlate = this.toolService.weekNSlate.slate;
                if (this.listData.length !== 0) {
                    let row = this.listData[0];
                    this.headers = Object.keys(row);
                }
                this.lineupDataFromList = [];
                this.lineupCount = 0;

                let saved_pool_exposure_key = this.toolService.toolName + ' '+ this.currentSlate + ' pool';
                let stored_exposures = localStorage.getItem(saved_pool_exposure_key);
                let stored_exposures_array = [];
                let load_stored_exposures = false;

                if(stored_exposures && (JSON.parse(stored_exposures)).length > 0) {
                    load_stored_exposures = true;
                    stored_exposures_array = JSON.parse(stored_exposures);
                }

                this.listData.map(
                    d => {
                        d['ppd_color'] = this.getColor('PPD',d.PPD);
                        d['def_vs_pos_color'] = this.getColor('Def vs Pos',d['Def vs Pos']);
                        if(!load_stored_exposures) {
                            d['min'] = '';
                            d['max'] = '';
                        } else {
                            let player_id = d.player.split('(')[1].replace(')','');
                            let player_stored_exposure = stored_exposures_array.find(e => e.player_id === player_id);
                            if(player_stored_exposure) {
                                if(player_stored_exposure.min) d['min'] = player_stored_exposure.min;
                                if(player_stored_exposure.max) d['max'] = player_stored_exposure.max;
                            } else {
                                d['min'] = '';
                                d['max'] = '';
                            }
                        }
                        return d;
                    }
                );

                let data = this.listData.map(d => d.team);
                this.fetchedTeam = data.sort().filter(function (item, pos, ary) {
                    return !pos || item != ary[pos - 1];
                });

                let teamLogos = this.toolService.get_team_logos();
                let teamLogosWithStatus = [];
                teamLogos.map(
                    logo => {
                        let response = this.addGreyScale(logo);
                        let data = {};
                        data['logo'] = logo;
                        data['status'] = response;
                        teamLogosWithStatus.push(data);
                    }
                );
                if(teamLogosWithStatus.length > 0) {
                    this.teamLogos = teamLogosWithStatus;
                }

                this.listTempData = this.listData;
                if (this.listData.length !== 0) {
                    this.setup_range_sliders(this.listData);
                }
                this.toolService.reset_player_n_exlude_arr();
                this.toolService.set_players_list(this.listData);

                let excluded: any = localStorage.getItem(this.toolService.toolName + ' '+ slate + ' excluded');
                if(excluded) {
                    excluded = JSON.parse(excluded);

                    let excluded_players_data = [];
                    this.listData = this.listData.filter(d => {
                        let id = d.player.split('(')[1].replace(')',''); 
                        if(excluded.indexOf(id) === -1) {
                            return true;
                        } else {
                            excluded_players_data.push(d);
                            return false;
                        }
                    });
                    this.toolService.set_players_list(this.listData);
                    this.toolService.set_excluded_list(excluded_players_data);
                }

                if (this.dtElement.dtInstance) {
                    this.dtElement.dtInstance.then((dtinstance: DataTables.Api) => { dtinstance.destroy(); })
                }

                let pos = this.toolService.currentSelectedPos;
                if (pos === 'ALL') {

                    ['QB','WR','RB','TE','DST'].map(pos => {
                        let stored_data = localStorage.getItem(this.toolService.toolName + ' '+ slate+pos);
                        if(stored_data) {
                            stored_data = JSON.parse(stored_data);
                            if(stored_data[slate+pos].length > 0) {
                                this.listData = this.listData.filter(d => d.pos1 !== pos);
                                this.listData = this.listData.concat(stored_data[slate+pos]);
                            }
                        }
                    });
        
                } else if (pos === 'FLEX') {
                    
                    ['WR','RB','TE'].map(pos => {
                        let stored_data = localStorage.getItem(this.toolService.toolName + ' '+ slate+pos);
                        if(stored_data) {
                            stored_data = JSON.parse(stored_data);
                            if(stored_data[slate+pos].length > 0) {
                                this.listData = this.listData.filter(d => d.pos1 !== pos);
                                this.listData = this.listData.concat(stored_data[slate+pos]);
                            }
                        }
                    });
        
                    this.listData = this.listData.filter(
                        (d) => d.pos1 === 'RB' || d.pos1 === 'WR' || d.pos1 === 'TE'
                    );
                    
                }

                this.dtTrigger.next();

                if (pos !== 'ALL') {
                    if (pos === 'FLEX') {
                        this.listData = this.listData.filter(
                            (d) => d.pos1 === 'RB' || d.pos1 === 'WR' || d.pos1 === 'TE'
                        );
                    } else {
                        this.listData = this.listData.filter(
                            (d) => d.pos1 === pos
                        );
                    }
                }

                if(this.listData.length > 0) {
                    this.filter_players();
                }
                setTimeout(() => {
                    this.hideTable = false;
                }, 500);

                if (localStorage.getItem(this.toolService.toolName + ' '+ slate)) {
                    let storage_lineup = JSON.parse(localStorage.getItem(this.toolService.toolName + ' '+ slate));
                    this.lineupData = storage_lineup.lineup.lineup;
                    this.lineupDataFromList = storage_lineup.lineup.lineup_data;
                    let calculations: any = storage_lineup.lineup.lineup_cal;
                    this.remaining = calculations.remain;
                    this.remainingAvg = calculations.remainAvg;
                    this.lineupCount = calculations.count;
                    this.projected_points = calculations.point;

                    this.toolService.preserve_lineup(this.lineupData, this.lineupDataFromList, this.remaining, this.remainingAvg, this.projected_points, this.lineupCount);
                } else {
                    this.lineupData = this.toolService.get_default_lineup();
                }

                this.rerenderSlate()

            } else {
                this.errorMessage = "Empty player pool returned";
                this.emptyLineupError.show(); 
            }
        } else {
            this.listData = [];
            this.toolService.filteredPlayerPool = this.listData;
            let teamLogos = this.toolService.get_team_logos();
            let teamLogosWithStatus = [];
            teamLogos.map(
                logo => {
                    let response = this.addGreyScale(logo);
                    let data = {};
                    data['logo'] = logo;
                    data['status'] = response;
                    teamLogosWithStatus.push(data);
                }
            );
            if(teamLogosWithStatus.length > 0) {
                this.teamLogos = teamLogosWithStatus;
            }

            this.dtTrigger.next();
            this.lineupData = this.toolService.get_default_lineup();
            this.rerenderSlate()
        }
    }

    ngAfterViewInit() {
    }

    setPlayerPopup(data: any, index: number) {
        this.playerName = data.name;
        this.playerSalary = data.salary;
        this.selectedPlayer = data;
        this.selectedPlayerIndex = index;
        this.playerLog = [];
        this.gameLogLoader = true;
        this.playerPopup.show();

        this.toolService.player_game_log(this.playerName).subscribe(
            (res:any) => {
                this.gameLogLoader = false;
                if(res.length > 0 && res[0] !== "Player not found!") {
                    let original_headers = Object.keys(res[0]);
                    let headers = Object.keys(res[0]);
                    headers = headers.map(d => {
                        if(d.includes('_')) {
                            d = d.replace('_',' ');
                            return d;
                        }
                        return d;
                    });
                    
                    this.playerLog = [
                        {
                            head: headers,
                            orig_head: original_headers,
                            body: res
                        }
                    ];
                }
                
            },
            (err) => {
                this.gameLogLoader = false;
                console.log(err);
            }
        )
    }

    getTooltipContent(key) {

        if (key) {
            return this.toolService.tooltips[key];
        }
        return '';
    }

    setup_preservered_range() {
        let keys = ['proj_range', 'salary_range', 'ppd_range'];

        keys.forEach(
            k => {
                let instance = $('.' + k).data('ionRangeSlider');

                let options = {
                    min: this.toolService.filter_players[k]['min'],
                    from: this.toolService.filter_players[k]['from'],
                    max: this.toolService.filter_players[k]['max'],
                    to: this.toolService.filter_players[k]['to']
                }

                if (k === 'ppd_range') {
                    options['step'] = .01;
                }

                instance.update(options)
            }
        );

    }

    setup_range_sliders(data, reset: boolean = false) {
        let { slate } = this.toolService.weekNSlate;
        let pos = this.toolService.currentSelectedPos;
        let stored_filters = localStorage.getItem(this.toolService.toolName + ' '+ slate+' filters');
        localStorage.setItem(this.toolService.toolName + ' '+ slate+ ' pos', pos);

        if(pos !== 'ALL' && pos !== 'FLEX') {
            if(!stored_filters) {
                if(data.length > 0) {
                    let positions_data = {
                        QB: data.filter(d => d.pos1 === 'QB'),
                        RB: data.filter(d => d.pos1 === 'RB'),
                        WR: data.filter(d => d.pos1 === 'WR'),
                        TE: data.filter(d => d.pos1 === 'TE'),
                        DST: data.filter(d => d.pos1 === 'DST')
                    };

                    ['QB','RB','WR','TE','DST'].map(p => {
                        if(positions_data[p].length > 0) {
                            let proj_max = positions_data[p].reduce((max, d) => d.projected_pts > max ? d.projected_pts : max, positions_data[p][0].projected_pts);
                            let proj_min = positions_data[p].reduce((min, d) => d.projected_pts < min ? d.projected_pts : min, positions_data[p][0].projected_pts);
                            let salary_max = positions_data[p].reduce((max, d) => d.salary > max ? d.salary : max, positions_data[p][0].salary);
                            let salary_min = positions_data[p].reduce((min, d) => d.salary < min ? d.salary : min, positions_data[p][0].salary);
                            let ppd_max = positions_data[p].reduce((max, d) => d.PPD > max ? d.PPD : max, positions_data[p][0].PPD);
                            let ppd_min = positions_data[p].reduce((min, d) => d.PPD < min ? d.PPD : min, positions_data[p][0].PPD);
                            let con_max = positions_data[p].reduce((max, d) => d.Con > max ? d.Con : max, positions_data[p][0].Con);
                            let con_min = positions_data[p].reduce((min, d) => d.Con < min ? d.Con : min, positions_data[p][0].Con);
                            let def_max = positions_data[p].reduce((max, d) => d['Def vs Pos'] > max ? d['Def vs Pos'] : max, positions_data[p][0]['Def vs Pos']);
                            let def_min = positions_data[p].reduce((min, d) => d['Def vs Pos'] < min ? d['Def vs Pos'] : min, positions_data[p][0]['Def vs Pos']);

                            this.range_sliders_pos_wise[p].proj.min = proj_min;
                            this.range_sliders_pos_wise[p].proj.max = proj_max;
                            this.range_sliders_pos_wise[p].proj.from = proj_min;
                            this.range_sliders_pos_wise[p].proj.to = proj_max;
                            this.range_sliders_pos_wise[p].ppd.min = ppd_min;
                            this.range_sliders_pos_wise[p].ppd.max = ppd_max;
                            this.range_sliders_pos_wise[p].ppd.from = ppd_min;
                            this.range_sliders_pos_wise[p].ppd.to = ppd_max;
                            this.range_sliders_pos_wise[p].salary.min = salary_min;
                            this.range_sliders_pos_wise[p].salary.max = salary_max;
                            this.range_sliders_pos_wise[p].salary.from = salary_min;
                            this.range_sliders_pos_wise[p].salary.to = salary_max;
                            this.range_sliders_pos_wise[p].con.min = con_min;
                            this.range_sliders_pos_wise[p].con.max = con_max;
                            this.range_sliders_pos_wise[p].def_vs_pos.min = def_min;
                            this.range_sliders_pos_wise[p].def_vs_pos.max = def_max;
                            if(con_min !== con_max) {
                                this.range_sliders_pos_wise[p].con.from = con_min;
                                this.range_sliders_pos_wise[p].con.to = con_max;
                            } else {
                                this.range_sliders_pos_wise[p].con.from = 0;
                                this.range_sliders_pos_wise[p].con.to = con_max;
                            }
                            if(def_min !== def_max) {
                                this.range_sliders_pos_wise[p].def_vs_pos.from = def_min;
                                this.range_sliders_pos_wise[p].def_vs_pos.to = def_max;
                            } else {
                                this.range_sliders_pos_wise[p].def_vs_pos.from = 0;
                                this.range_sliders_pos_wise[p].def_vs_pos.to = def_max;
                            }
                        }
                    });

                    localStorage.setItem(this.toolService.toolName + ' '+ slate+' filters', JSON.stringify(this.range_sliders_pos_wise));

                    let range_for_pos = this.range_sliders_pos_wise[pos];
                    
                    let proj_instance = $('.proj_range').data('ionRangeSlider');
                    proj_instance.update({ min: range_for_pos.proj.min, from: range_for_pos.proj.min, max: range_for_pos.proj.max, to: range_for_pos.proj.max, step: .01 });
                    let salary_instance = $('.salary_range').data('ionRangeSlider');
                    salary_instance.update({ min: range_for_pos.salary.min, from: range_for_pos.salary.min, max: range_for_pos.salary.max, to: range_for_pos.salary.max });
                    let ppd_instance = $('.ppd_range').data('ionRangeSlider');
                    ppd_instance.update({ min: range_for_pos.ppd.min, from: range_for_pos.ppd.min, max: range_for_pos.ppd.max, to: range_for_pos.ppd.max, step: .01 });
                    let con_instance = $('.consistency_range').data('ionRangeSlider');
                    if(range_for_pos.con.min !== range_for_pos.con.max){
                        con_instance.update({ min: range_for_pos.con.min, from: range_for_pos.con.min, max: range_for_pos.con.max, to: range_for_pos.con.max, step: .01 });
                    } else {
                        con_instance.update({ min: 0, from: 0, max: range_for_pos.con.max, to: range_for_pos.con.max, step: .01 });
                    }
                    let def_instance = $('.defvspos_range').data('ionRangeSlider');
                    if(range_for_pos.def_vs_pos.min !== range_for_pos.def_vs_pos.max) {
                        def_instance.update({ min: range_for_pos.def_vs_pos.min, from: range_for_pos.def_vs_pos.min, max: range_for_pos.def_vs_pos.max, to: range_for_pos.def_vs_pos.max, step: .01 });
                    } else {
                        def_instance.update({ min: 0, from: 0, max: range_for_pos.def_vs_pos.max, to: range_for_pos.def_vs_pos.max, step: .01 });
                    }
                }
            } else {
        
                let filters = JSON.parse(stored_filters);
                this.range_sliders_pos_wise = filters;
                let pos_filters = filters[pos];

                if(!reset) {
                    this.range_sliders_pos_wise[pos].proj.min = pos_filters.proj.min;
                    this.range_sliders_pos_wise[pos].proj.max = pos_filters.proj.max;
                    this.range_sliders_pos_wise[pos].ppd.min = pos_filters.ppd.min;
                    this.range_sliders_pos_wise[pos].ppd.max = pos_filters.ppd.max;
                    this.range_sliders_pos_wise[pos].salary.min = pos_filters.salary.min;
                    this.range_sliders_pos_wise[pos].salary.max = pos_filters.salary.max;
                    this.range_sliders_pos_wise[pos].con.min = pos_filters.con.min;
                    this.range_sliders_pos_wise[pos].con.max = pos_filters.con.max;
                    this.range_sliders_pos_wise[pos].def_vs_pos.min = pos_filters.def_vs_pos.min;
                    this.range_sliders_pos_wise[pos].def_vs_pos.max = pos_filters.def_vs_pos.max;
                    
                    let proj_instance = $('.proj_range').data('ionRangeSlider');
                    proj_instance.update({ min: pos_filters.proj.min, from: pos_filters.proj.from, max: pos_filters.proj.max, to: pos_filters.proj.to, step: .01 });
                    let salary_instance = $('.salary_range').data('ionRangeSlider');
                    salary_instance.update({ min: pos_filters.salary.min, from: pos_filters.salary.from, max: pos_filters.salary.max, to: pos_filters.salary.to });
                    let ppd_instance = $('.ppd_range').data('ionRangeSlider');
                    ppd_instance.update({ min: pos_filters.ppd.min, from: pos_filters.ppd.from, max: pos_filters.ppd.max, to: pos_filters.ppd.to, step: .01 });
                    let con_instance = $('.consistency_range').data('ionRangeSlider');
                    if(pos_filters.con.min !== pos_filters.con.max){
                        con_instance.update({ min: pos_filters.con.min, from: pos_filters.con.from, max: pos_filters.con.max, to: pos_filters.con.to, step: .01 });
                    } else {
                        con_instance.update({ min: 0, from: pos_filters.con.from, max: pos_filters.con.max, to: pos_filters.con.to, step: .01 });
                    }
                    let def_instance = $('.defvspos_range').data('ionRangeSlider');
                    if(pos_filters.def_vs_pos.min !== pos_filters.def_vs_pos.max) {
                        def_instance.update({ min: pos_filters.def_vs_pos.min, from: pos_filters.def_vs_pos.from, max: pos_filters.def_vs_pos.max, to: pos_filters.def_vs_pos.max, step: .01 });
                    } else {
                        def_instance.update({ min: 0, from: pos_filters.def_vs_pos.from, max: pos_filters.def_vs_pos.max, to: pos_filters.def_vs_pos.to, step: .01 });
                    }
                } else {
                    this.range_sliders_pos_wise[pos].proj.from = pos_filters.proj.min;
                    this.range_sliders_pos_wise[pos].proj.to = pos_filters.proj.max;
                    this.range_sliders_pos_wise[pos].ppd.from = pos_filters.ppd.min;
                    this.range_sliders_pos_wise[pos].ppd.to = pos_filters.ppd.max;
                    this.range_sliders_pos_wise[pos].salary.from = pos_filters.salary.min;
                    this.range_sliders_pos_wise[pos].salary.to = pos_filters.salary.max;
                    this.range_sliders_pos_wise[pos].con.from = pos_filters.con.min;
                    this.range_sliders_pos_wise[pos].con.to = pos_filters.con.max;
                    this.range_sliders_pos_wise[pos].def_vs_pos.from = pos_filters.def_vs_pos.min;
                    this.range_sliders_pos_wise[pos].def_vs_pos.to = pos_filters.def_vs_pos.max;

                    let proj_instance = $('.proj_range').data('ionRangeSlider');
                    proj_instance.update({ min: pos_filters.proj.min, from: pos_filters.proj.from, max: pos_filters.proj.max, to: pos_filters.proj.to, step: .01 });
                    let salary_instance = $('.salary_range').data('ionRangeSlider');
                    salary_instance.update({ min: pos_filters.salary.min, from: pos_filters.salary.from, max: pos_filters.salary.max, to: pos_filters.salary.to });
                    let ppd_instance = $('.ppd_range').data('ionRangeSlider');
                    ppd_instance.update({ min: pos_filters.ppd.min, from: pos_filters.ppd.from, max: pos_filters.ppd.max, to: pos_filters.ppd.to, step: .01 });
                    let con_instance = $('.consistency_range').data('ionRangeSlider');
                    if(pos_filters.con.min !== pos_filters.con.max){
                        con_instance.update({ min: pos_filters.con.min, from: pos_filters.con.from, max: pos_filters.con.max, to: pos_filters.con.to, step: .01 });
                    } else {
                        con_instance.update({ min: 0, from: 0, max: pos_filters.con.max, to: pos_filters.con.to, step: .01 });
                    }
                    let def_instance = $('.defvspos_range').data('ionRangeSlider');
                    if(pos_filters.def_vs_pos.min !== pos_filters.def_vs_pos.max) {
                        def_instance.update({ min: pos_filters.def_vs_pos.min, from: pos_filters.def_vs_pos.from, max: pos_filters.def_vs_pos.max, to: pos_filters.def_vs_pos.max, step: .01 });
                    } else {
                        def_instance.update({ min: 0, from: 0, max: pos_filters.def_vs_pos.max, to: pos_filters.def_vs_pos.to, step: .01 });
                    }
                }
            }
        }
    }

    filter_players(db_slate: string = '') {

        let slate = '';
        if(db_slate !== '') {
            slate = db_slate;
        } else {
            slate = this.toolService.weekNSlate.slate;
        }

        let pos = this.toolService.currentSelectedPos;
        // flag to avoid applying filters
        let filters_flag = 0;

        if(pos !== 'ALL' && pos !== 'FLEX') {
            // let data = this.toolService.get_players_list(); // this is everyone again...why?
            let data = this.listData;
            let stored_filters = localStorage.getItem(this.toolService.toolName + ' '+ slate+ ' filters');
            if(stored_filters) {
                let filters = JSON.parse(stored_filters);
                this.range_sliders_pos_wise = filters;
                let stop_filters = Object.keys(filters[pos]);
                stop_filters = stop_filters.filter(f => f!== 'def_vs_pos' && f!== 'con');
                
                for(let f of stop_filters) {
                    let min = filters[pos][f].min;
                    let max = filters[pos][f].max;
                    if((min !== 0 && max !== 100)) {
                        filters_flag = 1;
                    }

                    if(min === max) {
                        filters_flag = 0;
                    }
                }

            }
            
            let proj_range = $('.proj_range')[0].value;
            let p_min = proj_range.split(';')[0];
            let p_max = proj_range.split(';')[1];

            let salary_range = $('.salary_range')[0].value;
            let s_min = salary_range.split(';')[0];
            let s_max = salary_range.split(';')[1];

            let ppd_range = $('.ppd_range')[0].value;
            let ppd_min = ppd_range.split(';')[0];
            let ppd_max = ppd_range.split(';')[1];

            let c_range = $('.consistency_range')[0].value;
            let c_min = c_range.split(';')[0];
            let c_max = c_range.split(';')[1];

            let def_range = $('.defvspos_range')[0].value;
            let def_min = def_range.split(';')[0];
            let def_max = def_range.split(';')[1];

            let filtered_data = [];
            let new_data = [];

            new_data = data.filter(
                (d) => d.pos1 === pos
            );
            
            let pos_data_length = new_data.length;
            
            if(filters_flag) {
                // console.log('applying filters');
                new_data.map(
                    (d) => {
                        let salary = d.salary;
                        let proj = d.projected_pts;
                        let ppd = d.PPD;
                        let dfvspos = d['Def vs Pos'];
                        let con = +d.Con;                
                        if ((salary >= parseInt(s_min) && salary <= parseInt(s_max)) && (proj >= parseFloat(p_min) && proj <= parseFloat(p_max)) && (ppd >= parseFloat(ppd_min) && ppd <= parseFloat(ppd_max)) && (dfvspos >= parseFloat(def_min) && dfvspos <= parseFloat(def_max) && (con >= parseFloat(c_min) && con <= parseFloat(c_max)))) {
                            // console.log('salary: ',salary,parseInt(s_max),'proj: ',proj,parseFloat(p_max),'ppd: ',ppd,parseFloat(ppd_max))
                            filtered_data.push(d);
                        }

                    }
                );
            }

            this.filterPlayers = false;

            if(filtered_data.length > 0) {
                // console.log('filtered')
                this.listData = filtered_data;
                
                if(pos_data_length !== filtered_data.length) {
                    let data_to_store = {};
                    data_to_store[this.currentSlate + pos] = filtered_data;
                    localStorage.setItem(this.toolService.toolName + ' '+ this.currentSlate + pos, JSON.stringify(data_to_store));
                }
                // this.toolService.setFilteredPlayerPoolPosData(filtered_data, pos);
                // this.toolService.filteredPlayerPoolPos[this.currentSlate][pos] = filtered_data;
            } else {
                if(filters_flag) {
                    this.listData = [];
                }
            }

            // console.log('filtered-----------',this.listData)

            let searchValue = this.searchPlayer.nativeElement.value.toLowerCase();

            if (searchValue) {
                this.listData = this.listData.filter(
                    (d) => d.name.toLowerCase().includes(searchValue)
                );
            }

            this.toolService.filteredPlayerPool = this.listData;
            
            this.range_sliders_pos_wise[pos].proj.from = p_min;
            this.range_sliders_pos_wise[pos].proj.to = p_max;
            this.range_sliders_pos_wise[pos].ppd.from = ppd_min;
            this.range_sliders_pos_wise[pos].ppd.to = ppd_max;
            this.range_sliders_pos_wise[pos].salary.from = s_min;
            this.range_sliders_pos_wise[pos].salary.to = s_max;
            this.range_sliders_pos_wise[pos].con.from = c_min;
            this.range_sliders_pos_wise[pos].con.to = c_max;
            this.range_sliders_pos_wise[pos].def_vs_pos.from = def_min;
            this.range_sliders_pos_wise[pos].def_vs_pos.to = def_max;

            localStorage.setItem(this.toolService.toolName + ' '+ slate+' filters', JSON.stringify(this.range_sliders_pos_wise));
        }

        this.rerender();
    }

    resetPlayersFilter() {
        localStorage.removeItem(this.toolService.toolName + ' '+ this.currentSlate + this.toolService.currentSelectedPos);
        this.setup_range_sliders(this.toolService.get_players_list(), true);
        this.filter_players()
    }

    excludeTeam(team_name) {

        if ($('.' + team_name)[0].style.filter !== "") {
            let data = this.toolService.include_by_team_name(team_name);
            if (data.length > 0) {
                $('.' + team_name)[0].style.filter = "";
                this.listData = data;
                let { slate } = this.toolService.weekNSlate;
                let excluded = this.toolService.get_excluded_list();

                excluded = excluded.reduce((array,data) => {
                    let id = data.player.split('(')[1].replace(')','');
                    array.push(id);
                    return array;
                },[]);
                localStorage.setItem(this.toolService.toolName + ' '+ slate + ' excluded', JSON.stringify(excluded));

                let proj_range = $('.proj_range')[0].value;
                let p_min = proj_range.split(';')[0];
                let p_max = proj_range.split(';')[1];

                let salary_range = $('.salary_range')[0].value;
                let s_min = salary_range.split(';')[0];
                let s_max = salary_range.split(';')[1];

                let ppd_range = $('.ppd_range')[0].value;
                let ppd_min = ppd_range.split(';')[0];
                let ppd_max = ppd_range.split(';')[1];

                let filtered_data = [];

                this.listData.forEach(
                    (d) => {
                        let salary = d.salary;
                        let proj = d.projected_pts;
                        let ppd = d.PPD;

                        if ((salary >= parseInt(s_min) && salary <= parseInt(s_max)) && (proj >= parseInt(p_min) && proj <= p_max) && (ppd >= parseInt(ppd_min) && ppd <= ppd_max)) {
                            filtered_data.push(d);
                        }

                    }
                );
                
                if(filtered_data.length > 0) {
                    this.listData = filtered_data;
                }

                let pos = this.toolService.currentSelectedPos;
                if (pos !== 'ALL') {
                    if (pos === 'FLEX') {
                        this.listData = this.listData.filter(
                            (d) => d.pos1 === 'RB' || d.pos1 === 'WR' || d.pos1 === 'TE'
                        );
                    } else {
                        this.listData = this.listData.filter(
                            (d) => d.pos1 === pos
                        );
                    }
                }

                let searchValue = this.searchPlayer.nativeElement.value;

                if (searchValue) {
                    this.listData = this.listData.filter(
                        (d) => d.name.toLowerCase().includes(searchValue)
                    );
                }

                this.toolService.filteredPlayerPool = this.listData;
                this.rerender();
            } else {
                this.errorMessage = 'No data available for ' + team_name + ' in player pool';
                this.emptyLineupError.show();
            }
        } else {
            $('.' + team_name)[0].style.filter = "grayscale(1)";
            this.listData = this.toolService.exclude_by_team_name(team_name);
            let { slate } = this.toolService.weekNSlate;
            let excluded = this.toolService.get_excluded_list();

            excluded = excluded.reduce((array,data) => {
                let id = data.player.split('(')[1].replace(')','');
                array.push(id);
                return array;
            },[]);
            localStorage.setItem(this.toolService.toolName + ' '+ slate + ' excluded', JSON.stringify(excluded));
            
            this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
                dtInstance.rows('.' + team_name).remove().draw(false);
            });

            let proj_range = $('.proj_range')[0].value;
            let p_min = proj_range.split(';')[0];
            let p_max = proj_range.split(';')[1];

            let salary_range = $('.salary_range')[0].value;
            let s_min = salary_range.split(';')[0];
            let s_max = salary_range.split(';')[1];

            let ppd_range = $('.ppd_range')[0].value;
            let ppd_min = ppd_range.split(';')[0];
            let ppd_max = ppd_range.split(';')[1];

            let filtered_data = [];

            this.listData.forEach(
                (d) => {
                    let salary = d.salary;
                    let proj = d.projected_pts;
                    let ppd = d.PPD;

                    if ((salary >= parseInt(s_min) && salary <= parseInt(s_max)) && (proj >= parseInt(p_min) && proj <= p_max) && (ppd >= parseInt(ppd_min) && ppd <= ppd_max)) {
                        filtered_data.push(d);
                    }

                }
            );
            
            if(filtered_data.length > 0) {
                this.listData = filtered_data;
            }

            let pos = this.toolService.currentSelectedPos;
            if (pos !== 'ALL') {
                if (pos === 'FLEX') {
                    this.listData = this.listData.filter(
                        (d) => d.pos1 === 'RB' || d.pos1 === 'WR' || d.pos1 === 'TE'
                    );
                } else {
                    this.listData = this.listData.filter(
                        (d) => d.pos1 === pos
                    );
                }
            }

            let searchValue = this.searchPlayer.nativeElement.value;

            if (searchValue) {
                this.listData = this.listData.filter(
                    (d) => d.name.toLowerCase().includes(searchValue)
                );
            }
            this.toolService.filteredPlayerPool = this.listData;
            this.rerender();

            if (this.lineupDataFromList.length > 0) {
                this.lineupDataFromList = this.lineupDataFromList.filter(d => d.team !== team_name);
            }

            let line_up_rows = this.lineupData.filter(d => d.name != '');

            line_up_rows.forEach(
                (elem) => {
                    let find = this.listData.findIndex(d => d.name === elem.name);
                    if (find === -1) {
                        this.lineupData.map(
                            (d) => {
                                let nd = d;

                                if (nd.name !== "" && nd.name === elem.name) {
                                    this.lineupCount = this.lineupCount - 1;
                                    this.remaining = this.remaining + elem.salary;
                                    this.remainingAvg = this.remaining / (9 - this.lineupCount);
                                    this.projected_points = this.projected_points - elem.projected_pts;

                                    nd.name = '';
                                    nd.salary = '';
                                    nd.projected_pts = '';
                                }
                                return nd;
                            }
                        )
                    }
                }
            );
            // remove row from lineupdatafromlist
            this.toolService.preserve_lineup(this.lineupData, this.lineupDataFromList, this.remaining, this.remainingAvg, this.projected_points, this.lineupCount);
        }
    }

    addGreyScale(logo) {
        if (this.fetchedTeam.indexOf(logo) === -1) {
            return { 'filter': 'grayscale(1)' };
        } else {
            return {};
        }
    }

    edit_min_max(index, key) {
        $('.' + key + '_' + index).css('display', 'none');
        $('.' + key + '_input_' + index).css('display', 'block');
        $('.' + key + '_input_' + index).focus();
    }

    save_min_or_max(event, key, old_value, index) {
        $('.' + key + '_' + index).css('display', 'block');
        $('.' + key + '_input_' + index).css('display', 'none');

        let value = event.target.value;

        if (value !== old_value) {
            this.listData[index][key] = value;
            this.toolService.filteredPlayerPool = this.listData;

            this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
                setTimeout(() => {
                    dtInstance.cell('.' + key + '_col_' + index).invalidate().draw();
                }, 100);
            });
        }
    }

    enable_edit(index) {
        $('.proj_' + index).css('display', 'none');
        $('.edit_' + index).css('display', 'block');
        $('.edit_' + index).focus();
    }

    disable_edit(index) {
        // todos: change range filter on change of projetion and ppd

        $('.proj_' + index).css('display', 'block');
        $('.edit_' + index).css('display', 'none');

        let value = $('.edit_' + index).val();
        let { salary, projected_pts, name } = this.listData[index];

        if (value !== String(projected_pts) && !isNaN(value)) {
            let playerid = this.listData[index].player.split('(')[1].replace(')','');
            let new_PPD = (value) / (salary / 1000);
            new_PPD = Math.round(new_PPD * 100) / 100;

            this.listData[index].projected_pts = value;
            this.listData[index].PPD = new_PPD;

            this.toolService.filteredPlayerPool = this.listData;

            this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
                setTimeout(() => {
                    dtInstance.cell('.fp_avg_' + index).invalidate().draw(false);
                    dtInstance.cell('.proj_col_' + index).invalidate().draw(false);
                    dtInstance.cell('.ppd_' + index).invalidate().draw(false);
                }, 100);
            });

            let find_row_on_lineup = this.lineupData.findIndex(d => d.name === name && d.projected_pts === projected_pts);
            if (find_row_on_lineup > -1) {
                this.lineupData[find_row_on_lineup].projected_pts = value;
            }

            let pos = this.toolService.currentSelectedPos;
            let { slate } = this.toolService.weekNSlate; 
            let stored_filtered_data = localStorage.getItem(this.toolService.toolName + ' '+ slate+pos);
            if(stored_filtered_data) {
                stored_filtered_data = JSON.parse(stored_filtered_data);
                if(stored_filtered_data[slate+pos].length > 0) {
                    let abc: any = stored_filtered_data[slate+pos];
                    abc.map(d => {
                        let player_id = d.player.split('(')[1].replace(')','');
                        if(player_id === playerid) {
                            d['PPD'] = new_PPD;
                            d['projected_pts'] = value;
                            return d;
                        }
                        return d;
                    });

                    localStorage.setItem(this.toolService.toolName + ' '+ slate+pos,JSON.stringify(stored_filtered_data));
                }
            }
        } else if(isNaN(value)){
            $('.edit_'+index).val(projected_pts);
            this.errorMessage = 'Provided Proj. is not a number.';
            this.emptyLineupError.show();
        }
    }

    optimizeLineup() {

        let count = 0;
        this.lineupData.forEach(elem => {
            if (elem.name !== '') {
                count = count + 1;
            }
        });

        let decide = count >= 2 ? true : false;

        if (decide) {
            this.optimizeInProcess = true;
            this.toolService.optimize(this.lineupDataFromList).subscribe(
                (res: any) => {
                    this.optimizeInProcess = false;
                    let optimized_lineup = res[1];
                    if (optimized_lineup.length === 9) {

                        let line_up_names = optimized_lineup.map(d => d.name);
                        let lineupData = [];

                        line_up_names.forEach(
                            name => {
                                let data = this.toolService.get_players_list().filter(d => d.name === name);
                                if (data.length !== 0) {
                                    lineupData.push(data[0]);
                                }
                            }
                        );

                        let dataForLineUp = JSON.parse(JSON.stringify(lineupData));
                        this.lineupData = dataForLineUp.map(
                            (d, i) => {
                                if (i === 7) {
                                    d.pos1 = 'FLEX';
                                    return d;
                                }
                                return d;
                            }
                        );

                        this.lineupDataFromList = lineupData;

                        this.rerenderSlate();
                        this.resetRemainAndRemainAvg();
                        this.lineupData.forEach(elem => {
                            this.projected_points = (+this.projected_points) + (+elem.projected_pts);
                            this.remaining = (+this.remaining) - (+elem.salary);
                        });

                        this.remainingAvg = this.remaining;
                        this.toolService.preserve_lineup(this.lineupData, this.lineupDataFromList, this.remaining, this.remainingAvg, this.projected_points, 9);
                        // ----------------
                        let slate_data = {}
                        slate_data['name'] = this.currentSlate;
                        slate_data['lineup'] = this.toolService.get_preserved_lineup();
                        localStorage.setItem(this.toolService.toolName + ' '+ this.currentSlate,JSON.stringify(slate_data));
                        // ----------------
                    } else {
                        this.errorMessage = "Empty lineup returned";
                        this.emptyLineupError.show();
                    }
                },
                (err) => {
                    this.optimizeInProcess = false;
                    this.errorMessage = err.error.error[0];
                    this.emptyLineupError.show();
                }
            );
        } else {
            this.errorMessage = 'Please Lock at least 2 Players!';
            this.emptyLineupError.show();
        }
    }

    onFileSelect(event) {
        let file = event.target.files[0];

        if (file.name.includes('csv')) {
            this.inputFieldText = file.name;
            this.papa.parse(file, {
                header: true,
                complete: (result) => {
                    let response = result.data;
                    response.splice(response.length - 1, 1)
                    let file_headers = Object.keys(response[0]);

                    let slate = response[0].slate;
                    let week = response[0].game;
                    this.currentSlate = slate;

                    this.toolService.slatePickedFromCsv.emit({week,slate});

                    let required_headers = this.headers;
                    let def_vs_pos_color_index = required_headers.indexOf('def_vs_pos_color');
                    let ppd_color_index = required_headers.indexOf('ppd_color');
                    
                    if(def_vs_pos_color_index > -1) { required_headers.splice(def_vs_pos_color_index,1); }
                    if(ppd_color_index > -1) { required_headers.splice(ppd_color_index,1); }
                    
                    let min_index = required_headers.indexOf('min');
                    let max_index = required_headers.indexOf('max');

                    if(min_index === -1) { required_headers.push('min'); }
                    if(max_index === -1) { required_headers.push('max'); }
                    
                    let decide = (JSON.stringify(required_headers.sort()) === JSON.stringify(file_headers.sort())) ? true : false;
                    if (decide) {
                        this.listData = response;
                        
                        this.listData.map(
                            data => {
                                let new_PPD = (data.projected_pts) / (data.salary / 1000);
                                new_PPD = Math.round(new_PPD * 100) / 100;
                                data.PPD = new_PPD;

                                return data;
                            }
                        );
                        
                        this.listData.map(
                            d => {
                                d['ppd_color'] = this.getColor('PPD',d.PPD);
                                d['def_vs_pos_color'] = this.getColor('Def vs Pos',d['Def vs Pos']);
                                return d;
                            }
                        );
                        let data = this.listData.map(d => d.team);
                        this.fetchedTeam = data.sort().filter(function (item, pos, ary) {
                            return !pos || item != ary[pos - 1];
                        });
                        let teamLogos = this.toolService.get_team_logos();
                        let teamLogosWithStatus = [];
                        teamLogos.map(
                            logo => {
                                let response = this.addGreyScale(logo);
                                let data = {};
                                data['logo'] = logo;
                                data['status'] = response;
                                teamLogosWithStatus.push(data);
                            }
                        );
                        if(teamLogosWithStatus.length > 0) {
                            this.teamLogos = teamLogosWithStatus;
                        }
                        this.toolService.set_players_list(this.listData);
                        this.setup_range_sliders(this.listData);

                        let pos = this.toolService.currentSelectedPos;
                        if (pos !== 'ALL') {
                            if (pos === 'FLEX') {
                                this.listData = this.listData.filter(
                                    (d) => d.pos1 === 'RB' || d.pos1 === 'WR' || d.pos1 === 'TE'
                                );
                            } else {
                                this.listData = this.listData.filter(
                                    (d) => d.pos1 === pos
                                );
                            }
                        }

                        this.toolService.filteredPlayerPool = this.listData;
                        this.rerender();
                        this.resetSlate();
                    } else {
                        this.errorMessage = 'Provided file has invalid data';
                        this.inputFieldText = 'Choose file';
                        this.emptyLineupError.show();
                    }
                }
            });
        } else {
            this.errorMessage = 'Only Csv files are allowed!';
            this.emptyLineupError.show();
        }

        if(this.csvfile) {
            this.csvfile.nativeElement.value = '';
        }
    }

    downloadSlate() {
        if (this.listData.length > 0) {
           
            // let headers = ['player','game','pos1','name','team','salary','projected_pts','floor','ceiling','site','slate','OPP','PPD','time','Def vs Pos','TT','Con','FP Avg','Own','min','max'];
            
            let options = {
                fieldSeparator: ',',
                headers: []
            }

            let csvName = "Report_" + new Date().getTime();
            let csvData = this.toolService.downloadSlateData().map(({ppd_color,def_vs_pos_color,...list}) => list);
            
            // Dynamically get headers but data will not be in the same format on changing the number of headers in the backend
            let data_headers = Object.keys(csvData[0]);
            options.headers = data_headers;

            new ngxCsv(csvData, csvName, options);
        } else {
            this.errorMessage = "Player pool is empty";
            this.emptyLineupError.show();
        }
    }

    init_playerpool() {
        if(this.authService.isUserLoggedIn()) {
            this.playerPoolPopup.show();
        } else {
            
            this.errorMessage = 'Please login to view saved player pools.';
            this.emptyLineupError.show();
        }
    }

    init_savePlayerpool() {
        if(this.authService.isUserLoggedIn()) {
            this.initSavePoolPopup.show();
        } else {
            
            this.errorMessage = 'Please login to save player pool.';
            this.emptyLineupError.show();
        }
    }

    async savePlayerpool() {
        if(this.poolName.nativeElement.value !== '') {
            this.savePoolLoader = true;
            this.savePoolErrMsg = '';
            let saved_players_count = 0;
            let saved_players:any;
            try{
                saved_players = await this.toolService.get_player_pool(1).toPromise();
                if(typeof saved_players.result !== 'string') {
                    saved_players_count = saved_players.result.length;
                }
            } catch(e) {}
            
            if(this.toolService.get_players_list().length > 0 && saved_players_count < 5) {
                
                let data_to_store = {
                    player_pool: this.toolService.get_players_list(),
                    slate: this.currentSlate,
                    lineup: this.toolService.get_preserved_lineup(),
                    pos: this.toolService.currentSelectedPos
                }

                let { slate } = this.toolService.weekNSlate;
                let stored_filters_key = this.toolService.toolName + ' '+ slate+ ' filters';
                let stored_filters = localStorage.getItem(stored_filters_key);
                if(stored_filters) {
                    data_to_store['range_filters'] = JSON.parse(stored_filters);
                }

                if(this.toolService.get_excluded_list().length > 0) {
                    data_to_store['excluded'] = this.toolService.get_excluded_list();
                }

                console.log(this.toolService.toolId);
                let data = {
                    tool_id: this.toolService.toolId,
                    json_object: JSON.stringify(data_to_store),
                    name: this.poolName.nativeElement.value
                }

                this.toolService.save_player_pool(data).subscribe(
                    (res: any) => {
                        
                        if(res.meta.code === 200) {
                            this.savePoolLoader = false;
                            this.successMessage = 'Player pool has been saved';
                            this.poolName.nativeElement.value = '';
                        } else {
                            this.savePoolLoader = false;
                        }
                    },
                    (err) => {
                        
                        this.savePoolLoader = false;

                        if(err.error.message === 'Unauthenticated.') {
                            this.authService.logoutEvent.emit(true);
                            localStorage.removeItem('data');
                            this.savePoolErrMsg = 'Your token has been expired. Please login again.';
                        } else {
                            this.savePoolErrMsg = err.error.message;
                        }

                    }
                );
            } else {
                this.savePoolLoader = false;
                this.savePoolErrMsg = 'Either player pool is empty or save limit reached.';
            }
        } else {
            this.savePoolLoader = false;
            this.savePoolErrMsg = 'Enter Name to save player pool';
        }
    }

    saveSelectedPool(id: number, name: string) {
        this.selected_player_pool_id = id;
        this.selected_player_pool = name;
    }

    deleteSelectedPool(tool_log_id: number) {
        this.toolService.delete_player_pool({tool_log_id}).subscribe(
            (res: any) => {
                if(res.meta.code === 200) {
                    this.savedPool = this.savedPool.filter(d => d.tool_log_id !== tool_log_id);
                } else {
                    console.log(res.meta.message);
                }
            },
            (err) => {

            }
        );
    }

    load_selected_pool() {
        if(this.selected_player_pool) {
            let pool_data = this.savedPool.find(d => d.tool_log_id === this.selected_player_pool_id);
            this.hideTable = true;

            let stored_data = JSON.parse(pool_data.json_object);
            
            this.listData = stored_data.player_pool;
            let data = this.listData.map(d => d.team);
            this.fetchedTeam = data.sort().filter(function (item, pos, ary) {
                return !pos || item != ary[pos - 1];
            });

            let teamLogos = this.toolService.get_team_logos();
            let teamLogosWithStatus = [];
            teamLogos.map(
                logo => {
                    let response = this.addGreyScale(logo);
                    let data = {};
                    data['logo'] = logo;
                    data['status'] = response;
                    teamLogosWithStatus.push(data);
                }
            );
            if(teamLogosWithStatus.length > 0) {
                this.teamLogos = teamLogosWithStatus;
            }

            this.toolService.set_players_list(this.listData);

            if(stored_data.excluded && stored_data.excluded.length > 0) {
                this.toolService.set_excluded_list(stored_data.excluded);
            }

            if(stored_data.pos && stored_data.pos !== 'ALL') {
                this.toolService.setPos.emit(stored_data.pos);
                this.toolService.currentSelectedPos = stored_data.pos;
                localStorage.setItem(this.toolService.toolName + ' '+ stored_data.slate + ' pos', stored_data.pos);
                this.showRangeFilter = ['ALL','FLEX'].indexOf(stored_data.pos) === -1 ? true : false;
            }

            this.lineupDataFromList = [];
            this.lineupCount = 0;
            this.listTempData = this.listData;
            if (this.listData.length !== 0) {
                let row = this.listData[0];
                this.headers = Object.keys(row);

                let slate = this.listData[0].slate;
                let week = this.listData[0].game;
                this.currentSlate = slate;
                this.toolService.slatePickedFromCsv.emit({week,slate});
                localStorage.setItem(this.toolService.toolName + ' slate', slate);

                if(stored_data.range_filters) {
                    localStorage.setItem(this.toolService.toolName + ' '+ stored_data.slate + ' filters', JSON.stringify(stored_data.range_filters));
                    
                    this.setup_range_sliders(this.listData);
                    this.filter_players(slate);
                }

            }

            // if (this.dtElement.dtInstance) {
            //     this.dtElement.dtInstance.then((dtinstance: DataTables.Api) => { dtinstance.destroy(); })
            // }

            // this.dtTrigger.next();

            let pos = this.toolService.currentSelectedPos;
            if (pos !== 'ALL') {
                if (pos === 'FLEX') {
                    this.listData = this.listData.filter(
                        (d) => d.pos1 === 'RB' || d.pos1 === 'WR' || d.pos1 === 'TE'
                    );
                } else {
                    this.listData = this.listData.filter(
                        (d) => d.pos1 === pos
                    );
                }
            }

            setTimeout(() => {
                this.hideTable = false;
            }, 500);
            
            if (stored_data.lineup.lineup.length !== 0) {
                this.lineupData = stored_data.lineup.lineup;
                this.lineupDataFromList = stored_data.lineup.lineup_data;
                let calculations: any = stored_data.lineup.lineup_cal;
                this.remaining = calculations.remain;
                this.remainingAvg = calculations.remainAvg;
                this.lineupCount = calculations.count;
                this.projected_points = calculations.point;

                this.toolService.preserve_lineup(this.lineupData, this.lineupDataFromList, this.remaining, this.remainingAvg, this.projected_points, this.lineupCount);
            } else {
                this.lineupData = this.toolService.get_default_lineup();
            }

            this.rerenderSlate()

            this.playerPoolPopup.hide();
        }
    }

    fetchPlayerpool() {
        this.savePoolLoader = true;
        this.toolService.get_player_pool(this.toolService.toolId).subscribe(
            (res: any) => {
                if(res.meta.code === 200) {
                    this.savePoolLoader = false;
                    if(typeof res.result !== 'string') {
                        this.savedPool = res.result;
                    }
                } else {
                    this.savePoolLoader = false;
                }
            },
            (err) => {
                this.savePoolLoader = false;
                if(err.error.message === 'Unauthenticated.') {
                    this.authService.logoutEvent.emit(true);
                    localStorage.removeItem('data');
                    this.errorMessage = 'Your token has been expired. Please login again.';
                    this.playerPoolPopup.hide();
                    setTimeout(()=>{
                        this.emptyLineupError.show();
                    },500);
                }
            }
        );
    }

    findPlayerKeyup(value, event) {
        clearTimeout(this.findPlayerTimeout); 
        this.findPlayerTimeout = setTimeout(() => {
            console.log("boop");
            let keyCode = event.keyCode;
            let val = value.trim().toLowerCase();
            let pos = this.toolService.currentSelectedPos;
            this.toolService.mainSearchVal = val;
            console.log(val + " : " + pos);
            if (val) {
                this.stopKeySearch = false;
                this.listData = this.toolService.get_players_list();
                
                let { slate } = this.toolService.weekNSlate;
                ['QB','WR','RB','TE','DST'].map(pos => {
                    let stored_data = localStorage.getItem(this.toolService.toolName + ' '+ slate+pos);
                    if(stored_data) {
                        stored_data = JSON.parse(stored_data);
                        if(stored_data[slate+pos].length > 0) {
                            this.listData = this.listData.filter(d => d.pos1 !== pos);
                            this.listData = this.listData.concat(stored_data[slate+pos]);
                        }
                    }
                });

                this.listData = this.listData.filter(
                    (d) => d.name.toLowerCase().includes(val)
                );

                if (pos !== 'ALL') {
                    if (pos === 'FLEX') {
                        this.listData = this.listData.filter(
                            (d) => d.pos1 === 'RB' || d.pos1 === 'WR' || d.pos1 === 'TE'
                        );
                    } else {
                        this.listData = this.listData.filter(
                            (d) => d.pos1 === pos
                        );
                      console.log(this.listData);
                    }
                }
                this.filter_players();
            }
            if(val === '' && keyCode === 8 && this.stopKeySearch === false) {
                this.stopKeySearch = true;
                this.listData = this.toolService.get_players_list();
                
                let { slate } = this.toolService.weekNSlate;
                ['QB','WR','RB','TE','DST'].map(pos => {
                    let stored_data = localStorage.getItem(this.toolService.toolName + ' '+ slate+pos);
                    if(stored_data) {
                        stored_data = JSON.parse(stored_data);
                        if(stored_data[slate+pos].length > 0) {
                            this.listData = this.listData.filter(d => d.pos1 !== pos);
                            this.listData = this.listData.concat(stored_data[slate+pos]);
                        }
                    }
                });

                if (pos !== 'ALL') {
                    if (pos === 'FLEX') {
                        this.listData = this.listData.filter(
                            (d) => d.pos1 === 'RB' || d.pos1 === 'WR' || d.pos1 === 'TE'
                        );
                    } else {
                        this.listData = this.listData.filter(
                            (d) => d.pos1 === pos
                        );
                    }
                }

                this.filter_players();
                // let proj_range = $('.proj_range')[0].value;
                // let p_min = proj_range.split(';')[0];
                // let p_max = proj_range.split(';')[1];

                // let salary_range = $('.salary_range')[0].value;
                // let s_min = salary_range.split(';')[0];
                // let s_max = salary_range.split(';')[1];

                // let ppd_range = $('.ppd_range')[0].value;
                // let ppd_min = ppd_range.split(';')[0];
                // let ppd_max = ppd_range.split(';')[1];

                // let filtered_data = [];

                // this.listData.forEach(
                //     (d) => {
                //         let salary = d.salary;
                //         let proj = d.projected_pts;
                //         let ppd = d.PPD;

                //         if ((salary >= parseInt(s_min) && salary <= parseInt(s_max)) && (proj >= parseInt(p_min) && proj <= p_max) && (ppd >= parseInt(ppd_min) && ppd <= ppd_max)) {
                //             filtered_data.push(d);
                //         }

                //     }
                // );

                // if(filtered_data.length > 0) {
                //     this.listData = filtered_data;
                // }

                // this.toolService.filteredPlayerPool = this.listData;
                // this.rerender();
            }
        }, 500);
    }

    findPlayerSubmit(value, event) {
        let keyCode = event.keyCode;
        let val = value.trim().toLowerCase();
        let pos = this.toolService.currentSelectedPos;
        this.toolService.mainSearchVal = val;
        
        if (val) {
            this.stopSubmitSearch = false;
            this.listData = this.toolService.get_players_list();

            this.listData = this.listData.filter(
                (d) => d.name.toLowerCase().includes(val)
            );

            if (pos !== 'ALL') {
                if (pos === 'FLEX') {
                    this.listData = this.listData.filter(
                        (d) => d.pos1 === 'RB' || d.pos1 === 'WR' || d.pos1 === 'TE'
                    );
                } else {
                    this.listData = this.listData.filter(
                        (d) => d.pos1 === pos
                    );
                }
            }

            this.filter_players();

            // let proj_range = $('.proj_range')[0].value;
            // let p_min = proj_range.split(';')[0];
            // let p_max = proj_range.split(';')[1];

            // let salary_range = $('.salary_range')[0].value;
            // let s_min = salary_range.split(';')[0];
            // let s_max = salary_range.split(';')[1];

            // let ppd_range = $('.ppd_range')[0].value;
            // let ppd_min = ppd_range.split(';')[0];
            // let ppd_max = ppd_range.split(';')[1];

            // let filtered_data = [];

            // this.listData.forEach(
            //     (d) => {
            //         let salary = d.salary;
            //         let proj = d.projected_pts;
            //         let ppd = d.PPD;

            //         if ((salary >= parseInt(s_min) && salary <= parseInt(s_max)) && (proj >= parseInt(p_min) && proj <= p_max) && (ppd >= parseInt(ppd_min) && ppd <= ppd_max)) {
            //             filtered_data.push(d);
            //         }

            //     }
            // );
            
            // if(filtered_data.length > 0) {
            //     this.listData = filtered_data;
            // }
            // this.toolService.filteredPlayerPool = this.listData;
            // this.rerender();
        }
        
        if(val === '' && keyCode === 13 && this.stopSubmitSearch === false) {
            this.stopSubmitSearch = true;
            this.listData = this.toolService.get_players_list();
            
            if (pos !== 'ALL') {
                if (pos === 'FLEX') {
                    this.listData = this.listData.filter(
                        (d) => d.pos1 === 'RB' || d.pos1 === 'WR' || d.pos1 === 'TE'
                    );
                } else {
                    this.listData = this.listData.filter(
                        (d) => d.pos1 === pos
                    );
                }
            }

            this.filter_players();
            // let proj_range = $('.proj_range')[0].value;
            // let p_min = proj_range.split(';')[0];
            // let p_max = proj_range.split(';')[1];

            // let salary_range = $('.salary_range')[0].value;
            // let s_min = salary_range.split(';')[0];
            // let s_max = salary_range.split(';')[1];

            // let ppd_range = $('.ppd_range')[0].value;
            // let ppd_min = ppd_range.split(';')[0];
            // let ppd_max = ppd_range.split(';')[1];

            // let filtered_data = [];

            // this.listData.forEach(
            //     (d) => {
            //         let salary = d.salary;
            //         let proj = d.projected_pts;
            //         let ppd = d.PPD;

            //         if ((salary >= parseInt(s_min) && salary <= parseInt(s_max)) && (proj >= parseInt(p_min) && proj <= p_max) && (ppd >= parseInt(ppd_min) && ppd <= ppd_max)) {
            //             filtered_data.push(d);
            //         }

            //     }
            // );

            // if(filtered_data.length > 0) {
            //     this.listData = filtered_data;
            // }
            // this.toolService.filteredPlayerPool = this.listData;
            // this.rerender();
        }
    }

    filterDataUsingPos(pos_name) {
        this.listData = this.toolService.get_players_list();
        let { slate } = this.toolService.weekNSlate;

        if (pos_name === 'ALL') {

            // this.listData = this.toolService.get_players_list();
            ['QB','WR','RB','TE','DST'].map(pos => {
                let stored_data = localStorage.getItem(this.toolService.toolName + ' '+ slate+pos);
                if(stored_data) {
                    stored_data = JSON.parse(stored_data);
                    if(stored_data[slate+pos].length > 0) {
                        this.listData = this.listData.filter(d => d.pos1 !== pos);
                        this.listData = this.listData.concat(stored_data[slate+pos]);
                    }
                }
            });

        } else if (pos_name === 'FLEX') {
            
            ['WR','RB','TE'].map(pos => {
                let stored_data = localStorage.getItem(this.toolService.toolName + ' '+ slate+pos);
                if(stored_data) {
                    stored_data = JSON.parse(stored_data);
                    if(stored_data[slate+pos].length > 0) {
                        this.listData = this.listData.filter(d => d.pos1 !== pos);
                        this.listData = this.listData.concat(stored_data[slate+pos]);
                    }
                }
            });

            this.listData = this.listData.filter(
                (d) => d.pos1 === 'RB' || d.pos1 === 'WR' || d.pos1 === 'TE'
            );
            
        } else {
            let stored_data = localStorage.getItem(this.toolService.toolName + ' '+ slate+pos_name);
            if(stored_data) {
                stored_data = JSON.parse(stored_data);
                if(stored_data[slate+pos_name].length > 0) {
                    // this.listData = this.listData.filter(d => d.pos1 !== pos_name);
                    this.listData = this.listData.concat(stored_data[slate+pos_name]);
                }
            }
            this.listData = this.listData.filter(
                (d) => d.pos1 === pos_name
            );
        }

        if(this.searchPlayer) {
            this.searchPlayer.nativeElement.value = '';
        }

        console.log(this.listData)

        this.setup_range_sliders(this.toolService.get_players_list());
        this.filter_players();
    }

    rerender(): void {
        this.hideTable = true;
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.destroy();
            this.dtTrigger.next();
            setTimeout(() => {
                this.hideTable = false;
            }, 100);
        });
    }

    addToLineup(data) {

        let { pos1, name, salary, projected_pts, floor, ceiling, player } = data;

        let newdata = {
            pos1: pos1,
            name: name,
            salary: salary,
            projected_pts: projected_pts,
            floor: floor,
            ceiling: ceiling,
            player: player
        }

        // is the row already exists
        let check = this.lineupData.findIndex(
            d => (d.pos1 === pos1 && d.name === name)
        );

        if (check === -1) {
            // is there a POS that has no data
            let index = this.lineupData.findIndex(
                (d) => (d.pos1 === pos1 && d.name === '')
            );
            if (index !== -1) {
                this.lineupCount = this.lineupCount + 1;
                if ((this.remaining - salary) > 0) {
                    this.remaining = this.remaining - salary;
                    let average = this.remaining / (9 - this.lineupCount);
                    this.remainingAvg = average < 0 ? this.remaining : average;
                    this.projected_points = (+this.projected_points) + (+projected_pts);
                    this.lineupData[index] = newdata;
                    let data_to_push = { ...data };

                    this.lineupDataFromList.push(data_to_push);
                    this.toolService.preserve_lineup(this.lineupData, this.lineupDataFromList, this.remaining, this.remainingAvg, this.projected_points, this.lineupCount);
                    // ----------------
                    let slate_data = {}
                    slate_data['name'] = this.currentSlate;
                    slate_data['lineup'] = this.toolService.get_preserved_lineup();
                    localStorage.setItem(this.toolService.toolName + ' '+ this.currentSlate,JSON.stringify(slate_data));
                    this.rerenderSlate();
                    // ----------------
                } else {
                    this.errorMessage = 'No more player can be locked';
                    this.emptyLineupError.show();
                }
            } else {
                if (['RB', 'WR', 'TE'].indexOf(pos1) !== -1) {
                    let find = this.lineupData.findIndex(
                        (d) => (d.pos1 === 'FLEX' && d.name === '')
                    );

                    if (find !== -1) {
                        this.remaining = this.remaining - salary;
                        let average = this.remaining / (9 - this.lineupCount);
                        this.remainingAvg = average < 0 ? this.remaining : average;
                        this.projected_points = (+this.projected_points) + (+projected_pts);
                        newdata['pos1'] = 'FLEX';
                        this.lineupData[find] = newdata;
                        let data_to_push = { ...data };

                        this.lineupDataFromList.push(data_to_push);
                        this.toolService.preserve_lineup(this.lineupData, this.lineupDataFromList, this.remaining, this.remainingAvg, this.projected_points, this.lineupCount);
                        // ----------------
                        let slate_data = {}
                        slate_data['name'] = this.currentSlate;
                        slate_data['lineup'] = this.toolService.get_preserved_lineup();
                        localStorage.setItem(this.toolService.toolName + ' '+ this.currentSlate,JSON.stringify(slate_data));
                        // ----------------
                        this.rerenderSlate();
                    }
                }
            }
        }
    }

    removeFromPlayerAndLineupList(index, data) {
        this.listData = this.toolService.add_in_exluded_array(index, data);

        let { slate } = this.toolService.weekNSlate;
        let excluded = this.toolService.get_excluded_list();

        excluded = excluded.reduce((array,data) => {
            let id = data.player.split('(')[1].replace(')','');
            array.push(id);
            return array;
        },[]);
        localStorage.removeItem(this.toolService.toolName + ' ' + slate + ' filters');
        localStorage.setItem(this.toolService.toolName + ' '+ slate + ' excluded', JSON.stringify(excluded));

        this.hideTable = true;
        let { pos1, name } = data;

        this.lineupData.forEach(
            (row, index) => {
                if (row.pos1 === pos1 && row.name === name) {
                    this.removeFromSlate(index);
                }
            }
        );

        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.row('.row_' + index).remove();
            dtInstance.destroy();

            let pos = this.toolService.currentSelectedPos;
            if (pos !== 'ALL') {
                if (pos === 'FLEX') {
                    this.listData = this.listData.filter(
                        (d) => d.pos1 === 'RB' || d.pos1 === 'WR' || d.pos1 === 'TE'
                    );
                } else {
                    this.listData = this.listData.filter(
                        (d) => d.pos1 === pos
                    );
                }
            }

            this.toolService.filteredPlayerPool = this.listData;
            this.dtTrigger.next();
            setTimeout(() => {
                this.filter_players();
                this.hideTable = false;
            }, 100);
        });
    }

    removeFromSlate(index) {
        
        let { pos1, salary, projected_pts, name } = this.lineupData[index];

        let current_lineup_count = (this.lineupDataFromList.filter(d => d.name !== '')).length;
        this.lineupCount = current_lineup_count - 1;
        this.remaining = (+this.remaining) + (+salary);
        this.remainingAvg = this.remaining / (9 - this.lineupCount);
        this.projected_points = (+this.projected_points) - (+projected_pts);

        this.lineupData[index] = {
            pos1: pos1,
            name: '',
            salary: '',
            projected_pts: '',
            floor: '',
            ceiling: ''
        }

        let i = this.lineupDataFromList.findIndex(d => d.name === name);
        this.lineupDataFromList.splice(i, 1);

        this.toolService.preserve_lineup(this.lineupData, this.lineupDataFromList, this.remaining, this.remainingAvg, this.projected_points, current_lineup_count);
        this.rerenderSlate();

        let slate_data = {}
        slate_data['name'] = this.currentSlate;
        slate_data['lineup'] = this.toolService.get_preserved_lineup();
        localStorage.setItem(this.toolService.toolName + ' '+ this.currentSlate,JSON.stringify(slate_data));
    }

    resetSlate() {
        if (this.lineupDataFromList.length > 0) {
            this.lineupData = this.toolService.get_default_lineup();
            this.lineupDataFromList = [];
            this.lineupCount = 0;
            this.rerenderSlate();
            this.resetRemainAndRemainAvg();
            this.toolService.preserve_lineup([], [], 0, 0, 0, 0);
            if(localStorage.getItem(this.toolService.toolName + ' '+ this.currentSlate)) {
                localStorage.removeItem(this.toolService.toolName + ' '+ this.currentSlate);
            }
        }
    }

    setLineupCol(colToShow) {
        this.showLineupCol = colToShow;
    }

    setOrResetData() {
        if (this.listTempData.length === 0) {
            this.listTempData = this.listData;
        } else {
            this.listData = this.listTempData;
        }
    }

    resetRemainAndRemainAvg() {
        this.remaining = this.toolService.get_remaining();
        this.remainingAvg = this.remaining / 9;
        this.lineupCount = 0;
        this.projected_points = 0;
    }

    rerenderSlate() {
        $('#second_table').DataTable().destroy();
        this.dtTrigger2.next();
    }

    applyDatatableAndAllFilters(init: boolean = false) {

        this.dtTrigger.next();

        if(!init) {
            setTimeout(() => {
                this.hideTable = false;
            }, 100);
        }

        let { slate } = this.toolService.weekNSlate;
        let stored_lineups = localStorage.getItem(this.toolService.toolName + ' '+ slate);
        if (stored_lineups) {
            let storage_lineup = JSON.parse(stored_lineups);
            this.lineupData = storage_lineup.lineup.lineup;
            this.lineupDataFromList = storage_lineup.lineup.lineup_data;
            let calculations: any = storage_lineup.lineup.lineup_cal;
            this.remaining = calculations.remain;
            this.remainingAvg = calculations.remainAvg;
            this.lineupCount = calculations.count;
            this.projected_points = calculations.point;

            this.toolService.preserve_lineup(this.lineupData, this.lineupDataFromList, this.remaining, this.remainingAvg, this.projected_points, this.lineupCount);
        } else {
            this.lineupData = this.toolService.get_default_lineup();
        }

        this.dtTrigger2.next();

    }

    getColor(key: string, value: number) {
        
        if(key === 'PPD') {
            if (value >= 3) {
                return 'green';
            } else if (value >= 2.5 && value < 3) {
                return 'lightgreen';
            } else if (value >= 2 && value < 2.5) {
                return 'yellow';
            } else if (value >= 1.6 && value < 2) {
                return 'orange';
            } else if (value < 1.6) {
                return 'red';
            }
        } else if(key === 'Def vs Pos') {
            if (value >= 27 && value <= 32) {
                return 'green';
            } else if (value >= 20 && value <= 26) {
                return 'lightgreen';
            } else if (value >= 11 && value <= 19) {
                return 'yellow';
            } else if (value >= 6 && value <= 10) {
                return 'orange';
            } else if (value >= 1 && value <= 5) {
                return 'red';
            }
        }
    }

    buildRules() {
        this.toolService.openPopup.emit(true);
    }

    ngOnDestroy() {
        this.dtTrigger.unsubscribe();
        if (this.toolDataSubscription)
            this.toolDataSubscription.unsubscribe();
        if (this.clearExposureSubscription)
            this.clearExposureSubscription.unsubscribe();
        if (this.posFilterSubscription)
            this.posFilterSubscription.unsubscribe();
        if (this.excludeAllSubscription)
            this.excludeAllSubscription.unsubscribe();
        if (this.slateValSubscription)
            this.slateValSubscription.unsubscribe();
        if(this.popupEventSubscription)
            this.popupEventSubscription.unsubscribe();
        if(this.openPlayerPoolSubscription)
            this.openPlayerPoolSubscription.unsubscribe();
        if(this.resetAllSubscription)
            this.resetAllSubscription.unsubscribe();
    }

}
