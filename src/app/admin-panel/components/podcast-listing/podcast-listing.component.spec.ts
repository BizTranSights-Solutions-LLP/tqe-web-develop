import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PodcastListingComponent } from './podcast-listing.component';

describe('PodcastListingComponent', () => {
  let component: PodcastListingComponent;
  let fixture: ComponentFixture<PodcastListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PodcastListingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PodcastListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
