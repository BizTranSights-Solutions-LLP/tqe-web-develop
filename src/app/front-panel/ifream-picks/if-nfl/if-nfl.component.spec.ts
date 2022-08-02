import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IfNflComponent } from './if-nfl.component';

describe('IfNflComponent', () => {
  let component: IfNflComponent;
  let fixture: ComponentFixture<IfNflComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IfNflComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IfNflComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
