import { Component, OnInit, HostListener } from '@angular/core';
import { NflPicksHistoryComponent } from './nfl-picks-history/nfl-picks-history.component';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { AngularBootstrapToastsService } from 'angular-bootstrap-toasts';
import { DataService } from 'src/app/services/data.service';
import { BestBetsService } from '../../best-bets/best-bets.service';

@NgModule({
    declarations: [
        NflPicksHistoryComponent,
    ],
})
@Component({
  // tslint:disable-next-line:component-selector
    selector: 'tqe-header-picks-history',
    templateUrl: './picks-history-header.component.html',
    styleUrls: ['./picks-history-header.component.scss']
})
export class AllPicksHistoryComponent implements OnInit {


    constructor(
        private authService: AuthService,
        private dataService: DataService,
        private router: Router,
        private plumber: BestBetsService,
        private toast: AngularBootstrapToastsService
    ) { }
    isAuthorized: boolean = false;
    auth_loading: boolean = true;
    selectedSport: string;
    selected_tool: string;



    ngOnInit() {
        this.selected_tool = "NFL Picks";
        this.authorizeUser();
    }
    // === PUBLIC METHODS ====================================================


    // === PRIVATE METHODS ====================================================
    private onClickToolSel(){
        console.log("this.selected_tool is:",this.selected_tool)

    }
    private authorizeUser() {
        let isLoggedIn: any = this.authService.isUserLoggedIn();
        let tool: string = "nba-dk-optimizer"

        this.dataService.get_tool(tool).subscribe(
            (res: any) => {
                this.isAuthorized = (res.meta.code === 200);
            },
            (err) => {
                this.isAuthorized = false;
                this.auth_loading = false;
            },
            () => {
                this.auth_loading = false;
            }
        );
    }

}
