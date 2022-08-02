import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NcaafComponent } from './ncaaf.component';

describe('NcaafComponent', () => {
  let component: NcaafComponent;
  let fixture: ComponentFixture<NcaafComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NcaafComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NcaafComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
