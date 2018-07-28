import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { FarmerRecord } from '../models/FarmerRecord';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class VerifyFarmerRecordService {

   constructor(private http:Http) { }
    // API: POST /verifyFarmerRecord
	  public VerifyFarmerRecords(LnRecId: string) : Observable<any> {
      console.log("Inside VerifyFarmerRecords method in VerifyFarmerRecord service");
      return this.http.get('/verify/api/recordVerification/'+LnRecId) 
      .map(res => res.json() );
  }
}
