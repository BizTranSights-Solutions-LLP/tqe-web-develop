import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VideosDetailComponent } from './videos-detail.component';

describe('VideosDetailComponent', () => {
  let component: VideosDetailComponent;
  let fixture: ComponentFixture<VideosDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VideosDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VideosDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
