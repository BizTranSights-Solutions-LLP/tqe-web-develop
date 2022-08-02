import { TestBed } from '@angular/core/testing';

import { HomeCanLoadService } from './home-can-load.service';

describe('HomeCanLoadService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HomeCanLoadService = TestBed.get(HomeCanLoadService);
    expect(service).toBeTruthy();
  });
});
