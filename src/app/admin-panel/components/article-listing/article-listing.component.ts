import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Subject  } from 'rxjs';
import { Router } from "@angular/router";

import { ArticleService } from '../../services/article.service';
import { AuthService } from '../../../services/auth.service';
@Component({
  selector: 'app-article-listing',
  templateUrl: './article-listing.component.html',
  styleUrls: ['./article-listing.component.css']
})

export class ArticleListingComponent implements OnDestroy, OnInit {

  getArticleListSub: Subscription;  
  deleteArticleSub: Subscription; 
  dtTrigger = new Subject();
  dtOptions: DataTables.Settings = {};
  articles = [];
  Loading = false;
  base_url: string = '';
  canDelete: boolean = true;

  constructor(
    private articleService: ArticleService, 
    private router: Router,
    private authSrvc: AuthService
    ) { }

  ngOnInit(): void {

    let user_d = this.authSrvc.getUserDetail();
    let roles = Object.keys(user_d.roles_status);
    if((roles.length > 0) && ('is_editor' in user_d.roles_status)){
      this.canDelete = false;
    }

    this.base_url = window.location.origin + '/article/';
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      // responsive: true,
      order: []
    };
    this.getArticleListSub = this.articleService.get_article_listing().subscribe(
      (response: any) => {
        if(response.result){
          this.articles = response['result']['article_data'];
          this.Loading = true;
          // Calling the DT trigger to manually render the table
          this.dtTrigger.next();                    
        } 
      },
      (err) => {
        this.is_Authenticate(err);
      }      
      );    
  }

  // ajaxCall(params: any, callback) {
  //   this.articleService.get_article_listing().subscribe(
  //     (res: any) => {
  //       if(res.result){
  //         this.articles = res['result']['article_data'];
  //         this.Loading = true;
  //         this.dtTrigger.next();                    
  //       }

  //       callback({
  //         recordsTotal: this
  //       });
  //     }
  //   );
  // }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
    this.getArticleListSub ? this.getArticleListSub.unsubscribe(): '';
    this.deleteArticleSub ? this.deleteArticleSub.unsubscribe(): '';
  }

  editArticle(articleId) {
    this.router.navigate(['/admin/article-form/', articleId]);    
  }

  is_Authenticate(error) {
    if(error.status === 401) {
      localStorage.removeItem('data');
      this.router.navigate(['admin-auth/login']);
    }
  }

  deleteArticle(articleId, index) {

    // console.log(articleId, index)

    if (!window.confirm('Are you sure you want to delete ?') ) {
      return false;
    }

    let articleData = {
      article_id: articleId
    }   
  
    this.deleteArticleSub = this.articleService.delete_article(articleData).subscribe( 
      (response) => {

        if (response.meta.code === 200) {

          console.log('resp',response);
          var articles = [...this.articles] ;
          articles.splice(index, 1);
          this.articles = articles;
        }
        
      },
      (error) => {
        console.log('error',error);
        this.is_Authenticate(error); 
      }); 
  }
  
}