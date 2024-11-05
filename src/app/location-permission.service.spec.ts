import { TestBed } from '@angular/core/testing';

import { LocationPermissionService } from './location-permission.service';

describe('LocationPermissionService', () => {
  let service: LocationPermissionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocationPermissionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
