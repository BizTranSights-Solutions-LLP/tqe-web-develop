import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { RichTextEditorAllModule } from '@syncfusion/ej2-angular-richtexteditor';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { DataTablesModule } from 'angular-datatables';
import { ModalModule } from 'ngx-bootstrap/modal';

import { CreateArticleComponent } from './components/create-article/create-article.component';
import { PodcastComponent } from './components/podcast/podcast.component';
import { ToolComponent } from './components/tool/tool.component';
import { MembershipComponent } from './components/membership/membership.component';
import { ArticleListingComponent } from './components/article-listing/article-listing.component';
import { PodcastListingComponent } from './components/podcast-listing/podcast-listing.component';
import { ToolListingComponent } from './components/tool-listing/tool-listing.component';
import { MembershipListingComponent } from './components/membership-listing/membership-listing.component';
import { AdminFeatureAccessService } from '../services/admin-feature-access.service';
import { UsersListingComponent } from './components/users-listing/users-listing.component';
import { UserFormComponent } from './components/user-form/user-form.component';
import { DiscountsListComponent } from './components/discounts-list/discounts-list.component';
import { DiscountFormComponent } from './components/discount-form/discount-form.component';
import { SeoFormComponent } from './components/seo-form/seo-form.component';
import { SeoListingComponent } from './components/seo-listing/seo-listing.component';
// import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

// import { NgxTinymceModule } from 'ngx-tinymce';
import { NgxSummernoteModule } from 'ngx-summernote';
// import { MediaLibraryComponent } from './components/shared/media-library/media-library.component';
// import { MatFileUploadModule } from 'angular-material-fileupload';

const routes: Routes = [
  { path: '', redirectTo: 'article-lists', pathMatch: 'full' },
  { path: 'article-form', component: CreateArticleComponent, canActivate: [ AdminFeatureAccessService ] },
  { path: 'article-form/:id', component: CreateArticleComponent, canActivate: [ AdminFeatureAccessService ] },
  { path: 'podcast-form', component: PodcastComponent , canActivate: [ AdminFeatureAccessService ] },
  { path: 'podcast-form/:id', component: PodcastComponent , canActivate: [ AdminFeatureAccessService ] },
  { path: 'users-list', component: UsersListingComponent, canActivate: [ AdminFeatureAccessService ] },
  { path: 'user-form', component: UserFormComponent, canActivate: [ AdminFeatureAccessService ] },
  { path: 'user-form/:id', component: UserFormComponent, canActivate: [ AdminFeatureAccessService ] },
  { path: 'tool-form', component: ToolComponent , canActivate: [ AdminFeatureAccessService ] },
  { path: 'tool-form/:id', component: ToolComponent , canActivate: [ AdminFeatureAccessService ] },
  { path: 'membership-form', component: MembershipComponent , canActivate: [ AdminFeatureAccessService ] },
  { path: 'membership-form/:id', component: MembershipComponent , canActivate: [ AdminFeatureAccessService ] },
  { path: 'article-lists', component: ArticleListingComponent, canActivate: [ AdminFeatureAccessService ] },
  { path: 'podcast-lists', component: PodcastListingComponent , canActivate: [ AdminFeatureAccessService ] },
  { path: 'tool-lists', component: ToolListingComponent , canActivate: [ AdminFeatureAccessService ] },
  { path: 'membership-lists', component: MembershipListingComponent , canActivate: [ AdminFeatureAccessService ] },
  { path: 'discounts-list', component: DiscountsListComponent , canActivate: [ AdminFeatureAccessService ] },
  { path: 'discount-form', component: DiscountFormComponent , canActivate: [ AdminFeatureAccessService ] },
  { path: 'discount-form/:id', component: DiscountFormComponent , canActivate: [ AdminFeatureAccessService ] },
  { path: 'seo-list', component: SeoListingComponent , canActivate: [ AdminFeatureAccessService ] },
  { path: 'seo-form', component: SeoFormComponent , canActivate: [ AdminFeatureAccessService ] },
  { path: 'seo-form/:id', component: SeoFormComponent , canActivate: [ AdminFeatureAccessService ] }
];

@NgModule({

  declarations: [
    CreateArticleComponent,
    PodcastComponent,
    ToolComponent,
    MembershipComponent,
    ArticleListingComponent,
    PodcastListingComponent,
    ToolListingComponent,
    MembershipListingComponent,
    UsersListingComponent,
    UserFormComponent,
    DiscountsListComponent,
    DiscountFormComponent,
    SeoFormComponent,
    SeoListingComponent
  ],
  imports: [
    CommonModule,
    RichTextEditorAllModule,
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    BsDatepickerModule.forRoot(),
    DataTablesModule,
    ModalModule.forRoot(),
    // MatFileUploadModule,
    // CKEditorModule
    // NgxTinymceModule.forRoot({
    //   // baseURL: '../assets/tinymce/'
    //   baseURL: '//cdnjs.cloudflare.com/ajax/libs/tinymce/5.0.14/'
    // })
    NgxSummernoteModule
  ]
})

export class AdminModule { }

