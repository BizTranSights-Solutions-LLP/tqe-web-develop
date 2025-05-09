import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { BestBetsService } from '../best-bets.service';
import { DataService } from '../../../services/data.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AuthService } from '../../../services/auth.service';
import * as moment from 'moment';
import { environment } from 'src/environments/environment';
declare var require: any;

@Component({
  selector: 'tqe-nba-player-impact',
  templateUrl: './nba-player-impact.component.html',
  styleUrls: ['./nba-player-impact.component.scss']
})
export class NbaPlayerImpactComponent implements OnInit {
  viewAccessLevel:  string = 'No_Access';
  is_whop_user: boolean = false;
  isMobile: boolean = false;
  game_logo: string = `../../../../assets/images/nba/nba_logo.png`;
  blur_img: string = `../../../../assets/images/nfl/blur_background.png`;
  game_background_img: string = `../../../../assets/images/nba/nba_background.png`;
  game_background_mobile_img: string = `../../../../assets/images/nba/nba_background_mobile.png`;
  defaultImageURL: string = "../../../../assets/images/Default.png";
  away_team_logo: string = "";
  home_team_logo: string = "";

  selected_teams: string = '';
  selected_match: any;
  selected_players: any;
  s_pred: number;
  s_pred_fd: number;
  t_pred: number;
  t_pred_fd: number;
  s_pick: string;
  t_pick: string;
  m_pick: string;
  sprob: number;
  sER: number;
  tprob: number;
  tER: number;
  mprob: number;
  mER: number;
  matches: any[] = [];
  teams: string[] = [];
  away_team: string = '';
  home_team: string = '';
  away_team_full_name: string = '';
  home_team_full_name: string = '';
  active_team = 'away';
  games: any[] = [];
  games_today: any[] = [];
  auth_loading: boolean = true;
  match_loading: boolean = true;
  isAuthorized: boolean = false;
  gameWeek: string = '';
  sortBy: string = 'rating';
  sortDir: any = { 'rating': true, 'time': false };
  viewType: string = "Basic";

  GLOBAL_MAX_POINTS: number = 15;
  GLOBAL_MAX_ASSISTS: number = 7;
  GLOBAL_MAX_REBOUNDS: number = 6;


  constructor(
    protected authService: AuthService,
    protected dataService: DataService,
    protected plumber: BestBetsService,
    protected breakpointObserver: BreakpointObserver,
    protected http: HttpClient,
    protected sanitizer: DomSanitizer,
    protected route: ActivatedRoute
  ) { }

  layout_explanation_pdf: SafeResourceUrl;
  player_performance_change_pdf: SafeResourceUrl;

  sanitizeUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  ngOnInit() {
    this.authorizeUser();
    this.layout_explanation_pdf = this.sanitizeUrl('../../assets/images/how-tqe-works/how-to-understand-player-impact-tool-layout.pdf');
    this.player_performance_change_pdf = this.sanitizeUrl('../../assets/images/how-tqe-works/how-to-change-player-performance-in-player-impact-tool.pdf');
    this.breakpointObserver.observe([Breakpoints.Handset, Breakpoints.Tablet]).subscribe(result => {
      this.isMobile = result.matches;
    });
    this.setViewType(this.viewType);
  }

  abs(val: number) {
    return Math.abs(val);
  }

  /**
   * Redirects the user to the professional view location.
   */
  subscribeToProfessionalView() {
    if (this.is_whop_user) {
      window.open(environment.tqeLocationOnWhop, '_blank');
    }
    else {
      this.authService.redirectToMembershipPlans('Professional');
    }
  }

  /**
  * Set the view type and reset data.
  * @param type - The view type to set.
  */
  setViewType(type: string) {
    this.viewType = type;
    this.resetData();
  }

  /**
   * Sort games by start time.
   */
  public sortByStartTime() {
    this.sortBy = 'time';
    this.games.sort((a, b) => moment(a.Schedule).valueOf() - moment(b.Schedule).valueOf());
    if (this.sortDir[this.sortBy]) {
      this.games.reverse();
    }
    this.sortDir[this.sortBy] = !this.sortDir[this.sortBy];
  }

