import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IfreamPicksComponent } from './ifream-picks.component';

describe('IfreamPicksComponent', () => {
  let component: IfreamPicksComponent;
  let fixture: ComponentFixture<IfreamPicksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IfreamPicksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IfreamPicksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
