import { Component, OnInit, ChangeDetectorRef, ViewChild, OnDestroy, ElementRef } from '@angular/core';
import { ToolsServiceService } from '../../../services/tools-service.service';
import { Subject, Subscription, ObjectUnsubscribedError } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ngxCsv } from 'ngx-csv';

declare var $;

@Component({
    selector: 'app-lineups',
    templateUrl: './lineups.component.html',
    styleUrls: ['./lineups.component.css']
})
export class LineupsComponent implements OnInit, OnDestroy {

    @ViewChild(DataTableDirective) dtElement: DataTableDirective;
    @ViewChild('replacePopup') replacePopup: ModalDirective;
    
    playersList: any = [];
    lineupData: any = [];
    lineupDataFromList: any = [];
    playerPool: any = [];
    lineups: any = [];
    playerExposures: any = [];
    flexPercent: any = [];
    stackOwnership: any = [];
    groupOwnership: any = [];
    replacementsData: any = [];

    private lineup_no: number;
    private row_no: number;
    private old_data_pos: string;

    buildRulesStack = {
        // player: '',
        // pos: [],
        // oppos_pos: [],
        // exposure: { min: 0, max: 100 }
    }

    chooseFlex: boolean = false;
    loadLineups: boolean = false;
    loadPlayerExposure: boolean = false;
    loadFlexPercent: boolean = false;
    disableBML: boolean = false;
    replacePopupLoader: boolean = false;

    avoid_oppos_def: string = 'n';
    select_flex_pos: string = 'n';
    serverError: string = '';
    rowReplaceError: string = '';

    selectedFlex: Object = {
        'RB': true,
        'WR': false,
        'TE': false
    };

    private my_lineup_setup:any = {
        lineups_range: 10,
        salary_range: { min: 0, max: 0 },
        unique_range: 2,
        exposure_range : 100,
        oppos_def: null,
    }

    private peso = false;
    private ascOrder = ['QB', 'RB', 'WR', 'TE', 'FLEX', 'DST'];
    private descOrder = ['DST', 'FLEX', 'TE', 'WR', 'RB', 'QB'];

    my_lineup_preserved:any = {}

    dtOptions: DataTables.Settings = {};
    dtOptions2: DataTables.Settings = {};
    mylineupDtOptions: DataTables.Settings = {};

    dtTrigger: Subject<any> = new Subject();
    mylineupDtTrigger: Subject<any> = new Subject();

    buildMylineupsSubscription: Subscription;
    replaceDataSubscription: Subscription;

    constructor(
        private toolService: ToolsServiceService,
        private cd: ChangeDetectorRef
    ) { }

