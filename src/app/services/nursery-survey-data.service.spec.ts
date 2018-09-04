import { TestBed, inject } from '@angular/core/testing';

import { NurserySurveyDataService } from './nursery-survey-data.service';

describe('NurserySurveyDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NurserySurveyDataService]
    });
  });

  it('should be created', inject([NurserySurveyDataService], (service: NurserySurveyDataService) => {
    expect(service).toBeTruthy();
  }));
});
