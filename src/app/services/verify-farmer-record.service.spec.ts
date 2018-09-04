import { TestBed, inject } from '@angular/core/testing';

import { VerifyFarmerRecordService } from './verify-farmer-record.service';

describe('VerifyFarmerRecordService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VerifyFarmerRecordService]
    });
  });

  it('should be created', inject([VerifyFarmerRecordService], (service: VerifyFarmerRecordService) => {
    expect(service).toBeTruthy();
  }));
});
