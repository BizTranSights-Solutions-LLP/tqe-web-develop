import { Component, OnInit, OnDestroy } from '@angular/core';
import { ToolsServiceService } from '../../../services/tools-service.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-injury',
  templateUrl: './injury.component.html',
  styleUrls: ['./injury.component.css']
})
export class InjuryComponent implements OnInit,OnDestroy {

  injuryMessage: string = '';
  serverError: string = '';
  showLoader: boolean = true;

  teams: Array<string> = [];
  injuryData: any = [];

  injuryDataSubscription: Subscription;

  constructor(
    private toolService: ToolsServiceService
  ) { }

  ngOnInit() {
    this.teams = this.toolService.team_names;
    this.toolService.get_injury_data('').subscribe(
      (res) => {
        this.showLoader = false;
        this.injuryData = res;
      },
      (err) => {
        this.showLoader = false;
        this.serverError = err.error.error[0];
      }
    )
  }

  get_injuries_data(team) {
    this.showLoader = true;
    this.injuryData = [];
    this.serverError = '';
    this.injuryDataSubscription = this.toolService.get_injury_data(team).subscribe(
      (res:any) => {
        this.showLoader = false;
        if(res.indexOf('No injured players!') === -1) {
          this.injuryData = res;
        } else {
          this.injuryMessage = 'No Injury Data Available';
        }
      },
      (err) => {
        this.showLoader = false; 
        this.serverError = err.statusText;
      }
    )
  }

  ngOnDestroy() {
    if(this.injuryDataSubscription) { this.injuryDataSubscription.unsubscribe(); }
  }

}
