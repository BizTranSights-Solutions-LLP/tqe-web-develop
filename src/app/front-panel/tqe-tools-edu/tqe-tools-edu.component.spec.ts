import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TqeToolsEduComponent } from './tqe-tools-edu.component';

describe('TqeToolsEduComponent', () => {
  let component: TqeToolsEduComponent;
  let fixture: ComponentFixture<TqeToolsEduComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TqeToolsEduComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TqeToolsEduComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
