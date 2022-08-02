import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MlbDfsQuickHitsComponent } from './mlb-dfs-quick-hits.component';

describe('MlbDfsQuickHitsComponent', () => {
  let component: MlbDfsQuickHitsComponent;
  let fixture: ComponentFixture<MlbDfsQuickHitsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MlbDfsQuickHitsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MlbDfsQuickHitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
