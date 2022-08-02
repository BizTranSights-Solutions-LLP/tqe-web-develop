import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MoveTheLineComponent } from './move-the-line.component';

describe('MoveTheLineComponent', () => {
  let component: MoveTheLineComponent;
  let fixture: ComponentFixture<MoveTheLineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MoveTheLineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MoveTheLineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
