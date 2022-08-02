import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DraftKingsSportsBookComponent } from './draft-kings-sports-book.component';

describe('DraftKingsSportsBookComponent', () => {
  let component: DraftKingsSportsBookComponent;
  let fixture: ComponentFixture<DraftKingsSportsBookComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DraftKingsSportsBookComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DraftKingsSportsBookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
