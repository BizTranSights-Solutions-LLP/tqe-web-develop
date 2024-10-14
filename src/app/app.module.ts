import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {Routes, RouterModule} from '@angular/router';
import {ReactiveFormsModule, FormsModule} from '@angular/forms';

import {PlyrModule} from 'ngx-plyr';

import {AppComponent} from './app.component';
import {SiteHeaderComponent} from './_layouts/site-header/site-header.component';
import {SiteFooterComponent} from './_layouts/site-footer/site-footer.component';
import {LoginComponent} from './auth/login/login.component';
import {RegisterComponent} from './auth/register/register.component';

import {OwlModule} from 'ngx-owl-carousel';
import {HttpClientModule} from '@angular/common/http';
import {AuthGuardService} from './guard/auth-guard.service';
import {SportsbookComponent} from './front-panel/promos/sportsbook/sportsbook.component';
import {DfspromoComponent} from './front-panel/promos/dfspromo/dfspromo.component';
import {HomeCanLoadService} from './services/home-can-load.service';
import {MembershipComponent} from './front-panel/membership/membership.component';
import {AboutusComponent} from './front-panel/aboutus/aboutus.component';
import {TermsAndConditionComponent} from './front-panel/terms-and-condition/terms-and-condition.component';
import {PrivacypolicyComponent} from './front-panel/privacypolicy/privacypolicy.component';
import {FaqsComponent} from './front-panel/faqs/faqs.component';

import {AdminLayoutComponent} from './_layouts/admin-layout/admin-layout.component';
import {AdminHeaderComponent} from './_layouts/admin-header/admin-header.component';
import {AdminFooterComponent} from './_layouts/admin-footer/admin-footer.component';

import {SiteLayoutComponent} from './_layouts/site-layout/site-layout.component';
import {CreateAccountComponent} from './front-panel/membership/create-account/create-account.component';
import {BillingInformationComponent} from './front-panel/membership/billing-information/billing-information.component';
import {PodcastDetailComponent} from './front-panel/podcasts/podcast-detail/podcast-detail.component';
import {ArticleDetailComponent} from './front-panel/articles/article-detail/article-detail.component';
import {ToolDetailComponent} from './front-panel/tools-list/tool-detail/tool-detail.component';

import {ModalModule} from 'ngx-bootstrap/modal';
import {BillingAuthService} from './services/billing-auth.service';
import {ResetPasswordComponent} from './auth/reset-password/reset-password.component';
import {ProfileComponent} from './front-panel/profile/profile.component';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {EditComponent} from './front-panel/profile/edit/edit.component';
import {SearchComponent} from './front-panel/search/search.component';

import {PointsbetComponent} from './front-panel/promos/review/pointsbet/pointsbet.component';
import {DraftKingsSportsBookComponent} from './front-panel/promos/review/draft-kings-sports-book/draft-kings-sports-book.component';
import {BetstarsComponent} from './front-panel/promos/review/betstars/betstars.component';
import {SugarhouseComponent} from './front-panel/promos/review/sugarhouse/sugarhouse.component';
import {CaesersComponent} from './front-panel/promos/review/caesers/caesers.component';
import {MonkeyKnifeFightComponent} from './front-panel/promos/review/monkey-knife-fight/monkey-knife-fight.component';
import {ThriveComponent} from './front-panel/promos/review/thrive/thrive.component';

import {AffiliateComponent} from './front-panel/affiliate/affiliate.component';
import {AffiliateCreateAccountComponent} from './front-panel/affiliate/create-account/create-account.component';
import {DashboardComponent} from './front-panel/affiliate/dashboard/dashboard.component';
import {EditAffiliateComponent} from './front-panel/affiliate/dashboard/edit/edit.component';

import {SharedModule} from './shared/shared/shared.module';
import {SwagComponent} from './front-panel/swag/swag.component';
import {ChatComponent} from './front-panel/chat/chat.component';

import {AdminLoginComponent} from './admin-panel/components/admin-login/admin-login.component';
import {AdminAuthService} from './services/admin-auth.service';
import {AdminCanLoadService} from './services/admin-can-load.service';
// import { PicksHistoryComponent } from './front-panel/betting-results/picks-history/picks-history.component';
import {RoiCalculatorComponent} from './front-panel/betting-results/roi-calculator/roi-calculator.component';
import {Betting101Component} from './front-panel/promos/betting101/betting101.component';

