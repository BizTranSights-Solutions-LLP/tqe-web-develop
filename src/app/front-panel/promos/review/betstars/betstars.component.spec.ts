import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BetstarsComponent } from './betstars.component';

describe('BetstarsComponent', () => {
  let component: BetstarsComponent;
  let fixture: ComponentFixture<BetstarsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BetstarsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BetstarsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
