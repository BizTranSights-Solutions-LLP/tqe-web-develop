import { Component, OnInit, ViewChild, AfterViewInit, ElementRef, NgZone, ChangeDetectorRef } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { ToolsServiceService } from '../../../services/tools-service.service';

declare var $;

@Component({
  selector: 'app-excluded',
  templateUrl: './excluded.component.html',
  styleUrls: ['./excluded.component.css']
})
export class ExcludedComponent implements OnInit, AfterViewInit {

  @ViewChild(DataTableDirective) dtElement: DataTableDirective;
  @ViewChild('posAll') posAll: ElementRef;
  dtOptions: DataTables.Settings = {};

  dtTrigger: Subject<any> = new Subject();

  checkAll:boolean = true;
  uncheckAll: boolean = true;
  submitSearch: boolean = false;
  keyupSearch: boolean = false;
  
  excludedData: any = [];
  excludedDataTemp: any = [];
  teamLogos = [];

  private fetchedTeam = [];
  
  filterBySelectedPos: Array<string> = ['QB','RB','WR','TE','DST'];
  findPlayerTimeout: any;

  constructor(private toolService:ToolsServiceService,private ngZone:NgZone, private cd: ChangeDetectorRef) { }

  async ngOnInit() {

    this.dtOptions = {
      order: [],
      paging: false,
      searching: false,
      info: false
    };
    
    this.excludedData = this.toolService.get_excluded_list();
    this.excludedDataTemp = this.toolService.get_excluded_list();

    let pos_sort = false;
    Object.values(this.toolService.excludePosSort).map(
      d => {
        if(d === false) {
          this.checkAll = false;
          this.uncheckAll = false;
          pos_sort = true;
        }
      }
    );
    
    if(pos_sort) {
      let keys = Object.keys(this.toolService.excludePosSort);
      let filter_by_pos = [];
      keys.map(d => {
        if(this.toolService.excludePosSort[d]) {
          filter_by_pos.push(d);
        }
      })
      this.filterBySelectedPos = filter_by_pos;
      setTimeout(()=>{
        keys.map(k => {
          if(this.toolService.excludePosSort[k]) {
            $('.'+k).prop("checked",true);
          }
        });
        if(this.filterBySelectedPos.length > 0) {
          this.excludedData = this.excludedData.filter(
            (d) => {
              if(this.filterBySelectedPos.indexOf(d.pos1) > -1) {
                return d;
              }
            }
          );
        }
        this.dtTrigger.next();
      },10);
    }
    // let data:any = [];
    let player_list = this.toolService.get_players_list();
    
    if(player_list.length !== 0) {
      let data = player_list.map(d => d.team);
      this.fetchedTeam = data.sort().filter(function(item, pos, ary) {
        return !pos || item != ary[pos - 1];
      }); 
      let teamLogos = this.toolService.get_team_logos();
      let teamLogosWithStatus = [];
      teamLogos.map(
          logo => {
              let response = this.includedTeams(logo);
              let data = {};
              data['logo'] = logo;
              data['status'] = response;
              teamLogosWithStatus.push(data);
          }
      );
      if(teamLogosWithStatus.length > 0) {
          this.teamLogos = teamLogosWithStatus;
      }
    }

    if(player_list.length === 0 && this.excludedData.length === 0){
      try{
        let data:any = await this.toolService.get_data().toPromise();
        
        data.map(
          d => {
            d['min'] = '';
            d['max'] = '';
            return d;
          }
        );
        
        this.toolService.set_players_list(data);
        this.toolService.poolLoadedFromOtherComp = true;
        data = data.map(d => d.team);
        this.fetchedTeam = data.sort().filter(function(item, pos, ary) {
          return !pos || item != ary[pos - 1];
        });
        
        let teamLogos = this.toolService.get_team_logos();
        let teamLogosWithStatus = [];
        teamLogos.map(
            logo => {
                let response = this.includedTeams(logo);
                let data = {};
                data['logo'] = logo;
                data['status'] = response;
                teamLogosWithStatus.push(data);
            }
        );
        if(teamLogosWithStatus.length > 0) {
            this.teamLogos = teamLogosWithStatus;
        }
      }catch(e){}
    }

    if(player_list.length === 0) {
      let teamLogos = this.toolService.get_team_logos();
      let teamLogosWithStatus = [];
      teamLogos.map(
          logo => {
              let response = this.includedTeams(logo);
              let data = {};
              data['logo'] = logo;
              data['status'] = response;
              teamLogosWithStatus.push(data);
          }
      );
      if(teamLogosWithStatus.length > 0) {
          this.teamLogos = teamLogosWithStatus;
      }
    }
    if(!pos_sort){
      setTimeout(() => {
        this.dtTrigger.next();
      }, 10);
    }
  }

