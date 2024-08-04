import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BestBetsService {
  private BASE_URL = environment.tool_api_base_url;

  constructor(private http: HttpClient) {
  }

  getBestBetsBySport(sport) {
    const url = this.BASE_URL + sport + '_best_bets';
    return this.http.get(url);
  }

  getSummaryTableBySport(sport) {
    const url = this.BASE_URL + sport + '_summary_table';
    return this.http.get(url);
  }

  getCricketTable(league: string) {
    let url;
    switch (league) {
      case 'IPL':
        url = environment.base_url + 'getIPL';
        url = 'assets/cricket_IPL_list.json'
        break;
      case 'T20i':
        url = environment.base_url + 'getT20i';
        url = 'assets/cricket_T20i_list.json'
        break;
      case 'T20 Blast':
        url = environment.base_url + 'getT20_Blast';
        url = 'assets/cricket_T20 Blast_list.json'
        break;

      default:
        url = environment.base_url + 'getIPL';
        url = 'assets/cricket_IPL_list.json'
        break;
    }
    let header = new HttpHeaders({
      'Cache-Control':  'no-cache, no-store, must-revalidate, post- check=0, pre-check=0',
      'Pragma': 'no-cache',
      'Expires': '0',
      // 'Authorization': localStorage.getItem('data') ? `Bearer ${JSON.parse(localStorage.getItem('data'))['jwt_token']}` : ''
    });
    return this.http.get(url, {headers: header});
  }

  getSoccerTable(league: string) {
    let url;
    switch (league) {
      case 'EPL':
        url = environment.base_url + 'getEPL';
        url = 'assets/soccer_EPL_list.json'
        break;
      case 'LA-LIGA':
        url = environment.base_url + 'getLaLiga';
        url = 'assets/soccer_La-Liga_list.json'
        break;
      case 'SerieA':
        url = environment.base_url + 'getSerieA';
        url = 'assets/soccer_Serie-A_list.json'
        break;
      case 'Bundesliga':
        url = environment.base_url + 'getBund';
        url = 'assets/soccer_Bundesliga_list.json'
        break;
      case 'Ligue1':
        url = environment.base_url + 'getLigue1';
        url = 'assets/soccer_Ligue-1_list.json'
        break;
      case 'Super-Lig':
        url = environment.base_url + 'getTurkey';
        url = 'assets/soccer_Super-Lig_list.json'
        break;
      case 'MLS':
        url = environment.base_url + 'getMLS';
        url = 'assets/soccer_MLS_list.json'
        break;
      case 'UEFA-Champ':
        url = environment.base_url + 'getChampionLigue';
        url = 'assets/soccer_Champions-League_list.json'
        break;
      default:
        url = environment.base_url + 'getEPL';
        url = 'assets/soccer_EPL_list.json'
        break;
    }
    let header = new HttpHeaders({
      'Cache-Control':  'no-cache, no-store, must-revalidate, post- check=0, pre-check=0',
      'Pragma': 'no-cache',
      'Expires': '0',
      // 'Authorization': localStorage.getItem('data') ? `Bearer ${JSON.parse(localStorage.getItem('data'))['jwt_token']}` : ''
    });
    return this.http.get(url, {headers: header});
  }

  getIfSoccerTable(league: string) {
    let url;
    switch (league) {
      case 'MLS':
        url = environment.base_url + 'getIfMLS';
        break;
      case 'EPL':
        url = environment.base_url + 'getIfEPL';
        break;
      case 'LA-LIGA':
        url = environment.base_url + 'getIfLaLiga';
        break;
      case 'SerieA':
        url = environment.base_url + 'getIfSerieA';
        break;
      case 'Bundesliga':
        url = environment.base_url + 'getIfBund';
        break;
      case 'Ligue1':
        url = environment.base_url + 'getIfLigue1';
        break;
      case 'Super-Lig':
        url = environment.base_url + 'getIfTurkey';
        break;
      case 'UEFA-Champ':
        url = environment.base_url + 'getIfChampionLigue';
        break;
      default:
        url = environment.base_url + 'getIfEPL';
        break;
    }

    // return this.http.get(url);
    return this.getSoccerTable(league);
  }

  getSoccerTablePublic(league: string) {
    let url;
    switch (league) {
      case 'EPL':
        url = environment.base_url + 'getEPLPublic';
        break;
      case 'LA-LIGA':
        url = environment.base_url + 'getLaLigaPublic';
        break;
      case 'SerieA':
        url = environment.base_url + 'getSerieAPublic';
        break;
      case 'Bundesliga':
        url = environment.base_url + 'getBundPublic';
        break;
      case 'Ligue1':
        url = environment.base_url + 'getLigue1Public';
        break;
      case 'Super-Lig':
        url = environment.base_url + 'getTurkeyPublic';
        break;
      case 'UEFA-Champ':
        url = environment.base_url + 'getChampionLiguePublic';
        break;
      default:
        url = environment.base_url + 'getEPLPublic';
        break;
    }
    // return this.http.get(url);
    return this.getSoccerTable(league);
  }

  getMlbTable() {
    let url = environment.base_url + 'getMlbTable';
    let header = new HttpHeaders({
      'Cache-Control':  'no-cache, no-store, must-revalidate, post- check=0, pre-check=0',
      'Pragma': 'no-cache',
      'Expires': '0',
      // 'Authorization': localStorage.getItem('data') ? `Bearer ${JSON.parse(localStorage.getItem('data'))['jwt_token']}` : ''
    });
    // return this.http.get(url, {headers: header});
    return this.http.get('assets/MLB_list.json', {headers: header});
  }

  getIfMlbTable() {
    let url = environment.base_url + 'getIfMlbTable';
    // return this.http.get(url);
    return this.http.get('assets/MLB_rb_list.json');
  }

  getMlbTablePublic() {
    let url = environment.base_url + 'getMlbTablePublic';
    // return this.http.get(url);
    return this.http.get('assets/MLB_list.json');
  }

  getNbaTable() {
    let url = environment.base_url + 'getNBATable';
    let header = new HttpHeaders({
      'Cache-Control':  'no-cache, no-store, must-revalidate, post- check=0, pre-check=0',
      'Pragma': 'no-cache',
      'Expires': '0',
      // 'Authorization': localStorage.getItem('data') ? `Bearer ${JSON.parse(localStorage.getItem('data'))['jwt_token']}` : ''
    });

    // console.log('header: ' + header.get('Authorization'));

    // return this.http.get(url, {headers: header});
    return this.http.get('assets/NBA_list.json', {headers: header});
  }

  getIfNbaTable() {
    let url = environment.base_url + 'getIfNBATable';
    // return this.http.get(url);
    return this.getNbaTable();
  }

  getNbaTablePublic() {
    let url = environment.base_url + 'getNBATablePublic';
    // return this.http.get(url);
    return this.getNbaTable();
  }

  getNbademoTable() {
    let url = 'https://gengyuanzhang.github.io/data/b4801c8854109e42174fa367db1060339ec55423/NBA_demo.json';
    return this.http.get(url);
  }

  getNflTable() {
    let url = environment.base_url + 'getNflTable';
    let header = new HttpHeaders({
      'Cache-Control':  'no-cache, no-store, must-revalidate, post- check=0, pre-check=0',
      'Pragma': 'no-cache',
      'Expires': '0',
      // 'Authorization': localStorage.getItem('data') ? `Bearer ${JSON.parse(localStorage.getItem('data'))['jwt_token']}` : ''
    });
    // console.log(header);
    // return this.http.get(url, {headers: header});
    return this.http.get('assets/NFL_list.json', {headers: header});
  }

  getIfNflTable() {
    let url = environment.base_url + 'getIfNflTable';
    // return this.http.get(url);
    return this.getNflTable()
    // return this.http.get('assets/NFL_list.json');
  }

  getNflTablePublic() {
    let url = environment.base_url + 'getNflTablePublic';
    // return this.http.get(url);
    return this.http.get('assets/NFL_list.json');
  }

  getnhlTable() {
    let url = environment.base_url + 'getNhlTable';
    let header = new HttpHeaders({
      'Cache-Control':  'no-cache, no-store, must-revalidate, post- check=0, pre-check=0',
      'Pragma': 'no-cache',
      'Expires': '0',
      // 'Authorization': localStorage.getItem('data') ? `Bearer ${JSON.parse(localStorage.getItem('data'))['jwt_token']}` : ''
    });
    // return this.http.get(url, {headers: header});
    return this.http.get('assets/NHL_list.json', {headers: header});
  }

  getIfnhlTable() {
    let url = environment.base_url + 'getIfNhlTable';
    // return this.http.get(url);
    return this.getnhlTable();
  }

  getnhlTablePublic() {
    let url = environment.base_url + 'getNhlTablePublic';
    // return this.http.get(url);
    return this.getnhlTable();
  }

  getcbTable() {
    let url = environment.base_url + 'getCbTable';
    let header = new HttpHeaders({
      'Cache-Control':  'no-cache, no-store, must-revalidate, post- check=0, pre-check=0',
      'Pragma': 'no-cache',
      'Expires': '0',
      // 'Authorization': localStorage.getItem('data') ? `Bearer ${JSON.parse(localStorage.getItem('data'))['jwt_token']}` : ''
    });
    // return this.http.get(url, {headers: header});
    return this.http.get('assets/NCAAB_list.json', {headers: header});
  }

  getIfcbTable() {
    let url = environment.base_url + 'getIfCbTable';

    // return this.http.get(url);
    return this.getcbTable();
  }

  getcbTablePublic() {
    let url = environment.base_url + 'getCbTablePublic';
    // return this.http.get(url);
    return this.getcbTable();
  }

  getcfTable() {
    let url = environment.base_url + 'getCfTable';
    let header = new HttpHeaders({
      'Cache-Control':  'no-cache, no-store, must-revalidate, post- check=0, pre-check=0',
      'Pragma': 'no-cache',
      'Expires': '0',
      // 'Authorization': localStorage.getItem('data') ? `Bearer ${JSON.parse(localStorage.getItem('data'))['jwt_token']}` : ''
    });
    // return this.http.get(url, {headers: header});
    return this.http.get('assets/NCAAF_list.json', {headers: header});
  }

  getIfcfTable() {
    let url = environment.base_url + 'getIfCfTable';

    // return this.http.get(url);
    return this.http.get('assets/NCAAF_list.json');
  }

  getcfTablePublic() {
    let url = environment.base_url + 'getCfTablePublic';
    // return this.http.get(url);
    return this.http.get('assets/NCAAF_list.json');
  }

  getNbaPlayerImpactData() {
    let url = environment.base_url + 'getNbaPlayerImpactData';
    console.log(JSON.parse(localStorage.getItem('data'))['jwt_token']);
    let header = new HttpHeaders({
      'Cache-Control':  'no-cache, no-store, must-revalidate, post- check=0, pre-check=0',
      'Pragma': 'no-cache',
      'Expires': '0',
      // 'Authorization': localStorage.getItem('data') ? `Bearer ${JSON.parse(localStorage.getItem('data'))['jwt_token']}` : ''
    });
    // return this.http.get(url, {headers: header});
    return this.http.get('assets/nba_lineup.json', {headers: header});
  }

  getIFNbaPlayerImpactData() {
    let url = environment.base_url + 'getIFNbaPlayerImpactData';
    // changed on 2023-03-22 by BP
    let header = new HttpHeaders({
      'Cache-Control':  'no-cache, no-store, must-revalidate, post- check=0, pre-check=0',
      'Pragma': 'no-cache',
      'Expires': '0',
      // 'Authorization': localStorage.getItem('data') ? `Bearer ${JSON.parse(localStorage.getItem('data'))['jwt_token']}` : ''
    });
    return this.http.get('assets/nba_lineup.json', {headers: header});
    //return this.getNbaPlayerImpactData();
    //return this.http.get(url);
  }


  getNbaPlayerImpactdemoData() {
    let url = 'https://gengyuanzhang.github.io/data/b4801c8854109e42174fa367db1060339ec55423/nba_lineup_demo.json';
    return this.http.get(url);
  }

  getNflPlayerImpactData() {
    let url = environment.base_url + 'getNflPlayerImpactData';
    let header = new HttpHeaders({
      'Cache-Control':  'no-cache, no-store, must-revalidate, post- check=0, pre-check=0',
      'Pragma': 'no-cache',
      'Expires': '0',
      // 'Authorization': localStorage.getItem('data') ? `Bearer ${JSON.parse(localStorage.getItem('data'))['jwt_token']}` : ''
    });
    // return this.http.get(url, {headers: header});
    return this.http.get('assets/nfl_lineup.json', {headers: header});
  }

  getCricketPlayerImpactData(league) {
    let url = environment.base_url + 'getCricketPlayerImpactData';
    let header = new HttpHeaders({
      'Cache-Control':  'no-cache, no-store, must-revalidate, post- check=0, pre-check=0',
      'Pragma': 'no-cache',
      'Expires': '0',
      // 'Authorization': localStorage.getItem('data') ? `Bearer ${JSON.parse(localStorage.getItem('data'))['jwt_token']}` : ''
    });
    // return this.http.get(url, {headers: header});
    var file = 'T20i.json';
    if(league == 'T20 Blast') {
      file = 'T20 Blast.json';
    }
    return this.http.get('assets/cricket/lineups/' + file, {headers: header});
  }


  getNbaPlayerImpactMeta() {
    let url = environment.base_url + 'getNbaPlayerImpactMeta';
    let header = new HttpHeaders({
      'Authorization': localStorage.getItem('data') ? `Bearer ${JSON.parse(localStorage.getItem('data'))['jwt_token']}` : ''
    });
    return this.http.get(url, {headers: header});
  }

  getNflStanding() {
    let url = environment.base_url + 'getNflStanding';
    let header = new HttpHeaders({
      'Authorization': localStorage.getItem('data') ? `Bearer ${JSON.parse(localStorage.getItem('data'))['jwt_token']}` : ''
    });
    return this.http.get(url, {headers: header});
  }

  getNflPlayerStats(team_id: string) {
    // let url_part_a = "https://www.goalserve.com/getfeed/1bf334ecad7746c3604f08d7bbb9698c/football/"
    // let url_part_b = "_rosters?json=1"
    let url = environment.base_url + `getNflPlayerStats/${team_id}`;
    let header = new HttpHeaders({
      'Authorization': localStorage.getItem('data') ? `Bearer ${JSON.parse(localStorage.getItem('data'))['jwt_token']}` : ''
    });
    return this.http.get(url, {headers: header});
  }

  getNflPlayerImg(id: string) {
    let url = environment.base_url + `getNflPlayerImg/${id}`;
    let header = new HttpHeaders({
      'Authorization': localStorage.getItem('data') ? `Bearer ${JSON.parse(localStorage.getItem('data'))['jwt_token']}` : ''
    });
    return this.http.get(url, {headers: header, responseType: 'text' as 'text'});
  }

  //For pick history tools:
  getNFlPickHistroy() {
    let url = environment.base_url + 'getNFlPickHistroy';
    let header = new HttpHeaders({
      'Authorization': localStorage.getItem('data') ? `Bearer ${JSON.parse(localStorage.getItem('data'))['jwt_token']}` : ''
    });
    return this.http.get(url, {headers: header});
  }

  // For homepage data:
  getHomePageData() {
    // const url = environment.base_url + 'getHomePageData';
    // return this.http.get(url);
    let header = new HttpHeaders({
      'Cache-Control':  'no-cache, no-store, must-revalidate, post- check=0, pre-check=0',
      'Pragma': 'no-cache',
      'Expires': '0',
    });
    return this.http.get('assets/prediction_data.json', {headers: header});
  }


}
