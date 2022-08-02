import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UfcComponent } from './ufc.component';

describe('UfcComponent', () => {
  let component: UfcComponent;
  let fixture: ComponentFixture<UfcComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UfcComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UfcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
