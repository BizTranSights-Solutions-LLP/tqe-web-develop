import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExcludedComponent } from './excluded.component';

describe('ExcludedComponent', () => {
  let component: ExcludedComponent;
  let fixture: ComponentFixture<ExcludedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExcludedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExcludedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
