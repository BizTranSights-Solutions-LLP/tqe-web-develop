import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SugarhouseComponent } from './sugarhouse.component';

describe('SugarhouseComponent', () => {
  let component: SugarhouseComponent;
  let fixture: ComponentFixture<SugarhouseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SugarhouseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SugarhouseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
