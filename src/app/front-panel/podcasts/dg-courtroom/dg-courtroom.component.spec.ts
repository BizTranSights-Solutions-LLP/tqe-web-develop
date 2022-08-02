import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DgCourtroomComponent } from './dg-courtroom.component';

describe('DgCourtroomComponent', () => {
  let component: DgCourtroomComponent;
  let fixture: ComponentFixture<DgCourtroomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DgCourtroomComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DgCourtroomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
