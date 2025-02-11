import { TestBed } from '@angular/core/testing';

// import { SharedService } from './shared.service';

import { AuditTrailService } from './auditTrail.service';


describe('SharedService', () => {
  let service: AuditTrailService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuditTrailService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
