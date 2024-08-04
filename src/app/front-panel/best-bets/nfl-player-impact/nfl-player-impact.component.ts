import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { BestBetsService } from '../best-bets.service';
import { DataService } from '../../../services/data.service';
import { AuthService } from '../../../services/auth.service';
import * as moment from 'moment';
import { environment } from 'src/environments/environment';
declare var require: any;

@Component({
  selector: 'tqe-nfl-player-impact',
  templateUrl: './nfl-player-impact.component.html',
  styleUrls: ['./nfl-player-impact.component.scss']
})
export class NflPlayerImpactComponent implements OnInit {
  isMobile: boolean = false;
  game_logo: string = `../../../../assets/images/nfl/nfl_logo.png`;
  blur_img: string = `../../../../assets/images/nfl/blur_background.png`;
  game_background_img: string = `../../../../assets/images/nfl/nfl_background.png`;
  game_background_mobile_img: string = `../../../../assets/images/nfl/nfl_background_mobile.png`;
  defaultImageURL: string = "../../../../assets/images/Default.png";
  away_team_logo: string = "";
  home_team_logo: string = "";

  selected_teams: string = '';
  selected_match: any;
  selected_players: any;
  s_pred: number;
  t_pred: number;
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
  hasUserSubscribedToProfessionalView: boolean = true;
  playerStats: any[] = [];

  defaultAvgs = {
    'QB': [250, 50, 0],
    'RB': [0, 50, 20],
    'WR': [0, 10, 50],
    'TE': [0, 10, 50],
  }

  constructor(
    private authService: AuthService,
    private dataService: DataService,
    private plumber: BestBetsService,
    private breakpointObserver: BreakpointObserver,
    private http: HttpClient,
  ) { }