  ngAfterViewInit() {}

  includedTeams(team_name): boolean {
    // console.log(109);
    if(this.fetchedTeam.indexOf(team_name) === -1) {
      return false;
    }else{
      return true;
    }
  }

  include(data) {
    let { slate } = this.toolService.weekNSlate;
    localStorage.removeItem(this.toolService.toolName + ' ' + slate + ' filters');
    this.excludedData = this.toolService.add_row_in_players(data);
    this.excludedDataTemp = this.excludedData;

    let stored_exluded: any = localStorage.getItem(this.toolService.toolName + ' '+ slate + ' excluded');

    if(stored_exluded) {
    stored_exluded = JSON.parse(stored_exluded);
    stored_exluded = stored_exluded.filter(id => id !== data.player.split('(')[1].replace(')',''));
    }
    localStorage.setItem(this.toolService.toolName + ' '+ slate + ' excluded', JSON.stringify(stored_exluded));

    if(this.filterBySelectedPos.length > 0) {
      this.excludedData = this.excludedData.filter(
        (d) => {
          if(this.filterBySelectedPos.indexOf(d.pos1) > -1) {
            return d;
          }
        }
      );
    }

    let storedDataForPositionKey = `${this.toolService.toolName} ${slate}${data.pos1}`;
    if(localStorage.getItem(storedDataForPositionKey)) {
      let stored_data_for_pos = JSON.parse(localStorage.getItem(storedDataForPositionKey));
      let stored_data = stored_data_for_pos[`${slate}${data.pos1}`];
      stored_data.push(data);
      localStorage.setItem(storedDataForPositionKey, JSON.stringify({[`${slate}${data.pos1}`]:stored_data}))
    }
      
    $('.check_'+data.team).prop("checked",true);
    this.rerender();
  }

  includeAll() {
    this.toolService.clear_exclude_array();
    this.excludedData = [];
    this.excludedDataTemp = this.excludedData;
    let data = this.toolService.get_players_list().map(d => d.team);
    this.fetchedTeam = data.sort().filter(function(item, pos, ary) {
      return !pos || item != ary[pos - 1];
    });

    let teamLogos = this.toolService.get_team_logos();
    let teamLogosWithStatus = [];
    teamLogos.map(
        logo => {
            let response = this.includedTeams(logo);
            let data = {};
            data['logo'] = logo;
            data['status'] = response;
            teamLogosWithStatus.push(data);
        }
    );
    if(teamLogosWithStatus.length > 0) {
        this.teamLogos = teamLogosWithStatus;
    }
    this.fetchedTeam.forEach(
      (elem) => {
        $('.check_'+elem).prop("checked",true);
      }
    );
    this.rerender();

    let { slate } = this.toolService.weekNSlate;
    localStorage.removeItem(this.toolService.toolName + ' '+ slate + ' excluded');
  }

  include_or_exclude(event,team_name) {
    let decide = event.target.checked;
    let { slate } = this.toolService.weekNSlate;

    if(decide) {
      this.toolService.include_by_team_name(team_name);
      this.excludedData = this.toolService.get_excluded_list();
      this.excludedDataTemp = this.excludedData;

      let excluded = this.excludedData;

      excluded = excluded.reduce((array,data) => {
          let id = data.player.split('(')[1].replace(')','');
          array.push(id);
          return array;
      },[]);
      localStorage.setItem(this.toolService.toolName + ' '+ slate + ' excluded', JSON.stringify(excluded));

      if(this.filterBySelectedPos.length > 0) {
        this.excludedData = this.excludedData.filter(
          (d) => {
            if(this.filterBySelectedPos.indexOf(d.pos1) > -1) {
              return d;
            }
          }
        );
      }
      this.rerender();
    } else {
      this.toolService.exclude_by_team_name(team_name);
      this.excludedData = this.toolService.get_excluded_list();
      this.excludedDataTemp = this.excludedData;

      let excluded = this.excludedData;

      excluded = excluded.reduce((array,data) => {
          let id = data.player.split('(')[1].replace(')','');
          array.push(id);
          return array;
      },[]);
      localStorage.setItem(this.toolService.toolName + ' '+ slate + ' excluded', JSON.stringify(excluded));

      if(this.filterBySelectedPos.length > 0) {
        this.excludedData = this.excludedData.filter(
          (d) => {
            if(this.filterBySelectedPos.indexOf(d.pos1) > -1) {
              return d;
            }
          }
        );
      }
      this.rerender();
    }
  }

