import { TestBed } from '@angular/core/testing';

import { ToolsServiceService } from './tools-service.service';

describe('ToolsServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ToolsServiceService = TestBed.get(ToolsServiceService);
    expect(service).toBeTruthy();
  });
});
