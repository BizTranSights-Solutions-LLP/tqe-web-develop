import { Component, OnInit, OnDestroy, ElementRef, ViewChild, Renderer2, Inject, ComponentFactoryResolver, ViewContainerRef } from '@angular/core';

@Component({
  selector: 'app-tool-nfl-demo',
  templateUrl: './nfl-demo.component.html',
  styleUrls: ['./nfl-demo.component.css']
})
export class NFLDemo implements OnInit {
  loader = true;
  nfl_demo_link = "https://tools.thequantedge.com/shiny/rstudio/betting_tool/";

  constructor(
  ) {
  }

  ngOnInit() {
    this.loader = false;
    console.log('yes')
  }


}
