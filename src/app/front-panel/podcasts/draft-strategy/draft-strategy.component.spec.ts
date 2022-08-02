import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DraftStrategyComponent } from './draft-strategy.component';

describe('DraftStrategyComponent', () => {
  let component: DraftStrategyComponent;
  let fixture: ComponentFixture<DraftStrategyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DraftStrategyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DraftStrategyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
