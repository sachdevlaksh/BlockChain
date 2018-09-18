import { Component, OnInit,NgModule } from '@angular/core';
import { TreasuryService } from '../services/treasury.service';
import { FarmerRecord } from '../models/FarmerRecord';
import { Observable } from 'rxjs';
import { InspectorVerificationService } from '../services/inspector-verification.service';
import * as moment from 'moment';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl
} from '@angular/forms';

@Component({
  selector: 'app-treasury.component',
  templateUrl: './treasury.component.html',
  styleUrls: ['./treasury.component.css']
})
export class TreasuryComponent implements OnInit {
  isRequestDisbursed : boolean = true;
  fetchFirstYrRequest : boolean = false;
  fetchSecondYrRequest : boolean = false;
  fetchThirdYrRequest : boolean = false;
  noFirstYrSearchResults : boolean = false;
  noSecondYrSearchResults : boolean = false;
  noThirdYrSearchResults : boolean = false;
  isNotUpdated : boolean = false;
  isUpdated : boolean = false;
  farmerRecords : FarmerRecord[];
  farmerRecord: FarmerRecord = new FarmerRecord();
  farmerReqForm: FormGroup;
  ReqStatus : string;
  updatedRecords : FarmerRecord[];
  //submittedDate:Date;
  constructor( private formBuilder: FormBuilder,private treasuryService: TreasuryService,private inspectorVerificationService : InspectorVerificationService) { }
  ngOnInit() {
     this.inspectorVerificationService.currentData.subscribe(records => this.farmerRecords = records);
		if(this.farmerRecords!=null && this.farmerRecords.length > 0){
               this.fetchFirstYrRequest = true;
			   this.fetchSecondYrRequest = true;
			   this.fetchThirdYrRequest = true;
               this.noFirstYrSearchResults= false;
			   this.noSecondYrSearchResults= false;
			   this.noThirdYrSearchResults= false;
			   //console.log("inside OnInit function");
			    //console.log("isFarmerRecApproved from farmerRecords :" + this.farmerRecords.isFarmerRecApproved);
				// console.log("isFarmerRecApproved from approvedRecords:" + this.approvedRecords.isFarmerRecApproved);
			 //  this.isFormApproved = this.farmerRecords.isFarmerRecApproved;
    } 
	this.createForm();
  }
	
	createForm(){
	this.farmerReqForm = this.formBuilder.group({
	  NoSeedSurved: [null]
    });

  }
  
   search1(){
	this.createForm();
	this.farmerRecords = [];
	this.ReqStatus="approved";
    console.log("Inside search1 method for Inspector");
	console.log("Land record id is:" +this.ReqStatus);
    this.treasuryService.getRecordsByReqStatus(this.ReqStatus)
    .subscribe(
      response => {
	  console.log("res received from DB farmerRecord[]" + JSON.stringify(response));
            if (response !=null) {
             console.log("inside response");
				var j = 0;
			   for (var i = 0; i < response.farmerRecords.length; i++) {
					console.log('Doc:'+ JSON.stringify(response.farmerRecords[i]));
					var endDate = new Date();
					var strtDate =  response.farmerRecords[i].SubmittedDt;
					var a = moment(endDate);
					var b = moment(strtDate);
					var noOfDays= (a.diff(b, 'days'));
					
					if (noOfDays>= 365 && noOfDays<=730){
						console.log("inside 365 days conditions"+(a.diff(b, 'days'))) // 31
						this.farmerRecords[j] =  response.farmerRecords[i];
						//this.farmerRecords[j].NoSeedSurved=0;
						console.log("noOfDays"+noOfDays +"for LandRecordId:" +this.farmerRecords[j].LnRecId); // 31
						//console.log("i value" +i);
						//console.log("j value" +j);
						j= j+1;
						this.isNotUpdated = true;
						console.log("j value after increment" +j);
					}
					//console.log(a.diff(b, 'minutes')) // 44700
					//console.log(a.diff(b, 'hours')) // 745
					//console.log("No of Days"+(a.diff(b, 'days'))) // 31
					//console.log(a.diff(b, 'weeks')) // 4
				}
	  
			 console.log("farmer records " + this.farmerRecords.length);
			 		//	 console.log(" success farmer records " + response.success);
						// 			 console.log(" message farmer records " + response.message);
			  console.log(" length of farmer records " + response.farmerRecords.length);
             if(this.farmerRecords!=null && this.farmerRecords.length > 0 ){
               this.noFirstYrSearchResults= false;
			   this.isNotUpdated = true;
			   //this.isRequestDisbursed = true;
             }else{
               this.noFirstYrSearchResults = true;
             }
              this.fetchFirstYrRequest = true;
			  this.fetchSecondYrRequest = false; 			  
			  this.fetchThirdYrRequest = false; 
			   this.noSecondYrSearchResults= false;
			   this.noThirdYrSearchResults= false;
			  this.isNotUpdated = false;
			  this.isUpdated = false;
            }
          });
  }
  
