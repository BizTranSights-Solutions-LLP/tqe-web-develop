import { TestBed } from '@angular/core/testing';

import { AdminCanLoadService } from './admin-can-load.service';

describe('AdminCanLoadService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AdminCanLoadService = TestBed.get(AdminCanLoadService);
    expect(service).toBeTruthy();
  });
});
