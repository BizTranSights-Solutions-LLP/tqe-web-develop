import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DfspromoComponent } from './dfspromo.component';

describe('DfspromoComponent', () => {
  let component: DfspromoComponent;
  let fixture: ComponentFixture<DfspromoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DfspromoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DfspromoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