    async ngOnInit() {
        this.loadLineups = true;
        this.initial_setup();

        this.dtOptions = {
            "paging": false,
            "autoWidth": false,
            "ordering": false,
            "searching": false,
            "info": false,
            responsive: true
        }

        this.dtOptions2 = {
            "paging": false,
            "autoWidth": false,
            "ordering": false,
            "searching": false,
            "info": false,
        }

        this.mylineupDtOptions = {

        }

        let players_list = this.toolService.get_players_name_list();
        if(players_list.length !== 0) {
            this.playersList = players_list;
            this.playerPool = this.toolService.get_players_list();

            // console.log(this.playerPool.reduce((a,d)=>{
            //    a.push({name:d.name,min:d.min,max:d.max});
            //    return a; 
            // },[]));
            // let salary_max = this.playersList.reduce((max, d) => d.salary > max ? d.salary : max, this.playersList[0].salary);
                // let salary_min = this.playersList.reduce((min, d) => d.salary < min ? d.salary : min, this.playersList[0].salary);
                
                // $(".js-range-slider_1").data('ionRangeSlider').update({
                //     min: salary_min,
                //     max: salary_max,
                // });
        } else {
            try{
                let data:any = await this.toolService.get_data().toPromise();
                this.playerPool = data;
                data.map(
                    d => {
                        d['min'] = '';
                        d['max'] = '';
                        return d;
                    }
                );
                this.toolService.playerListFetchedEvent.emit(data);
                this.toolService.mylineupsPlayerFetched = true;
                // this.playersList = this.toolService.get_players_name_list(data);
                
                // let salary_max = this.playersList.reduce((max, d) => d.salary > max ? d.salary : max, this.playersList[0].salary);
                // let salary_min = this.playersList.reduce((min, d) => d.salary < min ? d.salary : min, this.playersList[0].salary);
                
                // $(".js-range-slider_1").data('ionRangeSlider').update({
                //     min: salary_min,
                //     max: salary_max,
                // });

            }catch(e) {}
        }

        // let stack_rules:any = this.toolService.savedStackRules;
        // if(Object.keys(stack_rules).length > 0) {
        //     this.buildRulesStack = stack_rules;

        //     let proj_instance = $('.stack_range').data('ionRangeSlider');
        //     proj_instance.update({
        //         from: stack_rules.exposure.min, 
        //         to: stack_rules.exposure.max 
        //     });
        // }

        let lineup = this.toolService.get_preserved_lineup();
        if (lineup.lineup.length !== 0) {
            this.lineupData = lineup.lineup;
            this.lineupDataFromList = lineup.lineup_data;
            setTimeout(()=>this.dtTrigger.next(),100);
        } else {
            this.lineupData = this.toolService.get_default_lineup();
            setTimeout(()=>this.dtTrigger.next(),100);
        }

        if(lineup.lineup_data.length === 9) {
            this.disableBML = true;
            this.serverError = 'You have locked in all roster spots, please unlock players to have multiple builds';
        }

        let lineup_length = lineup.lineup_data.length;
        if(lineup_length < 2) {
            if(lineup_length === 1) {
                let pos = lineup.lineup_data[0].pos1;
                let chech_min_max = this.playerPool.filter(d => (d.pos1 !== pos) && (d.min !== '' || d.max !== ''));
                if(chech_min_max.length === 0) {
                    this.disableBML = true;
                    this.serverError = 'Set exposure for one player in player pool having position different then the locked player.';
                }
            } else {
                // console.log(this.playerPool.filter(d => d.name === 'Nick Mullens' || d.name === 'Nick Foles'))
                let exposure_set = this.playerPool.filter(d => (d.min !== '') || (d.max !== ''));
                if(exposure_set.length < 2) {
                    this.disableBML = true;
                    this.serverError = 'Set exposure for atleast two players in player pool.';
                }
            }
        }


        let stored_data:any = this.toolService.mylineupsData;
        if(stored_data && Object.keys(stored_data).length > 0) {
            let data = stored_data;
            this.my_lineup_preserved = data;
            let filters = data.filters;
            if(filters) {
                this.my_lineup_setup = filters;
                let keys = ['lineups_range', 'exposure_range', 'unique_range' , 'salary_range'];

                keys.forEach(
                    k => {
                        let instance = $('.' + k).data('ionRangeSlider');
                        let options = {};

                        if(k !== 'salary_range') {
                            options['from'] = filters[k];
                        } else {
                            options['from'] = filters[k]['min'];
                            options['to'] = filters[k]['max'];
                        }

                        instance.update(options)
                    }
                );
            }

            this.lineups = data.lineups && data.lineups.length > 0 ? data.lineups : [];
            this.playerExposures = data.exposure && data.exposure.length > 0 ? data.exposure : [];
            this.flexPercent = data.flex && data.flex.length > 0 ? data.flex : [];
            this.stackOwnership = data.ownership && data.ownership.length > 0 ? data.ownership : [];
            this.groupOwnership = data.group_own && data.group_own.length > 0 ? data.group_own : [];

            if(this.lineups.length > 0) {
                setTimeout(()=>{
                    $('.lineups_table').DataTable({
                        "paging": false,
                        "autoWidth": false,
                        "ordering": false,
                        "searching": false,
                        "info": false,
                        responsive: true
                    });
                    $('[data-toggle="popover"]').popover();
                },100)
                
                setTimeout(()=>{
                    $('.exposure_datatable').DataTable({
                        "paging": false,
                        "autoWidth": false,
                        "searching": false,
                        "info": false,
                        "aaSorting": [],
                        columnDefs: [{ "targets": [0], "searchable": false, "orderable": false, "visible": true }]
                    });
                },10);
                
                setTimeout(()=>{
                    $('.flex_datatable').DataTable({
                        "paging": false,
                        "autoWidth": false,
                        "searching": false,
                        "info": false,
                        "aaSorting": []
                    });
                },10);

                setTimeout(()=>{
                    $('.stack_ownership_table').DataTable({
                        "paging": false,
                        "autoWidth": false,
                        "searching": false,
                        "info": false,
                        "aaSorting": []
                    });
                },10);

                setTimeout(()=>{
                    $('.group_ownership_table').DataTable({
                        "paging": false,
                        "autoWidth": false,
                        "searching": false,
                        "info": false,
                        "aaSorting": []
                    });
                },10);
            }

            if(data['AOD']) {
                this.my_lineup_preserved['AOD'] = data['AOD'];
                this.avoid_oppos_def = 'y';
            }

            if(data['selected_flex']) {
                this.my_lineup_preserved['selected_flex'] = data['selected_flex'];
                this.selectedFlex = data['selected_flex'];
                this.select_flex_pos = 'y';
                this.chooseFlex = true;
                // console.log(this.selectedFlex);
            }

            this.loadLineups = false;
        } else {
            this.loadLineups = false;
        }

    }

