var express = require('express');
var requestify = require('requestify'); 
var router = express.Router();
require('dotenv').load();
var Cloudant = require('@cloudant/cloudant');
var cloudant = Cloudant(process.env.CLOUDANT_DB_URL);
//create the document in the db if not available
cloudant.db.create(process.env.KAPY_DB, function(err) {
        if (err) {
            console.log('Could not create new db: ' + process.env.KAPY_DB + ', it might already exist.');
        }
		else{
			  console.log('Created new db: ' + process.env.KAPY_DB + ', it might already exist.');
		}
		
});

/*
var dbCredentials = {
    dbName: 'farmerrecords',
	url : "https://adfc60ec-fa4a-46a9-bcf9-e554de84b30b-bluemix:0f130af356c2fcfc117f121fa37673bf41c604165888b98399dfd6bcf62dacaa@adfc60ec-fa4a-46a9-bcf9-e554de84b30b-bluemix.cloudant.com"
};
var cloudant = require('@cloudant/cloudant')(dbCredentials.url);
cloudant.db.create(dbCredentials.dbName, function(err, res) {
        if (err) {
            console.log('Could not create new db: ' + dbCredentials.dbName + ', it might already exist.');
        }
});
	
var kapy = cloudant.use(dbCredentials.dbName);

*/


//connect to KAPY DB
var kapy = cloudant.use(process.env.KAPY_DB);
  
  //create index in db on LnRecId no if not existing
  var LnRecId = {name:'LnRecId', type:'json', index:{fields:['LnRecId']}};
	kapy.index(LnRecId, function(er, response) {
	  if (er) {
		console.log("Error creating index on LnRecId no:"+ er);
		}else{
		console.log('Index creation result on LnRecId:'+ response.result);
	  }
	});
	
	  //create index in db on reqstatus no if not existing
  var ReqStatus = {name:'ReqStatus', type:'json', index:{fields:['ReqStatus']}};
	kapy.index(ReqStatus, function(er, response) {
	  if (er) {
		console.log("Error creating index on ReqStatus no:"+ er);
		 }else{
		console.log('Index creation result on ReqStatus:'+ response.result);
	  }
	});
	
	
  //create index in db on EID if not existing
  var eid = {name:'eid', type:'json', index:{fields:['eid']}};
	kapy.index(eid, function(er, response) {
	  if (er) {
		console.log("Error creating index on eid:"+ er);
	  }else{
		console.log('Index creation result on eid:'+ response.result);
	  }
	});

/* POST API to create a new farmer record in KAPY*/
router.post('/api/addFarmerRecordKapy', (req, res) => {
  console.log('Inside Express api to add new farmer record');
  console.log("Received EID: " + req.body.eid);
  var record = req.body;
  var id = req.body.eid;
  var statusCode=0;
  console.log("req.body.bank.AcNo: " + req.body.bankDetails.AcNo);
  var FarmerReq = {
 
  "$class": "org.kapy.payments.LandRecord",
  "eid": req.body.eid,
  "LnRecId": req.body.LnRecId,
  "NoSeedReq": req.body.NoSeedReq,
  "SubmittedDate": req.body.SubmittedDt,
  "BankDetails": req.body.bankDetails.AcNo,
  "isFarmerRecApproved": false,
  "inspectionCompletedForYear": 0,
  "NoSeedSurvForYear": 0,
  "AmountProcessed": 0,
  "SeedlingPrice":0,
  "ownerEntity": "FarmerAgent"
}

console.log("Farmer request body :" +JSON.stringify(FarmerReq));

requestify.request('http://ec2-52-90-144-179.compute-1.amazonaws.com:3000/api/LandRecord', {
method: 'POST',
body: FarmerReq ,
dataType: 'json' 
})
.then(function(response) {
// get the code
statusCode = response.getCode();  
    console.log("statusCode from hyperledger composer is : " + statusCode);
console.log(response.getBody());           
});
	if(statusCode=200){
	console.log("indide if with status code 200");
    kapy.insert(record, id, function(err, doc) {
					if (err) {
						console.log("Error saving record to Kapy" +err);
						res.json({success:false, message: err.toString()});
					}else{
						console.log("success inserting record to Kapy");
						res.json({success : true, message : "Land record added successfully to Kapy"});
						}
										
    });	
	}
	else{
		res.json({success : false, message : "Failed to update in HyperLedger"});
	}
});