import {FreeMembershipComponent} from './front-panel/free-membership/free-membership.component';
import {MediaLibraryComponent} from './admin-panel/components/shared/media-library/media-library.component';
import {VideosListComponent} from './front-panel/videos/videos-list/videos-list.component';
import {VideosDetailComponent} from './front-panel/videos/videos-detail/videos-detail.component';

import {VipComponent} from './front-panel/home/vip.component';
import {FantasyComponent} from './front-panel/fantasy/fantasy.component';
import {NgPipesModule} from 'ngx-pipes';
import {Chart} from 'chart.js';
// NBA Optimizer
// import {NbaDkOptimizerComponent} from './front-panel/nba-dk-optimizer/nba-dk-optimizer.component';
// import {NbaFdOptimizerComponent} from './front-panel/nba-fd-optimizer/nba-fd-optimizer.component';
// import {NbaDkPlayerPoolComponent} from './front-panel/nba-dk-optimizer/player-pool/player-pool.component';
// import {NbaFdPlayerPoolComponent} from './front-panel/nba-fd-optimizer/player-pool/player-pool.component';
// import {TeamFilterComponent} from './front-panel/nba-dk-optimizer/team-filter/team-filter.component';
// import {PlayerSelectComponent} from './front-panel/nba-dk-optimizer/player-select/player-select.component';
// import {ExcludedPipe} from './front-panel/nba-dk-optimizer/excluded.pipe';
// import {ShownPipe} from './front-panel/nba-dk-optimizer/shown.pipe';
// import {TextSearchPipe} from './front-panel/nba-dk-optimizer/text-search.pipe';
// import {AngularBootstrapToastsModule} from 'angular-bootstrap-toasts';

// NBA Player Impact Tool
import {NbaPlayerImpactComponent} from './front-panel/best-bets/nba-player-impact/nba-player-impact.component';
// NFL pLAYER Impact Too
import {NflPlayerImpactComponent} from './front-panel/best-bets/nfl-player-impact/nfl-player-impact.component';

// Angular Material
import {MatSelectModule} from '@angular/material/select';
import {MatSliderModule} from '@angular/material/slider';

// Exported iFrame
import {SoccerBestBetsExportComponent} from './front-panel/best-bets/soccer/soccer-best-bets-export.component';
import {CfPlayerExportImpactComponent} from './front-panel/best-bets/cf-player-impact/cf-player-impact-export.component';
import {NbaPlayerExportImpactComponent} from './front-panel/best-bets/nba-player-impact/nba-player-impact-export.component';
import {MlbPlayerExportImpactComponent} from './front-panel/best-bets/mlb-player-impact/mlb-player-impact-export.component';

import {HowItWorksComponent} from './front-panel/how-it-works/how-it-works.component';
import {NflPlayerExportImpactComponent} from './front-panel/best-bets/nfl-player-impact/nfl-player-impact-export.component';
import {SoccerPlayerExportImpactComponent} from './front-panel/best-bets/soccer-player-impact/soccer-player-impact-export.component';
import {AllPlayerExportImpactComponent} from './front-panel/best-bets/all-player-impact-export.component';

// Interal Tools:
import {NflBestBetsInternalComponent} from './front-panel/best-bets/nfl-interal/nfl-best-bets-internal.component';

// New Betting Result Toos:
import {AllPicksHistoryComponent} from './front-panel/betting-results/picks-history/picks-history-header.component';
import {NflPicksHistoryComponent} from './front-panel/betting-results/picks-history/nfl-picks-history/nfl-picks-history.component';
import {UniquePipe} from './front-panel/betting-results/picks-history/unique-value.pipe';

// Forgot pwd page:
import {ForgotPasswordComponent} from './auth/forget-password/forget-password.component';

// Customer Internal page:
import {CustomerInternalComponent} from './front-panel/customer-internal/customer-internal.component';
import {AngularFontAwesomeModule} from 'angular-font-awesome';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material';
import {MatFormFieldModule, MatInputModule} from '@angular/material';
import {MatButtonModule} from '@angular/material/button';

