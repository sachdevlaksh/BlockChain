import { TestBed, inject } from '@angular/core/testing';

import { InspectorVerificationService } from './inspector-verification.service';

describe('InspectorVerificationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InspectorVerificationService]
    });
  });

  it('should be created', inject([InspectorVerificationService], (service: InspectorVerificationService) => {
    expect(service).toBeTruthy();
  }));
});