  ngOnInit() {
    this.authorizeUser();
    this.breakpointObserver.observe([Breakpoints.Handset]).subscribe(result => {
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
    window.open(environment.tqeLocationOnWhop, '_blank');
  }

  /**
  * Checks if the user has a subscription to the professional view on Whop.
  * @param accessToken - The access token for authenticating with the Whop API.
  * @param type - The view type to set.
  */
  checkUserWhopSubscription(accessToken: string, type: string) {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${accessToken}`,
    });
    this.http.get('https://api.whop.com/api/v5/me/memberships', { headers }).subscribe(
      (response: any) => {
        for (let membership of response.data) {
          if (membership.product_id == environment.professionalViewProductIDOnWhop) {
            this.hasUserSubscribedToProfessionalView = true;
            this.viewType = type;
            this.resetData();
          }
        }
        if (this.viewType == 'Basic') {
          this.subscribeToProfessionalView();
        }
      },
      (error) => {
        console.error('Unable to check User Membership Details...', error);
      }
    );
  }

  /**
  * Set the view type and reset data.
  * @param type - The view type to set.
  */
  setViewType(type: string) {
    if (type === 'Professional') {
      const userData = this.authService.getUserDetail();
      if (userData && 'whop_user_access_token' in userData) {
        this.checkUserWhopSubscription(userData.whop_user_access_token, type);
      }
      else {
        this.subscribeToProfessionalView();
      }
    }
    else {
      this.viewType = type;
      this.resetData();
    }
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
  private formatTime(time: any) {
    return moment(time).format('MMM DD, YYYY hh:mm A');
  }

  /**
   * Authorize user to access the tool.
   */
  private authorizeUser() {
    const isLoggedIn = this.authService.isUserLoggedIn();
    if (isLoggedIn) {
      this.dataService.get_tool("nba-dk-optimizer").subscribe(
        (res: any) => {
          this.isAuthorized = (res.meta.code === 200);
          this.auth_loading = false;
          this.getGameData();
        },
        () => this.handleUnauthorized()
      );
    } else {
      this.handleUnauthorized();
    }
  }

  /**
   * Handle unauthorized access.
   */
  private handleUnauthorized() {
    this.isAuthorized = false;
    this.auth_loading = false;
    this.sortByStartTime();
  }

  /**
   * Reset data for the selected match and players.
   */
  resetData() {
    if (this.selected_players) {
      this.resetPlayerData(this.selected_players.away_lineup);
      this.resetPlayerData(this.selected_players.home_lineup);
      this.updateMatchData();
    }
  }

  /**
   * Reset player data for the given lineup.
   * @param lineup - The lineup to reset.
   */
  private resetPlayerData(lineup: any[]) {
    lineup.forEach(player => {
      player.perf = 50;
      player.profPerfV1 = 50;
      player.profPerfV2 = 50;
      if (player.position === 'QB') {
        const passingYardMin = Math.floor(player.passingYards / 10);
        const passingYardValue = player.passingYards;
        const passingYardMax = this.roundToNearest(Math.ceil(player.passingYards * 2 - passingYardMin), 50);
        const passingYardPercentage = ((passingYardValue - passingYardMin) / (passingYardMax - passingYardMin)) * 100;

        const rushingYardMin = Math.floor(player.rushingYards / 10);
        const rushingYardValue = player.rushingYards;
        const rushingYardMax = this.roundToNearest(Math.ceil(player.rushingYards * 2 - rushingYardMin), 25);
        const rushingYardPercentage = ((rushingYardValue - rushingYardMin) / (rushingYardMax - rushingYardMin)) * 100;

        player.slider1 = {
          name: 'Passing Yard',
          value: passingYardValue,
          min: passingYardMin,
          max: passingYardMax,
          sliderBackground: `linear-gradient(to right, #18CB16 ${passingYardPercentage}%, #999999 ${passingYardPercentage}%)`
        };
        player.slider2 = {
          name: 'Rushing Yard',
          value: rushingYardValue,
          min: rushingYardMin,
          max: rushingYardMax,
          sliderBackground: `linear-gradient(to right, #18CB16 ${rushingYardPercentage}%, #999999 ${rushingYardPercentage}%)`
        };
      } else if (player.position === 'RB') {
        const rushingYardMin = Math.floor(player.rushingYards / 10);
        const rushingYardValue = player.rushingYards;
        const rushingYardMax = this.roundToNearest(Math.ceil(player.rushingYards * 2 - rushingYardMin), 25);
        const rushingYardPercentage = ((rushingYardValue - rushingYardMin) / (rushingYardMax - rushingYardMin)) * 100;

        const receivingYardMin = Math.floor(player.receivingYards / 10);
        const receivingYardValue = player.receivingYards;
        const receivingYardMax = this.roundToNearest(Math.ceil(player.receivingYards * 2 - receivingYardMin), 25);
        const receivingYardPercentage = ((receivingYardValue - receivingYardMin) / (receivingYardMax - receivingYardMin)) * 100;

        player.slider1 = {
          name: 'Rushing Yard',
          value: rushingYardValue,
          min: rushingYardMin,
          max: rushingYardMax,
          sliderBackground: `linear-gradient(to right, #18CB16 ${rushingYardPercentage}%, #999999 ${rushingYardPercentage}%)`
        };
        player.slider2 = {
          name: 'Receiving Yard',
          value: receivingYardValue,
          min: receivingYardMin,
          max: receivingYardMax,
          sliderBackground: `linear-gradient(to right, #18CB16 ${receivingYardPercentage}%, #999999 ${receivingYardPercentage}%)`
        };
      } else if (player.position === 'WR') {
        const receivingYardMin = Math.floor(player.receivingYards / 10);
        const receivingYardValue = player.receivingYards;
        const receivingYardMax = this.roundToNearest(Math.ceil(player.receivingYards * 2 - receivingYardMin), 25);
        const receivingYardPercentage = ((receivingYardValue - receivingYardMin) / (receivingYardMax - receivingYardMin)) * 100;

        const rushingYardMin = Math.floor(player.rushingYards / 10);
        const rushingYardValue = player.rushingYards;
        const rushingYardMax = this.roundToNearest(Math.ceil(player.rushingYards * 2 - rushingYardMin), 25);
        const rushingYardPercentage = ((rushingYardValue - rushingYardMin) / (rushingYardMax - rushingYardMin)) * 100;

        player.slider1 = {
          name: 'Receiving Yard',
          value: receivingYardValue,
          min: receivingYardMin,
          max: receivingYardMax,
          sliderBackground: `linear-gradient(to right, #18CB16 ${receivingYardPercentage}%, #999999 ${receivingYardPercentage}%)`
        };
        player.slider2 = {
          name: 'Rushing Yard',
          value: rushingYardValue,
          min: rushingYardMin,
          max: rushingYardMax,
          sliderBackground: `linear-gradient(to right, #18CB16 ${rushingYardPercentage}%, #999999 ${rushingYardPercentage}%)`
        };
      } else if (player.position === 'TE') {
        const receivingYardMin = Math.floor(player.receivingYards / 10);
        const receivingYardValue = player.receivingYards;
        const receivingYardMax = this.roundToNearest(Math.ceil(player.receivingYards * 2 - receivingYardMin), 25);
        const receivingYardPercentage = ((receivingYardValue - receivingYardMin) / (receivingYardMax - receivingYardMin)) * 100;

        const rushingYardMin = Math.floor(player.rushingYards / 10);
        const rushingYardValue = player.rushingYards;
        const rushingYardMax = this.roundToNearest(Math.ceil(player.rushingYards * 2 - rushingYardMin), 25);
        const rushingYardPercentage = ((rushingYardValue - rushingYardMin) / (rushingYardMax - rushingYardMin)) * 100;

        player.slider1 = {
          name: 'Receiving Yard',
          value: receivingYardValue,
          min: receivingYardMin,
          max: receivingYardMax,
          sliderBackground: `linear-gradient(to right, #18CB16 ${receivingYardPercentage}%, #999999 ${receivingYardPercentage}%)`
        };
        player.slider2 = {
          name: 'Rushing Yard',
          value: rushingYardValue,
          min: rushingYardMin,
          max: rushingYardMax,
          sliderBackground: `linear-gradient(to right, #18CB16 ${rushingYardPercentage}%, #999999 ${rushingYardPercentage}%)`
        };
      }
    });
  }

  /**
   * Update match data based on the selected match.
   */
  private updateMatchData() {
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
      "QB": "QuarterBack",
      "RB": "Running Back",
      "FB": "Fullback",
      "WR": "Wide Receiver",
      "TE": "Tight End",
      "C": "Center",
      "G": "Guard",
      "T": "Tackle",
      "DT": "Defensive Tackle",
      "DE": "Defensive End",
      "MLB": "Middle Linebacker",
      "OLB": "Outside Linebacker",
      "CB": "Cornerback",
      "FS": "Free Safety",
      "SS": "Strong Safety",
      "K": "Kicker",
      "P": "Punter",
      "KOS": "Kickoff Specialist",
      "LS": "Long Snapper",
      "H": "Holder",
      "KR": "Kick Returner",
      "PR": "Punt Returner"
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

  private roundToNearest(num: number, nearNumber: number): number {
    return Math.ceil(num / nearNumber) * nearNumber;
  }
  
  private onPerfChange(player: any, value: number) {
    player.perf = value;
    this.stPredResolver();
    this.pickResolver();
    this.updateProbER();
  }

  private onProfessionalPerfChange(player: any, slider: string) {

    player.slider1.value = Math.min(player.slider1.value, player.slider1.max);
    player.slider2.value = Math.min(player.slider2.value, player.slider2.max);
    let ratio = 1;
    let y1 = 'receiving';
    let y2 = 'rushing';

    if (player.position === 'QB') {
      ratio = player.passingToRushingYardsRatio || 1;
      y1 = 'passing';
    }
    else if (player.position === 'RB') {
      ratio = player.rushingToReceivingYardsRatio || 1;
      y1 = 'rushing';
      y2 = 'receiving';
    }
    else {
      ratio = 1 / player.rushingToReceivingYardsRatio || 1;
    }

    let diff1 = player.slider1.value - player[`${y1}Yards`];
    let diff2 = player.slider2.value - player[`${y2}Yards`];

    let diff1_x_factor = 100 / player[`${y1}Pct`];
    let diff2_x_factor = 100 / player[`${y2}Pct`];

    diff1 *= diff1_x_factor;
    diff2 *= diff2_x_factor;

    player.perfV1 = 50 + (((diff1) / (player.slider1.max - player.slider1.min)) * 100) || 50;
    player.perfV2 = 50 + (((diff2) / (player.slider2.max - player.slider2.min)) * 100) || 50;

    player.perf = player.perfV1 * (ratio / (ratio + 1)) + player.perfV2 * (1 / (ratio + 1));

    this.stPredResolver(true);
    this.pickResolver();
    this.updateProbER();
  }

  /**
   * Calculate s_pred and t_pred based on player performance.
   */
  private stPredResolver(isProfView = false) {
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
  private adjustPredictions(lineup: any[], isAway: boolean, isProfView: boolean) {

    lineup.forEach((player, i) => {
      if (player.perf < 50) {
        let number = +player.pminus;
        if (isProfView) {
          number *= (50 - player.perf) / 50;
        }
        if (isAway) {
          this.s_pred += number;
          this.t_pred -= number;
        } else {

          this.s_pred -= number;
          this.t_pred -= number;
        }
      } else if (player.perf > 50) {
        let number = +player.pplus;
        if (isProfView) { number *= ((player.perf - 50) / 50) };
        if (isAway) {
          this.s_pred -= number;
          this.t_pred += number;
        } else {
          this.s_pred += number;
          this.t_pred += number;
        }
      }
    });
  }

  /**
   * Resolve picks based on s_pred and t_pred.
   */
  private pickResolver() {
    this.s_pick = (this.s_pred > this.selected_match.away_spread) ? this.home_team : this.away_team;
    this.t_pick = (this.t_pred > this.selected_match.OU_line) ? 'over' : 'under';
    this.m_pick = (this.s_pred > 0) ? this.home_team : this.away_team;
  }

  /**
   * Get the corresponding game based on selected teams.
   * @param match - The selected teams.
   * @returns The corresponding game object.
   */
  private getGame(match: string) {
    const teams = match.split(" ", 3);
    this.away_team = teams[0];
    this.home_team = teams[2];
    this.away_team_logo = `../../../../assets/images/logos/nfl/teams/${this.away_team}.svg`;
    this.home_team_logo = `../../../../assets/images/logos/nfl/teams/${this.home_team}.svg`;

    const selectedGame = this.games_today.find(game => game.away_team_abbr === this.away_team);
    this.match_loading = false;
    return selectedGame || null;
  }

  /**
   * Set full names for home and away teams.
   */
  private setTeamFullNames() {
    this.home_team_full_name = (this.selected_match.home_team_first_name + ' ' + this.selected_match.home_team_last_name).trim();
    this.away_team_full_name = (this.selected_match.away_team_first_name + ' ' + this.selected_match.away_team_last_name).trim();
  }

  /**
   * Get player data for the home and away teams.
   * @param match - The selected match.
   * @returns The player data for the home and away teams.
   */
  private getPlayers(match: string) {
    const teams = match.split(" ", 3);
    const away_team = teams[0];
    const home_team = teams[2];

    const awayTeamData = this.matches.find(m => m.team_name === away_team);
    const homeTeamData = this.matches.find(m => m.team_name === home_team);

    return {
      away_team: away_team,
      away_lineup: awayTeamData ? awayTeamData.lineup : [],
      home_team: home_team,
      home_lineup: homeTeamData ? homeTeamData.lineup : []
    };
  }

  /**
   * Resolve player data for the selected match.
   */
  private playerDataResolver() {
    this.selected_players = this.getPlayers(this.selected_teams);
    this.getCurrentGamePlayerStats();
    this.resetPlayerData(this.selected_players.away_lineup);
    this.resetPlayerData(this.selected_players.home_lineup);
    this.setPlayerImages(this.away_team_full_name, this.selected_players.away_lineup);
    this.setPlayerImages(this.home_team_full_name, this.selected_players.home_lineup);
  }

  /**
   * Set player images for the given lineup.
   * @param lineup - The lineup to set images for.
   */
  private setPlayerImages(team, lineup) {
    lineup.forEach(player => {
      player.img = `../../../../assets/images/headshots/nfl/${team}/${player.position}/${player.player_name}.jpg`;
    });
  }

  /**
   * Update slider background based on value.
   * @param team - The team of the player.
   * @param sliderType - The type of slider (passing or rushing).
   * @param player_index - The index of the player in the lineup.
   */
  updateSliderBackground(player): void {
    ['slider1', 'slider2'].forEach(sliderType => {
      const slider = player[`${sliderType}`];
      const slider_percentage = (slider.value - slider.min) / (slider.max - slider.min) * 100;
      player[`${sliderType}`].sliderBackground = `linear-gradient(to right, #18CB16 ${slider_percentage}%, #999999 ${slider_percentage}%)`;
    })
  }

  /**
   * Update probabilities and expected returns for picks.
   */
  private updateProbER() {
    const R = require("j6");
    const sodds = (this.selected_match.spread_pick === "away") ? +this.selected_match.away_odds : +this.selected_match.home_odds;
    const modds = (this.selected_match.moneyline_pick === "away") ? +this.selected_match.away_money : +this.selected_match.home_money;
    const todds = (this.selected_match.total_pick === "over") ? +this.selected_match.over_odds : +this.selected_match.under_odds;
    const oppmodds = (this.selected_match.moneyline_pick === "away") ? +this.selected_match.home_money : +this.selected_match.away_money;

    const sdodds = (sodds > 0) ? (sodds + 100) / 100 : (-100 + sodds) / sodds;
    const mdodds = (modds > 0) ? (modds + 100) / 100 : (-100 + modds) / modds;
    const tdodds = (todds > 0) ? (todds + 100) / 100 : (-100 + todds) / todds;
    const oppmdodds = (oppmodds > 0) ? (oppmodds + 100) / 100 : (-100 + oppmodds) / oppmodds;

    this.sprob = R.pnorm(Math.abs(this.s_pred - (+this.selected_match.away_spread)) / 20);
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

    this.tprob = R.pnorm(Math.abs(this.t_pred - (+this.selected_match.OU_line)) / 20);
    this.tER = tdodds * this.tprob - 1;
  }


  private getCurrentGamePlayerStats() {
    ['away', 'home'].forEach(team => {
      this.selected_players[`${team}_lineup`].forEach(player => {
          player.passingYards = Math.round(player.passingYards) || (this.defaultAvgs[player.position] ? this.defaultAvgs[player.position][0] : 0);
          player.rushingYards = Math.round(player.rushingYards) || (this.defaultAvgs[player.position] ? this.defaultAvgs[player.position][1] : 0);
          player.receivingYards = Math.round(player.receivingYards) || (this.defaultAvgs[player.position] ? this.defaultAvgs[player.position][2] : 0);
          player.passingPct = Math.round(player.passingPct) || 50;
          player.rushingPct = Math.round(player.rushingPct) || 50;
          player.receivingPct = Math.round(player.receivingPct) || 50;
          player.passingToRushingYardsRatio = player.passingToRushingYardsRatio || 1;
          player.rushingToReceivingYardsRatio = player.rushingToReceivingYardsRatio || 1;
          player.passingToRushingAttemptsRatio = player.passingToRushingAttemptsRatio || 1;
          player.rushingToReceivingAttemptsRatio = player.rushingToReceivingAttemptsRatio || 1;
      });
    });
  }

  /**
   * Fetch NFL data and initialize component state.
   */
  private getGameData() {
    this.plumber.getNflTable().subscribe(
      (win: any[]) => {
        this.games = win;
        this.gameWeek = this.games[0].week;
        this.games.forEach(g => {
          g.local_start_time = moment(g.schedule).format('MMM D YYYY, HH:mm');
          g.started = moment(g.schedule).isBefore(moment());
          g.ml_pick = g.ml_pick;
          g.sp_pick = g.spread_pick;
          g.ou_pick = g.total_pick;
          g.s_pred = (Math.ceil((Number(g.spred)) * 1e1) / 1e1);
          g.t_pred = (Math.ceil((Number(g.tpred)) * 1e1) / 1e1);
          if (g.week === this.gameWeek) {
            this.games_today.push(g);
            this.teams.push(`${g.away_team_abbr} - ${g.home_team_abbr}`);
          }
        });
        this.teams.sort();
        this.selected_teams = this.teams[0];
        this.dataService.selectedNFLTeams.subscribe(teams => {
          if (this.teams.includes(teams)) {
            this.selected_teams = teams;
            this.onClickTeamSel(this.selected_teams);
          }
        });
      },
      () => { },
      () => {
        this.plumber.getNflPlayerImpactData().subscribe(
          (res: any[]) => {
            this.matches = res;
            this.playerDataResolver();
          },
          () => { },
        );
        this.selected_match = this.getGame(this.selected_teams);
        this.setTeamFullNames();
      }
    );
  }
}
