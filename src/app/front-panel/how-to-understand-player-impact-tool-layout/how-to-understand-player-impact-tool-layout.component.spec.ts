import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HowToUnderstandPlayerImpactToolLayoutComponent } from './how-to-understand-player-impact-tool-layout.component';

describe('HowToUnderstandPlayerImpactToolLayoutComponent', () => {
  let component: HowToUnderstandPlayerImpactToolLayoutComponent;
  let fixture: ComponentFixture<HowToUnderstandPlayerImpactToolLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HowToUnderstandPlayerImpactToolLayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HowToUnderstandPlayerImpactToolLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
