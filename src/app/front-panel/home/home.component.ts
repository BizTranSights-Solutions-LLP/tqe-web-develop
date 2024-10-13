import { Component, OnInit, OnDestroy } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  bg_img: string = '../../assets/images/home_page/background.svg';
  check_circle: string = '../../assets/images/home_page/check-circle.svg';
  popular_plan: string = '../../assets/images/home_page/popular-plan.svg';

  bgImages = [
    "../../assets/images/home_page/background.svg",
    "../../assets/images/home_page/top_bg_images/nba.jpg",
    "../../assets/images/home_page/top_bg_images/cricket.jpg",
    "../../assets/images/home_page/top_bg_images/nhl.jpg",
    "../../assets/images/home_page/top_bg_images/soccer.jpg",
    "../../assets/images/home_page/top_bg_images/golf.jpg",
    "../../assets/images/home_page/top_bg_images/cricket.jpg",
  ];
  currentImageIndex: number = 0;
  bgImgIntervalId: any;

  sample_website_img: string = '../../assets/images/home_page/sample_website_img.svg';
  sample_website_img_mobile: string = '../../assets/images/home_page/sample_website_img_mobile.jpg';
  info_card_1_img: string = '../../assets/images/home_page/info_card_1_img.svg';
  info_card_2_img: string = '../../assets/images/home_page/info_card_2_img.svg';

  nba_bg: string = '../../assets/images/home_page/nba_bg.svg';
  nfl_bg: string = '../../assets/images/home_page/nfl_bg.svg';
  baseball_bg: string = '../../assets/images/home_page/baseball_bg.svg';
  soccer_bg: string = '../../assets/images/home_page/soccer_bg.svg';
  cricket_bg: string = '../../assets/images/home_page/cricket_bg.svg';
  nhl_bg: string = '../../assets/images/home_page/nhl_bg.svg';
  ncaaf_bg: string = '../../assets/images/home_page/ncaaf_bg.svg';
  ncaab_bg: string = '../../assets/images/home_page/ncaab_bg.svg';

  nba_logo: string = '../../assets/images/home_page/nba_logo.svg';
  nfl_logo: string = '../../assets/images/home_page/nfl_logo.svg';
  baseball_logo: string = '../../assets/images/home_page/baseball_logo.svg';
  soccer_logo: string = '../../assets/images/home_page/soccer_logo.svg';
  cricket_logo: string = '../../assets/images/home_page/cricket_logo.svg';
  nhl_logo: string = '../../assets/images/home_page/nhl_logo.svg';
  ncaaf_logo: string = '../../assets/images/home_page/ncaaf_logo.svg';
  ncaab_logo: string = '../../assets/images/home_page/ncaab_logo.svg';

  sports_images = [
    { bg: this.nfl_bg, logo: this.nfl_logo, link: '/tool/best-bets/nfl'},
    { bg: this.nba_bg, logo: this.nba_logo, link: '/tool/best-bets/nba'},
    { bg: this.baseball_bg, logo: this.baseball_logo, link: '/tool/best-bets/mlb'},
    { bg: this.soccer_bg, logo: this.soccer_logo, link: '/tool/best-bets/soccer'},
    { bg: this.cricket_bg, logo: this.cricket_logo,
      // link: '/tool/best-bets/cricket'
    },
    { bg: this.nhl_bg, logo: this.nhl_logo, link: '/tool/best-bets/nhl'},
    { bg: this.ncaaf_bg, logo: this.ncaaf_logo, link: '/tool/best-bets/cf'},
    { bg: this.ncaab_bg, logo: this.ncaab_logo, link: '/tool/best-bets/cb'}
  ];

  currentIndex: number = 0;
  transformStyle: string = 'translateX(0%)';
  intervalId: any;
  transitionActive: boolean = true;
  isMobile: boolean = false;

  constructor(private breakpointObserver: BreakpointObserver) {}

  ngOnInit() {
    this.sports_images = this.sports_images.concat(this.sports_images);
    this.startAutoSlide();

    this.breakpointObserver.observe([Breakpoints.Handset]).subscribe(result => {
      this.isMobile = result.matches;
    });

    this.startImageCycling();

  }

  private startImageCycling() {
    this.bg_img = this.bgImages[this.currentImageIndex];
    this.bgImgIntervalId = setInterval(() => {
      this.currentImageIndex = (this.currentImageIndex + 1) % this.bgImages.length;
      this.bg_img = this.bgImages[this.currentImageIndex];
    }, 4000);
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    if (this.bgImgIntervalId) {
      clearInterval(this.bgImgIntervalId);
    }
  }

  startAutoSlide() {
    this.intervalId = setInterval(() => {
      this.transitionActive = true;
      this.currentIndex++;
      if (this.currentIndex >= this.sports_images.length/2) {
        this.currentIndex = 0;
      }
      this.transformStyle = `translateX(-${(this.currentIndex * 100) / 3}%)`;
    }, 4000);
  }

  handleTransitionEnd() {
    if (!this.transitionActive) {
      this.transitionActive = true;
      this.transformStyle = `translateX(-${(this.currentIndex * 100) / 3}%)`;
    }
  }

  redirectToWhop(subscriptionType) {
    var redirectionLink = ""
    if (subscriptionType === "Basic") {
      redirectionLink = environment.tqeBasicViewAnnualPlan;
    }
    else if (subscriptionType === "Professional") {
      redirectionLink = environment.tqeProfessionViewAnnualPlan;
    }
    else if (subscriptionType === "Free") {
      redirectionLink = environment.tqeProfessionViewAnnualPlan;
    }
    else {
      alert("Unknown Subscription Type");
    }
    if (confirm("The Quant Edge uses Whop for subscription payments. Click OK to be redirected to Whop, or Cancel to stay on this page.")) {
      window.open(redirectionLink, "_blank");
    }
  }
}