// nfl-demo:
import {NFLDemo} from './front-panel/tools-list/nfl-demo/nfl-demo.component';

// nba-demo:
import {NbaDemo} from './front-panel/best-bets/demo-nba-impact/nba-demo.component';
import {ReferralComponent} from './front-panel/referral/referral.component';
import {DynamicEmailComponent} from './front-panel/dynamic-email/dynamic-email.component';
import {EducationPageComponent} from './front-panel/education-page/education-page.component';
import {TqeToolsEduComponent} from './front-panel/tqe-tools-edu/tqe-tools-edu.component';

// ifream:
import {IfreamPicksComponent} from './front-panel/ifream-picks/ifream-picks.component';
import {IfNflComponent} from './front-panel/ifream-picks/if-nfl/if-nfl.component';
import {IfNbaComponent} from './front-panel/ifream-picks/if-nba/if-nba.component';
import {IfSoccerComponent} from './front-panel/ifream-picks/if-soccer/if-soccer.component';
import {IfMlbComponent} from './front-panel/ifream-picks/if-mlb/if-mlb.component';
import {IfNcaabComponent} from './front-panel/ifream-picks/if-ncaab/if-ncaab.component';
import {IfNcaafComponent} from './front-panel/ifream-picks/if-ncaaf/if-ncaaf.component';
import {IfNhlComponent} from './front-panel/ifream-picks/if-nhl/if-nhl.component';
import {AngularBootstrapToastsModule} from 'angular-bootstrap-toasts';

// whop
import { WhopLoginComponent } from './auth/whop-login/whop-login.component';
import { SiteSidebarComponent } from './_layouts/site-sidebar/site-sidebar.component';
import { CricketPlayerImpactComponent } from './front-panel/best-bets/cricket-player-impact/cricket-player-impact.component';
import { CfPlayerImpactComponent } from './front-panel/best-bets/cf-player-impact/cf-player-impact.component';
import { HowToFindPlayerImpactToolsComponent } from './front-panel/how-to-find-player-impact-tools/how-to-find-player-impact-tools.component';
import { HowToUsePlayerPerformanceComponent } from './front-panel/how-to-use-player-performance/how-to-use-player-performance.component';
import { HowToUnderstandPlayerImpactToolLayoutComponent } from './front-panel/how-to-understand-player-impact-tool-layout/how-to-understand-player-impact-tool-layout.component';

