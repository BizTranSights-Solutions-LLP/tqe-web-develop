import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CricketPlayerImpactComponent } from './cricket-player-impact.component';

describe('CricketPlayerImpactComponent', () => {
  let component: CricketPlayerImpactComponent;
  let fixture: ComponentFixture<CricketPlayerImpactComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CricketPlayerImpactComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CricketPlayerImpactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
