import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DFSPowerHourComponent } from './dfs-powerhour.component';

describe('DFSPowerHourComponent', () => {
  let component: DFSPowerHourComponent;
  let fixture: ComponentFixture<DFSPowerHourComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DFSPowerHourComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DFSPowerHourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