    buildMyLineups() {
        this.serverError = '';

        let lineup_range_check = this.my_lineup_setup.lineups_range;
        let lineup_locked_data = this.toolService.get_preserved_lineup().lineup_data;
        let build_my_lineups = true;
        if(lineup_range_check === 1 && lineup_locked_data.length === 0) {
            build_my_lineups = false;
            this.serverError = 'Lock two players from player pool to continue.'
        }

        if(lineup_locked_data.length < 2) {
            if(lineup_locked_data.length === 1) {
                let pos = lineup_locked_data[0].pos1;
                let chech_min_max = this.playerPool.filter(d => (d.pos1 !== pos) && (d.min !== '' || d.max !== ''));
                if(chech_min_max.length === 0) {
                    build_my_lineups = false;
                    this.disableBML = true;
                    this.serverError = 'Set exposure for one player in player pool having position different then the locked player.';
                }
            } else {
                let exposure_set = this.playerPool.filter(d => (d.min !== '') || (d.max !== ''));
                if(exposure_set.length < 2) {
                    build_my_lineups = false;
                    this.disableBML = true;
                    this.serverError = 'Set exposure for atleast two players in player pool.';
                }
            }
        }
        
        if(build_my_lineups) {
            this.loadLineups = true;
            // this.lineups = [];
            let data = {}
            
            data['lineup_num'] = this.my_lineup_setup.lineups_range;
            data['cap_min'] = +this.my_lineup_setup.salary_range.min;
            data['cap_max'] = +this.my_lineup_setup.salary_range.max;
            data['unique_player'] = this.my_lineup_setup.unique_range;
            data['exp_rate'] = parseInt(this.my_lineup_setup.exposure_range, 10) / 100;
            data['avoid_def'] = this.avoid_oppos_def === 'y' ? 1 : 0;
            
            if(this.chooseFlex) {
                let flex_pos = [];
                Object.keys(this.selectedFlex).map((key) => {
                    if(this.selectedFlex[key]) {
                        flex_pos.push(key)
                    }
                });
                if(flex_pos.length > 0) {
                    data['force_flex'] = 1;
                    data['force_pos'] = flex_pos.join(',');
                }
            }

            let stacks: any = this.toolService.savedStackRules;
            if(stacks.length > 0) {
                let filtered_stack = stacks.filter(d => d.player.length !== 0);
                filtered_stack = filtered_stack.filter(d => d.pos.length > 0 || d.oppos_pos.length > 0);
                if(filtered_stack.length > 0) {
                    filtered_stack.map(
                        (d,index) => {
                            if(index === 0) {
                                let player_name = d.player[0].split('-')[0].trim();
                                data['combo_name'] = player_name;
                                if(d.pos.length > 0) {
                                    data['combo_pos'] = d.pos.join(',');
                                }
                                if(d.oppos_pos.length > 0) {
                                    data['combo_pos_opp'] = d.oppos_pos.join(',');
                                }
                                data['stack_rate_min'] =  d.exposure.min !== '0' ? parseInt(d.exposure.min) / 100 : 0;
                                data['stack_rate_max'] = d.exposure.max !== '0' ? parseInt(d.exposure.max) / 100 : 0;
                            } else {
                                let player_name = d.player[0].split('-')[0].trim();
                                data['combo_name'+(index).toString()] = player_name;
                                if(d.pos.length > 0) {
                                    data['combo_pos'+(index).toString()] = d.pos.join(',');
                                }
                                if(d.oppos_pos.length > 0) {
                                    data['combo_pos_opp'+(index).toString()] = d.oppos_pos.join(',');
                                }
                                data['stack_rate_min'+(index).toString()] =  d.exposure.min !== '0' ? parseInt(d.exposure.min) / 100 : 0;
                                data['stack_rate_max'+(index).toString()] = d.exposure.max !== '0' ? parseInt(d.exposure.max) / 100 : 0;
                            }
                        }
                    ); 
                }
                // if(stack.player){
                //     data['Combo_name'] = stack.player;
                // }
                // if(stack.pos.length > 0) {
                //     data['Combo_pos'] = stack.pos.join(',');
                // }
                // if(stack.oppos_pos.length > 0) {
                //     data['Combo_pos_opp'] = stack.oppos_pos.join(',');
                // }
                // data['Stack_rate_max'] = parseInt(stack.exposure.max) / 100
            }

        if(this.toolService.savedGroups.length > 0) {
                let groups = this.toolService.savedGroups.filter(d => d.selected_players_id.length > 0);
                if(groups.length > 0) {
                    groups.map(
                        (d,index) => {
                            if(index === 0) {
                                data['group_player_id'] = d.selected_players_id.join(',');
                                data['group_rate_min'] = d.range.min !== '0' ? parseInt(d.range.min) / 100 : 0;
                                data['group_rate'] = d.range.max !== '0' ? parseInt(d.range.max) / 100 : 0;
                            } else {
                                data['group_player'+(index).toString()+'_id'] = d.selected_players_id.join(',');
                                data['group_rate_min'+(index).toString()] = d.range.min !== '0' ? parseInt(d.range.min) / 100 : 0;
                                data['group_rate'+(index).toString()] = d.range.max !== '0' ? parseInt(d.range.max) / 100 : 0;
                            }
                        }
                    );
                }
            }

            let pp = this.toolService.get_players_list();
            let player_pool = pp.length > 0 ? pp : this.playerPool;

            this.disableBML = true;
            this.buildMylineupsSubscription = this.toolService.build_my_lineups(data, player_pool, this.lineupDataFromList).subscribe(
                (res:any) => {
                    this.disableBML = false;
                    if(res[0][0] === 'Optimization Succeeds') {
                    
                        this.lineups = [];
                        this.playerExposures = [];
                        this.flexPercent = [];

                        $('.exposure_datatable').DataTable().destroy();
                        $('.flex_datatable').DataTable().destroy();
                        $('.stack_ownership_table').DataTable().destroy();
                        $('.group_ownership_table').DataTable().destroy();

                        let resMylineups = res[1];
                        let count = 0;
                        let lineup = [];
                        
                        resMylineups.map(
                            (d,index) => {
                                lineup.push(d);
                                count = count + 1;
                                if(count === 9) {
                                    this.lineups.push(lineup);
                                    lineup = [];
                                    count = 0;
                                }
                                return d;
                            }
                        );
                        
                        // console.log(this.lineups);
                        setTimeout(()=>{
                            $('.lineups_table').DataTable({
                                "paging": false,
                                "autoWidth": false,
                                "ordering": false,
                                "searching": false,
                                "info": false,
                                responsive: true
                            });
                            this.loadLineups = false;
                            $('[data-toggle="popover"]').popover();
                        },100)
                        
                        this.playerExposures = res[2];
                        setTimeout(()=>{
                            $('.exposure_datatable').DataTable({
                                "paging": false,
                                "autoWidth": false,
                                "searching": false,
                                "info": false,
                                "aaSorting": [],
                                columnDefs: [{ "targets": [0], "searchable": false, "orderable": false, "visible": true }]
                            });
                        },10);
                        this.flexPercent = res[3];
                        setTimeout(()=>{
                            $('.flex_datatable').DataTable({
                                "paging": false,
                                "autoWidth": false,
                                "searching": false,
                                "info": false,
                                "aaSorting": []
                            });
                        },10);

                        this.groupOwnership = res[4];

                        setTimeout(()=>{
                            $('.group_ownership_table').DataTable({
                                "paging": false,
                                "autoWidth": false,
                                "searching": false,
                                "info": false,
                                "aaSorting": []
                            });
                        },10);

                        this.stackOwnership = res[5];

                        setTimeout(()=>{
                            $('.stack_ownership_table').DataTable({
                                "paging": false,
                                "autoWidth": false,
                                "searching": false,
                                "info": false,
                                "aaSorting": []
                            });
                        },10);

                        this.my_lineup_preserved['lineups'] = this.lineups;
                        this.my_lineup_preserved['exposure'] = this.playerExposures;
                        this.my_lineup_preserved['flex'] = this.flexPercent;
                        this.my_lineup_preserved['ownership'] = this.stackOwnership;
                        this.my_lineup_preserved['group_own'] = this.groupOwnership;

                        this.toolService.mylineupsData = this.my_lineup_preserved;
                        // localStorage.setItem('my_lineups', JSON.stringify(this.my_lineup_preserved));

                    } else {
                        this.disableBML = false;
                        this.loadLineups = false;
                        this.serverError = res[0];
                    }
                },
                (err) => {
                    this.disableBML = false;
                    this.loadLineups = false;
                    this.serverError = err.statusText;
                }
            );
        }
       
    }

