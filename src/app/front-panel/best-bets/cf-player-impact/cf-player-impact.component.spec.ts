import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CfPlayerImpactComponent } from './cf-player-impact.component';

describe('CfPlayerImpactComponent', () => {
  let component: CfPlayerImpactComponent;
  let fixture: ComponentFixture<CfPlayerImpactComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CfPlayerImpactComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CfPlayerImpactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
