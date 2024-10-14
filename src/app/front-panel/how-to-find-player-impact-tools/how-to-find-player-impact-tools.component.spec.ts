import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HowToFindPlayerImpactToolsComponent } from './how-to-find-player-impact-tools.component';

describe('HowToFindPlayerImpactToolsComponent', () => {
  let component: HowToFindPlayerImpactToolsComponent;
  let fixture: ComponentFixture<HowToFindPlayerImpactToolsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HowToFindPlayerImpactToolsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HowToFindPlayerImpactToolsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
