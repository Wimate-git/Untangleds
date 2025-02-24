import { TestBed } from '@angular/core/testing';

import { SummaryEngineService } from './summary-engine.service';

describe('SummaryEngineService', () => {
  let service: SummaryEngineService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SummaryEngineService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