/* POST API to update approved records in Kapy*/
router.post('/api/updateKapyApprovedStatus', (req, res) => {
  console.log('Inside Express api to update new land record');
  var records = req.body; //Array of farmer records
  console.log("list of documents" + JSON.stringify(records));
  var documentIdsAdded = [];
  var statusCodeNur=0;
  var statusCodeVer=0; 
  var Status = "Approved";
  kapy.find({selector:{LnRecId:records[0].LnRecId}}, function(er, result) {
	  if (er) {
		console.log("Error finding documents");
	  }
	  console.log('Found documents with LnRecId '+ records[0].LnRecId +":"+ result.docs.length);
	  for (var i = 0; i < result.docs.length; i++) {
		records[i]["_id"] = result.docs[i]["_id"];
		records[i]["_rev"] = result.docs[i]["_rev"];
        documentIdsAdded.push(result.docs[i].eid);
		if(result.docs[i].isFarmerRecApproved = true){
			Status= "Approved";
		}else{
			Status= "Rejected";
		}
		var NurseryReq= {
		  "$class": "org.kapy.payments.Nursery",
		  "nurseryRecordsId": "N"+result.docs[i].eid,
		  "status": Status,
		  "landrecord": "resource:org.kapy.payments.LandRecord#"+result.docs[i].eid,
		  "ownerEntity": "NurseryAdmin"
		}
		
		console.log("NurseryReq request body :" +JSON.stringify(NurseryReq));

requestify.request('http://ec2-52-90-144-179.compute-1.amazonaws.com:3000/api/Nursery', {
method: 'POST',
body: NurseryReq ,
dataType: 'json' 
})
.then(function(response) {
// get the code
statusCodeNur = response.getCode();  
    console.log("Update land record Fabric Response code : " + statusCodeNur);
console.log(response.getBody());
              
});
	
	if(statusCodeNur=200){
		var VerificationReq = {               
		  "$class": "org.kapy.payments.Verification",
		  "landrecord": "resource:org.kapy.payments.LandRecord#"+result.docs[i].eid,
		  "nursery": "resource:org.kapy.payments.Nursery#"+"N"+result.docs[i].eid
		}
		console.log("VerificationReq request body :" +JSON.stringify(VerificationReq));

		requestify.request('http://ec2-52-90-144-179.compute-1.amazonaws.com:3000/api/Verification', {
		method: 'POST',
		body: VerificationReq ,
		dataType: 'json' 
		})
		.then(function(response) {
		// get the code
		statusCodeVer = response.getCode();  
			console.log("Update land record Fabric Response code : " + statusCodeVer);
		console.log(response.getBody());
					  
		});

		if(statusCodeVer=200){
			  kapy.bulk({docs : records}, function(err, doc) {
						if (err) {
							console.log("Error updating records to Kapy" +err);
							res.json({success : false, message : err+""});
						} else{
							console.log("success saving records to Kapy");
						   res.json({success : true, documentIdsAdded : documentIdsAdded});
						}				
					});	

		
		}else{
			res.json({success : false, message : "Failed to update Verification transaction in HyperLedger"});
		}
	}else{
		res.json({success : false, message : "Failed to update Nursery Asset in HyperLedger "});
	}
}
});
}); 



/* POST API to update No of Seeds survived in Kapy*/
router.post('/api/updateNumberOdSeedServiced', (req, res) => {
  console.log('Inside Express api to update new land record');
  var records = req.body; //Array of farmer records
  console.log("list of documents" + JSON.stringify(records));
  var documentIdsAdded = [];
  var statusCodeGOK=0;
  var statusCodeMonitoring=0; 
  kapy.find({selector:{LnRecId:records[0].LnRecId}}, function(er, result) {
	  if (er) {
		console.log("Error finding documents");
	  }
	  console.log('Found documents with LnRecId '+ records[0].LnRecId +":"+ result.docs.length);
	  for (var i = 0; i < result.docs.length; i++) {
		//records[i]["_id"] = result.docs[i]["_id"];
		//records[i]["_rev"] = result.docs[i]["_rev"];
        documentIdsAdded.push(result.docs[i].eid);
		
		var GoKReq= {
		    "$class": "org.kapy.payments.GoK",
			"GoKRecordsId": "I"+result.docs[i].eid,
			"inspectionCompletedForYear": result.docs[i].inspectionCompletedForYear,
			"NoSeedSurvForYear": result.docs[i].NoSeedSurved,
			"landrecord": "resource:org.kapy.payments.LandRecord#"+result.docs[i].eid,
			"ownerEntity": "InspectionOfficer"
		}
		
		console.log("GoKReq request body :" +JSON.stringify(GoKReq));

requestify.request('http://ec2-52-90-144-179.compute-1.amazonaws.com:3000/api/GoK', {
method: 'POST',
body: GoKReq ,
dataType: 'json' 
})
.then(function(response) {
// get the code
statusCodeGOK = response.getCode();  
    console.log("Update land record Fabric Response code : " + statusCodeGOK);
console.log(response.getBody());
              
});
	
	if(statusCodeGOK=200){
		var MonitoringReq = {   
		  "$class": "org.kapy.payments.Monitoring",
		  "landrecord": "resource:org.kapy.payments.LandRecord#"+result.docs[i].eid,
		  "gok": "resource:org.kapy.payments.GoK#I"+result.docs[i].eid
		}
		console.log("MonitoringReq request body :" +JSON.stringify(MonitoringReq));

		requestify.request('http://ec2-52-90-144-179.compute-1.amazonaws.com:3000/api/Monitoring', {
		method: 'POST',
		body: MonitoringReq ,
		dataType: 'json' 
		})
		.then(function(response) {
		// get the code
		statusCodeMonitoring = response.getCode();  
			console.log("Update land record Fabric Response code : " + statusCodeMonitoring);
		console.log(response.getBody());
					  
		});

		if(statusCodeMonitoring=200){
			  kapy.bulk({docs : records}, function(err, doc) {
						if (err) {
							console.log("Error updating records to Kapy" +err);
							res.json({success : false, message : err+""});
						} else{
							console.log("success saving records to Kapy");
						   res.json({success : true, documentIdsAdded : documentIdsAdded});
						}				
					});	

		
		}else{
			res.json({success : false, message : "Failed to update Monitoring transaction in HyperLedger"});
		}
	}else{
		res.json({success : false, message : "Failed to update Gok Asset in HyperLedger "});
	}
}
});
}); 

