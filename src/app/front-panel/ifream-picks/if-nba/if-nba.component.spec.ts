import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IfNbaComponent } from './if-nba.component';

describe('IfNbaComponent', () => {
  let component: IfNbaComponent;
  let fixture: ComponentFixture<IfNbaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IfNbaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IfNbaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
