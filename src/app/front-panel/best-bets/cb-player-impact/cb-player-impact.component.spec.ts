import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CbPlayerImpactComponent } from './cb-player-impact.component';

describe('CbPlayerImpactComponent', () => {
  let component: CbPlayerImpactComponent;
  let fixture: ComponentFixture<CbPlayerImpactComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CbPlayerImpactComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CbPlayerImpactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
