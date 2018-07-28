var express = require('express');
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
    kapy.insert(record, id, function(err, doc) {
					if (err) {
						console.log("Error saving record to Kapy" +err);
						res.json({success:false, message: err.toString()});
					}else{
						console.log("success inserting record to Kapy");
						res.json({success : true, message : "Land record added successfully to Kapy"});
						}
										
    });	
});

/* POST API to update approved records in Kapy*/
router.post('/api/updateKapyApprovedStatus', (req, res) => {
  console.log('Inside Express api to update new land record');
  var records = req.body; //Array of farmer records
  console.log("list of documents" + JSON.stringify(records));
  var documentIdsAdded = [];
  kapy.find({selector:{LnRecId:records[0].LnRecId}}, function(er, result) {
	  if (er) {
		console.log("Error finding documents");
	  }
	  console.log('Found documents with LnRecId '+ records[0].LnRecId +":"+ result.docs.length);
	  for (var i = 0; i < result.docs.length; i++) {
		console.log('Doc id:'+ result.docs[i].id);
		records[i]["_id"] = result.docs[i]["_id"];
		records[i]["_rev"] = result.docs[i]["_rev"];
        documentIdsAdded.push(result.docs[i].eid);
		}
		 var TradeReq = {
                   
  "$class": "org.kapy.paymentnetwork.Commodity",
  "tradingSymbol": "176502",
  "description": "testing",
  "mainExchange": "ledger",
  "quantity": 4,
  "owner": "resource:org.kapy.paymentnetwork.Trader#3201"

}
console.log("Owner request body :" +JSON.stringify(TradeReq));

requestify.request('http://ec2-52-90-144-179.compute-1.amazonaws.com:3000/api/Commodity', {
method: 'POST',
body: TradeReq ,
dataType: 'json' 
})
.then(function(response) {
// get the code
var statusCode = response.getCode();  
    console.log("Update land record Fabric Response code : " + code);
console.log(response.getBody());
              
});
		  kapy.bulk({docs : records}, function(err, doc) {
					if (err) {
						console.log("Error updating records to Kapy" +err);
						res.json({success : false, message : err+""});
					} else{
						console.log("success saving records to Kapy");
				       res.json({success : true, documentIdsAdded : documentIdsAdded});
					}				
				});	

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