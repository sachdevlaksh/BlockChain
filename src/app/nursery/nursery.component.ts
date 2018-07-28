import { Component, OnInit,NgModule } from '@angular/core';
import { FarmerRecord } from '../models/FarmerRecord';
import { ManageFarmerRecordService } from '../services/manage-farmer-record.service';
import { Observable } from 'rxjs';
import { NurserySurveyDataService } from "../services/nursery-survey-data.service";
import { VerifyFarmerRecordService } from '../services/verify-farmer-record.service';
import { ApiService } from '../services/api.service';


@Component({
  selector: 'app-nursery',
  templateUrl: './nursery.component.html',
  styleUrls: ['./nursery.component.css']
})
//Retriving approved records depend on yearly.
export class NurseryComponent implements OnInit {

  isFormApproved : boolean = false;
  farmerRecords : FarmerRecord[];
  approvedRecords : FarmerRecord[];
  LnRecId : string;
  fetchComplete : boolean = false;
  noSearchResults : boolean = false;
  isRecordApproved:boolean= false;
  isRecordRejected:boolean=false;
  isApproveBtnReq:boolean=false;
  isRejectBtnReq:boolean=false;
  constructor(private manageFarmerRecordService : ManageFarmerRecordService,private verifyFarmerRecordsService: VerifyFarmerRecordService, private apiService: ApiService,private nurserySurveyData : NurserySurveyDataService) {
   }

  ngOnInit() {
    this.nurserySurveyData.currentData.subscribe(records => this.farmerRecords = records);
    if(this.farmerRecords!=null && this.farmerRecords.length > 0){
               this.fetchComplete = true;
               this.noSearchResults= false;
			   //console.log("inside OnInit function");
			    //console.log("isFarmerRecApproved from farmerRecords :" + this.farmerRecords.isFarmerRecApproved);
				// console.log("isFarmerRecApproved from approvedRecords:" + this.approvedRecords.isFarmerRecApproved);
			 //  this.isFormApproved = this.farmerRecords.isFarmerRecApproved;
    } 
  }

Reject(){
					this.farmerRecords[0].ReqStatus="Rejected";
					//this.farmerRecords[0].ReqStatusCode=2;   // statuscode = 1(submitted), 2(approved), 3(Rejected)
					this.approvedRecords =  this.farmerRecords.filter(
					(rec) => rec.ReqStatus ="Rejected");
					console.log("Approved records are" + this.approvedRecords.length);
					this.manageFarmerRecordService.updateFarmerApprovedOrRejectedRecords(this.approvedRecords)
					.subscribe(
					response => {
					console.log("res received updateFarmerApprovedOrRejectedRecords service" + JSON.stringify(response));
					if (response !=null && response.success) {
						console.log("Successfully updated Approved records in DB");
						this.isFormApproved = true; 
						this.isApproveBtnReq = true;
						this.isRejectBtnReq=false;
						this.isRecordRejected= true;
					}   
					else{
						console.log("Failed in updating records in DB");
						this.isFormApproved = false; 
					}
					});
					//this.isVerified = true;
				
}  

  submitNew(){
        this.farmerRecords = [];
        this.isFormApproved= false;
        this.LnRecId = null;
        this.fetchComplete = false;
  }
// Retrieving farmer applications for provided landRecord ID
  search(){
    console.log("LandRecord Id:" + this.LnRecId);
    this.manageFarmerRecordService.getFarmerRecordsByLndRecId(this.LnRecId)
    .subscribe(
      response => {
            console.log("res received from DB for lanRecord ID" + JSON.stringify(response));
            if (response !=null) {
            
              this.farmerRecords = <FarmerRecord[]> response.farmerRecords;
			  console.log("farmerrecords length is " + this.farmerRecords.length);
			 // console.log("farmerrecords Request Status is " + this.farmerRecords[0].ReqStatus); 
             if(this.farmerRecords!=null && this.farmerRecords.length > 0 ){
               this.noSearchResults= false;
				if(this.farmerRecords[0].ReqStatus=="approved" || this.farmerRecords[0].ReqStatus=="UpdatedByInsp"){
					this.isRecordApproved= true;
				}else{
				if(this.farmerRecords[0].ReqStatus=="rejected"){
					this.isRecordRejected=true;
				}
				}
				this.isRejectBtnReq=true;
             }else{
               this.noSearchResults = true;
             }
              this.fetchComplete = true;     
              this.nurserySurveyData.updateData(this.farmerRecords);
            }
          });
  }

 Approve(){
				 console.log("Land record ID is :" + this.LnRecId);
     			this.verifyFarmerRecordsService.VerifyFarmerRecords(this.LnRecId).subscribe(
				response => {
				console.log("res received from DB for lanRecord ID" + JSON.stringify(response));
				if (response !=null && response.success) {
					this.farmerRecords[0].isFarmerRecApproved=true;
					this.farmerRecords[0].ReqStatus="approved";
					//this.farmerRecords[0].ReqStatusCode=2;   // statuscode = 1(submitted), 2(approved), 3(rejected)
					this.approvedRecords =  this.farmerRecords.filter(
					(rec) => rec.isFarmerRecApproved);
					console.log("Approved records are" + this.approvedRecords.length);
					this.manageFarmerRecordService.updateFarmerApprovedOrRejectedRecords(this.approvedRecords)
					.subscribe(
					response => {
					console.log("res received updateFarmerApprovedOrRejectedRecords service" + JSON.stringify(response));
					if (response !=null && response.success) {
						console.log("Successfully updated Approved records in DB");
						this.isFormApproved = true; 
						this.isApproveBtnReq = false;
						this.isRejectBtnReq=true;
						this.isRecordApproved= true;
					}   
					else{
						console.log("Failed in updating records in DB");
						this.isFormApproved = false; 
					}
					});
					//calling chaincode to update
					this.apiService.UpdateFarmerRecordsInChainCd(this.approvedRecords).subscribe(
				response => {
					console.log("res received from DB for lanRecord ID" + JSON.stringify(response));
				});
				}
				}); 

 }
}