  /**
   * Set default image for broken images.
   * @param event - The event triggered when an image fails to load.
   */
  setDefaultImage(event: Event) {
    const targetElement = event.target as HTMLImageElement;
    targetElement.src = this.defaultImageURL;
  }

  /**
   * Format time to a readable string.
   * @param time - The time to format.
   * @returns Formatted time string.
   */
  protected formatTime(time: any) {
    return moment(time).format('MMM DD, YYYY hh:mm A');
  }

  /**
   * Authorize user to access the tool.
   */
  protected authorizeUser() {    
    let accessLevelAndUserType = this.route.snapshot.data['accessLevelAndUserType'];
    this.viewAccessLevel = accessLevelAndUserType['viewAccessLevel'];
    this.is_whop_user = accessLevelAndUserType['isWhopUser'];
    if (this.viewAccessLevel === 'Basic' || this.viewAccessLevel === 'Professional') {
      this.isAuthorized = true;
      this.viewType = this.viewAccessLevel;
      this.getGameData();
    }
    else {
      this.isAuthorized = false;
    }
    this.auth_loading = false;
  }

  /**
   * Reset data for the selected match and players.
   */
  resetData() {
    this.resetPlayerData(this.selected_players.away_lineup);
    this.resetPlayerData(this.selected_players.home_lineup);
    this.updateMatchData();
  }

  /**
   * Reset player data for the given lineup.
   * @param lineup - The lineup to reset.
   */
  protected resetPlayerData(lineup: any[]) {
    lineup.forEach(player => {
      // Slider 1 - Points
      const slider1Value = Math.ceil(player.current_stats.points);
      const slider1Min = Math.ceil(player.current_stats.min_points);
      const slider1Max = Math.max(Math.ceil(player.current_stats.max_points), this.GLOBAL_MAX_POINTS);
      const slider1Percent = Math.min(100, Math.max(0, ((slider1Value - slider1Min) / (slider1Max - slider1Min)) * 100)); 
      player.initialPerfV1 =  slider1Percent, 
      player.initialValue1 = slider1Value;

      player.slider1 = {
        name: 'Points',
        value: slider1Value,
        min: slider1Min,
        max: slider1Max,
        sliderBackground: `linear-gradient(to right, #18CB16 ${slider1Percent}%, #999999 ${slider1Percent}%)`
      };
  
      // Slider 2 - Assists
      const slider2Value = Math.ceil(player.current_stats.assists);
      const slider2Min = Math.ceil(player.current_stats.min_assists);
      const slider2Max = Math.max(Math.ceil(player.current_stats.max_assists), this.GLOBAL_MAX_ASSISTS);
      const slider2Percent = Math.min(100, Math.max(0, ((slider2Value - slider2Min) / (slider2Max - slider2Min)) * 100));  
      player.initialPerfV2 =  slider2Percent,
      player.initialValue2 = slider2Value;

      player.slider2 = {
        name: 'Assists',
        value: slider2Value,
        min: slider2Min,
        max: slider2Max,
        sliderBackground: `linear-gradient(to right, #18CB16 ${slider2Percent}%, #999999 ${slider2Percent}%)`
      };

      // Slider 3 - Assists
      const slider3Value = Math.ceil(player.current_stats.rebounds);
      const slider3Min = Math.ceil(player.current_stats.min_rebounds);
      const slider3Max = Math.max(Math.ceil(player.current_stats.max_rebounds), this.GLOBAL_MAX_REBOUNDS);
      const slider3Percent = Math.min(100, Math.max(0, ((slider3Value - slider3Min) / (slider3Max - slider3Min)) * 100));  
      player.initialPerfV3 =  slider3Percent,
      player.initialValue3 = slider3Value;

      player.slider3 = {
        name: 'Rebounds',
        value: slider3Value,
        min: slider3Min,
        max: slider3Max,
        sliderBackground: `linear-gradient(to right, #18CB16 ${slider3Percent}%, #999999 ${slider3Percent}%)`
      };
      player.initialPerf = player.initialPerfV1 * (3/6) + player.initialPerfV2 * (2/6) + player.initialPerfV3 * (1/6);
      if (this.viewType === 'Professional') {
        player.perf = player.initialPerf;
      }
      else {
        player.perf = 50;
      }
      
    });
  }

