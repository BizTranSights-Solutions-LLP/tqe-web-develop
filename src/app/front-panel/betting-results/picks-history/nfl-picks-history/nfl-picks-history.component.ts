import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { SeoService } from '../../../../services/seo.service';
// import { BestBetsService } from '../best-bets.service';
import { DataService } from '../../../../services/data.service';
import { environment } from '../../../../../environments/environment';
import { AuthService } from '../../../../services/auth.service';
import { Subscription } from 'rxjs';
import { AngularBootstrapToastsService } from 'angular-bootstrap-toasts';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { BestBetsService } from 'src/app/front-panel/best-bets/best-bets.service';
import { DataTableDirective } from 'angular-datatables';

declare var $;

declare var require: any;
@Component({
  selector: 'tqe-nfl-picks-history',
  templateUrl: './nfl-picks-history.component.html',
  styleUrls: ['./nfl-picks-history.component.scss']
})
export class NflPicksHistoryComponent implements OnInit {
  @ViewChild('dataTable') table:ElementRef;

  dataTable: any;
  dtOption : any;

  records: any[];
  dataLoading: boolean = true;
  selected_year: any;
  years : any[];
  weeks: any;
  selected_week: any;
  selected_record : any;
  year_to_date_record :any;
  s_win_re : any;
  s_win : any;
  s_lose_re : any;
  s_lose: any;
  s_push_re : any;
  s_push : any;
  s_prob : any;
  ou_win : any;
  ou_win_re : any;
  ou_lose: any;
  ou_lose_re: any;
  ou_push: any;
  ou_push_re: any;
  ou_prob : any
  ytd_s_win : any;
  ytd_s_lose: any;
  ytd_s_push : any;
  ytd_s_win_re : any;
  ytd_s_lose_re: any;
  ytd_s_push_re : any;
  ytd_s_prob : any;
  ytd_ou_win_re : any;
  ytd_ou_lose_re: any;
  ytd_ou_push_re : any;
  ytd_ou_win : any;
  ytd_ou_lose: any;
  ytd_ou_push : any;
  ytd_ou_prob : any;


  constructor(
    private authService: AuthService,
    private dataService: DataService,
    private router: Router,
    private plumber: BestBetsService,
    private toast: AngularBootstrapToastsService
  ) { }



  selected_tool: any;
  tool_data_loading: boolean = false;
  tools:string[] = [];
  nfl_pick_loading : boolean = true;
  

  ngOnInit() {
    this.getNFLPickData()
    this.dtOption = {
      "scrollY": false,
      "paging": false,
      "scrollX": false,
      "info":false,
      "searching":false,


    }
    this.dataTable = $(this.table.nativeElement)
    this.dataTable.dataTable(this.dtOption );
    

  }
  //Private method: 

  //When User changes year / week 
  private onClickSel(){
    this.nfl_pick_loading = true;
    // console.log("onClickYearSel is called, before call getRecord, this.selected_record is,",this.selected_record)
    // console.log("before call getRecord, this.year-to-date-record is,",this.year_to_date_record)
    this.getRecord(this.selected_year,this.selected_week)
    // console.log("after call getRecord, this.selected_record is,",this.selected_record)
    // console.log("after call getRecord, this.year-to-date-record is,",this.year_to_date_record)
    this.pickDataResolver()
  }

