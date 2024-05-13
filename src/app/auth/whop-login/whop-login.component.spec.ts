import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WhopLoginComponent } from './whop-login.component';

describe('WhopLoginComponent', () => {
  let component: WhopLoginComponent;
  let fixture: ComponentFixture<WhopLoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WhopLoginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WhopLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