const routes: Routes = [

  {
    path: '',
    component: SiteLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: './front-panel/home/home.module#HomeModule',
        pathMatch: 'prefix',
        canActivate: [HomeCanLoadService]
      },
      {path: 'fantasy', component: FantasyComponent},
      {path: 'vip', component: VipComponent},
      {
        path: 'articles',
        loadChildren: './front-panel/articles/articles.module#ArticlesModule',
        pathMatch: 'prefix'
      },
      {
        path: 'tools-list',
        loadChildren: './front-panel/tools-list/tools-list.module#ToolsListModule',
        pathMatch: 'prefix'
      },
      {
        path: 'tool/:title/ng',
        loadChildren: './front-panel/tools/tools.module#ToolsModule',
        pathMatch: 'prefix'
      },
      {
        path: 'experts',
        loadChildren: './front-panel/experts/experts.module#ExpertsModule',
        pathMatch: 'prefix'
      },
      {path: 'login', component: LoginComponent},
      {path: 'register', component: RegisterComponent},
      {path: 'reset-password', component: ResetPasswordComponent},
      {path: 'forget-password', component: ForgotPasswordComponent},
      {path: 'whopCallback', component: WhopLoginComponent},
      {
        path: 'landing',
        loadChildren: './front-panel/landing/landing.module#LandingModule',
        pathMatch: 'prefix',
        canLoad: [AuthGuardService]
      },
      {path: 'sportsbook-promos', component: SportsbookComponent},
      {path: 'dfs-promos', component: DfspromoComponent},
      {path: 'pointsbet-review', component: PointsbetComponent},
      {path: 'draftking-review', component: DraftKingsSportsBookComponent},
      {path: 'betstars-review', component: BetstarsComponent},
      {path: 'sugarhouse-review', component: SugarhouseComponent},
      {path: 'caesers-review', component: CaesersComponent},
      {path: 'monkey-knife-fight-review', component: MonkeyKnifeFightComponent},
      {path: 'thrive-review', component: ThriveComponent},
      {
        path: 'podcasts',
        loadChildren: './front-panel/podcasts/podcasts.module#PodcastsModule',
        pathMatch: 'prefix',
      },
      {path: 'tqe-videos', component: VideosListComponent},
      {path: 'tqe-video/:title', component: VideosDetailComponent},
      {path: 'membership-plan', component: MembershipComponent},
      {path: 'try-it-free/plans', component: MembershipComponent},
      {path: 'meet-the-team', component: AboutusComponent},
      {path: 'terms-and-condition', component: TermsAndConditionComponent},
      {path: 'privacy-policy', component: PrivacypolicyComponent},
      {path: 'faqs', component: FaqsComponent},
      {path: 'create-account', component: CreateAccountComponent},
      {path: 'try-it-free/create-account', component: CreateAccountComponent},
      {path: 'try-it-free/create-account/:plan', component: CreateAccountComponent},
      {path: 'billing-information', component: BillingInformationComponent, canActivate: [BillingAuthService]},
      {path: 'try-it-free/billing-information', component: BillingInformationComponent, canActivate: [BillingAuthService]},
      {path: 'podcast/:title', component: PodcastDetailComponent},
      {path: 'article/:title', component: ArticleDetailComponent},
      // {path: 'tool/nba-dk-optimizer', component: NbaDkOptimizerComponent},
      // {path: 'tool/nba-fd-optimizer', component: NbaFdOptimizerComponent},
      {
        path: 'tool/best-bets',
        loadChildren: './front-panel/best-bets/best-bets.module#BestBetsModule',
        pathMatch: 'prefix'
      },
      // New Betting Result Tools:
      {path: 'tool/all-pick-history', component: AllPicksHistoryComponent},
      {path: 'tool/nba-player-impact', component: NbaPlayerImpactComponent},
      {path: 'tool/nfl-player-impact', component: NflPlayerImpactComponent},
      {path: 'tool/cricket-player-impact', component: CricketPlayerImpactComponent},
      {path: 'tool/cf-player-impact', component: CfPlayerImpactComponent},
      {path: 'tool/:title', component: ToolDetailComponent},
      {path: 'profile', component: ProfileComponent},
      {path: 'edit-profile', component: EditComponent},
      {path: 'search', component: SearchComponent},
      {path: 'shop-tqe', component: SwagComponent},
      {path: 'affiliate', component: AffiliateComponent},
      {path: 'affiliate/dashboard', component: DashboardComponent},
      {path: 'affiliate/dashboard/edit', component: EditAffiliateComponent},
      {path: 'affiliate/create-account', component: AffiliateCreateAccountComponent},
      {path: 'chat', component: ChatComponent},
      {path: 'roi-calculator', component: RoiCalculatorComponent},
      // { path: 'picks-history', component: PicksHistoryComponent},
      {path: 'betting-101', component: Betting101Component},
      {path: 'how-it-works', component: HowItWorksComponent},
      {path: 'how-to-find-player-impact-tool', component: HowToFindPlayerImpactToolsComponent},
      {path: 'understand-player-impact-tool-layout', component: HowToUnderstandPlayerImpactToolLayoutComponent},
      {path: 'use-player-performance', component: HowToUsePlayerPerformanceComponent},
      {path: 'education-page', component: EducationPageComponent},
      {path: 'TQE-Tools-Info', component: TqeToolsEduComponent},
      // internal paths:
      {path: 'tool/1prmHTwjqYv4CyPFixzESVyytftQ91k7/internal/nfl', component: NflBestBetsInternalComponent},
      {path: 'tool/1prmHTwjqYv4CyPFixzESVyytftQ91k7/internal/customer', component: CustomerInternalComponent},
      // NFLDemo
      {path: 'nfl-demo', component: NFLDemo},
      {path: 'nba-demo', component: NbaDemo},
      {path: 'referral', component: ReferralComponent}
    ]
  }, {
    path: 'admin',
    component: AdminLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: './admin-panel/admin.module#AdminModule',
        pathMatch: 'prefix',
        canLoad: [AdminCanLoadService]
      }
    ]
  },
  {
    path: 'admin-auth/login',
    component: AdminLoginComponent,
    canActivate: [AdminAuthService]
  },
  {
    path: 'export/soccer',
    component: SoccerBestBetsExportComponent
  },
  {
    path: 'export/tqe-impact',
    component: AllPlayerExportImpactComponent
  },
  {
    path: 'export/tqe-pick',
    component: IfreamPicksComponent
  },
  {path: '**', redirectTo: ''}

];

