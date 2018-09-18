import { TestBed, inject } from '@angular/core/testing';

import { TreasuryService } from './treasury.service';

describe('TreasuryService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TreasuryService]
    });
  });

  it('should be created', inject([TreasuryService], (service: TreasuryService) => {
    expect(service).toBeTruthy();
  }));
});
