import { TestBed, inject } from '@angular/core/testing';

import { AllTransactionsService } from './all-transactions.service';

describe('AllTransactionsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AllTransactionsService]
    });
  });

  it('should be created', inject([AllTransactionsService], (service: AllTransactionsService) => {
    expect(service).toBeTruthy();
  }));
});
