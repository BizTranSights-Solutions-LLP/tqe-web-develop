import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Betting101Component } from './betting101.component';

describe('Betting101Component', () => {
  let component: Betting101Component;
  let fixture: ComponentFixture<Betting101Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Betting101Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Betting101Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
