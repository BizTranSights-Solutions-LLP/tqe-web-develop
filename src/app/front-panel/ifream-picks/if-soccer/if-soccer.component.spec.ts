import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IfSoccerComponent } from './if-soccer.component';

describe('IfSoccerComponent', () => {
  let component: IfSoccerComponent;
  let fixture: ComponentFixture<IfSoccerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IfSoccerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IfSoccerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
