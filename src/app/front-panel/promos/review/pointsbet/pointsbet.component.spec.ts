import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PointsbetComponent } from './pointsbet.component';

describe('PointsbetComponent', () => {
  let component: PointsbetComponent;
  let fixture: ComponentFixture<PointsbetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PointsbetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PointsbetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
