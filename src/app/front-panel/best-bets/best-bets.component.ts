import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { SeoService } from '../../services/seo.service';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';
import { AngularBootstrapToastsService } from 'angular-bootstrap-toasts';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Router, Event, NavigationStart, NavigationEnd, NavigationError } from '@angular/router';
import * as moment from 'moment';

@Component({
  selector: 'app-best-bets',
  templateUrl: './best-bets.component.html',
  styleUrls: ['./best-bets.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})

export class BestBetsComponent implements OnInit {
  // @ViewChild('signupModal') signupModal: ModalDirective;
  constructor(
    private authService: AuthService,
    private router: Router,
    // private plumber: NbaFdService,
    private toast: AngularBootstrapToastsService
  ) {
    // Update league button as url is changed
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        this.league = this.router.url.split("/").pop();
    }
  });
  }

  league: string  = "";

  ngOnInit() {
    this.league = this.router.url.split("/").pop();
  }

  // === PUBLIC METHODS ====================================================

  // === PRIVATE METHODS ===================================================

  // private authorizeUser () {
  //   let isLoggedIn: any = this.authService.isUserLoggedIn();
  //   let tool: string = "nba-dk-optimizer"
  //
  //   this.dataService.get_tool(tool).subscribe(
  //     res => {
  //       let toolDetail: any = res;
  //       this.isAuthorized = !!isLoggedIn && (toolDetail.result.is_allowed === 1);
  //     },
  //     err => console.log("  Error:", err),
  //     ()  => {}
  //   );
  //
  // }

  private toastErrorMsg(title, msg) {
    this.toast.showSimpleToast({
      text: msg,
      title: title,
      iconClass: "fas fa-exclamation-triangle",
      titleClass: "bg-danger text-white",
      closeButtonClass: "text-white",
      toastClass: "border-danger",
      duration: 5000,
      bodyClass: "",
      toolbarClass: "",
    });
  };

  private toastInfoMsg(title, msg) {
    this.toast.showSimpleToast({
      text: msg,
      title: title,
      iconClass: "fas fa-info-circle",
      titleClass: "bg-info text-white",
      closeButtonClass: "text-white",
      toastClass: "border-info",
      duration: 5000,
      bodyClass: "",
      toolbarClass: "",
    });
  };

}
