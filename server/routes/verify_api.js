var express = require('express');
var router = express.Router();
var Cloudant = require('@cloudant/cloudant');
var cloudant = Cloudant(process.env.CLOUDANT_DB_URL);
//connect to Registered farmer DB for verification.
var verifyRec = cloudant.use(process.env.VERIFYRECORD_DB);

  //create index on verifyRecord db if not existing
  var user = {name:'LnRecId', type:'json', index:{fields:['LnRecId']}};
	verifyRec.index(user, function(er, response) {
	  if (er) {
		console.log("Error creating index on LnRecId:"+ er);
	  }else{
		console.log('Index creation result on LnRecId :'+ response.result);
	  }
	});

/* GET API to  verify is the request from registered farmer*/
router.get('/api/recordVerification/:id', (req, res) => {
  console.log('Inside Express api to verify farmer records');
verifyRec.find({selector:{LnRecId:req.params.id}}, function(er, result) {
	  if (er) {
		console.log("Error finding documents");
		res.json({success : false,message:"Error finding documents",farmerRecords:null});
	  }
	  if(result && result.docs){
	  console.log('Found documents with LnRecId count: '+ req.params.id +":"+ result.docs.length);
/* 	  for (var i = 0; i < result.docs.length; i++) {
		console.log('Doc:'+ JSON.stringify(result.docs[i]));
	  } */
	  }
	  //check for authentication
	  if(result && result.docs && result.docs.length > 0){
	   var userInfoDB = result.docs[0];
		if(userInfoDB.LnRecId == req.params.id){
			console.log("Registered User !");
		      res.json({success : true, message:"Request recivied for Registered Farmer"});
		}else{
			 res.json({success : true, message:"Request recivied for UnRegistered Farmer"});
		}
	  }else{
			res.json({success : true, message:"Request recivied for unknown Farmer"});
	  }
	  
	
	});
});	
	
module.exports = router;