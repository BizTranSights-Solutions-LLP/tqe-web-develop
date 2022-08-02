import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FanshareOwnershipPodcastComponent } from './fanshare-ownership-podcast.component';

describe('FanshareOwnershipPodcastComponent', () => {
  let component: FanshareOwnershipPodcastComponent;
  let fixture: ComponentFixture<FanshareOwnershipPodcastComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FanshareOwnershipPodcastComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FanshareOwnershipPodcastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