  /**
   * Update match data based on the selected match.
   */
  protected updateMatchData() {
    this.s_pred = this.selected_match.s_pred;
    this.t_pred = this.selected_match.t_pred;
    this.s_pick = (this.selected_match.spread_pick === 'away') ? this.away_team : this.home_team;
    this.t_pick = this.selected_match.total_pick;
    this.m_pick = (this.selected_match.moneyline_pick === 'away') ? this.away_team : this.home_team;
    this.sprob = this.selected_match.spick_prob;
    this.sER = this.selected_match.spick_ER;
    this.tprob = this.selected_match.tpick_prob;
    this.tER = this.selected_match.tpick_ER;
    this.mprob = this.selected_match.mpick_prob;
    this.mER = this.selected_match.mpick_ER;
  }

  /**
   * Handle team selection change.
   * @param teams - The selected teams.
   */
  onClickTeamSel(teams: string) {
    this.match_loading = true;
    this.selected_teams = teams;
    this.selected_match = this.getGame(this.selected_teams);
    this.setTeamFullNames();
    this.playerDataResolver();
    this.resetData();
  }

  /**
   * Get full name for a given position abbreviation.
   * @param pos - The position abbreviation.
   * @returns The full name of the position.
   */
  full_name_for_position(pos: string): string {
    const positions: { [key: string]: string } = {
        "PG": "Point Guard",
        "SG": "Shooting Guard",
        "SF": "Small Forward",
        "PF": "Power Forward",
        "C": "Center"
    };
    return positions[pos] || "Unknown Position";
  }

  /**
   * Show the selected team.
   * @param team - The team to show.
   */
  showTeam(team: string) {
    this.active_team = team;
  }

  protected roundToNearest(num: number, nearNumber: number): number {
    return Math.ceil(num / nearNumber) * nearNumber;
  }

  protected onPerfChange(player: any, value: number) {
    player.perf = value;
    this.stPredResolver();
    this.pickResolver();
    this.updateProbER();
  }

  protected onProfessionalPerfChange(player: any, slider: string) {

    let v1impact = 3/6;
    let v2impact = 2/6;
    let v3impact = 1/6;

    player.slider1.value = Math.min(player.slider1.value, player.slider1.max);
    player.slider2.value = Math.min(player.slider2.value, player.slider2.max);

    let diff1 = player.slider1.value - player.initialValue1;
    let diff2 = player.slider2.value - player.initialValue2;
    let diff3 = player.slider3.value - player.initialValue3;

    player.perfV1 = player.initialPerfV1 + (((diff1) / (player.slider1.max - player.slider1.min)) * 100);
    player.perfV2 = player.initialPerfV2 + (((diff2) / (player.slider2.max - player.slider2.min)) * 100);
    player.perfV3 = player.initialPerfV3 + (((diff3) / (player.slider3.max - player.slider3.min)) * 100);

    player.perf = player.perfV1 * v1impact + player.perfV2 * v2impact + player.perfV3 * v3impact;

    this.stPredResolver(true);
    this.pickResolver();
    this.updateProbER();
  }
  
  /**
   * Calculate s_pred and t_pred based on player performance.
   */
  protected stPredResolver(isProfView = false) {
    this.s_pred = this.selected_match.s_pred;
    this.t_pred = this.selected_match.t_pred;

    this.adjustPredictions(this.selected_players.away_lineup, true, isProfView);
    this.adjustPredictions(this.selected_players.home_lineup, false, isProfView);
  }