    init_replace(lineup_no: number, row_no: number, pos: string, player: string, name: string) {
        this.rowReplaceError = '';
        this.lineup_no = lineup_no;
        this.row_no = row_no;
        
        this.replacePopup.show();
        this.replacementsData = [];
        $('.replacement_table').DataTable().clear();
        $('.replacement_table').DataTable().destroy();
        
        let id = player.split('(')[1].replace(')','');

        this.replacePopupLoader = true;
        
        this.replaceDataSubscription = this.toolService.get_replace_data({id,pos})
        .subscribe(
            (res:any) => {
                this.replacePopupLoader = false;
                this.replacementsData = res;
                // this.old_data_pos = res.find(d => d.name === name).pos1;
                this.old_data_pos = pos;
                setTimeout(()=>{
                    $('.replacement_table').DataTable({
                        "aaSorting": []
                    });
                },10);
            },
            (err) => { this.replacePopupLoader = false; }
        )
    }

    getTooltipContent(key) {

        if (key) {
            return 'Total Player Exposure';
        }
        return '';
    }

    getFilterInfo(key) {
        if (key) {
            return this.toolService.get_lineups_tooltip(key);
        }
        return '';
    }

    trigger(index) {
        $('.font_toggle').find(".collapse_toggle_"+index).toggleClass("fas fa-angle-down fas fa-angle-up");
    }

