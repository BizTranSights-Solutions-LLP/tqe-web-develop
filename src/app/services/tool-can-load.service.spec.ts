import { TestBed } from '@angular/core/testing';

import { ToolCanLoadService } from './tool-can-load.service';

describe('ToolCanLoadService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ToolCanLoadService = TestBed.get(ToolCanLoadService);
    expect(service).toBeTruthy();
  });
});
