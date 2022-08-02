import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAffiliateComponent } from './edit.component';

describe('EditAffiliateComponent', () => {
  let component: EditAffiliateComponent;
  let fixture: ComponentFixture<EditAffiliateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditAffiliateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditAffiliateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
