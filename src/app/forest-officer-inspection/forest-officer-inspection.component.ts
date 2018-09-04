import { Component, OnInit,NgModule } from '@angular/core';
import { ManageFarmerRecordService } from '../services/manage-farmer-record.service';
import { VerifyFarmerRecordService } from '../services/verify-farmer-record.service';
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
  selector: 'app-forest-officer-inspection',
  templateUrl: './forest-officer-inspection.component.html',
  styleUrls: ['./forest-officer-inspection.component.css']
})
export class ForestOfficerInspectionComponent implements OnInit {
  isRequestInspected : boolean = true;
  fetchFirstYrRequest : boolean = false;
  fetchSecondYrRequest : boolean = false;
  fetchThirdYrRequest : boolean = false;
  noSearchResults : boolean = false;
  isNotUpdated : boolean = false;
  isUpdated : boolean = false;
  farmerRecords : FarmerRecord[];
  farmerRecord: FarmerRecord = new FarmerRecord();
  farmerReqForm: FormGroup;
  ReqStatus : string;
  updatedRecords : FarmerRecord[];
  //submittedDate:Date;
  constructor( private formBuilder: FormBuilder,private manageFarmerRecordsService: ManageFarmerRecordService,private inspectorVerificationService : InspectorVerificationService) { }
  ngOnInit() {
     this.inspectorVerificationService.currentData.subscribe(records => this.farmerRecords = records);
		if(this.farmerRecords!=null && this.farmerRecords.length > 0){
               this.fetchFirstYrRequest = true;
			   this.fetchSecondYrRequest = true;
			   this.fetchThirdYrRequest = true;
               this.noSearchResults= false;
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
    this.manageFarmerRecordsService.getFarmerRecordsByReqStatus(this.ReqStatus)
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
               this.noSearchResults= false;
			   this.isNotUpdated = true;
			   //this.isRequestInspected = true;
             }else{
               this.noSearchResults = true;
             }
              this.fetchFirstYrRequest = true;
			  this.fetchSecondYrRequest = false; 			  
			  this.fetchThirdYrRequest = false; 
			  this.isNotUpdated = true;
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
		this.manageFarmerRecordsService.getFarmerRecordsByReqStatus(this.ReqStatus)
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
					//console.log(a.diff(b, 'minutes')) // 44700
					//console.log(a.diff(b, 'hours')) // 745
					//console.log("No of Days"+(a.diff(b, 'days'))) // 31
					//console.log(a.diff(b, 'weeks')) // 4
				}
	  
			 console.log("farmer records " + this.farmerRecords.length);
			 			 console.log(" success farmer records " + response.success);
						 			 console.log(" message farmer records " + response.message);
			  console.log(" length of farmer records " + response.farmerRecords.length);
             if(this.farmerRecords!=null && this.farmerRecords.length > 0 ){
               this.noSearchResults= false;
			   //this.isRequestInspected = true;
             }else{
               this.noSearchResults = true;
             }
              this.fetchFirstYrRequest = false;
			  this.fetchSecondYrRequest = true; 			  
			  this.fetchThirdYrRequest = false; 
              this.isNotUpdated = true;
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
		this.manageFarmerRecordsService.getFarmerRecordsByReqStatus(this.ReqStatus)
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
					
					//console.log(a.diff(b, 'minutes')) // 44700
					//console.log(a.diff(b, 'hours')) // 745
					//console.log("No of Days"+(a.diff(b, 'days'))) // 31
					//console.log(a.diff(b, 'weeks')) // 4
				}
	  
			 console.log("farmer records " + this.farmerRecords.length);
			 			 console.log(" success farmer records " + response.success);
						 			 console.log(" message farmer records " + response.message);
			  console.log(" length of farmer records " + response.farmerRecords.length);
             if(this.farmerRecords!=null && this.farmerRecords.length > 0 ){
               this.noSearchResults= false;
			   //this.isRequestInspected = true;
             }else{
               this.noSearchResults = true;
             }
              this.fetchFirstYrRequest = false;
			  this.fetchSecondYrRequest = false; 			  
			  this.fetchThirdYrRequest = true;     
              this.isNotUpdated = true;
			  this.isUpdated = false;
            }
          });
  }
 
 Update(){
	console.log("inside update function");	
	this.farmerRecord = <FarmerRecord>this.farmerReqForm.value;
	this.farmerRecords[0].NoSeedSurved=this.farmerRecord.NoSeedSurved;
	this.farmerRecords[0].ReqStatus="UpdatedByInsp";
	console.log("No of seeds survided is:" +  this.farmerRecord.NoSeedSurved );
	console.log("LnRecId:" +  this.farmerRecords[0].LnRecId );		
	this.updatedRecords =  this.farmerRecords.filter(
	(rec) => rec.ReqStatus=="UpdatedByInsp");
	console.log("Approved records are" + this.updatedRecords.length);
	this.manageFarmerRecordsService.updateFarmerApprovedOrRejectedRecords(this.updatedRecords)
	.subscribe(
        response => {
          console.log("res received addFarmerRecord service" + JSON.stringify(response));

          if (response !=null && response.success) {
			this.isUpdated = true;
			this.isNotUpdated = false;
          }
        });
		
	
  }
 
}
