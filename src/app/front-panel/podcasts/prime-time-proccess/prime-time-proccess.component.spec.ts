import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrimeTimeProccessComponent } from './prime-time-proccess.component';

describe('PrimeTimeProccessComponent', () => {
  let component: PrimeTimeProccessComponent;
  let fixture: ComponentFixture<PrimeTimeProccessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrimeTimeProccessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrimeTimeProccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
