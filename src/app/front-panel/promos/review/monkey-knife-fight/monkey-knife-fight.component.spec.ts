import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonkeyKnifeFightComponent } from './monkey-knife-fight.component';

describe('MonkeyKnifeFightComponent', () => {
  let component: MonkeyKnifeFightComponent;
  let fixture: ComponentFixture<MonkeyKnifeFightComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonkeyKnifeFightComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonkeyKnifeFightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