@NgModule({
  declarations: [
    AppComponent,
    SiteHeaderComponent,
    SiteFooterComponent,
    LoginComponent,
    RegisterComponent,
    SportsbookComponent,
    DfspromoComponent,
    MembershipComponent,
    AboutusComponent,
    TermsAndConditionComponent,
    PrivacypolicyComponent,
    FaqsComponent,
    AdminLayoutComponent,
    AdminHeaderComponent,
    AdminFooterComponent,
    SiteLayoutComponent,
    CreateAccountComponent,
    BillingInformationComponent,
    PodcastDetailComponent,
    ArticleDetailComponent,
    ResetPasswordComponent,
    ForgotPasswordComponent,
    ProfileComponent,
    EditComponent,
    SearchComponent,
    ToolDetailComponent,
    PointsbetComponent,
    DraftKingsSportsBookComponent,
    BetstarsComponent,
    SugarhouseComponent,
    CaesersComponent,
    MonkeyKnifeFightComponent,
    ThriveComponent,
    SwagComponent,
    AffiliateComponent,
    DashboardComponent,
    EditAffiliateComponent,
    AffiliateCreateAccountComponent,
    ChatComponent,
    AdminLoginComponent,
    // PicksHistoryComponent,
    RoiCalculatorComponent,
    Betting101Component,
    FreeMembershipComponent,
    VipComponent,
    FantasyComponent,
    // Optimizers
    // NbaDkOptimizerComponent,
    // NbaFdOptimizerComponent,
    // NbaDkPlayerPoolComponent,
    // NbaFdPlayerPoolComponent,
    // TeamFilterComponent,
    // PlayerSelectComponent,
    // ExcludedPipe,
    // ShownPipe,
    // TextSearchPipe,
    HowItWorksComponent,
    MediaLibraryComponent,
    VideosListComponent,
    VideosDetailComponent,
    // NBA Player Impact
    NbaPlayerImpactComponent,
    NflPlayerImpactComponent,
    // Exported iFrame
    AllPlayerExportImpactComponent,
    SoccerBestBetsExportComponent,
    CfPlayerExportImpactComponent,
    NbaPlayerExportImpactComponent,
    MlbPlayerExportImpactComponent,
    NflPlayerExportImpactComponent,
    SoccerPlayerExportImpactComponent,
    // Interal tools:
    NflBestBetsInternalComponent,
    CustomerInternalComponent,
    // New Betting Result Toos:
    AllPicksHistoryComponent,
    NflPicksHistoryComponent,
    UniquePipe,
    // Nfl demo
    NFLDemo,
    // Nba demo
    NbaDemo,
    ReferralComponent,
    DynamicEmailComponent,
    EducationPageComponent,
    TqeToolsEduComponent,
    IfreamPicksComponent,
    IfNflComponent,
    IfNbaComponent,
    IfSoccerComponent,
    IfMlbComponent,
    IfNcaabComponent,
    IfNcaafComponent,
    IfNhlComponent,
    WhopLoginComponent,
    SiteSidebarComponent,
    CricketPlayerImpactComponent,
    CfPlayerImpactComponent,
    HowToFindPlayerImpactToolsComponent,
    HowToUsePlayerPerformanceComponent,
    HowToUnderstandPlayerImpactToolLayoutComponent,
  ],
  imports: [
    // Import font-aws
    AngularFontAwesomeModule,
    MatDatepickerModule,
    MatButtonModule,
    // imported pipe
    NgPipesModule,
    BrowserModule,
    OwlModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
    ModalModule.forRoot(),
    BrowserAnimationsModule,
    PlyrModule,
    SharedModule,
    AngularBootstrapToastsModule,
    // Angular Material
    MatSelectModule,
    MatSliderModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
