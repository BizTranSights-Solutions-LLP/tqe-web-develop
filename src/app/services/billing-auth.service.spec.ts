import { TestBed } from '@angular/core/testing';

import { BillingAuthService } from './billing-auth.service';

describe('BillingAuthService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BillingAuthService = TestBed.get(BillingAuthService);
    expect(service).toBeTruthy();
  });
});