   search2(){
		this.createForm();
		this.farmerRecord.NoSeedSurved=null;
		this.farmerRecords = [];
		this.ReqStatus="approved";
		console.log("Inside search2 method for Inspector");
		console.log("Land record id is:" +this.ReqStatus);
		this.treasuryService.getRecordsByReqStatus(this.ReqStatus)
		.subscribe(
		response => {
		console.log("res received from DB farmerRecord[]" + JSON.stringify(response));
            if (response !=null) {
             console.log("inside response");
			   for (var i = 0; i < response.farmerRecords.length; i++) {
					console.log('Doc:'+ JSON.stringify(response.farmerRecords[i]));
					var endDate = new Date();
					var strtDate =  response.farmerRecords[i].SubmittedDt;
					var a = moment(endDate);
					var b = moment(strtDate);
					var noOfDays= (a.diff(b, 'days'));
					var j = 0;
					if (noOfDays>=730 && noOfDays<1095){
						console.log("inside 730 days conditions"+(a.diff(b, 'days'))) // 31
						this.farmerRecords[j] =  response.farmerRecords[i];
						this.farmerRecords[j].NoSeedSurved=0;
						console.log('Doc:'+ JSON.stringify(this.farmerRecords[i]));
						console.log("noOfDays"+noOfDays) // 31
						j= j++;
					}
					
				}
	  
			 console.log("farmer records " + this.farmerRecords.length);
			 			 console.log(" success farmer records " + response.success);
						 			 console.log(" message farmer records " + response.message);
			  console.log(" length of farmer records " + response.farmerRecords.length);
             if(this.farmerRecords!=null && this.farmerRecords.length > 0 ){
               this.noSecondYrSearchResults= false;
			   this.isNotUpdated = true;
             }else{
               this.noSecondYrSearchResults = true;
             }
              this.fetchFirstYrRequest = false;
			  this.fetchSecondYrRequest = true; 			  
			  this.fetchThirdYrRequest = false; 
			   this.noFirstYrSearchResults= false;
			   this.noThirdYrSearchResults= false;
              this.isNotUpdated = false;
			  this.isUpdated = false;
            }
          });
  }
  
  
   search3(){
		this.createForm();
		this.farmerRecords = [];
		this.ReqStatus="approved";
		console.log("Inside search3 method for Inspector");
		console.log("Land record id is:" +this.ReqStatus);
		this.treasuryService.getRecordsByReqStatus(this.ReqStatus)
		.subscribe(
		response => {
		console.log("res received from DB farmerRecord[]" + JSON.stringify(response));
            if (response !=null) {
             console.log("inside response");
			   for (var i = 0; i < response.farmerRecords.length; i++) {
					console.log('Doc:'+ JSON.stringify(response.farmerRecords[i]));
					var endDate = new Date();
					var strtDate =  response.farmerRecords[i].SubmittedDt;
					var a = moment(endDate);
					var b = moment(strtDate);
					var noOfDays= (a.diff(b, 'days'));
					var j=0;
					if (noOfDays>= 1095){
						console.log("inside 365 days conditions"+(a.diff(b, 'days'))) // 31
						this.farmerRecords[j] =  response.farmerRecords[i];
						this.farmerRecords[j].NoSeedSurved=0;
						console.log("noOfDays"+noOfDays) // 31
						j= j++;
					}
				}
	  
			 console.log("farmer records " + this.farmerRecords.length);
			 			 console.log(" success farmer records " + response.success);
						 			 console.log(" message farmer records " + response.message);
			  console.log(" length of farmer records " + response.farmerRecords.length);
             if(this.farmerRecords!=null && this.farmerRecords.length > 0 ){
               this.noThirdYrSearchResults= false;
			    this.isNotUpdated = true;
             }else{
               this.noThirdYrSearchResults = true;
             }
              this.fetchFirstYrRequest = false;
			  this.fetchSecondYrRequest = false; 			  
			  this.fetchThirdYrRequest = true;    
				this.noFirstYrSearchResults= false;
			   this.noSecondYrSearchResults= false;		  
              this.isNotUpdated = false;
			  this.isUpdated = false;
            }
          });
  }
 
