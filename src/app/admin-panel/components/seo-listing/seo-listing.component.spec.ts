import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeoListingComponent } from './seo-listing.component';

describe('SeoListingComponent', () => {
  let component: SeoListingComponent;
  let fixture: ComponentFixture<SeoListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeoListingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeoListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
