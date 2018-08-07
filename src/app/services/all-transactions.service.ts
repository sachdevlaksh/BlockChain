import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import 'rxjs/Rx';

// Can be injected into a constructor
@Injectable()
export class AllTransactionsService {

    private SYSTEM: string = 'Syste,';
    private Transactions;
	public ApiIP: string;
	public ApiPort: string;
	public Server: string;
	public ApiUrl: string
	public ServerWithApiUrl

    constructor(private http: Http) {
	this.ApiIP = 'http://ec2-52-90-144-179.compute-1.amazonaws.com';
    this.ApiPort= '3000';
    this.Server = this.ApiIP+':'+this.ApiPort;
    this.ApiUrl= '/api/';
    this.ServerWithApiUrl = this.Server + this.ApiUrl;
    };

    //get all transactions
	 
    public getTransactions(): Observable<Object[]> {
		return this.http.get(this.ServerWithApiUrl + 'system/historian')
		//  return this.http.get('/verify/api/recordVerification/'+LnRecId) 
     // .map(res => res.json() );
        .map(this.extractData)
        .catch(this.handleError);
    }
	
	private handleError(error: any): Observable<string> {
        // In a real world app, we might use a remote logging infrastructure
        // We'd also dig deeper into the error to get a better message
        const errMsg = (error.message) ? error.message :
          error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.error(errMsg); // log to console instead
        return Observable.throw(errMsg);
    }

    private extractData(res: Response): any {
        return res.json();
    }
	
}
