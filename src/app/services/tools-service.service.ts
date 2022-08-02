import { Injectable, EventEmitter } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ToolsServiceService {

  posFilterTrigger = new EventEmitter();
  clearExposure = new EventEmitter();
  resetAll = new EventEmitter();
  excludeAll = new EventEmitter();
  weekNSlateValues = new EventEmitter();
  slatePickedFromCsv = new EventEmitter();
  popupEvent = new EventEmitter();
  openPlayerPool = new EventEmitter();
  playerListFetchedEvent = new EventEmitter();
  openPopup = new EventEmitter();
  setPos = new EventEmitter();
  poolLoaded = new EventEmitter();

  mylineupsData = {};
  findPlayerTempData = [];
  currentSelectedPos = 'ALL';
  mainSearchVal = '';
  excludeSearchVal = '';
  weekNSlate = {
    week: 0,
    slate: ''
  };
  toolName = '';
  toolShortName = '';
  toolId: any;
  excludePosSort = {
    QB: true, RB: true, WR: true, TE: true, DST: true
  }
  savedStackRules = [];
  savedGroups = [];

  filter_players = {
    proj_range: { min: 0, max: 0, from: 0, to: 0 },
    salary_range: { min: 0, max: 0, from: 0, to: 0 },
    ppd_range: { min: 0, max: 0, from: 0, to: 0 }
  }

  tooltips = {
    'Pos': 'Position Player Plays',
    'Action': 'Lock a player into a lineup using lock icon and a player will be in 100% of lineups created. Exclude a player from the player pool by clicking red “x” and he will be eliminated from player pool',
    'Dev vs Pos': 'The ranking of opponent vs players position',
    'TT': 'Vegas projected points scored by players team',
    'Con': 'Consistency score of a player',
    'PPD': 'A value metric for a player. A players projection points divided by his salary/100',
    'Min': 'Set a players exposure for the minimum percentage of lineups he will be included in',
    'Max': 'Set a players exposure for the maximum percentage of lineups he will be included in'
  }

  lineupsTooltips = {
    salary: 'The minimum and maximum salary when the optimizer is building a lineup. One may set it for less than the maximum if they were looking to differentiate a lineup from competitors. ',
    unique_players: 'Use the setting to determine the minimum number of players who must be different between two lineups. For example, If the number is set at two any two lineups must have at least two unique lineups when comparing them. ',
    exposure: 'The max exposure slider is used to set the maximum allowable exposure to any plan who is not locked. If number is set to 70, than no player shall be on more than 70% of users lineups, with the exception of locked players. ',
    oppos_def: 'No team defense shall be in the same lineup as a player who that defense is opposing that week. ',
    flex: 'Force one or more positions into a flex. For example, if you only choose RB, only running backs will be made available for your flex.',
    stacks: 'This feature can be used to quickly stack positions in the NFL. For example if one selected Patrick Mahomes they could chose to stack him with a WR or TE. They also have the ability to stack the opposing team as well. ',
    groups: 'Group allow you to finetune sets of players who are in your lineups. You can set minimum and maximum exposures for a subset of players. For example you could set Saquon Barkley and Le’Veon Bell to be in 30-50% of your lineups, which would lead to them have to be on the same team in 30-50% of your builds.'
  }

  team_names = [
    'Cardinals', 'Falcons', 'Ravens', 'Bills', 'Panthers', 'Bears', 'Bengals', 'Browns', 'Cowboys', 'Broncos',
    'Lions', 'Packers', 'Texans', 'Colts', 'Jaguars', 'Chiefs', 'Rams', 'Chargers', 'Dolphins', 'Vikings', 'Patriots',
    'Saints', 'Giants', 'Jets', 'Raiders', 'Eagles', 'Steelers', '49ers', 'Seahawks', 'Buccaneers', 'Titans', 'Redskins'
  ]

  private lineupDefaults = [
    { player: '', pos1: 'QB', name: '', salary: '', projected_pts: '', floor: '', ceiling: '' },
    { player: '', pos1: 'RB', name: '', salary: '', projected_pts: '', floor: '', ceiling: '' },
    { player: '', pos1: 'RB', name: '', salary: '', projected_pts: '', floor: '', ceiling: '' },
    { player: '', pos1: 'WR', name: '', salary: '', projected_pts: '', floor: '', ceiling: '' },
    { player: '', pos1: 'WR', name: '', salary: '', projected_pts: '', floor: '', ceiling: '' },
    { player: '', pos1: 'WR', name: '', salary: '', projected_pts: '', floor: '', ceiling: '' },
    { player: '', pos1: 'TE', name: '', salary: '', projected_pts: '', floor: '', ceiling: '' },
    { player: '', pos1: 'FLEX', name: '', salary: '', projected_pts: '', floor: '', ceiling: '' },
    { player: '', pos1: 'DST', name: '', salary: '', projected_pts: '', floor: '', ceiling: '' },
  ];

  private savedLineup = [];
  private savedDataLineup = [];
  private lineup_calculations = {};

  private teamLogos = ["ARI", "ATL", "BAL", "BUF", "CAR", "CHI", "CIN", "CLE", "DAL", "DEN", "DET", "GB", "HOU", "IND", "JAC", "KC", "LAC", "LAR", "MIA", "MIN", "NE", "NO", "NYG", "NYJ", "OAK", "PHI", "PIT", "SEA", "SF", "TB", "TEN", "WAS"];

  remaining: number = 0;
  private playersData: any = [];
  private excludedData = [];
  toolDetails = {
    'dkoptimizer': 'DK',
    'fdoptimizer': 'FD'
  }

  salary = {
    min:0,
    max:0
  }

  slateLineups: any = {
    name: '',
    lineup: [],
    lineupData: []
  }

  filteredPlayerPool: any = [];

  filteredPlayerPoolPos: any = {};

  mylineupsPlayerFetched: boolean = false;
  poolLoadedFromOtherComp: boolean = false;

  constructor(private http: HttpClient, private authService: AuthService) { }

  get_data(given_week = 0, given_slate = '') {

    let week, slate;
    if (given_week === 0 && given_slate === '') {
      week = this.weekNSlate.week;
      slate = this.weekNSlate.slate;
    } else {
      week = given_week;
      slate = given_slate;
    }

    return this.http.get(environment.tool_api_base_url + 'NFL_'+ this.toolDetails[this.toolName] +'_main_table?week=' + week + '&slate=' + slate);
  }

  get_salary() {
    return this.http.get(environment.tool_api_base_url + `NFL_${this.toolDetails[this.toolName]}_min_max`);
  }

  get_injury_data(team) {
    let param = '';

    if (team !== '') {
      param += '?teamname=' + team;
    }

    return this.http.get(environment.tool_api_base_url + 'NFL_Injury' + param);
  }

  get_lineups_tooltip(key) {
    return this.lineupsTooltips[key];
  }

  get_week(toolName: string) {
    return this.http.get(environment.tool_api_base_url + 'NFL_'+ this.toolDetails[toolName] +'_week');
  }

  get_slates(toolName: string) {
    return this.http.get(environment.tool_api_base_url + 'NFL_'+ this.toolDetails[toolName] +'_slates');
  }

  get_nfl_best_bets_game() {
    return this.http.get(environment.tool_api_base_url + 'nfl_best_bets_game');
  }
  get_nba_best_bets_game() {
    return this.http.get(environment.tool_api_base_url + 'nba_best_bets_game');
  }
  get_mlb_best_bets_game() {
    return this.http.get(environment.tool_api_base_url + 'mlb_best_bets_game');
  }

  set_week_n_slate(obj) {
    this.weekNSlate = obj;
  }

  setFilteredPlayerPoolPosData(data, pos) {
    let { slate } = this.weekNSlate;
    this.filteredPlayerPoolPos[slate + pos] = data;
  }

  set_exposure(id, key, value) {
    this.playersData.map(d => {
      let curr_id = d.player.split('(')[1].replace(')', '');
      if (curr_id === id) {
        d[key] = value;
        return d;
      }
      return d;
    });
  }

  get_optimized_data(locked: string, excluded: string) {

    let query_params = 'lineup_num=1'
    query_params += '&setplayers_id=' + locked;

    if (excluded.length !== 0) {
      query_params += '&train_id=' + excluded;
    }

    return this.http.get(environment.tool_api_base_url + 'NFL_'+ this.toolDetails[this.toolName] +'_plumber?' + query_params);
  }

  set_current_selected_pos(name) {
    this.currentSelectedPos = name;
  }

  get_players_name_list(data: any = []) {

    let list = [];
    if (this.playersData.length > 0) {
      list = this.playersData.map(
        (d) => {
          let id = d.player.split('(')[1].replace(')', '');
          return { id: id, name: d.name, salary: d.salary, group_player: d.name + ' - $' + (d.salary).toString(), pos: d.pos1 };
        }
      );

      return list;
    } else {
      list = data.map(
        (d) => {
          let id = d.player.split('(')[1].replace(')', '');
          return { id: id, name: d.name, salary: d.salary, group_player: d.name + ' - $' + (d.salary).toString() };
        }
      );

      return list;
    }

    return [];
  }

  build_my_lineups(body, player_pool, locked_players) {

    let pool_data = this.get_players_list();
    let { slate } = this.weekNSlate;
    let pos_to_filter = ['QB', 'RB', 'WR', 'TE', 'DST'];
    let stored_filtered_pos_names = [];

    // find the data for positions in localstorage
    pos_to_filter.map(pos => {
      let stored_data = this.toolName + ' '+ slate + pos;
      if (localStorage.getItem(stored_data)) {
        stored_filtered_pos_names.push(pos);
        pool_data = pool_data.filter(d => d.pos1 !== pos);
      }
    });

    stored_filtered_pos_names.map(pos => {
      let filtered_pos_data = JSON.parse(localStorage.getItem(this.toolName + ' '+ slate + pos));
      pool_data = pool_data.concat(filtered_pos_data[slate + pos]);
    });

    let new_body = { ...body };
    if (pool_data.length > 0) {
      let player_pool_new = pool_data.map(
        d => {
          return {
            "player": d.player, "pos1": d.pos1, "name": d.name, "team": d.team,
            "OPP": d.OPP, "salary": +d.salary, "PPD": +d.PPD, "projected_pts": +d.projected_pts,
            "floor": +d.floor, "ceiling": +d.ceiling, "time": +d.time,
            "min": d.min ? +d.min : '', "max": d.max ? +d.max : '', "Own": d.Own ? d.Own : ''
          }
        }
      );
      new_body['current_player_pool'] = player_pool_new;
    }

    if (locked_players.length > 0) {
      let locked_players_new = locked_players.map(
        d => {
          return {
            "player": d.player, "pos1": d.pos1, "name": d.name, "team": d.team,
            "OPP": d.OPP, "salary": +d.salary, "PPD": +d.PPD, "projected_pts": +d.projected_pts,
            "floor": +d.floor, "ceiling": +d.ceiling, "time": +d.time,
            "min": d.min ? +d.min : '', "max": d.max ? +d.max : '', "Own": d.Own ? d.Own : ''
          }
        }
      );

      new_body['locked_players'] = locked_players_new;
    }

    return this.http.post(environment.tool_api_base_url + 'v2/opto_NFL_' + this.toolDetails[this.toolName], new_body);
  }

  get_replace_data(data) {
    let query_params = '';

    if (data.id) { query_params += 'edit_id=' + data.id }
    if (data.pos) { query_params += '&edit_pos=' + data.pos }
    query_params += '&slate_rp=' + this.weekNSlate.slate;

    return this.http.get(environment.tool_api_base_url + 'NFL_'+ this.toolDetails[this.toolName] +'_replace?' + query_params);
  }

  optimize(locked_players) {

    let pool_data = this.get_players_list();
    let { slate } = this.weekNSlate;
    let pos_to_filter = ['QB', 'RB', 'WR', 'TE', 'DST'];
    let stored_filtered_pos_names = [];

    // find the data for positions in localstorage
    pos_to_filter.map(pos => {
      let stored_data = this.toolName + ' '+ slate + pos;
      if (localStorage.getItem(stored_data)) {
        stored_filtered_pos_names.push(pos);
        pool_data = pool_data.filter(d => d.pos1 !== pos);
      }
    });

    stored_filtered_pos_names.map(pos => {
      let filtered_pos_data = JSON.parse(localStorage.getItem(this.toolName + ' '+ slate + pos));
      pool_data = pool_data.concat(filtered_pos_data[slate + pos]);
    });

    let player_pool = pool_data.map(
      d => {
        return {
          "player": d.player, "pos1": d.pos1, "name": d.name, "team": d.team,
          "OPP": d.OPP, "salary": +d.salary, "PPD": +d.PPD, "projected_pts": +d.projected_pts,
          "floor": +d.floor, "ceiling": +d.ceiling, "time": +d.time, "min": d.min, "max": d.max, "Own": d.Own ? d.Own : ''
        }
      }
    );

    let locked_players_new = locked_players.map(
      d => {
        return {
          "player": d.player, "pos1": d.pos1, "name": d.name, "team": d.team,
          "OPP": d.OPP, "salary": +d.salary, "PPD": +d.PPD, "projected_pts": +d.projected_pts,
          "floor": +d.floor, "ceiling": +d.ceiling, "time": +d.time, "min": d.min, "max": d.max, "Own": d.Own ? d.Own : ''
        }
      }
    );

    let body = {
      lineup_num: 1,
      current_player_pool: player_pool,
      locked_players: locked_players_new
    }

    return this.http.post(environment.tool_api_base_url + 'NFL_'+ this.toolDetails[this.toolName] +'_plumber', body);

  }

  save_player_pool(data) {
    let body = {
      ...data,
      auth_code: this.authService.getUserDetail().auth_code
    }
    return this.http.post(environment.base_url + 'tool/save_log', body);
  }

  delete_player_pool(data) {
    let body = {
      ...data,
      auth_code: this.authService.getUserDetail().auth_code
    }
    return this.http.post(environment.base_url + 'tool/delete_log', body);
  }

  get_player_pool(tool_id) {
    let body = {
      auth_code: this.authService.getUserDetail().auth_code,
      tool_id: tool_id
    }
    return this.http.post(environment.base_url + 'tool/fetch_log', body);
  }

  player_game_log(player_name) {
    return this.http.get(environment.tool_api_base_url + 'gamelog?playername=' + player_name);
  }

  order_data(columnOrder, data) {
    let temp = data.map(({ game, site, slate, ...elem }) => elem);
    let ordered_data = [];
    temp.map(
      (elem) => {
        let new_data = {};
        columnOrder.map(
          (key) => {
            new_data[key] = elem[key];
          }
        )
        ordered_data.push(new_data);
      }
    );

    return ordered_data
  }

  downloadSlateData() {
    let data = this.playersData.concat(this.excludedData);
    return data;
  }

  get_default_lineup() {
    return [...this.lineupDefaults];
  }

  preserve_lineup(lineup, dataLineup, remain, remainAvg, point, count) {
    this.savedLineup = lineup;
    this.lineup_calculations = { remain: remain, remainAvg: remainAvg, point: point, count: count };
    this.savedDataLineup = dataLineup;
  }

  preserve_mylineup_lineups(lineup, dataLineup) {
    this.savedLineup = lineup;
    this.savedDataLineup = dataLineup;
  }

  preserve_players_filters(key, min, max, from, to) {
    this.filter_players[key]['min'] = min != 0 ? min : this.filter_players[key]['min'];
    this.filter_players[key]['max'] = max != 0 ? max : this.filter_players[key]['max'];
    this.filter_players[key]['from'] = from;
    this.filter_players[key]['to'] = to;
  }

  get_preserved_lineup() {
    let data = {
      lineup: [...this.savedLineup],
      lineup_cal: this.lineup_calculations,
      lineup_data: this.savedDataLineup
    }
    return data;
  }

  reset_player_n_exlude_arr() {
    this.playersData = [];
    this.excludedData = [];
  }

  get_remaining() {
    return this.remaining;
  }

  set_players_list(data) {
    this.playersData = data;
  }

  get_players_list() {
    return [...this.playersData];
  }

  get_excluded_list() {
    // let new_data_excluded = [];
    // // remove duplicates
    // this.excludedData.forEach(elem => {
    //   let find = new_data_excluded.findIndex(d => d.name === elem.name);
    //   if(find === -1) {
    //     new_data_excluded.push(elem)
    //   }
    // });
    // return new_data_excluded;
    return this.excludedData;
  }

  set_excluded_list(data) {
    this.excludedData = data;
  }

  add_in_exluded_array(index, row) {
    this.excludedData.push(row);
    this.playersData = this.playersData.filter(d => d.name !== row.name);
    return [...this.playersData];
  }

  remove_from_exluded_array(index, row) {
    this.playersData.push(row);
    this.excludedData.splice(index, 1);
    return [...this.excludedData];
  }

  exclude_all() {
    this.excludedData = this.excludedData.concat(this.playersData);
    this.playersData = [];
    return [];
  }

  clear_exclude_array() {
    this.playersData = this.playersData.concat(this.excludedData);
    this.excludedData = [];
    return [...this.playersData];
  }

  exclude_by_team_name(team_name) {
    let fetched_data_from_player_pool = this.playersData.filter(d => d.team === team_name);
    this.excludedData = this.excludedData.concat(fetched_data_from_player_pool);
    this.playersData = this.playersData.filter(d => d.team !== team_name);
    return [...this.playersData];
  }

  include_by_team_name(team_name) {
    let fetched_data_from_excluded = this.excludedData.filter(d => d.team === team_name);
    if (fetched_data_from_excluded.length > 0) {
      let new_fetched_data_from_excluded = [];
      // remove duplicates
      fetched_data_from_excluded.forEach(elem => {
        let find = new_fetched_data_from_excluded.findIndex(d => d.name === elem.name);
        if (find === -1) {
          new_fetched_data_from_excluded.push(elem)
        }
      });

      this.playersData = this.playersData.concat(new_fetched_data_from_excluded);
      this.excludedData = this.excludedData.filter(d => d.team !== team_name);
      return [...this.playersData];
    }
    return [];
  }

  add_row_in_players(data) {
    let fetched_data = this.excludedData.filter(d => d.player.split('(')[1].replace(')','') === data.player.split('(')[1].replace(')',''));
    // console.log(fetched_data);
    this.playersData = this.playersData.concat(fetched_data);
    // console.log('i am here');
    // console.log(this.playersData);
    this.excludedData = this.excludedData.filter(d => d.player.split('(')[1].replace(')','') !== data.player.split('(')[1].replace(')',''));
    return [...this.excludedData];
  }

  get_excluded_players_str() {
    let str = '';

    this.excludedData.forEach(
      (elem, index) => {
        let player_id = elem.player.split('(')[1].replace(')', '');
        str += player_id;
        if (index < this.excludedData.length - 1) {
          str += ','
        }
      }
    )

    return str;
  }

  get_locked_players_str(data) {
    let newData = data.filter(d => d.name !== '');
    let str = '';

    newData.forEach(
      (elem, index) => {
        let player_id = elem.player.split('(')[1].replace(')', '');
        str += player_id;
        if (index < newData.length - 1) {
          str += ','
        }
      }
    )

    return str;
  }

  get_team_logos() {
    return [...this.teamLogos];
  }
}
