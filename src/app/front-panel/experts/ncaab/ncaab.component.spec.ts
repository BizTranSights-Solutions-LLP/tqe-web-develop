import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NcaabComponent } from './ncaab.component';

describe('NcaabComponent', () => {
  let component: NcaabComponent;
  let fixture: ComponentFixture<NcaabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NcaabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NcaabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
