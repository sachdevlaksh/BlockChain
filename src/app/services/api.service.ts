import { Injectable } from '@angular/core';
import {environment} from 'environments/environment';
import {Http,Response,Headers} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { FarmerRecord } from '../models/FarmerRecord';

const API_URL = environment.apiUrl;
@Injectable()
export class ApiService {

  constructor(private http:Http) { }
  
 // API: GET /FarmerRecords/:enrollment id
  public UpdateFarmerRecordsInChainCd(farmerRecord: FarmerRecord[]) : Observable<any> {
    console.log("Inside UpdateFarmerRecordsInChainCd method in api service");
	let headers = new Headers();
    headers.append('Content-Type', 'application/json');
     return this.http.post('/farmerRecordStatus', JSON.stringify(farmerRecord), { headers: headers })
    .map(res => res.json() );
  }
  
}
