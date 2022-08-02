import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AffiliateCreateAccountComponent } from './create-account.component';

describe('AffiliateCreateAccountComponent', () => {
  let component: AffiliateCreateAccountComponent;
  let fixture: ComponentFixture<AffiliateCreateAccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AffiliateCreateAccountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AffiliateCreateAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
