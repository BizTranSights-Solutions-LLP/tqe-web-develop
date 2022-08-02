import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FreeMembershipComponent } from './free-membership.component';

describe('FreeMembershipComponent', () => {
  let component: FreeMembershipComponent;
  let fixture: ComponentFixture<FreeMembershipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FreeMembershipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FreeMembershipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