    perform_replacement(row_data) {

        // console.log(row_data);
        this.rowReplaceError = '';
        let old_row = this.lineups[this.lineup_no][this.row_no];
        let no_of_lineups = this.lineups.length;

        let findNameInLineup = this.lineups[this.lineup_no].find(d => d.name === row_data.name);
        
        if(row_data.name !== old_row.name && !findNameInLineup) {
            $('.lineup_'+this.lineup_no).DataTable().destroy();
            let old_salary = old_row.salary;
            let old_points = old_row.projected_pts;
            let new_salary = row_data.salary;
            let new_points = row_data.projected_pts;
            let salary = this.lineups[this.lineup_no][0].TeamSalary;
            let points = this.lineups[this.lineup_no][0].TotalPoints;

            let lineup_salary = (salary - old_salary) + new_salary;
            let lineup_points = (points - old_points) + new_points;
            // this.lineups[this.lineup_no][0].TeamSalary = 
            // this.lineups[this.lineup_no][0].TotalPoints = 

            this.lineups[this.lineup_no].map((d,i) => {
                if(i === 0) {
                    d['TeamSalary'] = lineup_salary;
                    d['TotalPoints'] = lineup_points;
                    return d;
                }
                return d;
            });
            
            // console.log(salary,old_salary,new_salary,(salary - old_salary) + new_salary,this.lineups[this.lineup_no][0].TeamSalary);
            setTimeout(()=>{
                $('.lineup_'+this.lineup_no).DataTable({
                    "paging": false,
                    "autoWidth": false,
                    "ordering": false,
                    "searching": false,
                    "info": false,
                    "aaSorting": [],
                    responsive: true
                });
                this.replacePopup.hide();
            },10);

            //  - 0.1 if the oldname exist in exposure
            // if the value become 0 then remove from exposure
            // if newname is in exposure then increment exposure
            // if newname not in exposure then push the record with value 0.1 in exposure
            let value_add_remove = 1 / no_of_lineups;
            // console.log(value_add_remove);
            let exposure = 0;
            let old_exposure = 0;
            let remove_row = 0;
            this.playerExposures.map(
                (d) => {
                    if(d.name === old_row.name) {
                        
                        if((d.final_exp - value_add_remove) < 0.1) {
                            remove_row = 1;
                        } else {
                            old_exposure = d.final_exp - value_add_remove; 
                            d.final_exp = d.final_exp - value_add_remove;
                        }
                    }
                }
            );

            if(remove_row) {
                this.playerExposures = this.playerExposures.filter(d => d.name !== old_row.name);
            }

            let names = this.playerExposures.reduce((array,data) => {
                array.push(data.name);
                return array;
            },[]);

            if(names.indexOf(row_data.name) === -1) {
                this.playerExposures.push({
                    pos1: old_row.pos1 === 'FLEX' ? 'FLEX' : row_data.pos1,
                    name: row_data.name,
                    final_exp: value_add_remove
                });
                exposure = value_add_remove;
            } else {
                this.playerExposures.map(
                    (d) => {
                        if(d.name === row_data.name) {
                            exposure = d.final_exp + value_add_remove;
                            d.final_exp = d.final_exp + value_add_remove;
                        }
                    }
                )
            }
            
            $('.exposure_datatable').DataTable().destroy();
            setTimeout(()=>{
                $('.exposure_datatable').DataTable({
                    "paging": false,
                    "autoWidth": false,
                    "searching": false,
                    "info": false,
                    "aaSorting": [2],
                    columnDefs: [{ "targets": [0], "searchable": false, "orderable": false, "visible": true }]
                });
            },100);

            if(this.row_no === 0) {
                row_data['TeamSalary'] = lineup_salary;
                row_data['TotalPoints'] = lineup_points;
            }

            if(old_row.pos1 !== 'FLEX') {
                row_data['final_exp'] = exposure;
                this.lineups[this.lineup_no][this.row_no] = row_data;
            } else {
                let new_row_data = JSON.parse(JSON.stringify(row_data));
                new_row_data.pos1 = 'FLEX';
                new_row_data['final_exp'] = exposure;
                this.lineups[this.lineup_no][this.row_no] = new_row_data;
            }

            // update exposure for the old data that exists in other lineups
            this.lineups.map(
                lu => {
                    lu.map(
                        data => {
                            if(data.name === old_row.name) {
                                data.final_exp = old_exposure;
                            }
                            return data;
                        }
                    );
                    return lu;
                }
            );
            
            this.updateFlexPercentage(this.lineups);
            // decrement from existing %flex for old_pos or remove it if less than 0.1
            // increment in an existing %flex for new data or add with 0.1 if pos don't exist 
            // let remove_percent_flex = 0;           
            // if(this.old_data_pos) {
            //     this.flexPercent.map(
            //         (d) => {
            //             if(d.Postion === this.old_data_pos) {
            //                 remove_percent_flex = (d.Percentage - value_add_remove) < 0.1 ? 1 : 0; 
            //                 d.Percentage = d.Percentage - value_add_remove;
            //             }
            //         }
            //     );
            // }

            // if(remove_percent_flex) {
            //     this.flexPercent = this.flexPercent.filter(d => d.Postion !== this.old_data_pos);
            // }
            
            // let flex_row_updated = 0;
            // this.flexPercent.map(
            //     (d) => {
            //         if(d.Postion === row_data.pos1) {
            //             d.Percentage = d.Percentage + value_add_remove;
            //             flex_row_updated = 1;
            //         }
            //     }
            // );

            // if(!flex_row_updated && ['RB','WR','TE'].indexOf(row_data.pos1) !== -1) {
            //     this.flexPercent.push({
            //         Postion: row_data.pos1,
            //         Percentage: value_add_remove
            //     });
            // }

            this.my_lineup_preserved['lineups'] = this.lineups;
            this.my_lineup_preserved['exposure'] = this.playerExposures;
            this.my_lineup_preserved['flex'] = this.flexPercent;
            localStorage.setItem(this.toolService.toolName + ' '+ 'my_lineups', JSON.stringify(this.my_lineup_preserved));
        } else {
            this.rowReplaceError = 'Same row already exists in lineup!';
        }
    }

