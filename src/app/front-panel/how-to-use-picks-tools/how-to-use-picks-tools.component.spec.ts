import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HowToUsePicksToolsComponent } from './how-to-use-picks-tools.component';

describe('HowToUsePicksToolsComponent', () => {
  let component: HowToUsePicksToolsComponent;
  let fixture: ComponentFixture<HowToUsePicksToolsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HowToUsePicksToolsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HowToUsePicksToolsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
