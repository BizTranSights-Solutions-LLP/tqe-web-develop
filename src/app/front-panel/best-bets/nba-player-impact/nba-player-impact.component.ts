import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
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
  hasUserSubscribedToProfessionalView: boolean = false;

  constructor(
    protected authService: AuthService,
    protected dataService: DataService,
    protected plumber: BestBetsService,
    protected breakpointObserver: BreakpointObserver,
    protected http: HttpClient,
    protected sanitizer: DomSanitizer
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
    this.breakpointObserver.observe([Breakpoints.Handset]).subscribe(result => {
      this.isMobile = result.matches;
    });
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
        this.viewType = type;
        this.resetData();
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
  protected formatTime(time: any) {
    return moment(time).format('MMM DD, YYYY hh:mm A');
  }

  /**
   * Authorize user to access the tool.
   */
  protected authorizeUser() {
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
  protected handleUnauthorized() {
    this.isAuthorized = false;
    this.auth_loading = false;
    this.sortByStartTime();
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
      player.perf = 50;
      player.passingYard = 275;
      player.rushingYard = 275;
      player.passingYardSliderBackground = 'linear-gradient(to right, #18CB16 50%, #999999 50%)';
      player.rushingYardSliderBackground = 'linear-gradient(to right, #18CB16 50%, #999999 50%)';
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
   * Show the selected team.
   * @param team - The team to show.
   */
  showTeam(team: string) {
    this.active_team = team;
  }

  protected onPerfChange(player: any, value: number) {
    player.perf = value;
    this.stPredResolver();
    this.pickResolver();
    this.updateProbER();
  }

  /**
   * Calculate s_pred and t_pred based on player performance.
   */
  protected stPredResolver() {
    this.s_pred = this.selected_match.s_pred;
    this.t_pred = this.selected_match.t_pred;

    this.adjustPredictions(this.selected_players.away_lineup, true);
    this.adjustPredictions(this.selected_players.home_lineup, false);
  }

  /**
   * Adjust predictions based on player performance.
   * @param lineup - The lineup of players.
   * @param isAway - Whether the lineup is for the away team.
   */
  protected adjustPredictions(lineup: any[], isAway: boolean) {
    lineup.forEach((player, i) => {
      const number = +player.pminus;
      if (player.perf === 0) {
        if (isAway) {
          this.s_pred += number;
          this.t_pred -= number;
        } else {
          this.s_pred -= number;
          this.t_pred -= number;
        }
      } else if (player.perf === 100) {
        const number = +player.pplus;
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
  updateSliderBackground(team: string, sliderType: string, player_index: number): void {
    const player = team === "away" ? this.selected_players.away_lineup[player_index] : this.selected_players.home_lineup[player_index];
    const value = (player[`${sliderType}Yard`] - 50) / (500 - 50) * 100;
    player[`${sliderType}YardSliderBackground`] = `linear-gradient(to right, #18CB16 ${value}%, #999999 ${value}%)`;
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

    this.sprob = (this.selected_match.spread_pick == "away") ? R.pnorm((this.selected_match.away_spread - this.s_pred) / 10) : R.pnorm((this.s_pred - this.selected_match.away_spread) / 10)
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
          g.s_pred = g.s_pred;
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
