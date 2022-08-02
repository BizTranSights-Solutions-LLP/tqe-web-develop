import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IfNcaafComponent } from './if-ncaaf.component';

describe('IfNcaafComponent', () => {
  let component: IfNcaafComponent;
  let fixture: ComponentFixture<IfNcaafComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IfNcaafComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IfNcaafComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
