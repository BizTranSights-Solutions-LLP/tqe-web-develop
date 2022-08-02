import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NflBestBallPodcastComponent } from './nfl-best-ball-podcast.component';

describe('NflBestBallPodcastComponent', () => {
  let component: NflBestBallPodcastComponent;
  let fixture: ComponentFixture<NflBestBallPodcastComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NflBestBallPodcastComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NflBestBallPodcastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
