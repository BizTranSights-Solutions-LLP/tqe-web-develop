import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IfMlbComponent } from './if-mlb.component';

describe('IfMlbComponent', () => {
  let component: IfMlbComponent;
  let fixture: ComponentFixture<IfMlbComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IfMlbComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IfMlbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