  private pickDataResolver(){
    // for s res
    this.s_win = 0;
    this.s_win_re = [];
    this.s_lose = 0;
    this.s_lose_re = [];
    this.s_push = 0;
    this.s_push_re = [];
    this.s_win_re = this.selected_record.filter(re =>(re.sprd_result == "win"));
    this.s_win = this.s_win_re.length;
    this.s_lose_re = this.selected_record.filter(re =>(re.sprd_result == "lose"));
    this.s_lose = this.s_lose_re.length;
    this.s_push_re = this.selected_record.filter(re =>(re.sprd_result == "Push"));
    this.s_push = this.s_push_re.length;
    this.s_prob = this.s_win / (this.s_win+this.s_lose)
    // for ou res
    this.ou_win = 0;
    this.ou_win_re = [];
    this.ou_lose = 0;
    this.ou_lose_re = [];
    this.ou_push = 0;
    this.ou_push_re = [];
    this.ou_win_re = this.selected_record.filter(re =>(re.ou_result == "win"));
    this.ou_win = this.ou_win_re.length;
    this.ou_lose_re = this.selected_record.filter(re =>(re.ou_result == "lose"));
    this.ou_lose = this.ou_lose_re.length;
    this.ou_push_re = this.selected_record.filter(re =>(re.ou_result == "Push"));
    this.ou_push = this.ou_push_re.length;
    this.ou_prob = this.ou_win / (this.ou_win+this.ou_lose)

    //for year to date res:
    this.ytd_s_win = 0;
    this.ytd_s_lose = 0;
    this.ytd_s_push = 0;
    this.ytd_s_win_re = [];
    this.ytd_s_lose_re = [];
    this.ytd_s_push_re =[];
    this.ytd_s_prob = 0 ;
    this.ytd_ou_win_re = [];
    this.ytd_ou_lose_re = [];
    this.ytd_ou_push_re = [];
    this.ytd_ou_win = 0;
    this.ytd_ou_lose = 0;
    this.ytd_ou_push = 0;
    this.ytd_ou_prob = 0;
    // For s pick res
    this.ytd_s_win_re = this.year_to_date_record.filter(re =>(re.sprd_result == "win"));
    this.ytd_s_win = this.ytd_s_win_re.length;
    this.ytd_s_lose_re = this.year_to_date_record.filter(re =>(re.sprd_result == "lose"));
    this.ytd_s_lose = this.ytd_s_lose_re.length;
    this.ytd_s_push_re = this.year_to_date_record.filter(re =>(re.sprd_result == "Push"));
    this.ytd_s_push = this.ytd_s_push_re.length;
    this.ytd_s_prob = this.ytd_s_win / (this.ytd_s_win+this.ytd_s_lose)
    //For ou pick res
    this.ytd_ou_win_re = this.year_to_date_record.filter(re =>(re.ou_result == "win"));
    this.ytd_ou_win = this.ytd_ou_win_re.length;
    this.ytd_ou_lose_re = this.year_to_date_record.filter(re =>(re.ou_result == "lose"));
    this.ytd_ou_lose = this.ytd_ou_lose_re.length;
    this.ytd_ou_push_re = this.year_to_date_record.filter(re =>(re.ou_result == "Push"));
    this.ytd_ou_push = this.ytd_ou_push_re.length;
    this.ytd_ou_prob = this.ytd_ou_win / (this.ytd_ou_win+this.ytd_ou_lose)
  }

  // Get NFL pick history records
  private getRecord(year,week){
    this.selected_record = [];
    this.year_to_date_record = [];
    this.selected_year = year;
    this.selected_week = week;
    for (let i in this.records){
      if (this.records[i].year ==this.selected_year && this.records[i].week == this.selected_week){
        this.selected_record.push(this.records[i])
      }
    }
    for (let i in this.records){
      if (this.records[i].year <this.selected_year){
        this.year_to_date_record.push(this.records[i]);
      }
      else if (this.records[i].year  == this.selected_year && this.records[i].week <= this.selected_week){
        this.year_to_date_record.push(this.records[i])

      } 
    }
    this.nfl_pick_loading = false;
  }



  private getNFLPickData() {
    this.records = [];
    this.years = [];
    this.weeks= [];
    this.plumber.getNFlPickHistroy().subscribe(
      win => {
        for (let i in win)
          this.records.push(win[i]);
        this.records.forEach(re => {
          this.years.push(re.year);
          this.weeks.push(re.week);

        });
        // console.log("this.records is:", this.records)
        // console.log("this.years is:", this.years)
        this.dataLoading = false;
        this.selected_year = this.years[0];
        this.selected_week = this.weeks[0];
      },
      fail => { },
      ()=>{
        this.getRecord(this.selected_year,this.selected_week)
        // console.log("this.selected_record is:",this.selected_record)
        // console.log("this.year-to-date-records are:",this.year_to_date_record)
        this.pickDataResolver()
      },
    );
  }
}