    updateFlexPercentage(lineups) {

        // calculate flex percent
        // Step 1: seperate out all the flex from all the lineups
        let flex_data = [];
        lineups.map(
            lu => {
                let result = lu.find(d => d.pos1 === 'FLEX');
                flex_data.push(result);
            }
        );
        // Step 2: find the postiom of the collected flex data from the players pool data
        let players_names_list = this.toolService.get_players_name_list();
        let flex_pos = [];
        if(flex_data.length > 0) {
            flex_data.map(
                f => {
                    let id = f.player.split('(')[1].replace(')','');
                    let find_pos = players_names_list.find(d => d.id == id);
                    if(find_pos) {
                        flex_pos.push(find_pos.pos);
                    }
                }
            )
        }
        // Step 3: Prepare data with percentage for FLEX Percent table
        var occurences = {};
        for (var i = 0; i < flex_pos.length; i++) {
            if (typeof occurences[flex_pos[i]] == "undefined") {
                occurences[flex_pos[i]] = 1;
            } else {
                occurences[flex_pos[i]]++;
            }
        }
        this.flexPercent = [];
        Object.keys(occurences).map(
            k => {
                let exposure = occurences[k] * (1/lineups.length);
                this.flexPercent.push({Postion: k, Percentage: exposure});
            }
        );

        $('.flex_datatable').DataTable().destroy();
        setTimeout(()=>{
            $('.flex_datatable').DataTable({
                "paging": false,
                "autoWidth": false,
                "searching": false,
                "info": false,
                "aaSorting": [1]
            });
        },10);
    }

    deleteMyLineup(index,lineup) {
        this.loadLineups = true;
        
        this.lineups.splice(index,1);
        let no_of_lineups = this.my_lineup_setup.lineups_range;
        let new_no_of_lineups = this.lineups.length;
        let exposure = 1 / no_of_lineups;
        let new_exposure = 1 / new_no_of_lineups;

        // lineup.map(
        //     (l) => {
        //         let exposure_row_index = this.playerExposures.findIndex(e => e.name === l.name);
        //         let exposure_row_data = this.playerExposures[exposure_row_index];
        //         let value_add_remove = 1 / no_of_lineups;
        //         if(exposure_row_data) {
        //             if((exposure_row_data.final_exp - value_add_remove) < 0.1) {
        //                 this.playerExposures.splice(exposure_row_index,1);
        //             } else {
        //                 this.playerExposures[exposure_row_index].final_exp = this.playerExposures[exposure_row_index].final_exp - value_add_remove;
        //             }
        //         }
        //     }
        // );
        
        // --------------------------------------
        let lu = [].concat.apply([],this.lineups)
        let names = lu.reduce((array,data) => {
            array.push(data.name);
            return array;
         },[]);
        names = names.sort();

        let number_of_occurrences = names.reduce(function (acc, curr) {
            if (typeof acc[curr] == 'undefined') {
              acc[curr] = 1;
            } else {
              acc[curr] += 1;
            }
          
            return acc;
        }, {});
        
        let occurrences_names = Object.keys(number_of_occurrences);
        this.playerExposures = this.playerExposures.filter(pe => occurrences_names.indexOf(pe.name) !== -1)
        // update's the player exposure 
        this.playerExposures.map(d => {
            d.final_exp = number_of_occurrences[d.name] / new_no_of_lineups;
            return d;
        });
        //  update's the lineups player exposure
        this.lineups.map(
            (lineup) => {
                lineup.map(
                    (data) => {
                        data.final_exp = number_of_occurrences[data.name] / new_no_of_lineups;
                        return data;
                    }
                );
                return lineup;
            }
        );
        // ---------------------------------
        // let find_flex = lineup.find(l => l.pos1 === 'FLEX');
        // let player_array = find_flex.player.split(' ');
        // let player_id = player_array[player_array.length-1];
        // let remove_percent_flex = '';
        // if(find_flex) {
        //     let find_player_pos = this.playerPool.find(d => d.player.includes(player_id));
        //     if(find_player_pos) {
        //         if(['RB','WR','TE'].indexOf(find_player_pos.pos1) !== -1) {
        //             if(this.flexPercent.length > 1) {
        //                 this.flexPercent.map(
        //                     (d) => {
        //                         if(d.Postion === find_player_pos.pos1) {
        //                             if((((d.Percentage / exposure) - 1) * new_exposure) < 0.1){
        //                                 remove_percent_flex += d.Postion;
        //                             }
        //                             d.Percentage = ((d.Percentage / exposure) - 1) * new_exposure;
        //                         } else {
        //                             d.Percentage = (d.Percentage / exposure) * new_exposure;
        //                         }
        //                     }
        //                 );
        //             }
        //         }
        //     }
        // }

        // if(remove_percent_flex !== '') {
        //     this.flexPercent = this.flexPercent.filter(fp => fp.Postion !== remove_percent_flex);
        // }

        // $('.flex_datatable').DataTable().destroy();
        $('.lineups_table').DataTable().destroy();
        
        this.updateFlexPercentage(this.lineups);

        setTimeout(()=>{
            $('.lineups_table').DataTable({
                "paging": false,
                "autoWidth": false,
                "ordering": false,
                "searching": false,
                "info": false,
                responsive: true
            });
            this.loadLineups = false;
            // setTimeout(()=>{
            //     $('.flex_datatable').DataTable({
            //         "paging": false,
            //         "autoWidth": false,
            //         "searching": false,
            //         "info": false,
            //         "aaSorting": [1]
            //     });
            // },10);
        },100);
        this.my_lineup_preserved['lineups'] = this.lineups;
        this.my_lineup_preserved['exposure'] = this.playerExposures;
        this.my_lineup_preserved['flex'] = this.flexPercent;
        localStorage.setItem(this.toolService.toolName + ' '+ 'my_lineups', JSON.stringify(this.my_lineup_preserved));
    }

