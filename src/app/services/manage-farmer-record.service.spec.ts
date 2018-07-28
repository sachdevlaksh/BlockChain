import { TestBed, inject } from '@angular/core/testing';

import { ManageFarmerRecordService } from './manage-farmer-record.service';

describe('ManageFarmerRecordService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ManageFarmerRecordService]
    });
  });

  it('should be created', inject([ManageFarmerRecordService], (service: ManageFarmerRecordService) => {
    expect(service).toBeTruthy();
  }));
});
