import { Component, OnInit, OnDestroy, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { DataService } from '../../services/data.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-tools-list',
  templateUrl: './tools-list.component.html',
  styleUrls: ['./tools-list.component.css']
})
export class ToolsListComponent implements OnInit, OnDestroy {

  // @ViewChild('myDiv') myDiv: ElementRef;
  @ViewChild('autoShownModal') autoShownModal: ModalDirective;

  toolTitle: string = '';
  getToolNameSubscription: Subscription;
  getToolPopupVideo: Subscription;

  isModalShown = false;
  toolId = '';
  toolName = '';
  videoURL = '';


  content = '';


  constructor(
    private dataService: DataService,
    private seoService: SeoService,
    private renderer: Renderer2
  ) { }

  ngOnInit() {

    this.getToolNameSubscription = this.dataService.updateToolTitle.subscribe(
      (res: string) => {
        this.toolTitle = res;
      }
    )
    this.seoService.updateTitle('TQE Tools | The Quant Edge | Sports Betting Tools and Optimizers');

    this.getToolPopupVideo = this.dataService.popupToolVideo.subscribe(
      (res:any) => {
        this.isModalShown = res.Show;
        this.toolName = res.Name;
        this.toolId = res.Id;
        this.videoURL= res.Url;
      }
    )
  }

  ngOnDestroy() {
    if(this.getToolNameSubscription) this.getToolNameSubscription.unsubscribe();
    if(this.getToolPopupVideo) this.getToolPopupVideo.unsubscribe();
  }

  showModal(): void {  }

  hideModal(): void {
    this.autoShownModal.hide();
  }

  onHidden(): void {
    this.isModalShown = false;
  }

}