    downloadMyLineups() {
        let headers = ['QB','RB','RB','WR','WR','WR','TE','FLEX','DST'];

        let currentTool = this.toolService.toolDetails[this.toolService.toolName];
        // change 'DST' to 'DEF'
        if(currentTool === 'FD') {
            let lastIndex = headers.length - 1;
            headers[lastIndex] = 'DEF';
        }

        let body = [];

        if(this.lineups.length > 0) {
            for(let data of this.lineups) {
                let row = data.reduce(
                    (new_array,obj) => {
                        let player = obj.player;
                        if(currentTool === 'FD') {
                            let player_name = player.split('(')[0].replace('(','');
                            let player_id = player.split('(')[1].replace('(','').replace(')','');
                            let player_new_format = player_id + ':' + player_name;
                            player = player_new_format;
                        }
                        new_array.push(player);
                        return new_array;
                    } 
                ,[]);
                body.push(row);
            }
        }

        let csvName = "Mylineups_" + new Date().getTime();

        new ngxCsv(body, csvName, {headers: headers});
    }

    selectFlex(decide: string) {
        if(decide === 'y') {
            this.chooseFlex = true;
            this.my_lineup_preserved['selected_flex'] = this.selectedFlex;
            localStorage.setItem(this.toolService.toolName + ' '+ 'my_lineups', JSON.stringify(this.my_lineup_preserved));
        } else {
            this.chooseFlex = false;
            if(this.my_lineup_preserved.selected_flex) {
                delete this.my_lineup_preserved.selected_flex;
                localStorage.setItem(this.toolService.toolName + ' '+ 'my_lineups', JSON.stringify(this.my_lineup_preserved));
            }
        }
    }

    setFlexValues(event: any) {
        let checked = event.target.checked;
        let key = event.target.value;

        if(checked) {
            this.selectedFlex[key] = checked;
        } else {
            this.selectedFlex[key] = false;
        }

        this.my_lineup_preserved['selected_flex'] = this.selectedFlex;
        localStorage.setItem(this.toolService.toolName + ' '+ 'my_lineups', JSON.stringify(this.my_lineup_preserved));
    }

    // addStackRules(player_name) {
    //     event.preventDefault();

    //     if(player_name && player_name !== 'Select') {
    //         this.buildRulesStack.player = player_name;
    //     }

    //     let stack_range = $('.js-range-slider_4')[0].value;
    //     let min = stack_range.split(';')[0];
    //     let max = stack_range.split(';')[1];

    //     this.buildRulesStack.exposure.min = min;
    //     this.buildRulesStack.exposure.max = max;

    //     this.buildRulesStack.pos = [];
    //     this.buildRulesStack.oppos_pos = [];
    
    //     $('.brs-pos_1 tag').each((index,value) => {
    //       let chip_value = value.innerText.replace(/\s+/g,'');
    //       if(chip_value) {
    //           if(this.buildRulesStack.pos.indexOf(chip_value) === -1) {
    //               this.buildRulesStack.pos.push(chip_value);
    //           }
    //       }
    //     });
    
    //     $('.brs-oppos_pos_1 tag').each((index,value) => {
    //         let chip_value = value.innerText.replace(/\s+/g,'');
    //         if(chip_value) {
    //             if(this.buildRulesStack.oppos_pos.indexOf(chip_value) === -1) {
    //                 this.buildRulesStack.oppos_pos.push(chip_value);
    //             }
    //         }
    //     });

    //     this.toolService.savedStackRules = this.buildRulesStack;
    //     // console.log(this.buildRulesStack)
    // }

    removeFromSlate(index) {
        let { pos1, salary, projected_pts, name } = this.lineupData[index];

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

        let lineup = this.toolService.get_preserved_lineup();
        let calculations: any = lineup.lineup_cal;
        
        if(this.lineupDataFromList.length > 0) {
            let current_lineup_count = (this.lineupDataFromList.filter(d => d.name !== '')).length;
            let remaining = calculations.remain + salary;
            let remainingAvg = remaining / (9 - current_lineup_count);
            let projected_points = calculations.point - projected_pts;

            this.disableBML = false;
            this.serverError = '';
            this.toolService.preserve_lineup(this.lineupData, this.lineupDataFromList, remaining, remainingAvg, projected_points, current_lineup_count);
        } else {
            this.toolService.preserve_lineup([], [], 0, 0, 0, 0);
        }

        this.dtElement.dtInstance.then(
            ((dtInstance: DataTables.Api) => {
                dtInstance.destroy();
                this.dtTrigger.next();
            })
        );
    }

