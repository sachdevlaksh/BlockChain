import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { FarmerRecord } from '../models/FarmerRecord';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class ManageFarmerRecordService {

  constructor(private http: Http) { }

  // API: GET /FarmerRecords/:enrollment id
  public getFarmerRecordsByEid(eid: number) : Observable<any> {
    console.log("Inside getFarmerRecordsByEid method in manageFarmerRecord service");
    return this.http.get('/manageFarmerRecords/api/getFarmerRecordsByEid/'+eid) 
    .map(res => res.json() );
  }

    // API: GET /FarmerRecords/:LnRecId
  public getFarmerRecordsByLndRecId(LnRecId: string) : Observable<any> {
      console.log("Inside getLandRecordsByLnRecId method in manageFarmerRecord service");
      return this.http.get('/manageFarmerRecords/api/getFarmerRecordsByLndRecId/'+LnRecId) 
      .map(res => res.json() );
  }

  // API: POST /FarmerRecords/FarmerRecords
  public addFarmerRecordKapy(farmerRecord: FarmerRecord){
    console.log("Inside addFarmerRecordKapy method in manageFarmerRecord service");
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('/manageFarmerRecords/api/addFarmerRecordKapy', JSON.stringify(farmerRecord), { headers: headers })
      .map(res => res.json());     
  }


    // API: POST /farmerRecords/farmerRecord[]
  public updateFarmerApprovedOrRejectedRecords(farmerRecord: FarmerRecord[]){
      console.log("Inside updateFarmerApprovedOrRejectedRecords method in manageFarmerRecord service");
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      return this.http.post('/manageFarmerRecords/api/updateKapyApprovedStatus', JSON.stringify(farmerRecord), { headers: headers })
        .map(res => res.json());     
    }

	 // API: GET /FarmerRecords/:ReqStatus
  public getFarmerRecordsByReqStatus(ReqStatus: string) : Observable<any> {
      console.log("Inside getFarmerRecordsByReqStatus method in manageFarmerRecord service");
      return this.http.get('/manageFarmerRecords/api/getFarmerRecordsByReqStatus/'+ReqStatus) 
      .map(res => res.json() );
  }
	
}
