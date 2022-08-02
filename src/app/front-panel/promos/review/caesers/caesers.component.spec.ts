import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CaesersComponent } from './caesers.component';

describe('CaesersComponent', () => {
  let component: CaesersComponent;
  let fixture: ComponentFixture<CaesersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CaesersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CaesersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