    resetSlate() {
        if (this.lineupDataFromList.length > 0) {
            this.lineupData = this.toolService.get_default_lineup();
            this.lineupDataFromList = [];
            this.toolService.preserve_lineup([], [], 0, 0, 0, 0);
            
            this.dtElement.dtInstance.then(
                ((dtInstance: DataTables.Api) => {
                    dtInstance.destroy();
                    this.dtTrigger.next();
                })
            );
        }
    }

    getRangeFilterValue(key) {
        if(key !== 'salary_range') {
            this.my_lineup_setup[key] = $('.'+key)[0].value;
        } else if(key === 'salary_range') {
            let range = ($('.'+key)[0].value).split(';');
            this.my_lineup_setup[key].min = range[0];
            this.my_lineup_setup[key].max = range[1];
        }
        // console.log(this.my_lineup_setup);
        this.my_lineup_preserved['filters'] = this.my_lineup_setup;
        
        localStorage.setItem(this.toolService.toolName + ' '+ 'my_lineups', JSON.stringify(this.my_lineup_preserved));
    }

    saveAOD() {
        if(this.avoid_oppos_def === 'y') {
            this.my_lineup_preserved['AOD'] = this.avoid_oppos_def;
            localStorage.setItem(this.toolService.toolName + ' '+ 'my_lineups', JSON.stringify(this.my_lineup_preserved));
        } else {
            if(this.my_lineup_preserved.AOD) {
               delete this.my_lineup_preserved.AOD;
               localStorage.setItem(this.toolService.toolName + ' '+ 'my_lineups', JSON.stringify(this.my_lineup_preserved));
            }
        }
    }

    sortPlayerExposurePos() {
        this.peso = !this.peso;
        $('.pens').removeClass('sorting_desc');
        $('.pees').removeClass('sorting_desc');
        $('.pens').removeClass('sorting_asc');
        $('.pees').removeClass('sorting_asc');
        $('.pens').addClass('sorting');
        $('.pees').addClass('sorting');
        let sorted_data = [];
        if(this.peso) {
            $('.peps').removeClass('sorting_desc'); 
            $('.peps').addClass('sorting_asc');
            this.ascOrder.map(
                key => {
                    this.playerExposures.map(
                        d => {
                            if(key === d.pos1) {
                                sorted_data.push(d);
                            }
                        }
                    );
                }
            );
        } else {
            $('.peps').removeClass('sorting_asc'); 
            $('.peps').addClass('sorting_desc');
            this.descOrder.map(
                key => {
                    this.playerExposures.map(
                        d => {
                            if(key === d.pos1) {
                                sorted_data.push(d);
                            }
                        }
                    );
                }
            );
        }

        if(sorted_data.length > 0) {
          this.playerExposures = sorted_data;  
        }

        // console.log(this.playerExposures.length, sorted_data.length);
    }

    initial_setup() {
        this.my_lineup_setup.salary_range.min = +this.toolService.salary.min;
        this.my_lineup_setup.salary_range.max = +this.toolService.salary.max;
        // $('.lineups-table-wrap').DataTable({
        //     "paging": false,
        //     "autoWidth": false,
        //     "ordering": false,
        //     "searching": false,
        //     "info": false,
        //     responsive: true,
        //     columnDefs: [
        //         { responsivePriority: 1, targets: 0 },
        //         { responsivePriority: 10001, targets: 2 },
        //         { responsivePriority: 1, targets: -1 },
        //     ]
        // });
        // number of lineups
        $(".js-range-slider").ionRangeSlider({
            grid: true,
            min: 1,
            max: 150,
            from: 10,
            // to: 130,
            prefix: "",
            onFinish: this.getRangeFilterValue.bind(this,'lineups_range')
        });
        // salary range
        $(".js-range-slider_1").ionRangeSlider({
            type: "double",
            grid: true,
            min: 30000,
            max: this.toolService.salary.max,
            from: this.toolService.salary.min,
            to: this.toolService.salary.max,
            prefix: "$",
            onFinish: this.getRangeFilterValue.bind(this,'salary_range')
        });
        // number of unique players 
        $(".js-range-slider_2").ionRangeSlider({
            grid: true,
            min: 0,
            max: 10,
            from: 2,
            // to: 10,
            prefix: "",
            onFinish: this.getRangeFilterValue.bind(this,'unique_range')
        });
        // exposure
        $(".js-range-slider_3").ionRangeSlider({
            grid: true,
            min: 0,
            max: 100,
            from: 100,
            // to: 100,
            postfix: "%",
            onFinish: this.getRangeFilterValue.bind(this,'exposure_range')
        });

        // $(".js-range-slider_4").ionRangeSlider({
        //     type: "double",
        //     grid: true,
        //     min: 0,
        //     max: 100,
        //     from: 0,
        //     to: 100,
        //     postfix: "%"
        // });

        // 

        // $('#second_table').DataTable({
        //     "paging": false,
        //     "autoWidth": false,
        //     "searching": false,
        //     "info": false
        // });
    }

    ngOnDestroy() {
        this.mylineupDtTrigger.unsubscribe();
        if(this.buildMylineupsSubscription) { this.buildMylineupsSubscription.unsubscribe(); }
        // if(this.replaceDataSubscription) { this.replaceDataSubscription.unsubscribe(); }
    }
}
