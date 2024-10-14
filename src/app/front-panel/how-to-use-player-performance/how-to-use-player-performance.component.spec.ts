import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HowToUsePlayerPerformanceComponent } from './how-to-use-player-performance.component';

describe('HowToUsePlayerPerformanceComponent', () => {
  let component: HowToUsePlayerPerformanceComponent;
  let fixture: ComponentFixture<HowToUsePlayerPerformanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HowToUsePlayerPerformanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HowToUsePlayerPerformanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
