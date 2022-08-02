import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IfNhlComponent } from './if-nhl.component';

describe('IfNhlComponent', () => {
  let component: IfNhlComponent;
  let fixture: ComponentFixture<IfNhlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IfNhlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IfNhlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