 UpdateFirstYrReq(){
	console.log("inside UpdateFirstYrReq function");	
	
	 this.farmerRecord = <FarmerRecord>this.farmerReqForm.value;
	console.log("this.farmerRecord values are:" + JSON.stringify(this.farmerReqForm.value));
	// for (let farmerRecord of this.farmerRecords) {   
	//	console.log("length are:" +  this.farmerRecords.length );
		console.log("No of seeds survided is:" +  this.farmerRecord.AmountProcessed );
	//	console.log("LnRecId:" +  farmerRecord.LnRecId );
    //}
	this.farmerRecords[0].ReqStatus="UpdatedByTrsry"	;
	this.farmerRecords[0].AmountProcessed=this.farmerRecord.AmountProcessed;
	this.updatedRecords =  this.farmerRecords.filter(
	(rec) => rec.ReqStatus=="UpdatedByTrsry");
	console.log("Approved records are" + this.updatedRecords.length);
	this.treasuryService.updateAmountProcessed(this.updatedRecords)
	.subscribe(
        response => {
          console.log("res received addFarmerRecord service" + JSON.stringify(response));

          if (response !=null && response.success) {
			this.isUpdated = true;
			this.isNotUpdated = false;
          }else{
			this.isUpdated = false;
			this.isNotUpdated = true;
		  }
        });
  }



UpdateSecondYrReq(){
	console.log("inside UpdateSecondYrReq function");	
	
	 this.farmerRecord = <FarmerRecord>this.farmerReqForm.value;
	console.log("this.farmerRecord values are:" + JSON.stringify(this.farmerReqForm.value));
	// for (let farmerRecord of this.farmerRecords) {   
	//	console.log("length are:" +  this.farmerRecords.length );
		console.log("No of seeds survided is:" +  this.farmerRecord.AmountProcessed );
	//	console.log("LnRecId:" +  farmerRecord.LnRecId );
    //}
	this.farmerRecords[0].ReqStatus="UpdatedByTrsry"	;
	this.farmerRecords[0].AmountProcessed=this.farmerRecord.AmountProcessed;
	this.updatedRecords =  this.farmerRecords.filter(
	(rec) => rec.ReqStatus=="UpdatedByTrsry");
	console.log("Approved records are" + this.updatedRecords.length);
	this.treasuryService.updateAmountProcessed(this.updatedRecords)
	.subscribe(
        response => {
          console.log("res received addFarmerRecord service" + JSON.stringify(response));

          if (response !=null && response.success) {
			this.isUpdated = true;
			this.isNotUpdated = false;
          }else{
			this.isUpdated = false;
			this.isNotUpdated = true;
		  }
        });
  }



UpdateThirdYrReq(){
	console.log("inside UpdateThirdYrReq function");	
	
	 this.farmerRecord = <FarmerRecord>this.farmerReqForm.value;
	console.log("this.farmerRecord values are:" + JSON.stringify(this.farmerReqForm.value));
	// for (let farmerRecord of this.farmerRecords) {   
	//	console.log("length are:" +  this.farmerRecords.length );
		console.log("No of seeds survided is:" +  this.farmerRecord.AmountProcessed );
	//	console.log("LnRecId:" +  farmerRecord.LnRecId );
    //}
	this.farmerRecords[0].ReqStatus="UpdatedByTrsry"	;
	this.farmerRecords[0].AmountProcessed=this.farmerRecord.AmountProcessed;
	this.updatedRecords =  this.farmerRecords.filter(
	(rec) => rec.ReqStatus=="UpdatedByTrsry");
	console.log("Approved records are" + this.updatedRecords.length);
	this.treasuryService.updateAmountProcessed(this.updatedRecords)
	.subscribe(
        response => {
          console.log("res received addFarmerRecord service" + JSON.stringify(response));

          if (response !=null && response.success) {
			this.isUpdated = true;
			this.isNotUpdated = false;
          }else{
			this.isUpdated = false;
			this.isNotUpdated = true;
		  }
        });
  }
}
