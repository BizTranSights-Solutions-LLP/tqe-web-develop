import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThriveComponent } from './thrive.component';

describe('ThriveComponent', () => {
  let component: ThriveComponent;
  let fixture: ComponentFixture<ThriveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThriveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThriveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
