import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MondayMorningPivotComponent } from './monday-morning-pivot.component';

describe('MondayMorningPivotComponent', () => {
  let component: MondayMorningPivotComponent;
  let fixture: ComponentFixture<MondayMorningPivotComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MondayMorningPivotComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MondayMorningPivotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