  /**
   * Adjust predictions based on player performance.
   * @param lineup - The lineup of players.
   * @param isAway - Whether the lineup is for the away team.
   */
  protected adjustPredictions(lineup: any[], isAway: boolean, isProfView: boolean) {

    lineup.forEach((player, i) => {
      let bound_value = 50;
      if (isProfView) {
        bound_value = player.initialPerf;
      }
      if (player.perf < bound_value) {
        let number = +player.pminus;
        if (isProfView) {
          number *= (bound_value - player.perf) / bound_value;
        }
        if (isAway) {
          this.s_pred += number;
          this.t_pred -= number;
        } else {
          this.s_pred -= number;
          this.t_pred -= number;
        }
      } else if (player.perf > bound_value) {
        let number = +player.pplus;
        if (isProfView) { 
          number *= ((player.perf - bound_value) / bound_value)
        }
        if (isAway) {
          this.s_pred -= number;
          this.t_pred += number;
        } else {
          this.s_pred += number;
          this.t_pred += number;
        }
      }
    });
    this.s_pred_fd = this.selected_match.s_pred + (this.s_pred - this.selected_match.s_pred) * 2.1
    this.t_pred_fd = this.selected_match.t_pred + (this.t_pred - this.selected_match.t_pred) * 3.1
  }

  /**
   * Resolve picks based on s_pred and t_pred.
   */
  protected pickResolver() {
    this.s_pick = (this.s_pred > this.selected_match.away_spread) ? this.home_team : this.away_team;
    this.t_pick = (this.t_pred > this.selected_match.OU_line) ? 'over' : 'under';
    this.m_pick = (this.s_pred > 0) ? this.home_team : this.away_team;
  }

  /**
   * Get the corresponding game based on selected teams.
   * @param match - The selected teams.
   * @returns The corresponding game object.
   */
  protected getGame(match: string) {
    const teams = match.split(" ", 3);
    this.away_team = teams[0];
    this.home_team = teams[2];

    const selectedGame = this.games_today.find(game => game.away_team_abbr === this.away_team && game.home_team_abbr === this.home_team);
    if (selectedGame) {
      selectedGame.spick_prob = selectedGame.s_prob;
      selectedGame.mpick_prob = selectedGame.m_prob;
      selectedGame.tpick_prob = selectedGame.t_prob;
    }
    this.match_loading = false;
    return selectedGame || null;
  }

  /**
   * Set full names for home and away teams.
   */
  protected setTeamFullNames() {
    this.home_team_full_name = (this.selected_match.home_team_first_name + ' ' + this.selected_match.home_team_last_name).trim();
    this.away_team_full_name = (this.selected_match.away_team_first_name + ' ' + this.selected_match.away_team_last_name).trim();
    this.away_team_logo = `../../../../assets/images/logos/nba/${this.away_team}.png`;
    this.home_team_logo = `../../../../assets/images/logos/nba/${this.home_team}.png`;
  }

  /**
   * Get player data for the home and away teams.
   * @param match - The selected match.
   * @returns The player data for the home and away teams.
   */
  protected getPlayers(match: string) {
    const teams = match.split(" ", 3);
    const away_team = teams[0];
    const home_team = teams[2];

    const playersData = this.matches.find(m => m.away_team === away_team && m.home_team === home_team);

    return {
      away_team: away_team,
      away_lineup: playersData ? playersData.away_lineup : [],
      home_team: home_team,
      home_lineup: playersData ? playersData.home_lineup : []
    };
  }

  /**
   * Resolve player data for the selected match.
   */
  protected playerDataResolver() {
    this.selected_players = this.getPlayers(this.selected_teams);
    this.resetPlayerData(this.selected_players.away_lineup);
    this.resetPlayerData(this.selected_players.home_lineup);
    this.setPlayerImages(this.away_team_full_name, this.selected_players.away_lineup);
    this.setPlayerImages(this.home_team_full_name, this.selected_players.home_lineup);
  }

  /**
   * Set player images for the given lineup.
   * @param lineup - The lineup to set images for.
   */
  protected setPlayerImages(team: string, lineup: any[]) {
    lineup.forEach(player => {
      player.img = `../../../../assets/images/headshots/nba/${team}/${player.player_name}.png`;
    });
  }

