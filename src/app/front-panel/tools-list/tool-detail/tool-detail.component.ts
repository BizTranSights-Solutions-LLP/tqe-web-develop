import { Component, OnInit, OnDestroy, ElementRef, ViewChild, Renderer2, Inject, ComponentFactoryResolver, ViewContainerRef } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../../services/data.service';
import { SeoService } from '../../../services/seo.service';
import { Subscription } from 'rxjs';
import { ModalDirective } from 'ngx-bootstrap/modal';

// import { OptimizerComponent } from '../optimizer/optimizer.component';
// import { AllComponent } from '../../tools/all/all.component';
// import { ExcludedComponent } from '../../tools/excluded/excluded.component';

@Component({
  selector: 'app-tool-detail',
  templateUrl: './tool-detail.component.html',
  styleUrls: ['./tool-detail.component.css']
})
export class ToolDetailComponent implements OnInit, OnDestroy {
  
  // @ViewChild('myDiv') myDiv: ElementRef;
  @ViewChild('autoShownModal') autoShownModal: ModalDirective;
  // @ViewChild('dynamicTool', { read: ViewContainerRef}) viewContainerRef : ViewContainerRef

  allData: any = {};
  ng_tools: Array<number> = [21,22];

  LoggedIn: boolean = false;
  loader: boolean = false;
  isModalShown = false;
  disableIframe = false;
  
  serverErrors: string = '';
  unAuthorized: string = '';
  content = ``;
  videoSrc = '';

  
  loginEventSubscription: Subscription;
  editOnDashboardSubscription: Subscription;
  // factoryResolver;
  // rootViewContainer;

  constructor(
    private authService: AuthService, 
    private route: ActivatedRoute, 
    private dataService: DataService, 
    private router: Router, 
    private seoService: SeoService,
    private renderer: Renderer2,
    // @Inject(ComponentFactoryResolver) factoryResolver,
    // @Inject(ViewContainerRef) viewContainerRef
    ) { 
      // this.factoryResolver = factoryResolver;
    }
  
  // setRootViewContainerRef(viewContainerRef) {
  //   this.rootViewContainer = viewContainerRef
  // }

  // addDynamicComponent(dynamicComponent) {
  //   const factory = this.factoryResolver
  //                       .resolveComponentFactory(dynamicComponent)
  //   const component = factory
  //     .create(this.rootViewContainer.parentInjector)
  //   this.rootViewContainer.insert(component.hostView)
  // }

  ngOnInit() {
    
    this.LoggedIn = this.authService.isUserLoggedIn();
    if(!this.LoggedIn) {
      console.log('Not Logged in')
      this.unAuthorized = 'Please Login To Get Access';
    } else {
      this.get_user_data();
    }
    console.log('ahhhhhh')
    this.loginEventSubscription = this.authService.logginEvent.subscribe(
      (res) => {
        if(res) {
          // this.renderer.setAttribute(this.myDiv.nativeElement, 'innerHTML', this.content);
          this.unAuthorized = '';
          this.authService.overLay.emit(false);
          this.LoggedIn = true;
          this.get_user_data();
        }
      }
    )   
    
  }

  async get_user_data(){
    this.loader = true;
    let tool_title = this.route.snapshot.params['title'];
    console.log("tool_title is",tool_title )
    
    let data:any;
    try{
      data = await this.dataService.get_tool(tool_title).toPromise();

      this.serverErrors = '';
      this.allData = data.result;
      let { id,url } = this.allData;
      if(this.ng_tools.indexOf(id) > -1) {
        this.router.navigate(['tool',url,'ng']);
      }

      // this.editOnDashboardSubscription = this.dataService.editOnDashboard.subscribe(
      //   (res: string) => {
      //     if(res && Object.keys(this.allData).length > 0){
      //       let url = 'admin/'+res+'/'+this.allData.id;
      //       // this.router.navigate([url]);
      //       window.open(url, "_blank");
      //     }
      //   }
      // );
      // console.log(this.allData );
      setTimeout(()=>{
        this.loader = false;
      },5000);

      // console.log(data);

      if(typeof this.allData === 'string') {
        this.router.navigate(['tools-list']);
      } else {
        // this.iframe = this.allData.iframe_url;
        // this.setRootViewContainerRef(this.viewContainerRef);
        // this.addDynamicComponent(AllComponent);

        this.seoService.updateTitle(this.allData.title);
        if(this.allData.meta_tags.length > 0) {
          let meta_data = this.allData.meta_tags[0];
          
          if(this.allData.images.length > 0) {
            this.seoService.updateImage(this.allData.images[0].file_path);            
          }
          console.log("this.allData.titleis",this.allData.title)

          this.seoService.updateAllTags({type:'tool', title: this.allData.title, description: meta_data.description, url: window.location.href, image: this.allData.images.length > 0 ? this.allData.images[0].file_path : '' });
          this.seoService.updateSeoTags(meta_data.title,meta_data.description,window.location.href,meta_data.keyword);
        }
      }

    }catch(e) {
      if(e.status === 401 || e.error.message === 'Unauthenticated.') {
        this.serverErrors = 'You are UnAuthenticated. Please login again!';
        this.loader = false;
        setTimeout(()=>{
          this.authService.logoutEvent.emit(true);
          localStorage.clear();
          sessionStorage.clear();
          this.router.navigate(['/'])
        },1000);
      }
      // else if(e.status === 400 || e.error.message === 'No membership found.') {
      //   // this.serverErrors = 'You are UnAuthenticated. Please login again!';
      //   this.tourGuide.hide();
      //   console.log(this.serverErrors);

      // }
    }
  }

  // loadOtherComp() {
  //   console.log('triggered');
  //   this.viewContainerRef.clear();
  //   this.setRootViewContainerRef(this.viewContainerRef);
  //   this.addDynamicComponent(ExcludedComponent);
  // }
  
  showOverlay() {
    this.authService.overLay.emit(true);
  }
  ngOnDestroy() {
    if(this.loginEventSubscription) { this.loginEventSubscription.unsubscribe(); }
    if(this.editOnDashboardSubscription) { this.editOnDashboardSubscription.unsubscribe(); }
  }

  showModal(src): void {
    this.isModalShown = true;
    this.videoSrc = src;
  }
 
  hideModal(): void {
    this.autoShownModal.hide();
  }
 
  onHidden(): void {
    this.isModalShown = false;
  }
}
