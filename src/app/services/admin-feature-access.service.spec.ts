import { TestBed } from '@angular/core/testing';

import { AdminFeatureAccessService } from './admin-feature-access.service';

describe('AdminFeatureAccessService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AdminFeatureAccessService = TestBed.get(AdminFeatureAccessService);
    expect(service).toBeTruthy();
  });
});
