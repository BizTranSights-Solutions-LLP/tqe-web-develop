import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Subject  } from 'rxjs';
import { Router } from "@angular/router";
import { PodcastService } from '../../services/podcast.service';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-podcast-listing',
  templateUrl: './podcast-listing.component.html',
  styleUrls: ['./podcast-listing.component.css']
})
export class PodcastListingComponent implements OnInit, OnDestroy {

  getPodcastListSub: Subscription;  
  deletePodcastSub: Subscription; 
  dtTrigger = new Subject();
  dtOptions: DataTables.Settings = {};
  podcasts = [];
  Loading = false;
  base_url: string = '';
  canDelete: boolean = true;

  constructor(
    private podcastService: PodcastService, 
    private router: Router,
    private authSrvc: AuthService
  ) { }

  ngOnInit(): void {

    let user_d = this.authSrvc.getUserDetail();
    let roles = Object.keys(user_d.roles_status);

    if((roles.length > 0) && ('is_editor' in user_d.roles_status)){
      this.canDelete = false;
    }

    this.base_url = window.location.origin + '/podcast/';
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      // responsive: true,
      order: []
    };
    this.getPodcastListSub = this.podcastService.get_podcast_listing().subscribe(
      (response) => {
        if(response.result){
          this.podcasts = response['result']['podcast_data'];
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

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
    this.getPodcastListSub ? this.getPodcastListSub.unsubscribe(): '';
    this.deletePodcastSub ? this.deletePodcastSub.unsubscribe(): '';
  }

  editPodcast(podcastId) {
    this.router.navigate(['/admin/podcast-form/', podcastId]);    
  }

  deletePodcast(podcastId, index) {

    // console.log(podcastId, index)

    if (!window.confirm('Are you sure you want to delete ?') ) {
      return false;
    }

    let podcastData = {
      podcast_id: podcastId
    }   
  
    this.deletePodcastSub = this.podcastService.delete_podcast(podcastData).subscribe( 
      (response) => {

        if (response.meta.code === 200) {

          console.log('resp',response);
          var podcasts = [...this.podcasts] ;
          podcasts.splice(index, 1);
          this.podcasts = podcasts;
        }
        
      },
      (error) => {
        console.log('error',error)
        this.is_Authenticate(error);
      }); 
  }

  is_Authenticate(error) {
    if(error.status === 401) {
      localStorage.removeItem('data');
      this.router.navigate(['admin-auth/login']);
    }
  }



}
 