import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { SeoService } from '../../services/seo.service';
import { Chart } from 'chart.js';

import { InternalCustomerService } from './customer-internal.service';
import { DataService } from '../../services/data.service';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';
import { AngularBootstrapToastsService } from 'angular-bootstrap-toasts';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

@Component({
  selector: 'tqe-customer-internal',
  templateUrl: './customer-internal.component.html',
  styleUrls: ['./customer-internal.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class CustomerInternalComponent implements OnInit {

  records: any[];
  date: any[];

  // -------------------- chart 1 --------------------
  // 1 - current subscribers 88 
  current_subscribers: any[];
  selected_current_subscribers: any[];
  selected_current_subscribers_date: any[];
  today_current_subscribers: any;

  // 2 - current monthly subscribers 69
  current_monthly_subscribers: any[];
  selected_current_monthly_subscribers: any[];
  selected_current_monthly_subscribers_date: any[];

  // 3 - current annual subscribers 19
  current_annual_subscribers: any[];
  selected_current_annual_subscribers: any[];

  // -------------------- chart 2 --------------------

  // 4 - current active subscribers  74
  current_active_subscribers: any[];
  selected_current_active_subscribers: any;

  // 5 - current canceled subscribers 14
  current_canceled_subscribers: any[];
  selected_current_canceled_subscribers: any;

  // 6 - current active monthly subscribers 65
  current_active_monthly_subscribers: any[];
  selected_current_active_monthly_subscribers: any;

  // 7 - current canceled monthly subscribers 4
  current_canceled_monthly_subscribers: any[];
  selected_current_canceled_monthly_subscribers: any;

  // -------------------- chart 3 --------------------

  // 9 - current active annual subscribers 9 
  current_active_annual_subscribers: any[];
  selected_current_active_annual_subscribers: any;
  today_current_active_annual_subscribers: any;

  // 10 -current canceled annual subscribers 10
  current_canceled_annual_subscribers: any[];
  selected_current_canceled_annual_subscribers: any[];

  // -------------------- chart 4 --------------------

  // 11 - current active trials
  current_active_trials: any[];
  selected_current_active_trials: any[];
  today_current_active_trials: any;

  // 12 - current canceled trials:
  current_canceled_trials: any[];
  selected_current_canceled_trials: any[];

  // -------------------- chart 5 --------------------

  // 13 - old subscribers
  old_subscribers: any[];
  selected_old_subscribers: any[];

  // 14 - old trials:
  old_trials: any[];
  selected_old_trials: any[];

  // 15 - new subscribers:
  new_subscribers: any[];
  selected_new_subscribers: any[];

  // 16 - new trials:
  new_trials: any[];
  selected_new_trials: any[];

  // -------------------- chart 6 --------------------

  // 17 - next month payout
  next_month_payout: any[];
  selected_next_month_payout: any[];
  today_next_month_payout: any;

  // 18- next year payout
  next_year_payout: any[];
  selected_next_year_payout: any[];

  // -------------------- chart 7 --------------------
  ended_monthly_subs: any[];
  selected_ended_monthly_subs: any[];

  ended_annual_subs: any[];
  selected_ended_annual_subs: any[];

  // -------------------- chart 8 --------------------
  month_pay_to_date: any[];
  selected_month_pay_to_date: any[];


  select_start_date: any;
  select_end_date: any;
  dataLoading: boolean;
  sortBy: string;
  sortDir: any = {
    'rating': true,
    'date': false
  };
  selected_temp_data: any[];
  selected_temp_date: any[];
  selected_temp: any[];
  chart1_data: any[];
  Linechart5: any;
  Linechart6: any;
  Linechart7: Chart;
  Linechart8: any;
  last_month_subscribers: any;
  last_month_active_annual_subscribers: any;
  last_month_active_trials: any;
  last_month_next_month_payout: any;
  subscribers_percentage: any;
  active_annual_subscribers_percentage: any;
  active_trials_percentage: number;
  next_month_payout_percentage: number;
  next_month_records: any;
  next_month_date: any;



  addStartEvent(event: MatDatepickerInputEvent<Date>) {
    this.select_start_date = moment(`${event.value}`).format('MMM D YYYY');
    console.log("event is :", this.select_start_date);
  }

  addEndEvent(event: MatDatepickerInputEvent<Date>) {
    this.select_end_date = moment(`${event.value}`).format('MMM D YYYY');
    console.log("event is :", this.select_end_date);
    // chart 1
    this.selected_current_subscribers = this.resolveChartData(this.current_subscribers)[0];
    this.selected_current_subscribers_date = this.resolveChartData(this.current_subscribers)[1];
    this.selected_current_monthly_subscribers = this.resolveChartData(this.current_monthly_subscribers)[0];
    this.selected_current_annual_subscribers = this.resolveChartData(this.current_annual_subscribers)[0];
    console.log("***this.selected_current_monthly_subscribers,", this.selected_current_monthly_subscribers)
    this.Linechart = this.makeChart1(this.selected_current_subscribers, this.selected_current_monthly_subscribers, this.selected_current_annual_subscribers, this.selected_current_subscribers_date);
    // chart 2
    this.selected_current_active_subscribers = this.resolveChartData(this.current_active_subscribers)[0];
    this.selected_current_canceled_subscribers = this.resolveChartData(this.current_canceled_subscribers)[0];
    this.selected_current_active_monthly_subscribers = this.resolveChartData(this.current_active_monthly_subscribers)[0];
    this.selected_current_canceled_monthly_subscribers = this.resolveChartData(this.current_canceled_monthly_subscribers)[0];
    this.Linechart2 = this.makeChart2(this.selected_current_active_subscribers, this.selected_current_canceled_subscribers, this.selected_current_active_monthly_subscribers, this.selected_current_canceled_monthly_subscribers, this.selected_current_subscribers_date);
    // chart 3 
    this.selected_current_active_annual_subscribers = this.resolveChartData(this.current_active_annual_subscribers)[0];
    this.selected_current_canceled_annual_subscribers = this.resolveChartData(this.current_canceled_annual_subscribers)[0];
    this.Linechart3 = this.makeChart3(this.selected_current_active_annual_subscribers, this.selected_current_canceled_annual_subscribers, this.selected_current_subscribers_date)
    // chart 4
    this.selected_current_active_trials = this.resolveChartData(this.current_active_trials)[0];
    this.selected_current_canceled_trials = this.resolveChartData(this.current_canceled_trials)[0];
    this.Linechart4 = this.makeChart4(this.selected_current_active_trials, this.selected_current_canceled_trials, this.selected_current_subscribers_date)
    // chart 5
    this.selected_old_subscribers = this.resolveChartData(this.old_subscribers)[0];
    this.selected_old_trials = this.resolveChartData(this.old_trials)[0];
    this.selected_new_subscribers = this.resolveChartData(this.new_subscribers)[0];
    this.selected_new_trials = this.resolveChartData(this.new_trials)[0];
    this.Linechart5 = this.makeChart5(this.selected_old_subscribers, this.selected_old_trials, this.selected_new_subscribers, this.selected_new_trials, this.selected_current_subscribers_date)
    //chart 7
    this.selected_next_month_payout = this.resolveChartData(this.next_month_payout)[0];
    this.selected_next_year_payout = this.resolveChartData(this.next_year_payout)[0];
    // this.Linechart6 = this.makeChart6(this.selected_next_month_payout, this.selected_current_subscribers_date)
    this.selected_next_year_payout = this.resolveChartData(this.next_year_payout)[0];
    this.Linechart7 = this.makeChart7(this.selected_next_year_payout, this.selected_next_month_payout, this.selected_current_subscribers_date);
    //chart 6
    this.selected_ended_monthly_subs = this.resolveChartData(this.ended_monthly_subs)[0];
    this.selected_ended_annual_subs = this.resolveChartData(this.ended_annual_subs)[0];
    this.Linechart8 = this.makeChart8(this.selected_ended_monthly_subs, this.selected_ended_annual_subs, this.selected_current_subscribers_date);
  }



  // @ViewChild('signupModal') signupModal: ModalDirective;
  constructor(
    private authService: AuthService,
    private dataService: DataService,
    private router: Router,
    private plumber: InternalCustomerService,
    private toast: AngularBootstrapToastsService
  ) { }

  Linechart: any;
  Linechart2: any;
  Linechart3: any;
  Linechart4: any;

  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });

  ngOnInit() {
    this.getCustomerData();

  }

  public sortByStartTime() {
    this.sortBy = 'date';
    this.records = this.records.sort(function (a, b) {
      return moment(b.date).valueOf() - moment(a.date).valueOf();
    });
    if (this.sortDir[this.sortBy]) {
      this.records.reverse();
    }

    this.sortDir[this.sortBy] = !this.sortDir[this.sortBy];
  }

  private makeChart1(data1, data2, data3, date) {
    console.log("in make chart, date and data are:", data1, data2, data3, date)
    return new Chart('canvas1', {
      type: 'line',
      data: {
        labels: date,
        datasets: [{
          lineTension: 0,
          data: data1,
          label: "Current Subscribers",
          borderColor: "#1fb122",
          fill: false
        },
        {
          lineTension: 0,
          data: data2,
          label: "Current Monthly Subscribers",
          borderColor: "#5b5c5b",
          fill: false
        },
        {
          lineTension: 0,
          data: data3,
          label: "Current Annual Subscribers",
          borderColor: "#38b9f5",
          fill: false
        },
        ]
      },

      options: {
        legend: {
          display: true,
          position: 'bottom',
          labels: {
            fontColor: "#5b5c5b",
          }
        },
        scales: {
          yAxes: [{
            ticks: {
              stepSize: 1,
            }
          }],
        },
        title: {
          display: true,
          text: 'Current All Subscribers'
        }
      }
    });

  }

  private makeChart2(data1, data2, data3, data4, date) {
    return new Chart('canvas2', {
      type: 'line',
      data: {
        labels: date,
        datasets: [{
          lineTension: 0,
          data: data1,
          label: "Current Active Subscribers",
          borderColor: "#1fb122",
          fill: false
        },
        {
          lineTension: 0,
          data: data2,
          label: "Current Canceled Subscribers",
          borderColor: "#5b5c5b",
          fill: false
        },
        {
          lineTension: 0,
          data: data3,
          label: "Current Actove Monthly Subscribers",
          borderColor: "#38b9f5",
          fill: false
        },
        {
          lineTension: 0,
          data: data4,
          label: "Current Canceled Monthly Subscribers",
          borderColor: "#faee49",
          fill: false
        },
        ]
      },

      options: {
        legend: {
          display: true,
          position: 'bottom',
          labels: {
            fontColor: "#5b5c5b",
          }
        },
        scales: {
          yAxes: [{
            ticks: {
              stepSize: 1,
            }
          }],
        },
        title: {
          display: true,
          text: 'Current Active/Canceled Monthly Subscribers'
        }
      }
    });

  }

  private makeChart3(data1, data2, date) {
    console.log("in make chart, date and data are:", data1, data2, date)
    return new Chart('canvas3', {
      type: 'line',
      data: {
        labels: date,
        datasets: [{
          lineTension: 0,
          data: data1,
          label: "Current Active Annual Aubscribers",
          borderColor: "#1fb122",
          fill: false
        },
        {
          lineTension: 0,
          data: data2,
          label: "Current Canceled Annual Aubscribers",
          borderColor: "#5b5c5b",
          fill: false
        },
        ]
      },

      options: {
        legend: {
          display: true,
          position: 'bottom',
          labels: {
            fontColor: "#5b5c5b",
          }
        },
        scales: {
          yAxes: [{
            ticks: {
              stepSize: 1,
            }
          }],
        },
        title: {
          display: true,
          text: 'Current Activa/Canceled Annual Aubscribers'
        }
      }
    });

  }

  private makeChart4(data1, data2, date) {
    console.log("in make chart, date and data are:", data1, data2, date)
    return new Chart('canvas4', {
      type: 'line',
      data: {
        labels: date,
        datasets: [{
          lineTension: 0,
          data: data1,
          label: "Current Active Trials",
          borderColor: "#1fb122",
          fill: false
        },
        {
          lineTension: 0,
          data: data2,
          label: "Current Canceled Trials",
          borderColor: "#5b5c5b",
          fill: false
        },
        ]
      },

      options: {
        legend: {
          display: true,
          position: 'bottom',
          labels: {
            fontColor: "#5b5c5b",
          }
        },
        scales: {
          yAxes: [{
            ticks: {
              stepSize: 1,
            }
          }],
        },
        title: {
          display: true,
          text: 'Current Activa/Canceled Trials'
        }
      }
    });

  }

  private makeChart5(data1, data2, data3, data4, date) {
    return new Chart('canvas5', {
      type: 'line',
      data: {
        labels: date,
        datasets: [{
          lineTension: 0,
          data: data1,
          label: "Old Subscribers",
          borderColor: "#1fb122",
          fill: false
        },
        {
          lineTension: 0,
          data: data2,
          label: "Old Trials",
          borderColor: "#5b5c5b",
          fill: false
        },
        {
          lineTension: 0,
          data: data3,
          label: "New Subscribers",
          borderColor: "#38b9f5",
          fill: false
        },
        {
          lineTension: 0,
          data: data4,
          label: "New Trials",
          borderColor: "#faee49",
          fill: false
        },
        ]
      },

      options: {
        legend: {
          display: true,
          position: 'bottom',
          labels: {
            fontColor: "#5b5c5b",
          }
        },
        scales: {
          yAxes: [{
            ticks: {
              stepSize: 50,
            }
          }],
        },
        title: {
          display: true,
          text: 'Old/New Trails and Subscribers'
        }
      }
    });

  }
  // for next_month jsondata
  private makeChart6(data1, date) {
    console.log("in make chart6, date and data are:", data1, date)
    return new Chart('canvas6', {
      type: 'line',
      data: {
        labels: date,
        datasets: [{
          lineTension: 0,
          data: data1,
          label: "Daily Payout of Next Month",
          borderColor: "#faee49",
          fill: false
        },
        ]
      },

      options: {
        legend: {
          display: true,
          position: 'bottom',
          labels: {
            fontColor: "#5b5c5b",
          }
        },
        scales: {
          yAxes: [{
            ticks: {
              stepSize: 10,
            }
          }],
        },
        title: {
          display: true,
          text: 'Next Month Payout'
        }
      }
    });

  }
  //payout 
  private makeChart7(data1, data2, date) {
    console.log("in make chart7, date and data are:", data1, date)
    return new Chart('canvas7', {
      type: 'line',
      data: {
        labels: date,
        datasets: [
          {
            lineTension: 0,
            data: data1,
            label: "Next Year Payout",
            yAxisID: 'A',
            borderColor: "#38b9f5",
            fill: false
          },
          {
            lineTension: 0,
            data: data2,
            label: "Next Month Payout",
            yAxisID: 'B',
            borderColor: "#5b5c5b",
            fill: false
          },
        ]
      },

      options: {
        legend: {
          display: true,
          position: 'bottom',
          labels: {
            fontColor: "#5b5c5b",
          }
        },
        scales: {
          yAxes: [{
            ticks: {
              stepSize: 100,
            },
            id: 'A',
            type: 'linear',
            position: 'left',
          }, {
            id: 'B',
            type: 'linear',
            position: 'right',
            ticks: {
              stepSize: 10,
            }
          }],
          // yAxes: [{
          //   ticks: {
          //     stepSize: 1,
          //   }
          // }],
        },
        title: {
          display: true,
          text: 'Payout'
        }
      }
    });

  }

  private makeChart8(data1, data2, date) {
    console.log("in make chart, date and data are:", data1, data2, date)
    return new Chart('canvas8', {
      type: 'line',
      data: {
        labels: date,
        datasets: [{
          lineTension: 0,
          data: data1,
          label: "Ended Monthly Subs",
          borderColor: "#1fb122",
          fill: false
        },
        {
          lineTension: 0,
          data: data2,
          label: "Ended Annual Subs",
          borderColor: "#5b5c5b",
          fill: false
        },
        ]
      },

      options: {
        legend: {
          display: true,
          position: 'bottom',
          labels: {
            fontColor: "#5b5c5b",
          }
        },
        scales: {
          yAxes: [{
            ticks: {
              stepSize: 1,
            }
          }],
        },
        title: {
          display: true,
          text: 'Current Ended Subscribers'
        }
      }
    });

  }

  private resolveChartData(source_data) {
    this.selected_temp = [];
    this.selected_temp_data = [];
    this.selected_temp_date = [];
    for (let i in source_data) {
      if (moment(this.select_start_date).valueOf() <= moment(source_data[i][0]).valueOf() && moment(source_data[i][0]).valueOf() <= moment(this.select_end_date).valueOf()) {
        this.selected_temp_data.push(source_data[i][1])
        this.selected_temp_date.push(source_data[i][0])
      }
    }
    this.selected_temp_data.reverse();
    this.selected_temp_date.reverse();
    this.selected_temp.push(this.selected_temp_data)
    this.selected_temp.push(this.selected_temp_date)
    return this.selected_temp;
  }

  private getCustomerData() {
    this.records = [];
    this.date = [];
    // ch1
    this.current_subscribers = [];
    this.current_monthly_subscribers = [];
    this.current_annual_subscribers = [];
    // ch2
    this.current_active_subscribers = [];
    this.current_canceled_subscribers = [];
    this.current_active_monthly_subscribers = [];
    this.current_canceled_monthly_subscribers = [];

    //ch3
    this.current_active_annual_subscribers = [];
    this.current_canceled_annual_subscribers = [];


    this.current_active_trials = [];
    this.current_canceled_trials = [];
    this.old_subscribers = [];
    this.old_trials = [];
    this.new_subscribers = [];
    this.new_trials = [];
    this.next_month_payout = [];
    this.next_year_payout = [];
    this.ended_annual_subs = [];
    this.ended_monthly_subs = [];

    // new json
    this.next_month_records = [];
    this.next_month_date = [];
    this.month_pay_to_date = [];
    this.selected_month_pay_to_date=[];

    // ------ plumber function for customer data ---------// 
    this.plumber.getCustomerData().subscribe(
      data => {
        for (let i in data)
          this.records.push(data[i]);
      },
      fail => { },
      () => {
        this.sortByStartTime()
        console.log("record is after sort:", this.records);
        this.records.forEach(re => {
          this.date.push(moment(re.date).format('MMM D YYYY'));
          this.current_subscribers.push([moment(re.date).format('MMM D YYYY'), re["current subscribers"]]);
          this.current_monthly_subscribers.push([moment(re.date).format('MMM D YYYY'), re["current monthly subscribers"]]);
          this.current_annual_subscribers.push([moment(re.date).format('MMM D YYYY'), re["current annual subscribers"]]);
          this.current_active_subscribers.push([moment(re.date).format('MMM D YYYY'), re["current active subscribers"]]);
          this.current_canceled_subscribers.push([moment(re.date).format('MMM D YYYY'), re["current canceled subscribers"]]);
          this.current_active_monthly_subscribers.push([moment(re.date).format('MMM D YYYY'), re["current active monthly subscribers"]]);
          this.current_canceled_monthly_subscribers.push([moment(re.date).format('MMM D YYYY'), re["current canceled monthly subscribers"]]);
          this.current_active_annual_subscribers.push([moment(re.date).format('MMM D YYYY'), re["current active annual subscribers"]]);
          this.current_canceled_annual_subscribers.push([moment(re.date).format('MMM D YYYY'), re["current canceled annual subscribers"]]);
          this.current_active_trials.push([moment(re.date).format('MMM D YYYY'), re["current active trials"]]);
          this.current_canceled_trials.push([moment(re.date).format('MMM D YYYY'), re["current canceled trials"]]);
          this.old_subscribers.push([moment(re.date).format('MMM D YYYY'), re["old subscribers"]]);
          this.old_trials.push([moment(re.date).format('MMM D YYYY'), re["old trials"]]);
          this.new_subscribers.push([moment(re.date).format('MMM D YYYY'), re["new subscribers"]]);
          this.new_trials.push([moment(re.date).format('MMM D YYYY'), re["new trials"]]);
          this.next_month_payout.push([moment(re.date).format('MMM D YYYY'), re["next month"]]);
          this.next_year_payout.push([moment(re.date).format('MMM D YYYY'), re["next year"]]);
          this.ended_annual_subs.push([moment(re.date).format('MMM D YYYY'), re["ended annual subs"]]);
          this.ended_monthly_subs.push([moment(re.date).format('MMM D YYYY'), re["ended monthly subs"]]);
        });
        // Today's subscribers vs last month 
        this.today_current_subscribers = this.current_subscribers[0][1];
        this.last_month_subscribers = this.current_subscribers[30][1];
        this.subscribers_percentage = (this.today_current_subscribers - this.last_month_subscribers) / this.last_month_subscribers;

        // Today vs Last month subscribers active annual subscribers:
        this.today_current_active_annual_subscribers = this.current_active_annual_subscribers[0][1];
        this.last_month_active_annual_subscribers = this.current_active_annual_subscribers[30][1];
        this.active_annual_subscribers_percentage = (this.today_current_active_annual_subscribers - this.last_month_active_annual_subscribers) / this.last_month_active_annual_subscribers;

        // Today active_trials vs last month active_trials
        this.today_current_active_trials = this.current_active_trials[0][1];
        this.last_month_active_trials = this.current_active_trials[30][1];
        this.active_trials_percentage = (this.today_current_active_trials - this.last_month_active_trials) / this.last_month_active_trials;

        // Today vs last month's next month payout
        this.today_next_month_payout = this.next_month_payout[0][1];
        this.last_month_next_month_payout = this.next_month_payout[30][1];
        this.next_month_payout_percentage = (this.today_next_month_payout - this.last_month_next_month_payout) / this.last_month_next_month_payout;

        this.dataLoading = false;
        this.select_start_date = this.date[7];
        this.select_end_date = this.date[0];
        this.selected_current_subscribers = this.resolveChartData(this.current_subscribers)[0];
        this.selected_current_subscribers_date = this.resolveChartData(this.current_subscribers)[1];
        this.selected_current_monthly_subscribers = this.resolveChartData(this.current_monthly_subscribers)[0];
        console.log("this.selected_current_monthly_subscribers", this.selected_current_monthly_subscribers)
        this.selected_current_annual_subscribers = this.resolveChartData(this.current_annual_subscribers)[0];
        this.Linechart = this.makeChart1(this.selected_current_subscribers, this.selected_current_monthly_subscribers, this.selected_current_annual_subscribers, this.selected_current_subscribers_date);
        // End For chart 1
        // Start For chart 2
        this.selected_current_active_subscribers = this.resolveChartData(this.current_active_subscribers)[0];
        this.selected_current_canceled_subscribers = this.resolveChartData(this.current_canceled_subscribers)[0];
        this.selected_current_active_monthly_subscribers = this.resolveChartData(this.current_active_monthly_subscribers)[0];
        this.selected_current_canceled_monthly_subscribers = this.resolveChartData(this.current_canceled_monthly_subscribers)[0];
        this.Linechart2 = this.makeChart2(this.selected_current_active_subscribers, this.selected_current_canceled_subscribers, this.selected_current_active_monthly_subscribers, this.selected_current_canceled_monthly_subscribers, this.selected_current_subscribers_date);
        //End for chart 2
        // Start for chart 3
        this.selected_current_active_annual_subscribers = this.resolveChartData(this.current_active_annual_subscribers)[0];
        this.selected_current_canceled_annual_subscribers = this.resolveChartData(this.current_canceled_annual_subscribers)[0];
        this.Linechart3 = this.makeChart3(this.selected_current_active_annual_subscribers, this.selected_current_canceled_annual_subscribers, this.selected_current_subscribers_date)
        // End for chart 3
        // Start for chart 4
        this.selected_current_active_trials = this.resolveChartData(this.current_active_trials)[0];
        this.selected_current_canceled_trials = this.resolveChartData(this.current_canceled_trials)[0];
        this.Linechart4 = this.makeChart4(this.selected_current_active_trials, this.selected_current_canceled_trials, this.selected_current_subscribers_date)
        // End for chart 4
        // Start for chart 5
        this.selected_old_subscribers = this.resolveChartData(this.old_subscribers)[0];
        this.selected_old_trials = this.resolveChartData(this.old_trials)[0];
        this.selected_new_subscribers = this.resolveChartData(this.new_subscribers)[0];
        this.selected_new_trials = this.resolveChartData(this.new_trials)[0];
        this.Linechart5 = this.makeChart5(this.selected_old_subscribers, this.selected_old_trials, this.selected_new_subscribers, this.selected_new_trials, this.selected_current_subscribers_date)
        // End for chart 5
        // Start for chart 6
        this.selected_next_month_payout = this.resolveChartData(this.next_month_payout)[0];
        this.selected_next_year_payout = this.resolveChartData(this.next_year_payout)[0];
        this.Linechart6 = this.makeChart6(this.selected_next_month_payout, this.selected_current_subscribers_date);
        // Start for chart 7
        this.selected_next_year_payout = this.resolveChartData(this.next_year_payout)[0];
        this.Linechart7 = this.makeChart7(this.selected_next_year_payout, this.selected_next_month_payout, this.selected_current_subscribers_date);
        // End for chart 7
        // Start for chart 8
        this.selected_ended_monthly_subs = this.resolveChartData(this.ended_monthly_subs)[0];
        this.selected_ended_annual_subs = this.resolveChartData(this.ended_annual_subs)[0];
        this.Linechart8 = this.makeChart8(this.selected_ended_monthly_subs, this.selected_ended_annual_subs, this.selected_current_subscribers_date);
        // End for chart 8
      },

    );

    this.plumber.getNextMonthData().subscribe(
      data => {
        for (let i in data)
          this.next_month_records.push(data[i]);
      },
      fail => { },
      () => {
        this.sortByStartTime()
        console.log("record is after sort:", this.next_month_records);
        this.next_month_records.forEach(res => {
          console.log("resis",res)
          this.next_month_date.push(moment(res.date).format('MMM D YYYY'));
          this.month_pay_to_date.push(res["payout"]);
          // to sth to the data 
        });
        console.log("this.month_pay_to_date", this.month_pay_to_date[1]);
        this.makeChart6(this.month_pay_to_date, this.next_month_date)
        // Draw char for next month.json 

      }
    );
  }
}
