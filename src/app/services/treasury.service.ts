import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { FarmerRecord } from '../models/FarmerRecord';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';


@Injectable()
export class TreasuryService {

  constructor(private http: Http) { }
// API: POST /farmerRecords/updateKapyApprovedStatus[]
	public updateAmountProcessed(farmerRecord: FarmerRecord[]){
      console.log("Inside updateAmountProcessed method in Treasury service");
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      return this.http.post('/manageFarmerRecords/api/updateAmountProcessed', JSON.stringify(farmerRecord), { headers: headers })
        .map(res => res.json());     
    }
	
		 // API: GET /FarmerRecords/:ReqStatus
	public getRecordsByReqStatus(ReqStatus: string) : Observable<any> {
      console.log("Inside getRecordsByReqStatus method in manageFarmerRecord service");
      return this.http.get('/manageFarmerRecords/api/getRecordsByReqStatus/'+ReqStatus) 
      .map(res => res.json() );
  }
}
