import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TqeMmaPodcastComponent } from './tqe-mma-podcast.component';

describe('TqeMmaPodcastComponent', () => {
  let component: TqeMmaPodcastComponent;
  let fixture: ComponentFixture<TqeMmaPodcastComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TqeMmaPodcastComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TqeMmaPodcastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
