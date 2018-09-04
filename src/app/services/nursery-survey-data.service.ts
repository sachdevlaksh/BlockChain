import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import {FarmerRecord} from '../models/FarmerRecord';

@Injectable()
export class NurserySurveyDataService {

   private sharedData = new BehaviorSubject<FarmerRecord[]>([]);
  currentData = this.sharedData.asObservable();

  constructor() { 
    
  }
  updateData(records : FarmerRecord[]) {
      this.sharedData.next(records);
  }
}