  /**
   * Update slider background based on value.
   * @param team - The team of the player.
   * @param sliderType - The type of slider (passing or rushing).
   * @param player_index - The index of the player in the lineup.
   */
  updateSliderBackground(player): void {
    ['slider1', 'slider2', 'slider3'].forEach(sliderType => {
      const slider = player[`${sliderType}`];
      const slider_percentage = (slider.value - slider.min) / (slider.max - slider.min) * 100;
      player[`${sliderType}`].sliderBackground = `linear-gradient(to right, #18CB16 ${slider_percentage}%, #999999 ${slider_percentage}%)`;
    })
  }
  /**
   * Update probabilities and expected returns for picks.
   */
  protected updateProbER() {
    const R = require("j6");
    const sodds = (this.selected_match.spread_pick === "away") ? +this.selected_match.away_odds : +this.selected_match.home_odds;
    const modds = (this.selected_match.moneyline_pick === "away") ? +this.selected_match.away_money : +this.selected_match.home_money;
    const todds = (this.selected_match.total_pick === "over") ? +this.selected_match.over_odds : +this.selected_match.under_odds;
    const oppmodds = (this.selected_match.moneyline_pick === "away") ? +this.selected_match.home_money : +this.selected_match.away_money;

    const sdodds = (sodds > 0) ? (sodds + 100) / 100 : (-100 + sodds) / sodds;
    const mdodds = (modds > 0) ? (modds + 100) / 100 : (-100 + modds) / modds;
    const tdodds = (todds > 0) ? (todds + 100) / 100 : (-100 + todds) / todds;
    const oppmdodds = (oppmodds > 0) ? (oppmodds + 100) / 100 : (-100 + oppmodds) / oppmodds;
    this.sprob = this.selected_match.s_prob - 0.5 + ((this.selected_match.spread_pick == "away") ? R.pnorm((this.selected_match.away_spread - this.s_pred) / 10) : R.pnorm((this.s_pred - this.selected_match.away_spread) / 10))
    if (this.sprob > 1) {
      this.sprob = 1;
    }
    this.sER = sdodds * this.sprob - 1;
    this.mprob = R.pnorm(Math.abs(this.s_pred - 0) / 20);
    this.mER = mdodds * this.mprob - 1;

    const oppmprob = 1 - this.mprob;
    const oppmER = oppmdodds * oppmprob - 1;

    if (this.mER < oppmER) {
      this.m_pick = (this.m_pick === this.away_team) ? this.home_team : this.away_team;
      this.mprob = oppmprob;
      this.mER = oppmER;
    }

    this.tprob = (this.selected_match.total_pick == "over") ? R.pnorm((this.t_pred - this.selected_match.OU_line) / 10) : R.pnorm((this.selected_match.OU_line - this.t_pred) / 10)
    if (this.tprob > 1) {
      this.tprob = 1;
    }
    this.tER = tdodds * this.tprob - 1;
  }

  /**
   * Fetch NBA data and initialize component state.
   */
  protected getGameData() {
    this.plumber.getNbaTable().subscribe(
      (win: any[]) => {
        this.games = win;
        this.gameWeek = this.games[0].week;
        this.games.forEach(g => {
          g.local_start_time = moment(g.schedule).format('MMM D YYYY, HH:mm');
          g.started = moment(g.schedule).isBefore(moment());
          g.ml_pick = g.moneyline_pick;
          g.sp_pick = g.spread_pick;
          g.ou_pick = g.total_pick;
          g.s_pred = -g.s_pred;
          g.t_pred = g.t_pred;
          g.spick_ER = g.sER;
          g.mpick_ER = g.mER;
          g.tpick_ER = g.tER;
          if (g.week === this.gameWeek) {
            this.games_today.push(g);
            this.teams.push(`${g.away_team_abbr} - ${g.home_team_abbr}`);
          }
        });
        this.teams.sort();
        this.selected_teams = this.teams[0];
        this.dataService.selectedNBATeams.subscribe(teams => {
          if (this.teams.includes(teams)) {
            this.selected_teams = teams;
            this.onClickTeamSel(this.selected_teams);
          }
        });
      },
      () => { },
      () => {
        this.plumber.getNbaPlayerImpactData().subscribe(
          (res: any[]) => {
            this.matches = res;
            this.playerDataResolver();
            this.resetData();
          },
          () => { },
        );
        this.selected_match = this.getGame(this.selected_teams);
        this.setTeamFullNames();
      }
    );
  }
}
