import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolListingComponent } from './tool-listing.component';

describe('ToolListingComponent', () => {
  let component: ToolListingComponent;
  let fixture: ComponentFixture<ToolListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ToolListingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
