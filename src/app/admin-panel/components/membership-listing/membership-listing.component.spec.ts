import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MembershipListingComponent } from './membership-listing.component';

describe('MembershipListingComponent', () => {
  let component: MembershipListingComponent;
  let fixture: ComponentFixture<MembershipListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MembershipListingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MembershipListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