  findPlayerSubmit(name, event) {
    let keyCode = event.keyCode;
    // event.preventDefault();
    let val = name.trim().toLowerCase();
    
    if(val !== '') {
      this.submitSearch = false;
      this.excludedData = this.excludedData.filter(
        (d) => d.name.toLowerCase().includes(val)
      );
      if(this.filterBySelectedPos.length > 0) {
        this.excludedData = this.excludedData.filter(
          (d) => {
            if(this.filterBySelectedPos.indexOf(d.pos1) > -1) {
              return d;
            }
          }
        );
      }
      this.rerender();
    } else if(val === '' && keyCode === 13 && !this.submitSearch){
      this.submitSearch = true;
      this.excludedData = this.toolService.get_excluded_list();
      if(this.filterBySelectedPos.length > 0) {
        this.excludedData = this.excludedData.filter(
          (d) => {
            if(this.filterBySelectedPos.indexOf(d.pos1) > -1) {
              return d;
            }
          }
        );
      }
      this.rerender();
    }
  }

  findPlayerKeyup(name, event) {

    clearInterval(this.findPlayerTimeout);
    this.findPlayerTimeout = setTimeout(() => {
      let keyCode = event.keyCode;
      let val = name.trim().toLowerCase();
      
      if(val !== '') {
        this.keyupSearch = false;
        this.excludedData = this.excludedData.filter(
          (d) => d.name.toLowerCase().includes(val)
        );
        if(this.filterBySelectedPos.length > 0) {
          this.excludedData = this.excludedData.filter(
            (d) => {
              if(this.filterBySelectedPos.indexOf(d.pos1) > -1) {
                return d;
              }
            }
          );
        }
        this.rerender();
      } else if(val === '' && keyCode === 8 && !this.keyupSearch){
        this.keyupSearch = true;
        this.excludedData = this.toolService.get_excluded_list();
        if(this.filterBySelectedPos.length > 0) {
          this.excludedData = this.excludedData.filter(
            (d) => {
              if(this.filterBySelectedPos.indexOf(d.pos1) > -1) {
                return d;
              }
            }
          );
        }
        this.rerender();
      }
    }, 500);
  }

  filterByPos(pos_name,event) {
    this.excludedData = this.toolService.get_excluded_list();

    if(this.posAll.nativeElement.checked) {
      this.posAll.nativeElement.checked = false;
    }
  
    if(event.target.checked && this.filterBySelectedPos.indexOf(pos_name) === -1) {
      this.filterBySelectedPos.push(pos_name);
      this.toolService.excludePosSort[pos_name] = true;
    } else{
      this.toolService.excludePosSort[pos_name] = false;
      let index = this.filterBySelectedPos.indexOf(pos_name);
      this.filterBySelectedPos.splice(index,1);
    }

    if (this.filterBySelectedPos.length === 5) {
      this.posAll.nativeElement.checked = true;
    }

    if(this.filterBySelectedPos.length > 0) {
      this.excludedData = this.excludedData.filter(
        (d) => {
          if(this.filterBySelectedPos.indexOf(d.pos1) > -1) {
            return d;
          }
        }
      );
      this.rerender();
    } else {
      this.excludedData = [];
      this.rerender();
    }
  }

  showAllExcluded(decide) {
    if(decide) {
      this.checkAll = true;
      this.filterBySelectedPos = ['QB','RB','WR','TE','DST'];
      this.filterBySelectedPos.forEach(
        (elem) => $('.'+elem).prop("checked",true)
      );
      this.excludedData = this.toolService.get_excluded_list();
      Object.keys(this.toolService.excludePosSort).map(d => this.toolService.excludePosSort[d] = true);
      this.rerender();
    } else {
      this.checkAll = false;
      this.filterBySelectedPos = [];
      this.excludedData = [];
      Object.keys(this.toolService.excludePosSort).map(d => this.toolService.excludePosSort[d] = false);
      this.rerender();
    }
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      this.dtTrigger.next();
    });
  }

}
