import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IfNcaabComponent } from './if-ncaab.component';

describe('IfNcaabComponent', () => {
  let component: IfNcaabComponent;
  let fixture: ComponentFixture<IfNcaabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IfNcaabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IfNcaabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
