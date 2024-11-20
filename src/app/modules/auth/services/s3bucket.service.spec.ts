import { TestBed } from '@angular/core/testing';

import { S3bucketService } from './s3bucket.service';

describe('S3bucketService', () => {
  let service: S3bucketService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(S3bucketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