/* GET API to get farmer records from KAPY using EID*/
router.get('/api/getFarmerRecordsByEid/:id', (req, res) => {
  console.log('Inside Express api to get farmer records by eid');
kapy.find({selector:{eid:Number(req.params.id)}}, function(er, result) {
	  if (er) {
		console.log("Error finding documents");
		res.json({success : false,message:"Error finding documents",farmerRecords:null});
	  }
	  console.log('Found documents with EID count:'+ req.params.id +":"+ result.docs.length);
/* 	  for (var i = 0; i < result.docs.length; i++) {
		console.log('Doc:'+ JSON.stringify(result.docs[i]));
	  } */  
	  if(result.docs.length > 0)
			res.json({success : true, message:"Found "+result.docs.length+" documents", farmerRecords:result.docs[0]});
		else
			res.json({success : true, message:"Found "+result.docs.length+" documents", farmerRecords:{}});
	});
});

/* GET API to get farmer records from KAPY using FarmerRecord ID*/
router.get('/api/getFarmerRecordsByLndRecId/:id', (req, res) => {
  console.log('Inside Express api to get farmer records');
kapy.find({selector:{LnRecId:req.params.id}}, function(er, result) {
	  if (er) {
		console.log("Error finding documents");
		res.json({success : false,message:"Error finding documents",farmerRecords:null});
	  }
	  console.log('Found documents with LnRecId count: '+ req.params.id +":"+ result.docs.length);
/* 	  for (var i = 0; i < result.docs.length; i++) {
		console.log('Doc:'+ JSON.stringify(result.docs[i]));
	  } */
	  res.json({success : true, message:"Found "+result.docs.length+" documents", farmerRecords:result.docs});
	});
});

/* GET API to get farmer records from KAPY using EID*/
router.get('/api/getFarmerRecordsByReqStatus/:id', (req, res) => {
  console.log('Inside Express api to get farmer records by ReqStatus');
kapy.find({selector:{ReqStatus:req.params.id}}, function(er, result) {
	  if (er) {
		console.log("Error finding documents for ReqStatus");
		res.json({success : false,message:"Error finding documents",farmerRecords:null});
	  }
	  console.log('Found documents with ReqStatus count:'+req.params.id +":"+ result.docs.length);
/* 	  for (var i = 0; i < result.docs.length; i++) {
		console.log('Doc:'+ JSON.stringify(result.docs[i]));
	  } */
	  
	  if(result.docs.length > 0)
			res.json({success : true, message:"Found "+result.docs.length+" documents", farmerRecords:result.docs});
		else
			res.json({success : true, message:"Found "+result.docs.length+" documents", farmerRecords:{}});
	});
});

 var NoOfDays= function days_between(date1, date2) {

    // The number of milliseconds in one day
    var ONE_DAY = 1000 * 60 * 60 * 24

    // Convert both dates to milliseconds
    var date1_ms = date1.getTime()
    var date2_ms = date2.getTime()

    // Calculate the difference in milliseconds
    var difference_ms = Math.abs(date1_ms - date2_ms)

    // Convert back to days and return
    return Math.round(difference_ms/ONE_DAY)

}
exports.NoOfDays = NoOfDays;
module.exports = router;
